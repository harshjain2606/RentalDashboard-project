import React from 'react';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useRentals } from '../../contexts/RentalsContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { Activity, Box, ClipboardList, Wrench, AlertTriangle } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { equipment } = useEquipment();
  const { rentals } = useRentals();
  const { maintenance } = useMaintenance();

  const activeRentals = rentals.filter(rental => rental.status === 'Rented');
  const overdueRentals = rentals.filter(rental => 
    rental.status === 'Rented' && isAfter(new Date(), new Date(rental.endDate))
  );
  const upcomingMaintenance = maintenance.filter(record => 
    isAfter(new Date(record.date), new Date())
  );

  const utilizationRate = equipment.length > 0
    ? (activeRentals.length / equipment.length) * 100
    : 0;

  const stats = [
    { label: 'Total Equipment', value: equipment.length, icon: <Box className="w-6 h-6" /> },
    { label: 'Active Rentals', value: activeRentals.length, icon: <ClipboardList className="w-6 h-6" /> },
    { label: 'Overdue Returns', value: overdueRentals.length, icon: <AlertTriangle className="w-6 h-6" /> },
    { label: 'Utilization Rate', value: `${utilizationRate.toFixed(1)}%`, icon: <Activity className="w-6 h-6" /> }
  ];

  const categoryData = equipment.reduce((acc: any[], item) => {
    const categoryIndex = acc.findIndex(c => c.name === item.category);
    if (categoryIndex === -1) {
      acc.push({ name: item.category, count: 1 });
    } else {
      acc[categoryIndex].count += 1;
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-blue-500">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Equipment by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[...rentals, ...maintenance]
              .sort((a, b) => new Date(b.date || b.startDate).getTime() - new Date(a.date || a.startDate).getTime())
              .slice(0, 5)
              .map((item) => {
                const isRental = 'startDate' in item;
                return (
                  <div key={item.id} className="flex items-start space-x-3">
                    {isRental ? (
                      <ClipboardList className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <Wrench className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isRental ? `Rental ${item.status}` : `Maintenance: ${item.type}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(isRental ? item.startDate : item.date), 'PPp')}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;