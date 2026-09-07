import { useEffect, useState } from 'react';
import Styles from './targetScreens.module.scss';
import { Col, Row, Card, Input, message } from 'antd';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { Formik, Form } from 'formik';
import { useAuth } from '../../Hooks/useAuth';
import { get, post } from '../../Services';
import TargetWaste from '../../assets/Svg/TargetSettings/TargetWaste';
import targetwaste from '../../assets/image/targetwaste.png';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

function TargetEnvironmentWaste() {
  const wastesources = ['Recycled', 'Disposed'];
  const { user } = useAuth();

  const initialValues = {
    waste: wastesources.map((source) => ({
      'Waste management': source,
      'Percentage Reduction': '',
      'Waste Generated Target': '',
    })),
  };

  const [wastetargets, setWastetargets] = useState<any[]>([]);
  const [apiresponse, setApiresponse] = useState<any[]>([]);

  const [totalWasteGenerated, setTotalWasteGenerated] = useState(0);

  const updateTotalWasteGenerated = (values: any) => {
    const total = values?.waste?.reduce(
      (acc: number, item: any) =>
        acc + (parseFloat(item['Waste Generated Target']) || 0),
      0
    );
    if (!isEmpty(total)) {
      setTotalWasteGenerated(total);
    }
  };

  const handleWasteValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    if (!isEmpty(values.waste)) {
      const body = {
        entity_Id: user.entity_Id,
        target_category: 'Waste Generation Targets',

        sub_categories: [
          {
            target_sub_category: 'Total Waste Generation Target',
            data: values.waste.map((item: any) => ({
              Waste: item['Waste management'],
              Percentage: item['Percentage Reduction'],
              Target: item['Waste Generated Target'],
            })),
          },
        ],
      };
      post(`${path}`, body)
        .then((res) => {})
        .catch((err) => {
          if (!isEmpty(err?.response?.data.message)) {
            message.error(err?.response?.data.message);
          }
        });
    }
  };

  const handleWasteValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(
      `${path}?entity_Id=${user.entity_Id}&target_category=Waste Generation Targets`
    )
      .then((res) => {
        const resdata = res?.response?.data;
        if (!isEmpty(resdata)) {
          setWastetargets(resdata[0].data);
          setApiresponse(resdata);
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
      handleWasteValuesGetApi();
    }
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

  const handleWheel = (event: any) => {
    // Prevent scrolling in the input field with mouse wheel
    event.preventDefault();
  };

  return (
    <div className={Styles.pageCardStyle}>
      {/* <Row className={Styles.targetHeader}>Waste Generation Targets</Row> */}
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleWasteValuesPostApi(values);
          message.success('Data added successfully');
        }}
      >
        {({ values, handleChange, resetForm }) => (
          <PageCardComponent className={Styles.pageCard}>
            <Row className={Styles.targetSubTitle}>
              Minimize your environmental impact by reducing waste generation.
              Set targets for total waste reduction, including both recycled and
              disposed waste. This section allows you to design a strategic plan
              for responsible waste management.
            </Row>
            <Form>
              <Row gutter={24} className={Styles.outer}>
                <Col span={12}>
                  <Row
                    gutter={8}
                    style={{ backgroundColor: '#00B8F5' }}
                    className={Styles.container1}
                  >
                    <Col span={4}>
                      <TargetWaste />
                    </Col>
                    <Col span={10} className={Styles.text1}>
                      Total Waste Generated Target
                    </Col>
                    <Col span={6} offset={4} className={Styles.text2}>
                      <p>
                        {user.role != 'ADMIN' && !isEmpty(apiresponse)
                          ? !isEmpty(apiresponse[0]?.sub_category_total)
                            ? formatNumberUS(apiresponse[0]?.sub_category_total)
                            : '0.00'
                          : formatNumberUS(totalWasteGenerated)}{' '}
                        tonnes
                      </p>
                    </Col>
                  </Row>
                  <Card className={Styles.cardsWaste}>
                    <Row className={Styles.cardRow}>
                      <Col span={6}>
                        <p className={Styles.targetHeader2}>Waste Management</p>
                      </Col>
                      <Col span={9}>
                        <p className={Styles.targetHeaderTarget}>
                          Percentage Reduction (%)
                        </p>
                      </Col>
                      <Col span={9}>
                        <p className={Styles.targetHeaderTarget}>
                          Waste Generated Target (tonnes)
                        </p>
                      </Col>
                    </Row>
                    {user.role === 'ADMIN' &&
                      !isEmpty(values.waste) &&
                      values.waste.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-waste-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={6}>
                            <p>{data['Waste management']}</p>
                          </Col>
                          <Col span={9} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' && (
                              <Input
                                type="number"
                                name={`waste[${index}].Percentage Reduction`}
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
                          <Col span={9} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' && (
                              <Input
                                type="number"
                                name={`waste[${index}].Waste Generated Target`}
                                onKeyDown={handleKeyDown}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                  const updatedValues = { ...values };
                                  updatedValues.waste[index][
                                    'Waste Generated Target'
                                  ] = value;
                                  updateTotalWasteGenerated(updatedValues);
                                }}
                                value={data['Waste Generated Target']}
                                className={Styles.inputStyle}
                              />
                            )}
                          </Col>
                        </Row>
                      ))}
                    {user.role !== 'ADMIN' &&
                      !isEmpty(wastetargets) &&
                      wastetargets.map((data, index) => (
                        <Row
                          gutter={12}
                          align="middle"
                          key={`environment-waste-${index}`}
                          className={Styles.cardRow2}
                        >
                          <Col span={6}>
                            <p>{data['Waste']}</p>
                          </Col>
                          <Col span={9} className={Styles.displayTextGHG}>
                            <p>
                              {!isEmpty(data['Percentage'])
                                ? formatNumberUS(data['Percentage'])
                                : '0.00'}
                            </p>
                          </Col>
                          <Col span={9} className={Styles.displayTextGHG}>
                            <p>
                              {!isEmpty(data['Target'])
                                ? formatNumberUS(data['Target'])
                                : '0.00'}
                            </p>
                          </Col>
                        </Row>
                      ))}
                  </Card>
                </Col>
                <Col
                  span={12}
                  className={Styles.image}
                  style={{ background: `url(${targetwaste})` }}
                ></Col>
              </Row>
              {user.role === 'ADMIN' && (
                <Row gutter={12} className={Styles.buttonRow}>
                  <Col>
                    <ButtonComponent
                      htmlType="reset"
                      onClick={() => resetForm({ values: initialValues })}
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
          </PageCardComponent>
        )}
      </Formik>
    </div>
  );
}

export default TargetEnvironmentWaste;
