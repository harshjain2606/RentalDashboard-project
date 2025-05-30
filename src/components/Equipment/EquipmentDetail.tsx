import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEquipment } from '../../contexts/EquipmentContext';
import { useRentals } from '../../contexts/RentalsContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import { format } from 'date-fns';
import { ClipboardList, Wrench, ArrowLeft } from 'lucide-react';

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipment, updateEquipment } = useEquipment();
  const { rentals } = useRentals();
  const { maintenance } = useMaintenance();
  const [isEditing, setIsEditing] = useState(false);

  const item = equipment.find(eq => eq.id === id);
  const itemRentals = rentals.filter(rental => rental.equipmentId === id);
  const itemMaintenance = maintenance.filter(record => record.equipmentId === id);

  const [formData, setFormData] = useState(item || {
    name: '',
    category: '',
    condition: 'Good',
    status: 'Available'
  });

  if (!item) {
    return <div>Equipment not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateEquipment(id, formData);
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/equipment')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Equipment List
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>Available</option>
                <option>Rented</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                <p className="text-gray-600">{item.category}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Equipment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-gray-900">Condition</h2>
                <p className="text-gray-600">{item.condition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold text-gray-900">Status</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Rental History</h2>
                </div>
                {itemRentals.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {itemRentals.map((rental) => (
                          <tr key={rental.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(rental.startDate), 'PP')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(rental.endDate), 'PP')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rental.status === 'Returned' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {rental.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No rental history available.</p>
                )}
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Wrench className="w-5 h-5 mr-2 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Maintenance History</h2>
                </div>
                {itemMaintenance.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {itemMaintenance.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(record.date), 'PP')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.type}</td>
                            <td className="px-6 py-4">{record.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No maintenance history available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetail;