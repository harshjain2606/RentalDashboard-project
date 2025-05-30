import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItems, setItems, addItem, updateItem, deleteItem } from '../utils/localStorageUtils';

interface Rental {
  id: string;
  equipmentId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: 'Reserved' | 'Rented' | 'Returned';
}

interface RentalsContextType {
  rentals: Rental[];
  addRental: (rental: Omit<Rental, 'id'>) => void;
  updateRental: (id: string, rental: Partial<Rental>) => void;
  deleteRental: (id: string) => void;
  getRentalsByEquipment: (equipmentId: string) => Rental[];
  getRentalsByCustomer: (customerId: string) => Rental[];
}

const RentalsContext = createContext<RentalsContextType | undefined>(undefined);

export const RentalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    const storedRentals = getItems('rentals');
    setRentals(storedRentals);
  }, []);

  const addRental = (newRental: Omit<Rental, 'id'>) => {
    const rental = {
      ...newRental,
      id: `r${Date.now()}`
    };
    addItem('rentals', rental);
    setRentals(prev => [...prev, rental]);
  };

  const updateRental = (id: string, updatedRental: Partial<Rental>) => {
    updateItem('rentals', id, updatedRental);
    setRentals(prev => prev.map(r => r.id === id ? { ...r, ...updatedRental } : r));
  };

  const deleteRental = (id: string) => {
    deleteItem('rentals', id);
    setRentals(prev => prev.filter(r => r.id !== id));
  };

  const getRentalsByEquipment = (equipmentId: string) => {
    return rentals.filter(r => r.equipmentId === equipmentId);
  };

  const getRentalsByCustomer = (customerId: string) => {
    return rentals.filter(r => r.customerId === customerId);
  };

  return (
    <RentalsContext.Provider value={{
      rentals,
      addRental,
      updateRental,
      deleteRental,
      getRentalsByEquipment,
      getRentalsByCustomer
    }}>
      {children}
    </RentalsContext.Provider>
  );
};

export const useRentals = () => {
  const context = useContext(RentalsContext);
  if (context === undefined) {
    throw new Error('useRentals must be used within a RentalsProvider');
  }
  return context;
};