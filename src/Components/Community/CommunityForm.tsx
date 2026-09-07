import { useEffect, useState, useRef } from 'react';
import { Col, Row, Form, Typography, Form as AntdForm, Checkbox } from 'antd';
import { useNotification } from '../../Hooks/useNotification';
import { Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import CustomSelect from '../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../Components/FormInput/CustomInput';
import styles from '../Social/form.module.scss';
import { NumberInput } from '../NumberInput/NumberInput';
import { CountryCode } from 'libphonenumber-js';
import { useAuth } from '../../Hooks/useAuth';
import { get, post } from '../../Services';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import Styles from './communityform.module.scss';
import ModalComponent from '../../DesignLibrary/ModalComponent';

interface Values {}

interface Entity {
  city: string;
  country: string;
  createdBy: string;
  date_of_incorporation: string; // Using string to represent the ISO date format
  entity_Id: string;
  entity_name: string;
  facility_Address: string;
  facility_Id: string;
  facility_Name: string;
  id: number;
  primary_Activity: string;
  sector: string;
}

function CommunityForm() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [facilityData, setFacilityData] = useState([]);
  const [formValues, setFormValues] = useState<any>('');
  const navigate = useNavigate();
  const resetFormRef = useRef<() => void>(() => {});

  const [isEsgAssurer, setIsEsgAssurer] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      get(`/facility/get_Facility/?entity_Id=${user.entity_Id}`)
        .then((res: any) => {
          if (res.response?.status !== false) {
            if (res.response?.data) {
              setFacilityData(res.response?.data);
            }
          } else {
            setFacilityData([]);
            openToast({
              content: `${res.message}`,
              type: 'error',
            });
          }
        })
        .catch((err) => console.log(err));
    };
    // fetchData();
  }, []);

  const inviteUser = async (values: any) => {
    try {
      const response = await post(`/invite/inviteUserCompany/`, {
        ...values,
        mobileNumber: JSON.stringify(values.userMobileNumber),
      });

      if (response.status === 'Success') {
        if (response.response.status === true) {
          openToast({
            content: `${response.message}`,
            type: 'success',
          });

          navigate(`/user-access-management/user-management`);
          return true;
        } else {
          openToast({
            content: `${response.message}`,
            type: 'warning',
          });
        }
      }
    } catch (err) {
      setIsLoading(false);
      openToast({
        content: `${err}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  const handleProceed = async () => {
    setIsLoading(true);
    const success = await inviteUser(formValues);
    if (success) {
      if (resetFormRef.current) {
        resetFormRef.current();
      }
      handleDialogClose();
    }
  };
  const handleCheckboxChange = (checked: boolean, setFieldValue: Function) => {
    setFieldValue('esg_assurer', checked);
    setIsEsgAssurer(checked);
    setIsOpen(true); // Open modal on checkbox click
  };

  return (
    <>
      <PageCardComponent customClass={styles.pageCardStyle}>
        <Row
          justify="end"
          // className={styles.rowBorder}
          // style={{ padding: '5vh' }}
        >
          <Col span={24} className="AnttabSty">
            <Formik
              initialValues={{
                email_address: '',
                entity_Id: user.entity_Id,
                userMobileNumber: {
                  value: '',
                  countryCode: 'SG',
                },
                esg_assurer: false,
              }}
              validationSchema={Yup.object().shape({
                email_address: Yup.string()
                  .email('Please enter valid email address')
                  .required('Email address required'),
                userMobileNumber: Yup.object().shape({
                  value: Yup.string(),
                  countryCode: Yup.string(),
                }),
              })}
              onSubmit={async (values, { resetForm }) => {
                setIsOpen(true);
                setFormValues(values);
                resetFormRef.current = resetForm;
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
                handleReset,
                isValid,
                dirty,
              }) => {
                return (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <Row justify="start" gutter={10}>
                      <>
                        {[
                          {
                            label: 'Email Address *',
                            name: 'email_address',
                            type: 'input',
                          },
                          {
                            label: 'Official Mobile Number',
                            name: 'mobile_number',
                            type: 'input',
                          },
                        ].map((field: any, index: number) => (
                          <Col span={24} key={index}>
                            <Row
                              gutter={[12, 12]}
                              align="middle"
                              justify="center"
                            >
                              <Col lg={12} md={12} sm={8} xs={24}>
                                <p className={styles.CommunityformLabel}>
                                  {field.label}
                                </p>
                              </Col>
                              <Col
                                lg={12}
                                md={12}
                                sm={16}
                                xs={24}
                                className="mt-3"
                              >
                                {index !== 1 ? (
                                  <>
                                    {field.type === 'select' ? (
                                      <CustomSelect
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        options={field.options}
                                        errors={
                                          errors[field.name as keyof Values]
                                        }
                                        touched={
                                          touched[field.name as keyof Values]
                                        }
                                        value={
                                          values[field.name as keyof Values]
                                        }
                                        secondChange={setFieldValue}
                                        hook={handleChange}
                                        blur={handleBlur}
                                        size="large"
                                        status={
                                          (touched[
                                            field.name as keyof Values
                                          ] &&
                                            errors[
                                              field.name as keyof Values
                                            ] &&
                                            'error') ||
                                          ''
                                        }
                                        multiple={
                                          field.name === 'module' ? true : false
                                        }
                                      />
                                    ) : (
                                      <CustomInput
                                        className={Styles.mobileHeight}
                                        size="large"
                                        name={field.name}
                                        type="text"
                                        errors={
                                          touched[field.name as keyof Values] &&
                                          errors[field.name as keyof Values]
                                        }
                                        placeholder="Enter email address"
                                        disabled={field.disabled}
                                        touched={touched}
                                        value={
                                          values[field.name as keyof Values]
                                        }
                                        hook={handleChange}
                                        blur={handleBlur}
                                        status={
                                          (touched[
                                            field.name as keyof Values
                                          ] &&
                                            errors[
                                              field.name as keyof Values
                                            ] &&
                                            'error') ||
                                          ''
                                        }
                                      />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Field name="userMobileNumber">
                                      {({ field }: FieldProps) => {
                                        return (
                                          <Form.Item label="">
                                            <NumberInput
                                              className={Styles.mobileHeight}
                                              id="number-input-signup"
                                              {...field}
                                              placeholder="Enter mobile number"
                                              onChange={(value: {
                                                value: string;
                                                countryCode: CountryCode;
                                                code: string;
                                              }) =>
                                                setFieldValue(
                                                  'userMobileNumber',
                                                  value
                                                )
                                              }
                                            />
                                            {touched.userMobileNumber &&
                                              errors.userMobileNumber
                                                ?.value && (
                                                <Typography.Text type="danger">
                                                  {
                                                    errors.userMobileNumber
                                                      .value
                                                  }
                                                </Typography.Text>
                                              )}
                                          </Form.Item>
                                        );
                                      }}
                                    </Field>
                                  </>
                                )}
                              </Col>
                            </Row>
                            {index === 1 && (
                              <Row
                                gutter={[12, 12]}
                                align="middle"
                                justify="center"
                                className="mt-2"
                              >
                                <Col lg={12} md={12} sm={8} xs={24}></Col>
                                <Col lg={12} md={12} sm={16} xs={24}>
                                  <Field name="esg_assurer">
                                    {({ field }: FieldProps) => (
                                      <Form.Item>
                                        <Checkbox
                                          {...field}
                                          checked={values.esg_assurer}
                                          onChange={(e) =>
                                            setFieldValue(
                                              'esg_assurer',
                                              e.target.checked
                                            )
                                          }
                                        >
                                          Do you want to designate this user as
                                          an Workflow Viewer?
                                        </Checkbox>
                                      </Form.Item>
                                    )}
                                  </Field>
                                </Col>
                              </Row>
                            )}
                          </Col>
                        ))}
                      </>
                    </Row>
                    {/* <Row></Row> */}
                    <Row
                      gutter={[16, 16]}
                      justify="end"
                      className={Styles?.marginTop}
                    >
                      <Col>
                        <Form.Item>
                          <ButtonComponent
                            htmlType="reset"
                            hierarchy="tertiary"
                          >
                            Reset
                          </ButtonComponent>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item>
                          <ButtonComponent
                            htmlType="submit"
                            hierarchy="primary"
                            disabled={!(isValid && dirty)}
                          >
                            Submit
                          </ButtonComponent>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
        <ModalComponent
          isOpen={isOpen}
          content={
            formValues?.esg_assurer
              ? 'Please confirm if you want to invite the Workflow Viewer.'
              : 'Please confirm if you want to invite the User.'
          }
          onClose={handleDialogClose}
          onProceed={handleProceed}
          loader={isLoading}
          cancelBtnText="No"
          submitBtnText="Yes"
        />
      </PageCardComponent>
    </>
  );
}

export default CommunityForm;
