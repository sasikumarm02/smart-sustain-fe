import React, { useEffect, useState } from 'react';
import {
  Formik,
  FieldArray,
  Field,
  Form as FormikForm,
  ErrorMessage,
} from 'formik';
import { Button, Col, Input, message, Row, Select, Spin } from 'antd';
import styles from '../CountCards/CountCard.module.scss';
import { ButtonComponent } from '../../../DesignLibrary';
import { useAuth } from '../../../Hooks/useAuth';
import { post } from '../../../Services';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const { Option } = Select;

// Define your initial values

interface FormProps {
  title: string;
  subtitle: string;
  columnHeaders: string[];
  initialValue: any[];
  createApi: string;
  formOptions?: any[];
  fieldName: string;
  activetab?: any;
}
const FormComponent: React.FC<FormProps> = ({
  title,
  subtitle,
  columnHeaders,
  initialValue,
  createApi,
  formOptions,
  fieldName,
  activetab,
}) => {
  const initialValues = {
    rows: initialValue?.map((row) => ({ ...row })),
  };

  const [selectedValues, setSelectedValues] = useState<any>([]);

  const getFilteredOptions = (index: any) => {
    const selectedInOtherRows = selectedValues.filter(
      (val: any, idx: any) => idx !== index
    );
    return formOptions?.filter(
      (option) => !selectedInOtherRows.includes(option)
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const fieldnames = Object.keys(initialValues.rows[0]);
  const navigate = useNavigate();

  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location?.state || '1');
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  useEffect(() => {
    setActiveKey(activetab);
  }, [activetab]);
  const validationSchema = Yup.object().shape({
    rows: Yup.array().of(
      Yup.object().shape({
        employee_type: fieldnames.includes('employee_type')
          ? Yup.string().required('Employee Type is required')
          : Yup.string(),
        turnover_type: fieldnames.includes('turnover_type')
          ? Yup.string().required('Turnover Type is required')
          : Yup.string(),
        //turnover_type: Yup.string().required("Field is required"),
        male: Yup.number().required('Field is required'),
        female: Yup.number().required('Field is required'),
        age_lt_30: Yup.number().required('Field is required'),
        age_30_to_50: Yup.number().required('Field is required'),
        age_gt_50: Yup.number().required('Field is required'),
      })
    ),
  });

  const handleSubmit = (values: any, { resetForm }: any) => {
    setIsLoading(true);

    let body = {
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected ? facilitySelected : '',
      emp_data: values.rows,
    };

    const isValid = values.rows.some((row: any) => {
      return checkValidationError(row);
    });

    if (isValid) {
      message.error(
        'The number of ages does not match the number of genders. Please ensure they are equal.'
      );
      setIsLoading(false); // Ensure loading state is reset
    } else {
      post(createApi, body)
        .then((res: any) => {
          if (res?.status === 'Success') {
            message.success(res.message);
          }
        })
        .catch((err) => {
          // Handle error if needed
        })
        .finally(() => {
          setIsLoading(false); // Ensure loading state is reset
          resetForm(); // Reset the form
          // Navigate or handle routing here

          navigate('/employee-demographics', {
            state: {
              activeKey: activeKey,
              currentFacility: facilitySelected,
            },
          });
        });
    }
  };

  const checkValidationError = (values: any) => {
    const { age_gt_50, age_30_to_50, age_lt_30, female, male } = values;
    const ageSum = age_gt_50 + age_30_to_50 + age_lt_30;
    const genderSum = female + male;
    if (ageSum !== genderSum) {
      return true;
    }
  };

  return (
    <div className={styles.customPaddingTop}>
      <h2 className={styles.secondaryHeading}>{title}</h2>

      <Row className={styles.customPaddingTop}>
        <Col span={6}>
          <h4 className={styles.formTitle}>{columnHeaders[0]}</h4>
        </Col>
        <Col span={6}>
          <h4 className={styles.formTitle}>{columnHeaders[1]}</h4>
        </Col>
        <Col span={8}>
          <h4 className={styles.formTitle}>{columnHeaders[2]}</h4>
        </Col>
        <Col span={4}></Col>
      </Row>
      <Row>
        <Col span={6}>
          <div className={styles.gendercategory}>
            <p className={styles.formSubTitle}>{fieldName}</p>
          </div>
        </Col>
        <Col span={6}>
          <div className={styles.gendercategory}>
            <p className={styles.formSubTitle}>Male</p>
            <p className={styles.formSubTitle}>Female</p>
          </div>
        </Col>
        <Col span={10}>
          <div className={styles.gendercategory}>
            <p className={styles.formSubTitle}>&lt;30</p>
            <p className={styles.formSubTitle}>30-50</p>
            <p className={styles.formSubTitle}>&gt;50</p>
          </div>
        </Col>
      </Row>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleSubmit, isValid, dirty }) => (
          <Spin spinning={isLoading}>
            <FormikForm onSubmit={handleSubmit}>
              <FieldArray name="rows">
                {({ push, remove }) => (
                  <>
                    {values.rows.map((row, index) => (
                      <Row
                        key={index}
                        gutter={[0, 15]}
                        className="data-row mt-2"
                      >
                        <Col span={6} className={styles.customPaddingRight}>
                          <Field
                            name={`rows[${index}].${fieldnames[0]}`}
                            render={({ field }: any) => (
                              <div>
                                <Select
                                  {...field}
                                  style={{ height: '44px', width: '100%' }}
                                  placeholder="Select"
                                  onChange={(value) => {
                                    const updatedValues = [...selectedValues];
                                    updatedValues[index] = value;
                                    setSelectedValues(updatedValues);
                                    handleChange({
                                      target: {
                                        name: field.name,
                                        value: value,
                                      },
                                    });
                                  }}
                                >
                                  {getFilteredOptions(index)?.map(
                                    (option, idx) => (
                                      <Option key={idx} value={option}>
                                        {option}
                                      </Option>
                                    )
                                  )}
                                </Select>
                                <ErrorMessage
                                  name={`rows[${index}].${fieldnames[0]}`}
                                  component="div"
                                  className="error"
                                />
                              </div>
                            )}
                          />
                        </Col>
                        <Col span={6} className={styles.customPaddingRight}>
                          <div className={styles.flexInputs}>
                            <Field
                              name={`rows[${index}].${fieldnames[1]}`}
                              render={({ field }: any) => (
                                <div>
                                  <Input
                                    {...field}
                                    onKeyDown={(e: any) => {
                                      if (
                                        e.key === '-' ||
                                        e.key === '.' ||
                                        e.key === 'e' ||
                                        e.key === 'E'
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    type="number"
                                    placeholder="Male"
                                  />
                                  <ErrorMessage
                                    name={`rows[${index}].male`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              )}
                            />

                            <Field
                              name={`rows[${index}].${fieldnames[2]}`}
                              render={({ field }: any) => (
                                <div>
                                  <Input
                                    onKeyDown={(e: any) => {
                                      if (
                                        e.key === '-' ||
                                        e.key === '.' ||
                                        e.key === 'e' ||
                                        e.key === 'E'
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    {...field}
                                    type="number"
                                    placeholder="Female"
                                  />
                                  <ErrorMessage
                                    name={`rows[${index}].female`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </Col>
                        <Col span={10} className={styles.customPaddingRight}>
                          <div className={styles.flexInputs}>
                            <Field
                              name={`rows[${index}].${fieldnames[3]}`}
                              render={({ field }: any) => (
                                <div>
                                  <Input
                                    onKeyDown={(e: any) => {
                                      if (
                                        e.key === '-' ||
                                        e.key === '.' ||
                                        e.key === 'e' ||
                                        e.key === 'E'
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    {...field}
                                    type="number"
                                    placeholder="<30"
                                  />
                                  <ErrorMessage
                                    name={`rows[${index}].${fieldnames[3]}`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              )}
                            />
                            <Field
                              name={`rows[${index}].${fieldnames[4]}`}
                              render={({ field }: any) => (
                                <div>
                                  <Input
                                    onKeyDown={(e: any) => {
                                      if (
                                        e.key === '-' ||
                                        e.key === '.' ||
                                        e.key === 'e' ||
                                        e.key === 'E'
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    {...field}
                                    type="number"
                                    placeholder="30-50"
                                  />
                                  <ErrorMessage
                                    name={`rows[${index}].${fieldnames[4]}`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              )}
                            />
                            <Field
                              name={`rows[${index}].age_gt_50`}
                              render={({ field }: any) => (
                                <div>
                                  <Input
                                    onKeyDown={(e: any) => {
                                      if (
                                        e.key === '-' ||
                                        e.key === '.' ||
                                        e.key === 'e' ||
                                        e.key === 'E'
                                      ) {
                                        e.preventDefault();
                                      }
                                    }}
                                    {...field}
                                    type="number"
                                    placeholder=">50"
                                  />
                                  <ErrorMessage
                                    name={`rows[${index}].age_gt_50`}
                                    component="div"
                                    className="error"
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </Col>
                        <Col span={2}>
                          <div className={styles.flexInputs}>
                            <Button
                              onClick={() => remove(index)}
                              style={{ height: '44px' }}
                              disabled={values.rows.length === 1}
                              className={styles.plusButton}
                            >
                              -
                            </Button>
                            <Button
                              style={{ height: '44px' }}
                              disabled={getFilteredOptions(index)?.length === 1}
                              className={styles.plusButton}
                              onClick={() => {
                                if (!isValid || !dirty) {
                                  message.warning('Please fill all the fields');
                                } else if (
                                  values.rows.some((row: any) => {
                                    return checkValidationError(row);
                                  })
                                ) {
                                  message.error(
                                    'The number of ages does not match the number of genders. Please ensure they are equal.'
                                  );
                                } else {
                                  if (
                                    initialValues &&
                                    initialValues.rows &&
                                    initialValues.rows.length > 0
                                  ) {
                                    push({ ...initialValues.rows[0] });
                                  }
                                }
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </FieldArray>

              <Row justify="end" className={styles.customPaddingTop}>
                <Col className={styles.customPaddingRight}>
                  <ButtonComponent
                    htmlType="reset"
                    hierarchy="tertiary"
                    onClick={() =>
                      navigate('/employee-demographics', {
                        state: {
                          activeKey: activeKey,
                          currentFacility: facilitySelected,
                        },
                      })
                    }
                  >
                    Cancel
                  </ButtonComponent>
                </Col>
                <Col className={styles.customPaddingRight}>
                  <ButtonComponent htmlType="reset" hierarchy="secondary">
                    Reset
                  </ButtonComponent>
                </Col>
                <Col>
                  <ButtonComponent
                    htmlType="submit"
                    disabled={!isValid || !dirty}
                  >
                    Submit
                  </ButtonComponent>
                </Col>
              </Row>
            </FormikForm>
          </Spin>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
