import { Col, Row, Form, Select, message, Upload, Tabs, Input } from 'antd';
import type { TabsProps } from 'antd';
import { FieldArray, Formik } from 'formik';
import { useEffect, useState } from 'react';

import Styles from './processEmission.module.scss';
import CustomDownload from '../../../Components/FileHanddle/customDownload';
import CustomUpload from '../../../Components/FileHanddle/customUpload';

import type { UploadProps } from 'antd';
import { FileExcelFilled, FileWordFilled } from '@ant-design/icons';
import * as Yup from 'yup';
import CustomForm, {
  transformEnergyData,
} from '../../../Components/TabForms/CustomForm';
import { apiBaseUrl, post } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useNotification } from '../../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ButtonComponent } from '../../../DesignLibrary';
import { removeElementByValue } from '../../../Components/Emissions/Scope3/Helpers';
import CloudIcon from '../../../assets/Svg/Emissions/uploadColud';
import { isEmpty } from '../../../Utils/isEmpty';
import File from '../../../assets/Svg/Emissions/fileImg';
import Cancel from '../../../assets/Svg/Emissions/Cancel';
import {
  getMonthsInFinancialYear,
  MonthlyDataSchema,
} from '../../../Components/TabForms/StationaryForm';
import { useSelector } from 'react-redux';

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

export default function ScopeTwoForm() {
  const { user } = useAuth();
  const [radioValue, setRadioValue] = useState(1);
  const [dateValue, setDateValue] = useState('month');
  const [detailInfo, setDetailInfo] = useState<any>({
    date: null,
    entity: '',
    facility: '',
  });
  const emissionData = [
    {
      key: 1,
      title: 'Electricity from public utility',
      name1: 'ElectricityUtilityPurchased',
      name2: 'ElectricityUtilityGenerated',
      name3: 'ElectricityUtilitySold',
      name4: 'ElectricityUtilityConsumed',
      name5: 'ElectricityUtilityUom',
    },
    {
      key: 2,
      title: 'Electricity from third parties (Non-renewable)',
      name1: 'ElectricityNonRenewablePurchased',
      name2: 'ElectricityNonRenewableGenerated',
      name3: 'ElectricityNonRenewableSold',
      name4: 'ElectricityNonRenewableConsumed',
      name5: 'ElectricityNonRenewableUom',
    },
    {
      key: 3,
      title: 'Electricity from third parties (Renewable)',
      name1: 'ElectricityRenewablePurchased',
      name2: 'ElectricityRenewableGenerated',
      name3: 'ElectricityRenewableSold',
      name4: 'ElectricityRenewableConsumed',
      name5: 'ElectricityRenewableUom',
    },
    {
      key: 4,
      title: 'Gas',
      name1: 'GasPurchased',
      name2: 'GasGenerated',
      name3: 'GasSold',
      name4: 'GasConsumed',
      name5: 'GasUom',
    },
    {
      key: 5,
      title: 'Heating',
      name1: 'HeatingPurchased',
      name2: 'HeatingGenerated',
      name3: 'HeatingSold',
      name4: 'HeatingConsumed',
      name5: 'HeatingUom',
    },
    {
      key: 6,
      title: 'Cooling',
      name1: 'CoolingPurchased',
      name2: 'CoolingGenerated',
      name3: 'CoolingSold',
      name4: 'CoolingConsumed',
      name5: 'CoolingUom',
    },
    {
      key: 7,
      title: 'Steam',
      name1: 'SteamPurchased',
      name2: 'SteamGenerated',
      name3: 'SteamSold',
      name4: 'SteamConsumed',
      name5: 'SteamUom',
    },
  ];

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

  const handleClickradio = (e: any) => {
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
    } else {
      setRadioValue(2);
    }
  };

  const DataEntryEnergy = ({ type }: { type: string }) => {
    const userLogged = JSON.parse(localStorage.getItem('user') || '{}');
    const monthsForCurrentYear = getMonthsInFinancialYear(
      userLogged?.financial_year
    );
    const { openToast } = useNotification();
    const navigate = useNavigate();

    const [fileLists, setFileLists] = useState<any>({});
    const [fileName, setFileName] = useState<any>();
    const [prefilled, setPrefilled] = useState<any>([]);
    const facilitySelected = useSelector(
      (state: any) => state.facilitySelected
    );

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
        setFormValues(updatedValues);

        setFieldValue(
          `energy[${index}].disclosure`,
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

    interface response {
      entity_Id: string;
      energy_data: EnergyDatum[];
    }

    interface EnergyDatum {
      source_of_energy: string;
      vehicle_type: string;
      UOM: string;
      disclosure: [];
      list_of_files: [];
      monthlyData: MonthlyDatum[];
    }

    interface MonthlyDatum {
      month: string;
      quantity: number | string;
    }

    const [ExcelUploaded, setExcelUploaded] = useState(false);
    const [initalFormValues, setInitialFormValues] = useState<any>([]);
    const [filesList, setFilesList] = useState<any>({});
    const [fileNames, setFileNames] = useState<any>({});
    const [isDisable, setIsDisable] = useState(true);
    const [formValues, setFormValues] = useState<any>([]);
    function initializeForm(response: response) {
      const { energy_data } = response;

      const monthMapping: { [key in string]: string } =
        monthsForCurrentYear.reduce(
          (acc, month, index) => {
            const monthKey = `M${index + 1}`;
            acc[monthKey] = month;
            return acc;
          },
          {} as { [key in string]: string }
        );
      const data = energy_data?.map((item) => {
        return {
          energy_source: item?.source_of_energy,
          vehicle_type: item?.vehicle_type,
          UOM: item?.UOM,
          disclosure: item.disclosure,
          monthlyData: item?.monthlyData?.reduce((acc: any, current) => {
            acc[
              monthMapping[current?.month?.toUpperCase() as string] as string
            ] = {
              quantity: current?.quantity || '',
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

    useEffect(() => {
      const allDisclosuresPresent = initalFormValues.every(
        (item: any) => item.disclosure && item.disclosure.length > 0
      );
      setIsDisable(!allDisclosuresPresent);
    }, [formValues, initalFormValues]);

    const [loading, setloading] = useState(false);
    const { user } = useAuth();
    const FormFooter = ({
      isValid,
      resetForm,
    }: {
      isValid: boolean;

      resetForm: any;
    }) => {
      return (
        <Row justify="end">
          <Form.Item>
            <Row>
              <Col className={Styles.customPaddingRight}>
                <ButtonComponent
                  hierarchy="secondary-gray"
                  onClick={() => {
                    navigate('/environment/scope2', { state: 1 });
                  }}
                >
                  Cancel
                </ButtonComponent>
              </Col>{' '}
              {/* <Col className={Styles.customPaddingRight}>
                <ButtonComponent
                  htmlType="reset"
                  hierarchy="secondary-gray"
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
                  energy: initalFormValues,
                }}
                enableReinitialize={true}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                  const data = transformEnergyData(values.energy);
                  setSubmitting(true);
                  post('/energy/create-energy-consumption/', {
                    entity_Id: user?.entity_Id,
                    facility_Id: facilitySelected,
                    energy_data: data?.energy_data,
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
                          navigate('/environment/scope2');
                        }
                      }
                    })
                    .catch((err) => {
                      setSubmitting(false);
                      openToast({
                        content: `${'Something went wrong try again'}`,
                        type: 'error',
                      });
                    })
                    .finally(() => setSubmitting(false));
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
                }) => (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <FieldArray name="energy">
                      {(arrayHelpers) => (
                        <>
                          {values?.energy?.map((items: any, index: number) => (
                            <div key={index}>
                              {index === 0 && <Row key={index}></Row>}
                              <Row
                                className="form-grid"
                                align="middle"
                                gutter={12}
                                key={index}
                              >
                                <Col xl={5} lg={5} md={12} sm={24}>
                                  <div className="emission-form-label">
                                    Energy Source
                                  </div>
                                  <Select
                                    showSearch
                                    placeholder="Energy Source"
                                    disabled={true}
                                    value={values?.energy[index]?.energy_source}
                                    onChange={(value) =>
                                      setFieldValue(
                                        `energy.${index}.energy_source`,
                                        value
                                      )
                                    }
                                    style={{
                                      height: '40px',
                                      marginTop: '10px',
                                      display: 'block',
                                    }}
                                    className="emission-select"
                                  />
                                </Col>
                                {values.energy[index].energy_source ===
                                  'Electricity for EVs' && (
                                  <>
                                    <Col xl={5} lg={5} md={12} sm={24}>
                                      <div className="emission-form-label">
                                        Vehicle Type
                                      </div>
                                      <Select
                                        showSearch
                                        value={
                                          values.energy[index].vehicle_type
                                        }
                                        disabled={true}
                                        style={{
                                          height: '40px',
                                          marginTop: '10px',
                                          width: '100%',
                                        }}
                                      />
                                    </Col>
                                  </>
                                )}
                                <Col xl={4} lg={4} md={12} sm={24}>
                                  <div className="emission-form-label">
                                    UOM{' '}
                                  </div>
                                  <Select
                                    placeholder="UOM"
                                    disabled={true}
                                    value={values?.energy[index]?.UOM}
                                    onChange={(value) =>
                                      setFieldValue(
                                        `energy.${index}.UOM`,
                                        value
                                      )
                                    }
                                    style={{
                                      height: '40px',
                                      marginTop: '10px',
                                    }}
                                    className="emission-select"
                                  />
                                </Col>
                                <Col xl={2} lg={2} md={2} sm={2}></Col>
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
                                          onKeyDown={(e: any) => {
                                            if (
                                              e.key === 'e' ||
                                              e.key === 'E'
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          placeholder="10000"
                                          value={
                                            values.energy[index]?.monthlyData[
                                              monthsForCurrentYear[idx - 1]
                                            ]?.quantity
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
                                          onChange={(e) =>
                                            setFieldValue(
                                              `energy.${index}.monthlyData.${
                                                monthsForCurrentYear[idx - 1]
                                              }.quantity`,
                                              e.target.value
                                            )
                                          }
                                          //placeholder="10000"
                                          style={{ width: '80px' }}
                                        ></Input>
                                      </Row>
                                      {values.energy[index]?.monthlyData[
                                        monthsForCurrentYear[idx - 1]
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
                                          if (e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                          }
                                        }}
                                        value={
                                          values.energy[index]?.monthlyData[
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
                                            `energy.${index}.monthlyData.${
                                              monthsForCurrentYear[
                                                monthsForCurrentYear.length - 1
                                              ]
                                            }.quantity`,
                                            e.target.value
                                          )
                                        }
                                        style={{ width: '80px' }}
                                        placeholder="1000"
                                      ></Input>
                                    </Row>
                                    {values.energy[index]?.monthlyData[
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
                                        className={` scope-form-upload`}
                                        onChange={(info) => {
                                          handleOnChangeEnergy(
                                            info,
                                            index,
                                            setFieldValue,
                                            values.energy
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

                    <FormFooter isValid={!isValid} resetForm={resetForm} />
                  </Form>
                )}
              </Formik>
            ) : (
              <CustomUpload
                setloading={setloading}
                loading={loading}
                setExcelUploaded={setExcelUploaded}
                emission_type="Energy Consumption"
                initializeForm={initializeForm}
                setFileName={setFileName}
              />
            )}
          </Col>
        </Row>
      </>
    );
  };

  const RadioWrapper = ({ label }: any) => {
    return (
      <>
        <Col span={24}>
          <ButtonComponent
            icon={<FileWordFilled></FileWordFilled>}
            hierarchy={radioValue == 1 ? 'primary' : 'secondary'}
            onClick={(e) => handleClickradio(e)}
            style={{ height: '35px' }}
          >
            Input Data Entry
          </ButtonComponent>
          <ButtonComponent
            icon={<FileExcelFilled></FileExcelFilled>}
            style={{ marginLeft: '1vw', height: '35px' }}
            hierarchy={radioValue == 2 ? 'primary' : 'secondary'}
            onClick={(e) => handleClickradio(e)}
          >
            Excel Data Entry
          </ButtonComponent>{' '}
        </Col>
      </>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Energy Consumption',
      children: (
        <>
          <Row gutter={[10, 10]}>
            <RadioWrapper label="Energy Combustion" />
            <Col span={24} className={Styles.customPaddingTop}>
              {radioValue === 1 ? (
                <>
                  <CustomForm
                    label="Energy Consumption"
                    dataSource={detailInfo}
                    date={dateValue}
                  />
                </>
              ) : (
                <DataEntryEnergy type="Energy_consumption" />
              )}
            </Col>
          </Row>
        </>
      ),
    },
  ];

  return (
    <>
      {/* <Row style={{ paddingTop: '10px' }} justify="space-between">
        <Col>
          <p className="pageTitle">Emission Calculator</p>
        </Col>
      </Row> */}
      <Row
        gutter={12}
        justify="end"
        style={{ background: '#fff' }}
        className={Styles.pageCardStyle}
      >
        <Col span={24} className={Styles.AnttabSty}>
          <Tabs defaultActiveKey="1" items={items} className="energy" />
        </Col>
      </Row>
    </>
  );
}
