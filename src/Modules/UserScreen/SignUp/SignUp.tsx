import { Row, Col, Typography, Button, Form, Input, Card, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import styles from './Signup.module.scss';
import brandicon from '../../../assets/brandIcon.png';
import loginBg from '../../../assets/sustainSVG.svg';
import smartLogo from '../../../assets/SustainLogoSvg.svg';
import { Icon } from '@iconify/react';
import CustomInput from '../../../Components/FormInput/CustomInput';
import * as Yup from 'yup';
import { Checkbox } from 'antd';
import { useNotification } from '../../../Hooks/useNotification';
import { apiBaseUrl, post } from '../../../Services';
import { useState } from 'react';
import kpmgicon from '../../../assets/kpmgbrand.svg';
import topImg from '../../../assets/LeftTop.svg';
import ModalComponent from '../../../DesignLibrary/ModalComponent';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import axios from 'axios';
import { useQuery } from '../../../Hooks/useQuery';
import { ButtonComponent } from '../../../DesignLibrary';

export const UserAuthlayout = () => {
  return (
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
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();
  const query = useQuery();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState('');
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);

  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isPolicyModalVisible, setIsPolicyModalVisible] = useState(false);

  const showTermsModal = () => setIsTermsModalVisible(true);
  const showPolicyModal = () => setIsPolicyModalVisible(true);

  const handleTermsAccept = () => {
    setIsTermsAccepted(true);
    setIsTermsModalVisible(false);
  };

  const handlePolicyAccept = () => {
    setIsPolicyAccepted(true);
    setIsPolicyModalVisible(false);
  };

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

  return (
    <>
      <div
        style={{
          height: '100vh',
          background: '#fff',
        }}
      >
        <Row align="middle" style={{ height: '100vh' }}>
          <UserAuthlayout />
          <Col xl={12} lg={12} xs={24} md={24}>
            <Row justify="center" align="middle">
              <Col lg={20} xs={24} md={16} className={styles.formBodySignup}>
                <Row justify="center">
                  <Col lg={18} xs={24} md={16}>
                    <Card hoverable={false} className={styles.customCard}>
                      <Row>
                        <img src={smartLogo} style={{ height: '40px' }}></img>
                      </Row>
                      <div>
                        <p className={styles.loginSubText}>
                          Have an account?{' '}
                          <span
                            className={styles.span}
                            onClick={() => navigate('/auth/login')}
                          >
                            Sign In
                          </span>
                        </p>
                      </div>
                      <Formik
                        initialValues={{
                          firstName: '',
                          lastName: '',
                          email_address: query.get('email_address'),
                          accept: false,
                          password: '',
                        }}
                        validationSchema={Yup.object().shape({
                          firstName: Yup.string()
                            .trim()
                            .test(
                              'non-empty',
                              '',
                              (value: any) => value && value.length > 0
                            ) // Ensures length > 0 after trimming
                            .required('First name is required'),
                          lastName: Yup.string()
                            .trim()
                            .test(
                              'non-empty',
                              '',
                              (value: any) => value && value.length > 0
                            ) // Ensures length > 0 after trimming
                            .required('Last name is required'),
                          password: Yup.string()
                            .matches(
                              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=(?:[^#?!@$%^&*\d]*[#?!@$%^&*\d]){3}).{8,}$/,
                              'Please enter a valid password'
                            )
                            .required('Password required')
                            .min(8),
                        })}
                        onSubmit={(values, { resetForm }) => {
                          const payload = {
                            userName: `${values.firstName} ${values.lastName}`,
                            email_address: values.email_address,
                            accept: values.accept,
                            password: values.password,
                          };
                          setIsLoading(true);
                          axios
                            .post(apiBaseUrl + `/esg/save-user/`, payload)
                            .then((res: any) => {
                              if (res?.data.status === 'Success') {
                                if (res?.data.response?.status === true) {
                                  openToast({
                                    content: `${res?.data.message}`,
                                    type: 'success',
                                  });
                                  resetForm();
                                  if (
                                    res?.data.response?.action ===
                                    'Send OTP Email'
                                  ) {
                                    navigate(
                                      `/auth/verify-otp?email=${res.data.response.data}`,
                                      {
                                        state: { status: 'signup' },
                                      }
                                    );
                                  }
                                }
                              }
                            })
                            .catch((err) => {
                              setErrMsg(err?.response?.data?.message);
                              setIsOpen(true);
                            })
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
                          resetForm,
                        }) => {
                          const passwordValidationStatus = validatePassword(
                            values.password
                          );

                          return (
                            <Form
                              layout="vertical"
                              onFinish={handleSubmit}
                              onReset={handleReset}
                            >
                              <Row justify="center" gutter={10}>
                                <>
                                  <Col span={12}>
                                    <CustomInput
                                      label={
                                        <label className={styles.formlabel}>
                                          First Name *
                                        </label>
                                      }
                                      size="large"
                                      name="firstName"
                                      labelColor="#344054"
                                      type="text"
                                      placeholder="First Name"
                                      errors={errors.firstName}
                                      touched={touched.firstName}
                                      value={values.firstName}
                                      hook={handleChange}
                                      blur={handleBlur}
                                      status={
                                        (touched.firstName &&
                                          errors.firstName &&
                                          'error') ||
                                        ''
                                      }
                                    />
                                  </Col>
                                  <Col span={12}>
                                    <CustomInput
                                      label={
                                        <label className={styles.formlabel}>
                                          Last Name *
                                        </label>
                                      }
                                      size="large"
                                      name="lastName"
                                      labelColor="#344054"
                                      type="text"
                                      placeholder="Last Name"
                                      errors={errors.lastName}
                                      touched={touched.lastName}
                                      value={values.lastName}
                                      hook={handleChange}
                                      blur={handleBlur}
                                      status={
                                        (touched.lastName &&
                                          errors.lastName &&
                                          'error') ||
                                        ''
                                      }
                                    />
                                  </Col>
                                  <Col span={24}>
                                    <CustomInput
                                      disabled="true"
                                      label={
                                        <label className={styles.formlabel}>
                                          Email *
                                        </label>
                                      }
                                      size="large"
                                      name="email_address"
                                      labelColor="#101828"
                                      type="text"
                                      placeholder={query.get('email_address')}
                                      errors={errors.email_address}
                                      touched={touched.email_address}
                                      value={values.email_address}
                                      hook={handleChange}
                                      blur={handleBlur}
                                      status={
                                        (touched.email_address &&
                                          errors.email_address &&
                                          'error') ||
                                        ''
                                      }
                                    />
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item
                                      label={
                                        <label className={styles.formlabel}>
                                          Password *
                                        </label>
                                      }
                                    >
                                      <Input.Password
                                        size="large"
                                        style={{ height: '50px' }}
                                        placeholder="Min. 8 characters"
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
                                        onBlur={() =>
                                          setShowPasswordHints(false)
                                        } // Hide password hints when blurred
                                        onFocus={() =>
                                          setShowPasswordHints(true)
                                        } // Show password hints on focus
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
                                            color:
                                              passwordValidationStatus.lowercase
                                                ? 'green'
                                                : 'red',
                                          }}
                                        >
                                          {passwordValidationStatus.lowercase ? (
                                            <CheckOutlined />
                                          ) : (
                                            <CloseOutlined />
                                          )}{' '}
                                          Password must include at least one
                                          lowercase character
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          style={{
                                            color:
                                              passwordValidationStatus.uppercase
                                                ? 'green'
                                                : 'red',
                                          }}
                                        >
                                          {passwordValidationStatus.uppercase ? (
                                            <CheckOutlined />
                                          ) : (
                                            <CloseOutlined />
                                          )}{' '}
                                          Password must include at least one
                                          uppercase character
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          style={{
                                            color:
                                              passwordValidationStatus.number
                                                ? 'green'
                                                : 'red',
                                          }}
                                        >
                                          {passwordValidationStatus.number ? (
                                            <CheckOutlined />
                                          ) : (
                                            <CloseOutlined />
                                          )}{' '}
                                          Password must include at least one
                                          number
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          style={{
                                            color:
                                              passwordValidationStatus.splCharacters
                                                ? 'green'
                                                : 'red',
                                          }}
                                        >
                                          {passwordValidationStatus.splCharacters ? (
                                            <CheckOutlined />
                                          ) : (
                                            <CloseOutlined />
                                          )}{' '}
                                          Password must include at least three
                                          special characters
                                        </Typography.Text>
                                        <br />
                                        <Typography.Text
                                          style={{
                                            color:
                                              passwordValidationStatus.length
                                                ? 'green'
                                                : 'red',
                                          }}
                                        >
                                          {passwordValidationStatus.length ? (
                                            <CheckOutlined />
                                          ) : (
                                            <CloseOutlined />
                                          )}{' '}
                                          Password should be at least 8
                                          characters long
                                        </Typography.Text>
                                      </div>
                                    )}
                                  </Col>
                                </>
                              </Row>
                              <Row justify="center" gutter={12}>
                                <Col span={24}>
                                  <p className={styles.loginSubText}>
                                    <Checkbox
                                      name="accept"
                                      checked={values.accept}
                                      value={values.accept}
                                      onChange={handleChange}
                                    />{' '}
                                    I agree to the platform{' '}
                                    <span
                                      className={styles.span}
                                      // onClick={showTermsModal}
                                    >
                                      Terms of Services
                                    </span>{' '}
                                    &{' '}
                                    <span
                                      className={styles.span}
                                      // onClick={showPolicyModal}
                                    >
                                      Privacy Policy
                                    </span>
                                  </p>
                                </Col>
                                <Col lg={24}>
                                  <Form.Item>
                                    <Button
                                      block
                                      htmlType="submit"
                                      disabled={
                                        !values.firstName.trim() ||
                                        !values.lastName.trim() ||
                                        !values.password ||
                                        !values.accept
                                        // !isTermsAccepted ||
                                        // !isPolicyAccepted
                                      }
                                      size="large"
                                      loading={isLoading}
                                      className={`save-next ${styles.signupButton}`} // Combine both class names
                                    >
                                      Sign Up
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
              </Col>
            </Row>
            {/* <br />
            <p style={{ textAlign: "center", color: "#A3AED0" }}>
              © 2024 KPMGESG UI. All Rights Reserved.{" "}
            </p> */}
          </Col>
        </Row>
      </div>

      <ModalComponent
        isOpen={isOpen}
        onProceed={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        submitBtnText="Ok"
        content={errMsg}
      />

      <Modal
        className="custom-modal"
        title={<span className={styles.modalTitle}>Terms of Services</span>}
        visible={isTermsModalVisible}
        onCancel={handleTermsAccept}
        bodyStyle={{
          maxHeight: '400px',
          overflowY: 'auto',
        }}
        footer={[
          <ButtonComponent
            key="cancel"
            hierarchy="tertiary"
            onClick={handleTermsAccept}
          >
            Cancel
          </ButtonComponent>,
          <ButtonComponent
            key="accept"
            hierarchy="primary"
            onClick={() => {
              setIsTermsAccepted(true);
              handleTermsAccept();
            }}
          >
            Accept
          </ButtonComponent>,
        ]}
      >
        <p>Your Terms of Service content goes here</p>
        <p>
          Welcome to our platform. Please read these terms carefully as they
          govern your use of our services. By accessing or using our platform,
          you agree to comply with these terms and conditions. If you do not
          agree, please do not use our platform.
        </p>
      </Modal>

      <Modal
        className="custom-modal"
        title={<span className={styles.modalTitle}>Privacy Policy</span>}
        visible={isPolicyModalVisible}
        onCancel={handlePolicyAccept}
        bodyStyle={{
          maxHeight: '400px',
          overflowY: 'auto',
        }}
        footer={[
          <ButtonComponent
            key="cancel"
            hierarchy="tertiary"
            onClick={handlePolicyAccept}
          >
            Cancel
          </ButtonComponent>,
          <ButtonComponent
            key="accept"
            hierarchy="primary"
            onClick={() => {
              setIsPolicyAccepted(true);
              handlePolicyAccept();
            }}
          >
            Accept
          </ButtonComponent>,
        ]}
      >
        <p>Your Privacy Policy content goes here</p>
        <p>
          Welcome to our platform. Please read these terms carefully as they
          govern your use of our services. By accessing or using our platform,
          you agree to comply with these terms and conditions. If you do not
          agree, please do not use our platform.
        </p>
      </Modal>
    </>
  );
};

export default SignUp;
