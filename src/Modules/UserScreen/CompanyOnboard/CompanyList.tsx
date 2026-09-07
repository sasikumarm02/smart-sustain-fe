import React, { useEffect, useState } from 'react';
import { Row, Col, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { get, put } from '../../../Services';
import { useNotification } from '../../../Hooks/useNotification';
import styles from '../../../Modules/UserScreen/Logins/login.module.scss';
import smartLogo from '../../../assets/SustainLogoSvg.svg';
import loginBg from '../../../assets/sustainSVG.svg';
import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import { isNumber } from 'lodash';
import { useAuth } from '../../../Hooks/useAuth';
import { useSelector } from 'react-redux';

const { Option } = Select;

const CompanyList = () => {
  const { openToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [entityData, setEntityData] = useState<any[]>([]);
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState<
    number | undefined
  >(undefined);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<
    number | undefined
  >(undefined);
  const { selectuserRole } = useAuth();
  const [notificationResponse, setNotificationResponse] = useState<any[]>([]);
  const [notificationResponseCurrent, setNotificationResponseCurrent] =
    useState<any>({});

  const assesmentLevel = useSelector((state: any) => state.company);

  useEffect(() => {
    setIsLoading(true);
    get('/entity/getEntitiesListByUserId/')
      .then((res) => {
        if (res.response.status !== false) {
          setEntityData(res.response.data);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []); // Only runs once

  // Roles for the selected company
  const rolesForSelectedCompany =
    selectedCompanyIndex !== undefined && entityData[selectedCompanyIndex]
      ? entityData[selectedCompanyIndex].entity_Role || []
      : [];

  const onCompanyChange = (index: number) => {
    setSelectedCompanyIndex(index);
    setSelectedRoleIndex(undefined); // reset role when company changes
  };

  const onRoleChange = (index: number) => {
    setSelectedRoleIndex(index);
  };

  const handleContinue = () => {
    if (selectedCompanyIndex === undefined || selectedRoleIndex === undefined)
      return;

    const company = entityData[selectedCompanyIndex];
    const role = company.entity_Role[selectedRoleIndex];

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      selectuserRole(company, role);
    }, 1000);
  };

  const fetchData = (apiUrl: any) => {
    setIsLoading(true);
    get(apiUrl)
      .then((res) => {
        if (res.response.status !== false) {
          setEntityData(res.response.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData('/entity/getEntitiesListByUserId/');
  }, []);

  const fetchNotification = async () => {
    try {
      const res = await get('/invite/accept_reject_notification/');
      if (
        (res?.status).trim().toLowerCase() === 'success' &&
        res?.response?.data
      ) {
        setNotificationResponse(res?.response?.data);
        const resData = res?.response?.data;
        const filterRes = resData.filter(
          (e: any) =>
            e?.status !== 'Accepted' &&
            e?.status !== 'Rejected' &&
            e?.action_type === 'Invited'
        );
        setNotificationResponse(filterRes);
        if (filterRes?.length > 0) {
          setNotificationResponseCurrent(filterRes[0]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const removeObjectByKey = (array: any, key: string, value: string) => {
    const index = array.findIndex((obj: any) => obj[key] === value);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  };

  const handleAcceptReject = async (action: string, invitation_id: string) => {
    if (action !== 'removeItem') {
      try {
        const res = await put(`/invite/accept_reject_action/`, {
          invitation_id: invitation_id,
          status: action,
        });

        if (res?.status.trim().toLowerCase() === 'success' && res?.message) {
          openToast({
            content: `${res.message}`,
            type: 'success',
          });
          fetchData('/entity/getEntitiesListByUserId/');
          fetchNotification();

          // Remove the notification from the current state
          const updatedNotifications = notificationResponse.filter(
            (notification: any) => notification.invitationId !== invitation_id
          );

          setNotificationResponse(updatedNotifications);

          // Set the next notification to display
          setNotificationResponseCurrent(updatedNotifications[0] || {});

          // No need to re-fetch the page
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Handle item removal without API call
      const updatedNotifications = removeObjectByKey(
        notificationResponse,
        'invitationId',
        invitation_id
      );
      setNotificationResponse(updatedNotifications);
      setNotificationResponseCurrent(updatedNotifications[0] || {});
    }
  };

  return (
    <div style={{ height: '100vh', background: '#fff' }}>
      <Row style={{ height: '100vh' }}>
        <Col
          span={12}
          style={{
            position: 'relative',
            backgroundColor: '#0D304A', // or your dark blue color
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '100vh',
          }}
        />

        <Col
          span={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Row
            justify="center"
            className="mt-5"
            style={{ marginLeft: '130px' }}
          >
            {notificationResponseCurrent?.invitationId !== undefined && (
              <Col span={24} key={notificationResponseCurrent?.invitationId}>
                <div
                  key={notificationResponseCurrent?.invitationId}
                  className={styles.notificationCompanyList}
                >
                  <Row>
                    <Col span={14}>
                      <Row>
                        <div className={styles.notificationHeader}>
                          <span>
                            {notificationResponseCurrent?.entity_Role}
                          </span>
                        </div>
                      </Row>
                      <Row>
                        <div className={styles.notificationText}>
                          <span>{notificationResponseCurrent?.message}</span>
                        </div>
                      </Row>
                    </Col>
                    <Col span={10}>
                      <Row
                        align="middle"
                        justify="end"
                        gutter={4}
                        className="mt-2"
                      >
                        <Col>
                          <ButtonComponent
                            size="sm"
                            onClick={() =>
                              handleAcceptReject(
                                'Rejected',
                                notificationResponseCurrent?.invitationId
                              )
                            }
                            className={styles.closeButton}
                            hierarchy="secondary"
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
                                notificationResponseCurrent?.invitationId
                              )
                            }
                          >
                            Accept
                          </ButtonComponent>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                {notificationResponse?.length > 1 && (
                  <div className={styles.notificationCompanyListMore}> </div>
                )}
              </Col>
            )}
          </Row>

          <div style={{ flex: 1 }} className={styles.formBody}>
            <Row>
              <img
                src={smartLogo}
                alt="Smart Logo"
                style={{ height: '40px' }}
              />
            </Row>

            <Row>
              <span className={styles.loginHeading}>
                Sustainability Measurement And Reporting Tool(SMART)
              </span>
            </Row>

            <div className={styles.formlabel}>Company</div>
            <Select
              style={{ width: '100%', height: '50px' }}
              placeholder="Select a company"
              value={selectedCompanyIndex}
              onChange={onCompanyChange}
              optionLabelProp="label"
              showSearch
            >
              {entityData.map((company, index) => (
                <Option
                  key={company.entity_Id}
                  value={index}
                  label={company.entity_name.trim()}
                >
                  {company.entity_name.trim()}
                </Option>
              ))}
            </Select>

            <div style={{ marginTop: 20 }} className={styles.formlabel}>
              Role
            </div>
            <Select
              style={{ width: '100%', height: '50px' }}
              placeholder="Select a role"
              value={selectedRoleIndex}
              onChange={onRoleChange}
              optionLabelProp="label"
              showSearch
              disabled={rolesForSelectedCompany.length === 0}
            >
              {rolesForSelectedCompany.map((role: any, index: number) => {
                const roleLabel =
                  role.role_name === 'ESG_ASSURER'
                    ? 'WORKFLOW VIEWER'
                    : role.role_name.replace(/_/g, ' ');

                return (
                  <Option key={index} value={index} label={roleLabel}>
                    {roleLabel}
                  </Option>
                );
              })}
            </Select>

            <div style={{ marginTop: 20 }} className={styles.formlabel}>
              Kindly ensure that roles are assigned by the ADMIN before
              proceeding.
            </div>

            <Row justify="center" style={{ marginTop: '24px' }}>
              <ButtonComponent
                onClick={handleContinue}
                disabled={
                  !isNumber(selectedCompanyIndex) ||
                  !isNumber(selectedRoleIndex)
                }
                loading={isLoading}
              >
                Continue
              </ButtonComponent>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyList;
