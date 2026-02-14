import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { cn } from '../../utils/helpers';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleCollapse}
            />

            {/* Main Content Area */}
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                )}
            >
                {/* Navbar */}
                <Navbar onMenuToggle={toggleSidebar} />

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;