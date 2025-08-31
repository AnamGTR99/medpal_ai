import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PlaceholderIcon } from './PlaceholderIcons';
import { theme, spacing, fontSizes } from '../theme/theme';

interface DateChip {
  date: number;
  day: string;
  fullDate: Date;
  isSelected: boolean;
}

export function DateTracker(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate 5 days starting from today
  const generateDateChips = (): DateChip[] => {
    const chips: DateChip[] = [];
    const today = new Date();
    
    for (let i = -2; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      chips.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date,
        isSelected: date.toDateString() === selectedDate.toDateString(),
      });
    }
    
    return chips;
  };

  const dateChips = generateDateChips();
  const currentDate = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).replace(/^\w/, c => c.toUpperCase());

  return (
    <View style={styles.container}>
      {/* Current Date Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Today, {currentDate.replace('Today, ', '')}</Text>
        <PlaceholderIcon name="down" size={16} color={theme.colors.secondary} />
      </View>

      {/* Date Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
        style={styles.scrollView}
      >
        {dateChips.map((chip, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateChip,
              chip.isSelected && styles.selectedChip
            ]}
            onPress={() => setSelectedDate(chip.fullDate)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.chipNumber,
              chip.isSelected && styles.selectedChipText
            ]}>
              {chip.date}
            </Text>
            <Text style={[
              styles.chipDay,
              chip.isSelected && styles.selectedChipText
            ]}>
              {chip.day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.vertical,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.vertical,
    paddingHorizontal: spacing.global,
  },
  headerText: {
    fontSize: fontSizes.h2,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginRight: 8,
  },
  scrollView: {
    paddingLeft: spacing.global,
  },
  chipContainer: {
    paddingRight: spacing.global,
  },
  dateChip: {
    width: 60,
    height: 80,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  chipNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  chipDay: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.secondary,
  },
  selectedChipText: {
    color: 'white',
  },
});