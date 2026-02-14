import { Shield } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Logo = ({ size = 'md', showText = true, className }) => {
    const sizes = {
        sm: { icon: 'w-6 h-6', text: 'text-lg' },
        md: { icon: 'w-8 h-8', text: 'text-2xl' },
        lg: { icon: 'w-10 h-10', text: 'text-3xl' },
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div className="relative">
                <Shield
                    className={cn(sizes[size].icon, 'text-primary-500')}
                    fill="currentColor"
                    strokeWidth={1.5}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">V</span>
                </div>
            </div>
            {showText && (
                <span
                    className={cn(
                        sizes[size].text,
                        'font-bold text-primary-900 tracking-tight'
                    )}
                >
                    Secure<span className="text-primary-500">Insure</span>
                </span>
            )}
        </div>
    );
};

export default Logo;