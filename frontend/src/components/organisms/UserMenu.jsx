// src/components/organisms/UserMenu.jsx - FINAL UPDATED

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Lock, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

const UserMenu = ({ isOpen = true, onLogout }) => {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    if (onLogout) {
      await onLogout();
    }
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleChangePasswordClick = () => {
    console.log('Change Password clicked');
    setIsMenuOpen(false);
    navigate('/change-password');
  };

  // If not authenticated, show login/signup buttons
  if (!isAuthenticated()) {
    return isOpen ? (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all group"
        >
          <LogIn size={18} className="group-hover:scale-110 transition-transform" />
          <span>Login</span>
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all shadow-lg group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          <span>Sign Up</span>
        </button>
      </div>
    ) : (
      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={() => navigate('/login')}
          className="p-2.5 text-white bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-all group"
          title="Login"
        >
          <LogIn size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="p-2.5 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all shadow-lg group"
          title="Sign Up"
        >
          <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  // Authenticated - show user menu
  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-700/50 rounded-lg transition-all group w-full ${
          !isOpen ? 'justify-center' : ''
        }`}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={20} className="text-white" />
          )}
        </div>

        {/* User Info - Only when sidebar open */}
        {isOpen && (
          <>
            <div className="text-left flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {user?.full_name || user?.username}
              </div>
              <div className="text-xs text-gray-400 truncate">
                @{user?.username}
              </div>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform flex-shrink-0 ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          className={`absolute ${
            isOpen ? 'left-0 right-0' : 'left-full ml-2'
          } bottom-full mb-2 ${
            isOpen ? 'w-full' : 'w-64'
          } bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50`}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
            <div className="font-semibold text-white">
              {user?.full_name || user?.username}
            </div>
            <div className="text-sm text-gray-300">{user?.email}</div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Profile Settings */}
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all text-left group"
            >
              <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all">
                <User size={16} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">Profile</div>
                <div className="text-xs text-gray-400">Manage your account</div>
              </div>
            </button>

            {/* Change Password */}
            <button
              onClick={handleChangePasswordClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all text-left group"
            >
              <div className="p-1.5 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all">
                <Lock size={16} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white">Change Password</div>
                <div className="text-xs text-gray-400">Update your password</div>
              </div>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-gray-700" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-red-500/10 transition-all text-left group"
            >
              <div className="p-1.5 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-all">
                <LogOut size={16} className="text-red-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-red-400">Logout</div>
                <div className="text-xs text-gray-400">Sign out from account</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

UserMenu.propTypes = {
  isOpen: PropTypes.bool,
  onLogout: PropTypes.func
};

export default UserMenu;