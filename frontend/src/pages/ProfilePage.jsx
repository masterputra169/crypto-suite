// src/pages/ProfilePage.jsx - FIXED UPDATE BUG

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Edit2, Save, X, Camera, LogOut, Lock, ChevronRight } from 'lucide-react';
import authService from '../utils/api/authService';
import cipherService from '../utils/api/cipherService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [statistics, setStatistics] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || ''
      });
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      const response = await cipherService.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {};
      
      // ✅ ALWAYS send full_name (allow empty)
      if (formData.full_name !== user.full_name) {
        updateData.full_name = formData.full_name.trim();
      }
      
      // ✅ ALWAYS send bio (allow empty)
      if (formData.bio !== user.bio) {
        updateData.bio = formData.bio.trim();
      }
      
      // ✅ Validate avatar URL only if not empty
      if (formData.avatar_url !== user.avatar_url) {
        if (formData.avatar_url.trim()) {
          // Only validate if URL is provided
          try {
            new URL(formData.avatar_url.trim());
            updateData.avatar_url = formData.avatar_url.trim();
          } catch {
            setMessage({ type: 'error', text: 'Avatar URL format is invalid. Please enter a valid URL or leave it empty.' });
            setLoading(false);
            return;
          }
        } else {
          // Allow clearing avatar
          updateData.avatar_url = '';
        }
      }

      if (Object.keys(updateData).length === 0) {
        setMessage({ type: 'error', text: 'No changes to save' });
        setLoading(false);
        setIsEditing(false);
        return;
      }

      console.log('📤 Sending update:', updateData);
      
      const response = await authService.updateProfile(updateData);
      
      console.log('📥 Received response:', response);

      // ✅ CRITICAL FIX: Handle different response formats
      const updatedUser = response.data?.data || response.data;
      
      if (response.data?.success !== false) {
        // ✅ Update context (AuthContext will handle localStorage)
        console.log('✅ Updating user context with:', updatedUser);
        updateUser(updatedUser);
        
        setMessage({ type: 'success', text: 'Profile updated successfully! ✓' });
        setIsEditing(false);
        
        // ✅ Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: response.data?.message || 'Failed to update profile' 
        });
      }
    } catch (error) {
      console.error('❌ Update profile error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0s';
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-200' 
              : 'bg-red-500/20 border border-red-500/50 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Cover */}
          <div className="h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-800/50"></div>
          </div>

          {/* Avatar & Basic Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-20 mb-6">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-gray-800 p-1">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              console.log('❌ Image failed to load:', user.avatar_url);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full">
                            <User size={56} className="text-white/80" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="absolute bottom-2 right-2 p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full text-white shadow-lg">
                      <Camera size={18} />
                    </div>
                  )}
                </div>

                {/* Name & Username */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {user.full_name || user.username}
                  </h2>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setMessage({ type: '', text: '' });
                      setFormData({
                        full_name: user.full_name || '',
                        bio: user.bio || '',
                        avatar_url: user.avatar_url || ''
                      });
                    }}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {/* Form or Display Info */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                    placeholder="Tell us about yourself... (max 500 characters)"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="avatar_url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty to use default avatar
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Mail className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all">
                    <p className="text-xs text-gray-400 mb-2">Bio</p>
                    <p className="text-white whitespace-pre-wrap">{user.bio}</p>
                  </div>
                )}

                {/* Member Since */}
                <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Calendar className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Member Since</p>
                    <p className="text-white">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">Total Operations</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {(statistics?.overall?.total_encryptions || 0) + (statistics?.overall?.total_decryptions || 0)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">Ciphers Used</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {statistics?.ciphers?.length || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <p className="text-gray-400 text-sm mb-1">Time Spent</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {formatTime(statistics?.overall?.total_time_spent || 0)}
            </p>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-8 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Account Actions</h3>
          
          <div className="space-y-4">
            {/* Change Password */}
            <button
              onClick={() => navigate('/change-password')}
              className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-700/50 hover:border-blue-500/30 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Lock className="text-blue-400" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Change Password</p>
                  <p className="text-sm text-gray-400">Update your password</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <LogOut className="text-red-400" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-red-400">Logout</p>
                  <p className="text-sm text-gray-400">Sign out from your account</p>
                </div>
              </div>
              <ChevronRight className="text-red-400 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;