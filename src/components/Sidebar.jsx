import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, ScaleIcon, TruckIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Weight Progress', href: '/weight-progress', icon: ScaleIcon },
    { name: 'Shipments', href: '/shipments', icon: TruckIcon },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform sm:static sm:transform-none transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Acme Corp</h2>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => isOpen && toggleSidebar()} // Close sidebar on mobile after navigation
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </NavLink>
          ))}
          {/* <button
            onClick={() => {
              logout();
              if (isOpen) toggleSidebar();
            }}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-white hover:bg-gray-50 hover:text-white-900 rounded-md"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
            Logout
          </button> */}
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-10"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;