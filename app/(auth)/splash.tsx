import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../contexts/UserContext';
import { Icon } from '../../components/ui/Icon';

export default function SplashScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { isGuest, userId } = useUser();

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (!isGuest && userId) {
      // User is logged in - auto redirect to dashboard after 2 seconds
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isGuest, userId]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors['primary-container']]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Logo Section */}
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Icon name="payments" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>CashPoint Agent</Text>
            <Text style={styles.subtitle}>
              Grow your shop. Offer cash services.
            </Text>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresCard}>
            <View style={styles.featuresGrid}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Icon name="account-balance-wallet" size={24} color="#fff" />
                </View>
                <Text style={styles.featureText}>Cash In/Out</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Icon name="receipt-long" size={24} color="#fff" />
                </View>
                <Text style={styles.featureText}>Bill Payments</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Icon name="trending-up" size={24} color="#fff" />
                </View>
                <Text style={styles.featureText}>Earn Commission</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Icon name="shield" size={24} color="#fff" />
                </View>
                <Text style={styles.featureText}>Secure Ledger</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/welcome')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryButtonText}>Log In to Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tertiaryButton}
              onPress={() => router.push('/(user)/explore')}
            >
              <Icon name="search" size={18} color="#fff" />
              <Text style={styles.tertiaryButtonText}>Find Deposit Points (Guest)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>v2.4.0 • Authorized Partner</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffdbcc',
    fontWeight: '500',
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 32,
    marginBottom: 48,
    width: '100%',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  feature: {
    alignItems: 'center',
    width: '40%',
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a04100',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tertiaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tertiaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
