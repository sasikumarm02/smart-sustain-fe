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
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import {
  MonthlyDataSchema,
  getAllMonthsForCurrentYear,
  getMonthsInFinancialYear,
} from './StationaryForm';
import { transformFugitiveData } from './CustomForm';
import { ButtonComponent } from '../../DesignLibrary';
import { removeElementByValue } from '../Emissions/Scope3/Helpers';
import Cancel from '../../assets/Svg/Emissions/Cancel';
import File from '../../assets/Svg/Emissions/fileImg';
import { isEmpty } from 'lodash';
import CloudIcon from '../../assets/Svg/Emissions/uploadColud';

type FileList = { [key: string]: string };
type FileLists = { [key: number]: FileList };

const FugitiveForm = ({ tabKey }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const [selectedFuels, setSelectedFuels] = useState('');
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );
  const processOptions = useSelector((state: any) => state.processOptions);
  const [isupload, setIsUpload] = useState(true);
  const [initalFormValues, setInitialFormValues] = useState<any>([
    {
      equipmentType: '',
      gas_or_refrigerant: '',
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
  const [filesList, setFilesList] = useState<any>({});
  const [fileNames, setFileNames] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);
  const [formValues, setFormValues] = useState<any>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const removeFilefromList = (index: any) => {
    const NewObj = fileNames;
    for (let key in NewObj) {
      if (key == index) {
        delete NewObj[key];
      }
    }
    setFileNames(NewObj);
  };

  useEffect(() => {
    const allDisclosuresPresent = initalFormValues.every(
      (item: any) => item.disclosure && item.disclosure.length > 0
    );

    setIsDisable(!allDisclosuresPresent);
  }, [formValues, initalFormValues]);

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
        `Fugitive[${index}].disclosure`,
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
                hierarchy="secondary"
                htmlType="reset"
                onClick={() => {
                  resetForm();
                  setInitialFormValues([
                    {
                      equipmentType: '',
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
                      vehicleType: '',
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

  const fetchFeildValues = (
    equipment: string,
    uom: string,
    gas: string,
    index: Number
  ) => {
    setIsLoading(true);
    get(
      `/Emissions/get_fugitive_data/?entity_Id=${user.entity_Id}&equipmentType=${equipment}&uom=${uom}&gas_or_refrigerant=${gas}&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          fetchProcessValues(res?.response?.data, index);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        openToast({
          content: `${err?.message}`,
          type: 'error',
        });
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchProcessValues = (res: any, index: any) => {
    if (res === '') {
      setInitialFormValues(initalFormValues);
    } else {
      const data = {
        equipmentType: res.equipment_type,
        gas_or_refrigerant: res.gas_or_refrigerant,
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

  return (
    <Spin spinning={isLoading}>
      <Formik
        initialValues={{
          entity_Id: '',
          Fugitive: initalFormValues,
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          Fugitive: Yup.array().of(
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
          const data = transformFugitiveData(values.Fugitive);
          setIsLoading(true);
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
                <FieldArray name="Fugitive">
                  {(arrayHelpers) => (
                    <>
                      {values.Fugitive.map((fuel: any, index: any) => (
                        <>
                          <Row className="form-grid" gutter={12} key={index}>
                            <Col xl={5} lg={4} md={12} sm={24}>
                              <Form.Item>
                                <p className={Styles.fieldLabel}>
                                  Equipment Type*
                                </p>
                                <Input
                                  name={`Fugitive.${index}.equipmentType`}
                                  placeholder="Enter Equipment"
                                  value={values.Fugitive[index].equipmentType}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `Fugitive.${index}.equipmentType`,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    height: '40px',
                                    marginTop: '10px',
                                    width: '100%',
                                  }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xl={5} lg={4} md={12} sm={24}>
                              <Form.Item
                              // name={`Fugitive.${index}.gas_or_refrigerant`}
                              >
                                <p className={Styles.fieldLabel}>
                                  Gas/Refrigerant*
                                </p>
                                <Select
                                  showSearch
                                  placeholder="Gas/Refrigerant"
                                  options={
                                    processOptions?.gasOrRefrigerant
                                      ? Object.keys(
                                          processOptions.gasOrRefrigerant
                                        )
                                          .sort()
                                          .map((data) => ({
                                            label: data,
                                            value: data,
                                          }))
                                      : []
                                  }
                                  value={
                                    values.Fugitive[index].gas_or_refrigerant
                                  }
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
                                      `Fugitive.${index}.gas_or_refrigerant`,
                                      value
                                    );
                                    setFieldValue(
                                      `Fugitive[${index}].UOM`,
                                      null
                                    );
                                    handleSelectFuelChange(value);
                                    removeFilefromList(index);
                                    const updatedFugitive: any = [
                                      ...values.Fugitive,
                                    ];
                                    updatedFugitive[index] = {
                                      ...updatedFugitive[index],
                                      gas_or_refrigerant: value,
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
                                    setInitialFormValues(updatedFugitive);
                                    setFormValues(updatedFugitive);
                                    monthsForCurrentYear?.map((month, idx) => {
                                      setFieldValue(
                                        `Fugitive[${index}].monthlyData[${
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

                            <Col xl={3} lg={2} md={12} sm={24}>
                              <Form.Item>
                                <p className={Styles.fieldLabel}>UOM*</p>
                                <Select
                                  showSearch
                                  placeholder="UOM"
                                  options={
                                    processOptions?.gasOrRefrigerant?.[
                                      selectedFuels
                                    ]
                                      ? processOptions.gasOrRefrigerant[
                                          selectedFuels
                                        ].map((data: any) => ({
                                          label: data,
                                          value: data,
                                        }))
                                      : []
                                  }
                                  value={values.Fugitive[index].UOM}
                                  onChange={(value) => {
                                    setFieldValue(
                                      `Fugitive.${index}.UOM`,
                                      value
                                    );
                                    fetchFeildValues(
                                      values.Fugitive[index].equipmentType,
                                      value,
                                      values.Fugitive[index].gas_or_refrigerant,
                                      index
                                    );
                                    const updatedStationary: any = [
                                      ...values.Fugitive,
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
                              {index === values.Fugitive.length - 1 && (
                                <Button
                                  type="primary"
                                  style={{
                                    height: '40px',
                                    marginTop: '10px',
                                    backgroundColor: '#036323',
                                  }}
                                  onClick={() => {
                                    const setValue = [...initalFormValues];
                                    setValue[index] = values.Fugitive[index];
                                    setInitialFormValues(setValue);
                                    setInitialFormValues(
                                      (initalFormValues: any) => [
                                        ...initalFormValues,
                                        {
                                          equipmentType: '',
                                          gas_or_refrigerant: '',
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
                                        name={`Fugitive.${index}.monthlyData.${
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
                                          values.Fugitive[index]?.monthlyData[
                                            monthsForCurrentYear[idx - 1]
                                          ]?.quantity === '0'
                                            ? ''
                                            : values.Fugitive[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity
                                        }
                                        type="number"
                                        onChange={(e) =>
                                          setFieldValue(
                                            `Fugitive.${index}.monthlyData.${
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
                                  style={{ marginTop: '20px' }}
                                >
                                  <Form.Item>
                                    <Input
                                      name={`Fugitive.${index}.monthlyData.${
                                        monthsForCurrentYear.length - 1
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
                                        values.Fugitive[index]?.monthlyData[
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
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity
                                          : false
                                      }
                                      onChange={(e) =>
                                        setFieldValue(
                                          `Fugitive.${index}.monthlyData.${
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
                                      handleOnChangeFugitive(
                                        info,
                                        index,
                                        setFieldValue,
                                        values.Fugitive
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

export default FugitiveForm;
