import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { fetchAgents, getErrorMessage } from '../../api';
import { DepositPoint } from '../../types/user';

export default function AgentListingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const [filter, setFilter] = useState('all');
  const [agents, setAgents] = useState<DepositPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, [filter]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {
        limit: 100,
        sortBy: 'rating',
      };

      if (filter === 'open' || filter === 'busy' || filter === 'closed') {
        filters.status = filter;
      }

      const data = await fetchAgents(filters);
      setAgents(data);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('Error loading agents:', message);
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAgents();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Nearby Agents</Text>
          <TouchableOpacity onPress={() => router.push('/(user)/map-view')}>
            <Icon name="map" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Open" active={filter === 'open'} onPress={() => setFilter('open')} />
          <FilterChip label="Cash In" active={filter === 'cashin'} onPress={() => setFilter('cashin')} />
          <FilterChip label="Cash Out" active={filter === 'cashout'} onPress={() => setFilter('cashout')} />
        </View>

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors['error-container'] }]}>
            <Icon name="error" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors['on-error-container'] }]}>{error}</Text>
            <TouchableOpacity onPress={loadAgents}>
              <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Agent List */}
        <FlatList
          data={agents}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="store" size={64} color={colors['on-surface-variant']} />
              <Text style={[styles.emptyText, { color: colors['on-surface-variant'] }]}>
                No agents found
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.agentCard, { backgroundColor: colors['surface-container-lowest'] }]}
              onPress={() => router.push(`/(user)/agent-details?id=${item.id}`)}
            >
              <View style={styles.agentHeader}>
                <View style={[styles.agentIcon, { backgroundColor: colors['primary-fixed'] }]}>
                  <Icon name="store" size={28} color={colors.primary} />
                </View>
                <View style={styles.agentInfo}>
                  <Text style={[styles.agentName, { color: colors['on-surface'] }]}>{item.name}</Text>
                  <View style={styles.agentMeta}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={[styles.ratingText, { color: colors['on-surface-variant'] }]}>{item.rating}</Text>
                    <Text style={[styles.metaText, { color: colors['on-surface-variant'] }]}>•</Text>
                    <Icon name="location-on" size={14} color={colors['on-surface-variant']} />
                    <Text style={[styles.metaText, { color: colors['on-surface-variant'] }]}>
                      {item.distance ? `${item.distance.toFixed(1)} km` : 'N/A'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: item.status === 'open' ? '#10B981' : item.status === 'busy' ? '#F59E0B' : colors['surface-container-highest'] 
                }]}>
                  <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.servicesContainer}>
                {item.services.slice(0, 3).map((service, index) => (
                  <View key={index} style={[styles.serviceTag, { backgroundColor: colors['surface-container-high'] }]}>
                    <Text style={[styles.serviceText, { color: colors['on-surface-variant'] }]}>{service}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={[styles.directionsButton, { backgroundColor: colors['surface-container-high'] }]}>
                  <Icon name="directions" size={18} color={colors['on-surface-variant']} />
                  <Text style={[styles.directionsText, { color: colors['on-surface-variant'] }]}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.contactButton, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.contactText, { color: colors['on-primary'] }]}>Contact</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenContainer>
  );
}

function FilterChip({ label, active, onPress }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      style={[styles.filterChip, active ? styles.filterChipActive : null, { 
        backgroundColor: active ? colors.primary : colors['surface-container-high'],
        borderColor: colors.outline 
      }]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, { color: active ? colors['on-primary'] : colors['on-surface-variant'] }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    // Background and border set dynamically
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  agentCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  agentIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  agentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  serviceTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  serviceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  directionsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  contactButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  contactText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
