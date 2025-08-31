import { Medication } from '../types';

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