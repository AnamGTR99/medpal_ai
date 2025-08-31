import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { MedicationProvider } from '../state/MedicationContext';
import { theme } from '../theme/theme';

export default function RootLayout(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <MedicationProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="scan-modal" 
            options={{ 
              headerShown: false,
              presentation: 'modal',
            }} 
          />
        </Stack>
      </MedicationProvider>
    </PaperProvider>
  );
}