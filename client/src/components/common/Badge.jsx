import { cn } from '../../utils/helpers';

const badgeVariants = {
    success: 'bg-success-light text-success-dark',
    warning: 'bg-warning-light text-warning-dark',
    danger: 'bg-danger-light text-danger-dark',
    info: 'bg-info-light text-info-dark',
    neutral: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-50 text-primary-600',
};

/**
 * Maps common status strings to badge variants
 */
const statusVariantMap = {
    // Payment
    Paid: 'success',
    Pending: 'warning',
    Failed: 'danger',

    // Claim
    Approved: 'success',
    Rejected: 'danger',
    'Under-Review': 'info',

    // Renewal
    Expired: 'neutral',

    // Policy
    Active: 'success',
    Inactive: 'neutral',

    // General
    Sent: 'info',
    Delivered: 'success',
};

const Badge = ({ children, variant, status, className }) => {
    // Auto-detect variant from status if not provided
    const resolvedVariant = variant || statusVariantMap[status || children] || 'neutral';

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                badgeVariants[resolvedVariant],
                className
            )}
        >
            {children || status}
        </span>
    );
};

export default Badge;