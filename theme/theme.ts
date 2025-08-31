import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#E91E63',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    onSurface: '#121212',
    secondary: '#6c757d',
  },
};

export const spacing = {
  global: 20,
  vertical: 16,
};

export const fontSizes = {
  h1: 28,
  h2: 18,
  title: 16,
  body: 14,
  caption: 12,
};