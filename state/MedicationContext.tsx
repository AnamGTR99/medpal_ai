import React, { createContext, useState, ReactNode } from 'react';
import { Medication, MedicationContextType, ScannedData } from '../types';
import { demoData } from '../utils/demoData';

// Extended context to support date-based medications
interface ExtendedMedicationContextType extends MedicationContextType {
  addScannedMedication: (scannedData: ScannedData, dateOffset?: number) => void;
  removeMedication: (medicationId: string, dateOffset: number) => void;
  toggleMedicationTaken: (medicationId: string, dateOffset: number, isDemoMed?: boolean) => void;
  dateMedications: { [key: string]: Medication[] };
  setDateMedications: React.Dispatch<React.SetStateAction<{ [key: string]: Medication[] }>>;
  demoMedicationStates: { [key: string]: boolean };
  setDemoMedicationStates: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

export const MedicationContext = createContext<ExtendedMedicationContextType | undefined>(undefined);

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider = ({ children }: MedicationProviderProps): JSX.Element => {
  const [medications, setMedications] = useState<Medication[]>(demoData);
  const [dateMedications, setDateMedications] = useState<{ [key: string]: Medication[] }>({});
  const [demoMedicationStates, setDemoMedicationStates] = useState<{ [key: string]: boolean }>({});
  
  const addMedication = (med: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...med,
      id: Date.now().toString(),
    };
    setMedications(prev => [...prev, newMedication]);
  };

  const addScannedMedication = (scannedData: ScannedData, dateOffset: number = 0) => {
    const getRandomPillImage = () => {
      const pillImages = [
        require('../assets/images/pill1.png'),
        require('../assets/images/pill2.png'),
        require('../assets/images/pill3.png'),
      ];
      return pillImages[Math.floor(Math.random() * pillImages.length)];
    };

    const getRandomBackgroundColor = () => {
      const colors = ['#FADADD', '#DAE7F5', '#E0DAF5', '#FFE4B5', '#E6FFE6', '#FFE4E1', '#E0E6FF', '#FFF0E6', '#F0E6FF', '#E6F7FF'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const parseFrequencyToTime = (frequency: string): string => {
      const freq = frequency.toLowerCase();
      if (freq.includes('twice') || freq.includes('2')) return '8:00am';
      if (freq.includes('morning')) return '8:00am';
      if (freq.includes('evening') || freq.includes('night')) return '8:00pm';
      if (freq.includes('bedtime')) return '9:30pm';
      return '9:00am'; // default
    };

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: scannedData.name,
      instructions: `${scannedData.doses}${scannedData.instructions ? ' ' + scannedData.instructions : ''}`,
      icon: '💊',
      iconImage: getRandomPillImage(),
      iconBackgroundColor: getRandomBackgroundColor(),
      schedule: [{ time: parseFrequencyToTime(scannedData.frequency), taken: false }],
    };

    const dateKey = dateOffset.toString();
    setDateMedications(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newMedication]
    }));
  };

  const removeMedication = (medicationId: string, dateOffset: number) => {
    const dateKey = dateOffset.toString();
    setDateMedications(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(med => med.id !== medicationId)
    }));
  };

  const toggleMedicationTaken = (medicationId: string, dateOffset: number, isDemoMed: boolean = false) => {
    if (isDemoMed) {
      // Handle demo medication toggle
      setDemoMedicationStates(prev => ({
        ...prev,
        [medicationId]: !prev[medicationId]
      }));
    } else {
      // Handle user medication toggle
      const dateKey = dateOffset.toString();
      setDateMedications(prev => ({
        ...prev,
        [dateKey]: (prev[dateKey] || []).map(med => 
          med.id === medicationId 
            ? { ...med, schedule: med.schedule.map(s => ({ ...s, taken: !s.taken })) }
            : med
        )
      }));
    }
  };

  return (
    <MedicationContext.Provider value={{ 
      medications, 
      addMedication, 
      addScannedMedication,
      removeMedication,
      toggleMedicationTaken,
      dateMedications,
      setDateMedications,
      demoMedicationStates,
      setDemoMedicationStates
    }}>
      {children}
    </MedicationContext.Provider>
  );
};