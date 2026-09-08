import React, { useState, useEffect } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EmissionProvider } from "./context/EmissionContext";
import { ConfigProvider } from "./context/ConfigContext";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import OnboardingPage from "./components/onboarding/page";
import { LeftSidebar, Header } from "./components/Navbar";
import { FacilityManager } from "./components/FacilityManager";
import { EsgConfigurationOverview as EsgConfigurationPage } from "./components/esg-configuration/page";
import { ActivityDataIngestion } from "./components/ActivityDataIngestion";
import { ReviewStateMachine } from "./components/ReviewStateMachine";
import { MasterConfigEngine } from "./components/MasterConfigEngine";
import { AuditLogsExplorer } from "./components/AuditLogsExplorer";
import { ExecutiveAnalytics } from "./components/ExecutiveAnalytics";
import ScopeOneTable from "./Modules/ScopeOne/ScopeOneTable";
import ScopeTwoTable from "./Modules/ScopeTwo/ScopeTwoTable";
import ScopeOneForm from "./Modules/ScopeOne/ScopeOneForm";
import ScopeTwoForm from "./Modules/ScopeTwo/ScopeTwoForm";
import CategoryOneTable from "./Modules/ScopeThree/CategoryOneTable";
import CategoryOneForm from "./Modules/ScopeThree/CategoryOneForm";
import CategoryTwoTable from "./Modules/ScopeThree/CategoryTwoTable";
import CategoryTwoForm from "./Modules/ScopeThree/CategoryTwoForm";
import CategoryThreeTable from "./Modules/ScopeThree/CategoryThreeTable";
import CategoryThreeForm from "./Modules/ScopeThree/CategoryThreeForm";
import CategoryFiveTable from "./Modules/ScopeThree/CategoryFiveTable";
import CategoryFiveForm from "./Modules/ScopeThree/CategoryFiveForm";
import CategorySixTable from "./Modules/ScopeThree/CategorySixTable";
import CategorySixForm from "./Modules/ScopeThree/CategorySixForm";

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<string>("analytics");

  const currentPath = location.pathname;

  // Auto-redirect legacy paths if needed
  useEffect(() => {
    if (currentPath === "/signup") {
      navigate("/auth/signup", { replace: true });
    } else if (currentPath === "/login") {
      navigate("/auth/login", { replace: true });
    }
  }, [currentPath, navigate]);

  // Sync activeView to URL
  useEffect(() => {
    if (
      activeView &&
      !currentPath.includes("/auth") &&
      !currentPath.includes("/onboarding")
    ) {
      if (!currentPath.endsWith(activeView)) {
        navigate(`/emission/${activeView}`);
      }
    }
  }, [activeView, navigate, currentPath]);

  // Sync URL to activeView on load/back-forward navigation
  useEffect(() => {
    if (currentPath.startsWith("/emission/")) {
      const viewFromUrl = currentPath.split("/emission/")[1];
      if (viewFromUrl && viewFromUrl !== activeView) {
        setActiveView(viewFromUrl);
      }
    } else if (currentPath === "/" && activeView !== "analytics") {
      setActiveView("analytics");
    }
  }, [currentPath]);

  // Sign Up page route
  if (currentPath === "/auth/signup" || currentPath === "/signup") {
    return (
      <SignUpPage
        onSignUpSuccess={() => navigate("/auth/login")}
        onBackToLogin={() => navigate("/auth/login")}
      />
    );
  }

  // Onboarding page route
  if (currentPath === "/onboarding") {
    return (
      <div className="min-h-screen bg-[#f4f7f6] text-slate-900 p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <OnboardingPage
            onBackToLogin={() => navigate("/auth/login")}
            onCompleteOnboarding={() => navigate(user ? "/" : "/auth/login")}
          />
        </div>
      </div>
    );
  }

  // Login page route / Unauthenticated state
  if (!user || currentPath === "/auth/login") {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setActiveView("analytics");
          if (currentPath === "/auth/login") {
            navigate("/");
          }
        }}
        onNavigateToOnboarding={() => navigate("/onboarding")}
        onSignUpClick={() => navigate("/auth/signup")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans">
      {/* Left Sidebar Navigation */}
      <LeftSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Right Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header bar */}
        <Header />

        {/* Center Main Active Children UI Content Area */}
        <main className="p-6 lg:p-8 flex-1 space-y-6 overflow-y-auto">
          {(activeView === "analytics" || activeView === "home") && (
            <ExecutiveAnalytics />
          )}
          {activeView === "scope-one" && (
            <ScopeOneTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-two" && (
            <ScopeTwoTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-one-form" && (
            <ScopeOneForm setActiveView={setActiveView} />
          )}
          {activeView === "scope-two-form" && (
            <ScopeTwoForm setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat1" && (
            <CategoryOneTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat1-form" && (
            <CategoryOneForm setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat2" && (
            <CategoryTwoTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat2-form" && (
            <CategoryTwoForm setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat3" && (
            <CategoryThreeTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat3-form" && (
            <CategoryThreeForm setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat5" && (
            <CategoryFiveTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat5-form" && (
            <CategoryFiveForm setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat6" && (
            <CategorySixTable setActiveView={setActiveView} />
          )}
          {activeView === "scope-three-cat6-form" && (
            <CategorySixForm setActiveView={setActiveView} />
          )}
          {activeView === "esg-config" && (
            <EsgConfigurationPage />
          )}
          {activeView === "facilities" && (
            <FacilityManager />
          )}
          {(activeView === "ingestion" || activeView === "maturity") && (
            <ActivityDataIngestion />
          )}
          {(activeView === "review" || activeView === "governance") && (
            <ReviewStateMachine />
          )}
          {(activeView === "config" || activeView === "framework-lib") && (
            <MasterConfigEngine />
          )}
          {(activeView === "audit" || activeView === "social") && (
            <AuditLogsExplorer />
          )}
          {(activeView === 'analytics' || activeView === 'home') && <ExecutiveAnalytics />}
          {activeView === 'facilities' && <FacilityManager />}
          {(activeView === 'ingestion' || activeView === 'maturity') && <ActivityDataIngestion />}
          {(activeView === 'review' || activeView === 'governance') && <ReviewStateMachine />}
          {(activeView === 'config' || activeView === 'framework-lib') && <MasterConfigEngine />}
          {(activeView === 'audit' || activeView === 'social') && <AuditLogsExplorer />}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-3.5 px-6 text-center text-xs text-slate-400 mt-auto">
          SmartSustain.AI Enterprise ESG Performance Metrics & Reporting Suite
        </footer>
      </div>
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
