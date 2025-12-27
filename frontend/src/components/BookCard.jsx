/**
 * BookCard Component
 * Displays book information in a card format
 */

import { FiBook, FiUser, FiTag, FiCalendar } from 'react-icons/fi';

const BookCard = ({ book, onAction, actionLabel, actionDisabled, showAvailability = true }) => {
    const isAvailable = book.available > 0;

    return (
        <div className="card-hover group">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FiBook className="w-6 h-6 text-primary-600" />
                    </div>
                    {showAvailability && (
                        <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                            {isAvailable ? `${book.available} available` : 'Not available'}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {book.title}
                </h3>

                {/* Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                        <FiUser className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{book.author}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <FiTag className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{book.category?.name || 'Uncategorized'}</span>
                    </div>
                    {book.publishedYear && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{book.publishedYear}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {book.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {book.description}
                    </p>
                )}

                {/* ISBN */}
                <p className="text-xs text-gray-400 mb-4">
                    ISBN: {book.isbn}
                </p>

                {/* Action button */}
                {onAction && (
                    <button
                        onClick={() => onAction(book)}
                        disabled={actionDisabled}
                        className={`w-full btn ${actionDisabled ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'btn-primary'}`}
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookCard;
