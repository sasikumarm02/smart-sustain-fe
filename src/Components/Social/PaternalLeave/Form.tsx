import React, { useState } from 'react';
import { Col, Row, Form, Button, Typography, Form as AntdForm } from 'antd';
import { useNotification } from '../../../Hooks/useNotification';

import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../Components/FormInput/CustomInput';
import { post } from '../../../Services';
import Styles from '../form.module.scss';

interface Values {}

function Forms() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const wasteData = [
    {
      key: 1,
      title: 'Number entitled to parental leave',
      title1: 'Female',
      name1: 'NumberParentalLeaveFemale',
      title2: 'Male',
      name2: 'NumberParentalLeaveMale',
    },
    {
      key: 2,
      title: 'Number that took parental leave',
      name1: 'TookParentalLeaveFemale',
      name2: 'TookParentalLeaveMale',
    },
    {
      key: 3,
      title: 'Number that returned to work after parental leave',
      name1: 'returnedAfterRarentalLeaveFeamle',
      name2: 'returnedAfterRarentalLeaveMale',
    },
    {
      key: 4,
      title:
        'Number that returned to work after parental leave and retained for > 12 months',
      name1: 'returnedAfterRarentalLeaveRetainedFeamle',
      name2: 'returnedAfterRarentalLeaveRetainedMale',
    },
  ];
  const navigate = useNavigate();
  function handleLabel(key: any, title: any) {
    if (key === 1) {
      return title;
    } else return null;
  }
  const fieldNames = [
    'NumberParentalLeaveFemale',
    'NumberParentalLeaveMale',
    'TookParentalLeaveFemale',
    'TookParentalLeaveMale',
    'returnedAfterRarentalLeaveFeamle',
    'returnedAfterRarentalLeaveMale',
    'returnedAfterRarentalLeaveRetainedFeamle',
    'returnedAfterRarentalLeaveRetainedMale',
  ];
  const validationSchema = Yup.object().shape({
    premiseId: Yup.array()
      .of(Yup.string())
      .required('Required!')
      .min(1, 'At least one premise must be selected'),
    ...fieldNames.reduce(
      (acc: any, fieldName: any) => ({
        ...acc,
        [fieldName]: Yup.string().required('Required!'),
      }),
      {}
    ),
  });
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            Social / <span>Parental leave</span>{' '}
          </p>
        </Col>
      </Row>
      <Row justify="end" style={{ background: '#fff', paddingTop: '15px' }}>
        <Col span={10} style={{ display: 'contents' }}>
          <Formik
            initialValues={{
              incorporationDate: '',
              entitySelect: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { resetForm }) => {
              navigate('/add-facility');
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              setFieldValue,
              handleSubmit,
              handleBlur,
              setFieldTouched,
              handleReset,
              isValid,
              dirty,
              resetForm,
            }) => {
              return (
                <Form
                  layout="vertical"
                  onFinish={handleSubmit}
                  onReset={handleReset}
                >
                  <Row
                    justify="center"
                    //   gutter={10}
                    align="middle"
                  >
                    <>
                      <Col span={12} className="CustomDate">
                        <CustomDatePicker
                          label=""
                          name="incorporationDate"
                          errors={errors.incorporationDate}
                          touched={touched.incorporationDate}
                          value={values.incorporationDate}
                          secondChange={setFieldValue}
                          blur={handleBlur}
                          size="large"
                          calenderColor={'#00B8F5'}
                          status={
                            (touched.incorporationDate &&
                              errors.incorporationDate &&
                              'error') ||
                            ''
                          }
                        />
                      </Col>
                      <Col span={12} className="SelectField">
                        <CustomSelect
                          label=""
                          name="entitySelect"
                          type="text"
                          size="large"
                          placeholder="Facility"
                          selectColor={'#00B8F5'}
                          options={[
                            {
                              value: 'Central Regain',
                              label: 'Central Regain',
                            },
                            {
                              value: 'East Regain',
                              label: 'East Regain',
                            },
                            {
                              value: 'North Regain',
                              label: 'North Regain',
                            },
                            {
                              value: 'North East Regain',
                              label: 'North East Regain',
                            },
                          ].map((item: any) => ({
                            value: item.value,
                          }))}
                          errors={errors.entitySelect}
                          touched={touched.entitySelect}
                          value={values.entitySelect}
                          secondChange={setFieldValue}
                          hook={handleChange}
                          blur={handleBlur}
                          status={
                            (touched.entitySelect &&
                              errors.entitySelect &&
                              'error') ||
                            ''
                          }
                        />
                      </Col>
                    </>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Col>
        <Col span={24} className="AnttabSty">
          <p
            style={{
              color: '#23456A',
              fontSize: '24px',
              fontWeight: '600',
              fontFamily: 'Arial',
            }}
          >
            Parental leave
          </p>
          <Formik
            initialValues={{
              NumberParentalLeaveFemale: '',
              NumberParentalLeaveMale: '',
              TookParentalLeaveFemale: '',
              TookParentalLeaveMale: '',
              returnedAfterRarentalLeaveFeamle: '',
              returnedAfterRarentalLeaveMale: '',
              returnedAfterRarentalLeaveRetainedFeamle: '',
              returnedAfterRarentalLeaveRetainedMale: '',
            }}
            // validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              console.log(values, 'values');

              //   values.entity_id = entityName;
              // values.premiseId = values.premiseId.toString();
              // setIsLoading(true);
              // post(``, values)
              //   .then((res: any) => {
              //     if (res?.status === "Success") {
              //       if (res?.response?.status === true) {
              //         openToast({
              //           content: `${res.message}`,
              //           type: "success",
              //         });
              //         resetForm();
              //         navigate(`/add-data/environment/waste`);
              //       }
              //     }
              //   })
              //   .catch((err) =>
              //     openToast({
              //       content: `${err}`,
              //       type: "error",
              //     })
              //   )
              //   .finally(() => setIsLoading(false));
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              setFieldValue,
              handleSubmit,
              handleBlur,
              setFieldTouched,
              handleReset,
              isValid,
              dirty,
            }) => {
              return (
                <Form
                  layout="vertical"
                  onFinish={handleSubmit}
                  onReset={handleReset}
                >
                  {wasteData.map((data: any, index: any) => {
                    const i = data.key;

                    return (
                      <Row gutter={12} align="middle" key={index}>
                        <Col lg={12} className={Styles.allFormLabel}>
                          <p className={Styles.paratitleSty}>{data.title} </p>
                        </Col>
                        <Col lg={6} className="center-label-input">
                          <CustomInput
                            label={handleLabel(i, `${data.title1}`)}
                            size="large"
                            name={data.name1}
                            labelColor="#666666"
                            type="text"
                            errors={
                              touched[data.name1 as keyof Values] &&
                              errors[data.name1 as keyof Values]
                            }
                            touched={touched}
                            value={values[data.name1 as keyof Values]}
                            hook={handleChange}
                            blur={handleBlur}
                            status={
                              (touched[data.name1 as keyof Values] &&
                                errors[data.name1 as keyof Values] &&
                                'error') ||
                              ''
                            }
                          />
                        </Col>
                        <Col lg={6} className="center-label-input">
                          <CustomInput
                            label={handleLabel(i, `${data.title2}`)}
                            size="large"
                            name={data.name2}
                            labelColor="#666666"
                            type="text"
                            errors={
                              touched[data.name2 as keyof Values] &&
                              errors[data.name2 as keyof Values]
                            }
                            touched={touched}
                            value={values[data.name2 as keyof Values]}
                            hook={handleChange}
                            blur={handleBlur}
                            status={
                              (touched[data.name2 as keyof Values] &&
                                errors[data.name2 as keyof Values] &&
                                'error') ||
                              ''
                            }
                          />
                        </Col>
                      </Row>
                    );
                  })}
                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Clear All
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          className={Styles.BtnDesign}
                          htmlType="submit"
                          //   loading={isLoading}
                          //disabled={!(isValid && dirty)}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

export default Forms;
