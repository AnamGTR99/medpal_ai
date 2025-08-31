import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { PlaceholderIcon } from './PlaceholderIcons';
import { Medication } from '../types';
import { theme, spacing, fontSizes } from '../theme/theme';

interface MedicationCardProps {
  medication: Medication;
}

export function MedicationCard({ medication }: MedicationCardProps): JSX.Element {
  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Left Icon Circle */}
        <View style={[
          styles.iconCircle, 
          { backgroundColor: medication.iconBackgroundColor }
        ]}>
          <Text style={styles.iconEmoji}>{medication.icon}</Text>
        </View>

        {/* Middle Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.medicationName}>{medication.name}</Text>
          <Text style={styles.instructions}>{medication.instructions}</Text>
          <View style={styles.timeRow}>
            <PlaceholderIcon name="clock" size={14} color={theme.colors.secondary} />
            <Text style={styles.timeText}>{medication.schedule[0]?.time}</Text>
          </View>
        </View>

        {/* Right "Taken" Indicator */}
        <View style={styles.takenIndicator}>
          <View style={styles.takenCircle} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: spacing.global,
    marginVertical: spacing.vertical / 2,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.vertical,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.vertical,
  },
  iconEmoji: {
    fontSize: 24,
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  medicationName: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  instructions: {
    fontSize: fontSizes.body,
    color: theme.colors.onSurface,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: fontSizes.body,
    color: theme.colors.secondary,
    marginLeft: 6,
  },
  takenIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.vertical,
  },
  takenCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
});