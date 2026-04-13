import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Lightbulb, LogOut, Leaf, Menu, X } from 'lucide-react';
import AdminMembers from './AdminMembers';
import AdminIdeas from './AdminIdeas';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const isActive = (path) => location.pathname.includes(path);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="admin-layout">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={`admin-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>EcoPulse</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Admin Panel</p>
                </div>

                <nav style={{ position: 'relative', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/admin/members" onClick={closeSidebar} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        color: isActive('members') ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        background: isActive('members') ? 'rgba(18, 183, 106, 0.1)' : 'transparent',
                        textDecoration: 'none', transition: 'all 0.2s', fontWeight: '500'
                    }}>
                        <Users size={20} /> Members Directory
                    </Link>
                    <Link to="/admin/ideas" onClick={closeSidebar} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        color: isActive('ideas') ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        background: isActive('ideas') ? 'rgba(18, 183, 106, 0.1)' : 'transparent',
                        textDecoration: 'none', transition: 'all 0.2s', fontWeight: '500'
                    }}>
                        <Lightbulb size={20} /> Projects & Ideas
                    </Link>
                </nav>

                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#ff6b6b', textDecoration: 'none', transition: 'all 0.2s', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: '1rem', fontWeight: '500' }}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Routes>
                    <Route path="/" element={
                        <div className="glass welcome-glass" style={{ padding: '60px', textAlign: 'center', borderRadius: '24px' }}>
                            <div style={{ background: 'rgba(18, 183, 106, 0.15)', width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--color-primary)' }}>
                                <Leaf size={40} />
                            </div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Welcome to the Admin Dashboard</h2>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>Select a section from the sidebar to manage members and ideas/projects.</p>
                        </div>
                    } />
                    <Route path="/members" element={<AdminMembers />} />
                    <Route path="/ideas" element={<AdminIdeas />} />
                </Routes>
            </main>
        </div>
    );
}
