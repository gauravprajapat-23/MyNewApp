import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from './Icon';

interface FilterChipProps {
  label: string;
  icon?: any;
  active: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function FilterChip({ label, icon, active, onPress, style }: FilterChipProps) {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: active ? colors.primary : colors['surface-container-high'],
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Icon
          name={icon}
          size={14}
          color={active ? colors['on-primary'] : colors['on-surface-variant']}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.label,
          {
            color: active ? colors['on-primary'] : colors['on-surface-variant'],
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
