import { apiURL, basePath } from '../Utils/Constants';
import { message as notificationMessage } from 'antd';
import { strings } from '../Utils/Strings';

export const apiBaseUrl = `${apiURL}/${basePath}`;

// Updated Get function using native fetch API
export const get = async (
  endpoint: string,
  headers?: { [key in string]: any }
) => {
  const token = localStorage.getItem('accessToken');
  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${apiURL ? (apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL) : ''}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: requestHeaders,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `GET request failed with status ${response.status}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return data;
};

// Updated Post function using native fetch API
export const post = async (
  endpoint: string,
  payload: any,
  headers?: { [key: string]: any }
) => {
  const token = localStorage.getItem('accessToken');
  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${apiURL ? (apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL) : ''}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `POST request failed with status ${response.status}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return data;
};

// Updated Put function using native fetch API
export const put = async (endpoint: string, payload: any) => {
  const token = localStorage.getItem('accessToken');
  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${apiURL ? (apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL) : ''}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: requestHeaders,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `PUT request failed with status ${response.status}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return data;
};

// Updated Remove function using native fetch API
export const remove = async (endpoint: string, payload?: any) => {
  const token = localStorage.getItem('accessToken');
  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${apiURL ? (apiURL.endsWith('/') ? apiURL.slice(0, -1) : apiURL) : ''}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: requestHeaders,
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || `DELETE request failed with status ${response.status}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  return data;
};

export const upload = (endpoint: string, payload: any) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('accessToken');
    if (!token) reject('Unauthorized User');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    fetch(`${apiURL}/${endpoint}`, {
      method: 'POST',
      body: payload,
      headers: myHeaders,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
      });
  });
};
