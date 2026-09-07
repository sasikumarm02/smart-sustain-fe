import { Row, Col, Typography, Button, Form, Input, Card, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import brandicon from '../../../assets/brandIcon.png';
import loginBg from '../../../assets/loginBg.png';
import styles from '../../UserScreen/Logins/login.module.scss';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useQuery } from '../../../Hooks/useQuery';
import { post } from '../../../Services';
import { UserAuthlayout } from '../../UserScreen/SignUp/SignUp';

const CreatePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(true);
  const query = useQuery();
  return (
    <>
      <div
        style={{
          height: '100vh',
          background:
            'linear-gradient(to bottom right, rgba(99, 235, 218, 0.1) 0%, rgba(255, 163, 218, 0.1) 27%, rgba(180, 151, 255, 0.1) 66%, rgba(172, 234, 255, 0.1) 100%)',
        }}
      >
        <Row align="middle" style={{ height: '100vh' }}>
          <UserAuthlayout />
          {active === true ? (
            <Col xl={12} lg={12} xs={24} md={24}>
              <Row justify="center" align="middle">
                <Col lg={20} xs={24} md={16} className={styles.formBody}>
                  <Row justify="center">
                    <Col lg={18} xs={24} md={16}>
                      <Card hoverable={false} className={styles.customCard}>
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
                            className="authLogo"
                          />
                        </div>
                        <div>
                          <h3 className={styles.loginTitle}>
                            {' '}
                            Create New Password
                          </h3>
                        </div>
                        <Formik
                          initialValues={{
                            verificationCode: '',
                            password: '',
                            confirmPassword: '',
                          }}
                          validationSchema={yup.object().shape({
                            verificationCode: yup
                              .string()
                              .matches(
                                new RegExp(/^[0-9]+$/),
                                'Please enter valid verification code'
                              )
                              .required('Verification Code required')
                              .min(6)
                              .max(6),
                            password: yup
                              .string()
                              .matches(
                                new RegExp(
                                  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
                                ),
                                'Please enter valid password'
                              )
                              .required('Password required')
                              .min(8),
                            confirmPassword: yup
                              .string()
                              .matches(
                                new RegExp(
                                  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
                                ),
                                'Please enter valid password'
                              )
                              .required('Confirm password Required')
                              .min(8)
                              .oneOf(
                                [yup.ref('password')],
                                'Passwords must match'
                              ),
                          })}
                          onSubmit={(values, action) => {
                            if (!query.get('userEmail')) {
                              return;
                            }
                            setIsLoading(true);
                            post('auth/create-password', {
                              userEmail: query.get('userEmail'),
                              verificationCode: values.verificationCode,
                              password: values.password,
                              confirmPassword: values.confirmPassword,
                            })
                              .then((res: any) => {
                                if (res.status === 'OK') {
                                  setIsLoading(false);
                                  navigate('/auth/password-updated-message');
                                  action.resetForm();
                                }
                              })
                              .catch((err) => {
                                setIsLoading(false);
                              });
                          }}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isValid,
                            dirty,
                          }) => (
                            <Form layout="vertical" onFinish={handleSubmit}>
                              <Form.Item
                                label={
                                  <label className={styles.formlabel}>
                                    Verification Code
                                  </label>
                                }
                              >
                                <Input
                                  size="large"
                                  name="verificationCode"
                                  className={
                                    errors.verificationCode &&
                                    touched.verificationCode
                                      ? styles.inputErrorFiled
                                      : ''
                                  }
                                  value={values.verificationCode}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {errors.verificationCode &&
                                  touched.verificationCode && (
                                    <Typography.Text type="danger">
                                      {errors.verificationCode}
                                    </Typography.Text>
                                  )}
                              </Form.Item>
                              <Form.Item
                                label={
                                  <label className={styles.formlabel}>
                                    New Password
                                  </label>
                                }
                                tooltip={{
                                  placement: 'right',
                                  color: '#fff',
                                  icon: (
                                    <Icon
                                      icon="bi:info-circle-fill"
                                      color="gray"
                                    />
                                  ),
                                  overlayInnerStyle: {
                                    width: 300,
                                  },
                                  title: (
                                    <>
                                      <Typography.Text
                                        style={{ color: styles.primary }}
                                      >
                                        Password must:
                                      </Typography.Text>

                                      <ul
                                        style={{
                                          paddingLeft: 0,
                                          listStyleType: 'circle',
                                        }}
                                      >
                                        {[
                                          {
                                            title:
                                              'Have at least one capital letter, one lower case letter',
                                          },
                                          {
                                            title:
                                              'Have at least one special character & number',
                                            subText: 'Ex: Abcd@123',
                                          },
                                          {
                                            title: 'Not be same as the email',
                                          },
                                          {
                                            title: 'Have at least 8 characters',
                                          },
                                        ].map(
                                          (item: {
                                            title: string;
                                            subText?: string;
                                          }) => (
                                            <li>
                                              <Space align="start" size="small">
                                                <Typography.Text>
                                                  <Icon
                                                    icon="bi:dot"
                                                    fontSize={20}
                                                  />
                                                </Typography.Text>
                                                <Typography.Text>
                                                  {item.title}
                                                  {item.subText && (
                                                    <Typography.Text
                                                      style={{
                                                        color: styles.primary,
                                                        display: 'flex',
                                                      }}
                                                    >
                                                      {item.subText}
                                                    </Typography.Text>
                                                  )}
                                                </Typography.Text>
                                              </Space>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </>
                                  ),
                                }}
                              >
                                <Input.Password
                                  size="large"
                                  iconRender={(visible) =>
                                    visible ? (
                                      <Icon
                                        icon="akar-icons:eye-open"
                                        color={styles.gray}
                                      />
                                    ) : (
                                      <Icon
                                        icon="akar-icons:eye-closed"
                                        color={styles.gray}
                                      />
                                    )
                                  }
                                  name="password"
                                  className={
                                    errors.password && touched.password
                                      ? styles.inputErrorFiled
                                      : ''
                                  }
                                  value={values.password}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {errors.password && touched.password && (
                                  <Typography.Text type="danger">
                                    {errors.password}
                                  </Typography.Text>
                                )}
                              </Form.Item>
                              <Form.Item
                                label={
                                  <label className={styles.formlabel}>
                                    Confirm Password
                                  </label>
                                }
                              >
                                <Input.Password
                                  size="large"
                                  iconRender={(visible) =>
                                    visible ? (
                                      <Icon
                                        icon="akar-icons:eye-open"
                                        color={styles.gray}
                                      />
                                    ) : (
                                      <Icon
                                        icon="akar-icons:eye-closed"
                                        color={styles.gray}
                                      />
                                    )
                                  }
                                  name="confirmPassword"
                                  className={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                      ? styles.inputErrorFiled
                                      : ''
                                  }
                                  value={values.confirmPassword}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {errors.confirmPassword &&
                                  touched.confirmPassword && (
                                    <Typography.Text type="danger">
                                      {errors.confirmPassword}
                                    </Typography.Text>
                                  )}
                              </Form.Item>
                              <Form.Item>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className={styles.loginButton}
                                  disabled={!(isValid && dirty)}
                                  style={{ marginTop: styles.whitespace3 }}
                                  size="large"
                                  loading={isLoading}
                                  block
                                >
                                  Submit
                                </Button>
                              </Form.Item>
                            </Form>
                          )}
                        </Formik>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          ) : (
            <Col lg={12}>kkjj</Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default CreatePassword;
