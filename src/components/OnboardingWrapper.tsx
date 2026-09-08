import React, { useEffect, useState } from 'react';
import Wizard from './onboarding/wizard';
import { listMaster } from '../lib/api';
import type { OnboardingMasterData } from './onboarding/wizard-types';
import { Breadcrumb } from './ui';
import { ArrowLeft } from 'lucide-react';

interface OnboardingWrapperProps {
  onBackToLogin?: () => void;
  onCompleteOnboarding?: () => void;
}

export const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ onBackToLogin, onCompleteOnboarding }) => {
  const [masterData, setMasterData] = useState<OnboardingMasterData | null>(null);

  useEffect(() => {
    Promise.all([
      listMaster("countries"),
      listMaster("domains"),
      listMaster("cities"),
      listMaster("sectors"),
      listMaster("sub-sectors"),
      listMaster("facility-types"),
    ]).then(([countries, domains, cities, sectors, subSectors, facilityTypes]) => {
      setMasterData({
        countries: countries.items,
        domains: domains.items,
        cities: cities.items,
        sectors: sectors.items,
        subSectors: subSectors.items,
        facilityTypes: facilityTypes.items,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[{ label: "Onboarding", href: "#" }, { label: "Create New Organisation" }]}
        />
        {onBackToLogin && (
          <button
            onClick={onBackToLogin}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-cyan-600" /> Back to Login
          </button>
        )}
      </div>

      {masterData ? (
        <Wizard masterData={masterData} onCompleteOnboarding={onCompleteOnboarding} />
      ) : (
        <div className="p-8 text-center text-xs text-cyan-600 font-mono">
          Loading Onboarding Reference Master Data...
        </div>
      )}
    </div>
  );
};

export default OnboardingWrapper;
