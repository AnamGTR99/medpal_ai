import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PlaceholderIcon } from '../components/PlaceholderIcons';
import { theme, spacing } from '../theme/theme';
import { ScannedData } from '../types';

export default function ConfirmScanScreen(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams<ScannedData>();
  const [isDetailedViewVisible, setIsDetailedViewVisible] = useState(false);

  const handleHome = () => {
    router.replace('/(tabs)');
  };

  const handleLearnMore = () => {
    console.log('Learn More pressed');
    // TODO: Navigate to learn more screen or show modal
  };

  const handleAddReminder = () => {
    console.log('Add Reminder pressed');
    // TODO: Add medication to context and navigate to home
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
            <PlaceholderIcon name="home" size={24} color={theme.colors.onSurface} />
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
              <View>
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

            {/* Toggle Button (Question Mark) */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsDetailedViewVisible(!isDetailedViewVisible)}
            >
              <Text style={styles.toggleButtonText}>?</Text>
            </TouchableOpacity>

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
    backgroundColor: theme.colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
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
    marginRight: 40, // Space for speaker icon
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
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    right: 20, // Moved to where speaker button was
    padding: 8,
  },
  toggleButtonText: {
    fontSize: 24,
    color: theme.colors.onSurfaceVariant,
    fontWeight: 'bold',
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