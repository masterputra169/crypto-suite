// src/context/AuthContext.jsx - FIXED & ENHANCED

import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('🔄 Initializing auth from localStorage...');
      console.log('   Token:', storedToken ? '✅ Found' : '❌ Not found');
      console.log('   User:', storedUser ? '✅ Found' : '❌ Not found');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          console.log('✅ Auth initialized:', parsedUser.username);
        } catch (error) {
          console.error('❌ Failed to parse stored user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('⚠️  No stored auth data');
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, authToken) => {
    console.log('🔐 Login called with:', { username: userData?.username, hasToken: !!authToken });
    
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ Auth state updated - User logged in:', userData.username);
  };

  const clearAuth = () => {
    console.log('🗑️  Clearing auth state');
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('✅ Auth state cleared');
  };

  const logout = async () => {
    console.log('👋 Logout initiated');
    
    try {
      if (token) {
        await fetch('http://api.cryptosuite.online/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        console.log('✅ Logout API call successful');
      }
    } catch (error) {
      console.error('⚠️  Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      clearAuth();
      console.log('✅ Logout completed');
    }
  };

  // ✅ FIXED: Enhanced updateUser function
  const updateUser = (updatedData) => {
    console.log('🔄 Updating user in AuthContext...');
    console.log('   Current user:', user);
    console.log('   Update data:', updatedData);
    
    try {
      // ✅ Merge updated data with existing user
      const updatedUser = { ...user, ...updatedData };
      
      console.log('   Merged user:', updatedUser);
      
      // ✅ Update state
      setUser(updatedUser);
      
      // ✅ Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('✅ User updated successfully in AuthContext');
      console.log('   New full_name:', updatedUser.full_name);
      console.log('   New bio:', updatedUser.bio);
      console.log('   New avatar_url:', updatedUser.avatar_url);
      
      return true;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      return false;
    }
  };

  // ✅ NEW: Refresh user data from server
  const refreshUser = async () => {
    if (!token) {
      console.log('⚠️  No token available, cannot refresh user');
      return { success: false };
    }

    try {
      console.log('🔄 Refreshing user data from server...');
      
      const response = await fetch('http://api.cryptosuite.online/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success && data.data) {
        const freshUser = data.data;
        
        // Update state and localStorage
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
        
        console.log('✅ User data refreshed from server:', freshUser.username);
        return { success: true, user: freshUser };
      } else {
        console.error('❌ Failed to refresh user - Invalid response');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      
      // If token is invalid (401), logout
      if (error.response?.status === 401) {
        console.log('🚫 Token expired, logging out...');
        await logout();
      }
      
      return { success: false };
    }
  };

  const isAuthenticated = () => {
    const authenticated = !!token && !!user;
    return authenticated;
  };

  // ✅ Log auth state (useful for debugging, but only on state changes)
  useEffect(() => {
    if (!loading) {
      console.log('📊 Auth State:', { 
        user: user?.username || 'Not logged in', 
        hasToken: !!token, 
        authenticated: isAuthenticated() 
      });
    }
  }, [user, token, loading]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    refreshUser,    // ✅ NEW: Added refreshUser
    isAuthenticated,
    clearAuth
  };

  // ✅ Show loading screen while initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading...</p>
          <p className="text-gray-400 text-sm mt-2">Initializing application</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;