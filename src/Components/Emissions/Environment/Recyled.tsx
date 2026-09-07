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
import { apiBaseUrl, get, post } from '../../../Services';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../Hooks/useNotification';
import Styles from '../../../Modules/UserScreen/ProcessEmission/processEmission.module.scss';
import moment from 'moment';
import { useAuth } from '../../../Hooks/useAuth';
import { useSelector } from 'react-redux';
// import { transformData } from './.CustomForm';
import { ButtonComponent } from '../../../DesignLibrary';
import Cancel from '../../../assets/Svg/Emissions/Cancel';
import File from '../../../assets/Svg/Emissions/fileImg';
import CloudIcon from '../../../assets/Svg/Emissions/uploadColud';
import { removeElementByValue } from '../Scope3/Helpers';
import { isEmpty } from '../../../Utils/isEmpty';
import { getMonthsInFinancialYear } from '../../TabForms/StationaryForm';
import { FileExcelFilled, FileWordFilled } from '@ant-design/icons';
import CustomUpload from '../../FileHanddle/customUpload';
import CustomDownload from '../../FileHanddle/customDownload';
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

export const MonthlyDataSchema = Yup.object()
  .shape({
    quantity: Yup.number().nullable(),
  })
  .test(
    'at-least-one-entry',
    'At least one quantity must be present.',
    (value: any) => {
      if (value && value.quantity !== null) {
        return true;
      }
      return false;
    }
  );

const RecyledForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const [fileLists, setFileLists] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
  const monthsForCurrentYear = getMonthsInFinancialYear(
    userLogged?.financial_year
  );

  const [selectedWasteCat, setSelectedWasteCat] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState('');
  const [selectedProcess, setSelectedProcess] = useState('');

  const handleSelect = (value: any, setselected: any) => {
    setselected(value);
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
  const [formValues, setFormValues] = useState<any>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
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
      setInitialFormValues(updatedValues);

      setFieldValue(
        `waste_data[${index}].disclosure`,
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
  const [prefilled, setPrefilled] = useState<any>([]);
  const [initalFormValues, setInitialFormValues] = useState<any>([
    {
      Waste_Category: '',
      waste_type: '',
      Recycling_Process: '',
      disclosure: [],
      list_of_files: [],
      monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
        acc[month] = { quantity: '' };
        return acc;
      }, {}),
    },
  ]);

  const fetchFeildValues = (index: any) => {
    get(
      `/waste/get_prefetched_waste_data/?entity_Id=${user.entity_Id}&waste_category=${selectedWasteCat}&waste_type=${selectedWasteType}&process=${selectedProcess}&waste_management_type=Recycled&facility_Id=${facilitySelected}`
    )
      .then((res: any) => {
        if (res?.response?.status !== false) {
          setStationaryValues(res?.response?.data, index);
        } else {
          const updatedData = [...initalFormValues];
          updatedData[index] = {
            ...updatedData[index],
            disclosure: [],
            list_of_files: [],
            monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
              acc[month] = { quantity: '' };
              return acc;
            }, {}),
          };

          setInitialFormValues(updatedData);
          setPrefilled(updatedData);
          setFileNames({
            ...fileNames,
            [index]: {},
          });
          setFilesList({
            ...filesList,
            [index]: {},
          });
        }
      })
      .catch((err) => {
        openToast({
          content: `${err?.message}`,
          type: 'error',
        });
      });
  };

  useEffect(() => {
    const allDisclosuresPresent = formValues.every(
      (item: any) => item.disclosure && item.disclosure.length > 0
    );
    setIsDisable(!allDisclosuresPresent);
  }, [formValues, initalFormValues]);

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
  function transformFormikExcelResponse(formikResponse: any) {
    return {
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected,
      waste_data: formikResponse.waste_data.map((data: any) => ({
        waste_category: data.waste_category,
        waste_type: data.waste_type,
        waste_management_type: 'Recycled',
        process: data.recycling_process,
        disclosure: data.disclosure,
        monthly_data: Object.entries(data.monthlyData)
          .filter(([month, details]: any) => details.quantity)
          .map(([month, details]: any) => ({
            waste_in_tonnes: details.quantity.toString(),
            month: month,
          })),
      })),
    };
  }

  function transformFormikResponse(formikResponse: any) {
    return {
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected,
      waste_data: formikResponse.waste_data.map((data: any) => ({
        waste_category: data?.Waste_Category,
        waste_type: data.waste_type,
        waste_management_type: 'Recycled',
        process: data.Recycling_Process,
        disclosure: data.disclosure,
        monthly_data: Object.entries(data.monthlyData)
          .filter(([month, details]: any) => details.quantity)
          .map(([month, details]: any) => ({
            waste_in_tonnes: details.quantity.toString(),
            month: month,
          })),
      })),
    };
  }

  const dropDownWasteCategory = [
    'Biodegradable',
    'Plastic',
    'E-Waste',
    'Produced Water',
    'Construction/ Demolition',
    'Radio Active Waste',
    'Non-degradable Chemical Waste',
    'Food Waste',
    'Metal Scraps',
  ];

  const dropDownWasteType = ['Hazardous', 'Non-hazardous'];

  function setStationaryValues(res: any, index: any) {
    if (res === '') {
      setInitialFormValues(initalFormValues);
    } else {
      const data = {
        Waste_Category: res.waste_category,
        waste_type: res.waste_type,
        Recycling_Process: res.process,
        disclosure: res.disclosure,
        list_of_files: res.list_of_files,
        UOM: res.uom,
        monthlyData: monthsForCurrentYear.reduce((acc: any, month: any) => {
          acc[month] = {
            quantity: res[month]?.waste_in_tonnes?.toString(),
            disclosure: res[month].disclosure,
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
      `waste_data[${index}].disclosure`,
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
      <Row justify="end" style={{ marginTop: '15px' }}>
        <Form.Item>
          <Row gutter={14}>
            <Col>
              <ButtonComponent
                hierarchy="tertiary"
                htmlType="reset"
                onClick={() => {
                  navigate('/environment/waste-management', {
                    state: {
                      tab: 'Recycled',
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
                      Waste_Category: '',
                      waste_type: '',
                      Recycling_Process: '',
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
                      Waste_Category: '',
                      waste_type: '',
                      Recycling_Process: '',
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

  const RadioWrapper = ({ label }: any) => {
    return (
      <>
        <Row className="py-2 mb-4">
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
        </Row>
      </>
    );
  };

  const [radioValue, setRadioValue] = useState(1);

  const DataEntryRecycle = () => {
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
                    navigate('/environment/waste-management', {
                      state: {
                        tab: 'Recycled',
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
          `waste_data[${index}].disclosure`,
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
      waste_recycle_data: MobileDatum[];
    }

    interface MobileDatum {
      waste_category: string;
      waste_type: string;
      recycling_process: String;
      monthlyData: MonthlyDatum[];
    }

    interface MonthlyDatum {
      month: string;
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

      const { waste_recycle_data } = response;
      const data = waste_recycle_data.map((item) => {
        return {
          waste_category: item.waste_category,
          waste_type: item.waste_type,
          recycling_process: item.recycling_process,
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
        `waste_data[${index}].disclosure`,
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
                <CustomDownload type={'Waste_Management_Recycled'} />
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
                  waste_data: initalFormValues,
                }}
                validationSchema={Yup.object().shape({
                  waste_data: Yup.array().of(
                    Yup.object()
                      .shape({
                        waste_category: Yup.string().required(
                          'Waste_Category type is required'
                        ),
                        waste_type: Yup.string().required(
                          'waste_type is required'
                        ),
                        recycling_process: Yup.string().required(
                          'Recycling_Process is required'
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
                  const data = transformFormikExcelResponse(values);

                  setSubmitting(true);
                  post('/waste/create_waste_generation/', data)
                    .then((res: any) => {
                      if (res?.status === 'Success') {
                        if (res?.response?.status === true) {
                          openToast({
                            content: `${res?.message}`,
                            type: 'success',
                          });
                          resetForm();
                          setSubmitting(false);
                          navigate('/environment/waste-management', {
                            state: {
                              tab: 'Recycled',
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
                      <FieldArray name="waste">
                        {(arrayHelpers) => (
                          <>
                            {values?.waste_data?.map(
                              (items: any, index: number) => (
                                <div key={index}>
                                  {index === 0 && (
                                    <Row key={index}>
                                      {[
                                        'Waste Category',
                                        'Waste Type',
                                        'Recycling Process',
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
                                        placeholder="Select Waste Category"
                                        disabled={true}
                                        value={
                                          values?.waste_data[index]
                                            ?.Waste_Category
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `waste_data.${index}.Waste_Category`,
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
                                        placeholder="Waste Type"
                                        disabled={true}
                                        value={
                                          values.waste_data[index].waste_type
                                        }
                                        onChange={(value) =>
                                          setFieldValue(
                                            `waste_data[${index}].waste_type`,
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
                                      <Input
                                        type="text"
                                        placeholder="Recycle Process"
                                        value={
                                          values.waste_data[index]
                                            .recycling_process
                                        }
                                        disabled={true}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `waste_data[${index}].recycling_process`,
                                            e.target.value
                                          );
                                        }}
                                        style={{ height: '40px' }}
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
                                                values.waste_data[index]
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
                                                  `waste_data.${index}.monthlyData.${
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
                                          {values.waste_data[index]
                                            ?.monthlyData[
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
                                              values.waste_data[index]
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
                                                `waste_data.${index}.monthlyData.${
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
                                        {values.waste_data[index]?.monthlyData[
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
                                              handleOnChangeMobile(
                                                info,
                                                index,
                                                setFieldValue,
                                                values.waste_data
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
                emission_type="Waste Recycle"
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
      <RadioWrapper label="Stationary Combustion" />
      {radioValue === 1 ? (
        <Spin spinning={isLoading}>
          <Formik
            initialValues={{
              entity_Id: '',
              waste_data: initalFormValues,
            }}
            enableReinitialize={true}
            validationSchema={Yup.object().shape({
              waste_data: Yup.array().of(
                Yup.object()
                  .shape({
                    Waste_Category: Yup.string().required(
                      'Waste_Category type is required'
                    ),
                    waste_type: Yup.string().required('waste_type is required'),
                    Recycling_Process: Yup.string().required(
                      'Recycling Process is required'
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
              const data = transformFormikResponse(values);
              setIsLoading(true);
              post('/waste/create_waste_generation/', data)
                .then((res: any) => {
                  if (res?.status === 'Success') {
                    if (res?.response?.status === true) {
                      openToast({
                        content: `${res?.message}`,
                        type: 'success',
                      });
                      resetForm();
                      setIsLoading(false);
                      navigate('/environment/waste-management', {
                        state: {
                          tab: 'Recycled',
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
                  }}
                >
                  <div className={Styles.formFooter}>
                    <FieldArray name="waste">
                      {(arrayHelpers) => (
                        <>
                          {values?.waste_data?.map((waste: any, index: any) => (
                            <div key={index}>
                              {index === 0 && (
                                <Row key={index}>
                                  <Col span={5} key={index}>
                                    <div className="emission-form-label">
                                      Waste Category *
                                    </div>
                                  </Col>
                                  <Col span={4} key={index}>
                                    <div className="emission-form-label">
                                      Waste Type *
                                    </div>
                                  </Col>
                                  <Col span={4} key={index}>
                                    <div className="emission-form-label">
                                      Recycling Process *
                                    </div>
                                  </Col>
                                </Row>
                              )}

                              <Row
                                className="form-grid"
                                align="middle"
                                gutter={12}
                                key={index}
                              >
                                <Col xl={5} lg={5} md={12} sm={24}>
                                  <Form.Item>
                                    <Select
                                      showSearch
                                      placeholder="Select Waste Category"
                                      options={
                                        dropDownWasteCategory
                                          ? dropDownWasteCategory.map(
                                              (data) => ({
                                                label: data,
                                                value: data,
                                              })
                                            )
                                          : []
                                      }
                                      value={
                                        values?.waste_data[index]
                                          ?.Waste_Category
                                      }
                                      onChange={(value) => {
                                        setFieldValue(
                                          `waste_data[${index}].Waste_Category`,
                                          value
                                        );
                                        setFieldValue(
                                          `waste_data[${index}].waste_type`,
                                          ''
                                        );
                                        handleSelect(
                                          value,
                                          setSelectedWasteCat
                                        );
                                        removeFilefromList(index);

                                        const updatedStationary: any = [
                                          ...values.waste_data,
                                        ];
                                        updatedStationary[index] = {
                                          ...updatedStationary[index],
                                          Waste_Category: value,
                                          waste_type: '',
                                          Recycling_Process: '',
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
                                        };
                                        setInitialFormValues(updatedStationary);
                                        setFormValues(updatedStationary);
                                        monthsForCurrentYear?.map(
                                          (month, idx) => {
                                            setFieldValue(
                                              `waste_data[${index}].monthlyData[${
                                                monthsForCurrentYear[idx - 1]
                                              }].quantity`,
                                              ''
                                            );
                                          }
                                        );
                                      }}
                                      style={{ height: '40px' }}
                                      className="emission-select"
                                    />
                                  </Form.Item>
                                </Col>

                                <Col xl={4} lg={4} md={12} sm={24}>
                                  <Form.Item>
                                    <Select
                                      showSearch
                                      placeholder="Waste Type"
                                      options={
                                        dropDownWasteType
                                          ? dropDownWasteType.map((data) => ({
                                              label: data,
                                              value: data,
                                            }))
                                          : []
                                      }
                                      value={
                                        values.waste_data[index].waste_type
                                      }
                                      onChange={(value) => {
                                        const updatePrefill = [...prefilled];
                                        updatePrefill[index] = {
                                          ...updatePrefill[index],
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
                                        };
                                        removeFilefromList(index);
                                        setPrefilled(updatePrefill);
                                        setFieldValue(
                                          `waste_data[${index}].waste_type`,
                                          value
                                        );
                                        handleSelect(
                                          value,
                                          setSelectedWasteType
                                        );
                                        const updatedStationary: any = [
                                          ...values.waste_data,
                                        ];
                                        updatedStationary[index] = {
                                          ...updatedStationary[index],
                                          waste_type: value,
                                          Recycling_Process: '',
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
                                        };
                                        setFormValues(updatedStationary);
                                        setInitialFormValues(updatedStationary);
                                      }}
                                      style={{ height: '40px' }}
                                      className="emission-select"
                                    />
                                  </Form.Item>
                                </Col>

                                <Col xl={4} lg={4} md={12} sm={24}>
                                  <Form.Item>
                                    <Input
                                      type="text"
                                      placeholder="Recycling Process"
                                      value={
                                        values.waste_data[index]
                                          .Recycling_Process
                                      }
                                      onChange={(e) => {
                                        setFieldValue(
                                          `waste_data[${index}].Recycling_Process`,
                                          e.target.value
                                        );
                                        handleSelect(
                                          e.target.value.toLowerCase().trim(),
                                          setSelectedProcess
                                        );

                                        const updatedStationary: any = [
                                          ...values.waste_data,
                                        ];
                                        updatedStationary[index] = {
                                          ...updatedStationary[index],
                                          Recycling_Process: e.target.value,
                                        };
                                        setFormValues(updatedStationary);
                                        setInitialFormValues(updatedStationary);
                                      }}
                                      onBlur={() => {
                                        fetchFeildValues(index);
                                      }}
                                      style={{ height: '40px' }}
                                      className="emission-select"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xl={2} lg={2} md={2} sm={2}>
                                  {index === values?.waste_data?.length - 1 && (
                                    <Button
                                      style={{
                                        marginBottom: '10px',
                                        height: '40px',
                                        backgroundColor: '#036323',
                                      }}
                                      type="primary"
                                      onClick={() => {
                                        arrayHelpers.push({
                                          Waste_Category: '',
                                          waste_type: '',
                                          Recycling_Process: '',
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
                                        setValue[index] =
                                          values.waste_data[index];
                                        setInitialFormValues(setValue);
                                        setInitialFormValues(
                                          (initalFormValues: any) => [
                                            ...initalFormValues,
                                            {
                                              Waste_Category: '',
                                              waste_type: '',
                                              Recycling_Process: '',
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

                              <Row gutter={10}>
                                {monthsForCurrentYear?.map((month, idx) => {
                                  return idx === 0 ? (
                                    <Col xl={2} lg={2} md={2}>
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
                                            disabled={
                                              prefilled.length > 0 &&
                                              Number(
                                                prefilled[index]?.monthlyData[
                                                  monthsForCurrentYear[idx - 1]
                                                ]?.quantity
                                              ) > 0
                                                ? prefilled[index]?.monthlyData[
                                                    monthsForCurrentYear[
                                                      idx - 1
                                                    ]
                                                  ]?.quantity
                                                : false
                                            }
                                            name={`waste_data.${index}.monthlyData.${
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
                                            type="number"
                                            value={
                                              values.waste_data[index]
                                                ?.monthlyData[
                                                monthsForCurrentYear[idx - 1]
                                              ]?.quantity > 0
                                                ? values.waste_data[index]
                                                    ?.monthlyData[
                                                    monthsForCurrentYear[
                                                      idx - 1
                                                    ]
                                                  ]?.quantity
                                                : ''
                                            }
                                            onChange={(e) => {
                                              setFieldValue(
                                                `waste_data[${index}].monthlyData[${
                                                  monthsForCurrentYear[idx - 1]
                                                }].quantity`,
                                                e.target.value
                                              );

                                              const updatedStationary: any = [
                                                ...values.waste_data,
                                              ];

                                              updatedStationary[index] = {
                                                ...updatedStationary[index],
                                                monthlyData: {
                                                  ...updatedStationary[index]
                                                    .monthlyData,
                                                  [monthsForCurrentYear[
                                                    idx - 1
                                                  ]]: {
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
                                          name={`waste_data.${index}.monthlyData.${
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
                                          value={
                                            values.waste_data[index]
                                              ?.monthlyData[
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            ]?.quantity > 0
                                              ? values.waste_data[index]
                                                  ?.monthlyData[
                                                  monthsForCurrentYear[
                                                    monthsForCurrentYear.length -
                                                      1
                                                  ]
                                                ]?.quantity
                                              : ''
                                          }
                                          onChange={(e) =>
                                            setFieldValue(
                                              `waste_data.${index}.monthlyData.${
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
                                      </Form.Item>
                                    </Row>
                                  </Col>
                                }
                                {index !== 0 && (
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
                                        initalFormValues.splice(index, 1);
                                        delete fileLists[index];
                                        arrayHelpers.remove(index);
                                        removefromList(index);
                                      }}
                                      style={{
                                        height: '33px',
                                        marginTop: '22px',
                                        padding: '0 20px',
                                      }}
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
                                  {' '}
                                  Attachments :
                                </Col>
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
                                            values.waste_data
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
                                                Click or drag file to this area
                                                to upload
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
                    isValid={isValid}
                    dirty={dirty}
                    resetForm={resetForm}
                  />
                </Form>
              );
            }}
          </Formik>
        </Spin>
      ) : (
        <DataEntryRecycle />
      )}
    </>
  );
};

export default RecyledForm;
