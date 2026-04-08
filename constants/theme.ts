/**
 * CashPoint Agent - Radiant Professional Design System
 * Based on "The Human Ledger" aesthetic
 */

import { Platform } from 'react-native';

// ==========================================
// COLOR PALETTE - Warmth and Authority
// ==========================================

export const Colors = {
  light: {
    // Primary - High-energy oranges for action
    primary: '#a04100',
    'on-primary': '#ffffff',
    'primary-container': '#ff6b00',
    'on-primary-container': '#572000',
    'primary-fixed': '#ffdbcc',
    'on-primary-fixed': '#351000',
    'primary-fixed-dim': '#ffb693',
    'on-primary-fixed-variant': '#7a3000',

    // Secondary - Supporting warm tones
    secondary: '#914c00',
    'on-secondary': '#ffffff',
    'secondary-container': '#fea458',
    'on-secondary-container': '#723b00',
    'secondary-fixed': '#ffdcc3',
    'on-secondary-fixed': '#2f1500',
    'secondary-fixed-dim': '#ffb77e',
    'on-secondary-fixed-variant': '#6e3900',

    // Tertiary - Neutral grays
    tertiary: '#5f5e5e',
    'on-tertiary': '#ffffff',
    'tertiary-container': '#9a9999',
    'on-tertiary-container': '#313131',
    'tertiary-fixed': '#e4e2e1',
    'on-tertiary-fixed': '#1b1c1c',
    'tertiary-fixed-dim': '#c8c6c6',
    'on-tertiary-fixed-variant': '#474747',

    // Surface - Warm backgrounds (No-Line Rule)
    surface: '#fff8f4',
    'on-surface': '#1e1b18',
    'on-surface-variant': '#5a4136',
    'surface-dim': '#e0d9d4',
    'surface-bright': '#fff8f4',
    'surface-container-lowest': '#ffffff',
    'surface-container-low': '#faf2ed',
    'surface-container': '#f4ece7',
    'surface-container-high': '#eee7e2',
    'surface-container-highest': '#e9e1dc',

    // Error states
    error: '#ba1a1a',
    'on-error': '#ffffff',
    'error-container': '#ffdad6',
    'on-error-container': '#93000a',

    // Outline & Borders (Ghost Border Fallback)
    outline: '#8e7164',
    'outline-variant': '#e2bfb0',

    // Inverse states
    'inverse-surface': '#33302d',
    'inverse-on-surface': '#f7efea',
    'inverse-primary': '#ffb693',

    // Background (legacy support)
    background: '#fff8f4',
    'on-background': '#1e1b18',

    // Surface tint for shadows
    'surface-tint': '#a04100',

    // Common UI
    text: '#1e1b18',
    tint: '#a04100',
    icon: '#5a4136',
    tabIconDefault: '#5a4136',
    tabIconSelected: '#a04100',
  },
  dark: {
    // Primary
    primary: '#ffb693',
    'on-primary': '#572000',
    'primary-container': '#ff6b00',
    'on-primary-container': '#ffdbcc',
    'primary-fixed': '#ffdbcc',
    'on-primary-fixed': '#351000',
    'primary-fixed-dim': '#ffb693',
    'on-primary-fixed-variant': '#7a3000',

    // Secondary
    secondary: '#ffb77e',
    'on-secondary': '#4e2000',
    'secondary-container': '#fea458',
    'on-secondary-container': '#723b00',
    'secondary-fixed': '#ffdcc3',
    'on-secondary-fixed': '#2f1500',
    'secondary-fixed-dim': '#ffb77e',
    'on-secondary-fixed-variant': '#6e3900',

    // Tertiary
    tertiary: '#c8c6c6',
    'on-tertiary': '#313131',
    'tertiary-container': '#9a9999',
    'on-tertiary-container': '#e4e2e1',
    'tertiary-fixed': '#e4e2e1',
    'on-tertiary-fixed': '#1b1c1c',
    'tertiary-fixed-dim': '#c8c6c6',
    'on-tertiary-fixed-variant': '#474747',

    // Surface
    surface: '#1e1b18',
    'on-surface': '#fff8f4',
    'on-surface-variant': '#e2bfb0',
    'surface-dim': '#1e1b18',
    'surface-bright': '#33302d',
    'surface-container-lowest': '#171412',
    'surface-container-low': '#272320',
    'surface-container': '#2f2b28',
    'surface-container-high': '#3a3532',
    'surface-container-highest': '#45403d',

    // Error
    error: '#ffb4ab',
    'on-error': '#690005',
    'error-container': '#93000a',
    'on-error-container': '#ffdad6',

    // Outline
    outline: '#a98b7d',
    'outline-variant': '#5a4136',

    // Inverse
    'inverse-surface': '#fff8f4',
    'inverse-on-surface': '#33302d',
    'inverse-primary': '#a04100',

    // Background
    background: '#1e1b18',
    'on-background': '#fff8f4',

    // Surface tint
    'surface-tint': '#ffb693',

    // Common UI
    text: '#fff8f4',
    tint: '#ffb693',
    icon: '#e2bfb0',
    tabIconDefault: '#e2bfb0',
    tabIconSelected: '#ffb693',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ==========================================
// TYPOGRAPHY SCALE
// ==========================================

export const Typography = {
  // Display - For hero numbers and key metrics
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '800' as const,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },

  // Headline - For section headers and important text
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },

  // Title - For card titles and sub-headers
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },

  // Body - For standard text content
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },

  // Label - For buttons, captions, and small text
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
};

// ==========================================
// SPACING SCALE
// ==========================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

// ==========================================
// BORDER RADIUS
// ==========================================

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ==========================================
// SHADOWS - Ambient depth with surface-tint
// ==========================================

export const Shadows = {
  // Ambient shadow per design spec
  ambient: {
    shadowColor: 'rgba(160, 65, 0, 0.06)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  // Lighter shadow for cards
  card: {
    shadowColor: 'rgba(160, 65, 0, 0.03)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  // No shadow (flat)
  none: {
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};
