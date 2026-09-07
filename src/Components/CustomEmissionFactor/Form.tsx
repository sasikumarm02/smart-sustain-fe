import { useEffect, useState } from 'react';
import {
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
import { Formik, Field, FieldArray, Form } from 'formik';
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
import * as Yup from 'yup';

const { Option } = Select;

const CustomEFForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [radioValue, setRadioValue] = useState(1);
  const [filledData, setFilledData] = useState<any>(location?.state || {});
  const [excelData, setExcelData] = useState<any>([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [activityType, setActivityType] = useState([]);

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

  const validationSchema = Yup.object({
    emission_factors: Yup.array().of(
      Yup.object().shape({
        custom_ef_name: Yup.string().required(
          'Custom Emission Factor Name is required'
        ),
        emission_type: Yup.string().required('Emission Type is required'),
        emission_factor_per_unit: Yup.string().required(
          'Emission Factor Value is required'
        ),
        source_of_ef: Yup.string().required(
          'Source of Emission Factor is required'
        ),
        //status: Yup.boolean().required('Status is required'),
        year: Yup.date().required('Year is required'),
        activity_type: Yup.string().required('Activity Type is required'),
        uom: Yup.string().required('UOM is required'),
        // reference_link: Yup.string()
        //   .url('Must be a valid URL')
        //   .required('Reference Link is required'),
      })
    ),
  });

  const initialValues = {
    emission_factors: [
      {
        custom_ef_name: '',
        emission_type: '',
        emission_factor_per_unit: '',
        source_of_ef: '',
        status: true,
        year: null,
        activity_type: '',
        uom: '',
        reference_link: '',
      },
    ],
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

  const handleSubmit = (values: any) => {
    if (!areRequiredFieldsFilled(values.emission_factors)) {
      message.warning('Please fill in the required fields.');

      return;
    }

    apiMethod(createUpdateUrl, {
      entity_Id: user?.entity_Id,
      custom_emission_factor: values.emission_factors,
    })
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            navigate('/emissionFactorList');

            message.success('New custom emission factor added successfully.');
          }
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message);
      })
      .finally(() => {});
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
            //form.resetFields();
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

  const initializeForm = (data: any) => {
    setExcelUploaded(true);
    setloading(true);
    // // Process and update tableData state with response data
    const formattedData = data?.custom_emission_factor?.map(
      (item: any, index: number) => ({
        facility_Id: '',
        custom_ef_name: item?.custom_ef_name,
        year: item?.year,
        emission_type: item?.emission_type,
        activity_type: item?.activity_type,
        emission_factor_per_unit: parseFloat(item?.emission_factor_value || 0), // Handle possible undefined item
        uom: item?.uom,
        source_of_ef: item?.source_of_ef,
        reference_link: item?.reference_link,
        status: true,
      })
    );
    setloading(false);

    setExcelData(formattedData);
  };

  const originalEmissionTabColumns = [
    {
      title: 'Custom Emission Factor Name',
      dataIndex: 'custom_ef_name',
      key: 'custom_ef_name',
      type: 'text',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      type: 'text',
      // render: (text: any) => {
      //   const date = new Date(text);
      //   return <span>{date.getFullYear()}</span>;
      // },
    },
    {
      title: 'Emission Type',
      dataIndex: 'emission_type',
      key: 'emission_type',
      type: 'text',
    },
    {
      title: 'Activity Type',
      dataIndex: 'activity_type',
      key: 'activity_type',
      type: 'text',
    },
    {
      title: 'Emission Factor Value',
      dataIndex: 'emission_factor_per_unit',
      key: 'emission_factor_per_unit',
      type: 'text',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      type: 'text',
      render: (text: any) => {
        return text && !text.includes('kgCO₂e')
          ? `kgCO₂e / ${text}`
          : text || '';
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      type: 'text',
      render: (text: any) => (text ? 'Active' : 'Inactive'),
    },
  ];

  const emissionTabColumns =
    user.role === 'ADMIN'
      ? originalEmissionTabColumns
      : originalEmissionTabColumns.filter((column) => column.key !== 'Action');

  const areRequiredFieldsFilled = (emissionFactors: any[]) => {
    const requiredFields = [
      'custom_ef_name',
      'emission_type',
      'emission_factor_per_unit',
      'source_of_ef',
      'year',
      'activity_type',
      'uom',
    ];

    // Check if any row is missing required fields
    return !emissionFactors.some((row) => {
      return requiredFields.some(
        (field) => !row[field] || row[field] === null || row[field] === ''
      );
    });
  };

  return (
    <>
      <PageCardComponent className={styles.pageCardStyle}>
        <RadioWrapper />
        {radioValue === 1 ? (
          <Formik
            initialValues={initialValues}
            //validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, setFieldValue }) => (
              <Form>
                <FieldArray
                  name="emission_factors"
                  render={(arrayHelpers) => (
                    <>
                      <Row
                        gutter={12}
                        justify="end"
                        style={{ marginBottom: '20px' }}
                      >
                        <Col>
                          <ButtonComponent
                            onClick={() => {
                              if (
                                !areRequiredFieldsFilled(
                                  values.emission_factors
                                )
                              ) {
                                message.warning(
                                  'Please fill in the required fields for all rows before adding another item.'
                                );

                                return;
                              }

                              // Add a new row if all required fields are filled
                              arrayHelpers.push({
                                custom_ef_name: '',
                                emission_type: '',
                                emission_factor_per_unit: '',
                                source_of_ef: '',
                                status: true,
                                year: null,
                                activity_type: '',
                                uom: '',
                                reference_link: '',
                              });
                            }}
                            style={{ marginTop: '10px' }}
                          >
                            Add
                          </ButtonComponent>
                        </Col>
                      </Row>

                      {values.emission_factors.map((factor, index) => (
                        <div key={index}>
                          <Row gutter={24}>
                            <>
                              <Col span={8}>
                                <Field
                                  name={`emission_factors[${index}].custom_ef_name`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24}>
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          Custom Emission Factor Name
                                        </label>
                                        <Input
                                          className={styles.formInput}
                                          {...field}
                                          onBlur={handleBlur}
                                          placeholder="Enter Custom Emission Factor Name"
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        />
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field
                                  name={`emission_factors[${index}].emission_type`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24}>
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          Emission Type
                                        </label>
                                        <Select
                                          {...field}
                                          onChange={(value) => {
                                            setFieldValue(
                                              `emission_factors[${index}].emission_type`,
                                              value
                                            );
                                            setFieldValue(
                                              `emission_factors[${index}].activity_type`,
                                              ''
                                            );
                                            setFieldValue(
                                              `emission_factors[${index}].uom`,
                                              ''
                                            );
                                            const res = dropdownData;
                                            setActivityType(value);
                                            setActivityTypeOptions(
                                              getKeysFromObjectByKey(res, value)
                                            );
                                            setEmissionData(
                                              getValueByKey(res, value)
                                            );
                                          }}
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        >
                                          {emissionTypes.map((type) => (
                                            <Option key={type} value={type}>
                                              {type}
                                            </Option>
                                          ))}
                                        </Select>
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field
                                  name={`emission_factors[${index}].emission_factor_per_unit`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24}>
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          Emission Factor Value
                                        </label>
                                        <Input
                                          className={styles.formInput}
                                          {...field}
                                          onBlur={handleBlur}
                                          type="number"
                                          onKeyDown={(e: any) => {
                                            if (
                                              e.key === 'e' ||
                                              e.key === 'E'
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          placeholder="Enter emission factor"
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        />
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field
                                  name={`emission_factors[${index}].source_of_ef`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24} className="my-2">
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          Source of Emission Factor
                                        </label>
                                        <Input
                                          className={styles.formInput}
                                          {...field}
                                          onBlur={handleBlur}
                                          placeholder="Enter source"
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        />
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field
                                  name={`emission_factors[${index}].reference_link`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24} className="my-2">
                                        <label className={styles.labelStyle}>
                                          Reference Link
                                        </label>
                                        <Input
                                          className={styles.formInput}
                                          a
                                          {...field}
                                          onBlur={handleBlur}
                                          placeholder="Enter reference link"
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        />
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field name={`emission_factors[${index}].year`}>
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24} className="my-2">
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          Reporting Period
                                        </label>
                                        <DatePicker
                                          {...field}
                                          picker="year"
                                          placeholder="Select Reporting Period"
                                          onChange={(date) =>
                                            setFieldValue(
                                              `emission_factors[${index}].year`,
                                              date
                                            )
                                          }
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        />
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field
                                  name={`emission_factors[${index}].activity_type`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24} className="my-2">
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          Activity Type
                                        </label>
                                        <Select
                                          {...field}
                                          onChange={(value) => {
                                            const options = getValuesByKey(
                                              value,
                                              emissionData
                                            );

                                            setUomOptions(options);
                                            setFieldValue(
                                              `emission_factors[${index}].activity_type`,
                                              value
                                            );
                                          }}
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        >
                                          {activityTypeOptions.map(
                                            (activity: any) => (
                                              <Option
                                                key={activity}
                                                value={activity}
                                              >
                                                {activity}
                                              </Option>
                                            )
                                          )}
                                        </Select>
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8}>
                                <Field name={`emission_factors[${index}].uom`}>
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24} className="my-2">
                                        <label className={styles.labelStyle}>
                                          <span style={{ color: 'red' }}>
                                            *
                                          </span>
                                          UOM
                                        </label>
                                        <Select
                                          {...field}
                                          onChange={(value) =>
                                            setFieldValue(
                                              `emission_factors[${index}].uom`,
                                              value
                                            )
                                          }
                                          style={{
                                            width: '100%',
                                            height: '50px',
                                          }}
                                        >
                                          {uomOptions.map((uom: any) => (
                                            <Option key={uom} value={uom}>
                                              {!uom.includes('kgCO₂e')
                                                ? `kgCO₂e /
                                            ${uom}`
                                                : uom}
                                            </Option>
                                          ))}
                                        </Select>
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                              <Col span={8} style={{ marginTop: '15px' }}>
                                <Field
                                  name={`emission_factors[${index}].status`}
                                >
                                  {({ field, meta }: any) => (
                                    <Row>
                                      <Col span={24}>
                                        <Row>
                                          <label className={styles.labelStyle}>
                                            Status
                                          </label>
                                        </Row>
                                        <Row>
                                          <Col
                                            span={24}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              height: '100%',
                                              marginTop: '15px',
                                            }}
                                          >
                                            <Switch
                                              className="eFSwitch"
                                              {...field}
                                              checked={field.value}
                                              onChange={(checked) =>
                                                setFieldValue(
                                                  `emission_factors[${index}].status`,
                                                  checked
                                                )
                                              }
                                              checkedChildren={
                                                <span style={{ color: '#fff' }}>
                                                  Active
                                                </span>
                                              }
                                              unCheckedChildren={
                                                <span style={{ color: '#fff' }}>
                                                  Inactive
                                                </span>
                                              }
                                            />
                                          </Col>
                                        </Row>
                                        {meta.touched && meta.error && (
                                          <div style={{ color: 'red' }}>
                                            {meta.error}
                                          </div>
                                        )}
                                      </Col>
                                    </Row>
                                  )}
                                </Field>
                              </Col>
                            </>
                          </Row>
                          <Row gutter={12} justify="end" className="mb-4">
                            <Col>
                              {values.emission_factors.length > 1 && (
                                <ButtonComponent
                                  onClick={() => arrayHelpers.remove(index)}
                                  hierarchy="secondary"
                                  style={{ marginTop: '10px' }}
                                >
                                  Remove
                                </ButtonComponent>
                              )}
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </>
                  )}
                />

                <div style={{ marginTop: '20px', float: 'right' }}>
                  <ButtonComponent
                    hierarchy="secondary"
                    onClick={() => navigate('/emissionFactorList')}
                    className={styles.paddingBtntwo}
                  >
                    Back
                  </ButtonComponent>
                  <ButtonComponent htmlType="submit">Submit</ButtonComponent>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            {!ExcelUploaded ? (
              <>
                <Col span={24}>
                  <p
                    style={{
                      textAlign: 'center',
                      fontWeight: 'normal',
                      fontSize: '20px',
                    }}
                  >
                    Download the template file and fill up the user details in
                    the given format{' '}
                  </p>
                </Col>
                <Col span={24}>
                  <CustomDownload type="Custom_EF" />
                </Col>
                <Col span={24} className="mt-4">
                  <CustomUpload
                    loading={loading}
                    emission_type="Custom Emissoin Factor"
                    setFileName={setFileName}
                    initializeForm={initializeForm}
                  ></CustomUpload>
                </Col>
              </>
            ) : (
              <>
                <Col className="mt-4">
                  <TableComponent
                    isRowExpand={false}
                    data={excelData}
                    enableRowSelection={false}
                    columnHeader={emissionTabColumns}
                    showOnlyCount={false}
                    columnCheckBoxDataAttribute="key"
                  />
                </Col>

                <Col className="mt-4 float-right">
                  <ButtonComponent
                    onClick={handleExcelDataSubmit}
                    disabled={isSubmitDisabled}
                  >
                    Submit
                  </ButtonComponent>
                </Col>
              </>
            )}
          </>
        )}
      </PageCardComponent>
    </>
  );
};

export default CustomEFForm;
