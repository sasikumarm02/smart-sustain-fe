import React, { useEffect, useReducer, useState } from 'react';
import { Input, Row, Col, message } from 'antd';
import { Formik, Form } from 'formik';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import Styles from './targetscreens.module.scss';
import { get, post } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { useAuth } from '../../Hooks/useAuth';
import { formatNumberUS } from '../../Utils/Strings';

interface BoardIndData {
  boardInd: string;
  previousYear: number;
  targetPercentage: number | null;
  target: number | null;
}

interface BoardGenderData {
  boardGender: string;
  previousYear: number;
  targetPercentage: number | null;
  target: number | null;
}

interface ManagementGenderData {
  ManagementGender: string;
  previousYear: number;
  targetPercentage: number | null;
  target: number | null;
}

function TargetSettingGovernance() {
  // Function to calculate target tons based on percentage
  const calculateTargetTons = (
    previousYear: number,
    targetPercentage: number | null
  ) => {
    if (targetPercentage === null || isNaN(targetPercentage)) {
      return null;
    }
    return Math.round(previousYear * (1 - targetPercentage / 100));
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

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const handleIntialState = () => {};

  // Function to handle form submission

  const [governancetargets, setGovernancetargets] = useState<any[]>([]);
  const transformIndData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData = formikValues.map((item: any) => ({
      boardInd: item.type,
      previousYear: item.previous_reporting_year,
      targetPercentage: item.target_percentage,
      target: item.current_reporting_year_target,
    }));

    return transformedData;
  };

  const transformGenData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData = formikValues.map((item: any) => ({
      boardGender: item.type,
      previousYear: item.previous_reporting_year,
      targetPercentage: item.target_percentage,
      target: item.current_reporting_year_target,
    }));

    return transformedData;
  };

  const transformManData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData = formikValues.map((item: any) => ({
      ManagementGender: item.type,
      previousYear: item.previous_reporting_year,
      targetPercentage: item.target_percentage,
      target: item.current_reporting_year_target,
    }));

    return transformedData;
  };

  const [IsFilledData, setIsFilledData] = React.useState(false);
  const handleGovernanceValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=Governance Targets`
    )
      .then((res) => {
        if (!isEmpty(res.response.data)) {
          setGovernancetargets(res.response.data);

          const data = res.response.data;

          setFormValues({
            boardIndData: transformIndData(data[0].data),
            boardGenderData: transformGenData(data[1].data),
            ManagementGenderData: transformManData(data[2].data),
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

  const [boardgenderPrev, setBoardGenderPrev] = useState<any[]>([]);
  const [managegenderPrev, setManageGenderPrev] = useState<any[]>([]);

  const [boardInd, setBoardInd] = useState<any[]>([]);

  const handleGovernancePrevValuesGetApi = () => {
    setLoading(true);
    const path = '/targets/fetch_previous_data_for_target/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        const resdata = res?.response?.data?.data;
        if (!isEmpty(resdata)) {
          setBoardInd([resdata.independent_director]);
          setBoardGenderPrev([resdata.male_board, resdata.female_board]);
          setManageGenderPrev([resdata.male_mgmt, resdata.female_mgmt]);
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

  useEffect(() => {
    handleGovernanceValuesGetApi();
  }, []);

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

  const handleGovernanceValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user.entity_Id,
      target_category: 'Governance Targets',
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

    const boardInd = input.boardIndData.map((item: any) => ({
      type: item.boardInd,
      previous_reporting_year: item.previousYear,
      target_percentage: item.targetPercentage,
      current_reporting_year_target: item.target,
    }));
    const boardgenderData = input.boardGenderData.map((item: any) => ({
      type: item.boardGender,
      previous_reporting_year: item.previousYear,
      target_percentage: item.targetPercentage,
      current_reporting_year_target: item.target,
    }));

    const managegenderData = input.ManagementGenderData.map((item: any) => ({
      type: item.ManagementGender,
      previous_reporting_year: item.previousYear,
      target_percentage: item.targetPercentage,
      current_reporting_year_target: item.target,
    }));

    output.push({
      target_sub_category: 'Board Independence',
      data: boardInd,
    });

    output.push({
      target_sub_category: 'Board Gender',
      data: boardgenderData,
    });

    output.push({
      target_sub_category: 'Management Gender',
      data: managegenderData,
    });
    return output;
  }

  const handleSubmit = (values: any) => {
    handleGovernanceValuesPostApi(convertFormat(values));
  };

  const [valid, setValid] = useState(false);

  const FieldsFilledInt = (values: any) => {
    const ageFilled = values.boardIndData.every(
      (item: any) => Number.isInteger(item.target) // Check if targetTons is an integer
    );
    const genderFilled = values.boardGenderData.every(
      (item: any) => Number.isInteger(item.target) // Check if targetTons is an integer
    );

    const mgenderFilled = values.ManagementGenderData.every(
      (item: any) => Number.isInteger(item.target) // Check if targetTons is an integer
    );

    return ageFilled && genderFilled && mgenderFilled;
  };

  const [formValues, setFormValues] = useState({
    boardIndData: [
      {
        boardInd: 'Independent Directors',
        previousYear: boardInd[0],
        targetPercentage: null,
        target: null,
      },
      {
        boardInd: 'Other Directors',
        previousYear: boardInd[1],
        targetPercentage: null,
        target: null,
      },
    ],
    boardGenderData: [
      {
        boardGender: 'Male',
        previousYear: boardgenderPrev[0],
        targetPercentage: null,
        target: null,
      },
      {
        boardGender: 'Female',
        previousYear: boardgenderPrev[1],
        targetPercentage: null,
        target: null,
      },
    ],
    ManagementGenderData: [
      {
        ManagementGender: 'Male',
        previousYear: managegenderPrev[0],
        targetPercentage: null,
        target: null,
      },
      {
        ManagementGender: 'Female',
        previousYear: managegenderPrev[1],
        targetPercentage: null,
        target: null,
      },
    ],
  });

  return (
    <div className={Styles.targetsettingGhg}>
      <PageCardComponent loading={loading}>
        <Row className={Styles.targetSubTitle}>
          Promote strong corporate governance. Define targets for achieving
          gender diversity on your board and within management. Set goals for
          the number of independent directors and establish a clear vision for
          reducing corruption and non-compliance incidents.
        </Row>
        <Formik
          initialValues={formValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, resetForm }: any) => {
            setValid(FieldsFilledInt(values));

            const allFieldsFilled = () => {
              // Check if all scope1, scope2, and scope3 fields have values
              const ageFilled = values.boardIndData.every(
                (item: any) =>
                  item.previousYear !== null && item.targetPercentage !== null
              );
              const genderFilled = values.boardGenderData.every(
                (item: any) =>
                  item.previousYear !== null && item.targetPercentage !== null
              );
              const mgenderFilled = values.ManagementGenderData.every(
                (item: any) =>
                  item.previousYear !== null && item.targetPercentage !== null
              );

              return ageFilled && genderFilled && mgenderFilled;
            };
            return (
              <Form
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent form submission on Enter
                  }
                }}
              >
                <Row className={Styles.headingScope}>Board Independence</Row>

                {values.boardIndData.map((item: any, index: any) => (
                  <React.Fragment key={index}>
                    <Row gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        Board Independence
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Previous Reporting Period </p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target Percentage (%)</p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target </p>
                      </Col>
                    </Row>
                    <Row key={index} className={Styles.rowItem} gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        <Input
                          value={item.boardInd}
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
                                `boardIndData[${index}].previousYear`, // Corrected path
                                value
                              );

                              const updatedValues = {
                                ...values,
                                boardIndData: values.boardIndData.map(
                                  (g: any, i: any) =>
                                    i === index
                                      ? { ...g, previousYear: value || 0 }
                                      : g
                                ),
                              };

                              const previousYearMale =
                                updatedValues.boardIndData[0]?.previousYear ??
                                0;
                              const previousYearFemale =
                                updatedValues.boardIndData[1]?.previousYear ??
                                0;

                              const indTargetMale = calculateTargetTonsGender(
                                updatedValues.boardIndData[0]?.previousYear,
                                updatedValues.boardIndData[1]?.previousYear,
                                updatedValues.boardIndData[0]?.targetPercentage
                              );
                              const indTargetFemale = calculateTargetTonsGender(
                                updatedValues.boardIndData[1]?.previousYear,
                                updatedValues.boardIndData[0]?.previousYear,
                                updatedValues.boardIndData[1]?.targetPercentage
                              );
                              setFieldValue(
                                `boardIndData[0].target`,
                                indTargetMale
                              );
                              setFieldValue(
                                `boardIndData[1].target`,
                                indTargetFemale
                              );

                              const othTargetTons = calculateTargetTonsGender(
                                previousYearMale,
                                previousYearFemale,
                                values.boardIndData[1]?.targetPercentage
                              );
                              setFieldValue(
                                `boardIndData[1].target`,
                                othTargetTons
                              );
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              governancetargets[0]?.data[index]
                                ?.previous_reporting_year || ''
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
                                  e.target.value === ''
                                    ? null
                                    : parseFloat(e.target.value);

                                // Automatically adjust the other gender's target to make the total 100%
                                const otherIndex = index === 0 ? 1 : 0;
                                const otherValue =
                                  value !== null ? 100 - value : null;
                                setFieldValue(
                                  `boardIndData[${otherIndex}].targetPercentage`,
                                  otherValue
                                );

                                let updatedValues: any;

                                if (index === 0) {
                                  setFieldValue(
                                    `boardIndData[${index}].targetPercentage`, // Corrected path
                                    value
                                  );
                                  setFieldValue(
                                    `boardIndData[1].targetPercentage`,
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    boardIndData: values.boardIndData.map(
                                      (g: any, i: any) =>
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
                                    `boardIndData[${index}].targetPercentage`,
                                    value
                                  );

                                  setFieldValue(
                                    `boardIndData[0].targetPercentage`,
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    boardIndData: values.boardIndData.map(
                                      (g: any, i: any) =>
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

                                const previousYearMale =
                                  updatedValues.boardIndData[0]?.previousYear ??
                                  0;
                                const previousYearFemale =
                                  updatedValues.boardIndData[1]?.previousYear ??
                                  0;

                                const indTargetTons = calculateTargetTonsGender(
                                  previousYearMale,
                                  previousYearFemale,
                                  updatedValues.boardIndData[0].targetPercentage
                                );

                                setFieldValue(
                                  `boardIndData[0].target`,
                                  indTargetTons
                                );

                                const othTargetTons = calculateTargetTonsGender(
                                  previousYearMale,
                                  previousYearFemale,
                                  updatedValues.boardIndData[1].targetPercentage
                                );

                                setFieldValue(
                                  `boardIndData[1].target`,
                                  othTargetTons
                                );

                                updatedValues = {
                                  ...values,
                                  boardIndData: values.boardIndData.map(
                                    (g: any, i: any) =>
                                      i === 0
                                        ? {
                                            ...g,
                                            target: indTargetTons,
                                            targetPercentage:
                                              updatedValues?.boardIndData[0]
                                                .targetPercentage,
                                          }
                                        : i === 1
                                          ? {
                                              ...g,
                                              target: othTargetTons,
                                              targetPercentage:
                                                updatedValues?.boardIndData[1]
                                                  .targetPercentage,
                                            }
                                          : g
                                  ),
                                };
                              }
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              governancetargets[0]?.data[index]
                                ?.target_percentage || ''
                            }
                            disabled
                          />
                        )}
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          item.previousYear !== null &&
                          values.boardIndData[0]?.previousYear !== null &&
                          values.boardIndData[1]?.previousYear !== null &&
                          item.targetPercentage !== null ? (
                            <Input
                              value={item.target ?? ''}
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
                              governancetargets[0]?.data[index]
                                ?.current_reporting_year_target || ''
                            }
                            disabled
                          />
                        )}
                      </Col>
                    </Row>
                  </React.Fragment>
                ))}
                <Row className={Styles.headingScope}>Board Diversity</Row>

                {values.boardGenderData.map((item: any, index: any) => (
                  <React.Fragment key={index}>
                    <Row gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        Board Gender Diversity
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Previous Reporting Period </p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target Percentage (%)</p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target </p>
                      </Col>
                    </Row>
                    <Row key={index} className={Styles.rowItem} gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        <Input
                          value={item.boardGender}
                          disabled
                          className={Styles.disabledInput}
                        />
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          !isEmpty(boardgenderPrev[index]) ? (
                            <Input value={item.previousYear} disabled />
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
                                  `boardGenderData[${index}].previousYear`, // Corrected path
                                  value
                                );

                                const updatedValues = {
                                  ...values,
                                  boardGenderData: values.boardGenderData.map(
                                    (g: any, i: any) =>
                                      i === index
                                        ? { ...g, previousYear: value }
                                        : g
                                  ),
                                };

                                const previousYearMale =
                                  updatedValues.boardGenderData[0]
                                    ?.previousYear ?? 0;
                                const previousYearFemale =
                                  updatedValues.boardGenderData[1]
                                    ?.previousYear ?? 0;

                                const maleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.boardGenderData[0]
                                      ?.targetPercentage
                                  );
                                setFieldValue(
                                  `boardGenderData[0].target`,
                                  maleTargetTons
                                );

                                const femaleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.boardGenderData[1]
                                      ?.targetPercentage
                                  );
                                setFieldValue(
                                  `boardGenderData[1].target`,
                                  femaleTargetTons
                                );
                              }}
                            />
                          )
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              governancetargets[1]?.data[index]
                                ?.previous_reporting_year || ''
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
                                  e.target.value === ''
                                    ? null
                                    : parseFloat(e.target.value);

                                let updatedValues = values;
                                // Automatically adjust the other gender's target to make the total 100%
                                const otherIndex = index === 0 ? 1 : 0;
                                const otherValue =
                                  value !== null ? 100 - value : null;

                                if (index === 0) {
                                  setFieldValue(
                                    `boardGenderData[${index}].targetPercentage`, // Corrected path
                                    value
                                  );
                                  setFieldValue(
                                    `boardGenderData[1].targetPercentage`, // Corrected path
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    boardGenderData: values.boardGenderData.map(
                                      (g: any, i: any) =>
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
                                    `boardGenderData[${index}].targetPercentage`,
                                    value
                                  );

                                  setFieldValue(
                                    `boardGenderData[0].targetPercentage`,
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    boardGenderData: values.boardGenderData.map(
                                      (g: any, i: any) =>
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

                                const previousYearMale =
                                  updatedValues.boardGenderData[0]
                                    ?.previousYear ?? 0;
                                const previousYearFemale =
                                  updatedValues.boardGenderData[1]
                                    ?.previousYear ?? 0;

                                const maleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.boardGenderData[0]
                                      ?.targetPercentage
                                  );

                                setFieldValue(
                                  `boardGenderData[0].target`,
                                  maleTargetTons
                                );

                                const femaleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.boardGenderData[1]
                                      ?.targetPercentage
                                  );

                                setFieldValue(
                                  `boardGenderData[1].target`,
                                  femaleTargetTons
                                );

                                updatedValues = {
                                  ...values,
                                  boardGenderData: values.boardGenderData.map(
                                    (g: any, i: any) =>
                                      i === 0
                                        ? {
                                            ...g,
                                            target: maleTargetTons,
                                            targetPercentage:
                                              updatedValues?.boardGenderData[0]
                                                .targetPercentage,
                                          }
                                        : i === 1
                                          ? {
                                              ...g,
                                              target: femaleTargetTons,
                                              targetPercentage:
                                                updatedValues
                                                  ?.boardGenderData[1]
                                                  .targetPercentage,
                                            }
                                          : g
                                  ),
                                };
                              }
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              governancetargets[1]?.data[index]
                                ?.target_percentage || ''
                            }
                            disabled
                          />
                        )}
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          item.previousYear !== null &&
                          values.boardGenderData[0]?.previousYear !== null &&
                          values.boardGenderData[1]?.previousYear !== null &&
                          item.targetPercentage !== null ? (
                            <Input
                              value={item.target ?? ''}
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
                              governancetargets[1]?.data[index]
                                ?.current_reporting_year_target || ''
                            }
                            disabled
                          />
                        )}
                      </Col>
                    </Row>
                  </React.Fragment>
                ))}
                <Row className={Styles.headingScope}>Management Diversity</Row>
                {values.ManagementGenderData.map((item: any, index: any) => (
                  <React.Fragment key={index}>
                    <Row gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        Management Gender Diversity
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Previous Reporting Period </p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target Percentage (%)</p>
                      </Col>
                      <Col span={6} className={Styles.subheading}>
                        <p>Target </p>
                      </Col>
                    </Row>
                    <Row key={index} className={Styles.rowItem} gutter={16}>
                      <Col span={6} className={Styles.subheading}>
                        <Input
                          value={item.ManagementGender}
                          disabled
                          className={Styles.disabledInput}
                        />
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          !isEmpty(managegenderPrev[index]) ? (
                            <Input value={item.previousYear} disabled />
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
                                  `ManagementGenderData[${index}].previousYear`, // Corrected path
                                  value
                                );

                                const updatedValues = {
                                  ...values,
                                  ManagementGenderData:
                                    values.ManagementGenderData.map(
                                      (g: any, i: any) =>
                                        i === index
                                          ? { ...g, previousYear: value }
                                          : g
                                    ),
                                };

                                const previousYearMale =
                                  updatedValues.ManagementGenderData[0]
                                    ?.previousYear ?? 0;
                                const previousYearFemale =
                                  updatedValues.ManagementGenderData[1]
                                    ?.previousYear ?? 0;

                                const maleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.ManagementGenderData[0]
                                      ?.targetPercentage
                                  );
                                setFieldValue(
                                  `ManagementGenderData[0].target`,
                                  maleTargetTons
                                );

                                const femaleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.ManagementGenderData[1]
                                      ?.targetPercentage
                                  );
                                setFieldValue(
                                  `ManagementGenderData[1].target`,
                                  femaleTargetTons
                                );
                              }}
                            />
                          )
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              governancetargets[2]?.data[index]
                                ?.previous_reporting_year || ''
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
                                  e.target.value === ''
                                    ? null
                                    : parseFloat(e.target.value);
                                setFieldValue(
                                  `ManagementGenderData[${index}].targetPercentage`, // Corrected path
                                  value
                                );

                                // Automatically adjust the other gender's target to make the total 100%
                                const otherIndex = index === 0 ? 1 : 0;
                                const otherValue =
                                  value !== null ? 100 - value : null;
                                setFieldValue(
                                  `ManagementGenderData[${otherIndex}].targetPercentage`,
                                  otherValue
                                );

                                let updatedValues = { ...values };

                                if (index === 0) {
                                  setFieldValue(
                                    `ManagementGenderData[${index}].targetPercentage`, // Corrected path
                                    value
                                  );
                                  setFieldValue(
                                    `ManagementGenderData[1].targetPercentage`, // Corrected path
                                    otherValue
                                  );
                                  updatedValues = {
                                    ...values,
                                    ManagementGenderData:
                                      values.ManagementGenderData.map(
                                        (g: any, i: any) =>
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
                                    `ManagementGenderData[${index}].targetPercentage`,
                                    value
                                  );

                                  setFieldValue(
                                    `ManagementGenderData[0].targetPercentage`,
                                    otherValue
                                  );

                                  updatedValues = {
                                    ...values,
                                    ManagementGenderData:
                                      values.ManagementGenderData.map(
                                        (g: any, i: any) =>
                                          i === 0
                                            ? {
                                                ...g,
                                                targetPercentage: otherValue,
                                              }
                                            : i === 1
                                              ? {
                                                  ...g,
                                                  targetPercentage: value,
                                                }
                                              : g
                                      ),
                                  };
                                }

                                const previousYearMale =
                                  updatedValues.ManagementGenderData[0]
                                    ?.previousYear ?? 0;
                                const previousYearFemale =
                                  updatedValues.ManagementGenderData[1]
                                    ?.previousYear ?? 0;

                                const maleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.ManagementGenderData[0]
                                      ?.targetPercentage
                                  );

                                setFieldValue(
                                  `ManagementGenderData[0].target`,
                                  maleTargetTons
                                );

                                const femaleTargetTons =
                                  calculateTargetTonsGender(
                                    previousYearMale,
                                    previousYearFemale,
                                    updatedValues.ManagementGenderData[1]
                                      ?.targetPercentage
                                  );

                                setFieldValue(
                                  `ManagementGenderData[1].target`,
                                  femaleTargetTons
                                );

                                updatedValues = {
                                  ...values,
                                  ManagementGenderData:
                                    values.ManagementGenderData.map(
                                      (g: any, i: any) =>
                                        i === 0
                                          ? {
                                              ...g,
                                              target: maleTargetTons,
                                              targetPercentage:
                                                updatedValues
                                                  ?.ManagementGenderData[0]
                                                  .targetPercentage,
                                            }
                                          : i === 1
                                            ? {
                                                ...g,
                                                target: femaleTargetTons,
                                                targetPercentage:
                                                  updatedValues
                                                    ?.ManagementGenderData[1]
                                                    .targetPercentage,
                                              }
                                            : g
                                    ),
                                };
                              }
                            }}
                          />
                        ) : (
                          <Input
                            className={Styles.disabledInput}
                            type="number"
                            value={
                              governancetargets[2]?.data[index]
                                ?.target_percentage || ''
                            }
                            disabled
                          />
                        )}
                      </Col>
                      <Col span={6}>
                        {user.role === 'ADMIN' ? (
                          item.previousYear !== null &&
                          values.ManagementGenderData[0]?.previousYear !==
                            null &&
                          values.ManagementGenderData[1]?.previousYear !==
                            null &&
                          item.targetPercentage !== null ? (
                            <Input
                              value={item.target ?? ''}
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
                              governancetargets[2]?.data[index]
                                ?.current_reporting_year_target || ''
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

export default TargetSettingGovernance;
