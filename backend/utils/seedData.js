/**
 * Seed Data Script
 * Populates the database with sample data for testing
 * Run: npm run seed
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Book = require('../models/Book');
const IssuedBook = require('../models/IssuedBook');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Sample Categories
const categories = [
    { name: 'Fiction', description: 'Fictional stories and novels' },
    { name: 'Science', description: 'Scientific books and research' },
    { name: 'History', description: 'Historical events and biographies' },
    { name: 'Technology', description: 'Computer science and technology' },
    { name: 'Literature', description: 'Classic and modern literature' }
];

// Sample Books (will be populated with category IDs)
const books = [
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-446-31078-9', description: 'A classic novel about racial injustice', publishedYear: 1960, quantity: 5, categoryIndex: 0 },
    { title: '1984', author: 'George Orwell', isbn: '978-0-452-28423-4', description: 'Dystopian social science fiction novel', publishedYear: 1949, quantity: 4, categoryIndex: 0 },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', description: 'A novel about the American Dream', publishedYear: 1925, quantity: 3, categoryIndex: 4 },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0-553-38016-3', description: 'Cosmology for the general reader', publishedYear: 1988, quantity: 3, categoryIndex: 1 },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '978-0-19-929115-1', description: 'Evolutionary biology classic', publishedYear: 1976, quantity: 2, categoryIndex: 1 },
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0-06-231609-7', description: 'History of human evolution', publishedYear: 2011, quantity: 4, categoryIndex: 2 },
    { title: 'The Art of War', author: 'Sun Tzu', isbn: '978-1-59030-227-7', description: 'Ancient Chinese military treatise', publishedYear: -500, quantity: 3, categoryIndex: 2 },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', description: 'A handbook of agile software craftsmanship', publishedYear: 2008, quantity: 5, categoryIndex: 3 },
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', isbn: '978-0-13-595705-9', description: 'From journeyman to master', publishedYear: 2019, quantity: 4, categoryIndex: 3 },
    { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0-201-63361-0', description: 'Elements of reusable object-oriented software', publishedYear: 1994, quantity: 3, categoryIndex: 3 },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0-262-03384-8', description: 'Comprehensive algorithms textbook', publishedYear: 2009, quantity: 6, categoryIndex: 3 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', description: 'Classic romantic novel', publishedYear: 1813, quantity: 4, categoryIndex: 4 },
    { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', isbn: '978-0-14-044913-6', description: 'Psychological drama novel', publishedYear: 1866, quantity: 2, categoryIndex: 4 },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-316-76948-0', description: 'Coming-of-age novel', publishedYear: 1951, quantity: 3, categoryIndex: 0 },
    { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0-06-085052-4', description: 'Dystopian novel', publishedYear: 1932, quantity: 4, categoryIndex: 0 }
];

// Sample Users
const users = [
    { name: 'Admin User', email: 'admin@library.com', password: 'admin123', role: 'admin' },
    { name: 'John Doe', email: 'student1@test.com', password: 'password123', role: 'student', studentId: 'STU001' },
    { name: 'Jane Smith', email: 'student2@test.com', password: 'password123', role: 'student', studentId: 'STU002' }
];

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Book.deleteMany({});
        await IssuedBook.deleteMany({});

        console.log('Cleared existing data...');

        // Create users
        const createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users`);

        // Create categories
        const createdCategories = await Category.create(categories);
        console.log(`Created ${createdCategories.length} categories`);

        // Create books with category references
        const booksWithCategories = books.map(book => ({
            ...book,
            category: createdCategories[book.categoryIndex]._id,
            available: book.quantity
        }));

        // Remove categoryIndex as it's not in the schema
        booksWithCategories.forEach(book => delete book.categoryIndex);

        const createdBooks = await Book.create(booksWithCategories);
        console.log(`Created ${createdBooks.length} books`);

        // Create sample issued books
        const sampleIssues = [
            {
                book: createdBooks[0]._id,
                user: createdUsers[1]._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            },
            {
                book: createdBooks[7]._id,
                user: createdUsers[1]._id,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
            },
            {
                book: createdBooks[3]._id,
                user: createdUsers[2]._id,
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago (overdue)
            }
        ];

        const createdIssues = await IssuedBook.create(sampleIssues);

        // Update book availability for issued books
        for (let issue of createdIssues) {
            await Book.findByIdAndUpdate(issue.book, { $inc: { available: -1 } });
        }

        console.log(`Created ${createdIssues.length} issued book records`);

        console.log('\n=== Seed Data Created Successfully ===');
        console.log('\nTest Accounts:');
        console.log('Admin: admin@library.com / admin123');
        console.log('Student 1: student1@test.com / password123');
        console.log('Student 2: student2@test.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
