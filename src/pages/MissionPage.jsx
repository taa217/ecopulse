import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, ArrowLeft, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

function MissionPage() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <div className="app-container" style={{ background: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text)' }}>
            {/* Navigation */}
            <nav className="glass" style={{ padding: '20px 48px', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 100 }}>
                <div className="nav-content container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="logo text-primary" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <img src={logoSvg} alt="EcoPulse" style={{ width: '36px', height: '36px' }} />
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>EcoPulse</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Blog Content */}
            <article className="container" style={{ maxWidth: '800px', padding: '80px 24px 120px' }}>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <span style={{ background: 'rgba(76, 175, 80, 0.1)', color: 'var(--color-primary-light)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            President's Letter
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                            March 2026
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: '1.1', marginBottom: '32px', letterSpacing: '-0.03em' }}>
                        The Pulse of Our <span className="text-primary">Future</span>: Why We Must Act Now
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                            LK
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Loswita G. Kamuzangaza</div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>President & Founder, EcoPulse</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}
                >
                    <p style={{ marginBottom: '24px', color: '#fff', fontSize: '1.4rem', fontWeight: '500', lineHeight: '1.6' }}>
                        For a long time, climate change felt like a problem belonging to tomorrow. It felt abstract—a headline in a newspaper, a distant melting glacier, a statistic on a whiteboard. But over the last few years, the reality shifted. Tomorrow became today.
                    </p>

                    <p style={{ marginBottom: '24px' }}>
                        We founded EcoPulse because we were tired of feeling helpless while waiting for global leaders to find "the solution." We realized that if we are constantly waiting for a top-down rescue, we ignore the immense, untapped power we hold as a community. The climate crisis is not just an atmospheric issue; it is a human issue, a local issue, and it requires a uniquely local pulse to beat against it.
                    </p>

                    <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: '48px', marginBottom: '24px' }}>
                        Small Ripples, Massive Waves
                    </h2>

                    <p style={{ marginBottom: '24px' }}>
                        We are university students. We have limited budgets, tight schedules, and overwhelming coursework. But we also possess an incredible asset: <strong style={{ color: '#fff' }}>collective momentum</strong>.
                    </p>

                    <p style={{ marginBottom: '24px' }}>
                        Every time we convince a cafeteria to switch from single-use plastics to compostable alternatives, we aren't just saving a few hundred bags a day; we are normalizing sustainability for thousands of future professionals, educators, and leaders. Every tree we plant in our local parks isn't just sequestering carbon; it is a physical monument to our generation's commitment to the earth.
                    </p>

                    <div className="glass" style={{ padding: '32px', margin: '40px 0', borderLeft: '4px solid var(--color-primary-light)', borderRadius: '0 16px 16px 0', fontStyle: 'italic', fontSize: '1.3rem', color: '#fff' }}>
                        "EcoPulse is not just a club; it’s an awakening. It’s the realization that healing our planet starts with the choices we make on our own campuses."
                    </div>

                    <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: '48px', marginBottom: '24px' }}>
                        Our Three Pillars
                    </h2>

                    <p style={{ marginBottom: '24px' }}>
                        We operate on a simple but radical philosophy. To enact real change, we must be educated, we must be grounded, and we must be united.
                    </p>

                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px' }}>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                            <Globe style={{ color: 'var(--color-primary-light)', flexShrink: 0, marginTop: '4px' }} size={24} />
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Global Awareness, Local Context</strong>
                                We break down overwhelming climate science into actionable, digestible insights that matter to our immediate community.
                            </div>
                        </li>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                            <Zap style={{ color: '#FFB74D', flexShrink: 0, marginTop: '4px' }} size={24} />
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Direct, Measurable Action</strong>
                                We focus on initiatives where we can literally measure our impact—whether that's pounds of waste diverted or native species restored.
                            </div>
                        </li>
                        <li style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                            <Heart style={{ color: '#EF5350', flexShrink: 0, marginTop: '4px' }} size={24} />
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Radical Empathy & Community</strong>
                                Environmentalism cannot be isolating. We build a supportive network where eco-anxiety is transformed into shared determination.
                            </div>
                        </li>
                    </ul>

                    <h2 style={{ fontSize: '2rem', color: '#fff', marginTop: '48px', marginBottom: '24px' }}>
                        The Road Ahead
                    </h2>

                    <p style={{ marginBottom: '24px' }}>
                        Building a sustainable future is not a sprint; it is an ultra-marathon. It requires patience, resilience, and optimism even when the news cycle tells us otherwise. But let me tell you—every time I look around the room at an EcoPulse meeting, I don't see despair. I see innovation. I see defiance against the status quo.
                    </p>

                    <p style={{ marginBottom: '40px' }}>
                        We are writing the story of tomorrow, today. And we need every single one of you to pick up a pen and join us.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <Link to="/#join" className="btn btn-primary" onClick={() => { setTimeout(() => { const join = document.getElementById('join'); if (join) join.scrollIntoView({ behavior: 'smooth' }) }, 100) }}>
                            Join The Movement
                        </Link>
                    </div>

                </motion.div>
            </article>

            {/* Footer minimal */}
            <footer style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', padding: '40px 0' }}>
                <div className="container" style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} EcoPulse Climate Club. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default MissionPage;
