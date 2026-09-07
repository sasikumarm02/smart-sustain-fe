import type { UserSession, UserRole, Organisation, Facility, CommonResponse } from '../types/domain';
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: UserSession | null;
  currentOrg: Organisation | null;
  activeFacility: Facility | null;
  role: UserRole;
  switchOrganisation: (orgId: string) => CommonResponse<UserSession>;
  setActiveFacilityId: (facilityId: string) => void;
  updateUserRole: (newRole: UserRole) => void;
  addFacilityToOrg: (facility: Facility) => void;
  assignReviewerToFacility: (facilityId: string, reviewerId: string, reviewerName: string) => void;
  logout: () => void;
}

const initialOrganisations: Organisation[] = [
  {
    id: 'org-001',
    name: 'MindGraph Solutions Org',
    code: 'MIND-ORG',
    country: 'Malaysia',
    role: 'DATA_PROVIDER',
    facilitiesCount: 3,
  },
  {
    id: 'org-002',
    name: 'EcoEnergy Renewables Corp',
    code: 'ECO-RENEW',
    country: 'Singapore',
    role: 'DATA_REVIEWER',
    facilitiesCount: 2,
  },
  {
    id: 'org-003',
    name: 'Global Heavy Industries',
    code: 'GLOB-IND',
    country: 'Germany',
    role: 'SUPER_ADMIN',
    facilitiesCount: 4,
  }
];

const initialFacilities: Record<string, Facility[]> = {
  'org-001': [
    {
      id: 'fac-101',
      organisationId: 'org-001',
      name: 'MindGraph Solutions Org - Main HQ Facility',
      code: 'MIND-FAC-4A1B',
      type: 'HEADQUARTERS',
      country: 'Malaysia',
      status: 'ACTIVE',
      assignedReviewerId: 'usr-rev-9',
      assignedReviewerName: 'Sarah Jenkins (Eco Lead)',
    },
    {
      id: 'fac-102',
      organisationId: 'org-001',
      name: 'Cyberjaya Solar Plant Alpha',
      code: 'MIND-FAC-9F82',
      type: 'SOLAR_PLANT',
      country: 'Malaysia',
      status: 'ACTIVE',
    },
    {
      id: 'fac-103',
      organisationId: 'org-001',
      name: 'Penang Manufacturing Logistics',
      code: 'MIND-FAC-3D4C',
      type: 'WAREHOUSE',
      country: 'Malaysia',
      status: 'ACTIVE',
    }
  ],
  'org-002': [
    {
      id: 'fac-201',
      organisationId: 'org-002',
      name: 'EcoEnergy Renewables Corp - Main HQ Facility',
      code: 'ECO-FAC-0A1C',
      type: 'HEADQUARTERS',
      country: 'Singapore',
      status: 'ACTIVE',
    },
    {
      id: 'fac-202',
      organisationId: 'org-002',
      name: 'Jurong Island Bio-Refinery',
      code: 'ECO-FAC-7721',
      type: 'FACTORY',
      country: 'Singapore',
      status: 'ACTIVE',
    }
  ],
  'org-003': [
    {
      id: 'fac-301',
      organisationId: 'org-003',
      name: 'Global Heavy Industries - Main HQ Facility',
      code: 'GLOB-FAC-8812',
      type: 'HEADQUARTERS',
      country: 'Germany',
      status: 'ACTIVE',
    }
  ]
};

const defaultSession: UserSession = {
  id: 'usr-curr-100',
  email: 'sustain.admin@mindgraph.com',
  name: 'Sudhir Kumar (ESG Officer)',
  currentOrganisationId: 'org-001',
  activeFacilityId: 'fac-101',
  role: 'DATA_PROVIDER',
  organisations: initialOrganisations,
  facilities: initialFacilities['org-001'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession>(defaultSession);
  const [facilitiesMap, setFacilitiesMap] = useState<Record<string, Facility[]>>(initialFacilities);

  const currentOrg = session.organisations.find((o) => o.id === session.currentOrganisationId) || session.organisations[0];
  const currentOrgFacilities = facilitiesMap[session.currentOrganisationId] || [];
  const activeFacility = currentOrgFacilities.find((f) => f.id === session.activeFacilityId) || currentOrgFacilities[0] || null;

  const switchOrganisation = (targetOrgId: string): CommonResponse<UserSession> => {
    const targetOrg = session.organisations.find((o) => o.id === targetOrgId);
    if (!targetOrg) {
      return {
        status: 'BAD_REQUEST',
        response: { action: 'SwitchOrganisationFailure', data: session },
        message: `User does not belong to target organisation context: ${targetOrgId}`,
      };
    }

    let targetFacilities = facilitiesMap[targetOrgId] || [];

    if (targetFacilities.length === 0) {
      const defaultFacility: Facility = {
        id: `fac-${Date.now()}`,
        organisationId: targetOrg.id,
        name: `${targetOrg.name} - Main HQ Facility`,
        code: `${targetOrg.code.substring(0, 4)}-FAC-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
        type: 'HEADQUARTERS',
        country: targetOrg.country,
        status: 'ACTIVE',
      };
      targetFacilities = [defaultFacility];
      setFacilitiesMap((prev) => ({ ...prev, [targetOrgId]: targetFacilities }));
    }

    const updatedSession: UserSession = {
      ...session,
      currentOrganisationId: targetOrg.id,
      activeFacilityId: targetFacilities[0].id,
      role: targetOrg.role,
      facilities: targetFacilities,
    };

    setSession(updatedSession);

    return {
      status: 'OK',
      response: {
        action: 'SwitchOrganisationSuccess',
        data: updatedSession,
      },
      message: `Successfully switched active organisation context to ${targetOrg.name}. JWT token claims re-issued.`,
    };
  };

  const setActiveFacilityId = (facilityId: string) => {
    setSession((prev) => ({ ...prev, activeFacilityId: facilityId }));
  };

  const updateUserRole = (newRole: UserRole) => {
    setSession((prev) => ({
      ...prev,
      role: newRole,
      organisations: prev.organisations.map((o) =>
        o.id === prev.currentOrganisationId ? { ...o, role: newRole } : o
      ),
    }));
  };

  const addFacilityToOrg = (facility: Facility) => {
    setFacilitiesMap((prev) => {
      const orgFacs = prev[facility.organisationId] || [];
      return {
        ...prev,
        [facility.organisationId]: [...orgFacs, facility],
      };
    });
  };

  const assignReviewerToFacility = (facilityId: string, reviewerId: string, reviewerName: string) => {
    setFacilitiesMap((prev) => {
      const orgFacs = prev[session.currentOrganisationId] || [];
      const updated = orgFacs.map((f) =>
        f.id === facilityId ? { ...f, assignedReviewerId: reviewerId, assignedReviewerName: reviewerName } : f
      );
      return { ...prev, [session.currentOrganisationId]: updated };
    });
  };

  const logout = () => {
    setSession(defaultSession);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session,
        currentOrg,
        activeFacility,
        role: session.role,
        switchOrganisation,
        setActiveFacilityId,
        updateUserRole,
        addFacilityToOrg,
        assignReviewerToFacility,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
