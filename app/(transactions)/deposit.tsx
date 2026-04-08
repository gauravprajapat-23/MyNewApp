import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { createTransaction, getErrorMessage } from '../../api';

export default function AcceptDepositScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    accountNumber: '',
    confirmationNumber: '',
  });

  // Mock IDs - replace with actual from auth/context
  const agentId = 1;
  const userId = 1;

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deposit amount');
      return false;
    }
    if (!formData.accountNumber || formData.accountNumber.length < 8) {
      Alert.alert('Invalid Account', 'Please enter a valid account number');
      return false;
    }
    if (!formData.confirmationNumber) {
      Alert.alert('Missing Info', 'Please enter the confirmation number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Create transaction in database
      await createTransaction({
        user_id: userId,
        agent_id: agentId,
        type: 'Cash In - Deposit',
        amount: parseFloat(formData.amount),
        commission: parseFloat(formData.amount) * 0.03, // 3% commission
        status: 'completed',
        metadata: {
          account_number: formData.accountNumber,
          confirmation_number: formData.confirmationNumber,
        },
      });

      Alert.alert(
        'Success',
        `Deposit of ₹${formData.amount} completed successfully!`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert('Transaction Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Accept Deposit</Text>
          <View style={[styles.stepBadge, { backgroundColor: colors['primary-fixed'] }]}>
            <Text style={[styles.stepText, { color: colors['on-primary-fixed'] }]}>1/2</Text>
          </View>
        </View>

        {/* Amount Input Card */}
        <View style={[styles.card, { backgroundColor: colors['surface-container-low'] }]}>
          <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Deposit Amount</Text>
          <View style={[styles.amountContainer, { backgroundColor: colors['surface-container-lowest'] }]}>
            <Text style={[styles.currencySymbol, { color: colors.primary }]}>₹</Text>
            <TextInput
              style={[styles.amountInput, { color: colors['on-surface'] }]}
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              placeholder="0.00"
              placeholderTextColor={colors.outline}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        {/* Customer Details Card */}
        <View style={[styles.card, { backgroundColor: colors['surface-container-low'] }]}>
          <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>Customer Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Account Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors['surface-container-lowest'] }]}>
              <Icon name="account-balance" size={20} color={colors['on-surface-variant']} />
              <TextInput
                style={[styles.input, { color: colors['on-surface'] }]}
                value={formData.accountNumber}
                onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                placeholder="Enter account number"
                placeholderTextColor={colors.outline}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Confirmation Number</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors['surface-container-lowest'] }]}>
              <Icon name="qr-code" size={20} color={colors['on-surface-variant']} />
              <TextInput
                style={[styles.input, { color: colors['on-surface'] }]}
                value={formData.confirmationNumber}
                onChangeText={(text) => setFormData({ ...formData, confirmationNumber: text })}
                placeholder="e.g. CX-801-118"
                placeholderTextColor={colors.outline}
                editable={!loading}
              />
            </View>
          </View>
        </View>

        {/* Commission Preview */}
        {formData.amount && parseFloat(formData.amount) > 0 && (
          <View style={[styles.commissionCard, { backgroundColor: colors['primary-fixed'] }]}>
            <View style={styles.commissionRow}>
              <Text style={[styles.commissionLabel, { color: colors['on-primary-fixed'] }]}>Commission (3%)</Text>
              <Text style={[styles.commissionValue, { color: colors['on-primary-fixed'] }]}>
                ₹{(parseFloat(formData.amount) * 0.03).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Security Notice */}
        <View style={[styles.securityNotice, { backgroundColor: `${colors['primary-fixed']}4d` }]}>
          <Icon name="security" size={24} color={colors.primary} />
          <Text style={[styles.securityText, { color: colors['on-primary-fixed-variant'] }]}>
            Funds will be securely transferred to the customer's account
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={[colors.primary, colors['primary-container']]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color={colors['on-primary']} />
            ) : (
              <>
                <Text style={[styles.buttonText, { color: colors['on-primary'] }]}>Verify & Proceed</Text>
                <Icon name="arrow-forward" size={20} color={colors['on-primary']} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  stepBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '800',
    marginRight: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  commissionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  commissionValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
