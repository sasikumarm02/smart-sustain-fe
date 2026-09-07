import {
  Row,
  Col,
  Input,
  Image,
  Typography,
  Dropdown,
  Space,
  Menu,
} from 'antd';
import Styles from './header.module.scss';
import { DownOutlined } from '@ant-design/icons';
import { useAuth } from '../../Hooks/useAuth';
import avatar from '../../assets/Svg/Avatar.svg';
import NotificationIcon from '../../assets/Svg/Header/NotificationIcon';
import LanguageIcon from '../../assets/Svg/Header/LanguageIcon';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../DesignLibrary/BreadCrumb';
import { useEffect, useState } from 'react';
import Notification from '../Notification';
import { apiBaseUrl, get } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNotificationsList,
  setNotificationToggle,
  setUnreadCount,
} from '../../Redux/Actions';
import smartLogo from '../../assets/SustainLogoSvg.svg';
import { Label } from 'recharts';
import axios from 'axios';
import { LogoutOutlined, SwapOutlined } from '@ant-design/icons';
import SignoutIcon from '../../assets/Svg/SignoutIcon';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = user;

  const signout = async (access_token: string) => {
    try {
      await axios.post(
        `${apiBaseUrl}/esg/signout/?access_token=${access_token}`,
        ''
      );
    } catch (err) {
      console.error('Signout error:', err);
    } finally {
      navigate('/auth/login');
    }
  };

  const menuDropdownItems = [
    {
      key: '1',
      label: (
        <span>
          <SwapOutlined style={{ marginRight: 8 }} />
          Switch Company/Role
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <SignoutIcon style={{ marginRight: 6 }} />
          Sign Out
        </span>
      ),
    },
  ];

  const handleUserRole = async ({ key }: { key: string }) => {
    if (key === '1') {
      navigate('/company-list');
    } else if (key === '2') {
      await signout(token);
    }
  };

  const excludePaths = [
    '/add-entity',
    '/settings/company/onboarding-company',
    '/company-list',
    '/user-role',
    '/notification-acceptance',
  ];

  const currentPath = window.location.pathname;
  const pathVerify = (currentPath: any) => excludePaths.includes(currentPath);

  const updatedRoleFormat =
    user.role === 'ESG_ASSURER'
      ? 'WORKFLOW VIEWER'
      : user.role.replace(/_/g, ' ');

  const notificationToggle = useSelector(
    (state: any) => state.notificationToggle
  );
  const unreadCount = useSelector((state: any) => state.unreadCount);

  const toggleNotification = () => {
    dispatch(setNotificationToggle(!notificationToggle));
  };

  const userName = user?.entity_Id;

  const notifyGetData = async (authId: any, roleName: any) => {
    try {
      const res = await get(
        `/notifications/get_notifications/?auth_Id=${authId}&role=${roleName}`
      );
      if (!isEmpty(res?.response)) {
        const results = res.response.data;
        dispatch(setNotificationsList(results));
        dispatch(setUnreadCount(res?.response?.unread));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getAuthId = async () => {
    try {
      const res = await get(`/entity/getEntitiesListByUserId/`);
      if (!isEmpty(res?.response)) {
        const results = res.response.data;
        results.forEach((entity: any) => {
          const entityId = entity.entity_Id;
          const authId = entity.auth_Id;
          const roleName = entity.entity_Role?.[0]?.role_name || 'NO_ROLE';
          if (entityId === userName) {
            notifyGetData(authId, roleName);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const startInterval = () => {
    const intervalId = setInterval(() => {
      getAuthId();
    }, 120000);
    return intervalId;
  };

  useEffect(() => {
    const intervalId = startInterval();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    getAuthId();
  }, []);

  useEffect(() => {
    const intervalId = startInterval();
    return () => {
      clearInterval(intervalId);
    };
  }, [user.role]);

  const handleLogoNavigation = () => {
    const roleToPageMap: { [key: string]: string } = {
      DATA_PROVIDER: '/landing-page',
      SUPER_ADMIN: '/super-admin-landing',
      ADMIN: '/admin-landing',
      DATA_REVIEWER: '/landing-page',
      DATA_APPROVER: '/landing-page',
      L1_DATA_REVIEWER: '/landing-page',
      L2_DATA_REVIEWER: '/landing-page',
      L3_DATA_REVIEWER: '/landing-page',
      L1_DATA_APPROVER: '/landing-page',
      L2_DATA_APPROVER: '/landing-page',
      ESG_ASSURER: '/admin-landing',
    };
    const targetPage = roleToPageMap[user?.role];
    navigate(targetPage);
  };

  return (
    <>
      <Row
        gutter={16}
        justify="space-between"
        align="middle"
        className={Styles.MainWrapper}
      >
        <Col span={12}>
          <img
            onClick={handleLogoNavigation}
            src={smartLogo}
            style={{ height: '50px', cursor: 'pointer' }}
          />
        </Col>

        <Col span={12}>
          <Row gutter={24} align="middle" justify="end">
            <Col span={24}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                {user.role !== 'SUPER_ADMIN' && (
                  <div
                    onClick={toggleNotification}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      padding: '10px',
                    }}
                  >
                    <NotificationIcon />
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'red',
                        }}
                      />
                    )}
                    {notificationToggle && <Notification />}
                  </div>
                )}

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="info1" style={{ pointerEvents: 'none' }}>
                        {user.selectedMenuItem || updatedRoleFormat} &nbsp;{' '}
                        {user.entity_name}
                      </Menu.Item>
                      <Menu.Item key="info2" style={{ pointerEvents: 'none' }}>
                        {user.email}
                      </Menu.Item>
                      <Menu.Divider />
                      {menuDropdownItems.map((item: any) => (
                        <Menu.Item
                          key={item.key}
                          onClick={() => handleUserRole({ key: item.key })}
                        >
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Image
                      loading="lazy"
                      src={avatar}
                      preview={false}
                      style={{ width: 40, height: 40 }}
                      className={Styles.avatarIcon}
                    />
                    <DownOutlined
                      style={{ color: '#036323' }}
                      className={Styles.downloadIcon}
                    />
                  </div>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Header;
