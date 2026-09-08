import React, { useState } from 'react';
import { Plus, ChevronRight, Filter, Search, Check, FileText } from 'lucide-react';
import { Breadcrumb, Card, PrimaryButton, SecondaryButton, Select, SelectionSummary, Stepper, TextInput } from '../ui';

// Step definitions for the 5-step wizard
const WIZARD_STEPS = [
  { label: 'Domain & Location' },
  { label: 'Framework Selection' },
  { label: 'Topic Configuration' },
  { label: 'Emission Factor DB' },
  { label: 'Review & Save' },
];

interface EsgConfigurationItem {
  id: string;
  cityOrganisation: string;
  domain: string;
  country: string;
  frameworks: string[];
  topicsCount: number;
  efDb: { scope: string; name: string }[];
  status: 'Ready' | 'Draft';
  updatedOn: string;
}

export const EsgConfigurationOverview: React.FC<{ activeView?: string; setActiveView?: (v: string) => void }> = ({ activeView, setActiveView }) => {
  const [viewMode, setViewMode] = useState<'overview' | 'create'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/esg-config/create')) {
      return 'create';
    }
    return activeView === 'esg-config-create' ? 'create' : 'overview';
  });

  // Sync viewMode changes to URL
  React.useEffect(() => {
    if (viewMode === 'create') {
      if (window.location.pathname !== '/emission/esg-config/create') {
        window.history.pushState(null, '', '/emission/esg-config/create');
      }
      if (setActiveView && activeView !== 'esg-config-create') {
        setActiveView('esg-config-create');
      }
    } else {
      if (window.location.pathname !== '/emission/esg-config') {
        window.history.pushState(null, '', '/emission/esg-config');
      }
      if (setActiveView && activeView !== 'esg-config') {
        setActiveView('esg-config');
      }
    }
  }, [viewMode]);

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form Data
  const [country, setCountry] = useState('');
  const [domain, setDomain] = useState('');
  const [cityAuthority, setCityAuthority] = useState('');
  const [startMonth, setStartMonth] = useState('January');
  const [startYear, setStartYear] = useState('2026');

  // Step 2 Form Data (Frameworks - Only GRI and ISSB allowed)
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['GRI', 'ISSB']);

  // Step 3 Form Data (Topics)
  const [activeFrameworkTab, setActiveFrameworkTab] = useState<'GRI' | 'ISSB'>('GRI');
  const [activeTopicTab, setActiveTopicTab] = useState<'Environmental' | 'Social' | 'Governance' | 'City-Specific'>('Environmental');
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['301', '302', '303', '305', 'IFRS-S1', 'IFRS-S2']);

  // Step 4 Form Data (Emission Factor Databases per Scope)
  const [scope1Ef, setScope1Ef] = useState('IPCC 2019');
  const [scope2Ef, setScope2Ef] = useState('Malaysia Grid EF');
  const [scope3Ef, setScope3Ef] = useState('IPCC 2019');

  // List data for overview table
  const [configurations] = useState<EsgConfigurationItem[]>([
    {
      id: '1',
      cityOrganisation: 'Melaka',
      domain: 'Cities / Municipalities',
      country: 'Malaysia',
      frameworks: ['GRI', 'ISSB'],
      topicsCount: 6,
      efDb: [
        { scope: 'S1', name: 'Malaysia DOE' },
        { scope: 'S2', name: 'IPCC 2019' },
        { scope: 'S3', name: 'UK DEFRA 2024' },
      ],
      status: 'Ready',
      updatedOn: '8 Sept 2026',
    },
    {
      id: '2',
      cityOrganisation: 'Melaka',
      domain: 'Cities / Municipalities',
      country: 'Malaysia',
      frameworks: ['GRI', 'ISSB'],
      topicsCount: 6,
      efDb: [],
      status: 'Draft',
      updatedOn: '6 Sept 2026',
    },
    {
      id: '3',
      cityOrganisation: 'Melaka',
      domain: 'Cities / Municipalities',
      country: 'Malaysia',
      frameworks: ['GRI', 'ISSB'],
      topicsCount: 6,
      efDb: [
        { scope: 'S1', name: 'IPCC 2019' },
        { scope: 'S2', name: 'UK DEFRA 2024' },
        { scope: 'S3', name: 'Custom Database' },
      ],
      status: 'Ready',
      updatedOn: '6 Sept 2026',
    },
    {
      id: '4',
      cityOrganisation: 'Melaka',
      domain: 'Cities / Municipalities',
      country: 'Malaysia',
      frameworks: ['GRI', 'ISSB'],
      topicsCount: 6,
      efDb: [],
      status: 'Draft',
      updatedOn: '5 Sept 2026',
    },
    {
      id: '5',
      cityOrganisation: 'Melaka',
      domain: 'Cities / Municipalities',
      country: 'Malaysia',
      frameworks: ['GRI', 'ISSB'],
      topicsCount: 6,
      efDb: [],
      status: 'Draft',
      updatedOn: '5 Sept 2026',
    },
  ]);

  // Overview Filters
  const [selectedCountry, setSelectedCountry] = useState('All countries');
  const [selectedDomain, setSelectedDomain] = useState('All domains');
  const [selectedFramework, setSelectedFramework] = useState('All frameworks');
  const [selectedStatus, setSelectedStatus] = useState('All statuses');

  const toggleFramework = (code: string) => {
    // Only GRI and ISSB can be toggled
    if (code !== 'GRI' && code !== 'ISSB') return;
    if (selectedFrameworks.includes(code)) {
      if (selectedFrameworks.length === 1) return; // Must keep at least one
      setSelectedFrameworks(selectedFrameworks.filter((f) => f !== code));
    } else {
      setSelectedFrameworks([...selectedFrameworks, code]);
    }
  };

  const toggleTopic = (code: string) => {
    if (selectedTopics.includes(code)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== code));
    } else {
      setSelectedTopics([...selectedTopics, code]);
    }
  };

  const frameworksList = [
    { code: 'GPC', name: 'Global Protocol for Community-Scale Greenhouse Gas Inventories', desc: 'GHG accounting and reporting standard for cities and communities.', ver: 'v2014', disabled: true },
    { code: 'GRI', name: 'Global Reporting Initiative Standards', desc: 'Modular sustainability reporting standards covering environmental, social and governance topics.', ver: 'v2021', disabled: false },
    { code: 'ISSB', name: 'IFRS Sustainability Disclosure Standards', desc: 'IFRS S1 General Requirements and IFRS S2 Climate-related Disclosures.', ver: 'vS1/S2 2023', disabled: false },
    { code: 'LGF', name: 'Local Government Framework', desc: 'Local government sustainability reporting framework with city-specific topics.', ver: 'v1.0', disabled: true },
    { code: 'SASB', name: 'Sustainability Accounting Standards Board Standards', desc: 'Industry-specific sustainability disclosure standards.', ver: 'v2023', disabled: true },
    { code: 'TCFD', name: 'Task Force on Climate-related Financial Disclosures', desc: 'Climate-related financial risk disclosure recommendations.', ver: 'v2017', disabled: true },
  ];

  // Topics divided by Framework and Category
  const topicsData: Record<'GRI' | 'ISSB', Record<'Environmental' | 'Social' | 'Governance' | 'City-Specific', { code: string; title: string; source: string; req: string; reqColor: string }[]>> = {
    GRI: {
      Environmental: [
        { code: '301', title: '301 Materials', source: 'GRI', req: 'Recommended', reqColor: 'text-amber-600' },
        { code: '302', title: '302 Energy', source: 'GRI', req: 'Required', reqColor: 'text-rose-500' },
        { code: '303', title: '303 Water and Effluents', source: 'GRI', req: 'Recommended', reqColor: 'text-amber-600' },
        { code: '305', title: '305 Emissions', source: 'GRI', req: 'Required', reqColor: 'text-rose-500' },
        { code: '306', title: '306 Waste', source: 'GRI', req: 'Optional', reqColor: 'text-slate-400' },
      ],
      Social: [
        { code: '401', title: '401 Employment', source: 'GRI', req: 'Recommended', reqColor: 'text-amber-600' },
        { code: '403', title: '403 Occupational Health & Safety', source: 'GRI', req: 'Required', reqColor: 'text-rose-500' },
        { code: '405', title: '405 Diversity and Equal Opportunity', source: 'GRI', req: 'Recommended', reqColor: 'text-amber-600' },
      ],
      Governance: [
        { code: '205', title: '205 Anti-corruption', source: 'GRI', req: 'Required', reqColor: 'text-rose-500' },
        { code: '206', title: '206 Anti-competitive Behavior', source: 'GRI', req: 'Optional', reqColor: 'text-slate-400' },
      ],
      'City-Specific': [
        { code: 'CS-GRI-01', title: 'Urban Density & Green Canopy', source: 'GRI City', req: 'Recommended', reqColor: 'text-amber-600' },
        { code: 'CS-GRI-02', title: 'Municipal Waste Management', source: 'GRI City', req: 'Required', reqColor: 'text-rose-500' },
      ],
    },
    ISSB: {
      Environmental: [
        { code: 'IFRS-S2-1', title: 'IFRS S2 Climate-related Governance', source: 'ISSB', req: 'Required', reqColor: 'text-rose-500' },
        { code: 'IFRS-S2-2', title: 'IFRS S2 Physical & Transition Climate Risks', source: 'ISSB', req: 'Required', reqColor: 'text-rose-500' },
        { code: 'IFRS-S2-3', title: 'IFRS S2 Scope 1, 2, & 3 GHG Disclosures', source: 'ISSB', req: 'Required', reqColor: 'text-rose-500' },
        { code: 'IFRS-S2-4', title: 'IFRS S2 Climate Targets & Transition Plan', source: 'ISSB', req: 'Recommended', reqColor: 'text-amber-600' },
      ],
      Social: [
        { code: 'IFRS-S1-SOC', title: 'IFRS S1 Human Capital & Social Risks', source: 'ISSB', req: 'Recommended', reqColor: 'text-amber-600' },
      ],
      Governance: [
        { code: 'IFRS-S1-GOV', title: 'IFRS S1 General Sustainability Governance', source: 'ISSB', req: 'Required', reqColor: 'text-rose-500' },
        { code: 'IFRS-S1-RM', title: 'IFRS S1 Risk Management Architecture', source: 'ISSB', req: 'Required', reqColor: 'text-rose-500' },
      ],
      'City-Specific': [
        { code: 'CS-ISSB-01', title: 'Public Infrastructure Climate Resiliency', source: 'ISSB City', req: 'Recommended', reqColor: 'text-amber-600' },
      ],
    },
  };

  const efOptions = {
    scope1: [
      { name: 'Custom Database', sub: 'Organisation-defined 1.0' },
      { name: 'IPCC 2019', sub: 'Intergovernmental Panel on Climate Change 2019 Refinement' },
      { name: 'Malaysia DOE', sub: 'Department of Environment Malaysia 2024' },
      { name: 'UK DEFRA 2024', sub: 'UK Department for Environment, Food & Rural Affairs 2024' },
      { name: 'US EPA', sub: 'US Environmental Protection Agency - 2024' },
    ],
    scope2: [
      { name: 'Custom Database', sub: 'Organisation-defined 1.0' },
      { name: 'IPCC 2019', sub: 'Intergovernmental Panel on Climate Change 2019 Refinement' },
      { name: 'Malaysia Grid EF', sub: 'Energy Commission Malaysia - 2024' },
      { name: 'UK DEFRA 2024', sub: 'UK Department for Environment, Food & Rural Affairs 2024' },
      { name: 'US EPA', sub: 'US Environmental Protection Agency - 2024' },
    ],
    scope3: [
      { name: 'Custom Database', sub: 'Organisation-defined 1.0' },
      { name: 'IPCC 2019', sub: 'Intergovernmental Panel on Climate Change 2019 Refinement' },
      { name: 'UK DEFRA 2024', sub: 'UK Department for Environment, Food & Rural Affairs 2024' },
      { name: 'US EPA', sub: 'US Environmental Protection Agency - 2024' },
    ],
  };

  const summaryItems = [
    { label: 'ORGANISATION', value: 'Melaka' },
    { label: 'COUNTRY', value: country || (currentStep > 1 ? 'Malaysia' : '—') },
    { label: 'DOMAIN', value: domain || (currentStep > 1 ? 'Cities / Municipalities' : '—') },
    { label: 'SELECT CITY / LOCAL AUTHORITY', value: cityAuthority || (currentStep > 1 ? 'Johor Bahru (MBJB)' : '—') },
    { label: 'FRAMEWORKS', value: selectedFrameworks.length > 0 ? selectedFrameworks.join(', ') : '—' },
    { label: 'TOPICS', value: currentStep >= 3 ? `${selectedTopics.length} selected` : '—' },
    {
      label: 'EMISSION FACTOR DB',
      value:
        currentStep >= 4
          ? `S1 ${scope1Ef} - S2 ${scope2Ef} - S3 ${scope3Ef}`
          : 'Not configured',
    },
  ];

  if (viewMode === 'create') {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 font-sans text-slate-800 space-y-6">
        {/* Header with Back to List Button */}
        <div className="flex items-center justify-between">
          <Breadcrumb
            items={[
              { label: 'ESG Configuration', href: '#' },
              { label: 'Create New' },
            ]}
          />
          <SecondaryButton
            onClick={() => setViewMode('overview')}
            className="inline-flex items-center gap-1.5 text-xs font-bold"
          >
            ← Back to List
          </SecondaryButton>
        </div>

        {/* Stepper Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <Stepper steps={WIZARD_STEPS} currentStep={currentStep} />
        </div>

        {/* Form Container Grid with Right Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Step Form Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">
              STEP {currentStep} OF 5
            </div>

            {/* STEP 1: Domain & Location */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Select country, domain and city / organisation
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    Pre-filled from your active organisation — adjust if this configuration differs.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Pre-filled Organisation */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Organisation
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Melaka"
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      The active organisation this configuration belongs to.
                    </p>
                  </div>

                  {/* 1. Select Country */}
                  <Select
                    label="1. Select Country"
                    required
                    placeholder="Select country"
                    value={country}
                    onChange={(e: any) => setCountry(e.target.value)}
                    options={[
                      { value: 'Malaysia', label: 'Malaysia' },
                      { value: 'Singapore', label: 'Singapore' },
                      { value: 'United Kingdom', label: 'United Kingdom' },
                    ]}
                  />

                  {/* 2. Select Domain */}
                  <Select
                    label="2. Select Domain"
                    required
                    placeholder={country ? 'Select domain' : 'Select a country first'}
                    disabled={!country}
                    value={domain}
                    onChange={(e: any) => setDomain(e.target.value)}
                    options={[
                      { value: 'Cities / Municipalities', label: 'Cities / Municipalities' },
                      { value: 'Corporate', label: 'Corporate' },
                      { value: 'Manufacturing', label: 'Manufacturing' },
                    ]}
                  />

                  {/* 3. Select City / Local Authority */}
                  <Select
                    label="3. Select City / Local Authority"
                    required
                    placeholder={domain ? 'Select city or authority' : 'Select a domain first'}
                    disabled={!domain}
                    value={cityAuthority}
                    onChange={(e: any) => setCityAuthority(e.target.value)}
                    options={[
                      { value: 'Johor Bahru (MBJB)', label: 'Johor Bahru (MBJB)' },
                      { value: 'Melaka Historic City (MBMB)', label: 'Melaka Historic City (MBMB)' },
                      { value: 'Kuala Lumpur (DBKL)', label: 'Kuala Lumpur (DBKL)' },
                    ]}
                  />

                  {/* Reporting Period */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Reporting Period Start Month"
                      required
                      value={startMonth}
                      onChange={(e: any) => setStartMonth(e.target.value)}
                      options={[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December',
                      ]}
                    />
                    <Select
                      label="Reporting Period Start Year"
                      required
                      value={startYear}
                      onChange={(e: any) => setStartYear(e.target.value)}
                      options={['2024', '2025', '2026', '2027']}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <PrimaryButton onClick={() => setCurrentStep(2)}>
                    Next
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* STEP 2: Framework Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Choose ESG Framework(s) for Melaka
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    Select one or more ESG frameworks that will be applicable for this organisation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">Popular Frameworks</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {frameworksList.map((fw) => {
                      const isChecked = selectedFrameworks.includes(fw.code);
                      const isDisabled = fw.disabled;
                      return (
                        <div
                          key={fw.code}
                          onClick={() => !isDisabled && toggleFramework(fw.code)}
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                            isDisabled
                              ? 'border-slate-200 bg-slate-50/70 opacity-55 cursor-not-allowed'
                              : isChecked
                              ? 'border-cyan-500 bg-cyan-50/20 shadow-sm ring-1 ring-cyan-500/30 cursor-pointer'
                              : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className={`h-4 w-4 ${isDisabled ? 'text-slate-300' : 'text-slate-400'}`} />
                              <span className={`font-extrabold text-sm ${isDisabled ? 'text-slate-400' : 'text-slate-900'}`}>{fw.code}</span>
                              {isDisabled && (
                                <span className="text-[9px] font-semibold uppercase tracking-wide bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <input
                              type="checkbox"
                              disabled={isDisabled}
                              checked={isChecked}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <div className={`text-[11px] font-semibold leading-snug ${isDisabled ? 'text-slate-400' : 'text-slate-700'}`}>{fw.name}</div>
                            <div className="text-[10px] text-slate-400 leading-relaxed mt-1">{fw.desc}</div>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{fw.ver}</div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Only GRI and ISSB frameworks are available — other frameworks are disabled.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <SecondaryButton onClick={() => setCurrentStep(1)}>
                    Back
                  </SecondaryButton>
                  <PrimaryButton onClick={() => setCurrentStep(3)}>
                    Next
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* STEP 3: Topic Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Configure applicable topics / indicators
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    Topics derive from the selected frameworks. Include what you report on.
                  </p>
                </div>

                {/* Primary Framework Tabs (GRI vs ISSB if both selected) */}
                <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
                  {selectedFrameworks.map((fw) => (
                    <button
                      key={fw}
                      type="button"
                      onClick={() => setActiveFrameworkTab(fw as 'GRI' | 'ISSB')}
                      className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                        activeFrameworkTab === fw
                          ? 'bg-white text-cyan-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {fw} Topics
                    </button>
                  ))}
                </div>

                {/* Secondary Category Subtabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    {(['Environmental', 'Social', 'Governance', 'City-Specific'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTopicTab(tab)}
                        className={`pb-2 transition-colors relative cursor-pointer ${
                          activeTopicTab === tab
                            ? 'text-cyan-600 font-bold border-b-2 border-cyan-500'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchTopic}
                      onChange={(e) => setSearchTopic(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Topics Table for active framework tab and category subtab */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Topic / Indicator</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Requirement</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {((topicsData[activeFrameworkTab] && topicsData[activeFrameworkTab][activeTopicTab]) || [])
                        .filter((tp) => tp.title.toLowerCase().includes(searchTopic.toLowerCase()))
                        .map((tp) => {
                          const isChecked = selectedTopics.includes(tp.code);
                          return (
                            <tr key={tp.code} className="hover:bg-slate-50/60">
                              <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleTopic(tp.code)}
                                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                                />
                                <span>{tp.title}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 font-medium">{tp.source}</td>
                              <td className={`py-3 px-4 font-semibold ${tp.reqColor}`}>{tp.req}</td>
                              <td className="py-3 px-4 text-slate-500">{isChecked ? 'Included' : 'Not Included'}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  {selectedTopics.length} topics included across selected frameworks.
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <SecondaryButton onClick={() => setCurrentStep(2)}>
                    Back
                  </SecondaryButton>
                  <PrimaryButton onClick={() => setCurrentStep(4)}>
                    Next
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* STEP 4: Emission Factor DB */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Choose emission factor databases by scope
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    One database per scope — only scope-compatible sources are shown.
                  </p>
                </div>

                {/* Scope 1 Selection */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">Scope 1 — Direct Emissions</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {efOptions.scope1.map((opt) => {
                      const isSelected = scope1Ef === opt.name;
                      return (
                        <div
                          key={opt.name}
                          onClick={() => setScope1Ef(opt.name)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-50/20 ring-1 ring-cyan-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300'}`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">{opt.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scope 2 Selection */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-700">Scope 2 — Energy Indirect Emissions</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {efOptions.scope2.map((opt) => {
                      const isSelected = scope2Ef === opt.name;
                      return (
                        <div
                          key={opt.name}
                          onClick={() => setScope2Ef(opt.name)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-50/20 ring-1 ring-cyan-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300'}`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">{opt.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scope 3 Selection */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-700">Scope 3 — Other Indirect Emissions</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {efOptions.scope3.map((opt) => {
                      const isSelected = scope3Ef === opt.name;
                      return (
                        <div
                          key={opt.name}
                          onClick={() => setScope3Ef(opt.name)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-50/20 ring-1 ring-cyan-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300'}`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800">{opt.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <SecondaryButton onClick={() => setCurrentStep(3)}>
                    Back
                  </SecondaryButton>
                  <PrimaryButton onClick={() => setCurrentStep(5)}>
                    Next
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Save */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Review configuration before saving
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-1">
                    Save keeps it as a draft you can refine; activate when you are ready to report against it.
                  </p>
                </div>

                {/* Summary Details Box */}
                <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                    Configuration Overview
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Organisation:</span>{' '}
                      <span className="font-bold text-slate-800">Melaka</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Country:</span>{' '}
                      <span className="font-bold text-slate-800">{country || 'Malaysia'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Domain:</span>{' '}
                      <span className="font-bold text-slate-800">{domain || 'Cities / Municipalities'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Select City / Local Authority:</span>{' '}
                      <span className="font-bold text-slate-800">{cityAuthority || 'Johor Bahru (MBJB)'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Reporting Period:</span>{' '}
                      <span className="font-bold text-slate-800">{startMonth} {startYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Topics Selected:</span>{' '}
                      <span className="font-bold text-slate-800">{selectedTopics.length} of 7</span>
                    </div>
                  </div>
                </div>

                {/* Frameworks Summary */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    Frameworks ({selectedFrameworks.length})
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedFrameworks.map((fw) => (
                      <span key={fw} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emission Factor Databases Summary */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    Emission Factor Databases
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div><span className="text-slate-400">Scope 1:</span> <span className="font-semibold text-slate-800">{scope1Ef}</span></div>
                    <div><span className="text-slate-400">Scope 2:</span> <span className="font-semibold text-slate-800">{scope2Ef}</span></div>
                    <div><span className="text-slate-400">Scope 3:</span> <span className="font-semibold text-slate-800">{scope3Ef}</span></div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <SecondaryButton onClick={() => setCurrentStep(4)}>
                    Back
                  </SecondaryButton>
                  <div className="flex items-center gap-3">
                    <SecondaryButton onClick={() => setViewMode('overview')}>
                      Save & Activate
                    </SecondaryButton>
                    <PrimaryButton onClick={() => setViewMode('overview')}>
                      Save Configuration
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Selection Summary Card */}
          <div className="lg:col-span-4">
            <SelectionSummary
              title="Configuration Summary"
              items={summaryItems}
              status={
                currentStep === 5
                  ? { label: 'Ready to Save', variant: 'for-review' }
                  : { label: 'In Progress' }
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 font-sans text-slate-800 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'ESG Configuration', href: '#' },
          { label: 'Overview' },
        ]}
      />

      {/* Top Section Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Existing Configurations
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Framework configurations tracked with history and versioning.
          </p>
        </div>
        <PrimaryButton onClick={() => setViewMode('create')} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Configuration</span>
        </PrimaryButton>
      </div>

      {/* Filter Toolbar Container */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Country Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            >
              <option value="All countries">All countries</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>

          {/* Domain Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            >
              <option value="All domains">All domains</option>
              <option value="Corporate">Corporate</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Cities / Municipalities">Cities / Municipalities</option>
            </select>
          </div>

          {/* Framework Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Framework
            </label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            >
              <option value="All frameworks">All frameworks</option>
              <option value="GRI">GRI</option>
              <option value="ISSB">ISSB</option>
              <option value="TCFD">TCFD</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            >
              <option value="All statuses">All statuses</option>
              <option value="Ready">Ready</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Apply Button */}
          <div>
            <SecondaryButton className="w-full flex items-center justify-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <span>Apply</span>
            </SecondaryButton>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">City / Organisation</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Frameworks</th>
                <th className="py-3.5 px-4">Topics</th>
                <th className="py-3.5 px-4">EF DB</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Updated On</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {configurations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {item.cityOrganisation}
                  </td>
                  <td className="py-4 px-4 text-slate-400">
                    {item.domain}
                  </td>
                  <td className="py-4 px-4 text-slate-400">
                    {item.country}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      {item.frameworks.map((fw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {item.topicsCount}
                  </td>
                  <td className="py-4 px-4">
                    {item.efDb.length > 0 ? (
                      <div className="space-y-0.5 text-[11px] text-slate-500">
                        {item.efDb.map((db, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="font-semibold text-slate-600">{db.scope}:</span>
                            <span>{db.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {item.status === 'Ready' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {item.updatedOn}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setViewMode('create')}
                      className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>View</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
