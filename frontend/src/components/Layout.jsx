/**
 * Layout Component
 * Main layout with sidebar navigation
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiHome,
    FiBook,
    FiGrid,
    FiBookOpen,
    FiLogOut,
    FiMenu,
    FiX,
    FiUser,
    FiClock
} from 'react-icons/fi';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation items based on role
    const adminNavItems = [
        { path: '/admin', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/books', icon: FiBook, label: 'Manage Books' },
        { path: '/admin/categories', icon: FiGrid, label: 'Categories' },
        { path: '/admin/issued', icon: FiBookOpen, label: 'Issued Books' },
    ];

    const studentNavItems = [
        { path: '/student', icon: FiHome, label: 'Dashboard' },
        { path: '/student/books', icon: FiBook, label: 'Browse Books' },
        { path: '/student/my-books', icon: FiBookOpen, label: 'My Books' },
    ];

    const navItems = isAdmin ? adminNavItems : studentNavItems;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <FiBook className="text-white text-lg" />
                        </div>
                        <span className="text-white font-bold text-lg">LibraryMS</span>
                    </Link>
                    <button
                        className="lg:hidden text-gray-400 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* User info */}
                <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                            <FiUser className="text-white" />
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">{user?.name}</p>
                            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 glass border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <FiClock className="w-4 h-4" />
                                <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    <div className="animate-fadeIn">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
