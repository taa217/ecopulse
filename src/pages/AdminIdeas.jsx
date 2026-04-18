import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock, X, Check } from 'lucide-react';
import { fetchWithRetry } from '../utils/fetchWithRetry';

export default function AdminIdeas() {
    const [ideas, setIdeas] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ projectName: '', description: '', timeline: '', collaboratorIds: [] });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const [ideasRes, membersRes] = await Promise.all([
                fetchWithRetry('/api/ideas', { headers: { Authorization: `Bearer ${token}` } }),
                fetchWithRetry('/api/members', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (ideasRes.ok) setIdeas(await ideasRes.json());
            if (membersRes.ok) setMembers(await membersRes.json());
        } catch (e) { console.error('Failed to fetch data', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await fetch(`/api/ideas/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleOpenModal = () => {
        setFormData({ projectName: '', description: '', timeline: '', collaboratorIds: [] });
        setError(null);
        setIsModalOpen(true);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/ideas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create project');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleCollaborator = (id) => {
        setFormData(prev => ({
            ...prev,
            collaboratorIds: prev.collaboratorIds.includes(id)
                ? prev.collaboratorIds.filter(cId => cId !== id)
                : [...prev.collaboratorIds, id]
        }));
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Projects & Ideas</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage community projects, ideas, and their timelines.</p>
                </div>
                <button onClick={handleOpenModal} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
                    <Plus size={18} style={{ marginRight: '8px' }} /> New Project
                </button>
            </div>

            <div className="admin-ideas-grid">
                {loading ? (
                    <div style={{ padding: '40px', color: 'var(--color-text-muted)' }}>Loading projects...</div>
                ) : ideas.length === 0 ? (
                    <div style={{ padding: '40px', color: 'var(--color-text-muted)' }}>No projects found. Add one!</div>
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

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ flex: 1, minWidth: '120px' }}>
                                    <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>Author:</span>
                                    <span style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                        {idea.member ? idea.member.name : 'Unknown Author'}
                                    </span>
                                </div>
                                <div style={{ flex: 2 }}>
                                    <span style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>Collaborators:</span>
                                    {idea.collaborators && idea.collaborators.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {idea.collaborators.map(c => (
                                                <span key={c.id} style={{ background: 'rgba(76, 175, 80, 0.15)', color: 'var(--color-primary-light)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                                    {c.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-muted)' }}>No tagged team members</span>
                                    )}
                                </div>
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

            {/* Add Project Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', color: '#fff' }}>Add New Project</h2>
                        {error && <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}

                        <form onSubmit={submitForm}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Project Name *</label>
                                <input required type="text" value={formData.projectName} onChange={e => setFormData({ ...formData, projectName: e.target.value })} className="input-field" placeholder="E.g. Community Garden" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Description *</label>
                                <textarea required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field" placeholder="Describe the goal and impact..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box', resize: 'vertical' }} />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Timeline Info</label>
                                <input type="text" value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} className="input-field" placeholder="E.g. Q3 2026 or Spring Semester" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '12px', color: '#fff', fontSize: '1.1rem' }}>Tag Collaborators</label>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Select team members who contributed to this project.</p>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '8px', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
                                    {members.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>No members found.</div>}
                                    {members.map(member => {
                                        const isSelected = formData.collaboratorIds.includes(member.id);
                                        return (
                                            <div key={member.id} onClick={() => toggleCollaborator(member.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', background: isSelected ? 'rgba(76, 175, 80, 0.1)' : 'transparent', border: `1px solid ${isSelected ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${isSelected ? 'var(--color-primary-light)' : 'var(--color-text-muted)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--color-primary-light)' : 'transparent' }}>
                                                    {isSelected && <Check size={14} color="#fff" />}
                                                </div>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{member.role === 'ADMIN' ? 'Admin' : 'Member'}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: '12px 24px', borderRadius: '12px', color: '#fff' }}>Cancel</button>
                                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '12px', opacity: submitting ? 0.7 : 1 }}>
                                    {submitting ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
