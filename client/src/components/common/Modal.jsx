import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlay = true,
}) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    'relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden',
                    'animate-in fade-in zoom-in-95 duration-200',
                    sizeClasses[size]
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
                        <h3
                            id="modal-title"
                            className="text-lg font-semibold text-text-primary"
                        >
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-tertiary hover:text-text-secondary transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 bg-bg-primary border-t border-border-light">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;