import { cn } from "@/lib/utils";

export const StatsCard = ({ title, value, icon: Icon, description, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
        green: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300",
        yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
        purple: "text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
        red: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300",
    };

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg", colorClasses[color] || colorClasses.blue)}>
                    {Icon && <Icon className="w-5 h-5" />}
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-sm font-medium",
                        trend === 'up' ? "text-green-500" : "text-red-500"
                    )}>
                        {trendValue}%
                        <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d={trend === 'up' 
                                ? "M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                                : "M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 112 0v11.586l2.293-2.293a1 1 0 011.414 0z"} 
                            clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            <h3 className="text-sm font-normal text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            </div>
            {description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
            )}
        </div>
    );
};

export const StatsGrid = ({ children }) => {
    return (
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
            {children}
        </div>
    );
};
