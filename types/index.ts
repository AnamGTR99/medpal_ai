export interface MedicationSchedule {
  time: string; // e.g., "10:00 AM"
  taken: boolean; // For future use, not actively used in Phase 2 display
}

export interface Medication {
  id: string; // Unique identifier
  name: string; // e.g., "MEDICINE NAME"
  instructions: string; // e.g., "1 pill after eating food"
  icon: string; // The placeholder emoji for the pill icon, e.g., '😀'
  iconBackgroundColor: string; // A light, pastel color for the icon's background circle
  schedule: MedicationSchedule[]; // Array for multiple times if needed, for Home Screen only show first
}

export interface MedicationContextType {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id'>) => void;
}

export interface ScannedData {
  name: string;
  doses: string; // e.g., "1 pill"
  instructions: string; // e.g., "after meal", "before food", "with water"
  frequency: string; // e.g., "Twice daily"
  treatment: string; // For the short "Treatment:" line
  sideEffects: string; // For the short "Possible Side Effects:" line
  detailedDescription: string; // The original full paragraph for the toggle view
  imageUri: string; // A local URI for the captured image
}