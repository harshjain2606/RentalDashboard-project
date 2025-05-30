// Initial mock data
const mockData = {
  users: [
    { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
    { id: "2", role: "Staff", email: "staff@entnt.in", password: "staff123" },
    { id: "3", role: "Customer", email: "customer@entnt.in", password: "cust123" }
  ],
  equipment: [
    { 
      id: "eq1", 
      name: "Excavator", 
      category: "Heavy Machinery", 
      condition: "Good",
      status: "Available" 
    },
    { 
      id: "eq2", 
      name: "Concrete Mixer", 
      category: "Construction", 
      condition: "Excellent",
      status: "Rented" 
    }
  ],
  rentals: [
    { 
      id: "r1", 
      equipmentId: "eq2", 
      customerId: "3", 
      startDate: "2025-06-01",
      endDate: "2025-06-05", 
      status: "Reserved" 
    }
  ],
  maintenance: [
    { 
      id: "m1", 
      equipmentId: "eq1", 
      date: "2025-05-20", 
      type: "Routine Check", 
      notes: "No issues found" 
    }
  ]
};

// Initialize localStorage with mock data if empty
export const initializeStorage = () => {
  Object.entries(mockData).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
};

// Generic CRUD operations
export const getItems = (key: string) => {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

export const setItems = (key: string, items: any[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const addItem = (key: string, item: any) => {
  const items = getItems(key);
  items.push(item);
  setItems(key, items);
};

export const updateItem = (key: string, id: string, updatedItem: any) => {
  const items = getItems(key);
  const index = items.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    setItems(key, items);
  }
};

export const deleteItem = (key: string, id: string) => {
  const items = getItems(key);
  const filteredItems = items.filter((item: any) => item.id !== id);
  setItems(key, filteredItems);
};