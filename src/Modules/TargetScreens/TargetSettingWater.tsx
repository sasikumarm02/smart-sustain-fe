import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { Button, Input, Row, Col, Select, message } from 'antd';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import Styles from './targetscreens.module.scss';
import { useAuth } from '../../Hooks/useAuth';
import { get, post } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

const { Option } = Select;

interface EmissionData {
  source: string;
  previousYear: any;
  percentageReduction: number | null;
  consumptionTarget: number | null;
}

function TargetSettingWater() {
  const waterSources = [
    'Surface Water',
    'Ground Water',
    'Sea Water',
    'Produced Water',
    'Govt. supplied Water',
    'Potable Water',
    'Recycled Water',
    'NEWater',
  ];
  const [totalWaterConsumption, setTotalWaterConsumption] = useState<number>(0);
  const [totalEffluentsTarget, setTotalEffluentsTarget] = useState<number>(0);

  const calculateWaterTarget = (
    previousYear: number,
    percentageReduction: number | null
  ) => {
    if (percentageReduction === null || isNaN(percentageReduction)) {
      return null;
    }
    return previousYear * (1 - percentageReduction / 100);
  };

  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const handleIntialState = () => {};
  const [prevValues, setPrevValues] = useState<Record<string, any>>({});

  function prevMap(values: any) {
    const prev = {
      'Surface Water': values.surface_water,
      'Ground Water': values.ground_water,
      'Sea Water': values.Sea_Water,
      'Produced Water': values.produced_water,
      'Govt. supplied Water': values.govt_supply_water,
      'Potable Water': values.potable_water,
      'Recycled Water': values.recycled_water,
      NEWater: values.ne_water,
      Discharge: values.effluent_discharge,
    };
    setPrevValues(prev);
  }

  const handleWaterPrevValuesGetApi = () => {
    setLoading(true);
    const path = '/targets/fetch_previous_data_for_target/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        const resdata = res?.response?.data?.data;
        if (!isEmpty(resdata)) {
          setPrevValues(resdata);
          prevMap(resdata);
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

  function convertFormat(input: any) {
    const output = [];

    // Handling water consumption
    const waterData = input.waterConsumption.map((item: any) => ({
      type: item.source,
      previous_reporting_year: item.previousYear,
      target_percentage: item.percentageReduction,
      current_reporting_year_target: item.consumptionTarget,
    }));

    output.push({
      target_sub_category: 'Water',
      data: waterData,
    });

    // Handling effluent data
    const effluentData = {
      type: input.Effluent.source,
      previous_reporting_year: input.Effluent.previousYear,
      target_percentage: input.Effluent.percentageReduction,
      current_reporting_year_target: input.Effluent.consumptionTarget,
    };

    output.push({
      target_sub_category: 'Effluents',
      data: [effluentData],
    });

    return output;
  }

  const handleWaterValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user.entity_Id,
      target_category: 'Water Consumption and Effluents Targets',
      sub_categories: values,
    };
    post(path, body)
      .then((res) => {
        message.success('Targets set Successfully');
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data?.message)) {
          message.error(err?.response?.data?.message);
        }
      });
  };

  const [watertargets, setWaterTargets] = useState<any[]>([]);

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
  const [IsFilledData, setIsFilledData] = React.useState(false);
  const handleWaterValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=Water Consumption and Effluents Targets`
    )
      .then((res) => {
        const resdata = res?.response?.data;
        if (!isEmpty(resdata)) {
          setWaterTargets(resdata);
          setFormValues({
            waterConsumption: transformApiData(resdata[0].data),
            Effluent: transformApiData(resdata[1].data)[0],
          });
          setIsFilledData(true);
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message))
          message.error(err?.response?.data.message);
      });
  };

  useEffect(() => {
    handleWaterValuesGetApi();
  }, []);

  const initialWaterData: EmissionData[] = [
    {
      source: 'Surface Water',
      previousYear: prevValues['Surface Water'],
      percentageReduction: null,
      consumptionTarget: null,
    },
  ];

  const [formValues, setFormValues] = useState({
    waterConsumption: [
      {
        source: 'Surface Water',
        previousYear: prevValues['Surface Water'],
        percentageReduction: null,
        consumptionTarget: null,
      },
    ],
    Effluent: {
      source: 'Discharge',
      previousYear: prevValues['Discharge'],
      percentageReduction: null,
      consumptionTarget: null,
    },
  });

  const effluentData: EmissionData = {
    source: 'Discharge',
    previousYear: prevValues['Discharge'],
    percentageReduction: null,
    consumptionTarget: null,
  };

  const calculateEffluentTarget = (
    previousYear: number,
    percentageReduction: number | null
  ) => {
    if (percentageReduction === null || isNaN(percentageReduction)) {
      return null;
    }
    return previousYear * (1 - percentageReduction / 100);
  };

  const updateTotalWaterConsumption = (waterConsumption: EmissionData[]) => {
    const total = waterConsumption.reduce(
      (acc, item) => acc + (item?.consumptionTarget || 0),
      0
    );
    setTotalWaterConsumption(total);
  };

  const updateTotalEffluentsTarget = (effluent: EmissionData) => {
    setTotalEffluentsTarget(effluent.consumptionTarget || 0);
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
    const transformedValues = convertFormat(values);
    handleWaterValuesPostApi(transformedValues);
  };

  return (
    <div className={Styles.targetSettingWater}>
      <PageCardComponent loading={loading}>
        <Row className={Styles.targetSubTitle}>
          Manage your water consumption and effluence targets effectively. Here,
          you can set targets for reducing water consumption from various
          sources. Additionally, define goals for lowering effluent discharge
          and implementing sustainable water management practices.{' '}
        </Row>

        <Formik
          initialValues={formValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, resetForm }: any) => {
            updateTotalWaterConsumption(values?.waterConsumption);
            updateTotalEffluentsTarget(values?.Effluent);

            const allFieldsFilled = () => {
              // Check if all scope1, scope2, and scope3 fields have values
              const waterFilled = values.waterConsumption.every(
                (item: any) =>
                  item.previousYear !== null &&
                  item.percentageReduction !== null
              );
              const Efflentfilled =
                values.Effluent.previousYear !== null &&
                values.Effluent.percentageReduction !== null;

              return waterFilled && Efflentfilled;
            };

            return (
              <Form
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent form submission on Enter
                  }
                }}
              >
                {/* <Row className={Styles.headingScope}>
                  {user.role === 'ADMIN' ? (
                    <p>
                      Total Water Consumption Target:{' '}
                      {formatNumberUS(totalWaterConsumption)} m³
                    </p>
                  ) : (
                    <p>
                      Total Water Consumption Target:{' '}
                      {formatNumberUS(watertargets[0]?.sub_category_total)}
                    </p>
                  )}
                </Row> */}
                <Row className={Styles.headingScope}>
                  {user.role === 'ADMIN' ? (
                    <>
                      <h5 className={Styles.brownLabel}>
                        Total Water Consumption Target
                      </h5>
                      <h5 className={Styles.blackValue}>
                        {formatNumberUS(totalWaterConsumption)} m³
                      </h5>
                    </>
                  ) : (
                    <>
                      <h5 className={Styles.brownLabel}>
                        Total Water Consumption Target
                      </h5>
                      <h5 className={Styles.blackValue}>
                        {formatNumberUS(watertargets[0]?.sub_category_total)}
                      </h5>
                    </>
                  )}
                </Row>
                {/* <div className={Styles.headingScope}>
                    <h5 className={Styles.brownLabel}>
                      Total Waste Generation Target
                    </h5>
                    <h5 className={Styles.blackValue}>
                      {user.role === 'ADMIN'
                        ? totalWasteConsumption?.toFixed(2)
                        : formatNumberUS(wastetotal)}{' '}
                      tonnes
                    </h5>
                  </div> */}
                {user.role === 'ADMIN' ? (
                  <FieldArray
                    name="waterConsumption"
                    render={(arrayHelpers) => (
                      <>
                        {values.waterConsumption.map(
                          (item: any, index: any) => (
                            <React.Fragment key={index}>
                              <Row gutter={16}>
                                <Col span={6} className={Styles.subheading}>
                                  <p>Source of Water</p>
                                </Col>
                                <Col span={6} className={Styles.subheading}>
                                  <p>Previous Reporting Period (m³)</p>
                                </Col>
                                <Col span={6} className={Styles.subheading}>
                                  <p>Percentage Reduction (%)</p>
                                </Col>
                                <Col span={6} className={Styles.subheading}>
                                  <p>Water Consumption Target (m³)</p>
                                </Col>
                              </Row>
                              <Row
                                key={index}
                                className={Styles.rowItem}
                                gutter={16}
                              >
                                <Col span={6}>
                                  <Select
                                    className={Styles.enabledInput}
                                    value={item.source}
                                    onChange={(value) => {
                                      setFieldValue(
                                        `waterConsumption[${index}].source`,
                                        value
                                      );
                                      setFieldValue(
                                        `waterConsumption[${index}].previousYear`,
                                        prevValues[value]
                                      );
                                    }}
                                    style={{ width: '100%' }}
                                  >
                                    {waterSources.map((source) => (
                                      <Option key={source} value={source}>
                                        {source}
                                      </Option>
                                    ))}
                                  </Select>
                                </Col>
                                <Col span={6}>
                                  {!isEmpty(prevValues[item.source]) ? (
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
                                          `waterConsumption[${index}].previousYear`,
                                          value
                                        );
                                        const newConsumptionTarget =
                                          calculateWaterTarget(
                                            Number(value),
                                            item.percentageReduction
                                          );
                                        setFieldValue(
                                          `waterConsumption[${index}].consumptionTarget`,
                                          newConsumptionTarget
                                        );
                                      }}
                                    />
                                  )}
                                </Col>
                                <Col span={6}>
                                  <Input
                                    className={Styles.enabledInput}
                                    type="number"
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
                                          `waterConsumption[${index}].percentageReduction`,
                                          value
                                        );
                                        const newConsumptionTarget =
                                          calculateWaterTarget(
                                            item.previousYear,
                                            value
                                          );
                                        setFieldValue(
                                          `waterConsumption[${index}].consumptionTarget`,
                                          newConsumptionTarget
                                        );
                                      }
                                    }}
                                  />
                                </Col>
                                <Col span={4}>
                                  <Input
                                    className={Styles.disabledInput}
                                    value={
                                      item?.consumptionTarget?.toFixed(2) ?? ''
                                    }
                                    disabled
                                  />
                                </Col>
                                <Col span={2}>
                                  <ButtonComponent
                                    hierarchy="secondary"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    -
                                  </ButtonComponent>
                                </Col>
                              </Row>
                            </React.Fragment>
                          )
                        )}
                        <Row>
                          <ButtonComponent
                            className={Styles.plus}
                            hierarchy="primary"
                            onClick={() =>
                              arrayHelpers.push({
                                source: '',
                                previousYear: null,
                                percentageReduction: null,
                                consumptionTarget: null,
                              })
                            }
                          >
                            +
                          </ButtonComponent>
                        </Row>
                      </>
                    )}
                  />
                ) : (
                  <>
                    {watertargets[0]?.data.map((item: any, index: any) => (
                      <React.Fragment>
                        <Row gutter={16}>
                          <Col span={6} className={Styles.subheading}>
                            <p>Source of Water</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Previous Reporting Period (m³)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Percentage Reduction (%)</p>
                          </Col>
                          <Col span={6} className={Styles.subheading}>
                            <p>Water Consumption Target (m³)</p>
                          </Col>
                        </Row>
                        <Row key={index} className={Styles.rowItem} gutter={16}>
                          <Col span={6}>
                            <Input
                              className={Styles.disabledInput}
                              type="text"
                              value={
                                formatNumberUS(
                                  watertargets[0]?.data[index]?.type
                                ) || ''
                              }
                              disabled
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              className={Styles.disabledInput}
                              type="text"
                              value={
                                formatNumberUS(
                                  watertargets[0]?.data[index]
                                    ?.previous_reporting_year
                                ) || ''
                              }
                              disabled
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              className={Styles.disabledInput}
                              type="text"
                              value={
                                formatNumberUS(
                                  watertargets[0]?.data[index]
                                    ?.target_percentage
                                ) || ''
                              }
                              disabled
                            />
                          </Col>
                          <Col span={6}>
                            <Input
                              className={Styles.disabledInput}
                              type="text"
                              value={
                                formatNumberUS(
                                  watertargets[0]?.data[index]
                                    ?.current_reporting_year_target
                                ) || ''
                              }
                              disabled
                            />
                          </Col>
                        </Row>
                      </React.Fragment>
                    ))}
                  </>
                )}
                <Row className={Styles.headingScope}>
                  {user.role === 'ADMIN' ? (
                    <>
                      <h5 className={Styles.brownLabel}>
                        Total Effluents Target
                      </h5>
                      <h5 className={Styles.blackValue}>
                        {formatNumberUS(totalEffluentsTarget.toFixed(2))} m³
                      </h5>
                    </>
                  ) : (
                    <>
                      <h5 className={Styles.brownLabel}>
                        Total Effluents Target
                      </h5>
                      <h5 className={Styles.blackValue}>
                        {formatNumberUS(watertargets[1]?.sub_category_total)}
                      </h5>
                    </>
                  )}
                </Row>
                <Row gutter={16}>
                  <Col span={6} className={Styles.subheading}>
                    <p>Effluent</p>
                  </Col>
                  <Col span={6} className={Styles.subheading}>
                    <p>Previous Reporting Period (m³)</p>
                  </Col>
                  <Col span={6} className={Styles.subheading}>
                    <p>Percentage Reduction (%)</p>
                  </Col>
                  <Col span={6} className={Styles.subheading}>
                    <p>Effluents Target (m³)</p>
                  </Col>
                </Row>
                <Row gutter={16} className={Styles.rowItem}>
                  <Col span={6}>
                    <Input
                      value={values.Effluent.source}
                      disabled
                      className={Styles.disabledInput}
                    />
                  </Col>
                  <Col span={6}>
                    {user.role === 'ADMIN' ? (
                      <Input
                        className={Styles.enabledInput}
                        value={values.Effluent.previousYear ?? ''}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                          const value =
                            e.target.value === ''
                              ? null
                              : parseFloat(e.target.value);
                          setFieldValue('Effluent.previousYear', value);
                          const newConsumptionTarget = calculateEffluentTarget(
                            Number(value),
                            values.Effluent.percentageReduction
                          );
                          setFieldValue(
                            'Effluent.consumptionTarget',
                            newConsumptionTarget
                          );
                        }}
                      />
                    ) : (
                      <Input
                        className={Styles.disabledInput}
                        type="number"
                        value={
                          watertargets[1]?.data[0]?.previous_reporting_year ||
                          ''
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
                        value={values.Effluent.percentageReduction ?? ''}
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
                              'Effluent.percentageReduction',
                              value
                            );
                            const newConsumptionTarget =
                              calculateEffluentTarget(
                                values.Effluent.previousYear,
                                value
                              );
                            setFieldValue(
                              'Effluent.consumptionTarget',
                              newConsumptionTarget
                            );
                          }
                        }}
                      />
                    ) : (
                      <Input
                        className={Styles.disabledInput}
                        type="number"
                        value={
                          watertargets[1]?.data[0]?.target_percentage || ''
                        }
                        disabled
                      />
                    )}
                  </Col>
                  <Col span={6}>
                    {user.role === 'ADMIN' ? (
                      <Input
                        className={Styles.disabledInput2}
                        value={
                          values.Effluent.consumptionTarget?.toFixed(2) ?? ''
                        }
                        disabled
                      />
                    ) : (
                      <Input
                        className={Styles.disabledInput}
                        type="number"
                        value={
                          watertargets[1]?.data[0]
                            ?.current_reporting_year_target || ''
                        }
                        disabled
                      />
                    )}
                  </Col>
                </Row>

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

export default TargetSettingWater;
