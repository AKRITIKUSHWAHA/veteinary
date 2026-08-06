import React from 'react';
import { IndianRupee, TrendingUp, Calendar, Home, Activity, CheckCircle } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function DoctorRevenue() {
  const doctorRevenueData = [
    { day: '01 May', revenue: 4500, consultations: 8 },
    { day: '05 May', revenue: 7200, consultations: 12 },
    { day: '10 May', revenue: 5100, consultations: 9 },
    { day: '15 May', revenue: 8900, consultations: 15 },
    { day: '20 May', revenue: 11200, consultations: 18 },
    { day: '25 May', revenue: 6400, consultations: 11 },
    { day: 'Today', revenue: 8500, consultations: 14 },
  ];

  const metrics = [
    { label: 'My Revenue (This Month)', value: '₹51,800', sub: '+12% from last month', icon: IndianRupee, iconBg: 'rgba(20, 184, 166, 0.15)', iconColor: '#14b8a6' },
    { label: 'Consultations Completed', value: '87', sub: 'Clinic & Online', icon: CheckCircle, iconBg: 'rgba(59, 130, 246, 0.15)', iconColor: '#3b82f6' },
    { label: 'Treatments Performed', value: '34', sub: 'Surgeries & Procedures', icon: Activity, iconBg: 'rgba(245, 158, 11, 0.15)', iconColor: '#f59e0b' },
    { label: 'Home Visits Completed', value: '12', sub: 'Mobile clinic duty', icon: Home, iconBg: 'rgba(139, 92, 246, 0.15)', iconColor: '#8b5cf6' },
  ];

  const breakdownData = [
    { name: 'Consultations', value: 25000 },
    { name: 'Treatments', value: 18000 },
    { name: 'Home Visits', value: 8800 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>My Revenue Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Track your personal clinical performance and earnings.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => alert('Date range picker will open here.')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> This Month
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="card hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: m.iconBg, color: m.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>{m.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 0 0' }}>{m.value}</h3>
                <span style={{ color: 'var(--success)', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                  <TrendingUp size={12} /> {m.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid-2col">
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Revenue Trend (Past 30 Days)</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={doctorRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '350px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Income Breakdown</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-primary)', fontWeight: 600 }} width={100} />
                <RechartsTooltip cursor={{fill: 'var(--background)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹${value}`, 'Income']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
