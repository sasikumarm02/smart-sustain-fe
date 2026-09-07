import { useEffect, useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';

import Styles from './targetScreens.module.scss';
import { Col, Row, Card, Input, message } from 'antd';

import { get, post } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

import EnvGhgScope1 from '../../assets/Svg/TargetSettings/EnvGhgScope1';
import EnvGhgScope2 from '../../assets/Svg/TargetSettings/EnvGhgScope2';
import EnvGhgScope3 from '../../assets/Svg/TargetSettings/EnvGhgScope3';
import { formatNumberUS } from '../../Utils/Strings';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { Formik, Form } from 'formik';

function TargetEnvironmentGHG() {
  const { user } = useAuth();

  const envTargetsscope1 = [
    'Stationary Combustion',
    'Mobile Combustion',
    'Process Emissions',
    'Fugitive Emissions',
  ];
  const envTargetsscope2 = ['Energy Consumption'];
  const envTargetsscope3 = [
    'Category 1 - Purchased goods & Services',
    'Category 2 - Capital Goods',
    'Category 3 - Fuel and Energy',
    'Category 5 - Waste Generated in Operations',
    'Category 6 - Business Travel',
  ];

  const initialValues = {
    scope1: envTargetsscope1?.reduce(
      (acc, label) => ({ ...acc, [label]: '' }),
      {}
    ),
    scope2: envTargetsscope2?.reduce(
      (acc, label) => ({ ...acc, [label]: '' }),
      {}
    ),
    scope3: envTargetsscope3?.reduce(
      (acc, label) => ({ ...acc, [label]: '' }),
      {}
    ),
  };

  const [scopeValues, setScopeValues] = useState({
    scope_1: 0,
    scope_2: 0,
    scope_3: 0,
  });

  const updateScopeValues = (values: typeof initialValues) => {
    const sumValues = (scope: Record<string, string>) =>
      Object?.values(scope)?.reduce(
        (acc: any, val: any) => acc + (parseFloat(val) || 0),
        0
      );
    setScopeValues({
      scope_1: sumValues(values.scope1),
      scope_2: sumValues(values.scope2),
      scope_3: sumValues(values.scope3),
    });
  };

  const scope_array = [
    {
      svg: <EnvGhgScope1 />,
      name: 'Scope 1',
      value: !isEmpty(scopeValues?.scope_1)
        ? `${formatNumberUS(scopeValues.scope_1)} tCO₂e`
        : '',
      color: '#FD349C',
    },
    {
      svg: <EnvGhgScope2 />,
      name: 'Scope 2',
      value: !isEmpty(scopeValues?.scope_2)
        ? `${formatNumberUS(scopeValues.scope_2)} tCO₂e`
        : '',
      color: '#1E49E2',
    },
    {
      svg: <EnvGhgScope3 />,
      name: 'Scope 3',
      value: !isEmpty(scopeValues?.scope_3)
        ? `${formatNumberUS(scopeValues.scope_3)} tCO₂e`
        : '',
      color: '#00C0AE',
    },
  ];

  const handleGHGValuesApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user?.entity_Id,
      target_category: 'GHG Emission Targets',
      sub_categories: values,
    };
    post(`${path}`, body)
      .then((res) => {})
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  const [ghgtargets, setGhgtargets] = useState([]);
  const separated_data: any = !isEmpty(ghgtargets)
    ? separateScopes(ghgtargets)
    : null;

  const handleGHGValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=GHG Emission Targets`
    )
      .then((res) => {
        const resdata = res?.response?.data;
        if (!isEmpty(resdata)) {
          setGhgtargets(resdata);
          const subCategoryTotals = resdata?.map(
            (item: any) => item.sub_category_total
          );
          if (!isEmpty(subCategoryTotals) && Array.isArray(subCategoryTotals)) {
            setScopeValues({
              scope_1: subCategoryTotals[0] || 0,
              scope_2: subCategoryTotals[1] || 0,
              scope_3: subCategoryTotals[2] || 0,
            });
          }
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  useEffect(() => {
    if (user.role !== 'ADMIN') {
      handleGHGValuesGetApi();
    }
  }, []);

  function separateScopes(data: any) {
    const result = {
      scope_1: [],
      scope_2: [],
      scope_3: [],
    };

    data.forEach((item: any) => {
      switch (item?.target_sub_category) {
        case 'Scope 1':
          result.scope_1 = result?.scope_1?.concat(item.data);
          break;
        case 'Scope 2':
          result.scope_2 = item?.data;
          break;
        case 'Scope 3':
          result.scope_3 = item?.data;
          break;
        default:
          break;
      }
    });

    return result;
  }

  const formatValues = (values: any) => {
    return [
      {
        target_sub_category: 'Scope 1',
        data: [
          !isEmpty(envTargetsscope1) &&
            envTargetsscope1?.reduce((acc: any, label: any) => {
              acc[label] = values?.scope1[label];
              return acc;
            }, {}),
        ],
      },
      {
        target_sub_category: 'Scope 2',
        data: [
          !isEmpty(envTargetsscope2) &&
            envTargetsscope2?.reduce((acc: any, label: any) => {
              acc[label] = values?.scope2[label];
              return acc;
            }, {}),
        ],
      },
      {
        target_sub_category: 'Scope 3',
        data: [
          !isEmpty(envTargetsscope3) &&
            envTargetsscope3.reduce((acc: any, label: any) => {
              acc[label] = values.scope3[label];
              return acc;
            }, {}),
        ],
      },
    ];
  };

  function getValuesByKey(key: any, data: any) {
    if (!isEmpty(data) && data?.hasOwnProperty(key)) {
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
      event.key === '-' ||
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
      {/* <Row className={Styles.targetHeader}>GHG Emission Targets</Row> */}
      <PageCardComponent className={Styles.pageCard}>
        <Row className={Styles.targetSubTitle}>
          Set ambitious and achievable targets for reducing greenhouse gas
          emissions (GHG) across your entire operation. This section guides you
          through setting Scope 1, 2, and 3 emissions targets and provides a
          space to define your total reduction goals.
        </Row>
        <Row gutter={24} className="mt-3">
          {!isEmpty(scope_array) &&
            Array.isArray(scope_array) &&
            scope_array?.map((item: any, index: any) => (
              <Col span={8} key={index}>
                <Row
                  gutter={8}
                  style={{ backgroundColor: item.color }}
                  className={Styles.container1}
                >
                  <Col span={6}>{item.svg}</Col>
                  <Col span={6} className={Styles.text1}>
                    {item.name}
                  </Col>
                  <Col span={8} offset={4} className={Styles.text2}>
                    <p>{!isEmpty(item.value) ? item.value : '0.00'}</p>
                  </Col>
                </Row>
              </Col>
            ))}
        </Row>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            updateScopeValues(values);
            const formattedValues = formatValues(values);
            handleGHGValuesApi(formattedValues);
            message.success('Data added successfully');
          }}
        >
          {({ values, handleChange, resetForm }) => (
            <Form>
              <Row gutter={16} className="mt-3">
                <Col span={8}>
                  <Card className={Styles.cards}>
                    <Row className={`${Styles.cardRowWater} p-0`}>
                      <Col span={12}>
                        <p className={Styles.targetHeader2}>
                          Scope 1 Emissions
                        </p>
                      </Col>
                      <Col span={8} offset={4}>
                        <p className={Styles.targetHeaderTarget}>
                          Target (tCO₂e)
                        </p>
                      </Col>
                    </Row>
                    {!isEmpty(envTargetsscope1) &&
                      envTargetsscope1.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-scope1-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={16}>
                            <p>{data}</p>
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                name={`scope1.${data}`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                  const valuesData: any = { ...values };
                                  valuesData['scope1'][data] = value;
                                  updateScopeValues(valuesData);
                                }}
                                value={
                                  values.scope1[
                                    data as keyof typeof values.scope1
                                  ]
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <>
                                <p className={Styles.displayTextGHG}>
                                  {!isEmpty(
                                    getValuesByKey(
                                      data,
                                      separated_data?.scope_1[0]
                                    )
                                  )
                                    ? formatNumberUS(
                                        getValuesByKey(
                                          data,
                                          separated_data?.scope_1[0]
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
                  <Card className={Styles.cards}>
                    <Row className={`${Styles.cardRowWater} p-0`}>
                      <Col span={16}>
                        <p className={Styles.targetHeader2}>
                          Scope 2 Emissions
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}>
                          Target (tCO₂e)
                        </p>
                      </Col>
                    </Row>
                    {!isEmpty(envTargetsscope2) &&
                      envTargetsscope2.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-scope2-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={16}>
                            <p>{data}</p>
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                name={`scope2.${data}`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                  const valuesData: any = { ...values };
                                  valuesData['scope2'][data] = value;
                                  updateScopeValues(valuesData);
                                }}
                                value={
                                  values.scope2[
                                    data as keyof typeof values.scope2
                                  ]
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    data,
                                    separated_data?.scope_2[0]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        data,
                                        separated_data?.scope_2[0]
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
                  <Card className={Styles.cards}>
                    <Row className={`${Styles.cardRowGHG}`}>
                      <Col span={16}>
                        <p className={Styles.targetHeader2}>
                          Scope 3 Emissions
                        </p>
                      </Col>
                      <Col span={8}>
                        <p className={Styles.targetHeaderTarget}>
                          Target (tCO₂e)
                        </p>
                      </Col>
                    </Row>
                    {!isEmpty(envTargetsscope3) &&
                      envTargetsscope3.map((data, index) => (
                        <Row
                          gutter={16}
                          align="middle"
                          key={`environment-scope3-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={16}>
                            <p>{data}</p>
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                name={`scope3.${data}`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                  const valuesData: any = { ...values };
                                  valuesData['scope3'][data] = value;
                                  updateScopeValues(valuesData);
                                }}
                                value={
                                  values.scope3[
                                    data as keyof typeof values.scope3
                                  ]
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    data,
                                    separated_data?.scope_3[0]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        data,
                                        separated_data?.scope_3[0]
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

export default TargetEnvironmentGHG;
