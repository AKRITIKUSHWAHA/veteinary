import React from 'react';
import { 
  LayoutDashboard, Building2, CreditCard, 
  Settings, LogOut, Ticket, Bell, FileText, BadgeDollarSign, Map
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Sidebar.css';

export default function SuperAdminSidebar({ 
  currentTab, setCurrentTab,
  sidebarOpen, setSidebarOpen,
  onLogout
}) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard',      label: 'Dashboard',           icon: LayoutDashboard, color: '#f59e0b' },
    { id: 'clinics',        label: 'Clinic Management',   icon: Building2,       color: '#3b82f6' },
    { id: 'subscriptions',  label: 'Subscriptions',       icon: BadgeDollarSign, color: '#10b981' },
    { id: 'plans',          label: 'Plans & Pricing',     icon: Map,             color: '#a855f7' },
    { id: 'payments',       label: 'Payments',            icon: CreditCard,      color: '#ef4444' },
    { id: 'revenue',        label: 'Revenue Analytics',   icon: FileText,        color: '#f59e0b' },
    { id: 'tickets',        label: 'Support Tickets',     icon: Ticket,          color: '#3b82f6' },
    { id: 'reports',        label: 'Reports',             icon: FileText,        color: '#10b981' },
    { id: 'settings',       label: 'System Settings',     icon: Settings,        color: '#94a3b8' },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className="sidebar-premium"
        style={{ width: sidebarOpen ? '280px' : '80px' }}
      >
        <div className="sidebar-brand-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <img 
              src="/kt-logo.png" 
              alt="KT Logo" 
              style={{ width: '40px', height: 'auto', flexShrink: 0, objectFit: 'contain' }}
            />
            {sidebarOpen && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap' }}>
                  Super <span style={{ color: '#2dd4bf' }}>Admin</span>
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  VetCare Pro Platform
                </span>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button 
                key={item.id}
                className={`sidebar-menu-btn ${active ? 'active' : ''}`}
                onClick={() => { setCurrentTab(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                title={item.label}
              >
                <div className="sidebar-menu-icon" style={{ color: active ? '#2dd4bf' : item.color }}>
                  <Icon size={20} />
                </div>
                {sidebarOpen && <span className="sidebar-menu-label">{item.label}</span>}
              </button>
            );
          })}

          <button 
            className={`sidebar-menu-btn ${currentTab === 'notifications' ? 'active' : ''}`}
            onClick={() => { setCurrentTab('notifications'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            title="Notifications"
          >
            <div className="sidebar-menu-icon" style={{ position: 'relative', color: currentTab === 'notifications' ? '#2dd4bf' : '#f59e0b' }}>
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </div>
            {sidebarOpen && <span className="sidebar-menu-label">Notifications</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">
            <div className="online-dot"></div>
          </div>
          {sidebarOpen && (
            <>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">Super Admin</div>
                <div className="sidebar-user-role">Platform Manager</div>
              </div>
              <button onClick={onLogout} className="logout-btn">
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
