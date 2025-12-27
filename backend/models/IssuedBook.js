/**
 * IssuedBook Model
 * Tracks book issues, returns, and overdue status
 */

const mongoose = require('mongoose');

const issuedBookSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true, 'Book reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['issued', 'returned', 'overdue'],
        default: 'issued'
    },
    fine: {
        type: Number,
        default: 0
    }
});

// Set default due date to 14 days from issue
issuedBookSchema.pre('save', function (next) {
    if (!this.dueDate) {
        const dueDate = new Date(this.issueDate);
        dueDate.setDate(dueDate.getDate() + 14);
        this.dueDate = dueDate;
    }
    next();
});

// Calculate fine for overdue books (Rs. 5 per day)
issuedBookSchema.methods.calculateFine = function () {
    if (this.status === 'returned' || !this.dueDate) return 0;

    const today = new Date();
    const dueDate = new Date(this.dueDate);

    if (today > dueDate) {
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * 5; // Rs. 5 per day
    }
    return 0;
};

// Update status based on dates
issuedBookSchema.methods.updateStatus = function () {
    if (this.returnDate) {
        this.status = 'returned';
    } else if (new Date() > new Date(this.dueDate)) {
        this.status = 'overdue';
        this.fine = this.calculateFine();
    }
    return this.status;
};

module.exports = mongoose.model('IssuedBook', issuedBookSchema);
