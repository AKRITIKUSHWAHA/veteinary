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
    return <div className="p-8 text-white">Loading Command Center...</div>;
  }

  const statCards = [
    { label: 'Total Clinics', value: stats.totalClinics, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Clinics', value: stats.activeClinics, icon: Activity, color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { label: 'Trial Clinics', value: stats.trialClinics, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Expired Trials', value: stats.expiredTrials, icon: Building2, color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Paid Clinics', value: stats.paidClinics, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Total Doctors', value: stats.totalDoctors, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Open Tickets', value: stats.openSupportTickets, icon: Ticket, color: 'text-orange-400', bg: 'bg-orange-400/10' }
  ];

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Command Center</h1>
        <p className="text-slate-400 mt-2">Overview of VetCare Pro global platform metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
