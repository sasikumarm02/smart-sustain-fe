import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { BookOpen, Layers, HelpCircle, Database, Search } from 'lucide-react';

export const MasterConfigEngine: React.FC = () => {
  const { factors, questions } = useConfig();
  const [activeTab, setActiveTab] = useState<'frameworks' | 'factors' | 'questions'>('factors');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFactors = factors.filter(
    (f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuestions = questions.filter(
    (q) => q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) || q.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <BookOpen className="h-4 w-4" /> Config Engine & Master Libraries (smartsustain-config)
          </div>
          <h2 className="text-2xl font-bold text-gray-100 m-0">ESG Reporting Frameworks & Factor Libraries</h2>
          <p className="text-sm text-gray-400 mt-1">
            Standardized question banks (GRI, ISSB, BRSR) and IPCC / DEFRA emission factors database.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveTab('factors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'factors' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'
            }`}
          >
            <Database className="h-3.5 w-3.5" /> Emission Factors ({factors.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'questions' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" /> Master Questions ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'frameworks' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-gray-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Standards Frameworks
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab} library...`}
          className="w-full bg-transparent text-sm text-gray-100 focus:outline-none placeholder-gray-500"
        />
      </div>

      {/* Emission Factors View */}
      {activeTab === 'factors' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-100">Regional & Global Factor Libraries</h3>
            <span className="badge badge-emerald font-mono">Port 8082 - config_db</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="p-3">Factor Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Factor Value</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Governing Source</th>
                  <th className="p-3">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {filteredFactors.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3 font-semibold text-gray-100">{f.name}</td>
                    <td className="p-3">
                      <span className="badge badge-cyan text-[10px]">{f.category}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{f.factorValue}</td>
                    <td className="p-3 font-mono text-gray-400">{f.unit}</td>
                    <td className="p-3 text-gray-300">{f.source}</td>
                    <td className="p-3 font-mono text-gray-400">{f.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Master Question Bank View */}
      {activeTab === 'questions' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-100">Master Question Bank Architecture</h3>
            <span className="badge badge-amber font-mono">Scope 1, 2, 3, Water, Waste, Governance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="glass-card p-4 space-y-2 border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="badge badge-emerald font-mono">{q.code}</span>
                  <span className="badge badge-cyan">{q.framework}</span>
                </div>

                <p className="text-xs text-gray-200 font-medium leading-relaxed">{q.questionText}</p>

                <div className="flex items-center justify-between pt-2 text-[11px] text-gray-400 border-t border-gray-800">
                  <span>Input Type: <span className="text-gray-200 font-mono">{q.inputType}</span></span>
                  {q.requiredUnit && <span>Unit: <span className="text-emerald-400 font-mono">{q.requiredUnit}</span></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frameworks View */}
      {activeTab === 'frameworks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-3">
            <span className="badge badge-emerald">GRI Standards</span>
            <h3 className="text-lg font-bold text-gray-100">Global Reporting Initiative (GRI)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Provides comprehensive disclosure metrics for GRI 302 (Energy), GRI 305 (Emissions), and GRI 303 (Water and Effluents).
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <span className="badge badge-cyan">ISSB S1 / S2</span>
            <h3 className="text-lg font-bold text-gray-100">IFRS Sustainability Standards (ISSB)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Standardized climate-related risk disclosures and financial materiality metrics across Scope 1, 2, and 3 footprint.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <span className="badge badge-amber">BRSR Framework</span>
            <h3 className="text-lg font-bold text-gray-100">Business Responsibility & Sustainability (SEBI)</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mandatory ESG disclosures for top listed enterprises in India across 9 core principles and essential indicators.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <span className="badge badge-rose">GHG Protocol</span>
            <h3 className="text-lg font-bold text-gray-100">GHG Corporate Standard</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Global baseline accounting standard for calculating $tCO_2e$ emissions across direct, energy, and value chain operations.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
