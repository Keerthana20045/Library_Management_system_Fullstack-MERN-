/**
 * My Books Page
 * Student view for currently issued books and history
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiBook, FiClock, FiCalendar, FiCheck, FiAlertCircle } from 'react-icons/fi';

const MyBooks = () => {
    const [currentBooks, setCurrentBooks] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('current');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [currentRes, historyRes] = await Promise.all([
                api.get('/issued/my-books'),
                api.get('/issued/history')
            ]);
            setCurrentBooks(currentRes.data.issuedBooks);
            setHistory(historyRes.data.history);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysRemaining = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
                <p className="text-gray-600">View your current and past borrowed books</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FiBook className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{currentBooks.length}</p>
                        <p className="text-gray-500 text-sm">Currently Borrowed</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <FiAlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {currentBooks.filter(b => b.status === 'overdue').length}
                        </p>
                        <p className="text-gray-500 text-sm">Overdue</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">
                            {history.filter(h => h.status === 'returned').length}
                        </p>
                        <p className="text-gray-500 text-sm">Total Returned</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`pb-3 px-1 font-medium transition-colors ${activeTab === 'current'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    Currently Borrowed ({currentBooks.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 font-medium transition-colors ${activeTab === 'history'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    History ({history.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'current' ? (
                currentBooks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiBook className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No books currently borrowed</h3>
                        <p className="text-gray-500">Visit the library to borrow books</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentBooks.map((issue) => {
                            const daysRemaining = getDaysRemaining(issue.dueDate);
                            const isOverdue = daysRemaining < 0;

                            return (
                                <div key={issue._id} className="card p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                                            <FiBook className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-info'}`}>
                                            {isOverdue ? 'Overdue' : 'Issued'}
                                        </span>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{issue.book?.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4">{issue.book?.author}</p>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <FiCalendar className="w-4 h-4 mr-2" />
                                            <span>Issued: {new Date(issue.issueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`flex items-center ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                            <FiClock className="w-4 h-4 mr-2" />
                                            <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {!isOverdue && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-blue-700 text-sm font-medium">
                                                {daysRemaining === 0 ? 'Due today!' : `${daysRemaining} days remaining`}
                                            </p>
                                        </div>
                                    )}

                                    {isOverdue && (
                                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                                            <p className="text-red-700 text-sm font-medium">
                                                Overdue by {Math.abs(daysRemaining)} days
                                            </p>
                                            {issue.fine > 0 && (
                                                <p className="text-red-600 text-sm mt-1">
                                                    Fine: Rs. {issue.fine}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )
            ) : (
                <div className="card">
                    {history.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No borrowing history yet
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Book</th>
                                        <th>Issue Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                        <th>Fine</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((issue) => (
                                        <tr key={issue._id}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                                                        <FiBook className="w-5 h-5 text-primary-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{issue.book?.title}</p>
                                                        <p className="text-gray-500 text-sm">{issue.book?.author}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-gray-600">
                                                {new Date(issue.issueDate).toLocaleDateString()}
                                            </td>
                                            <td className="text-gray-600">
                                                {issue.returnDate
                                                    ? new Date(issue.returnDate).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td>
                                                <span className={`badge ${issue.status === 'returned' ? 'badge-success' :
                                                        issue.status === 'overdue' ? 'badge-danger' : 'badge-info'
                                                    }`}>
                                                    {issue.status}
                                                </span>
                                            </td>
                                            <td>
                                                {issue.fine > 0 ? (
                                                    <span className="text-red-600 font-medium">Rs. {issue.fine}</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBooks;
