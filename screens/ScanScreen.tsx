import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

export default function ScanScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scan Screen (Modal)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: theme.fontSizes.h2,
    color: theme.colors.text,
  },
});