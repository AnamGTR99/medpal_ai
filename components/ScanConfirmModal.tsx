import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Card, Button, TextInput, Text } from 'react-native-paper';
import { ScannedData } from '../services/AIService';
import { theme, spacing, fontSizes } from '../theme/theme';

interface ScanConfirmModalProps {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (data: ScannedData) => void;
  initialData: ScannedData | null;
}

export function ScanConfirmModal({ 
  visible, 
  onDismiss, 
  onConfirm, 
  initialData 
}: ScanConfirmModalProps): JSX.Element {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [summary, setSummary] = useState('');
  const [schedule, setSchedule] = useState<string[]>([]);
  const [scheduleText, setScheduleText] = useState('');

  // Initialize form data when modal opens
  useEffect(() => {
    if (initialData && visible) {
      setName(initialData.name || '');
      setDosage(initialData.dosage || '');
      setSummary(initialData.summary || '');
      setSchedule(initialData.schedule || []);
      setScheduleText((initialData.schedule || []).join(', '));
    }
  }, [initialData, visible]);

  const handleConfirm = () => {
    // Parse schedule text back to array
    const parsedSchedule = scheduleText
      .split(',')
      .map(time => time.trim())
      .filter(time => time.length > 0);

    const confirmData: ScannedData = {
      name: name.trim(),
      dosage: dosage.trim(),
      summary: summary.trim(),
      schedule: parsedSchedule,
    };

    onConfirm(confirmData);
  };

  const isFormValid = name.trim().length > 0 && dosage.trim().length > 0;

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modal}
    >
      <Card style={styles.card}>
        <Card.Title 
          title="Verify Information" 
          titleStyle={styles.cardTitle}
        />
        
        <Card.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.instructionText}>
              Please review and edit the information below:
            </Text>

            <TextInput
              label="Medication Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />

            <TextInput
              label="Dosage (e.g., 20mg, 1 tablet)"
              value={dosage}
              onChangeText={setDosage}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />

            <TextInput
              label="What is this medication for?"
              value={summary}
              onChangeText={setSummary}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={2}
              theme={{ colors: { primary: theme.colors.primary } }}
            />

            <TextInput
              label="Schedule (e.g., 09:00 AM, 09:00 PM)"
              value={scheduleText}
              onChangeText={setScheduleText}
              mode="outlined"
              style={styles.input}
              placeholder="Enter times separated by commas"
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          </ScrollView>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={onDismiss}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleConfirm}
            disabled={!isFormValid}
            buttonColor={theme.colors.primary}
            style={styles.confirmButton}
          >
            Add Medication
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: spacing.global,
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    maxHeight: '80%',
  },
  cardTitle: {
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  instructionText: {
    fontSize: fontSizes.body,
    color: theme.colors.secondary,
    marginBottom: spacing.vertical,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.vertical,
    backgroundColor: theme.colors.background,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.vertical,
    paddingBottom: spacing.vertical,
  },
  cancelButton: {
    flex: 0.45,
  },
  confirmButton: {
    flex: 0.45,
  },
});