/**
 * Manage Categories Page
 * Admin interface for category CRUD operations
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiGrid } from 'react-icons/fi';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.categories);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', formData);
                toast.success('Category added successfully');
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cannot delete category with books');
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
                    <p className="text-gray-600">Organize books by categories</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary flex items-center space-x-2">
                    <FiPlus className="w-4 h-4" />
                    <span>Add Category</span>
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="card-hover p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
                                <FiGrid className="w-6 h-6 text-secondary-600" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => openEditModal(category)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-gray-500 text-sm">{category.description || 'No description'}</p>
                        <p className="text-xs text-gray-400 mt-4">
                            Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="card p-12 text-center text-gray-500">
                    No categories found. Create your first category!
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="Category name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows="3"
                            placeholder="Brief description"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingCategory ? 'Update' : 'Add'} Category
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageCategories;
