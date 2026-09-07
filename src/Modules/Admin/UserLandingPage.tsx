import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Image, Typography, Space, Switch, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { permissions } from '../../Utils/Roles';
import manageImg from '../../assets/image/Rectangle 34625761.png';
import emissionCalculatorImg from '../../assets/image/emissionCalculator.png';
import reportingImg from '../../assets/image/reportingCompliance.png';
import maturityImg from '../../assets/image/maturityAssessment.png';
import dashboardImg from '../../assets/image/reportsDashboard.png';
import companyConfigImg from '../../assets/image/companyConfig.png';
import userAccessMgmtImg from '../../assets/image/userAccessMgmt.png';
import peerImg from '../../assets/image/Peer.png';
import issbImg from '../../assets/image/Issb.png';
import superImg from '../../assets/image/superview.png';
import Styles from './LandingPage.module.scss';
import { useHasAccess } from '../../Hooks/useHasAccess';
import { ModalComponent } from '../../DesignLibrary';
import { useSelector } from 'react-redux';
import { useAuth } from '../../Hooks/useAuth';
import { get, put } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { useDispatch } from 'react-redux';
import { setNotificationsList, setUnreadCount } from '../../Redux/Actions';
import { handleDynamicNavigation } from '../../Components/Navigate';
import { getCurrentYear } from '../../Components/Emissions/Scope3/Helpers';
import landscape from '../../assets/Svg/landscape.svg';
import handPlant from '../../assets/Svg/handPlant.svg';

const { Text } = Typography;

interface CardDetails {
  title: string;
  img: string;
  description: string;
  link: string;
}

interface NotificationDetails {
  text: string;
  author: string;
  date: string;
}

interface LandingPageProps {
  cardData: CardDetails[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleDateString('en-GB', options).replace(',', '');
};

const LandingPage: React.FC<LandingPageProps> = ({ cardData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const getInitials = (name: string) => {
    const names = name.split(/[_\s]/);
    const initials = names
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    switch (initials) {
      case 'A':
        return 'AD';
      case 'LDR':
        return 'DR';
      case 'LDA':
        return 'DA';
      default:
        return initials;
    }
  };

  const [isNavigating, setIsNavigating] = useState<boolean>(false); // New state for navigation

  const [notifyData, setNotifyData] = useState<any[]>([]);
  const notifList = useSelector((state: any) => state.notificationList);
  const { user } = useAuth();
  const handleCardClick = (link: string) => {
    navigate(link);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const getAuthId = async () => {
    try {
      const res = await get(`/entity/getEntitiesListByUserId/`);

      if (!isEmpty(res?.response)) {
        const results = res.response.data;

        // Extract the auth_Id and role_name for each entity
        results.forEach((entity: any) => {
          const entityId = entity.entity_Id;
          const authId = entity.auth_Id;
          const roleName = entity.entity_Role?.[0]?.role_name || 'NO_ROLE'; // Use 'NO_ROLE' if no role is found

          // Call notifyGetData for each entity's authId and roleName
          if (entityId === user?.entity_Id) {
            notifyGetData(authId, roleName);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRead = async (id: string, status: boolean, notification: any) => {
    const url = `/notifications/read_notification/?id=${id}&status=${status}`;

    try {
      const resData = await put(url, {});

      // Update the notification status to read or remove from the list
      setNotifyData((prevData) =>
        prevData.map((notif) =>
          notif.id === id ? { ...notif, status: true } : notif
        )
      );

      // Set navigation flag
      setIsNavigating(true);

      if (notification.redirect == true) {
        handleDynamicNavigation(
          notification.module,
          notification.sub_module_page,
          navigate
        );
      } else {
        await getAuthId();
      }
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };

  const notifyGetData = async (authId: any, roleName: any) => {
    try {
      const res = await get(
        `/notifications/get_notifications/?auth_Id=${authId}&role=${roleName}`
      );

      if (!isEmpty(res?.response)) {
        const results = res.response.data;
        setNotifyData(results);
        dispatch(setNotificationsList(results));
        dispatch(setUnreadCount(res?.response?.unread));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <>
      <Row className={Styles.pageCardStyle}>
        <Card className={Styles.container}>
          <Row align="middle" justify="center" gutter={[16, 16]}>
            <Col
              xs={24}
              sm={8}
              md={6}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{ marginTop: '-88px' }}>
                <img
                  src={handPlant}
                  alt="handPlant"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
            </Col>

            <Col xs={24} sm={16} md={10}>
              <div>
                <p className={Styles.esgTitle}>
                  Empowering ESG Compliance with Simplicity
                </p>
                <p className={Styles.esgPara}>
                  A comprehensive platform for sustainable, strategic and secure
                  reporting.
                </p>
              </div>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={8}
              style={{ display: 'flex', justifyContent: 'flex-start' }}
            >
              <img
                src={landscape}
                alt="landscape"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Col>
          </Row>

          <Row gutter={[32, 32]} justify="center" className="mt-4">
            {cardData.map((data, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <div
                  className={Styles.cardNew}
                  onClick={() => handleCardClick(data.link)}
                >
                  <Row align="middle" justify="center">
                    <Col span={24} className={Styles.text_col}>
                      <p
                        style={{
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#036323',
                        }}
                      >
                        {data.title}
                      </p>
                      <p style={{ textAlign: 'center', color: '#605B5A' }}>
                        {data.description}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </Row>

      <ModalComponent
        isOpen={isOpen}
        content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
        onCancel={() => setIsOpen(false)}
        onProceed={() => setIsOpen(false)}
        submitBtnText="Ok"
      />
    </>
  );
};

export function UserLandingPage() {
  const cardData: CardDetails[] = [
    {
      title: 'Manage Client',
      img: manageImg,
      description:
        'The Manage Client module facilitates efficient client onboarding, communication, and relationship management.',
      link: '/manage-client/create-profile',
    },
    {
      title: 'Super View',
      img: superImg,
      description:
        'Facilitate monitoring of ESG Performance for onboarded companies.',
      link: '/super-view',
    },
  ];

  const notifications: NotificationDetails[] = [
    {
      text: 'Company-A profile is updated',
      author: 'John Doe',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'Scope 1 Emission calculator module access granted to User-1',
      author: 'Patrick',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'Audit logs generated for Company-ABC',
      author: 'Raed Smith',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'ESG Maturity Assessment module access revoked from User-5',
      author: 'Vin K',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'Company-B Admin access disabled',
      author: 'Nathan George',
      date: '27 May 2024 05:15 PM',
    },
  ];

  return <LandingPage cardData={cardData} />;
}

export function AdminLandingPage() {
  const cardData: CardDetails[] = [
    {
      title: 'Company Configuration',
      img: companyConfigImg,
      description:
        'Simplify Company setup with step-by-step configuration guides and intuitive interfaces.​',
      link: '/settings/onBoard-companies',
    },
    {
      title: 'User Access Management',
      img: userAccessMgmtImg,
      description:
        'Create and manage users and assign permissions based on user roles enabling streamlined and secure access control.​',
      link: '/user-access-management/user-management',
    },
    {
      title: 'Dashboard',
      img: manageImg,
      description:
        'Interactive dashboards providing actionable insights into ESG parameters, enabling informed decision-making.​',
      link: '/emission-calculator',
    },
    {
      title: 'ESG Maturity Assessment',
      img: maturityImg,
      description:
        "Assess your organisation's ESG maturity with a thorough evaluation across all relevant metrics. ​",
      link: '/assessment-start',
    },
    {
      title: 'ISSB',
      img: issbImg,
      description: 'Simplifying your path to IFRS S1 and S2 Compliance.',
      link: '/ISSB-Gap-Analysis-Results',
    },
    {
      title: 'Peer Benchmarking',
      img: peerImg,
      description: 'Know where your company stand compare to its peers.​',
      link: '/admin-bench',
    },
  ];

  const notifications: NotificationDetails[] = [
    {
      text: 'Company-A profile is updated',
      author: 'John Doe',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'Scope 1 Emission calculator module access granted to User-1',
      author: 'Patrick',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'Audit logs generated for Company-ABC',
      author: 'Raed Smith',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'ESG Maturity Assessment module access revoked from User-5',
      author: 'Vin K',
      date: '27 May 2024 05:15 PM',
    },
    {
      text: 'Company-B Admin access disabled',
      author: 'Nathan George',
      date: '27 May 2024 05:15 PM',
    },
  ];

  return (
    <>
      <LandingPage cardData={cardData} />
    </>
  );
}

export function DataProviderLandingPage() {
  const baseCardData: CardDetails[] = [
    {
      title: 'Dashboard',
      img: dashboardImg,
      description:
        'Interactive dashboards offering actionable insights on various ESG parameters facilitating informed decision-making and strategic planning.',
      link: '/emission-calculator',
    },
  ];
  const { hasPermissions } = useHasAccess();
  const includeEmissionCalculator = hasPermissions([
    permissions.VIEW_SUBMIT_SCOPE_1,
  ]);
  const includeReportingCompliance = hasPermissions([
    permissions.VIEW_QUESTIONNAIRE,
  ]);
  const providerCardData: CardDetails[] = [
    ...baseCardData,
    ...(includeEmissionCalculator
      ? [
          {
            title: 'Emission Calculator',
            img: emissionCalculatorImg,
            description:
              'Accurately track your carbon footprint with our easy-to-use emission calculator.​',
            link: '/environment/emissions',
          },
        ]
      : []),
    ...(includeReportingCompliance
      ? [
          {
            title: 'Reporting Compliance',
            img: reportingImg,
            description:
              'Ensure adherence to regulatory standards with comprehensive compliance reporting module.​',
            link: '/reporting-compliance/questionnaire',
          },
        ]
      : []),
    {
      title: 'ESG Maturity Assessment',
      img: maturityImg,
      description:
        "Assess your organisation's ESG maturity with a thorough evaluation across all relevant metrics. ​",
      link: '/assessment-end',
    },
    {
      title: 'ISSB',
      img: issbImg,
      description: 'Simplifying your path to IFRS S1 and S2 Compliance.',
      link: '/ISSB-Gap-Analysis-Results',
    },
    {
      title: 'Peer Benchmarking',
      img: peerImg,
      description: 'Know where your company stand compare to its peers.',
      link: '/admin-bench',
    },
  ];

  return <LandingPage cardData={providerCardData} />;
}
