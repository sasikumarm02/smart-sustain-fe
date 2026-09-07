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
      title: 'Company A',
      title1: 'PurchaseSelect',
      name1: 'ElectricityUtilitySelect',
    },
    {
      key: 2,
      title: 'Company B',
      name1: 'ElectricityNonRenewableSelect',
    },
    {
      key: 3,
      title: 'Company C',
      name1: 'ElectricityRenewableSelect',
    },
    {
      key: 4,
      title: 'Company D',
      name1: 'GasSelect',
    },
  ];
  const navigate = useNavigate();
  function handleLabel(key: any, title: any) {
    if (key === 1) {
      return title;
    } else return null;
  }
  const fieldNames = [
    'ElectricityUtilitySelect',
    'ElectricityUtilityPurchase',
    'ElectricityUtilityCaptiveGeneration',
    'ElectricityUtilitySold',
    'ElectricityNonRenewableSelect',
    'ElectricityNonRenewablePurchase',
    'ElectricityNonRenewableCaptiveGeneration',
    'ElectricityNonRenewableSold',
    'GasSelect',
    'GasPurchase',
    'GasCaptiveGeneration',
    'GasSold',
    'HeatingSelect',
    'HeatingPurchase',
    'HeatingCaptiveGeneration',
    'HeatingSold',
    'CoolingSelect',
    'CoolingPurchase',
    'CoolingCaptiveGeneration',
    'CoolingSold',
    'SteamSelect',
    'SteamPurchase',
    'SteamCaptiveGeneration',
    'SteamSold',
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
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            Social / <span> Reporting Boundary</span>{' '}
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
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={10}
                        className="CustomDate"
                      >
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
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="SelectField"
                      >
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
          <Formik
            initialValues={{
              ElectricityUtilitySelect: '',
              ElectricityUtilityPurchase: '',
              ElectricityUtilityCaptiveGeneration: '',
              ElectricityUtilitySold: '',
              ElectricityNonRenewableSelect: '',
              ElectricityNonRenewablePurchase: '',
              ElectricityNonRenewableCaptiveGeneration: '',
              ElectricityNonRenewableSold: '',
              GasSelect: '',
              GasPurchase: '',
              GasCaptiveGeneration: '',
              GasSold: '',
              HeatingSelect: '',
              HeatingPurchase: '',
              HeatingCaptiveGeneration: '',
              HeatingSold: '',
              CoolingSelect: '',
              CoolingPurchase: '',
              CoolingCaptiveGeneration: '',
              CoolingSold: '',
              SteamSelect: '',
              SteamPurchase: '',
              SteamCaptiveGeneration: '',
              SteamSold: '',
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
                        <Col
                          lg={6}
                          md={6}
                          sm={24}
                          className={Styles.allFormLabel}
                        >
                          <p className={Styles.paratitleSty}>{data.title} </p>
                        </Col>
                        <Col
                          lg={8}
                          md={8}
                          sm={12}
                          xs={24}
                          className="center-label-input"
                        >
                          <CustomInput
                            // label={handleLabel(i, `${data.title2}`)}
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
                        <Col
                          lg={8}
                          md={8}
                          sm={12}
                          xs={24}
                          className="energy-consumption-select"
                        >
                          <CustomSelect
                            name={data.name1}
                            size="large"
                            // label={""}
                            options={UomDropdown}
                            errors={errors[data.name1 as keyof Values]}
                            touched={touched[data.name1 as keyof Values]}
                            value={values[data.name1 as keyof Values]}
                            secondChange={setFieldValue}
                            hook={handleChange}
                            blur={handleBlur}
                            status={
                              (touched[data.name1 as keyof Values] &&
                                errors[data.name1 as keyof Values] &&
                                'error') ||
                              ''
                            }
                            style={{
                              height: '45px',
                              background: '#F5F5F5',
                              border: 'none',
                            }}
                          ></CustomSelect>
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
