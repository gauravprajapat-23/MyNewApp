import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Switch, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { updateAgentStatus, fetchAgentById, getErrorMessage } from '../../api';

export default function AvailabilityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  
  // Mock agent ID - replace with actual from auth
  const agentId = '1';
  
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState({
    cashIn: true,
    cashOut: true,
    aeps: false,
    upi: true,
  });

  useEffect(() => {
    loadAgentStatus();
  }, []);

  const loadAgentStatus = async () => {
    try {
      setLoading(true);
      const agent = await fetchAgentById(agentId);
      setIsOnline(agent.status === 'open');
    } catch (error) {
      console.error('Error loading agent status:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (value: boolean) => {
    setIsOnline(value);
  };

  const toggleService = (service: string) => {
    setServices(prev => ({
      ...prev,
      [service]: !prev[service as keyof typeof prev],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAgentStatus(agentId, isOnline ? 'open' : 'closed');
      Alert.alert('Success', 'Availability updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Loading...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withScroll>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Availability & Services</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Icon name="check" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Online Status */}
        <View style={[styles.statusCard, { backgroundColor: colors['surface-container-low'] }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIcon, { backgroundColor: isOnline ? colors['primary-fixed'] : colors['surface-container-highest'] }]}>
              <Icon name={isOnline ? 'circle' : 'cancel'} size={32} color={isOnline ? colors.primary : colors['on-surface-variant']} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={[styles.statusTitle, { color: colors['on-surface'] }]}>
                {isOnline ? 'You are Online' : 'You are Offline'}
              </Text>
              <Text style={[styles.statusSubtitle, { color: colors['on-surface-variant'] }]}>
                {isOnline ? 'Customers can see and send requests' : 'You won\'t receive new requests'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleStatusChange}
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Services Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Manage Services</Text>
          <Text style={[styles.sectionSubtitle, { color: colors['on-surface-variant'] }]}>
            Enable or disable services you want to offer
          </Text>

          <ServiceToggle
            icon="payments"
            label="Cash Deposit"
            description="Accept cash deposits into bank accounts"
            enabled={services.cashIn}
            onToggle={() => toggleService('cashIn')}
          />
          <ServiceToggle
            icon="atm"
            label="Cash Withdrawal"
            description="Provide cash-out services to customers"
            enabled={services.cashOut}
            onToggle={() => toggleService('cashOut')}
          />
          <ServiceToggle
            icon="fingerprint"
            label="AEPS"
            description="Aadhaar Enabled Payment System"
            enabled={services.aeps}
            onToggle={() => toggleService('aeps')}
          />
          <ServiceToggle
            icon="qr-code"
            label="UPI Transfer"
            description="Instant wallet-to-bank transfers"
            enabled={services.upi}
            onToggle={() => toggleService('upi')}
          />
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Operating Hours</Text>
          <View style={[styles.hoursCard, { backgroundColor: colors['surface-container-lowest'] }]}>
            <View style={styles.hoursRow}>
              <View style={[styles.hoursIcon, { backgroundColor: colors['primary-fixed'] }]}>
                <Icon name="schedule" size={20} color={colors.primary} />
              </View>
              <View style={styles.hoursInfo}>
                <Text style={[styles.hoursLabel, { color: colors['on-surface-variant'] }]}>Today's Hours</Text>
                <Text style={[styles.hoursValue, { color: colors['on-surface'] }]}>09:00 AM - 09:00 PM</Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Today's Performance</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Requests" value="24" icon="assignment" />
            <StatCard label="Completed" value="22" icon="check-circle" />
            <StatCard label="Earnings" value="₹480" icon="account-balance-wallet" />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors['on-primary']} />
          ) : (
            <>
              <Icon name="save" size={20} color={colors['on-primary']} />
              <Text style={[styles.saveButtonText, { color: colors['on-primary'] }]}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

function ServiceToggle({ icon, label, description, enabled, onToggle }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.serviceCard, { backgroundColor: colors['surface-container-lowest'] }]}>
      <View style={styles.serviceHeader}>
        <View style={[styles.serviceIcon, { backgroundColor: colors['primary-fixed'] }]}>
          <Icon name={icon} size={24} color={colors.primary} />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceLabel, { color: colors['on-surface'] }]}>{label}</Text>
          <Text style={[styles.serviceDescription, { color: colors['on-surface-variant'] }]}>
            {description}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

function StatCard({ label, value, icon }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.statCard, { backgroundColor: colors['surface-container-lowest'] }]}>
      <View style={[styles.statIcon, { backgroundColor: colors['primary-fixed'] }]}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.statValue, { color: colors['on-surface'] }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors['on-surface-variant'] }]}>{label}</Text>
    </View>
  );
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 191, 176, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  serviceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  hoursCard: {
    padding: 20,
    borderRadius: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  hoursIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoursInfo: {
    flex: 1,
  },
  hoursLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  editText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    paddingVertical: 16,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
