import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminDashboard from './SuperAdminDashboard';
import ClinicManagement from './ClinicManagement';

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

  return (
    <div className="bg-[#0f172a] min-h-screen flex font-sans text-slate-300">
      <SuperAdminSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <header className="h-[80px] border-b border-white/5 flex items-center px-8 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
          <h2 className="text-xl font-bold text-white capitalize">{currentTab.replace('-', ' ')}</h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {currentTab === 'dashboard' && <SuperAdminDashboard />}
          {currentTab === 'clinics' && <ClinicManagement />}
          {currentTab !== 'dashboard' && currentTab !== 'clinics' && (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>{currentTab.replace('-', ' ')} module under construction.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
