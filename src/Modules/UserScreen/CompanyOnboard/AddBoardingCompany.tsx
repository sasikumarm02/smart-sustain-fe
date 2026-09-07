import { Row, Col, Button, Form, Select, Input, Typography, Card } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import loginBg from '../../../assets/bgimg.png';
import brandicon from '../../../assets/brandIcon.png';
import CustomInput from '../../../Components/FormInput/CustomInput';
import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import styles from './Entity.module.scss';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { DownOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useNotification } from '../../../Hooks/useNotification';
import axios from 'axios';
import { UseDispatch } from 'react-redux';
import { useDispatch } from 'react-redux';

export default function AddBoardingCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openToast } = useNotification();
  const [countryList, setCountryList] = React.useState([null]);
  const fetchCountryList = React.useCallback(async () => {
    try {
      const res = await axios.get(
        'https://countriesnow.space/api/v0.1/countries/flag/images'
      );
      if (res.data.error !== true) {
        setCountryList(res.data.data);
      }
    } catch (err) {
      openToast({ content: `${err}`, type: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchCountryList();
  }, [fetchCountryList]);

  return (
    <>
      <div style={{ height: '100vh' }}>
        <Row
          align="middle"
          style={{
            height: '100vh',
            background:
              'linear-gradient(to bottom right, rgba(99, 235, 218, 0.1) 0%, rgba(255, 163, 218, 0.1) 27%, rgba(180, 151, 255, 0.1) 66%, rgba(172, 234, 255, 0.1) 100%)',
          }}
        >
          <Col
            lg={12}
            md={10}
            sm={24}
            xs={24}
            style={{
              position: 'relative',
              backgroundColor: '#0D304A', // or your dark blue color
              backgroundImage: `url(${loginBg})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: '100vh',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <img
                alt="logo"
                src={brandicon}
                style={{
                  maxWidth: '50%',
                  margin: '20px auto',
                }}
              />
            </div>
          </Col>
          <Col
            lg={12}
            md={14}
            sm={24}
            xs={24}
            style={{ overflow: 'scroll', height: '100vh' }}
          >
            <Card hoverable={false} className={`${styles.customCard} formCard`}>
              <h3 className={styles.loginTitle}>
                Holding, Subsidiary & Associate Companies
              </h3>

              <Formik
                initialValues={{
                  entity_Type: '',
                  entity_Country: '',
                  entity_name: '',
                  entity_number: '',
                  date_of_incorporation: '',
                  entity_address: '',
                }}
                validationSchema={Yup.object().shape({})}
                onSubmit={(values, { resetForm }) => {
                  navigate('/settings/onBoard-companies');
                  // setIsLoading(true);

                  // post("/entity/addEntity/", values)
                  // .then((res: any) => {
                  //   if (res?.status === "Success") {
                  //     if (res?.response?.status === true) {
                  //       openToast({
                  //         content: `${res?.message}`,
                  //         type: "success",
                  //       });
                  //       resetForm();
                  //       // navigate("/auth/login");
                  //     }
                  //   }
                  // })
                  // .catch((err) =>
                  //   openToast({
                  //     content: `${err?.message}`,
                  //     type: "error",
                  //   })
                  // )
                  // .finally(() => setIsLoading(false));
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
                      <Row justify="center" gutter={10}>
                        <>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <CustomInput
                              label="Company Name"
                              labelColor="#00338D"
                              size="large"
                              name="entity_name"
                              type="text"
                              placeholder="Company"
                              errors={errors.entity_name}
                              touched={touched.entity_name}
                              value={values.entity_name}
                              hook={handleChange}
                              status={
                                (touched.entity_name &&
                                  errors.entity_name &&
                                  'error') ||
                                ''
                              }
                              blur={handleBlur}
                            />
                          </Col>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <CustomSelect
                              label="Select Entity"
                              name="entity_Type"
                              type="text"
                              labelColor="#00338D"
                              size="large"
                              selectColor="#00338D"
                              placeholder="Legal Entity"
                              options={[
                                {
                                  value: 'jack',
                                  label: 'Singapore',
                                },
                                {
                                  value: 'lucy',
                                  label: 'Indonesia',
                                },
                                {
                                  value: 'disabled',
                                  label: 'Brunei',
                                },
                              ].map((item: any) => ({
                                value: item.name,
                              }))}
                              errors={errors.entity_Type}
                              touched={touched.entity_Type}
                              value={values.entity_Type}
                              secondChange={setFieldValue}
                              hook={handleChange}
                              blur={handleBlur}
                              status={
                                (touched.entity_Type &&
                                  errors.entity_Type &&
                                  'error') ||
                                ''
                              }
                            />
                          </Col>
                          <Col lg={12} md={12} sm={24} xs={24}>
                            <CustomInput
                              label="Identification  Number"
                              size="large"
                              name="entity_number"
                              labelColor="#00338D"
                              type="text"
                              placeholder="367486"
                              errors={errors.entity_number}
                              touched={touched.entity_number}
                              value={values.entity_number}
                              hook={handleChange}
                              blur={handleBlur}
                              status={
                                (touched.entity_number &&
                                  errors.entity_number &&
                                  'error') ||
                                ''
                              }
                            />
                          </Col>
                          <Col lg={12} md={12} sm={24} xs={24}>
                            <CustomDatePicker
                              label="Incorporation Date"
                              name="date_of_incorporation"
                              labelColor="#00338D"
                              calenderColor="#00338D"
                              errors={errors.date_of_incorporation}
                              touched={touched.date_of_incorporation}
                              value={values.date_of_incorporation}
                              secondChange={setFieldValue}
                              blur={() =>
                                setFieldTouched(`date_of_incorporation`, true)
                              }
                              size="large"
                              status={
                                (touched.date_of_incorporation &&
                                  errors.date_of_incorporation &&
                                  'error') ||
                                ''
                              }
                            />
                          </Col>
                          <Col lg={24} md={24} sm={24} xs={24}>
                            <Form.Item
                              name="countryName"
                              label={
                                <label className={styles.formlabel}>
                                  Select Country
                                </label>
                              }
                            >
                              <Select
                                suffixIcon={
                                  <DownOutlined
                                    style={{
                                      color: '#00338d',
                                      fontSize: '18px',
                                    }}
                                  />
                                }
                                size="large"
                                showSearch
                                placeholder="Select country"
                                value={values.entity_Country}
                                onChange={(e: any) => {
                                  setFieldValue('entity_Country', e ? e : '');
                                }}
                                onBlur={() =>
                                  setFieldTouched('entity_Country', true)
                                }
                                getPopupContainer={(trigger) =>
                                  trigger.parentNode
                                }
                                status={
                                  (touched.entity_Country &&
                                    errors.entity_Country &&
                                    'error') ||
                                  ''
                                }
                              >
                                {countryList.length > 1 ? (
                                  <>
                                    {countryList.map(
                                      (data: any, index: any) => (
                                        <>
                                          <Select.Option
                                            value={data.name}
                                            autofill="off"
                                          >
                                            <img
                                              src={data.flag}
                                              width={20}
                                              alt=""
                                            />
                                            <span
                                              style={{
                                                marginLeft: '0.5rem',
                                              }}
                                            >
                                              {data.name}
                                            </span>
                                          </Select.Option>
                                        </>
                                      )
                                    )}
                                  </>
                                ) : null}
                              </Select>
                              {errors.entity_Country &&
                                touched.entity_Country && (
                                  <Typography.Text type="danger">
                                    {errors.entity_Country}
                                  </Typography.Text>
                                )}
                            </Form.Item>
                          </Col>

                          <Col lg={24} md={24} sm={24} xs={24}>
                            <Form.Item
                              label={
                                <label className={styles.formlabel}>
                                  Address
                                </label>
                              }
                            >
                              <Input.TextArea
                                rows={4}
                                name="entity_address"
                                value={values.entity_address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                status={
                                  (touched.entity_address &&
                                    errors.entity_address &&
                                    'error') ||
                                  ''
                                }
                                style={{ borderRadius: '5px' }}
                              />
                              {errors.entity_address &&
                                touched.entity_address && (
                                  <Typography.Text
                                    type="danger"
                                    style={{ textAlign: 'left' }}
                                  >
                                    {errors.entity_address}
                                  </Typography.Text>
                                )}
                            </Form.Item>
                          </Col>
                        </>
                      </Row>
                      <Row justify="center" gutter={12}>
                        <Col lg={10}>
                          <Form.Item>
                            <Button
                              className={styles.guestButton}
                              size="large"
                              block
                              htmlType="reset"
                            >
                              Reset
                            </Button>
                          </Form.Item>
                        </Col>
                        <Col lg={10}>
                          <Form.Item>
                            <Button
                              className={styles.LoginButton}
                              block
                              htmlType="submit"
                              // disabled={!(isValid && dirty)}
                              size="large"
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
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
