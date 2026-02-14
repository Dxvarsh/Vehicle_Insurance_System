import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Input = ({
    label,
    type = 'text',
    placeholder,
    error,
    helperText,
    icon: Icon,
    disabled = false,
    required = false,
    className = '',
    id,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={cn('mb-4', className)}>
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-text-primary mb-2"
                >
                    {label}
                    {required && <span className="text-danger ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon
                            className={cn(
                                'w-5 h-5',
                                error ? 'text-danger' : 'text-text-tertiary'
                            )}
                        />
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={inputId}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        'w-full rounded-lg border bg-white',
                        'text-base text-text-primary placeholder-text-tertiary',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-100',
                        'disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60',
                        Icon ? 'pl-12 pr-4 py-3' : 'px-4 py-3',
                        isPassword ? 'pr-12' : '',
                        error
                            ? 'border-danger focus:border-danger focus:ring-danger-light'
                            : 'border-border-main focus:border-primary-500'
                    )}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}

                {/* Error Icon */}
                {error && !isPassword && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <AlertCircle className="w-5 h-5 text-danger" />
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="mt-1.5 text-sm text-danger flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {helperText && !error && (
                <p className="mt-1.5 text-xs text-text-secondary">{helperText}</p>
            )}
        </div>
    );
};

export default Input;