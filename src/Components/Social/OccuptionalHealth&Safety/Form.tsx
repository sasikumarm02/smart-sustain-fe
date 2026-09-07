import React, { useState } from 'react';
import {
  Col,
  Row,
  Form,
  Button,
  Typography,
  Form as AntdForm,
  Tabs,
} from 'antd';
import { useNotification } from '../../../Hooks/useNotification';

import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../Components/FormInput/CustomInput';
import { post } from '../../../Services';
import Styles from '../form.module.scss';
import type { TabsProps } from 'antd';
interface Values {}

function Forms() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const wasteData = [
    {
      key: 1,
      title: 'Fatalities',
      title1: 'Numbers',
      name1: 'FatalitiesNumbers',
    },
    {
      key: 2,
      title: 'High consequence injuries',
      name1: 'HighConsequenceInjuries',
    },
    {
      key: 3,
      title: 'Recordable injuries',
      name1: 'RecordableInjuries',
    },
    {
      key: 4,
      title: 'Recordable work-related ill-health cases',
      name1: 'RecordableCases',
    },
  ];
  const wasteDataRatio = [
    {
      key: 1,
      title: 'Injury rate',
      title1: 'Ratios',
      name1: 'InjuryRate',
    },
    {
      key: 2,
      title: 'Occupational disease rate',
      name1: 'OccupationalDisease',
    },
    {
      key: 3,
      title: 'Lost day rate',
      name1: 'LostDayRate',
    },
    {
      key: 4,
      title: 'High risk/ incidence workers',
      name1: 'HighRiskWorkers',
    },
  ];
  const navigate = useNavigate();
  function handleLabel(key: any, title: any) {
    if (key === 1) {
      return title;
    } else return null;
  }
  const fieldNames = [
    'FatalitiesNumbers',
    'HighConsequenceInjuries',
    'RecordableInjuries',
    'RecordableCases',
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
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Statistics',
      children: (
        <>
          <Col span={24} className="AnttabSty">
            {/* <p
         style={{
           color: "#23456A",
           fontSize: "18px",
           fontWeight: "400",
           fontFamily: "Arial",
         }}
       >
         Statistics
       </p> */}
            <Formik
              initialValues={{
                FatalitiesNumbers: '',
                HighConsequenceInjuries: '',
                RecordableInjuries: '',
                RecordableCases: '',
              }}
              //  validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                console.log(values, 'values');

                //   values.entity_id = entityName;
                //  values.premiseId = values.premiseId.toString();
                //  setIsLoading(true);
                //  post(``, values)
                //    .then((res: any) => {
                //      if (res?.status === "Success") {
                //        if (res?.response?.status === true) {
                //          openToast({
                //            content: `${res.message}`,
                //            type: "success",
                //          });
                //          resetForm();
                //          navigate(`/add-data/environment/waste`);
                //        }
                //      }
                //    })
                //    .catch((err) =>
                //      openToast({
                //        content: `${err}`,
                //        type: "error",
                //      })
                //    )
                //    .finally(() => setIsLoading(false));
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
                          <Col lg={8} className={Styles.allFormLabel}>
                            <p className={Styles.paratitleSty}>{data.title} </p>
                          </Col>
                          <Col lg={8} className="center-label-input">
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
                        </Row>
                      );
                    })}

                    <Col span={8}>
                      <Button className={Styles.occupatioBtn}>+ Add</Button>
                    </Col>

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
        </>
      ),
    },
    {
      key: '2',
      label: 'Ratios',
      children: (
        <>
          <Col span={24} className="AnttabSty">
            {/* <p
         style={{
           color: "#23456A",
           fontSize: "18px",
           fontWeight: "400",
           fontFamily: "Arial",
         }}
       >
         Statistics
       </p> */}
            <Formik
              initialValues={{
                InjuryRate: '',
                OccupationalDisease: '',
                LostDayRate: '',
                HighRiskWorkers: '',
              }}
              //  validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                console.log(values, 'values');

                //   values.entity_id = entityName;
                //  values.premiseId = values.premiseId.toString();
                //  setIsLoading(true);
                //  post(``, values)
                //    .then((res: any) => {
                //      if (res?.status === "Success") {
                //        if (res?.response?.status === true) {
                //          openToast({
                //            content: `${res.message}`,
                //            type: "success",
                //          });
                //          resetForm();
                //          navigate(`/add-data/environment/waste`);
                //        }
                //      }
                //    })
                //    .catch((err) =>
                //      openToast({
                //        content: `${err}`,
                //        type: "error",
                //      })
                //    )
                //    .finally(() => setIsLoading(false));
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
                    {wasteDataRatio.map((data: any, index: any) => {
                      const i = data.key;

                      return (
                        <Row gutter={12} align="middle" key={index}>
                          <Col lg={8} className={Styles.allFormLabel}>
                            <Typography.Title
                              level={5}
                              style={{
                                color: '#797979',
                                fontSize: '18px',
                                fontWeight: '400',
                              }}
                            >
                              {data.title}{' '}
                            </Typography.Title>
                          </Col>
                          <Col lg={8} className="center-label-input">
                            <CustomInput
                              label={handleLabel(i, `${data.title1}`)}
                              size="large"
                              name={data.name1}
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
                        </Row>
                      );
                    })}

                    <Col span={8}>
                      <Button className={Styles.occupatioBtn}>+ Add</Button>
                    </Col>

                    <Row justify="end" style={{ paddingTop: '20px' }}>
                      <Col span={4} className={Styles.DisplayButton}>
                        <Form.Item>
                          <Button
                            type="primary"
                            size="middle"
                            htmlType="reset"
                            className={Styles.BtnDesign1}
                          >
                            Reset
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
        </>
      ),
    },
  ];
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            Social / <span>Occupational health & safety</span>{' '}
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
            Occupational health & safety
          </p>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Col>
      </Row>
    </>
  );
}

export default Forms;
