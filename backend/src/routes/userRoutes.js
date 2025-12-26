// src/routes/userRoutes.js

const express = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middlewares/validator');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  getUserStatistics,
  getUserProgress,
  addUserProgress,
  getLeaderboard,
  updateUserStatistics,
  searchUsers
} = require('../controllers/userController');

const router = express.Router();

// Validation rules
const addProgressValidation = [
  body('cipher_type')
    .trim()
    .notEmpty()
    .withMessage('Cipher type harus diisi')
    .isLength({ max: 50 })
    .withMessage('Cipher type maksimal 50 karakter'),
  body('time_spent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent harus angka positif'),
  body('success_rate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Success rate harus antara 0-100')
];

const updateStatisticsValidation = [
  body('total_encryptions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total encryptions harus angka positif'),
  body('total_decryptions')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total decryptions harus angka positif'),
  body('total_time_spent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total time spent harus angka positif'),
  body('favorite_cipher')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Favorite cipher maksimal 50 karakter'),
  body('streak_days')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Streak days harus angka positif')
];

const searchValidation = [
  query('q')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Query pencarian minimal 2 karakter'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit harus antara 1-50')
];

// Public routes
router.get('/search', searchValidation, validate, searchUsers);
router.get('/leaderboard', getLeaderboard);
router.get('/:username', optionalAuth, getUserProfile);
router.get('/:username/statistics', getUserStatistics);

// Protected routes
router.get('/me/progress', protect, getUserProgress);
router.post('/me/progress', protect, addProgressValidation, validate, addUserProgress);
router.put('/me/statistics', protect, updateStatisticsValidation, validate, updateUserStatistics);

module.exports = router;