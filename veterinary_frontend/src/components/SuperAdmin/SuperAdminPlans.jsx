import React from 'react';
import { Check, Edit, Plus } from 'lucide-react';
import './SuperAdmin.css';

export default function SuperAdminPlans() {
  const dummyPlans = [
    {
      id: 1,
      name: 'Basic',
      price: '$99',
      interval: 'per month',
      features: ['Up to 2 Doctors', 'Basic Medical Records', 'Standard Appointments', 'Email Support'],
      color: '#3b82f6'
    },
    {
      id: 2,
      name: 'Pro',
      price: '$199',
      interval: 'per month',
      features: ['Up to 5 Doctors', 'Advanced Medical Records', 'Automated Reminders', 'Billing & POS', 'Priority Support'],
      color: '#2dd4bf',
      isPopular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 'Custom',
      interval: 'billed annually',
      features: ['Unlimited Doctors', 'Custom Workflows', 'Multi-Clinic Support', 'API Access', '24/7 Phone Support', 'Dedicated Account Manager'],
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="sa-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="sa-page-title">Plans & Pricing</h1>
          <p className="sa-page-subtitle">Configure subscription tiers and included features.</p>
        </div>
        <button className="btn btn-primary" style={{ backgroundColor: '#2dd4bf', border: 'none' }}>
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '3rem' }}>
        {dummyPlans.map((plan) => (
          <div key={plan.id} style={{
            backgroundColor: '#0f172a',
            border: `1px solid ${plan.isPopular ? plan.color : '#1e293b'}`,
            borderRadius: '1rem',
            padding: '2rem',
            width: '320px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {plan.isPopular && (
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: plan.color, color: '#0f172a', padding: '4px 12px', borderRadius: '99px',
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>Most Popular</div>
            )}
            <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{plan.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>{plan.price}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{plan.interval}</span>
            </div>

            <div style={{ flex: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                    <Check size={16} color={plan.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button style={{
              marginTop: '2.5rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem',
              backgroundColor: 'transparent', border: '1px solid #334155', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              cursor: 'pointer', transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <Edit size={16} /> Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
