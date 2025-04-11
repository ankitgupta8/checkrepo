import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Color palette
const colors = {
  // Primary colors
  primary: '#4361ee',
  primaryLight: '#738eef',
  primaryDark: '#2f4ad0',
  
  // Secondary colors
  secondary: '#f72585',
  secondaryLight: '#ff5ca8',
  secondaryDark: '#d01e6f',
  
  // Accent colors
  accent: '#7209b7',
  accentLight: '#9b4dca',
  accentDark: '#5a0591',
  
  // Gradient colors
  gradient: {
    primary: ['#4361ee', '#3a0ca3'],
    secondary: ['#f72585', '#7209b7'],
    card: ['#ffffff', '#f8f9fa'],
    dark: ['#3a0ca3', '#4361ee'],
  },
  
  // Neutral colors
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2b2d42',
  textSecondary: '#6c757d',
  border: '#e9ecef',
  placeholder: '#adb5bd',
  
  // Status colors
  success: '#06d6a0',
  warning: '#ffd166',
  error: '#ef476f',
  info: '#118ab2',
};

// Typography
const fontFamily = Platform.OS === 'ios' 
  ? {
      regular: 'Avenir-Book',
      medium: 'Avenir-Medium',
      semiBold: 'Avenir-Heavy',
      bold: 'Avenir-Black',
    }
  : {
      regular: 'sans-serif',
      medium: 'sans-serif-medium',
      semiBold: 'sans-serif-condensed',
      bold: 'sans-serif-black',
    };

const typography = {
  fontFamily,
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

// Shadows
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Animation durations
const animation = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Screen dimensions
const screen = {
  width,
  height,
  isSmall: width < 375,
  isMedium: width >= 375 && width < 768,
  isLarge: width >= 768,
};

// Export theme
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  screen,
};

export default theme; 