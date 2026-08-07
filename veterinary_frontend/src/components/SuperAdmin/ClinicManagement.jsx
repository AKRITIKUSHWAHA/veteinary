import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Building2, Search, MoreVertical, Edit, Trash2, Power, Play, Mail, ShieldAlert } from 'lucide-react';

export default function ClinicManagement() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await apiFetch('/api/super-admin/clinics');
        const data = await response.json();
        if (data.status === 'success') setClinics(data.data);
      } catch (error) {
        console.error('Failed to fetch clinics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sa-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">Clinic Management</h1>
          <p className="sa-page-subtitle">Manage all registered clinics on the platform.</p>
        </div>
        
        <div className="sa-search-bar">
          <Search size={18} className="sa-search-icon" />
          <input
            type="text"
            placeholder="Search clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
      </div>

      <div className="sa-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Clinic Details</th>
                <th>Admin Name</th>
                <th>Plan & Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading clinics...</td></tr>
              ) : filteredClinics.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No clinics found.</td></tr>
              ) : (
                filteredClinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td>
                      <div className="sa-flex-center">
                        <div className="sa-clinic-icon">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p style={{ color: 'white', fontWeight: 500, margin: 0 }}>{clinic.name}</p>
                          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>{clinic.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#cbd5e1' }}>{clinic.adminName}</span><br/>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{clinic.phone}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: 500 }}>{clinic.currentPlan}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span className={`sa-badge ${clinic.trialStatus === 'Active' ? 'yellow' : 'red'}`}>
                            Trial {clinic.trialStatus}
                          </span>
                          <span className={`sa-badge ${clinic.subStatus === 'Active' ? 'emerald' : 'slate'}`}>
                            Sub {clinic.subStatus}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>{new Date(clinic.createdDate).toLocaleDateString()}</p>
                      <p style={{ color: '#64748b', fontSize: '0.75rem', margin: 0 }}>Expires: {new Date(clinic.expiryDate).toLocaleDateString()}</p>
                    </td>
                    <td>
                      <div className="sa-flex-center">
                        <button className="sa-action-btn edit" title="Edit"><Edit size={16} /></button>
                        <button className="sa-action-btn suspend" title="Suspend"><Power size={16} /></button>
                        <button className="sa-action-btn delete" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
