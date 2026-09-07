import { useEffect, useState } from 'react';
import { Row, Col, Form, Button, message, Checkbox, Select } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomCheckboxGroup from '../FormInput/CustomCheckbox';
import CustomSelect from '../FormInput/CustomSelect';
import Styles from './Setting.module.scss';
import { get, post } from '../../Services';
import { useNotification } from '../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { ButtonComponent, TabsComponent } from '../../DesignLibrary';
import { isEmpty } from '../../Utils/isEmpty';
import { CheckOutlined } from '@ant-design/icons';
interface Values {}

interface griValue {
  categories: string[];
  Environment: string[];
  Social: string[];
  Governance: string[];
}
const ESGConfiguration = ({ currentStep, setCurrentStep }: any) => {
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [frameWorkData, setFrameWorkData] = useState<griValue>();
  const [activeKey, setActiveKey] = useState('1');

  const [mainTabKey, setMainTabKey] = useState('1');

  const [entityData, setEntityData] = useState<any>([]);
  const [entityMonths, setEntityMonths] = useState<{
    startMonth: string;
    endMonth: string;
  } | null>(null);

  const [selectedScope1, setSelectedScope1] = useState<any[]>([]);
  const [selectedScope2, setSelectedScope2] = useState<any[]>([]);
  const [selectedScope3, setSelectedScope3] = useState<any[]>([]);
  const [customEmission, setCustomEmission] = useState<any[]>([]);
  const { Option } = Select;
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Function to generate financial years
  const generateFinancialYears = () => {
    const years = [];
    for (let startYear = 2000; startYear <= 2099; startYear++) {
      const nextYear = startYear + 1;
      years.push(`FY${startYear} - ${nextYear}`);
    }
    return years;
  };

  // Calculate current financial year
  const getCurrentFinancialYear = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const nextYear = startYear + 1;
    return `FY${startYear} - ${nextYear}`;
  };

  useEffect(() => {
    // Set the initial selected year to the current financial year
    setSelectedYear(getCurrentFinancialYear());
  }, []);

  const handleYearChange = (year: string) => {
    setSelectedYear(year); // Fetch data for the selected year
  };

  const financialYears = generateFinancialYears();

  const griTabData = [{ tab: 'GRI', key: '1' }];

  const issbTabData = [{ tab: 'ISSB', key: '1' }];

  const tabData = [
    { tab: 'GRI', key: '1' },
    { tab: 'ISSB', key: '2' },
  ];

  const MainTabData = [
    { tab: 'ESG Framework Selection', key: '1' },
    { tab: 'Emission Factor Database', key: '2' },
  ];

  // checkbox options for ISSB
  const issbCheckboxOptions = [
    {
      label: 'Objective',
      value: 'Objective',
    },
    {
      label: 'Scope',
      value: 'Scope',
    },
    {
      label: 'Conceptual foundations',
      value: 'Conceptual foundations',
    },
    {
      label: 'Core Content',
      value: 'Core Content',
    },
    {
      label: 'General Requirements',
      value: 'General Requirements',
    },
    {
      label: 'Judgements, uncertainties and Errors',
      value: 'Judgements, uncertainties and Errors',
    },
    {
      label: 'Effective date',
      value: 'Effective date',
    },
    {
      label: 'Transition',
      value: 'Transition',
    },
    {
      label: 'Application Guidance',
      value: 'Application Guidance',
    },
  ];

  const handleTabChange = (key: any) => {
    setActiveKey(key);
  };
  const handleMainTabChange = (key: any) => {
    setMainTabKey(key);
    setActiveKey('1');
  };

  const Scope1 = ['UK-DEFRA 2023', 'UK-DEFRA 2024', 'US-EPA', 'IPCC'].map(
    (data: any, index: any) => ({
      label: <span style={{ fontFamily: 'Arial' }}>{data}</span>,
      value: data,
      disabled: [2, 3].includes(index),
    })
  );

  const Scope2 = [
    'UK-DEFRA 2023',
    'UK-DEFRA 2024',
    'EMA (SG)',
    'US-EPA',
    'IPCC',
    'NEA (SG)',
  ].map((data: any, index: any) => ({
    label: <span style={{ fontFamily: 'Arial' }}>{data}</span>,
    value: data,
    disabled: [3, 4, 5].includes(index),
  }));

  const Scope3 = ['UK-DEFRA 2023', 'UK-DEFRA 2024', 'US-EPA', 'IPCC'].map(
    (data: any, index: any) => ({
      label: <span style={{ fontFamily: 'Arial' }}>{data}</span>,
      value: data,
      disabled: index === 3,
    })
  );

  const CustomEmissionFactor = ['Emission Factor'].map(
    (data: any, index: any) => ({
      label: <span style={{ fontFamily: 'Arial' }}>{data}</span>,
      value: data,
    })
  );

  const fetchFrameData = () => {
    get(`report/get_category_list/`)
      .then((res: any) => {
        if (res.response.status !== false) {
          setFrameWorkData(res?.response?.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchFrameData();
  }, []);

  const fetchEntityData = (apiUrl: string) => {
    get(apiUrl)
      .then((res) => {
        if (
          !isEmpty(res) &&
          !isEmpty(res?.response) &&
          !isEmpty(res?.response?.status) &&
          res?.response?.status !== false
        ) {
          const data = !isEmpty(res?.response?.data) && res?.response?.data;

          if (data.length > 0) {
            // Extract start_date and end_date
            const { start_date, end_date } = data[0];

            const startMonth = new Date(start_date).toLocaleString('default', {
              month: 'long',
            });
            const endMonth = new Date(end_date).toLocaleString('default', {
              month: 'long',
            });

            setEntityMonths({ startMonth, endMonth });
          }

          setEntityData(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  };

  useEffect(() => {
    fetchEntityData('/entity/getEntitiesListByUserId/');
  }, []);

  const selectConfigs = [
    {
      name: 'framework',
      placeholder: 'Select Framework',
      mode: 'multiple',
      options: [
        { value: 'GRI', label: 'GRI', isDisabled: false },
        { value: 'ISSB', label: 'ISSB', isDisabled: false },
        { value: 'TCFD', label: 'TCFD', isDisabled: true },
        { value: 'SGX', label: 'SGX', isDisabled: true },
        { value: 'SASB', label: 'SASB', isDisabled: true },
      ],
    },
  ];

  const handleSaveNext = (values: any) => {
    const isFrameworkValid = values.framework && values.framework !== '';
    const isGriSelected = values.framework.includes('GRI');
    const isIssbSelected = values.framework.includes('ISSB');

    const isGriValid =
      isGriSelected &&
      values.environmentCheckboxGroup.length > 0 &&
      values.socialCheckboxGroup.length > 0 &&
      values.governanceCheckboxGroup.length > 0;

    const isIssbValid = isIssbSelected && values.issbCheckboxGroup.length > 0;

    const isGriAndIssbValid =
      isGriSelected && isIssbSelected
        ? isGriValid && isIssbValid
        : isGriValid || isIssbValid;

    const isSelectedYearValid = selectedYear && selectedYear !== ''; // Ensure selectedYear is valid

    if (
      !(
        isFrameworkValid &&
        ((currentStep === 0 && isGriAndIssbValid && isSelectedYearValid) ||
          (currentStep === 1 &&
            (selectedScope1.length > 0 ||
              selectedScope2.length > 0 ||
              selectedScope3.length > 0 ||
              customEmission.length > 0)) ||
          currentStep === 2)
      )
    ) {
      if (
        currentStep === 1 &&
        !(
          selectedScope1.length > 0 ||
          selectedScope2.length > 0 ||
          selectedScope3.length > 0 ||
          customEmission.length > 0
        )
      ) {
        message.error('Select at least one emission type.');
      } else if (currentStep === 0 && !isSelectedYearValid) {
        message.error('Please select a valid year.');
      } else {
        message.error('Select at least one option from any ESG category.');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleResetValues = (currentStep: any, values: any, setValues: any) => {
    const resetValues = { ...values };

    if (currentStep === 0) {
      setValues({
        ...values,
        selectedYear: '',
        environmentCheckboxGroup: [],
        socialCheckboxGroup: [],
        governanceCheckboxGroup: [],
        issbCheckboxGroup: [],
      });
      setSelectedYear(null);
    } else if (currentStep === 1) {
      setSelectedScope1([]);
      setSelectedScope2([]);
      setSelectedScope3([]);
      setCustomEmission([]);
    } else if (currentStep === 2) {
      for (const key in resetValues) {
        if (key.startsWith('environ-') || key.startsWith('quantity-')) {
          resetValues[key] = 0;
        }
      }

      setValues(resetValues);
      setSelectedYear(null);
    } else {
      // Reset logic for other steps if needed
      message.error('Cannot clear values at this step.');
    }
  };

  const handleButtonClick = (
    option: any,
    scopeSetter: any,
    selectedIndices: any
  ) => {
    if (selectedIndices.includes(option.value)) {
      scopeSetter(selectedIndices.filter((i: any) => i !== option.value)); // Remove if already selected
    } else {
      scopeSetter([...selectedIndices, option.value]); // Add if not selected
    }
  };

  const [financialExist, setFinancialExist] = useState<any>([]);
  function formatYearRange(dateRange: string): string {
    const regex = /(\d{4})/g; // Matches four-digit years
    const matches = dateRange.match(regex);

    if (matches && matches.length >= 2) {
      return `FY${matches[0]} - ${matches[1]}`;
    } else {
      throw new Error('Invalid date range format or not enough years found');
    }
  }

  const getConfigData = async () => {
    try {
      const res = await get(
        `/framework/get_ESGframework/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(res?.response?.data)) {
        const responseData = res.response.data;
        const formatYear = responseData.map((item: any) => {
          return formatYearRange(item.financial_year);
        });

        setFinancialExist(formatYear);
      } else {
        setFinancialExist([]);
      }
    } catch (error) {
      console.error('Error fetching ESG configuration data:', error);
    }
  };

  useEffect(() => {
    getConfigData();
  }, []);

  return (
    <div>
      <Formik
        initialValues={{
          environmentCheckboxGroup: [],
          socialCheckboxGroup: [],
          governanceCheckboxGroup: [],
          issbCheckboxGroup: [],
          selectedScope1: [],
          selectedScope2: [],
          selectedScope3: [],
          customEmission: [],
          framework: '',
          ghgEmissionFactors: '',
          gwpDataset: '',
          selectedYear: '',
        }}
        validationSchema={Yup.object().shape({})}
        onSubmit={(values, { resetForm }) => {
          if (!selectedYear || !entityMonths) {
            openToast({
              content: 'Reporting Period or entity months are not available',
              type: 'error',
            });
            return; // Prevent further execution
          }

          setIsLoading(true); // Set loading state when submitting

          const yearRange = selectedYear.match(/\d{4}/g);

          if (yearRange && yearRange.length === 2 && entityMonths) {
            const startYear = yearRange[0];
            const endYear = yearRange[1];

            const getAbbreviatedMonth = (month: any) => month.slice(0, 3);

            const formattedStartMonth = getAbbreviatedMonth(
              entityMonths.startMonth
            );
            const formattedEndMonth = getAbbreviatedMonth(
              entityMonths.endMonth
            );

            const formattedFinancialYear =
              formattedStartMonth === 'Jan' && formattedEndMonth === 'Dec'
                ? `${formattedStartMonth} ${startYear} - ${formattedEndMonth} ${startYear}`
                : `${formattedStartMonth} ${startYear} - ${formattedEndMonth} ${endYear}`;

            let transformedScope1 = selectedScope1.map((scope) => {
              if (scope === 'UK-DEFRA 2023') {
                return 'UK-DEFRA(2023-2024)';
              } else if (scope === 'UK-DEFRA 2024') {
                return 'UK-DEFRA(2024-2025)';
              }
              return scope;
            });

            let transformedScope2 = selectedScope2.map((scope) => {
              if (scope === 'UK-DEFRA 2023') {
                return 'UK-DEFRA(2023-2024)';
              } else if (scope === 'UK-DEFRA 2024') {
                return 'UK-DEFRA(2024-2025)';
              }
              return scope;
            });

            let transformedScope3 = selectedScope3.map((scope) => {
              if (scope === 'UK-DEFRA 2023') {
                return 'UK-DEFRA(2023-2024)';
              } else if (scope === 'UK-DEFRA 2024') {
                return 'UK-DEFRA(2024-2025)';
              }
              return scope;
            });

            let payload = {
              entity_Id: user.entity_Id,
              financial_year: formattedFinancialYear,
              frameworks: values.framework,
              env_list: values.environmentCheckboxGroup,
              social_list: values.socialCheckboxGroup,
              governance_list: values.governanceCheckboxGroup,
              issb_sections: values.issbCheckboxGroup,
              scope1: transformedScope1,
              scope2: transformedScope2,
              scope3: transformedScope3,
              custom_ef: customEmission,
            };

            post('/framework/esg-configuration/', payload)
              .then((res: any) => {
                if (res?.status === 'Success') {
                  if (res?.response?.status === true) {
                    openToast({
                      content: `${res?.message}`,
                      type: 'success',
                    });
                    resetForm();
                    navigate('/view-config-table');
                  } else {
                    openToast({
                      content: `${res?.data?.message}`,
                      type: 'error',
                    });
                    navigate('/view-config-table');
                  }
                }
              })
              .catch((err) =>
                openToast({
                  content: `${err?.response?.data?.message}`,
                  type: 'error',
                })
              )
              .finally(() => setIsLoading(false)); // Reset loading state after API call
          } else {
            setIsLoading(false); // Ensure loading state is reset for invalid input
          }
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
          handleReset,
          setValues,
        }) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            //onReset={handleReset}
            className="metrics-report"
          >
            {currentStep === 0 && (
              <>
                <Row justify="start" gutter={8} className="mt-2">
                  <Col span={5}>
                    <p className={Styles.newConfigTitle}>Reporting Period</p>
                    <Select
                      className={Styles.selectDropDown}
                      onChange={handleYearChange}
                      value={selectedYear || undefined}
                      placeholder="Select Reporting Period"
                    >
                      {financialYears.map((year) => {
                        const displayYear = year
                          .split(' - ')[0]
                          .replace(/FY(\d+)/, 'FY $1');
                        return (
                          <Option
                            key={year}
                            value={year}
                            disabled={financialExist.includes(year)}
                          >
                            {displayYear}
                          </Option>
                        );
                      })}
                    </Select>
                  </Col>
                  {selectConfigs.map((config, index) => (
                    <Col span={5} key={index}>
                      <div className={Styles.newConfigTitle}>Framework</div>
                      <div className={Styles.paddingTop}>
                        <CustomSelect
                          placeholder={config.placeholder}
                          name={config.name}
                          multiple
                          size="large"
                          label={''}
                          variant="borderless"
                          options={config.options}
                          errors={errors[config.name as keyof Values]}
                          touched={touched[config.name as keyof Values]}
                          value={values[config.name as keyof Values]}
                          secondChange={setFieldValue}
                          hook={handleChange}
                          blur={handleBlur}
                          selectColor="#56779B"
                          status={
                            (touched[config.name as keyof Values] &&
                              errors[config.name as keyof Values] &&
                              'error') ||
                            ''
                          }
                          style={{
                            fontFamily: 'Rubik',
                            fontSize: '14px',
                            height: '50px',
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
                {values.framework &&
                  values.framework.length === 1 &&
                  values.framework.includes('GRI') && (
                    <>
                      <TabsComponent
                        tabs={griTabData}
                        defaultActiveKey="1"
                        onChange={handleTabChange}
                      />
                      {activeKey === '1' && (
                        <>
                          <p className={Styles.newConfigTitle}>
                            Select ESG material topics for the Company
                          </p>
                          <Row justify="center" gutter={[10, 20]}>
                            <Col lg={8} md={8} sm={12} xs={24}>
                              <CustomCheckboxGroup
                                name="environmentCheckboxGroup"
                                label={
                                  <span className={Styles.newConfigTitleTwo}>
                                    Environment
                                  </span>
                                }
                                options={frameWorkData?.Environment?.map(
                                  (data) => ({
                                    label: (
                                      <span style={{ fontFamily: 'Arial' }}>
                                        {data.slice(3)}
                                      </span>
                                    ),
                                    value: data,
                                  })
                                )}
                                value={values.environmentCheckboxGroup}
                                secondChange={setFieldValue}
                                blur={handleBlur}
                                errors={errors.environmentCheckboxGroup}
                                touched={touched.environmentCheckboxGroup}
                              />
                            </Col>
                            <Col lg={8} md={8} sm={12} xs={24}>
                              <CustomCheckboxGroup
                                name="socialCheckboxGroup"
                                label={
                                  <span className={Styles.newConfigTitleTwo}>
                                    Social
                                  </span>
                                }
                                options={frameWorkData?.Social?.map((data) => ({
                                  label: (
                                    <span style={{ fontFamily: 'Arial' }}>
                                      {data.slice(3)}
                                    </span>
                                  ),
                                  value: data,
                                }))}
                                value={values.socialCheckboxGroup}
                                secondChange={setFieldValue}
                                blur={handleBlur}
                                errors={errors.socialCheckboxGroup}
                                touched={touched.socialCheckboxGroup}
                              />
                            </Col>
                            <Col lg={8} md={8} sm={24} xs={24}>
                              <CustomCheckboxGroup
                                name="governanceCheckboxGroup"
                                label={
                                  <span className={Styles.newConfigTitleTwo}>
                                    Governance
                                  </span>
                                }
                                options={frameWorkData?.Governance?.map(
                                  (data) => ({
                                    label: (
                                      <span style={{ fontFamily: 'Arial' }}>
                                        {data.slice(3)}
                                      </span>
                                    ),
                                    value: data,
                                  })
                                )}
                                value={values.governanceCheckboxGroup}
                                secondChange={setFieldValue}
                                blur={handleBlur}
                                errors={errors.governanceCheckboxGroup}
                                touched={touched.governanceCheckboxGroup}
                              />
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}
                {values.framework &&
                  values.framework.length === 1 &&
                  values.framework.includes('ISSB') && (
                    <>
                      <TabsComponent
                        tabs={issbTabData}
                        defaultActiveKey="1"
                        onChange={handleTabChange}
                      />
                      {activeKey === '1' && (
                        // Render ISSB content only when activeKey is '2'
                        <>
                          <Row justify="start" gutter={24}>
                            {[0, 1, 2].map((colIndex) => (
                              <Col lg={8} md={8} sm={12} xs={24} key={colIndex}>
                                <CustomCheckboxGroup
                                  name="issbCheckboxGroup"
                                  label={
                                    colIndex === 0
                                      ? 'Select ISSB topics'
                                      : undefined
                                  }
                                  options={issbCheckboxOptions
                                    .slice(colIndex * 3, colIndex * 3 + 3)
                                    .map((option) => ({
                                      ...option,
                                      label: (
                                        <span style={{ fontFamily: 'Arial' }}>
                                          {option.label}
                                        </span>
                                      ),
                                    }))}
                                  value={values.issbCheckboxGroup}
                                  secondChange={setFieldValue}
                                  blur={handleBlur}
                                  errors={errors.issbCheckboxGroup}
                                  touched={touched.issbCheckboxGroup}
                                />
                              </Col>
                            ))}
                          </Row>
                        </>
                      )}
                    </>
                  )}

                {values.framework && values.framework.length > 1 && (
                  <>
                    <TabsComponent
                      tabs={tabData}
                      defaultActiveKey={activeKey}
                      onChange={handleTabChange}
                    />
                    {activeKey === '1' && (
                      <>
                        <p className={Styles.newConfigTitle}>
                          Select ESG material topics for the Company
                        </p>
                        <Row justify="center" gutter={[10, 20]}>
                          <Col lg={8} md={8} sm={12} xs={24}>
                            <CustomCheckboxGroup
                              name="environmentCheckboxGroup"
                              label={
                                <span className={Styles.newConfigTitleTwo}>
                                  Environment
                                </span>
                              }
                              options={frameWorkData?.Environment?.map(
                                (data) => ({
                                  label: (
                                    <span style={{ fontFamily: 'Arial' }}>
                                      {data.slice(3)}
                                    </span>
                                  ),
                                  value: data,
                                })
                              )}
                              value={values.environmentCheckboxGroup}
                              secondChange={setFieldValue}
                              blur={handleBlur}
                              errors={errors.environmentCheckboxGroup}
                              touched={touched.environmentCheckboxGroup}
                            />
                          </Col>
                          <Col lg={8} md={8} sm={12} xs={24}>
                            <CustomCheckboxGroup
                              name="socialCheckboxGroup"
                              label={
                                <span className={Styles.newConfigTitleTwo}>
                                  Social
                                </span>
                              }
                              options={frameWorkData?.Social?.map((data) => ({
                                label: (
                                  <span style={{ fontFamily: 'Arial' }}>
                                    {data.slice(3)}
                                  </span>
                                ),
                                value: data,
                              }))}
                              value={values.socialCheckboxGroup}
                              secondChange={setFieldValue}
                              blur={handleBlur}
                              errors={errors.socialCheckboxGroup}
                              touched={touched.socialCheckboxGroup}
                            />
                          </Col>
                          <Col lg={8} md={8} sm={24} xs={24}>
                            <CustomCheckboxGroup
                              name="governanceCheckboxGroup"
                              label={
                                <span className={Styles.newConfigTitleTwo}>
                                  Governance
                                </span>
                              }
                              options={frameWorkData?.Governance?.map(
                                (data) => ({
                                  label: (
                                    <span style={{ fontFamily: 'Arial' }}>
                                      {data.slice(3)}
                                    </span>
                                  ),
                                  value: data,
                                })
                              )}
                              value={values.governanceCheckboxGroup}
                              secondChange={setFieldValue}
                              blur={handleBlur}
                              errors={errors.governanceCheckboxGroup}
                              touched={touched.governanceCheckboxGroup}
                            />
                          </Col>
                        </Row>
                      </>
                    )}
                    {activeKey === '2' && (
                      // Render ISSB content only when activeKey is '2'
                      <>
                        <Row justify="start" gutter={24}>
                          {[0, 1, 2].map((colIndex) => (
                            <Col lg={8} md={8} sm={12} xs={24} key={colIndex}>
                              <CustomCheckboxGroup
                                name="issbCheckboxGroup"
                                label={
                                  colIndex === 0
                                    ? 'Select ISSB topics'
                                    : undefined
                                }
                                options={issbCheckboxOptions
                                  .slice(colIndex * 3, colIndex * 3 + 3)
                                  .map((option) => ({
                                    ...option,
                                    label: (
                                      <span style={{ fontFamily: 'Arial' }}>
                                        {option.label}
                                      </span>
                                    ),
                                  }))}
                                value={values.issbCheckboxGroup}
                                secondChange={setFieldValue}
                                blur={handleBlur}
                                errors={errors.issbCheckboxGroup}
                                touched={touched.issbCheckboxGroup}
                              />
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {currentStep === 1 && (
              <>
                <Row className="mb-2">
                  <Col>
                    <p className={Styles.newConfigTitle}>
                      Select Emission Factor Database as per the Emission Type
                    </p>
                  </Col>
                </Row>

                <p className={Styles.newConfigTitleTwo}>Scope 1</p>
                <Row>
                  {Scope1.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${selectedScope1.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setSelectedScope1,
                          selectedScope1
                        )
                      }
                      disabled={option.disabled}
                    >
                      {selectedScope1.includes(option.value) && (
                        <span className={Styles.selectedTick}>
                          <CheckOutlined />
                        </span>
                      )}
                      {option.label}
                    </Button>
                  ))}
                </Row>

                <p className={Styles.newConfigTitleTwo}>Scope 2</p>
                <Row>
                  {Scope2.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${selectedScope2.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setSelectedScope2,
                          selectedScope2
                        )
                      }
                      disabled={option.disabled}
                    >
                      {selectedScope2.includes(option.value) && (
                        <span className={Styles.selectedTick}>
                          <CheckOutlined />
                        </span>
                      )}
                      {option.label}
                    </Button>
                  ))}
                </Row>

                <p className={Styles.newConfigTitleTwo}>Scope 3</p>
                <Row>
                  {Scope3.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${selectedScope3.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setSelectedScope3,
                          selectedScope3
                        )
                      }
                      disabled={option.disabled}
                    >
                      {selectedScope3.includes(option.value) && (
                        <span className={Styles.selectedTick}>
                          <CheckOutlined />
                        </span>
                      )}
                      {option.label}
                    </Button>
                  ))}
                </Row>

                <p className={Styles.newConfigTitleTwo}>Custom Emission</p>
                <Row>
                  {CustomEmissionFactor.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${customEmission.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setCustomEmission,
                          customEmission
                        )
                      }
                    >
                      {customEmission.includes(option.value) && (
                        <span className={Styles.selectedTick}>
                          <CheckOutlined />
                        </span>
                      )}
                      Custom EF
                    </Button>
                  ))}
                </Row>
              </>
            )}

            {currentStep === 2 && (
              <>
                <Row justify="start" className="mt-2">
                  <Col span={4}>
                    <p className={Styles.newConfigTitle}>Reporting Period</p>
                    <p>
                      {selectedYear
                        ? `FY ${selectedYear.match(/\d{4}/)?.[0]}`
                        : 'N/A'}
                    </p>
                  </Col>

                  <Col span={4}>
                    <div className={Styles.newConfigTitle}>Framework</div>
                    <div className={Styles.paddingTop}>
                      {Array.isArray(values.framework) &&
                      values.framework.length > 1
                        ? values.framework.join(', ')
                        : values.framework}
                    </div>
                  </Col>
                </Row>

                <TabsComponent
                  tabs={MainTabData}
                  defaultActiveKey={mainTabKey}
                  onChange={handleMainTabChange}
                />

                {mainTabKey === '1' && (
                  <>
                    {' '}
                    <Row className={Styles.paddingTop}>
                      <Col span={24}>
                        {values.framework && values.framework.length > 1 ? (
                          <>
                            <TabsComponent
                              tabs={tabData}
                              defaultActiveKey={activeKey}
                              onChange={handleTabChange}
                            />

                            {activeKey === '1' && (
                              <>
                                <p className={Styles.newConfigTitle}>
                                  Selected ESG material topics for the Company
                                </p>
                                <Row>
                                  {[
                                    values.environmentCheckboxGroup,
                                    values.socialCheckboxGroup,
                                    values.governanceCheckboxGroup,
                                  ].map((element: any, index: number) => (
                                    <Col
                                      lg={8}
                                      md={12}
                                      sm={24}
                                      xs={24}
                                      key={index}
                                    >
                                      <div className="mb-3">
                                        <p className={Styles.newConfigTitleTwo}>
                                          {index === 0
                                            ? 'Environment'
                                            : index === 1
                                              ? 'Social'
                                              : 'Governance'}
                                        </p>
                                      </div>
                                      {element.map(
                                        (item: any, index: number) => (
                                          <p key={index}>
                                            <Checkbox checked={true} />
                                            &nbsp;
                                            <span>{item}</span>
                                          </p>
                                        )
                                      )}
                                    </Col>
                                  ))}
                                </Row>
                              </>
                            )}

                            {activeKey === '2' && (
                              <>
                                <p className={Styles.newConfigTitle}>
                                  Selected ISSB topics
                                </p>
                                <Row>
                                  {values.issbCheckboxGroup.length > 0 &&
                                    // Split the array into chunks of 3
                                    values.issbCheckboxGroup
                                      .reduce(
                                        (
                                          resultArray: any[],
                                          item: any,
                                          index: number
                                        ) => {
                                          const chunkIndex = Math.floor(
                                            index / 3
                                          );

                                          if (!resultArray[chunkIndex]) {
                                            resultArray[chunkIndex] = []; // Start a new chunk
                                          }
                                          resultArray[chunkIndex].push(item);

                                          return resultArray;
                                        },
                                        []
                                      )
                                      .map((chunk: any[], colIndex: number) => (
                                        <Col
                                          lg={8}
                                          md={12}
                                          sm={24}
                                          xs={24}
                                          key={colIndex}
                                        >
                                          {chunk.map(
                                            (item: any, index: number) => (
                                              <p key={index}>
                                                <Checkbox checked={true} />
                                                &nbsp;
                                                <span>{item}</span>
                                              </p>
                                            )
                                          )}
                                        </Col>
                                      ))}
                                </Row>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {values.framework.includes('GRI') && (
                              <>
                                <TabsComponent
                                  tabs={griTabData}
                                  defaultActiveKey={activeKey}
                                  onChange={handleTabChange}
                                />
                                {activeKey === '1' && (
                                  <>
                                    <p className={Styles.newConfigTitle}>
                                      Selected ESG material topics for the
                                      Company
                                    </p>
                                    <Row>
                                      {[
                                        values.environmentCheckboxGroup,
                                        values.socialCheckboxGroup,
                                        values.governanceCheckboxGroup,
                                      ].map((element: any, index: number) => (
                                        <Col
                                          lg={8}
                                          md={12}
                                          sm={24}
                                          xs={24}
                                          key={index}
                                        >
                                          <div className="mb-3">
                                            <p
                                              className={
                                                Styles.newConfigTitleTwo
                                              }
                                            >
                                              {index === 0
                                                ? 'Environment'
                                                : index === 1
                                                  ? 'Social'
                                                  : 'Governance'}
                                            </p>
                                          </div>
                                          {element.map(
                                            (item: any, index: number) => (
                                              <p key={index}>
                                                <Checkbox checked={true} />
                                                &nbsp;
                                                <span>{item}</span>
                                              </p>
                                            )
                                          )}
                                        </Col>
                                      ))}
                                    </Row>
                                  </>
                                )}
                              </>
                            )}

                            {values.framework.includes('ISSB') && (
                              <>
                                <TabsComponent
                                  tabs={issbTabData}
                                  defaultActiveKey="1"
                                  onChange={handleTabChange}
                                />
                                {activeKey === '1' && (
                                  <>
                                    <p className={Styles.newConfigTitle}>
                                      Selected ISSB topics
                                    </p>
                                    <Row>
                                      {values.issbCheckboxGroup.length > 0 &&
                                        // Split the array into chunks of 3
                                        values.issbCheckboxGroup
                                          .reduce(
                                            (
                                              resultArray: any[],
                                              item: any,
                                              index: number
                                            ) => {
                                              const chunkIndex = Math.floor(
                                                index / 3
                                              );

                                              if (!resultArray[chunkIndex]) {
                                                resultArray[chunkIndex] = []; // Start a new chunk
                                              }
                                              resultArray[chunkIndex].push(
                                                item
                                              );

                                              return resultArray;
                                            },
                                            []
                                          )
                                          .map(
                                            (
                                              chunk: any[],
                                              colIndex: number
                                            ) => (
                                              <Col
                                                lg={8}
                                                md={12}
                                                sm={24}
                                                xs={24}
                                                key={colIndex}
                                              >
                                                {chunk.map(
                                                  (
                                                    item: any,
                                                    index: number
                                                  ) => (
                                                    <p key={index}>
                                                      <Checkbox
                                                        checked={true}
                                                      />
                                                      &nbsp;
                                                      <span>{item}</span>
                                                    </p>
                                                  )
                                                )}
                                              </Col>
                                            )
                                          )}
                                    </Row>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Col>
                    </Row>
                  </>
                )}

                {mainTabKey === '2' && (
                  <>
                    {' '}
                    <Row>
                      <Col lg={24} md={24} sm={24} xs={24} className="mt-4">
                        <p className={Styles.newConfigTitle}>
                          Selected Emission Factor Database as per the Emission
                          Type
                        </p>
                        <div>
                          <Row gutter={16}>
                            {/* Render Scope 1 if selected */}
                            {selectedScope1.length > 0 && (
                              <Col lg={24} md={24} sm={24} xs={24}>
                                <div className="mb-3">
                                  <p className={Styles.newConfigTitleTwo}>
                                    Scope 1
                                  </p>
                                </div>
                                {selectedScope1.map((itemValue: any) => {
                                  const item = Scope1.find(
                                    (i) => i.value === itemValue
                                  );
                                  return (
                                    item && (
                                      <Button
                                        key={item.value}
                                        className={Styles.selectedPreview}
                                      >
                                        {
                                          <span className={Styles.selectedTick}>
                                            <CheckOutlined />
                                          </span>
                                        }
                                        {item.label}
                                      </Button>
                                    )
                                  );
                                })}
                              </Col>
                            )}

                            {/* Render Scope 2 if selected */}
                            {selectedScope2.length > 0 && (
                              <Col lg={24} md={24} sm={24} xs={24}>
                                <div className="mb-3">
                                  <p className={Styles.newConfigTitleTwo}>
                                    Scope 2
                                  </p>
                                </div>
                                {selectedScope2.map((itemValue: any) => {
                                  const item = Scope2.find(
                                    (i) => i.value === itemValue
                                  );
                                  return (
                                    item && (
                                      <Button
                                        key={item.value}
                                        className={Styles.selectedPreview}
                                      >
                                        {
                                          <span className={Styles.selectedTick}>
                                            <CheckOutlined />
                                          </span>
                                        }
                                        {item.label}
                                      </Button>
                                    )
                                  );
                                })}
                              </Col>
                            )}

                            {/* Render Scope 3 if selected */}
                            {selectedScope3.length > 0 && (
                              <Col lg={24} md={24} sm={24} xs={24}>
                                <div className="mb-3">
                                  <p className={Styles.newConfigTitleTwo}>
                                    Scope 3
                                  </p>
                                </div>
                                {selectedScope3.map((itemValue: any) => {
                                  const item = Scope3.find(
                                    (i) => i.value === itemValue
                                  );
                                  return (
                                    item && (
                                      <Button
                                        key={item.value}
                                        className={Styles.selectedPreview}
                                      >
                                        {
                                          <span className={Styles.selectedTick}>
                                            <CheckOutlined />
                                          </span>
                                        }
                                        {item.label}
                                      </Button>
                                    )
                                  );
                                })}
                              </Col>
                            )}

                            {customEmission.length > 0 && (
                              <Col lg={24} md={24} sm={24} xs={24}>
                                <div className="mb-3">
                                  <p className={Styles.newConfigTitleTwo}>
                                    Custom Emission
                                  </p>
                                </div>
                                {customEmission.map((itemValue: any) => {
                                  const item = CustomEmissionFactor.find(
                                    (i) => i.value === itemValue
                                  );
                                  return (
                                    item && (
                                      <Button
                                        key={item.value}
                                        className={Styles.selectedPreview}
                                      >
                                        {
                                          <span className={Styles.selectedTick}>
                                            <CheckOutlined />
                                          </span>
                                        }
                                        Custom EF
                                      </Button>
                                    )
                                  );
                                })}
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}

            <Row justify="end">
              {currentStep !== 2 && (
                <Col className={Styles.paddingItems}>
                  <ButtonComponent
                    hierarchy="tertiary"
                    htmlType="reset"
                    onClick={() => {
                      handleResetValues(currentStep, values, setValues);
                    }}
                    size="xl"
                  >
                    Reset
                  </ButtonComponent>
                </Col>
              )}
              {currentStep !== 0 && (
                <Col className={Styles.paddingItems}>
                  <ButtonComponent
                    hierarchy="secondary-gray"
                    size="xl"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </ButtonComponent>
                </Col>
              )}
              {currentStep !== 2 && (
                <Col>
                  <ButtonComponent
                    hierarchy="primary"
                    size="xl"
                    disabled={!(values.framework && values.framework !== '')}
                    onClick={() => handleSaveNext(values)}
                  >
                    Save & Next
                  </ButtonComponent>
                </Col>
              )}
              {currentStep === 2 && (
                <Col>
                  <ButtonComponent
                    hierarchy="primary"
                    loading={isLoading}
                    htmlType="submit"
                    size="xl"
                  >
                    Save
                  </ButtonComponent>
                </Col>
              )}
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ESGConfiguration;
