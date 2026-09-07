import React, { useState } from 'react';
import {
  Col,
  Row,
  Form,
  Button,
  Typography,
  Form as AntdForm,
  Image,
  Flex,
  Modal,
  Input,
} from 'antd';
import { useNotification } from '../../../Hooks/useNotification';

import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { post } from '../../../Services';
import Styles from '../../Social/form.module.scss';
import CrossCircle from '../../../assets/Svg/crossCircle';
import TickCircle from '../../../assets/Svg/TickCircle';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
interface Values {}

function Forms() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const wasteData = [
    {
      key: 1,
      title: 'GRI',
      title1: ' Unit of Measurement',
      name1: 'bioWasteUom',
      title2: 'Numbers',
      name2: 'bioWasteDischarge',
    },
    {
      key: 2,
      title: 'TCFD',
      name1: 'plasticWasteUom',
    },
    {
      key: 3,
      title: 'BRSR',
      name1: 'eWasteUom',
    },
    {
      key: 4,
      title: 'FTES',
      name1: 'plasticWasteUom',
    },
    {
      key: 5,
      title: 'CDP',
      name1: 'eWasteUom',
    },
    {
      key: 6,
      title: 'SASB',
      name1: 'eWasteUom',
    },
    {
      key: 7,
      title: 'IIRC',
      name1: 'eWasteUom',
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

  const SelectOption = ({ title, checked, onChange }: any) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleClick = (option: any) => {
      setSelectedOption(option);
    };

    return (
      <Row justify="center" gutter={12}>
        <Col lg={4} md={10} sm={10} xs={12}>
          <TickCircle color="#999999" />
        </Col>
        <Col lg={4} md={10} sm={10} xs={12}>
          <CrossCircle color="#999999" />
        </Col>
      </Row>
    );
  };
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            Social / <span>Sustainability Disclosures</span>{' '}
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
            Frameworks
          </p>
          <Row justify="start">
            <Col lg={4} sm={12} xs={12}></Col>
            <Col lg={4} sm={12} xs={12}>
              <p
                className="text-center"
                style={{ color: '#999999', fontSize: '18px' }}
              >
                Obtainedd
              </p>
            </Col>
          </Row>
          {/* <p style={{color:"#23456A",fontSize:"18px",fontWeight:"400",fontFamily:"Arial"}}>Statistics</p> */}
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
                      <Row
                        gutter={12}
                        align="middle"
                        className="mb-2"
                        key={index}
                      >
                        <Col
                          lg={4}
                          md={6}
                          sm={6}
                          xs={8}
                          className={Styles.allFormLabel}
                          style={{ paddingTop: '20px' }}
                        >
                          <p className={Styles.paratitleSty}>{data.title}</p>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={10}>
                          <SelectOption title={'ffc'} />
                        </Col>
                      </Row>
                    );
                  })}

                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col
                      lg={4}
                      sm={12}
                      xs={12}
                      className={Styles.DisplayButton}
                    >
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
                    <Col
                      lg={4}
                      sm={12}
                      xs={12}
                      className={Styles.DisplayButton}
                    >
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
