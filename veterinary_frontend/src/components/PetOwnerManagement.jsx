import { apiFetch } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, UserPlus, Phone, Mail, MapPin, Edit3, Trash2, X, AlertTriangle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PetOwnerManagement({ searchQuery }) {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await apiFetch('http://localhost:5000/api/v1/owners');
      const data = await response.json();
      if (data.status === 'success') {
        setOwners(data.data);
      } else {
        toast.error('Failed to load pet owners data');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error loading pet owners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Handle Add Owner
  const handleAddOwner = async (e) => {
    e.preventDefault();
    if (!fullName || !nic || !mobile) {
      toast.error('Please fill out Name, NIC, and Mobile number.');
      return;
    }

    const payload = {
      name: fullName,
      nic,
      email,
      telephone,
      mobile,
      address
    };

    const token = localStorage.getItem('token');

    try {
      if (editingOwner) {
        const response = await apiFetch(`http://localhost:5000/api/v1/owners/${editingOwner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Pet Owner record updated successfully.');
          fetchOwners();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to update pet owner.');
        }
      } else {
        const response = await apiFetch('http://localhost:5000/api/v1/owners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('New Pet Owner registered successfully.');
          fetchOwners();
          resetForm();
        } else {
          toast.error(data.message || 'Failed to register pet owner.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error. Check backend connection.');
    }
  };

  const handleEditClick = (owner) => {
    setEditingOwner(owner);
    setFullName(owner.name);
    setNic(owner.nic);
    setEmail(owner.email);
    setTelephone(owner.telephone);
    setMobile(owner.mobile);
    setAddress(owner.address);
    setShowAddForm(true);
  };

  const handleDeleteClick = (ownerId) => {
    setDeleteConfirmId(ownerId);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      const token = localStorage.getItem('token');
      try {
        const response = await apiFetch(`http://localhost:5000/api/v1/owners/${deleteConfirmId}`, {
          method: 'DELETE',
          
        });
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Pet owner deleted successfully.');
          setDeleteConfirmId(null);
          fetchOwners();
        } else {
          toast.error(data.message || 'Failed to delete pet owner.');
          setDeleteConfirmId(null);
        }
      } catch (error) {
        console.error(error);
        toast.error('Network error deleting pet owner.');
        setDeleteConfirmId(null);
      }
    }
  };

  const resetForm = () => {
    setFullName('');
    setNic('');
    setEmail('');
    setTelephone('');
    setMobile('');
    setAddress('');
    setEditingOwner(null);
    setShowAddForm(false);
  };

  // Filter owners based on search query
  const filteredOwners = owners.filter(owner => 
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.mobile.includes(searchQuery)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Pet Owners Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Register new clients, manage records, and track multi-pet association keys.
          </p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }} 
          className="btn btn-primary"
        >
          {showAddForm ? 'View Owners Listing' : <><UserPlus size={16} /> Register Pet Owner</>}
        </button>
      </div>

      {showAddForm ? (
        /* Registration Form Widget */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h3 className="font-bold text-lg mb-6" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            {editingOwner ? 'Modify Pet Owner Record' : 'Register New Pet Owner'}
          </h3>
          <form onSubmit={handleAddOwner}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">NIC / Identity Card Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="e.g. 19940381029V"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.doe@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telephone (Landline)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="e.g. +94 11 200 0000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Home Address</label>
              <textarea 
                className="form-control" 
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete residential address..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">
                {editingOwner ? 'Update Record' : 'Register Owner'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Listing Table */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>
              Registered Clients Listing ({filteredOwners.length})
            </h4>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client Name / NIC</th>
                  <th>Contact Details</th>
                  <th>Home Address</th>
                  <th style={{ textAlign: 'center' }}>Associated Pets</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Loader size={32} className="animate-spin text-primary" style={{ margin: '0 auto', color: 'var(--primary-teal)' }} />
                      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading pet owners...</p>
                    </td>
                  </tr>
                ) : filteredOwners.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                      No pet owners found matching your search.
                    </td>
                  </tr>
                ) : filteredOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>
                      <div>
                        <span className="font-bold" style={{ display: 'block', fontSize: '0.9rem' }}>{owner.name}</span>
                        <span className="badge badge-info" style={{ fontSize: '0.65rem', marginTop: '4px' }}>NIC: {owner.nic}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} className="text-secondary" /> {owner.mobile} {owner.telephone && `| ${owner.telephone}`}
                        </span>
                        {owner.email && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <Mail size={12} /> {owner.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                        <MapPin size={12} style={{ flexShrink: 0 }} />
                        <span>{owner.address}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span 
                        className="badge badge-success font-bold" 
                        style={{ padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}
                      >
                        {owner.petsCount} Associated
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEditClick(owner)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Edit Profile"
                        >
                          <Edit3 size={14} style={{ color: 'var(--secondary-blue)' }} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(owner.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '6px' }}
                          title="Delete Client"
                        >
                          <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in-up" style={{ backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', borderRadius: '50%', color: 'var(--danger)' }}>
                <AlertTriangle size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>Delete Record</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Are you sure you want to delete this pet owner record? This action cannot be undone.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.75rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="btn" 
                  style={{ flex: 1, padding: '0.75rem', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 600, border: 'none' }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
