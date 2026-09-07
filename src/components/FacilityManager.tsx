import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, Shield, MapPin, CheckCircle2, UserPlus, AlertCircle } from 'lucide-react';
import type { Facility } from '../types/domain';

export const FacilityManager: React.FC = () => {
  const { user, currentOrg, addFacilityToOrg, assignReviewerToFacility, role } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewerModal, setShowReviewerModal] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState<Facility['type']>('FACTORY');
  const [country, setCountry] = useState(currentOrg?.country || 'Malaysia');

  const [reviewerName, setReviewerName] = useState('');

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg) return;

    const newFacility: Facility = {
      id: `fac-${Date.now()}`,
      organisationId: currentOrg.id,
      name,
      code: code || `${currentOrg.code.substring(0, 4)}-FAC-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      type,
      country,
      status: 'ACTIVE',
    };

    addFacilityToOrg(newFacility);
    setShowAddModal(false);
    setName('');
    setCode('');
  };

  const handleAssignReviewer = (facilityId: string) => {
    if (!reviewerName.trim()) return;
    assignReviewerToFacility(facilityId, `usr-rev-${Date.now()}`, reviewerName);
    setShowReviewerModal(null);
    setReviewerName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Building2 className="h-4 w-4" /> Multi-Facility Hierarchy (1 Org -&gt; N Facilities)
          </div>
          <h2 className="text-2xl font-bold text-gray-100 m-0">Facility Operations & Reviewer Assignments</h2>
          <p className="text-sm text-gray-400 mt-1">
            Configure multi-facility emission boundaries for <span className="text-gray-200 font-semibold">{currentOrg?.name}</span>. Default HQ is automatically provisioned.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Add New Facility
        </button>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {user?.facilities.map((fac) => (
          <div key={fac.id} className="glass-card p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-emerald font-mono">{fac.code}</span>
                <span className="badge badge-cyan text-[11px]">{fac.type}</span>
              </div>

              <h3 className="text-base font-bold text-gray-100 mb-1 leading-snug">{fac.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-4">
                <MapPin className="h-3.5 w-3.5 text-rose-400" /> {fac.country} • Status: <span className="text-emerald-400 font-semibold">{fac.status}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Assigned Reviewer:</span>
                <span className="font-semibold text-gray-200">
                  {fac.assignedReviewerName ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {fac.assignedReviewerName}
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> Unassigned
                    </span>
                  )}
                </span>
              </div>

              {role === 'SUPER_ADMIN' ? (
                <button
                  onClick={() => setShowReviewerModal(fac.id)}
                  className="w-full btn-secondary text-xs justify-center py-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5 text-emerald-400" /> Assign Reviewer (Super Admin)
                </button>
              ) : (
                <div className="text-[11px] text-gray-500 italic text-center">
                  Reviewer assignment restricted to Super Admin role.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Facility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateFacility} className="glass-panel w-full max-w-lg p-6 bg-gray-900 border border-gray-700 rounded-xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-400" /> Ingest New Facility Context
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Facility Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cyberjaya Solar Plant Beta"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Facility Code (Optional)</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Auto-generated if empty"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Facility Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="SOLAR_PLANT">Solar Plant</option>
                  <option value="FACTORY">Manufacturing Factory</option>
                  <option value="WAREHOUSE">Warehouse Logistics</option>
                  <option value="REGIONAL_OFFICE">Regional Office</option>
                  <option value="HEADQUARTERS">Headquarters</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Country Jurisdiction</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs">
                Provision Facility
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviewer Assignment Modal */}
      {showReviewerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 bg-gray-900 border border-gray-700 rounded-xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" /> Assign Facility Data Reviewer
            </h3>
            <p className="text-xs text-gray-400">
              Assigned reviewer will hold segregation boundary rights to inspect and approve submitted GHG calculation records for this facility.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Reviewer Full Name & Title</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Dr. Aris Thorne (ESG Compliance Manager)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button onClick={() => setShowReviewerModal(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleAssignReviewer(showReviewerModal)}
                className="btn-primary text-xs"
              >
                Confirm Reviewer Binding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
