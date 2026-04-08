import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

export default function VerifyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const [services, setServices] = useState({
    cashDeposit: true,
    cashWithdrawal: true,
    aeps: false,
    upi: true,
  });

  const handleContinue = () => {
    router.push('/(tabs)');
  };

  return (
    <ScreenContainer withScroll>
      <View style={styles.container}>
        {/* Progress */}
        <View style={styles.progressHeader}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressTitle, { color: colors.primary }]}>Onboarding</Text>
            <View style={[styles.progressBadge, { backgroundColor: colors['surface-container-high'] }]}>
              <Text style={[styles.progressBadgeText, { color: colors['on-surface-variant'] }]}>Step 3 of 4</Text>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors['surface-container-highest'] }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '75%' }]} />
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Services Offered</Text>
          <Text style={[styles.sectionSubtitle, { color: colors['on-surface-variant'] }]}>
            Select financial products to offer
          </Text>

          <View style={styles.servicesGrid}>
            <ServiceCard
              title="Cash Deposit"
              description="Accept cash deposits into bank accounts"
              icon="payments"
              enabled={services.cashDeposit}
              onToggle={() => setServices({ ...services, cashDeposit: !services.cashDeposit })}
            />
            <ServiceCard
              title="Cash Withdrawal"
              description="Provide cash-out services"
              icon="atm"
              enabled={services.cashWithdrawal}
              onToggle={() => setServices({ ...services, cashWithdrawal: !services.cashWithdrawal })}
            />
            <ServiceCard
              title="AEPS"
              description="Aadhaar Enabled Payment System"
              icon="fingerprint"
              enabled={services.aeps}
              onToggle={() => setServices({ ...services, aeps: !services.aeps })}
            />
            <ServiceCard
              title="UPI Transfer"
              description="Instant wallet-to-bank transfers"
              icon="qr-code-2"
              enabled={services.upi}
              onToggle={() => setServices({ ...services, upi: !services.upi })}
            />
          </View>
        </View>

        {/* Verification Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Identity & Shop Verification</Text>
          <Text style={[styles.sectionSubtitle, { color: colors['on-surface-variant'] }]}>
            Upload clear documents
          </Text>

          <View style={[styles.uploadCard, { backgroundColor: colors['surface-container-low'] }]}>
            <View style={styles.uploadHeader}>
              <View style={[styles.uploadIconContainer, { backgroundColor: colors['secondary-fixed'] }]}>
                <Icon name="badge" size={24} color={colors['on-secondary-container']} />
              </View>
              <View style={styles.uploadInfo}>
                <Text style={[styles.uploadTitle, { color: colors['on-surface'] }]}>ID Proof (Aadhaar/PAN)</Text>
                <Text style={[styles.uploadSubtitle, { color: colors['on-surface-variant'] }]}>Front and Back required</Text>
              </View>
              <View style={styles.uploadBadge}>
                <Icon name="verified-user" size={14} color={colors.primary} />
                <Text style={[styles.uploadBadgeText, { color: colors.primary }]}>Encrypted</Text>
              </View>
            </View>

            <View style={styles.uploadGrid}>
              <View style={[styles.uploadBox, { backgroundColor: colors['surface-container-lowest'] }]}>
                <Icon name="add-a-photo" size={24} color={colors.primary} />
                <Text style={[styles.uploadBoxText, { color: colors['on-surface-variant'] }]}>Upload Front</Text>
              </View>
              <View style={[styles.uploadBox, { backgroundColor: colors['surface-container-lowest'] }]}>
                <Icon name="add-a-photo" size={24} color={colors.primary} />
                <Text style={[styles.uploadBoxText, { color: colors['on-surface-variant'] }]}>Upload Back</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security Badge */}
        <View style={[styles.securityBadge, { backgroundColor: `${colors['primary-fixed']}4d` }]}>
          <Icon name="security" size={24} color={colors.primary} />
          <View style={styles.securityInfo}>
            <Text style={[styles.securityTitle, { color: colors['on-primary-fixed'] }]}>Bank-Grade Security</Text>
            <Text style={[styles.securityText, { color: colors['on-primary-fixed-variant'] }]}>
              All documents encrypted with 256-bit SSL
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.secondaryAction, { backgroundColor: colors['surface-container-high'] }]}>
            <Text style={[styles.secondaryActionText, { color: colors['on-surface-variant'] }]}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryActionContainer} onPress={handleContinue}>
            <LinearGradient
              colors={[colors.primary, colors['primary-container']]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryAction}
            >
              <Text style={[styles.primaryActionText, { color: colors['on-primary'] }]}>Continue to Review</Text>
              <Icon name="arrow-forward" size={20} color={colors['on-primary']} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

function ServiceCard({ title, description, icon, enabled, onToggle }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.serviceCard, { backgroundColor: colors['surface-container-lowest'] }]}>
      <View style={styles.serviceInfo}>
        <View style={[styles.serviceIcon, { backgroundColor: colors['primary-fixed'] }]}>
          <Icon name={icon} size={28} color={colors.primary} />
        </View>
        <View style={styles.serviceText}>
          <Text style={[styles.serviceTitle, { color: colors['on-surface'] }]}>{title}</Text>
          <Text style={[styles.serviceDescription, { color: colors['on-surface-variant'] }]}>{description}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onToggle}>
        <View style={[styles.toggle, { backgroundColor: enabled ? colors.primary : colors['surface-container-highest'] }]}>
          <View style={[styles.toggleCircle, { transform: [{ translateX: enabled ? 20 : 0 }] }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 32,
  },
  progressHeader: {
    gap: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  serviceInfo: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceText: {
    flex: 1,
    gap: 4,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  serviceDescription: {
    fontSize: 12,
    fontWeight: '400',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  uploadCard: {
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  uploadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  uploadSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  uploadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadBox: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(142, 113, 100, 0.3)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadBoxText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  securityInfo: {
    flex: 1,
    gap: 4,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  securityText: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  secondaryAction: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryActionContainer: {
    flex: 2,
    borderRadius: 24,
    overflow: 'hidden',
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
