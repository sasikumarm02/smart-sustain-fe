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
import { apiBaseUrl, get, post } from '../../Services';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../Hooks/useNotification';
import Styles from '../../Modules/UserScreen/ProcessEmission/processEmission.module.scss';
import moment from 'moment';
import { useAuth } from '../../Hooks/useAuth';
import { useSelector } from 'react-redux';
import { transformEnergyData } from './CustomForm';
import { UploadOutlined } from '@ant-design/icons';
import {
  MonthlyDataSchema,
  getAllMonthsForCurrentYear,
  getMonthsInFinancialYear,
} from './StationaryForm';
import { ButtonComponent } from '../../DesignLibrary';
import Cancel from '../../assets/Svg/Emissions/Cancel';
import { removeElementByValue } from '../Emissions/Scope3/Helpers';
import CloudIcon from '../../assets/Svg/Emissions/uploadColud';
import { isEmpty } from 'lodash';
import File from '../../assets/Svg/Emissions/fileImg';

type FileList = { [key: string]: string };
type FileLists = { [key: number]: FileList };

const EnergyForm = ({ tabKey }: any) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const energyConsumptionOptions = useSelector(
    (state: any) => state.energyConsumptionOptions
  );
  const [prefilled, setPrefilled] = useState<any>([]);
  const [initalFormValues, setInitialFormValues] = useState<any>([
    {
      source_of_energy: '',
      vehicle_type: '',
      UOM: '',
      disclosure: [],
      list_of_files: [],
      monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
        acc[month] = { quantity: '' };
        return acc;
      }, {}),
    },
  ]);
  const [isupload, setIsUpload] = useState(true);
  const [filesList, setFilesList] = useState<any>({});
  const [fileNames, setFileNames] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);
  const [formValues, setFormValues] = useState<any>([]);

  const [selectedFuels, setSelectedFuels] = useState(''); // store selected fuel for each index

  const handleSelectFuelChange = (value: any) => {
    setSelectedFuels(value);
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

  const handleOnChangeEnergy = (
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
      setInitialFormValues(updatedValues);
      setFormValues(updatedValues);

      setFieldValue(
        `energy[${index}].disclosure`,
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

  useEffect(() => {
    const allDisclosuresPresent = initalFormValues.every(
      (item: any) => item.disclosure && item.disclosure.length > 0
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
                htmlType="reset"
                onClick={() => {
                  navigate('/environment/scope2', {
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
                htmlType="reset"
                hierarchy="secondary"
                onClick={() => {
                  resetForm();
                  setInitialFormValues([
                    {
                      source_of_energy: '',
                      vehicle_type: '',
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
                      source_of_energy: '',
                      vehicle_type: '',
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

  const fetchFeildValues = (
    energy: string,
    uom: string,
    vehilce: string,
    index: Number
  ) => {
    setIsLoading(true);
    get(
      `/energy/get_energy_data/?entity_Id=${user.entity_Id}&source_of_energy=${energy}&uom=${uom}&vehicle_type=${vehilce}&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          fetchProcessValues(res?.response?.data, index);
        } else {
          setInitialFormValues(initalFormValues);
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
      `energy[${index}].disclosure`,
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

  const fetchProcessValues = (res: any, index: any) => {
    if (res === '') {
      setInitialFormValues(initalFormValues);
    } else {
      const data = {
        source_of_energy: res.source_of_energy,
        vehicle_type: res.vehicle_type,

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

  return (
    <Spin spinning={isLoading}>
      <Formik
        initialValues={{
          entity_Id: '',
          energy: initalFormValues,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          energy: Yup.array().of(
            Yup.object()
              .shape({
                source_of_energy: Yup.string().required(
                  'energy_source is required'
                ),
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
          const data = transformEnergyData(values.energy);
          setIsLoading(true);
          post('/energy/create-energy-consumption/', {
            entity_Id: user.entity_Id,
            facility_Id: facilitySelected,
            energy_data: data.energy_data,
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

                  navigate('/environment/scope2', {
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
                <FieldArray name="energy">
                  {(arrayHelpers) => (
                    <>
                      {values.energy.map((energy: any, index: any) => (
                        <>
                          {index === 0 && <Row key={index}></Row>}
                          <Row
                            className="form-grid"
                            align="middle"
                            gutter={12}
                            key={index}
                          >
                            <Col xl={5} lg={5} md={12} sm={24}>
                              <div className="emission-form-label">
                                Energy Source *
                              </div>
                              <Form.Item
                              //   name={`energy.${index}.source_of_energy`}
                              >
                                <Select
                                  showSearch
                                  placeholder="Enter Energy Source"
                                  options={
                                    energyConsumptionOptions?.sourceOfEnergy
                                      ? Object.keys(
                                          energyConsumptionOptions.sourceOfEnergy
                                        )
                                          .sort()
                                          .map((data: any) => ({
                                            label: data,
                                            value: data,
                                          }))
                                      : []
                                  }
                                  value={values.energy[index].source_of_energy}
                                  onChange={(value) => {
                                    setFieldValue(
                                      `energy.${index}.source_of_energy`,
                                      value
                                    );
                                    setFieldValue(
                                      `energy.${index}.vehicle_type`,
                                      ''
                                    );

                                    setFieldValue(`energy.${index}.UOM`, null);
                                    removeFilefromList(index);
                                    handleSelectFuelChange(value);

                                    const updatedEnergy: any = [
                                      ...values.energy,
                                    ];
                                    updatedEnergy[index] = {
                                      ...updatedEnergy[index],
                                      source_of_energy: value,
                                      vehicle_type: '',
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
                                    };
                                    setPrefilled([
                                      {
                                        source_of_energy: '',
                                        vehicle_type: '',
                                        UOM: '',
                                        disclosure: [],
                                        list_of_files: [],
                                        monthlyData:
                                          monthsForCurrentYear.reduce(
                                            (acc: any, month: any) => {
                                              acc[month] = { quantity: '' };
                                              return acc;
                                            },
                                            {}
                                          ),
                                      },
                                    ]);

                                    setInitialFormValues(updatedEnergy);
                                    setFormValues(updatedEnergy);
                                    monthsForCurrentYear?.map((month, idx) => {
                                      setFieldValue(
                                        `energy[${index}].monthlyData[${
                                          monthsForCurrentYear[idx - 1]
                                        }].quantity`,
                                        ''
                                      );
                                    });
                                  }}
                                  style={{ height: '40px' }}
                                />
                              </Form.Item>
                            </Col>

                            {values.energy[index].source_of_energy ===
                              'Electricity for EVs' && (
                              <>
                                <Col xl={5} lg={5} md={12} sm={24}>
                                  <div className="emission-form-label">
                                    Vehicle *
                                  </div>

                                  <Form.Item
                                    name={`energy.${index}.vehicle_type`}
                                  >
                                    <Select
                                      showSearch
                                      placeholder="Enter Vehicle Type"
                                      options={
                                        energyConsumptionOptions?.vehicleRelatedOptions
                                          ? Object.keys(
                                              energyConsumptionOptions.vehicleRelatedOptions
                                            )
                                              .sort()
                                              .map((data) => ({
                                                label: data,
                                                value: data,
                                              }))
                                          : []
                                      }
                                      value={values.energy[index].vehicle_type}
                                      onChange={(value) => {
                                        setFieldValue(
                                          `energy.${index}.vehicle_type`,
                                          value
                                        );
                                        setFieldValue(
                                          `energy[${index}].UOM`,
                                          null
                                        );

                                        handleSelectFuelChange(value);

                                        const updatedEnergy: any = [
                                          ...values.energy,
                                        ];
                                        updatedEnergy[index] = {
                                          ...updatedEnergy[index],
                                          vehicle_type: value,
                                          UOM: '',
                                          monthlyData:
                                            monthsForCurrentYear.reduce(
                                              (acc: any, month: any) => {
                                                acc[month] = { quantity: '' };
                                                return acc;
                                              },
                                              {}
                                            ),
                                        };

                                        setFormValues(updatedEnergy);
                                        setInitialFormValues(updatedEnergy);
                                      }}
                                      style={{ height: '40px' }}
                                    />
                                  </Form.Item>
                                </Col>
                              </>
                            )}
                            <Col xl={3} lg={3} md={12} sm={24}>
                              <Form.Item>
                                <div className="emission-form-label">UOM *</div>
                                <Select
                                  showSearch
                                  placeholder="UOM"
                                  options={
                                    energyConsumptionOptions
                                      ?.vehicleRelatedOptions?.[selectedFuels]
                                      ? energyConsumptionOptions.vehicleRelatedOptions[
                                          selectedFuels
                                        ].map((data: any) => ({
                                          label: data,
                                          value: data,
                                        }))
                                      : energyConsumptionOptions
                                            ?.sourceOfEnergy?.[selectedFuels] &&
                                          selectedFuels !==
                                            'Electricity for EVs'
                                        ? energyConsumptionOptions.sourceOfEnergy[
                                            selectedFuels
                                          ].map((data: any) => ({
                                            label: data,
                                            value: data,
                                          }))
                                        : []
                                  }
                                  value={values.energy[index].UOM}
                                  onChange={(value) => {
                                    setFieldValue(`energy.${index}.UOM`, value);

                                    fetchFeildValues(
                                      values.energy[index].source_of_energy,
                                      value,
                                      values.energy[index].vehicle_type,
                                      index
                                    );

                                    const updatedEnergy: any = [
                                      ...values.energy,
                                    ];
                                    updatedEnergy[index] = {
                                      ...updatedEnergy[index],
                                    };
                                    setFormValues(updatedEnergy);
                                    setInitialFormValues(updatedEnergy);
                                  }}
                                  style={{ height: '40px' }}
                                  className="emission-select"
                                />
                              </Form.Item>
                            </Col>
                            <Col xl={2} lg={2} md={2} sm={2}>
                              {index === values.energy.length - 1 && (
                                <>
                                  <div className="mt-2">
                                    <p className="invisible"></p>
                                  </div>
                                  <Button
                                    type="primary"
                                    style={{
                                      height: '40px',
                                      marginTop: '-10px',
                                      backgroundColor: '#036323',
                                      padding: '0 20px',
                                    }}
                                    onClick={() => {
                                      arrayHelpers.push({
                                        source_of_energy: '',
                                        vehicle_type: '',
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
                                      const setValue = [...initalFormValues];
                                      setValue[index] = values.energy[index];
                                      setInitialFormValues(setValue);
                                      setInitialFormValues(
                                        (initalFormValues: any) => [
                                          ...initalFormValues,
                                          {
                                            source_of_energy: '',
                                            vehicle_type: '',
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
                                </>
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
                                    style={{ marginTop: '15px' }}
                                  >
                                    <Form.Item>
                                      <Input
                                        name={`energy.${index}.monthlyData.${
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
                                        value={
                                          values.energy[index].monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ].quantity > 0
                                            ? values.energy[index].monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ].quantity
                                            : ''
                                        }
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
                                        onChange={(e) =>
                                          setFieldValue(
                                            `energy.${index}.monthlyData.${
                                              monthsForCurrentYear[idx - 1]
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
                                  style={{ marginTop: '15px' }}
                                >
                                  <Form.Item>
                                    <Input
                                      name={`energy.${index}.monthlyData.${
                                        monthsForCurrentYear.length - 1
                                      }.quantity`}
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
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === '-' ||
                                          e.key === 'e' ||
                                          e.key === 'E'
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      value={
                                        values.energy[index]?.monthlyData[
                                          monthsForCurrentYear[
                                            monthsForCurrentYear.length - 1
                                          ]
                                        ]?.quantity > 0
                                          ? values.energy[index]?.monthlyData[
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity
                                          : ''
                                      }
                                      type="number"
                                      onChange={(e) =>
                                        setFieldValue(
                                          `energy.${index}.monthlyData.${
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
                                <Row>
                                  {index !== 0 && (
                                    <Button
                                      danger={true}
                                      onClick={() => {
                                        const updatedFormValues = [
                                          ...initalFormValues,
                                        ];
                                        updatedFormValues.splice(index, 1);

                                        if (Array.isArray(fileLists)) {
                                          const updatedFileLists = [
                                            ...fileLists,
                                          ];
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
                                        marginTop: '16px',
                                        padding: '0 20px',
                                      }}
                                    >
                                      -
                                    </Button>
                                  )}
                                </Row>
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
                                      handleOnChangeEnergy(
                                        info,
                                        index,
                                        setFieldValue,
                                        values.energy
                                      );
                                      setIsUpload(false);
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
              {/* <DocProf size={21} /> */}
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

export default EnergyForm;
