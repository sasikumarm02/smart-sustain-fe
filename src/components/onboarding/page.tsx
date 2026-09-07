import React from "react";
import { Breadcrumb } from "../ui";
import Wizard from "./wizard";

interface OnboardingPageProps {
  onBackToLogin?: () => void;
  onCompleteOnboarding?: () => void;
}

export default function OnboardingPage({ onBackToLogin }: OnboardingPageProps = {}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <Breadcrumb
          items={[{ label: "Onboarding", href: "#" }, { label: "Create New Organisation" }]}
        />
        {onBackToLogin && (
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        )}
      </div>
      <Wizard />
    </div>
  );
}

