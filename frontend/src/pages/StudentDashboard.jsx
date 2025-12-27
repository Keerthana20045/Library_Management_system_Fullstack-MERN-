/**
 * Student Dashboard
 * Overview for students with available books and current issues
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { FiBook, FiBookOpen, FiClock, FiArrowRight, FiSearch } from 'react-icons/fi';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [availableBooks, setAvailableBooks] = useState([]);
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [booksRes, myBooksRes] = await Promise.all([
                api.get('/books'),
                api.get('/issued/my-books')
            ]);

            // Get only available books (limit to 4 for display)
            const available = booksRes.data.books.filter(book => book.available > 0).slice(0, 4);
            setAvailableBooks(available);
            setMyBooks(myBooksRes.data.issuedBooks);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                    <p className="text-primary-100 mb-6">Ready to explore some amazing books today?</p>
                    <Link
                        to="/student/books"
                        className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                    >
                        <FiSearch className="w-5 h-5" />
                        <span>Browse Library</span>
                    </Link>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10">
                    <FiBook className="w-64 h-64 transform translate-x-10 translate-y-10" />
                </div>
            </div>

            {/* My Current Books */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Current Books</h2>
                    <Link to="/student/my-books" className="text-primary-600 font-medium hover:text-primary-700 flex items-center space-x-1">
                        <span>View All</span>
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {myBooks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiBookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No books issued yet</h3>
                        <p className="text-gray-500 mb-6">Visit the library to browse and request books</p>
                        <Link to="/student/books" className="btn btn-primary inline-flex items-center space-x-2">
                            <FiBook className="w-4 h-4" />
                            <span>Browse Books</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myBooks.slice(0, 3).map((issue) => (
                            <div key={issue._id} className="card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                                        <FiBook className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <span className={`badge ${issue.status === 'overdue' ? 'badge-danger' : 'badge-info'
                                        }`}>
                                        {issue.status}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{issue.book?.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">{issue.book?.author}</p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FiClock className="w-4 h-4 mr-2" />
                                    <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                                </div>
                                {issue.fine > 0 && (
                                    <p className="mt-2 text-red-500 text-sm font-medium">
                                        Fine: Rs. {issue.fine}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Available Books */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Available Books</h2>
                    <Link to="/student/books" className="text-primary-600 font-medium hover:text-primary-700 flex items-center space-x-1">
                        <span>View All</span>
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {availableBooks.map((book) => (
                        <BookCard key={book._id} book={book} showAvailability={true} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
