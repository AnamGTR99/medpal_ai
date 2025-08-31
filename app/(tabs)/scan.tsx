import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, spacing, fontSizes } from '../../theme/theme';

export default function ScanPlaceholder(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This tab is just a placeholder</Text>
      <Text style={styles.subtext}>The scan button opens a modal instead</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: spacing.global,
  },
  text: {
    fontSize: fontSizes.h2,
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: spacing.vertical,
  },
  subtext: {
    fontSize: fontSizes.body,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
});