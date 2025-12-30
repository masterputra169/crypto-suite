// src/pages/auth/ResetPasswordPage.jsx - WITH EXPIRY WARNING

import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, KeyRound, Sparkles, CheckCircle, AlertCircle, Check, X, Clock } from 'lucide-react';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [message, setMessage] = useState('');

  // Password requirements
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Contains special character', test: (pwd) => /[@$!%*?&]/.test(pwd) }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const validatePassword = () => {
    const failedRequirements = passwordRequirements.filter(req => !req.test(formData.newPassword));
    if (failedRequirements.length > 0) {
      setMessage('Password does not meet requirements');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      setStatus('error');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Invalid reset token. Please request a new password reset link.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please make sure the server is running.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if token exists
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
          <p className="text-gray-300 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Crypto Suite</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-300">Enter your new password below</p>
        </div>

        {/* ✅ NEW: EXPIRY WARNING BOX */}
        {status !== 'success' && (
          <div className="mb-6 bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-1">
                  ⏰ Time-Limited Link
                </h3>
                <p className="text-xs text-yellow-200/80 leading-relaxed">
                  This password reset link is valid for <strong>1 hour only</strong> from the time it was sent to your email. 
                  If the link has expired, please request a new password reset.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {status === 'success' ? (
            // Success State
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful!</h3>
              <p className="text-gray-300 text-sm mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-400">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error/Success Message */}
              {status === 'error' && message && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {req.test(formData.newPassword) ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span className={req.test(formData.newPassword) ? 'text-green-400' : 'text-gray-400'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={20} />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back to Login */}
        {status !== 'success' && (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;