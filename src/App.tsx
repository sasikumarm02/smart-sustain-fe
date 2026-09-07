import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmissionProvider } from './context/EmissionContext';
import { ConfigProvider } from './context/ConfigContext';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import OnboardingPage from './components/onboarding/page';
import { Navbar } from './components/Navbar';
import { FacilityManager } from './components/FacilityManager';
import { ActivityDataIngestion } from './components/ActivityDataIngestion';
import { ReviewStateMachine } from './components/ReviewStateMachine';
import { MasterConfigEngine } from './components/MasterConfigEngine';
import { AuditLogsExplorer } from './components/AuditLogsExplorer';
import { ExecutiveAnalytics } from './components/ExecutiveAnalytics';

import {
  TrendingUp,
  Building2,
  Calculator,
  ShieldCheck,
  BookOpen,
  ShieldAlert,
  FileCode2,
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<
    'analytics' | 'facilities' | 'ingestion' | 'review' | 'config' | 'audit'
  >('analytics');

  const currentPath = location.pathname;

  // Auto-redirect legacy paths if needed
  useEffect(() => {
    if (currentPath === '/signup') {
      navigate('/auth/signup', { replace: true });
    } else if (currentPath === '/login') {
      navigate('/auth/login', { replace: true });
    }
  }, [currentPath, navigate]);

  // Sign Up page route
  if (currentPath === '/auth/signup' || currentPath === '/signup') {
    return (
      <SignUpPage
        onSignUpSuccess={() => navigate('/auth/login')}
        onBackToLogin={() => navigate('/auth/login')}
      />
    );
  }

  // Onboarding page route
  if (currentPath === '/onboarding') {
    return (
      <div className="min-h-screen bg-[#f4f7f6] text-slate-900 p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <OnboardingPage
            onBackToLogin={() => navigate('/auth/login')}
            onCompleteOnboarding={() => navigate(user ? '/' : '/auth/login')}
          />
        </div>
      </div>
    );
  }

  // Login page route / Unauthenticated state
  if (!user || currentPath === '/auth/login') {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setActiveView('analytics');
          if (currentPath === '/auth/login') {
            navigate('/');
          }
        }}
        onNavigateToOnboarding={() => navigate('/onboarding')}
        onSignUpClick={() => navigate('/auth/signup')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      {/* Universal Top Navigation Header */}
      <Navbar />

      {/* Main App Container */}
      <div className="max-w-7xl w-full mx-auto px-6 pb-12 flex-1 space-y-6">
        {/* Module View Navigation Tabs */}
        <div className="glass-panel p-2 flex flex-wrap items-center justify-between gap-2 border border-gray-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'analytics'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <TrendingUp className="h-4 w-4" /> Executive Analytics
            </button>

            <button
              onClick={() => setActiveView('facilities')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'facilities'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <Building2 className="h-4 w-4" /> Facilities & Tenancy
            </button>

            <button
              onClick={() => setActiveView('ingestion')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'ingestion'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <Calculator className="h-4 w-4" /> Activity Ingestion
            </button>

            <button
              onClick={() => setActiveView('review')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'review'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Approval Workflows
            </button>

            <button
              onClick={() => setActiveView('config')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'config'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <BookOpen className="h-4 w-4" /> Framework Config
            </button>

            <button
              onClick={() => setActiveView('audit')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeView === 'audit'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
              }`}
            >
              <ShieldAlert className="h-4 w-4" /> Audit Logs Engine
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-gray-500 flex items-center gap-1 px-2.5 py-1 rounded bg-gray-900 border border-gray-800">
              <FileCode2 className="h-3.5 w-3.5 text-emerald-400" /> Monolithic React Spec v1.0.0
            </span>
          </div>
        </div>

        {/* View Component Rendering */}
        <main>
          {activeView === 'analytics' && <ExecutiveAnalytics />}
          {activeView === 'facilities' && <FacilityManager />}
          {activeView === 'ingestion' && <ActivityDataIngestion />}
          {activeView === 'review' && <ReviewStateMachine />}
          {activeView === 'config' && <MasterConfigEngine />}
          {activeView === 'audit' && <AuditLogsExplorer />}
        </main>
      </div>

      {/* Enterprise Footer */}
      <footer className="glass-panel mt-auto py-4 px-6 border-t border-gray-800 text-center text-xs text-gray-500">
        SmartSustain.AI Monolithic ESG & Carbon Accounting Platform • Microservices Specs Matrix Ready
      </footer>
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider>
          <EmissionProvider>
            <AppContent />
          </EmissionProvider>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
