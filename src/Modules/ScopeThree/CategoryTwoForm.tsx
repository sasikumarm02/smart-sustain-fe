import React, { useState } from 'react';
import { UploadCloud, FileEdit, Plus, CheckCircle2, AlertTriangle, FileSpreadsheet, Trash2 } from 'lucide-react';
import TabsComponent from '../../DesignLibrary/TabsComponent';
import InputComponent from '../../DesignLibrary/InputComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';
import TableComponent from '../../DesignLibrary/TableComponent';

export default function CategoryTwoForm({ setActiveView }: { setActiveView?: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState('Average-data Method');
  const [entryMode, setEntryMode] = useState('Manual');
  const [data, setData] = useState<any[]>([{}]);

  const TABS = [
    { id: 'Average-data Method', label: 'Average-data Method' },
    { id: 'Spend-based Method', label: 'Spend-based Method' },
    { id: 'Supplier-specific Method', label: 'Supplier-specific Method' },
  ];
  const tabItems = TABS.map(t => ({ tab: <div className="px-2">{t.label}</div>, key: t.id }));

  const handleAddRow = () => setData([...data, {}]);
  const handleRemoveRow = (index: number) => setData(data.filter((_, i) => i !== index));

  const columns = [
    {
      title: 'Capital Good*',
      dataIndex: 'good',
      key: 'good',
      render: (text: any, record: any, rowIndex: number) => (
        <SelectComponent options={[{ label: 'Machinery', value: 'Machinery' }, { label: 'Vehicles', value: 'Vehicles' }]} value="" placeHolder="Select" />
      )
    },
    {
      title: 'UOM*',
      dataIndex: 'uom',
      key: 'uom',
      render: (text: any, record: any, rowIndex: number) => (
        <SelectComponent options={[{ label: 'Units', value: 'Units' }, { label: 'Pieces', value: 'Pieces' }]} value="" placeHolder="Select" />
      )
    },
    {
      title: 'Quantity*',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: any, record: any, rowIndex: number) => (
        <InputComponent type="number" placeHolder="Enter quantity" customClass="w-full" />
      )
    },
    {
      title: 'Month*',
      dataIndex: 'month',
      key: 'month',
      render: (text: any, record: any, rowIndex: number) => (
        <SelectComponent options={[{ label: 'May-26', value: 'May-26' }, { label: 'Jun-26', value: 'Jun-26' }]} value="" placeHolder="Select" />
      )
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      render: (text: any, record: any, rowIndex: number) => (
        <div className="flex justify-center cursor-pointer text-gray-400 hover:text-[#036323]">
          <UploadCloud className="h-5 w-5" />
        </div>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, rowIndex: number) => (
        <div className="flex justify-center cursor-pointer text-rose-400 hover:text-rose-600" onClick={() => handleRemoveRow(rowIndex)}>
          <Trash2 className="h-4 w-4" />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm mb-4">
        <span className="font-bold text-[#001D3D] text-lg">GHG Emission</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="font-bold text-[#001D3D] text-lg">Scope 3</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="font-bold text-[#001D3D] text-lg cursor-pointer hover:text-[#036323]" onClick={() => setActiveView && setActiveView('scope-three-cat2')}>Category 2</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="text-[#036323] text-lg">Form</span>
      </div>

      <PageCardComponent customClass="p-8 pb-4 bg-white shadow-sm rounded-xl">
        <div className="mb-6 border-b border-gray-100">
          <TabsComponent tabs={tabItems} defaultActiveKey={activeTab} onChange={(key) => { setActiveTab(key); setData([{}]); }} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 w-fit">
            <button type="button" className={`px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 ${entryMode === 'Manual' ? 'bg-[#036323] text-white' : 'bg-white text-[#036323] border border-[#036323]'}`} onClick={() => setEntryMode('Manual')}>
              <FileEdit className="h-4 w-4" /> Input Data Entry
            </button>
            <button type="button" className={`px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 ${entryMode === 'Excel' ? 'bg-[#036323] text-white' : 'bg-white text-[#036323] border border-[#036323]'}`} onClick={() => setEntryMode('Excel')}>
              <FileSpreadsheet className="h-4 w-4" /> Excel Data Entry
            </button>
          </div>
          {entryMode === 'Manual' && (
            <button type="button" className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 transition-colors" onClick={handleAddRow}>
              Add Row <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        {entryMode === 'Manual' ? (
          <div className="animate-in fade-in duration-500">
            <TableComponent isForm={true} data={data} columnHeader={columns} enableRowSelection={false} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="relative border-2 border-dashed border-gray-300 hover:border-[#036323] rounded-2xl p-12 transition-all bg-gray-50 group">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-300">
                  <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-[#036323] transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Click or drag file to this area to upload</p>
                  <p className="text-xs text-gray-500 mt-1">Supports: XLSX, XLS, CSV (Max 2.5MB)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-12 pb-4">
          <button type="button" className="text-[#036323] font-bold text-sm px-6 py-2" onClick={() => setActiveView && setActiveView('scope-three-cat2')}>Cancel</button>
          <button type="button" className="border border-[#036323] text-[#036323] font-bold text-sm px-6 py-2 rounded" onClick={() => setData([{}])}>Reset</button>
          <button type="button" className="bg-[#94a3b8] text-white font-bold text-sm px-6 py-2 rounded">Submit</button>
        </div>
      </PageCardComponent>
    </div>
  );
}
