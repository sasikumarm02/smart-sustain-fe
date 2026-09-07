import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmission } from '../../context/EmissionContext';
import { Zap, CheckCircle2, AlertTriangle, ListFilter } from 'lucide-react';
import TableComponent from '../../DesignLibrary/TableComponent';
import ButtonComponent from '../../DesignLibrary/ButtonComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';

export const ScopeTwoTable: React.FC = () => {
  const { activeFacility, currentOrg } = useAuth();
  const { records, submitForReview } = useEmission();
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filter records for Scope 2 only, and for the current facility/org
  const scopeTwoRecords = records.filter(
    (r) => r.scope === 'Scope 2' && (r.facilityId === activeFacility?.id || r.organisationId === currentOrg?.id)
  );

  const handleSubmitForReview = (recordId: string) => {
    const res = submitForReview(recordId);
    setFeedbackMessage({ text: res.message, type: 'success' });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const columns = [
    { title: 'Period', dataIndex: 'reportingPeriod', key: 'reportingPeriod', onFilter: true, sorter: true },
    { title: 'Category (Source)', dataIndex: 'categoryName', key: 'categoryName', onFilter: true, sorter: true },
    { 
      title: 'Activity Qty', 
      dataIndex: 'activityValue', 
      key: 'activityValue', 
      render: (text: any, record: any) => `${record.activityValue} ${record.unit}` 
    },
    { title: 'Factor Source', dataIndex: 'factorSource', key: 'factorSource' },
    { 
      title: 'Emissions (tCO₂e)', 
      dataIndex: 'calculatedEmission', 
      key: 'calculatedEmission',
      render: (text: any, record: any) => <span className="font-bold text-cyan-600">{record.calculatedEmission}</span>
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (text: any, record: any) => (
        <span className={`badge ${
          record.status === 'APPROVED' ? 'badge-emerald' : record.status === 'SUBMITTED' ? 'badge-amber' : record.status === 'REJECTED' ? 'badge-rose' : 'badge-cyan'
        }`}>
          {record.status}
        </span>
      )
    },
    { 
      title: 'Actions', 
      dataIndex: 'actions', 
      key: 'actions',
      render: (text: any, record: any) => record.status === 'DRAFT' ? (
        <ButtonComponent size="sm" hierarchy="secondary-gray" onClick={() => handleSubmitForReview(record.id)}>
          Submit
        </ButtonComponent>
      ) : null
    }
  ];

  return (
    <div className="space-y-6">
      <PageCardComponent>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-cyan-500 pl-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-1">
              <Zap className="h-4 w-4" /> Scope 2 Emissions Data
            </div>
            <h2 className="text-2xl font-bold text-gray-800 m-0">Indirect Emissions Inventory</h2>
            <p className="text-sm text-gray-500 mt-1">
              Purchased Electricity, Heat, and Steam.
            </p>
          </div>
        </div>
      </PageCardComponent>

      {feedbackMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'
        }`}>
          {feedbackMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {feedbackMessage.text}
        </div>
      )}

      <PageCardComponent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 m-0 flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-gray-400" /> Activity Records
          </h3>
        </div>

        <TableComponent 
          data={scopeTwoRecords}
          columnHeader={columns}
          enableRowSelection={false}
          noText="No Scope 2 activity data records found."
        />
      </PageCardComponent>
    </div>
  );
};
export default ScopeTwoTable;
