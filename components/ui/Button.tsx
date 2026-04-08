import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  labelStyle,
}) => {
  const theme = useTheme();
  const { colors, borderRadius } = theme;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 12 };
      case 'lg':
        return { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderPrimaryButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        { borderRadius: borderRadius.xl },
        styles.primaryContainer,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={[colors.primary, colors['primary-container']]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          { borderRadius: borderRadius.xl },
          { paddingVertical: sizeStyles.paddingVertical, paddingHorizontal: sizeStyles.paddingHorizontal },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors['on-primary']} />
        ) : (
          <>
            {icon && icon}
            <Text
              style={[
                styles.primaryText,
                { fontSize: sizeStyles.fontSize },
                labelStyle,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSecondaryButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderRadius: borderRadius.xl,
          backgroundColor: colors['primary-fixed'],
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors['on-primary-fixed']} />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.secondaryText,
              { fontSize: sizeStyles.fontSize },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  const renderTertiaryButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderRadius: borderRadius.xl,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.tertiaryText,
              { fontSize: sizeStyles.fontSize },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  switch (variant) {
    case 'secondary':
      return renderSecondaryButton();
    case 'tertiary':
      return renderTertiaryButton();
    default:
      return renderPrimaryButton();
  }
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryContainer: {
    overflow: 'hidden',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryText: {
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  secondaryText: {
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  tertiaryText: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  disabled: {
    opacity: 0.5,
  },
});
