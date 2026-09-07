import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmission } from '../../context/EmissionContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Zap, 
  UploadCloud, 
  FileEdit, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet
} from 'lucide-react';

import TabsComponent from '../../DesignLibrary/TabsComponent';
import InputComponent from '../../DesignLibrary/InputComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';

type TabType = 'Energy Consumption';
type EntryMode = 'Manual' | 'Excel';

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'Energy Consumption', label: 'Energy Consumption', icon: Zap },
];

const MONTHS = [
  'May-26', 'Jun-26', 'Jul-26', 'Aug-26', 'Sep-26', 'Oct-26', 
  'Nov-26', 'Dec-26', 'Jan-27', 'Feb-27', 'Mar-27', 'Apr-27'
];

export default function ScopeTwoForm({ setActiveView }: { setActiveView?: (view: string) => void }) {
  const { activeFacility, currentOrg, role } = useAuth();
  const { addActivityRecord } = useEmission();
  const { factors } = useConfig();

  const [activeTab, setActiveTab] = useState<TabType>('Energy Consumption');
  const [entryMode, setEntryMode] = useState<EntryMode>('Manual');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [energySource, setEnergySource] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [uom, setUom] = useState('');
  const [monthlyData, setMonthlyData] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const scopeTwoFactors = factors.filter((f) => f.category === 'Scope 2');

  const handleMonthChange = (month: string, value: string) => {
    setMonthlyData(prev => ({ ...prev, [month]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const calculateTotal = () => {
    return Object.values(monthlyData).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFacility || !currentOrg) return;

    if (role === 'DATA_REVIEWER') {
      setFeedbackMessage({
        text: 'STRICT BOUNDARY GUARD: Data Reviewers are forbidden from ingesting raw activity data.',
        type: 'error',
      });
      return;
    }

    if (entryMode === 'Excel' && !uploadedFile) {
      setFeedbackMessage({ text: 'Please select an Excel file to upload.', type: 'error' });
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    const totalActivity = entryMode === 'Manual' ? calculateTotal() : 0;

    const currentFactor = scopeTwoFactors[0] || factors[0];

    const res = addActivityRecord({
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      organisationId: currentOrg.id,
      scope: 'Scope 2',
      categoryName: `${activeTab} - ${energySource || 'Bulk Upload'}`,
      activityValue: totalActivity || 2020, 
      unit: uom || currentFactor.unit.split('/')[1]?.trim() || 'kWh',
      reportingPeriod: '2026-FY',
      factorApplied: currentFactor.factorValue,
      factorSource: currentFactor.source,
    });

    setFeedbackMessage({ text: res.message, type: 'success' });
    setMonthlyData({});
    setEnergySource('');
    setVehicleType('');
    setUom('');
    setUploadedFile(null);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const tabItems = TABS.map(t => ({
    tab: <div className="px-2">{t.label}</div>,
    key: t.id
  }));

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div className="flex items-center text-sm mb-4">
        <span className="font-bold text-[#001D3D] text-lg">GHG Emission</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="font-bold text-[#001D3D] text-lg cursor-pointer hover:text-[#036323]" onClick={() => setActiveView && setActiveView('scope-two')}>Scope 2</span>
        <span className="mx-2 text-gray-400">&gt;</span>
        <span className="text-[#036323] text-lg">Form</span>
      </div>

      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          )}
          {feedbackMessage.text}
        </div>
      )}

      {/* Form Container */}
      <PageCardComponent customClass="p-8 pb-4 bg-white shadow-sm rounded-xl">
        {/* Main Tabs */}
        <div className="mb-6 border-b border-gray-100">
          <TabsComponent 
            tabs={tabItems} 
            defaultActiveKey={activeTab} 
            onChange={(key) => setActiveTab(key as TabType)} 
          />
        </div>

        {/* Entry Mode Toggle */}
        <div className="flex gap-4 mb-8 w-fit">
          <button
            type="button"
            className={`px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 ${entryMode === 'Manual' ? 'bg-[#036323] text-white' : 'bg-white text-[#036323] border border-[#036323]'}`}
            onClick={() => setEntryMode('Manual')}
          >
            <FileEdit className="h-4 w-4" /> Input Data Entry
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 ${entryMode === 'Excel' ? 'bg-[#036323] text-white' : 'bg-white text-[#036323] border border-[#036323]'}`}
            onClick={() => setEntryMode('Excel')}
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel Data Entry
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {entryMode === 'Manual' ? (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Metadata Row */}
              <div className="flex items-end gap-6 mb-8">
                <div className="w-64">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Source Of Energy*
                  </label>
                  <SelectComponent 
                    options={[
                      { label: 'Electricity from public utility', value: 'Electricity from public utility' },
                      { label: 'Electricity from third parties (Non-renewable)', value: 'Electricity from third parties (Non-renewable)' },
                      { label: 'Electricity from third parties (Renewable)', value: 'Electricity from third parties (Renewable)' },
                      { label: 'Gas', value: 'Gas' },
                    ]}
                    value={energySource}
                    onChange={(v: string) => setEnergySource(v)}
                    placeHolder=""
                  />
                </div>
                <div className="w-64">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Vehicle Type
                  </label>
                  <SelectComponent 
                    options={[
                      { label: 'EV', value: 'EV' },
                      { label: 'Hybrid', value: 'Hybrid' },
                    ]}
                    value={vehicleType}
                    onChange={(v: string) => setVehicleType(v)}
                    placeHolder=""
                  />
                </div>
                <div className="w-64">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    UOM*
                  </label>
                  <SelectComponent 
                    options={[
                      { label: 'kWh', value: 'kWh' },
                      { label: 'MWh', value: 'MWh' },
                      { label: 'GJ', value: 'GJ' },
                    ]}
                    value={uom}
                    onChange={(v: string) => setUom(v)}
                    placeHolder=""
                  />
                </div>
                <button type="button" className="bg-[#036323] hover:bg-[#024f1b] text-white h-10 w-10 rounded flex items-center justify-center transition-colors mb-0.5">
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Monthly Breakdown */}
              <div className="mb-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500 text-left">Month :</div>
                  <div className="flex flex-1 gap-2">
                    {MONTHS.map((month) => (
                      <div key={`label-${month}`} className="flex-1 text-center text-sm text-gray-500">{month}</div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500 text-left">Quantity :</div>
                  <div className="flex flex-1 gap-2">
                    {MONTHS.map((month) => (
                      <div key={`input-${month}`} className="flex-1">
                        <InputComponent
                          type="text"
                          value={monthlyData[month] || ''}
                          onChange={(e: any) => handleMonthChange(month, e.target.value)}
                          placeHolder="10000"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="flex gap-4 items-center border-t border-gray-100 pt-8">
                <div className="w-24 text-sm text-gray-500 text-left">Attachments :</div>
                <div className="flex-1">
                  <div className="border rounded-lg p-2.5 flex items-center gap-2 cursor-pointer border-gray-300 hover:border-[#036323] transition-colors w-80 text-center justify-center relative bg-white">
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv, .pdf, .png, .jpg" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <UploadCloud className="h-5 w-5 text-[#036323]" />
                    <span className="text-sm text-gray-600">Click or drag file to this area to upload</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
               <div className="relative border-2 border-dashed border-gray-300 hover:border-[#036323] rounded-2xl p-12 transition-all bg-gray-50 group">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-300">
                    <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-[#036323] transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {uploadedFile ? 'File Selected' : 'Click or drag file to this area to upload'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Supports: XLSX, XLS, CSV (Max 2.5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-12 pb-4">
            <button
              type="button"
              className="text-[#036323] font-bold text-sm px-6 py-2"
              onClick={() => setActiveView && setActiveView('scope-two')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="border border-[#036323] text-[#036323] font-bold text-sm px-6 py-2 rounded"
              onClick={() => {
                setMonthlyData({});
                setEnergySource('');
                setVehicleType('');
                setUom('');
                setUploadedFile(null);
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={role === 'DATA_REVIEWER' || (entryMode === 'Excel' && !uploadedFile)}
              className="bg-[#94a3b8] text-white font-bold text-sm px-6 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </PageCardComponent>
    </div>
  );
}
