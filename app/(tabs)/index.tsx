import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Switch, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { formatCurrency } from '../../utils/formatting';
import { fetchAgentTransactions, updateAgentStatus, getErrorMessage } from '../../api';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Mock agent ID - replace with actual from auth context
  const agentId = '1';

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchAgentTransactions(parseInt(agentId), {
        limit: 100,
      });
      setTransactions(data);
    } catch (error) {
      console.error('Error loading dashboard:', getErrorMessage(error));
      // Keep empty array
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (value: boolean) => {
    try {
      setUpdatingStatus(true);
      setIsOnline(value);
      await updateAgentStatus(agentId.toString(), value ? 'open' : 'closed');
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
      setIsOnline(!value); // Revert
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Calculate stats from real transactions
  const todayTransactions = transactions.filter(t => {
    const date = new Date(t.created_at);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  });

  const todayEarnings = todayTransactions.reduce((sum, t) => sum + Number(t.commission || 0), 0);
  const completedCount = todayTransactions.filter(t => t.status === 'completed').length;
  const avgCommission = completedCount > 0 ? todayEarnings / completedCount : 0;

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Loading dashboard...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withScroll>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { backgroundColor: colors['surface-container-high'] }]}>
              <Icon name="person" size={24} color={colors['on-surface-variant']} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>CashPoint Agent</Text>
          </View>
          <View style={[styles.onlineBadge, { backgroundColor: isOnline ? colors['primary-fixed'] : colors['surface-container'] }]}>
            <View style={[styles.onlineDot, { backgroundColor: isOnline ? colors.primary : colors['on-surface-variant'] }]} />
            <Text style={[styles.onlineText, { color: isOnline ? colors['on-primary-fixed'] : colors['on-surface-variant'] }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Hero Earnings Card */}
        <TouchableOpacity style={styles.earningsCardContainer} onPress={() => router.push('/(tabs)/history')}>
          <LinearGradient
            colors={[colors.primary, colors['primary-container']]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.earningsCard}
          >
            <Text style={styles.earningsLabel}>Today Earnings</Text>
            <Text style={styles.earningsAmount}>{formatCurrency(todayEarnings)}</Text>
            <View style={styles.earningsStats}>
              <View>
                <Text style={styles.earningsStatLabel}>Completed</Text>
                <Text style={styles.earningsStatValue}>{completedCount}</Text>
              </View>
              <View style={styles.earningsDivider} />
              <View>
                <Text style={styles.earningsStatLabel}>Avg. Commission</Text>
                <Text style={styles.earningsStatValue}>{formatCurrency(avgCommission)}</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction icon="input" label="Accept Deposit" onPress={() => router.push('/(transactions)/deposit')} />
            <QuickAction icon="logout" label="Cash Out" onPress={() => {}} />
            <QuickAction icon="qr-code-scanner" label="Scan Code" onPress={() => {}} />
            <QuickAction icon="support-agent" label="Support" onPress={() => {}} />
          </View>
        </View>

        {/* Recent Activity */}
        {transactions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors['on-surface'] }]}>Recent Activity</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>

            {transactions.slice(0, 3).map((txn) => (
              <TransactionSummary
                key={txn.id}
                type={txn.type}
                amount={Number(txn.amount)}
                status={txn.status}
                time={new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                icon={txn.type.includes('In') || txn.type.includes('Deposit') ? 'arrow-downward' : 'arrow-upward'}
                iconColor={txn.type.includes('In') || txn.type.includes('Deposit') ? '#10B981' : '#EF4444'}
              />
            ))}
          </View>
        )}

        {/* Agent Status Toggle */}
        <View style={[styles.statusCard, { backgroundColor: colors['surface-container-low'] }]}>
          <View>
            <Text style={[styles.statusTitle, { color: colors['on-surface'] }]}>Agent Status</Text>
            <Text style={[styles.statusSubtitle, { color: colors['on-surface-variant'] }]}>
              {updatingStatus ? 'Updating...' : 'Your shop is visible to nearby customers'}
            </Text>
          </View>
          {updatingStatus ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Switch
              value={isOnline}
              onValueChange={handleStatusChange}
              trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
              thumbColor="#fff"
              disabled={updatingStatus}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function QuickAction({ icon, label, onPress }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors['surface-container-lowest'] }]} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: colors['primary-fixed'] }]}>
        <Icon name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.quickActionLabel, { color: colors['on-surface-variant'] }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TransactionSummary({ type, amount, status, time, icon, iconColor }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.txnCard, { backgroundColor: colors['surface-container-lowest'] }]}>
      <View style={styles.txnLeft}>
        <View style={[styles.txnIcon, { backgroundColor: `${iconColor}1a` }]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.txnInfo}>
          <Text style={[styles.txnType, { color: colors['on-surface'] }]}>{type}</Text>
          <Text style={[styles.txnTime, { color: colors['on-surface-variant'] }]}>{time}</Text>
        </View>
      </View>
      <View style={styles.txnRight}>
        <Text style={[styles.txnAmount, { color: colors['on-surface'] }]}>{formatCurrency(amount)}</Text>
        <Text style={[styles.txnStatus, { color: status === 'completed' ? '#10B981' : '#F59E0B' }]}>
          {status}
        </Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineText: {
    fontSize: 12,
    fontWeight: '700',
  },
  earningsCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  earningsCard: {
    padding: 32,
    gap: 24,
  },
  earningsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: -1,
  },
  earningsStats: {
    flexDirection: 'row',
    gap: 24,
  },
  earningsStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  earningsStatValue: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  earningsDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  txnCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txnInfo: {
    gap: 2,
  },
  txnType: {
    fontSize: 14,
    fontWeight: '700',
  },
  txnTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  txnRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txnAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  txnStatus: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusCard: {
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
});
