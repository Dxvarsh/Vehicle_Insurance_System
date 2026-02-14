import { cn } from '../../utils/helpers';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    children, // Action button
    className,
}) => {
    return (
        <div className={cn('text-center py-12 px-4', className)}>
            {Icon && (
                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-text-tertiary" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
            {description && (
                <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
                    {description}
                </p>
            )}
            {children}
        </div>
    );
};

export default EmptyState;