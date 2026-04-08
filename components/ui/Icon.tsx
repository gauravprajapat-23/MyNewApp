import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface IconProps {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color?: string;
  style?: TextStyle;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color,
  style 
}) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.icon;

  return (
    <MaterialIcons
      name={name}
      size={size}
      color={iconColor}
      style={style}
    />
  );
};
