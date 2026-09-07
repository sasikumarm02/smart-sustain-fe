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
  FileSpreadsheet,
  Trash2
} from 'lucide-react';

import TabsComponent from '../../DesignLibrary/TabsComponent';
import ButtonComponent from '../../DesignLibrary/ButtonComponent';
import InputComponent from '../../DesignLibrary/InputComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';

type EntryMode = 'Manual' | 'Excel';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ENERGY_SOURCES = [
  { value: 'Electricity from public utility', label: 'Electricity from public utility' },
  { value: 'Electricity from third parties (Non-renewable)', label: 'Electricity from third parties (Non-renewable)' },
  { value: 'Electricity from third parties (Renewable)', label: 'Electricity from third parties (Renewable)' },
  { value: 'Gas', label: 'Gas' },
  { value: 'Heating', label: 'Heating' },
  { value: 'Cooling', label: 'Cooling' },
  { value: 'Steam', label: 'Steam' },
];

const UOM_OPTIONS = [
  { value: 'kWh', label: 'kWh' },
  { value: 'MWh', label: 'MWh' },
  { value: 'GJ', label: 'GJ' },
  { value: 'Therms', label: 'Therms' },
];

interface MonthlyData {
  month: string;
  quantity: string;
}

interface EnergyEntry {
  id: string;
  energySource: string;
  vehicleType?: string; // Only for Electricity for EVs if requested
  uom: string;
  monthlyData: Record<string, string>;
  attachments: File[];
}

export default function ScopeTwoForm() {
  const { user, activeFacility, currentOrg, role } = useAuth();
  const { addActivityRecord } = useEmission();
  const { factors } = useConfig();

  const [entryMode, setEntryMode] = useState<EntryMode>('Manual');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Form State
  const [entries, setEntries] = useState<EnergyEntry[]>([
    {
      id: crypto.randomUUID(),
      energySource: '',
      uom: '',
      monthlyData: MONTHS.reduce((acc, month) => ({ ...acc, [month]: '' }), {}),
      attachments: [],
    }
  ]);

  const updateEntry = (id: string, field: keyof EnergyEntry, value: any) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateMonthlyData = (id: string, month: string, value: string) => {
    setEntries(entries.map(e => {
      if (e.id === id) {
        return {
          ...e,
          monthlyData: {
            ...e.monthlyData,
            [month]: value
          }
        };
      }
      return e;
    }));
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: crypto.randomUUID(),
        energySource: '',
        uom: '',
        monthlyData: MONTHS.reduce((acc, month) => ({ ...acc, [month]: '' }), {}),
        attachments: [],
      }
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setEntries(entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, attachments: [...entry.attachments, ...newFiles] };
        }
        return entry;
      }));
    }
  };

  const removeFile = (entryId: string, fileIndex: number) => {
    setEntries(entries.map(entry => {
      if (entry.id === entryId) {
        const newAttachments = [...entry.attachments];
        newAttachments.splice(fileIndex, 1);
        return { ...entry, attachments: newAttachments };
      }
      return entry;
    }));
  };

  const handleSubmit = () => {
    // Validate
    const invalidEntry = entries.find(e => !e.energySource || !e.uom);
    if (invalidEntry) {
      setSubmitStatus('error');
      setStatusMessage('Please fill in Energy Source and UOM for all entries.');
      return;
    }

    // Submit Logic using standard contextual API
    let totalRecordsAdded = 0;

    entries.forEach(entry => {
      // Find emission factor
      const factor = factors.find(f =>
        f.category === 'Scope 2' &&
        f.name === entry.energySource &&
        f.unit === entry.uom
      );

      const factorValue = factor ? factor.factorValue : 1.5; // Default if not found for mock

      // Create a record for each month that has data
      Object.entries(entry.monthlyData).forEach(([month, value]) => {
        if (value && parseFloat(value) > 0) {
          const numValue = parseFloat(value);
          addActivityRecord({
            facilityId: activeFacility?.id || '',
            facilityName: activeFacility?.name || '',
            organisationId: currentOrg?.id || '',
            scope: 'Scope 2',
            categoryName: entry.energySource,
            activityValue: numValue,
            unit: entry.uom,
            factorApplied: factorValue,
            factorSource: factor ? 'EPA/DEFRA' : 'Custom Estimate',
            reportingPeriod: `2024-${month}`,
            submittedAt: new Date().toISOString(),
          });
          totalRecordsAdded++;
        }
      });
    });

    setSubmitStatus('success');
    setStatusMessage(`Successfully processed ${totalRecordsAdded} monthly energy records.`);

    // Reset after success
    setTimeout(() => {
      setSubmitStatus('idle');
      setStatusMessage('');
      setEntries([{
        id: crypto.randomUUID(),
        energySource: '',
        uom: '',
        monthlyData: MONTHS.reduce((acc, month) => ({ ...acc, [month]: '' }), {}),
        attachments: [],
      }]);
    }, 3000);
  };

  return (
    <PageCardComponent>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            Scope 2: Energy Consumption
          </h1>
          <p className="text-gray-400 mt-2 ml-13">Enter electricity, heating, cooling, and steam data for your facilities.</p>
        </div>

        <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setEntryMode('Manual')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${entryMode === 'Manual'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
          >
            <FileEdit className="h-4 w-4" />
            Manual Entry
          </button>
          <button
            onClick={() => setEntryMode('Excel')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${entryMode === 'Excel'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Bulk Upload
          </button>
        </div>
      </div>

      {submitStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${submitStatus === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
          {submitStatus === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {entryMode === 'Manual' ? (
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={entry.id} className="bg-gray-800/20 border border-gray-800 rounded-xl p-6 relative group transition-all hover:border-gray-700">

              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="absolute -right-3 -top-3 p-2 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Energy Source</label>
                  <SelectComponent
                    // placeholder="Select source..."
                    options={ENERGY_SOURCES}
                    value={entry.energySource}
                    onChange={(val: any) => updateEntry(entry.id, 'energySource', val)}
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-2">Unit of Measure (UOM)</label>
                  <SelectComponent
                    // placeholder="Select unit..."
                    options={UOM_OPTIONS}
                    value={entry.uom}
                    onChange={(val: any) => updateEntry(entry.id, 'uom', val)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Monthly Consumption</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {MONTHS.map(month => (
                    <InputComponent
                      key={month}
                      label={month}
                      placeholder="0.00"
                      type="number"
                      value={entry.monthlyData[month]}
                      onChange={(e) => updateMonthlyData(entry.id, month, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800/50">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Evidence Attachments</label>

                <div className="flex flex-wrap gap-3">
                  {entry.attachments.map((file, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-2 bg-gray-900/50 border border-gray-700 px-3 py-1.5 rounded-lg text-sm text-gray-300">
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => removeFile(entry.id, fIndex)} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  <label className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-emerald-500/20 transition-colors">
                    <UploadCloud className="h-4 w-4" />
                    <span>Attach Bills</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileUpload(entry.id, e)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t border-gray-800">
            <ButtonComponent
              hierarchy="secondary"
              onClick={addEntry}
              className="flex items-center gap-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            >
              <Plus className="h-4 w-4" /> Add Another Source
            </ButtonComponent>

            <div className="flex gap-3">
              <ButtonComponent hierarchy="secondary">Save Draft</ButtonComponent>
              <ButtonComponent hierarchy="primary" onClick={handleSubmit}>Submit for Review</ButtonComponent>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-800/20 rounded-xl border border-dashed border-gray-700">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-200 mb-2">Upload Excel Template</h3>
          <p className="text-gray-400 max-w-md mb-8">
            Download our standard Excel template, fill in your 12-month energy consumption data across multiple sources, and upload it here for bulk processing.
          </p>
          <div className="flex gap-4">
            <ButtonComponent hierarchy="secondary" icon={<FileSpreadsheet className="h-4 w-4" />}>
              Download Template
            </ButtonComponent>
            <ButtonComponent hierarchy="primary" icon={<UploadCloud className="h-4 w-4" />}>
              Select File to Upload
            </ButtonComponent>
          </div>
        </div>
      )}
    </PageCardComponent>
  );
}
