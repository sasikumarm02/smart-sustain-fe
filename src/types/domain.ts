export interface CommonResponse<T = any> {
  status: string;
  response: {
    action: string;
    data: T;
  };
  message: string;
}

export type UserRole = 'SUPER_ADMIN' | 'DATA_PROVIDER' | 'DATA_REVIEWER';

export interface Organisation {
  id: string;
  name: string;
  code: string;
  country: string;
  role: UserRole;
  facilitiesCount: number;
}

export interface Facility {
  id: string;
  organisationId: string;
  name: string;
  code: string;
  type: 'HEADQUARTERS' | 'SOLAR_PLANT' | 'FACTORY' | 'WAREHOUSE' | 'REGIONAL_OFFICE';
  country: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedReviewerId?: string;
  assignedReviewerName?: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  currentOrganisationId: string;
  activeFacilityId: string;
  role: UserRole;
  organisations: Organisation[];
  facilities: Facility[];
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: 'Scope 1' | 'Scope 2' | 'Scope 3';
  subCategory: string;
  factorValue: number;
  unit: string;
  source: 'IPCC AR6' | 'UK DEFRA 2024' | 'India CEA Baseline' | 'US EPA';
  year: number;
}

export interface ESGQuestion {
  id: string;
  code: string;
  framework: 'GRI' | 'ISSB' | 'BRSR' | 'GHG Protocol';
  category: 'Scope 1' | 'Scope 2' | 'Scope 3' | 'Water' | 'Waste' | 'Social' | 'Governance';
  questionText: string;
  inputType: 'NUMERIC' | 'TEXT' | 'MULTIPLE_CHOICE' | 'DOCUMENT';
  requiredUnit?: string;
}

export type ReviewStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface ActivityDataRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  organisationId: string;
  scope: 'Scope 1' | 'Scope 2' | 'Scope 3';
  categoryName: string; // e.g. Diesel Fuel, Purchased Grid Electricity, Flights
  activityValue: number;
  unit: string;
  reportingPeriod: string; // e.g. "2026-08"
  factorApplied: number;
  factorSource: string;
  calculatedEmission: number; // tCO2e
  status: ReviewStatus;
  submittedBy: string;
  submittedByName: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionRemarks?: string;
}

export interface AuditLogItem {
  eventId: string;
  eventTimestamp: string;
  eventType: 'AUTHENTICATION' | 'DATA_MUTATION' | 'SECURITY_EVENT' | 'ORGANISATION_LIFECYCLE' | 'SYSTEM_EVENT';
  action: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  actorId: string;
  actorUsername: string;
  actorRole: UserRole;
  organisationId: string;
  entityType: string;
  entityId: string;
  traceId: string;
  serviceName: 'smartsustain-identity' | 'smartsustain-config' | 'smartsustain-emission';
  status: 'SUCCESS' | 'FAILURE';
  oldValues?: any;
  newValues?: any;
}
