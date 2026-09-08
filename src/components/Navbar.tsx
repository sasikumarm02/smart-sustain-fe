import type { UserRole } from '../types/domain';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Leaf,
  Home,
  LayoutDashboard,
  BarChart3,
  Users,
  Landmark,
  FileText,
  Sliders,
  BookOpen,
  Layers,
  Database,
  HelpCircle,
  LogOut,
  Building2,
  ChevronDown,
  Search,
  Bell,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

export const LeftSidebar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  const { user, currentOrg, role, switchOrganisation, updateUserRole, logout } = useAuth();
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleOrgSwitch = (orgId: string) => {
    switchOrganisation(orgId);
    setShowOrgDropdown(false);
  };

  const [expandedNav, setExpandedNav] = useState<string | null>(null);

  const mainNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scope-one', label: 'Scope 1 Emissions', icon: Leaf },
    { id: 'scope-two', label: 'Scope 2 Emissions', icon: Leaf },
    { 
      id: 'scope-three', 
      label: 'Scope 3 Emissions', 
      icon: Leaf,
      subItems: [
        { id: 'scope-three-cat1', label: 'Category 1' },
        { id: 'scope-three-cat2', label: 'Category 2' },
        { id: 'scope-three-cat3', label: 'Category 3' },
        { id: 'scope-three-cat5', label: 'Category 5' },
        { id: 'scope-three-cat6', label: 'Category 6' },
        { id: 'scope-three-cat13', label: 'Category 13' },
      ]
    },
    { id: 'maturity', label: 'Maturity Assessment', icon: BarChart3 },
    { id: 'facilities', label: 'Environmental', icon: Leaf },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'governance', label: 'Governance', icon: Landmark },
    { id: 'review', label: 'Reporting & Compliance', icon: FileText },
  ];

  const configNav = [
    { id: 'esg-config', label: 'ESG Configuration', icon: Sliders },
    { id: 'config', label: 'Framework Mapping', icon: Layers },
    { id: 'framework-lib', label: 'Framework Library', icon: BookOpen },
    { id: 'ingestion', label: 'Emission Factors', icon: Database },
    { id: 'audit', label: 'Data Categories', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-40 font-sans text-slate-700">
      <div className="p-5 space-y-6 overflow-y-auto">
        {/* Top Brand Logo */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div className="font-extrabold text-xl tracking-tight text-slate-800">
            SmartSustain<span className="text-cyan-600 font-mono text-sm">.AI</span>
          </div>
        </div>

        {/* Active Organisation Context Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowOrgDropdown(!showOrgDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 text-cyan-600 shrink-0" />
              <span className="truncate">{currentOrg?.name || 'Select Org'}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </button>

          {showOrgDropdown && (
            <div className="absolute left-0 mt-2 w-full bg-white shadow-xl rounded-xl p-2 z-50 border border-slate-200">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Active Organisation
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {user?.organisations.map((org) => {
                  const isSelected = org.id === currentOrg?.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSwitch(org.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-cyan-50 text-cyan-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{org.name}</span>
                      {isSelected && <RefreshCw className="h-3 w-3 text-cyan-600 animate-spin shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation Menu */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.subItems && item.subItems.some(sub => activeView === sub.id || activeView.startsWith(sub.id)));
            const isExpanded = expandedNav === item.id || isActive;

            return (
              <div key={item.id} className="w-full">
                <button
                  onClick={() => {
                    if (item.subItems) {
                      setExpandedNav(isExpanded ? null : item.id);
                    } else {
                      setActiveView(item.id);
                    }
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isActive && !item.subItems
                      ? 'bg-[#e6f7ff] text-[#0088cc] font-bold border-r-4 border-[#0088cc] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#0088cc]' : 'text-slate-400'}`} />
                    <span className={isActive && item.subItems ? 'text-[#0088cc] font-bold' : ''}>{item.label}</span>
                  </div>
                  {item.subItems && (
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Sub Items Dropdown */}
                {item.subItems && isExpanded && (
                  <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-1">
                    {item.subItems.map(subItem => {
                      const isSubActive = activeView === subItem.id || activeView.startsWith(subItem.id);
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveView(subItem.id)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-[#e6f7ff] text-[#0088cc] font-bold shadow-xs'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CONFIGURATION Section */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            CONFIGURATION
          </div>
          <div className="space-y-1">
            {configNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#e6f7ff] text-[#0088cc] font-bold border-r-4 border-[#0088cc] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#0088cc]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setShowRoleModal(true)}
          className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 cursor-pointer"
        >
          <Sliders className="h-4 w-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveView('help')}
          className="w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-3 cursor-pointer"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Help Center</span>
        </button>

        <button
          onClick={logout}
          className="w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-3 cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Role Switch Simulator Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-200 text-left">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-2">
              <UserCheck className="h-5 w-5 text-cyan-600" />
              Simulate Role Switch (RBAC)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Switch platform roles for testing session permissions.
            </p>

            <div className="space-y-2">
              {(['DATA_PROVIDER', 'DATA_REVIEWER', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    updateUserRole(r);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    role === r
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold">{r}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export const Header: React.FC = () => {
  const { user, currentOrg, role } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Search Bar */}
      <div className="w-80">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search metrics, logs, or compliance..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Header User Status & Profile */}
      <div className="flex items-center gap-4">
        {/* Platform Active Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Platform Active
        </div>

        {/* Notification Icon */}
        <button
          title="Notifications"
          className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white" />
        </button>

        {/* User Details & Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'Jane Doe'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {role === 'SUPER_ADMIN' ? 'Admin' : role} {currentOrg?.name || 'Company A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const Navbar = LeftSidebar;
