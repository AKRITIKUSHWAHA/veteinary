import React, { useState } from 'react';
import { Search, MessageSquare, AlertCircle, CheckCircle2, X, Send, Clock, UserCheck } from 'lucide-react';

export default function SuperAdminTickets() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [tickets, setTickets] = useState([
    {
      id: '#T-1042',
      subject: 'Billing issue with new Pro plan upgrading',
      clinic: 'Downtown Vet Clinic',
      adminName: 'Dr. John Doe',
      priority: 'High',
      status: 'Open',
      date: '2 hours ago',
      messages: [
        { sender: 'Dr. John Doe', text: 'Hi, I paid for the Monthly Pro plan via Razorpay UPI but my dashboard still says Trial status.', time: '2 hours ago', isUser: true }
      ]
    },
    {
      id: '#T-1041',
      subject: 'How to add a 6th doctor to clinic account?',
      clinic: 'Paws & Claws Care',
      adminName: 'Dr. Vikram Singh',
      priority: 'Medium',
      status: 'In Progress',
      date: '5 hours ago',
      messages: [
        { sender: 'Dr. Vikram Singh', text: 'We reached our 5 doctor limit on Pro plan. How do we purchase an addon license?', time: '5 hours ago', isUser: true },
        { sender: 'SuperAdmin', text: 'Hello Dr. Vikram, you can either upgrade to Enterprise or add single seats via Settings > Addons.', time: '3 hours ago', isUser: false }
      ]
    },
    {
      id: '#T-1040',
      subject: 'System running slow during checkout invoicing',
      clinic: 'City Animal Hospital',
      adminName: 'Dr. Anjali Sharma',
      priority: 'Urgent',
      status: 'Open',
      date: '1 day ago',
      messages: [
        { sender: 'Dr. Anjali Sharma', text: 'Invoicing generation is taking 10+ seconds today. Please check server performance.', time: '1 day ago', isUser: true }
      ]
    },
    {
      id: '#T-1039',
      subject: 'Request for custom API integration with Lab software',
      clinic: 'Happy Pets Hospital',
      adminName: 'Rajesh Kumar',
      priority: 'Low',
      status: 'Closed',
      date: '3 days ago',
      messages: [
        { sender: 'Rajesh Kumar', text: 'Do you offer REST API webhooks for lab diagnostic results?', time: '3 days ago', isUser: true },
        { sender: 'SuperAdmin', text: 'Yes, custom API webhooks are available on the Enterprise tier. We sent documentation to your email.', time: '2 days ago', isUser: false }
      ]
    }
  ]);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'SuperAdmin',
      text: replyText.trim(),
      time: 'Just now',
      isUser: false
    };

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedMsgs = [...t.messages, newMsg];
        const updatedStatus = t.status === 'Open' ? 'In Progress' : t.status;
        const updatedTicket = { ...t, messages: updatedMsgs, status: updatedStatus };
        setSelectedTicket(updatedTicket);
        return updatedTicket;
      }
      return t;
    }));

    setReplyText('');
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, status: newStatus };
        if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
        return updated;
      }
      return t;
    }));
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.clinic.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && t.status === statusFilter;
  });

  return (
    <div className="sa-dash-wrapper">
      <div className="sa-renewals-header">
        <div>
          <h1 className="sa-dash-title">Support Tickets</h1>
          <p className="sa-dash-subtitle">Respond to clinic admin helpdesk inquiries and technical requests.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="sa-search-bar">
            <Search size={18} className="sa-search-icon" />
            <input
              type="text"
              placeholder="Search tickets or clinic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sa-search-input"
            />
          </div>

          <div className="sa-select-wrapper">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sa-filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sa-renewals-card">
        <div className="sa-table-responsive">
          <table className="sa-renewals-table">
            <thead>
              <tr>
                <th>Ticket Details</th>
                <th>Clinic Name</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No tickets found.</td></tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="sa-td-bold">{t.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{t.id}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{t.clinic}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.adminName}</div>
                    </td>

                    <td>
                      <span style={{
                        padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                        backgroundColor: t.priority === 'Urgent' ? '#fee2e2' : t.priority === 'High' ? '#fef3c7' : '#e0f2fe',
                        color: t.priority === 'Urgent' ? '#b91c1c' : t.priority === 'High' ? '#b45309' : '#0369a1'
                      }}>
                        {t.priority}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {t.status === 'Open' && <AlertCircle size={15} color="#ef4444" />}
                        {t.status === 'In Progress' && <MessageSquare size={15} color="#f59e0b" />}
                        {t.status === 'Closed' && <CheckCircle2 size={15} color="#16a34a" />}
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.status}</span>
                      </div>
                    </td>

                    <td>{t.date}</td>

                    <td>
                      <button 
                        onClick={() => setSelectedTicket(t)}
                        style={{ background: '#14b8a6', color: '#fff', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Details & Reply Modal */}
      {selectedTicket && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '580px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#14b8a6', fontFamily: 'monospace' }}>{selectedTicket.id}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0.15rem 0 0 0' }}>{selectedTicket.subject}</h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>From: {selectedTicket.adminName} ({selectedTicket.clinic})</div>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Status Change Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Update Ticket Status:</span>
              <select 
                value={selectedTicket.status} 
                onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Messages Log */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
              {selectedTicket.messages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.isUser ? 'flex-start' : 'flex-end',
                  backgroundColor: msg.isUser ? '#f1f5f9' : '#ccfbf1',
                  color: msg.isUser ? '#0f172a' : '#0f766e',
                  padding: '0.75rem 1rem', borderRadius: '12px', maxWidth: '85%'
                }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 700, marginBottom: '0.2rem', color: msg.isUser ? '#475569' : '#0d9488' }}>
                    {msg.sender} · {msg.time}
                  </div>
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.4 }}>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Type your response to clinic admin..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', background: '#14b8a6', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Send size={16} /> Send
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
