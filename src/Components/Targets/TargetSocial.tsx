import React, { useEffect, useState } from 'react';
import Styles from './targetScreens.module.scss';
import { Col, Row, Card, Input, message } from 'antd';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { Formik, Form, Field } from 'formik';
import { get, post } from '../../Services';
import SocialGender from '../../assets/Svg/TargetSettings/SocialGender';
import SocialAgegroup from '../../assets/Svg/TargetSettings/SocialAgegroup';
import SocialSafety from '../../assets/Svg/TargetSettings/SocialSafety';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

function TargetSocial() {
  const socialGender = ['Male', 'Female'];
  const { user } = useAuth();

  const [socialtargets, setSocialtargets] = useState<any[]>([]);

  const socialAgegroup = ['<30', '30-50', '>50'];
  const socialSafety = ['Fatalities', 'Injuries'];

  const initialValues = {
    gender: socialGender.reduce(
      (acc: any, label: any) => ({
        ...acc,
        [label]: { percentage: '', target: '' },
      }),
      {}
    ),
    agegroup: socialAgegroup.reduce(
      (acc: any, label: any) => ({
        ...acc,
        [label]: { percentage: '', target: '' },
      }),
      {}
    ),
    safety: socialSafety.reduce(
      (acc: any, label: any) => ({
        ...acc,
        [label]: { percentage: '', target: '' },
      }),
      {}
    ),
  };

  const scope_array = [
    {
      svg: <SocialGender />,
      name: 'Gender Diversity',
      color: '#FD349C',
    },
    {
      svg: <SocialAgegroup />,
      name: 'Age-based Diversity',
      color: '#1E49E2',
    },
    {
      svg: <SocialSafety />,
      name: 'Safety Performance',
      color: '#00C0AE',
    },
  ];

  const transformValues = (values: any) => {
    const transformed = [];

    const mapCategory = (category: any, label: any) => {
      return {
        [`${category} Diversity`]: label,
        'Percentage Target (%)': values[category][label]?.percentage,
        Target: values[category][label]?.target,
      };
    };

    transformed.push({
      target_sub_category: 'gender',
      data: Object.keys(values?.gender).map((label) =>
        mapCategory('gender', label)
      ),
    });

    transformed.push({
      target_sub_category: 'Age',
      data: Object.keys(values?.agegroup).map((label) =>
        mapCategory('agegroup', label)
      ),
    });

    transformed.push({
      target_sub_category: 'Safety Performance',
      data: Object.keys(values.safety).map((label) => ({
        'Safety Performance': label,
        Target: values.safety[label]?.target,
      })),
    });

    return transformed;
  };

  const handleSocialValuesPostApi = (values: any) => {
    const path = '/targets/create_target/';
    const body = {
      entity_Id: user.entity_Id,
      target_category: 'Social Targets',
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

  const handleSocialValuesGetApi = () => {
    const path = '/targets/get_target/';
    get(`${path}?entity_Id=${user.entity_Id}&target_category=Social Targets`)
      .then((res) => {
        if (!isEmpty(res.response.data)) {
          setSocialtargets(res.response.data);
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
      {/* <Row className={Styles.targetHeader}>Social Targets</Row> */}
      <PageCardComponent className={Styles.pageCard}>
        <Row className={Styles.targetSubTitle}>
          Foster a diverse and inclusive workplace. Establish targets for
          employee demographics, aiming for a balanced male-to-female ratio and
          age representation. Additionally, set safety performance goals to
          minimise fatalities and injuries within your organisation.
        </Row>
        <Row gutter={24} className="mt-3">
          {!isEmpty(scope_array) &&
            scope_array?.map((item, key) => (
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
            handleSocialValuesPostApi(values);
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
                          Employee Gender Diversity
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
                    {!isEmpty(socialGender) &&
                      socialGender.map((data, index) => (
                        <Row
                          gutter={16}
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
                                name={`gender.${data}.percentage`}
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
                                  values.gender[
                                    data as keyof typeof values.gender
                                  ].percentage
                                }
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <>
                                <p className={Styles.displayTextGHG}>
                                  {!isEmpty(
                                    getValuesByKey(
                                      'Percentage Target (%)',
                                      socialtargets[0]?.data[index]
                                    )
                                  )
                                    ? formatNumberUS(
                                        getValuesByKey(
                                          'Percentage Target (%)',
                                          socialtargets[0]?.data[index]
                                        )
                                      )
                                    : '0.00'}
                                </p>
                              </>
                            )}
                          </Col>
                          <Col span={8} className={Styles.inputDiv}>
                            {user.role === 'ADMIN' ? (
                              <Input
                                type="number"
                                name={`gender.${data}.target`}
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleChange(e);
                                }}
                                value={
                                  values.gender[
                                    data as keyof typeof values.gender
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
                                      socialtargets[0]?.data[index]
                                    )
                                  )
                                    ? formatNumberUS(
                                        getValuesByKey(
                                          'Target',
                                          socialtargets[0]?.data[index]
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
                          Age-based Diversity
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
                    {!isEmpty(socialAgegroup) &&
                      socialAgegroup.map((data, index) => (
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
                                name={`agegroup.${data}.percentage`}
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
                                    socialtargets[1]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Percentage Target (%)',
                                        socialtargets[1]?.data[index]
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
                                name={`agegroup.${data}.target`}
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
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
                              <>
                                <p className={Styles.displayTextGHG}>
                                  {!isEmpty(
                                    getValuesByKey(
                                      'Target',
                                      socialtargets[1]?.data[index]
                                    )
                                  )
                                    ? formatNumberUS(
                                        getValuesByKey(
                                          'Target',
                                          socialtargets[1]?.data[index]
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
                      <Col span={12}>
                        <p className={Styles.targetHeader2}>
                          Safety Performance
                        </p>
                      </Col>
                      <Col span={12}>
                        <p className={Styles.targetHeaderTarget}>Target</p>
                      </Col>
                    </Row>
                    {!isEmpty(socialSafety) &&
                      socialSafety.map((data, index) => (
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
                                name={`safety.${data}.target`}
                                onKeyDown={handleKeyDown2}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const formatInt = parseInt(value);
                                  handleChange(e);
                                }}
                                value={values.safety[data].target}
                                className={Styles.inputStyle}
                              />
                            ) : (
                              <p className={Styles.displayTextGHG}>
                                {!isEmpty(
                                  getValuesByKey(
                                    'Target',
                                    socialtargets[2]?.data[index]
                                  )
                                )
                                  ? formatNumberUS(
                                      getValuesByKey(
                                        'Target',
                                        socialtargets[2]?.data[index]
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

export default TargetSocial;
