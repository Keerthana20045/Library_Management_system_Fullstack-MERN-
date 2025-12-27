/**
 * Authentication Routes
 * Routes for user registration, login, and profile
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile, getAllUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
