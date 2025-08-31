import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { PlaceholderIcon } from '../components/PlaceholderIcons';
import { ScanConfirmModal } from '../components/ScanConfirmModal';
import { processImage, ScannedData } from '../services/AIService';
import { theme, spacing, fontSizes } from '../theme/theme';

export default function ScanModal(): JSX.Element {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Safe navigation function with fallback
  const navigateBack = () => {
    try {
      // Use setTimeout to ensure router is ready
      setTimeout(() => {
        if (router && typeof router.back === 'function') {
          router.back();
        } else if (router && typeof router.replace === 'function') {
          router.replace('/(tabs)');
        } else {
          console.warn('Router navigation not available');
        }
      }, 0);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    
    try {
      setIsLoading(true);
      console.log('📸 Taking picture...');
      
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true,
        quality: 0.8,
      });
      
      if (!photo?.base64) {
        throw new Error('Failed to capture image');
      }
      
      console.log('🔍 Processing image with AI...');
      const result = await processImage(photo.base64);
      
      if (result) {
        console.log('✅ AI processing successful:', result);
        setScannedData(result);
        setIsModalVisible(true);
      } else {
        console.log('❌ AI processing failed');
      }
    } catch (error) {
      console.error('❌ Error during capture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = (data: ScannedData) => {
    console.log('✅ User confirmed medication data:', data);
    setIsModalVisible(false);
    navigateBack();
    // TODO: Save to MedicationContext in next phase
  };

  const handleDismiss = () => {
    setIsModalVisible(false);
  };

  // Show permission request screen
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <PlaceholderIcon name="camera" size={48} color={theme.colors.secondary} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            MedPal needs camera access to scan medication labels
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={navigateBack}
            style={styles.closeButton}
          >
            <PlaceholderIcon 
              name="close" 
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Point your camera at the medication label
          </Text>
        </View>

        <View style={styles.captureContainer}>
          <TouchableOpacity 
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={isLoading}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Analyzing medication...</Text>
          </View>
        </View>
      )}

      {/* Confirmation Modal */}
      <ScanConfirmModal
        visible={isModalVisible}
        onDismiss={handleDismiss}
        onConfirm={handleConfirm}
        initialData={scannedData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: spacing.global,
  },
  closeButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  instructionsContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: fontSizes.h2,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.h2,
    color: theme.colors.onSurface,
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.global,
  },
  permissionTitle: {
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: fontSizes.body,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: fontSizes.title,
    fontWeight: '600',
  },
});