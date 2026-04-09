import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchNearbyAgents, getErrorMessage } from '../../api';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Icon } from '../../components/ui/Icon';
import { useLocation } from '../../contexts/LocationContext';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../hooks/useTheme';
import { DepositPoint } from '../../types/user';

// Error Boundary Component
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('[MapView Error Boundary] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[MapView Error Boundary] Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScreenContainer>
          <View style={errorStyles.errorContainer}>
            <Icon name="error" size={80} color="#EF4444" />
            <Text style={errorStyles.errorTitle}>Something went wrong</Text>
            <Text style={errorStyles.errorMessage}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <TouchableOpacity
              style={errorStyles.retryButton}
              onPress={() => {
                console.log('[MapView Error Boundary] Retrying...');
                this.setState({ hasError: false, error: null });
              }}
            >
              <Icon name="refresh" size={20} color="#fff" />
              <Text style={errorStyles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      );
    }

    return this.props.children;
  }
}

export default function MapViewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { location, isLoading: locationLoading, error: locationError, requestPermission, getCurrentLocation } = useLocation();

  return (
    <MapErrorBoundary>
      <MapViewContent
        router={router}
        colors={colors}
        location={location}
        locationLoading={locationLoading}
        locationError={locationError}
        requestPermission={requestPermission}
        getCurrentLocation={getCurrentLocation}
      />
    </MapErrorBoundary>
  );
}

// Separate component for the actual content
function MapViewContent({
  router,
  colors,
  location,
  locationLoading,
  locationError,
  requestPermission,
  getCurrentLocation,
}: {
  router: any;
  colors: any;
  location: any;
  locationLoading: boolean;
  locationError: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}) {
  const { isFavorite, addFavorite, removeFavorite } = useUser();

  const [agents, setAgents] = useState<DepositPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    console.log('[MapView] Component mounted, initializing...');
    initializeMap();
  }, []);

  const initializeMap = async () => {
    console.log('[MapView] Starting initialization...');
    // Request location permission first
    console.log('[MapView] Requesting permission...');
    const granted = await requestPermission();
    console.log('[MapView] Permission granted:', granted);
    setPermissionGranted(granted);
    
    if (granted && location) {
      console.log('[MapView] Loading nearby agents...');
      await loadNearbyAgents();
    } else {
      console.log('[MapView] No permission or location, showing map anyway');
      // Show map even without location or agents
      setLoading(false);
    }
  };

  const loadNearbyAgents = async () => {
    if (!location) {
      console.log('[MapView] No location available, skipping agent load');
      return;
    }

    try {
      console.log('[MapView] Fetching nearby agents...', {
        lat: location.latitude,
        lng: location.longitude,
        radius: 10,
      });
      setLoading(true);
      setError(null);
      
      console.log('[MapView] About to call fetchNearbyAgents API...');
      const data = await fetchNearbyAgents(
        location.latitude,
        location.longitude,
        10 // 10km radius
      );
      
      console.log('[MapView] API call successful, agents loaded:', data.length);
      console.log('[MapView] First agent:', data[0] ? data[0].name : 'None');
      setAgents(data);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('[MapView] Error loading nearby agents:', message, err);
      setError(message);
      setAgents([]);
    } finally {
      console.log('[MapView] Load complete, setting loading to false');
      setLoading(false);
    }
  };

  const handleLocationRefresh = async () => {
    console.log('[MapView] Refreshing location...');
    const granted = await requestPermission();
    setPermissionGranted(granted);
    if (granted) {
      console.log('[MapView] Permission confirmed, loading agents');
      await getCurrentLocation();
      await loadNearbyAgents();
    } else {
      console.warn('[MapView] Permission not granted for refresh');
    }
  };

  const handleRetryLocation = async () => {
    const granted = await requestPermission();
    setPermissionGranted(granted);
    if (granted) {
      await getCurrentLocation();
    }
  };

  const handleMarkerPress = (agentId: string) => {
    console.log('[MapView] Marker pressed:', agentId);
    router.push(`/(user)/agent-details?id=${agentId}`);
  };

  const openCount = agents.filter(a => a.status === 'open').length;
  const busyCount = agents.filter(a => a.status === 'busy').length;
  const closedCount = agents.filter(a => a.status === 'closed').length;

  console.log('[MapView] Agent stats:', { openCount, busyCount, closedCount, total: agents.length });

  // Create map markers for agents
  const markers = useMemo(() => {
    try {
      console.log('[MapView] Creating markers for', agents.length, 'agents');
      const createdMarkers = agents.map((agent, index) => {
        console.log(`[MapView] Creating marker ${index + 1}/${agents.length}:`, agent.name, {
          lat: agent.latitude,
          lng: agent.longitude,
          status: agent.status,
        });
        return {
          id: agent.id,
          coordinate: {
            latitude: agent.latitude,
            longitude: agent.longitude,
          },
          title: agent.name,
          description: `${agent.type} • ${agent.rating}★`,
          color: agent.status === 'open' ? '#10B981' : agent.status === 'busy' ? '#F59E0B' : '#9CA3AF',
        };
      });
      console.log('[MapView] Successfully created', createdMarkers.length, 'markers');
      return createdMarkers;
    } catch (error) {
      console.error('[MapView] Error creating markers:', error);
      throw error;
    }
  }, [agents]);

  // Show loading only during initial permission request
  if (loading && !permissionGranted) {
    console.log('[MapView] Rendering: Loading screen');
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Requesting location permission...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Show permission denied state with option to retry
  if (!permissionGranted && !location) {
    console.log('[MapView] Rendering: Permission denied screen');
    return (
      <ScreenContainer>
        <View style={styles.permissionContainer}>
          <Icon name="location-off" size={80} color={colors['on-surface-variant']} />
          <Text style={[styles.permissionTitle, { color: colors['on-surface'] }]}>
            Location Permission Required
          </Text>
          <Text style={[styles.permissionText, { color: colors['on-surface-variant'] }]}>
            We need your location to show nearby deposit points on the map
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={handleRetryLocation}
          >
            <Icon name="my-location" size={20} color={colors['on-primary']} />
            <Text style={[styles.permissionButtonText, { color: colors['on-primary'] }]}>
              Enable Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.permissionButtonSecondary, { backgroundColor: colors['surface-container-high'] }]}
            onPress={() => {
              setPermissionGranted(true);
              setLoading(false);
            }}
          >
            <Text style={[styles.permissionButtonSecondaryText, { color: colors['on-surface'] }]}>
              Show Map Anyway
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // Default region (Delhi) if location is not available
  const defaultRegion = {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const mapRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: location.latitudeDelta || 0.05,
        longitudeDelta: location.longitudeDelta || 0.05,
      }
    : defaultRegion;

  console.log('[MapView] Rendering: Map screen', {
    hasLocation: !!location,
    permissionGranted,
    agentsCount: agents.length,
    loading,
    error: error,
    markersCount: markers.length,
  });

  try {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          {/* Map View - Always show map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              showsUserLocation={permissionGranted}
              showsMyLocationButton
              showsCompass
              showsScale
              zoomEnabled
              scrollEnabled
              rotateEnabled
              pitchEnabled
            >
              {markers.map((marker, index) => {
                console.log(`[MapView] Rendering marker ${index + 1}/${markers.length}:`, marker.title);
                return (
                  <Marker
                    key={marker.id}
                    coordinate={marker.coordinate}
                    title={marker.title}
                    description={marker.description}
                    pinColor={marker.color}
                    onPress={() => handleMarkerPress(marker.id)}
                  />
                );
              })}
            </MapView>

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

        {/* Error Display */}
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: '#FEE2E2' }]}>
            <Icon name="error" size={20} color="#DC2626" />
            <Text style={[styles.errorBannerText, { color: '#DC2626' }]}>{error}</Text>
            <TouchableOpacity onPress={loadNearbyAgents} style={styles.errorRetryButton}>
              <Text style={styles.errorRetryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Info Card */}
        <View style={styles.bottomCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>
              {error
                ? 'Error Loading Agents'
                : agents.length > 0 
                ? `${agents.length} Deposit Points Nearby` 
                : location 
                  ? 'No Deposit Points Found'
                  : 'Enable Location for Nearby Points'}
            </Text>
            {agents.length > 0 && !error && (
              <TouchableOpacity onPress={() => router.push('/(user)/explore')}>
                <Text style={[styles.listViewText, { color: colors.primary }]}>View List</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {agents.length > 0 && !error && (
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
          )}
        </View>
      </View>
    </ScreenContainer>
    );
  } catch (error) {
    console.error('[MapView] Render error:', error);
    throw error;
  }
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  permissionButtonSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  permissionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  errorRetryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  errorRetryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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

const errorStyles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
