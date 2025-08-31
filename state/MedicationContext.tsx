import React, { createContext, useState, ReactNode } from 'react';
import { Medication, MedicationContextType } from '../types';
import { demoData } from '../utils/demoData';

export const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider = ({ children }: MedicationProviderProps): JSX.Element => {
  const [medications, setMedications] = useState<Medication[]>(demoData);
  
  const addMedication = (med: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...med,
      id: Date.now().toString(), // Simple ID generation
    };
    setMedications(prev => [...prev, newMedication]);
  };

  return (
    <MedicationContext.Provider value={{ medications, addMedication }}>
      {children}
    </MedicationContext.Provider>
  );
};