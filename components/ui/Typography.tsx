import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface TypographyProps {
  variant?: 
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall';
  children: React.ReactNode;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: TextStyle;
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyMedium',
  children,
  color,
  align = 'left',
  style,
  numberOfLines,
}) => {
  const theme = useTheme();
  const typographyStyle = theme.typography[variant];
  const textColor = color || theme.colors['on-surface'];

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        typographyStyle,
        { color: textColor, textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
