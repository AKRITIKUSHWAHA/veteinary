import React, { useState, useEffect } from 'react';
import { Users, Building2, Ticket, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch('/api/super-admin/stats');
        const data = await response.json();
        if (data.status === 'success') {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div style={{ padding: '2rem', color: 'white' }}>Loading Command Center...</div>;
  }

  const statCards = [
    { label: 'Total Clinics', value: stats.totalClinics, icon: Building2, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)' },
    { label: 'Active Clinics', value: stats.activeClinics, icon: Activity, color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.1)' },
    { label: 'Trial Clinics', value: stats.trialClinics, icon: TrendingUp, color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)' },
    { label: 'Expired Trials', value: stats.expiredTrials, icon: Building2, color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' },
    { label: 'Paid Clinics', value: stats.paidClinics, icon: DollarSign, color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    { label: 'Total Doctors', value: stats.totalDoctors, icon: Users, color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)' },
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
    { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: '#4ade80', bg: 'rgba(74, 222, 128, 0.1)' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { label: 'Open Tickets', value: stats.openSupportTickets, icon: Ticket, color: '#fb923c', bg: 'rgba(251, 146, 60, 0.1)' }
  ];

  return (
    <div className="sa-dashboard-container">
      <div>
        <h1 className="sa-page-title">Command Center</h1>
        <p className="sa-page-subtitle">Overview of VetCare Pro global platform metrics.</p>
      </div>

      <div className="sa-stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="sa-stat-card">
            <div className="sa-stat-header">
              <div>
                <p className="sa-stat-label">{stat.label}</p>
                <h3 className="sa-stat-value">{stat.value}</h3>
              </div>
              <div className="sa-stat-icon-wrapper" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
