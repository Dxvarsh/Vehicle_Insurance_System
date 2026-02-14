import { useSelector } from 'react-redux';
import { selectAuth } from '../../store/slices/authSlice';
import { PageHeader } from '../../components/common';
import { Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const ProfilePage = () => {
    const { user, customer } = useSelector(selectAuth);

    const profileFields = [
        {
            icon: Mail,
            label: 'Email',
            value: user?.email,
        },
        {
            icon: Phone,
            label: 'Contact Number',
            value: customer?.contactNumber || 'N/A',
        },
        {
            icon: MapPin,
            label: 'Address',
            value: customer?.address || 'N/A',
        },
        {
            icon: Shield,
            label: 'Role',
            value: user?.role,
        },
        {
            icon: Calendar,
            label: 'Member Since',
            value: user?.createdAt ? formatDate(user.createdAt) : 'N/A',
        },
    ];

    return (
        <div>
            <PageHeader
                title="My Profile"
                subtitle="View and manage your account information"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Profile' },
                ]}
            />

            <div className="max-w-3xl">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {customer?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {customer?.name || user?.username}
                                </h2>
                                <p className="text-primary-100 text-sm">
                                    {customer?.customerID || user?.userID}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            {profileFields.map((field, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 py-3 border-b border-border-light last:border-0"
                                >
                                    <div className="w-10 h-10 bg-bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <field.icon className="w-5 h-5 text-text-tertiary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-tertiary font-medium uppercase tracking-wide">
                                            {field.label}
                                        </p>
                                        <p className="text-sm text-text-primary font-medium mt-0.5">
                                            {field.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;