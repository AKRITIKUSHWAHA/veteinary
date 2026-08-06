import { apiFetch } from '../utils/api';
import React, { useState } from 'react';
import { Clock, UserCheck, Calendar, UserX, AlertTriangle, TrendingUp, Users, Activity, BarChart3, Stethoscope, Briefcase, HeartHandshake, FileText } from 'lucide-react';

export default function Attendance({ currentRole }) {
  const isAdminOrManager = currentRole === 'Admin' || currentRole === 'Manager';
  const [filterRole, setFilterRole] = useState('All');
  const [viewMode, setViewMode] = useState(isAdminOrManager ? 'hub' : 'personal');
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [personalHistory, setPersonalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (viewMode === 'hub') {
        const res = await apiFetch('http://localhost:5000/api/v1/attendance');
        const json = await res.json();
        if (json.status === 'success') {
          setDailyAttendance(json.data);
        }
      } else {
        const res = await apiFetch('http://localhost:5000/api/v1/attendance/me');
        const json = await res.json();
        if (json.status === 'success') {
          setPersonalHistory(json.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchData();
  }, [viewMode]);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('http://localhost:5000/api/v1/attendance/checkin', {
        method: 'POST',
        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Checked in successfully!');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('http://localhost:5000/api/v1/attendance/checkout', {
        method: 'POST',
        
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(`Checked out successfully! Total hours: ${data.data.workingHours}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredAttendance = filterRole === 'All' 
    ? dailyAttendance 
    : dailyAttendance.filter(s => s.role === filterRole);

  const filterOptions = ['All', 'Doctor', 'Receptionist', 'Vet Assistant', 'Manager', 'Admin'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return 'badge-success';
      case 'Absent': return 'badge-danger';
      case 'Late': return 'badge-warning';
      case 'Half Day': return 'badge-warning';
      case 'On Leave': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const presentToday = dailyAttendance.filter(s => s.status === 'Present').length;
  const absentToday = dailyAttendance.filter(s => s.status === 'Absent' || s.status === 'On Leave').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Clock size={28} style={{ color: 'var(--primary-teal)' }} /> {isAdminOrManager ? 'Clinic Attendance Hub' : 'My Attendance & Performance'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            {viewMode === 'hub' ? 'Monitor staff check-ins, working hours, and operational productivity.' : 'Track your personal check-ins, working hours, and performance metrics.'}
          </p>
        </div>
        {isAdminOrManager && (
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-lg)' }}>
            <button
              onClick={() => setViewMode('hub')}
              style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: viewMode === 'hub' ? 700 : 500, backgroundColor: viewMode === 'hub' ? '#fff' : 'transparent', color: viewMode === 'hub' ? 'var(--primary-teal)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: viewMode === 'hub' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              Clinic Hub
            </button>
            <button
              onClick={() => setViewMode('personal')}
              style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: viewMode === 'personal' ? 700 : 500, backgroundColor: viewMode === 'personal' ? '#fff' : 'transparent', color: viewMode === 'personal' ? 'var(--primary-teal)' : 'var(--text-secondary)', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: viewMode === 'personal' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
            >
              My Attendance
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading attendance data...</div>
      ) : viewMode === 'hub' ? (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid-responsive">
            <div className="card hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--success)', padding: '1.25rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)' }}><UserCheck size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Present Today</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{presentToday} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {dailyAttendance.length}</span></h3>
              </div>
            </div>
            <div className="card hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--danger)', padding: '1.25rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '50%', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}><UserX size={24} /></div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Absent / Leave</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '2px 0 0 0' }}>{absentToday}</h3>
              </div>
            </div>
          </div>

          {/* Daily Attendance Table */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h3 className="font-bold text-lg" style={{ margin: 0 }}>Today's Staff Attendance & Productivity</h3>
              <div style={{ width: '100%', maxWidth: '100%' }}>
                <div style={{ display: 'flex', gap: '6px', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: 'var(--radius-lg)', overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                  {filterOptions.map(role => (
                    <button 
                      key={role}
                      onClick={() => setFilterRole(role)}
                      style={{ 
                        flex: '0 0 auto',
                        whiteSpace: 'nowrap',
                        padding: '6px 14px', 
                        fontSize: '0.78rem', 
                        fontWeight: filterRole === role ? 700 : 500,
                        backgroundColor: filterRole === role ? '#fff' : 'transparent',
                        color: filterRole === role ? 'var(--primary-teal)' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        boxShadow: filterRole === role ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Role</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th style={{ textAlign: 'center' }}>Total Hrs</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th>Activity Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map(staff => (
                    <tr key={staff.id}>
                      <td className="font-bold">{staff.name}</td>
                      <td><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{staff.role}</span></td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem' }}>{staff.checkIn}</td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem' }}>{staff.checkOut}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{staff.hours}h</td>
                      <td style={{ textAlign: 'center' }}><span className={`badge ${getStatusBadge(staff.status)}`} style={{ fontSize: '0.7rem' }}>{staff.status}</span></td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{staff.activity}</td>
                    </tr>
                  ))}
                  {filteredAttendance.length === 0 && (
                    <tr><td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>No staff found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
             <button onClick={handleCheckIn} className="btn" style={{ padding: '0.75rem 1.5rem' }}>
                <Clock size={18} /> Check In Now
             </button>
             <button onClick={handleCheckOut} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', color: 'var(--danger)' }}>
                <Clock size={18} /> Check Out
             </button>
          </div>

          <div className="card">
            <h3 className="font-bold text-lg" style={{ marginBottom: '1rem' }}>My Attendance History</h3>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th style={{ textAlign: 'center' }}>Hours Logged</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {personalHistory.map((log, i) => (
                    <tr key={i}>
                      <td className="font-bold">{log.date}</td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem' }}>{log.checkIn}</td>
                      <td className="font-semibold" style={{ fontSize: '0.85rem' }}>{log.checkOut}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{log.hours}h</td>
                      <td style={{ textAlign: 'center' }}><span className={`badge ${getStatusBadge(log.status)}`} style={{ fontSize: '0.7rem' }}>{log.status}</span></td>
                    </tr>
                  ))}
                  {personalHistory.length === 0 && (
                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No history found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
