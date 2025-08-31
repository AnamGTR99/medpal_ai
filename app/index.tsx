import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { theme, spacing, fontSizes } from '../theme/theme';

export default function LoginScreen(): JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MedPal</Text>
      <Text style={styles.subtitle}>Your Personal Medication Assistant</Text>
      <Button 
        mode="contained" 
        onPress={() => router.push('/(tabs)')}
        style={styles.button}
        buttonColor={theme.colors.primary}
      >
        Get Started
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.global,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: fontSizes.h1 + 10,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: spacing.vertical,
  },
  subtitle: {
    fontSize: fontSizes.h2,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.vertical * 3,
  },
  button: {
    marginTop: spacing.vertical,
    paddingHorizontal: 30,
  },
});