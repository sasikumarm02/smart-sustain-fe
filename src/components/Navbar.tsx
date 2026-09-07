import type { UserRole } from '../types/domain';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  Building2,
  MapPin,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  UserCheck,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, currentOrg, activeFacility, role, switchOrganisation, setActiveFacilityId, updateUserRole, logout } = useAuth();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleOrgSwitch = (orgId: string) => {
    switchOrganisation(orgId);
    setShowOrgDropdown(false);
  };

  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-3 border-b border-gray-800 flex items-center justify-between mb-6">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 m-0 leading-tight">
            SmartSustain<span className="text-emerald-400 font-mono text-sm">.AI</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">Enterprise ESG & Carbon Accounting Platform</p>
        </div>
      </div>

      {/* Center Tenant Controls (Org & Facility Switcher) */}
      <div className="flex items-center gap-4">
        {/* Organisation Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-700 text-sm font-medium hover:border-emerald-500/50 transition-all text-gray-200"
          >
            <Building2 className="h-4 w-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-xs text-gray-400 leading-none">Active Organisation</div>
              <div className="font-semibold text-gray-100 flex items-center gap-1.5 mt-0.5">
                {currentOrg?.name}
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
                  {currentOrg?.code}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-2 w-72 glass-panel shadow-2xl rounded-xl p-2 z-50 border border-gray-700 bg-gray-900/95">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                Switch Active Organisation Context (POST /auth/switch-organisation)
              </div>
              <div className="mt-1 space-y-1">
                {user?.organisations.map((org) => {
                  const isSelected = org.id === currentOrg?.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSwitch(org.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold text-sm text-gray-100 truncate">{org.name}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          <span>{org.country}</span> • <span>Role: {org.role}</span>
                        </div>
                      </div>
                      {isSelected && <RefreshCw className="h-3.5 w-3.5 text-emerald-400 animate-spin" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Facility Context Dropdown */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-700 text-sm font-medium text-gray-200">
          <MapPin className="h-4 w-4 text-cyan-400" />
          <div className="text-left">
            <div className="text-xs text-gray-400 leading-none">Facility Scope</div>
            <select
              value={activeFacility?.id || ''}
              onChange={(e) => setActiveFacilityId(e.target.value)}
              className="bg-transparent text-gray-100 font-semibold text-xs border-none focus:outline-none focus:ring-0 cursor-pointer pr-2 mt-0.5"
            >
              {user?.facilities.map((fac) => (
                <option key={fac.id} value={fac.id} className="bg-gray-900 text-gray-200">
                  {fac.name} ({fac.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User & Role Badge */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-200 flex items-center justify-end gap-1.5">
            {user?.name}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span
              onClick={() => setShowRoleModal(true)}
              title="Click to simulate RBAC role switch"
              className={`badge cursor-pointer ${
                role === 'SUPER_ADMIN'
                  ? 'badge-rose'
                  : role === 'DATA_REVIEWER'
                  ? 'badge-amber'
                  : 'badge-emerald'
              }`}
            >
              <ShieldCheck className="h-3 w-3" />
              {role}
              <SlidersHorizontal className="h-3 w-3 ml-1 text-gray-400 hover:text-white" />
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout Session"
          className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Role Switch Simulator Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2 mb-2">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              Simulate Role Switch (RBAC Test)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Test system boundaries by switching between platform roles for the active session context.
            </p>

            <div className="space-y-3">
              {(['DATA_PROVIDER', 'DATA_REVIEWER', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    updateUserRole(r);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-sm font-medium transition-all ${
                    role === r
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="font-bold">{r}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {r === 'SUPER_ADMIN' && 'Full platform management, overrides, and regulatory audit API access.'}
                    {r === 'DATA_PROVIDER' && 'Can enter facility activity data & run GHG calculations. Cannot approve own submissions.'}
                    {r === 'DATA_REVIEWER' && 'Validates emission traces. Approves or rejects submissions with remarks.'}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              className="mt-5 w-full btn-secondary justify-center text-xs"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
