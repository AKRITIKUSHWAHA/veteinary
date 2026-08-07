import React, { useState } from 'react';
import { Search, Download, CreditCard, Filter } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminPayments() {
  const [search, setSearch] = useState('');

  const dummyPayments = [
    { id: 'TRX-982341', clinic: 'City Vet Clinic', date: '2026-08-07', amount: '$1,999.00', method: 'Credit Card (**** 4242)', status: 'Successful' },
    { id: 'TRX-982340', clinic: 'Paws & Claws Care', date: '2026-08-06', amount: '$199.00', method: 'PayPal', status: 'Successful' },
    { id: 'TRX-982339', clinic: 'Happy Pets Hospital', date: '2026-08-05', amount: '$99.00', method: 'Credit Card (**** 1111)', status: 'Failed' },
    { id: 'TRX-982338', clinic: 'Downtown Animal ER', date: '2026-08-05', amount: '$1,999.00', method: 'Wire Transfer', status: 'Pending' },
    { id: 'TRX-982337', clinic: 'Green Valley Vet', date: '2026-08-04', amount: '$199.00', method: 'Credit Card (**** 8888)', status: 'Successful' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Successful': return 'sa-badge emerald';
      case 'Pending': return 'sa-badge yellow';
      case 'Failed': return 'sa-badge red';
      default: return 'sa-badge slate';
    }
  };

  return (
    <div className="sa-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">Payments</h1>
          <p className="sa-page-subtitle">Transaction history and revenue ledger.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="sa-search-bar">
            <Search size={18} className="sa-search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sa-search-input"
            />
          </div>
          <button className="btn btn-secondary" style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: 'white' }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="sa-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Clinic</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyPayments.map((payment) => (
                <tr key={payment.id}>
                  <td><span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>{payment.id}</span></td>
                  <td><span style={{ color: '#94a3b8' }}>{payment.date}</span></td>
                  <td><span style={{ color: 'white', fontWeight: 500 }}>{payment.clinic}</span></td>
                  <td>
                    <div className="sa-flex-center">
                      <CreditCard size={14} color="#94a3b8" />
                      <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{payment.method}</span>
                    </div>
                  </td>
                  <td><span style={{ color: 'white', fontWeight: 600 }}>{payment.amount}</span></td>
                  <td>
                    <span className={getStatusBadge(payment.status)}>
                      {payment.status}
                    </span>
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
