import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../contexts/UserContext';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { getErrorMessage } from '../../api';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { loginUser } = useUser();
  
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Invalid Input', 'Please enter a valid mobile number');
      return;
    }

    try {
      setLoading(true);
      // For now, create a user with phone number
      await loginUser(`+91${mobileNumber}`, 'Agent User');
      
      // Navigate to dashboard
      router.replace('/(tabs)');
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoIcon, { backgroundColor: colors['primary-fixed'] }]}>
            <Icon name="account-balance-wallet" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors['on-surface'] }]}>CashPoint Agent</Text>
          <Text style={[styles.subtitle, { color: colors['on-surface-variant'] }]}>
            Log in to manage your agent services
          </Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: colors['surface-container-lowest'] }]}>
          {/* Secure Badge */}
          <View style={styles.badge}>
            <Icon name="verified-user" size={16} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors['on-surface-variant'] }]}>Secure Login</Text>
          </View>

          {/* Input Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Mobile Number</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors['surface-container-high'] }]}>
                <Text style={[styles.prefix, { color: colors['on-surface-variant'] }]}>+91</Text>
                <TextInput
                  style={[styles.input, { color: colors['on-surface'] }]}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="800 000 0000"
                  placeholderTextColor={colors['outline']}
                  keyboardType="phone-pad"
                  maxLength={10}
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLogin}
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
                    <Text style={[styles.buttonText, { color: colors['on-primary'] }]}>Verify OTP</Text>
                    <Icon name="arrow-forward" size={20} color={colors['on-primary']} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Secondary Links */}
          <View style={styles.secondarySection}>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={loading}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Register New Shop</Text>
            </TouchableOpacity>
            <View style={styles.dividerRow}>
              <View style={[styles.dividerDot, { backgroundColor: colors['secondary-container'] }]} />
              <Text style={[styles.dividerText, { color: colors['on-surface-variant'] }]}>Authorized Personnel Only</Text>
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
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondarySection: {
    marginTop: 24,
    gap: 16,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
