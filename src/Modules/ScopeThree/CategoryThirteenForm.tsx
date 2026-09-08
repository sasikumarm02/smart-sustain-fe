import React, { useState } from 'react';
import { UploadCloud, FileEdit, Plus, CheckCircle2, AlertTriangle, FileSpreadsheet, Trash2 } from 'lucide-react';
import TabsComponent from '../../DesignLibrary/TabsComponent';
import InputComponent from '../../DesignLibrary/InputComponent';
import SelectComponent from '../../DesignLibrary/SelectComponent';
import PageCardComponent from '../../DesignLibrary/PageCardComponent';
import TableComponent from '../../DesignLibrary/TableComponent';

export const CategoryThirteenForm: React.FC<{ setActiveView?: (view: string) => void }> = ({ setActiveView }) => {
    const [activeTab, setActiveTab] = useState('Asset-specific Method');
    const [subActiveTab, setSubActiveTab] = useState('Stationary Combustion');
    const [subMeter, setSubMeter] = useState('With Sub-Meter');
    const [entryMode, setEntryMode] = useState('Manual');
    const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Data States
    const [stationaryData, setStationaryData] = useState<any[]>([{}]);
    const [processData, setProcessData] = useState<any[]>([{}]);
    const [fugitiveData, setFugitiveData] = useState<any[]>([{}]);
    const [energyData, setEnergyData] = useState<any[]>([{}]);
    const [withoutSubData, setWithoutSubData] = useState<any[]>([{}]);
    const [lesseeData, setLesseeData] = useState<any[]>([{}]);
    const [averageData, setAverageData] = useState<any[]>([{}]);

    // Metadata States for "Without Sub-Meter"
    const [leasedArea, setLeasedArea] = useState('');
    const [buildingArea, setBuildingArea] = useState('');
    const [occupancyRate, setOccupancyRate] = useState('');

    const TABS = [
        { id: 'Asset-specific Method', label: 'Asset-specific Method' },
        { id: 'Lessee-specific Method', label: 'Lessee-specific Method' },
        { id: 'Average-data Method', label: 'Average-data Method' },
    ];
    const tabItems = TABS.map(t => ({ tab: <div className="px-2">{t.label}</div>, key: t.id }));

    const SUB_TABS = [
        { id: 'Stationary Combustion', label: 'Stationary Combustion' },
        { id: 'Process Emissions', label: 'Process Emissions' },
        { id: 'Fugitive Emissions', label: 'Fugitive Emissions' },
        { id: 'Energy Consumption', label: 'Energy Consumption' },
    ];
    const subTabItems = SUB_TABS.map(t => ({ tab: <div className="px-2">{t.label}</div>, key: t.id }));

    // Handlers
    const handleAddRow = () => {
        if (activeTab === 'Asset-specific Method') {
            if (subMeter === 'With Sub-Meter') {
                if (subActiveTab === 'Stationary Combustion') setStationaryData([...stationaryData, {}]);
                if (subActiveTab === 'Process Emissions') setProcessData([...processData, {}]);
                if (subActiveTab === 'Fugitive Emissions') setFugitiveData([...fugitiveData, {}]);
                if (subActiveTab === 'Energy Consumption') setEnergyData([...energyData, {}]);
            } else {
                setWithoutSubData([...withoutSubData, {}]);
            }
        } else if (activeTab === 'Lessee-specific Method') {
            setLesseeData([...lesseeData, {}]);
        } else if (activeTab === 'Average-data Method') {
            setAverageData([...averageData, {}]);
        }
    };

    const handleRemoveRow = (index: number) => {
        if (activeTab === 'Asset-specific Method') {
            if (subMeter === 'With Sub-Meter') {
                if (subActiveTab === 'Stationary Combustion') setStationaryData(stationaryData.filter((_, i) => i !== index));
                if (subActiveTab === 'Process Emissions') setProcessData(processData.filter((_, i) => i !== index));
                if (subActiveTab === 'Fugitive Emissions') setFugitiveData(fugitiveData.filter((_, i) => i !== index));
                if (subActiveTab === 'Energy Consumption') setEnergyData(energyData.filter((_, i) => i !== index));
            } else {
                setWithoutSubData(withoutSubData.filter((_, i) => i !== index));
            }
        } else if (activeTab === 'Lessee-specific Method') {
            setLesseeData(lesseeData.filter((_, i) => i !== index));
        } else if (activeTab === 'Average-data Method') {
            setAverageData(averageData.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = () => {
        setFeedbackMessage({ text: 'Data added successfully', type: 'success' });
        setTimeout(() => {
            setFeedbackMessage(null);
            if (setActiveView) setActiveView('scope-three-cat13');
        }, 2000);
    };

    const handleReset = () => {
        setStationaryData([{}]);
        setProcessData([{}]);
        setFugitiveData([{}]);
        setEnergyData([{}]);
        setWithoutSubData([{}]);
        setLesseeData([{}]);
        setAverageData([{}]);
        setLeasedArea('');
        setBuildingArea('');
        setOccupancyRate('');
    };

    // Shared Column Renderers
    const renderInput = (placeHolder: string) => (text: any, record: any, rowIndex: number) => (
        <InputComponent type="text" placeHolder={placeHolder} customClass="w-full" />
    );

    const renderSelect = (options: {label: string, value: string}[]) => (text: any, record: any, rowIndex: number) => (
        <SelectComponent options={options} value="" placeHolder="Select" />
    );

    const renderUpload = (text: any, record: any, rowIndex: number) => (
        <div className="flex justify-center cursor-pointer text-blue-500 hover:text-blue-700">
            <UploadCloud className="h-5 w-5" />
        </div>
    );

    const renderAction = (text: any, record: any, rowIndex: number) => (
        <div className="flex justify-center cursor-pointer text-rose-400 hover:text-rose-600" onClick={() => handleRemoveRow(rowIndex)}>
            <Trash2 className="h-4 w-4" />
        </div>
    );

    const uomOptions = [{ label: 'tCO₂e', value: 'tCO₂e' }, { label: 'kgCO₂e', value: 'kgCO₂e' }, { label: 'Liters', value: 'Liters' }];
    const fuelOptions = [{ label: 'Diesel', value: 'Diesel' }, { label: 'Petrol', value: 'Petrol' }, { label: 'Natural Gas', value: 'Natural Gas' }];

    // Column Definitions
    const stationaryCols = [
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName', render: renderInput('Name') },
        { title: 'Fuel Type', dataIndex: 'fuelType', key: 'fuelType', render: renderSelect(fuelOptions) },
        { title: 'Total Quantity', dataIndex: 'quantity', key: 'quantity', render: renderInput('Quantity') },
        { title: 'UOM', dataIndex: 'uom', key: 'uom', render: renderSelect(uomOptions) },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: renderUpload },
        { title: 'Action', dataIndex: 'action', key: 'action', render: renderAction },
    ];

    const processCols = [
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName', render: renderInput('Name') },
        { title: 'Equipment Type', dataIndex: 'equipmentType', key: 'equipmentType', render: renderInput('Equipment') },
        { title: 'Gas/Refrigerant', dataIndex: 'gas', key: 'gas', render: renderSelect([{label: 'HFC-134a', value: 'HFC-134a'}]) },
        { title: 'Total Quantity', dataIndex: 'quantity', key: 'quantity', render: renderInput('Quantity') },
        { title: 'UOM', dataIndex: 'uom', key: 'uom', render: renderSelect(uomOptions) },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: renderUpload },
        { title: 'Action', dataIndex: 'action', key: 'action', render: renderAction },
    ];

    const energyCols = [
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName', render: renderInput('Name') },
        { title: 'Source of Energy', dataIndex: 'source', key: 'source', render: renderSelect([{label: 'Electricity', value: 'Electricity'}]) },
        { title: 'Vehicle Type', dataIndex: 'vehicle', key: 'vehicle', render: renderSelect([{label: 'Car', value: 'Car'}]) },
        { title: 'Total Quantity', dataIndex: 'quantity', key: 'quantity', render: renderInput('Quantity') },
        { title: 'UOM', dataIndex: 'uom', key: 'uom', render: renderSelect(uomOptions) },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: renderUpload },
        { title: 'Action', dataIndex: 'action', key: 'action', render: renderAction },
    ];

    const withoutSubCols = [
        { title: 'Fuel Type', dataIndex: 'fuelType', key: 'fuelType', render: renderSelect(fuelOptions) },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: renderInput('Quantity') },
        { title: 'UOM', dataIndex: 'uom', key: 'uom', render: renderSelect(uomOptions) },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: renderUpload },
        { title: 'Action', dataIndex: 'action', key: 'action', render: renderAction },
    ];

    const lesseeCols = [
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName', render: renderInput('Name') },
        { title: "Total Lessee's Scope 1 & 2 Emissions", dataIndex: 'scope12', key: 'scope12', render: renderInput('Emissions') },
        { title: 'UOM', dataIndex: 'uom1', key: 'uom1', render: renderSelect(uomOptions) },
        { title: 'Leased Asset Area/Vol/Qty', dataIndex: 'leasedArea', key: 'leasedArea', render: renderInput('Area') },
        { title: 'Leased Asset UOM', dataIndex: 'uom2', key: 'uom2', render: renderSelect(uomOptions) },
        { title: 'Total Leased Asset Area/Vol/Qty', dataIndex: 'totalLeasedArea', key: 'totalLeasedArea', render: renderInput('Area') },
        { title: 'Total Leased Asset UOM', dataIndex: 'uom3', key: 'uom3', render: renderSelect(uomOptions) },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: renderUpload },
        { title: 'Action', dataIndex: 'action', key: 'action', render: renderAction },
    ];

    const averageCols = [
        { title: 'Lessee Name', dataIndex: 'lesseeName', key: 'lesseeName', render: renderInput('Name') },
        { title: 'Category', dataIndex: 'category', key: 'category', render: renderSelect([{label: 'Floor Space', value: 'Floor Space'}]) },
        { title: 'Description', dataIndex: 'description', key: 'description', render: renderInput('Description') },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', render: renderInput('Quantity') },
        { title: 'UOM', dataIndex: 'uom', key: 'uom', render: renderSelect(uomOptions) },
        { title: 'Disclosure', dataIndex: 'disclosure', key: 'disclosure', render: renderUpload },
        { title: 'Action', dataIndex: 'action', key: 'action', render: renderAction },
    ];

    const getActiveColumns = () => {
        if (activeTab === 'Lessee-specific Method') return lesseeCols;
        if (activeTab === 'Average-data Method') return averageCols;
        if (subMeter === 'Without Sub-Meter') return withoutSubCols;
        if (subActiveTab === 'Process Emissions') return processCols;
        if (subActiveTab === 'Fugitive Emissions') return processCols; // Identical structure for now
        if (subActiveTab === 'Energy Consumption') return energyCols;
        return stationaryCols;
    };

    const getActiveData = () => {
        if (activeTab === 'Lessee-specific Method') return lesseeData;
        if (activeTab === 'Average-data Method') return averageData;
        if (subMeter === 'Without Sub-Meter') return withoutSubData;
        if (subActiveTab === 'Process Emissions') return processData;
        if (subActiveTab === 'Fugitive Emissions') return fugitiveData;
        if (subActiveTab === 'Energy Consumption') return energyData;
        return stationaryData;
    };

    return (
        <div className="space-y-4">
            {/* Page Title */}
            <div className="flex items-center text-sm mb-4">
                <span className="font-bold text-[#001D3D] text-lg">GHG Emission</span>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="font-bold text-[#001D3D] text-lg">Scope 3</span>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="font-bold text-[#001D3D] text-lg cursor-pointer hover:text-[#036323]" onClick={() => setActiveView && setActiveView('scope-three-cat13')}>Category 13</span>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="font-bold text-[#001D3D] text-lg">Downstream Leased Assets</span>
                <span className="mx-2 text-gray-400">&gt;</span>
                <span className="text-[#036323] text-lg">Form</span>
            </div>

            {feedbackMessage && (
                <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    {feedbackMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <AlertTriangle className="h-4 w-4 text-rose-600" />}
                    {feedbackMessage.text}
                </div>
            )}

            <PageCardComponent customClass="p-8 pb-4 bg-white shadow-sm rounded-xl">
                {/* Main Tabs */}
                <div className="mb-6 border-b border-gray-100">
                    <TabsComponent tabs={tabItems} defaultActiveKey={activeTab} onChange={(key) => setActiveTab(key)} />
                </div>

                {activeTab === 'Asset-specific Method' && (
                    <div className="flex gap-6 mb-6 mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={subMeter === 'With Sub-Meter'} onChange={() => setSubMeter('With Sub-Meter')} className="w-4 h-4 text-[#036323] focus:ring-[#036323] cursor-pointer" />
                            <span className={`font-semibold ${subMeter === 'With Sub-Meter' ? 'text-[#036323]' : 'text-gray-500'}`}>With Sub-Meter</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={subMeter === 'Without Sub-Meter'} onChange={() => setSubMeter('Without Sub-Meter')} className="w-4 h-4 text-[#036323] focus:ring-[#036323] cursor-pointer" />
                            <span className={`font-semibold ${subMeter === 'Without Sub-Meter' ? 'text-[#036323]' : 'text-gray-500'}`}>Without Sub-Meter</span>
                        </label>
                    </div>
                )}

                {/* Metadata Fields for Without Sub-Meter */}
                {activeTab === 'Asset-specific Method' && subMeter === 'Without Sub-Meter' && (
                    <div className="grid grid-cols-3 gap-6 mb-8 mt-6">
                        <div>
                            <label className="block text-xs font-bold text-[#001D3D] mb-2">Leased Area (m²):</label>
                            <InputComponent type="number" value={leasedArea} onChange={(e: any) => setLeasedArea(e.target.value)} placeHolder="" customClass="w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#001D3D] mb-2">Building's Total Area (m²):</label>
                            <InputComponent type="number" value={buildingArea} onChange={(e: any) => setBuildingArea(e.target.value)} placeHolder="" customClass="w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#001D3D] mb-2">Occupancy Rate:</label>
                            <InputComponent type="number" value={occupancyRate} onChange={(e: any) => setOccupancyRate(e.target.value)} placeHolder="" customClass="w-full" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#001D3D] mb-2">Utilized Occupancy Ratio:</label>
                            <InputComponent type="number" value="" disabled={true} placeHolder="" customClass="w-full bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#001D3D] mb-2">Total Emissions<br/>(Scope 1 + Scope 2):</label>
                            <InputComponent type="number" value="0" disabled={true} placeHolder="0" customClass="w-full bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#001D3D] mb-2">Total Emissions from<br/>Downstream Leased Assets (kgCO₂e):</label>
                            <InputComponent type="number" value="0" disabled={true} placeHolder="0" customClass="w-full bg-gray-50" />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6 mt-4">
                    <div className="flex gap-4 w-fit">
                        <button type="button" className={`px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 ${entryMode === 'Manual' ? 'bg-[#036323] text-white' : 'bg-white text-[#036323] border border-[#036323]'}`} onClick={() => setEntryMode('Manual')}>
                            <FileEdit className="h-4 w-4" /> Input Data Entry
                        </button>
                    </div>
                    {entryMode === 'Manual' && (
                        <button type="button" className="border border-gray-300 hover:bg-gray-50 text-[#0f172a] px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 transition-colors" onClick={handleAddRow}>
                            Add Row
                        </button>
                    )}
                </div>

                {activeTab === 'Asset-specific Method' && subMeter === 'With Sub-Meter' && (
                    <div className="mb-6 border-b border-gray-100">
                        <TabsComponent tabs={subTabItems} defaultActiveKey={subActiveTab} onChange={(key) => setSubActiveTab(key)} />
                    </div>
                )}

                {entryMode === 'Manual' ? (
                    <div className="animate-in fade-in duration-500">
                        <TableComponent isForm={true} data={getActiveData()} columnHeader={getActiveColumns()} enableRowSelection={false} showOnlyCount={true} />
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
                    <button type="button" className="border border-[#036323] text-[#036323] font-bold text-sm px-6 py-2 rounded" onClick={handleReset}>Reset</button>
                    <button type="button" className="bg-[#94a3b8] hover:bg-[#8395a7] text-white font-bold text-sm px-6 py-2 rounded transition-colors" onClick={handleSubmit}>Submit</button>
                </div>
            </PageCardComponent>
        </div>
    );
};

export default CategoryThirteenForm;
