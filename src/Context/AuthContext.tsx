import React, { createContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../Hooks/useLocalStorage';
import { AuthContext as AuthContextT } from '../Types/index';
import { useNotification } from '../Hooks/useNotification';
import axios from 'axios';
import { apiBaseUrl, post } from '../Services/api.service';
export const AuthContext = createContext({} as AuthContextT);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser, removeUser] = useLocalStorage('user', null);
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const navigate = useNavigate();

  // call this function when you want to authenticate the user

  const login = async (values: any) => {
    setIsLoading(true);

    try {
      const response = await axios.post(apiBaseUrl + '/esg/login/', values);

      if (
        response.data.status === 'Success' &&
        response.data.response.status === true
      ) {
        const userData = response.data.response.data;
        setUser({
          email: userData.email_address,
          token: userData.access,
          refreshToken: userData.refresh,
          user: userData.userId,
          role: userData.role,
          entity_name: '',
          entity_Id: '',
          user_type: userData?.user_type,
          financial_year: [],
          selectedMenuItem: null,
          permissions: [],
        });

        if (userData.role === 'SUPER_ADMIN') {
          navigate('/super-admin-landing');
        } else {
          if (userData?.user_type === 'NEW') {
            navigate('/notification-acceptance');
          } else {
            navigate('/company-list');
          }
        }
      } else if (response.data.response.error_message === 'OTP not verified') {
        openToast({
          content: response.data.response.error_message,
          type: 'error',
        });

        await axios
          .post(apiBaseUrl + '/esg/send-otp-email/', {
            email_address: response.data.response.data,
          })
          .then((res) => {
            openToast({
              content: res.data.message,
              type: 'success',
            });
            setIsLoading(false);
            navigate(`/auth/verify-otp?email=${response.data.response.data}`);
          })
          .catch((err: any) => {
            setIsLoading(false);
          });

        if (response.data.response.action === 'Send OTP Email') {
          navigate(`/auth/verify-otp?email=${response.data.response.data}`);
        }
      } else {
        openToast({
          content: response.data.response.error_message,
          type: 'error',
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    removeUser('user');
    window.location.reload();
  };

  const selectuserRole = (values: any, acces: any) => {
    setUser({
      token: user.token,
      refreshToken: user.refreshToken,
      user: user.user,
      email: values.email_address,
      role: acces?.role_name,
      entity_name: values.entity_name,
      entity_Id: values.entity_Id,
      financial_year: values.financial_year,
      selectedMenuItem: null,
      user_type: user?.user_type,
      permissions: acces?.permissions ? acces?.permissions : [],
    });
    if (acces?.role_name === 'ADMIN') {
      navigate('/admin-landing');
    } else if (acces?.role_name === 'ESG_ASSURER') {
      navigate('/admin-landing');
    } else {
      navigate('/landing-page');
    }
  };

  const value: AuthContextT = useMemo(
    () => ({
      user,
      login,
      logout,
      isLoading,
      selectuserRole,
    }),
    // eslint-disable-next-line
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
