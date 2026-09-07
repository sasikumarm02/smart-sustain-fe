import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmissionProvider } from './context/EmissionContext';
import { ConfigProvider } from './context/ConfigContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      {/* Universal Top Navigation Header */}
      <Navbar />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <EmissionProvider>
          <AppContent />
        </EmissionProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
