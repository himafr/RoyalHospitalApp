import AsyncStorage from '@react-native-async-storage/async-storage';

async function getMode() {
  return await AsyncStorage.getItem("mode")
  
}

export const colors = {
  primary: '#1a3c34',
  primaryHover: '#344f46',
  dark: '#0d2b1a',
  bg: '#546e68',
  gold: '#c5a059',
  goldLight: '#c5a0591a',
  goldBorder: '#c5a05933',
  textPrimary: '#1a3c34',
  textSecondary: '#546e68',
  textMuted: '#64748b',
  textLight: '#cbd5e1',
  white: '#ffffff',
  bgGray: '#f9faf9',
  bgLight: '#eef2ef',
  danger: '#f87171',
  success: '#13ec5b',
  border: '#0d2b1a1a',
  borderLight: '#0d2b1a0d',
};

export const lightMode = {
  // Backgrounds
  background: '#FAF8F3',
  backgroundAlt: '#F1EDE3',

  // Cards & surfaces
  card: '#FFFFFF',
  cardAlt: '#F6F2E9',
  modal: '#FFFFFF',
  overlay: 'rgba(26, 60, 52, 0.45)',

  // Brand
  primary: '#1A3C34',
  onPrimary: '#FFFFFF',
  secondary: '#C5A059',
  onSecondary: '#1A3C34',
  primaryLight: '#2D5A4E',
  secondaryLight: '#E8D5A8',

  // Text
  text: '#1A1F1D',
  textSecondary: '#5C6B66',
  textMuted: '#8A9691',
  textOnPrimary: '#FFFFFF',
  link: '#1A3C34',

  // Navigation
  navBackground: '#1A3C34',
  navText: '#FFFFFF',
  navIcon: '#C5A059',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E3DDCE',
  tabActive: '#1A3C34',
  tabInactive: '#8A9691',
  tabIndicator: '#C5A059',

  // Icons
  icon: '#1A3C34',
  iconSecondary: '#5C6B66',
  iconActive: '#C5A059',
  iconDisabled: '#B8C0BC',

  // Inputs & buttons
  inputBackground: '#FFFFFF',
  inputBorder: '#D9D2C1',
  inputBorderFocused: '#1A3C34',
  placeholder: '#9AA5A0',
  buttonPrimary: '#1A3C34',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#C5A059',
  buttonSecondaryText: '#1A3C34',
  buttonDisabled: '#D5DAD7',

  // Borders & dividers
  border: '#E3DDCE',
  divider: '#ECE7DA',
  shadow: '#000000',

  // Status
  success: '#2E7D5B',
  warning: '#D99A1E',
  error: '#C0392B',
  info: '#2F6F8F',
};

export const darkMode = {
  // Backgrounds
  background: '#0D1815',
  backgroundAlt: '#122220',

  // Cards & surfaces
  card: '#172A25',
  cardAlt: '#1D332D',
  modal: '#1D332D',
  overlay: 'rgba(0, 0, 0, 0.6)',

  // Brand (gold leads in dark mode for contrast)
  primary: '#C5A059',
  onPrimary: '#1A3C34',
  secondary: '#2D5A4E',
  onSecondary: '#FFFFFF',
  primaryLight: '#D9BC85',
  secondaryLight: '#1A3C34',

  // Text
  text: '#F2EFE6',
  textSecondary: '#B3BFBA',
  textMuted: '#7F8D87',
  textOnPrimary: '#1A3C34',
  link: '#C5A059',

  // Navigation
  navBackground: '#0F1F1B',
  navText: '#F2EFE6',
  navIcon: '#C5A059',

  // Tab bar
  tabBarBackground: '#122220',
  tabBarBorder: '#24403A',
  tabActive: '#C5A059',
  tabInactive: '#7F8D87',
  tabIndicator: '#C5A059',

  // Icons
  icon: '#F2EFE6',
  iconSecondary: '#B3BFBA',
  iconActive: '#C5A059',
  iconDisabled: '#4A5A54',

  // Inputs & buttons
  inputBackground: '#172A25',
  inputBorder: '#2D4A43',
  inputBorderFocused: '#C5A059',
  placeholder: '#7F8D87',
  buttonPrimary: '#C5A059',
  buttonPrimaryText: '#1A3C34',
  buttonSecondary: '#2D5A4E',
  buttonSecondaryText: '#FFFFFF',
  buttonDisabled: '#2A3A35',

  // Borders & dividers
  border: '#24403A',
  divider: '#1D332D',
  shadow: '#000000',

  // Status
  success: '#4CAF86',
  warning: '#E8B04A',
  error: '#E57368',
  info: '#5FA8C9',
};

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64,
};

export const radius = {
  sm: 8, md: 8, lg: 8, xl: 8, xxl: 8, pill: 9999,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
};