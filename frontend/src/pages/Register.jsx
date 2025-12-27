/**
 * Register Page
 * New user registration form
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiBook, FiUserPlus, FiHash } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        studentId: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            studentId: formData.studentId,
            role: 'student'
        });

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-700 p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                            <FiBook className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-white text-2xl font-bold">LibraryMS</span>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Join Our<br />
                        Learning<br />
                        Community
                    </h1>

                    <p className="text-secondary-100 text-lg max-w-md">
                        Create your account and get access to our extensive collection of books,
                        journals, and digital resources.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">5000+</p>
                            <p className="text-secondary-200 text-sm">Books</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">50+</p>
                            <p className="text-secondary-200 text-sm">Categories</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">1000+</p>
                            <p className="text-secondary-200 text-sm">Users</p>
                        </div>
                    </div>
                    <p className="text-secondary-200 text-sm">
                        © 2024 Library Management System
                    </p>
                </div>

                {/* Background decorations */}
                <div className="absolute top-20 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
            </div>

            {/* Right side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                            <FiBook className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-gray-900 text-2xl font-bold">LibraryMS</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input pl-11"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input pl-11"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Student ID (Optional)
                            </label>
                            <div className="relative">
                                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    className="input pl-11"
                                    placeholder="Enter your student ID"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input pl-11"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input pl-11"
                                        placeholder="Confirm"
                                        required
                                    />
                                </div>
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
                                    <FiUserPlus className="w-5 h-5" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
