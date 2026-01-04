// src/pages/auth/SignUpPage.jsx - UPDATED WITH MODALS

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, UserPlus, Sparkles, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TermsModal, PrivacyModal } from '../../components/molecules';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  // ✅ NEW: Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Password strength validation
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Contains special character', test: (pwd) => /[@$!%*?&]/.test(pwd) }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    setErrors({
      ...errors,
      [name]: ''
    });
    setServerError('');
  };

  // ✅ NEW: Handle Terms/Privacy acceptance
  const handleTermsAccept = () => {
    setTermsAccepted(true);
    checkIfBothAccepted(true, privacyAccepted);
  };

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    checkIfBothAccepted(termsAccepted, true);
  };

  const checkIfBothAccepted = (terms, privacy) => {
    if (terms && privacy) {
      setAgreedToTerms(true);
    }
  };

  // ✅ NEW: Handle checkbox with validation
  const handleCheckboxChange = (e) => {
    if (e.target.checked && !termsAccepted && !privacyAccepted) {
      alert('Please read and accept both Terms of Service and Privacy Policy first');
      e.target.checked = false;
      return;
    }
    setAgreedToTerms(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain alphanumeric characters and underscores';
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
    if (failedRequirements.length > 0) {
      newErrors.password = 'Password does not meet requirements';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // ✅ Terms agreement validation
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await fetch('https://api.cryptosuite.online/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name || formData.username
        })
      });

      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        navigate('/dashboard', { replace: true });
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors = {};
          data.errors.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setServerError(data.message || 'Registration failed');
        }
        
        setFormData(prev => ({ 
          ...prev, 
          password: '', 
          confirmPassword: '' 
        }));
      }
    } catch (err) {
      setServerError('An error occurred. Please make sure the server is running.');
      console.error('Signup error:', err);
      
      setFormData(prev => ({ 
        ...prev, 
        password: '', 
        confirmPassword: '' 
      }));
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Start your cryptography learning journey</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Server Error Message */}
            {serverError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {serverError}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.username ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="johndoe"
                  required
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Full Name <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="john@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      {req.test(formData.password) ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <X size={14} className="text-red-400" />
                      )}
                      <span className={req.test(formData.password) ? 'text-green-400' : 'text-gray-400'}>
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
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* ✅ UPDATED: Terms Agreement with Status */}
            <div className="space-y-3">
              {/* Status Indicators */}
              <div className="flex gap-2 text-xs">
                <span className={`flex items-center gap-1 px-2 py-1 rounded ${termsAccepted ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {termsAccepted ? <Check size={12} /> : <X size={12} />}
                  Terms
                </span>
                <span className={`flex items-center gap-1 px-2 py-1 rounded ${privacyAccepted ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                  {privacyAccepted ? <Check size={12} /> : <X size={12} />}
                  Privacy
                </span>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={handleCheckboxChange}
                  disabled={!termsAccepted || !privacyAccepted}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label className={`text-sm ${!termsAccepted || !privacyAccepted ? 'text-gray-500' : 'text-gray-300'}`}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {errors.terms && (
                <p className="text-sm text-red-400">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">or</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* ✅ Modals */}
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
      />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        onAccept={handlePrivacyAccept}
      />

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

export default SignUpPage;