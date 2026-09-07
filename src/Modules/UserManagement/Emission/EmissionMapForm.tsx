import { Col, Row } from 'antd';
import { PageCardComponent, TabsComponent } from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useState } from 'react';
import ApproverMapping from './ApproverMapping';
import Reviewermapping from './ReviewerMapping';
import ProviderMapping from './ProviderMapping';
import { useLocation } from 'react-router-dom';

const EmissionMapForm = () => {
  const location = useLocation();

  const tabData = [
    { tab: 'Data Provider', key: '1' },
    { tab: 'Data Reviewer', key: '2' },
    { tab: 'Data Approver', key: '3' },
  ];

  const [activeKey, setActiveKey] = useState(location?.state || tabData[0].key);
  const [approverCheck, setApproverCheck] = useState<boolean>(false);

  const handleTabChange = (key: any) => {
    setActiveKey(key);
    if (key === '2' || key === '3') {
      setApproverCheck(false);
    }
  };

  const components: { [key: string]: React.ReactNode } = {
    '1': <ProviderMapping tabkey={activeKey} />,
    '2': <Reviewermapping tabkey={activeKey} />,
    '3': <ApproverMapping tabkey={activeKey} />,
  };

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row justify="space-between">
          <Col lg={13} style={{ zIndex: 999999 }}>
            <TabsComponent
              className={Styles.tabMargin}
              tabs={tabData}
              activeKey={activeKey}
              defaultActiveKey={activeKey}
              onChange={handleTabChange}
            />
          </Col>
          <Col span={24}>{components[activeKey]}</Col>
        </Row>
      </PageCardComponent>
    </>
  );
};

export default EmissionMapForm;
