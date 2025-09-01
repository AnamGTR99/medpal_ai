import { Medication, ScannedData } from '../types';

export const demoData: Medication[] = [
  {
    id: '1',
    name: 'MEDICINE NAME',
    instructions: '1 pill after eating food',
    icon: '😀', // Placeholder icon 1
    iconBackgroundColor: '#FADADD', // Light pink
    schedule: [{ time: '10:00am', taken: false }],
  },
  {
    id: '2',
    name: 'MEDICINE NAME',
    instructions: '2 pill after eating food',
    icon: '😊', // Placeholder icon 2
    iconBackgroundColor: '#DAE7F5', // Light blue
    schedule: [{ time: '10:00am', taken: false }],
  },
  {
    id: '3',
    name: 'MEDICINE NAME',
    instructions: '1 pill before bed',
    icon: '🙂', // Placeholder icon 3
    iconBackgroundColor: '#E0DAF5', // Light purple
    schedule: [{ time: '9:00pm', taken: false }],
  },
];

export const demoScannedData: ScannedData = {
  name: 'Roxithromycin',
  doses: '1 Pill',
  instructions: 'after meal',
  frequency: 'Twice Daily',
  treatment: 'Respiratory tract, urinary and soft tissue infections',
  sideEffects: 'Nausea, vomiting, abdominal pain',
  detailedDescription: 'Roxithromycin is a macrolide antibiotic used to treat respiratory tract, urinary and soft tissue infections. Possible side effects include nausea, vomiting, and abdominal pain.',
  imageUri: 'https://via.placeholder.com/120x120/E8E8E8/666666?text=RX', // Placeholder image URL
};