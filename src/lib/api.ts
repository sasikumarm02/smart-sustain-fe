export interface MasterItem {
  id: string;
  name: string;
  code?: string;
  countryId?: string;
  domainId?: string;
  sectorId?: string;
  contextLabel?: string;
}

export interface ApiError {
  message: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  fields?: Record<string, string>;
  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.fields = fields;
  }
}

export interface OrganisationOnboarding {
  name: string;
  registrationNumber?: string;
  authorityId?: string;
  countryId?: string;
  domainId?: string;
  cityOrAuthorityId?: string;
  sectorId?: string;
  subSectorId?: string;
  facilities?: any[];
  adminEmail?: string;
  adminName?: string;
  profile?: any;
  administrator?: any;
  administrators?: any[];
}

export async function listMaster(type: string): Promise<{ items: MasterItem[] }> {
  return {
    items: [
      { id: 'm-1', name: `Default ${type} 1`, code: 'DEF-1', contextLabel: 'Global' },
      { id: 'm-2', name: `Default ${type} 2`, code: 'DEF-2', contextLabel: 'Regional' }
    ]
  };
}

export async function createOrganisation(payload: any): Promise<any> {
  return { id: `org-${Date.now()}`, name: payload.name || 'New Organisation' };
}

export async function startOnboardingApplication(payload: any): Promise<any> {
  return { id: `app-${Date.now()}`, ...payload };
}

export async function submitOnboardingApplication(id: string): Promise<any> {
  return { applicationRef: `REF-${id}` };
}

export async function matchOrganisation(query: any): Promise<any> {
  return { name: query.name || 'Matched Org', sameAuthority: true };
}
