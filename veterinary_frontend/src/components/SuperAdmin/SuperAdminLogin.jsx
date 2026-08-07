import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import '../Login.css';

export default function SuperAdminLogin({ setIsSuperAdmin }) {
  const [email, setEmail] = useState('superadmin@vetcarepro.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiFetch('/api/super-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.status === 'success') {
        const { token, user } = data.data;
        localStorage.setItem('sa_token', token);
        localStorage.setItem('sa_user', JSON.stringify(user));
        setIsSuperAdmin(true);
        navigate('/super-admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-premium">
      <div className="login-animated-bg"></div>
      
      <div className="login-container-premium">
        <div className="login-left-side">
          <div className="login-branding">
            <div className="login-logo-container">
              <img src="/kt-logo.png" alt="KT Logo" style={{ width: '64px', height: 'auto', objectFit: 'contain' }} />
              <span className="login-brand-text">VetCare <span className="text-teal-400">Pro</span></span>
            </div>
            <div className="login-badge">
              <Shield size={16} />
              Super Admin Portal
            </div>
            <h1 className="login-hero-title">
              Platform Command Center
            </h1>
            <p className="login-hero-subtitle">
              Manage clinics, subscriptions, and global system settings securely from the Super Admin dashboard.
            </p>
          </div>
        </div>

        <div className="login-form-side">
          <div className="glass-login-card">
            
            <button
              type="button"
              className="login-back-btn-premium"
              onClick={() => navigate('/login')}
            >
              &larr; Clinic Login
            </button>
            
            <div className="login-card-header">
              <h2>Super Admin Access</h2>
              <p>Sign in to the global administration panel.</p>
            </div>

            {error && (
              <div className="login-error-alert">
                <Shield size={20} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="Super Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </div>

              <div className="login-input-group">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </div>

              <button 
                type="submit" 
                className={`login-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                <span>{loading ? 'Authenticating...' : 'Access Command Center'}</span>
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
