/**
 * Book Model
 * Defines the schema for library books
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a book title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Please provide an author name'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    isbn: {
        type: String,
        required: [true, 'Please provide an ISBN'],
        unique: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    publishedYear: {
        type: Number,
        min: [1000, 'Invalid year'],
        max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: [0, 'Quantity cannot be negative'],
        default: 1
    },
    available: {
        type: Number,
        min: [0, 'Available copies cannot be negative'],
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure available doesn't exceed quantity
bookSchema.pre('save', function (next) {
    if (this.available > this.quantity) {
        this.available = this.quantity;
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);
