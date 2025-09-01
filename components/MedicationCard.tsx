import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { PlaceholderIcon } from './PlaceholderIcons';
import { Medication } from '../types';
import { theme, spacing, fontSizes } from '../theme/theme';

interface MedicationCardProps {
  medication: Medication;
  onToggleTaken?: (medicationId: string) => void;
}

export function MedicationCard({ medication, onToggleTaken }: MedicationCardProps): JSX.Element {
  const isTaken = medication.schedule[0]?.taken || false;

  const handlePress = () => {
    if (onToggleTaken) {
      onToggleTaken(medication.id);
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={[styles.card, isTaken && styles.takenCard]}>
        <View style={styles.cardContent}>
        {/* Left Icon Circle */}
        <View style={[
          styles.iconCircle, 
          { backgroundColor: medication.iconBackgroundColor }
        ]}>
          {medication.iconImage ? (
            <Image 
              source={medication.iconImage} 
              style={styles.iconImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.iconEmoji}>{medication.icon}</Text>
          )}
        </View>

        {/* Middle Text Content */}
        <View style={styles.textContent}>
          <Text style={[
            styles.medicationName,
            isTaken && styles.takenText
          ]}>
            {medication.name}
          </Text>
          <Text style={[
            styles.instructions,
            isTaken && styles.takenText
          ]}>
            {medication.instructions}
          </Text>
          <View style={styles.timeRow}>
            <Image
              source={require('../assets/images/clock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={[
              styles.timeText,
              isTaken && styles.takenText
            ]}>
              {medication.schedule[0]?.time}
            </Text>
          </View>
        </View>

        {/* Right "Taken" Indicator */}
        <View style={styles.takenIndicator}>
          <View style={[
            styles.takenCircle,
            isTaken && styles.takenCircleFilled
          ]} />
        </View>
      </View>
    </Card>
    </TouchableOpacity>
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
  iconImage: {
    width: 32,
    height: 32,
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
  clockIcon: {
    width: 14,
    height: 14,
    tintColor: theme.colors.secondary,
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
  takenCard: {
    opacity: 0.6,
    backgroundColor: '#F0F0F0',
  },
  takenText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  takenCircleFilled: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});