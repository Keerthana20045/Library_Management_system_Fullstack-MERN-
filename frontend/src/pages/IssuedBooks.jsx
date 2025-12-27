/**
 * Issued Books Page
 * Admin interface for issuing and returning books
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiBook, FiUser, FiPlus, FiRotateCcw, FiAlertCircle, FiCheck } from 'react-icons/fi';

const IssuedBooks = () => {
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [overdueBooks, setOverdueBooks] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [issueForm, setIssueForm] = useState({ bookId: '', userId: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issuedRes, overdueRes, booksRes, usersRes] = await Promise.all([
                api.get('/issued'),
                api.get('/issued/overdue'),
                api.get('/books'),
                api.get('/auth/users')
            ]);
            setIssuedBooks(issuedRes.data.issuedBooks);
            setOverdueBooks(overdueRes.data.overdueBooks);
            setBooks(booksRes.data.books.filter(b => b.available > 0));
            setUsers(usersRes.data.users);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleIssue = async (e) => {
        e.preventDefault();
        try {
            await api.post('/issued/issue', issueForm);
            toast.success('Book issued successfully');
            setShowIssueModal(false);
            setIssueForm({ bookId: '', userId: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue book');
        }
    };

    const handleReturn = async (id) => {
        if (!confirm('Confirm book return?')) return;
        try {
            const response = await api.put(`/issued/return/${id}`);
            toast.success(response.data.message);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Return failed');
        }
    };

    const displayedBooks = activeTab === 'overdue' ? overdueBooks : issuedBooks;
    const currentIssued = issuedBooks.filter(i => i.status === 'issued' || i.status === 'overdue');

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Issued Books</h1>
                    <p className="text-gray-600">Manage book issues and returns</p>
                </div>
                <button
                    onClick={() => setShowIssueModal(true)}
                    className="btn btn-primary flex items-center space-x-2"
                    disabled={books.length === 0}
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Issue Book</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FiBook className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{currentIssued.length}</p>
                        <p className="text-gray-500 text-sm">Currently Issued</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <FiAlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{overdueBooks.length}</p>
                        <p className="text-gray-500 text-sm">Overdue</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{issuedBooks.filter(i => i.status === 'returned').length}</p>
                        <p className="text-gray-500 text-sm">Returned (Total)</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-1 font-medium transition-colors ${activeTab === 'all'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    All Transactions
                </button>
                <button
                    onClick={() => setActiveTab('overdue')}
                    className={`pb-3 px-1 font-medium transition-colors flex items-center space-x-2 ${activeTab === 'overdue'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <span>Overdue</span>
                    {overdueBooks.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {overdueBooks.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>User</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedBooks.map((issue) => (
                                <tr key={issue._id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                                                <FiBook className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{issue.book?.title}</p>
                                                <p className="text-gray-500 text-sm">{issue.book?.isbn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-2">
                                            <FiUser className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-gray-900">{issue.user?.name}</p>
                                                <p className="text-gray-500 text-xs">{issue.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-gray-600">
                                        {new Date(issue.issueDate).toLocaleDateString()}
                                    </td>
                                    <td className="text-gray-600">
                                        {new Date(issue.dueDate).toLocaleDateString()}
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
                                    <td>
                                        {issue.status !== 'returned' && (
                                            <button
                                                onClick={() => handleReturn(issue._id)}
                                                className="btn btn-success text-sm py-1 px-3 flex items-center space-x-1"
                                            >
                                                <FiRotateCcw className="w-4 h-4" />
                                                <span>Return</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {displayedBooks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No {activeTab === 'overdue' ? 'overdue' : ''} records found
                    </div>
                )}
            </div>

            {/* Issue Book Modal */}
            <Modal
                isOpen={showIssueModal}
                onClose={() => setShowIssueModal(false)}
                title="Issue Book"
            >
                <form onSubmit={handleIssue} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Book</label>
                        <select
                            value={issueForm.bookId}
                            onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Choose a book</option>
                            {books.map((book) => (
                                <option key={book._id} value={book._id}>
                                    {book.title} ({book.available} available)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                        <select
                            value={issueForm.userId}
                            onChange={(e) => setIssueForm({ ...issueForm, userId: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Choose a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setShowIssueModal(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Issue Book
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default IssuedBooks;
