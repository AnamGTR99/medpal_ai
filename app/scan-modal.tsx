import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { PlaceholderIcon } from '../components/PlaceholderIcons';
import { theme, spacing, fontSizes } from '../theme/theme';

export default function ScanModal(): JSX.Element {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const [permission, requestPermission] = useCameraPermissions();

  // Navigate back to home (tabs)
  const navigateBack = () => {
    try {
      console.log('🏠 Navigating back to home from scan modal');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    setIsCapturing(true);
    
    // Clear any previous scan data
    global.capturedImageUri = null;
    global.capturedImageBase64 = null;
    
    try {
      console.log('📸 Starting image capture...');
      
      // Capture image first, then navigate
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true,
        quality: 0.8,
      });
      
      if (photo?.uri && photo?.base64) {
        // Store both URI and base64 globally for later use
        global.capturedImageUri = photo.uri;
        global.capturedImageBase64 = photo.base64;
        console.log('✅ Picture captured and stored (URI + base64)');
        
        // Navigate to processing screen after image is captured
        console.log('🚀 Navigating to processing screen with image data');
        router.replace({
          pathname: '/processing'
        });
      } else {
        throw new Error('Failed to capture image');
      }
    } catch (error) {
      console.error('❌ Error during capture:', error);
      setIsCapturing(false);
    }
  };

  // Confirmation handling now moved to confirm-scan screen

  const handleTutorial = () => {
    console.log('Tutorial button pressed');
    // TODO: Navigate to tutorial or show tutorial modal
  };

  const handleGalleryOrFlash = () => {
    console.log('Gallery/Flash button pressed');
    // TODO: Open gallery or toggle flash
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
        {/* Close Button - Top Left */}
        <View style={styles.topBar}>
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

        {/* Top Guide Message */}
        <View style={styles.guideMessageContainer}>
          <Text style={styles.guideMessage}>
            Place label inside the frame
          </Text>
        </View>

        {/* Scanning Frame Overlay */}
        <View style={styles.frameContainer}>
          <View style={styles.scanningFrame} />
        </View>

        {/* Tutorial Button */}
        <View style={styles.tutorialContainer}>
          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={handleTutorial}
          >
            <Text style={styles.tutorialButtonText}>
              Need a tutorial?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Capture Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity 
            style={styles.leftButton}
            onPress={handleGalleryOrFlash}
          >
            <Text style={styles.leftButtonText}>+</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.scanButton, isCapturing && styles.scanButtonDisabled]}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            <Text style={styles.scanButtonText}>
              {isCapturing ? 'Capturing...' : 'Scan'}
            </Text>
          </TouchableOpacity>
          
          {/* Empty view for spacing */}
          <View style={styles.rightSpacer} />
        </View>
      </CameraView>
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
  
  // Top Bar with Close Button
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Top Guide Message
  guideMessageContainer: {
    position: 'absolute',
    top: 120,
    left: 40,
    right: 40,
    zIndex: 5,
    alignItems: 'center',
  },
  guideMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Scanning Frame
  frameContainer: {
    position: 'absolute',
    top: 200,
    left: '10%',
    right: '10%',
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  scanningFrame: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: '#9C27B0',
    borderRadius: 20,
    backgroundColor: 'transparent',
    shadowColor: '#9C27B0',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 15,
  },

  // Tutorial Button
  tutorialContainer: {
    position: 'absolute',
    top: 480,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  tutorialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  tutorialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },

  // Bottom Buttons
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  leftButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: '300',
  },
  scanButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: 'rgba(156, 39, 176, 0.5)',
    opacity: 0.7,
  },
  rightSpacer: {
    width: 60,
  },

  // Loading Overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
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

  // Permission Screens
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