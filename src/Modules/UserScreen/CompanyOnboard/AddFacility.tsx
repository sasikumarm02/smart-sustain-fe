import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  Select,
  Typography,
  Flex,
  Input,
} from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomInput from '../../../Components/FormInput/CustomInput';
import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import { useNotification } from '../../../Hooks/useNotification';
import styles from './Entity.module.scss';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';
import { post, put } from '../../../Services';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { useAuth } from '../../../Hooks/useAuth';
import moment from 'moment';
import dayjs from 'dayjs';
import { useQuery } from '../../../Hooks/useQuery';
import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import { get } from '../../../Services';

interface Values {}
interface FormFieldBase {
  label: string;
  name: string;
  type: string;
  size: string;
  placeholder: string;
}

interface InputField extends FormFieldBase {
  type: 'input';
}

interface DatePicker extends FormFieldBase {
  type: 'datepicker';
}
interface SelectField extends FormFieldBase {
  type: 'select';
  size: string;
  options: {
    value: string;
    label: string;
  }[];
}

type FormField = InputField | SelectField | DatePicker;

dayjs.locale('en');

interface EntityDetails {
  city: string;
  country: string;
  createdBy: string;
  date_of_incorporation: string;
  entity_Id: string;
  facility_Address: string;
  facility_Id: string;
  facility_Name: string;
  id: number;
  key: string;
  primary_Activity: string;
}

function AddFacility() {
  const { user } = useAuth();
  const query = useQuery();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();
  const [industryList, setIndustryList] = useState([]);
  const [countryList, setCountryList] = React.useState([null]);
  const [filledData, setFilledData] = React.useState<EntityDetails>();
  const [IsFilledData, setIsFilledData] = React.useState(false);
  const location = useLocation();
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
  const fetchIndustryList = async () => {
    try {
      const response = await get('/entity/industry-names/', {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer YOUR_TOKEN_HERE',
          'X-CSRFToken': 'YOUR_CSRF_TOKEN_HERE',
        },
      });
      if (response.status === 'Success') {
        setIndustryList(response.response.data);
      }
    } catch (error: any) {
      openToast({
        content: `Error fetching industry list: ${error.message}`,
        type: 'error',
      });
    }
  };
  useEffect(() => {
    fetchIndustryList();
  }, []);

  React.useEffect(() => {
    fetchCountryList();
  }, [fetchCountryList]);

  const disabledDateAfterCurrent = (current: any) => {
    return current && current > moment().endOf('day');
  };

  React.useEffect(() => {
    if (
      location?.state &&
      location.state !== undefined &&
      location.state !== null &&
      location?.state !== 1
    ) {
      setIsFilledData(true);
      setFilledData(location.state);
    }
  }, []);

  const getInitialValues = (data: any) => ({
    country: data?.country || '',
    facility_Name: data?.facility_Name || '',
    facility_Address: data?.facility_Address || '',
    city: data?.city || '',
    primary_Activity: data?.primary_Activity || '',
    date_of_incorporation: data?.date_of_incorporation
      ? dayjs(data?.date_of_incorporation, 'YYYY/MM/DD')
      : '',
  });
  const initialValues = {
    facility_Name: IsFilledData ? filledData?.facility_Name : '',
    primary_Activity: IsFilledData ? filledData?.primary_Activity : '',
    facility_Address: IsFilledData ? filledData?.facility_Address : '',
    city: IsFilledData ? filledData?.city : '',
    country: IsFilledData ? filledData?.country : '',
    date_of_incorporation:
      IsFilledData && filledData?.date_of_incorporation
        ? dayjs(filledData?.date_of_incorporation, 'YYYY/MM/DD')
        : null,
  };

  const addFacilityData = (values: any, resetForm: any) => {
    const facDate = values?.date_of_incorporation
      ? values?.date_of_incorporation.toISOString()
      : '';
    setIsLoading(true);
    const updatedValues = {
      ...values,
      date_of_incorporation: moment(facDate).format('YYYY-MM-DD'),
    };
    post('/facility/create_facility/', {
      ...updatedValues,
      entity_Id: user.entity_Id,
    })
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
            resetForm();
            navigate('/settings/name-of-the-facilities');
          }
        }
      })
      .catch((err) =>
        openToast({
          content: `${err?.message}`,
          type: 'error',
        })
      )
      .finally(() => setIsLoading(false));
  };

  const updateData = (values: any, resetForm: any) => {
    const facDate = values?.date_of_incorporation
      ? values?.date_of_incorporation.toISOString()
      : '';
    const updatedValues = {
      ...values,
      date_of_incorporation: moment(facDate).format('YYYY-MM-DD'),
    };
    put(`/facility/update_facility/`, {
      ...updatedValues,
      entity_Id: user.entity_Id,
      facility_Id: filledData?.facility_Id,
    })
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
            resetForm();
            navigate('/settings/name-of-the-facilities');
          } else {
            openToast({
              content: `${res?.response?.error_message}`,
              type: 'warning',
            });
          }
        }
      })
      .catch((err) =>
        openToast({
          content: `${err?.message}`,
          type: 'error',
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
  };
  const isEditMode = window.location.search.includes('action=edit');
  return (
    <div>
      <PageCardComponent className={styles.pageCardStyleSpecial}>
        <p className={styles.styletitle}>
          {query.get('action') !== null
            ? 'Modify Facility Profile'
            : 'Create Facility Profile'}
        </p>
        <div className={styles.cardStyle}>
          <Formik
            initialValues={initialValues}
            enableReinitialize={true} // Add this line
            validationSchema={Yup.object().shape({
              facility_Name: Yup.string().required('required'),
              primary_Activity: Yup.string().required('required'),
              facility_Address: Yup.string().required('required'),
              city: Yup.string().required('required'),
              country: Yup.string().required('required'),
              date_of_incorporation: Yup.string().required('required'),
            })}
            onSubmit={(values, { resetForm }) => {
              if (query.get('action') !== null) {
                updateData(values, resetForm);
              } else {
                addFacilityData(values, resetForm);
              }
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
                  <Row justify="start" gutter={10}>
                    <Col span={8} className={styles.inlineInputFacility}>
                      <Row style={{ width: '100%' }}>
                        <Col span={24}>
                          <label className={styles.formlabel}>
                            Facility Name *
                          </label>
                          <CustomInput
                            labelColor="#00338D"
                            size="large"
                            name="facility_Name"
                            type="text"
                            placeholder={
                              IsFilledData && filledData?.facility_Name
                                ? `${filledData?.facility_Name}`
                                : ''
                            }
                            errors={errors.facility_Name}
                            touched={touched.facility_Name}
                            value={values?.facility_Name}
                            hook={handleChange}
                            status={
                              (touched.facility_Name &&
                                errors.facility_Name &&
                                'error') ||
                              ''
                            }
                            blur={handleBlur}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8} className={styles.inlineInputFacility}>
                      <Row style={{ width: '100%' }}>
                        <Col span={24}>
                          <label className={styles.formlabel}>
                            Establishment Date *
                          </label>
                          <CustomDatePicker
                            style={{ height: '50px' }}
                            name="date_of_incorporation"
                            disabled={IsFilledData}
                            labelColor="#00338D"
                            format="DD-MMM-YYYY"
                            calenderColor="#FAF9FF"
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
                            disabledDate={disabledDateAfterCurrent}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col span={8} className={styles.inlineInputFacility}>
                      <Row style={{ width: '100%' }}>
                        <Col span={24}>
                          <label className={styles.formlabel}>
                            City / Town / Village *
                          </label>
                          <CustomInput
                            labelColor="#00338D"
                            size="large"
                            name="city"
                            type="text"
                            placeholder={
                              IsFilledData && filledData?.city
                                ? `${filledData?.city}`
                                : ''
                            }
                            errors={errors.city}
                            touched={touched.city}
                            value={values.city}
                            hook={handleChange}
                            status={
                              (touched.city && errors.city && 'error') || ''
                            }
                            blur={handleBlur}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8} className={styles.inlineInputFacility}>
                      <Row style={{ width: '100%' }}>
                        <Col span={24}>
                          {/* <CustomInput
                            labelColor="#00338D"
                            size="large"
                            name="primary_Activity"
                            type="text"
                            placeholder={
                              IsFilledData && filledData?.primary_Activity
                                ? `${filledData?.primary_Activity}`
                                : ''
                            }
                            errors={errors.primary_Activity}
                            touched={touched.primary_Activity}
                            value={values.primary_Activity}
                            hook={handleChange}
                            status={
                              (touched.primary_Activity &&
                                errors.primary_Activity &&
                                'error') ||
                              ''
                            }
                            blur={handleBlur}
                          /> */}
                          <label className={styles.formlabel}>Sector *</label>
                          <Form.Item>
                            <Select
                              className="facilitySelect"
                              suffixIcon={
                                <DownOutlined
                                  style={{
                                    color: '#000',
                                    fontSize: '12px',
                                  }}
                                />
                              }
                              style={{ height: '50px' }}
                              size="large"
                              showSearch
                              placeholder="Select primary activity"
                              value={values.primary_Activity}
                              onChange={(value) => {
                                setFieldValue('primary_Activity', value);
                              }}
                              onBlur={() =>
                                setFieldTouched('primary_Activity', true)
                              }
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              status={
                                (touched.primary_Activity &&
                                  errors.primary_Activity &&
                                  'error') ||
                                ''
                              }
                            >
                              {industryList.length > 0
                                ? industryList.map(
                                    (industry: any, index: any) => (
                                      <Select.Option
                                        key={index}
                                        value={industry}
                                      >
                                        {industry}
                                      </Select.Option>
                                    )
                                  )
                                : null}
                            </Select>

                            {errors.primary_Activity &&
                              touched.primary_Activity && (
                                <Typography.Text type="danger">
                                  {typeof errors.primary_Activity === 'string'
                                    ? errors.primary_Activity
                                    : ''}
                                </Typography.Text>
                              )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8} className={styles.inlineInputFacility}>
                      <Row style={{ width: '100%' }}>
                        <Col span={24}>
                          <label className={styles.formlabel}>Country *</label>
                          <Form.Item>
                            <Select
                              suffixIcon={
                                <DownOutlined
                                  style={{
                                    color: '#000',
                                    fontSize: '12px',
                                  }}
                                />
                              }
                              style={{ height: '50px' }}
                              size="large"
                              showSearch
                              placeholder="Select country"
                              value={values.country}
                              onChange={(e: any) => {
                                setFieldValue('country', e ? e : '');
                              }}
                              onBlur={() => setFieldTouched('country', true)}
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              status={
                                (touched.country &&
                                  errors.country &&
                                  'error') ||
                                ''
                              }
                            >
                              {countryList.length > 1 ? (
                                <>
                                  {countryList.map((data: any, index: any) => (
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
                                  ))}
                                </>
                              ) : null}
                            </Select>

                            {errors.country && touched.country && (
                              <Typography.Text type="danger">
                                {typeof errors.country === 'string'
                                  ? errors.country
                                  : ''}
                              </Typography.Text>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={8}></Col>

                    <Col span={8} className={styles.inlineInputFacility}>
                      <Row style={{ width: '100%' }}>
                        <Col span={24}>
                          <label className={styles.formlabel}>
                            Facility Address *
                          </label>
                          <Form.Item>
                            <Input.TextArea
                              rows={4}
                              name="facility_Address"
                              value={values.facility_Address}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              status={
                                (touched.facility_Address &&
                                  errors.facility_Address &&
                                  'error') ||
                                ''
                              }
                              style={{ borderRadius: '5px' }}
                            />
                            {errors.facility_Address &&
                              touched.facility_Address && (
                                <Typography.Text type="danger">
                                  {typeof errors.facility_Address === 'string'
                                    ? errors.facility_Address
                                    : ''}
                                </Typography.Text>
                              )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row justify="end" className={styles?.facitlityBtn}>
                    <ButtonComponent
                      hierarchy="tertiary"
                      size="lg"
                      onClick={() =>
                        navigate('/settings/name-of-the-facilities')
                      }
                    >
                      Cancel
                    </ButtonComponent>
                    {!isEditMode && (
                      <ButtonComponent
                        style={{ marginLeft: '15px' }}
                        hierarchy="tertiary"
                        size="lg"
                        htmlType="reset"
                      >
                        Reset
                      </ButtonComponent>
                    )}
                    <ButtonComponent
                      style={{ marginLeft: '15px' }}
                      htmlType="submit"
                      size="lg"
                      loading={isLoading}
                    >
                      Submit
                    </ButtonComponent>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </div>
      </PageCardComponent>
    </div>
  );
}

export default AddFacility;
