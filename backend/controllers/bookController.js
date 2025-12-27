/**
 * Book Controller
 * Handles CRUD operations for books
 */

const Book = require('../models/Book');
const Category = require('../models/Category');

// @desc    Get all books
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('category', 'name');
        res.status(200).json({
            success: true,
            count: books.length,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
const getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('category', 'name');
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Search books
// @route   GET /api/books/search?q=term
// @access  Private
const searchBooks = async (req, res) => {
    try {
        const { q, category } = req.query;
        let query = {};

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } },
                { isbn: { $regex: q, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const books = await Book.find(query).populate('category', 'name');
        res.status(200).json({
            success: true,
            count: books.length,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
    try {
        const { title, author, isbn, category, description, publishedYear, quantity } = req.body;

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            category,
            description,
            publishedYear,
            quantity,
            available: quantity
        });

        await book.populate('category', 'name');

        res.status(201).json({
            success: true,
            book
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A book with this ISBN already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // If category is being updated, verify it exists
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }

        book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('category', 'name');

        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        await book.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = { getBooks, getBook, searchBooks, createBook, updateBook, deleteBook };
