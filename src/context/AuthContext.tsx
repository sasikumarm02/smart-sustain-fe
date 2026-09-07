import type { UserSession, UserRole, Organisation, Facility, CommonResponse } from '../types/domain';
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: UserSession | null;
  currentOrg: Organisation | null;
  activeFacility: Facility | null;
  role: UserRole;
  login: (email: string, pass: string) => boolean;
  switchOrganisation: (orgId: string) => CommonResponse<UserSession>;
  setActiveFacilityId: (facilityId: string) => void;
  updateUserRole: (newRole: UserRole) => void;
  addFacilityToOrg: (facility: Facility) => void;
  assignReviewerToFacility: (facilityId: string, reviewerId: string, reviewerName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [facilitiesMap, setFacilitiesMap] = useState<Record<string, Facility[]>>({});

  const currentOrg = session ? (session.organisations.find((o) => o.id === session.currentOrganisationId) || session.organisations[0] || null) : null;
  const currentOrgFacilities = session && session.currentOrganisationId ? (facilitiesMap[session.currentOrganisationId] || []) : [];
  const activeFacility = session ? (currentOrgFacilities.find((f) => f.id === session.activeFacilityId) || currentOrgFacilities[0] || null) : null;

  const login = (email: string, pass: string): boolean => {
    if (!email || !pass) return false;

    const orgId = `org-${Date.now()}`;
    const facilityId = `fac-${Date.now()}`;
    const username = email.split('@')[0];

    const defaultFacility: Facility = {
      id: facilityId,
      organisationId: orgId,
      name: `${username.toUpperCase()} Org - Main HQ Facility`,
      code: `FAC-${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`,
      type: 'HEADQUARTERS',
      country: 'Global Jurisdiction',
      status: 'ACTIVE',
    };

    const defaultOrg: Organisation = {
      id: orgId,
      name: `${username.toUpperCase()} Organisation`,
      code: `${username.substring(0, 4).toUpperCase()}-ORG`,
      country: 'Global Jurisdiction',
      role: 'DATA_PROVIDER',
      facilitiesCount: 1,
    };

    setFacilitiesMap({ [orgId]: [defaultFacility] });

    const newSession: UserSession = {
      id: `usr-${Date.now()}`,
      email,
      name: email,
      currentOrganisationId: orgId,
      activeFacilityId: facilityId,
      role: 'DATA_PROVIDER',
      organisations: [defaultOrg],
      facilities: [defaultFacility],
    };

    setSession(newSession);
    return true;
  };

  const switchOrganisation = (targetOrgId: string): CommonResponse<UserSession> => {
    if (!session) {
      return {
        status: 'UNAUTHORIZED',
        response: { action: 'SwitchOrganisationFailure', data: null as any },
        message: 'User session not active.',
      };
    }

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
    if (session) {
      setSession((prev) => (prev ? { ...prev, activeFacilityId: facilityId } : null));
    }
  };

  const updateUserRole = (newRole: UserRole) => {
    if (session) {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              role: newRole,
              organisations: prev.organisations.map((o) =>
                o.id === prev.currentOrganisationId ? { ...o, role: newRole } : o
              ),
            }
          : null
      );
    }
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
    if (session) {
      setFacilitiesMap((prev) => {
        const orgFacs = prev[session.currentOrganisationId] || [];
        const updated = orgFacs.map((f) =>
          f.id === facilityId ? { ...f, assignedReviewerId: reviewerId, assignedReviewerName: reviewerName } : f
        );
        return { ...prev, [session.currentOrganisationId]: updated };
      });
    }
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session,
        currentOrg,
        activeFacility,
        role: session?.role || 'DATA_PROVIDER',
        login,
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
