import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { DateTracker } from '../../components/DateTracker';
import { MedicationCard } from '../../components/MedicationCard';
import { SwipeableMedicationCard } from '../../components/SwipeableMedicationCard';
import { PlaceholderIcon } from '../../components/PlaceholderIcons';
import { MedicationContext } from '../../state/MedicationContext';
import { getMedicationsForDate } from '../../utils/demoData';
import { theme, spacing, fontSizes } from '../../theme/theme';

export default function HomeScreen(): JSX.Element {
  const [selectedDateOffset, setSelectedDateOffset] = useState(0);
  const context = useContext(MedicationContext);
  
  if (!context) {
    throw new Error('HomeScreen must be used within a MedicationProvider');
  }
  
  // Combine medications with user-added ones at the top
  const demoMedications = getMedicationsForDate(selectedDateOffset);
  const userMedications = context.dateMedications[selectedDateOffset.toString()] || [];
  const medications = [...userMedications, ...demoMedications]; // User meds first

  const handleDeleteMedication = (medicationId: string) => {
    // Only allow deleting user-added medications (not demo data)
    const isUserMedication = userMedications.some(med => med.id === medicationId);
    if (isUserMedication) {
      context.removeMedication(medicationId, selectedDateOffset);
    }
  };

  const handleToggleTaken = (medicationId: string) => {
    const isUserMedication = userMedications.some(med => med.id === medicationId);
    const isDemoMedication = demoMedications.some(med => med.id === medicationId);
    
    if (isUserMedication) {
      context.toggleMedicationTaken(medicationId, selectedDateOffset, false);
    } else if (isDemoMedication) {
      context.toggleMedicationTaken(medicationId, selectedDateOffset, true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Branding */}
        <View style={styles.brandingSection}>
          <View style={styles.logoRow}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Date Tracker Section */}
        <DateTracker onDateChange={setSelectedDateOffset} />

        {/* To take Today Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.toTakeText}>To take</Text>
            <Text style={styles.todayText}>Today</Text>
          </View>
          <Text style={styles.editText}>Edit</Text>
        </View>

        {/* Medication List */}
        <View style={styles.medicationList}>
          {medications.map((medication) => {
            const isUserMedication = userMedications.some(med => med.id === medication.id);
            const isDemoMedication = demoMedications.some(med => med.id === medication.id);
            
            // For demo medications, override taken state with our tracked state
            let displayMedication = medication;
            if (isDemoMedication) {
              const demoTakenState = context.demoMedicationStates[medication.id] || false;
              displayMedication = {
                ...medication,
                schedule: medication.schedule.map(s => ({ ...s, taken: demoTakenState }))
              };
            }
            
            // Only make user-added medications swipeable
            if (isUserMedication) {
              return (
                <SwipeableMedicationCard
                  key={medication.id}
                  medication={displayMedication}
                  onDelete={handleDeleteMedication}
                  onToggleTaken={handleToggleTaken}
                />
              );
            } else {
              // Demo medications are clickable but not swipeable
              return (
                <MedicationCard 
                  key={medication.id} 
                  medication={displayMedication}
                  onToggleTaken={handleToggleTaken}
                />
              );
            }
          })}
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  brandingSection: {
    paddingHorizontal: spacing.global,
    paddingTop: spacing.vertical,
    paddingBottom: spacing.vertical / 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.global,
    marginTop: spacing.vertical,
    marginBottom: spacing.vertical,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  toTakeText: {
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginRight: 8,
  },
  todayText: {
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  editText: {
    fontSize: fontSizes.body,
    color: theme.colors.secondary,
    fontWeight: '500',
  },
  medicationList: {
    flex: 1,
  },
  bottomSpacing: {
    height: 120, // Space for tab bar
  },
});