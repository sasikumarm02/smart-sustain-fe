import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Select,
  Input,
  Typography,
  Card,
  DatePicker,
} from 'antd';
import { Dayjs } from 'dayjs';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomInput from '../../../Components/FormInput/CustomInput';
import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import styles from './Entity.module.scss';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNotification } from '../../../Hooks/useNotification';
import { post, put } from '../../../Services';
import moment from 'moment';
import { CalendarFilled } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useAuth } from '../../../Hooks/useAuth';
import dayjs from 'dayjs';
import { error } from 'console';
import { get } from '../../../Services';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
} from '../../../DesignLibrary';

type DateRange = [Dayjs | null | undefined, Dayjs | null | undefined];

interface EntityDetails {
  date_of_incorporation: string;
  end_date: string;
  entity_Country: string;
  entity_Id: string;
  entity_Role: string;
  entity_Type: string;
  entity_address: string;
  entity_name: string;
  entity_number: string;
  key: string;
  sector: string;
  start_date: string;
  financial_year: any;
  email_address: string;
}

const adminValidationSchema = Yup.object({
  entity_name: Yup.string().required('Name Required'),
  entity_number: Yup.string().required('Number Required'),
  email_address: Yup.string()
    .email('Please enter valid email address')
    .required('Email address required'),
  financial_year: Yup.array()
    .of(Yup.date().nullable())
    .required('Date range is required'),
});

const userValidationSchema = Yup.object({
  date_of_incorporation: Yup.date().required('Incorporation Date Required'),
  entity_address: Yup.string().required('Address Required'),
  entity_Type: Yup.string().required('Type Required'),
  sector: Yup.string().required('Sector Required'),
  entity_Country: Yup.string().required('Country Required'),
});

const validationSchemas: { [key: string]: Yup.ObjectSchema<any> } = {
  SUPER_ADMIN: adminValidationSchema,
  ADMIN: userValidationSchema,
};

const AddCompany = ({ prefillData }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [countryList, setCountryList] = React.useState([null]);
  const [filledData, setFilledData] = React.useState<EntityDetails>();
  const [IsFilledData, setIsFilledData] = React.useState(false);
  const [industryList, setIndustryList] = useState([]);
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const records = location.state;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | undefined>();

  const validationSchema = validationSchemas[user.role] || Yup.object();

  const formatTargetDate = (date?: any) => {
    const facDate = date ? date.toISOString() : '';
    return date ? moment(facDate).format('YYYY-MM-DD') : '';
  };

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

  React.useEffect(() => {
    if (
      location?.state &&
      location.state !== undefined &&
      location.state !== null
    ) {
      setIsFilledData(true);
      setFilledData(location.state);
    }
  });

  const disabled6MonthsDate: DatePickerProps['disabledDate'] = (
    current,
    { from }
  ) => {
    if (!from) {
      return false; // If 'from' date is not provided, enable all dates
    }

    // Extract month and year components from the 'from' date
    const baseMonth = from.month();
    const baseYear = from.year();

    // Extract month and year components from the 'current' date
    const currentMonth = current.month();
    const currentYear = current.year();

    // Calculate the difference in months
    const monthDiff =
      (currentYear - baseYear) * 12 + (currentMonth - baseMonth);

    // Allow the date if it is exactly 11 months apart and not the same month
    return (
      monthDiff !== 11 ||
      (currentMonth === baseMonth && currentYear === baseYear)
    );
  };

  const disabledDateAfterCurrent = (current: any) => {
    return current && current > moment().endOf('day');
  };

  const getInitialValues = (data: any) => ({
    email_address: data?.email_address || '',
    entity_Type: data?.entity_Type || '',
    entity_Country: data?.entity_Country || '',
    entity_name: data?.entity_name || '',
    entity_number: data?.entity_number || '',
    date_of_incorporation: data?.date_of_incorporation
      ? formatTargetDate(data?.date_of_incorporation)
      : '',
    entity_address: data?.entity_address || '',
    financial_year: data?.financial_year || '',
    sector: data?.sector || '',
    start_date: data?.start_date || '',
    end_date: data?.end_date || '',
  });

  const initialValues = {
    // email_address: IsFilledData ? filledData?.email_address : "",
    entity_Type: IsFilledData ? filledData?.entity_Type : '',
    entity_Country: IsFilledData ? filledData?.entity_Country : '',
    entity_name: IsFilledData ? filledData?.entity_name : '',
    entity_number: IsFilledData ? filledData?.entity_number : '',
    entity_address: IsFilledData ? filledData?.entity_address : '',
    email_address: IsFilledData ? filledData?.email_address : '',
    financial_year: IsFilledData ? filledData?.financial_year : '',
    sector: IsFilledData ? filledData?.sector : '',
    start_date: IsFilledData ? filledData?.start_date : '',
    end_date: IsFilledData ? filledData?.end_date : '',
    date_of_incorporation:
      IsFilledData && filledData?.date_of_incorporation
        ? dayjs(filledData?.date_of_incorporation, 'YYYY/MM/DD')
        : null,
  };

  const defaultRange: [Dayjs, Dayjs] = [
    dayjs(initialValues?.start_date?.substr(0, 7), 'YYYY-MM'),
    dayjs(initialValues?.end_date?.substr(0, 7), 'YYYY-MM'),
  ];

  const postData = (values: any, resetForm: any) => {
    const updatedValues = {
      ...values,
      date_of_incorporation: formatTargetDate(values?.date_of_incorporation),
    };
    post('/invite/inviteAdmin/', {
      ...updatedValues,
      start_date: values.financial_year[0],
      end_date: values.financial_year[1],
    })
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

  const updateData = (values: any, resetForm: any) => {
    const updatedValues = {
      ...values,
      date_of_incorporation: formatTargetDate(values?.date_of_incorporation),
    };
    put(`/entity/edit_entity/`, { ...updatedValues, entity_Id: user.entity_Id })
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
            resetForm();
            navigate('/settings/onBoard-companies');
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
  return (
    <>
      <div>
        <PageCardComponent className={styles.pageCardStyleSpecial}>
          <p className="pageTitle">
            {user.role !== 'ADMIN'
              ? 'Create Client Profile'
              : 'Manage Company Profile'}
          </p>
          <Row justify="space-between" className="mt-3">
            <Col>
              <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  setIsLoading(true);
                  if (user.role !== 'ADMIN') {
                    postData(values, resetForm);
                  } else {
                    updateData(values, resetForm);
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
                      <Row
                        justify="space-between"
                        gutter={[16, 16]}
                        style={{ alignItems: 'baseline' }}
                      >
                        <>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Company Name*
                                </label>
                                <CustomInput
                                  labelColor="#00338D"
                                  size="large"
                                  name="entity_name"
                                  type="text"
                                  disabled={IsFilledData}
                                  placeholder={
                                    IsFilledData
                                      ? `${filledData?.entity_name}`
                                      : ''
                                  }
                                  errors={errors.entity_name}
                                  touched={touched.entity_name}
                                  value={
                                    IsFilledData
                                      ? `${filledData?.entity_name}`
                                      : values.entity_name
                                  }
                                  hook={handleChange}
                                  status={
                                    (touched.entity_name &&
                                      errors.entity_name &&
                                      'error') ||
                                    ''
                                  }
                                  blur={handleBlur}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Identification Number*
                                </label>
                                <CustomInput
                                  size="large"
                                  name="entity_number"
                                  labelColor="#00338D"
                                  type="text"
                                  disabled={IsFilledData}
                                  placeholder={
                                    IsFilledData
                                      ? `${filledData?.entity_number}`
                                      : ''
                                  }
                                  errors={errors.entity_number}
                                  touched={touched.entity_number}
                                  value={
                                    IsFilledData
                                      ? `${filledData?.entity_number}`
                                      : values.entity_number
                                  }
                                  hook={handleChange}
                                  blur={handleBlur}
                                  status={
                                    (touched.entity_number &&
                                      errors.entity_number &&
                                      'error') ||
                                    ''
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                {/* <CustomInput
                                  labelColor="#00338D"
                                  size="large"
                                  name="sector"
                                  type="text"
                                  placeholder={
                                    IsFilledData ? `${filledData?.sector}` : ''
                                  }
                                  errors={errors.sector}
                                  touched={touched.sector}
                                  value={values.sector}
                                  hook={handleChange}
                                  blur={handleBlur}
                                  status={
                                    (touched.sector &&
                                      errors.sector &&
                                      'error') ||
                                    ''
                                  }
                                /> */}
                                <label className={styles.formlabel}>
                                  Sector
                                </label>
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
                                    disabled={IsFilledData}
                                    placeholder="Select primary activity"
                                    value={values.sector}
                                    onChange={(value) => {
                                      setFieldValue('sector', value);
                                    }}
                                    onBlur={() =>
                                      setFieldTouched('sector', true)
                                    }
                                    getPopupContainer={(trigger) =>
                                      trigger.parentNode
                                    }
                                    status={
                                      (touched.sector &&
                                        errors.sector &&
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

                                  {errors.sector && touched.sector && (
                                    <Typography.Text type="danger">
                                      {typeof errors.sector === 'string'
                                        ? errors.sector
                                        : ''}
                                    </Typography.Text>
                                  )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Select Reporting Period*
                                </label>
                                <Form.Item>
                                  <DatePicker.RangePicker
                                    name="financial_year"
                                    status={
                                      touched.financial_year &&
                                      errors.financial_year
                                        ? 'error'
                                        : ''
                                    }
                                    disabled={user.role === 'ADMIN'}
                                    value={
                                      user.role === 'ADMIN'
                                        ? defaultRange
                                        : values.financial_year
                                    }
                                    suffixIcon={
                                      <CalendarFilled
                                        style={{
                                          color: `#00338D`,
                                          fontSize: '16px',
                                        }}
                                      />
                                    }
                                    picker="month"
                                    format="MMM"
                                    disabledDate={disabled6MonthsDate}
                                    onBlur={() => {
                                      setFieldTouched('financial_year', true);
                                    }}
                                    onChange={(e) => {
                                      setFieldValue(`financial_year`, e);
                                    }}
                                    size="large"
                                    style={{ width: '100%', height: '50px' }}
                                    className={
                                      errors.financial_year &&
                                      touched.financial_year
                                        ? 'ant-picker-error'
                                        : ''
                                    }
                                  />
                                  {errors.financial_year &&
                                    touched.financial_year && (
                                      <Typography.Text type="danger">
                                        {typeof errors.financial_year ===
                                        'string'
                                          ? errors.financial_year
                                          : ''}
                                      </Typography.Text>
                                    )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Select Entity Type
                                </label>
                                <Form.Item>
                                  <Select
                                    className={styles.selectOption}
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
                                    value={values.entity_Type}
                                    onChange={(e: any) => {
                                      setFieldValue('entity_Type', e ? e : '');
                                    }}
                                    onBlur={() =>
                                      setFieldTouched('entity_Type', true)
                                    }
                                    getPopupContainer={(trigger) =>
                                      trigger.parentNode
                                    }
                                    status={
                                      (touched.entity_Type &&
                                        errors.entity_Type &&
                                        'error') ||
                                      ''
                                    }
                                  >
                                    {[
                                      'Legal',
                                      'Private',
                                      'Public',
                                      'Statutory',
                                    ].map((item) => (
                                      <Select.Option key={item} value={item}>
                                        {item}
                                      </Select.Option>
                                    ))}
                                  </Select>

                                  {errors.entity_Type &&
                                    touched.entity_Type && (
                                      <Typography.Text type="danger">
                                        {typeof errors.entity_Type === 'string'
                                          ? errors.entity_Type
                                          : ''}
                                      </Typography.Text>
                                    )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Select Country
                                </label>
                                <Form.Item>
                                  <Select
                                    className={styles.selectOption}
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
                                    value={values.entity_Country}
                                    onChange={(e: any) => {
                                      setFieldValue(
                                        'entity_Country',
                                        e ? e : ''
                                      );
                                    }}
                                    onBlur={() =>
                                      setFieldTouched('entity_Country', true)
                                    }
                                    getPopupContainer={(trigger) =>
                                      trigger.parentNode
                                    }
                                    status={
                                      (touched.entity_Country &&
                                        errors.entity_Country &&
                                        'error') ||
                                      ''
                                    }
                                  >
                                    {countryList.length > 1 ? (
                                      <>
                                        {countryList.map(
                                          (data: any, index: any) => (
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
                                          )
                                        )}
                                      </>
                                    ) : null}
                                  </Select>

                                  {errors.entity_Country &&
                                    touched.entity_Country && (
                                      <Typography.Text type="danger">
                                        {typeof errors.entity_Country ===
                                        'string'
                                          ? errors.entity_Country
                                          : ''}
                                      </Typography.Text>
                                    )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={8} className={styles.inlineInput}>
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Incorporation Date
                                </label>
                                <CustomDatePicker
                                  name="date_of_incorporation"
                                  labelColor="#00338D"
                                  calenderColor="#00338D"
                                  format="DD-MMM-YYYY"
                                  errors={errors.date_of_incorporation}
                                  touched={touched.date_of_incorporation}
                                  value={values.date_of_incorporation}
                                  secondChange={setFieldValue}
                                  blur={() =>
                                    setFieldTouched(
                                      `date_of_incorporation`,
                                      true
                                    )
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
                          <Col
                            span={16}
                            className={`${styles.inlineInput} ${styles.inlineInputTextArea}`}
                          >
                            <Row style={{ width: '100%' }}>
                              <Col span={24}>
                                <label className={styles.formlabel}>
                                  Headquarters Address
                                </label>
                                <Form.Item>
                                  <Input.TextArea
                                    rows={4}
                                    name="entity_address"
                                    value={values.entity_address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    status={
                                      (touched.entity_address &&
                                        errors.entity_address &&
                                        'error') ||
                                      ''
                                    }
                                    style={{ borderRadius: '5px' }}
                                  />
                                  {errors.entity_address &&
                                    touched.entity_address && (
                                      <Typography.Text type="danger">
                                        {typeof errors.entity_address ===
                                        'string'
                                          ? errors.entity_address
                                          : ''}
                                      </Typography.Text>
                                    )}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                        </>
                      </Row>

                      <Row>
                        <Col span={24} className="mb-3">
                          <Typography.Text className={styles.titleText}>
                            Appoint Admin for the Company
                          </Typography.Text>
                        </Col>
                        <Col span={8} className={styles.inlineInput}>
                          <Row style={{ width: '98%' }}>
                            <Col span={24}>
                              <label className={styles.formlabel}>
                                Admin Email Address*
                              </label>
                              <CustomInput
                                labelColor="#00338D"
                                size="large"
                                name="email_address"
                                type="text"
                                disabled={IsFilledData}
                                placeholder={
                                  IsFilledData ? `${user?.email}` : ''
                                }
                                errors={errors.email_address}
                                touched={touched.email_address}
                                value={
                                  IsFilledData
                                    ? `${user?.email}`
                                    : values.email_address
                                }
                                hook={handleChange}
                                status={
                                  (touched.email_address &&
                                    errors.email_address &&
                                    'error') ||
                                  ''
                                }
                                blur={handleBlur}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row justify="end">
                        <ButtonComponent
                          onClick={() => {
                            if (user.role === 'ADMIN') {
                              navigate('/settings/onBoard-companies');
                            } else {
                              navigate('/manage-client/create-profile');
                            }
                          }}
                          hierarchy="tertiary"
                        >
                          Cancel
                        </ButtonComponent>

                        <Form.Item>
                          <ButtonComponent
                            hierarchy="primary"
                            htmlType="submit"
                            className={styles.addc_submit}
                            disabled={!(isValid && dirty)}
                            loading={isLoading}
                          >
                            Submit
                          </ButtonComponent>
                        </Form.Item>
                      </Row>
                    </Form>
                  );
                }}
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
};

export default AddCompany;
