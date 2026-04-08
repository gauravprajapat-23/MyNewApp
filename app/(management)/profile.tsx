import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { fetchAgentById, getErrorMessage } from '../../api';

export default function ProfileShopManagementScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  
  // Mock agent ID
  const agentId = '1';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopData, setShopData] = useState({
    name: '',
    type: '',
    address: '',
    openingTime: '09:00',
    closingTime: '21:00',
    phone: '',
  });

  useEffect(() => {
    loadAgentDetails();
  }, []);

  const loadAgentDetails = async () => {
    try {
      setLoading(true);
      const agent = await fetchAgentById(agentId);
      
      // Parse operatingHours - it might be a JSON string or object
      let openTime = '09:00';
      let closeTime = '21:00';
      
      if (agent.operatingHours) {
        try {
          const hours: any = typeof agent.operatingHours === 'string' 
            ? JSON.parse(agent.operatingHours) 
            : agent.operatingHours;
          openTime = hours?.openTime || hours?.open || '09:00';
          closeTime = hours?.closeTime || hours?.close || '21:00';
        } catch (e) {
          console.error('Error parsing operating hours:', e);
        }
      }
      
      setShopData({
        name: agent.name || '',
        type: agent.type || '',
        address: agent.address || '',
        openingTime: openTime,
        closingTime: closeTime,
        phone: agent.phone || '',
      });
    } catch (error) {
      console.error('Error loading agent details:', getErrorMessage(error));
      Alert.alert('Error', 'Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Add update agent API call when endpoint is available
      Alert.alert('Success', 'Shop details updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update shop details');
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
            Loading shop details...
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
          <Text style={[styles.headerTitle, { color: colors['on-surface'] }]}>Manage Shop</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Icon name="check" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Shop Banner */}
        <View style={styles.bannerContainer}>
          <View style={[styles.banner, { backgroundColor: colors['surface-container-high'] }]}>
            <Icon name="store" size={64} color={colors['on-surface-variant']} />
          </View>
          <TouchableOpacity style={[styles.editBannerButton, { backgroundColor: colors.primary }]}>
            <Icon name="camera-alt" size={20} color={colors['on-primary']} />
          </TouchableOpacity>
        </View>

        {/* Shop Details Form */}
        <View style={[styles.formCard, { backgroundColor: colors['surface-container-lowest'] }]}>
          <Text style={[styles.cardTitle, { color: colors['on-surface'] }]}>Shop Information</Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Shop Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
              value={shopData.name}
              onChangeText={(text) => setShopData({ ...shopData, name: text })}
              placeholder="Enter shop name"
              placeholderTextColor={colors.outline}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Shop Type</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
              value={shopData.type}
              onChangeText={(text) => setShopData({ ...shopData, type: text })}
              placeholder="e.g. Grocery Store"
              placeholderTextColor={colors.outline}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Address</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
              value={shopData.address}
              onChangeText={(text) => setShopData({ ...shopData, address: text })}
              placeholder="Enter full address"
              placeholderTextColor={colors.outline}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Opening Time</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                value={shopData.openingTime}
                onChangeText={(text) => setShopData({ ...shopData, openingTime: text })}
                placeholder="09:00"
                placeholderTextColor={colors.outline}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Closing Time</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
                value={shopData.closingTime}
                onChangeText={(text) => setShopData({ ...shopData, closingTime: text })}
                placeholder="21:00"
                placeholderTextColor={colors.outline}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors['on-surface-variant'] }]}>Contact Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors['surface-container-high'], color: colors['on-surface'] }]}
              value={shopData.phone}
              onChangeText={(text) => setShopData({ ...shopData, phone: text })}
              placeholder="+91 98765 43210"
              placeholderTextColor={colors.outline}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSave} disabled={saving}>
          <LinearGradient
            colors={[colors.primary, colors['primary-container']]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, saving && styles.buttonDisabled]}
          >
            {saving ? (
              <ActivityIndicator color={colors['on-primary']} />
            ) : (
              <>
                <Text style={[styles.buttonText, { color: colors['on-primary'] }]}>Save Changes</Text>
                <Icon name="check" size={20} color={colors['on-primary']} />
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
  bannerContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  banner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBannerButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  textArea: {
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
    minHeight: 80,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainer: {
    margin: 20,
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
