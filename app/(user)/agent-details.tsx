import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../contexts/UserContext';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { mockAgents } from '../../data/mockAgents';
import { fetchAgentById, getErrorMessage } from '../../api';
import { DepositPoint } from '../../types/user';

export default function UserAgentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { isFavorite, addFavorite, removeFavorite } = useUser();

  const [agent, setAgent] = useState<DepositPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgent();
  }, [id]);

  const loadAgent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (typeof id === 'string') {
        const data = await fetchAgentById(id);
        setAgent(data);
      } else {
        throw new Error('Invalid agent ID');
      }
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('Error loading agent:', message);
      setError('Failed to load agent details');
      
      // Fallback to mock data
      const mockAgent = mockAgents.find(a => a.id === id) || mockAgents[0];
      setAgent(mockAgent);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!agent) return;
    
    if (isFavorite(agent.id)) {
      await removeFavorite(agent.id);
    } else {
      await addFavorite(agent.id);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Loading agent details...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!agent) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <Icon name="error" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>Agent not found</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.retryButtonText, { color: colors['on-primary'] }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const isFav = isFavorite(agent.id);

  return (
    <ScreenContainer withScroll>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={[colors.primary, colors['primary-container']]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroHeader}>
              <TouchableOpacity onPress={() => router.back()}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFavorite}>
                <Icon name={isFav ? 'favorite' : 'favorite-border'} size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.heroContent}>
              <View style={[styles.heroIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Icon name="store" size={48} color="#fff" />
              </View>
              <Text style={styles.heroTitle}>{agent.name}</Text>
              <View style={styles.heroMeta}>
                <Icon name="star" size={16} color="#FFC107" />
                <Text style={styles.heroRating}>{agent.rating}</Text>
                <Text style={styles.heroDot}>•</Text>
                <Text style={styles.heroDistance}>{agent.distance} km away</Text>
                <Text style={styles.heroDot}>•</Text>
                <Text style={styles.heroStatus}>{agent.status.toUpperCase()}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Quick Information</Text>
          <View style={[styles.infoCard, { backgroundColor: colors['surface-container-lowest'] }]}>
            <InfoRow icon="schedule" label="Operating Hours" value={agent.operatingHours} />
            <InfoRow icon="phone" label="Contact" value={agent.phone} />
            <InfoRow icon="location-on" label="Address" value={agent.address} />
            <InfoRow icon="percent" label="Commission Rate" value={agent.commission} />
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Available Services</Text>
          <View style={styles.servicesGrid}>
            {agent.services.map((service, index) => (
              <View key={index} style={[styles.serviceCard, { backgroundColor: colors['surface-container-lowest'] }]}>
                <Icon name="check-circle" size={24} color={colors.primary} />
                <Text style={[styles.serviceText, { color: colors['on-surface'] }]}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Reviews</Text>
            <Text style={[styles.reviewsCount, { color: colors['on-surface-variant'] }]}>{agent.reviews} reviews</Text>
          </View>
          <View style={[styles.reviewCard, { backgroundColor: colors['surface-container-lowest'] }]}>
            <View style={styles.reviewHeader}>
              <View style={[styles.reviewerAvatar, { backgroundColor: colors['primary-fixed'] }]}>
                <Text style={[styles.reviewerInitial, { color: colors.primary }]}>JD</Text>
              </View>
              <View style={styles.reviewInfo}>
                <Text style={[styles.reviewerName, { color: colors['on-surface'] }]}>John Doe</Text>
                <View style={styles.reviewRating}>
                  <Icon name="star" size={14} color="#FFC107" />
                  <Text style={[styles.ratingText, { color: colors['on-surface-variant'] }]}>5.0</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.reviewComment, { color: colors['on-surface-variant'] }]}>
              Excellent service! Quick and reliable. Highly recommended for all banking needs.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/(navigation)/directions?lat=${agent.latitude}&lng=${agent.longitude}&name=${agent.name}`)}
          >
            <Icon name="directions" size={20} color={colors['on-primary']} />
            <Text style={[styles.actionButtonText, { color: colors['on-primary'] }]}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors['surface-container-high'] }]}
            onPress={() => router.push(`tel:${agent.phone}`)}
          >
            <Icon name="phone" size={20} color={colors['on-surface']} />
            <Text style={[styles.actionButtonText, { color: colors['on-surface'] }]}>Call Agent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color={colors['on-surface-variant']} />
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors['on-surface-variant'] }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors['on-surface'] }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  heroContainer: {
    marginBottom: 0,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroRating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  heroDot: {
    fontSize: 14,
    color: '#fff',
  },
  heroDistance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  heroStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    fontSize: 16,
    fontWeight: '700',
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reviewComment: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
