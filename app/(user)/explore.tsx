import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchNearbyAgents, getErrorMessage, searchAgentsApi } from '../../api';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { FilterChip } from '../../components/ui/FilterChip';
import { Icon } from '../../components/ui/Icon';
import { SearchBar } from '../../components/ui/SearchBar';
import { DepositPointCard } from '../../components/user/DepositPointCard';
import { useLocation } from '../../contexts/LocationContext';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../hooks/useTheme';
import { DepositPoint } from '../../types/user';
import { applyFilters } from '../../utils/filtering';

const ALL_SERVICES = ['Cash In', 'Cash Out', 'AEPS', 'UPI', 'Bill Payments', 'DMT'];

export default function ExploreScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { favorites, addFavorite, removeFavorite, isFavorite } = useUser();
  const { location, isLoading: locationLoading, requestPermission } = useLocation();

  const [agents, setAgents] = useState<DepositPoint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'commission'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load agents on mount
  useEffect(() => {
    console.log('[Explore] Location changed:', !!location);
    if (location) {
      loadAgents();
    }
  }, [location]);

  const loadAgents = async () => {
    if (!location) {
      console.log('[Explore] No location, skipping load');
      return;
    }

    try {
      console.log('[Explore] Loading agents...', {
        lat: location.latitude,
        lng: location.longitude,
      });
      setLoading(true);
      setError(null);
      const data = await fetchNearbyAgents(
        location.latitude,
        location.longitude,
        10 // 10km radius
      );
      console.log('[Explore] Agents loaded:', data.length);
      setAgents(data);
      if (data.length === 0) {
        console.log('[Explore] No agents found');
        setError('No agents found in your area.');
      }
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('[Explore] Error loading agents:', message, err);
      setError('Failed to connect to server. Please check your internet connection.');
      setAgents([]);
    } finally {
      console.log('[Explore] Load complete');
      setLoading(false);
    }
  };

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await requestPermission();
    await loadAgents();
    setRefreshing(false);
  }, [location]);

  // Handle search with API
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      try {
        const results = await searchAgentsApi(query);
        setAgents(results);
        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        // Keep current agents if search fails
      }
    } else if (query.length === 0) {
      loadAgents(); // Reload all if search cleared
    }
  };

  // Apply filters locally (faster UX)
  const filteredAgents = useMemo(() => {
    return applyFilters(agents, {
      services: activeFilters,
      status: null,
      maxDistance: 0,
      sortBy,
      searchQuery: searchQuery.length <= 2 ? '' : searchQuery, // Only apply if not using API search
    });
  }, [agents, searchQuery, activeFilters, sortBy]);

  const toggleFilter = (service: string) => {
    setActiveFilters(prev =>
      prev.includes(service)
        ? prev.filter(f => f !== service)
        : [...prev, service]
    );
  };

  const toggleFavorite = async (agentId: string) => {
    if (isFavorite(agentId)) {
      await removeFavorite(agentId);
    } else {
      await addFavorite(agentId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Loading deposit points...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon name="arrow-back" size={24} color={colors['on-surface']} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Find Deposit Points</Text>
              <Text style={[styles.headerSubtitle, { color: colors['on-surface-variant'] }]}>
                {filteredAgents.length} locations nearby
                {error && ' • Offline'}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors['surface-container-high'] }]}
              onPress={() => router.push('/(user)/favorites')}
            >
              <Icon name="favorite" size={20} color={colors['on-surface-variant']} />
              {favorites.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.error }]}>
                  <Text style={styles.badgeText}>{favorites.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors['surface-container-high'] }]}
              onPress={() => router.push('/(user)/map-view')}
            >
              <Icon name="map" size={20} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onFilterPress={() => setShowFilters(!showFilters)}
        />

        {/* Error Message */}
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors['error-container'] }]}>
            <Icon name="wifi-off" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors['on-error-container'] }]}>{error}</Text>
          </View>
        )}

        {/* Filter Section */}
        {showFilters && (
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors['on-surface-variant'] }]}>Filter by Services</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {ALL_SERVICES.map(service => (
                  <FilterChip
                    key={service}
                    label={service}
                    active={activeFilters.includes(service)}
                    onPress={() => toggleFilter(service)}
                  />
                ))}
              </View>
            </ScrollView>

            <Text style={[styles.filterLabel, { color: colors['on-surface-variant'], marginTop: 12 }]}>Sort By</Text>
            <View style={styles.sortButtons}>
              <SortButton
                label="Distance"
                icon="near-me"
                active={sortBy === 'distance'}
                onPress={() => setSortBy('distance')}
              />
              <SortButton
                label="Rating"
                icon="star"
                active={sortBy === 'rating'}
                onPress={() => setSortBy('rating')}
              />
              <SortButton
                label="Commission"
                icon="percent"
                active={sortBy === 'commission'}
                onPress={() => setSortBy('commission')}
              />
            </View>
          </View>
        )}

        {/* Results List */}
        <FlatList
          data={filteredAgents}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="search-off" size={64} color={colors['on-surface-variant']} />
              <Text style={[styles.emptyTitle, { color: colors['on-surface'] }]}>No deposit points found</Text>
              <Text style={[styles.emptyText, { color: colors['on-surface-variant'] }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <DepositPointCard
              agent={item}
              isFavorite={isFavorite(item.id)}
              showFavoriteButton
              onFavorite={() => toggleFavorite(item.id)}
              onPress={() => router.push(`/(user)/agent-details?id=${item.id}`)}
            />
          )}
        />

        {/* Login Prompt Banner */}
        <View style={[styles.loginBanner, { backgroundColor: colors['primary-fixed'] }]}>
          <Icon name="info" size={20} color={colors['on-primary-fixed']} />
          <Text style={[styles.bannerText, { color: colors['on-primary-fixed'] }]}>
            Create an account to save favorites and get personalized recommendations
          </Text>
          <TouchableOpacity
            style={[styles.bannerButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/welcome')}
          >
            <Text style={[styles.bannerButtonText, { color: colors['on-primary'] }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

function SortButton({ label, icon, active, onPress }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.sortButton,
        {
          backgroundColor: active ? colors.primary : colors['surface-container-high'],
        },
      ]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={16}
        color={active ? colors['on-primary'] : colors['on-surface-variant']}
      />
      <Text
        style={[
          styles.sortButtonText,
          {
            color: active ? colors['on-primary'] : colors['on-surface-variant'],
          },
        ]}
      >
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
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
  filterSection: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(226, 191, 176, 0.1)',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  loginBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  bannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
