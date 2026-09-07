export interface MasterItem {
  id: string;
  name: string;
  domainId?: string;
  sectorId?: string;
  contextLabel?: string;
}

/** Master-data bundles used by the onboarding wizard. */
export interface OnboardingMasterData {
  countries: MasterItem[];
  domains: MasterItem[];
  cities: MasterItem[];
  sectors: MasterItem[];
  subSectors: MasterItem[];
  facilityTypes: MasterItem[];
}

export const STATIC_MASTER_DATA: OnboardingMasterData = {
  countries: [
    { id: "my", name: "Malaysia" },
    // { id: "sg", name: "Singapore" },
    // { id: "id", name: "Indonesia" },
    // { id: "th", name: "Thailand" },
    // { id: "vn", name: "Vietnam" },
    // { id: "us", name: "United States" },
    // { id: "uk", name: "United Kingdom" },
  ],
  domains: [
    { id: "airports", name: "Airports", contextLabel: "Select Airport Authority" },
    { id: "cities", name: "Cities / Municipalities", contextLabel: "Select City / Local Authority" },
    { id: "companies", name: "Individual Companies", contextLabel: "Select Operating Region / Hub" },
    { id: "other", name: "Other", contextLabel: "Select Region / Authority" },
    { id: "railways", name: "Railways / Transport", contextLabel: "Select Transit Authority" },
    { id: "seaports", name: "Seaports / Maritime", contextLabel: "Select Port Commission" },
  ],
  cities: [
    // Cities / Municipalities
    { id: "mbmb", name: "Melaka (MBMB)", domainId: "cities" },
    { id: "dbkl", name: "Kuala Lumpur (DBKL)", domainId: "cities" },
    { id: "mbpp", name: "Penang (MBPP)", domainId: "cities" },
    { id: "mbjb", name: "Johor Bahru (MBJB)", domainId: "cities" },
    { id: "mbsp", name: "Seberang Perai (MBSP)", domainId: "cities" },
    { id: "mbsa", name: "Shah Alam (MBSA)", domainId: "cities" },

    // Airports
    { id: "klia", name: "KLIA Airport Authority", domainId: "airports" },
    { id: "changi", name: "Changi Airport Group", domainId: "airports" },
    { id: "heathrow", name: "Heathrow Airport Holdings", domainId: "airports" },

    // Companies
    { id: "hq-corp", name: "HQ Corporate Division", domainId: "companies" },
    { id: "reg-hub", name: "APAC Regional Hub", domainId: "companies" },

    // Railways
    { id: "prasarana", name: "Prasarana Malaysia", domainId: "railways" },
    { id: "ktmb", name: "KTMB Railway Authority", domainId: "railways" },

    // Seaports
    { id: "port-klang", name: "Port Klang Authority", domainId: "seaports" },
    { id: "penang-port", name: "Penang Port Commission", domainId: "seaports" },

    // Other
    { id: "general-auth", name: "General Local Authority", domainId: "other" },
  ],
  sectors: [
    { id: "manufacturing", name: "Manufacturing" },
    { id: "services", name: "Services" },
    { id: "energy", name: "Energy & Utilities" },
    { id: "transportation", name: "Transportation & Logistics" },
    { id: "real-estate", name: "Real Estate & Construction" },
    { id: "public-sector", name: "Public Sector & Local Government" },
  ],
  subSectors: [
    { id: "electronics", name: "Electronics & Semiconductor", sectorId: "manufacturing" },
    { id: "chemicals", name: "Chemicals & Materials", sectorId: "manufacturing" },
    { id: "automotive", name: "Automotive & Parts", sectorId: "manufacturing" },

    { id: "it-telecom", name: "IT & Telecommunications", sectorId: "services" },
    { id: "financial", name: "Financial Services", sectorId: "services" },

    { id: "renewable", name: "Renewable Energy", sectorId: "energy" },
    { id: "power-gen", name: "Power Generation & Distribution", sectorId: "energy" },

    { id: "freight", name: "Freight & Logistics", sectorId: "transportation" },

    { id: "commercial-re", name: "Commercial Real Estate", sectorId: "real-estate" },

    { id: "municipal-gov", name: "Municipal Administration", sectorId: "public-sector" },
  ],
  facilityTypes: [
    { id: "office", name: "Office / Headquarters" },
    { id: "manufacturing-plant", name: "Manufacturing Plant" },
    { id: "warehouse", name: "Warehouse & Distribution Center" },
    { id: "data-center", name: "Data Center" },
    { id: "retail", name: "Retail Outlet / Branch" },
    { id: "lab", name: "R&D Laboratory" },
  ],
};

/** One editable facility row in wizard step 3. */
export interface FacilityRow {
  key: string;
  name: string;
  code: string;
  facilityTypeId: string;
  city: string;
}

/** One editable administrator row in wizard step 4. */
export interface AdminRow {
  key: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  facilityIds: string[];
}

export type FacilitiesMode = "single" | "multiple" | "later";

