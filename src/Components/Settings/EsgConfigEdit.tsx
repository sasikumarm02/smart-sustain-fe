import { useEffect, useState } from 'react';
import { Row, Col, Form, Button, message, Checkbox, Select } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomCheckboxGroup from '../FormInput/CustomCheckbox';
import CustomSelect from '../FormInput/CustomSelect';
import Styles from './Setting.module.scss';
import { get, put } from '../../Services';
import { useNotification } from '../../Hooks/useNotification';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import {
  ButtonComponent,
  ModalComponent,
  TabsComponent,
} from '../../DesignLibrary';
import { isEmpty } from '../../Utils/isEmpty';
import { CheckOutlined } from '@ant-design/icons';
interface Values {}

interface griValue {
  categories: string[];
  Environment: string[];
  Social: string[];
  Governance: string[];
}

const EsgConfigEdit = ({
  currentStep,
  setCurrentStep,
  fullRecordData,
}: any) => {
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [frameWorkData, setFrameWorkData] = useState<griValue>();
  const [activeKey, setActiveKey] = useState('1');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState('');

  const reverseScopeMap: { [key: string]: string } = {
    'UK-DEFRA(2023-2024)': 'UK-DEFRA 2023',
    'UK-DEFRA(2024-2025)': 'UK-DEFRA 2024',
  };

  const reverseScopeMap2: { [key: string]: string } = {
    'UK-DEFRA(2023-2024)': 'UK-DEFRA 2023',
    'UK-DEFRA(2024-2025)': 'UK-DEFRA 2024',
  };
  const reverseScopeMap3: { [key: string]: string } = {
    'UK-DEFRA(2023-2024)': 'UK-DEFRA 2023',
    'UK-DEFRA(2024-2025)': 'UK-DEFRA 2024',
  };

  // Normalize once and use everywhere
  const [selectedScope1, setSelectedScope1] = useState(
    (fullRecordData?.scope1 || []).map(
      (item: string) => reverseScopeMap[item] || item
    )
  );

  const [selectedScope2, setSelectedScope2] = useState(
    (fullRecordData?.scope2 || []).map(
      (item: string) => reverseScopeMap2[item] || item
    )
  );
  const [selectedScope3, setSelectedScope3] = useState(
    (fullRecordData?.scope3 || []).map(
      (item: string) => reverseScopeMap3[item] || item
    )
  );
  const [customEmission, setCustomEmission] = useState(
    fullRecordData?.custom_ef || []
  );

  useEffect(() => {}, [fullRecordData]);

  const griTabData = [{ tab: 'GRI', key: '1' }];

  const issbTabData = [{ tab: 'ISSB', key: '1' }];

  const tabData = [
    { tab: 'GRI', key: '1' },
    { tab: 'ISSB', key: '2' },
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
    const isFrameworkValid = values?.framework && values?.framework !== '';
    const isGriSelected = values?.framework?.includes('GRI');
    const isIssbSelected = values?.framework?.includes('ISSB');

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

    if (
      !(
        isFrameworkValid &&
        ((currentStep === 0 && isGriAndIssbValid) ||
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
        environmentCheckboxGroup: fullRecordData.env_list || [], // Set default to empty array
        socialCheckboxGroup: fullRecordData.social_list || [],
        governanceCheckboxGroup: fullRecordData.governance_list || [],
        issbCheckboxGroup: fullRecordData.issb_sections || [],
        framework: fullRecordData.frameworks || values.frameworks,
      });
    } else if (currentStep === 1) {
      setSelectedScope1(fullRecordData.scope1 || []); // Set default to empty array
      setSelectedScope2(fullRecordData.scope2 || []);
      setSelectedScope3(fullRecordData.scope3 || []);
      setCustomEmission(fullRecordData.customEmission || []);
    } else if (currentStep === 2) {
      for (const key in resetValues) {
        if (key.startsWith('environ-') || key.startsWith('quantity-')) {
          resetValues[key] = 0;
        }
      }

      setValues(resetValues);
    } else {
      message.error('Cannot clear values at this step.');
    }
  };

  const handleButtonClick = (
    option: any,
    scopeSetter: any,
    selectedIndices: any,
    prefilledValues: any
  ) => {
    // Normalize prefilled values for comparison
    const normalizedPrefilled = prefilledValues.map(
      (val: string) => reverseScopeMap[val] || val
    );

    selectedIndices = Array.isArray(selectedIndices) ? selectedIndices : [];

    const isPrefilled = normalizedPrefilled.includes(option.value);

    if (isPrefilled) {
      setErrMsg(
        'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
      );
      setIsOpen(true);
    } else {
      if (selectedIndices.includes(option.value)) {
        scopeSetter(selectedIndices.filter((i: any) => i !== option.value));
      } else {
        scopeSetter([...selectedIndices, option.value]);
      }
    }
  };

  const handleOptionsChange = () => {
    alert('test');
  };

  const MainTabData = [
    { tab: 'ESG Framework Selection', key: '1' },
    { tab: 'Emission Factor Database', key: '2' },
  ];
  const [mainTabKey, setMainTabKey] = useState('1');
  const handleMainTabChange = (key: any) => {
    setMainTabKey(key);
    setActiveKey('1');
  };

  return (
    <div>
      <Formik
        initialValues={{
          environmentCheckboxGroup: fullRecordData.env_list || [],
          socialCheckboxGroup: fullRecordData.social_list || [],
          governanceCheckboxGroup: fullRecordData.governance_list || [],
          issbCheckboxGroup: fullRecordData.issb_sections || [],
          selectedScope1: [],
          selectedScope2: [],
          selectedScope3: [],
          customEmission: [],
          framework: fullRecordData.frameworks || [],
          ghgEmissionFactors: '',
          gwpDataset: '',
          selectedYear: '',
        }}
        validationSchema={Yup.object().shape({})}
        onSubmit={(values, { resetForm }) => {
          setIsLoading(true); // Set loading state when submitting

          // Prepare new values for the payload
          const newEnvironmentValues = values?.environmentCheckboxGroup.filter(
            (item: any) => !fullRecordData?.env_list?.includes(item)
          );
          const newSocialValues = values?.socialCheckboxGroup.filter(
            (item: any) => !fullRecordData?.social_list?.includes(item)
          );
          const newGovernanceValues = values?.governanceCheckboxGroup.filter(
            (item: any) => !fullRecordData?.governance_list?.includes(item)
          );
          const newIssbValues = values?.issbCheckboxGroup.filter(
            (item: any) => !fullRecordData?.issb_sections?.includes(item)
          );

          const newSelectedScope1 = selectedScope1.filter(
            (item: any) => !fullRecordData?.scope1?.includes(item)
          );

          const newSelectedScope2 = selectedScope2.filter(
            (item: any) => !fullRecordData?.scope2?.includes(item)
          );

          const newSelectedScope3 = selectedScope3.filter(
            (item: any) => !fullRecordData?.scope3?.includes(item)
          );

          const newSelectedCF = customEmission.filter(
            (item: any) => !fullRecordData?.custom_ef?.includes(item)
          );

          const existingScope1 = (fullRecordData?.scope1 || []).map(
            (val: string) => reverseScopeMap[val] || val
          );
          const existingScope2 = (fullRecordData?.scope2 || []).map(
            (val: string) => reverseScopeMap2[val] || val
          );
          const existingScope3 = (fullRecordData?.scope2 || []).map(
            (val: string) => reverseScopeMap3[val] || val
          );

          // Filter out prefilled values
          const newScope1Only = newSelectedScope1.filter(
            (item: string) => !existingScope1.includes(item)
          );
          const newScope2Only = newSelectedScope2.filter(
            (item: string) => !existingScope2.includes(item)
          );
          const newScope3Only = newSelectedScope3.filter(
            (item: string) => !existingScope3.includes(item)
          );

          // Apply transformation only to new ones
          const transformedScope1 = newScope1Only.map((scope: string) => {
            if (scope === 'UK-DEFRA 2023') return 'UK-DEFRA(2023-2024)';
            if (scope === 'UK-DEFRA 2024') return 'UK-DEFRA(2024-2025)';
            return scope;
          });

          const transformedScope2 = newScope2Only.map((scope: string) => {
            if (scope === 'UK-DEFRA 2023') return 'UK-DEFRA(2023-2024)';
            if (scope === 'UK-DEFRA 2024') return 'UK-DEFRA(2024-2025)';
            return scope;
          });

          const transformedScope3 = newScope3Only.map((scope: string) => {
            if (scope === 'UK-DEFRA 2023') return 'UK-DEFRA(2023-2024)';
            if (scope === 'UK-DEFRA 2024') return 'UK-DEFRA(2024-2025)';
            return scope;
          });

          let payload = {
            entity_Id: user.entity_Id,
            financial_year: fullRecordData.financial_year,
            framework_Id: fullRecordData.framework_Id,
            frameworks: values.framework,
            env_list: newEnvironmentValues,
            social_list: newSocialValues,
            governance_list: newGovernanceValues,
            issb_sections: newIssbValues,
            scope1: transformedScope1,
            scope2: transformedScope2,
            scope3: transformedScope3,
            custom_ef: newSelectedCF,
          };

          // Call the API
          put('/framework/update_ESGconfiguration/', payload)
            .then((res: any) => {
              if (res?.status === 'Success') {
                if (res?.response?.status === true) {
                  openToast({
                    content: `${res?.message}`,
                    type: 'success',
                  });
                  resetForm(); // Reset the form after success
                  navigate('/view-config-table'); // Navigate after success
                } else {
                  openToast({
                    content: `${res?.data?.message}`,
                    type: 'error',
                  });
                }
              }
            })
            .catch((err) => {
              openToast({
                content: `${err?.response?.data?.message}`,
                type: 'error',
              });
            })
            .finally(() => setIsLoading(false)); // Ensure the loading state is reset after API call
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
                  <Col span={4}>
                    <div className={Styles.newConfigTitle}>
                      Reporting Period
                    </div>
                    <div className={Styles.paddingTop}>
                      {fullRecordData.financial_year}
                    </div>
                  </Col>
                  {selectConfigs.map((config, index) => (
                    <Col span={4} key={index}>
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
                          value={values}
                          secondChange={setFieldValue}
                          hook={handleChange}
                          blur={handleBlur}
                          selectColor="#56779B"
                          protectedItems={fullRecordData.frameworks}
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
                {values?.framework &&
                  values?.framework?.length === 1 &&
                  values?.framework?.includes('GRI') && (
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
                                secondChange={(field: any, newValue: any) => {
                                  const uniquePrefilledValues = Array.from(
                                    new Set(
                                      fullRecordData.env_list.map((item: any) =>
                                        item.trim()
                                      )
                                    )
                                  );

                                  const allPrefilled = newValue.every(
                                    (value: any) =>
                                      uniquePrefilledValues.includes(
                                        value.trim()
                                      )
                                  );

                                  if (allPrefilled) {
                                    setErrMsg(
                                      'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                    );
                                    setIsOpen(true);
                                  } else {
                                    const updatedValues = Array.from(
                                      new Set([
                                        ...uniquePrefilledValues,
                                        ...newValue,
                                      ])
                                    );
                                    setFieldValue(field, updatedValues);
                                  }
                                }}
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
                                // Custom change handler to prevent deselecting pre-checked items
                                secondChange={(field: any, newValue: any) => {
                                  const uniquePrefilledValues = Array.from(
                                    new Set(
                                      fullRecordData.social_list.map(
                                        (item: any) => item.trim()
                                      )
                                    )
                                  );

                                  const allPrefilled = newValue.every(
                                    (value: any) =>
                                      uniquePrefilledValues.includes(
                                        value.trim()
                                      )
                                  );

                                  if (allPrefilled) {
                                    setErrMsg(
                                      'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                    );
                                    setIsOpen(true);
                                  } else {
                                    const updatedValues = Array.from(
                                      new Set([
                                        ...uniquePrefilledValues,
                                        ...newValue,
                                      ])
                                    );
                                    setFieldValue(field, updatedValues);
                                  }
                                }}
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
                                secondChange={(field: any, newValue: any) => {
                                  const uniquePrefilledValues = Array.from(
                                    new Set(
                                      fullRecordData.governance_list.map(
                                        (item: any) => item.trim()
                                      )
                                    )
                                  );

                                  const allPrefilled = newValue.every(
                                    (value: any) =>
                                      uniquePrefilledValues.includes(
                                        value.trim()
                                      )
                                  );

                                  if (allPrefilled) {
                                    setErrMsg(
                                      'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                    );
                                    setIsOpen(true);
                                  } else {
                                    const updatedValues = Array.from(
                                      new Set([
                                        ...uniquePrefilledValues,
                                        ...newValue,
                                      ])
                                    );
                                    setFieldValue(field, updatedValues);
                                  }
                                }}
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
                {values?.framework &&
                  values?.framework?.length === 1 &&
                  values?.framework?.includes('ISSB') && (
                    <>
                      <TabsComponent
                        tabs={issbTabData}
                        defaultActiveKey="1"
                        onChange={handleTabChange}
                      />
                      {activeKey === '1' && (
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
                                  secondChange={(field: any, newValue: any) => {
                                    const uniquePrefilledValues = Array.from(
                                      new Set(
                                        fullRecordData.issb_sections.map(
                                          (item: any) => item.trim()
                                        )
                                      )
                                    );

                                    const allPrefilled = newValue.every(
                                      (value: any) =>
                                        uniquePrefilledValues.includes(
                                          value.trim()
                                        )
                                    );

                                    if (allPrefilled) {
                                      setErrMsg(
                                        'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                      );
                                      setIsOpen(true);
                                    } else {
                                      const updatedValues = Array.from(
                                        new Set([
                                          ...uniquePrefilledValues,
                                          ...newValue,
                                        ])
                                      );
                                      setFieldValue(field, updatedValues);
                                    }
                                  }}
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
                              secondChange={(field: any, newValue: any) => {
                                const uniquePrefilledValues = Array.from(
                                  new Set(
                                    fullRecordData.env_list.map((item: any) =>
                                      item.trim()
                                    )
                                  )
                                );

                                const allPrefilled = newValue.every(
                                  (value: any) =>
                                    uniquePrefilledValues.includes(value.trim())
                                );

                                if (allPrefilled) {
                                  setErrMsg(
                                    'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                  );
                                  setIsOpen(true);
                                } else {
                                  const updatedValues = Array.from(
                                    new Set([
                                      ...uniquePrefilledValues,
                                      ...newValue,
                                    ])
                                  );
                                  setFieldValue(field, updatedValues);
                                }
                              }}
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
                              secondChange={(field: any, newValue: any) => {
                                const uniquePrefilledValues = Array.from(
                                  new Set(
                                    fullRecordData.social_list.map(
                                      (item: any) => item.trim()
                                    )
                                  )
                                );

                                const allPrefilled = newValue.every(
                                  (value: any) =>
                                    uniquePrefilledValues.includes(value.trim())
                                );

                                if (allPrefilled) {
                                  setErrMsg(
                                    'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                  );
                                  setIsOpen(true);
                                } else {
                                  const updatedValues = Array.from(
                                    new Set([
                                      ...uniquePrefilledValues,
                                      ...newValue,
                                    ])
                                  );
                                  setFieldValue(field, updatedValues);
                                }
                              }}
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
                              secondChange={(field: any, newValue: any) => {
                                const uniquePrefilledValues = Array.from(
                                  new Set(
                                    fullRecordData.governance_list.map(
                                      (item: any) => item.trim()
                                    )
                                  )
                                );

                                const allPrefilled = newValue.every(
                                  (value: any) =>
                                    uniquePrefilledValues.includes(value.trim())
                                );

                                if (allPrefilled) {
                                  setErrMsg(
                                    'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                  );
                                  setIsOpen(true);
                                } else {
                                  const updatedValues = Array.from(
                                    new Set([
                                      ...uniquePrefilledValues,
                                      ...newValue,
                                    ])
                                  );
                                  setFieldValue(field, updatedValues);
                                }
                              }}
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
                                secondChange={(field: any, newValue: any) => {
                                  // Ensure unique values in the prefilled list for comparison
                                  const uniquePrefilledValues = Array.from(
                                    new Set(
                                      fullRecordData.issb_sections.map(
                                        (item: any) => item.trim()
                                      )
                                    )
                                  );

                                  // Check if all clicked values are prefilled
                                  const allPrefilled = newValue.every(
                                    (value: any) =>
                                      uniquePrefilledValues.includes(
                                        value.trim()
                                      )
                                  );

                                  if (allPrefilled) {
                                    setErrMsg(
                                      'Please be advised that for the current Reporting Period, only the addition of new material topics is permitted in the configuration. Deletions are not allowed.'
                                    );
                                    setIsOpen(true);
                                  } else {
                                    const updatedValues = Array.from(
                                      new Set([
                                        ...uniquePrefilledValues,
                                        ...newValue,
                                      ])
                                    );
                                    setFieldValue(field, updatedValues);
                                  }
                                }}
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
                  {Scope1?.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${
                        selectedScope1?.includes(option.value)
                          ? Styles.selectedDiv
                          : ''
                      }`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setSelectedScope1,
                          selectedScope1,
                          fullRecordData?.scope1 || [] // Pass prefilled values
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
                  {Scope2?.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${selectedScope2?.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setSelectedScope2,
                          selectedScope2,
                          fullRecordData?.scope2 || [] // Pass prefilled values
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
                  {Scope3?.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${selectedScope3?.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setSelectedScope3,
                          selectedScope3,
                          fullRecordData?.scope3 || [] // Pass prefilled values
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
                  {CustomEmissionFactor?.map((option, index) => (
                    <Button
                      key={index}
                      className={`${Styles.scopesDiv} ${customEmission?.includes(option.value) ? Styles.selectedDiv : ''}`}
                      onClick={() =>
                        handleButtonClick(
                          option,
                          setCustomEmission,
                          customEmission,
                          fullRecordData?.custom_ef || [] // Pass prefilled values
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
                    <p> {fullRecordData.financial_year}</p>
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
                <Col className="mt-3">
                  <TabsComponent
                    tabs={MainTabData}
                    defaultActiveKey={mainTabKey}
                    onChange={handleMainTabChange}
                  />
                  {mainTabKey === '1' && (
                    <>
                      <Row>
                        <Col span={24}>
                          {values.framework && values.framework.length > 1 ? (
                            <>
                              <TabsComponent
                                tabs={tabData}
                                defaultActiveKey="1"
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
                                          <p
                                            className={Styles.newConfigTitleTwo}
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
                                        .map(
                                          (chunk: any[], colIndex: number) => (
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
                                          )
                                        )}
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
                                    defaultActiveKey="1"
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
                      <Row>
                        <Col lg={24} md={24} sm={24} xs={24} className="mt-1">
                          <p className={Styles.newConfigTitle}>
                            Selected Emission Factor Database as per the
                            Emission Type
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
                                            <span
                                              className={Styles.selectedTick}
                                            >
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
                                            <span
                                              className={Styles.selectedTick}
                                            >
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
                                            <span
                                              className={Styles.selectedTick}
                                            >
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

                              {/* Render Custom Emission if selected */}
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
                                            <span
                                              className={Styles.selectedTick}
                                            >
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
                </Col>
              </>
            )}

            <Row justify="end">
              {currentStep !== 2 && (
                <Col className={Styles.paddingItems}>
                  {/* <ButtonComponent
                    hierarchy="tertiary"
                    htmlType="reset"
                    onClick={() => {
                      handleResetValues(currentStep, values, setValues);
                    }}
                    size="xl"
                  >
                    Reset
                  </ButtonComponent> */}
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
                    Update
                  </ButtonComponent>
                </Col>
              )}
            </Row>
          </Form>
        )}
      </Formik>
      {isOpen && (
        <ModalComponent
          isOpen={isOpen}
          cancelBtnText="Ok"
          onClose={() => setIsOpen(false)}
          content={errMsg}
        />
      )}
    </div>
  );
};

export default EsgConfigEdit;
