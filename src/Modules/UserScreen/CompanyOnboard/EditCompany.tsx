import React, { useState } from 'react';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
} from '../../../DesignLibrary';
import styles from './Entity.module.scss';
import { Col, Row, Form, Typography, Input } from 'antd';
import { Formik } from 'formik';
import CustomInput from '../../../Components/FormInput/CustomInput';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { put } from '../../../Services';
import { useNotification } from '../../../Hooks/useNotification';

function EditCompany() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openToast } = useNotification();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const record = location.state?.record;

  const adminValidationSchema = Yup.object({
    email_address: Yup.string()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    user_name: Yup.string().required('UserName is required'),
  });

  const postData = (values: any, resetForm: any) => {
    const payload = {
      new_email: values.email_address, // Map Formik's email_address to new_email
      entity_Id: record.entity_Id,
      userName: values.user_name, // Map Formik's user_name to userName
    };

    put('/invite/change_admin/', payload)
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
            resetForm();
            navigate('/manage-client/create-profile');
          } else {
            openToast({
              content: `${res?.response?.error_message}`,
              type: 'error',
            });
          }
        }
      })
      .catch((err: any) => {
        const errorMessage = err?.response?.data?.response?.error_message;
        setErrMsg(errorMessage);
        setIsOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div>
        <PageCardComponent className={styles.pageCardStyleSpecial}>
          <p className="pageTitle">Edit Client Profile</p>
          <Row justify="space-between" className="mt-3">
            <Col>
              <Formik
                initialValues={{
                  email_address: '',
                  user_name: '',
                }}
                validationSchema={adminValidationSchema}
                onSubmit={(values, { resetForm }) => {
                  setIsLoading(true);
                  postData(values, resetForm);
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  handleReset,
                  isValid,
                  dirty,
                  values,
                }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <Row
                      justify="space-between"
                      gutter={[16, 16]}
                      style={{ alignItems: 'baseline' }}
                    >
                      <>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>
                                Company Name
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={record.entity_name}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>
                                Select Entity Type
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={record.entity_Type}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8} xl={8}>
                              <label className={styles.formlabel}>
                                Identification Number
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={record.entity_number}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>Sector</label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={record.sector}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>
                                Incorporation Date
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={moment(
                                  record.date_of_incorporation,
                                  'YYYY-MM-DD'
                                ).format('DD-MM-YYYY')}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>
                                Select Country
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={record.entity_Country}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={12} className={styles.inlineInput}>
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>
                                Select Reporting Period
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input
                                value={record.financial_year}
                                className={styles.editInput}
                                disabled
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          span={12}
                          className={`${styles.inlineInput} ${styles.inlineInputTextArea}`}
                        >
                          <Row style={{ width: '100%' }}>
                            <Col span={8}>
                              <label className={styles.formlabel}>
                                Headquarters Address
                              </label>
                            </Col>
                            <Col span={16}>
                              <Input.TextArea
                                value={record.entity_address}
                                rows={4}
                                disabled
                                style={{ borderRadius: '5px' }}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </>
                    </Row>

                    <Row className="mb-3">
                      <Typography.Text className={styles.formlabel}>
                        Appoint New Admin for the Company
                      </Typography.Text>
                    </Row>

                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Row>
                          <Col span={8}>
                            <label className={styles.formlabel}>
                              Admin Email Address*
                            </label>
                          </Col>
                          <Col span={16}>
                            <CustomInput
                              labelColor="#00338D"
                              size="large"
                              name="email_address"
                              type="text"
                              value={values.email_address}
                              hook={handleChange}
                              blur={handleBlur}
                              status={
                                touched.email_address && errors.email_address
                                  ? 'error'
                                  : ''
                              }
                              errors={errors.email_address}
                              touched={touched.email_address}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={12}>
                        <Row>
                          <Col span={8}>
                            <label className={styles.formlabel}>
                              Username*
                            </label>
                          </Col>
                          <Col span={16}>
                            <CustomInput
                              labelColor="#00338D"
                              size="large"
                              name="user_name"
                              type="text"
                              value={values.user_name}
                              hook={handleChange}
                              blur={handleBlur}
                              status={
                                touched.user_name && errors.user_name
                                  ? 'error'
                                  : ''
                              }
                              errors={errors.user_name}
                              touched={touched.user_name}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    <Row justify="end" style={{ gap: '15px' }}>
                      <ButtonComponent
                        onClick={() => {
                          navigate('/manage-client/create-profile');
                        }}
                        hierarchy="tertiary"
                      >
                        Cancel
                      </ButtonComponent>

                      <Form.Item>
                        <ButtonComponent
                          hierarchy="primary"
                          htmlType="submit"
                          disabled={!(isValid && dirty)}
                          loading={isLoading}
                        >
                          Update
                        </ButtonComponent>
                      </Form.Item>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </PageCardComponent>
        <ModalComponent
          isOpen={isOpen}
          content={errMsg}
          cancelBtnText="Ok"
          onClose={() => setIsOpen(false)}
        />
      </div>
    </>
  );
}

export default EditCompany;
