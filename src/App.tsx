import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EquipmentProvider } from './contexts/EquipmentContext';
import { RentalsProvider } from './contexts/RentalsContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginForm from './components/Authentication/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';
import EquipmentList from './components/Equipment/EquipmentList';
import EquipmentDetail from './components/Equipment/EquipmentDetail';
import RentalList from './components/Rentals/RentalList';
import MaintenanceList from './components/Maintenance/MaintenanceList';
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AuthProvider>
      <EquipmentProvider>
        <RentalsProvider>
          <MaintenanceProvider>
            <NotificationProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard\" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="equipment" element={<EquipmentList />} />
                    <Route path="equipment/:id" element={<EquipmentDetail />} />
                    <Route path="rentals" element={<RentalList />} />
                    <Route path="maintenance" element={<MaintenanceList />} />
                  </Route>
                </Routes>
              </Router>
            </NotificationProvider>
          </MaintenanceProvider>
        </RentalsProvider>
      </EquipmentProvider>
    </AuthProvider>
  );
}

export default App;