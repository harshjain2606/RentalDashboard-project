import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItems, setItems, addItem, updateItem, deleteItem } from '../utils/localStorageUtils';

interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: string;
  status: string;
}

interface EquipmentContextType {
  equipment: Equipment[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentById: (id: string) => Equipment | undefined;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    const storedEquipment = getItems('equipment');
    setEquipment(storedEquipment);
  }, []);

  const addEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const equipment = {
      ...newEquipment,
      id: `eq${Date.now()}`
    };
    addItem('equipment', equipment);
    setEquipment(prev => [...prev, equipment]);
  };

  const updateEquipment = (id: string, updatedEquipment: Partial<Equipment>) => {
    updateItem('equipment', id, updatedEquipment);
    setEquipment(prev => prev.map(eq => eq.id === id ? { ...eq, ...updatedEquipment } : eq));
  };

  const deleteEquipment = (id: string) => {
    deleteItem('equipment', id);
    setEquipment(prev => prev.filter(eq => eq.id !== id));
  };

  const getEquipmentById = (id: string) => {
    return equipment.find(eq => eq.id === id);
  };

  return (
    <EquipmentContext.Provider value={{
      equipment,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      getEquipmentById
    }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (context === undefined) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
};