import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmission } from '../../context/EmissionContext';
import { CheckCircle2, AlertTriangle, ChevronDown, Check, Trash2, Link } from 'lucide-react';
import TableComponent from '../../DesignLibrary/TableComponent';
import ButtonComponent from '../../DesignLibrary/ButtonComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';
import TabsComponent from '../../DesignLibrary/TabsComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';

export const CategoryThirteenTable: React.FC<{ setActiveView?: (view: string) => void }> = ({ setActiveView }) => {
  const { activeFacility, currentOrg } = useAuth();
  const { records } = useEmission();
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [activeMainTab, setActiveMainTab] = useState('1'); // 1: Asset-specific, 2: Lessee-specific, 3: Average-data
  const [subMeterOption, setSubMeterOption] = useState<'with' | 'without'>('with');
  const [activeSubTab, setActiveSubTab] = useState('1'); // 1: Stationary, 2: Process, 3: Fugitive, 4: Energy

  // Dummy mock data for different tables based on active tabs
  const scopeThreeRecords = records.filter(
    (r) => r.scope === 'Scope 3' && r.categoryName === 'Category 13' && (r.facilityId === activeFacility?.id || r.organisationId === currentOrg?.id)
  );
  
  // Mapped data based on the screenshots provided
  const dummyDataWithSubmeter = [
    { id: '1', status: 'APPROVED', lesseeName: 'Lessee 1', fuelType: 'Biodiesel ME (from used cooking oil)', quantity: 230.00, uom: 'litres' }
  ];

  const dummyDataWithoutSubmeter = [
    { id: '1', status: 'APPROVED', fuelType: 'Aviation spirit', quantity: 200.00, uom: 'tonnes' },
    { id: '2', status: 'APPROVED', fuelType: 'Aviation turbine fuel', quantity: 200.00, uom: 'litres' },
    { id: '3', status: 'APPROVED', fuelType: 'CFC-11/R11 = trichlorofluoromethane', quantity: 1000.00, uom: 'kg' },
  ];

  const dummyDataLessee = [
    {
      id: '1', status: 'APPROVED', lesseeName: 'Lessee 1', totalEmissions: 300.00, emissionsUom: 'tCO2e',
      leasedAssetArea: 200.00, leasedAssetUom: 'Kg', totalLeasedAssetArea: 100.00, totalLeasedAssetUom: 'kg',
      downstreamKg: 600.00, downstreamT: 0.60
    }
  ];

  const dummyDataAverage = [
    { id: '1', status: 'APPROVED', lesseeName: 'Lessee 1', category: 'floor', description: 'Floor Type', quantity: 234.00, uom: 'm2' }
  ];

  const statusRender = (text: any, record: any) => (
    <span className="flex items-center gap-1.5 text-xs">
      <span className={`h-2 w-2 rounded-full ${record.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
      <span className={record.status === 'APPROVED' ? 'text-emerald-700' : 'text-amber-700'}>
        {record.status === 'APPROVED' ? 'Approved' : 'Submitted'}
      </span>
    </span>
  );

  const actionRender = (text: any, record: any) => (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
        <Check className="h-3 w-3 text-gray-400" />
      </div>
      <div className="h-6 w-6 rounded bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200">
        <Trash2 className="h-3 w-3 text-gray-400" />
      </div>
    </div>
  );

  const getColumns = () => {
    if (activeMainTab === '1') {
      if (subMeterOption === 'with') {
        return [
          { title: 'Status', dataIndex: 'status', key: 'status', render: statusRender },
          { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName' },
          { title: 'Fuel Type', dataIndex: 'fuelType', key: 'fuelType' },
          { title: 'Total Quantity', dataIndex: 'quantity', key: 'quantity', render: (val: number) => val?.toFixed(2) },
          { title: 'UOM', dataIndex: 'uom', key: 'uom' },
          { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: () => <div className="flex items-center gap-1 text-blue-600"><Link className="h-3 w-3" /> <span className="text-xs">Scre...</span></div> },
          { title: 'View More', dataIndex: 'viewMore', key: 'viewMore', render: () => <ChevronDown className="h-4 w-4 text-blue-600 cursor-pointer" /> },
          { title: 'Action', dataIndex: 'actions', key: 'actions', render: actionRender }
        ];
      } else {
        return [
          { title: 'Status', dataIndex: 'status', key: 'status', render: statusRender },
          { title: 'Fuel Type', dataIndex: 'fuelType', key: 'fuelType' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: (val: number) => val?.toFixed(2) },
          { title: 'UOM', dataIndex: 'uom', key: 'uom' },
          { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: () => <div className="flex items-center gap-1 text-blue-600"><Link className="h-3 w-3" /> <span className="text-xs">Scre...</span></div> },
          { title: 'View More', dataIndex: 'viewMore', key: 'viewMore', render: () => <ChevronDown className="h-4 w-4 text-blue-600 cursor-pointer" /> },
          { title: 'Action', dataIndex: 'actions', key: 'actions', render: actionRender }
        ];
      }
    } else if (activeMainTab === '2') {
      return [
        { title: 'Status', dataIndex: 'status', key: 'status', render: statusRender },
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName' },
        { title: "Total Lessee's Scope 1 and 2 emissions", dataIndex: 'totalEmissions', key: 'totalEmissions', render: (val: number) => val?.toFixed(2) },
        { title: 'UOM', dataIndex: 'emissionsUom', key: 'emissionsUom' },
        { title: 'Leased Assest Area/Volume/Quantity', dataIndex: 'leasedAssetArea', key: 'leasedAssetArea', render: (val: number) => val?.toFixed(2) },
        { title: 'Leased Assest UOM', dataIndex: 'leasedAssetUom', key: 'leasedAssetUom' },
        { title: 'Total Leased Assest Area/Volume/Quantity', dataIndex: 'totalLeasedAssetArea', key: 'totalLeasedAssetArea', render: (val: number) => val?.toFixed(2) },
        { title: 'Total Leased Assest UOM', dataIndex: 'totalLeasedAssetUom', key: 'totalLeasedAssetUom' },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: () => <div className="flex items-center gap-1 text-blue-600"><Link className="h-3 w-3" /> <span className="text-xs">http...</span></div> },
        { title: 'Total Downstream Leased Assets Emissions (kgCO2e)', dataIndex: 'downstreamKg', key: 'downstreamKg', render: (val: number) => val?.toFixed(2) },
        { title: 'Total Downstream Leased Assets Emissions (tCO2e)', dataIndex: 'downstreamT', key: 'downstreamT', render: (val: number) => val?.toFixed(2) },
        { title: 'View More', dataIndex: 'viewMore', key: 'viewMore', render: () => <ChevronDown className="h-4 w-4 text-blue-600 cursor-pointer" /> },
        { title: 'Action', dataIndex: 'actions', key: 'actions', render: actionRender }
      ];
    } else {
      return [
        { title: 'Status', dataIndex: 'status', key: 'status', render: statusRender },
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName' },
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: (val: number) => val?.toFixed(2) },
        { title: 'UOM', dataIndex: 'uom', key: 'uom' },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: () => <div className="flex items-center gap-1 text-blue-600"><Link className="h-3 w-3" /> <span className="text-xs">http...</span></div> },
        { title: 'View More', dataIndex: 'viewMore', key: 'viewMore', render: () => <ChevronDown className="h-4 w-4 text-blue-600 cursor-pointer" /> },
        { title: 'Action', dataIndex: 'actions', key: 'actions', render: actionRender }
      ];
    }
  };

  const getTableData = () => {
    if (activeMainTab === '1') {
      return subMeterOption === 'with' ? dummyDataWithSubmeter : dummyDataWithoutSubmeter;
    } else if (activeMainTab === '2') {
      return dummyDataLessee;
    } else {
      return dummyDataAverage;
    }
  }

  const mainTabs = [
    { key: '1', tab: 'Asset-specific Method' },
    { key: '2', tab: 'Lessee-specific Method' },
    { key: '3', tab: 'Average-data Method' }
  ];

  const subTabsWithSubMeter = [
    { key: '1', tab: 'Stationary Combustion' },
    { key: '2', tab: 'Process Emissions' },
    { key: '3', tab: 'Fugitive Emissions' },
    { key: '4', tab: 'Energy Combustion' }
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
        />
      </div>
      <button
        onClick={() => setActiveView && setActiveView('scope-three-cat13-form')}
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
        <span className="font-bold text-[#001D3D] text-lg">Scope 3</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="font-bold text-[#001D3D] text-lg">Category 13</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="text-gray-500 text-lg">Downstream Leased Assets</span>
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
            tabs={mainTabs}
            defaultActiveKey="1"
            onChange={(key) => setActiveMainTab(key)}
            tabBarExtraContent={tabBarExtra}
          />
        </div>

        <div className="p-6 pt-4 space-y-6">
          {activeMainTab === '1' && (
            <div className="space-y-6">
              {/* Radio options */}
              <div className="flex items-center gap-6">
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setSubMeterOption('with')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${subMeterOption === 'with' ? 'border-[#036323]' : 'border-gray-300'}`}>
                    {subMeterOption === 'with' && <div className="w-2 h-2 rounded-full bg-[#036323]"></div>}
                  </div>
                  <span className={`text-sm font-medium ${subMeterOption === 'with' ? 'text-gray-900' : 'text-gray-500'}`}>With Sub-Meter</span>
                </div>
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setSubMeterOption('without')}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${subMeterOption === 'without' ? 'border-[#036323]' : 'border-gray-300'}`}>
                    {subMeterOption === 'without' && <div className="w-2 h-2 rounded-full bg-[#036323]"></div>}
                  </div>
                  <span className={`text-sm font-medium ${subMeterOption === 'without' ? 'text-gray-900' : 'text-gray-500'}`}>Without Sub-Meter</span>
                </div>
              </div>

              {/* Form fields depending on subMeterOption */}
              {subMeterOption === 'with' ? (
                <div className="flex gap-8">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-800">Total Downstream Leased Assest Emission (tCO2e):</span>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 w-32 text-gray-500 text-sm">0.38853</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-800">Total Downstream Leased Assest Emission (kgCO2e):</span>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 w-32 text-gray-500 text-sm">388.53</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800">Leased Area (m²):</span>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 h-9 w-full"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800">Building's Total Area (m²):</span>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 h-9 w-full"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800">Occupancy Rate:</span>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 h-9 w-full"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-800">Utilized Occupancy Ratio:</span>
                    <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 h-9 w-full"></div>
                  </div>
                </div>
              )}

              {/* Sub-tabs if 'with' submeter */}
              {subMeterOption === 'with' && (
                <div className="border-b border-gray-100">
                  <TabsComponent
                    tabs={subTabsWithSubMeter}
                    defaultActiveKey="1"
                    onChange={(key) => setActiveSubTab(key)}
                  />
                </div>
              )}
            </div>
          )}

          <TableComponent
            data={getTableData()}
            columnHeader={getColumns()}
            enableRowSelection={false}
            noText="No records found."
          />
        </div>
      </PageCardComponent>
    </div>
  );
};
export default CategoryThirteenTable;
