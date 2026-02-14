import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const variants = {
    primary:
        'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm hover:shadow-md',
    secondary:
        'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
    danger:
        'bg-danger hover:bg-danger-dark text-white shadow-sm hover:shadow-md',
    ghost:
        'text-primary-500 hover:text-primary-600 hover:bg-primary-50',
    outline:
        'border-2 border-border-main text-text-primary hover:bg-bg-secondary',
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    type = 'button',
    className = '',
    leftIcon,
    rightIcon,
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={cn(
                'inline-flex items-center justify-center font-semibold rounded-lg',
                'transition-all duration-200 ease-in-out',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    {leftIcon && <span className="mr-2">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;