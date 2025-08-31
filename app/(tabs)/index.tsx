import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { DateTracker } from '../../components/DateTracker';
import { MedicationCard } from '../../components/MedicationCard';
import { PlaceholderIcon } from '../../components/PlaceholderIcons';
import { MedicationContext } from '../../state/MedicationContext';
import { theme, spacing, fontSizes } from '../../theme/theme';

export default function HomeScreen(): JSX.Element {
  const context = useContext(MedicationContext);
  
  if (!context) {
    throw new Error('HomeScreen must be used within a MedicationProvider');
  }
  
  const { medications } = context;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Branding */}
        <View style={styles.brandingSection}>
          <View style={styles.logoRow}>
            <PlaceholderIcon name="pill" size={32} color={theme.colors.primary} />
            <Text style={styles.logoText}>MedPAL</Text>
          </View>
        </View>

        {/* Date Tracker Section */}
        <DateTracker />

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
          {medications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
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
  },
  logoText: {
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 8,
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