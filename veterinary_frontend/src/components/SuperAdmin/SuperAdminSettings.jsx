import React from 'react';
import { Save, Globe, Shield, Mail, Database } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminSettings() {
  return (
    <div className="sa-dashboard-container" style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">System Settings</h1>
          <p className="sa-page-subtitle">Configure global platform settings and integrations.</p>
        </div>
        <button className="btn btn-primary" style={{ backgroundColor: '#2dd4bf', border: 'none' }}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* General Settings */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
            <Globe color="#3b82f6" />
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.125rem' }}>General Settings</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Platform Name</label>
              <input type="text" className="sa-search-input" defaultValue="VetCare Pro Platform" style={{ width: '100%', backgroundColor: '#1e293b' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Support Email</label>
              <input type="email" className="sa-search-input" defaultValue="support@vetcarepro.com" style={{ width: '100%', backgroundColor: '#1e293b' }} />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
            <Shield color="#f59e0b" />
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.125rem' }}>Security & Access</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
            <div>
              <p style={{ color: 'white', fontWeight: 500, margin: 0 }}>Maintenance Mode</p>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Disable clinic logins and show maintenance page.</p>
            </div>
            <div style={{ width: '40px', height: '24px', backgroundColor: '#334155', borderRadius: '99px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#94a3b8', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
            </div>
          </div>
        </div>

        {/* Email Provider */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
            <Mail color="#10b981" />
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.125rem' }}>Email Provider (SMTP)</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.875rem' }}>SMTP Host</label>
              <input type="text" className="sa-search-input" defaultValue="smtp.mailgun.org" style={{ width: '100%', backgroundColor: '#1e293b' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontSize: '0.875rem' }}>SMTP Port</label>
              <input type="text" className="sa-search-input" defaultValue="587" style={{ width: '100%', backgroundColor: '#1e293b' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
