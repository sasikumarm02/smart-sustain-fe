import { useEffect, useState } from 'react';
import { Row, Col, Spin, Form, Select, Input, Upload, message } from 'antd';
import { PageCardComponent, ButtonComponent } from '../../DesignLibrary';

import Styles from '../../Components/Emissions/Environment/Enviroment.module.scss';
import { isEmpty } from '../../Utils/isEmpty';
import { apiBaseUrl, get, post } from '../../Services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';

import { FieldArray, Formik } from 'formik';
import {
  getAllMonthsForCurrentYear,
  getMonthsInFinancialYear,
} from '../../Components/TabForms/StationaryForm';
import moment from 'moment';
import * as Yup from 'yup';

import Cancel from '../../assets/Svg/Emissions/Cancel';
import CloudIcon from '../../assets/Svg/Emissions/uploadColud';
import { removeElementByValue } from '../../Components/Emissions/Scope3/Helpers';
import File from '../../assets/Svg/Emissions/fileImg';
import { useSelector } from 'react-redux';

import { FileExcelFilled, FileWordFilled } from '@ant-design/icons';
import CustomUpload from '../../Components/FileHanddle/customUpload';
import CustomDownload from '../../Components/FileHanddle/customDownload';
import {
  transformEffluentsData,
  transformMobileData,
} from '../../Components/TabForms/CustomForm';

export default function Effluents({}: any) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );
  type FileList = { [key: string]: string };
  type FileLists = { [key: number]: FileList };

  const dropDownUom = ['liters', 'gallons', 'cubic meter'];
  const dropDownPrimary = [
    'Screening',
    'Sedimentation',
    'Floatation',
    'Filtration',
    'Coagulation and Flocculation',
    'Neutralization',
    'Disinfection',
  ];
  const dropDownSecondary = [
    'Activated Sludge Process',
    'Anaerobic Digestion',
    'Removal of BOD',
    'Removal of COD',
    'Trickling Filters',
    'Constructed Wetlands',
  ];
  const dropDownTertiary = [
    'Sand Filtration',
    'Membrane Filtration',
    'Activated Carbon Adsorption',
    'Chlorination',
    'Reverse Osmosis',
  ];

  const [filesList, setFilesList] = useState<any>([]);
  const [fileNames, setFileNames] = useState<any>([]);
  const [isDisable, setIsDisable] = useState(true);
  const [formValues, setFormValues] = useState<any>({});
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  type MonthlyData = {
    total_effluents_discharged: string;
    disclosure: any;
  };

  type FormValues = {
    entity_Id: string;
    primary: string[];
    secondary: string[];
    tertiary: string[];
    uom: string[];
    disclosure: string[];
    monthly_data: {
      [key: string]: MonthlyData;
    };
  };

  const initialValues: FormValues = {
    entity_Id: user.entity_Id,
    primary: [],
    secondary: [],
    tertiary: [],
    uom: [],
    disclosure: [],

    monthly_data: monthsForCurrentYear.reduce(
      (acc: Record<string, MonthlyData>, month: string) => {
        acc[month] = { total_effluents_discharged: '', disclosure: null };
        return acc;
      },
      {}
    ),
  };

  const [initalFormValues, setInitialFormValues] =
    useState<FormValues>(initialValues);

  const [prefilled, setPrefilled] = useState<any>([]);

  function setStationaryValues(res: any) {
    if (res === '') {
      setInitialFormValues(initialValues); // Reset to initial values
    } else {
      const data = {
        uom: res.uom,
        primary: res.primary,
        secondary: res.secondary,
        tertiary: res.tertiary,
        disclosure: res.disclosure,
        list_of_files: res.list_of_files,
        monthly_data: monthsForCurrentYear.reduce((acc: any, month: any) => {
          acc[month] = {
            total_effluents_discharged:
              res[month]?.total_effluents_discharged > 0
                ? res[month].total_effluents_discharged.toString()
                : '',
          };
          return acc;
        }, {}),
      };

      const setValue = { ...initalFormValues, ...data };

      setInitialFormValues(setValue);
      setPrefilled(setValue); // Update prefilled values
      setFormValues(setValue); // Update form values
      setFileNames(data.list_of_files);
      setFilesList(data.disclosure);
    }
  }

  const fetchFeildValues = (values: any) => {
    get(
      `/effluents/get_existing_monthly_data_for_effluents/?entity_Id=${user.entity_Id}&primary=${values.primary}&secondary=${values.secondary}&tertiary=${values.tertiary}&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          setStationaryValues(res?.response?.data);
        } else {
          const updatedValues = {
            ...initialValues, // Use the initial values as a base
            uom: values.uom || '', // Default to empty string if undefined
            primary: values.primary || '',
            secondary: values.secondary || '',
            tertiary: values.tertiary || '',
            disclosure: [],
            list_of_files: [],
            monthly_data: monthsForCurrentYear.reduce((acc: any, month) => {
              acc[month] = { total_effluents_discharged: '' }; // Default quantity to an empty string
              return acc;
            }, {}),
          };

          setFileNames([]);
          setInitialFormValues(updatedValues); // Set initial form values
          setPrefilled(updatedValues); // Set prefilled values
          setFormValues(updatedValues); // Update form values
          setFilesList([]);
        }
      })
      .catch((err: any) => {
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

  const removeFilefromList = (index: number) => {
    const newFileNames = fileNames.filter((_: any, i: any) => i !== index);
    const newFilesList = filesList.filter((_: any, i: any) => i !== index);
    setFileNames(newFileNames);
    setFilesList(newFilesList);
  };

  const handleRemove = (
    UIDToRemove: any,
    index: any,
    setFieldValue: any,
    fileName: any
  ) => {
    const updatedValues = { ...initalFormValues };

    if (updatedValues.disclosure && UIDToRemove) {
      removeElementByValue(updatedValues.disclosure, UIDToRemove);
    }

    setFieldValue(`monthly_data.disclosure`, updatedValues.disclosure);

    setInitialFormValues(updatedValues);
    setFormValues(updatedValues);

    message.success(`File removed successfully.`);
    removeFilefromList(index);

    if (updatedValues.disclosure.length === 0) {
      setIsDisable(true);
    }
  };

  const handleOnChangeStationary = (
    info: any,
    index: any,
    setFieldValue: any,
    values: any
  ) => {
    const updatedValues = { ...values };

    if (!isEmpty(info?.file?.status) && info?.file?.status === 'done') {
      const FileName = !isEmpty(info?.file?.name) && info?.file?.name;
      const UID =
        (!isEmpty(info?.file?.response?.response?.data) &&
          info?.file?.response?.response?.data) ||
        Math.floor(Math.random() * 100 + 1);

      if (!updatedValues.disclosure) {
        updatedValues.disclosure = [];
      }

      updatedValues.disclosure.push(UID);

      setFileNames([...fileNames, FileName]);
      setFilesList([...filesList, UID]);

      setFormValues(updatedValues);
      setInitialFormValues(updatedValues);

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

  const MonthlyDataSchema = Yup.object()
    .shape({
      total_effluents_discharged: Yup.number().nullable(),
      disclosure: Yup.string().nullable(), // Keep it as nullable without any tests
    })
    .test(
      'total-effluents-required',
      'Total effluents discharged is required if a value is present',
      (value) => {
        return (
          value?.total_effluents_discharged !== undefined ||
          value?.disclosure === null
        );
      }
    );

  const validationSchema = Yup.object()
    .shape({
      primary: Yup.array()
        .of(Yup.string().required('Primary type is required'))
        .min(1, 'At least one primary type is required'),
      secondary: Yup.array()
        .of(Yup.string().required('Secondary is required'))
        .min(1, 'At least one secondary type is required'),
      tertiary: Yup.string() // Changed from array to string since it should hold a single value
        .required('Tertiary is required'),
      uom: Yup.string().required('UOM is required'),
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
      (value: any) => {
        const monthlyData = value?.monthly_data || {};
        return Object.values(monthlyData).some(
          (entry: any) => entry?.total_effluents_discharged
        );
      }
    );

  useEffect(() => {
    const allDisclosuresPresent =
      initalFormValues.disclosure && initalFormValues.disclosure.length > 0;

    setIsDisable(!allDisclosuresPresent);
  }, [formValues, initalFormValues]);

  const [radioValue, setRadioValue] = useState(1);
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

  const DataEntryEffluents = ({ type }: { type: string }) => {
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
                  hierarchy="tertiary"
                  htmlType="reset"
                  onClick={() => {
                    navigate('/environment/effluents', {
                      state: {
                        currentFacility: facilitySelected,
                      },
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
          `effluents[${index}].disclosure`,
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
      effluents_data: EffluentsDatum[];
    }

    interface EffluentsDatum {
      uom: string;
      primary: any;
      secondary: any;
      tertiary: any;
      monthlyData: MonthlyDatum[];
    }

    interface MonthlyDatum {
      month: string;
      total_effluents_discharged: number | string;
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

      const { effluents_data } = response;

      const data = effluents_data.map((item: any) => {
        return {
          uom: item.UOM,
          primary: item.primary,
          secondary: item.secondary,
          tertiary: item.tertiary,
          disclosure: [],
          list_of_files: [],
          monthlyData: item.monthlyData.reduce((acc: any, current: any) => {
            acc[monthMapping[current.month.toUpperCase() as string] as string] =
              {
                quantity: current.quantity.toString() || '',
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
        `effluents[${index}].disclosure`,
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
                  effluents: initalFormValues,
                }}
                validationSchema={Yup.object().shape({
                  effluents: Yup.array().of(
                    Yup.object().shape({
                      primary: Yup.string().required('Primary is required'),
                      secondary: Yup.string().required('Secondary is required'),
                      tertiary: Yup.string().required('Tertiary is required'),
                      uom: Yup.string().required('UOM is required'),
                      // monthlyData: Yup.object().shape(
                      //   monthsForCurrentYear.reduce(
                      //     (acc: any, month: any) => {
                      //       acc[month] = MonthlyDataSchema;
                      //       return acc;
                      //     },
                      //     {}
                      //   )
                      // ),
                    })
                    // .test(
                    //   'at-least-one-quantity',
                    //   'At least one monthlyData entry must have a valid quantity present',
                    //   (value) => {
                    //     const monthlyData = value.monthlyData || {};
                    //     return Object.values(monthlyData).some((entry) => {
                    //       return entry.quantity;
                    //     });
                    //   }
                    // )
                  ),
                })}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  const data = transformEffluentsData(values?.effluents);
                  setSubmitting(true);
                  post('/effluents/create-data-for-effluents/', {
                    entity_Id: user.entity_Id,
                    facility_Id: facilitySelected,
                    effluent_data: data.effluents_data,
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
                          navigate('/environment/effluents', {
                            state: {
                              currentFacility: facilitySelected,
                            },
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
                            {values?.effluents?.map(
                              (items: any, index: number) => (
                                <div key={index}>
                                  {index === 0 && (
                                    <Row key={index}>
                                      {[
                                        'UOM',
                                        'Primary',
                                        'Secondary',
                                        'Tertiary',
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
                                        placeholder="UOM"
                                        disabled={true}
                                        value={values.effluents[index]?.uom}
                                        onChange={(value) =>
                                          setFieldValue(
                                            `effluents.${index}.uom`,
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
                                        placeholder="Primary"
                                        disabled={true}
                                        value={values.effluents[index]?.primary}
                                        onChange={(value) =>
                                          setFieldValue(
                                            `effluents.${index}.primary`,
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
                                        placeholder="Secondary"
                                        disabled={true}
                                        value={
                                          values.effluents[index]?.secondary
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `effluents.${index}.secondary`,
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
                                        placeholder="Tertiary"
                                        disabled={true}
                                        value={
                                          values.effluents[index]?.tertiary
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `effluents.${index}.tertiary`,
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
                                              onKeyDown={(e) => {
                                                if (
                                                  e.key === '-' ||
                                                  e.key === 'e'
                                                ) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              value={
                                                values.effluents[index]
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
                                                  `effluents.${index}.monthlyData.${
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
                                          {values.effluents[index]?.monthlyData[
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
                                              values.effluents[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[
                                                  monthsForCurrentYear.length -
                                                    1
                                                ]
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
                                                `effluents.${index}.monthlyData.${
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
                                        {values.effluents[index]?.monthlyData[
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
                                                values.effluents
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
                emission_type="Effluents"
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
      <PageCardComponent customClass={Styles.pageCardStyleForm}>
        <RadioWrapper label="Effluents" />
        {radioValue === 1 ? (
          <Row style={{ width: '100%' }} justify={'center'}>
            <Col span={24}>
              <Spin spinning={isLoading}>
                <Formik
                  initialValues={initalFormValues}
                  enableReinitialize={true}
                  // validationSchema={validationSchema}
                  onSubmit={async (values, { resetForm }) => {
                    setIsLoading(true);

                    const newValues = Object.entries(
                      !isEmpty(values.monthly_data) && values.monthly_data
                    )

                      .filter(([month, data]: [string, unknown]) => {
                        const effluentData = data as any; // assert the type
                        return (
                          effluentData.total_effluents_discharged !==
                            undefined &&
                          effluentData.total_effluents_discharged > 0
                        );
                      })
                      .map(([month, data]: [string, unknown]) => {
                        const effluentData = data as any;
                        const { disclosure, ...rest } = effluentData;
                        return {
                          month,
                          ...rest,
                        };
                      });
                    const { entity_Id, ...rest } = values;

                    post('effluents/create-data-for-effluents/', {
                      entity_Id,
                      facility_Id: facilitySelected,
                      effluent_data: [
                        {
                          ...rest,
                          monthly_data: newValues,
                        },
                      ],
                    })
                      .then((res: any) => {
                        if (
                          !isEmpty(res?.status) &&
                          res?.status === 'Success'
                        ) {
                          if (
                            !isEmpty(res?.response?.status) &&
                            res?.response?.status === true
                          ) {
                            openToast({
                              content: `${!isEmpty(res?.message) && res?.message}`,
                              type: 'success',
                            });
                            resetForm();
                            setIsLoading(false);
                            navigate('/environment/effluents', {
                              state: {
                                currentFacility: facilitySelected,
                              },
                            });
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
                                {[0].map((fuel: any, index: any) => (
                                  <div key={index}>
                                    {index === 0 && (
                                      <Row key={index} className="mt-2">
                                        <Col
                                          xl={5}
                                          lg={5}
                                          md={12}
                                          sm={24}
                                          key={index}
                                        >
                                          <div className="emission-form-label">
                                            UOM*
                                          </div>
                                        </Col>
                                        <Col
                                          xl={5}
                                          lg={5}
                                          md={12}
                                          sm={24}
                                          key={index}
                                        >
                                          <div className="emission-form-label">
                                            Primary*
                                          </div>
                                        </Col>
                                        <Col
                                          xl={5}
                                          lg={5}
                                          md={12}
                                          sm={24}
                                          key={index}
                                        >
                                          <div className="emission-form-label">
                                            Secondary*
                                          </div>
                                        </Col>
                                        <Col
                                          xl={5}
                                          lg={5}
                                          md={12}
                                          sm={24}
                                          key={index}
                                        >
                                          <div className="emission-form-label">
                                            Tertiary*
                                          </div>
                                        </Col>
                                      </Row>
                                    )}

                                    <Row
                                      className="form-grid mt-2"
                                      align="middle"
                                      gutter={12}
                                      key={index}
                                    >
                                      <Col xl={5} lg={5} md={12} sm={24}>
                                        <Form.Item>
                                          <Select
                                            showSearch
                                            placeholder="UOM"
                                            tagRender={({
                                              label,
                                              value,
                                              closable,
                                              onClose,
                                            }) => (
                                              <div
                                                className={
                                                  Styles.selectBoxDisplay
                                                }
                                              >
                                                <span
                                                  onClick={onClose}
                                                  className={
                                                    Styles.selectBoxMargin
                                                  }
                                                >
                                                  {label}
                                                </span>
                                              </div>
                                            )}
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
                                            value={values?.uom}
                                            onChange={(value) => {
                                              setFieldValue(`uom`, value);
                                              removeFilefromList(index);
                                              const updatedStationary: any = {
                                                ...values,
                                              };

                                              updatedStationary.uom = value;
                                              updatedStationary.disclosure = [];

                                              setInitialFormValues(
                                                updatedStationary
                                              );
                                              setFormValues(updatedStationary);
                                            }}
                                            className={Styles.fuelTypeHeight}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xl={5} lg={5} md={12} sm={24}>
                                        <Form.Item>
                                          <Select
                                            showSearch
                                            placeholder="Primary"
                                            tagRender={({
                                              label,
                                              value,
                                              closable,
                                              onClose,
                                            }) =>
                                              value ===
                                              values.primary[
                                                values.primary.length - 1
                                              ] ? (
                                                <div>
                                                  <span
                                                    onClick={onClose}
                                                    className={
                                                      Styles.selectBoxMargin
                                                    }
                                                  >
                                                    {label}
                                                  </span>
                                                </div>
                                              ) : (
                                                <div
                                                  className={
                                                    Styles.selectBoxDisplay
                                                  }
                                                ></div>
                                              )
                                            }
                                            options={
                                              !isEmpty(dropDownPrimary)
                                                ? dropDownPrimary.map(
                                                    (data: any) => ({
                                                      label: data,
                                                      value: data,
                                                    })
                                                  )
                                                : []
                                            }
                                            value={values?.primary}
                                            onChange={(value) => {
                                              setFieldValue(`primary`, [value]);
                                              const updatedStationary: any = {
                                                ...values,
                                              };

                                              updatedStationary.primary = [
                                                value,
                                              ];

                                              setInitialFormValues(
                                                updatedStationary
                                              );
                                              setFormValues(updatedStationary);
                                              if (
                                                updatedStationary.secondary !==
                                                  '' &&
                                                updatedStationary.teritary !==
                                                  ''
                                              ) {
                                                fetchFeildValues(
                                                  updatedStationary
                                                );
                                              }
                                            }}
                                            className={Styles.fuelTypeHeight}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col xl={5} lg={5} md={12} sm={24}>
                                        <Form.Item>
                                          <Select
                                            showSearch
                                            placeholder="Secondary"
                                            tagRender={({
                                              label,
                                              value,
                                              closable,
                                              onClose,
                                            }) =>
                                              value ===
                                              values?.secondary[
                                                values?.secondary?.length - 1
                                              ] ? (
                                                <div>
                                                  <span
                                                    onClick={onClose}
                                                    className={
                                                      Styles.selectBoxMargin
                                                    }
                                                  >
                                                    {label}
                                                  </span>
                                                </div>
                                              ) : (
                                                <div
                                                  className={
                                                    Styles.selectBoxDisplay
                                                  }
                                                ></div>
                                              )
                                            }
                                            options={
                                              !isEmpty(dropDownSecondary)
                                                ? dropDownSecondary.map(
                                                    (data: any) => ({
                                                      label: data,
                                                      value: data,
                                                    })
                                                  )
                                                : []
                                            }
                                            value={values?.secondary}
                                            onChange={(value) => {
                                              setFieldValue(`secondary`, [
                                                value,
                                              ]);
                                              const updatedStationary: any = {
                                                ...values,
                                              };

                                              updatedStationary.secondary = [
                                                value,
                                              ];

                                              setInitialFormValues(
                                                updatedStationary
                                              );
                                              setFormValues(updatedStationary);
                                              if (
                                                updatedStationary.primary !==
                                                  '' &&
                                                updatedStationary.teritary !==
                                                  ''
                                              ) {
                                                fetchFeildValues(
                                                  updatedStationary
                                                );
                                              }
                                            }}
                                            className={Styles.fuelTypeHeight}
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col xl={5} lg={5} md={12} sm={24}>
                                        <Form.Item>
                                          <Select
                                            showSearch
                                            placeholder="Tertiary"
                                            tagRender={({
                                              label,
                                              value,
                                              closable,
                                              onClose,
                                            }) =>
                                              value ===
                                              values?.tertiary[
                                                values?.tertiary?.length - 1
                                              ] ? (
                                                <div>
                                                  <span
                                                    onClick={onClose}
                                                    className={
                                                      Styles.selectBoxMargin
                                                    }
                                                  >
                                                    {label}
                                                  </span>
                                                </div>
                                              ) : (
                                                <div
                                                  className={
                                                    Styles.selectBoxDisplay
                                                  }
                                                ></div>
                                              )
                                            }
                                            options={
                                              dropDownTertiary
                                                ? dropDownTertiary.map(
                                                    (data: any) => ({
                                                      label: data,
                                                      value: data,
                                                    })
                                                  )
                                                : []
                                            }
                                            value={values?.tertiary}
                                            onChange={(value) => {
                                              setFieldValue(`tertiary`, [
                                                value,
                                              ]);
                                              const updatedStationary: any = {
                                                ...values,
                                              };

                                              updatedStationary.tertiary = [
                                                value,
                                              ];

                                              setInitialFormValues(
                                                updatedStationary
                                              );
                                              if (
                                                updatedStationary.secondary !==
                                                  '' &&
                                                updatedStationary.teritary !==
                                                  ''
                                              ) {
                                                fetchFeildValues(
                                                  updatedStationary
                                                );
                                              }
                                              setFormValues(updatedStationary);
                                            }}
                                            className={Styles.fuelTypeHeight}
                                          />
                                        </Form.Item>
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
                                                  Total Effluents <br></br>
                                                  Discharged :
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
                                                      name={`monthly_data.${
                                                        monthsForCurrentYear[
                                                          idx - 1
                                                        ]
                                                      }.total_effluents_discharged`}
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
                                                        (prefilled?.monthly_data &&
                                                          prefilled
                                                            ?.monthly_data[
                                                            monthsForCurrentYear[
                                                              idx - 1
                                                            ]
                                                          ]
                                                            ?.total_effluents_discharged >
                                                            0) ||
                                                        false
                                                      }
                                                      type="number"
                                                      value={
                                                        values?.monthly_data[
                                                          monthsForCurrentYear[
                                                            idx - 1
                                                          ]
                                                        ]
                                                          ?.total_effluents_discharged
                                                      }
                                                      onChange={(e) => {
                                                        setFieldValue(
                                                          `monthly_data[${
                                                            monthsForCurrentYear[
                                                              idx - 1
                                                            ]
                                                          }].total_effluents_discharged`,
                                                          e.target.value
                                                        );
                                                        const monthKey =
                                                          monthsForCurrentYear[
                                                            idx - 1
                                                          ];

                                                        const updatedStationary: any =
                                                          {
                                                            ...values,
                                                            monthly_data: {
                                                              ...values.monthly_data,
                                                              [monthKey]: {
                                                                ...values
                                                                  .monthly_data[
                                                                  monthKey
                                                                ],
                                                                total_effluents_discharged:
                                                                  e.target
                                                                    .value,
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
                                                name={`monthly_data.${
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                }.total_effluents_discharged`}
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
                                                  values?.monthly_data[
                                                    monthsForCurrentYear[
                                                      monthsForCurrentYear.length -
                                                        1
                                                    ]
                                                  ]?.total_effluents_discharged
                                                }
                                                disabled={
                                                  (prefilled?.monthly_data &&
                                                    prefilled?.monthly_data[
                                                      monthsForCurrentYear[
                                                        monthsForCurrentYear.length -
                                                          1
                                                      ]
                                                    ]
                                                      ?.total_effluents_discharged >
                                                      0) ||
                                                  false
                                                }
                                                onChange={(e) =>
                                                  setFieldValue(
                                                    `monthly_data.${
                                                      monthsForCurrentYear[
                                                        monthsForCurrentYear.length -
                                                          1
                                                      ]
                                                    }.total_effluents_discharged`,
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
                                    </Row>
                                    <Row
                                      className="emission-form-label"
                                      style={{ marginTop: '25px' }}
                                    >
                                      <Col xl={2} lg={2} md={2}>
                                        {' '}
                                        Attachments :
                                      </Col>
                                      <Col className="mx-2">
                                        <Form.Item>
                                          <div className={Styles.uploadWrap}>
                                            <Upload
                                              className={`scope-form-upload`}
                                              onChange={(info) => {
                                                handleOnChangeStationary(
                                                  info,
                                                  index,
                                                  setFieldValue,
                                                  values
                                                );
                                              }}
                                              showUploadList={false}
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
                                                  !isEmpty(fileNames) &&
                                                  fileNames.map(
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

                                                            handleRemove(
                                                              innerArray,
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
                                ))}
                              </>
                            )}
                          </FieldArray>
                        </div>
                        <Row justify="end">
                          <Form.Item>
                            <Row gutter={14}>
                              <Col>
                                <ButtonComponent
                                  hierarchy="tertiary"
                                  htmlType="reset"
                                  onClick={() => {
                                    navigate('/environment/effluents', {
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
                                    setInitialFormValues(initialValues);
                                    resetForm();
                                    setPrefilled([
                                      {
                                        primary: '',
                                        secondary: '',
                                        tertiary: '',
                                        uom: '',
                                        disclosure: [],
                                        list_of_files: [],
                                        monthlyData:
                                          monthsForCurrentYear.reduce(
                                            (acc: any, month: any) => {
                                              acc[month] = {
                                                total_effluents_discharged: '',
                                              };
                                              return acc;
                                            },
                                            {}
                                          ),
                                      },
                                    ]);
                                    setFileLists({});
                                    setFileNames([]);
                                    setFilesList([]);
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
                                  disabled={isDisable}
                                >
                                  Submit
                                </ButtonComponent>
                              </Col>
                            </Row>
                          </Form.Item>
                        </Row>
                      </Form>
                    );
                  }}
                </Formik>
              </Spin>
            </Col>
          </Row>
        ) : (
          <DataEntryEffluents type={'Effluents'} />
        )}
      </PageCardComponent>
    </>
  );
}
