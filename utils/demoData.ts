import { Medication, ScannedData } from '../types';

// Helper function to randomly select a pill image
const getRandomPillImage = () => {
  const pillImages = [
    require('../assets/images/pill1.png'),
    require('../assets/images/pill2.png'),
    require('../assets/images/pill3.png'),
  ];
  return pillImages[Math.floor(Math.random() * pillImages.length)];
};

// Date-based medication data - each date gets different medications
const medicationsByDate: { [key: string]: Medication[] } = {
  // Default/Today - Reduced to 1 pill
  'default': [
    {
      id: '1',
      name: 'Lisinopril',
      instructions: '1 tablet with water',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#FADADD',
      schedule: [{ time: '8:00am', taken: false }],
    },
  ],
  // Previous days
  '-2': [
    {
      id: '4',
      name: 'Ibuprofen',
      instructions: '1 tablet as needed',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#FFE4B5',
      schedule: [{ time: '12:00pm', taken: true }],
    },
    {
      id: '5',
      name: 'Vitamin D3',
      instructions: '1 capsule with meal',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#E6FFE6',
      schedule: [{ time: '1:00pm', taken: true }],
    },
  ],
  '-1': [
    {
      id: '6',
      name: 'Atorvastatin',
      instructions: '1 tablet at bedtime',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#FFE4E1',
      schedule: [{ time: '10:00pm', taken: true }],
    },
    {
      id: '7',
      name: 'Omeprazole',
      instructions: '1 capsule before breakfast',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#E0E6FF',
      schedule: [{ time: '7:30am', taken: true }],
    },
    {
      id: '8',
      name: 'Amlodipine',
      instructions: '1 tablet daily',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#FFF0E6',
      schedule: [{ time: '9:00am', taken: true }],
    },
  ],
  // Future days
  '1': [
    {
      id: '9',
      name: 'Aspirin',
      instructions: '1 tablet with food',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#F0E6FF',
      schedule: [{ time: '8:00am', taken: false }],
    },
    {
      id: '10',
      name: 'Losartan',
      instructions: '1 tablet morning',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#E6F7FF',
      schedule: [{ time: '8:15am', taken: false }],
    },
  ],
  '2': [
    {
      id: '11',
      name: 'Sertraline',
      instructions: '1 tablet daily',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#F5F5DC',
      schedule: [{ time: '7:00am', taken: false }],
    },
    {
      id: '12',
      name: 'Levothyroxine',
      instructions: '1 tablet on empty stomach',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#FFEFD5',
      schedule: [{ time: '6:30am', taken: false }],
    },
    {
      id: '13',
      name: 'Gabapentin',
      instructions: '1 capsule three times daily',
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: '#E0FFE0',
      schedule: [{ time: '7:00pm', taken: false }],
    },
  ],
};

// Function to get medications for a specific date offset
export const getMedicationsForDate = (dateOffset: number): Medication[] => {
  const key = dateOffset.toString();
  return medicationsByDate[key] || medicationsByDate['default'];
};

// Keep original export for backward compatibility
export const demoData: Medication[] = medicationsByDate['default'];

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