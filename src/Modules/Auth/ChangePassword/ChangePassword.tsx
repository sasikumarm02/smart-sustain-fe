import { Row, Col, Typography, Button, Form, Input, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import brandicon from '../../../assets/brandIcon.png';
import loginBg from '../../../assets/loginBg.png';
import styles from '../../UserScreen/Logins/login.module.scss';
import { Icon } from '@iconify/react';
import { post } from '../../../Services';
import { useNotification } from '../../../Hooks/useNotification';
import { UserAuthlayout } from '../../UserScreen/SignUp/SignUp';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { openNotification } = useNotification();
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
          <Col xl={12} lg={12} xs={24} md={24}>
            <Row justify="center" align="middle">
              <Col lg={20} xs={24} md={16} className={styles.formBody}>
                <Row justify="center" align="middle">
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
                        <img alt="logo" src={brandicon} className="authLogo" />
                      </div>
                      <div>
                        <h3 className={styles.loginTitle}> Change Password</h3>
                      </div>
                      <Formik
                        initialValues={{
                          OldPassword: '',
                          NewPassword: '',
                          ConfirmNewPassword: '',
                        }}
                        validate={(values) => {
                          let errors = {};
                          const regex =
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/i;
                          if (!values.OldPassword) {
                            return (errors = {
                              OldPassword: 'Password enter old password',
                            });
                          }
                          if (!regex.test(values.NewPassword)) {
                            return (errors = {
                              NewPassword:
                                'Password did not match our criteria',
                            });
                          }
                          if (
                            values.NewPassword !== values.ConfirmNewPassword
                          ) {
                            return (errors = {
                              ConfirmNewPassword: 'Passwords did not match',
                            });
                          }

                          return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                          setSubmitting(true);
                          post('userprofile/changePassword ', values)
                            .then((res) => {
                              if (res) {
                                openNotification({
                                  title: 'Success',
                                  message: 'Password changed',
                                  type: 'success',
                                });
                                navigate('/auth/login');
                                window.location.reload();
                              }
                              setSubmitting(false);
                            })
                            .catch((err) => {
                              setSubmitting(false);
                            });
                        }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                        }) => (
                          <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                              label={
                                <label className={styles.formlabel}>
                                  Old Password
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
                                name="OldPassword"
                                className={
                                  errors.OldPassword && touched.OldPassword
                                    ? styles.inputErrorFiled
                                    : ''
                                }
                                value={values.OldPassword}
                                onChange={handleChange}
                              />
                              {errors.OldPassword && touched.OldPassword && (
                                <Typography.Text type="danger">
                                  {errors.OldPassword}
                                </Typography.Text>
                              )}
                            </Form.Item>
                            <Form.Item
                              label={
                                <label className={styles.formlabel}>
                                  New Password
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
                                name="NewPassword"
                                className={
                                  errors.NewPassword && touched.NewPassword
                                    ? styles.inputErrorFiled
                                    : ''
                                }
                                value={values.NewPassword}
                                onChange={handleChange}
                              />
                              {errors.NewPassword && touched.NewPassword && (
                                <Typography.Text type="danger">
                                  {errors.NewPassword}
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
                                name="ConfirmNewPassword"
                                className={
                                  errors.ConfirmNewPassword &&
                                  touched.ConfirmNewPassword
                                    ? styles.inputErrorFiled
                                    : ''
                                }
                                value={values.ConfirmNewPassword}
                                onChange={handleChange}
                              />
                              {errors.ConfirmNewPassword &&
                                touched.ConfirmNewPassword && (
                                  <Typography.Text type="danger">
                                    {errors.ConfirmNewPassword}
                                  </Typography.Text>
                                )}
                            </Form.Item>
                            <Form.Item>
                              <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.LoginButton}
                                size="large"
                                loading={isSubmitting}
                                block
                              >
                                Change Password
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
        </Row>
      </div>
    </>
  );
}
