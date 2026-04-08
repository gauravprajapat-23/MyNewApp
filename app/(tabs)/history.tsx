import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { formatCurrency, formatDate } from '../../utils/formatting';
import { fetchAgentTransactions, getErrorMessage } from '../../api';
import { Transaction } from '../../api/transactions';

export default function HistoryScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock agent ID - replace with actual agent ID from context/auth
  const agentId = 1;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAgentTransactions(agentId, {
        limit: 50,
      });
      setTransactions(data);
    } catch (err) {
      const message = getErrorMessage(err);
      console.error('Error loading transactions:', message);
      setError('Failed to load transactions');
      // Keep empty array or use mock data
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  // Calculate summary
  const totalTransactions = transactions.length;
  const totalCommission = transactions.reduce((sum, txn) => sum + Number(txn.commission), 0);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors['on-surface-variant'] }]}>
            Loading transactions...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Transaction History</Text>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors['surface-container-high'] }]}
            onPress={onRefresh}
          >
            <Icon name="refresh" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors['error-container'] }]}>
            <Icon name="error" size={16} color={colors.error} />
            <Text style={[styles.errorText, { color: colors['on-error-container'] }]}>{error}</Text>
          </View>
        )}

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={[styles.summaryCard, { backgroundColor: colors['surface-container-low'] }]}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors['on-surface'] }]}>{totalTransactions}</Text>
                <Text style={[styles.summaryLabel, { color: colors['on-surface-variant'] }]}>Total Transactions</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors['surface-container-highest'] }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.primary }]}>{formatCurrency(totalCommission)}</Text>
                <Text style={[styles.summaryLabel, { color: colors['on-surface-variant'] }]}>Total Commission</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="receipt-long" size={64} color={colors['on-surface-variant']} />
              <Text style={[styles.emptyTitle, { color: colors['on-surface'] }]}>No transactions yet</Text>
              <Text style={[styles.emptyText, { color: colors['on-surface-variant'] }]}>
                Transactions will appear here once you start accepting requests
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TransactionCard
              id={item.id}
              type={item.type}
              name={item.user_name || 'Customer'}
              amount={Number(item.amount)}
              commission={Number(item.commission)}
              status={item.status}
              time={new Date(item.created_at).toLocaleString()}
              icon={item.type.includes('In') || item.type.includes('Deposit') ? 'arrow-downward' : 'arrow-upward'}
              iconColor={item.type.includes('In') || item.type.includes('Deposit') ? '#10B981' : '#EF4444'}
            />
          )}
        />
      </View>
    </ScreenContainer>
  );
}

function TransactionCard({ type, name, amount, commission, status, time, icon, iconColor }: any) {
  const theme = useTheme();
  const { colors } = theme;

  const statusColor = status === 'completed' ? '#10B981' : status === 'pending' ? '#F59E0B' : '#EF4444';

  return (
    <View style={[styles.card, { backgroundColor: colors['surface-container-lowest'] }]}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}1a` }]}>
          <Icon name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>
            {type} - {name}
          </Text>
          <Text style={[styles.cardTime, { color: colors['on-surface-variant'] }]}>
            {time}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={[styles.cardAmount, { color: colors['on-surface'] }]}>
          {formatCurrency(amount)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: `${statusColor}1a` }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  summaryCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryDivider: {
    width: 1,
    height: 40,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
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
    maxWidth: 280,
  },
});
