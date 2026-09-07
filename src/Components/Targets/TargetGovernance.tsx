import { useEffect, useState } from 'react';
import Styles from './targetScreens.module.scss';
import { Col, Row, Card, Input, message } from 'antd';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { Formik, Form } from 'formik';
import { get, post } from '../../Services';
import GovernanceDiversity from '../../assets/Svg/TargetSettings/GovernanceDiversity';
import GovernanceBoard from '../../assets/Svg/TargetSettings/GovernanceBoard';
import GovernanceCompliance from '../../assets/Svg/TargetSettings/GovernanceCompliance';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

function TargetGovernance() {
  const [governancetargets, setGovernancetargets] = useState<any[]>([]);

  const governanceBoard = ['Independent Directors'];
  const governanceAgegroup = ['Male', 'Female'];
  const governanceManagement = ['Male', 'Female'];
  const { user } = useAuth();

  const governanceCompliance = ['Non-compliance Incidents'];

  const initialValues = {
    board: governanceBoard.reduce(
      (acc: any, label: any) => ({
        ...acc,
        [label]: { percentage: '', target: '' },
      }),
      {}
    ),
    agegroup: governanceAgegroup.reduce(
      (acc: any, label: any) => ({
        ...acc,
        [label]: { percentage: '', target: '' },
      }),
      {}
    ),
    managementgroup: governanceManagement.reduce(
      (acc: any, label: any) => ({
        ...acc,
        [label]: { percentage: '', target: '' },
      }),
      {}
    ),
    compliance: governanceCompliance.reduce(
      (acc: any, label: any) => ({ ...acc, [label]: { target: '' } }),
      {}
    ),
  };

  const scope_array = [
    {
      svg: <GovernanceDiversity />,
      name: 'Board Independence',
      color: '#FD349C',
    },
    {
      svg: <GovernanceBoard />,
      name: 'Board Diversity',
      color: '#1E49E2',
    },
    {
      svg: <GovernanceCompliance />,
      name: 'Governance Compliance',
      color: '#00C0AE',
    },
  ];

  const transformValues = (values: any) => {
    const result = [
      {
        target_sub_category: 'independence',
        data: Object.keys(values.board).map((key) => ({
          'Board Independence': key,
          'Percentage Target (%)': values.board[key].percentage,
          Target: values.board[key].target,
        })),
      },
      {
        target_sub_category: 'boarddiversity',
        data: Object.keys(values.agegroup).map((key) => ({
          'Board Gender Diversity': key,
          'Percentage Target (%)': values.agegroup[key].percentage,
          Target: values.agegroup[key].target,
        })),
      },
      {
        target_sub_category: 'managementdiversity',
        data: Object.keys(values.managementgroup).map((key) => ({
          'Management Gender Diversity': key,
          'Percentage Target (%)': values.managementgroup[key].percentage,
          Target: values.managementgroup[key].target,
        })),
      },
      {
        target_sub_category: 'compliance',
        data: Object.keys(values.compliance).map((key) => ({
          'Governance Compliance': key,
          Target: values.compliance[key].target,
        })),
      },
    ];

    return result;
  };

  const handleGovernanceValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user.entity_Id,
      target_category: 'Governance Targets',
      sub_categories: transformValues(values),
    };

    post(`${path}`, body)
      .then((res) => {})
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  const handleGovernanceValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=Governance Targets`
    )
      .then((res) => {
        if (!isEmpty(res.response.data)) {
          setGovernancetargets(res.response.data);
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  useEffect(() => {
    if (user.role != 'ADMIN') {
      handleGovernanceValuesGetApi();
    }
  }, []);

  function getValuesByKey(key: any, data: any) {
    if (!isEmpty(data) && data.hasOwnProperty(key)) {
      return data[key];
    } else {
      return [];
    }
  }

  const handleKeyDown = (event: any) => {
    // Prevent scrolling with arrow keys, Page Up/Down, Home/End
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === '-'
    ) {
      event.preventDefault();
    }
  };

  const handleKeyDown2 = (event: any) => {
    // Prevent scrolling with arrow keys, Page Up/Down, Home/End
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === '-' ||
      event.key === '.' ||
      event.key === 'e' ||
      event.key === 'E'
    ) {
      event.preventDefault();
    }
  };

  const handleWheel = (event: any) => {
    // Prevent scrolling in the input field with mouse wheel
    event.preventDefault();
  };

  return (
    <div className={Styles.pageCardStyle}>
      {/* <Row className={Styles.targetHeader}>Governance Targets</Row> */}
      <PageCardComponent className={Styles.pageCard}>
        <Row className={Styles.targetSubTitle}>
          Promote strong corporate governance. Define targets for achieving
          gender diversity on your board and within management. Set goals for
          the number of independent directors and establish a clear vision for
          reducing corruption and non-compliance incidents.
        </Row>
        <Row gutter={24} className="mt-3">
          {scope_array.map((item, key) => (
            <Col span={8} key={key}>
              <Row
                gutter={8}
                style={{ backgroundColor: item.color }}
                className={Styles.container1}
              >
                <Col span={6}>{item.svg}</Col>
                <Col span={18} className={Styles.text1}>
                  {item.name}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            handleGovernanceValuesPostApi(values);
            message.success('Data added successfully');
          }}
        >
          {({ values, handleChange, resetForm }) => (
            <Form>
              <Row gutter={16} className="mt-3">
                <Col span={8}>
                  <Card className={Styles.cardsSocial}>
                    <Row>
                      <Col span={8}>
                        <p className={Styles.targetHeader2}>
                          Board Independence
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}>
                          Percentage Target (%)
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}>Target</p>
                      </Col>
                    </Row>
                    {!isEmpty(governanceBoard) &&
                      governanceBoard.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-scope1-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={8}>
                            <p>{data}</p>
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                name={`board.${data}.percentage`}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === '' ||
                                    (parseFloat(value) >= 0 &&
                                      parseFloat(value) <= 100)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                value={
                                  values.board[
                                    data as keyof typeof values.board
                                  ].percentage
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Percentage Target (%)',
                                    governancetargets[0]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Percentage Target (%)',
                                        governancetargets[0]?.data[index]
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            )}
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
                                name={`board.${data}.target`}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                value={
                                  values.board[
                                    data as keyof typeof values.board
                                  ].target
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <>
                                <p className={Styles.displayTextGHG}>
                                  {!isEmpty(
                                    getValuesByKey(
                                      'Target',
                                      governancetargets[0]?.data[index]
                                    )
                                  )
                                    ? formatNumberUS(
                                        getValuesByKey(
                                          'Target',
                                          governancetargets[0]?.data[index]
                                        )
                                      )
                                    : '0.00'}
                                </p>
                              </>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>

                <Col span={8}>
                  <Card className={Styles.cardsSocial}>
                    <Row>
                      <Col span={8}>
                        <p className={Styles.targetHeader2}>
                          Board Gender Diversity
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}>
                          Percentage Target (%)
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}>Target</p>
                      </Col>
                    </Row>
                    {!isEmpty(governanceAgegroup) &&
                      governanceAgegroup.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-scope2-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={8}>
                            <p>{data}</p>
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                name={`agegroup.${data}.percentage`}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === '' ||
                                    (parseFloat(value) >= 0 &&
                                      parseFloat(value) <= 100)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                value={
                                  values.agegroup[
                                    data as keyof typeof values.agegroup
                                  ].percentage
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Percentage Target (%)',
                                    governancetargets[1]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Percentage Target (%)',
                                        governancetargets[1]?.data[index]
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            )}
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
                                name={`agegroup.${data}.target`}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  handleChange(e);
                                }}
                                value={
                                  values.agegroup[
                                    data as keyof typeof values.agegroup
                                  ].target
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Target',
                                    governancetargets[1]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Target',
                                        governancetargets[1]?.data[index]
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            )}
                          </Col>
                        </Row>
                      ))}
                    <Row>
                      <Col span={8}>
                        <p className={Styles.targetHeader2}>
                          Management Gender Diversity
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}></p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}></p>
                      </Col>
                    </Row>
                    {!isEmpty(governanceManagement) &&
                      governanceManagement.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-scope2-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={8}>
                            <p>{data}</p>
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                name={`managementgroup.${data}.percentage`}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === '' ||
                                    (parseFloat(value) >= 0 &&
                                      parseFloat(value) <= 100)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                value={
                                  values.managementgroup[
                                    data as keyof typeof values.managementgroup
                                  ].percentage
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Percentage Target (%)',
                                    governancetargets[2]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Percentage Target (%)',
                                        governancetargets[2]?.data[index]
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            )}
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
                                name={`managementgroup.${data}.target`}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  handleChange(e);
                                }}
                                value={
                                  values.managementgroup[
                                    data as keyof typeof values.managementgroup
                                  ].target
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Target',
                                    governancetargets[2]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Target',
                                        governancetargets[2]?.data[index]
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>

                <Col span={8}>
                  <Card className={Styles.cardsSocial}>
                    <Row>
                      <Col span={12}>
                        <p className={Styles.targetHeader2}>
                          Governance Compliance
                        </p>
                      </Col>
                      <Col span={12}>
                        <p className={Styles.targetHeaderTarget}>Target</p>
                      </Col>
                    </Row>
                    {!isEmpty(governanceCompliance) &&
                      governanceCompliance.map((data, index) => (
                        <Row
                          gutter={16}
                          align="middle"
                          key={`environment-scope3-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={12}>
                            <p>{data}</p>
                          </Col>
                          <Col span={12} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
                                name={`compliance.${data}.target`}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                }}
                                value={
                                  values.compliance[
                                    data as keyof typeof values.compliance
                                  ].target
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Target',
                                    governancetargets[3]?.data[0]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Target',
                                        governancetargets[3]?.data[0]
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            )}
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
              </Row>
              {user.role === 'ADMIN' && (
                <Row gutter={12} className={Styles.buttonRow}>
                  <Col>
                    <ButtonComponent
                      onClick={() => resetForm({ values: initialValues })}
                      hierarchy="tertiary"
                      htmlType="reset"
                    >
                      Reset
                    </ButtonComponent>
                  </Col>
                  <Col>
                    <ButtonComponent hierarchy="primary" htmlType="submit">
                      Submit
                    </ButtonComponent>
                  </Col>
                </Row>
              )}
            </Form>
          )}
        </Formik>
      </PageCardComponent>
    </div>
  );
}

export default TargetGovernance;
