import { Row, Col, Typography, Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import styles from './login.module.scss';
import kpmgicon from '../../../assets/kpmgbrand.svg';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../Hooks/useAuth';
import { UserAuthlayout } from '../SignUp/SignUp';
import loginBg from '../../../assets/sustainSVG.svg';
// import loginBg from '../../../assets/sustainBG.png';
import leafBg from '../../../assets/leafSvg.svg';
import leafBg2 from '../../../assets/leafSvg2.svg';
import topImg from '../../../assets/LeftTop.svg';
import { useContext, useState } from 'react';
import ModalComponent from '../../../DesignLibrary/ModalComponent';
import smartLogo from '../../../assets/SustainLogoSvg.svg';
import smartWhiteLogo from '../../../assets/sustainLogoWhite.png';
import { MailOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';
import plantOne from '../../../assets/plantOne.svg';
import plantTwo from '../../../assets/plantTwo.svg';

const Login = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | undefined>();
  const { login, isLoading } = useAuth();

  const itemsToRemove = [
    'iconify-count',
    'iconify2',
    'iconify1',
    'user',
    'iconify0',
    'iconify-version',
    'selectedMenuItem',
  ];
  itemsToRemove.forEach((item) => {
    localStorage.removeItem(item);
  });

  return (
    <div style={{ height: '100vh', background: '#fff' }}>
      <Row style={{ height: '100vh' }}>
        <Col
          span={12}
          style={{
            position: 'relative',
            backgroundColor: '#0D304A', // or your dark blue color
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '100vh',
          }}
        ></Col>

        <Col
          span={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* <Row style={{ width: '100%' }}>
            <img
              src={leafBg}
              style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
              alt="Background"
            />
          </Row> */}

          <div style={{ flex: 1 }} className={styles.formBody}>
            <Row>
              <img src={smartLogo} style={{ height: '40px' }}></img>
            </Row>
            <Row>
              <span className={styles.loginHeading}>
                Sustainability Measurement And Reporting Tool(SMART)
              </span>
            </Row>

            <Formik
              initialValues={{ email_address: '', password: '' }}
              validationSchema={yup.object().shape({
                email_address: yup
                  .string()
                  .email('Please enter a valid email address')
                  .required('Email address required'),
                password: yup.string().required('Password required').min(5),
              })}
              onSubmit={async (values) => {
                const logval = await login(values);

                if (logval !== undefined) {
                  setErrMsg(logval); // Set the value of logvalState
                  setIsOpen(true); // Open the modal
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
                isValid,
                dirty,
              }) => (
                <Form
                  layout="vertical"
                  onFinish={handleSubmit}
                  onReset={handleReset}
                >
                  <Form.Item
                    label={<label className={styles.formlabel}>Email</label>}
                  >
                    <Input
                      style={{ height: '50px' }}
                      name="email_address"
                      type="email"
                      size="large"
                      value={values.email_address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      id="email-input-login"
                      prefix={<MailOutlined style={{ color: '#928E8D' }} />}
                      className={
                        errors.email_address && touched.email_address
                          ? styles.inputErrorFiled
                          : ''
                      }
                    />
                    {errors.email_address && touched.email_address && (
                      <Typography.Text type="danger">
                        {errors.email_address}
                      </Typography.Text>
                    )}
                  </Form.Item>

                  <Form.Item
                    label={<label className={styles.formlabel}>Password</label>}
                  >
                    <Input.Password
                      style={{ height: '50px' }}
                      size="large"
                      onBlur={handleBlur}
                      placeholder="Min. 8 characters"
                      prefix={<LockOutlined style={{ color: '#928E8D' }} />}
                      id="password-input-login"
                      iconRender={(visible) =>
                        visible ? (
                          <Icon
                            icon="bi:eye"
                            style={{
                              cursor: 'pointer',
                              color: '#C0D4E7',
                            }}
                          />
                        ) : (
                          <Icon
                            icon="eva:eye-off-outline"
                            style={{
                              cursor: 'pointer',
                              color: '#C0D4E7',
                            }}
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
                    />
                    {errors.password && touched.password && (
                      <Typography.Text type="danger">
                        {errors.password}
                      </Typography.Text>
                    )}
                  </Form.Item>

                  <Row className={styles.frgpasswordRow}>
                    <Button
                      type="link"
                      className={styles.forgotPswd}
                      onClick={() => navigate('/auth/forgot-password')}
                    >
                      Forgot password
                    </Button>
                  </Row>

                  <Form.Item>
                    <Button
                      block
                      htmlType="submit"
                      disabled={!(isValid && dirty)}
                      size="large"
                      className={styles.signinButton}
                      loading={isLoading}
                      style={{
                        marginLeft: 'auto',
                        zIndex: '99',
                        border: 'none',
                      }}
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Formik>

            <ModalComponent
              isOpen={isOpen}
              content={errMsg}
              onCancel={() => setIsOpen(false)}
              onProceed={() => setIsOpen(false)}
              submitBtnText="Ok"
            />
          </div>

          {/* <Row style={{ width: '100%' }}>
            <img
              src={leafBg2}
              style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
              alt="Background"
            />
          </Row> */}

          {/* <Row
            className="justify-content-between"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              marginTop: '40px'
            }}
          >
            <img src={plantOne} style={{ height: '140px', marginLeft: '-70px' }} />
            <img src={plantTwo} style={{ height: '140px' }} />
          </Row> */}
        </Col>
      </Row>
    </div>
  );
};

export default Login;
