import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminDashboard from './SuperAdminDashboard';
import ClinicManagement from './ClinicManagement';
import SuperAdminSubscriptions from './SuperAdminSubscriptions';
import SuperAdminPlans from './SuperAdminPlans';
import SuperAdminPayments from './SuperAdminPayments';
import SuperAdminTickets from './SuperAdminTickets';
import SuperAdminSettings from './SuperAdminSettings';
import SuperAdminReports from './SuperAdminReports';
import SuperAdminNotifications from './SuperAdminNotifications';
import './SuperAdmin.css';

export default function SuperAdminLayout({ setIsSuperAdmin }) {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('sa_user');
    setIsSuperAdmin(false);
    navigate('/super-admin/login', { replace: true });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <SuperAdminDashboard />;
      case 'clinics': return <ClinicManagement />;
      case 'subscriptions': return <SuperAdminSubscriptions />;
      case 'plans': return <SuperAdminPlans />;
      case 'payments': return <SuperAdminPayments />;
      case 'tickets': return <SuperAdminTickets />;
      case 'settings': return <SuperAdminSettings />;
      case 'reports': return <SuperAdminReports type="reports" />;
      case 'revenue': return <SuperAdminReports type="revenue" />;
      case 'notifications': return <SuperAdminNotifications />;
      default:
        return (
          <div className="sa-under-construction">
            <p>{currentTab.replace('-', ' ')} module under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="sa-layout-wrapper">
      <SuperAdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className={`sa-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="sa-header">
          <h2>{currentTab.replace('-', ' ')}</h2>
        </header>

        <main className="sa-content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
