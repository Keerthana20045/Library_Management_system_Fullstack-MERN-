/**
 * Issued Book Controller
 * Handles book issuing, returning, and history
 */

const IssuedBook = require('../models/IssuedBook');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Issue a book to user
// @route   POST /api/issued/issue
// @access  Private/Admin
const issueBook = async (req, res) => {
    try {
        const { bookId, userId, dueDate } = req.body;

        // Check if book exists and is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.available <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No copies available for this book'
            });
        }

        // Check if user exists and is a student
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user already has this book issued
        const existingIssue = await IssuedBook.findOne({
            book: bookId,
            user: userId,
            status: 'issued'
        });

        if (existingIssue) {
            return res.status(400).json({
                success: false,
                message: 'User already has this book issued'
            });
        }

        // Create issue record
        const dueDateObj = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        const issuedBook = await IssuedBook.create({
            book: bookId,
            user: userId,
            dueDate: dueDateObj
        });

        // Decrease available count
        book.available -= 1;
        await book.save();

        // Populate book and user details
        await issuedBook.populate('book', 'title author isbn');
        await issuedBook.populate('user', 'name email studentId');

        res.status(201).json({
            success: true,
            issuedBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Return a book
// @route   PUT /api/issued/return/:id
// @access  Private/Admin
const returnBook = async (req, res) => {
    try {
        const issuedBook = await IssuedBook.findById(req.params.id);
        if (!issuedBook) {
            return res.status(404).json({
                success: false,
                message: 'Issue record not found'
            });
        }

        if (issuedBook.status === 'returned') {
            return res.status(400).json({
                success: false,
                message: 'Book already returned'
            });
        }

        // Calculate fine if overdue
        const fine = issuedBook.calculateFine();

        // Update issue record
        issuedBook.returnDate = new Date();
        issuedBook.status = 'returned';
        issuedBook.fine = fine;
        await issuedBook.save();

        // Increase available count
        const book = await Book.findById(issuedBook.book);
        if (book) {
            book.available += 1;
            await book.save();
        }

        await issuedBook.populate('book', 'title author isbn');
        await issuedBook.populate('user', 'name email studentId');

        res.status(200).json({
            success: true,
            message: fine > 0 ? `Book returned. Fine: Rs. ${fine}` : 'Book returned successfully',
            issuedBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all issued books
// @route   GET /api/issued
// @access  Private/Admin
const getAllIssuedBooks = async (req, res) => {
    try {
        const issuedBooks = await IssuedBook.find()
            .populate('book', 'title author isbn')
            .populate('user', 'name email studentId')
            .sort({ issueDate: -1 });

        // Update overdue status
        for (let issue of issuedBooks) {
            if (issue.status === 'issued') {
                issue.updateStatus();
                await issue.save();
            }
        }

        res.status(200).json({
            success: true,
            count: issuedBooks.length,
            issuedBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get overdue books
// @route   GET /api/issued/overdue
// @access  Private/Admin
const getOverdueBooks = async (req, res) => {
    try {
        const today = new Date();

        const overdueBooks = await IssuedBook.find({
            status: { $in: ['issued', 'overdue'] },
            dueDate: { $lt: today }
        })
            .populate('book', 'title author isbn')
            .populate('user', 'name email studentId')
            .sort({ dueDate: 1 });

        // Update status and calculate fines
        for (let issue of overdueBooks) {
            issue.status = 'overdue';
            issue.fine = issue.calculateFine();
            await issue.save();
        }

        res.status(200).json({
            success: true,
            count: overdueBooks.length,
            overdueBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get current user's issued books
// @route   GET /api/issued/my-books
// @access  Private
const getMyBooks = async (req, res) => {
    try {
        const issuedBooks = await IssuedBook.find({
            user: req.user.id,
            status: { $in: ['issued', 'overdue'] }
        })
            .populate('book', 'title author isbn category')
            .sort({ issueDate: -1 });

        // Update overdue status
        for (let issue of issuedBooks) {
            issue.updateStatus();
            await issue.save();
        }

        res.status(200).json({
            success: true,
            count: issuedBooks.length,
            issuedBooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user's book history
// @route   GET /api/issued/history
// @access  Private
const getMyHistory = async (req, res) => {
    try {
        const history = await IssuedBook.find({ user: req.user.id })
            .populate('book', 'title author isbn')
            .sort({ issueDate: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/issued/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalIssued = await IssuedBook.countDocuments({ status: 'issued' });
        const totalOverdue = await IssuedBook.countDocuments({ status: 'overdue' });
        const totalCategories = await require('../models/Category').countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalBooks,
                totalUsers,
                totalIssued,
                totalOverdue,
                totalCategories
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    issueBook,
    returnBook,
    getAllIssuedBooks,
    getOverdueBooks,
    getMyBooks,
    getMyHistory,
    getStats
};
