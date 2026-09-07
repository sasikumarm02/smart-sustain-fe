import React, { useState } from 'react';
import { Tabs, Row, Col, Card, Radio } from 'antd';
import Styles from './Setting.module.scss';
import CustomInput from '../FormInput/CustomInput';

const { TabPane } = Tabs;
interface Values {}
const TargetSetting = ({
  environmentalTargets,
  socialTargets,
  errors,
  handleChange,
  handleBlur,
  touched,
  values,
}: any) => {
  const [targetValues, setTargetValues] = useState<{ [key: string]: string }>(
    {}
  ); // State to hold target values
  const [radioValue, setRadioValue] = useState('year'); // State for radio value
  const handleTargetChange = (targetName: string, value: string) => {
    setTargetValues((prevValues) => ({
      ...prevValues,
      [targetName]: value,
    }));
  };

  const handleDurationChange = (e: any) => {
    setRadioValue(e.target.value);
  };

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <>
      {/* <Row>
        <Col span={12}>
          <Radio.Group
            onChange={handleDurationChange}
            value={radioValue}
            className="targetRadio"
          >
            <Radio value="year">Year Wise</Radio>
            <Radio value="month">Month Wise</Radio>
          </Radio.Group>
        </Col>
      </Row> */}
      <Tabs defaultActiveKey="1" className="esgTabs">
        {radioValue === 'year' ? (
          <>
            <TabPane tab="Environmental Targets" key="1">
              <Card>
                <Row>
                  <Col span={12}>
                    <p className={Styles.tabDataColHead}>
                      Environmental Targets
                    </p>
                  </Col>
                  <Col
                    span={12}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <p className={Styles.tabDataColHead}>Target</p>
                  </Col>
                </Row>
                {environmentalTargets.map((target: any, index: any) => (
                  <Row key={index}>
                    <Col span={12}>
                      <p className={Styles.tabDataTargets}>{target}</p>
                    </Col>

                    <Col
                      span={12}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      {/* <p>
                        <input
                          value={targetValues[target.label] || ""}
                          onChange={(e) =>
                            handleTargetChange(target, e.target.value)
                          }
                          placeholder="Target"
                          className={Styles.esgTabTargetInput}
                        />
                      </p> */}
                      <CustomInput
                        size="large"
                        name={`quantity-${index}`}
                        type="text"
                        errors={
                          touched[`quantity-${index}` as keyof Values] &&
                          errors[`quantity-${index}` as keyof Values]
                        }
                        touched={touched}
                        value={
                          values[`quantity-${index}` as keyof Values] || ''
                        }
                        hook={handleChange}
                        blur={handleBlur}
                        status={
                          (touched[`quantity-${index}` as keyof Values] &&
                            errors[`quantity-${index}` as keyof Values] &&
                            'error') ||
                          ''
                        }
                      />
                    </Col>
                  </Row>
                ))}
              </Card>
            </TabPane>
            <TabPane tab="Social Targets" key="2">
              <Card>
                <Row>
                  <Col span={12}>
                    <p className={Styles.tabDataColHead}>
                      Social Targets ( In Percentage )
                    </p>
                  </Col>
                  <Col
                    span={12}
                    style={{ display: 'flex', justifyContent: 'end' }}
                  >
                    <p className={Styles.tabDataColHead}>Target</p>
                  </Col>
                </Row>
                {socialTargets.map((target: any, index: any) => (
                  <Row key={index}>
                    <Col span={12}>
                      <p className={Styles.tabDataColHead}>{target.label}</p>
                    </Col>
                    <Col
                      span={12}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      <p>
                        <input
                          value={targetValues[target.label] || ''}
                          onChange={(e) =>
                            handleTargetChange(target.label, e.target.value)
                          }
                          placeholder="Target"
                          className={Styles.esgTabTargetInput}
                        />
                      </p>
                    </Col>
                  </Row>
                ))}
              </Card>
            </TabPane>
          </>
        ) : (
          <>
            <TabPane tab="Environmental Targets" key="1">
              <Card>
                <Row>
                  <Col span={4}>
                    <p className={Styles.tabDataColHead}>
                      Environmental Targets
                    </p>
                  </Col>
                  <Col span={20}>
                    <Row gutter={[10, 10]}>
                      {monthNames.map((monthName, index) => (
                        <Col span={2} key={index}>
                          <p className={Styles.tabDataColHead}>{monthName}</p>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
                {environmentalTargets.map((target: any, index: any) => (
                  <Row key={index}>
                    <Col span={4}>
                      <p className={Styles.tabDataColHead}>{target.label}</p>
                    </Col>
                    <Col span={20}>
                      <Row gutter={[10, 10]}>
                        {monthNames.map((monthName, index) => (
                          <Col span={2} key={index}>
                            <input
                              value={
                                targetValues[target.label + '_' + monthName] ||
                                ''
                              }
                              onChange={(e) =>
                                handleTargetChange(
                                  target.label + '_' + monthName,
                                  e.target.value
                                )
                              }
                              placeholder="Target"
                              className={Styles.esgTabTargetInput}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                ))}
              </Card>
            </TabPane>
            <TabPane tab="Social Targets" key="2">
              <Card>
                <Row>
                  <Col span={4}>
                    {' '}
                    <p className={Styles.tabDataColHead}>Social Targets</p>
                  </Col>
                  <Col span={20}>
                    <Row>
                      {monthNames.map((monthName, index) => (
                        <Col span={2} key={index}>
                          <p className={Styles.tabDataColHead}>{monthName}</p>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
                {socialTargets.map((target: any, index: any) => (
                  <Row key={index}>
                    <Col span={4}>
                      <p className={Styles.tabDataColHead}>{target.label}</p>
                    </Col>
                    <Col span={20}>
                      <Row gutter={[10, 10]}>
                        {monthNames.map((monthName, index) => (
                          <Col span={2} key={index}>
                            <input
                              value={
                                targetValues[target.label + '_' + monthName] ||
                                ''
                              }
                              onChange={(e) =>
                                handleTargetChange(
                                  target.label + '_' + monthName,
                                  e.target.value
                                )
                              }
                              placeholder="Target"
                              className={Styles.esgTabTargetInput}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                ))}
              </Card>
            </TabPane>
          </>
        )}
      </Tabs>
    </>
  );
};

export default TargetSetting;
