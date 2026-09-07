import { useState, useEffect } from 'react';
import { Layout, Space } from 'antd';
import Breadcrumb from '../../DesignLibrary/BreadCrumb';
import styles from './layout.module.scss';
import { useAuth } from '../../Hooks/useAuth';
import { useOutlet, useNavigate, Navigate } from 'react-router-dom';
import Header from '../Header/Header';
import Style from '../Navbar/Navbar.module.scss';
import Navbar from '../Navbar/Navbar';
import ErrorBoundaryWrapper from '../ErrorHandlers/ErrorBoundary';
import { setNotificationToggle } from '../../Redux/Actions';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Footer';
import CustomExpandIcon from '../../assets/Svg/CustomExpandIcon';
import CustomCollapseIcon from '../../assets/Svg/CustomCollapseIcon';

const { Sider, Content } = Layout;

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const outlet = useOutlet();
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useState('light');
  const currentPath = window.location.pathname;
  const notificationToggle = useSelector(
    (state: any) => state.notificationToggle
  );

  const excludePaths = [
    '/add-entity',
    '/settings/company/onboarding-company',
    '/company-list',
    '/user-role',
    '/notification-acceptance',
  ];

  const pathVerify = (path: string) => excludePaths.includes(path);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const toggleNotification = () => {
    if (notificationToggle) {
      dispatch(setNotificationToggle(!notificationToggle));
    }
  };

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
    <div
      className={`App_${theme}`}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {!pathVerify(currentPath) && <Header />}

      <Layout style={{ flex: 1, overflow: 'hidden' }}>
        {!pathVerify(currentPath) && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className={Style.sider}
            style={{ overflow: 'auto', height: '100%', position: 'relative' }}
            trigger={
              collapsed ? (
                <CustomExpandIcon />
              ) : (
                <CustomCollapseIcon style={{ marginLeft: '150px' }} />
              )
            }
          >
            <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          </Sider>
        )}

        <Layout style={{ background: 'transparent', overflow: 'hidden' }}>
          <ErrorBoundaryWrapper>
            <Content
              className={styles.content}
              style={{
                height: '100%',
                overflowY: 'auto',
                padding: `${pathVerify(currentPath) ? '0' : '0 20px'}`,
                margin: '0px 0 0 auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {!pathVerify(currentPath) && <Breadcrumb />}
              {outlet}
              {!pathVerify(currentPath) && <Footer />}
            </Content>
          </ErrorBoundaryWrapper>
        </Layout>
      </Layout>
    </div>
  );
};
