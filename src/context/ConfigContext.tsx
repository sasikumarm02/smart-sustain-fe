import type { EmissionFactor, ESGQuestion, AuditLogItem } from '../types/domain';
import React, { createContext, useContext, useState } from 'react';

interface ConfigContextType {
  factors: EmissionFactor[];
  questions: ESGQuestion[];
  auditLogs: AuditLogItem[];
  addAuditLog: (log: Omit<AuditLogItem, 'eventId' | 'eventTimestamp' | 'traceId'>) => void;
}

const initialFactors: EmissionFactor[] = [
  { id: 'ef-1', name: 'Diesel Stationary Fuel Combustion', category: 'Scope 1', subCategory: 'Fuel', factorValue: 2.68, unit: 'kg CO2e / Liter', source: 'UK DEFRA 2024', year: 2024 },
  { id: 'ef-2', name: 'Natural Gas Combustion', category: 'Scope 1', subCategory: 'Fuel', factorValue: 2.02, unit: 'kg CO2e / m3', source: 'IPCC AR6', year: 2023 },
  { id: 'ef-3', name: 'R410A Refrigerant Leakage', category: 'Scope 1', subCategory: 'Fugitive', factorValue: 2088.0, unit: 'kg CO2e / kg', source: 'IPCC AR6', year: 2023 },
  { id: 'ef-4', name: 'National Grid Purchased Electricity', category: 'Scope 2', subCategory: 'Electricity', factorValue: 0.584, unit: 'kg CO2e / kWh', source: 'India CEA Baseline', year: 2024 },
  { id: 'ef-5', name: 'Market-Based Renewable PPA', category: 'Scope 2', subCategory: 'Electricity', factorValue: 0.0, unit: 'kg CO2e / kWh', source: 'IPCC AR6', year: 2024 },
  { id: 'ef-6', name: 'Short-Haul Commercial Flights', category: 'Scope 3', subCategory: 'Business Travel', factorValue: 0.158, unit: 'kg CO2e / passenger-km', source: 'UK DEFRA 2024', year: 2024 },
  { id: 'ef-7', name: 'Municipal Solid Waste Landfill', category: 'Scope 3', subCategory: 'Waste', factorValue: 450.0, unit: 'kg CO2e / Tonne', source: 'US EPA', year: 2023 }
];

const initialQuestions: ESGQuestion[] = [
  { id: 'q-101', code: 'GRI-302-1', framework: 'GRI', category: 'Scope 1', questionText: 'Total energy consumption within the organization from non-renewable fuel sources (liters/kWh)?', inputType: 'NUMERIC', requiredUnit: 'Liters' },
  { id: 'q-102', code: 'ISSB-S2-E1', framework: 'ISSB', category: 'Scope 2', questionText: 'Gross location-based Scope 2 greenhouse gas emissions in metric tonnes of CO2 equivalent?', inputType: 'NUMERIC', requiredUnit: 'tCO2e' },
  { id: 'q-103', code: 'BRSR-SEC-C-P6', framework: 'BRSR', category: 'Water', questionText: 'Details of total water consumption per facility during the reporting financial year?', inputType: 'NUMERIC', requiredUnit: 'Kilo-Liters' },
  { id: 'q-104', code: 'GHG-SCOP3-C6', framework: 'GHG Protocol', category: 'Scope 3', questionText: 'Employee business travel flight distance calculations and class breakdown?', inputType: 'DOCUMENT' },
  { id: 'q-105', code: 'BRSR-SEC-A-P1', framework: 'BRSR', category: 'Governance', questionText: 'Does the organization have a dedicated ESG Steering Board oversight committee?', inputType: 'MULTIPLE_CHOICE' }
];

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [factors] = useState<EmissionFactor[]>(initialFactors);
  const [questions] = useState<ESGQuestion[]>(initialQuestions);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const addAuditLog = (log: Omit<AuditLogItem, 'eventId' | 'eventTimestamp' | 'traceId'>) => {
    const newLog: AuditLogItem = {
      ...log,
      eventId: `evt-${Date.now()}`,
      eventTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      traceId: `trc-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(10 + Math.random() * 90)}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <ConfigContext.Provider value={{ factors, questions, auditLogs, addAuditLog }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error('useConfig must be used within ConfigProvider');
  return context;
};
