import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Mail, Phone, BookOpen, Calendar, Hash, Shield, User, Briefcase, Rocket, Users, ChevronRight } from 'lucide-react';
import { fetchWithRetry } from '../utils/fetchWithRetry';

export default function AdminMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemberData, setNewMemberData] = useState({
        name: '', email: '', role: 'MEMBER', position: '',
        fieldOfStudy: '', yearOfStudy: '', registrationNumber: '',
        contactInfo: '', password: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        if (selectedMember && !selectedMember.ideas) {
            const fetchDetails = async () => {
                try {
                    const res = await fetchWithRetry(`/api/members/${selectedMember.id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setSelectedMember(prev => prev?.id === data.id ? { ...prev, ...data } : prev);
                    }
                } catch (e) { console.error('Failed to fetch details', e); }
            };
            fetchDetails();
        }
    }, [selectedMember]);

    const projectTimeline = React.useMemo(() => {
        if (!selectedMember) return [];
        const created = (selectedMember.ideas || []).map(idea => ({ ...idea, type: 'created' }));
        const collaborated = (selectedMember.collaboratedIdeas || []).map(idea => ({ ...idea, type: 'collaborated' }));
        return [...created, ...collaborated].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [selectedMember]);

    const fetchMembers = async () => {
        try {
            const res = await fetchWithRetry('/api/members', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            const data = await res.json();
            if (res.ok) setMembers(data);
        } catch (e) { console.error('Failed to fetch members', e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        const currentFirstName = newMemberData.name.split(' ')[0];
        const newFirstName = newName.split(' ')[0];

        setNewMemberData(prev => {
            const shouldUpdatePassword = !prev.password || prev.password === currentFirstName;
            return {
                ...prev,
                name: newName,
                ...(shouldUpdatePassword ? { password: newFirstName } : {})
            };
        });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetchWithRetry('/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(newMemberData)
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewMemberData({
                    name: '', email: '', role: 'MEMBER', position: '',
                    fieldOfStudy: '', yearOfStudy: '', registrationNumber: '',
                    contactInfo: '', password: ''
                });
                fetchMembers();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to add member');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = (id) => {
        setMemberToDelete(id);
    };

    const handleDelete = async () => {
        if (!memberToDelete) return;
        const id = memberToDelete;
        setMemberToDelete(null);
        try {
            const res = await fetchWithRetry(`/api/members/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            if (res.ok) {
                setSelectedMember(null);
                fetchMembers();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete member');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred while deleting.');
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleColor = (role) => {
        return role === 'ADMIN'
            ? { bg: 'rgba(76, 175, 80, 0.15)', color: '#66BB6A', border: 'rgba(76, 175, 80, 0.3)' }
            : { bg: 'rgba(255,255,255,0.06)', color: '#8b949e', border: 'rgba(255,255,255,0.1)' };
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Members Directory</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage club members and track their activity.</p>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', borderRadius: '12px' }}
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={18} style={{ marginRight: '8px' }} /> Add Member
                </button>
            </div>

            <div className="glass table-responsive" style={{ padding: '0', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Name & Role</th>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Email & Position</th>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Program</th>
                            <th style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Loading members...</td></tr>
                        ) : members.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No members found.</td></tr>
                        ) : members.map((m) => (
                            <tr
                                key={m.id}
                                onClick={() => setSelectedMember(m)}
                                title="Click to view member details"
                                style={{
                                    borderTop: '1px solid var(--color-border)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s ease',
                                    background: selectedMember?.id === m.id ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                onMouseLeave={e => e.currentTarget.style.background = selectedMember?.id === m.id ? 'rgba(76, 175, 80, 0.08)' : 'transparent'}
                            >
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ fontWeight: '500', color: '#fff' }}>{m.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{m.role}</div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div>{m.email}</div>
                                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', background: m.role === 'ADMIN' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.1)', color: m.role === 'ADMIN' ? 'var(--color-primary-light)' : '#aaa', marginTop: '4px' }}>{m.position || 'Member'}</span>
                                </td>
                                <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                                    {m.fieldOfStudy || '-'} <br /> {m.yearOfStudy ? `Year ${m.yearOfStudy}` : ''}
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                                            View Details <ChevronRight size={16} />
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); confirmDelete(m.id); }} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '6px' }} title="Delete member"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Member Detail Overlay */}
            {selectedMember && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setSelectedMember(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 200,
                            animation: 'fadeIn 0.25s ease',
                        }}
                    />

                    {/* Detail Panel */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            maxWidth: '480px',
                            background: 'linear-gradient(180deg, rgba(15,20,25,0.98) 0%, rgba(10,14,18,0.99) 100%)',
                            borderLeft: '1px solid var(--color-border)',
                            zIndex: 201,
                            overflowY: 'auto',
                            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Header / Profile Section */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(76,175,80,0.12) 0%, rgba(33,150,243,0.08) 100%)',
                            padding: '32px 28px 28px',
                            borderBottom: '1px solid var(--color-border)',
                            position: 'relative',
                        }}>
                            <button
                                onClick={() => setSelectedMember(null)}
                                style={{
                                    position: 'absolute',
                                    top: '16px',
                                    right: '16px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    color: '#aaa',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#aaa'; }}
                            >
                                <X size={18} />
                            </button>

                            {/* Avatar */}
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, var(--color-primary), #2E7D32)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '16px',
                                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.25)',
                            }}>
                                {getInitials(selectedMember.name)}
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                                {selectedMember.name}
                            </h2>
                            <p style={{ color: 'var(--color-primary-light)', fontWeight: '500', fontSize: '0.95rem', marginBottom: '12px' }}>
                                {selectedMember.position || 'Member'}
                            </p>

                            {/* Role Badge */}
                            {(() => {
                                const rc = getRoleColor(selectedMember.role);
                                return (
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 14px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '500',
                                        background: rc.bg,
                                        color: rc.color,
                                        border: `1px solid ${rc.border}`,
                                    }}>
                                        <Shield size={13} />
                                        {selectedMember.role}
                                    </span>
                                );
                            })()}
                        </div>

                        {/* Detail Fields */}
                        <div style={{ padding: '24px 28px', flex: 1 }}>
                            <DetailSection title="Contact Information">
                                <DetailRow icon={<Mail size={16} />} label="Email" value={selectedMember.email} />
                                <DetailRow icon={<Phone size={16} />} label="Phone" value={selectedMember.contactInfo || '-'} />
                            </DetailSection>

                            <DetailSection title="Academic Details">
                                <DetailRow icon={<BookOpen size={16} />} label="Field of Study" value={selectedMember.fieldOfStudy || '-'} />
                                <DetailRow icon={<Hash size={16} />} label="Year of Study" value={selectedMember.yearOfStudy ? `Year ${selectedMember.yearOfStudy}` : '-'} />
                                <DetailRow icon={<Hash size={16} />} label="Registration No." value={selectedMember.registrationNumber || '-'} />
                            </DetailSection>

                            <DetailSection title="Membership">
                                <DetailRow icon={<Briefcase size={16} />} label="Position" value={selectedMember.position || 'Member'} />
                                <DetailRow icon={<Calendar size={16} />} label="Birthday" value={selectedMember.birthdays || '-'} />
                                <DetailRow icon={<Calendar size={16} />} label="Joined" value={formatDate(selectedMember.createdAt)} />
                            </DetailSection>

                            {selectedMember.activityHistory && (
                                <DetailSection title="Activity History">
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                                        {selectedMember.activityHistory}
                                    </p>
                                </DetailSection>
                            )}

                            {/* Project History Timeline */}
                            <div style={{ marginTop: '32px' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={18} /> Project History Timeline
                                </h3>

                                {projectTimeline.length > 0 ? (
                                    <div style={{ position: 'relative', paddingLeft: '24px' }}>
                                        <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '0', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>

                                        {projectTimeline.map((item, index) => (
                                            <div key={item.id} style={{ position: 'relative', marginBottom: index !== projectTimeline.length - 1 ? '32px' : '0' }}>
                                                <div style={{ position: 'absolute', left: '-22.5px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: item.type === 'created' ? 'var(--color-primary)' : '#4dabf7', border: '2px solid #1a1a1a' }}></div>

                                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s', cursor: 'default' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.type === 'created' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(77, 171, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.type === 'created' ? 'var(--color-primary-light)' : '#4dabf7', flexShrink: 0 }}>
                                                            {item.type === 'created' ? <Rocket size={24} /> : <Users size={24} />}
                                                        </div>
                                                        <div>
                                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff' }}>
                                                                {item.projectName}
                                                            </h4>
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px', fontWeight: '500' }}>
                                                                {item.type === 'created' ? 'Worked on project' : 'Collaborated on project'} • {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </div>
                                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ddd', lineHeight: '1.5' }}>
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--color-text-muted)', padding: '24px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
                                        No project history yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div style={{
                            padding: '20px 28px',
                            borderTop: '1px solid var(--color-border)',
                            display: 'flex',
                            gap: '12px',
                        }}>
                            <button
                                className="btn btn-outline"
                                style={{ flex: 1, borderRadius: '12px', padding: '10px', fontSize: '0.9rem' }}
                            >
                                <Edit2 size={15} /> Edit
                            </button>
                            <button
                                onClick={() => confirmDelete(selectedMember.id)}
                                className="btn"
                                style={{
                                    flex: 1,
                                    borderRadius: '12px',
                                    padding: '10px',
                                    fontSize: '0.9rem',
                                    background: 'rgba(255,107,107,0.12)',
                                    color: '#ff6b6b',
                                    border: '1px solid rgba(255,107,107,0.2)',
                                }}
                            >
                                <Trash2 size={15} /> Delete
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Add Member Modal */}
            {showAddModal && (
                <>
                    <div
                        onClick={() => setShowAddModal(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 200,
                            animation: 'fadeIn 0.25s ease',
                        }}
                    />
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '500px',
                            background: 'linear-gradient(180deg, rgba(15,20,25,0.98) 0%, rgba(10,14,18,0.99) 100%)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '16px',
                            zIndex: 201,
                            padding: '24px',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                            animation: 'fadeIn 0.25s ease',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff' }}>Add New Member</h2>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newMemberData.name}
                                    onChange={handleNameChange}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    placeholder="e.g. Clyde Tadiwa"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={newMemberData.email}
                                    onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    placeholder="clydetadiwa@example.com"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Default Password</label>
                                <input
                                    type="text"
                                    required
                                    value={newMemberData.password}
                                    onChange={(e) => setNewMemberData({ ...newMemberData, password: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', marginTop: '4px' }}>
                                    Defaults to first name.
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Position</label>
                                <input
                                    type="text"
                                    value={newMemberData.position}
                                    onChange={(e) => setNewMemberData({ ...newMemberData, position: e.target.value })}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    placeholder="e.g. Event Coordinator"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Field of Study</label>
                                    <input
                                        type="text"
                                        value={newMemberData.fieldOfStudy}
                                        onChange={(e) => setNewMemberData({ ...newMemberData, fieldOfStudy: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Year of Study</label>
                                    <input
                                        type="text"
                                        value={newMemberData.yearOfStudy}
                                        onChange={(e) => setNewMemberData({ ...newMemberData, yearOfStudy: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Registration No.</label>
                                    <input
                                        type="text"
                                        value={newMemberData.registrationNumber}
                                        onChange={(e) => setNewMemberData({ ...newMemberData, registrationNumber: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Contact Info (Phone)</label>
                                    <input
                                        type="text"
                                        value={newMemberData.contactInfo}
                                        onChange={(e) => setNewMemberData({ ...newMemberData, contactInfo: e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="btn btn-outline"
                                    style={{ padding: '10px 20px', borderRadius: '8px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ padding: '10px 20px', borderRadius: '8px' }}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {memberToDelete && (
                <>
                    <div
                        onClick={() => setMemberToDelete(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 300,
                            animation: 'fadeIn 0.25s ease',
                        }}
                    />
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '400px',
                            background: 'linear-gradient(180deg, rgba(15,20,25,0.98) 0%, rgba(10,14,18,0.99) 100%)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '16px',
                            zIndex: 301,
                            padding: '24px',
                            boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                            animation: 'fadeIn 0.25s ease',
                            textAlign: 'center'
                        }}
                    >
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>Confirm Deletion</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                            Are you sure you want to delete this member? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <button
                                onClick={() => setMemberToDelete(null)}
                                className="btn btn-outline"
                                style={{ padding: '10px 20px', borderRadius: '8px', flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn"
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    flex: 1,
                                    background: 'rgba(255,107,107,0.12)',
                                    color: '#ff6b6b',
                                    border: '1px solid rgba(255,107,107,0.2)',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

/* --- Helper Sub-Components --- */

function DetailSection({ title, children }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <h4 style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--color-text-muted)',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
                {title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {children}
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.04)',
            transition: 'background 0.2s',
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-light)',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '0.9rem', color: '#e6edf3', wordBreak: 'break-word' }}>{value}</div>
            </div>
        </div>
    );
}
