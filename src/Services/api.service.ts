import axios, { AxiosError, AxiosResponse } from 'axios';
import { isEmpty, get as _get } from 'lodash';
import { apiURL, basePath } from '../Utils/Constants';
import { message as notificationMessage } from 'antd';
import { strings } from '../Utils/Strings';

export const apiBaseUrl = `${apiURL}/${basePath}`;

const extractErrMsg = (err: AxiosError, reject: Function) => {
  if (err) {
    const message = err.response?.data as any;
    if (message) {
      notificationMessage.error(message.message);
      reject(message);
    }
    notificationMessage.error(strings.someThingWentWrong);
    reject(strings.someThingWentWrong);
  }
};

const handleErr = (err: AxiosError, reject: Function) => {
  if (err.response?.status === 401) {
    localStorage.removeItem('user');
    window.location.reload();
  }
  return extractErrMsg(err, reject);
};

const api = axios.create({
  baseURL: apiBaseUrl,
});

const updateHeader = (endpoint?: any) => {
  const user = JSON.parse(localStorage.getItem('user') as any) || {};
  if (!isEmpty(user)) {
    const { token } = user;
    api.defaults.headers.common['Authorization'] = `Bearer ${token} `;
    if (
      endpoint !== '/entity/getEntitiesListByUserId/' &&
      endpoint !== '/invite/accept_reject_notification/'
    ) {
      api.defaults.headers.common['Entityid'] = user?.entity_Id;
      api.defaults.headers.common['Role'] = user?.role;
    }
    return;
  }
  api.defaults.headers.common['Authorization'] = '';
};

const validateResponse = (res: AxiosResponse<any>) => {
  const { data } = res;

  if (data && (data.status === 'Success' || data.status === 'CREATED')) {
    return data;
  } else {
    const errorMessage =
      data && data.message ? data.message : 'Unknown error occurred';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Updated Get function
export const get = async (
  endpoint: string,
  headers?: { [key in string]: any }
) => {
  updateHeader(endpoint);
  try {
    const res: AxiosResponse<any> = await api.get(endpoint);
    return validateResponse(res);
  } catch (err: any) {
    console.error('Error in GET request:', err);
    throw err;
  }
};

// Updated Post function
export const post = async (
  endpoint: string,
  payload: any,
  headers?: { [key: string]: any }
) => {
  updateHeader();

  try {
    const res: AxiosResponse<any> = await api.post(endpoint, payload, {
      headers,
    });
    return validateResponse(res);
  } catch (err: any) {
    console.error('Error in POST request:', err);
    throw err;
  }
};

// Updated Put function
export const put = async (endpoint: string, payload: any) => {
  updateHeader();

  try {
    const res: AxiosResponse<any> = await api.put(endpoint, payload);
    return validateResponse(res);
  } catch (err: any) {
    console.error('Error in PUT request:', err);
    throw err;
  }
};

// Updated Remove function
export const remove = async (endpoint: string, payload?: any) => {
  updateHeader();

  try {
    const res: AxiosResponse<any> = await api.delete(endpoint, {
      data: payload,
    });
    return validateResponse(res);
  } catch (err: any) {
    console.error('Error in DELETE request:', err);
    throw err;
  }
};

export const upload = (endpoint: string, payload: any) => {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(localStorage.getItem('user') as any) || {};
    if (!user) reject('Unauthorized User');
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${user.token}`);

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
      .catch((err: AxiosError) => {
        reject(handleErr(err, reject));
      });
  });
};
