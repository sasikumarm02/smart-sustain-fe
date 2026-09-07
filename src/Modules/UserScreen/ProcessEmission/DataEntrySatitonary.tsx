import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, Upload, message } from 'antd';
import CustomDownload from '../../../Components/FileHanddle/customDownload';
import { FieldArray, Formik, setIn } from 'formik';
import { UploadOutlined } from '@ant-design/icons';
import { apiBaseUrl, post } from '../../../Services';
import CustomUpload from '../../../Components/FileHanddle/customUpload';
import * as Yup from 'yup';
import Styles from './processEmission.module.scss';
import { transformData } from '../../../Components/TabForms/CustomForm';
import { useAuth } from '../../../Hooks/useAuth';
import { useNotification } from '../../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ButtonComponent } from '../../../DesignLibrary';
import CloudIcon from '../../../assets/Svg/Emissions/uploadColud';
import File from '../../../assets/Svg/Emissions/fileImg';
import Cancel from '../../../assets/Svg/Emissions/Cancel';
import { isEmpty } from '../../../Utils/isEmpty';
import { removeElementByValue } from '../../../Components/Emissions/Scope3/Helpers';
import { useSelector } from 'react-redux';
import { getMonthsInFinancialYear } from '../../../Components/TabForms/StationaryForm';

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

export interface response {
  entity_Id: string;
  stationary_data: StationaryDatum[];
}

export interface StationaryDatum {
  fuel: string;
  UOM: string;
  monthlyData: MonthlyDatum[];
}

export interface MonthlyDatum {
  month: string;
  quantity: number | string;
}

export const DataEntryStationary = ({ type, tabKey }: any) => {
  const [fileLists, setFileLists] = useState<any>({});
  const [fileName, setFileName] = useState<any>();
  const [initalFormValues, setInitialFormValues] = useState<any>([]);
  const [ExcelUploaded, setExcelUploaded] = useState(false);
  const [loading, setloading] = useState(false);
  const { user } = useAuth();
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );

  const [prefilled, setPrefilled] = useState<any>([]);
  const [filesList, setFilesList] = useState<any>({});
  const [fileNames, setFileNames] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
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
                  navigate('/environment/emissions', { state: tabKey });
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
                  setPrefilled([
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
                  setFileLists({});
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
                disabled={isDisable}
              >
                Submit
              </ButtonComponent>
            </Col>
          </Row>
        </Form.Item>
      </Row>
    );
  };

  type FileList = { [key: string]: string };
  type FileLists = { [key: number]: FileList };
  const handleOnChangeStationary = (
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
        `stationary[${index}].disclosure`,
        updatedValues[index].disclosure
      );

      setFileNames({
        ...fileNames,
        [index]: updatedValues[index].list_of_files,
      });
      setFilesList({ ...filesList, [index]: updatedValues[index].disclosure });

      const fileExists = Object.values(fileLists as FileLists).some(
        (fileList: FileList) => Object.values(fileList).includes(FileName)
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

    const { stationary_data } = response;
    const data = stationary_data.map((item) => {
      return {
        fuel: item.fuel,
        UOM: item.UOM,
        monthlyData: item.monthlyData.reduce((acc: any, current) => {
          acc[monthMapping[current.month.toUpperCase() as string] as string] = {
            quantity: current.quantity || '',
          };
          return acc;
        }, {}),
      };
    });
    setInitialFormValues(data);
    setPrefilled(data);
    setExcelUploaded(true);
    setloading(false);
  }

  const [formValues, setFormValues] = useState<any>([]);
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
      `stationary[${index}].disclosure`,
      updatedValues[index].disclosure
    );
    setInitialFormValues(updatedValues);
    setFormValues(updatedValues);

    message.success(`File removed successfully.`);

    if (updatedValues[index].disclosure.length === 0) {
      setIsDisable(true);
    }
  };

  const MonthlyDataSchema = Yup.object()
    .shape({
      quantity: Yup.number().nullable(),
    })
    .test(
      'at-least-one-entry',
      'At least one quantity must be present.',
      (value: any) => {
        // Check if quantity is present and is a valid number
        if (value && value.quantity !== null) {
          return true;
        }
        return false;
      }
    );

  useEffect(() => {
    const allDisclosuresPresent = formValues.every(
      (item: any) => item.disclosure && item.disclosure.length > 0
    );
    setIsDisable(!allDisclosuresPresent);
  }, [formValues, initalFormValues]);

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
                stationary: initalFormValues,
              }}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                const data = transformData(values.stationary);
                setSubmitting(true);
                post('/Emissions/create_stationay_combustion/', {
                  entity_Id: user.entity_Id,
                  facility_Id: facilitySelected,
                  stationary_data: data.stationary_data,
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
                        navigate('/environment/emissions');
                      }
                    }
                  })
                  .catch((err: any) => {
                    setSubmitting(false);
                    openToast({
                      content: `${err?.message}`,
                      type: 'error',
                    });
                  })
                  .finally(() => setSubmitting(false));
              }}
              enableReinitialize
              validationSchema={Yup.object().shape({
                stationary: Yup.array().of(
                  Yup.object()
                    .shape({
                      fuel: Yup.string().required('Fuel type is required'),
                      UOM: Yup.string().required('UOM is required'),

                      monthlyData: Yup.object().shape(
                        monthsForCurrentYear.reduce((acc: any, month: any) => {
                          acc[month] = MonthlyDataSchema;
                          return acc;
                        }, {})
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
                isSubmitting,
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
                    <FieldArray name="stationary">
                      {(arrayHelpers) => (
                        <>
                          {values.stationary.map(
                            (items: any, index: number) => (
                              <div key={index}>
                                {index === 0 && (
                                  <Row key={index}>
                                    {['Fuel Type', 'UOM'].map(
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
                                      placeholder="Select Fuel Type"
                                      disabled
                                      value={values.stationary[index]?.fuel}
                                      onChange={(value) =>
                                        setFieldValue(
                                          `stationary.${index}.fuel`,
                                          value
                                        )
                                      }
                                      style={{ height: '40px', width: '100%' }}
                                      className="emission-select"
                                    />
                                  </Col>

                                  <Col xl={4} lg={4} md={12} sm={24}>
                                    <Select
                                      placeholder="UOM"
                                      disabled={true}
                                      value={values.stationary[index]?.UOM}
                                      onChange={(value) =>
                                        setFieldValue(
                                          `stationary.${index}.UOM`,
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
                                            type="number"
                                            value={
                                              values.stationary[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                            }
                                            disabled={
                                              prefilled.length > 0 &&
                                              prefilled[index]?.monthlyData[
                                                monthsForCurrentYear[
                                                  monthsForCurrentYear.length -
                                                    1
                                                ]
                                              ]?.quantity > 0
                                                ? prefilled[index]?.monthlyData[
                                                    monthsForCurrentYear[
                                                      monthsForCurrentYear.length -
                                                        1
                                                    ]
                                                  ]?.quantity
                                                : false
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `stationary.${index}.monthlyData.${
                                                  monthsForCurrentYear[idx - 1]
                                                }.quantity`,
                                                e.target.value
                                              )
                                            }
                                            onKeyDown={(e: any) => {
                                              if (
                                                e.key === 'e' ||
                                                e.key === 'E'
                                              ) {
                                                e.preventDefault();
                                              }
                                            }}
                                            //placeholder="10000"
                                            style={{ width: '80px' }}
                                          ></Input>
                                        </Row>

                                        {values.stationary[index]?.monthlyData[
                                          monthsForCurrentYear[idx - 1]
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
                                          type="number"
                                          onKeyDown={(e: any) => {
                                            if (
                                              e.key === 'e' ||
                                              e.key === 'E'
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          value={
                                            values.stationary[index]
                                              ?.monthlyData[
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity
                                          }
                                          disabled={
                                            prefilled.length > 0 &&
                                            prefilled[index]?.monthlyData[
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity > 0
                                              ? prefilled[index]?.monthlyData[
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                ]?.quantity
                                              : false
                                          }
                                          onChange={(e) =>
                                            setFieldValue(
                                              `stationary.${index}.monthlyData.${
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
                                      <p
                                        style={{
                                          color: 'gray',
                                          fontWeight: '500',
                                        }}
                                      >
                                        {values.stationary[index]?.monthlyData[
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
                                      </p>
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
                                            handleOnChangeStationary(
                                              info,
                                              index,
                                              setFieldValue,
                                              values.stationary
                                            );
                                            //setIsUpload(false);
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
                                                      className={Styles.cancel}
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
              emission_type="Stationary Combustion"
              initializeForm={initializeForm}
              setFileName={setFileName}
            />
          )}
        </Col>
      </Row>
    </>
  );
};
