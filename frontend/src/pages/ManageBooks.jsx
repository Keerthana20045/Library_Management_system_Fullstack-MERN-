/**
 * Manage Books Page
 * Admin interface for CRUD operations on books
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBook } from 'react-icons/fi';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        category: '',
        description: '',
        publishedYear: '',
        quantity: 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [booksRes, categoriesRes] = await Promise.all([
                api.get('/books'),
                api.get('/categories')
            ]);
            setBooks(booksRes.data.books);
            setCategories(categoriesRes.data.categories);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchData();
            return;
        }
        try {
            const response = await api.get(`/books/search?q=${searchQuery}`);
            setBooks(response.data.books);
        } catch (error) {
            toast.error('Search failed');
        }
    };

    const openAddModal = () => {
        setEditingBook(null);
        setFormData({
            title: '',
            author: '',
            isbn: '',
            category: categories[0]?._id || '',
            description: '',
            publishedYear: '',
            quantity: 1
        });
        setShowModal(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            category: book.category?._id || '',
            description: book.description || '',
            publishedYear: book.publishedYear || '',
            quantity: book.quantity
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBook) {
                await api.put(`/books/${editingBook._id}`, formData);
                toast.success('Book updated successfully');
            } else {
                await api.post('/books', formData);
                toast.success('Book added successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            toast.success('Book deleted successfully');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
    );

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
                    <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
                    <p className="text-gray-600">Add, edit, and manage library books</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary flex items-center space-x-2">
                    <FiPlus className="w-4 h-4" />
                    <span>Add Book</span>
                </button>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search by title, author, or ISBN..."
                            className="input pl-11"
                        />
                    </div>
                    <button onClick={handleSearch} className="btn btn-secondary">
                        Search
                    </button>
                </div>
            </div>

            {/* Books Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>ISBN</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book._id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                                                <FiBook className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{book.title}</p>
                                                <p className="text-gray-500 text-sm">{book.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-gray-600">{book.isbn}</td>
                                    <td>
                                        <span className="badge badge-info">{book.category?.name}</span>
                                    </td>
                                    <td className="text-gray-600">{book.quantity}</td>
                                    <td>
                                        <span className={`badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}`}>
                                            {book.available}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(book)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No books found
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingBook ? 'Edit Book' : 'Add New Book'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="input"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                            <input
                                type="text"
                                value={formData.isbn}
                                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                className="input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Published Year</label>
                            <input
                                type="number"
                                value={formData.publishedYear}
                                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                className="input"
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows="3"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingBook ? 'Update' : 'Add'} Book
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageBooks;
