import { useState, useEffect } from 'react';
import styles from '../../../Modules/UserScreen/Logins/login.module.scss';
import NotificationClose from '../../../assets/Svg/User/NotificationClose';
import { Row, Col, Card } from 'antd';
import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import { get, put } from '../../../Services';
import { useNotification } from '../../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';

export default function AcceptRejectNotification() {
  const { openToast } = useNotification();
  const [notificationResponse, setNotificationResponse] = useState<any[]>([]);
  const link = document.createElement('a');
  const navigate = useNavigate();

  link.href = `${window.location.origin}/background-video.mp4`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get('/invite/accept_reject_notification/');
        if (
          (res?.status).trim().toLowerCase() === 'success' &&
          res?.response?.data
        ) {
          setNotificationResponse(res?.response?.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleAcceptReject = async (action: string, invitation_id: string) => {
    try {
      const res = await put(`/invite/accept_reject_action/`, {
        invitation_id: invitation_id,
        status: action,
      });
      if ((res?.status).trim().toLowerCase() === 'success' && res?.message) {
        openToast({
          content: `${res.message}`,
          type: 'success',
        });
        navigate('/company-list');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.videoWrapper}>
        <video className={styles.video} autoPlay muted loop>
          <source src={link.href} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.overlay}></div>
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
          <h3 className={styles.loginTitle2}>Notification Center</h3>
        </Row>
        <Card className={styles.notificationCard}>
          <Row
            className={styles?.rowNotification}
            gutter={[16, 16]}
            justify={'center'}
            style={{ height: '500px', overflow: 'auto', width: '100%' }}
          >
            {notificationResponse &&
              notificationResponse?.length > 0 &&
              notificationResponse?.map((item, index) => (
                <>
                  <Col span={24} key={index}>
                    <div key={index} className={styles.notification}>
                      <Row>
                        <Col span={14}>
                          <Row>
                            <div className={styles.notificationHeader}>
                              <span>{item?.entity_Role}</span>
                            </div>
                          </Row>
                          <Row>
                            <div className={styles.notificationText}>
                              <span>{item?.message}</span>
                            </div>
                          </Row>
                        </Col>
                        <Col span={10}>
                          <Row align="middle" justify="end" gutter={4}>
                            <Col>
                              <ButtonComponent
                                size="sm"
                                onClick={() =>
                                  handleAcceptReject(
                                    'Rejected',
                                    item?.invitationId
                                  )
                                }
                                className={styles.closeButton}
                                hierarchy="transparent"
                              >
                                Decline
                              </ButtonComponent>
                            </Col>
                            <Col>
                              <ButtonComponent
                                size="sm"
                                onClick={() =>
                                  handleAcceptReject(
                                    'Accepted',
                                    item?.invitationId
                                  )
                                }
                              >
                                Accept
                              </ButtonComponent>
                            </Col>
                            <Col
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <div className={styles.closeButton}>
                                <NotificationClose />
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </>
              ))}
          </Row>
        </Card>
      </PageCardComponent>
    </div>
  );
}
