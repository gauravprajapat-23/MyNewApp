import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchAgentById, getErrorMessage } from '../../api';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Icon } from '../../components/ui/Icon';
import { DepositPointCard } from '../../components/user/DepositPointCard';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../hooks/useTheme';
import { DepositPoint } from '../../types/user';

export default function FavoritesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { favorites, removeFavorite, isFavorite, isGuest, userId } = useUser();

  const [favoriteAgents, setFavoriteAgents] = useState<DepositPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      // Fetch agent details for each favorite ID
      const favAgents: DepositPoint[] = [];
      
      for (const agentId of favorites) {
        try {
          const agent = await fetchAgentById(agentId);
          favAgents.push(agent);
        } catch (err) {
          console.warn(`Could not load agent ${agentId}:`, getErrorMessage(err));
        }
      }
      
      setFavoriteAgents(favAgents);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = async (agentId: string) => {
    await removeFavorite(agentId);
    // Update local state immediately
    setFavoriteAgents(prev => prev.filter(agent => agent.id !== agentId));
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Loading favorites...
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
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Saved Deposit Points</Text>
          <View style={{ width: 24 }} />
        </View>

        {favoriteAgents.length > 0 ? (
          <>
            <Text style={[styles.subtitle, { color: colors['on-surface-variant'] }]}>
              {favoriteAgents.length} location{favoriteAgents.length > 1 ? 's' : ''} saved
            </Text>

            <FlatList
              data={favoriteAgents}
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
              renderItem={({ item }) => (
                <DepositPointCard
                  agent={item}
                  isFavorite={true}
                  showFavoriteButton
                  onFavorite={() => handleRemoveFavorite(item.id)}
                  onPress={() => router.push(`/(user)/agent-details?id=${item.id}`)}
                />
              )}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Icon name="favorite-border" size={80} color={colors['on-surface-variant']} />
            <Text style={[styles.emptyTitle, { color: colors['on-surface'] }]}>No favorites yet</Text>
            <Text style={[styles.emptyText, { color: colors['on-surface-variant'] }]}>
              Tap the heart icon on any deposit point to save it here for quick access
            </Text>
            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(user)/explore')}
            >
              <Icon name="search" size={20} color={colors['on-primary']} />
              <Text style={[styles.exploreButtonText, { color: colors['on-primary'] }]}>Explore Deposit Points</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Login Banner */}
        {isGuest && (
          <View style={[styles.loginBanner, { backgroundColor: colors['primary-fixed'] }]}>
            <Icon name="cloud" size={20} color={colors['on-primary-fixed']} />
            <View style={styles.bannerContent}>
              <Text style={[styles.bannerTitle, { color: colors['on-primary-fixed'] }]}>
                Sync Across Devices
              </Text>
              <Text style={[styles.bannerText, { color: colors['on-primary-fixed-variant'] }]}>
                Create an account to save your favorites permanently
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.bannerButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(auth)/welcome')}
            >
              <Text style={[styles.bannerButtonText, { color: colors['on-primary'] }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScreenContainer>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  loginBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  bannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bannerButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
