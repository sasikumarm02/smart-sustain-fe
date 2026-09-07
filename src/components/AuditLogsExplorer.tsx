import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Search, Filter, Terminal } from 'lucide-react';

export const AuditLogsExplorer: React.FC = () => {
  const { auditLogs } = useConfig();
  const { role, currentOrg } = useAuth();

  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Security Boundary Rule: Non-Super-Admins strictly isolated to own organization
  const tenantLogs = auditLogs.filter(
    (log) => role === 'SUPER_ADMIN' || log.organisationId === currentOrg?.id
  );

  const filteredLogs = tenantLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSeverity = filterSeverity === 'ALL' || log.severity === filterSeverity;
    const matchesSearch =
      log.actorUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.traceId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="h-4 w-4" /> Regulatory Compliance Audit Engine (GET /api/v1/audit-logs)
          </div>
          <h2 className="text-2xl font-bold text-gray-100 m-0">Immutable Platform Regulatory Audit Logs</h2>
          <p className="text-sm text-gray-400 mt-1">
            Distributed trace tracking across <span className="text-gray-200 font-mono">smartsustain-identity</span>, <span className="text-gray-200 font-mono">config</span>, and <span className="text-gray-200 font-mono">emission</span> microservices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'SUPER_ADMIN' ? (
            <span className="badge badge-rose text-xs font-mono">
              SUPER_ADMIN Full Audit Access
            </span>
          ) : (
            <span className="badge badge-amber text-xs font-mono">
              Tenant Scoped: {currentOrg?.name}
            </span>
          )}
        </div>
      </div>

      {/* Filtering Bar */}
      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter trace ID, email, or action..."
            className="w-full bg-transparent text-xs text-gray-100 focus:outline-none placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-xs text-gray-200 rounded-lg p-2 focus:outline-none"
          >
            <option value="ALL">All Audit Actions</option>
            <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
            <option value="FACILITY_AUTO_PROVISIONED">FACILITY_AUTO_PROVISIONED</option>
            <option value="EMISSION_RECORD_INGESTED">EMISSION_RECORD_INGESTED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-xs text-gray-200 rounded-lg p-2 focus:outline-none"
          >
            <option value="ALL">All Event Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Logs Data Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-100">Audit Stream Records ({filteredLogs.length})</h3>
          <span className="text-xs text-gray-400 font-mono">PostgreSQL audit_log table</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900/80 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Action</th>
                <th className="p-3">Actor & Role</th>
                <th className="p-3">Microservice</th>
                <th className="p-3 font-mono">Trace ID</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500 italic font-sans">
                    No matching regulatory audit events found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.eventId} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3 text-gray-400 text-[11px]">{log.eventTimestamp}</td>
                    <td className="p-3 font-sans">
                      <span className="badge badge-cyan text-[10px]">{log.eventType}</span>
                    </td>
                    <td className="p-3 font-bold text-emerald-400">{log.action}</td>
                    <td className="p-3 font-sans text-gray-200">
                      <div>{log.actorUsername}</div>
                      <div className="text-[10px] text-gray-500">{log.actorRole}</div>
                    </td>
                    <td className="p-3 font-sans">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 text-[10px]">
                        {log.serviceName}
                      </span>
                    </td>
                    <td className="p-3 text-cyan-400 font-mono">{log.traceId}</td>
                    <td className="p-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="btn-secondary text-[11px] py-1 px-2"
                      >
                        JSON Trace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Differential View Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-6 bg-gray-900 border border-gray-700 rounded-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-emerald-400" /> Audit Log Event Differential Payload
              </h3>
              <span className="badge badge-rose font-mono">{selectedLog.eventId}</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 font-mono text-xs overflow-x-auto text-emerald-300 space-y-2">
              <pre className="m-0 text-[11px]">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedLog(null)} className="btn-secondary text-xs">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
