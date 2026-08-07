import React, { useState } from 'react';
import { Search, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminTickets() {
  const [search, setSearch] = useState('');

  const dummyTickets = [
    { id: '#T-1042', subject: 'Billing issue with new Pro plan', clinic: 'City Vet Clinic', priority: 'High', status: 'Open', date: '2 hours ago' },
    { id: '#T-1041', subject: 'How to add a 6th doctor?', clinic: 'Paws & Claws Care', priority: 'Medium', status: 'In Progress', date: '5 hours ago' },
    { id: '#T-1040', subject: 'System running slow during checkout', clinic: 'Downtown Animal ER', priority: 'Urgent', status: 'Open', date: '1 day ago' },
    { id: '#T-1039', subject: 'Request for custom API integration', clinic: 'Green Valley Vet', priority: 'Low', status: 'Closed', date: '3 days ago' },
  ];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent': return 'sa-badge red';
      case 'High': return 'sa-badge yellow';
      case 'Medium': return 'sa-badge emerald';
      case 'Low': return 'sa-badge slate';
      default: return 'sa-badge slate';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle size={16} color="#f87171" />;
      case 'In Progress': return <MessageSquare size={16} color="#fbbf24" />;
      case 'Closed': return <CheckCircle2 size={16} color="#34d399" />;
      default: return null;
    }
  };

  return (
    <div className="sa-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">Support Tickets</h1>
          <p className="sa-page-subtitle">Manage support requests from clinic administrators.</p>
        </div>
        
        <div className="sa-search-bar">
          <Search size={18} className="sa-search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
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
                <th>Ticket Info</th>
                <th>Clinic</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <p style={{ color: 'white', fontWeight: 500, margin: 0 }}>{ticket.subject}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>{ticket.id}</p>
                  </td>
                  <td><span style={{ color: '#cbd5e1' }}>{ticket.clinic}</span></td>
                  <td><span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span></td>
                  <td>
                    <div className="sa-flex-center">
                      {getStatusIcon(ticket.status)}
                      <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{ticket.status}</span>
                    </div>
                  </td>
                  <td><span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{ticket.date}</span></td>
                  <td>
                    <button className="btn btn-secondary" style={{ backgroundColor: 'transparent', borderColor: '#334155', color: '#cbd5e1', padding: '0.25rem 0.75rem' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
