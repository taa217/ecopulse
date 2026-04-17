import React, { useState } from 'react';
import { Leaf, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function AdminAuth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to login');

            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSetup = async () => {
        try {
            const res = await fetch('/api/auth/setup', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                alert(`Setup successful! Please login with:\nEmail: ${data.email}\nPassword: ${data.password}`);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Setup failed: " + err.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '20px' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 0%, rgba(76, 175, 80, 0.15) 0%, transparent 50%)', pointerEvents: 'none' }}></div>

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ background: 'rgba(76, 175, 80, 0.15)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--color-primary)' }}>
                        <Lock size={30} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Admin Login</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Secure access for admins and members</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(255, 50, 50, 0.1)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(255,50,50,0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                            placeholder="admin@ecopulse.org"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <button onClick={handleSetup} style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', cursor: 'pointer', textDecoration: 'underline' }}>
                        Run First-Time Setup
                    </button>
                </div>
            </div>
        </div>
    );
}
