import React, { useRef, useState } from 'react';
import { View, Animated, Dimensions, PanResponder, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MedicationCard } from './MedicationCard';
import { Medication } from '../types';
import { theme } from '../theme/theme';

interface SwipeableMedicationCardProps {
  medication: Medication;
  onDelete: (medicationId: string) => void;
  onToggleTaken?: (medicationId: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function SwipeableMedicationCard({ medication, onDelete, onToggleTaken }: SwipeableMedicationCardProps): JSX.Element {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handleLongPress = () => {
    setShowDeleteButton(true);
  };

  const handleDelete = () => {
    onDelete(medication.id);
  };

  const handleCancel = () => {
    setShowDeleteButton(false);
  };

  if (showDeleteButton) {
    return (
      <View style={styles.container}>
        <View style={styles.medicationWrapper}>
          <MedicationCard medication={medication} onToggleTaken={onToggleTaken} />
        </View>
        <View style={styles.deleteOverlay}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity onLongPress={handleLongPress} delayLongPress={800}>
      <MedicationCard medication={medication} onToggleTaken={onToggleTaken} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  medicationWrapper: {
    opacity: 0.7,
  },
  deleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});