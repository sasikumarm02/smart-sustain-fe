import { useEffect, useState } from 'react';
import Styles from './Notification.module.scss';
import { Card, Col, Divider, Row } from 'antd';
import { isEmpty } from '../Utils/isEmpty';
import { get, put } from '../Services';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { handleDynamicNavigation } from './Navigate';
import { useAuth } from '../Hooks/useAuth';
import { setNotificationsList, setUnreadCount } from '../Redux/Actions';
import { UseDispatch } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function Notification() {
  const [notifyData, setNotifyData] = useState<any[]>([]);
  const [isNavigating, setIsNavigating] = useState<boolean>(false); // New state for navigation
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { user } = useAuth();
  const dispatch = useDispatch();
  const userName = user?.entity_Id;
  const notifList = useSelector((state: any) => state.notificationList);
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
          if (entityId === userName) {
            notifyGetData(authId, roleName);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  // If navigating, do not render the notification card
  if (isNavigating) {
    return null; // Optionally, you can return a loading state or something else
  }

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

  return (
    <>
      {/* Card for when notifList has notifications */}
      {notifList?.length > 0 ? (
        <Card
          className={`${Styles.notification_wrap} ${notifyData?.length > 0 ? Styles.marginTopNegative : ''}`}
        >
          <Row>
            <div className={Styles.notificationHead}>Notification</div>
          </Row>

          <Divider style={{ margin: '10px 0', borderColor: '#E6E6E6' }} />
          {notifList?.map((notification: any, index: any) => (
            <Row
              key={index}
              style={{
                cursor: 'pointer',
                backgroundColor: notification.status === false ? '#FAF9FF' : '',
                // borderRadius: notification.status === false ? '5px' : '', // Apply a different background when status is false
              }}
              className={`mt-2 p-2 ${index !== notifyData.length - 1 ? 'border-bottom' : ''}`}
              onClick={() => handleRead(notification.id, true, notification)} // Pass notification details to handleRead
            >
              <Col span={2} className={Styles.notification_avatar}>
                {getInitials(notification.role)}
              </Col>
              <Col span={15}>
                <div className={Styles.notification_user}>
                  {notification.userName}
                </div>
                <div className={Styles.notification_text}>
                  {notification.message}
                </div>
              </Col>
              <Col span={5} className="ms-3">
                <span className={Styles.notification_date}>
                  {formatDate(notification.createdOn)}
                </span>
                {notification.status === false && (
                  <span
                    style={{
                      height: '8px',
                      width: '8px',
                      backgroundColor: '#0D304A', // Blue color
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginLeft: '5px',
                    }}
                  />
                )}
              </Col>
            </Row>
          ))}
        </Card>
      ) : (
        // Card for when notifList is empty
        <Card className={Styles.notFoundwrap}>
          <Row style={{ cursor: 'pointer', textAlign: 'center' }}>
            <Col span={24}>
              <span className={Styles.notification_text}>
                Notifications Not Found
              </span>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
}
