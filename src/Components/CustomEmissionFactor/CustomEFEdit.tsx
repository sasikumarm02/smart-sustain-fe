import { useEffect, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Button,
  Select,
  Input,
  Switch,
  message,
  DatePicker,
} from 'antd';
import { FileExcelFilled, FileWordFilled } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import {
  ButtonComponent,
  InputComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { get, post, put } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { getValuesByKey } from '../Emissions/Scope3/Helpers';
import CustomDownload from '../FileHanddle/customDownload';
import CustomUpload from '../FileHanddle/customUpload';

const { Option } = Select;

const CustomEFEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [radioValue, setRadioValue] = useState(1);
  const [filledData, setFilledData] = useState<any>(location?.state || {});
  const [excelData, setExcelData] = useState<any>([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [activityType, setActivityType] = useState([]);
  const [form] = Form.useForm();
  const [IsFilledData, setIsFilledData] = useState(
    location?.state ? true : false
  );
  const [activityTypeOptions, setActivityTypeOptions] = useState<any>([]);
  const [emissionData, setEmissionData] = useState({});
  const [dropdownData, setDropdownData] = useState([]);
  const [customOptions, setCustomOptions] = useState<any[]>([]);
  const [factorsList, setFactorsList] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [fileName, setFileName] = useState<any>();
  const [loading, setloading] = useState(false);
  const [ExcelUploaded, setExcelUploaded] = useState(false);
  const handleSearch = (value: string) => {
    if (
      value &&
      !factorsList.includes(value) &&
      !customOptions.includes(value)
    ) {
      setCustomOptions([...customOptions, value]);
    }
  };
  useEffect(() => {
    if (
      location?.state &&
      location.state !== undefined &&
      location.state !== null
    ) {
      setIsFilledData(true);
      setFilledData(location.state);
    }
    const emissionValue =
      getValueByKey(dropdownData, initialValues.emission_type) || {};
    const options =
      getValuesByKey(initialValues.activity_type, emissionValue) || [];
    setUomOptions(options);
  }, [location.state]);

  useEffect(() => {
    const emissionValue =
      getValueByKey(dropdownData, initialValues.emission_type) || {};

    const options =
      getValuesByKey(initialValues.activity_type, emissionValue) || [];
    setUomOptions(options);
  }, [dropdownData]);

  const initialValues = {
    custom_ef_name: IsFilledData ? filledData?.custom_ef_name : '',
    emission_type: IsFilledData ? filledData?.emission_type : '',
    emission_factor_per_unit: IsFilledData
      ? filledData?.emission_factor_per_unit
      : '',
    source_of_ef: IsFilledData ? filledData?.source_of_ef : '',
    status: IsFilledData ? filledData?.status : true,
    year: IsFilledData ? dayjs(filledData?.year, 'YYYY/MM/DD') || null : null,
    activity_type: IsFilledData ? filledData?.activity_type : '',
    uom: IsFilledData ? filledData?.uom : '',
    reference_link: IsFilledData ? filledData?.reference_link : '',
  };

  const emissionTypes = Object.keys(dropdownData);

  const RadioWrapper = ({ label }: any) => {
    return (
      <>
        <Col span={24}>
          <ButtonComponent
            hierarchy={radioValue === 1 ? 'primary' : 'secondary'}
            style={{ height: '35px' }}
            icon={<FileWordFilled></FileWordFilled>}
            onClick={(e) => handleClickradio(e)}
          >
            Input Data Entry
          </ButtonComponent>
          <ButtonComponent
            hierarchy={radioValue === 1 ? 'secondary' : 'primary'}
            // disabled={label !== "Stationary Combustion" ? true : false}
            icon={<FileExcelFilled></FileExcelFilled>}
            style={{ marginLeft: '10px', height: '35px' }}
            onClick={(e) => handleClickradio(e)}
          >
            Excel Data Entry
          </ButtonComponent>{' '}
        </Col>
      </>
    );
  };

  const handleClickradio = (e: any) => {
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
    } else {
      setRadioValue(2);
    }
    setExcelUploaded(false);
  };

  const createUpdateUrl = IsFilledData
    ? '/custom_ef_database/custom_emission_factor_data_edit/'
    : '/custom_ef_database/create_custom_ef_DB/';

  const apiMethod = IsFilledData ? put : post;
  const handleFinish = (values: any) => {
    apiMethod(createUpdateUrl, {
      entity_Id: user?.entity_Id,
      ...(IsFilledData
        ? {
            // If IsFilledData is true, send updatedValue as the payload
            updatedValue: [
              {
                id: location.state.id,
                emission_factor_per_unit: parseFloat(
                  values?.emission_factor_per_unit || 0
                ), // Handle possible undefined values
                uom: values?.uom,
                custom_ef_name: values?.custom_ef_name,
                source_of_ef: values?.source_of_ef,
                reference_link: values?.reference_link,
                status: values?.status,
                comment: '',
              },
            ],
          }
        : {
            facility_Id: '',
            custom_ef_name: values?.custom_ef_name,
            year: values?.year,
            emission_type: values?.emission_type,
            activity_type: values?.activity_type,
            emission_factor_per_unit: parseFloat(
              values?.emission_factor_per_unit || 0
            ), // Handle possible undefined values
            uom: values?.uom,
            source_of_ef: values?.source_of_ef,
            reference_link: values?.reference_link,
            status: values?.status,
          }),
    })
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            navigate('/emissionFactorList');
            form.resetFields();
            IsFilledData
              ? message.success('Custom emission factor modified successfully.')
              : message.success(
                  'New custom emission factor added successfully.'
                );
          }
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message);
      })
      .finally(() => {});
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    form
      .validateFields()
      .then((values) => {
        handleFinish(values);
      })
      .catch((errorInfo) => {
        message.error('Please fill in all required fields');
      });
  };

  const handleExcelDataSubmit = () => {
    const payload = {
      entity_Id: user?.entity_Id,
      custom_emission_factor: excelData,
    };

    apiMethod(createUpdateUrl, payload)
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            navigate('/emissionFactorList');
            form.resetFields();
            message.success('New custom emission factor added successfully.');
          }
        } else {
          message.error(res?.message);
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message || 'An error occurred');
      })
      .finally(() => {});
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  useEffect(() => {
    const isDataValid = excelData.every((item: any) => {
      return Object.entries(item).every(([key, value]) => {
        if (key === 'facility_Id' || key === 'reference_link') {
          return true;
        }

        if (
          value === '' ||
          value === null ||
          value === undefined ||
          value === false ||
          value === 0 ||
          Number.isNaN(value)
        ) {
          return false;
        }
        return true;
      });
    });

    setIsSubmitDisabled(!isDataValid);
  }, [excelData]);

  function getKeysFromObjectByKey(obj: any, key: any) {
    if (typeof obj !== 'object' || obj === null) {
      return [];
    }
    if (!(key in obj)) {
      return [];
    }
    const value = obj[key];
    if (typeof value !== 'object' || value === null) {
      return [];
    }
    return Object.keys(value);
  }

  function getValueByKey(obj: any, key: any) {
    if (typeof obj !== 'object' || obj === null) {
      return [];
    }
    if (!(key in obj)) {
      return [];
    }

    return obj[key];
  }

  const getDropdownData = () => {
    get(
      `/Emissions/get_dropdown_options_custom_EF?entity_Id=${user?.entity_Id}`
    )
      .then((res: any) => {
        setDropdownData(res.response.data);
        setFactorsList(res.response.custom_emission_factor_name);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    getDropdownData();
  }, []);

  const handleEmissionTypeChange = (value: any) => {
    form.setFieldsValue({ activity_type: '' });
    form.setFieldsValue({ uom: '' });
    const res = dropdownData;
    setActivityType(value);

    if (emissionTypes.includes(value)) {
      setActivityTypeOptions(getKeysFromObjectByKey(res, value));
      setEmissionData(getValueByKey(res, value));
    } else {
      setActivityTypeOptions([]);
      setEmissionData([]);
    }
  };

  const handleActivityTypeChange = (value: any) => {
    form.setFieldsValue({ uom: '' });
    const options = getValuesByKey(value, emissionData);
    setUomOptions(options);
  };

  return (
    <>
      <PageCardComponent className={styles.pageCardStyle}>
        <Form
          className="w-100 customFactorStyles"
          form={form}
          initialValues={initialValues}
          onFinish={handleFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Row gutter={24}>
            <>
              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>
                      Custom Emission Factor Name
                    </span>
                  }
                  name="custom_ef_name"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the required fields',
                    },
                  ]}
                >
                  <InputComponent
                    disabled={IsFilledData}
                    placeholder=""
                    className={styles.formInput}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>Emission Type</span>
                  }
                  name="emission_type"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the required fields',
                    },
                  ]}
                >
                  <Select
                    disabled={IsFilledData}
                    showSearch
                    placeholder="Select emission type"
                    className={styles.formSelect}
                    onChange={handleEmissionTypeChange}
                  >
                    {emissionTypes.map((item) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>
                      Emission Factor Value
                    </span>
                  }
                  name="emission_factor_per_unit"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the required fields',
                    },
                  ]}
                >
                  <InputComponent
                    placeholder="0,045"
                    className={styles.formInput}
                    type="number"
                    onKeyDown={(event) => {
                      if (['-', 'e', 'E'].includes(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>
                      Source of Emission Factor
                    </span>
                  }
                  name="source_of_ef"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the required fields',
                    },
                  ]}
                >
                  <Input
                    placeholder="Source of Emission Factor"
                    className={styles.formInput}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>Reference Link</span>
                  }
                  name="reference_link"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input placeholder="Add Link " className={styles.formInput} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>Reporting Period</span>
                  }
                  name="year"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[{ required: true, message: 'Please select a year' }]}
                >
                  <DatePicker
                    disabled={IsFilledData}
                    picker="year"
                    placeholder="Select year"
                    className={styles.formInput}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className={styles.labelStyle}>Activity Type</span>
                  }
                  name="activity_type"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the required fields',
                    },
                  ]}
                >
                  <Select
                    disabled={IsFilledData}
                    placeholder="Select activity type"
                    className={styles.formSelect}
                    showSearch
                    onChange={handleActivityTypeChange}
                  >
                    {activityTypeOptions.sort().map((item: any) => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={<span className={styles.labelStyle}>UOM</span>}
                  name="uom"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please fill the required fields',
                    },
                  ]}
                >
                  <Select
                    placeholder="Select unit of measurement"
                    className={styles.formSelect}
                    showSearch
                  >
                    {uomOptions.map((item: any) => (
                      <Option key={item} value={item}>
                        kgCO₂e / {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8} style={{ marginTop: '10px' }}>
                <Form.Item
                  label={<span className={styles.labelStyle}>Status</span>}
                  name="status"
                  className="eFSwitch"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Switch
                    defaultChecked
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Col>
            </>
          </Row>

          <Row gutter={12} justify={'end'}>
            <Col>
              <Form.Item>
                <ButtonComponent
                  hierarchy="secondary"
                  onClick={() => navigate('/emissionFactorList')}
                  className={styles.paddingBtntwo}
                >
                  Back
                </ButtonComponent>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <ButtonComponent
                  htmlType="submit"
                  onClick={handleExcelDataSubmit}
                >
                  {IsFilledData ? 'Update' : 'Save'}
                </ButtonComponent>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </PageCardComponent>
    </>
  );
};

export default CustomEFEdit;
