import { useEffect, useState } from 'react';
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
import { apiBaseUrl, get, post } from '../../Services';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../Hooks/useNotification';
import Styles from '../../Modules/UserScreen/ProcessEmission/processEmission.module.scss';
import moment from 'moment';
import { useAuth } from '../../Hooks/useAuth';
import { useSelector } from 'react-redux';
import { transformData } from './CustomForm';
import { ButtonComponent } from '../../DesignLibrary';
import CloudIcon from '../../assets/Svg/Emissions/uploadColud';
import File from '../../assets/Svg/Emissions/fileImg';
import Cancel from '../../assets/Svg/Emissions/Cancel';
import { isEmpty } from 'lodash';
import { removeElementByValue } from '../Emissions/Scope3/Helpers';
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

export function getMonthsInFinancialYear(financialYear: any) {
  // Split the financial year into start and end
  const [startMonthYear, endMonthYear] = financialYear.split(' - ');

  // Function to convert month abbreviation to month index (0-11)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const getMonthIndex = (monthAbbr: any) =>
    monthNames.indexOf(monthAbbr.slice(0, 3));

  // Extract start month and year
  const startMonth = getMonthIndex(startMonthYear.slice(0, 3));
  const startYear = parseInt(startMonthYear.slice(4));

  // Extract end month and year
  const endMonth = getMonthIndex(endMonthYear.slice(0, 3));
  const endYear = parseInt(endMonthYear.slice(4));

  const months = [];

  // Generate the months from start to end
  let currentYear = startYear;
  let currentMonth = startMonth;

  while (currentYear <= endYear) {
    months.push(
      `${monthNames[currentMonth]}-${currentYear.toString().slice(-2)}`
    );

    // Move to the next month
    currentMonth++;
    if (currentMonth === 12) {
      currentMonth = 0;
      currentYear++;
    }

    // Stop once we reach the end month of the end year
    if (currentYear === endYear && currentMonth > endMonth) {
      break;
    }
  }

  return months;
}

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

const StationaryForm = ({ tabKey }: any) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );
  const [isupload, setIsUpload] = useState(true);
  const facilitySelected = useSelector((state: any) => state?.facilitySelected);

  const [prefilled, setPrefilled] = useState<any>([]);

  const [selectedFuels, setSelectedFuels] = useState(''); // store selected fuel for each index

  const handleSelectFuelChange = (value: any) => {
    setSelectedFuels(value);
  };

  const fetchFeildValues = (fuel: string, uom: string, index: Number) => {
    get(
      `/Emissions/get_sat_data/?entity_Id=${user.entity_Id}&fuel=${fuel}&uom=${uom}&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          setStationaryValues(res?.response?.data, index);
        }
      })
      .catch((err) => {
        openToast({
          content: `${err?.message}`,
          type: 'error',
        });
      });
  };

  const stationaryOptions = useSelector(
    (state: any) => state.stationaryOptions
  );

  const removefromList = (index: any) => {
    const NewObj = fileLists;
    for (let key in NewObj) {
      if (key === index) {
        delete NewObj[key];
      }
    }
    setFileLists(NewObj);
  };

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

  type FileList = { [key: string]: string };
  type FileLists = { [key: number]: FileList };

  const [filesList, setFilesList] = useState<any>({});
  const [fileNames, setFileNames] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);
  const [formValues, setFormValues] = useState<any>([]);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');

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

  useEffect(() => {
    const allDisclosuresPresent = initalFormValues.every(
      (item: any) => item.disclosure && item.disclosure.length > 0
    );

    setIsDisable(!allDisclosuresPresent);
  }, [formValues, initalFormValues]);

  function setStationaryValues(res: any, index: any) {
    if (res === '') {
      setInitialFormValues(initalFormValues);
    } else {
      const data = {
        fuel: res.fuel_type,
        UOM: res.uom,
        disclosure: res.disclosure,
        list_of_files: res.list_of_files,
        monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
          acc[month] = {
            quantity: res[month].quantity.toString(),
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
          <Row>
            <Col className={Styles.customPaddingRight}>
              <ButtonComponent
                hierarchy="tertiary"
                htmlType="reset"
                onClick={() => {
                  navigate('/environment/emissions', {
                    state: {
                      tabKey: tabKey,
                      currentFacility: facilitySelected,
                    },
                  });
                }}
              >
                Cancel
              </ButtonComponent>
            </Col>{' '}
            <Col className={Styles.customPaddingRight}>
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

  const [entityData, setEntityData] = useState<any>([]);
  const fetchEnityData = (apiUrl: any) => {
    setIsLoading(true);

    get(apiUrl)
      .then((res) => {
        const data = !isEmpty(res?.response?.data) && res?.response?.data;
        setEntityData(data);
        setMaxReviewerLevel(data[0]?.max_DR);
        setMaxApproverLevel(data[0]?.max_DA);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEnityData('/entity/getEntitiesListByUserId/');
  }, []);

  return (
    <>
      <Spin spinning={isLoading}>
        <Formik
          initialValues={{
            entity_Id: '',
            stationary: initalFormValues,
          }}
          enableReinitialize={true}
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
          onSubmit={async (values, { resetForm }) => {
            const data = transformData(values.stationary);
            setIsLoading(true);

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
                    setIsLoading(false);
                    navigate('/environment/emissions', {
                      state: {
                        tabKey: tabKey,
                        currentFacility: facilitySelected,
                      },
                    });
                  } else {
                    openToast({
                      content: `${res?.message}`,
                      type: 'warning',
                    });
                  }
                }
              })
              .catch((err) => {
                setIsLoading(false);
                openToast({
                  content: `${err?.message}`,
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

                  setFilesList({});
                }}
              >
                <FieldArray name="stationary">
                  {(arrayHelpers) => (
                    <>
                      {values?.stationary?.map((fuel: any, index: any) => (
                        <div key={index}>
                          <Row
                            className="form-grid"
                            align="middle"
                            gutter={12}
                            key={index}
                          >
                            <Col xl={5} lg={5} md={12} sm={24}>
                              {/* name={`stationary.${index}.fuel`} */}
                              <Form.Item>
                                <p className={Styles.fieldLabel}>Fuel Type*</p>
                                <Select
                                  showSearch
                                  placeholder="Select Fuel Type"
                                  options={
                                    stationaryOptions?.fuelRelatedOptions
                                      ? Object.keys(
                                          stationaryOptions.fuelRelatedOptions
                                        )
                                          .sort()
                                          .map((data) => ({
                                            label: data,
                                            value: data,
                                          }))
                                      : []
                                  }
                                  value={values.stationary[index].fuel}
                                  onChange={(value) => {
                                    const updatePrefill = [...prefilled];
                                    updatePrefill[index] = {
                                      ...updatePrefill[index],
                                      disclosure: [],
                                      list_of_files: [],
                                      monthlyData: monthsForCurrentYear.reduce(
                                        (acc: any, month: any) => {
                                          acc[month] = { quantity: '' };
                                          return acc;
                                        },
                                        {}
                                      ),
                                    };
                                    setPrefilled(updatePrefill);
                                    setFieldValue(
                                      `stationary[${index}].fuel`,
                                      value
                                    );
                                    setFieldValue(
                                      `stationary[${index}].UOM`,
                                      null
                                    );
                                    removeFilefromList(index);

                                    handleSelectFuelChange(value);
                                    const updatedStationary: any = [
                                      ...values.stationary,
                                    ];
                                    updatedStationary[index] = {
                                      ...updatedStationary[index],
                                      fuel: value,
                                      UOM: null,
                                      disclosure: [],
                                      list_of_files: [],
                                      monthlyData: monthsForCurrentYear.reduce(
                                        (acc: any, month: any) => {
                                          acc[month] = { quantity: '' };
                                          return acc;
                                        },
                                        {}
                                      ),
                                    };
                                    setInitialFormValues(updatedStationary);
                                    setFormValues(updatedStationary);
                                    monthsForCurrentYear?.map((month, idx) => {
                                      setFieldValue(
                                        `stationary[${index}].monthlyData[${
                                          monthsForCurrentYear[idx - 1]
                                        }].quantity`,
                                        ''
                                      );
                                    });
                                  }}
                                  style={{ height: '40px' }}
                                  className="emission-select"
                                />
                              </Form.Item>
                            </Col>

                            <Col xl={4} lg={4} md={12} sm={24}>
                              <Form.Item>
                                <p className={Styles.fieldLabel}>UOM*</p>
                                <Select
                                  showSearch
                                  placeholder="UOM"
                                  options={
                                    stationaryOptions?.fuelRelatedOptions?.[
                                      selectedFuels
                                    ]
                                      ? stationaryOptions.fuelRelatedOptions[
                                          selectedFuels
                                        ].map((data: any) => ({
                                          label: data,
                                          value: data,
                                        }))
                                      : []
                                  }
                                  value={values.stationary[index].UOM}
                                  onChange={(value) => {
                                    setFieldValue(
                                      `stationary[${index}].UOM`,
                                      value
                                    );
                                    fetchFeildValues(
                                      selectedFuels,
                                      value,
                                      index
                                    );

                                    const updatedStationary: any = [
                                      ...values.stationary,
                                    ];

                                    updatedStationary[index] = {
                                      ...updatedStationary[index],
                                      UOM: value,
                                      disclosure: [],
                                      list_of_files: [],
                                      monthlyData: {},
                                    };

                                    setFileNames({
                                      ...fileNames,
                                      [index]:
                                        updatedStationary[index].list_of_files,
                                    });

                                    setFormValues(updatedStationary);
                                    setInitialFormValues(updatedStationary);
                                  }}
                                  style={{ height: '40px' }}
                                  className="emission-select"
                                />
                              </Form.Item>
                            </Col>
                            <Col xl={2} lg={2} md={2} sm={2}>
                              <p className="invisible"></p>
                              {index === values.stationary.length - 1 && (
                                <Button
                                  style={{
                                    marginBottom: '10px',
                                    height: '40px',
                                    backgroundColor: '#036323',
                                  }}
                                  type="primary"
                                  onClick={() => {
                                    arrayHelpers.push({
                                      fuel: '',
                                      UOM: '',
                                      monthlyData: monthsForCurrentYear.reduce(
                                        (acc: any, month: any) => {
                                          acc[month] = {
                                            quantity: '',
                                          };
                                          return acc;
                                        },
                                        {}
                                      ),
                                    });
                                    const setValue = [...initalFormValues];
                                    setValue[index] = values.stationary[index];
                                    setInitialFormValues(setValue);
                                    setInitialFormValues(
                                      (initalFormValues: any) => [
                                        ...initalFormValues,
                                        {
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

                          <Row className="form-grid" gutter={[8, 30]}>
                            {monthsForCurrentYear?.map((month, idx) => {
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
                                    <Form.Item>
                                      <Input
                                        name={`stationary.${index}.monthlyData.${
                                          monthsForCurrentYear[idx - 1]
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
                                            prefilled[index]?.monthlyData[
                                              monthsForCurrentYear[idx - 1]
                                            ]?.quantity
                                          ) > 0
                                            ? prefilled[index]?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                            : false
                                        }
                                        type="number"
                                        value={
                                          values.stationary[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ] &&
                                          values.stationary[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ]?.quantity === '0'
                                            ? ''
                                            : values.stationary[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ] &&
                                              values.stationary[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                        }
                                        onChange={(e) => {
                                          setFieldValue(
                                            `stationary[${index}].monthlyData[${
                                              monthsForCurrentYear[idx - 1]
                                            }].quantity`,
                                            e.target.value
                                          );
                                          const updatedStationary: any = [
                                            ...values.stationary,
                                          ];

                                          updatedStationary[index] = {
                                            ...updatedStationary[index],
                                            monthlyData: {
                                              ...updatedStationary[index]
                                                .monthlyData,
                                              [monthsForCurrentYear[idx - 1]]: {
                                                ...updatedStationary[index]
                                                  .monthlyData[idx],
                                                quantity: e.target.value,
                                              },
                                            },
                                          };

                                          setFormValues(updatedStationary);
                                        }}
                                        placeholder="10000"
                                        style={{ width: '80px' }}
                                      ></Input>
                                    </Form.Item>
                                  </Row>
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
                                  <Form.Item>
                                    <Input
                                      name={`statinoary.${index}.monthlyData.${
                                        monthsForCurrentYear[
                                          monthsForCurrentYear.length - 1
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
                                      disabled={
                                        prefilled.length > 0 &&
                                        prefilled[index]?.monthlyData[
                                          monthsForCurrentYear[
                                            monthsForCurrentYear.length - 1
                                          ]
                                        ]?.quantity > 0
                                          ? prefilled[index]?.monthlyData[
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity
                                          : false
                                      }
                                      value={
                                        values.stationary[index]?.monthlyData[
                                          monthsForCurrentYear[
                                            monthsForCurrentYear.length - 1
                                          ]
                                        ]?.quantity === '0'
                                          ? ''
                                          : values.stationary[index]
                                              ?.monthlyData[
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity
                                      }
                                      onChange={(e) =>
                                        setFieldValue(
                                          `stationary.${index}.monthlyData.${
                                            monthsForCurrentYear[
                                              monthsForCurrentYear.length - 1
                                            ]
                                          }.quantity`,
                                          e.target.value
                                        )
                                      }
                                      placeholder="10000"
                                      style={{ width: '80px' }}
                                    ></Input>
                                  </Form.Item>
                                </Row>
                              </Col>
                            }
                            {
                              <Col xl={2} lg={2} md={12} sm={24}>
                                <Row
                                  className="emission-form-label"
                                  style={{ marginTop: '20px' }}
                                >
                                  <p className="invisible"></p>
                                </Row>
                                {index !== 0 && (
                                  <Button
                                    danger={true}
                                    onClick={() => {
                                      const updatedFormValues = [
                                        ...initalFormValues,
                                      ];
                                      updatedFormValues.splice(index, 1);

                                      if (Array.isArray(fileLists)) {
                                        const updatedFileLists = [...fileLists];
                                        delete updatedFileLists[index];
                                        arrayHelpers.remove(index);
                                        removefromList(index);
                                        removeFilefromList(index);

                                        setFileLists(updatedFileLists);
                                      }
                                      setInitialFormValues(updatedFormValues);
                                    }}
                                    style={{
                                      height: '33px',
                                      marginTop: '20px',
                                      padding: '0 20px',
                                    }}
                                  >
                                    -
                                  </Button>
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
                                      handleOnChangeStationary(
                                        info,
                                        index,
                                        setFieldValue,
                                        values.stationary
                                      );
                                      setIsUpload(false);
                                    }}
                                    showUploadList={false}
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
                                            Click or drag file to this area to
                                            upload
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

                <FormFooter
                  isValid={isValid}
                  dirty={dirty}
                  resetForm={resetForm}
                />
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </>
  );
};

export default StationaryForm;
