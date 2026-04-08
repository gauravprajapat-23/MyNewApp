import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { fetchNearbyAgents, getErrorMessage } from '../../api';
import { DepositPoint } from '../../types/user';
import { useUser } from '../../contexts/UserContext';
import { useLocation } from '../../contexts/LocationContext';

export default function MapViewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { isFavorite, addFavorite, removeFavorite } = useUser();
  const { location, isLoading: locationLoading, error: locationError, requestPermission, getCurrentLocation } = useLocation();

  const [agents, setAgents] = useState<DepositPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      loadNearbyAgents();
    }
  }, [location]);

  const loadNearbyAgents = async () => {
    if (!location) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchNearbyAgents(
        location.latitude,
        location.longitude,
        10 // 10km radius
      );
      setAgents(data);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('Error loading nearby agents:', message);
      setError('Failed to load nearby agents');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationRefresh = async () => {
    await requestPermission();
    await getCurrentLocation();
    await loadNearbyAgents();
  };

  const handleMarkerPress = (agentId: string) => {
    router.push(`/(user)/agent-details?id=${agentId}`);
  };

  const openCount = agents.filter(a => a.status === 'open').length;
  const busyCount = agents.filter(a => a.status === 'busy').length;
  const closedCount = agents.filter(a => a.status === 'closed').length;

  // Create map markers for agents
  const markers = useMemo(() => {
    return agents.map(agent => ({
      id: agent.id,
      coordinate: {
        latitude: agent.latitude,
        longitude: agent.longitude,
      },
      title: agent.name,
      description: `${agent.type} • ${agent.rating}★`,
      color: agent.status === 'open' ? '#10B981' : agent.status === 'busy' ? '#F59E0B' : '#9CA3AF',
    }));
  }, [agents]);

  if (loading || locationLoading || !location) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            {locationLoading ? 'Getting your location...' : 'Loading map...'}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Map View */}
        <View style={styles.mapContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="error" size={64} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              <TouchableOpacity 
                style={[styles.retryButton, { backgroundColor: colors.primary }]}
                onPress={loadNearbyAgents}
              >
                <Text style={[styles.retryText, { color: colors['on-primary'] }]}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={location}
              showsUserLocation
              showsMyLocationButton
            >
              {markers.map(marker => (
                <Marker
                  key={marker.id}
                  coordinate={marker.coordinate}
                  title={marker.title}
                  description={marker.description}
                  pinColor={marker.color}
                  onPress={() => handleMarkerPress(marker.id)}
                />
              ))}
            </MapView>
          )}

          {/* Overlay Controls */}
          <View style={styles.overlay}>
            <TouchableOpacity
              style={[styles.overlayButton, { backgroundColor: colors['surface-container-lowest'] }]}
              onPress={() => router.back()}
            >
              <Icon name="list" size={20} color={colors['on-surface']} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.overlayButton, { backgroundColor: colors['surface-container-lowest'] }]}
              onPress={handleLocationRefresh}
            >
              <Icon name="my-location" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Info Card */}
        <View style={styles.bottomCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>
              {agents.length} Deposit Points Nearby
            </Text>
            <TouchableOpacity onPress={() => router.push('/(user)/explore')}>
              <Text style={[styles.listViewText, { color: colors.primary }]}>View List</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: colors['on-surface-variant'] }]}>
                Open ({openCount})
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: colors['on-surface-variant'] }]}>
                Busy ({busyCount})
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors['surface-container-highest'] }]} />
              <Text style={[styles.legendText, { color: colors['on-surface-variant'] }]}>
                Closed ({closedCount})
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 12,
  },
  overlayButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomCard: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 191, 176, 0.2)',
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listViewText: {
    fontSize: 14,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
