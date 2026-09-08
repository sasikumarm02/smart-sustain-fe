import { apiURL, basePath } from '../Utils/Constants';

export interface SignupPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  jobTitle: string;
}

export interface SignupResponse {
  status: string;
  response?: {
    action: string;
    data: {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
        currentOrganisationId?: string | null;
        facilityIds?: string[];
      };
    };
  };
  message: string;
}

export interface FacilityApiItem {
  id: string;
  organisationId: string;
  name: string;
  code: string;
  facilityType: string;
  country: string;
  state?: string;
  city?: string;
  status: string;
}

export interface OrganisationApiItem {
  organisationId: string;
  organisationName: string;
  role: string;
  status: string;
  country?: string;
  facilities?: FacilityApiItem[];
}

export interface LoginUserResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  currentOrganisationId?: string | null;
  facilityIds?: string[] | null;
  organisations?: OrganisationApiItem[] | null;
}

export interface LoginResponse {
  status: string;
  response?: {
    action: string;
    data: {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: LoginUserResponse;
    };
  };
  message: string;
}

import { get, post } from './api.service';

export interface UserProfileResponse {
  status: string;
  response?: {
    action: string;
    data: {
      id: string;
      email: string;
      fullName: string;
      phone?: string;
      authProvider?: string;
      status?: string;
      role: string;
      currentOrganisationId?: string | null;
      organisations?: OrganisationApiItem[] | null;
      facilityIds?: string[] | null;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  message: string;
}

/**
 * Get Current User Profile API call: GET /api/v1/users/me
 */
export const getCurrentUserProfileApi = async (): Promise<UserProfileResponse> => {
  return await get('/api/v1/users/me');
};

// Compute base API url
const getApiEndpoint = (path: string): string => {
  if (apiURL) {
    const cleanApiUrl = apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanApiUrl}${cleanPath}`;
  }
  return path;
};

/**
 * Sign up API call: POST /api/v1/auth/signup
 */
export const signupUserApi = async (payload: SignupPayload): Promise<SignupResponse> => {
  const url = getApiEndpoint('/api/v1/auth/signup');
  const bodyData = {
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    phone: payload.phone || '+1-555-0199',
    jobTitle: payload.jobTitle,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Signup failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as SignupResponse;
};

/**
 * Login API call: POST /api/v1/auth/login
 */
export const loginUserApi = async (email: string, password: string): Promise<LoginResponse> => {
  const url = getApiEndpoint('/api/v1/auth/login');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Login failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as LoginResponse;
};

export interface RefreshTokenResponse {
  status: string;
  response?: {
    action: string;
    data: {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
        currentOrganisationId?: string | null;
        facilityIds?: string[];
      };
    };
  };
  message: string;
}

export interface LogoutResponse {
  status: string;
  response?: {
    action: string;
    data: null;
  };
  message: string;
}

/**
 * Refresh Token Rotation API call: POST /api/v1/auth/refresh
 */
export const refreshTokenApi = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const url = getApiEndpoint('/api/v1/auth/refresh');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Refresh token failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as RefreshTokenResponse;
};

/**
 * User Logout API call: POST /api/v1/auth/logout
 */
export const logoutUserApi = async (token?: string): Promise<LogoutResponse> => {
  const url = getApiEndpoint('/api/v1/auth/logout');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('accessToken');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
  });

  const data = await response.json().catch(() => null);

  return data as LogoutResponse;
};

/**
 * Unified Create Organisation API call: POST /api/v1/organisations
 */
export interface CreateOrganisationFacilityPayload {
  facilityName: string;
  facilityCode: string;
  facilityType: string;
  city?: string;
}

export interface CreateOrganisationUserPayload {
  fullName: string;
  jobTitle?: string;
  email: string;
  phone?: string;
  facilityNames?: string[];
}

export interface CreateOrganisationPayload {
  country: string;
  domain: string;
  domainDetail?: string;
  organisationName: string;
  registrationNumber?: string;
  size?: string;
  sector?: string;
  noofemployee?: string;
  website?: string;
  address?: string;
  contactName?: string;
  contactEmail?: string;
  contactNo?: string;
  facilities?: CreateOrganisationFacilityPayload[];
  users?: CreateOrganisationUserPayload[];
}

export interface CreateOrganisationResponse {
  status: string;
  response?: {
    action: string;
    data: {
      id: string;
      name: string;
      registrationNumber?: string;
      country?: string;
      sector?: string;
      domain?: string;
      domainDetail?: string;
      size?: string;
      noOfEmployees?: string;
      website?: string;
      address?: string;
      contactName?: string;
      contactEmail?: string;
      contactNo?: string;
      status?: string;
      createdAt?: string;
      updatedAt?: string;
      facilities?: Array<{
        id: string;
        organisationId: string;
        name: string;
        code: string;
        facilityType: string;
        city?: string;
        status?: string;
      }>;
      members?: Array<{
        userId: string;
        email: string;
        fullName: string;
        jobTitle?: string | null;
        phone?: string;
        role: string;
        status: string;
        assignedFacilityNames?: string[];
      }>;
    };
  };
  message: string;
}

export const createOrganisationApi = async (
  payload: CreateOrganisationPayload
): Promise<CreateOrganisationResponse> => {
  return await post('/api/v1/organisations', payload);
};


