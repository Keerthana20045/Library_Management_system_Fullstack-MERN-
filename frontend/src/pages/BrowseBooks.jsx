/**
 * Browse Books Page
 * Student interface for viewing and searching available books
 */

import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import { FiSearch, FiFilter } from 'react-icons/fi';

const BrowseBooks = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

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
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let url = '/books/search?';
            if (searchQuery) url += `q=${searchQuery}&`;
            if (selectedCategory) url += `category=${selectedCategory}`;

            const response = await api.get(url);
            setBooks(response.data.books);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        fetchData();
    };

    // Filter books client-side for better UX
    const filteredBooks = books.filter(book => {
        const matchesSearch = !searchQuery ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || book.category?._id === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                <h1 className="text-3xl font-bold text-gray-900">Browse Books</h1>
                <p className="text-gray-600">Explore our collection of books</p>
            </div>

            {/* Search and Filter */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search by title or author..."
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input pl-11 pr-10 min-w-[180px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleSearch} className="btn btn-primary">
                            Search
                        </button>
                        {(searchQuery || selectedCategory) && (
                            <button onClick={clearFilters} className="btn btn-secondary">
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Showing <span className="font-medium text-gray-900">{filteredBooks.length}</span> books
                </p>
            </div>

            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiSearch className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            showAvailability={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseBooks;
