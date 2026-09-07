import React from 'react';
import { useEmission } from '../context/EmissionContext';
import { useAuth } from '../context/AuthContext';
import { Leaf, Flame, Zap, Plane, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const ExecutiveAnalytics: React.FC = () => {
  const { records } = useEmission();
  const { currentOrg } = useAuth();

  const approvedRecords = records.filter((r) => r.status === 'APPROVED');
  const pendingRecords = records.filter((r) => r.status === 'SUBMITTED');

  const totalEmissions = Number(approvedRecords.reduce((acc, r) => acc + r.calculatedEmission, 0).toFixed(2));
  const scope1Emissions = Number(approvedRecords.filter((r) => r.scope === 'Scope 1').reduce((acc, r) => acc + r.calculatedEmission, 0).toFixed(2));
  const scope2Emissions = Number(approvedRecords.filter((r) => r.scope === 'Scope 2').reduce((acc, r) => acc + r.calculatedEmission, 0).toFixed(2));
  const scope3Emissions = Number(approvedRecords.filter((r) => r.scope === 'Scope 3').reduce((acc, r) => acc + r.calculatedEmission, 0).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Executive Overview Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <TrendingUp className="h-4 w-4" /> Executive Sustainability Analytics & Footprint
          </div>
          <h2 className="text-2xl font-bold text-gray-100 m-0">Organisation & Facility Emission Rollups</h2>
          <p className="text-sm text-gray-400 mt-1">
            Aggregated carbon accounting metrics across all facilities under <span className="text-gray-200 font-semibold">{currentOrg?.name}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-emerald text-xs font-mono">
            Reporting Period: CY 2026
          </span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Total Carbon Footprint Card */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Footprint</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalEmissions}</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">tCO₂e Metric Tonnes</div>
        </div>

        {/* Scope 1 Direct Card */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scope 1 Direct</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{scope1Emissions}</div>
          <div className="text-xs text-amber-400 font-medium mt-1">Fuel & Refrigerants</div>
        </div>

        {/* Scope 2 Electricity Card */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scope 2 Indirect</span>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{scope2Emissions}</div>
          <div className="text-xs text-cyan-400 font-medium mt-1">Grid Electricity</div>
        </div>

        {/* Scope 3 Value Chain Card */}
        <div className="glass-card p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scope 3 Value Chain</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Plane className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{scope3Emissions}</div>
          <div className="text-xs text-indigo-400 font-medium mt-1">Travel & Waste</div>
        </div>
      </div>

      {/* Visual Breakdown & Status Rollup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scope Percentage Bar Visualizer */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-gray-100">GHG Protocol Scope Breakdown Ratio</h3>

          <div className="h-6 w-full rounded-full bg-gray-900 overflow-hidden flex border border-gray-800 p-0.5">
            {totalEmissions > 0 ? (
              <>
                <div
                  style={{ width: `${(scope1Emissions / totalEmissions) * 100}%` }}
                  className="bg-amber-500 h-full rounded-l-full transition-all"
                  title={`Scope 1: ${scope1Emissions} tCO2e`}
                />
                <div
                  style={{ width: `${(scope2Emissions / totalEmissions) * 100}%` }}
                  className="bg-cyan-500 h-full transition-all"
                  title={`Scope 2: ${scope2Emissions} tCO2e`}
                />
                <div
                  style={{ width: `${(scope3Emissions / totalEmissions) * 100}%` }}
                  className="bg-indigo-500 h-full rounded-r-full transition-all"
                  title={`Scope 3: ${scope3Emissions} tCO2e`}
                />
              </>
            ) : (
              <div className="w-full bg-gray-800 h-full rounded-full" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div>
                <div className="font-semibold text-gray-200">Scope 1</div>
                <div className="text-[11px] text-gray-400 font-mono">
                  {totalEmissions > 0 ? ((scope1Emissions / totalEmissions) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-500" />
              <div>
                <div className="font-semibold text-gray-200">Scope 2</div>
                <div className="text-[11px] text-gray-400 font-mono">
                  {totalEmissions > 0 ? ((scope2Emissions / totalEmissions) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
              <div>
                <div className="font-semibold text-gray-200">Scope 3</div>
                <div className="text-[11px] text-gray-400 font-mono">
                  {totalEmissions > 0 ? ((scope3Emissions / totalEmissions) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Governance Compliance Widget */}
        <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-100 mb-2">Audit Verification Readiness</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Approved activity entries are locked for statutory ESG filings under BRSR and ISSB standard guidelines.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Approved & Locked Records
              </span>
              <span className="font-bold font-mono text-emerald-400">{approvedRecords.length}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-900 border border-gray-800">
              <span className="text-gray-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" /> Review Queue Pending
              </span>
              <span className="font-bold font-mono text-amber-400">{pendingRecords.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
