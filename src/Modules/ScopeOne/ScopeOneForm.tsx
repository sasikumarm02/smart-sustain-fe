import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmission } from '../../context/EmissionContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Flame, 
  Car, 
  Factory, 
  Wind, 
  UploadCloud, 
  FileEdit, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet,
  Trash2
} from 'lucide-react';

import TabsComponent from '../../DesignLibrary/TabsComponent';
import ButtonComponent from '../../DesignLibrary/ButtonComponent';
import InputComponent from '../../DesignLibrary/InputComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';

type TabType = 'Stationary' | 'Mobile' | 'Process' | 'Fugitive';
type EntryMode = 'Manual' | 'Excel';

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'Stationary', label: 'Stationary Combustion', icon: Flame },
  { id: 'Mobile', label: 'Mobile Combustion', icon: Car },
  { id: 'Process', label: 'Process Emissions', icon: Factory },
  { id: 'Fugitive', label: 'Fugitive Emissions', icon: Wind },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ScopeOneForm: React.FC = () => {
  const { activeFacility, currentOrg, role } = useAuth();
  const { addActivityRecord } = useEmission();
  const { factors } = useConfig();

  const [activeTab, setActiveTab] = useState<TabType>('Stationary');
  const [entryMode, setEntryMode] = useState<EntryMode>('Manual');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [equipmentType, setEquipmentType] = useState('');
  const [fuelOrGas, setFuelOrGas] = useState('');
  const [uom, setUom] = useState('');
  const [monthlyData, setMonthlyData] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const scopeOneFactors = factors.filter((f) => f.category === 'Scope 1');

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

    const totalActivity = entryMode === 'Manual' ? calculateTotal() : 0; // In reality, we'd parse Excel here

    // Find the closest factor based on the selected fuel/gas (simplified for UI demonstration)
    const currentFactor = scopeOneFactors[0] || factors[0];

    const res = addActivityRecord({
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      organisationId: currentOrg.id,
      scope: 'Scope 1',
      categoryName: `${activeTab} - ${fuelOrGas || 'Bulk Upload'}`,
      activityValue: totalActivity || 1000, // Dummy value if excel
      unit: uom || currentFactor.unit.split('/')[1]?.trim() || 'Units',
      reportingPeriod: '2026-FY',
      factorApplied: currentFactor.factorValue,
      factorSource: currentFactor.source,
    });

    setFeedbackMessage({ text: res.message, type: 'success' });
    setMonthlyData({});
    setEquipmentType('');
    setFuelOrGas('');
    setUom('');
    setUploadedFile(null);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const tabItems = TABS.map(t => ({
    tab: (
      <div className="flex items-center gap-2">
        <t.icon className="h-4 w-4" /> {t.label}
      </div>
    ),
    key: t.id
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageCardComponent>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
              <Flame className="h-4 w-4" /> Scope 1 Data Ingestion
            </div>
            <h2 className="text-2xl font-bold text-gray-800 m-0">Direct Emissions Form</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage Stationary, Mobile, Process, and Fugitive emission activity data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-emerald text-xs font-mono">
              Active Facility: {activeFacility?.name}
            </span>
          </div>
        </div>
      </PageCardComponent>

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
      <PageCardComponent>
        {/* Main Tabs */}
        <div className="mb-6">
          <TabsComponent 
            tabs={tabItems} 
            defaultActiveKey={activeTab} 
            onChange={(key) => setActiveTab(key as TabType)} 
          />
        </div>

        {/* Entry Mode Toggle */}
        <div className="flex gap-4 mb-8 bg-gray-100 p-1.5 rounded-lg w-fit">
          <ButtonComponent
            hierarchy={entryMode === 'Manual' ? 'primary' : 'secondary-gray'}
            onClick={() => setEntryMode('Manual')}
            icon={<FileEdit className="h-4 w-4" />}
          >
            Manual Data Entry
          </ButtonComponent>
          <ButtonComponent
            hierarchy={entryMode === 'Excel' ? 'primary' : 'secondary-gray'}
            onClick={() => setEntryMode('Excel')}
            icon={<FileSpreadsheet className="h-4 w-4" />}
          >
            Excel Bulk Upload
          </ButtonComponent>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {entryMode === 'Manual' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Metadata Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    {activeTab === 'Mobile' ? 'Vehicle Type' : 'Equipment Type'}
                  </label>
                  <SelectComponent 
                    options={[
                      { label: 'Generator', value: 'Generator' },
                      { label: 'Boiler', value: 'Boiler' },
                      { label: 'Fleet Vehicle', value: 'Fleet Vehicle' },
                      { label: 'HVAC System', value: 'HVAC' }
                    ]}
                    value={equipmentType}
                    onChange={(v: string) => setEquipmentType(v)}
                    placeHolder="Select Type"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">
                    {activeTab === 'Stationary' || activeTab === 'Mobile' ? 'Fuel Type' : 'Gas/Refrigerant'}
                  </label>
                  <SelectComponent 
                    options={[
                      { label: 'Diesel', value: 'Diesel' },
                      { label: 'Petrol', value: 'Petrol' },
                      { label: 'Natural Gas', value: 'Natural Gas' },
                      { label: 'R-134a', value: 'R-134a' }
                    ]}
                    value={fuelOrGas}
                    onChange={(v: string) => setFuelOrGas(v)}
                    placeHolder={`Select ${activeTab === 'Stationary' || activeTab === 'Mobile' ? 'Fuel' : 'Gas'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Unit of Measure (UOM)</label>
                  <SelectComponent 
                    options={[
                      { label: 'Liters', value: 'Liters' },
                      { label: 'Gallons', value: 'Gallons' },
                      { label: 'Kg', value: 'Kg' },
                      { label: 'm³', value: 'm3' }
                    ]}
                    value={uom}
                    onChange={(v: string) => setUom(v)}
                    placeHolder="Select UOM"
                  />
                </div>
              </div>

              {/* Monthly Breakdown Grid */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Monthly Activity Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {MONTHS.map((month) => (
                    <div key={month} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{month}</label>
                      <InputComponent
                        type="number"
                        value={monthlyData[month] || ''}
                        onChange={(e: any) => handleMonthChange(month, e.target.value)}
                        placeHolder="0.00"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <div className="bg-emerald-50 border border-emerald-200 px-6 py-3 rounded-lg flex items-center gap-4">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Total Activity:</span>
                    <span className="text-xl font-bold font-mono text-emerald-600">
                      {calculateTotal().toLocaleString()} {uom || 'Units'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                  Download the template file and fill up the user details in the given format.
                </p>
                <button type="button" className="mt-2 text-emerald-600 hover:text-emerald-500 text-xs font-semibold underline underline-offset-4 transition-colors">
                  Download {activeTab} Template.xlsx
                </button>
              </div>

              <div className="relative border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl p-12 transition-all bg-gray-50 group">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-50 transition-all duration-300">
                    <UploadCloud className="h-8 w-8 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {uploadedFile ? 'File Selected' : 'Click or drag file to this area to upload'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Supports: XLSX, XLS, CSV (Max 2.5MB)</p>
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="mt-4 flex items-center justify-between p-4 bg-white border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{uploadedFile.name}</p>
                      <p className="text-[10px] text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <ButtonComponent 
                    hierarchy="secondary-gray"
                    onClick={() => setUploadedFile(null)}
                    icon={<Trash2 className="h-4 w-4" />}
                  />
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <ButtonComponent 
              hierarchy="secondary-gray"
              onClick={() => {
                setMonthlyData({});
                setEquipmentType('');
                setFuelOrGas('');
                setUom('');
                setUploadedFile(null);
              }}
            >
              Reset Form
            </ButtonComponent>
            <ButtonComponent 
              hierarchy="primary"
              htmlType="submit"
              disabled={role === 'DATA_REVIEWER' || (entryMode === 'Excel' && !uploadedFile)}
              icon={<Plus className="h-4 w-4" />}
            >
              Submit {activeTab} Data
            </ButtonComponent>
          </div>
        </form>
      </PageCardComponent>
    </div>
  );
};
export default ScopeOneForm;
