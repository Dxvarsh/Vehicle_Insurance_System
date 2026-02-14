import { AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Select = ({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('mb-4', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-text-primary mb-2"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      {/* Select Container */}
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

        <select
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg border bg-white appearance-none cursor-pointer',
            'text-base text-text-primary',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-100',
            'disabled:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-60',
            Icon ? 'pl-12 pr-10 py-3' : 'px-4 pr-10 py-3',
            error
              ? 'border-danger focus:border-danger focus:ring-danger-light'
              : 'border-border-main focus:border-primary-500'
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="w-5 h-5 text-text-tertiary" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 text-sm text-danger flex items-center">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Helper */}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-text-secondary">{helperText}</p>
      )}
    </div>
  );
};

export default Select;