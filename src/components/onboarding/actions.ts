import type { OrganisationMatchResult } from "./organisation-match";

export interface OrganisationOnboarding {
  countryId: string;
  domainId: string;
  cityOrAuthorityId?: string;
  registrationNumber?: string;
  sectorId?: string;
  subSectorId?: string;
  website?: string;
  address?: string;
  name: string;
  profile?: Record<string, unknown>;
  facilities?: Array<{ name: string; code: string; facilityTypeId?: string; city?: string }>;
  administrators?: Array<{
    fullName: string;
    email: string;
    jobTitle?: string;
    phone?: string;
    facilityIds?: string[];
  }>;
}

export async function checkOrganisationMatchAction(query: {
  name?: string;
  registrationNumber?: string;
  authorityId?: string;
}): Promise<OrganisationMatchResult> {
  if (!query.name?.trim() && !query.registrationNumber?.trim()) {
    return { matched: false };
  }
  return {
    matched: false,
  };
}

export interface OnboardingSubmitResult {
  ok: boolean;
  organisationId?: string;
  organisationName?: string;
  applicationRef?: string | null;
  error?: string;
  fields?: Record<string, string>;
}

export async function submitOnboardingAction(
  payload: OrganisationOnboarding,
): Promise<OnboardingSubmitResult> {
  return {
    ok: true,
    organisationId: `org-${Date.now()}`,
    organisationName: payload.name,
    applicationRef: `REF-${Date.now()}`,
  };
}
