import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Menu,
    Bell,
    Search,
    ChevronDown,
    User,
    Settings,
    LogOut,
    HelpCircle,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../../store/slices/authSlice';
import { fetchUnreadCount } from '../../store/slices/notificationSlice';
import useAuth from '../../hooks/useAuth';
import { cn, getInitials, getDashboardRoute } from '../../utils/helpers';

const Navbar = ({ onMenuToggle }) => {
    const dispatch = useDispatch();
    const { user, customer } = useSelector(selectAuth);
    const { unreadCount } = useSelector((state) => state.notification);
    const { logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        if (user && user.role === 'Customer') {
            dispatch(fetchUnreadCount());
        }
    }, [dispatch, user]);

    const displayName = customer?.name || user?.username || 'User';
    const displayEmail = user?.email || '';
    const initials = getInitials(displayName);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await logout();
    };

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-border-light">
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
                {/* ── Left Section ── */}
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search policies, vehicles, claims..."
                                className={cn(
                                    'pl-10 pr-4 py-2 w-72 lg:w-96',
                                    'rounded-lg border border-border-light bg-bg-primary',
                                    'text-sm text-text-primary placeholder-text-tertiary',
                                    'focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500',
                                    'transition-all duration-200'
                                )}
                            />
                        </div>
                    </div>

                    {/* Search Button (Mobile) */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Right Section ── */}
                <div className="flex items-center gap-2">
                    {/* Help */}
                    <button
                        className="hidden sm:flex p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
                        aria-label="Help"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* Notifications (Customer Only) */}
                    {user?.role === 'Customer' && (
                        <Link
                            to="/notifications"
                            className="relative p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            {/* Unread Badge */}
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Divider */}
                    <div className="hidden sm:block w-px h-8 bg-border-light mx-1" />

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className={cn(
                                'flex items-center gap-2 p-1.5 pr-3 rounded-lg transition-colors',
                                isProfileOpen ? 'bg-bg-secondary' : 'hover:bg-bg-secondary'
                            )}
                        >
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{initials}</span>
                            </div>

                            {/* Name & Role (Desktop) */}
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-text-primary leading-tight">
                                    {displayName}
                                </p>
                                <p className="text-xs text-text-tertiary leading-tight">
                                    {user?.role}
                                </p>
                            </div>

                            <ChevronDown
                                className={cn(
                                    'hidden sm:block w-4 h-4 text-text-tertiary transition-transform duration-200',
                                    isProfileOpen && 'rotate-180'
                                )}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-border-light py-2 z-50">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-border-light">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {initials}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-text-primary truncate">
                                                {displayName}
                                            </p>
                                            <p className="text-xs text-text-secondary truncate">
                                                {displayEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                    <Link
                                        to={getDashboardRoute(user?.role)}
                                        onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-border-light pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger hover:bg-danger-light transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Search Bar (Expandable) ── */}
            {isSearchOpen && (
                <div className="md:hidden px-4 pb-3 border-t border-border-light pt-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            autoFocus
                            className={cn(
                                'w-full pl-10 pr-4 py-2.5',
                                'rounded-lg border border-border-light bg-bg-primary',
                                'text-sm text-text-primary placeholder-text-tertiary',
                                'focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500'
                            )}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;