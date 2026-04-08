import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

export default function AgentDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;

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
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={[styles.heroIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Icon name="store" size={48} color="#fff" />
              </View>
              <Text style={styles.heroTitle}>Sharma Kirana Store</Text>
              <View style={styles.heroMeta}>
                <Icon name="star" size={16} color="#FFC107" />
                <Text style={styles.heroRating}>4.8</Text>
                <Text style={styles.heroDistance}>• 0.3 km away</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Shop Information</Text>
          <View style={[styles.infoCard, { backgroundColor: colors['surface-container-lowest'] }]}>
            <InfoRow icon="schedule" label="Open Time" value="09:00 AM - 09:00 PM" />
            <InfoRow icon="phone" label="Contact" value="+91 98765 43210" />
            <InfoRow icon="location-on" label="Address" value="123 Main Street, Market Area" />
            <InfoRow icon="verified" label="Verified" value="Yes, since 2023" />
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Available Services</Text>
          <View style={styles.servicesGrid}>
            <ServiceCard icon="payments" label="Cash Deposit" available />
            <ServiceCard icon="atm" label="Cash Withdrawal" available />
            <ServiceCard icon="fingerprint" label="AEPS" available />
            <ServiceCard icon="qr-code" label="UPI Transfer" unavailable />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
            <Icon name="navigation" size={20} color={colors['on-primary']} />
            <Text style={[styles.actionButtonText, { color: colors['on-primary'] }]}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors['surface-container-high'] }]}>
            <Icon name="call" size={20} color={colors['on-surface']} />
            <Text style={[styles.actionButtonText, { color: colors['on-surface'] }]}>Call Agent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function InfoRow({ icon, label, value }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconContainer, { backgroundColor: colors['primary-fixed'] }]}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors['on-surface-variant'] }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors['on-surface'] }]}>{value}</Text>
      </View>
    </View>
  );
}

function ServiceCard({ icon, label, available }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.serviceCard, { backgroundColor: colors['surface-container-lowest'], opacity: available ? 1 : 0.5 }]}>
      <View style={[styles.serviceIcon, { backgroundColor: colors['primary-fixed'] }]}>
        <Icon name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.serviceLabel, { color: colors['on-surface'] }]}>{label}</Text>
      <Text style={[styles.serviceStatus, { color: available ? colors.primary : colors.error }]}>
        {available ? 'Available' : 'Unavailable'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  hero: {
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  heroContent: {
    alignItems: 'center',
    gap: 12,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroRating: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  heroDistance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    gap: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  serviceStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
