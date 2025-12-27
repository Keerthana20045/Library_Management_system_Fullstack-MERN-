/**
 * StatCard Component
 * Displays dashboard statistics
 */

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
    const colorClasses = {
        primary: 'from-primary-500 to-primary-600',
        secondary: 'from-secondary-500 to-secondary-600',
        success: 'from-green-500 to-green-600',
        warning: 'from-yellow-500 to-yellow-600',
        danger: 'from-red-500 to-red-600',
        info: 'from-blue-500 to-blue-600'
    };

    return (
        <div className="card p-6 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
                <p className="text-gray-500 text-sm">{title}</p>
            </div>

            {/* Background decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500`} />
        </div>
    );
};

export default StatCard;
