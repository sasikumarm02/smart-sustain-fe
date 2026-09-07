import { useState } from 'react';
import { Row, Col, Typography, Form, Input, Image, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import styles from '../../UserScreen/Logins/login.module.scss';
import kpmgicon from '../../../assets/kpmgbrand.svg';
// import loginBg from '../../../assets/bgimg.png';
import loginBg from '../../../assets/sustainSVG.svg';
import otpImg from '../../../assets/otp.png';
import { useNotification } from '../../../Hooks/useNotification';
import { ButtonComponent, ModalComponent } from '../../../DesignLibrary';
import { apiBaseUrl } from '../../../Services';
import topImg from '../../../assets/LeftTop.svg';
import plantOne from '../../../assets/plantOne.svg';
import plantTwo from '../../../assets/plantTwo.svg';
import leafBg from '../../../assets/leafSvg.svg';
import leafBg2 from '../../../assets/leafSvg2.svg';
import smartLogo from '../../../assets/SustainLogoSvg.svg';
import { MailOutlined } from '@ant-design/icons';

const ForgotPassword = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState('');

  const handleForgotPassword = (values: { email_address: string }) => {
    setIsLoading(true);
    axios
      .post(apiBaseUrl + '/esg/send-reset-password-otp/', {
        email_address: values.email_address,
      })
      .then((res) => {
        const { status, message, response } = res.data;
        if (status === 'Success' && response?.status === true) {
          openToast({
            content: message,
            type: 'success',
          });
          setEmail(values.email_address);
          setIsOtpSent(true);
          navigate('/auth/reset/verify-otp', {
            state: { email: values.email_address },
          });
        } else {
          openToast({
            content: message,
            type: 'error',
          });
        }
      })
      .catch((err) => {
        setErrMsg(err?.response?.data?.message);
        setIsOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div style={{ height: '100vh', background: '#fff' }}>
      <Row align="middle" style={{ height: '100vh' }}>
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

            <Row className="mt-1 mb-1 justify-content-center">
              <Image
                loading="lazy"
                src={otpImg}
                preview={false}
                className={`otpImg ${styles.verifyotpImage}`}
              />
            </Row>

            <Row>
              <h2 className={styles.loginSubHeading}>
                Enter your registered email below and we'll send you a link to
                reset your password.
              </h2>
            </Row>

            <Formik
              initialValues={{ email_address: '' }}
              validationSchema={yup.object().shape({
                email_address: yup
                  .string()
                  .email('Please enter a valid email address')
                  .required('Email address required'),
              })}
              onSubmit={(values) => {
                handleForgotPassword(values);
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
                  style={{ zIndex: '99' }}
                >
                  <Form.Item
                    label={<label className={styles.formlabel}>Email *</label>}
                  >
                    <Input
                      style={{ height: '50px' }}
                      name="email_address"
                      type="email"
                      size="large"
                      prefix={<MailOutlined style={{ color: '#928E8D' }} />}
                      value={values.email_address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      id="email-input-login"
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
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      disabled={!(isValid && dirty)}
                      loading={isLoading}
                      className={styles.buttonWidth}
                      style={{ zIndex: '99' }}
                    >
                      Send OTP
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Formik>
          </div>

          {/* <Row style={{ width: '100%' }}>
                      <img
                        src={leafBg2}
                        style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
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

export default ForgotPassword;
