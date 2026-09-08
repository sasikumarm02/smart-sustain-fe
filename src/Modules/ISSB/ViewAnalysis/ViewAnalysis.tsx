import React, { useEffect, useState } from 'react';
import Styles from './ViewAnalysis.module.scss';
import { Col, Row, Spin, Tabs, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { get } from '../../../Services';
import DonutCard from './DonutCard';
import { useAuth } from '../../../Hooks/useAuth';
import PageCardComponent from '../../../DesignLibrary/PageCardComponent';
import IssbPdf from './IssbPdf';
const ViewAnalysis = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [activeTab, setActiveTab] = useState('s1');
  const { user } = useAuth();
  const [isDownload, setIsDownload] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    get(`/issb/get_gap_analysis/?entity_Id=${user?.entity_Id}`)
      .then((res: any) => {
        const transformedData = transformData(res?.response?.data);
        setDataSource(transformedData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false); // <- Move here to handle both success and failure
      });
  };

  const transformData = (data: any) => {
    return Object.keys(data).map((topic) => ({
      key: topic,
      topic: capitalizeWords(topic),
      s1: {
        Requirement_met: data[topic]?.S1?.Requirement_met || 0,
        Requirement_not_met: data[topic]?.S1?.Requirement_not_met || 0,
        Requirement_partially_met:
          data[topic]?.S1?.Requirement_partially_met || 0,
        Not_disclosure_requirement:
          data[topic]?.S1?.Not_disclosure_requirement || 0,
      },
      s2: {
        Requirement_met: data[topic]?.S2?.Requirement_met || 0,
        Requirement_not_met: data[topic]?.S2?.Requirement_not_met || 0,
        Requirement_partially_met:
          data[topic]?.S2?.Requirement_partially_met || 0,
        Not_disclosure_requirement:
          data[topic]?.S2?.Not_disclosure_requirement || 0,
      },
    }));
  };

  const capitalizeWords = (str: string) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleChildClick = (flag: any) => {
    setIsClicked(flag);
  };

  const topicCounts: Record<string, number> = {
    Objective: 6,
    Scope: 7,
    'Conceptual Foundations': 18,
    'Core Content': 164,
    'General Requirements': 31,
    'Judgements Uncertainties And Errors': 16,
    'Effective Date': 4,
    Transition: 7,
    'Application Guidance': 170,
  };

  return (
    <PageCardComponent className={Styles.pageCardStyle}>
      <Spin spinning={isLoading}>
        <div className={Styles.pageContainer}>
          <Row justify="start" gutter={[24, 24]}>
            <Col xs={24} md={24} lg={12}>
              {/* You can place the title or filters here */}
            </Col>

            <Col xs={24} md={24} lg={12}>
              <div className="d-flex justify-content-end gap-4">
                <IssbPdf />
              </div>
            </Col>
          </Row>

          <Tabs
            className={Styles.tabs}
            activeKey={activeTab}
            onChange={setActiveTab}
          >
            <Tabs.TabPane tab="Scope 1" key="s1">
              {/* Display the legend only once */}
              <div className={Styles.legend}>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#036323' }}
                  ></div>
                  <div className={Styles.legendLabel}>Requirement Met</div>
                </div>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#91B4FF' }}
                  ></div>
                  <div className={Styles.legendLabel}>Partially Met</div>
                </div>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#B16104' }}
                  ></div>
                  <div className={Styles.legendLabel}>Not Met</div>
                </div>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#43596F' }}
                  ></div>
                  <div className={Styles.legendLabel}>No DR</div>
                </div>
              </div>

              <div className={Styles.gridWrapper}>
                {dataSource.map((item: any) => (
                  <DonutCard
                    key={item.key}
                    title={item.topic}
                    sectionData={item.s1}
                  />
                ))}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Scope 2" key="s2">
              {/* Display the legend only once */}
              <div className={Styles.legend}>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#036323' }}
                  ></div>
                  <div className={Styles.legendLabel}>Requirement Met</div>
                </div>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#91B4FF' }}
                  ></div>
                  <div className={Styles.legendLabel}>Partially Met</div>
                </div>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#B16104' }}
                  ></div>
                  <div className={Styles.legendLabel}>Not Met</div>
                </div>
                <div className={Styles.legendItem}>
                  <div
                    className={Styles.legendColor}
                    style={{ backgroundColor: '#43596F' }}
                  ></div>
                  <div className={Styles.legendLabel}>No DR</div>
                </div>
              </div>

              <div className={Styles.gridWrapper}>
                {dataSource.map((item: any) => (
                  <DonutCard
                    key={item.key}
                    title={item.topic}
                    sectionData={item.s2}
                  />
                ))}
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Spin>
    </PageCardComponent>
  );
};

export default ViewAnalysis;
