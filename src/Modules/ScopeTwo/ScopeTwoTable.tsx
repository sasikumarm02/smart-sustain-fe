import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmission } from '../../context/EmissionContext';
import { CheckCircle2, AlertTriangle, ChevronDown, Check, Trash2 } from 'lucide-react';
import TableComponent from '../../DesignLibrary/TableComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';
import TabsComponent from '../../DesignLibrary/TabsComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';

export const ScopeTwoTable: React.FC<{ setActiveView?: (view: string) => void }> = ({ setActiveView }) => {
  const { activeFacility, currentOrg } = useAuth();
  const { records } = useEmission();
  const [feedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('1');

  // Filter records for Scope 2 only, and for the current facility/org
  const scopeTwoRecords = records.filter(
    (r) => r.scope === 'Scope 2' && (r.facilityId === activeFacility?.id || r.organisationId === currentOrg?.id)
  );

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <span className="flex items-center gap-1.5 text-xs">
          <span className={`h-2 w-2 rounded-full ${record.status === 'APPROVED' ? 'bg-emerald-500' : record.status === 'SUBMITTED' ? 'bg-amber-500' : record.status === 'REJECTED' ? 'bg-rose-500' : 'bg-cyan-500'}`}></span>
          <span className={record.status === 'APPROVED' ? 'text-emerald-700' : record.status === 'SUBMITTED' ? 'text-amber-700' : record.status === 'REJECTED' ? 'text-rose-700' : 'text-cyan-700'}>
            {record.status === 'APPROVED' ? 'Approved' : record.status === 'DRAFT' ? 'Draft' : record.status === 'SUBMITTED' ? 'Submitted' : 'Rejected'}
          </span>
        </span>
      )
    },
    { title: 'Source Of Energy', dataIndex: 'categoryName', key: 'categoryName' },
    { title: 'Vehicle Type', dataIndex: 'vehicleType', key: 'vehicleType' },
    {
      title: 'Total Quantity',
      dataIndex: 'activityValue',
      key: 'activityValue',
      render: (text: any, record: any) => <span>{(record.activityValue || 2020).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    },
    {
      title: 'UOM',
      dataIndex: 'unit',
      key: 'unit',
      render: (text: any, record: any) => <span>{record.unit || 'kWh'}</span>
    },
    {
      title: 'View More',
      dataIndex: 'viewMore',
      key: 'viewMore',
      render: () => <ChevronDown className="h-4 w-4 text-blue-600 cursor-pointer" />
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
            <Check className="h-3 w-3 text-gray-400" />
          </div>
          <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
            <Trash2 className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      )
    }
  ];

  const tabs = [
    { key: '1', tab: 'Energy Consumption' },
  ];

  const facilityOptions = [
    { value: 'Facility 1', label: 'Facility 1' },
    { value: 'Facility 2', label: 'Facility 2' }
  ];

  const tabBarExtra = (
    <div className="flex items-center gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Facility:</span>
        <SelectComponent
          options={facilityOptions}
          value="Facility 1"
        // customClass="w-32 h-8"
        />
      </div>
      <button
        onClick={() => setActiveView && setActiveView('scope-two-form')}
        className="bg-[#036323] hover:bg-[#024f1b] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-colors"
      >
        Add <span>+</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="flex items-center text-sm">
        <span className="font-bold text-[#001D3D] text-lg">GHG Emission</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="text-[#036323] text-lg">Scope 2</span>
      </div>

      {feedbackMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${feedbackMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
          {feedbackMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {feedbackMessage.text}
        </div>
      )}

      {/* Main Card with Tabs and Table */}
      <PageCardComponent customClass="p-0 overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="px-6 pt-4 border-b border-gray-100">
          <TabsComponent
            tabs={tabs}
            defaultActiveKey="1"
            onChange={(key) => setActiveTab(key)}
            tabBarExtraContent={tabBarExtra}
          />
        </div>

        <div className="p-6 pt-2">
          <TableComponent
            data={scopeTwoRecords}
            columnHeader={columns}
            enableRowSelection={false}
            noText="No activity records found for this category."
          />
        </div>
      </PageCardComponent>
    </div>
  );
};
export default ScopeTwoTable;
