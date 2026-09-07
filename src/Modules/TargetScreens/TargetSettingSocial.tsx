import React, { useEffect, useState } from 'react';
import { Input, Row, Col, message } from 'antd';
import { Formik, Form } from 'formik';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import Styles from './targetscreens.module.scss';
import { useAuth } from '../../Hooks/useAuth';
import { get, post } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

interface SocialData {
  employee: string;
  previousYear: number;
  targetPercentage: number | null;
  targetTons: number | null;
}

function TargetSettingSocial() {
  const [genderSum, setgenderSum] = useState<number>(0);
  const [ageSum, setageSum] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [IsFilledData, setIsFilledData] = useState(false);
  const { user } = useAuth();
  const handleIntialState = () => {};

  const [genderPrev, setGenderPrev] = useState<any[]>([]);
  const [agePrev, setAgePrev] = useState<any[]>([]);

  function getValuesByKey(key: any, data: any) {
    if (!isEmpty(data) && data?.hasOwnProperty(key)) {
      return data[key];
    } else {
      return [];
    }
  }

  const handleSocialPrevValuesGetApi = () => {
    setLoading(true);
    const path = '/targets/fetch_previous_data_for_target/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        const resdata = res?.response?.data?.data;
        if (!isEmpty(resdata)) {
          setGenderPrev([resdata.male_emp, resdata.female_emp]);
          setAgePrev([
            resdata.less_than_30,
            getValuesByKey('30_to_50', resdata),
            resdata.greater_than_30,
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

  const [formValues, setFormValues] = useState({
    age: [
      {
        employee: '<30',
        previousYear: agePrev[0],
        targetPercentage: null,
        targetTons: null,
      },
      {
        employee: '30-50',
        previousYear: agePrev[1],
        targetPercentage: null,
        targetTons: null,
      },
      {
        employee: '>50',
        previousYear: agePrev[2],
        targetPercentage: null,
        targetTons: null,
      },
    ],
    gender: [
      {
        employee: 'Male',
        previousYear: genderPrev[0],
        targetPercentage: null,
        targetTons: null,
      },
      {
        employee: 'Female',
        previousYear: genderPrev[1],
        targetPercentage: null,
        targetTons: null,
      },
    ],
  });

  const [socialtargets, setSocialtargets] = useState<any[]>([]);

  const handleSocialValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(`${path}?entity_Id=${user.entity_Id}&target_category=Social Targets`)
      .then((res) => {
        if (!isEmpty(res.response.data)) {
          setSocialtargets(res.response.data);
          setFormValues({
            gender: transformApiData(res.response.data[0].data) || [],
            age: transformApiData(res.response.data[1].data) || [],
          });
          setIsFilledData(true);
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
      handleSocialValuesGetApi();
    } else {
      handleSocialPrevValuesGetApi();
    }
  }, []);

  useEffect(() => {
    handleSocialValuesGetApi();
  }, []);

  const initialAgeData: SocialData[] = [
    {
      employee: '<30',
      previousYear: agePrev[0],
      targetPercentage: null,
      targetTons: null,
    },
    {
      employee: '30-50',
      previousYear: agePrev[1],
      targetPercentage: null,
      targetTons: null,
    },
    {
      employee: '>50',
      previousYear: agePrev[2],
      targetPercentage: null,
      targetTons: null,
    },
  ];

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

  const handleSocialValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user.entity_Id,
      target_category: 'Social Targets',
      sub_categories: values,
    };

    post(`${path}`, body)
      .then((res) => {
        message.success('Targets set Successfully');
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      });
  };

  function convertFormat(input: any) {
    const output = [];

    // Handling water consumption
    const genderData = input.gender.map((item: any) => ({
      type: item.employee,
      previous_reporting_year: item.previousYear,
      target_percentage: item.targetPercentage,
      current_reporting_year_target: item.targetTons,
    }));

    const ageData = input.age.map((item: any) => ({
      type: item.employee,
      previous_reporting_year: item.previousYear,
      target_percentage: item.targetPercentage,
      current_reporting_year_target: item.targetTons,
    }));

    output.push({
      target_sub_category: 'Social Gender',
      data: genderData,
    });

    output.push({
      target_sub_category: 'Social Age',
      data: ageData,
    });
    return output;
  }

  const transformApiData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData = formikValues.map((item: any) => ({
      employee: item.type,
      previousYear: item.previous_reporting_year,
      targetPercentage: item.target_percentage,
      targetTons: item.current_reporting_year_target,
    }));

    return transformedData;
  };

  // Function to calculate target tons based on percentage
  const calculateTargetTons = (
    previousYearLessThirty: number,
    previousYearThirty: number,
    previousYearGreaterFifty: number,
    targetPercentage: number | null
  ) => {
    if (targetPercentage === null || isNaN(targetPercentage)) {
      return null;
    }
    const totalPreviousYear =
      previousYearLessThirty + previousYearThirty + previousYearGreaterFifty;
    return Math.round((totalPreviousYear * targetPercentage) / 100);
  };

  const calculateTargetTonsGender = (
    previousYearMale: number,
    previousYearFemale: number,
    targetPercentage: number | null
  ) => {
    if (targetPercentage === null || isNaN(targetPercentage)) {
      return null;
    }

    return Math.round(
      ((previousYearMale + previousYearFemale) * targetPercentage) / 100
    );
  };

  // Function to handle form submission
  const handleSubmit = (values: any) => {
    const totalPercentage = values.age.reduce(
      (acc: any, item: any) => acc + (item.targetPercentage || 0),
      0
    );

    if (totalPercentage !== 100) {
      message.warning('The sum of Target Percentages must equal to 100.');
      return; // Prevent further execution if validation fails
    }
    const transformData = convertFormat(values);
    handleSocialValuesPostApi(transformData);
  };

  // Calculate total for each scope
  const calculateSums = (scopeData: SocialData[]) => {
    return scopeData.reduce((acc, item) => acc + (item.targetTons ?? 0), 0);
  };

  const [valid, setValid] = useState(false);

  const FieldsFilledInt = (values: any) => {
    const ageFilled = values.age.every(
      (item: any) => Number.isInteger(item.targetTons) // Check if targetTons is an integer
    );
    const genderFilled = values.gender.every(
      (item: any) => Number.isInteger(item.targetTons) // Check if targetTons is an integer
    );

    return ageFilled && genderFilled;
  };

  return (
    <div className={Styles.targetsettingGhg}>
      <PageCardComponent loading={loading}>
        <Row className={Styles.targetSubTitle}>
          Foster a diverse and inclusive workplace. Establish targets for
          employee demographics, aiming for a balanced male-to-female ratio and
          age representation. Additionally, set safety performance goals to
          minimise fatalities and injuries within your organisation.
        </Row>
        <Formik initialValues={formValues} onSubmit={handleSubmit}>
          {({ values, setFieldValue, resetForm }) => {
            setgenderSum(calculateSums(values.gender));
            setageSum(calculateSums(values.age));
            setValid(FieldsFilledInt(values));

            const allFieldsFilled = () => {
              // Check if all scope1, scope2, and scope3 fields have values
              const ageFilled = values.age.every(
                (item) =>
                  item.previousYear !== null && item.targetPercentage !== null
              );
              const genderFilled = values.gender.every(
                (item) =>
                  item.previousYear !== null && item.targetPercentage !== null
              );

              return ageFilled && genderFilled;
            };

            return (
              <Form
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent form submission on Enter
                  }
                }}
              >
                <Row className={Styles.headingScope}>
                  Gender-based diversity
                </Row>
                {values.gender.map((item, index) => (
                  <React.Fragment key={index}>
                    <Row gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        Employees
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Previous Reporting Period</p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target Percentage (%)</p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Current Reporting Period Target</p>
                      </Col>
                    </Row>
                    <Row key={index} className={Styles.rowItem} gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        <Input
                          value={item.employee}
                          disabled
                          className={Styles.disabledInput}
                        />
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          <Input
                            className={Styles.enabledInput}
                            value={item.previousYear ?? ''}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                              const value =
                                e.target.value === ''
                                  ? null
                                  : parseFloat(e.target.value);

                              setFieldValue(
                                `gender[${index}].previousYear`,
                                value
                              );

                              const updatedValues = {
                                ...values,
                                gender: values.gender.map((g, i) =>
                                  i === index
                                    ? { ...g, previousYear: value }
                                    : g
                                ),
                              };

                              const previousYearMale =
                                updatedValues.gender[0]?.previousYear ?? 0;
                              const previousYearFemale =
                                updatedValues.gender[1]?.previousYear ?? 0;

                              // Recalculate target tons

                              const maleTargetTons = calculateTargetTonsGender(
                                updatedValues.gender[0]?.previousYear ?? 0,
                                updatedValues.gender[1]?.previousYear ?? 0,
                                updatedValues.gender[0]?.targetPercentage
                              );

                              setFieldValue(
                                `gender[0].targetTons`,
                                maleTargetTons
                              );

                              const femaleTargetTons =
                                calculateTargetTonsGender(
                                  previousYearMale,
                                  previousYearFemale,
                                  updatedValues.gender[1]?.targetPercentage
                                );

                              setFieldValue(
                                `gender[1].targetTons`,
                                femaleTargetTons
                              );
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              socialtargets[0]?.data[index]
                                ?.previous_reporting_year
                            }
                            disabled
                          />
                        )}
                      </Col>

                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          <Input
                            className={Styles.enabledInput}
                            value={item.targetPercentage ?? ''}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (
                                val === '' ||
                                (parseFloat(val) >= 0 && parseFloat(val) <= 100)
                              ) {
                                const value =
                                  val === '' ? null : parseFloat(val);

                                // Automatically adjust the other gender's target to make the total 100%
                                //const otherIndex = index === 0 ? 1 : 0;
                                const otherValue =
                                  value !== null ? 100 - value : null;
                                let updatedValues: any;
                                if (index === 0) {
                                  setFieldValue(
                                    `gender[${index}].targetPercentage`,
                                    value
                                  );

                                  setFieldValue(
                                    `gender[1].targetPercentage`,
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    gender: values.gender.map((g, i) =>
                                      i === 0
                                        ? { ...g, targetPercentage: value }
                                        : i === 1
                                          ? {
                                              ...g,
                                              targetPercentage: otherValue,
                                            }
                                          : g
                                    ),
                                  };
                                } else if (index === 1) {
                                  setFieldValue(
                                    `gender[${index}].targetPercentage`,
                                    value
                                  );

                                  setFieldValue(
                                    `gender[0].targetPercentage`,
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    gender: values.gender.map((g, i) =>
                                      i === 1
                                        ? { ...g, targetPercentage: value }
                                        : i === 0
                                          ? {
                                              ...g,
                                              targetPercentage: otherValue,
                                            }
                                          : g
                                    ),
                                  };
                                }

                                const maleTargetTons =
                                  calculateTargetTonsGender(
                                    updatedValues?.gender[0]?.previousYear ?? 0,
                                    updatedValues?.gender[1]?.previousYear ?? 0,
                                    updatedValues?.gender[0]?.targetPercentage
                                  );

                                setFieldValue(
                                  `gender[0].targetTons`,
                                  maleTargetTons
                                );

                                const femaleTargetTons =
                                  calculateTargetTonsGender(
                                    updatedValues?.gender[0]?.previousYear ?? 0,
                                    updatedValues?.gender[1]?.previousYear ?? 0,
                                    updatedValues?.gender[1]?.targetPercentage
                                  );

                                updatedValues = {
                                  ...values,
                                  gender: values.gender.map((g, i) =>
                                    i === 0
                                      ? {
                                          ...g,
                                          targetTons: maleTargetTons,
                                          targetPercentage:
                                            updatedValues?.gender[0]
                                              .targetPercentage,
                                        }
                                      : i === 1
                                        ? {
                                            ...g,
                                            targetTons: femaleTargetTons,
                                            targetPercentage:
                                              updatedValues?.gender[1]
                                                .targetPercentage,
                                          }
                                        : g
                                  ),
                                };
                                setFieldValue(
                                  `gender[1].targetTons`,
                                  femaleTargetTons
                                );
                              }
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              socialtargets[0]?.data[index]?.target_percentage
                            }
                            disabled
                          />
                        )}
                      </Col>

                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          item.previousYear !== null &&
                          values.gender[0]?.previousYear !== null &&
                          values.gender[1]?.previousYear !== null &&
                          item.targetPercentage !== null ? (
                            <Input
                              value={item.targetTons ?? ''}
                              disabled
                              className={Styles.disabledInput}
                            />
                          ) : (
                            <Input disabled className={Styles.disabledInput} />
                          )
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              socialtargets[0]?.data[index]
                                ?.current_reporting_year_target
                            }
                            disabled
                          />
                        )}
                      </Col>
                    </Row>
                  </React.Fragment>
                ))}

                <Row className={Styles.headingScope}>Age-based Diversity</Row>
                {values.age.map((item, index) => (
                  <React.Fragment key={index}>
                    <Row gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        Employees
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Previous Reporting Period </p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target Percentage (%)</p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Current Reporting Period Target </p>
                      </Col>
                    </Row>
                    <Row key={index} className={Styles.rowItem} gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        <Input
                          value={item.employee}
                          disabled
                          className={Styles.disabledInput}
                        />
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          !isEmpty(agePrev[index]) ? (
                            <Input
                              className={Styles.disabledInput}
                              value={item.previousYear}
                              disabled
                            />
                          ) : (
                            <Input
                              className={Styles.enabledInput}
                              value={item.previousYear ?? ''}
                              onKeyDown={handleKeyDown}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ''
                                    ? null
                                    : parseFloat(e.target.value);
                                setFieldValue(
                                  `age[${index}].previousYear`,
                                  value
                                );

                                const updatedValues = {
                                  ...values,
                                  age: values.age.map((g, i) =>
                                    i === index
                                      ? { ...g, previousYear: value }
                                      : g
                                  ),
                                };

                                // Calculate and update target tons for the specific row only
                                const previousYearLessThirty =
                                  updatedValues.age[0]?.previousYear ?? 0;
                                const previousYearThirty =
                                  updatedValues.age[1]?.previousYear ?? 0;
                                const previousYearGreaterFifty =
                                  updatedValues.age[2]?.previousYear ?? 0;

                                // Only update target tons for the changed age group (index)
                                const targetTonsLT30 = calculateTargetTons(
                                  previousYearLessThirty,
                                  previousYearThirty,
                                  previousYearGreaterFifty,
                                  updatedValues.age[0]?.targetPercentage
                                );
                                const targetTons30To50 = calculateTargetTons(
                                  previousYearLessThirty,
                                  previousYearThirty,
                                  previousYearGreaterFifty,
                                  updatedValues.age[1]?.targetPercentage
                                );
                                const targetTonsGT50 = calculateTargetTons(
                                  previousYearLessThirty,
                                  previousYearThirty,
                                  previousYearGreaterFifty,
                                  updatedValues.age[2]?.targetPercentage
                                );

                                setFieldValue(
                                  `age[0].targetTons`,
                                  targetTonsLT30
                                );
                                setFieldValue(
                                  `age[1].targetTons`,
                                  targetTons30To50
                                );
                                setFieldValue(
                                  `age[2].targetTons`,
                                  targetTonsGT50
                                );
                              }}
                            />
                          )
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              socialtargets[1]?.data[index]
                                ?.previous_reporting_year
                            }
                            disabled
                          />
                        )}
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          <Input
                            className={Styles.enabledInput}
                            value={item.targetPercentage ?? ''}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (
                                val === '' ||
                                (parseFloat(val) >= 0 && parseFloat(val) <= 100)
                              ) {
                                const value =
                                  val === '' ? null : parseFloat(val);
                                setFieldValue(
                                  `age[${index}].targetPercentage`,
                                  value
                                );
                                let updatedValues;
                                updatedValues = {
                                  ...values,
                                  age: values.age.map((g, i) =>
                                    i === index
                                      ? { ...g, targetPercentage: value }
                                      : g
                                  ),
                                };

                                const isNotNull = updatedValues?.age.every(
                                  (item: any) => item.targetPercentage !== null
                                );
                                if (isNotNull) {
                                  const totalPercentage =
                                    updatedValues.age.reduce(
                                      (acc: any, item: any) =>
                                        acc + (item.targetPercentage || 0),
                                      0
                                    );

                                  if (totalPercentage !== 100) {
                                    message.warning(
                                      'The sum of Target Percentages must equal to 100.'
                                    );
                                    return; // Prevent further execution if validation fails
                                  }
                                }

                                // Calculate and update target tons for the specific row only
                                const previousYearLessThirty =
                                  updatedValues.age[0]?.previousYear ?? 0;
                                const previousYearThirty =
                                  updatedValues.age[1]?.previousYear ?? 0;
                                const previousYearGreaterFifty =
                                  updatedValues.age[2]?.previousYear ?? 0;

                                const targetTonsLT30 = calculateTargetTons(
                                  previousYearLessThirty,
                                  previousYearThirty,
                                  previousYearGreaterFifty,
                                  updatedValues.age[0]?.targetPercentage
                                );
                                const targetTons30To50 = calculateTargetTons(
                                  previousYearLessThirty,
                                  previousYearThirty,
                                  previousYearGreaterFifty,
                                  updatedValues.age[1]?.targetPercentage
                                );
                                const targetTonsGT50 = calculateTargetTons(
                                  previousYearLessThirty,
                                  previousYearThirty,
                                  previousYearGreaterFifty,
                                  updatedValues.age[2]?.targetPercentage
                                );

                                setFieldValue(
                                  `age[0].targetTons`,
                                  targetTonsLT30
                                );
                                setFieldValue(
                                  `age[1].targetTons`,
                                  targetTons30To50
                                );
                                setFieldValue(
                                  `age[2].targetTons`,
                                  targetTonsGT50
                                );
                              }
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              socialtargets[1]?.data[index]?.target_percentage
                            }
                            disabled
                          />
                        )}
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          item.previousYear !== null &&
                          values.age[0]?.previousYear !== null &&
                          values.age[1]?.previousYear !== null &&
                          values.age[2]?.previousYear !== null &&
                          item.targetPercentage !== null ? (
                            <Input
                              value={item.targetTons ?? ''}
                              disabled
                              className={Styles.disabledInput}
                            />
                          ) : (
                            <Input disabled className={Styles.disabledInput} />
                          )
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              socialtargets[1]?.data[index]
                                ?.current_reporting_year_target
                            }
                            disabled
                          />
                        )}
                      </Col>
                    </Row>
                  </React.Fragment>
                ))}

                {/* Buttons */}

                {user.role === 'ADMIN' && (
                  <Row justify="end" className={Styles.buttonRow}>
                    {!IsFilledData && (
                      <ButtonComponent
                        hierarchy="secondary"
                        onClick={() => resetForm()}
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

export default TargetSettingSocial;
