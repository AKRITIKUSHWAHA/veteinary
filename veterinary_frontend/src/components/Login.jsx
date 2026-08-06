import { apiFetch } from '../utils/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pathForTab } from '../utils/routes';
import { Mail, Lock, ArrowRight, ShieldCheck, Stethoscope, Users, HeartHandshake, Shield, Briefcase, Eye, EyeOff } from 'lucide-react';

export default function Login({ setIsAuthenticated, setCurrentRole }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@vetcarepro.com');
  const [password, setPassword] = useState('password123');
  const [activeRole, setActiveRole] = useState('Admin');
  const [btnHover, setBtnHover] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email && password) {
      try {
        const response = await apiFetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (data.status === 'success') {
          const { token, user } = data.data;
          
          // Securely store token and user session data
          localStorage.setItem('token', token);
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));
          
          setIsAuthenticated(true);
          if (setCurrentRole) setCurrentRole(user.role);
          navigate(pathForTab('dashboard', user.role), { replace: true });
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error('Login Error:', err);
        setError('Unable to connect to server. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    }
  };

  const selectDemoUser = (role, demoEmail) => {
    setActiveRole(role);
    setEmail(demoEmail);
    setPassword('password123');
  };

  const demoUsers = [
    { role: 'Admin',        email: 'admin@vetcarepro.com',       icon: Shield,        color: '#14b8a6', bg: '#f0fdfa', border: '#14b8a6' },
    { role: 'Manager',      email: 'manager@vetcarepro.com',     icon: Briefcase,     color: '#6366f1', bg: '#e0e7ff', border: '#6366f1' },
    { role: 'Doctor',       email: 'demodoctor@gmail.com',       icon: Stethoscope,   color: '#3b82f6', bg: '#eff6ff', border: '#3b82f6' },
    { role: 'Receptionist', email: 'demoR@gmail.com',            icon: Users,         color: '#d946ef', bg: '#fdf4ff', border: '#d946ef' },
    { role: 'Vet Assistant',email: 'assistant@vetcarepro.com',   icon: HeartHandshake,color: '#f59e0b', bg: '#fffbeb', border: '#f59e0b' },
  ];

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />
      <div className="login-overlay" aria-hidden="true" />

      {/* Mobile / tablet compact brand bar */}
      <header className="login-mobile-brand animate-fade-in">
        <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '36px', objectFit: 'contain' }} />
        <span className="login-brand-text">
          VetCare <span className="login-brand-accent">Pro</span>
        </span>
      </header>

      <div className="login-layout">
        {/* LEFT: marketing content (desktop / large laptop) */}
        <div className="login-left animate-fade-in-left">
          <div className="login-left-brand animate-fade-in-left animate-delay-100">
            <img src="/kt-logo.png" alt="Kiaan Technology Logo" style={{ height: '48px', objectFit: 'contain' }} />
            <span className="login-brand-text login-brand-text--lg">
              VetCare <span className="login-brand-accent">Pro</span>
            </span>
          </div>

          <div className="login-hero animate-fade-in-left animate-delay-200">
            <h1 className="login-hero-title">
              Next-Gen<br />Veterinary Care.
            </h1>
            <p className="login-hero-desc">
              Empowering your clinic with intuitive medical records, smart inventory, and seamless appointment management.
            </p>
          </div>

          <div className="login-features animate-fade-in-left animate-delay-300">
            {[
              { icon: <Stethoscope size={20} />, title: 'Advanced Clinical Records',  sub: 'Detailed history, vaccines & prescriptions' },
              { icon: <ShieldCheck   size={20} />, title: 'Secure Billing & ERP',      sub: 'Automated invoicing and live stock alerts'  },
            ].map((f, i) => (
              <div key={i} className="login-feature-item">
                <div className="login-feature-icon">{f.icon}</div>
                <div>
                  <h4 className="login-feature-title">{f.title}</h4>
                  <p className="login-feature-sub">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: sign-in card */}
        <div className="login-right">
          <div className="login-card animate-fade-in-right animate-delay-150">
            <div className="login-card-header">
              <h2 className="login-card-title">Sign In to Portal</h2>
              <p className="login-card-subtitle">Access the VetCare Pro Dashboard</p>
              {error && (
                <div style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-light)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16}/> {error}
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label className="login-label">Email Address or Username</label>
                <div className="login-input-wrap">
                  <Mail size={17} className="login-input-icon" />
                  <input
                    type="text"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-label-row">
                  <label className="login-label">Password</label>
                  <span className="login-forgot">Forgot?</span>
                </div>
                <div className="login-input-wrap" style={{ position: 'relative' }}>
                  <Lock size={17} className="login-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0'
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  backgroundColor: btnHover ? '#0f766e' : '#14b8a6',
                  boxShadow: btnHover ? '0 6px 20px rgba(20,184,166,0.45)' : '0 4px 12px rgba(20,184,166,0.3)',
                  transform: btnHover ? 'translateY(-1px)' : 'translateY(0)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'} {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="login-divider">
              <span>Quick Demo Access</span>
            </div>

            <div className="login-demo-grid">
              {demoUsers.map(({ role, email: dEmail, icon: Icon, color, bg, border }) => {
                const isActive = activeRole === role;
                const label = role === 'Receptionist' ? 'Reception' : role === 'Vet Assistant' ? 'Assistant' : role;
                return (
                  <button
                    key={role}
                    type="button"
                    className="login-demo-btn"
                    onClick={() => selectDemoUser(role, dEmail)}
                    style={{
                      backgroundColor: isActive ? bg : '#f8fafc',
                      borderColor: isActive ? border : '#e2e8f0',
                      color: isActive ? color : '#475569',
                      boxShadow: isActive ? `0 4px 10px ${color}22` : 'none',
                      transform: isActive ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    <Icon size={15} /> {label}
                  </button>
                );
              })}
            </div>

            <div className="login-footer">
              <ShieldCheck size={14} style={{ color: '#14b8a6' }} />
              <span>End-to-End Encrypted Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
