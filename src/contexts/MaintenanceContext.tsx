import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItems, setItems, addItem, updateItem, deleteItem } from '../utils/localStorageUtils';

interface Maintenance {
  id: string;
  equipmentId: string;
  date: string;
  type: string;
  notes: string;
}

interface MaintenanceContextType {
  maintenance: Maintenance[];
  addMaintenance: (maintenance: Omit<Maintenance, 'id'>) => void;
  updateMaintenance: (id: string, maintenance: Partial<Maintenance>) => void;
  deleteMaintenance: (id: string) => void;
  getMaintenanceByEquipment: (equipmentId: string) => Maintenance[];
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  useEffect(() => {
    const storedMaintenance = getItems('maintenance');
    setMaintenance(storedMaintenance);
  }, []);

  const addMaintenance = (newMaintenance: Omit<Maintenance, 'id'>) => {
    const maintenance = {
      ...newMaintenance,
      id: `m${Date.now()}`
    };
    addItem('maintenance', maintenance);
    setMaintenance(prev => [...prev, maintenance]);
  };

  const updateMaintenance = (id: string, updatedMaintenance: Partial<Maintenance>) => {
    updateItem('maintenance', id, updatedMaintenance);
    setMaintenance(prev => prev.map(m => m.id === id ? { ...m, ...updatedMaintenance } : m));
  };

  const deleteMaintenance = (id: string) => {
    deleteItem('maintenance', id);
    setMaintenance(prev => prev.filter(m => m.id !== id));
  };

  const getMaintenanceByEquipment = (equipmentId: string) => {
    return maintenance.filter(m => m.equipmentId === equipmentId);
  };

  return (
    <MaintenanceContext.Provider value={{
      maintenance,
      addMaintenance,
      updateMaintenance,
      deleteMaintenance,
      getMaintenanceByEquipment
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};