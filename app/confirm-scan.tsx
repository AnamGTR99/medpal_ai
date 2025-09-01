import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PlaceholderIcon } from '../components/PlaceholderIcons';
import { MedicationContext } from '../state/MedicationContext';
import { theme, spacing } from '../theme/theme';
import { ScannedData } from '../types';

export default function ConfirmScanScreen(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<ScannedData>();
  const [isDetailedViewVisible, setIsDetailedViewVisible] = useState(false);
  const context = useContext(MedicationContext);

  if (!context) {
    throw new Error('ConfirmScanScreen must be used within a MedicationProvider');
  }

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  const handleLearnMore = () => {
    console.log('Learn More pressed');
    // TODO: Navigate to learn more screen or show modal
  };

  const handleAddReminder = () => {
    console.log('Add Reminder pressed - Adding medication:', params.name);
    
    // Add the scanned medication to today's medication list
    context.addScannedMedication({
      name: params.name || 'Unknown Medication',
      doses: params.doses || '1 dose',
      instructions: params.instructions || '',
      frequency: params.frequency || 'Daily',
      treatment: params.treatment || '',
      sideEffects: params.sideEffects || '',
      detailedDescription: params.detailedDescription || '',
      imageUri: params.imageUri || ''
    }, 0); // 0 = today
    
    // Navigate back to home
    router.replace('/(tabs)');
  };

  const handleEdit = () => {
    console.log('Edit pressed');
    // TODO: Navigate to edit screen
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header with Home Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleHome} style={styles.homeButton}>
            <Image
              source={require('../assets/images/home.png')}
              style={styles.homeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Main Title */}
        <Text variant="headlineLarge" style={styles.title}>
          Scan Results
        </Text>

        {/* Image & Data Pills Section */}
        <View style={styles.imageDataSection}>
          {/* Left Side - Image */}
          <Image
            source={{ uri: params.imageUri }}
            style={styles.medicationImage}
          />

          {/* Right Side - Data Boxes */}
          <View style={styles.dataSection}>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text variant="titleMedium" style={styles.infoBoxText}>
                {params.name}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text variant="titleMedium" style={styles.infoBoxText}>
                {params.doses}
              </Text>
              {params.instructions && (
                <Text variant="titleMedium" style={styles.instructionsText}>
                  {params.instructions}
                </Text>
              )}
            </View>

            <View style={styles.infoBox}>
              <Image
                source={require('../assets/images/clock.png')}
                style={styles.clockIcon}
                resizeMode="contain"
              />
              <Text variant="titleMedium" style={styles.infoBoxText}>
                {params.frequency}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        <Card style={styles.descriptionCard}>
          <Card.Content style={styles.cardContent}>
            {isDetailedViewVisible ? (
              // DETAILED VIEW (when question mark is tapped)
              <Text variant="bodyLarge" style={styles.descriptionText}>
                {params.detailedDescription}
              </Text>
            ) : (
              // STRUCTURED SUMMARY VIEW (default)
              <View style={styles.summaryContainer}>
                <View style={styles.summarySection}>
                  <Text variant="bodyLarge" style={styles.summaryLabel}>Treatment:</Text>
                  <Text variant="bodyMedium" style={styles.summaryValue}>{params.treatment}</Text>
                </View>
                <View style={styles.summarySection}>
                  <Text variant="bodyLarge" style={styles.summaryLabel}>Possible Side Effects:</Text>
                  <Text variant="bodyMedium" style={styles.summaryValue}>{params.sideEffects}</Text>
                </View>
              </View>
            )}

            {/* Toggle Button (More Info) */}
            <Button
              mode="contained"
              onPress={() => setIsDetailedViewVisible(!isDetailedViewVisible)}
              style={styles.moreInfoButton}
              contentStyle={styles.moreInfoButtonContent}
              icon={() => (
                <Image
                  source={require('../assets/images/moreinfo.png')}
                  style={styles.moreInfoIcon}
                  resizeMode="contain"
                />
              )}
            >
            </Button>

          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            buttonColor={theme.colors.surface}
            textColor={theme.colors.onSurface}
            style={styles.learnMoreButton}
            onPress={handleLearnMore}
          >
            Learn More
          </Button>
          
          <Button
            mode="contained"
            buttonColor={theme.colors.primary}
            textColor="white"
            style={styles.addReminderButton}
            onPress={handleAddReminder}
          >
            Add Reminder
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.global,
    paddingBottom: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  homeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  homeIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.onSurface,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 30,
    color: theme.colors.onSurface,
  },
  imageDataSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  medicationImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    resizeMode: 'cover',
  },
  dataSection: {
    flex: 1,
    marginLeft: 20,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
  },
  infoBoxText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionsText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  clockIcon: {
    position: 'absolute',
    top: 8,
    left: 12,
    width: 19,
    height: 19,
    tintColor: theme.colors.onSurfaceVariant,
  },
  descriptionCard: {
    backgroundColor: theme.colors.surface,
    marginBottom: 30,
    elevation: 2,
  },
  cardContent: {
    padding: 20,
    position: 'relative',
  },
  descriptionText: {
    lineHeight: 22,
    color: theme.colors.onSurface,
    marginRight: 40, // Space for more info icon
    marginTop: 10, // Account for icon at top
  },
  summaryContainer: {
    marginRight: 40, // Space for more info icon
    marginTop: 10, // Account for icon at top
  },
  summarySection: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  summaryValue: {
    color: theme.colors.onSurface,
    lineHeight: 20,
  },
  moreInfoButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'transparent',
    elevation: 0,
    width: 37,
    height: 37,
    borderRadius: 18.5,
  },
  moreInfoButtonContent: {
    width: 37,
    height: 37,
  },
  moreInfoIcon: {
    width: 22,
    height: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
    marginTop: 20,
  },
  learnMoreButton: {
    flex: 1,
    borderRadius: 8,
  },
  addReminderButton: {
    flex: 1,
    borderRadius: 8,
  },
});