import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Select,
  Form,
  Button,
  Upload,
  Input,
  message,
  Spin,
} from 'antd';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { apiBaseUrl, get, post } from '../../../Services';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../Hooks/useNotification';
import Styles from './Enviroment.module.scss';
import moment from 'moment';
import {
  UploadOutlined,
  FileExcelFilled,
  FileWordFilled,
} from '@ant-design/icons';
import { useAuth } from '../../../Hooks/useAuth';
import { useSelector } from 'react-redux';

import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import {
  transEnviromentData,
  transformData,
  transformMobileData,
  TransformWaterData,
} from '../../TabForms/CustomForm';
import { isEmpty } from '../../../Utils/isEmpty';
import Cancel from '../../../assets/Svg/Emissions/Cancel';
import File from '../../../assets/Svg/Emissions/fileImg';
import { removeElementByValue } from '../Scope3/Helpers';
import CloudIcon from '../../../assets/Svg/Emissions/uploadColud';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';
import { getMonthsInFinancialYear } from '../../TabForms/StationaryForm';
import CustomDownload from '../../FileHanddle/customDownload';
import CustomUpload from '../../FileHanddle/customUpload';

// Please note that the fuel here refers to the source of water ...

export function getAllMonthsForCurrentYear(startingMonth: string) {
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

const dropDownWater = [
  'Surface Water',
  'Ground Water',
  'Sea Water',
  'Produced Water',
  'Govt. supplied Water',
  'Potable Water',
  'Recycled Water',
  'NEWater',
];

const dropDownUom = ['liters', 'gallons', 'cubic meter'];

export const MonthlyDataSchema = Yup.object()
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
const EnviromentInputForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );
  const [formValues, setFormValues] = useState<any>([]);
  const [selectedFuels, setSelectedFuels] = useState(''); // store selected fuel for each index

  const handleSelectFuelChange = (value: any) => {
    setSelectedFuels(value);
  };
  const [prefilled, setPrefilled] = useState<any>([]);
  const fetchFeildValues = (fuel: string, uom: string, index: any) => {
    get(
      `/water/get_prefetched_water_data/?entity_Id=${user.entity_Id}&water_source=${fuel}&uom=${uom}&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          setStationaryValues(res?.response?.data, index);
        } else {
          let updatedValues = [...initalFormValues];

          updatedValues[index] = {
            ...updatedValues[index],
            UOM: uom,
            disclosure: [],
            list_of_files: [],
            monthlyData: monthsForCurrentYear.reduce((acc: any, month) => {
              acc[month] = { quantity: '' };
              return acc;
            }, {}),
          };

          setFileNames([]);

          setInitialFormValues(updatedValues);
        }
      })
      .catch((err) => {
        openToast({
          content: `${err?.message}`,
          type: 'error',
        });
      });
  };

  const removefromList = (index: any) => {
    const NewObj = fileLists;
    for (let key in NewObj) {
      if (key === index) {
        delete NewObj[key];
      }
    }
    setFileLists(NewObj);
  };

  type FileList = { [key: string]: string };
  type FileLists = { [key: number]: FileList };

  const [filesList, setFilesList] = useState<any>({});
  const [fileNames, setFileNames] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
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
      `water_data[${index}].disclosure`,
      updatedValues[index].disclosure
    );
    setInitialFormValues(updatedValues);
    setFormValues(updatedValues);

    message.success(`File removed successfully.`);

    if (updatedValues[index].disclosure.length === 0) {
      setIsDisable(true);
    }
  };

  const handleOnChangeStationary = (
    info: any,
    index: any,
    setFieldValue: any,
    values: any
  ) => {
    const updatedValues = [...values];

    if (!isEmpty(info?.file?.status) && info?.file?.status === 'done') {
      const FileName = !isEmpty(info?.file?.name) && info?.file?.name;
      const UID =
        (!isEmpty(info?.file?.response?.response?.data) &&
          info?.file?.response?.response?.data) ||
        Math.floor(Math.random() * 100 + 1);

      if (!updatedValues[index].disclosure) {
        updatedValues[index].disclosure = [];
        updatedValues[index].list_of_files = [];
      }

      updatedValues[index].disclosure.push(UID);
      updatedValues[index].list_of_files.push(FileName);
      setFormValues(updatedValues);

      setFieldValue(
        `water_data[${index}].disclosure`,
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

      message.success(
        `${!isEmpty(info?.file?.name) && info?.file?.name} file uploaded successfully`
      );
    } else if (!isEmpty(info?.file?.status) && info?.file?.status === 'error') {
      message.error(
        `${!isEmpty(info?.file?.name) && info?.file?.name} file upload failed.`
      );
    }
  };

  const [initalFormValues, setInitialFormValues] = useState<any>([
    {
      fuel: '',
      UOM: '',
      disclosure: [],
      list_of_files: [],
      monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
        acc[month] = { quantity: '' };
        return acc;
      }, {}),
    },
  ]);

  function setStationaryValues(res: any, index: any) {
    if (res === '') {
      setInitialFormValues(initalFormValues);
    } else {
      const data = {
        fuel: res.water_source,
        UOM: res.uom,
        disclosure: res.disclosure,
        list_of_files: res.list_of_files,
        monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
          acc[month] = {
            quantity:
              res[month].quantity > 0 ? res[month].quantity.toString() : '',
          };
          return acc;
        }, {}),
      };

      const setValue = [...initalFormValues];
      setValue[index] = data;
      setInitialFormValues(setValue);
      setPrefilled(setValue);
      setFormValues(setValue);
      setFileNames({
        ...fileNames,
        [index]: data && data.list_of_files && data?.list_of_files,
      });
      setFilesList({
        ...filesList,
        [index]: data && data.disclosure && data?.disclosure,
      });
    }
  }

  useEffect(() => {
    const allDisclosuresPresent = formValues.every(
      (item: any) => item.disclosure && item.disclosure.length > 0
    );

    setIsDisable(!allDisclosuresPresent);
  }, [formValues, initalFormValues]);

  const stationaryOptions = useSelector(
    (state: any) => state.stationaryOptions
  );

  const removeFilefromList = (index: any) => {
    const NewObj = fileNames;
    const newDisclosure = filesList;
    for (let key in NewObj) {
      if (key == index) {
        delete NewObj[key];
        delete newDisclosure[key];
      }
    }

    setFileNames(NewObj);
    setFilesList(newDisclosure);
  };

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
            <Col>
              <ButtonComponent
                hierarchy="tertiary"
                htmlType="reset"
                onClick={() => {
                  navigate('/environment/water-withdrawal-consumption', {
                    state: {
                      currentFacility: facilitySelected,
                    },
                  });
                }}
              >
                Cancel
              </ButtonComponent>
            </Col>{' '}
            <Col>
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
                }}
              >
                Reset
              </ButtonComponent>
            </Col>{' '}
            <Col>
              {' '}
              <ButtonComponent
                hierarchy="primary"
                htmlType="submit"
                loading={isLoading}
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

  const handleClickradio = (e: any) => {
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
    } else {
      setRadioValue(2);
    }
  };
  const RadioWrapper = () => {
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

  const DataEntryWater = ({ type }: { type: string }) => {
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
                  hierarchy="tertiary"
                  htmlType="reset"
                  onClick={() => {
                    navigate('/environment/water-withdrawal-consumption', {
                      state: {
                        currentFacility: facilitySelected,
                      },
                    });
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Col>{' '}
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

    const handleOnChangeWater = (
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
          `water[${index}].disclosure`,
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

    interface MonthlyDatum {
      month: string;
      quantity: number | string;
    }
    interface WaterDatum {
      water_source: string;
      UOM: string;
      monthlyData: MonthlyDatum[];
    }

    interface response {
      entity_Id: string;
      water_data: WaterDatum[];
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

      console.log(response, 'response');

      const { water_data } = response;
      const data = water_data.map((item) => {
        return {
          water_source: item.water_source,
          UOM: item.UOM,
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
        `water[${index}].disclosure`,
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
                  water: initalFormValues,
                }}
                validationSchema={Yup.object().shape({
                  water: Yup.array().of(
                    Yup.object()
                      .shape({
                        water_source: Yup.string().required(
                          'water source is required'
                        ),
                        UOM: Yup.string().required('UOM is required'),

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
                  const data = TransformWaterData(values?.water);

                  setSubmitting(true);

                  post('water/create-data-for-water-consumption/', {
                    entity_Id: user.entity_Id,
                    facility_Id: facilitySelected,
                    water_data: data.water_data,
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
                          navigate(
                            '/environment/water-withdrawal-consumption',
                            {
                              state: {
                                currentFacility: facilitySelected,
                              },
                            }
                          );
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
                            {values?.water?.map((items: any, index: number) => (
                              <div key={index}>
                                {index === 0 && (
                                  <Row key={index}>
                                    {['Source of Water ', 'UOM'].map(
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
                                      placeholder="Select Source"
                                      disabled={true}
                                      value={values.water[index]?.water_source}
                                      onChange={(value) =>
                                        setFieldValue(
                                          `water.${index}.
water_source`,
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
                                      value={values.water[index]?.UOM}
                                      onChange={(value) =>
                                        setFieldValue(
                                          `water.${index}.UOM`,
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
                                              values.water[index]?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                            }
                                            disabled={
                                              prefilled.length > 0 &&
                                              prefilled[index]?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity > 0
                                                ? prefilled[index]?.monthlyData[
                                                    monthsForCurrentYear[
                                                      idx - 1
                                                    ]
                                                  ]?.quantity
                                                : false
                                            }
                                            onChange={(e) =>
                                              setFieldValue(
                                                `mobile.${index}.monthlyData.${
                                                  monthsForCurrentYear[idx - 1]
                                                }.quantity`,
                                                e.target.value
                                              )
                                            }
                                            placeholder="10000"
                                            style={{ width: '80px' }}
                                          ></Input>
                                        </Row>
                                        {values.water[index]?.monthlyData[
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
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === '-' ||
                                              e.key === 'e'
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          value={
                                            values.water[index]?.monthlyData[
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
                                              `water.${index}.monthlyData.${
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
                                      {values.water[index]?.monthlyData[
                                        monthsForCurrentYear[
                                          monthsForCurrentYear.length - 1
                                        ]
                                      ]?.quantity ? (
                                        <p className={Styles.uploadedFileName1}>
                                          {fileName
                                            ? fileName.substr(0, 10) + '..'
                                            : ''}
                                        </p>
                                      ) : (
                                        <p className={Styles.uploadedFileName2}>
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
                                            handleOnChangeWater(
                                              info,
                                              index,
                                              setFieldValue,
                                              values.water
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
                            ))}
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
                emission_type="Water Consumption"
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

  return (
    <>
      {/* <p className={Styles.header}>Water Withdrawal & Consumption</p> */}
      <PageCardComponent className={Styles.pageCardStyleForm}>
        <RadioWrapper />
        {radioValue === 1 ? (
          <LoaderComponent spinning={isLoading}>
            <Formik
              initialValues={{
                entity_Id: user.entity_Id,
                water_data: initalFormValues,
              }}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                water_data: Yup.array().of(
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
              onSubmit={async (values, { resetForm }) => {
                const data = transEnviromentData(values.water_data);

                setIsLoading(true);
                post('water/create-data-for-water-consumption/', {
                  entity_Id: user.entity_Id,
                  facility_Id: facilitySelected,
                  water_data: data.water_data,
                })
                  .then((res: any) => {
                    if (!isEmpty(res?.status) && res?.status === 'Success') {
                      if (
                        !isEmpty(res?.response) &&
                        res?.response?.status === true
                      ) {
                        openToast({
                          content: `${!isEmpty(res?.message) && res?.message}`,
                          type: 'success',
                        });
                        resetForm();
                        setIsLoading(false);
                        navigate('/environment/water-withdrawal-consumption');
                      } else {
                        openToast({
                          content: `${!isEmpty(res?.message) && res?.message}`,
                          type: 'warning',
                        });
                      }
                    }
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    openToast({
                      content: `${!isEmpty(err?.message) && err?.message}`,
                      type: 'error',
                    });
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
                return (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={() => {
                      handleReset();
                      setFileLists({});
                    }}
                  >
                    <div className={Styles.formFooter}>
                      <FieldArray name="water_data">
                        {(arrayHelpers) => (
                          <>
                            {!isEmpty(values?.water_data) &&
                              values?.water_data?.map(
                                (fuel: any, index: any) => (
                                  <div key={index}>
                                    {index === 0 && (
                                      <Row
                                        key={index}
                                        className={Styles.marginHeader}
                                      >
                                        {['Source of Water *', 'UOM *'].map(
                                          (data: string, index: number) => (
                                            <Col
                                              xl={5}
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
                                      <Col xl={5} lg={5} md={12} sm={24}>
                                        {/* name={`stationary.${index}.fuel`} */}
                                        <Form.Item>
                                          <Select
                                            showSearch
                                            placeholder="Select Source"
                                            options={
                                              dropDownWater
                                                ? dropDownWater.map(
                                                    (data: any) => ({
                                                      label: data,
                                                      value: data,
                                                    })
                                                  )
                                                : []
                                            }
                                            value={
                                              values.water_data[index].fuel
                                            }
                                            onChange={(value) => {
                                              const updatePrefill = [
                                                ...prefilled,
                                              ];
                                              updatePrefill[index] = {
                                                ...updatePrefill[index],
                                                disclosure: [],
                                                list_of_files: [],
                                                monthlyData:
                                                  monthsForCurrentYear.reduce(
                                                    (acc: any, month: any) => {
                                                      acc[month] = {
                                                        quantity: '',
                                                      };
                                                      return acc;
                                                    },
                                                    {}
                                                  ),
                                              };
                                              setPrefilled(updatePrefill);
                                              setFieldValue(
                                                `water_data[${index}].fuel`,
                                                value
                                              );
                                              setFieldValue(
                                                `water_data[${index}].UOM`,
                                                null
                                              );

                                              removeFilefromList(index);
                                              handleSelectFuelChange(value);
                                              const updatedStationary: any = [
                                                ...values.water_data,
                                              ];
                                              updatedStationary[index] = {
                                                ...updatedStationary[index],
                                                fuel: value,
                                                UOM: null,
                                                disclosure: [],
                                                list_of_files: [],
                                                monthlyData:
                                                  monthsForCurrentYear.reduce(
                                                    (acc: any, month: any) => {
                                                      acc[month] = {
                                                        quantity: '',
                                                      };
                                                      return acc;
                                                    },
                                                    {}
                                                  ),
                                              };
                                              setInitialFormValues(
                                                updatedStationary
                                              );
                                              setFormValues(updatedStationary);
                                              monthsForCurrentYear?.map(
                                                (month, idx) => {
                                                  setFieldValue(
                                                    `water_data[${index}].monthlyData[${
                                                      monthsForCurrentYear[
                                                        idx - 1
                                                      ]
                                                    }].quantity`,
                                                    ''
                                                  );
                                                }
                                              );
                                            }}
                                            className={Styles.fuelTypeHeight}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col xl={4} lg={4} md={12} sm={24}>
                                        <Form.Item>
                                          <Select
                                            showSearch
                                            placeholder="UOM"
                                            options={
                                              !isEmpty(dropDownUom)
                                                ? dropDownUom.map(
                                                    (data: any) => ({
                                                      label: data,
                                                      value: data,
                                                    })
                                                  )
                                                : []
                                            }
                                            value={values.water_data[index].UOM}
                                            onChange={(value) => {
                                              setFieldValue(
                                                `water_data[${index}].UOM`,
                                                value
                                              );

                                              const updatedStationary: any = [
                                                ...values.water_data,
                                              ];

                                              updatedStationary[index] = {
                                                ...updatedStationary[index],
                                                UOM: value,
                                              };
                                              setInitialFormValues(
                                                updatedStationary
                                              );
                                              setFormValues(updatedStationary);
                                              if (selectedFuels !== '') {
                                                fetchFeildValues(
                                                  selectedFuels,
                                                  value,
                                                  index
                                                );
                                              }
                                            }}
                                            className={Styles.fuelTypeHeight}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col>
                                        {index ===
                                          values.water_data.length - 1 && (
                                          <Button
                                            className={`${Styles.addBtnStyle}`}
                                            type="primary"
                                            onClick={() => {
                                              arrayHelpers.push({
                                                fuel: '',
                                                UOM: '',
                                                monthlyData:
                                                  monthsForCurrentYear.reduce(
                                                    (acc: any, month: any) => {
                                                      acc[month] = {
                                                        quantity: '',
                                                      };
                                                      return acc;
                                                    },
                                                    {}
                                                  ),
                                              });
                                              const setValue = [
                                                ...initalFormValues,
                                              ];
                                              setValue[index] =
                                                values.water_data[index];
                                              setInitialFormValues(setValue);
                                              setInitialFormValues(
                                                (initalFormValues: any) => [
                                                  ...initalFormValues,
                                                  {
                                                    fuel: '',
                                                    UOM: '',
                                                    monthlyData:
                                                      monthsForCurrentYear.reduce(
                                                        (
                                                          acc: any,
                                                          month: any
                                                        ) => {
                                                          acc[month] = {
                                                            quantity: '',
                                                          };
                                                          return acc;
                                                        },
                                                        {}
                                                      ),
                                                  },
                                                ]
                                              );
                                            }}
                                          >
                                            +
                                          </Button>
                                        )}
                                      </Col>
                                    </Row>

                                    <Row gutter={10}>
                                      {!isEmpty(monthsForCurrentYear) &&
                                        monthsForCurrentYear?.map(
                                          (month, idx) => {
                                            return idx === 0 ? (
                                              <Col xl={2} lg={2} md={2}>
                                                <Row
                                                  className={`emission-form-label ${Styles.boxHeight}`}
                                                >
                                                  Month :{' '}
                                                </Row>
                                                <Row
                                                  className={`emission-form-label ${Styles.boxHeightWithWidth}`}
                                                >
                                                  Total Water Withdrawn :
                                                </Row>
                                              </Col>
                                            ) : (
                                              <Col>
                                                <Row
                                                  className={`emission-form-label ${Styles.boxHeight}`}
                                                >
                                                  {
                                                    monthsForCurrentYear[
                                                      idx - 1
                                                    ]
                                                  }
                                                </Row>
                                                <Row
                                                  className={`emission-form-label ${Styles.boxHeight}`}
                                                >
                                                  <Form.Item>
                                                    <Input
                                                      name={`water_data.${index}.monthlyData.${
                                                        monthsForCurrentYear[
                                                          idx - 1
                                                        ]
                                                      }.quantity`}
                                                      onKeyDown={(e) => {
                                                        if (
                                                          e.key === '-' ||
                                                          e.key === 'e' ||
                                                          e.key === 'E'
                                                        ) {
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                      disabled={
                                                        prefilled.length > 0 &&
                                                        Number(
                                                          prefilled[index]
                                                            ?.monthlyData[
                                                            monthsForCurrentYear[
                                                              idx - 1
                                                            ]
                                                          ]?.quantity
                                                        ) > 0
                                                          ? prefilled[index]
                                                              ?.monthlyData[
                                                              monthsForCurrentYear[
                                                                idx - 1
                                                              ]
                                                            ]?.quantity
                                                          : false
                                                      }
                                                      type="number"
                                                      value={
                                                        values.water_data[index]
                                                          ?.monthlyData[
                                                          monthsForCurrentYear[
                                                            idx - 1
                                                          ]
                                                        ]?.quantity
                                                      }
                                                      onChange={(e) => {
                                                        setFieldValue(
                                                          `water_data[${index}].monthlyData[${
                                                            monthsForCurrentYear[
                                                              idx - 1
                                                            ]
                                                          }].quantity`,
                                                          e.target.value
                                                        );

                                                        const updatedStationary: any =
                                                          [
                                                            ...values.water_data,
                                                          ];

                                                        updatedStationary[
                                                          index
                                                        ] = {
                                                          ...updatedStationary[
                                                            index
                                                          ],
                                                          monthlyData: {
                                                            ...updatedStationary[
                                                              index
                                                            ].monthlyData,
                                                            [monthsForCurrentYear[
                                                              idx - 1
                                                            ]]: {
                                                              ...updatedStationary[
                                                                index
                                                              ].monthlyData[
                                                                idx
                                                              ],
                                                              quantity:
                                                                e.target.value,
                                                            },
                                                          },
                                                        };
                                                        setInitialFormValues(
                                                          updatedStationary
                                                        );
                                                        setFormValues(
                                                          updatedStationary
                                                        );
                                                      }}
                                                      placeholder="10000"
                                                      className={
                                                        Styles.boxWidth
                                                      }
                                                    ></Input>
                                                  </Form.Item>
                                                </Row>
                                              </Col>
                                            );
                                          }
                                        )}

                                      {
                                        <Col>
                                          <Row
                                            className={`emission-form-label ${Styles.boxHeight}`}
                                          >
                                            {
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            }
                                          </Row>
                                          <Row
                                            className={`emission-form-label ${Styles.boxHeight}`}
                                          >
                                            <Form.Item>
                                              <Input
                                                disabled={
                                                  initalFormValues[index]
                                                    ?.monthlyData[
                                                    monthsForCurrentYear[
                                                      monthsForCurrentYear.length -
                                                        1
                                                    ]
                                                  ]?.quantity !== '' &&
                                                  initalFormValues[index]
                                                    ?.monthlyData[
                                                    monthsForCurrentYear[
                                                      monthsForCurrentYear.length -
                                                        1
                                                    ]
                                                  ]?.quantity !== '0'
                                                    ? true
                                                    : false
                                                }
                                                name={`statinoary.${index}.monthlyData.${
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                }.quantity`}
                                                onKeyDown={(e) => {
                                                  if (
                                                    e.key === '-' ||
                                                    e.key === 'e' ||
                                                    e.key === 'E'
                                                  ) {
                                                    e.preventDefault();
                                                  }
                                                }}
                                                type="number"
                                                value={
                                                  values.water_data[index]
                                                    ?.monthlyData[
                                                    monthsForCurrentYear[
                                                      monthsForCurrentYear.length -
                                                        1
                                                    ]
                                                  ]?.quantity
                                                }
                                                onChange={(e) =>
                                                  setFieldValue(
                                                    `water_data.${index}.monthlyData.${
                                                      monthsForCurrentYear[
                                                        monthsForCurrentYear.length -
                                                          1
                                                      ]
                                                    }.quantity`,
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="10000"
                                                className={Styles.boxWidth}
                                              ></Input>
                                            </Form.Item>
                                          </Row>
                                        </Col>
                                      }

                                      {index !==
                                        values.water_data.length - 1 && (
                                        <Col xl={2} lg={2} md={12} sm={24}>
                                          <Row
                                            className="emission-form-label"
                                            style={{ marginTop: '20px' }}
                                          >
                                            <p className="invisible"></p>
                                          </Row>
                                          <Button
                                            danger={true}
                                            onClick={() => {
                                              const newIntialData = [
                                                ...initalFormValues,
                                              ];
                                              newIntialData.splice(index, 1);
                                              setInitialFormValues(
                                                newIntialData
                                              );
                                              delete fileLists[index];
                                              arrayHelpers.remove(index);
                                              removefromList(index);
                                            }}
                                            className={Styles.removeBtnStyle}
                                          >
                                            -
                                          </Button>
                                        </Col>
                                      )}
                                    </Row>
                                    <Row
                                      className="emission-form-label"
                                      style={{ marginTop: '25px' }}
                                    >
                                      <Col xl={2} lg={2} md={2}>
                                        Attachments :
                                      </Col>
                                      <Col>
                                        <Form.Item>
                                          <div className={Styles.uploadWrap}>
                                            <Upload
                                              className={` scope-form-upload`}
                                              onChange={(info) => {
                                                handleOnChangeStationary(
                                                  info,
                                                  index,
                                                  setFieldValue,
                                                  values.water_data
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
                                    <hr className={Styles.lineHeight}></hr>
                                  </div>
                                )
                              )}
                          </>
                        )}
                      </FieldArray>
                    </div>
                    <FormFooter
                      isValid={isValid}
                      dirty={dirty}
                      resetForm={resetForm}
                    />
                  </Form>
                );
              }}
            </Formik>
          </LoaderComponent>
        ) : (
          <DataEntryWater type={'Water_Widrawal_Consumption'} />
        )}
      </PageCardComponent>
    </>
  );
};

export default EnviromentInputForm;
