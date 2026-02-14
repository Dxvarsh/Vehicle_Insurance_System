import { NavLink } from 'react-router-dom';
import { X, ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { getNavItemsByRole } from '../../utils/navigation';
import Logo from '../common/Logo';
import { cn } from '../../utils/helpers';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const user = useSelector(selectUser);
    const navItems = getNavItemsByRole(user?.role);

    return (
        <>
            {/* ── Mobile Overlay ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-white border-r border-border-light z-50',
                    'transition-all duration-300 ease-in-out',
                    'flex flex-col',
                    // Mobile: slide in/out
                    'lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    // Desktop: collapsed or expanded
                    isCollapsed ? 'lg:w-20' : 'lg:w-64'
                )}
            >
                {/* ── Header ── */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border-light flex-shrink-0">
                    {!isCollapsed && <Logo size="sm" />}
                    {isCollapsed && (
                        <div className="w-full flex justify-center">
                            <Logo size="sm" showText={false} />
                        </div>
                    )}

                    {/* Mobile Close */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className={cn(
                            'hidden lg:flex p-1.5 rounded-lg hover:bg-bg-secondary text-text-secondary transition-all',
                            isCollapsed && 'absolute -right-3 top-5 bg-white border border-border-light shadow-sm'
                        )}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronLeft
                            className={cn(
                                'w-4 h-4 transition-transform duration-300',
                                isCollapsed && 'rotate-180'
                            )}
                        />
                    </button>
                </div>

                {/* ── Navigation ── */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    {navItems.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="mb-6">
                            {/* Section Title */}
                            {!isCollapsed && (
                                <p className="px-3 mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                                    {section.title}
                                </p>
                            )}

                            {isCollapsed && sectionIdx > 0 && (
                                <div className="mx-3 mb-3 border-t border-border-light" />
                            )}

                            {/* Menu Items */}
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            onClick={onClose}
                                            className={({ isActive }) =>
                                                cn(
                                                    'flex items-center rounded-lg transition-all duration-200',
                                                    'group relative',
                                                    isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 gap-3',
                                                    isActive
                                                        ? 'bg-primary-50 text-primary-600 font-semibold'
                                                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                                )
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full" />
                                                    )}

                                                    {/* Icon */}
                                                    <item.icon
                                                        className={cn(
                                                            'w-5 h-5 flex-shrink-0',
                                                            isActive ? 'text-primary-500' : 'text-text-tertiary group-hover:text-text-secondary'
                                                        )}
                                                    />

                                                    {/* Label */}
                                                    {!isCollapsed && (
                                                        <span className="text-sm">{item.label}</span>
                                                    )}

                                                    {/* Tooltip for collapsed state */}
                                                    {isCollapsed && (
                                                        <div className="absolute left-full ml-2 px-3 py-1.5 bg-primary-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                                                            {item.label}
                                                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-primary-900 rotate-45" />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* ── Footer ── */}
                <div className="border-t border-border-light p-3 flex-shrink-0">
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary-600">
                                    {user?.role?.charAt(0)}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-text-primary truncate">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-text-tertiary truncate">
                                    {user?.role}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-primary-600">
                                    {user?.role?.charAt(0)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;