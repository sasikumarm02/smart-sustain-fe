import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmission } from '../context/EmissionContext';
import { useConfig } from '../context/ConfigContext';
import { Flame, Zap, Plane, Plus, CheckCircle2, AlertTriangle, Calculator } from 'lucide-react';

export const ActivityDataIngestion: React.FC = () => {
  const { activeFacility, currentOrg, role } = useAuth();
  const { records, addActivityRecord, submitForReview } = useEmission();
  const { factors } = useConfig();

  const [scope, setScope] = useState<'Scope 1' | 'Scope 2' | 'Scope 3'>('Scope 1');
  const [selectedFactorId, setSelectedFactorId] = useState(factors[0]?.id || '');
  const [activityValue, setActivityValue] = useState<number>(1000);
  const [reportingPeriod, setReportingPeriod] = useState('2026-08');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const scopeFactors = factors.filter((f) => f.category === scope);
  const currentFactor = factors.find((f) => f.id === selectedFactorId) || scopeFactors[0] || factors[0];

  const estimatedEmissions = currentFactor ? Number(((activityValue * currentFactor.factorValue) / 1000).toFixed(3)) : 0;

  const facilityRecords = records.filter(
    (r) => r.facilityId === activeFacility?.id || r.organisationId === currentOrg?.id
  );

  const handleSubmitData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFacility || !currentOrg) return;

    if (role === 'DATA_REVIEWER') {
      setFeedbackMessage({
        text: 'STRICT BOUNDARY GUARD: Data Reviewers are forbidden from ingesting raw activity data.',
        type: 'error',
      });
      return;
    }

    const res = addActivityRecord({
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      organisationId: currentOrg.id,
      scope,
      categoryName: currentFactor.name,
      activityValue,
      unit: currentFactor.unit.split('/')[1]?.trim() || 'Units',
      reportingPeriod,
      factorApplied: currentFactor.factorValue,
      factorSource: currentFactor.source,
    });

    setFeedbackMessage({ text: res.message, type: 'success' });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleSubmitForReview = (recordId: string) => {
    const res = submitForReview(recordId);
    setFeedbackMessage({ text: res.message, type: 'success' });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Calculator className="h-4 w-4" /> GHG Calculation Engine & Data Ingestion (smartsustain-emission)
          </div>
          <h2 className="text-2xl font-bold text-gray-100 m-0">Monthly Activity Data Entry</h2>
          <p className="text-sm text-gray-400 mt-1">
            Ingest Scope 1, 2, and 3 facility metrics into PostgreSQL database with automated $tCO_2e$ formula trace logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-emerald text-xs font-mono">
            Active Scope: {activeFacility?.name}
          </span>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          )}
          {feedbackMessage.text}
        </div>
      )}

      {/* Main Ingestion & Calculations Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="glass-card p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <button
              onClick={() => { setScope('Scope 1'); setSelectedFactorId(factors.find(f => f.category === 'Scope 1')?.id || ''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                scope === 'Scope 1' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-gray-800/40 border-gray-700 text-gray-400'
              }`}
            >
              <Flame className="h-4 w-4 text-amber-400" /> Scope 1 Direct Emissions
            </button>
            <button
              onClick={() => { setScope('Scope 2'); setSelectedFactorId(factors.find(f => f.category === 'Scope 2')?.id || ''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                scope === 'Scope 2' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-gray-800/40 border-gray-700 text-gray-400'
              }`}
            >
              <Zap className="h-4 w-4 text-cyan-400" /> Scope 2 Electricity Grid
            </button>
            <button
              onClick={() => { setScope('Scope 3'); setSelectedFactorId(factors.find(f => f.category === 'Scope 3')?.id || ''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                scope === 'Scope 3' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-gray-800/40 border-gray-700 text-gray-400'
              }`}
            >
              <Plane className="h-4 w-4 text-indigo-400" /> Scope 3 Supply Chain
            </button>
          </div>

          <form onSubmit={handleSubmitData} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Emission Factor Activity Source</label>
                <select
                  value={selectedFactorId}
                  onChange={(e) => setSelectedFactorId(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500"
                >
                  {scopeFactors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.factorValue} {f.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Reporting Period (YYYY-MM)</label>
                <input
                  type="month"
                  value={reportingPeriod}
                  onChange={(e) => setReportingPeriod(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Raw Activity Quantity ({currentFactor?.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={activityValue}
                onChange={(e) => setActivityValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* GHG Formula Execution Preview Box */}
            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs space-y-2">
              <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                Real-Time GHG Calculation Formula Preview:
              </div>
              <div className="text-emerald-400 flex items-center justify-between font-bold">
                <span>
                  ({activityValue} × {currentFactor?.factorValue}) / 1000 =
                </span>
                <span className="text-base text-white font-sans">{estimatedEmissions} tCO₂e</span>
              </div>
              <div className="text-[11px] text-gray-500">
                Source Factor: {currentFactor?.source} ({currentFactor?.year}) • Category: {currentFactor?.subCategory}
              </div>
            </div>

            <button
              type="submit"
              disabled={role === 'DATA_REVIEWER'}
              className="w-full btn-primary justify-center text-xs py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" /> Ingest Activity Record to PostgreSQL
            </button>
          </form>
        </div>

        {/* Audit Trace Context Panel */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wider mb-2">Ingestion Governance</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every data submission creates an immutable record tied to facility <span className="text-emerald-400 font-mono">{activeFacility?.code}</span>. Submissions are tagged in <span className="text-amber-400 font-semibold">DRAFT</span> state until explicitly sent to reviewer.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 space-y-2">
            <div className="text-xs font-semibold text-gray-300">Segregation Rules:</div>
            <ul className="text-[11px] text-gray-400 space-y-1 list-disc pl-4">
              <li>Data Providers ingest activity data.</li>
              <li>Cannot self-approve submitted entries.</li>
              <li>Calculations stored with tCO2e exact conversion precision.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Facility Activity Records Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-100 m-0">Facility Ingested Activity Records</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-3">Period</th>
                <th className="p-3">Scope & Source</th>
                <th className="p-3">Activity Qty</th>
                <th className="p-3">Factor Source</th>
                <th className="p-3 text-right">tCO₂e Result</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {facilityRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 italic">
                    No activity data records ingested for current facility scope yet.
                  </td>
                </tr>
              ) : (
                facilityRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3 font-mono font-medium">{r.reportingPeriod}</td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-100">{r.categoryName}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{r.scope}</div>
                    </td>
                    <td className="p-3 font-mono">
                      {r.activityValue} {r.unit}
                    </td>
                    <td className="p-3 text-gray-400">{r.factorSource}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      {r.calculatedEmission} tCO₂e
                    </td>
                    <td className="p-3">
                      <span
                        className={`badge ${
                          r.status === 'APPROVED'
                            ? 'badge-emerald'
                            : r.status === 'SUBMITTED'
                            ? 'badge-amber'
                            : r.status === 'REJECTED'
                            ? 'badge-rose'
                            : 'badge-cyan'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === 'DRAFT' && (
                        <button
                          onClick={() => handleSubmitForReview(r.id)}
                          className="btn-secondary text-[11px] py-1 px-2"
                        >
                          Submit to Reviewer
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
