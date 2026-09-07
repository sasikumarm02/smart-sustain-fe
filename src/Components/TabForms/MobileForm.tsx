import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Spin,
  Form,
  Select,
  Input,
  Upload,
  message,
} from 'antd';
import { FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import { apiBaseUrl, get, post } from '../../Services';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../Hooks/useNotification';
import Styles from '../../Modules/UserScreen/ProcessEmission/processEmission.module.scss';
import moment from 'moment';
import { useAuth } from '../../Hooks/useAuth';
import { transformMobileData } from './CustomForm';
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import {
  MonthlyDataSchema,
  getAllMonthsForCurrentYear,
  getMonthsInFinancialYear,
} from './StationaryForm';
import { ButtonComponent } from '../../DesignLibrary';
import { removeElementByValue } from '../Emissions/Scope3/Helpers';
import Cancel from '../../assets/Svg/Emissions/Cancel';
import CloudIcon from '../../assets/Svg/Emissions/uploadColud';
import { isEmpty } from 'lodash';
import File from '../../assets/Svg/Emissions/fileImg';

type FileList = { [key: string]: string };
type FileLists = { [key: number]: FileList };

const MobileForm = ({ tabKey }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );
  const mobileOptions = useSelector((state: any) => state.mobileOptions);
  const [selectedFuels, setSelectedFuels] = useState('');
  const handleSelectFuelChange = (value: any) => {
    setSelectedFuels(value);
  };
  const [formValues, setFormValues] = useState<any>([]);

  const [filesList, setFilesList] = useState<any>({});
  const [fileNames, setFileNames] = useState<any>({});
  const [isupload, setIsUpload] = useState(true);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [initalFormValues, setInitialFormValues] = useState<any>([
    {
      vehicleType: '',
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
  const [prefilled, setPrefilled] = useState<any>([]);
  const removefromList = (index: any) => {
    const NewObj = fileLists;
    for (let key in NewObj) {
      if (key === index) {
        delete NewObj[key];
      }
    }
    setFileLists(NewObj);
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

  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    const allDisclosuresPresent = initalFormValues.every(
      (item: any, index: any) => item.disclosure && item.disclosure.length > 0
    );

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
          <Row>
            <Col className={Styles.customPaddingRight}>
              <ButtonComponent
                hierarchy="tertiary"
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
              {' '}
              <ButtonComponent
                htmlType="reset"
                hierarchy="secondary"
                onClick={() => {
                  resetForm();
                  setInitialFormValues([
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

  const fetchFeildValues = (
    fuel: string,
    uom: string,
    vehicle: string,
    index: Number
  ) => {
    setIsLoading(true);
    get(
      `/Emissions/get_mobile_data/?entity_Id=${user.entity_Id}&fuel=${fuel}&uom=${uom}&vehicleType=${vehicle}&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          fetchMobileValues(res?.response?.data, index);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        openToast({
          content: `${err?.message}`,
          type: 'error',
        });
      })
      .finally(() => setIsLoading(false));
  };

  const fetchMobileValues = (res: any, index: any) => {
    if (res === '') {
      setInitialFormValues(initalFormValues);
    } else {
      const data = {
        vehicleType: res.vehicle_type,
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
      setFormValues(setValue);
      setPrefilled(setValue);
      setFileNames({
        ...fileNames,
        [index]: data && data.list_of_files && data?.list_of_files,
      });
      setFilesList({
        ...filesList,
        [index]: data && data.disclosure && data?.disclosure,
      });
    }
  };

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

  return (
    <Spin spinning={isLoading}>
      <Formik
        initialValues={{
          entity_Id: '',
          mobile: initalFormValues,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          mobile: Yup.array().of(
            Yup.object()
              .shape({
                fuel: Yup.string().required('Fuel type is required'),
                UOM: Yup.string().required('UOM is required'),
                vehicleType: Yup.string().required('Vehicle type is required'),

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
          const data = transformMobileData(values.mobile);
          setIsLoading(true);
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
                  setIsLoading(false);
                  navigate('/environment/emissions', {
                    state: {
                      tabKey: tabKey,
                      currentFacility: facilitySelected,
                    },
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
            });
        }}
        onReset={async (values, { resetForm }) => {}}
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
                <FieldArray name="mobile">
                  {(arrayHelpers) => (
                    <>
                      {values?.mobile?.map((fuel: any, index: any) => (
                        <>
                          <Row
                            className="form-grid"
                            align="middle"
                            gutter={12}
                            key={index}
                          >
                            <Col xl={6} lg={6} md={12} sm={24}>
                              <Form.Item>
                                <p className={Styles.fieldLabel}>
                                  Vehicle Type*
                                </p>
                                <Select
                                  // name={`mobile.${index}.vehicleType`}
                                  showSearch
                                  placeholder="Select Vehicle Type"
                                  // options={
                                  //   mobileOptions?.vehicleRelatedOptions
                                  //     ? mobileOptions.vehicleRelatedOptions
                                  //         .sort()
                                  //         .map((data: any) => ({
                                  //           label: data,
                                  //           value: data,
                                  //         }))
                                  //     : []
                                  // }
                                  options={
                                    mobileOptions?.vehicleFuelUnitOptions
                                      ? Object.keys(
                                          mobileOptions.vehicleFuelUnitOptions
                                        )
                                          .sort()
                                          .map((vehicleType: any) => ({
                                            label: vehicleType,
                                            value: vehicleType,
                                          }))
                                      : []
                                  }
                                  value={values.mobile[index].vehicleType}
                                  onChange={(value) => {
                                    const updatePrefill = [...prefilled];
                                    updatePrefill[index] = {
                                      ...updatePrefill[index],
                                      disclosure: [],
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
                                      `mobile.${index}.vehicleType`,
                                      value
                                    );
                                    setFieldValue(
                                      `mobile[${index}].fuel`,
                                      null
                                    );
                                    setFieldValue(`mobile[${index}].UOM`, null);
                                    removeFilefromList(index);
                                    const updatedStationary: any = [
                                      ...values.mobile,
                                    ];

                                    updatedStationary[index] = {
                                      ...updatedStationary[index],
                                      vehicleType: value,
                                      fuel: null,
                                      UMO: null,
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
                                        `mobile[${index}].monthlyData[${
                                          monthsForCurrentYear[idx - 1]
                                        }].quantity`,
                                        ''
                                      );
                                    });
                                  }}
                                  style={{
                                    height: '40px',
                                    marginTop: '10px',
                                    width: '100%',
                                  }}
                                  className="emission-select"
                                />
                              </Form.Item>
                            </Col>

                            <Col xl={5} lg={5} md={12} sm={24}>
                              <Form.Item>
                                <p className={Styles.fieldLabel}>Fuel Type*</p>
                                <Select
                                  showSearch
                                  placeholder="Fuel Type"
                                  // options={
                                  //   mobileOptions?.fuelRelatedOptions
                                  //     ? Object.keys(
                                  //         mobileOptions.fuelRelatedOptions
                                  //       )
                                  //         .sort()
                                  //         .map((data) => ({
                                  //           label: data,
                                  //           value: data,
                                  //         }))
                                  //     : []
                                  // }
                                  options={
                                    values.mobile[index].vehicleType &&
                                    mobileOptions?.vehicleFuelUnitOptions?.[
                                      values.mobile[index].vehicleType
                                    ]
                                      ? Object.keys(
                                          mobileOptions.vehicleFuelUnitOptions[
                                            values.mobile[index].vehicleType
                                          ]
                                        )
                                          .sort()
                                          .map((fuel) => ({
                                            label: fuel,
                                            value: fuel,
                                          }))
                                      : []
                                  }
                                  value={values.mobile[index].fuel}
                                  onChange={(value) => {
                                    setFieldValue(
                                      `mobile.${index}.fuel`,
                                      value
                                    );
                                    setFieldValue(`mobile[${index}].UOM`, null);
                                    handleSelectFuelChange(value);
                                    const updatedStationary: any = [
                                      ...values.mobile,
                                    ];
                                    updatedStationary[index] = {
                                      ...updatedStationary[index],
                                      fuel: value,
                                    };
                                    setFormValues(updatedStationary);
                                  }}
                                  style={{
                                    height: '40px',
                                    marginTop: '10px',
                                    width: '100%',
                                  }}
                                  className="emission-select"
                                />
                              </Form.Item>
                            </Col>

                            <Col xl={3} lg={3} md={12} sm={24}>
                              <Form.Item>
                                <p className={Styles.fieldLabel}>UOM*</p>
                                <Select
                                  showSearch
                                  placeholder="UOM"
                                  // options={
                                  //   mobileOptions?.fuelRelatedOptions?.[
                                  //     selectedFuels
                                  //   ]
                                  //     ? mobileOptions.fuelRelatedOptions[
                                  //         selectedFuels
                                  //       ].map((data: any) => ({
                                  //         label: data,
                                  //         value: data,
                                  //       }))
                                  //     : []
                                  // }
                                  options={
                                    values.mobile[index].vehicleType &&
                                    values.mobile[index].fuel &&
                                    mobileOptions?.vehicleFuelUnitOptions?.[
                                      values.mobile[index].vehicleType
                                    ]?.[values.mobile[index].fuel]
                                      ? mobileOptions.vehicleFuelUnitOptions[
                                          values.mobile[index].vehicleType
                                        ][values.mobile[index].fuel].map(
                                          (uom: any) => ({
                                            label: uom,
                                            value: uom,
                                          })
                                        )
                                      : []
                                  }
                                  onChange={(value) => {
                                    setFieldValue(`mobile.${index}.UOM`, value);
                                    fetchFeildValues(
                                      values.mobile[index].fuel,
                                      value,
                                      values.mobile[index].vehicleType,
                                      index
                                    );
                                    const updatedStationary: any = [
                                      ...values.mobile,
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
                                  }}
                                  value={values.mobile[index].UOM}
                                  style={{
                                    height: '40px',
                                    marginTop: '10px',
                                    width: '100%',
                                  }}
                                  className="emission-select"
                                />
                              </Form.Item>
                            </Col>

                            <Col xl={2} lg={2} md={2} sm={2}>
                              <p className="invisible"></p>
                              {index === values.mobile.length - 1 && (
                                <Button
                                  type="primary"
                                  style={{
                                    height: '40px',
                                    backgroundColor: '#036323',
                                  }}
                                  onClick={() => {
                                    const setValue = [...initalFormValues];
                                    setValue[index] = values.mobile[index];

                                    setInitialFormValues(setValue);
                                    setInitialFormValues(
                                      (initalFormValues: any) => [
                                        ...initalFormValues,
                                        {
                                          vehicleType: '',
                                          fuel: '',
                                          UOM: '',
                                          monthlyData:
                                            monthsForCurrentYear.reduce(
                                              (acc: any, month: any) => {
                                                acc[month] = {
                                                  quantity: '',
                                                  disclosure: null,
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

                          <Row
                            style={{
                              width: '85vw',
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
                                        name={`mobile.${index}.monthlyData.${
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
                                          prefilled[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ]?.quantity > 0
                                            ? prefilled[index]?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                            : false
                                        }
                                        value={
                                          values.mobile[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ] &&
                                          values.mobile[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ]?.quantity === '0'
                                            ? ''
                                            : values.mobile[index]?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ] &&
                                              values.mobile[index]?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                        }
                                        type="number"
                                        onChange={(e) => {
                                          setFieldValue(
                                            `mobile[${index}].monthlyData[${
                                              monthsForCurrentYear[idx - 1]
                                            }].quantity`,
                                            e.target.value
                                          );
                                          const updatedStationary: any = [
                                            ...values.mobile,
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
                                      name={`mobile.${index}.monthlyData.${
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
                                      type="number"
                                      value={
                                        values.mobile[index]?.monthlyData[
                                          monthsForCurrentYear[
                                            monthsForCurrentYear.length - 1
                                          ]
                                        ]?.quantity
                                      }
                                      onChange={(e) =>
                                        setFieldValue(
                                          `mobile.${index}.monthlyData.${
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
                                      marginTop: '22px',
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
                                      handleOnChangeMobile(
                                        info,
                                        index,
                                        setFieldValue,
                                        values.mobile
                                      );
                                      setIsUpload(false);
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
                        </>
                      ))}
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
    </Spin>
  );
};

export default MobileForm;
