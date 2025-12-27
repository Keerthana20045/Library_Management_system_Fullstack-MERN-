/**
 * Admin Dashboard
 * Overview statistics and quick actions for administrators
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import { FiBook, FiUsers, FiBookOpen, FiAlertCircle, FiGrid, FiPlus, FiArrowRight } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        totalIssued: 0,
        totalOverdue: 0,
        totalCategories: 0
    });
    const [recentIssued, setRecentIssued] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, issuedRes] = await Promise.all([
                api.get('/issued/stats'),
                api.get('/issued')
            ]);

            setStats(statsRes.data.stats);
            setRecentIssued(issuedRes.data.issuedBooks.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your library.</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3">
                    <Link to="/admin/books" className="btn btn-primary flex items-center space-x-2">
                        <FiPlus className="w-4 h-4" />
                        <span>Add Book</span>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                    title="Total Books"
                    value={stats.totalBooks}
                    icon={FiBook}
                    color="primary"
                />
                <StatCard
                    title="Total Students"
                    value={stats.totalUsers}
                    icon={FiUsers}
                    color="info"
                />
                <StatCard
                    title="Categories"
                    value={stats.totalCategories}
                    icon={FiGrid}
                    color="secondary"
                />
                <StatCard
                    title="Currently Issued"
                    value={stats.totalIssued}
                    icon={FiBookOpen}
                    color="success"
                />
                <StatCard
                    title="Overdue Books"
                    value={stats.totalOverdue}
                    icon={FiAlertCircle}
                    color="danger"
                />
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/admin/books"
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl hover:from-primary-100 hover:to-primary-200 transition-all group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                                    <FiBook className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-gray-900">Manage Books</span>
                            </div>
                            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            to="/admin/categories"
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl hover:from-secondary-100 hover:to-secondary-200 transition-all group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
                                    <FiGrid className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-gray-900">Manage Categories</span>
                            </div>
                            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary-500 group-hover:translate-x-1 transition-all" />
                        </Link>

                        <Link
                            to="/admin/issued"
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <FiBookOpen className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium text-gray-900">Issue / Return Books</span>
                            </div>
                            <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Recent Issued Books */}
                <div className="lg:col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                        <Link to="/admin/issued" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                            View All
                        </Link>
                    </div>

                    {recentIssued.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No recent transactions
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="pb-3">Book</th>
                                        <th className="pb-3">User</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentIssued.map((issue) => (
                                        <tr key={issue._id} className="text-sm">
                                            <td className="py-3">
                                                <p className="font-medium text-gray-900">{issue.book?.title}</p>
                                            </td>
                                            <td className="py-3 text-gray-600">{issue.user?.name}</td>
                                            <td className="py-3">
                                                <span className={`badge ${issue.status === 'returned' ? 'badge-success' :
                                                        issue.status === 'overdue' ? 'badge-danger' : 'badge-info'
                                                    }`}>
                                                    {issue.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-600">
                                                {new Date(issue.dueDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
