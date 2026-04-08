import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof paddingMap;
  style?: ViewStyle;
}

const paddingMap = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'lg',
  style,
}) => {
  const theme = useTheme();
  const { colors, borderRadius, shadows } = theme;

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors['surface-container-lowest'],
          ...shadows.card,
        };
      case 'outlined':
        return {
          backgroundColor: colors['surface-container-lowest'],
          borderWidth: 1,
          borderColor: `${colors['outline-variant']}26`, // 15% opacity
        };
      default:
        return {
          backgroundColor: colors['surface-container-lowest'],
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: borderRadius.xl,
          padding: paddingMap[padding],
        },
        getVariantStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
