import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Globe, Users, ArrowRight, ChevronDown, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`glass main-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content container">
          <Link to="/" className="logo text-primary">
            <img src={logoSvg} alt="EcoPulse" className="logo-img" />
            <span>EcoPulse</span>
          </Link>
          <div className="nav-links">
            <Link to="/mission" className="nav-link">Mission</Link>
            <a href="#join" className="btn btn-primary nav-join-btn">Join Us</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px', position: 'relative' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ maxWidth: '800px' }}
          >
            <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '30px', background: 'rgba(76, 175, 80, 0.1)', border: '1px solid var(--color-border)', marginBottom: '24px', color: 'var(--color-primary-light)', fontWeight: '500', fontSize: '0.9rem' }}>
              <Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', marginBottom: '2px' }} />
              Join the movement for a sustainable future
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw + 1rem, 5.5rem)', marginBottom: '20px', letterSpacing: '-0.03em' }}>
              We are the pulse of <span className="text-primary" style={{ textShadow: '0 0 40px rgba(76, 175, 80, 0.4)' }}>Change</span>.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.7' }}>
              EcoPulse is a student-led climate action club dedicated to fostering sustainable habits, driving local environmental initiatives, and raising awareness.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#join" className="btn btn-primary">
                Become a Member <ArrowRight size={18} />
              </a>
              <a href="/mission" className="btn btn-outline">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section id="mission" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ textAlign: 'center', marginBottom: '70px' }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>Our Mission</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.6' }}>To empower students to take meaningful climate action starting from our local community, building a foundation for sustainable living.</p>
            <div style={{ marginTop: '32px' }}>
              <Link to="/mission" className="btn btn-outline" style={{ display: 'inline-flex', padding: '12px 28px', fontSize: '1.05rem' }}>
                Read the President's Blog <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            <motion.div
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(33, 150, 243, 0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass" style={{ padding: '48px 40px', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: 'rgba(33, 150, 243, 0.15)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', color: '#64B5F6', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                <Globe size={28} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Global Awareness</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>Educating our community about global climate challenges and the science behind environmental changes, ensuring we understand the macro impact.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(76, 175, 80, 0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass" style={{ padding: '48px 40px', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: 'rgba(76, 175, 80, 0.15)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', color: 'var(--color-primary-light)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                <Leaf size={28} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Local Action</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>Organizing regular community cleanups, tree planting events, and actively advocating for sustainable campus and city policies.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(255, 152, 0, 0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass" style={{ padding: '48px 40px', transition: 'all 0.3s ease' }}
            >
              <div style={{ background: 'rgba(255, 152, 0, 0.15)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', color: '#FFB74D', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Community Building</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7' }}>Connecting like-minded individuals to foster a supportive environment for ongoing eco-activism and green peer-led innovation.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" style={{ padding: '100px 0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            style={{ textAlign: 'center', marginBottom: '70px' }}
          >
            <h2 style={{ fontSize: '3rem', marginBottom: '16px', letterSpacing: '-0.02em' }}>Current Initiatives</h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.6' }}>Get involved with our ongoing projects and campaigns.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            <motion.div
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(76, 175, 80, 0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass"
              style={{ overflow: 'hidden', padding: '0', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
            >
              <div style={{ height: '220px', background: 'linear-gradient(135deg, #2E7D32, rgba(76, 175, 80, 0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={64} color="rgba(255,255,255,0.9)" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }} />
              </div>
              <div style={{ padding: '40px', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', fontWeight: '600', marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Campus Campaign</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Zero-Waste Dining</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', lineHeight: '1.7' }}>Partnering with university dining to eliminate single-use plastics and implement comprehensive composting.</p>
                <a href="#join" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Get Involved</a>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderColor: 'rgba(33, 150, 243, 0.4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass"
              style={{ overflow: 'hidden', padding: '0', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}
            >
              <div style={{ height: '220px', background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.4), #1565C0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={64} color="rgba(255,255,255,0.9)" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }} />
              </div>
              <div style={{ padding: '40px', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', fontWeight: '600', marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>Education</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Climate Literacy Workshops</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', lineHeight: '1.7' }}>Hosting monthly seminars featuring guest speakers and interactive learning sessions for students.</p>
                <a href="#join" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Join Workshop</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" style={{ padding: '120px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass"
            style={{ padding: '70px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(76, 175, 80, 0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
          >
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.08) 0%, transparent 50%)', zIndex: 0, pointerEvents: 'none' }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '3.2rem', marginBottom: '20px', letterSpacing: '-0.02em' }}>Ready to make an impact?</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 40px' }}>Register your interest to join the club! Enter your email below to get started, and we'll be in touch with details on how to get involved.</p>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ background: 'rgba(76, 175, 80, 0.15)', border: '1px solid rgba(76, 175, 80, 0.3)', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--color-primary-light)', maxWidth: '500px', margin: '0 auto' }}
                  >
                    <CheckCircle size={24} />
                    <span>Thanks for joining! We'll be in touch soon.</span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setStatus('loading');
                      try {
                        const response = await fetch('/api/newsletter', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email })
                        });
                        const data = await response.json();
                        if (response.ok) {
                          setStatus('success');
                          setEmail('');
                        } else {
                          setStatus('error');
                          setErrorMessage(data.error || 'Something went wrong.');
                        }
                      } catch (error) {
                        setStatus('error');
                        setErrorMessage('Failed to connect to the server.');
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', margin: '0 auto' }}
                  >
                    <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                      <input
                        type="email"
                        placeholder="Enter your email..."
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading'}
                        style={{ flex: 1, paddingRight: '140px' }}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === 'loading'}
                        style={{ position: 'absolute', right: '6px', top: '6px', bottom: '6px', padding: '0 24px', whiteSpace: 'nowrap', borderRadius: '8px' }}
                      >
                        {status === 'loading' ? 'Joining...' : 'Sign Up'}
                      </button>
                    </div>
                    <AnimatePresence>
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ color: '#ff5252', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginTop: '4px' }}
                        >
                          <XCircle size={16} /> {errorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)', padding: '60px 0 30px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px', flexWrap: 'wrap', gap: '40px' }}>
            <div>
              <div className="logo text-primary" style={{ marginBottom: '16px' }}>
                <img src={logoSvg} alt="EcoPulse" style={{ width: '32px', height: '32px' }} />
                <span>EcoPulse</span>
              </div>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '300px' }}>Empowering students to drive local climate action for a sustainable global future.</p>
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.1rem' }}>Navigation</h4>
                <ul style={{ listStyle: 'none', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li><a href="#" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>Home</a></li>
                  <li><a href="/mission" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>Our Mission</a></li>
                  <li><a href="#join" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>Join the Club</a></li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.1rem' }}>Contact</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--color-text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={16} /> Contact the President: kloswita@gmail.com
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={16} /> University of Zimbabwe
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            &copy; {new Date().getFullYear()} EcoPulse Climate Club. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
