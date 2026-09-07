import type { ActivityDataRecord } from '../types/domain';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmission } from '../context/EmissionContext';
import { ShieldCheck, CheckCircle, XCircle, AlertOctagon, Lock } from 'lucide-react';

export const ReviewStateMachine: React.FC = () => {
  const { user } = useAuth();
  const { records, approveRecord, rejectRecord } = useEmission();

  const [selectedRecord, setSelectedRecord] = useState<ActivityDataRecord | null>(null);
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Reviewers inspect submitted or under review records
  const pendingRecords = records.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW' || r.status === 'APPROVED' || r.status === 'REJECTED'
  );

  const handleApprove = (recordId: string) => {
    if (!user) return;
    const res = approveRecord(recordId, user.id, user.name);

    if (res.status === 'OK') {
      setFeedbackMessage({ text: res.message, type: 'success' });
      setSelectedRecord(null);
    } else {
      setFeedbackMessage({ text: res.message, type: 'error' });
    }
  };

  const handleReject = (recordId: string) => {
    if (!user) return;
    const res = rejectRecord(recordId, user.id, user.name, rejectionRemarks);

    if (res.status === 'OK') {
      setFeedbackMessage({ text: res.message, type: 'success' });
      setSelectedRecord(null);
      setRejectionRemarks('');
    } else {
      setFeedbackMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" /> State Machine & Segregation Governance (smartsustain-emission)
          </div>
          <h2 className="text-2xl font-bold text-gray-100 m-0">Centralized Data Review & Approval</h2>
          <p className="text-sm text-gray-400 mt-1">
            Validate raw activity inputs, check emission factors ($tCO_2e$), and enforce Golden Rules (No self-approval, locked when approved).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-amber text-xs font-mono">
            Pending Reviews: {records.filter((r) => r.status === 'SUBMITTED').length}
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
          {feedbackMessage.type === 'error' ? (
            <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          )}
          {feedbackMessage.text}
        </div>
      )}

      {/* Workflow Diagram Banner */}
      <div className="glass-panel p-4 flex items-center justify-around text-xs font-mono text-gray-400 border border-gray-800">
        <div className="text-center">
          <span className="badge badge-cyan">1. DRAFT</span>
          <div className="text-[10px] text-gray-500 mt-1">Data Provider entry</div>
        </div>
        <div>→</div>
        <div className="text-center">
          <span className="badge badge-amber">2. SUBMITTED</span>
          <div className="text-[10px] text-gray-500 mt-1">Locked for Reviewer</div>
        </div>
        <div>→</div>
        <div className="text-center">
          <span className="badge badge-emerald">3. APPROVED</span>
          <div className="text-[10px] text-gray-500 mt-1">Immutable GHG rollup</div>
        </div>
        <div className="text-gray-600">OR</div>
        <div className="text-center">
          <span className="badge badge-rose">REJECTED</span>
          <div className="text-[10px] text-gray-500 mt-1">Mandatory feedback</div>
        </div>
      </div>

      {/* Review Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-100 m-0">Facility Submissions Verification Queue</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Facility Name</th>
                <th className="p-3">Scope & Source</th>
                <th className="p-3">Submitted By</th>
                <th className="p-3 text-right">Calculated tCO₂e</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {pendingRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 italic">
                    No submitted emission records in review queue.
                  </td>
                </tr>
              ) : (
                pendingRecords.map((r) => {
                  const isOwnSubmission = r.submittedBy === user?.id;

                  return (
                    <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3 font-mono text-gray-400">{r.id}</td>
                      <td className="p-3 font-medium text-gray-200">{r.facilityName}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-100">{r.categoryName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">{r.scope}</div>
                      </td>
                      <td className="p-3 text-gray-400">
                        {r.submittedByName}
                        {isOwnSubmission && (
                          <span className="ml-1 text-[10px] text-amber-400 font-semibold">(You)</span>
                        )}
                      </td>
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
                        {r.status === 'SUBMITTED' ? (
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="btn-primary text-[11px] py-1 px-2.5"
                          >
                            Inspect Submission
                          </button>
                        ) : r.status === 'APPROVED' ? (
                          <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                            <Lock className="h-3 w-3" /> Locked & Approved
                          </span>
                        ) : (
                          <span className="text-[11px] text-rose-400 font-mono">
                            Rejected ({r.reviewedByName})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect & Review Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl p-6 bg-gray-900 border border-gray-700 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" /> Emission Trace Audit Inspection
              </h3>
              <span className="badge badge-amber font-mono">{selectedRecord.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Facility Scope:</span>
                <div className="font-semibold text-gray-200">{selectedRecord.facilityName}</div>
              </div>
              <div>
                <span className="text-gray-400">Ingested Period:</span>
                <div className="font-mono text-gray-200">{selectedRecord.reportingPeriod}</div>
              </div>
              <div>
                <span className="text-gray-400">Category & Scope:</span>
                <div className="font-semibold text-emerald-400">
                  {selectedRecord.categoryName} ({selectedRecord.scope})
                </div>
              </div>
              <div>
                <span className="text-gray-400">Raw Activity Value:</span>
                <div className="font-mono text-gray-200">
                  {selectedRecord.activityValue} {selectedRecord.unit}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs space-y-1">
              <div className="text-gray-400 text-[11px]">Applied Emission Factor:</div>
              <div className="text-gray-200">
                {selectedRecord.factorApplied} kg CO2e per unit ({selectedRecord.factorSource})
              </div>
              <div className="text-emerald-400 font-bold text-sm pt-1">
                Calculated Output: {selectedRecord.calculatedEmission} tCO₂e
              </div>
            </div>

            {/* Segregation Guard Warning if self submission */}
            {selectedRecord.submittedBy === user?.id && (
              <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-amber-400 shrink-0" />
                Segregation Guard Warning: You submitted this record ({selectedRecord.submittedByName}). Approving your own submission will be rejected by backend boundary guards.
              </div>
            )}

            {/* Rejection Remarks Form */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Rejection Remarks (Mandatory if rejecting - min 10 characters)
              </label>
              <textarea
                rows={2}
                value={rejectionRemarks}
                onChange={(e) => setRejectionRemarks(e.target.value)}
                placeholder="e.g. Activity value exceeds typical monthly threshold. Please re-check utility meter bill attachment."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-xs text-gray-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <button onClick={() => setSelectedRecord(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject(selectedRecord.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <XCircle className="h-4 w-4" /> Reject Submission
                </button>
                <button
                  onClick={() => handleApprove(selectedRecord.id)}
                  className="btn-primary text-xs"
                >
                  <CheckCircle className="h-4 w-4" /> Approve & Lock Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
