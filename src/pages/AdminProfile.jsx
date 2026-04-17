import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, BookOpen, Calendar, Briefcase, Hash, Shield, Save, X, Edit2 } from 'lucide-react';
import '../index.css';

export default function AdminProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    // Retrieve logged in user from localStorage
    const loggedInUserStr = localStorage.getItem('adminUser');
    const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

    useEffect(() => {
        if (loggedInUser && loggedInUser.id) {
            fetchProfile(loggedInUser.id);
        } else {
            setError("User not authenticated.");
            setLoading(false);
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`/api/members/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch profile details');

            const data = await res.json();
            setProfile(data);
            setEditForm(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        startSaving();
    };

    const startSaving = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`/api/members/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: editForm.name,
                    position: editForm.position,
                    contactInfo: editForm.contactInfo,
                    fieldOfStudy: editForm.fieldOfStudy,
                    yearOfStudy: editForm.yearOfStudy,
                    birthdays: editForm.birthdays,
                    activityHistory: editForm.activityHistory,
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update profile');
            }

            const updatedProfile = await res.json();
            setProfile(updatedProfile);
            setEditForm(updatedProfile);
            setIsEditing(false);

            // Optionally update localStorage if name changes
            if (loggedInUser && updatedProfile.name !== loggedInUser.name) {
                const newUser = { ...loggedInUser, name: updatedProfile.name };
                localStorage.setItem('adminUser', JSON.stringify(newUser));
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Loading profile...</div>;
    if (error) return <div style={{ padding: '40px', color: '#ff6b6b', textAlign: 'center' }}>{error}</div>;
    if (!profile) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', animate: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>My Profile</h1>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Edit2 size={18} /> Edit Profile
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => { setIsEditing(false); setEditForm(profile); }} className="btn btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <X size={18} /> Cancel
                        </button>
                        <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} disabled={saving}>
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            <div className="glass" style={{ padding: '40px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '32px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#fff', boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)' }}>
                        {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editForm.name || ''}
                                onChange={handleChange}
                                style={{ fontSize: '1.8rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', padding: '4px 12px', outline: 'none', marginBottom: '8px', width: '100%' }}
                            />
                        ) : (
                            <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0' }}>{profile.name}</h2>
                        )}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ display: 'inline-flex', padding: '4px 12px', background: profile.role === 'ADMIN' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)', color: profile.role === 'ADMIN' ? 'var(--color-primary-light)' : '#ccc', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                                {profile.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                    <DetailItem icon={<Mail />} label="Email Address">
                        <div style={{ color: '#fff', padding: isEditing ? '8px 12px' : '0', background: isEditing ? 'rgba(0,0,0,0.1)' : 'transparent', borderRadius: '8px' }}>
                            {profile.email} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>(Cannot be changed)</span>
                        </div>
                    </DetailItem>

                    <DetailItem icon={<Phone />} label="Contact Info">
                        {isEditing ? (
                            <input type="text" name="contactInfo" value={editForm.contactInfo || ''} onChange={handleChange} style={inputStyle} placeholder="Phone number" />
                        ) : (
                            <div style={{ color: profile.contactInfo ? '#fff' : 'var(--color-text-muted)' }}>{profile.contactInfo || 'Not provided'}</div>
                        )}
                    </DetailItem>

                    <DetailItem icon={<Briefcase />} label="Position">
                        {isEditing ? (
                            <input type="text" name="position" value={editForm.position || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Content Creator" />
                        ) : (
                            <div style={{ color: profile.position ? '#fff' : 'var(--color-text-muted)' }}>{profile.position || 'Standard Member'}</div>
                        )}
                    </DetailItem>

                    <DetailItem icon={<Hash />} label="Registration Number">
                        <div style={{ color: profile.registrationNumber ? '#fff' : 'var(--color-text-muted)', padding: isEditing ? '8px 12px' : '0', background: isEditing ? 'rgba(0,0,0,0.1)' : 'transparent', borderRadius: '8px' }}>
                            {profile.registrationNumber || 'Not provided'} {isEditing && <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginLeft: '8px' }}>(Contact admin to change)</span>}
                        </div>
                    </DetailItem>

                    <DetailItem icon={<BookOpen />} label="Field of Study">
                        {isEditing ? (
                            <input type="text" name="fieldOfStudy" value={editForm.fieldOfStudy || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Environmental Science" />
                        ) : (
                            <div style={{ color: profile.fieldOfStudy ? '#fff' : 'var(--color-text-muted)' }}>{profile.fieldOfStudy || 'Not provided'}</div>
                        )}
                    </DetailItem>

                    <DetailItem icon={<Calendar />} label="Year of Study">
                        {isEditing ? (
                            <input type="text" name="yearOfStudy" value={editForm.yearOfStudy || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. Year 2" />
                        ) : (
                            <div style={{ color: profile.yearOfStudy ? '#fff' : 'var(--color-text-muted)' }}>{profile.yearOfStudy || 'Not provided'}</div>
                        )}
                    </DetailItem>

                    <DetailItem icon={<Calendar />} label="Birthday">
                        {isEditing ? (
                            <input type="text" name="birthdays" value={editForm.birthdays || ''} onChange={handleChange} style={inputStyle} placeholder="e.g. 15 March" />
                        ) : (
                            <div style={{ color: profile.birthdays ? '#fff' : 'var(--color-text-muted)' }}>{profile.birthdays || 'Not provided'}</div>
                        )}
                    </DetailItem>
                </div>

                {/* Full-width descriptions */}
                <div style={{ marginTop: '32px' }}>
                    <DetailItem icon={<Shield />} label="Activity History">
                        {isEditing ? (
                            <textarea
                                name="activityHistory"
                                value={editForm.activityHistory || ''}
                                onChange={handleChange}
                                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                placeholder="Describe your activity history..."
                            />
                        ) : (
                            <div style={{ color: profile.activityHistory ? '#fff' : 'var(--color-text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '12px' }}>
                                {profile.activityHistory || 'No activity history recorded.'}
                            </div>
                        )}
                    </DetailItem>
                </div>

            </div>
        </div>
    );
}

const DetailItem = ({ icon, label, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {React.cloneElement(icon, { size: 16 })} {label}
        </div>
        <div style={{ paddingLeft: '24px' }}>
            {children}
        </div>
    </div>
);

const inputStyle = {
    width: '100%',
    padding: '10px 16px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s',
};
