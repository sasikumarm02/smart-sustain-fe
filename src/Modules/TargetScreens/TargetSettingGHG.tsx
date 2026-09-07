import React, { useEffect, useState } from 'react';
import { Tabs, Input, Row, Col, message } from 'antd';
import { Formik, Form } from 'formik';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import Styles from './targetscreens.module.scss';
import { useAuth } from '../../Hooks/useAuth';
import { get, post } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

import { formatNumberUS } from '../../Utils/Strings';

const { TabPane } = Tabs;

interface EmissionData {
  category: string;
  previousYear: number;
  targetPercentage: number | null;
  targetTons: number | null;
}

function TargetSettingGHG() {
  const [scope1Sum, setScope1Sum] = useState<number>(0);
  const [scope2Sum, setScope2Sum] = useState<number>(0);
  const [scope3Sum, setScope3Sum] = useState<number>(0);

  const { user } = useAuth();

  const handleGHGValuesApi = (values: any) => {
    let subCategories;
    if (activeTab === '1') {
      subCategories = [values[0], values[1]];
    } else if (activeTab === '2') {
      subCategories = [values[2]];
    }
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user?.entity_Id,
      target_category: 'GHG Emission Targets',
      sub_categories: subCategories,
    };
    post(`${path}`, body)
      .then((res) => {
        message.success('Targets set successfully');
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  const [scope1prev, setScope1prev] = useState<number[]>([]);
  const [scope2prev, setScope2prev] = useState<number[]>([]);
  const [scope3prev, setScope3prev] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const handleIntialState = () => {};

  const [IsFilledData, setIsFilledData] = React.useState(false);

  const [formValues, setFormValues] = useState({
    scope1: [
      {
        category: 'Stationary Combustion',
        previousYear: null, // Standardizing missing number values as null
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Mobile Combustion',
        previousYear: scope1prev[1] ?? null, // Prevents undefined values
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Process Emissions',
        previousYear: scope1prev[2] ?? null,
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Fugitive Emissions',
        previousYear: scope1prev[3] ?? null,
        targetPercentage: null,
        targetTons: null,
      },
    ],
    scope2: [
      {
        category: 'Heat and Steam',
        previousYear: scope2prev[0],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Electricity from Public Utility',
        previousYear: scope2prev[1],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Electricity from EVs',
        previousYear: scope2prev[2],
        targetPercentage: null,
        targetTons: null,
      },
    ],
    scope3: [
      {
        category: 'Category 1 - Purchased Goods & Services',
        previousYear: scope3prev[0],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Category 2 - Capital Goods',
        previousYear: scope3prev[1],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Category 3 - Fuel and Energy',
        previousYear: scope3prev[2],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Category 5 - Waste Generated in Operations',
        previousYear: scope3prev[3],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Category 6 - Business Travel ',
        previousYear: scope3prev[4],
        targetPercentage: null,
        targetTons: null,
      },
      {
        category: 'Category 13 - Downstream Leased Assets ',
        previousYear: scope3prev[5],
        targetPercentage: null,
        targetTons: null,
      },
    ],
  });

  const handleGHGPrevValuesGetApi = () => {
    setLoading(true);
    const path = '/targets/fetch_previous_data_for_target/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        const resdata = res?.response?.data?.data;
        if (!isEmpty(resdata)) {
          setScope1prev([
            resdata.Stationary_Combustion,
            resdata.Mobile_Combustion,
            resdata.Process_Emissions,
            resdata.Fugitive_Emissions,
          ]);
          setScope2prev([resdata.Energy_Consumption]);
          setScope3prev([
            resdata.Category_1_Purchased_Goods_Services,
            resdata.Category_2_Capital_Goods,
            resdata.Category_3_Fuel_and_Energy,
            resdata.Category_5_Waste_Generated_in_Operations,
            resdata.Category_6_Business_Travel,
            resdata.Category_13_Business_Travel,
          ]);
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
        handleIntialState();
      });
  };

  const [ghgtargets1, setGhgtargets1] = useState<any[]>([]);
  const [ghgtargets2, setGhgtargets2] = useState<any[]>([]);
  const [ghgtargets3, setGhgtargets3] = useState<any[]>([]);
  const [ghgtargets, setGhgtargets] = useState<any[]>([]);

  const handleGHGValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=GHG Emission Targets`
    )
      .then((res) => {
        const resdata = res?.response?.data;
        if (!isEmpty(resdata)) {
          setGhgtargets(resdata);

          setGhgtargets1(resdata[0].data);
          setGhgtargets2(resdata[1].data);
          setGhgtargets3(resdata[2].data);
          setIsFilledData(true);

          setFormValues({
            scope1: transformApiData(resdata[0]?.data || []),
            scope2: transformApiData(resdata[1]?.data || []),
            scope3: transformApiData(resdata[2]?.data || []),
          });
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  useEffect(() => {
    handleGHGValuesGetApi();
  }, []);

  // Function to calculate target tons based on percentage
  const calculateTargetTons = (
    previousYear: number,
    targetPercentage: number | null
  ) => {
    if (targetPercentage === null || isNaN(targetPercentage)) {
      return null;
    }
    return previousYear * (1 - targetPercentage / 100);
  };

  // Function to handle form submission
  const handleSubmit = (values: any) => {
    const transformedValues = transformData(values);
    handleGHGValuesApi(transformedValues);
  };

  // Calculate total for each scope
  const calculateSums = (scopeData: EmissionData[]) => {
    return scopeData?.reduce((acc, item) => acc + (item?.targetTons ?? 0), 0);
  };

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

  const transformData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData: any = [];

    // Map through the Formik values for each scope
    Object.keys(formikValues).forEach((scopeKey) => {
      // Create an object for each target sub-category (scope)
      const targetSubCategory = {
        target_sub_category: scopeKey.replace('scope', 'Scope '),
        data: formikValues[scopeKey].map((item: any) => ({
          type: item.category,
          previous_reporting_year: item.previousYear,
          target_percentage: item.targetPercentage,
          current_reporting_year_target: item.targetTons,
        })),
      };

      // Add the transformed sub-category to the array
      transformedData.push(targetSubCategory);
    });

    return transformedData;
  };

  const transformApiData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData = formikValues.map((item: any) => ({
      category: item.type,
      previousYear: item.previous_reporting_year,
      targetPercentage: item.target_percentage,
      targetTons: item.current_reporting_year_target,
    }));

    return transformedData;
  };

  const [activeTab, setActiveTab] = useState('1');

  return (
    <div>
      <PageCardComponent loading={loading}>
        <Row className={Styles.targetSubTitle}>
          Set ambitious and achievable targets for reducing greenhouse gas
          emissions (GHG) across your entire operation. This section guides you
          through setting Scope 1, 2, and 3 emissions targets and provides a
          space to define your total reduction goals.
        </Row>
        <Formik
          initialValues={formValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, resetForm }: any) => {
            setScope1Sum(calculateSums(values?.scope1));
            setScope2Sum(calculateSums(values?.scope2));
            setScope3Sum(calculateSums(values?.scope3));

            const allFieldsFilled = () => {
              // Check if all scope1, scope2, and scope3 fields have values
              if (activeTab === '1') {
                const scope1Filled = values.scope1.every(
                  (item: any) =>
                    item?.previousYear !== null &&
                    item.targetPercentage !== null
                );
                const scope2Filled = values.scope2.every(
                  (item: any) =>
                    item.previousYear !== null && item.targetPercentage !== null
                );
                return scope1Filled && scope2Filled;
              } else {
                const scope3Filled = values.scope3.every(
                  (item: any) =>
                    item.previousYear !== null && item.targetPercentage !== null
                );

                return scope3Filled;
              }
            };

            return (
              <Form
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent form submission on Enter
                  }
                }}
              >
                <Tabs
                  defaultActiveKey="1"
                  onChange={(key) => setActiveTab(key)}
                >
                  {/* Scope 1 and 2 */}
                  <TabPane tab="Scope 1&2" key="1">
                    <Row className={Styles.headingScope}>
                      {user.role === 'ADMIN' ? (
                        <>
                          <h5 className={Styles.brownLabel}>Scope 1 Target </h5>
                          <h5 className={Styles.blackValue}>
                            {formatNumberUS(scope1Sum?.toFixed(2))} tCO₂e
                          </h5>
                        </>
                      ) : (
                        <>
                          <h5 className={Styles.brownLabel}>Scope 1 Target </h5>
                          <h5 className={Styles.blackValue}>
                            {formatNumberUS(ghgtargets[0]?.sub_category_total)}{' '}
                            tCO₂e
                          </h5>
                        </>
                      )}
                    </Row>
                    {values?.scope1?.map((item: any, index: any) => (
                      <React.Fragment key={index}>
                        <Row gutter={16}>
                          <Col span={6}></Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Previous Reporting Period (tCO₂e)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Percentage Reduction (%)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Current Reporting Period Target (tCO₂e)</p>
                          </Col>
                        </Row>
                        <Row key={index} className={Styles.rowItem} gutter={16}>
                          <Col span={6} className={Styles.subheading}>
                            <Input
                              value={item.category}
                              disabled
                              className={Styles.disabledInput}
                            />
                          </Col>
                          <Col span={6}>
                            {user.role == 'ADMIN' ? (
                              <Input
                                className={Styles.enabledInput}
                                type="number"
                                value={item.previousYear}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                  {
                                    const value =
                                      e.target.value === ''
                                        ? null
                                        : parseFloat(e.target.value);
                                    setFieldValue(
                                      `scope1[${index}].previousYear`,
                                      value
                                    );
                                    const newTargetTons = calculateTargetTons(
                                      Number(value),
                                      item.targetPercentage
                                    );
                                    setFieldValue(
                                      `scope1[${index}].targetTons`,
                                      newTargetTons
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets1[index]?.previous_reporting_year ||
                                  ''
                                }
                                disabled
                              />
                              // <p>
                              //   {formatNumberUS(
                              //     ghgtargets1[index]?.previous_reporting_year
                              //   )}
                              // </p>
                            )}
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                className={Styles.enabledInput}
                                type="number"
                                value={item.targetPercentage ?? ''}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (
                                    val === '' ||
                                    (parseFloat(val) >= 0 &&
                                      parseFloat(val) <= 100)
                                  ) {
                                    const value =
                                      e.target.value === ''
                                        ? null
                                        : parseFloat(e.target.value);
                                    setFieldValue(
                                      `scope1[${index}].targetPercentage`,
                                      value
                                    );
                                    const newTargetTons = calculateTargetTons(
                                      item.previousYear,
                                      value
                                    );
                                    setFieldValue(
                                      `scope1[${index}].targetTons`,
                                      newTargetTons
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets1[index]?.target_percentage || ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                className={Styles.disabledInput}
                                value={item.targetTons?.toFixed(2) ?? ''}
                                disabled
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets1[index]
                                    ?.current_reporting_year_target || ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                        </Row>
                      </React.Fragment>
                    ))}
                    <Row className={Styles.headingScope}>
                      {user.role === 'ADMIN' ? (
                        <>
                          <h5 className={Styles.brownLabel}>Scope 2 Target </h5>
                          <h5 className={Styles.blackValue}>
                            {formatNumberUS(scope2Sum.toFixed(2))} tCO₂e
                          </h5>
                        </>
                      ) : (
                        <>
                          <h5 className={Styles.brownLabel}>Scope 2 Target </h5>
                          <h5 className={Styles.blackValue}>
                            {formatNumberUS(ghgtargets[1]?.sub_category_total)}{' '}
                            tCO₂e
                          </h5>
                        </>
                      )}
                    </Row>
                    {values.scope2.map((item: any, index: any) => (
                      <React.Fragment key={index}>
                        <Row gutter={16}>
                          <Col span={6} className={Styles.subheading}>
                            {' '}
                            <p>Energy Consumption</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Previous Reporting Period (tCO₂e)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Percentage Reduction (%)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Current Reporting Period Target (tCO₂e)</p>
                          </Col>
                        </Row>
                        <Row key={index} className={Styles.rowItem} gutter={16}>
                          <Col span={6} className={Styles.subheading}>
                            <Input
                              value={item.category}
                              disabled
                              className={Styles.disabledInput}
                            />
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              !isEmpty(scope2prev[index]) ? (
                                <Input
                                  value={item.previousYear}
                                  disabled
                                  className={Styles.disabledInput}
                                />
                              ) : (
                                <Input
                                  className={Styles.enabledInput}
                                  type="number"
                                  value={item.previousYear ?? ''}
                                  onKeyDown={handleKeyDown}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    {
                                      const value =
                                        e.target.value === ''
                                          ? null
                                          : parseFloat(e.target.value);
                                      setFieldValue(
                                        `scope2[${index}].previousYear`,
                                        value
                                      );
                                      const newTargetTons = calculateTargetTons(
                                        Number(value),
                                        item.targetPercentage
                                      );
                                      setFieldValue(
                                        `scope2[${index}].targetTons`,
                                        newTargetTons
                                      );
                                    }
                                  }}
                                />
                              )
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets2[index]?.previous_reporting_year ||
                                  ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                className={Styles.enabledInput}
                                type="number"
                                value={item.targetPercentage ?? ''}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (
                                    val === '' ||
                                    (parseFloat(val) >= 0 &&
                                      parseFloat(val) <= 100)
                                  ) {
                                    const value =
                                      e.target.value === ''
                                        ? null
                                        : parseFloat(e.target.value);
                                    setFieldValue(
                                      `scope2[${index}].targetPercentage`,
                                      value
                                    );
                                    const newTargetTons = calculateTargetTons(
                                      item.previousYear,
                                      value
                                    );
                                    setFieldValue(
                                      `scope2[${index}].targetTons`,
                                      newTargetTons
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets2[index]?.target_percentage || ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                value={item.targetTons?.toFixed(2) ?? ''}
                                disabled
                                className={Styles.disabledInput}
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets2[index]
                                    ?.current_reporting_year_target || ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                        </Row>
                      </React.Fragment>
                    ))}
                  </TabPane>

                  {/* Scope 3 */}
                  <TabPane tab="Scope 3" key="2">
                    <Row className={Styles.headingScope}>
                      {user.role === 'ADMIN' ? (
                        <>
                          <h5 className={Styles.brownLabel}>Scope 3 Target </h5>
                          <h5 className={Styles.blackValue}>
                            {formatNumberUS(scope3Sum.toFixed(2))} tCO₂e
                          </h5>
                        </>
                      ) : (
                        <>
                          <h5 className={Styles.brownLabel}>Scope 3 Target </h5>
                          <h5 className={Styles.blackValue}>
                            {formatNumberUS(ghgtargets[2]?.sub_category_total)}{' '}
                            tCO₂e
                          </h5>
                        </>
                      )}
                    </Row>
                    {values.scope3.map((item: any, index: any) => (
                      <React.Fragment key={index}>
                        <Row gutter={16}>
                          <Col span={6}></Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Previous Reporting Period (tCO₂e)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Percentage Reduction (%)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Current Reporting Period Target (tCO₂e)</p>
                          </Col>
                        </Row>
                        <Row key={index} className={Styles.rowItem} gutter={16}>
                          <Col span={6} className={Styles.subheading}>
                            <Input
                              value={item.category}
                              disabled
                              className={Styles.disabledInput}
                            />
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              !isEmpty(scope3prev[index]) ? (
                                <Input
                                  value={item.previousYear}
                                  disabled
                                  className={Styles.disabledInput}
                                />
                              ) : (
                                <Input
                                  className={Styles.enabledInput}
                                  type="number"
                                  value={item.previousYear ?? ''}
                                  onKeyDown={handleKeyDown}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    {
                                      const value =
                                        e.target.value === ''
                                          ? null
                                          : parseFloat(e.target.value);
                                      setFieldValue(
                                        `scope3[${index}].previousYear`,
                                        value
                                      );
                                      const newTargetTons = calculateTargetTons(
                                        Number(value),
                                        item.targetPercentage
                                      );
                                      setFieldValue(
                                        `scope3[${index}].targetTons`,
                                        newTargetTons
                                      );
                                    }
                                  }}
                                />
                              )
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets3[index]?.previous_reporting_year ||
                                  ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                className={Styles.enabledInput}
                                type="number"
                                value={item.targetPercentage ?? ''}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (
                                    val === '' ||
                                    (parseFloat(val) >= 0 &&
                                      parseFloat(val) <= 100)
                                  ) {
                                    const value =
                                      e.target.value === ''
                                        ? null
                                        : parseFloat(e.target.value);
                                    setFieldValue(
                                      `scope3[${index}].targetPercentage`,
                                      value
                                    );
                                    const newTargetTons = calculateTargetTons(
                                      item.previousYear,
                                      value
                                    );
                                    setFieldValue(
                                      `scope3[${index}].targetTons`,
                                      newTargetTons
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets3[index]?.target_percentage || ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                          <Col span={6}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                value={item.targetTons?.toFixed(2) ?? ''}
                                disabled
                                className={Styles.disabledInput}
                              />
                            ) : (
                              <Input
                                className={Styles.disabledInput}
                                type="number"
                                value={
                                  ghgtargets3[index]
                                    ?.current_reporting_year_target || ''
                                }
                                disabled
                              />
                            )}
                          </Col>
                        </Row>
                      </React.Fragment>
                    ))}
                  </TabPane>
                </Tabs>

                {/* Buttons */}
                {user.role === 'ADMIN' && (
                  <Row justify="end" className={Styles.buttonRow}>
                    {!IsFilledData && (
                      <ButtonComponent
                        hierarchy="secondary"
                        // onClick={() => resetForm()}
                        onClick={() => {
                          resetForm();
                        }}
                        className={Styles.button}
                      >
                        Reset
                      </ButtonComponent>
                    )}

                    <ButtonComponent
                      hierarchy="primary"
                      htmlType="submit"
                      disabled={!allFieldsFilled()}
                      className={Styles.button}
                    >
                      Submit
                    </ButtonComponent>
                  </Row>
                )}
              </Form>
            );
          }}
        </Formik>
      </PageCardComponent>
    </div>
  );
}

export default TargetSettingGHG;
