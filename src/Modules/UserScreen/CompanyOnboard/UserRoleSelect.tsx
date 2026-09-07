import { Row, Col, Image, Card } from 'antd';
import { UserAuthlayout } from '../SignUp/SignUp';
import { useAuth } from '../../../Hooks/useAuth';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Styles from "../../../Modules/Admin/LandingPage.module.scss";
import styles from '../../../Modules/UserScreen/Logins/login.module.scss';
import buildingImg from '../../../assets/Svg/companyLogo.svg';
import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import { isNumber } from 'lodash';
import LogoutIcon from '../../../assets/Svg/LogoutIcon';
import { apiBaseUrl } from '../../../Services';
import axios from 'axios';

const UserRoleSelect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectuserRole, user } = useAuth();
  const [currentRole, SetCurrentRole] = useState();
  const navigate = useNavigate();
  const assesmentLevel = useSelector((state: any) => state.company);
  const [activeRoleIndex, setActiveRoleIndex] = useState<number | null>(null);

  const filteredData = assesmentLevel?.entity_Role?.reduce(
    (acc: any, current: any) => {
      if (current?.role_name && !acc[current?.role_name]) {
        acc[current?.role_name] = current;
      }
      return acc;
    },
    {}
  );

  const { token } = user;

  const signout = (access_token: any) => {
    axios
      .post(`${apiBaseUrl}/esg/signout/?access_token=${access_token}`, '')
      .catch((err) => {
        console.error('Signout error:', err);
      })
      .finally(() => {
        navigate('/auth/login');
      });
  };

  const handleClick = (index: any, data: any) => {
    if (index === currentRole) {
      SetCurrentRole(data);
      setActiveRoleIndex(activeRoleIndex === index ? null : index);
    } else {
      SetCurrentRole(index);
      setActiveRoleIndex(activeRoleIndex === index ? null : index);
    }
  };

  const handleContinue = () => {
    uniqueRoles.map((company, index) => {
      if (index === currentRole) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          selectuserRole(assesmentLevel, company);
        }, 1000);
      }
    });
  };

  const uniqueRoles = filteredData ? Object.values(filteredData) : [];

  useEffect(() => {
    if (filteredData === undefined) {
      navigate('/company-list');
    }
  }, [filteredData]);

  const getInitials = (name: string) => {
    const names = name.split('_');
    const initials = names.map((n) => n[0]).join('');
    return initials.length > 1 ? initials : initials[0];
  };
  const link = document.createElement('a');
  link.href = `${window.location.origin}/background-video.mp4`;
  return (
    <div className={styles.background}>
      <video className={styles.video} autoPlay muted loop>
        <source src={link.href} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.logoutMain}>
        <div className={styles.logoutSubDiv}>
          <LogoutIcon
            className={styles.logoutIcon}
            onClick={() => {
              signout(token);
            }}
          />
          <span
            className={styles.logoutText}
            onClick={() => {
              signout(token);
            }}
          >
            Logout
          </span>
        </div>
      </div>

      <PageCardComponent className={styles.pageCard}>
        <Row
          align="middle"
          justify="center"
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '24px',
          }}
        >
          <h3 className={styles.loginTitle2}>User Roles</h3>
          <p className={styles.loginSubTitle}>
            Select your role to view and complete requisite data provision
            tasks.
          </p>
        </Row>
        <Row
          gutter={[16, 16]}
          justify={'center'}
          style={{ marginBottom: '24px', marginTop: '10vh' }}
        >
          <Col>
            <Card
              className={styles.companyCard}
              onClick={() => {}}
              style={{ cursor: 'pointer' }}
            >
              <Row justify={'center'}>
                <Col span={6}>
                  <Image loading="lazy" src={buildingImg} preview={false} />
                </Col>
              </Row>
              <Row justify={'center'}>
                <Col span={24}>
                  <p className={styles.cardTitle}>
                    {assesmentLevel?.entity_name}
                  </p>
                  {uniqueRoles.length === 0 ? (
                    <p className={styles.cardDesc2}>
                      Thank you for accessing the SMART SUSTAIN.AI. Your role
                      has not been assigned yet. Please reach out to the
                      administrator for assistance.
                    </p>
                  ) : (
                    <p className={styles.cardDesc}>
                      Driving ESG innovation for a sustainable future.
                    </p>
                  )}
                </Col>
              </Row>
              <Row gutter={[16, 16]} align="middle" justify={'center'}>
                {uniqueRoles.map((company: any, index: any) => (
                  <ButtonComponent
                    onClick={() => handleClick(index, company)}
                    style={{
                      margin: '0.2vw',
                      backgroundColor:
                        activeRoleIndex === index ? '#0A1D4F' : undefined,
                      color: activeRoleIndex === index ? '#FFFFFF' : undefined,
                      fontWeight: activeRoleIndex === index ? 600 : undefined,
                    }}
                    size="sm"
                    className={styles.cardDesc}
                  >
                    {company?.role_name === 'ESG_ASSURER'
                      ? 'WORKFLOW VIEWER'
                      : company?.role_name.replace(/_/g, ' ')}
                  </ButtonComponent>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
        {uniqueRoles.length === 0 ? (
          <></>
        ) : (
          <Row justify="center" style={{ marginTop: '24px' }}>
            <ButtonComponent
              onClick={handleContinue}
              disabled={!isNumber(currentRole)}
              loading={isLoading}
            >
              Continue
            </ButtonComponent>
          </Row>
        )}
      </PageCardComponent>
    </div>
  );
};

export default UserRoleSelect;
