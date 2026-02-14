import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const alertStyles = {
    success: {
        container: 'bg-success-light border-success',
        icon: 'text-success',
        title: 'text-success-dark',
        message: 'text-success-dark',
        IconComponent: CheckCircle,
    },
    error: {
        container: 'bg-danger-light border-danger',
        icon: 'text-danger',
        title: 'text-danger-dark',
        message: 'text-danger-dark',
        IconComponent: AlertCircle,
    },
    warning: {
        container: 'bg-warning-light border-warning',
        icon: 'text-warning',
        title: 'text-warning-dark',
        message: 'text-warning-dark',
        IconComponent: AlertTriangle,
    },
    info: {
        container: 'bg-info-light border-info',
        icon: 'text-info',
        title: 'text-info-dark',
        message: 'text-info-dark',
        IconComponent: Info,
    },
};

const Alert = ({ type = 'info', title, message, onClose, className }) => {
    const styles = alertStyles[type];
    const { IconComponent } = styles;

    return (
        <div
            className={cn(
                'border-l-4 p-4 rounded-r-lg',
                styles.container,
                className
            )}
            role="alert"
        >
            <div className="flex items-start">
                <IconComponent className={cn('w-5 h-5 mt-0.5 flex-shrink-0', styles.icon)} />
                <div className="ml-3 flex-1">
                    {title && (
                        <h4 className={cn('text-sm font-semibold', styles.title)}>
                            {title}
                        </h4>
                    )}
                    {message && (
                        <p className={cn('text-sm mt-1', styles.message)}>{message}</p>
                    )}
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={cn('ml-3 flex-shrink-0', styles.icon, 'hover:opacity-70')}
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;