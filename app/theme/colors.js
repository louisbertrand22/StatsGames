// Global color palette for the app
export const lightColors = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',
  primaryAlpha: 'rgba(0, 122, 255, 0.12)',
  secondary: '#6B7280',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F2F2F7',
  card: '#F9FAFB',
  text: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  
  // Accent colors
  accent: '#FF9500',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // UI elements
  border: '#C6C6C8',
  divider: '#E5E5EA',
  shadow: '#00000029',
  
  // Screen header gradients
  gradients: {
    blue: ['#007AFF', '#0051D5', '#003DA5'],
    green: ['#34C759', '#28A745', '#218838'],
    brown: ['#A0522D', '#654321', '#4A2511'],
    violet: ['#AF52DE', '#9A3FCC', '#8B32BC'],
  },
};

export const darkColors = {
  // Primary colors
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0051D5',
  primaryAlpha: 'rgba(10, 132, 255, 0.12)',
  secondary: '#9CA3AF',
  
  // Neutral colors
  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#EBEBF599',
  
  // Accent colors
  accent: '#FF9F0A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  
  // UI elements
  border: '#38383A',
  divider: '#38383A',
  shadow: '#00000080',
  
  // Screen header gradients
  gradients: {
    blue: ['#0A84FF', '#0051D5', '#003DA5'],
    green: ['#30D158', '#34C759', '#28A745'],
    brown: ['#8B4513', '#654321', '#4A2511'],
    violet: ['#BF5AF2', '#AF52DE', '#9A3FCC'],
  },
};

// Default to light colors for backward compatibility
export const colors = lightColors;
