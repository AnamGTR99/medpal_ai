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