/**
 * Main App Component
 * Sets up routing and global providers
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManageBooks from './pages/ManageBooks';
import ManageCategories from './pages/ManageCategories';
import IssuedBooks from './pages/IssuedBooks';
import BrowseBooks from './pages/BrowseBooks';
import MyBooks from './pages/MyBooks';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/student"} />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={isAdmin ? "/admin" : "/student"} />} />

            {/* Protected Admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
            <Route path="/admin/books" element={<ProtectedRoute adminOnly><Layout><ManageBooks /></Layout></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute adminOnly><Layout><ManageCategories /></Layout></ProtectedRoute>} />
            <Route path="/admin/issued" element={<ProtectedRoute adminOnly><Layout><IssuedBooks /></Layout></ProtectedRoute>} />

            {/* Protected Student routes */}
            <Route path="/student" element={<ProtectedRoute><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
            <Route path="/student/books" element={<ProtectedRoute><Layout><BrowseBooks /></Layout></ProtectedRoute>} />
            <Route path="/student/my-books" element={<ProtectedRoute><Layout><MyBooks /></Layout></ProtectedRoute>} />

            {/* Redirect root to appropriate dashboard */}
            <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin" : "/student") : "/login"} />} />

            {/* 404 - Redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
