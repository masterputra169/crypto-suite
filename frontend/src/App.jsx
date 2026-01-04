// src/App.jsx - Complete Version with AI Translation
// ==================== INTEGRATED WITH AI TRANSLATION ====================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/organisms/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Cipher Pages - Substitution
import CaesarPage from './pages/substitution/CaesarPage';
import VigenerePage from './pages/substitution/VigenerePage';
import BeaufortPage from './pages/substitution/BeaufortPage';
import AutokeyPage from './pages/substitution/AutokeyPage';

// Cipher Pages - Polygram
import PlayfairPage from './pages/polygram/PlayfairPage';
import HillPage from './pages/polygram/HillPage';

// Cipher Pages - Transposition
import RailFencePage from './pages/transposition/RailFencePage';
import ColumnarPage from './pages/transposition/ColumnarPage';
import MyszkowskiPage from './pages/transposition/MyszkowskiPage';
import DoublePage from './pages/transposition/DoublePage';

// Cipher Pages - Advanced
import SuperEncryptionPage from './pages/advanced/SuperEncryptionPage';
import OTPPage from './pages/advanced/OTPPage';

// Cipher Pages - Stream
import LCGPage from './pages/stream/LCGPage';
import BBSPage from './pages/stream/BBSPage';

import DESCBCPage from './pages/modern/DESCBCPage';
import DESECBPage from './pages/modern/DESECBPage';
import RSAPage from './pages/modern/RSAPage';


// ==================== PROTECTED ROUTE COMPONENT ====================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ==================== 404 PAGE ====================
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

// ==================== LAYOUT WITH SIDEBAR ====================
const MainLayout = ({ children, darkMode, toggleDarkMode, sidebarOpen, onSidebarToggle }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onSidebarToggle={onSidebarToggle}
      />
      <main className={`flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {children}
      </main>
    </div>
  );
};

// ==================== APP CONTENT (WRAPPED BY PROVIDERS) ====================
const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Routes>
        {/* ==================== PUBLIC ROUTES - NO SIDEBAR ==================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ==================== HOME PAGE - WITH SIDEBAR ==================== */}
        <Route
          path="/"
          element={
            <MainLayout 
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              sidebarOpen={sidebarOpen}
              onSidebarToggle={handleSidebarToggle}
            >
              <Home />
            </MainLayout>
          }
        />

        {/* ==================== PROTECTED ROUTES - DASHBOARD & PROFILE ==================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <ChangePasswordPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== SUBSTITUTION CIPHERS ==================== */}
        <Route
          path="/caesar"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <CaesarPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vigenere"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <VigenerePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/beaufort"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <BeaufortPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/autokey"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <AutokeyPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== POLYGRAM CIPHERS ==================== */}
        <Route
          path="/playfair"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <PlayfairPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hill"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <HillPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== TRANSPOSITION CIPHERS ==================== */}
        <Route
          path="/railfence"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <RailFencePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/columnar"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <ColumnarPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/myszkowski"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <MyszkowskiPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/double"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <DoublePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== ADVANCED CIPHERS ==================== */}
        <Route
          path="/super-encryption"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <SuperEncryptionPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/otp"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <OTPPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== STREAM CIPHERS ==================== */}
        <Route
          path="/lcg"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <LCGPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bbs"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <BBSPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

          <Route
          path="/des-cbc"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <DESCBCPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        
          <Route
          path="/des-ecb"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <DESECBPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

          
          <Route
          path="/rsa"
          element={
            <ProtectedRoute>
              <MainLayout 
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                sidebarOpen={sidebarOpen}
                onSidebarToggle={handleSidebarToggle}
              >
                <RSAPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        {/* ==================== 404 NOT FOUND ==================== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
// ✅ AI TRANSLATION PROVIDER WRAPS EVERYTHING
const App = () => {
  return (
    <Router>
      <AuthProvider>
          <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;