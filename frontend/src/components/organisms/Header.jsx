// src/components/organisms/Header.jsx

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Moon, 
  Sun, 
  Bell, 
  Settings, 
  HelpCircle,
  User,
  LogOut,
  BarChart3,
  Search,
  ChevronDown
} from 'lucide-react';
import Badge from '../atoms/Badge';

/**
 * Header Component - Organism
 * Top navigation bar with menu, theme toggle, search, and user actions
 */
const Header = ({ 
  onMenuClick,
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  
  // User info
  user = {
    name: 'Master',
    role: 'Student',
    avatar: null
  },
  
  // Callbacks
  onSearch,
  onNotificationClick,
  onSettingsClick,
  onProfileClick,
  onLogout,
  
  className = '',
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New cipher algorithm available', time: '5m ago', unread: true },
    { id: 2, text: 'Performance metrics updated', time: '1h ago', unread: true },
    { id: 3, text: 'System maintenance scheduled', time: '2h ago', unread: false },
  ]);

  const location = useLocation();
  const navigate = useNavigate();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    const routes = {
      '/': 'Home',
      '/dashboard': 'Dashboard',
      '/caesar': 'Caesar Cipher',
      '/vigenere': 'Vigenère Cipher',
      '/beaufort': 'Beaufort Cipher',
      '/autokey': 'Autokey Cipher',
      '/playfair': 'Playfair Cipher',
      '/hill': 'Hill Cipher',
      '/railfence': 'Rail Fence Cipher',
      '/columnar': 'Columnar Transposition',
      '/myszkowski': 'Myszkowski Transposition',
      '/double-transposition': 'Double Transposition',
    };
    return routes[path] || 'Cryptography Suite';
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header 
      className={`sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 ${className}`}
      {...props}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu & Title */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Page Title */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Classical Cryptography Suite
              </p>
            </div>

            {/* Search Bar */}
            {showSearch && (
              <form 
                onSubmit={handleSearch}
                className="hidden md:flex items-center flex-1 max-w-md ml-4"
              >
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search algorithms..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Analytics Link */}
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Analytics Dashboard"
            >
              <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analytics
              </span>
            </button>

            {/* Notifications */}
            {showNotifications && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowNotifDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <Badge variant="danger" size="sm">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (onNotificationClick) onNotificationClick(notif);
                            }}
                            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                              notif.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {notif.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {notif.text}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Settings */}
            <button
              onClick={onSettingsClick}
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Help */}
            <button
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* User Menu */}
            {showUserMenu && (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.role}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            if (onProfileClick) onProfileClick();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <User size={18} />
                          Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            navigate('/dashboard');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <BarChart3 size={18} />
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            if (onSettingsClick) onSettingsClick();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Settings size={18} />
                          Settings
                        </button>
                      </div>
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            if (onLogout) onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// PropTypes
Header.propTypes = {
  onMenuClick: PropTypes.func,
  showSearch: PropTypes.bool,
  showNotifications: PropTypes.bool,
  showUserMenu: PropTypes.bool,
  
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    avatar: PropTypes.string,
  }),
  
  onSearch: PropTypes.func,
  onNotificationClick: PropTypes.func,
  onSettingsClick: PropTypes.func,
  onProfileClick: PropTypes.func,
  onLogout: PropTypes.func,
  
  className: PropTypes.string,
};

export default Header;