import {
    LayoutDashboard,
    Users,
    Car,
    FileText,
    Calculator,
    RefreshCw,
    AlertTriangle,
    Bell,
    BarChart3,
    Settings,
    Shield,
    ClipboardList,
    CreditCard,
    User,
    FilePlus,
    UserPlus,
} from 'lucide-react';

/**
 * Navigation menu items based on user roles
 */

// Customer Navigation
export const customerNavItems = [
    {
        title: 'Main',
        items: [
            {
                label: 'Dashboard',
                path: '/dashboard',
                icon: LayoutDashboard,
            },
            {
                label: 'My Profile',
                path: '/profile',
                icon: User,
            },
        ],
    },
    {
        title: 'Vehicle & Policy',
        items: [
            {
                label: 'My Vehicles',
                path: '/vehicles',
                icon: Car,
            },
            {
                label: 'Browse Policies',
                path: '/policies',
                icon: FileText,
            },
            {
                label: 'My Premiums',
                path: '/premiums',
                icon: CreditCard,
            },
        ],
    },
    {
        title: 'Services',
        items: [
            {
                label: 'Renewals',
                path: '/renewals',
                icon: RefreshCw,
            },
            {
                label: 'My Claims',
                path: '/claims',
                icon: AlertTriangle,
            },
            {
                label: 'Notifications',
                path: '/notifications',
                icon: Bell,
            },
        ],
    },
];

// Admin Navigation
export const adminNavItems = [
    {
        title: 'Main',
        items: [
            {
                label: 'Dashboard',
                path: '/admin/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'Management',
        items: [
            {
                label: 'Customers',
                path: '/admin/customers',
                icon: Users,
            },
            {
                label: 'Vehicles',
                path: '/admin/vehicles',
                icon: Car,
            },
            {
                label: 'Policies',
                path: '/admin/policies',
                icon: FileText,
            },
            {
                label: 'Premiums',
                path: '/admin/premiums',
                icon: Calculator,
            },
        ],
    },
    {
        title: 'Operations',
        items: [
            {
                label: 'Renewals',
                path: '/admin/renewals',
                icon: RefreshCw,
            },
            {
                label: 'Claims',
                path: '/admin/claims',
                icon: AlertTriangle,
            },
        ],
    },
    {
        title: 'Analytics',
        items: [
            {
                label: 'Reports',
                path: '/admin/reports',
                icon: BarChart3,
            },
        ],
    },
];

// Staff Navigation
export const staffNavItems = [
    {
        title: 'Main',
        items: [
            {
                label: 'Dashboard',
                path: '/staff/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'Management',
        items: [
            {
                label: 'Customers',
                path: '/staff/customers',
                icon: Users,
            },
            {
                label: 'Register Customer',
                path: '/staff/customers/new',
                icon: UserPlus,
            },
            {
                label: 'Vehicles',
                path: '/staff/vehicles',
                icon: Car,
            },
        ],
    },
    {
        title: 'Services',
        items: [
            {
                label: 'Policies',
                path: '/staff/policies',
                icon: FileText,
            },
            {
                label: 'Premiums',
                path: '/staff/premiums',
                icon: CreditCard,
            },
            {
                label: 'Renewals',
                path: '/staff/renewals',
                icon: RefreshCw,
            },
            {
                label: 'Claims',
                path: '/staff/claims',
                icon: AlertTriangle,
            },
        ],
    },
    {
        title: 'Analytics',
        items: [
            {
                label: 'Reports',
                path: '/staff/reports',
                icon: BarChart3,
            },
        ],
    },
];

/**
 * Get navigation items based on role
 */
export const getNavItemsByRole = (role) => {
    switch (role) {
        case 'Admin':
            return adminNavItems;
        case 'Staff':
            return staffNavItems;
        case 'Customer':
            return customerNavItems;
        default:
            return [];
    }
};