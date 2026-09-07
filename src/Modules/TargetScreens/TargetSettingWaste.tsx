import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { Button, Input, Row, Col, message } from 'antd';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import Styles from './targetscreens.module.scss';
import { useAuth } from '../../Hooks/useAuth';
import { get, post } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

interface EmissionData {
  source: string;
  previousYear: number;
  percentageReduction: number | null;
  consumptionTarget: number | null;
}

function TargetSettingWaste() {
  const [totalWasteConsumption, setTotalWasteConsumption] = useState<number>(0);

  const calculateWasteTarget = (
    previousYear: number,
    percentageReduction: number | null
  ) => {
    if (percentageReduction === null || isNaN(percentageReduction)) {
      return null;
    }
    return previousYear * (1 - percentageReduction / 100);
  };

  const updateTotalWasteConsumption = (waterConsumption: EmissionData[]) => {
    const total = waterConsumption?.reduce(
      (acc, item) => acc + (item.consumptionTarget || 0),
      0
    );
    setTotalWasteConsumption(total);
  };

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const handleIntialState = () => {};

  const [wastePrev, setWastePrev] = useState<any[]>([]);

  const handleWastePrevValuesGetApi = () => {
    setLoading(true);
    const path = '/targets/fetch_previous_data_for_target/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        const resdata = res?.response?.data?.data;
        if (!isEmpty(resdata)) {
          setWastePrev([resdata.waste_recycled, resdata.waste_disposed]);
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
    handleWasteValuesGetApi();
  }, []);

  const initialWasteData: EmissionData[] = [
    {
      source: 'Recycled',
      previousYear: wastePrev[0],
      percentageReduction: null,
      consumptionTarget: null,
    },
    {
      source: 'Disposed',
      previousYear: wastePrev[1],
      percentageReduction: null,
      consumptionTarget: null,
    },
  ];

  const [IsFilledData, setIsFilledData] = React.useState(false);

  const [formValues, setFormValues] = useState({
    wasteConsumption: [
      {
        source: 'Recycled',
        previousYear: wastePrev[0],
        percentageReduction: null,
        consumptionTarget: null,
      },
      {
        source: 'Disposed',
        previousYear: wastePrev[1],
        percentageReduction: null,
        consumptionTarget: null,
      },
    ],
  });

  const transformApiData = (formikValues: any) => {
    // Define an array to hold the transformed data
    const transformedData = formikValues.map((item: any) => ({
      source: item.type,
      previousYear: item.previous_reporting_year,
      percentageReduction: item.target_percentage,
      consumptionTarget: item.current_reporting_year_target,
    }));

    return transformedData;
  };

  function convertFormat(input: any) {
    const output = [];

    // Handling water consumption
    const wasteData = input.wasteConsumption.map((item: any) => ({
      type: item.source,
      previous_reporting_year: item.previousYear,
      target_percentage: item.percentageReduction,
      current_reporting_year_target: item.consumptionTarget,
    }));

    output.push({
      target_sub_category: 'Waste',
      data: wasteData,
    });
    return output;
  }

  const handleWasteValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    if (!isEmpty(values)) {
      const body = {
        entity_Id: user.entity_Id,
        target_category: 'Waste Generation Targets',
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
    }
  };

  const [wastetargets, setWastetargets] = useState<any[]>([]);
  const [wastetotal, setWastetotal] = useState(0);

  const handleWasteValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=Waste Generation Targets`
    )
      .then((res) => {
        const resdata = res?.response?.data;
        if (!isEmpty(resdata)) {
          setWastetargets(resdata[0].data);
          setWastetotal(resdata[0].sub_category_total);
          setFormValues({
            wasteConsumption: transformApiData(resdata[0].data),
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

  const handleSubmit = (values: any) => {
    const transformData = convertFormat(values);
    handleWasteValuesPostApi(transformData);
  };

  return (
    <div className={Styles.targetSettingWater}>
      <div className={Styles.targetCardWrapper}>
        <PageCardComponent loading={loading}>
          <Row className={Styles.targetSubTitle}>
            Minimise your environmental impact by reducing waste generation. Set
            targets for total waste generation, including both recycled and
            disposed waste. This section allows you to design a strategic plan
            for responsible waste management.{' '}
          </Row>

          <Formik
            initialValues={formValues}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, resetForm }: any) => {
              updateTotalWasteConsumption(values?.wasteConsumption);

              const allFieldsFilled = () => {
                // Check if all scope1, scope2, and scope3 fields have values
                const wasteFilled = values?.wasteConsumption?.every(
                  (item: any) =>
                    item.previousYear !== null &&
                    item.percentageReduction !== null
                );

                return wasteFilled;
              };

              return (
                <Form
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault(); // Prevent form submission on Enter
                    }
                  }}
                >
                  {/* <Row >
                  {user.role === 'ADMIN' ? (
                     <div className={Styles.headingScope}>
                    <h5 className={Styles.brownLabel}>Total Waste Generation Target </h5> {' '}
                    <h5 className={Styles.blackValue}>{totalWasteConsumption?.toFixed(2)} tonnes</h5> 
                    </div>
                  ) : (
                    <div className={Styles.headingScope}>
                      <h5 className={Styles.brownLabel}>Total Waste Generation Target </h5>{' '}
                      <h5 className={Styles.blackValue}>{formatNumberUS(wastetotal)} tonnes</h5>
                    </div>
                  )}
                </Row> */}
                  <div className={Styles.headingScope}>
                    <h5 className={Styles.brownLabel}>
                      Total Waste Generation Target
                    </h5>
                    <h5 className={Styles.blackValue}>
                      {user.role === 'ADMIN'
                        ? totalWasteConsumption?.toFixed(2)
                        : formatNumberUS(wastetotal)}{' '}
                      tonnes
                    </h5>
                  </div>

                  {values?.wasteConsumption?.map((item: any, index: any) => (
                    <React.Fragment key={index}>
                      <Row gutter={16}>
                        <Col span={6} className={Styles.subheading}>
                          <p>Waste Management</p>
                        </Col>
                        <Col span={6} className={Styles.subheading}>
                          <p>Previous Reporting Year (tonnes)</p>
                        </Col>
                        <Col span={6} className={Styles.subheading}>
                          <p>Target Percentage (%)</p>
                        </Col>
                        <Col span={6} className={Styles.subheading}>
                          <p>Current Reporting Year Target (tonnes)</p>
                        </Col>
                      </Row>
                      <Row key={index} className={Styles.rowItem} gutter={16}>
                        <Col span={6}>
                          <Input
                            value={item.source}
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
                                  `wasteConsumption[${index}].previousYear`,
                                  value
                                ); // Updated path here
                              }}
                            />
                          ) : (
                            <Input
                              className={Styles.disabledInput}
                              type="number"
                              value={
                                formatNumberUS(
                                  wastetargets[index]?.previous_reporting_year
                                ) || ''
                              }
                              disabled
                            />
                          )}
                        </Col>
                        <Col span={6}>
                          {user.role === 'ADMIN' ? (
                            <Input
                              type="number"
                              className={Styles.enabledInput}
                              onKeyDown={handleKeyDown}
                              value={item.percentageReduction ?? ''}
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
                                    `wasteConsumption[${index}].percentageReduction`,
                                    value
                                  ); // Updated path here
                                  const newConsumptionTarget =
                                    calculateWasteTarget(
                                      item.previousYear,
                                      value
                                    );
                                  setFieldValue(
                                    `wasteConsumption[${index}].consumptionTarget`,
                                    newConsumptionTarget
                                  );
                                } // Updated path here
                              }}
                            />
                          ) : (
                            <Input
                              className={Styles.disabledInput}
                              type="number"
                              value={formatNumberUS(
                                wastetargets[index]?.target_percentage
                              )}
                              disabled
                            />
                          )}
                        </Col>
                        <Col span={6}>
                          {user.role === 'ADMIN' ? (
                            <Input
                              value={item.consumptionTarget?.toFixed(2) ?? ''}
                              disabled
                              className={Styles.disabledInput}
                            />
                          ) : (
                            <Input
                              className={Styles.disabledInput}
                              type="number"
                              value={formatNumberUS(
                                wastetargets[index]
                                  ?.current_reporting_year_target
                              )}
                              disabled
                            />
                          )}
                        </Col>
                      </Row>
                    </React.Fragment>
                  ))}
                  {/* Buttons */}

                  {user.role === 'ADMIN' && (
                    <Row justify="end" className={Styles.buttonRowWaste}>
                      {!IsFilledData && (
                        <ButtonComponent
                          hierarchy="secondary"
                          onClick={() => resetForm()}
                          className={`${Styles.button} ${Styles.resetBtn}`}
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
    </div>
  );
}

export default TargetSettingWaste;
