/**
 * Category Routes
 * Routes for category CRUD operations
 */

const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Public routes (for authenticated users)
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin only routes
router.post('/', adminOnly, createCategory);
router.put('/:id', adminOnly, updateCategory);
router.delete('/:id', adminOnly, deleteCategory);

module.exports = router;
