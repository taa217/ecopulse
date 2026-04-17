import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { fetchWithRetry } from '../utils/fetchWithRetry';

export default function AdminIdeas() {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIdeas = async () => {
        try {
            const res = await fetchWithRetry('/api/ideas', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (res.ok) setIdeas(data);
        } catch (e) { console.error('Failed to fetch ideas', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchIdeas(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this idea?')) return;
        try {
            await fetch(`/api/ideas/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            fetchIdeas();
        } catch (e) { console.error(e); }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Projects & Ideas</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage community projects, ideas, and their timelines.</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> New Idea
                </button>
            </div>

            <div className="admin-ideas-grid">
                {loading ? (
                    <div style={{ padding: '40px', color: 'var(--color-text-muted)' }}>Loading ideas...</div>
                ) : ideas.length === 0 ? (
                    <div style={{ padding: '40px', color: 'var(--color-text-muted)' }}>No ideas found. Add one!</div>
                ) : ideas.map((idea) => (
                    <div key={idea.id} className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#fff', lineHeight: 1.3 }}>{idea.projectName}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(idea.id)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
                            {idea.description || 'No description provided.'}
                        </p>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Authors</span>
                                <span style={{ color: '#fff' }}>{idea.authors || 'Unknown'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Timeline</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', color: '#fff' }}>
                                    <Clock size={12} /> {idea.timeline || 'Not set'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
