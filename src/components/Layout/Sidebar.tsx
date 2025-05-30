import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, Box, ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/equipment', icon: <Box className="w-5 h-5" />, label: 'Equipment' },
    { path: '/rentals', icon: <ClipboardList className="w-5 h-5" />, label: 'Rentals' },
    { path: '/maintenance', icon: <Wrench className="w-5 h-5" />, label: 'Maintenance' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-800">Equipment Manager</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`
            }
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;