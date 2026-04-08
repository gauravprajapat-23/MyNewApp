import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../../components/ui/Icon';
import { ScreenContainer } from '../../components/layout/ScreenContainer';

export default function GetDirectionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Map Placeholder */}
        <View style={[styles.mapContainer, { backgroundColor: colors['surface-container-high'] }]}>
          <Icon name="map" size={80} color={colors['on-surface-variant']} />
          <Text style={[styles.mapText, { color: colors['on-surface-variant'] }]}>Map View</Text>
        </View>

        {/* Directions Card */}
        <View style={styles.directionsCard}>
          <View style={[styles.cardHeader, { backgroundColor: colors['surface-container-low'] }]}>
            <View style={styles.routeInfo}>
              <View style={[styles.iconContainer, { backgroundColor: colors['primary-fixed'] }]}>
                <Icon name="store" size={24} color={colors.primary} />
              </View>
              <View style={styles.routeDetails}>
                <Text style={[styles.destinationName, { color: colors['on-surface'] }]}>Sharma Kirana Store</Text>
                <Text style={[styles.distance, { color: colors.primary }]}>0.3 km • 5 min walk</Text>
              </View>
            </View>
          </View>

          {/* Step by Step Directions */}
          <View style={styles.stepsContainer}>
            <DirectionStep
              step={1}
              instruction="Head north on Main Street"
              distance="100m"
              isFirst
            />
            <DirectionStep
              step={2}
              instruction="Turn right at Market Chowk"
              distance="150m"
            />
            <DirectionStep
              step={3}
              instruction="Destination will be on your left"
              distance="50m"
              isLast
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
              <Icon name="navigation" size={20} color={colors['on-primary']} />
              <Text style={[styles.actionButtonText, { color: colors['on-primary'] }]}>Start Navigation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors['surface-container-high'] }]}>
              <Icon name="share" size={20} color={colors['on-surface']} />
              <Text style={[styles.actionButtonText, { color: colors['on-surface'] }]}>Share Location</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors['on-surface-variant'] }]}>Back to Agent List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

function DirectionStep({ step, instruction, distance, isFirst, isLast }: any) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.stepRow, isFirst && styles.firstStep, isLast && styles.lastStep]}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.stepNumber, { color: colors['on-primary'] }]}>{step}</Text>
        </View>
        {!isLast && <View style={[styles.stepLine, { backgroundColor: colors['surface-container-highest'] }]} />}
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepInstruction, { color: colors['on-surface'] }]}>{instruction}</Text>
        <Text style={[styles.stepDistance, { color: colors['on-surface-variant'] }]}>{distance}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  directionsCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  cardHeader: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeDetails: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 24,
  },
  firstStep: {
    paddingTop: 0,
  },
  lastStep: {
    paddingBottom: 0,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepInstruction: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDistance: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
