import React, { useState } from 'react';
import { Col, Row, Form, Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../FormInput/CustomInput';
import CustomSelect from '../FormInput/CustomSelect';
import { UomDropdown } from '../EntityMeasurments/Measurments';
import Styles from '../Social/form.module.scss';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
interface Values {}

function ProductServicesForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            <span>Product & Services</span>{' '}
          </p>
        </Col>
      </Row>
      <Row justify="end" style={{ background: '#fff', paddingTop: '15px' }}>
        <Col lg={24} className="AnttabSty">
          <Formik
            initialValues={{
              entity_id: '',
              premiseId: '',
              startDate: '',
              endDate: '',
              productCode: '',
              nameOfProduct: '',
              unitOfMeasurement: '',
              quantity: '',
              socialPartners: '',
              selfUsage: '',
              safeDisposal: '',
            }}
            validationSchema={Yup.object().shape({
              premiseId: Yup.array()
                .of(Yup.string())
                .required('Required!')
                .min(1, 'At least one premise must be selected'),
              productCode: Yup.string().required('Required!'),
              nameOfProduct: Yup.string().required('Required!'),
              unitOfMeasurement: Yup.string().required('Required!'),
              quantity: Yup.string().required('Required!'),
              socialPartners: Yup.string().required('Required!'),
              selfUsage: Yup.string().required('Required!'),
              safeDisposal: Yup.string().required('Required!'),
            })}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true);

              values.premiseId = values.premiseId.toString();
              //   post(`/productservice/create_product/`, values)
              //     .then((res: any) => {
              //       if (res?.status === "Success") {
              //         if (res?.response?.status === true) {
              //           openToast({
              //             content: `${res.message}`,
              //             type: "success",
              //           });
              //           resetForm();
              //           navigate(`/add-data/general/product`);
              //         }
              //       }
              //     })
              //     .catch((err) =>
              //       openToast({
              //         content: `${err}`,
              //         type: "error",
              //       })
              //     )
              //     .finally(() => setIsLoading(false));
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
              getFieldProps,
              isValid,
              dirty,
            }) => {
              return (
                <Form
                  layout="vertical"
                  onFinish={handleSubmit}
                  onReset={handleReset}
                >
                  <Row style={{ paddingBottom: '10px' }}>
                    <Col span={24}>
                      {' '}
                      <p className="titletag">Product/Services</p>
                    </Col>
                    <Col span={24}>
                      <Radio.Group onChange={onChange} value={value}>
                        <Radio value={1}>
                          <p
                            style={{
                              fontSize: '16px',
                              color: '#00338D',
                              margin: '0px',
                              fontWeight: 500,
                            }}
                          >
                            Product
                          </p>
                        </Radio>
                        <Radio value={2}>
                          <p
                            style={{
                              fontSize: '16px',
                              color: '#00338D',
                              margin: '0px',
                              fontWeight: 500,
                            }}
                          >
                            Services
                          </p>
                        </Radio>
                      </Radio.Group>
                    </Col>
                  </Row>
                  <Row gutter={12} justify="space-between" align="middle">
                    {[
                      {
                        name: 'productCode',
                        type: 'input',
                        label: ' Code',
                        size: 24,
                      },
                      {
                        name: 'nameOfProduct',
                        type: 'input',
                        label: 'Name of the Product ',
                        size: 24,
                      },
                      {
                        name: 'unitOfMeasurement',
                        type: 'select',
                        label: 'Unit of Measurement',
                        size: 24,
                      },
                      {
                        name: 'quantity',
                        type: 'input',
                        label: 'Quantity',
                        size: 24,
                      },
                    ].map((data: any, index: number) => (
                      <Col span={data.size} key={index}>
                        {data.type === 'input' && (
                          <Row align="middle">
                            <Col
                              lg={5}
                              md={8}
                              sm={12}
                              xs={24}
                              className="formLabel mt-4 mt-md-3 mt-sm-2"
                            >
                              {data.label}
                            </Col>
                            <Col
                              lg={10}
                              md={12}
                              sm={14}
                              xs={24}
                              className="mt-4 mt-md-3 mt-sm-2"
                            >
                              {' '}
                              <CustomInput
                                // label={data.label}
                                labelColor="#666666"
                                size="large"
                                name={data.name}
                                type="text"
                                errors={errors[data.name as keyof Values]}
                                touched={touched[data.name as keyof Values]}
                                value={values[data.name as keyof Values]}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name as keyof Values] &&
                                    errors[data.name as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                          </Row>
                        )}
                        {data.type === 'select' && (
                          <Row>
                            <Col
                              lg={5}
                              md={8}
                              sm={12}
                              xs={24}
                              className="formLabel mt-4 mt-md-3 mt-sm-2"
                            >
                              {data.label}
                            </Col>
                            <Col
                              lg={10}
                              md={12}
                              sm={14}
                              xs={24}
                              className="mt-4 mt-md-3 mt-sm-2"
                            >
                              {' '}
                              <CustomSelect
                                name={data.name}
                                labelColor="#666666"
                                size="large"
                                // label={data.label}
                                options={UomDropdown}
                                errors={errors[data.name as keyof Values]}
                                touched={touched[data.name as keyof Values]}
                                value={values[data.name as keyof Values]}
                                secondChange={setFieldValue}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[data.name as keyof Values] &&
                                    errors[data.name as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                          </Row>
                        )}
                      </Col>
                    ))}
                  </Row>
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
  );
}

export default ProductServicesForm;
