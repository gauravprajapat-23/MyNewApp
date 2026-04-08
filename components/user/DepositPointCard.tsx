import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from '../ui/Icon';
import { DepositPoint } from '../../types/user';
import { formatDistance } from '../../utils/location';

interface DepositPointCardProps {
  agent: DepositPoint;
  onPress: () => void;
  onFavorite?: () => void;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
}

export function DepositPointCard({ agent, onPress, onFavorite, showFavoriteButton = false, isFavorite = false }: DepositPointCardProps) {
  const theme = useTheme();
  const { colors } = theme;

  const statusColors = {
    open: '#10B981',
    busy: '#F59E0B',
    closed: colors['surface-container-highest'],
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors['surface-container-lowest'] }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors['primary-fixed'] }]}>
          <Icon name="store" size={28} color={colors.primary} />
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors['on-surface'] }]} numberOfLines={1}>
            {agent.name}
          </Text>
          <View style={styles.meta}>
            <Icon name="star" size={14} color="#FFC107" />
            <Text style={[styles.rating, { color: colors['on-surface-variant'] }]}>{agent.rating}</Text>
            <Text style={[styles.dot, { color: colors['on-surface-variant'] }]}>•</Text>
            <Text style={[styles.distance, { color: colors['on-surface-variant'] }]}>
              {formatDistance(agent.distance)}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {showFavoriteButton && onFavorite && (
            <TouchableOpacity onPress={onFavorite} style={styles.favoriteButton}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={20}
                color={isFavorite ? colors.error : colors['on-surface-variant']}
              />
            </TouchableOpacity>
          )}
          <View style={[styles.statusBadge, { backgroundColor: statusColors[agent.status] }]}>
            <Text style={styles.statusText}>{agent.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Services */}
      <View style={styles.servicesContainer}>
        {agent.services.slice(0, 3).map((service, index) => (
          <View key={index} style={[styles.serviceTag, { backgroundColor: colors['surface-container-high'] }]}>
            <Text style={[styles.serviceText, { color: colors['on-surface-variant'] }]}>{service}</Text>
          </View>
        ))}
        {agent.services.length > 3 && (
          <View style={[styles.serviceTag, { backgroundColor: colors['surface-container-high'] }]}>
            <Text style={[styles.serviceText, { color: colors['on-surface-variant'] }]}>
              +{agent.services.length - 3}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.commissionInfo}>
          <Icon name="percent" size={14} color={colors.primary} />
          <Text style={[styles.commission, { color: colors.primary }]}>
            Commission: {agent.commission}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors['surface-container-high'] }]}
            onPress={(e) => {
              e.stopPropagation();
              // Call agent
            }}
          >
            <Icon name="call" size={16} color={colors['on-surface-variant']} />
            <Text style={[styles.actionText, { color: colors['on-surface-variant'] }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={(e) => {
              e.stopPropagation();
              onPress();
            }}
          >
            <Text style={[styles.actionText, { color: colors['on-primary'] }]}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  dot: {
    fontSize: 14,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  serviceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commission: {
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
