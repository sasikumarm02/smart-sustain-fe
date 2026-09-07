import type { ReactNode } from 'react';
import { LoginPage } from './components/LoginPage';
import OnboardingPage from './components/onboarding/page';
import { ExecutiveAnalytics } from './components/ExecutiveAnalytics';
import { FacilityManager } from './components/FacilityManager';
import { ActivityDataIngestion } from './components/ActivityDataIngestion';
import { ReviewStateMachine } from './components/ReviewStateMachine';
import { MasterConfigEngine } from './components/MasterConfigEngine';
import { AuditLogsExplorer } from './components/AuditLogsExplorer';

import ScopeOneForm from './Modules/ScopeOne/ScopeOneForm';
import ScopeOneTable from './Modules/ScopeOne/ScopeOneTable';
import ScopeTwoForm from './Modules/ScopeTwo/ScopeTwoForm';
import ScopeTwoTable from './Modules/ScopeTwo/ScopeTwoTable';

interface RouteBase {
  path: string;
  element: ReactNode;
}

interface ProtectedRoutes extends RouteBase {
  roles?: string[];
}

export const protectRoutes: ProtectedRoutes[] = [
  {
    path: '/analytics',
    element: <ExecutiveAnalytics />,
  },
  {
    path: '/facilities',
    element: <FacilityManager />,
  },
  {
    path: '/ingestion',
    element: <ActivityDataIngestion />,
  },
  {
    path: '/review',
    element: <ReviewStateMachine />,
  },
  {
    path: '/config',
    element: <MasterConfigEngine />,
  },
  {
    path: '/audit',
    element: <AuditLogsExplorer />,
  },
  // Scopes modules we have built so far
  {
    path: '/emission/scope-one-form',
    element: <ScopeOneForm />,
  },
  {
    path: '/emission/scope-two-form',
    element: <ScopeTwoForm />,
  },
  {
    path: '/emission/scope-one',
    element: <ScopeOneTable />,
  },
  {
    path: '/emission/scope-two',
    element: <ScopeTwoTable />,
  },
];

export const globalRoutes = [
  {
    path: '/auth/login',
    element: <LoginPage onLoginSuccess={() => { }} onSignUpClick={() => { }} />,
  },
  {
    path: '/signup',
    element: <OnboardingPage onBackToLogin={() => { }} onCompleteOnboarding={() => { }} />,
  },
];
