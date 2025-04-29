import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Section: Title and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
            Patient Dashboard
          </h2>
        </div>

        {/* Right Section: User Profile */}
        <div className="relative flex items-center space-x-4">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
              {currentUser?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              {currentUser?.lastName?.charAt(0)?.toUpperCase() || ''}
            </div>
            <span className="hidden sm:inline text-white text-sm font-medium text-gray-700">
              {currentUser?.firstName || 'User'} {currentUser?.lastName || ''}
            </span>
          </button>

          {/* Dropdown Menu for Logout */}
          {isProfileOpen && (
            <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4(py-2 text-sm text-white bg-blue-600  rounded-md hover:bg-blue-700"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;