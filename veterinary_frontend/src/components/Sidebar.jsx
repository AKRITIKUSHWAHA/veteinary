import React from 'react';
import { 
  LayoutDashboard, CalendarDays, Users, Dog, FileHeart,
  CreditCard, Package, BarChart3, Settings, LogOut,
  UserCog, Bell, Pill, Microscope, ClipboardPen, Clock, ClipboardList, Mail
} from 'lucide-react';

/* ── Beautiful Paw SVG Logo ── */
function PawIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main pad */}
      <ellipse cx="32" cy="42" rx="14" ry="11" fill="#14b8a6" opacity="0.9"/>
      {/* Top left toe */}
      <ellipse cx="14" cy="26" rx="6" ry="8" transform="rotate(-20 14 26)" fill="#14b8a6" opacity="0.75"/>
      {/* Top centre-left toe */}
      <ellipse cx="25" cy="20" rx="5.5" ry="7.5" transform="rotate(-5 25 20)" fill="#14b8a6" opacity="0.75"/>
      {/* Top centre-right toe */}
      <ellipse cx="39" cy="20" rx="5.5" ry="7.5" transform="rotate(5 39 20)" fill="#14b8a6" opacity="0.75"/>
      {/* Top right toe */}
      <ellipse cx="50" cy="26" rx="6" ry="8" transform="rotate(20 50 26)" fill="#14b8a6" opacity="0.75"/>
    </svg>
  );
}

export default function Sidebar({ 
  currentTab, setCurrentTab,
  sidebarOpen, setSidebarOpen,
  currentRole, setCurrentRole,
  onLogout,
  notifications
}) {
  const menuItems = [
    { id: 'dashboard',    label: 'Dashboard',             icon: LayoutDashboard, roles: ['Admin','Manager','Doctor','Receptionist','Vet Assistant'] },
    { id: 'appointments', label: currentRole === 'Doctor' || currentRole === 'Vet Assistant' ? 'My Appointments' : 'Appointments', icon: CalendarDays, roles: ['Admin','Manager','Doctor','Receptionist', 'Vet Assistant'] },
    { id: 'home-visits',  label: currentRole === 'Doctor' ? 'Home Visits' : 'Home Visit Appointments', icon: CalendarDays,  roles: ['Admin','Manager','Receptionist','Doctor', 'Vet Assistant'] },
    { id: 'owners',       label: 'Pet Owners',            icon: Users,           roles: ['Admin','Manager','Receptionist'] },
    { id: 'pets',         label: currentRole === 'Doctor' || currentRole === 'Vet Assistant' ? 'Patients' : 'Pets', icon: Dog, roles: ['Admin','Manager','Doctor','Receptionist', 'Vet Assistant'] },
    { id: 'medical',      label: 'Medical Records',       icon: FileHeart,       roles: ['Admin','Manager','Doctor','Vet Assistant'] },
    { id: 'treatment',    label: 'Treatment Notes',       icon: ClipboardPen,    roles: ['Doctor'] },
    { id: 'assistance-tasks', label: 'Assistance Tasks',  icon: ClipboardList,   roles: ['Vet Assistant'] },
    { id: 'prescriptions',label: 'Prescriptions',         icon: Pill,            roles: ['Doctor'] },
    { id: 'my-revenue',   label: 'My Revenue',            icon: BarChart3,       roles: ['Doctor'] },
    { id: 'billing',      label: 'Billing & POS',         icon: CreditCard,      roles: ['Admin','Manager','Receptionist','Doctor'] },
    { id: 'inventory',    label: 'Inventory',             icon: Package,         roles: ['Admin','Manager','Receptionist'] },
    { id: 'reminders',    label: 'Email Reminders',       icon: Mail,            roles: ['Admin','Manager','Receptionist'] },
    { id: 'staff',        label: 'Staff Management',      icon: UserCog,         roles: ['Admin'] },
    { id: 'attendance',   label: 'Attendance',            icon: Clock,           roles: ['Admin','Manager'] },
    { id: 'reports',      label: 'Reports & Analytics',   icon: BarChart3,       roles: ['Admin','Manager'] },
    { id: 'settings',     label: currentRole !== 'Admin' ? 'Profile Settings' : 'Settings', icon: Settings, roles: ['Admin', 'Manager', 'Doctor', 'Receptionist', 'Vet Assistant'] },
  ];

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;
  const filteredItems = menuItems.filter(item => item.roles.includes(currentRole));

  const staffName = {
    Admin: 'Diana Prince',
    Manager: 'Bruce Wayne',
    Doctor: 'Dr. Sarah Connor',
    Receptionist: 'Barry Allen',
    'Vet Assistant': 'Kara Danvers'
  }[currentRole] || currentRole;

  const isActive = (id) => currentTab === id || (id === 'medical' && (currentTab === 'reports-uploads' || currentTab === 'prescriptions'));

  return (
    <>
      {/* ── Mobile overlay backdrop (Hidden on Desktop) ── */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside style={{
        width: sidebarOpen ? 'var(--sidebar-width)' : '75px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border)',
        height: '100vh', position: 'fixed',
        top: 0, left: 0, zIndex: 1000,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease, transform 0.3s ease',
        overflowX: 'hidden'
      }} className="sidebar">

        {/* ── Brand Header ── */}
        <div style={{
          height: 'var(--navbar-height)',
          display: 'flex', alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          padding: sidebarOpen ? '0 1.25rem' : '0',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden', gap: '0.75rem'
        }}>
          {/* Logo icon — always visible */}
          <div style={{
            width: '42px', height: '42px', borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary-teal-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <PawIcon size={30} />
          </div>

          {/* Brand name — only when expanded */}
          {sidebarOpen && (
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              VetCare <span style={{ color: 'var(--primary-teal)' }}>Pro</span>
            </span>
          )}
        </div>

        {/* ── Navigation Menu ── */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button key={item.id}
                onClick={() => { setCurrentTab(item.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  borderRadius: 'var(--radius-lg)', border: 'none',
                  backgroundColor: active ? 'var(--primary-teal)' : 'transparent',
                  color: active ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  width: '100%', textAlign: 'left',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  fontWeight: active ? 600 : 400
                }}
                title={item.label}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}

          {/* ── Notifications ── */}
          <button onClick={() => { setCurrentTab('notifications'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.7rem 1rem',
              borderRadius: 'var(--radius-lg)', border: 'none',
              backgroundColor: isActive('notifications') ? 'var(--primary-teal)' : 'transparent',
              color: isActive('notifications') ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s ease',
              width: '100%', textAlign: 'left',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              fontWeight: isActive('notifications') ? 600 : 400,
              position: 'relative'
            }}
            title="Notifications"
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  backgroundColor: 'var(--danger)', color: '#fff',
                  fontSize: '0.6rem', fontWeight: 700,
                  width: '16px', height: '16px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #fff'
                }}>{unreadCount}</span>
              )}
            </div>
            {sidebarOpen && <span className="text-sm">Notifications</span>}
          </button>
        </nav>

        {/* ── Footer ── */}
        <div style={{
          padding: '1rem', borderTop: '1px solid var(--border)',
          backgroundColor: '#fafafa',
          display: 'flex', flexDirection: 'column',
          alignItems: sidebarOpen ? 'flex-start' : 'center', gap: '0.75rem'
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.875rem', color: '#334155', flexShrink: 0 }}>
                {currentRole[0]}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p className="text-xs font-bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{staffName}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{currentRole}</p>
              </div>
              <button onClick={onLogout}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.25rem', borderRadius: '4px', transition: 'color 0.2s', flexShrink: 0 }}
                title="Logout"
                onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            /* Collapsed: just show logout icon */
            <button onClick={onLogout}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem', borderRadius: '4px', transition: 'color 0.2s' }}
              title="Logout"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
