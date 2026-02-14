import { cn } from '../../utils/helpers';

const PageHeader = ({
    title,
    subtitle,
    children, // Right-side actions (buttons)
    breadcrumbs,
    className,
}) => {
    return (
        <div className={cn('mb-6 sm:mb-8', className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && (
                <nav className="mb-3" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1.5 text-sm">
                        {breadcrumbs.map((crumb, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                                {idx > 0 && (
                                    <span className="text-text-tertiary">/</span>
                                )}
                                {crumb.href ? (
                                    <a
                                        href={crumb.href}
                                        className="text-text-secondary hover:text-primary-500 transition-colors"
                                    >
                                        {crumb.label}
                                    </a>
                                ) : (
                                    <span className="text-text-tertiary">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Title Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-text-secondary mt-1 text-sm sm:text-base">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Actions */}
                {children && (
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;