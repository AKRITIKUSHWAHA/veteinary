import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Building2, Search, MoreVertical, Edit, Trash2, Power, Play, Mail, ShieldAlert } from 'lucide-react';

export default function ClinicManagement() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await apiFetch('/api/super-admin/clinics');
        const data = await response.json();
        if (data.status === 'success') setClinics(data.data);
      } catch (error) {
        console.error('Failed to fetch clinics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Clinic Management</h1>
          <p className="text-slate-400 mt-2">Manage all registered clinics on the platform.</p>
        </div>
        
        <div className="relative w-64">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700 text-slate-300 text-sm font-medium">
                <th className="px-6 py-4">Clinic Details</th>
                <th className="px-6 py-4">Admin Name</th>
                <th className="px-6 py-4">Plan & Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading clinics...</td></tr>
              ) : filteredClinics.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No clinics found.</td></tr>
              ) : (
                filteredClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-400/10 flex items-center justify-center text-teal-400">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{clinic.name}</p>
                          <p className="text-slate-400 text-sm">{clinic.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{clinic.adminName}<br/><span className="text-xs text-slate-500">{clinic.phone}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-white font-medium">{clinic.currentPlan}</span>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${clinic.trialStatus === 'Active' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400'}`}>
                            Trial {clinic.trialStatus}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${clinic.subStatus === 'Active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-400/10 text-slate-400'}`}>
                            Sub {clinic.subStatus}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300 text-sm">{new Date(clinic.createdDate).toLocaleDateString()}</p>
                      <p className="text-slate-500 text-xs">Expires: {new Date(clinic.expiryDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-yellow-400 transition-colors" title="Suspend">
                          <Power size={16} />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
