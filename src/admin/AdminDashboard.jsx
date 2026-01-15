import { useState } from 'react';
import { useNavigate, useLocation, Link, Routes, Route } from 'react-router-dom';
import { Users, Settings as SettingsIcon, MessageSquare, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

import Registrants from './components/Registrants';
import Settings from './components/Settings';
import WhatsAppSettings from './components/WhatsAppSettings';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            toast.info("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navItems = [
        { name: 'Registrants', path: '/admin/dashboard', icon: <Users size={20} /> },
        { name: 'Settings', path: '/admin/dashboard/settings', icon: <SettingsIcon size={20} /> },
        { name: 'WhatsApp', path: '/admin/dashboard/whatsapp', icon: <MessageSquare size={20} /> },
    ];

    const isActive = (path) => {
        // Exact match for root dashboard, includes check for others
        if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
        if (path !== '/admin/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="admin-container">
            {/* Mobile Overlay */}
            <div
                className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Toggle */}
            <button
                className="admin-mobile-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px', height: '32px', background: 'var(--primary-blue)', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
                    }}>TS</div>
                    <span style={{ fontWeight: 700, fontSize: '18px' }}>Admin Panel</span>
                </div>

                <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                color: isActive(item.path) ? 'var(--primary-blue)' : 'var(--text-grey)',
                                background: isActive(item.path) ? 'var(--sky-blue)' : 'transparent',
                                fontWeight: isActive(item.path) ? 600 : 500
                            }}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '16px' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                            padding: '12px 16px', background: 'transparent', color: 'var(--error)',
                            fontWeight: 500
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Registrants />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/whatsapp" element={<WhatsAppSettings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
