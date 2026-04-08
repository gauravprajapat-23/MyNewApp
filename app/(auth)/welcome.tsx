import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <ScreenContainer withScroll>
      <View style={styles.container}>
        {/* Illustration Section */}
        <View style={styles.illustrationSection}>
          <View style={styles.imageContainer}>
            <View style={[styles.decorativeBox1, { backgroundColor: colors['primary-fixed'] }]} />
            <View style={[styles.decorativeBox2, { backgroundColor: colors['secondary-fixed'] }]} />
            <View style={[styles.imagePlaceholder, { backgroundColor: colors['surface-container-lowest'] }]}>
              <Icon name="store" size={80} color={colors.primary} />
            </View>
          </View>

          {/* Value Prop Cards */}
          <View style={styles.valueProps}>
            <View style={[styles.valueCard, { backgroundColor: colors['surface-container-low'] }]}>
              <Icon name="payments" size={32} color={colors.primary} />
              <Text style={[styles.valueTitle, { color: colors['on-surface'] }]}>Easy Cash-In</Text>
              <Text style={[styles.valueText, { color: colors['on-surface-variant'] }]}>
                Process digital deposits instantly
              </Text>
            </View>
            <View style={[styles.valueCard, styles.valueCardOffset, { backgroundColor: colors['primary-fixed'] }]}>
              <Icon name="storefront" size={32} color={colors['on-primary-fixed']} />
              <Text style={[styles.valueTitle, { color: colors['on-primary-fixed'] }]}>Grow Business</Text>
              <Text style={[styles.valueText, { color: colors['on-primary-fixed-variant'] }]}>
                Earn commission on transactions
              </Text>
            </View>
          </View>
        </View>

        {/* Content & Actions */}
        <View style={styles.content}>
          <View style={styles.badge}>
            <View style={[styles.badgeDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.badgeText, { color: colors['on-secondary-fixed'] }]}>Now Live in Your City</Text>
          </View>

          <Text style={[styles.headline, { color: colors['on-surface'] }]}>
            Empower Your <Text style={{ color: colors.primary }}>Shop</Text> With Digital Cash
          </Text>
          
          <Text style={[styles.description, { color: colors['on-surface-variant'] }]}>
            Join thousands of merchants turning their physical storefronts into high-earning digital banking hubs.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={[styles.primaryButtonText, { color: colors['on-primary'] }]}>Login as Agent</Text>
              <Icon name="arrow-forward" size={20} color={colors['on-primary']} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: colors['primary-fixed'] }]}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={[styles.secondaryButtonText, { color: colors['on-primary-fixed'] }]}>Register Your Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustSection}>
            <Text style={[styles.trustLabel, { color: colors['on-surface-variant'] }]}>Trusted By Retailers</Text>
            <View style={styles.trustBadges}>
              <View style={styles.trustBadge}>
                <Icon name="security" size={20} color={colors['on-surface-variant']} />
                <Text style={[styles.trustBadgeText, { color: colors['on-surface'] }]}>SecurePay</Text>
              </View>
              <View style={styles.trustBadge}>
                <Icon name="account-balance" size={20} color={colors['on-surface-variant']} />
                <Text style={[styles.trustBadgeText, { color: colors['on-surface'] }]}>BankTrust</Text>
              </View>
              <View style={styles.trustBadge}>
                <Icon name="verified" size={20} color={colors['on-surface-variant']} />
                <Text style={[styles.trustBadgeText, { color: colors['on-surface'] }]}>Regulated</Text>
              </View>
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
  illustrationSection: {
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
  },
  decorativeBox1: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: 96,
    height: 96,
    borderRadius: 16,
    opacity: 0.5,
    zIndex: 0,
  },
  decorativeBox2: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    width: 128,
    height: 128,
    borderRadius: 64,
    opacity: 0.3,
    zIndex: 0,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  valueProps: {
    flexDirection: 'row',
    gap: 16,
  },
  valueCard: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    gap: 8,
  },
  valueCardOffset: {
    marginTop: 32,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '400',
  },
  content: {
    gap: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#ffdcc3',
    alignSelf: 'flex-start',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headline: {
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 48,
    letterSpacing: -1,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    borderRadius: 24,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  trustSection: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 191, 176, 0.2)',
    gap: 24,
  },
  trustLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  trustBadges: {
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'center',
    opacity: 0.6,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustBadgeText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
