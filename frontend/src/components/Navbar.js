import React from 'react';
import { Pill, Bell, LogOut, User } from 'lucide-react';

const Navbar = ({ expiringCount, onAlertClick, user, onLogout }) => {
  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Pill size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Drug Hub</h1>
              <p className="text-xs text-blue-200 -mt-0.5">Drug Store Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAlertClick}
              className="relative flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Bell size={18} />
              <span className="hidden sm:inline">Expiry Alerts</span>
              {expiringCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                  {expiringCount}
                </span>
              )}
            </button>

            {user && (
              <div className="flex items-center gap-2 bg-white bg-opacity-10 px-3 py-2 rounded-lg">
                <User size={15} className="text-blue-200" />
                <span className="hidden sm:inline text-sm font-medium text-blue-100 max-w-[120px] truncate">
                  {user.fullName}
                </span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="ml-1 text-blue-200 hover:text-white transition-colors"
                >
                  <LogOut size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
