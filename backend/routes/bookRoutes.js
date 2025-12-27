/**
 * Book Routes
 * Routes for book CRUD and search operations
 */

const express = require('express');
const router = express.Router();
const {
    getBooks,
    getBook,
    searchBooks,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Search route (must come before /:id to avoid conflicts)
router.get('/search', searchBooks);

// Public routes (for authenticated users)
router.get('/', getBooks);
router.get('/:id', getBook);

// Admin only routes
router.post('/', adminOnly, createBook);
router.put('/:id', adminOnly, updateBook);
router.delete('/:id', adminOnly, deleteBook);

module.exports = router;
