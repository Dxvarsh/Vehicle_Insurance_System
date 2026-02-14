import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

// Full Page Loader
export const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary text-sm font-medium">Loading...</p>
        </div>
    </div>
);

// Inline Spinner
export const Spinner = ({ size = 'md', className }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <Loader2
            className={cn(
                sizes[size],
                'text-primary-500 animate-spin',
                className
            )}
        />
    );
};

// Skeleton Loader
export const Skeleton = ({ className, ...props }) => (
    <div
        className={cn('animate-pulse bg-gray-200 rounded', className)}
        {...props}
    />
);

// Card Skeleton
export const CardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-border-light p-6">
        <div className="animate-pulse space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
            <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    </div>
);

export default PageLoader;