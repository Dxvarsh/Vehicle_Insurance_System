import { cn } from '../../utils/helpers';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({
    title,
    value,
    icon: Icon,
    trend,        // { value: 12, type: 'up' | 'down' | 'neutral', label: 'vs last month' }
    iconBgClass,  // e.g., 'bg-primary-50'
    iconClass,    // e.g., 'text-primary-500'
    className,
}) => {
    const trendConfig = {
        up: { Icon: TrendingUp, color: 'text-success', bg: 'bg-success-light' },
        down: { Icon: TrendingDown, color: 'text-danger', bg: 'bg-danger-light' },
        neutral: { Icon: Minus, color: 'text-text-secondary', bg: 'bg-bg-secondary' },
    };

    const trendStyle = trend ? trendConfig[trend.type] || trendConfig.neutral : null;

    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-sm border border-border-light p-6',
                'hover:shadow-md transition-shadow duration-200',
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>

                    {trend && (
                        <div className="flex items-center gap-1.5 mt-3">
                            <span
                                className={cn(
                                    'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold',
                                    trendStyle.bg,
                                    trendStyle.color
                                )}
                            >
                                <trendStyle.Icon className="w-3 h-3" />
                                {trend.value}%
                            </span>
                            {trend.label && (
                                <span className="text-xs text-text-tertiary">{trend.label}</span>
                            )}
                        </div>
                    )}
                </div>

                {Icon && (
                    <div
                        className={cn(
                            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                            iconBgClass || 'bg-primary-50'
                        )}
                    >
                        <Icon className={cn('w-6 h-6', iconClass || 'text-primary-500')} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;