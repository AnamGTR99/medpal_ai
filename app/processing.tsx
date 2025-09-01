import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { demoScannedData } from '../utils/demoData';
import { processImage } from '../services/AIService';
import { theme, spacing } from '../theme/theme';

export default function ProcessingScreen(): JSX.Element {
  const router = useRouter();
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [gifError, setGifError] = useState(false);

  useEffect(() => {
    console.log('📸 Image captured, starting AI processing and 3-second timer...');
    
    // Clear previous results
    setAiResult(null);
    setAiError(null);
    
    let aiProcessingComplete = false;
    let timerComplete = false;
    let finalResult = null;
    let finalError = null;

    // Start AI processing with timeout
    const processImageAsync = async () => {
      try {
        console.log('🔍 Starting AI processing...');
        console.log('📊 Captured image URI:', global.capturedImageUri ? global.capturedImageUri.substring(0, 50) + '...' : 'Missing');
        console.log('📊 Captured base64:', global.capturedImageBase64 ? `Length: ${global.capturedImageBase64.length}` : 'Missing');
        
        if (!global.capturedImageBase64) {
          throw new Error('No base64 image data available');
        }
        
        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI processing timeout')), 30000)
        );
        
        // Race between AI processing and timeout
        const result = await Promise.race([
          processImage(global.capturedImageBase64),
          timeoutPromise
        ]);
        
        if (result) {
          console.log('✅ AI processing successful:', result);
          finalResult = result;
          setAiResult(result);
        } else {
          console.log('❌ AI processing returned null');
          finalError = 'Could not read the medication label';
          setAiError(finalError);
        }
      } catch (error) {
        console.error('❌ AI processing error:', error);
        if (error.message === 'AI processing timeout') {
          finalError = 'Processing took too long. Please try again.';
        } else {
          finalError = 'Error processing image';
        }
        setAiError(finalError);
      } finally {
        aiProcessingComplete = true;
        checkAndNavigate();
      }
    };

    // Navigate when both conditions are met
    const checkAndNavigate = () => {
      if (aiProcessingComplete && timerComplete) {
        if (finalResult) {
          // Use real AI data
          console.log('🎯 Navigating with real AI data:', finalResult.name);
          router.replace({
            pathname: '/confirm-scan',
            params: {
              ...finalResult,
              imageUri: global.capturedImageUri || finalResult.imageUri || demoScannedData.imageUri
            }
          });
        } else if (finalError) {
          // Show error alert and go back
          Alert.alert(
            'Scan Failed',
            finalError,
            [
              {
                text: 'Try Again',
                onPress: () => router.replace('/(tabs)')
              }
            ]
          );
        } else {
          // This shouldn't happen, but fallback just in case
          console.log('⚠️ Unexpected state - no result or error');
          router.replace({
            pathname: '/confirm-scan',
            params: {
              ...demoScannedData,
              imageUri: global.capturedImageUri || demoScannedData.imageUri
            }
          });
        }
      }
    };

    // Start 3-second timer
    const timer = setTimeout(() => {
      console.log('⏰ 3-second timer complete');
      timerComplete = true;
      checkAndNavigate();
    }, 3000);

    // Start AI processing
    processImageAsync();

    return () => {
      console.log('🧹 Cleaning up timer');
      clearTimeout(timer);
    };
  }, []); // Remove router dependency to prevent re-runs

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo GIF with fallback */}
        {!gifError ? (
          <Image
            source={require('../assets/images/logo.gif')}
            style={styles.logo}
            resizeMode="contain"
            onError={(error) => {
              console.log('GIF loading error:', error.nativeEvent.error);
              setGifError(true);
            }}
            onLoad={() => console.log('GIF loaded successfully')}
          />
        ) : (
          // Fallback when GIF fails to load
          <View style={styles.logoFallback}>
            <Text style={styles.logoText}>💊</Text>
            <Text style={styles.logoSubtext}>MedPal</Text>
          </View>
        )}
        
        {/* Loading Text */}
        <Text variant="titleLarge" style={styles.loadingText}>
          Analyzing medication...
        </Text>
        
        {/* Subtitle */}
        <Text variant="bodyMedium" style={styles.subtitleText}>
          Please wait while we process your prescription
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.global,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  logoFallback: {
    width: 200,
    height: 200,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 100,
  },
  logoText: {
    fontSize: 64,
    marginBottom: 8,
  },
  logoSubtext: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  loadingText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    color: theme.colors.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});