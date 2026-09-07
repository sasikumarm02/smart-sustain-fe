import { useEffect, useState } from 'react';

import {
  ModalComponent,
  PageCardComponent,
  TabsComponent,
} from '../../DesignLibrary';
import { Col, Flex, Row } from 'antd';
import Styles from '../../Modules/ReportingScreens/report.module.scss';
import TotalCaronEmission from './TotalCarbon';
import ScopeOne from './ScopeOne';
import ScopeThree from './ScopeThree';
import ScopeTwo from './ScopeTwo';
import EmissionPdf from '../ReportPdf/EmissionPdf';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { message as notificationMessage } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentYear } from '../Emissions/Scope3/Helpers';
const CustomCarbonTable = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const components: { [key: string]: React.ReactNode } = {
    '1': <TotalCaronEmission data={data} loading={isLoading} />,
    '2': <ScopeOne data={data} loading={isLoading} />,
    '3': <ScopeTwo data={data} loading={isLoading} />,
    '4': <ScopeThree data={data} loading={isLoading} />,
  };

  const tabData = [
    { tab: 'Total Carbon Emission', key: '1' },
    { tab: 'Scope 1', key: '2' },
    { tab: 'Scope 2', key: '3' },
    { tab: 'Scope 3', key: '4' },
  ];

  const [activeKey, setActiveKey] = useState(tabData[0].key);

  const fetchData = (apiUrl: any) => {
    if (apiUrl && (apiUrl !== undefined || apiUrl !== null || apiUrl !== '')) {
      setIsLoading(true);
      get(apiUrl)
        .then((res: any) => {
          if (res?.response?.status !== false) {
            setData(res?.response?.data);
          } else {
            setData([]);
            notificationMessage.warning(res?.message);
          }
          setIsLoading(false);
        })
        .catch((err: any) => {
          setData([]);
          notificationMessage.error(err.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const scopeValue = ['', 'Scope1', 'Scope2', 'Scope3'];

  const handleTabChange = (key: any) => {
    setActiveKey(key);
    fetchData(
      `/Emissions/fetch-overall-emissions/?entity_Id=${user.entity_Id}&scope=${
        scopeValue[parseInt(key) - 1]
      }`
    );
  };

  useEffect(() => {
    fetchData(
      `/Emissions/fetch-overall-emissions/?entity_Id=${user.entity_Id}`
    );
  }, []);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row justify="space-between" align="middle" gutter={12}>
          <Col lg={13}>
            <TabsComponent
              tabs={tabData}
              defaultActiveKey="1"
              onChange={handleTabChange}
            />
          </Col>
          <Col lg={10}>
            {/* <Select value="Reporting Period FY2024-25"></Select> */}
            <Flex justify="end">
              <EmissionPdf />
            </Flex>
          </Col>
        </Row>
        <div className="tabContent">{components[activeKey]}</div>
      </PageCardComponent>
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

export default CustomCarbonTable;
