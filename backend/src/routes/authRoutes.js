// src/routes/authRoutes.js

const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator');
const { protect } = require('../middlewares/authMiddleware');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,    // ✅ TAMBAHKAN
  resetPassword      // ✅ TAMBAHKAN
} = require('../controllers/authController');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username harus 3-50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username hanya boleh alfanumerik dan underscore'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email tidak valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password harus mengandung huruf besar, kecil, angka, dan karakter spesial'),
  body('full_name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Nama lengkap maksimal 100 karakter')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email tidak valid'),
  body('password')
    .notEmpty()
    .withMessage('Password harus diisi')
];

const updateProfileValidation = [
  body('full_name')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Nama lengkap maksimal 100 karakter'),
  body('bio')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio maksimal 500 karakter'),
  body('avatar_url')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Avatar URL tidak valid')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Password saat ini harus diisi'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password baru minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password harus mengandung huruf besar, kecil, angka, dan karakter spesial')
];

// ✅ TAMBAHKAN VALIDATION RULES
const forgotPasswordValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email tidak valid')
    .normalizeEmail()
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token harus diisi'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password baru minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password harus mengandung huruf besar, kecil, angka, dan karakter spesial')
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);  // ✅ TAMBAHKAN
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);    // ✅ TAMBAHKAN

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);
router.put('/password', protect, changePasswordValidation, validate, changePassword);

module.exports = router;