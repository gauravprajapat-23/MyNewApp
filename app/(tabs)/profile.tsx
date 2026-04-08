import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../contexts/UserContext';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { fetchUserById, getErrorMessage } from '../../api';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { isGuest, userId, logoutUser, favorites } = useUser();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const user = await fetchUserById(userId);
      setUserData(user);
    } catch (error) {
      console.error('Error loading user profile:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              router.replace('/(auth)/splash');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
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

  const userName = userData?.full_name || userData?.phone || 'Agent User';
  const agentId = userData?.id ? `CPA-${String(userData.id).padStart(6, '0')}` : 'CPA-000000';

  return (
    <ScreenContainer withScroll>
      <View style={styles.container}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors['surface-container-low'] }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors['surface-container-high'] }]}>
            <Icon name="person" size={64} color={colors['on-surface-variant']} />
          </View>
          <Text style={[styles.profileName, { color: colors['on-surface'] }]}>{userName}</Text>
          <Text style={[styles.profileId, { color: colors['on-surface-variant'] }]}>
            Agent ID: {agentId}
          </Text>
          {isGuest && (
            <TouchableOpacity 
              style={[styles.guestBadge, { backgroundColor: colors['secondary-container'] }]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={[styles.guestText, { color: colors['on-secondary-container'] }]}>
                Tap to Login
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <StatCard label="Favorites" value={String(favorites.length)} />
          <StatCard label="Rating" value="4.9 ★" />
          <StatCard label="Status" value={isGuest ? 'Guest' : 'Active'} />
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          {!isGuest && (
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors['surface-container-lowest'] }]}
              onPress={() => router.push('/(management)/profile')}
            >
              <Icon name="store" size={24} color={colors.primary} />
              <Text style={[styles.menuText, { color: colors['on-surface'] }]}>Manage Shop</Text>
              <Icon name="chevron-right" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors['surface-container-lowest'] }]}
            onPress={() => {}}
          >
            <Icon name="notifications" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors['on-surface'] }]}>Notifications</Text>
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={[styles.badgeText, { color: colors['on-error'] }]}>3</Text>
            </View>
          </TouchableOpacity>

          {!isGuest && (
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors['surface-container-lowest'] }]}
              onPress={() => {}}
            >
              <Icon name="description" size={24} color={colors.primary} />
              <Text style={[styles.menuText, { color: colors['on-surface'] }]}>Documents</Text>
              <Icon name="chevron-right" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors['surface-container-lowest'] }]}
            onPress={() => {}}
          >
            <Icon name="help" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors['on-surface'] }]}>Help & Support</Text>
            <Icon name="chevron-right" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        {!isGuest && (
          <TouchableOpacity 
            style={[styles.signOutButton, { backgroundColor: colors['surface-container-low'] }]}
            onPress={handleSignOut}
          >
            <Icon name="logout" size={20} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
  );
}

function StatCard({ label, value }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.statCard, { backgroundColor: colors['surface-container-lowest'] }]}>
      <Text style={[styles.statValue, { color: colors['on-surface'] }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors['on-surface-variant'] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 24,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  profileId: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  guestBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  guestText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  menuSection: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
