import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Lightbulb, Lock, LogOut, Menu, X, User, ChevronRight } from 'lucide-react';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import AdminMembers from './AdminMembers';
import AdminIdeas from './AdminIdeas';
import AdminChangePassword from './AdminChangePassword';
import AdminProfile from './AdminProfile';
import logoSvg from '../assets/logo.svg';

function DashboardHome() {
    const [stats, setStats] = useState({ members: 0, ideas: 0, loading: true });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
                const [membersRes, ideasRes] = await Promise.all([
                    fetchWithRetry('/api/members', { headers }),
                    fetchWithRetry('/api/ideas', { headers })
                ]);

                let membersCount = 0;
                let ideasCount = 0;

                if (membersRes.ok) {
                    const mData = await membersRes.json();
                    membersCount = mData.length;
                }
                if (ideasRes.ok) {
                    const iData = await ideasRes.json();
                    ideasCount = iData.length;
                }

                setStats({ members: membersCount, ideas: ideasCount, loading: false });
            } catch (err) {
                console.error('Failed to fetch stats', err);
                setStats(s => ({ ...s, loading: false }));
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(135deg, #fff, var(--color-primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Dashboard Overview
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Welcome back. Here's what's happening in EcoPulse today.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass" style={{ padding: '32px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'scale(2)' }}>
                        <Users size={120} />
                    </div>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(76, 175, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)' }}>
                        <Users size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500', marginBottom: '4px' }}>Total Members</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#fff' }}>
                            {stats.loading ? '...' : stats.members}
                        </h2>
                    </div>
                </div>

                <div className="glass" style={{ padding: '32px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'scale(2)' }}>
                        <Lightbulb size={120} />
                    </div>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(33, 150, 243, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64B5F6' }}>
                        <Lightbulb size={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: '500', marginBottom: '4px' }}>Total Projects</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0, color: '#fff' }}>
                            {stats.loading ? '...' : stats.ideas}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <Link to="/admin/members" className="glass hover-lift" style={{ textDecoration: 'none', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.3s' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Users size={24} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Members Directory</span>
                        <ChevronRight size={20} style={{ color: 'var(--color-text-muted)', transition: 'transform 0.3s ease' }} className="chevron-icon" />
                    </div>
                </Link>

                <Link to="/admin/ideas" className="glass hover-lift" style={{ textDecoration: 'none', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.3s' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <Lightbulb size={24} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Manage Projects</span>
                        <ChevronRight size={20} style={{ color: 'var(--color-text-muted)', transition: 'transform 0.3s ease' }} className="chevron-icon" />
                    </div>
                </Link>

                <Link to="/admin/profile" className="glass hover-lift" style={{ textDecoration: 'none', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.3s' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <User size={24} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>My Profile</span>
                        <ChevronRight size={20} style={{ color: 'var(--color-text-muted)', transition: 'transform 0.3s ease' }} className="chevron-icon" />
                    </div>
                </Link>
            </div>

            <style>{`
                .hover-lift {
                    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s !important;
                }
                .hover-lift:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
                    background: rgba(255, 255, 255, 0.08) !important;
                }
                .hover-lift:hover .chevron-icon {
                    color: var(--color-primary-light) !important;
                    transform: translateX(4px);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

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
                <div style={{ marginBottom: '40px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={logoSvg} alt="EcoPulse" style={{ width: '40px', height: '40px' }} />
                    <div>
                        <h2 style={{ fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>EcoPulse</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Admin Panel</p>
                    </div>
                </div>

                <nav style={{ position: 'relative', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/admin/members" onClick={closeSidebar} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        color: isActive('members') ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        background: isActive('members') ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        textDecoration: 'none', transition: 'all 0.2s', fontWeight: '500'
                    }}>
                        <Users size={20} /> Members Directory
                    </Link>
                    <Link to="/admin/ideas" onClick={closeSidebar} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        color: isActive('ideas') ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        background: isActive('ideas') ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        textDecoration: 'none', transition: 'all 0.2s', fontWeight: '500'
                    }}>
                        <Lightbulb size={20} /> Projects & Ideas
                    </Link>
                    <Link to="/admin/profile" onClick={closeSidebar} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        color: isActive('profile') ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        background: isActive('profile') ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        textDecoration: 'none', transition: 'all 0.2s', fontWeight: '500'
                    }}>
                        <User size={20} /> My Profile
                    </Link>
                    <Link to="/admin/change-password" onClick={closeSidebar} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                        color: isActive('change-password') ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                        background: isActive('change-password') ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        textDecoration: 'none', transition: 'all 0.2s', fontWeight: '500'
                    }}>
                        <Lock size={20} /> Change Password
                    </Link>
                </nav>

                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#ff6b6b', textDecoration: 'none', transition: 'all 0.2s', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontSize: '1rem', fontWeight: '500' }}>
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/members" element={<AdminMembers />} />
                    <Route path="/ideas" element={<AdminIdeas />} />
                    <Route path="/profile" element={<AdminProfile />} />
                    <Route path="/change-password" element={<AdminChangePassword />} />
                </Routes>
            </main>
        </div>
    );
}
