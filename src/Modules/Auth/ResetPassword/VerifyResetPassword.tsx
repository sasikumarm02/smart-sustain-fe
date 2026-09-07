import { Row, Col, Typography, Form, Image, message, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import otpImg from '../../../assets/otp.png';
import styles from '../../UserScreen/Logins/login.module.scss';
import { useNotification } from '../../../Hooks/useNotification';
import { InputOTP } from 'antd-input-otp';
import { useState } from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../../../Services';
// import loginBg from '../../../assets/bgimg.png';
import loginBg from '../../../assets/sustainSVG.svg';
import kpmgicon from '../../../assets/kpmgbrand.svg';
import { ButtonComponent, ModalComponent } from '../../../DesignLibrary';
import { isEmpty } from '../../../Utils/isEmpty';
import topImg from '../../../assets/LeftTop.svg';
import plantOne from '../../../assets/plantOne.svg';
import plantTwo from '../../../assets/plantTwo.svg';
import leafBg from '../../../assets/leafSvg.svg';
import leafBg2 from '../../../assets/leafSvg2.svg';
import smartLogo from '../../../assets/SustainLogoSvg.svg';
import { MailOutlined } from '@ant-design/icons';

export default function VerifyResetOtp() {
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState([]);
  const [otpData, setOtpData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState('');

  const query = new URLSearchParams(location.search);
  const emailFromQuery = query.get('email');
  const email = emailFromQuery || location.state?.email;

  const onHandleOtp = (values: any) => {
    setValue(values);
  };

  const handleVerifyOtp = (values: any) => {
    setIsLoading(true);
    axios
      .post(apiBaseUrl + '/esg/verify-reset-password-otp/', {
        email_address: email,
        otp: values.authenticationcode,
      })

      .then((res) => {
        if (res?.data?.status === 'Success') {
          if (res?.data?.response?.status === true) {
            setOtpData(res?.data?.response?.data);
            openToast({
              content: `${res?.data.message}`,
              type: 'success',
            });

            navigate('/auth/reset-password', {
              state: { email, otpData: res?.data?.response?.data },
            });
          } else {
            openToast({
              content: `${res?.data.message}`,
              type: 'error',
            });
          }
        }
      })
      .catch((err) => {
        setErrMsg(err?.response?.data?.message);
        setIsOpen(true);
      });
  };

  const handleSubmitForm = (values: any) => {
    handleVerifyOtp(values);
  };

  const handleKeyPress = (event: any) => {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault(); // Prevent non-numeric input
    }
  };

  return (
    <>
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
                  We have sent a verification code to your registered email ID.
                  Please enter verification code below.
                </h2>
              </Row>

              <Formik
                enableReinitialize
                initialValues={{
                  authenticationcode:
                    value.filter((str: any) => str !== '').join('') || '',
                }}
                validate={(values) => {
                  let errors = {};

                  if (!values.authenticationcode) {
                    return (errors = {
                      authenticationcode: 'Incorrect OTP code',
                    });
                  }

                  return errors;
                }}
                onSubmit={handleSubmitForm}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ zIndex: '99' }}
                  >
                    <Form.Item>
                      <div className={styles.inputOtp}>
                        <InputOTP
                          name="authenticationcode"
                          type={'text'}
                          size="large"
                          value={value}
                          inputMode={'numeric'}
                          onChange={onHandleOtp}
                          maxLength={1}
                          onKeyPress={handleKeyPress}
                          isPreserveFocus={true}
                        />
                      </div>
                      {(errors.authenticationcode &&
                        touched.authenticationcode && (
                          <Typography.Text type="danger">
                            {errors.authenticationcode}
                          </Typography.Text>
                        )) ||
                        (values.authenticationcode.length !== 6 &&
                          touched.authenticationcode && (
                            <Typography.Text type="danger">
                              {'Please enter 6 digit code'}
                            </Typography.Text>
                          ))}
                    </Form.Item>
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        className={styles.buttonWidth}
                        disabled={values.authenticationcode.length !== 6}
                        style={{ zIndex: '99' }}
                      >
                        Submit
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
          </Col>

          {/* <Col md={24} lg={12} className={styles.formBody}>
            <div
              style={{
                fontSize: '36px',
                color: '#00338d',
                fontWeight: 'bold',
                marginBottom: 'none',
                fontFamily: 'Arial',
              }}
            >
              SMART
            </div>
            <Row className={styles.rowMargin}>
              <div className={styles.logoSubHeading}>Sustain.AI</div>
            </Row>
            <Row className={styles.rowMargin}>
              <h3 className={styles.loginHeading}>OTP Verification Screen</h3>
            </Row>

            <Row className="mt-2 mb-2 justify-content-center">
              <Image
                loading="lazy"
                src={otpImg}
                preview={false}
                className={`otpImg ${styles.verifyotpImage}`}
              />
            </Row>
            <Row className="mt-2">
              <p className={styles.loginSubHeading}>
                We have sent a verification code to your registered email ID.
                Please enter verification code below.
              </p>
            </Row>

            <Formik
              enableReinitialize
              initialValues={{
                authenticationcode:
                  value.filter((str: any) => str !== '').join('') || '',
              }}
              validate={(values) => {
                let errors = {};

                if (!values.authenticationcode) {
                  return (errors = {
                    authenticationcode: 'Incorrect OTP code',
                  });
                }

                return errors;
              }}
              onSubmit={handleSubmitForm}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <Form layout="vertical" onFinish={handleSubmit}>
                  <Form.Item>
                    <div className={styles.inputOtp}>
                      <InputOTP
                        name="authenticationcode"
                        type={'text'}
                        size="large"
                        value={value}
                        inputMode={'numeric'}
                        onChange={onHandleOtp}
                        maxLength={1}
                        onKeyPress={handleKeyPress}
                        isPreserveFocus={true}
                      />
                    </div>
                    {(errors.authenticationcode &&
                      touched.authenticationcode && (
                        <Typography.Text type="danger">
                          {errors.authenticationcode}
                        </Typography.Text>
                      )) ||
                      (values.authenticationcode.length !== 6 &&
                        touched.authenticationcode && (
                          <Typography.Text type="danger">
                            {'Please enter 6 digit code'}
                          </Typography.Text>
                        ))}
                  </Form.Item>
                  <Form.Item>
                    <ButtonComponent
                      htmlType="submit"
                      hierarchy="primary"
                      size="lg"
                      className={styles.buttonWidth}
                      disabled={values.authenticationcode.length !== 6}
                    >
                      Submit
                    </ButtonComponent>
                  </Form.Item>
                </Form>
              )}
            </Formik>
          </Col> */}
        </Row>

        <ModalComponent
          isOpen={isOpen}
          onCancel={() => setIsOpen(false)}
          onProceed={() => setIsOpen(false)}
          submitBtnText="Ok"
          content={errMsg}
        />
      </div>
    </>
  );
}
