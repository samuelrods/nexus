import { cn } from "@/lib/utils";

export const StatsCard = ({ title, value, icon: Icon, description, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
        blue: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
        green: "text-green-600 bg-green-500/10 dark:text-green-400",
        yellow: "text-yellow-600 bg-yellow-500/10 dark:text-yellow-400",
        purple: "text-purple-600 bg-purple-500/10 dark:text-purple-400",
        red: "text-red-600 bg-red-500/10 dark:text-red-400",
    };

    return (
        <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
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
            <h3 className="text-sm font-normal text-muted-foreground">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
            {description && (
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
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
