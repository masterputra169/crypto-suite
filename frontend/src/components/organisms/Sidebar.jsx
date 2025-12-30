// src/components/organisms/Sidebar.jsx - Fixed Version

import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart3,
  Lock, 
  Grid3x3, 
  Shuffle,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserMenu from './UserMenu';

const Sidebar = ({ darkMode, toggleDarkMode, onSidebarToggle }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isOpen);
    }
  }, [isOpen, onSidebarToggle]);

  // Handle logout dengan navigate
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigate even if logout API fails
      navigate('/login', { replace: true });
    }
  };

  // Menu items yang selalu visible
  const publicMenuItems = [
    {
      category: 'Main',
      items: [
        { name: 'Home', path: '/', icon: Home },
      ]
    }
  ];

  // Menu items yang hanya muncul ketika login
  const authMenuItems = [
    {
      category: 'Analytics',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
      ]
    },
    {
      category: 'Substitution Ciphers',
      items: [
        { name: 'Caesar Cipher', path: '/caesar', icon: Lock },
        { name: 'Vigenère Cipher', path: '/vigenere', icon: Lock },
        { name: 'Beaufort Cipher', path: '/beaufort', icon: Lock },
        { name: 'Autokey Cipher', path: '/autokey', icon: Lock },
      ]
    },
    {
      category: 'Polygram Ciphers',
      items: [
        { name: 'Playfair Cipher', path: '/playfair', icon: Grid3x3 },
        { name: 'Hill Cipher', path: '/hill', icon: Grid3x3 },
      ]
    },
    {
      category: 'Transposition Ciphers',
      items: [
        { name: 'Rail Fence', path: '/railfence', icon: Shuffle },
        { name: 'Columnar', path: '/columnar', icon: Shuffle },
        { name: 'Myszkowski', path: '/myszkowski', icon: Shuffle },
        { name: 'Double Transposition', path: '/double', icon: Shuffle },
      ]
    },
    {
      category: 'Advanced Classic',
      items: [
        { name: 'Super Encryption', path: '/super-encryption', icon: Lock },
        { name: 'One Time Pad', path: '/otp', icon: Lock },
      ]
    },
    {
       category: 'Stream Cipher',
      items: [
        { name: 'LCG Stream', path: '/lcg', icon: Shuffle },
        { name: 'BBS Stream', path: '/bbs', icon: Shuffle },
      ]
    },
    {
      category: 'Modern Block Cipher',
      items: [
        { name: 'DES Algorithm', path: '/des', icon: Grid3x3 },
        { name: 'DES ECB Mode', path: '/des-ecb', icon: Grid3x3 },
        { name: 'DES CBC Mode', path: '/des-cbc', icon: Grid3x3 },
      ]
    },
    {
      category: 'Modern Asymmetric',
      items: [
        { name: 'RSA Encryption', path: '/rsa', icon: Lock },
      ]
    }
  ];

  // Gabungkan menu berdasarkan status login
  const menuItems = isAuthenticated() 
    ? [...publicMenuItems, ...authMenuItems]
    : publicMenuItems;

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className={`p-4 border-b border-gray-700/50 flex-shrink-0 transition-all duration-700 ease-in-out ${
        isOpen ? 'pb-4' : 'pb-3'
      }`}>
        {isOpen ? (
          <div className="flex items-center justify-between gap-2 animate-fade-in-smooth">
            <h2 className="text-xl font-bold text-white transform transition-all duration-700 ease-out">
              Crypto Suite
            </h2>
            <button
              onClick={handleToggleSidebar}
              className="group p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-500 ease-out hidden lg:block relative overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-lg" />
              <Menu 
                size={20} 
                className="text-gray-300 group-hover:text-white relative z-10 transition-all duration-700 ease-in-out rotate-180 group-hover:rotate-[540deg]"
              />
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="group p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-500 ease-out lg:hidden relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-lg" />
              <X size={20} className="text-gray-300 group-hover:text-white group-hover:rotate-90 relative z-10 transition-all duration-500 ease-out" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 animate-fade-in-smooth">
            <h2 className="text-xl font-bold text-white transform transition-all duration-700 ease-out">
              CS
            </h2>
            <button
              onClick={handleToggleSidebar}
              className="group p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-500 ease-out hidden lg:block relative overflow-hidden flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-lg" />
              <Menu 
                size={20} 
                className="text-gray-300 group-hover:text-white relative z-10 transition-all duration-700 ease-in-out group-hover:rotate-[360deg]"
              />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {menuItems.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            <button
              onClick={() => toggleCategory(section.category)}
              className="w-full flex items-center justify-between text-gray-400 text-xs uppercase tracking-wider mb-2 hover:text-white transition-all duration-500 ease-out px-1 group/header"
            >
              {isOpen ? (
                <>
                  <span className="transition-all duration-500 ease-out group-hover/header:translate-x-1">
                    {section.category}
                  </span>
                  <span className="transition-all duration-500 ease-out">
                    {expandedCategory === section.category ? 
                      <ChevronDown size={16} className="transition-all duration-500 ease-out group-hover/header:translate-y-0.5" /> : 
                      <ChevronRight size={16} className="transition-all duration-500 ease-out group-hover/header:translate-x-0.5" />
                    }
                  </span>
                </>
              ) : (
                <span className="mx-auto transition-all duration-500 ease-out">···</span>
              )}
            </button>

            {(expandedCategory === section.category || !isOpen) && (
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                      animationDelay: `${itemIdx * 50}ms`
                    }}
                  >
                    {({ isActive }) => (
                      <div className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500 ease-out relative overflow-hidden animate-slide-in-item
                        ${isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]' 
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1'
                        }
                        ${!isOpen ? 'justify-center' : ''}
                      `}>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                        
                        <item.icon 
                          size={20} 
                          className="relative z-10 transition-all duration-500 ease-out group-hover:scale-110 flex-shrink-0" 
                        />
                        
                        {isOpen && (
                          <span className="text-sm font-medium relative z-10 transition-all duration-500 ease-out">
                            {item.name}
                          </span>
                        )}

                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full animate-pulse-smooth" />
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Message jika belum login */}
        {!isAuthenticated() && (
          <div className={`mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg ${!isOpen && 'hidden'}`}>
            <p className="text-sm text-blue-300 mb-2">
              🔒 Login to access all cipher features
            </p>
            <p className="text-xs text-gray-400">
              Sign up for free now!
            </p>
          </div>
        )}
      </nav>

      {/* User Menu at Bottom */}
      <div className="p-4 border-t border-gray-700/50 flex-shrink-0">
        <UserMenu isOpen={isOpen} onLogout={handleLogout} />
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 10px;
          transition: background 0.5s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="group fixed top-4 left-4 z-50 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg lg:hidden transition-all duration-500 ease-out shadow-lg hover:shadow-2xl hover:scale-110 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out rounded-lg" />
        <Menu size={24} className="relative z-10 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } fixed top-0 left-0 h-screen hidden lg:flex flex-col bg-gray-800 text-white transition-all duration-700 ease-in-out flex-shrink-0 z-30 shadow-2xl border-r border-gray-700/50`}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          willChange: 'width',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in-backdrop backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          
          <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-gray-800 text-white z-50 lg:hidden shadow-2xl animate-slide-in-mobile border-r border-gray-700/50">
            {sidebarContent}
          </aside>
        </>
      )}

      <style>{`
        body {
          background-color: #1f2937;
          margin: 0;
          padding: 0;
        }
        #root {
          background-color: #1f2937;
          min-height: 100vh;
        }
        @keyframes fade-in-smooth {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-smooth {
          animation: fade-in-smooth 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slide-in-item {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-item {
          animation: slide-in-item 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes pulse-smooth {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateY(-50%) scale(1.05); }
        }
        .animate-pulse-smooth {
          animation: pulse-smooth 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fade-in-backdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-backdrop {
          animation: fade-in-backdrop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slide-in-mobile {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-mobile {
          animation: slide-in-mobile 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        aside, button, a {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default Sidebar;