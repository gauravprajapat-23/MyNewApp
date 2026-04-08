export interface ThemeColors {
  primary: string;
  'on-primary': string;
  'primary-container': string;
  'on-primary-container': string;
  'primary-fixed': string;
  'on-primary-fixed': string;
  'primary-fixed-dim': string;
  'on-primary-fixed-variant': string;
  
  secondary: string;
  'on-secondary': string;
  'secondary-container': string;
  'on-secondary-container': string;
  'secondary-fixed': string;
  'on-secondary-fixed': string;
  'secondary-fixed-dim': string;
  'on-secondary-fixed-variant': string;
  
  tertiary: string;
  'on-tertiary': string;
  'tertiary-container': string;
  'on-tertiary-container': string;
  'tertiary-fixed': string;
  'on-tertiary-fixed': string;
  'tertiary-fixed-dim': string;
  'on-tertiary-fixed-variant': string;
  
  surface: string;
  'on-surface': string;
  'on-surface-variant': string;
  'surface-dim': string;
  'surface-bright': string;
  'surface-container-lowest': string;
  'surface-container-low': string;
  'surface-container': string;
  'surface-container-high': string;
  'surface-container-highest': string;
  
  error: string;
  'on-error': string;
  'error-container': string;
  'on-error-container': string;
  
  outline: string;
  'outline-variant': string;
  
  'inverse-surface': string;
  'inverse-on-surface': string;
  'inverse-primary': string;
  
  background: string;
  'on-background': string;
  'surface-tint': string;
  
  text: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export interface ThemeTypography {
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
  letterSpacing: number;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
}

export interface ThemeBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface Theme {
  colors: ThemeColors;
  typography: typeof import('../constants/theme').Typography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: {
    ambient: ThemeShadow;
    card: ThemeShadow;
    none: ThemeShadow;
  };
  isDark: boolean;
}
