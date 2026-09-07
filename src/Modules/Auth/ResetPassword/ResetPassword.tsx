import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Space,
  Divider,
  Button,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Formik } from 'formik';
import styles from '../../UserScreen/Logins/login.module.scss';
import * as yup from 'yup';
import { useState } from 'react';
import { useNotification } from '../../../Hooks/useNotification';
import kpmgicon from '../../../assets/kpmgbrand.svg';
// import loginBg from '../../../assets/bgimg.png';
import loginBg from '../../../assets/sustainSVG.svg';
import { ButtonComponent, ModalComponent } from '../../../DesignLibrary';
import axios from 'axios';
import { apiBaseUrl } from '../../../Services';
import { useLocation } from 'react-router-dom';
import topImg from '../../../assets/LeftTop.svg';
import { CheckOutlined, CloseOutlined, LockOutlined } from '@ant-design/icons';
import plantOne from '../../../assets/plantOne.svg';
import plantTwo from '../../../assets/plantTwo.svg';
import leafBg from '../../../assets/leafSvg.svg';
import leafBg2 from '../../../assets/leafSvg2.svg';
import smartLogo from '../../../assets/SustainLogoSvg.svg';
import { MailOutlined } from '@ant-design/icons';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState('');
  const [showPasswordHints, setShowPasswordHints] = useState(false); // Track focus state
  const [password, setPassword] = useState(''); // Track input value

  const { Text } = Typography;

  const email = location.state?.email;
  const otpData = location.state?.otpData;

  // Password validation logic
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      splCharacters: /(?=(?:[^#?!@$%^&*\-,/><]*[#?!@$%^&*\-,/><]){3})/.test(
        password
      ),
    };
  };

  const handleResetPassword = (values: any) => {
    setIsLoading(true);
    axios
      .post(`${apiBaseUrl}/esg/reset_password/`, {
        email_address: email,
        new_password: values.password,
        secret_key: otpData,
      })
      .then((res) => {
        if (res?.data.status === 'Success') {
          if (res?.data.response?.status === true) {
            openToast({
              content: `${res?.data.message}`,
              type: 'success',
            });
          }
        }
        navigate('/auth/login');
      })
      .catch((err) => {
        setErrMsg(err?.response?.data?.message);
        setIsOpen(true);
      });
  };

  return (
    <div style={{ height: '100vh', background: '#fff' }}>
      <Row align="middle" style={{ height: '100%' }}>
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
              style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
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
              initialValues={{
                password: '',
                confirmPassword: '',
              }}
              validationSchema={yup.object().shape({
                password: yup
                  .string()
                  .matches(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#?!@$%^&*]).{8,}$/,
                    'Please enter a valid password'
                  )
                  .required('Password required')
                  .min(8),
                confirmPassword: yup
                  .string()
                  .required('Confirm password Required')
                  .oneOf([yup.ref('password')], 'Passwords must match'),
              })}
              onSubmit={handleResetPassword}
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
              }) => {
                // Password validation status based on current input
                const passwordValidationStatus = validatePassword(
                  values.password
                );

                return (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ zIndex: '99' }}
                  >
                    <Form.Item
                      label={
                        <label className={styles.formlabel}>New Password</label>
                      }
                    >
                      <Input.Password
                        style={{ height: '50px' }}
                        size="large"
                        iconRender={(visible) => (
                          <Icon
                            icon={visible ? 'bi:eye' : 'eva:eye-off-outline'}
                            color={styles.gray}
                          />
                        )}
                        name="password"
                        prefix={<LockOutlined style={{ color: '#928E8D' }} />}
                        value={values.password}
                        onChange={(e) => {
                          handleChange(e);
                          setPassword(e.target.value); // Update password state for real-time feedback
                        }}
                        onBlur={() => setShowPasswordHints(false)} // Hide password hints when blurred
                        onFocus={() => setShowPasswordHints(true)} // Show password hints on focus
                        className={
                          errors.password && touched.password
                            ? styles.inputErrorFiled
                            : ''
                        }
                      />
                      {errors.password && touched.password && (
                        <Text type="danger">{errors.password}</Text>
                      )}
                    </Form.Item>

                    {/* Password validation feedback, shown only when focused */}
                    {showPasswordHints && (
                      <div
                        style={{
                          marginBottom: '20px',
                          background: '#f8f8f8',
                          padding: '10px',
                          borderRadius: '5px',
                        }}
                      >
                        <Typography.Text
                          style={{
                            color: passwordValidationStatus.lowercase
                              ? 'green'
                              : 'red',
                            fontFamily: 'Arial',
                            fontSize: '12px',
                          }}
                        >
                          {passwordValidationStatus.lowercase ? (
                            <CheckOutlined />
                          ) : (
                            <CloseOutlined />
                          )}{' '}
                          Password must include at least one lowercase character
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          style={{
                            color: passwordValidationStatus.uppercase
                              ? 'green'
                              : 'red',
                            fontFamily: 'Arial',
                            fontSize: '12px',
                          }}
                        >
                          {passwordValidationStatus.uppercase ? (
                            <CheckOutlined />
                          ) : (
                            <CloseOutlined />
                          )}{' '}
                          Password must include at least one uppercase character
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          style={{
                            color: passwordValidationStatus.number
                              ? 'green'
                              : 'red',
                            fontFamily: 'Arial',
                            fontSize: '12px',
                          }}
                        >
                          {passwordValidationStatus.number ? (
                            <CheckOutlined />
                          ) : (
                            <CloseOutlined />
                          )}{' '}
                          Password must include at least one number
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          style={{
                            color: passwordValidationStatus.splCharacters
                              ? 'green'
                              : 'red',
                            fontFamily: 'Arial',
                            fontSize: '12px',
                          }}
                        >
                          {passwordValidationStatus.splCharacters ? (
                            <CheckOutlined />
                          ) : (
                            <CloseOutlined />
                          )}{' '}
                          Password must include at least three special
                          characters
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          style={{
                            color: passwordValidationStatus.length
                              ? 'green'
                              : 'red',
                            fontFamily: 'Arial',
                            fontSize: '12px',
                          }}
                        >
                          {passwordValidationStatus.length ? (
                            <CheckOutlined />
                          ) : (
                            <CloseOutlined />
                          )}{' '}
                          Password should be at least 8 characters long
                        </Typography.Text>
                      </div>
                    )}

                    <Form.Item
                      label={
                        <label className={styles.formlabel}>
                          Confirm Password
                        </label>
                      }
                    >
                      <Input.Password
                        style={{ height: '50px' }}
                        size="large"
                        iconRender={(visible) => (
                          <Icon
                            icon={visible ? 'bi:eye' : 'eva:eye-off-outline'}
                            color={styles.gray}
                          />
                        )}
                        prefix={<LockOutlined style={{ color: '#928E8D' }} />}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.confirmPassword && touched.confirmPassword
                            ? styles.inputErrorFiled
                            : ''
                        }
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <Text type="danger">{errors.confirmPassword}</Text>
                      )}
                    </Form.Item>

                    <Form.Item className={styles.resetButtonRow}>
                      <Button
                        htmlType="submit"
                        disabled={!(isValid && dirty)}
                        className={styles.buttonWidth}
                        style={{ zIndex: '99' }}
                      >
                        Reset Password
                      </Button>
                    </Form.Item>
                  </Form>
                );
              }}
            </Formik>

            <Divider style={{ margin: '10px' }}>
              <Typography.Text style={{ color: '#D9D9D9' }}>or</Typography.Text>
            </Divider>

            <Row justify="center" align="middle" style={{ zIndex: '99' }}>
              <Typography.Text className={styles.loginDontText}>
                If Remember the Credentials?
                <Link to="/auth/login"> Sign In</Link>
              </Typography.Text>
            </Row>
          </div>

          {/* <Row style={{ width: '100%' }}>
            <img
              src={leafBg2}
              style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
              alt="Background"
            />
          </Row> */}
        </Col>
      </Row>

      <ModalComponent
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onProceed={() => setIsOpen(false)}
        submitBtnText="Ok"
        content={errMsg}
      />
    </div>
  );
};
