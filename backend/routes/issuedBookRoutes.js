/**
 * Issued Book Routes
 * Routes for issuing, returning, and tracking books
 */

const express = require('express');
const router = express.Router();
const {
    issueBook,
    returnBook,
    getAllIssuedBooks,
    getOverdueBooks,
    getMyBooks,
    getMyHistory,
    getStats
} = require('../controllers/issuedBookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// User routes
router.get('/my-books', getMyBooks);
router.get('/history', getMyHistory);

// Admin only routes
router.get('/stats', adminOnly, getStats);
router.get('/overdue', adminOnly, getOverdueBooks);
router.get('/', adminOnly, getAllIssuedBooks);
router.post('/issue', adminOnly, issueBook);
router.put('/return/:id', adminOnly, returnBook);

module.exports = router;
