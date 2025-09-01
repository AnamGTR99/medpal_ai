import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { theme, spacing, fontSizes } from '../../theme/theme';

export default function SettingsScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Meds</Text>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Medication Library</Title>
            <Paragraph>View and manage all your medications...</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Medication History</Title>
            <Paragraph>Track your medication intake history...</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Export to PDF</Title>
            <Paragraph>Generate instant reports of your weekly prescription cycle to any caretaker or specialist doctor</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: spacing.global,
    paddingTop: 60,
  },
  title: {
    fontSize: fontSizes.h1,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: spacing.vertical,
  },
  content: {
    padding: spacing.global,
    paddingBottom: 120, // Extra space for tab bar
  },
  card: {
    marginBottom: spacing.vertical,
    backgroundColor: theme.colors.surface,
  },
  cardTitle: {
    color: theme.colors.primary,
  },
});