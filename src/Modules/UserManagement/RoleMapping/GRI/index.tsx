import { Col, Flex, Row } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TabsComponent,
} from '../../../../DesignLibrary';
import { useEffect, useState } from 'react';
import DataProvider from './DataProvider';
import DataReviewer from './DataReviewer';
import DataApprover from './DataApprover';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { apiBaseUrl, get } from '../../../../Services';
import { useAuth } from '../../../../Hooks/useAuth';
import Styles from '../mapping.module.scss';
import { isEmpty } from '../../../../Utils/isEmpty';

const ReportingComplianceMapping = () => {
  const tabData = [
    { tab: 'Data Provider', key: '1' },
    { tab: 'Data Reviewer', key: '2' },
    { tab: 'Data Approver', key: '3' },
  ];

  const handleTabChange = async (key: any) => {
    setActiveKey(key);
    let urlForList;
    const entityId = user?.entity_Id;
    switch (key) {
      case '1':
        urlForList = `${apiBaseUrl}/user/GRI_DP_LIST/?entity_Id=${entityId}`;
        break;
      case '2':
        urlForList = `${apiBaseUrl}/user/GRI_DR_LIST/?entity_Id=${entityId}`;
        break;
      case '3':
        urlForList = `${apiBaseUrl}/user/GRI_DA_LIST/?entity_Id=${entityId}`;
        break;
      default:
        urlForList = `${apiBaseUrl}/user/GRI_DA_LIST/?entity_Id=${entityId}`;
        break;
    }
    try {
      setloading(true);
      const response = await get(urlForList);
      const data = response?.response?.data;
      setCurrentData(data);
      if (key === '3') {
        setCurrentApproverData(data);
      }
      if (key === '2') {
        setCurrentReviewerData(data);
      }
      if (key === '1') {
        setCurrentProviderData(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const [currentData, setCurrentData] = useState([{}]);
  const [currentApproverData, setCurrentApproverData] = useState<any>([{}]);
  const [currentReviewerData, setCurrentReviewerData] = useState<any>([{}]);
  const [currentProviderData, setCurrentProviderData] = useState<any>([{}]);
  const [Alldata, setAllData] = useState([{}]);
  const [loading, setloading] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const currentActiveKey = location?.state?.currentTab;
  const [activeKey, setActiveKey] = useState(
    currentActiveKey ? currentActiveKey : '1'
  );

  useEffect(() => {
    handleTabChange(activeKey);
  }, [activeKey]);

  const navigate = useNavigate();

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row justify="space-between" align="middle" gutter={12}>
          <Col lg={20} md={18}>
            <TabsComponent
              tabs={tabData}
              className={Styles.tabMargin}
              activeKey={activeKey}
              onChange={handleTabChange}
            />
          </Col>
          <Col lg={4} md={6}>
            <Flex justify="end" align="middle">
              {activeKey === '3' &&
              currentApproverData[0] &&
              currentApproverData[0]?.L1 &&
              currentApproverData[0]?.L1?.length > 0 &&
              currentApproverData[0]?.target_date &&
              !isEmpty(currentApproverData[0]?.target_date) ? (
                ''
              ) : (
                <ButtonComponent
                  className={Styles?.mapBtnUser}
                  hierarchy="secondary-gray"
                  onClick={() => {
                    navigate('/map-user-compliance', {
                      state: { activeKey, data: Alldata },
                    });
                  }}
                >
                  Map User
                </ButtonComponent>
              )}
            </Flex>
          </Col>
        </Row>
        {activeKey === '3' && (
          <DataApprover
            data={currentApproverData}
            loading={loading}
            tabKey={activeKey}
          />
        )}
        {activeKey === '2' && (
          <DataReviewer
            data={currentReviewerData}
            loading={loading}
            tabKey={activeKey}
          />
        )}
        {activeKey === '1' && (
          <DataProvider
            data={currentProviderData}
            loading={loading}
            tabKey={activeKey}
          />
        )}
      </PageCardComponent>
    </>
  );
};

export default ReportingComplianceMapping;
