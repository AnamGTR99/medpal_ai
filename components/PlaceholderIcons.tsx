import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  focused?: boolean;
}

export function PlaceholderIcon({ name, size = 24, color = '#000', focused = false }: IconProps) {
  let iconText = '?';
  
  switch (name) {
    case 'home':
      iconText = '🏠';
      break;
    case 'scan':
    case 'camera':
      iconText = '📷';
      break;
    case 'settings':
      iconText = '⚙️';
      break;
    case 'close':
      iconText = '✕';
      break;
    case 'pill':
      iconText = '💊';
      break;
    case 'calendar':
      iconText = '📅';
      break;
    case 'notification':
      iconText = '🔔';
      break;
    case 'user':
      iconText = '👤';
      break;
    case 'add':
    case 'plus':
      iconText = '➕';
      break;
    case 'edit':
      iconText = '✏️';
      break;
    case 'delete':
      iconText = '🗑️';
      break;
    case 'check':
      iconText = '✅';
      break;
    case 'alert':
      iconText = '⚠️';
      break;
    case 'info':
      iconText = 'ℹ️';
      break;
    case 'heart':
      iconText = '❤️';
      break;
    case 'star':
      iconText = '⭐';
      break;
    case 'search':
      iconText = '🔍';
      break;
    case 'menu':
      iconText = '☰';
      break;
    case 'back':
      iconText = '←';
      break;
    case 'forward':
      iconText = '→';
      break;
    case 'up':
      iconText = '↑';
      break;
    case 'down':
      iconText = '↓';
      break;
    case 'clock':
    case 'time':
      iconText = '🕐';
      break;
    default:
      iconText = '❓';
  }

  return (
    <View style={[
      styles.container,
      focused && styles.focused,
      { width: size + 8, height: size + 8 }
    ]}>
      <Text style={[
        styles.icon,
        { fontSize: size, color }
      ]}>
        {iconText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  focused: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
  },
  icon: {
    textAlign: 'center',
  },
});