import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ChevronDown, Check, Trash2 } from 'lucide-react';
import TableComponent from '../../DesignLibrary/TableComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';
import TabsComponent from '../../DesignLibrary/TabsComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';

export const CategoryThreeTable: React.FC<{ setActiveView?: (view: string) => void }> = ({ setActiveView }) => {
  const [feedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('1');

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => (
        <span className="flex items-center gap-1.5 text-xs">
          <span className={`h-2 w-2 rounded-full ${record.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span className={record.status === 'APPROVED' ? 'text-emerald-700' : 'text-amber-700'}>
            {record.status === 'APPROVED' ? 'Approved' : 'Submitted'}
          </span>
        </span>
      )
    },
    { title: 'Fuel/Energy Type', dataIndex: 'type', key: 'type' },
    { title: 'Total Quantity', dataIndex: 'quantity', key: 'quantity', render: () => <span>500.00</span> },
    { title: 'UOM', dataIndex: 'uom', key: 'uom', render: () => <span>kWh</span> },
    { title: 'View More', dataIndex: 'viewMore', key: 'viewMore', render: () => <ChevronDown className="h-4 w-4 text-blue-600 cursor-pointer" /> },
    {
      title: 'Action',
      dataIndex: 'actions',
      key: 'actions',
      render: () => (
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
    { key: '1', tab: 'Upstream emissions of purchased fuels' },
    { key: '2', tab: 'Upstream emissions of purchased electricity' },
    { key: '3', tab: 'T&D losses' },
  ];

  const tabBarExtra = (
    <div className="flex items-center gap-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Facility:</span>
        <SelectComponent options={[{ value: 'Facility 1', label: 'Facility 1' }]} value="Facility 1" />
      </div>
      <button
        onClick={() => setActiveView && setActiveView('scope-three-cat3-form')}
        className="bg-[#036323] hover:bg-[#024f1b] text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1 transition-colors"
      >
        Add <span>+</span>
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm">
        <span className="font-bold text-[#001D3D] text-lg">GHG Emission</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="font-bold text-[#001D3D] text-lg">Scope 3</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="text-[#036323] text-lg">Category 3</span>
      </div>

      {feedbackMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${feedbackMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
          {feedbackMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {feedbackMessage.text}
        </div>
      )}

      <PageCardComponent customClass="p-0 overflow-hidden bg-white shadow-sm rounded-xl">
        <div className="px-6 pt-4 border-b border-gray-100">
          <TabsComponent tabs={tabs} defaultActiveKey="1" onChange={(key) => setActiveTab(key)} tabBarExtraContent={tabBarExtra} />
        </div>
        <div className="p-6 pt-2">
          <TableComponent data={[{ status: 'APPROVED', type: 'Diesel' }]} columnHeader={columns} enableRowSelection={false} noText="No activity records found." />
        </div>
      </PageCardComponent>
    </div>
  );
};
export default CategoryThreeTable;
