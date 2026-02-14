import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { Skeleton } from './Loader';

const DataTable = ({
    columns,
    data,
    pagination,
    onPageChange,
    isLoading,
    emptyMessage = 'No data found',
    emptyIcon: EmptyIcon,
}) => {
    const totalPages = pagination?.totalPages || 1;
    const currentPage = pagination?.currentPage || 1;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light">
                    {/* Header */}
                    <thead className="bg-bg-secondary">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={cn(
                                        'px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider',
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-border-light">
                        {isLoading ? (
                            // Loading Skeleton
                            Array.from({ length: 5 }).map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    {columns.map((_, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4">
                                            <Skeleton className="h-4 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data?.length > 0 ? (
                            // Data Rows
                            data.map((row, rowIdx) => (
                                <tr
                                    key={row._id || rowIdx}
                                    className="hover:bg-bg-primary transition-colors"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={cn(
                                                'px-6 py-4 text-sm',
                                                col.cellClassName
                                            )}
                                        >
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            // Empty State
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-16 text-center"
                                >
                                    {EmptyIcon && (
                                        <EmptyIcon className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                                    )}
                                    <p className="text-text-secondary font-medium">
                                        {emptyMessage}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && data?.length > 0 && (
                <div className="px-6 py-4 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-text-secondary">
                        Showing{' '}
                        <span className="font-semibold text-text-primary">
                            {(currentPage - 1) * pagination.limit + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-semibold text-text-primary">
                            {Math.min(currentPage * pagination.limit, pagination.totalRecords)}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-text-primary">
                            {pagination.totalRecords}
                        </span>{' '}
                        results
                    </p>

                    <div className="flex items-center gap-1">
                        {/* First Page */}
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="First page"
                        >
                            <ChevronsLeft className="w-4 h-4 text-text-secondary" />
                        </button>

                        {/* Previous */}
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4 text-text-secondary" />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => {
                                if (totalPages <= 5) return true;
                                if (p === 1 || p === totalPages) return true;
                                if (Math.abs(p - currentPage) <= 1) return true;
                                return false;
                            })
                            .map((p, idx, arr) => {
                                // Add ellipsis
                                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                                return (
                                    <span key={p} className="flex items-center">
                                        {showEllipsis && (
                                            <span className="px-2 text-text-tertiary">...</span>
                                        )}
                                        <button
                                            onClick={() => onPageChange(p)}
                                            className={cn(
                                                'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                                                p === currentPage
                                                    ? 'bg-primary-500 text-white'
                                                    : 'text-text-secondary hover:bg-bg-secondary'
                                            )}
                                        >
                                            {p}
                                        </button>
                                    </span>
                                );
                            })}

                        {/* Next */}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4 text-text-secondary" />
                        </button>

                        {/* Last Page */}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Last page"
                        >
                            <ChevronsRight className="w-4 h-4 text-text-secondary" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;