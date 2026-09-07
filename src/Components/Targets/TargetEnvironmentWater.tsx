import React, { useEffect, useState } from 'react';
import Styles from './targetScreens.module.scss';
import { Col, Row, Card, Input, Select, message } from 'antd';
import { get, post } from '../../Services';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { Formik, Form } from 'formik';
import TargetWater from '../../assets/Svg/TargetSettings/TargetWater';
import TargetEffluents from '../../assets/Svg/TargetSettings/TargetEffluents';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

const { Option } = Select;

function TargetEnvironmentWater() {
  const { user } = useAuth();

  const watersources = [
    'Surface Water',
    'Ground Water',
    'Sea Water',
    'Produced Water',
    'Govt. supplied Water',
    'Potable Water',
    'Recycled Water',
    'NEWater',
  ];

  const initialValues = {
    water: [
      {
        'Source of Water': '',
        'Percentage Reduction': '',
        'Water Consumption Target': '',
      },
    ],
    effluents: [
      {
        Effluent: 'Discharge',
        'Percentage Reduction': '',
        'Total Effluents Target': '',
      },
    ],
  };

  const [totalWaterConsumption, setTotalWaterConsumption] = useState(0);
  const [totalEffluents, setTotalEffluents] = useState(0);

  const calculateTotal = (values: any, key: any) => {
    return values.reduce(
      (total: any, item: any) => total + (parseFloat(item[key]) || 0),
      0
    );
  };

  const handleAddRow = (values: any, setValues: any) => {
    const newRow = {
      'Source of Water': '',
      'Percentage Reduction': '',
      'Water Consumption Target': '',
    };
    setValues({
      ...values,
      water: [...values.water, newRow],
    });
  };

  const handleRemoveRow = (index: any, values: any, setValues: any) => {
    const newWater = values.water.filter((_: any, i: any) => i !== index);
    setValues({
      ...values,
      water: newWater,
    });
  };

  const reduction_array = [
    {
      svg: <TargetWater />,
      name: 'Total Water Consumption Target',
      value: !isEmpty(totalWaterConsumption)
        ? `${formatNumberUS(totalWaterConsumption)} m3`
        : '',
      color: '#00B8F5',
    },
    {
      svg: <TargetEffluents />,
      name: 'Total Effluents Target',
      value: !isEmpty(totalEffluents)
        ? `${formatNumberUS(totalEffluents)} m3`
        : '',
      color: '#00C0AE',
    },
  ];

  const handleWaterValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user.entity_Id,
      target_category: 'Water Consumption and Effluents Targets',
      sub_categories: values,
    };
    post(path, body)
      .then((res) => {})
      .catch((err) => {
        if (!isEmpty(err?.response?.data?.message)) {
          message.error(err?.response?.data?.message);
        }
      });
  };

  function transformData(data: any) {
    const result = {
      water: {
        sub_category_total: 0,
        data: [],
      },
      effluents: {
        sub_category_total: 0,
        data: [],
      },
    };

    data.forEach((item: any) => {
      switch (item.target_sub_category) {
        case 'Total Water Consumption Target':
          result.water.sub_category_total = item.sub_category_total;
          result.water.data = result.water.data.concat(item.data);
          break;
        case 'Total Effluents Target':
          result.effluents.sub_category_total = item.sub_category_total;
          result.effluents.data = result.effluents.data.concat(item.data);
          break;
        default:
          break;
      }
    });

    return result;
  }

  const [watertargets, setWatertargets] = useState<any[]>([]);

  const handleWaterValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=Water Consumption and Effluents Targets`
    )
      .then((res) => {
        const resdata = res?.response?.data;
        if (!isEmpty(resdata)) {
          setWatertargets(resdata);
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message))
          message.error(err?.response?.data.message);
      });
  };

  const transformedData: any = !isEmpty(watertargets)
    ? transformData(watertargets)
    : null;

  useEffect(() => {
    if (user.role !== 'ADMIN') {
      handleWaterValuesGetApi();
    }
  }, []);

  function getValuesByKey(key: any, data: any) {
    if (!isEmpty(data) && data.hasOwnProperty(key)) {
      return data[key];
    } else {
      console.error(`Key "${key}" not found in data.`);
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
      {/* <Row className={Styles.targetHeader}>
        Water Consumption and Effluents Targets
      </Row> */}
      <PageCardComponent className={Styles.pageCard}>
        <Row className={Styles.targetSubTitle}>
          Manage your water footprint effectively. Here, you can set targets for
          reducing water consumption from various sources. Additionally, define
          goals for lowering effluent discharge and implementing sustainable
          water management practices.
        </Row>
        <Row gutter={24} className={Styles.outer}>
          {!isEmpty(reduction_array) &&
            reduction_array?.map((item, index) => (
              <Col span={12} key={index}>
                <Row
                  gutter={8}
                  style={{ backgroundColor: item.color }}
                  className={Styles.container1}
                >
                  <Col span={4}>{item.svg}</Col>
                  <Col span={10} className={Styles.text1}>
                    {item.name}
                  </Col>
                  <Col span={4} offset={6} className={Styles.text2}>
                    <p>
                      {user.role === 'ADMIN'
                        ? formatNumberUS(item.value)
                        : formatNumberUS(
                            watertargets[index]?.sub_category_total
                          )}
                    </p>
                  </Col>
                </Row>
              </Col>
            ))}
        </Row>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            const formattedValues = [
              {
                target_sub_category: 'Total Water Consumption Target',
                data: values?.water,
              },
              {
                target_sub_category: 'Total Effluents Target',
                data: values?.effluents,
              },
            ];
            !isEmpty(formattedValues) &&
              handleWaterValuesPostApi(formattedValues);
            message.success('Data added successfully');
          }}
        >
          {({
            values,
            handleChange,
            resetForm,
            handleReset,
            setValues,
            setFieldValue,
          }) => (
            <Form onReset={handleReset}>
              <Row gutter={16} className="mt-3">
                <Col span={12} className="p-0">
                  <Card className={Styles.cards}>
                    <Row className={`${Styles.cardRowWater} p-0`}>
                      <Col span={6}>
                        <p className={Styles.targetHeader2}>Source of Water</p>
                      </Col>
                      <Col span={user.role === 'ADMIN' ? 8 : 9}>
                        <p className={Styles.targetHeaderTarget}>
                          Percentage Reduction (%)
                        </p>
                      </Col>
                      <Col span={user.role === 'ADMIN' ? 8 : 9}>
                        <p className={Styles.targetHeaderTarget}>
                          Water Consumption Target (m3)
                        </p>
                      </Col>
                    </Row>
                    {user.role === 'ADMIN' &&
                      values.water.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-scope1-${index}`}
                          className={Styles.cardRow2Water}
                        >
                          <Col span={6}>
                            {user.role === 'ADMIN' && (
                              <Select
                                onChange={(value: any) => {
                                  setFieldValue(
                                    `water[${index}]['Source of Water']`,
                                    value
                                  );
                                }}
                                value={data['Source of Water']}
                                className={Styles.waterSource}
                              >
                                {!isEmpty(watersources) &&
                                  watersources.map((item, idx) => (
                                    <Option value={item} key={idx}>
                                      {item}
                                    </Option>
                                  ))}
                              </Select>
                            )}
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' && (
                              <Input
                                type="number"
                                name={`water[${index}].Percentage Reduction`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
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
                                value={data['Percentage Reduction']}
                                className={Styles.inputStyle}
                              />
                            )}
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' && (
                              <Input
                                type="number"
                                name={`water[${index}].Water Consumption Target`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                  const newWater = [...values.water];
                                  newWater[index]['Water Consumption Target'] =
                                    value;
                                  setValues({
                                    ...values,
                                    water: newWater,
                                  });
                                  setTotalWaterConsumption(
                                    calculateTotal(
                                      newWater,
                                      'Water Consumption Target'
                                    )
                                  );
                                }}
                                value={data['Water Consumption Target']}
                                className={Styles.inputStyle}
                              />
                            )}
                          </Col>
                          {user.role === 'ADMIN' && (
                            <Col span={2}>
                              <ButtonComponent
                                hierarchy="secondary-gray"
                                onClick={() =>
                                  handleRemoveRow(index, values, setValues)
                                }
                              >
                                -
                              </ButtonComponent>
                            </Col>
                          )}
                        </Row>
                      ))}
                    {user.role === 'ADMIN' && (
                      <Row>
                        <ButtonComponent
                          hierarchy="primary"
                          className={Styles.addRow}
                          onClick={() => handleAddRow(values, setValues)}
                        >
                          +
                        </ButtonComponent>
                      </Row>
                    )}
                    {user.role !== 'ADMIN' &&
                      !isEmpty(transformedData) &&
                      transformedData?.water.data.map(
                        (data1: any, index: any) => (
                          <Row
                            gutter={12}
                            align="middle"
                            key={`environment-scope1-${index}`}
                            className={Styles.cardRow2Water}
                          >
                            <Col span={6}>
                              <p>
                                {getValuesByKey('Source of Water', data1) != ''
                                  ? getValuesByKey('Source of Water', data1)
                                  : 0}
                              </p>
                            </Col>
                            <Col span={9}>
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey('Percentage Reduction', data1)
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Percentage Reduction',
                                        data1
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            </Col>
                            <Col span={9}>
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Water Consumption Target',
                                    data1
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Water Consumption Target',
                                        data1
                                      )
                                    )
                                  : '0.00'}
                              </p>
                            </Col>
                          </Row>
                        )
                      )}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className={Styles.cards}>
                    <Row className={`${Styles.cardRowEfflents} p-0`}>
                      <Col span={6}>
                        <p className={Styles.targetHeader2}>Effluent</p>
                      </Col>
                      <Col span={9}>
                        <p className={Styles.targetHeaderTarget}>
                          Percentage Reduction (%)
                        </p>
                      </Col>
                      <Col span={9}>
                        <p className={Styles.targetHeaderTarget}>
                          Total Effluents Target (m3)
                        </p>
                      </Col>
                    </Row>
                    {user.role === 'ADMIN' &&
                      values.effluents.map((data, index) => (
                        <Row
                          align="middle"
                          key={`environment-scope2-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={6}>
                            <p>{data['Effluent']}</p>
                          </Col>
                          <Col span={9} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' && (
                              <Input
                                type="number"
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                name={`effluents[${index}].Percentage Reduction`}
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
                                value={data['Percentage Reduction']}
                                className={Styles.inputStyle}
                              />
                            )}
                          </Col>
                          <Col span={9} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' && (
                              <Input
                                type="number"
                                name={`effluents[${index}].Total Effluents Target`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  handleChange(e);
                                  const newEffluents = [...values.effluents];
                                  newEffluents[index][
                                    'Total Effluents Target'
                                  ] = value;
                                  setValues({
                                    ...values,
                                    effluents: newEffluents,
                                  });
                                  setTotalEffluents(
                                    calculateTotal(
                                      newEffluents,
                                      'Total Effluents Target'
                                    )
                                  );
                                }}
                                value={data['Total Effluents Target']}
                                className={Styles.inputStyle}
                              />
                            )}
                          </Col>
                        </Row>
                      ))}
                    {user.role !== 'ADMIN' &&
                      !isEmpty(transformedData) &&
                      transformedData?.effluents.data.map(
                        (data1: any, index: any) => (
                          <Row
                            gutter={12}
                            align="middle"
                            key={`environment-scope2-${index}`}
                            className={Styles.cardRow2}
                          >
                            <Col span={6}>
                              <p>{data1['Effluent']}</p>
                            </Col>
                            <Col span={9}>
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(data1['Percentage Reduction'])
                                  ? formatNumberUS(
                                      data1['Percentage Reduction']
                                    )
                                  : '0.00'}
                              </p>
                            </Col>
                            <Col span={9}>
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(data1['Total Effluents Target'])
                                  ? formatNumberUS(
                                      data1['Total Effluents Target']
                                    )
                                  : '0.00'}
                              </p>
                            </Col>
                          </Row>
                        )
                      )}
                  </Card>
                </Col>
              </Row>
              {user.role === 'ADMIN' && (
                <Row gutter={12} className={Styles.buttonRow}>
                  <Col>
                    <ButtonComponent
                      onClick={() => resetForm({ values: initialValues })}
                      htmlType="reset"
                      hierarchy="tertiary"
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

export default TargetEnvironmentWater;
