import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../contexts/UserContext';
import { useLocation } from '../../contexts/LocationContext';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { loginOrCreateUser, getErrorMessage } from '../../api';

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const { loginUser } = useUser();
  const { location, isLoading: locationLoading, requestPermission } = useLocation();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    businessName: '',
    shopType: '',
    address: '',
    openingTime: '09:00',
    closingTime: '21:00',
  });

  // Auto-fill address when location is available
  useEffect(() => {
    if (location?.address && !formData.address) {
      setFormData(prev => ({
        ...prev,
        address: location.address || prev.address,
      }));
    }
  }, [location]);

  const handleGetLocation = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Location Required',
        'Please enable location access to auto-detect your shop address.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.fullName || !formData.phone) {
        Alert.alert('Missing Info', 'Please fill in your name and phone number');
        return;
      }
      setStep(2);
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    if (!formData.businessName || !formData.address) {
      Alert.alert('Missing Info', 'Please fill in your business name and address');
      return;
    }

    try {
      setLoading(true);
      
      // Create user in database
      const user = await loginOrCreateUser(
        formData.phone,
        formData.fullName,
        `${formData.businessName} - ${formData.shopType}`
      );

      // TODO: Create agent profile with shop details
      // This would require an additional endpoint to create agent with shop info
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please complete document verification.',
        [
          {
            text: 'Continue',
            onPress: () => router.push('/(auth)/verify'),
          },
        ]
      );
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer withScroll>
      <View style={styles.container}>
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <View style={styles.progressSteps}>
            <View style={styles.step}>
              <View style={[styles.stepCircle, step >= 1 && { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumber, step >= 1 && { color: colors['on-primary'] }]}>1</Text>
              </View>
              <Text style={[styles.stepLabel, step >= 1 && { color: colors.primary }]}>Basic</Text>
            </View>
            <View style={[styles.progressLine, { backgroundColor: colors['surface-container-highest'] }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: step >= 2 ? '100%' : '0%' }]} />
            </View>
            <View style={styles.step}>
              <View style={[styles.stepCircle, step >= 2 && { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumber, step >= 2 && { color: colors['on-primary'] }]}>2</Text>
              </View>
              <Text style={[styles.stepLabel, step >= 2 && { color: colors.primary }]}>Shop</Text>
            </View>
          </View>

          <Text style={[styles.pageTitle, { color: colors['on-surface'] }]}>Build Your Business Profile</Text>
          <Text style={[styles.pageSubtitle, { color: colors['on-surface-variant'] }]}>
            Help us understand your setup
          </Text>
        </View>

        {/* Step 1: Basic Details */}
        {step === 1 && (
          <View style={[styles.card, { backgroundColor: colors['surface-container-lowest'] }]}>
            <View style={styles.cardHeader}>
              <Icon name="person" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>Basic Details</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  placeholder="John Doe"
                  placeholderTextColor={colors.outline}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Mobile Number</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={colors.outline}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Business Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                  value={formData.businessName}
                  onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                  placeholder="e.g. Sharma Kirana Store"
                  placeholderTextColor={colors.outline}
                  editable={!loading}
                />
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Shop Details */}
        {step === 2 && (
          <View style={[styles.card, { backgroundColor: colors['surface-container-lowest'] }]}>
            <View style={styles.cardHeader}>
              <Icon name="store" size={24} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>Shop Details</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Shop Type</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                  value={formData.shopType}
                  onChangeText={(text) => setFormData({ ...formData, shopType: text })}
                  placeholder="e.g. Grocery Store, Mobile Shop"
                  placeholderTextColor={colors.outline}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Store Address</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Plot No, Street, Landmark..."
                  placeholderTextColor={colors.outline}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  editable={!loading}
                />
              </View>

              {/* Map Preview */}
              <View style={[styles.mapPreview, { backgroundColor: colors['surface-container-high'] }]}>
                <Icon name="location-on" size={40} color={colors.primary} />
                <View style={styles.mapBadge}>
                  <Icon name="my-location" size={14} color={colors.primary} />
                  <Text style={[styles.mapBadgeText, { color: colors['on-surface'] }]}>
                    {locationLoading ? 'Detecting location...' : location?.address ? 'Location detected!' : 'Auto-detecting location...'}
                  </Text>
                </View>
                {!location && (
                  <TouchableOpacity
                    style={[styles.getLocationButton, { backgroundColor: colors.primary }]}
                    onPress={handleGetLocation}
                  >
                    <Text style={[styles.getLocationText, { color: colors['on-primary'] }]}>
                      Get My Location
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.timeRow}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Opening Time</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                    value={formData.openingTime}
                    onChangeText={(text) => setFormData({ ...formData, openingTime: text })}
                    placeholder="09:00"
                    placeholderTextColor={colors.outline}
                    editable={!loading}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Closing Time</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                    value={formData.closingTime}
                    onChangeText={(text) => setFormData({ ...formData, closingTime: text })}
                    placeholder="21:00"
                    placeholderTextColor={colors.outline}
                    editable={!loading}
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handleNext}
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
                <Text style={[styles.buttonText, { color: colors['on-primary'] }]}>
                  {step === 1 ? 'Next: Shop Details' : 'Create Account'}
                </Text>
                <Icon name="arrow-forward" size={20} color={colors['on-primary']} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: colors['on-surface-variant'] }]}>
          By continuing, you agree to our <Text style={{ color: colors.primary }}>Terms of Service</Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  progressHeader: {
    gap: 16,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  step: {
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9e1dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5a4136',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5a4136',
  },
  progressLine: {
    flex: 1,
    height: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    borderRadius: 24,
    padding: 32,
    gap: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
  },
  mapPreview: {
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  getLocationButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  getLocationText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonContainer: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
