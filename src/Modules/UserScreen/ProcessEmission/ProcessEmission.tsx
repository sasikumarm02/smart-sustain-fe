import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Form,
  Tabs,
  Button,
  Select,
  message,
  Upload,
  Input,
} from 'antd';
import Styles from './processEmission.module.scss';
import * as Yup from 'yup';
import { FieldArray, Formik } from 'formik';
import type { TabsProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomUpload from '../../../Components/FileHanddle/customUpload';
import CustomDownload from '../../../Components/FileHanddle/customDownload';
import CustomForm, {
  transformFugitiveData,
  transformMobileData,
} from '../../../Components/TabForms/CustomForm';
import ScopeTwoForm from './ScopeTwoForm';
import {
  UploadOutlined,
  FileExcelFilled,
  FileWordFilled,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

import FormFooter from '../../../Utils/FormFooter';
import { apiBaseUrl, post } from '../../../Services';
import { DataEntryStationary } from './DataEntrySatitonary';
import { useSelector } from 'react-redux';
import { setSelectedEmissionTab } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../Hooks/useAuth';
import { useNotification } from '../../../Hooks/useNotification';
import moment from 'moment';
import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import {
  getMonthsInFinancialYear,
  MonthlyDataSchema,
} from '../../../Components/TabForms/StationaryForm';
import CloudIcon from '../../../assets/Svg/Emissions/uploadColud';
import File from '../../../assets/Svg/Emissions/fileImg';
import { removeElementByValue } from '../../../Components/Emissions/Scope3/Helpers';
import { isEmpty } from '../../../Utils/isEmpty';
import Cancel from '../../../assets/Svg/Emissions/Cancel';

function getAllMonthsForCurrentYear(startingMonth: string) {
  const currentYear = moment().year();
  const months = [];
  const startMonthIndex = moment().month(startingMonth).month();

  for (let month = startMonthIndex; month < 12; month++) {
    const date = moment({ year: currentYear, month: month });
    months.push(date.format('MMM-YY'));
  }

  for (let month = 0; month < startMonthIndex; month++) {
    const date = moment({ year: currentYear + 1, month: month });
    months.push(date.format('MMM-YY'));
  }

  return months;
}

function ProcessEmission() {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.state - 1);
  const { user } = useAuth();
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const [dateValue, setDateValue] = useState('month');

  const [detailInfo, setDetailInfo] = useState<any>({
    date: null,
    entity: '',
    facility: '',
  });

  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: { Authorization: `Bearer ${user.token}` },
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const DataEntryMobile = ({ type }: { type: string }) => {
    const [fileLists, setFileLists] = useState<any>({});
    const [initalFormValues, setInitialFormValues] = useState<any>([]);
    const [ExcelUploaded, setExcelUploaded] = useState(false);
    const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
    const [fileName, setFileName] = useState<any>();
    const [filesList, setFilesList] = useState<any>({});
    const [fileNames, setFileNames] = useState<any>({});
    const [isupload, setIsUpload] = useState(true);

    const monthsForCurrentYear = getMonthsInFinancialYear(
      userLogged?.financial_year
    );
    const [formValues, setFormValues] = useState<any>(initalFormValues);
    const [isDisable, setIsDisable] = useState(true);
    const [prefilled, setPrefilled] = useState<any>([]);
    useEffect(() => {
      const allDisclosuresPresent = formValues.every(
        (item: any, index: any) => item.disclosure && item.disclosure.length > 0
      );
      setInitialFormValues(initalFormValues);
      setIsDisable(!allDisclosuresPresent);
    }, [formValues, initalFormValues]);

    const FormFooter = ({
      isValid,
      dirty,
      resetForm,
    }: {
      isValid: boolean;
      dirty: boolean;
      resetForm: any;
    }) => {
      return (
        <Row justify="end">
          <Form.Item>
            <Row gutter={14}>
              <Col className={Styles.customPaddingRight}>
                <ButtonComponent
                  hierarchy="secondary-gray"
                  htmlType="reset"
                  onClick={() => {
                    navigate('/environment/emissions', { state: activeKey });
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Col>{' '}
              {/* <Col>
                <ButtonComponent
                  hierarchy="secondary"
                  htmlType="reset"
                  onClick={() => {
                    resetForm();
                    setInitialFormValues([
                      {
                        fuel: '',
                        UOM: '',
                        vehicleType: '',
                        disclosure: [],
                        list_of_files: [],
                        monthlyData: monthsForCurrentYear.reduce(
                          (acc: any, month: any) => {
                            acc[month] = { quantity: '' };
                            return acc;
                          },
                          {}
                        ),
                      },
                    ]);
                    setPrefilled([
                      {
                        vehicleType: '',
                        fuel: '',
                        UOM: '',
                        disclosure: [],
                        list_of_files: [],
                        monthlyData: monthsForCurrentYear.reduce(
                          (acc: any, month: any) => {
                            acc[month] = { quantity: '', disclosure: null };
                            return acc;
                          },
                          {}
                        ),
                      },
                    ]);
                    setFileLists({});
                    setFileNames({});
                    setFilesList({});
                  }}
                  className="form_reset"
                >
                  Reset
                </ButtonComponent>
              </Col>{' '} */}
              <Col>
                {' '}
                <ButtonComponent
                  hierarchy="primary"
                  htmlType="submit"
                  className="form_submit"
                  disabled={!isValid || isDisable}
                >
                  Submit
                </ButtonComponent>
              </Col>
            </Row>
          </Form.Item>
        </Row>
      );
    };

    const handleOnChangeMobile = (
      info: any,
      index: any,
      setFieldValue: any,
      values: any
    ) => {
      const updatedValues = [...values];
      if (info.file.status === 'done') {
        const FileName = info.file.name;
        const UID =
          info.file.response?.response?.data ||
          Math.floor(Math.random() * 100 + 1);

        if (!updatedValues[index].disclosure) {
          updatedValues[index].disclosure = [];
          updatedValues[index].list_of_files = [];
        }
        updatedValues[index].disclosure.push(UID);
        updatedValues[index].list_of_files.push(FileName);
        setFormValues(updatedValues);
        setFieldValue(
          `mobile[${index}].disclosure`,
          updatedValues[index].disclosure
        );
        setFileNames({
          ...fileNames,
          [index]: updatedValues[index].list_of_files,
        });
        setFilesList({
          ...filesList,
          [index]: updatedValues[index].disclosure,
        });
        const fileExists = Object.values(fileLists as any).some(
          (fileList: any) => Object.values(fileList).includes(FileName)
        );
        if (fileExists) {
          message.error(
            `${FileName} file name already exists. Please use a different file.`
          );
          return;
        }
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    useEffect(() => {
      const allDisclosuresPresent = formValues.every(
        (item: any, index: any) => item.disclosure && item.disclosure.length > 0
      );

      setIsDisable(!allDisclosuresPresent);
    }, [formValues, initalFormValues]);

    interface response {
      entity_Id: string;
      mobile_data: MobileDatum[];
    }

    interface MobileDatum {
      fuel: string;
      UOM: string;
      vehicleType: String;
      monthlyData: MonthlyDatum[];
    }

    interface MonthlyDatum {
      month: string;
      disclosure: string;
      quantity: number | string;
    }

    function initializeForm(response: response) {
      const monthMapping: { [key in string]: string } =
        monthsForCurrentYear.reduce(
          (acc, month, index) => {
            const monthKey = `M${index + 1}`;
            acc[monthKey] = month;
            return acc;
          },
          {} as { [key in string]: string }
        );

      const { mobile_data } = response;
      const data = mobile_data.map((item) => {
        return {
          fuel: item.fuel,
          UOM: item.UOM,
          vehicleType: item.vehicleType,
          disclosure: [],
          list_of_files: [],
          monthlyData: item.monthlyData.reduce((acc: any, current) => {
            acc[monthMapping[current.month.toUpperCase() as string] as string] =
              {
                quantity: current.quantity || '',
              };
            return acc;
          }, {}),
        };
      });
      setInitialFormValues(data);
      setPrefilled(data);
      setFormValues(data);
      if (data.length > 0) {
        setExcelUploaded(true);
      } else {
        setExcelUploaded(false);
      }

      setloading(false);
    }

    const [loading, setloading] = useState(false);

    const handleRemove = (
      UIDToRemove: any,
      index: any,
      setFieldValue: any,
      fileName: any
    ) => {
      const updatedValues = [...initalFormValues];

      if (updatedValues[index].disclosure && UIDToRemove) {
        removeElementByValue(updatedValues[index].disclosure, UIDToRemove);
      }

      if (updatedValues[index].list_of_files && fileName) {
        removeElementByValue(updatedValues[index].list_of_files, fileName);
      }

      setFieldValue(
        `mobile[${index}].disclosure`,
        updatedValues[index].disclosure
      );
      setInitialFormValues(updatedValues);
      setFormValues(updatedValues);

      message.success(`File removed successfully.`);

      if (updatedValues[index].disclosure.length === 0) {
        setIsDisable(true);
      }
    };

    return (
      <>
        <Row gutter={10} className="mt-4">
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
                  Download the template file and fill up the user details in the
                  given format{' '}
                </p>
              </Col>
              <Col span={24}>
                <CustomDownload type={type} />
              </Col>
            </>
          ) : (
            <></>
          )}
          <Col span={24}>
            {ExcelUploaded ? (
              <Formik
                initialValues={{
                  entity_Id: '',
                  mobile: initalFormValues,
                }}
                validationSchema={Yup.object().shape({
                  mobile: Yup.array().of(
                    Yup.object()
                      .shape({
                        fuel: Yup.string().required('Fuel type is required'),
                        UOM: Yup.string().required('UOM is required'),
                        vehicleType: Yup.string().required(
                          'Vehicle type is required'
                        ),

                        monthlyData: Yup.object().shape(
                          monthsForCurrentYear.reduce(
                            (acc: any, month: any) => {
                              acc[month] = MonthlyDataSchema;
                              return acc;
                            },
                            {}
                          )
                        ),
                      })
                      .test(
                        'at-least-one-quantity',
                        'At least one monthlyData entry must have a valid quantity present',
                        (value) => {
                          const monthlyData = value.monthlyData || {};
                          return Object.values(monthlyData).some((entry) => {
                            return entry.quantity;
                          });
                        }
                      )
                  ),
                })}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  const data = transformMobileData(values?.mobile);
                  setSubmitting(true);
                  post('/Emissions/create_mobile_combustion/', {
                    entity_Id: user.entity_Id,
                    facility_Id: facilitySelected,
                    mobile_data: data.mobile_data,
                  })
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res?.message}`,
                            type: 'success',
                          });
                          resetForm();
                          setSubmitting(false);
                          navigate('/environment/emissions', {
                            state: activeKey,
                          });
                        }
                      }
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      openToast({
                        content: `${err?.message}`,
                        type: 'error',
                      });
                    })
                    .finally(() => setSubmitting(false));
                }}
                enableReinitialize
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
                }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <div className={Styles.formFooter}>
                      <FieldArray name="mobile">
                        {(arrayHelpers) => (
                          <>
                            {values?.mobile?.map(
                              (items: any, index: number) => (
                                <div key={index}>
                                  {index === 0 && (
                                    <Row key={index}>
                                      {['Vehicle Type', 'Fuel Type', 'UOM'].map(
                                        (data: string, index: number) => (
                                          <Col
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            sm={24}
                                            key={index}
                                          >
                                            <div className="emission-form-label">
                                              {data}
                                            </div>
                                          </Col>
                                        )
                                      )}
                                    </Row>
                                  )}

                                  <Row
                                    className="form-grid"
                                    align="middle"
                                    gutter={12}
                                    key={index}
                                  >
                                    <Col xl={4} lg={4} md={12} sm={24}>
                                      <Select
                                        showSearch
                                        placeholder="Select Vehicle Type"
                                        disabled={true}
                                        value={
                                          values.mobile[index]?.vehicleType
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `mobile.${index}.vehicleType`,
                                            value
                                          )
                                        }
                                        style={{
                                          height: '40px',
                                          width: '100%',
                                        }}
                                        className="emission-select"
                                      />
                                    </Col>
                                    <Col xl={4} lg={4} md={12} sm={24}>
                                      <Select
                                        showSearch
                                        placeholder="Select Fuel Type"
                                        disabled={true}
                                        value={values.mobile[index]?.fuel}
                                        onChange={(value) =>
                                          setFieldValue(
                                            `mobile.${index}.fuel`,
                                            value
                                          )
                                        }
                                        style={{
                                          height: '40px',
                                          width: '100%',
                                        }}
                                        className="emission-select"
                                      />
                                    </Col>

                                    <Col xl={4} lg={4} md={12} sm={24}>
                                      <Select
                                        showSearch
                                        placeholder="UOM"
                                        disabled={true}
                                        value={values.mobile[index]?.UOM}
                                        onChange={(value) =>
                                          setFieldValue(
                                            `mobile.${index}.UOM`,
                                            value
                                          )
                                        }
                                        style={{
                                          height: '40px',
                                          // marginTop: "10px"
                                          width: '100%',
                                        }}
                                        className="emission-select"
                                      />
                                    </Col>
                                    <Col xl={2} lg={2} md={2} sm={2}></Col>
                                  </Row>

                                  <Row
                                    style={{
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                    }}
                                    className="form-grid"
                                    gutter={[8, 30]}
                                  >
                                    {monthsForCurrentYear.map((month, idx) => {
                                      return idx === 0 ? (
                                        <Col style={{ fontFamily: '' }}>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            Month :{' '}
                                          </Row>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            Quantity :
                                          </Row>
                                          <p className={Styles.hiddenText}>
                                            {'..'}
                                          </p>
                                        </Col>
                                      ) : (
                                        <Col>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            {monthsForCurrentYear[idx - 1]}
                                          </Row>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            <Input
                                              onKeyDown={(e) => {
                                                if (
                                                  e.key === '-' ||
                                                  e.key === 'e'
                                                ) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              value={
                                                values.mobile[index]
                                                  ?.monthlyData[
                                                  monthsForCurrentYear[idx - 1]
                                                ]?.quantity
                                              }
                                              disabled={
                                                prefilled.length > 0 &&
                                                prefilled[index]?.monthlyData[
                                                  monthsForCurrentYear[idx - 1]
                                                ]?.quantity > 0
                                                  ? prefilled[index]
                                                      ?.monthlyData[
                                                      monthsForCurrentYear[
                                                        idx - 1
                                                      ]
                                                    ]?.quantity
                                                  : false
                                              }
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `mobile.${index}.monthlyData.${
                                                    monthsForCurrentYear[
                                                      idx - 1
                                                    ]
                                                  }.quantity`,
                                                  e.target.value
                                                )
                                              }
                                              placeholder="10000"
                                              style={{ width: '80px' }}
                                            ></Input>
                                          </Row>
                                          {values.mobile[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ]?.quantity ? (
                                            <p
                                              className={
                                                Styles.uploadedFileName1
                                              }
                                            >
                                              {fileName
                                                ? fileName.substr(0, 10) + '..'
                                                : ''}
                                            </p>
                                          ) : (
                                            <p
                                              className={
                                                Styles.uploadedFileName2
                                              }
                                            >
                                              {'.'}
                                            </p>
                                          )}
                                        </Col>
                                      );
                                    })}

                                    {
                                      <Col>
                                        <Row
                                          className="emission-form-label"
                                          style={{ marginTop: '20px' }}
                                        >
                                          {
                                            monthsForCurrentYear[
                                              monthsForCurrentYear.length - 1
                                            ]
                                          }
                                        </Row>
                                        <Row
                                          className="emission-form-label"
                                          style={{ marginTop: '20px' }}
                                        >
                                          <Input
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === '-' ||
                                                e.key === 'e'
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            value={
                                              values.mobile[index]?.monthlyData[
                                                monthsForCurrentYear[
                                                  monthsForCurrentYear.length -
                                                    1
                                                ]
                                              ]?.quantity
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `mobile.${index}.monthlyData.${
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                }.quantity`,
                                                e.target.value
                                              )
                                            }
                                            placeholder="10000"
                                            style={{ width: '80px' }}
                                          ></Input>
                                        </Row>
                                        {values.mobile[index]?.monthlyData[
                                          monthsForCurrentYear[
                                            monthsForCurrentYear.length - 1
                                          ]
                                        ]?.quantity ? (
                                          <p
                                            className={Styles.uploadedFileName1}
                                          >
                                            {fileName
                                              ? fileName.substr(0, 10) + '..'
                                              : ''}
                                          </p>
                                        ) : (
                                          <p
                                            className={Styles.uploadedFileName2}
                                          >
                                            {'.'}
                                          </p>
                                        )}
                                      </Col>
                                    }
                                  </Row>
                                  <Row
                                    className="emission-form-label"
                                    style={{ marginTop: '25px' }}
                                  >
                                    <Col> Attachments :</Col>
                                    <Col className="mx-2">
                                      <Form.Item>
                                        <div className={Styles.uploadWrap}>
                                          <Upload
                                            className={` scope-form-upload`}
                                            beforeUpload={(file) => {
                                              const maxSize = 2.5 * 1024 * 1024;
                                              if (file.size > maxSize) {
                                                message.warning(
                                                  'File size must be less than 2.5MB.'
                                                );
                                                return false;
                                              }
                                              return true;
                                            }}
                                            onChange={(info) => {
                                              handleOnChangeMobile(
                                                info,
                                                index,
                                                setFieldValue,
                                                values.mobile
                                              );
                                            }}
                                            showUploadList={false}
                                            name="uploaded_file"
                                            action={`${apiBaseUrl}/file/file_upload_view/`}
                                            headers={{
                                              Authorization: `Bearer ${user.token}`,
                                            }}
                                            style={{ pointerEvents: 'none' }}
                                          >
                                            <Row>
                                              <Col span={24}>
                                                {' '}
                                                <p className={Styles.uploadBtn}>
                                                  <CloudIcon />
                                                  <span>
                                                    Click or drag file to this
                                                    area to upload
                                                  </span>
                                                </p>
                                              </Col>
                                            </Row>
                                          </Upload>
                                          <Row>
                                            <Col>
                                              {fileNames &&
                                                !isEmpty(fileNames[index]) &&
                                                fileNames[index].map(
                                                  (item: any, idx: any) => (
                                                    <>
                                                      <span>
                                                        <File />
                                                      </span>
                                                      <span className="m-2">
                                                        {item}
                                                      </span>
                                                      <span
                                                        className={
                                                          Styles.cancel
                                                        }
                                                        onClick={() => {
                                                          let innerArray =
                                                            filesList[index];
                                                          let secondElement =
                                                            innerArray[idx];

                                                          handleRemove(
                                                            secondElement,
                                                            index,
                                                            setFieldValue,
                                                            item
                                                          );
                                                        }}
                                                      >
                                                        <Cancel />
                                                      </span>
                                                    </>
                                                  )
                                                )}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <hr style={{ marginTop: '10vh' }}></hr>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </FieldArray>
                    </div>
                    <FormFooter
                      resetForm={resetForm}
                      isValid={isValid}
                      dirty={dirty}
                    />
                  </Form>
                )}
              </Formik>
            ) : (
              <CustomUpload
                setloading={setloading}
                loading={loading}
                emission_type="Mobile Combustion"
                setExcelUploaded={setExcelUploaded}
                initializeForm={initializeForm}
                setFileName={setFileName}
              />
            )}
          </Col>
        </Row>
      </>
    );
  };

  const DataEntryProcess = ({ type }: { type: string }) => {
    const [fileLists, setFileLists] = useState<any>({});
    const [initalFormValues, setInitialFormValues] = useState<any>([]);
    const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
    const [fileName, setFileName] = useState<any>();
    const monthsForCurrentYear = getMonthsInFinancialYear(
      userLogged?.financial_year
    );

    const [fileNames, setFileNames] = useState<any>({});
    const [isDisable, setIsDisable] = useState(true);
    const [formValues, setFormValues] = useState<any>([]);
    const [prefilled, setPrefilled] = useState<any>([]);
    const FormFooter = ({
      isValid,
      dirty,
      resetForm,
    }: {
      isValid: boolean;
      dirty: boolean;
      resetForm: any;
    }) => {
      return (
        <Row justify="end">
          <Form.Item>
            <Row gutter={14}>
              <Col className={Styles.customPaddingRight}>
                <ButtonComponent
                  hierarchy="secondary-gray"
                  onClick={() => {
                    navigate('/environment/emissions', {
                      state: activeKey,
                    });
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Col>{' '}
              {/* <Col>
                <ButtonComponent
                  hierarchy="secondary"
                  htmlType="reset"
                  onClick={(e) => {
                    e?.preventDefault();
                    resetForm();
                    setInitialFormValues([
                      {
                        gas_or_refrigerant: '',
                        UOM: '',
                        equipmentType: '',
                        monthlyData: monthsForCurrentYear.reduce(
                          (acc: any, month: any) => {
                            acc[month] = { quantity: '' };
                            return acc;
                          },
                          {}
                        ),
                      },
                    ]);
                    setPrefilled([
                      {
                        gas_or_refrigerant: '',
                        UOM: '',
                        equipmentType: '',
                        monthlyData: monthsForCurrentYear.reduce(
                          (acc: any, month: any) => {
                            acc[month] = { quantity: '' };
                            return acc;
                          },
                          {}
                        ),
                      },
                    ]);
                    setFileLists({});
                    setFileNames({});
                    setFilesList({});
                  }}
                  className="form_reset"
                >
                  Reset
                </ButtonComponent>
              </Col>{' '} */}
              <Col>
                {' '}
                <ButtonComponent
                  hierarchy="primary"
                  htmlType="submit"
                  className="form_submit"
                  disabled={!isValid || isDisable}
                >
                  Submit
                </ButtonComponent>
              </Col>
            </Row>
          </Form.Item>
        </Row>
      );
    };
    const handleOnChangeProcess = (
      info: any,
      index: any,
      setFieldValue: any,
      values: any
    ) => {
      const updatedValues = [...values];

      if (info.file.status === 'done') {
        const FileName = info.file.name;
        const UID =
          info.file.response?.response?.data ||
          Math.floor(Math.random() * 100 + 1);

        if (!updatedValues[index].disclosure) {
          updatedValues[index].disclosure = [];
          updatedValues[index].list_of_files = [];
        }

        updatedValues[index].disclosure.push(UID);
        updatedValues[index].list_of_files.push(FileName);
        setFormValues(updatedValues);

        setFieldValue(
          `process[${index}].disclosure`,
          updatedValues[index].disclosure
        );

        setFileNames({
          ...fileNames,
          [index]: updatedValues[index].list_of_files,
        });
        setFilesList({
          ...filesList,
          [index]: updatedValues[index].disclosure,
        });

        // Check if the file name already exists in the file lists
        const fileExists = Object.values(fileLists as any).some(
          (fileList: any) => Object.values(fileList).includes(FileName)
        );

        if (fileExists) {
          message.error(
            `${FileName} file name already exists. Please use a different file.`
          );
          return;
        }

        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    const [ExcelUploaded, setExcelUploaded] = useState(false);

    interface response {
      entity_Id: string;
      process_data: ProcessDatum[];
    }

    interface ProcessDatum {
      gas_or_refrigerant: string;
      UOM: string;
      equipmentType: string;
      monthlyData: MonthlyDatum[];
    }

    interface MonthlyDatum {
      month: string;
      disclosure: string;
      quantity: number | string;
    }
    const [filesList, setFilesList] = useState<any>({});
    function initializeForm(response: response) {
      const { process_data } = response;

      const monthMapping: { [key in string]: string } =
        monthsForCurrentYear.reduce(
          (acc, month, index) => {
            const monthKey = `M${index + 1}`;
            acc[monthKey] = month;
            return acc;
          },
          {} as { [key in string]: string }
        );
      const data = process_data.map((item) => {
        return {
          gas_or_refrigerant: item.gas_or_refrigerant,
          UOM: item.UOM,
          equipmentType: item.equipmentType,
          monthlyData: item.monthlyData.reduce((acc: any, current) => {
            acc[monthMapping[current.month.toUpperCase() as string] as string] =
              {
                quantity: current.quantity || '',
              };
            return acc;
          }, {}),
        };
      });

      setInitialFormValues(data);
      setPrefilled(data);
      setExcelUploaded(true);
    }
    useEffect(() => {
      const allDisclosuresPresent = initalFormValues.every(
        (item: any) => item.disclosure && item.disclosure.length > 0
      );

      setIsDisable(!allDisclosuresPresent);
    }, [formValues, initalFormValues]);
    const handleRemove = (
      UIDToRemove: any,
      index: any,
      setFieldValue: any,
      fileName: any
    ) => {
      const updatedValues = [...initalFormValues];

      if (updatedValues[index].disclosure && UIDToRemove) {
        removeElementByValue(updatedValues[index].disclosure, UIDToRemove);
      }

      if (updatedValues[index].list_of_files && fileName) {
        removeElementByValue(updatedValues[index].list_of_files, fileName);
      }

      setFieldValue(
        `process[${index}].disclosure`,
        updatedValues[index].disclosure
      );
      setInitialFormValues(updatedValues);
      setFormValues(updatedValues);

      message.success(`File removed successfully.`);

      if (updatedValues[index].disclosure.length === 0) {
        setIsDisable(true);
      }
    };

    const [loading, setloading] = useState(false);

    return (
      <>
        <Row gutter={10} className="mt-4">
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
                  Download the template file and fill up the user details in the
                  given format{' '}
                </p>
              </Col>
              <Col span={24}>
                <CustomDownload type={type} />
              </Col>
            </>
          ) : (
            <></>
          )}
          <Col span={24}>
            {ExcelUploaded ? (
              <Formik
                initialValues={{
                  entity_Id: user.entity_Id,
                  process: initalFormValues,
                }}
                validationSchema={Yup.object().shape({
                  process: Yup.array().of(
                    Yup.object()
                      .shape({
                        gas_or_refrigerant: Yup.string().required(
                          'refrigerant is required'
                        ),
                        UOM: Yup.string().required('UOM is required'),
                        equipmentType: Yup.string()
                          .trim('cannot include leading and trailing spaces')
                          .strict(true)
                          .required('equipment_type is required'),

                        monthlyData: Yup.object().shape(
                          monthsForCurrentYear.reduce(
                            (acc: any, month: any) => {
                              acc[month] = MonthlyDataSchema;
                              return acc;
                            },
                            {}
                          )
                        ),
                      })
                      .test(
                        'at-least-one-quantity',
                        'At least one monthlyData entry must have a valid quantity present',
                        (value) => {
                          const monthlyData = value.monthlyData || {};
                          return Object.values(monthlyData).some((entry) => {
                            return entry.quantity;
                          });
                        }
                      )
                  ),
                })}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  const data = transformFugitiveData(values.process);
                  setSubmitting(true);
                  post('/Emissions/create_process_emission/', {
                    entity_Id: user.entity_Id,
                    facility_Id: facilitySelected,
                    process_data: data.fugitive_data,
                  })
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res?.message}`,
                            type: 'success',
                          });
                          resetForm();
                          setSubmitting(false);
                          navigate('/environment/emissions', {
                            state: activeKey,
                          });
                        }
                      }
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      openToast({
                        content: `${err?.message}`,
                        type: 'error',
                      });
                    })
                    .finally(() => setSubmitting(false));
                }}
                enableReinitialize
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
                }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <div className={Styles.formFooter}>
                      <FieldArray name="process">
                        {(arrayHelpers) => (
                          <>
                            {values?.process.length > 0 &&
                              values?.process?.map(
                                (items: any, index: number) => (
                                  <div key={index}>
                                    {index === 0 && (
                                      <Row key={index}>
                                        {[
                                          'Equipment Type ',
                                          'Gas/Refrigerant',
                                          'UOM',
                                        ].map((data: string, index: number) => (
                                          <Col
                                            xl={4}
                                            lg={4}
                                            md={12}
                                            sm={24}
                                            key={index}
                                          >
                                            <div className="emission-form-label">
                                              {data}
                                            </div>
                                          </Col>
                                        ))}
                                      </Row>
                                    )}

                                    <Row
                                      className="form-grid"
                                      align="middle"
                                      gutter={12}
                                      key={index}
                                    >
                                      <Col xl={4} lg={4} md={12} sm={24}>
                                        <Select
                                          showSearch
                                          placeholder=""
                                          disabled={true}
                                          value={
                                            values.process[index]?.equipmentType
                                          }
                                          onChange={(value) =>
                                            setFieldValue(
                                              `process.${index}.equipmentType`,
                                              value
                                            )
                                          }
                                          style={{
                                            height: '40px',
                                            marginTop: '10px',
                                            width: '100%',
                                          }}
                                          className="emission-select"
                                        />
                                      </Col>

                                      <Col xl={4} lg={4} md={12} sm={24}>
                                        <Select
                                          showSearch
                                          placeholder=""
                                          disabled={true}
                                          value={
                                            values.process[index]
                                              ?.gas_or_refrigerant
                                          }
                                          onChange={(value) =>
                                            setFieldValue(
                                              `process.${index}.gas_or_refrigerant`,
                                              value
                                            )
                                          }
                                          style={{
                                            height: '40px',
                                            marginTop: '10px',
                                            width: '100%',
                                          }}
                                          className="emission-select"
                                        />
                                      </Col>

                                      <Col xl={4} lg={4} md={12} sm={24}>
                                        <Select
                                          placeholder=""
                                          disabled={true}
                                          value={values.process[index]?.UOM}
                                          onChange={(value) =>
                                            setFieldValue(
                                              `process.${index}.UOM`,
                                              value
                                            )
                                          }
                                          style={{
                                            height: '40px',
                                            marginTop: '10px',
                                            // marginLeft: "50px",
                                            width: '100%',
                                          }}
                                          className="emission-select"
                                        />
                                      </Col>
                                      <Col xl={2} lg={2} md={2} sm={2}></Col>
                                    </Row>

                                    <Row
                                      style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                      }}
                                      className="form-grid"
                                      gutter={[8, 30]}
                                    >
                                      {monthsForCurrentYear.map(
                                        (month, idx) => {
                                          return idx === 0 ? (
                                            <Col style={{ fontFamily: '' }}>
                                              <Row
                                                className="emission-form-label"
                                                style={{ marginTop: '20px' }}
                                              >
                                                Month :{' '}
                                              </Row>
                                              <Row
                                                className="emission-form-label"
                                                style={{ marginTop: '20px' }}
                                              >
                                                Quantity :
                                              </Row>
                                              <p className={Styles.hiddenText}>
                                                {'..'}
                                              </p>
                                            </Col>
                                          ) : (
                                            <Col>
                                              <Row
                                                className="emission-form-label"
                                                style={{ marginTop: '20px' }}
                                              >
                                                {monthsForCurrentYear[idx - 1]}
                                              </Row>
                                              <Row
                                                className="emission-form-label"
                                                style={{ marginTop: '20px' }}
                                              >
                                                <Input
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.key === '-' ||
                                                      e.key === 'e'
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                  value={
                                                    values.process[index]
                                                      ?.monthlyData[
                                                      monthsForCurrentYear[
                                                        idx - 1
                                                      ]
                                                    ]?.quantity
                                                  }
                                                  disabled={
                                                    prefilled.length > 0 &&
                                                    prefilled[index]
                                                      ?.monthlyData[
                                                      monthsForCurrentYear[
                                                        idx - 1
                                                      ]
                                                    ]?.quantity > 0
                                                      ? prefilled[index]
                                                          ?.monthlyData[
                                                          monthsForCurrentYear[
                                                            idx - 1
                                                          ]
                                                        ]?.quantity
                                                      : false
                                                  }
                                                  onChange={(e) =>
                                                    setFieldValue(
                                                      `process.${index}.monthlyData.${
                                                        monthsForCurrentYear[
                                                          idx - 1
                                                        ]
                                                      }.quantity`,
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="10000"
                                                  style={{ width: '80px' }}
                                                ></Input>
                                              </Row>
                                              {values.process[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity ? (
                                                <p
                                                  className={
                                                    Styles.uploadedFileName1
                                                  }
                                                >
                                                  {fileName
                                                    ? fileName.substr(0, 10) +
                                                      '..'
                                                    : ''}
                                                </p>
                                              ) : (
                                                <p
                                                  className={
                                                    Styles.uploadedFileName2
                                                  }
                                                >
                                                  {'.'}
                                                </p>
                                              )}
                                            </Col>
                                          );
                                        }
                                      )}

                                      {
                                        <Col>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            {
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            }
                                          </Row>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            <Input
                                              onKeyDown={(e) => {
                                                if (
                                                  e.key === '-' ||
                                                  e.key === 'e'
                                                ) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              disabled={
                                                prefilled.length > 0 &&
                                                prefilled[index]?.monthlyData[
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                ]?.quantity > 0
                                                  ? prefilled[index]
                                                      ?.monthlyData[
                                                      monthsForCurrentYear[
                                                        monthsForCurrentYear.length -
                                                          1
                                                      ]
                                                    ]?.quantity
                                                  : false
                                              }
                                              value={
                                                values.process[index]
                                                  ?.monthlyData[
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                ]?.quantity
                                              }
                                              placeholder="10000"
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `process.${index}.monthlyData.${
                                                    monthsForCurrentYear[
                                                      monthsForCurrentYear.length -
                                                        1
                                                    ]
                                                  }.quantity`,
                                                  e.target.value
                                                )
                                              }
                                              style={{ width: '80px' }}
                                            ></Input>
                                          </Row>
                                          {values.process[index]?.monthlyData[
                                            monthsForCurrentYear[
                                              monthsForCurrentYear.length - 1
                                            ]
                                          ]?.quantity ? (
                                            <p
                                              className={
                                                Styles.uploadedFileName1
                                              }
                                            >
                                              {fileName
                                                ? fileName.substr(0, 10) + '..'
                                                : ''}
                                            </p>
                                          ) : (
                                            <p
                                              className={
                                                Styles.uploadedFileName2
                                              }
                                            >
                                              {'.'}
                                            </p>
                                          )}
                                        </Col>
                                      }
                                    </Row>
                                    <Row
                                      className="emission-form-label"
                                      style={{ marginTop: '25px' }}
                                    >
                                      <Col> Attachments :</Col>
                                      <Col className="mx-2">
                                        <Form.Item>
                                          <div className={Styles.uploadWrap}>
                                            <Upload
                                              className={` scope-form-upload`}
                                              beforeUpload={(file) => {
                                                const maxSize =
                                                  2.5 * 1024 * 1024;
                                                if (file.size > maxSize) {
                                                  message.warning(
                                                    'File size must be less than 2.5MB.'
                                                  );
                                                  return false;
                                                }
                                                return true;
                                              }}
                                              onChange={(info) => {
                                                handleOnChangeProcess(
                                                  info,
                                                  index,
                                                  setFieldValue,
                                                  values.process
                                                );
                                              }}
                                              showUploadList={false}
                                              name="uploaded_file"
                                              action={`${apiBaseUrl}/file/file_upload_view/`}
                                              headers={{
                                                Authorization: `Bearer ${user.token}`,
                                              }}
                                              style={{ pointerEvents: 'none' }}
                                            >
                                              <Row>
                                                <Col span={24}>
                                                  {' '}
                                                  <p
                                                    className={Styles.uploadBtn}
                                                  >
                                                    <CloudIcon />
                                                    <span>
                                                      Click or drag file to this
                                                      area to upload
                                                    </span>
                                                  </p>
                                                </Col>
                                              </Row>
                                            </Upload>
                                            <Row>
                                              <Col>
                                                {fileNames &&
                                                  !isEmpty(fileNames[index]) &&
                                                  fileNames[index].map(
                                                    (item: any, idx: any) => (
                                                      <>
                                                        <span>
                                                          <File />
                                                        </span>
                                                        <span className="m-2">
                                                          {item}
                                                        </span>
                                                        <span
                                                          className={
                                                            Styles.cancel
                                                          }
                                                          onClick={() => {
                                                            let innerArray =
                                                              filesList[index];
                                                            let secondElement =
                                                              innerArray[idx];

                                                            handleRemove(
                                                              secondElement,
                                                              index,
                                                              setFieldValue,
                                                              item
                                                            );
                                                          }}
                                                        >
                                                          <Cancel />
                                                        </span>
                                                      </>
                                                    )
                                                  )}
                                              </Col>
                                            </Row>
                                          </div>
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                    <hr style={{ marginTop: '10vh' }}></hr>
                                  </div>
                                )
                              )}
                          </>
                        )}
                      </FieldArray>
                    </div>

                    <FormFooter
                      resetForm={resetForm}
                      isValid={isValid}
                      dirty={dirty}
                    />
                  </Form>
                )}
              </Formik>
            ) : (
              <CustomUpload
                setloading={setloading}
                loading={loading}
                setExcelUploaded={setExcelUploaded}
                initializeForm={initializeForm}
                emission_type={'Process Combustion'}
                setFileName={setFileName}
              />
            )}
          </Col>
        </Row>
      </>
    );
  };

  const DataEntryFugitive = ({
    type,
    entityType,
  }: {
    type: string;
    entityType: 'fugitive';
  }) => {
    const [fileLists, setFileLists] = useState<any>({});
    const [fileName, setFileName] = useState<any>();

    const [filesList, setFilesList] = useState<any>({});
    const [fileNames, setFileNames] = useState<any>({});
    const [isDisable, setIsDisable] = useState(true);
    const [formValues, setFormValues] = useState<any>([]);
    const [initalFormValues, setInitialFormValues] = useState<any>([]);
    const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
    const monthsForCurrentYear = getMonthsInFinancialYear(
      userLogged?.financial_year
    );

    const FormFooter = ({
      isValid,
      dirty,
      resetForm,
    }: {
      isValid: boolean;
      dirty: boolean;
      resetForm: any;
    }) => {
      return (
        <Row justify="end">
          <Form.Item>
            <Row gutter={14}>
              <Col className={Styles.customPaddingRight}>
                <ButtonComponent
                  hierarchy="secondary-gray"
                  onClick={() => {
                    navigate('/environment/emissions', {
                      state: activeKey,
                    });
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Col>{' '}
              {/* <Col>
                <ButtonComponent
                  hierarchy="secondary"
                  htmlType="reset"
                  onClick={() => {
                    resetForm();
                    setInitialFormValues([
                      {
                        fuel: '',
                        UOM: '',
                        disclosure: [],
                        list_of_files: [],
                        monthlyData: monthsForCurrentYear.reduce(
                          (acc: any, month: any) => {
                            acc[month] = { quantity: '' };
                            return acc;
                          },
                          {}
                        ),
                      },
                    ]);
                    setFileLists({});
                    setFileNames({});
                    setFilesList({});
                  }}
                  className="form_reset"
                >
                  Reset
                </ButtonComponent>
              </Col>{' '} */}
              <Col>
                {' '}
                <ButtonComponent
                  hierarchy="primary"
                  htmlType="submit"
                  className="form_submit"
                  disabled={!isValid || isDisable}
                >
                  Submit
                </ButtonComponent>
              </Col>
            </Row>
          </Form.Item>
        </Row>
      );
    };

    const handleOnChangeFugitive = (
      info: any,
      index: any,
      setFieldValue: any,
      values: any
    ) => {
      const updatedValues = [...values];
      if (info.file.status === 'done') {
        const FileName = info.file.name;
        const UID =
          info.file.response?.response?.data ||
          Math.floor(Math.random() * 100 + 1);

        if (!updatedValues[index].disclosure) {
          updatedValues[index].disclosure = [];
          updatedValues[index].list_of_files = [];
        }

        updatedValues[index].disclosure.push(UID);
        updatedValues[index].list_of_files.push(FileName);
        setFormValues(updatedValues);

        setFieldValue(
          `fugitive[${index}].disclosure`,
          updatedValues[index].disclosure
        );
        setFileNames({
          ...fileNames,
          [index]: updatedValues[index].list_of_files,
        });
        setFilesList({
          ...filesList,
          [index]: updatedValues[index].disclosure,
        });

        const fileExists = Object.values(fileLists as any).some(
          (fileList: any) => Object.values(fileList).includes(FileName)
        );

        if (fileExists) {
          message.error(
            `${FileName} file name already exists. Please use a different file.`
          );
          return;
        }

        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    const [ExcelUploaded, setExcelUploaded] = useState(false);
    const [prefilled, setPrefilled] = useState<any>([]);
    interface response {
      entity_Id: string;
      fugitive_data: ProcessDatum[];
    }

    interface ProcessDatum {
      gas_or_refrigerant: string;
      UOM: string;
      equipmentType: string;
      monthlyData: MonthlyDatum[];
    }

    interface MonthlyDatum {
      month: string;

      quantity: number | string;
    }

    function initializeForm(response: response) {
      const { fugitive_data } = response;
      const monthMapping: { [key in string]: string } =
        monthsForCurrentYear.reduce(
          (acc, month, index) => {
            const monthKey = `M${index + 1}`;
            acc[monthKey] = month;
            return acc;
          },
          {} as { [key in string]: string }
        );
      const data = fugitive_data.map((item) => {
        return {
          gas_or_refrigerant: item.gas_or_refrigerant,
          UOM: item.UOM,
          equipmentType: item.equipmentType,

          monthlyData: item.monthlyData.reduce((acc: any, current) => {
            acc[monthMapping[current.month.toUpperCase() as string] as string] =
              {
                quantity: current.quantity || '',
              };
            return acc;
          }, {}),
        };
      });
      setInitialFormValues(data);
      setPrefilled(data);
      setExcelUploaded(true);
    }

    const handleRemove = (
      UIDToRemove: any,
      index: any,
      setFieldValue: any,
      fileName: any
    ) => {
      const updatedValues = [...initalFormValues];

      if (updatedValues[index].disclosure && UIDToRemove) {
        removeElementByValue(updatedValues[index].disclosure, UIDToRemove);
      }

      if (updatedValues[index].list_of_files && fileName) {
        removeElementByValue(updatedValues[index].list_of_files, fileName);
      }

      setFieldValue(
        `fugitive[${index}].disclosure`,
        updatedValues[index].disclosure
      );
      setInitialFormValues(updatedValues);
      setFormValues(updatedValues);

      message.success(`File removed successfully.`);

      if (updatedValues[index].disclosure.length === 0) {
        setIsDisable(true);
      }
    };

    useEffect(() => {
      const allDisclosuresPresent = initalFormValues.every(
        (item: any) => item.disclosure && item.disclosure.length > 0
      );

      setIsDisable(!allDisclosuresPresent);
    }, [formValues, initalFormValues]);
    const [loading, setloading] = useState(false);
    return (
      <>
        <Row gutter={10} className="mt-4">
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
                  Download the template file and fill up the user details in the
                  given format{' '}
                </p>
              </Col>
              <Col span={24}>
                <CustomDownload type={type} />
              </Col>
            </>
          ) : (
            <></>
          )}
          <Col span={24}>
            {ExcelUploaded ? (
              <Formik
                initialValues={{
                  entity_Id: '',
                  fugitive: initalFormValues,
                }}
                validationSchema={Yup.object().shape({
                  fugitive: Yup.array().of(
                    Yup.object()
                      .shape({
                        gas_or_refrigerant: Yup.string().required(
                          'refrigerant is required'
                        ),
                        UOM: Yup.string().required('UOM is required'),
                        equipmentType: Yup.string().required(
                          'equipment_type is required'
                        ),

                        monthlyData: Yup.object().shape(
                          monthsForCurrentYear.reduce(
                            (acc: any, month: any) => {
                              acc[month] = MonthlyDataSchema;
                              return acc;
                            },
                            {}
                          )
                        ),
                      })
                      .test(
                        'at-least-one-quantity',
                        'At least one monthlyData entry must have a valid quantity present',
                        (value) => {
                          const monthlyData = value.monthlyData || {};
                          return Object.values(monthlyData).some((entry) => {
                            return entry.quantity;
                          });
                        }
                      )
                  ),
                })}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  const data = transformFugitiveData(values.fugitive);
                  setSubmitting(true);
                  post('/Emissions/create_fugitive_emission/', {
                    entity_Id: user.entity_Id,
                    facility_Id: facilitySelected,
                    fugitive_data: data.fugitive_data,
                  })
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res?.message}`,
                            type: 'success',
                          });
                          resetForm();
                          setSubmitting(false);
                          navigate('/environment/emissions', {
                            state: activeKey,
                          });
                        }
                      }
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      openToast({
                        content: `${err?.message}`,
                        type: 'error',
                      });
                    })
                    .finally(() => setSubmitting(false));
                }}
                enableReinitialize
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
                }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <div className={Styles.formFooter}>
                      <FieldArray name="fugitive">
                        {(arrayHelpers) => (
                          <>
                            {values.fugitive.map(
                              (items: any, index: number) => (
                                <div key={index}>
                                  {index === 0 && (
                                    <Row key={index}>
                                      {[
                                        'Equipment Type',
                                        'Gas/Refrigerant',
                                        'UOM',
                                      ].map((data: string, index: number) => (
                                        <Col
                                          xl={4}
                                          lg={4}
                                          md={12}
                                          sm={24}
                                          key={index}
                                        >
                                          <div className="emission-form-label">
                                            {data}
                                          </div>
                                        </Col>
                                      ))}
                                    </Row>
                                  )}

                                  <Row
                                    className="form-grid"
                                    align="middle"
                                    gutter={12}
                                    key={index}
                                  >
                                    <Col xl={4} lg={4} md={12} sm={24}>
                                      <Select
                                        showSearch
                                        placeholder="Select equipmentType"
                                        disabled={true}
                                        value={
                                          values.fugitive[index]?.equipmentType
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `fugitive.${index}.equipmentType`,
                                            value
                                          )
                                        }
                                        style={{
                                          height: '40px',
                                          marginTop: '10px',
                                          width: '100%',
                                        }}
                                        className="emission-select"
                                      />
                                    </Col>

                                    <Col xl={4} lg={4} md={12} sm={24}>
                                      <Select
                                        showSearch
                                        placeholder=""
                                        disabled={true}
                                        value={
                                          values.fugitive[index]
                                            ?.gas_or_refrigerant
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `fugitive.${index}.gas_or_refrigerant`,
                                            value
                                          )
                                        }
                                        style={{
                                          height: '40px',
                                          marginTop: '10px',
                                          width: '100%',
                                        }}
                                        className="emission-select"
                                      />
                                    </Col>

                                    <Col xl={4} lg={4} md={12} sm={24}>
                                      <Select
                                        placeholder="UOM"
                                        disabled={true}
                                        value={values.fugitive[index]?.UOM}
                                        onChange={(value) =>
                                          setFieldValue(
                                            `fugitive.${index}.UOM`,
                                            value
                                          )
                                        }
                                        style={{
                                          height: '40px',
                                          marginTop: '10px',
                                          // marginLeft: "50px",
                                          width: '100%',
                                        }}
                                        className="emission-select"
                                      />
                                    </Col>
                                    <Col xl={2} lg={2} md={2} sm={2}></Col>
                                  </Row>

                                  <Row
                                    style={{
                                      width: '100%',
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                    }}
                                    className="form-grid"
                                    gutter={[8, 30]}
                                  >
                                    {monthsForCurrentYear.map((month, idx) => {
                                      return idx === 0 ? (
                                        <Col style={{ fontFamily: '' }}>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            Month :{' '}
                                          </Row>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            Quantity :
                                          </Row>
                                          <p className={Styles.hiddenText}>
                                            {'..'}
                                          </p>
                                        </Col>
                                      ) : (
                                        <Col>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            {monthsForCurrentYear[idx - 1]}
                                          </Row>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            <Input
                                              onKeyDown={(e) => {
                                                if (
                                                  e.key === '-' ||
                                                  e.key === 'e'
                                                ) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              value={
                                                values.fugitive[index]
                                                  ?.monthlyData[
                                                  monthsForCurrentYear[idx - 1]
                                                ]?.quantity
                                              }
                                              disabled={
                                                prefilled.length > 0 &&
                                                prefilled[index]?.monthlyData[
                                                  monthsForCurrentYear[idx - 1]
                                                ]?.quantity > 0
                                                  ? prefilled[index]
                                                      ?.monthlyData[
                                                      monthsForCurrentYear[
                                                        idx - 1
                                                      ]
                                                    ]?.quantity
                                                  : false
                                              }
                                              onChange={(e) =>
                                                setFieldValue(
                                                  `fugitive.${index}.monthlyData.${
                                                    monthsForCurrentYear[
                                                      idx - 1
                                                    ]
                                                  }.quantity`,
                                                  e.target.value
                                                )
                                              }
                                              placeholder="10000"
                                              style={{ width: '80px' }}
                                            ></Input>
                                          </Row>
                                          {values.fugitive[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ]?.quantity ? (
                                            <p
                                              className={
                                                Styles.uploadedFileName1
                                              }
                                            >
                                              {fileName
                                                ? fileName.substr(0, 10) + '..'
                                                : ''}
                                            </p>
                                          ) : (
                                            <p
                                              className={
                                                Styles.uploadedFileName2
                                              }
                                            >
                                              {'.'}
                                            </p>
                                          )}
                                        </Col>
                                      );
                                    })}

                                    {
                                      <Col>
                                        <Row
                                          className="emission-form-label"
                                          style={{ marginTop: '20px' }}
                                        >
                                          {
                                            monthsForCurrentYear[
                                              monthsForCurrentYear.length - 1
                                            ]
                                          }
                                        </Row>
                                        <Row
                                          className="emission-form-label"
                                          style={{ marginTop: '20px' }}
                                        >
                                          <Input
                                            onKeyDown={(e) => {
                                              if (
                                                e.key === '-' ||
                                                e.key === 'e'
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            placeholder="10000"
                                            value={
                                              values.fugitive[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[
                                                  monthsForCurrentYear.length -
                                                    1
                                                ]
                                              ]?.quantity
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `fugitive.${index}.monthlyData.${
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                }.quantity`,
                                                e.target.value
                                              )
                                            }
                                            style={{ width: '80px' }}
                                          ></Input>
                                        </Row>
                                        {values.fugitive[index]?.monthlyData[
                                          monthsForCurrentYear[
                                            monthsForCurrentYear.length - 1
                                          ]
                                        ]?.quantity ? (
                                          <p
                                            className={Styles.uploadedFileName1}
                                          >
                                            {fileName
                                              ? fileName.substr(0, 10) + '..'
                                              : ''}
                                          </p>
                                        ) : (
                                          <p
                                            className={Styles.uploadedFileName2}
                                          >
                                            {'.'}
                                          </p>
                                        )}
                                      </Col>
                                    }
                                  </Row>
                                  <Row
                                    className="emission-form-label"
                                    style={{ marginTop: '25px' }}
                                  >
                                    <Col> Attachments :</Col>
                                    <Col className="mx-2">
                                      <Form.Item>
                                        <div className={Styles.uploadWrap}>
                                          <Upload
                                            className={` scope-form-upload`}
                                            onChange={(info) => {
                                              handleOnChangeFugitive(
                                                info,
                                                index,
                                                setFieldValue,
                                                values.fugitive
                                              );
                                            }}
                                            beforeUpload={(file) => {
                                              const maxSize = 2.5 * 1024 * 1024;
                                              if (file.size > maxSize) {
                                                message.warning(
                                                  'File size must be less than 2.5MB.'
                                                );
                                                return false;
                                              }
                                              return true;
                                            }}
                                            showUploadList={false}
                                            name="uploaded_file"
                                            action={`${apiBaseUrl}/file/file_upload_view/`}
                                            headers={{
                                              Authorization: `Bearer ${user.token}`,
                                            }}
                                            style={{ pointerEvents: 'none' }}
                                          >
                                            <Row>
                                              <Col span={24}>
                                                {' '}
                                                <p className={Styles.uploadBtn}>
                                                  <CloudIcon />
                                                  <span>
                                                    Click or drag file to this
                                                    area to upload
                                                  </span>
                                                </p>
                                              </Col>
                                            </Row>
                                          </Upload>
                                          <Row>
                                            <Col>
                                              {fileNames &&
                                                !isEmpty(fileNames[index]) &&
                                                fileNames[index].map(
                                                  (item: any, idx: any) => (
                                                    <>
                                                      <span>
                                                        <File />
                                                      </span>
                                                      <span className="m-2">
                                                        {item}
                                                      </span>
                                                      <span
                                                        className={
                                                          Styles.cancel
                                                        }
                                                        onClick={() => {
                                                          let innerArray =
                                                            filesList[index];
                                                          let secondElement =
                                                            innerArray[idx];

                                                          handleRemove(
                                                            secondElement,
                                                            index,
                                                            setFieldValue,
                                                            item
                                                          );
                                                        }}
                                                      >
                                                        <Cancel />
                                                      </span>
                                                    </>
                                                  )
                                                )}
                                            </Col>
                                          </Row>
                                        </div>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <hr style={{ marginTop: '10vh' }}></hr>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </FieldArray>
                    </div>

                    <FormFooter
                      resetForm={resetForm}
                      isValid={isValid}
                      dirty={dirty}
                    />
                  </Form>
                )}
              </Formik>
            ) : (
              <CustomUpload
                setloading={setloading}
                loading={loading}
                setExcelUploaded={setExcelUploaded}
                initializeForm={initializeForm}
                emission_type={'Fugitive Combustion'}
                setFileName={setFileName}
              />
            )}
          </Col>
        </Row>
      </>
    );
  };

  const handleClickradio = (e: any) => {
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
    } else {
      setRadioValue(2);
    }
  };

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

  const [radioValue, setRadioValue] = useState(1);
  const [scopeValue, setScopeValue] = useState(1);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Stationary Combustion',
      children: (
        <>
          <Row gutter={[10, 10]}>
            <RadioWrapper label="Stationary Combustion" />
            <Col span={24} className={Styles.customPaddingTop}>
              {radioValue === 1 ? (
                <>
                  <CustomForm
                    tabKey={activeKey}
                    label="Stationary Combustion"
                    dataSource={detailInfo}
                    date={dateValue}
                    emissionUrl="/Emissions/create_stationay_combustion/"
                  />
                </>
              ) : (
                <DataEntryStationary type={'stationary'} tabKey={activeKey} />
              )}
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '2',
      label: 'Mobile Combustion',
      children: (
        <>
          <Row gutter={[10, 10]}>
            <RadioWrapper label="Mobile Combustion" />
            <Col span={24} className={Styles.customPaddingTop}>
              {radioValue === 1 ? (
                <>
                  <CustomForm
                    label="Mobile Combustion"
                    date={dateValue}
                    tabKey={activeKey}
                  />
                </>
              ) : (
                <DataEntryMobile type={'mobile_combustion'} />
              )}
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '3',
      label: 'Process Emissions',
      children: (
        <>
          <Row gutter={[10, 10]}>
            <RadioWrapper label="Process Emissions" />
            <Col span={24} className={Styles.customPaddingTop}>
              {radioValue === 1 ? (
                <>
                  <CustomForm
                    label="Process Emissions"
                    date={dateValue}
                    tabKey={activeKey}
                  />
                </>
              ) : (
                <DataEntryProcess type={'process'} />
              )}
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '4',
      label: 'Fugitive Emissions',
      children: (
        <>
          <Row gutter={[10, 10]}>
            <RadioWrapper label="Fugitive Emissions" />

            <Col span={24} className={Styles.customPaddingTop}>
              {radioValue === 1 ? (
                <>
                  <CustomForm
                    label="Fugitive Emissions"
                    date={dateValue}
                    tabKey={activeKey}
                  />
                </>
              ) : (
                <DataEntryFugitive type={'fugitive'} entityType="fugitive" />
              )}
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      {/* <Row
        style={{ paddingTop: '10px' }}
        justify="space-between"
        className={Styles['page-title']}
      >
        <Col>
          <p className="pageTitle">Emission Calculator</p>
        </Col>
      </Row> */}
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row gutter={12} justify="end">
          <Col span={24} className={Styles.AnttabSty}>
            {scopeValue === 1 ? (
              <Tabs
                defaultActiveKey={`${location.state}`}
                items={items}
                onChange={(e: any) => {
                  const eNumber = Number(e);
                  setActiveKey(eNumber - 1);
                }}
              />
            ) : (
              <ScopeTwoForm />
            )}
          </Col>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default ProcessEmission;
