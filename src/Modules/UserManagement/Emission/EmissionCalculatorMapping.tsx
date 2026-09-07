import { Col, Flex, Row } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TabsComponent,
} from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useEffect, useState } from 'react';
import DataProvider from './DataProvider';
import DataReviewer from './DataReviewer';
import DataApprover from './DataApprover';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import { apiBaseUrl, get } from '../../../Services';

const EmissionCalculatorMapping = () => {
  const location = useLocation();
  const tabData = [
    { tab: 'Data Provider', key: '1' },
    { tab: 'Data Reviewer', key: '2' },
    { tab: 'Data Approver', key: '3' },
  ];

  const handleTabChange = (key: any) => {
    setActiveKey(key);
    setDisableMapUser(false);
  };

  const [CurrentData, setCurrentData] = useState([{}]);
  const [Alldata, setAllData] = useState([{}]);
  const [loading, setloading] = useState(false);
  const { user } = useAuth();
  const [activeKey, setActiveKey] = useState(location?.state || tabData[0].key);
  const [disableMapUser, setDisableMapUser] = useState(false);

  const components: { [key: string]: React.ReactNode } = {
    '1': (
      <DataProvider data={CurrentData} loading={loading} tabkey={activeKey} />
    ),
    '2': (
      <DataReviewer data={CurrentData} loading={loading} tabkey={activeKey} />
    ),
    '3': (
      <DataApprover data={CurrentData} loading={loading} tabkey={activeKey} />
    ),
  };

  const getApiData = async () => {
    try {
      setloading(true);
      const response = await get(
        `${apiBaseUrl}/user/Emission_user_${activeKey === '1' ? 'DP' : 'DR_DA'}?entity_Id=${user.entity_Id}${activeKey === '2' ? `&role=DATA_REVIEWER` : activeKey === '3' ? `&role=DATA_APPROVER` : ''}`
      );
      const data = response?.response?.data;
      const dpData = response?.response;
      if (activeKey === '1') {
        setCurrentData(dpData?.mapped_users);
      } else {
        setCurrentData(data);
        if (data[0]?.L1?.length > 0) {
          setDisableMapUser(true);
        }
      }
      setAllData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    getApiData();
  }, [activeKey]);

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row justify="space-between" align="top" gutter={12}>
          <Col lg={20} md={18}>
            <TabsComponent
              tabs={tabData}
              className={Styles.tabMargin}
              defaultActiveKey={activeKey}
              onChange={handleTabChange}
            />
          </Col>
          {!disableMapUser && (
            <Col lg={4} md={6}>
              <Flex justify="end" align="middle">
                <ButtonComponent
                  hierarchy="secondary-gray"
                  onClick={() => {
                    navigate('/user-mapping-emission', {
                      state: activeKey,
                    });
                  }}
                >
                  Map User
                </ButtonComponent>
              </Flex>
            </Col>
          )}
        </Row>
        <div>{components[activeKey]}</div>
      </PageCardComponent>
    </>
  );
};

export default EmissionCalculatorMapping;
