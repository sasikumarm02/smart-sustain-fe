import { useEffect, useState } from 'react';
import { Row, Col, Spin, Button, Checkbox } from 'antd';
import Styles from './Setting.module.scss';
import {
  ButtonComponent,
  PageCardComponent,
  TabsComponent,
} from '../../DesignLibrary';
import NoDataImage from '../../assets/Svg/NoData';
import Style from '../../Modules/ReportingScreens/report.module.scss';
import { isEmpty } from '../../Utils/isEmpty';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CheckOutlined } from '@ant-design/icons';

interface CustomEF {
  entity_Id: string;
  financial_year: string;
  framework_Id: string;
  frameworks: string[];
  id: number;
  env_list: string[];
  social_list: string[];
  governance_list: string[];
  issb_sections: string[];
  scope1: string[];
  scope2: string[];
  scope3: string[];
  custom_ef: string[];
}

export default function ViewConfig() {
  const { user } = useAuth();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState<CustomEF | null>(null); // Initialize as null
  const [activeKey, setActiveKey] = useState('1');
  const location = useLocation();
  const navigate = useNavigate();
  const fullRecordData = location.state;

  const griTabData = [{ tab: 'GRI', key: '1' }];

  const issbTabData = [{ tab: 'ISSB', key: '1' }];

  const tabData = [
    { tab: 'GRI', key: '1' },
    { tab: 'ISSB', key: '2' },
  ];

  const handleTabChange = (key: any) => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (!isEmpty(fullRecordData)) {
      setData(fullRecordData); // Use the data received from the previous page
    }
  }, [fullRecordData]);
  const MainTabData = [
    { tab: 'ESG Framework Selection', key: '1' },
    { tab: 'Emission Factor Database', key: '2' },
  ];
  const [mainTabKey, setMainTabKey] = useState('1');
  const handleMainTabChange = (key: any) => {
    setMainTabKey(key);
    setActiveKey('1');
  };
  return (
    <>
      <Spin spinning={loader}>
        {data === null ? ( // Check if data is null
          <Row justify="center" className="mt-4 mb-4">
            <Col span={22}>
              <PageCardComponent>
                <div className="text-center p-4">
                  <NoDataImage />
                </div>
                <p className={Style.dataNotFoundDesc}>
                  The configuration for this company has not been completed yet.
                  <br />
                  Please visit the ESG Configuration page to complete the
                  configuration.
                </p>
              </PageCardComponent>
            </Col>
          </Row>
        ) : (
          <PageCardComponent className={Styles.pageCardStyle}>
            <Row justify="start" gutter={12}>
              <Col span={24}>
                <div className={Styles.viewConfigTitle}>
                  ESG Framework for the Reporting Period
                </div>
                <Row justify="start">
                  <Col span={4}>
                    <div className={Styles.newConfigTitle}>
                      Reporting Period
                    </div>
                    <div className={Styles.paddingTop}>
                      {data.financial_year}
                    </div>
                  </Col>
                  <Col span={4}>
                    <div className={Styles.newConfigTitle}>Framework</div>
                    <div className={Styles.paddingTop}>
                      {Array.isArray(data.frameworks) &&
                      data.frameworks.length > 0
                        ? data.frameworks.join(', ')
                        : data.frameworks}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <TabsComponent
                    tabs={MainTabData}
                    defaultActiveKey={mainTabKey}
                    onChange={handleMainTabChange}
                  />

                  {mainTabKey === '1' && (
                    <Col span={24}>
                      {data.frameworks && data.frameworks.length > 1 ? (
                        <>
                          <TabsComponent
                            tabs={tabData}
                            defaultActiveKey={activeKey}
                            onChange={handleTabChange}
                          />

                          {activeKey === '1' && (
                            <>
                              <p className={Styles.newConfigTitle}>
                                Selected ESG material topics for the Company
                              </p>
                              <Row>
                                {[
                                  data.env_list,
                                  data.social_list,
                                  data.governance_list,
                                ].map((element: any, index: number) => (
                                  <Col
                                    lg={8}
                                    md={12}
                                    sm={24}
                                    xs={24}
                                    key={index}
                                  >
                                    <div className="mb-3">
                                      <p className={Styles.newConfigTitleTwo}>
                                        {index === 0
                                          ? 'Environment'
                                          : index === 1
                                            ? 'Social'
                                            : 'Governance'}
                                      </p>
                                    </div>
                                    {element.map((item: any, index: number) => (
                                      <p key={index}>
                                        <Checkbox checked={true} />
                                        &nbsp;
                                        <span>{item}</span>
                                      </p>
                                    ))}
                                  </Col>
                                ))}
                              </Row>
                            </>
                          )}

                          {activeKey === '2' && (
                            <>
                              <p className={Styles.newConfigTitle}>
                                Selected ISSB topics
                              </p>
                              <Row>
                                {data.issb_sections.length > 0 &&
                                  // Split the array into chunks of 3
                                  data.issb_sections
                                    .reduce(
                                      (
                                        resultArray: any[],
                                        item: any,
                                        index: number
                                      ) => {
                                        const chunkIndex = Math.floor(
                                          index / 3
                                        );

                                        if (!resultArray[chunkIndex]) {
                                          resultArray[chunkIndex] = []; // Start a new chunk
                                        }
                                        resultArray[chunkIndex].push(item);

                                        return resultArray;
                                      },
                                      []
                                    )
                                    .map((chunk: any[], colIndex: number) => (
                                      <Col
                                        lg={8}
                                        md={12}
                                        sm={24}
                                        xs={24}
                                        key={colIndex}
                                      >
                                        {chunk.map(
                                          (item: any, index: number) => (
                                            <p key={index}>
                                              <Checkbox checked={true} />
                                              &nbsp;
                                              <span>{item}</span>
                                            </p>
                                          )
                                        )}
                                      </Col>
                                    ))}
                              </Row>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {data.frameworks.includes('GRI') && (
                            <>
                              <TabsComponent
                                tabs={griTabData}
                                defaultActiveKey={activeKey}
                                onChange={handleTabChange}
                              />
                              {activeKey === '1' && (
                                <>
                                  <p className={Styles.newConfigTitle}>
                                    Selected ESG material topics for the Company
                                  </p>
                                  <Row>
                                    {[
                                      data.env_list,
                                      data.social_list,
                                      data.governance_list,
                                    ].map((element: any, index: number) => (
                                      <Col
                                        lg={8}
                                        md={12}
                                        sm={24}
                                        xs={24}
                                        key={index}
                                      >
                                        <div className="mb-3">
                                          <p
                                            className={Styles.newConfigTitleTwo}
                                          >
                                            {index === 0
                                              ? 'Environment'
                                              : index === 1
                                                ? 'Social'
                                                : 'Governance'}
                                          </p>
                                        </div>
                                        {element.map(
                                          (item: any, index: number) => (
                                            <p key={index}>
                                              <Checkbox checked={true} />
                                              &nbsp;
                                              <span>{item}</span>
                                            </p>
                                          )
                                        )}
                                      </Col>
                                    ))}
                                  </Row>
                                </>
                              )}
                            </>
                          )}

                          {data.frameworks.includes('ISSB') && (
                            <>
                              <TabsComponent
                                tabs={issbTabData}
                                defaultActiveKey="1"
                                onChange={handleTabChange}
                              />
                              {activeKey === '1' && (
                                <>
                                  <p className={Styles.newConfigTitle}>
                                    Selected ISSB topics
                                  </p>
                                  <Row>
                                    {data.issb_sections.length > 0 &&
                                      // Split the array into chunks of 3
                                      data.issb_sections
                                        .reduce(
                                          (
                                            resultArray: any[],
                                            item: any,
                                            index: number
                                          ) => {
                                            const chunkIndex = Math.floor(
                                              index / 3
                                            );

                                            if (!resultArray[chunkIndex]) {
                                              resultArray[chunkIndex] = []; // Start a new chunk
                                            }
                                            resultArray[chunkIndex].push(item);

                                            return resultArray;
                                          },
                                          []
                                        )
                                        .map(
                                          (chunk: any[], colIndex: number) => (
                                            <Col
                                              lg={8}
                                              md={12}
                                              sm={24}
                                              xs={24}
                                              key={colIndex}
                                            >
                                              {chunk.map(
                                                (item: any, index: number) => (
                                                  <p key={index}>
                                                    <Checkbox checked={true} />
                                                    &nbsp;
                                                    <span>{item}</span>
                                                  </p>
                                                )
                                              )}
                                            </Col>
                                          )
                                        )}
                                  </Row>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </Col>
                  )}
                  {mainTabKey === '2' && (
                    <>
                      <div style={{ display: 'block', width: '100%' }}>
                        <Row>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <p className={Styles.newConfigTitle}>
                              Selected Emission Factor Database as per the
                              Emission Type
                            </p>
                            <div>
                              <Row gutter={16}>
                                {/* Conditionally rendering each scope based on data availability */}
                                {data.scope1 && data.scope1.length > 0 && (
                                  <Col lg={24} md={24} sm={24} xs={24}>
                                    <p className={Styles.newConfigTitleTwo}>
                                      Scope 1
                                    </p>
                                    {data.scope1.map((itemValue) => {
                                      const match = itemValue.match(
                                        /^(.*)\((\d{4})-\d{4}\)$/
                                      );
                                      const displayValue = match
                                        ? `${match[1].trim()} ${match[2]}`
                                        : itemValue;
                                      return (
                                        <Button
                                          key={itemValue}
                                          className={Styles.selectedPreview}
                                        >
                                          {
                                            <span
                                              className={Styles.selectedTick}
                                            >
                                              <CheckOutlined />
                                            </span>
                                          }
                                          {displayValue}
                                        </Button>
                                      );
                                    })}
                                  </Col>
                                )}

                                {data.scope2 && data.scope2.length > 0 && (
                                  <Col lg={24} md={24} sm={24} xs={24}>
                                    <p className={Styles.newConfigTitleTwo}>
                                      Scope 2
                                    </p>
                                    {data.scope2.map((itemValue) => {
                                      const match = itemValue.match(
                                        /^(.*)\((\d{4})-\d{4}\)$/
                                      );
                                      const displayValue = match
                                        ? `${match[1].trim()} ${match[2]}`
                                        : itemValue;
                                      return (
                                        <Button
                                          key={itemValue}
                                          className={Styles.selectedPreview}
                                        >
                                          {
                                            <span
                                              className={Styles.selectedTick}
                                            >
                                              <CheckOutlined />
                                            </span>
                                          }
                                          {displayValue}
                                        </Button>
                                      );
                                    })}
                                  </Col>
                                )}

                                {data.scope3 && data.scope3.length > 0 && (
                                  <Col lg={24} md={24} sm={24} xs={24}>
                                    <p className={Styles.newConfigTitleTwo}>
                                      Scope 3
                                    </p>
                                    {data.scope3.map((itemValue) => {
                                      const match = itemValue.match(
                                        /^(.*)\((\d{4})-\d{4}\)$/
                                      );
                                      const displayValue = match
                                        ? `${match[1].trim()} ${match[2]}`
                                        : itemValue;
                                      return (
                                        <Button
                                          key={itemValue}
                                          className={Styles.selectedPreview}
                                        >
                                          {
                                            <span
                                              className={Styles.selectedTick}
                                            >
                                              <CheckOutlined />
                                            </span>
                                          }
                                          {displayValue}
                                        </Button>
                                      );
                                    })}
                                  </Col>
                                )}

                                {data.custom_ef &&
                                  data.custom_ef.length > 0 && (
                                    <Col lg={24} md={24} sm={24} xs={24}>
                                      <p className={Styles.newConfigTitleTwo}>
                                        Custom Emission
                                      </p>
                                      {data.custom_ef.map((itemValue) => (
                                        <Button
                                          key={itemValue}
                                          className={Styles.selectedPreview}
                                        >
                                          {
                                            <span
                                              className={Styles.selectedTick}
                                            >
                                              <CheckOutlined />
                                            </span>
                                          }
                                          Custom EF
                                        </Button>
                                      ))}
                                    </Col>
                                  )}
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </>
                  )}
                </Row>
              </Col>
            </Row>
            <Row justify="end">
              <ButtonComponent
                hierarchy="secondary-gray"
                size="xl"
                onClick={() => navigate('/view-config-table')}
              >
                Back
              </ButtonComponent>
            </Row>
          </PageCardComponent>
        )}
      </Spin>
    </>
  );
}
