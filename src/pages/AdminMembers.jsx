import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/members', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (res.ok) setMembers(data);
        } catch (e) { console.error('Failed to fetch members', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;
        try {
            await fetch(`/api/members/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            fetchMembers();
        } catch (e) { console.error(e); }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Members Directory</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage club members and track their activity.</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> Add Member
                </button>
            </div>

            <div className="glass table-responsive" style={{ padding: '0', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Name</th>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Email & Role</th>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Study / Year</th>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading members...</td></tr>
                        ) : members.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No members found.</td></tr>
                        ) : members.map((m) => (
                            <tr key={m.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ fontWeight: '500', color: '#fff' }}>{m.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{m.position || 'Member'}</div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div>{m.email}</div>
                                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', background: m.role === 'ADMIN' ? 'rgba(18, 183, 106, 0.2)' : 'rgba(255,255,255,0.1)', color: m.role === 'ADMIN' ? 'var(--color-primary-light)' : '#aaa', marginTop: '4px' }}>{m.role}</span>
                                </td>
                                <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    {m.fieldOfStudy || '-'} <br /> {m.yearOfStudy ? `Year ${m.yearOfStudy}` : ''}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '6px' }}><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '6px', marginLeft: '8px' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
