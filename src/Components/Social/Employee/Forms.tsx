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
import Styles from '../../Social/form.module.scss';
import type { TabsProps } from 'antd';

interface Values {}

function Forms() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const wasteData = [
    {
      key: 1,
      title: 'Governance body members',
      title1: 'select',
      name1: 'select',
      time: 'Full time',
      title2: 'Male',
      name2: 'bioWasteUom',
      title3: 'Female',
      name3: 'bioWasteDischarge',
      title4: 'Others',
      name4: 'bioWasteRecycle',
      title5: '< 30',
      name5: 'bioWasteRecycle2',
      title6: '30 to 50',
      name6: 'bioWasteRecycle2',
      title7: '> 50',
      name7: 'bioWasteRecycle2',
    },
    {
      key: 2,
      title: 'Permanent employees',
      name1: 'plasticWasteUom',
      time: 'Full time',
    },
    {
      key: 3,
      title: 'Permanent employees',
      name1: 'eWasteUom',
      time: 'Part time',
    },
    {
      key: 4,
      title: 'Temporary employees',
      name1: 'bioMedicalWasteUom',
      time: 'Full time',
    },
    {
      key: 5,
      title: 'Temporary employees',
      name1: 'plasticWasteUom',
      time: 'Part time',
    },
  ];
  const navigate = useNavigate();
  function handleLabel(key: any, title: any) {
    if (key === 1) {
      return title;
    } else return null;
  }
  const fieldNames = [
    'bioWasteUom',
    'bioWasteDischarge',
    'bioWasteRecycle',
    'plasticWasteUom',
    'eWasteUom',
    'bioMedicalWasteUom',
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
  const UomDropdown = [
    { value: 'Parts per million(PPM)' },
    { value: 'Kilowatt-hour (kWh)' },
    { value: 'Centimeter (cm)' },
    { value: 'Square meter (Sqm)' },
    { value: 'Meter (m)' },
    { value: 'Square Kilometer (Sqkm)' },
    { value: 'Kilometer (km)' },
    { value: 'Millimeter (mm)' },
    { value: 'Feet (ft)' },
    { value: 'Square feet (sqft)' },
    { value: 'Inches (inch)' },
    { value: 'Mile' },
    { value: 'Square Yard' },
    { value: 'Yard' },
    { value: 'Running Meter (RM)' },
    { value: 'Milligram (mg)' },
    { value: 'Gram (g)' },
    { value: 'Kilogram (kg)' },
    { value: 'Ounce (oz)' },
    { value: 'Pound (lb)' },
    { value: 'Ton' },
    { value: 'Quintal' },
    { value: 'Millilitre (ml)' },
    { value: 'Litre (l)' },
    { value: 'Kilolitre (kl)' },
    { value: 'Cubic meter (Cum)' },
    { value: 'Cubic feet (cf)' },
    { value: 'Cubic Centimeter (cm3)' },
    { value: 'Fluid ounce (fl oz)' },
    { value: 'Gallon (gal)' },
    { value: 'Pint (pt)' },
    { value: 'Celsius (C)' },
    { value: 'Kelvin (K)' },
    { value: 'Fahrenheit (F)' },
    { value: 'Second (s)' },
    { value: 'Minute (min)' },
    { value: 'Hour (hr)' },
    { value: 'Day' },
    { value: 'Week' },
    { value: 'Month' },
    { value: 'Year' },
    { value: 'Litres per second (l/s)' },
    { value: 'Cubic feet per minute (cfm)' },
    { value: 'Liters per second (l/s)' },
    { value: 'Each' },
    { value: 'Lumsum' },
    { value: 'Number' },
    { value: 'Bag' },
    { value: 'Acre' },
    { value: 'Hectare' },
    { value: 'Guntha' },
    { value: 'Bigha' },
    { value: 'Biswa' },
    { value: 'Biswansi' },
    { value: 'Kaccha' },
    { value: 'Killa' },
    { value: 'Ghumaon' },
    { value: 'Kanal' },
    { value: 'Chatak' },
    { value: 'Dhur' },
    { value: 'Kattha' },
    { value: 'Ankanam' },
    { value: 'Cent' },
    { value: 'Kuncham' },
    { value: 'Furlong' },
    { value: 'Gaj' },
    { value: 'Hath' },
    { value: 'Inch' },
    { value: 'Newton' },
    { value: 'Hectometer' },
    { value: 'Decameter' },
    { value: 'Nanometer' },
    { value: 'Millimetre' },
    { value: 'Decimeter' },
    { value: 'Each' },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Opening Number of Employees',
      children: (
        <>
          <Row>
            <Col span={24} className="AnttabSty">
              <Formik
                initialValues={{
                  entity_id: '',
                  premiseId: '',
                  startDate: '',
                  endDate: '',
                  bioWasteUom: '',
                  bioWasteDischarge: '',
                  bioWasteRecycle: '',
                  plasticWasteUom: '',
                  eWasteUom: '',
                  bioMedicalWasteUom: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                  //   values.entity_id = entityName;
                  values.premiseId = values.premiseId.toString();
                  setIsLoading(true);
                  post(``, values)
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res.message}`,
                            type: 'success',
                          });
                          resetForm();
                          navigate(`/add-data/environment/waste`);
                        }
                      }
                    })
                    .catch((err) =>
                      openToast({
                        content: `${err}`,
                        type: 'error',
                      })
                    )
                    .finally(() => setIsLoading(false));
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
                          <Row gutter={12} align="bottom" key={index}>
                            <Col lg={8} className={Styles.allFormLabel}>
                              <p className={Styles.paratitleSty}>
                                {data.title}{' '}
                              </p>
                            </Col>
                            <Col
                              lg={4}
                              style={{ paddingTop: '30px' }}
                              className="energy-consumption-select"
                            >
                              <p
                                style={{
                                  color:
                                    data.time === 'Part time'
                                      ? '#FD349C'
                                      : '#1E49E2',
                                  fontSize: '18px',
                                }}
                              >
                                {data.time}
                              </p>
                            </Col>
                            <Col lg={12}>
                              <Row gutter={10}>
                                <Col lg={4} className="center-label-input">
                                  <CustomInput
                                    label={handleLabel(i, `${data.title2}`)}
                                    size="large"
                                    labelColor="#666666"
                                    name={data.name2}
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
                                <Col lg={4} className="center-label-input">
                                  <CustomInput
                                    label={handleLabel(i, `${data.title3}`)}
                                    size="large"
                                    name={data.name3}
                                    labelColor="#666666"
                                    type="text"
                                    errors={
                                      touched[data.name3 as keyof Values] &&
                                      errors[data.name3 as keyof Values]
                                    }
                                    touched={touched}
                                    value={values[data.name3 as keyof Values]}
                                    hook={handleChange}
                                    blur={handleBlur}
                                    status={
                                      (touched[data.name3 as keyof Values] &&
                                        errors[data.name3 as keyof Values] &&
                                        'error') ||
                                      ''
                                    }
                                  />
                                </Col>
                                <Col lg={4} className="center-label-input">
                                  <CustomInput
                                    label={handleLabel(i, `${data.title4}`)}
                                    size="large"
                                    name={data.name4}
                                    labelColor="#666666"
                                    type="text"
                                    errors={
                                      touched[data.name4 as keyof Values] &&
                                      errors[data.name4 as keyof Values]
                                    }
                                    touched={touched}
                                    value={values[data.name4 as keyof Values]}
                                    hook={handleChange}
                                    blur={handleBlur}
                                    status={
                                      (touched[data.name4 as keyof Values] &&
                                        errors[data.name4 as keyof Values] &&
                                        'error') ||
                                      ''
                                    }
                                  />
                                </Col>
                                <Col lg={4} className="center-label-input">
                                  <CustomInput
                                    label={handleLabel(i, `${data.title5}`)}
                                    size="large"
                                    name={data.name5}
                                    labelColor="#666666"
                                    type="text"
                                    errors={
                                      touched[data.name5 as keyof Values] &&
                                      errors[data.name5 as keyof Values]
                                    }
                                    touched={touched}
                                    value={values[data.name5 as keyof Values]}
                                    hook={handleChange}
                                    blur={handleBlur}
                                    status={
                                      (touched[data.name5 as keyof Values] &&
                                        errors[data.name5 as keyof Values] &&
                                        'error') ||
                                      ''
                                    }
                                  />
                                </Col>
                                <Col lg={4} className="center-label-input">
                                  <CustomInput
                                    label={handleLabel(i, `${data.title6}`)}
                                    size="large"
                                    labelColor="#666666"
                                    name={data.name6}
                                    type="text"
                                    errors={
                                      touched[data.name6 as keyof Values] &&
                                      errors[data.name6 as keyof Values]
                                    }
                                    touched={touched}
                                    value={values[data.name6 as keyof Values]}
                                    hook={handleChange}
                                    blur={handleBlur}
                                    status={
                                      (touched[data.name6 as keyof Values] &&
                                        errors[data.name6 as keyof Values] &&
                                        'error') ||
                                      ''
                                    }
                                  />
                                </Col>
                                <Col lg={4} className="center-label-input">
                                  <CustomInput
                                    label={handleLabel(i, `${data.title7}`)}
                                    size="large"
                                    name={data.name7}
                                    labelColor="#666666"
                                    type="text"
                                    errors={
                                      touched[data.name7 as keyof Values] &&
                                      errors[data.name7 as keyof Values]
                                    }
                                    touched={touched}
                                    value={values[data.name7 as keyof Values]}
                                    hook={handleChange}
                                    blur={handleBlur}
                                    status={
                                      (touched[data.name7 as keyof Values] &&
                                        errors[data.name7 as keyof Values] &&
                                        'error') ||
                                      ''
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        );
                      })}
                      <Col span={8} style={{ paddingTop: '10px' }}>
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
          </Row>
        </>
      ),
    },
    {
      key: '2',
      label: 'Left during the Period',
      children: (
        <>
          <Row>
            <Col span={24} className="AnttabSty">
              <Formik
                initialValues={{
                  entity_id: '',
                  premiseId: '',
                  startDate: '',
                  endDate: '',
                  bioWasteUom: '',
                  bioWasteDischarge: '',
                  bioWasteRecycle: '',
                  plasticWasteUom: '',
                  eWasteUom: '',
                  bioMedicalWasteUom: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                  //   values.entity_id = entityName;
                  values.premiseId = values.premiseId.toString();
                  setIsLoading(true);
                  post(``, values)
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res.message}`,
                            type: 'success',
                          });
                          resetForm();
                          navigate(`/add-data/environment/waste`);
                        }
                      }
                    })
                    .catch((err) =>
                      openToast({
                        content: `${err}`,
                        type: 'error',
                      })
                    )
                    .finally(() => setIsLoading(false));
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
                          <Row gutter={12} align="bottom" key={index}>
                            <Col lg={8} className={Styles.allFormLabel}>
                              <p className={Styles.paratitleSty}>
                                {data.title}{' '}
                              </p>
                            </Col>
                            <Col
                              span={4}
                              style={{ paddingTop: '30px' }}
                              className="energy-consumption-select"
                            >
                              <p
                                style={{
                                  color:
                                    data.time === 'Part time'
                                      ? '#FD349C'
                                      : '#1E49E2',
                                  fontSize: '18px',
                                }}
                              >
                                {data.time}
                              </p>
                            </Col>

                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title2}`)}
                                size="large"
                                labelColor="#666666"
                                name={data.name2}
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
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title3}`)}
                                size="large"
                                name={data.name3}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name3 as keyof Values] &&
                                  errors[data.name3 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name3 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name3 as keyof Values] &&
                                    errors[data.name3 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title4}`)}
                                size="large"
                                name={data.name4}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name4 as keyof Values] &&
                                  errors[data.name4 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name4 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name4 as keyof Values] &&
                                    errors[data.name4 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title5}`)}
                                size="large"
                                name={data.name5}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name5 as keyof Values] &&
                                  errors[data.name5 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name5 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name5 as keyof Values] &&
                                    errors[data.name5 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title6}`)}
                                size="large"
                                name={data.name6}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name6 as keyof Values] &&
                                  errors[data.name6 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name6 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name6 as keyof Values] &&
                                    errors[data.name6 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title7}`)}
                                size="large"
                                name={data.name7}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name7 as keyof Values] &&
                                  errors[data.name7 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name7 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name7 as keyof Values] &&
                                    errors[data.name7 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                          </Row>
                        );
                      })}
                      <Col span={8} style={{ paddingTop: '10px' }}>
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
          </Row>
        </>
      ),
    },
    {
      key: '3',
      label: 'New hires',
      children: (
        <>
          <Row>
            <Col span={24} className="AnttabSty">
              <Formik
                initialValues={{
                  entity_id: '',
                  premiseId: '',
                  startDate: '',
                  endDate: '',
                  bioWasteUom: '',
                  bioWasteDischarge: '',
                  bioWasteRecycle: '',
                  plasticWasteUom: '',
                  eWasteUom: '',
                  bioMedicalWasteUom: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm }) => {
                  //   values.entity_id = entityName;
                  values.premiseId = values.premiseId.toString();
                  setIsLoading(true);
                  post(``, values)
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res.message}`,
                            type: 'success',
                          });
                          resetForm();
                          navigate(`/add-data/environment/waste`);
                        }
                      }
                    })
                    .catch((err) =>
                      openToast({
                        content: `${err}`,
                        type: 'error',
                      })
                    )
                    .finally(() => setIsLoading(false));
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
                          <Row gutter={12} align="bottom" key={index}>
                            <Col lg={8} className={Styles.allFormLabel}>
                              <p className={Styles.paratitleSty}>
                                {data.title}{' '}
                              </p>
                            </Col>
                            <Col
                              span={4}
                              style={{ paddingTop: '30px' }}
                              className="energy-consumption-select"
                            >
                              <p
                                style={{
                                  color:
                                    data.time === 'Part time'
                                      ? '#FD349C'
                                      : '#1E49E2',
                                  fontSize: '18px',
                                }}
                              >
                                {data.time}
                              </p>
                            </Col>

                            <Col lg={2} className="center-label-input">
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
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title3}`)}
                                size="large"
                                name={data.name3}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name3 as keyof Values] &&
                                  errors[data.name3 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name3 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name3 as keyof Values] &&
                                    errors[data.name3 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title4}`)}
                                size="large"
                                name={data.name4}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name4 as keyof Values] &&
                                  errors[data.name4 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name4 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name4 as keyof Values] &&
                                    errors[data.name4 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title5}`)}
                                size="large"
                                name={data.name5}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name5 as keyof Values] &&
                                  errors[data.name5 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name5 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name5 as keyof Values] &&
                                    errors[data.name5 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title6}`)}
                                size="large"
                                name={data.name6}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name6 as keyof Values] &&
                                  errors[data.name6 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name6 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name6 as keyof Values] &&
                                    errors[data.name6 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={2} className="center-label-input">
                              <CustomInput
                                label={handleLabel(i, `${data.title7}`)}
                                size="large"
                                name={data.name7}
                                labelColor="#666666"
                                type="text"
                                errors={
                                  touched[data.name7 as keyof Values] &&
                                  errors[data.name7 as keyof Values]
                                }
                                touched={touched}
                                value={values[data.name7 as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name7 as keyof Values] &&
                                    errors[data.name7 as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                          </Row>
                        );
                      })}
                      <Col span={8} style={{ paddingTop: '10px' }}>
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
          </Row>
        </>
      ),
    },
  ];
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            Social /<span>Employees</span>{' '}
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
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </Col>
      </Row>
    </>
  );
}

export default Forms;
