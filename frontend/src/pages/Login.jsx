/**
 * Login Page
 * User authentication form
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiBook, FiLogIn } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            toast.success('Welcome back!');
            navigate('/');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                            <FiBook className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-white text-2xl font-bold">LibraryMS</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Welcome to the<br />
                        Library Management<br />
                        System
                    </h1>

                    <p className="text-primary-100 text-lg max-w-md">
                        Access thousands of books, manage your reading history, and discover new titles
                        all in one place.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold">A</div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold">B</div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold">C</div>
                        </div>
                        <span className="text-primary-100">Join 1000+ users</span>
                    </div>
                    <p className="text-primary-200 text-sm">
                        © 2024 Library Management System
                    </p>
                </div>

                {/* Background decorations */}
                <div className="absolute top-20 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
            </div>

            {/* Right side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                            <FiBook className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-gray-900 text-2xl font-bold">LibraryMS</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
                        <p className="text-gray-600">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input pl-11"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pl-11"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiLogIn className="w-5 h-5" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
                        <p className="text-sm font-medium text-primary-800 mb-2">Demo Credentials:</p>
                        <div className="text-sm text-primary-700 space-y-1">
                            <p><span className="font-medium">Admin:</span> admin@library.com / admin123</p>
                            <p><span className="font-medium">Student:</span> student1@test.com / password123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
