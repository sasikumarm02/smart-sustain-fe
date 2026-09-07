import React from 'react';
import CustomButton from '../../../Components/customButton';
import {
  Col,
  Row,
  Form,
  Button,
  Typography,
  Input,
  Select,
  Form as AntdForm,
  Tabs,
  message,
  Upload,
} from 'antd';
import UploadIcon from '../../../assets/image/uploadIcon.png';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

import Styles from '../../../Modules/UserScreen/ProcessEmission/processEmission.module.scss';
import { Formik } from 'formik';
import * as Yup from 'yup';
import type { TabsProps } from 'antd';
import CustomDatePicker from '../../../Components/FormInput/CustomDatePicker';
import CustomSelect from '../../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../Components/FormInput/CustomInput';
import { useAuth } from '../../../Hooks/useAuth';
interface Values {}

interface PolicyFormValues {
  entity_id: string;
  policyPublished: string;
  national_international_code: string;
  weblinkPolicy: string;
  translatedPolicy: string;
  policy_reason: { question: string; answer: string }[];
  partnersPolicy: string;
  employee_weblink_complaints: string;
  external_weblink_complaints: string;
  anticorruption_weblink: string;
  cyberSecurity: string;
  businessContinuity: string;
  humanRightRequirements: string;
  equal_opportunity_weblink: string;
  mechanism_to_preventAdverseConsequences: string;
  premiseId: string;
  startDate: string;
  endDate: string;
  detailsOfBusiness: string;
  preferentialProcurement: String;
  incorporationDate: any;
  compliance: { principles: string; codes: string; amount: number }[];
}
function Forms() {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const initialValues: PolicyFormValues = {
    entity_id: '',
    policyPublished: '',
    incorporationDate: '',
    national_international_code: '',
    weblinkPolicy: '',
    translatedPolicy: '',
    partnersPolicy: '',
    employee_weblink_complaints: '',
    external_weblink_complaints: '',
    anticorruption_weblink: '',
    cyberSecurity: '',
    businessContinuity: '',
    humanRightRequirements: '',
    equal_opportunity_weblink: '',
    mechanism_to_preventAdverseConsequences: '',
    premiseId: '',
    startDate: '',
    endDate: '',
    detailsOfBusiness: '',
    preferentialProcurement: '',
    policy_reason: [
      {
        question:
          'The entity does not consider the Principles material to its business',
        answer: '',
      },
      {
        question:
          ' The entity is not at a stage where it is in a position to formulate and implement the policies on specified principles',
        answer: '',
      },
      {
        question:
          'The entity does not have the financial or/human and technical resources available for the task',
        answer: '',
      },
      {
        question: 'It is planned to be done in the next financial year',
        answer: '',
      },
    ],
    compliance: [{ principles: '', codes: '', amount: 0 }],
  };
  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },

    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const navigate = useNavigate();
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col>
          <p className={Styles.breadCrumbMain}>
            Governance / <span>Assurances</span>{' '}
          </p>
        </Col>
      </Row>
      <Row justify="end" style={{ background: '#fff', paddingTop: '10px' }}>
        <Col span={10} style={{ display: 'contents' }}>
          <Formik
            initialValues={{
              incorporationDate: '',
              entitySelect: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { resetForm }) => {
              navigate('/add-facility');
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
                  onReset={handleReset}
                >
                  <Row
                    justify="center"
                    //   gutter={10}
                  >
                    <>
                      <Col span={12} className="CustomDate">
                        <CustomDatePicker
                          label=""
                          name="incorporationDate"
                          errors={errors.incorporationDate}
                          touched={touched.incorporationDate}
                          value={values.incorporationDate}
                          secondChange={setFieldValue}
                          blur={handleBlur}
                          size="large"
                          calenderColor={'#ffffff'}
                          status={
                            (touched.incorporationDate &&
                              errors.incorporationDate &&
                              'error') ||
                            ''
                          }
                        />
                      </Col>
                      <Col span={12} className="SelectField">
                        <CustomSelect
                          label=""
                          name="entitySelect"
                          type="text"
                          size="large"
                          placeholder="Facility"
                          selectColor={'#00B8F5'}
                          options={[
                            {
                              value: 'Central Regain',
                              label: 'Central Regain',
                            },
                            {
                              value: 'East Regain',
                              label: 'East Regain',
                            },
                            {
                              value: 'North Regain',
                              label: 'North Regain',
                            },
                            {
                              value: 'North East Regain',
                              label: 'North East Regain',
                            },
                          ].map((item: any) => ({
                            value: item.value,
                          }))}
                          errors={errors.entitySelect}
                          touched={touched.entitySelect}
                          value={values.entitySelect}
                          secondChange={setFieldValue}
                          hook={handleChange}
                          blur={handleBlur}
                          status={
                            (touched.entitySelect &&
                              errors.entitySelect &&
                              'error') ||
                            ''
                          }
                        />
                      </Col>
                    </>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Col>
        <Col span={24} className="AnttabSty">
          <Formik
            initialValues={{
              compliance: [{ principles: '', codes: '', amount: '' }],
              incorporationDate: '',
            }}
            validationSchema={Yup.object().shape({
              compliance: Yup.array().of(
                Yup.object().shape({
                  principles: Yup.string().required('Principles are required'),
                  codes: Yup.string().required('Codes are required'),
                  amount: Yup.number()
                    .typeError('Amount must be a number')
                    .required('Amount is required')
                    .min(0, 'Amount must be greater than or equal to 0'),
                })
              ),
            })}
            onSubmit={async (values, { resetForm }) => {
              console.log(values, 'values');
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
            }) => {
              return (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  onReset={handleReset}
                >
                  <Row className="form-grid" gutter={12}>
                    <Typography.Text className={Styles.FormHeader}>
                      Internal
                    </Typography.Text>
                    <Col span={24}>
                      <div
                        style={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                        }}
                      >
                        <Form.List name="compliance" initialValue={[{}]}>
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(
                                ({ key, name, ...restField }, index) => (
                                  <Row gutter={20} justify="start" key={key}>
                                    <Col
                                      lg={8}
                                      md={8}
                                      sm={8}
                                      className="FormInputSty"
                                    >
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'codes']}
                                        style={{
                                          marginBottom: 0,
                                        }}
                                      >
                                        <CustomDatePicker
                                          label=""
                                          name="incorporationDate"
                                          errors={errors.incorporationDate}
                                          touched={touched.incorporationDate}
                                          value={values.incorporationDate}
                                          secondChange={setFieldValue}
                                          blur={handleBlur}
                                          size="large"
                                          calenderColor={'#ffffff'}
                                          status={
                                            (touched.incorporationDate &&
                                              errors.incorporationDate &&
                                              'error') ||
                                            ''
                                          }
                                          style={{
                                            padding: '10px 27px',
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col lg={5} md={6} sm={8}>
                                      <div>
                                        <Form.Item
                                          className="gstFormItem"
                                          // {...restField}
                                        >
                                          <Upload {...props}>
                                            <Button
                                              style={{
                                                height: '45px',
                                                fontSize: '20px',
                                                color: '#009BD2',
                                              }}
                                            >
                                              Upload{' '}
                                              <img
                                                src={UploadIcon}
                                                style={{ paddingLeft: '10px' }}
                                                alt=""
                                              />
                                            </Button>
                                          </Upload>
                                        </Form.Item>
                                      </div>
                                    </Col>
                                    <Col lg={3} md={3} sm={4}>
                                      {fields.length > 1 && (
                                        <Button
                                          onClick={() => remove(name)}
                                          block
                                          style={{
                                            height: '45px',
                                            color: '#E22C04',
                                            border: '1px solid #E22C04',
                                            width: '100%',
                                          }}
                                        >
                                          -
                                        </Button>
                                      )}
                                    </Col>
                                    <Col lg={3} md={3} sm={4}>
                                      {index === fields.length - 1 && (
                                        <Form.Item>
                                          <Button
                                            onClick={() => add()}
                                            block
                                            style={{
                                              height: '45px',
                                              color: '#fff',
                                              width: '100%',
                                              background: '#00338D',
                                            }}
                                          >
                                            +
                                          </Button>
                                        </Form.Item>
                                      )}
                                    </Col>
                                  </Row>
                                )
                              )}
                            </>
                          )}
                        </Form.List>
                      </div>
                    </Col>
                  </Row>
                  <Row className="form-grid" gutter={12}>
                    <Typography.Text className={Styles.FormHeader}>
                      External
                    </Typography.Text>
                    <Col span={24}>
                      <div
                        style={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                        }}
                      >
                        <Form.List name="compliance" initialValue={[{}]}>
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(
                                ({ key, name, ...restField }, index) => (
                                  <Row
                                    gutter={12}
                                    justify="start"
                                    key={key}
                                    className="mt-2"
                                  >
                                    <Col lg={6} md={6} sm={8}>
                                      <div>
                                        <Form.Item
                                          className="gstFormItem"
                                          // {...restField}
                                          style={{ marginRight: '10px' }}
                                        >
                                          <Input
                                            value={
                                              values.compliance[index]?.amount
                                            }
                                            placeholder="Name of the Agency"
                                            onChange={(e) => {
                                              setFieldValue(
                                                `compliance[${index}].amount`,
                                                e.target.value
                                              );
                                            }}
                                            style={{
                                              borderRadius: '8px',
                                              width: '100%',
                                              height: '45px',
                                            }}
                                          />
                                        </Form.Item>
                                      </div>
                                    </Col>
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={8}
                                      className="FormInputSty"
                                    >
                                      <Form.Item
                                        {...restField}
                                        name={[name, 'codes']}
                                        style={{
                                          marginBottom: 0,
                                        }}
                                      >
                                        <CustomDatePicker
                                          label=""
                                          name="incorporationDate"
                                          errors={errors.incorporationDate}
                                          touched={touched.incorporationDate}
                                          value={values.incorporationDate}
                                          secondChange={setFieldValue}
                                          blur={handleBlur}
                                          size="large"
                                          calenderColor={'#ffffff'}
                                          status={
                                            (touched.incorporationDate &&
                                              errors.incorporationDate &&
                                              'error') ||
                                            ''
                                          }
                                          style={{
                                            padding: '10px 27px',
                                          }}
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col lg={6} md={6} sm={8}>
                                      <div>
                                        <Form.Item
                                          className="gstFormItem"
                                          // {...restField}
                                        >
                                          <Upload {...props}>
                                            <Button
                                              style={{
                                                width: '100%',
                                                height: '45px',
                                                fontSize: '20px',
                                                color: '#009BD2',
                                              }}
                                            >
                                              Upload{' '}
                                              <img
                                                src={UploadIcon}
                                                style={{ paddingLeft: '10px' }}
                                                alt=""
                                              />
                                            </Button>
                                          </Upload>
                                        </Form.Item>
                                      </div>
                                    </Col>
                                    <Col lg={2} md={3} sm={4}>
                                      {fields.length > 1 && (
                                        <Button
                                          onClick={() => remove(name)}
                                          block
                                          style={{
                                            height: '45px',
                                            color: '#E22C04',
                                            width: '4rem',
                                            border: '1px solid #E22C04',
                                          }}
                                        >
                                          -
                                        </Button>
                                      )}
                                    </Col>
                                    <Col lg={2} md={3} sm={4}>
                                      {index === fields.length - 1 && (
                                        <Form.Item>
                                          <Button
                                            onClick={() => add()}
                                            block
                                            style={{
                                              height: '45px',
                                              color: '#fff',
                                              background: '#00338D',
                                            }}
                                          >
                                            +
                                          </Button>
                                        </Form.Item>
                                      )}
                                    </Col>
                                  </Row>
                                )
                              )}
                            </>
                          )}
                        </Form.List>
                      </div>
                    </Col>
                  </Row>
                  <Row justify="end">
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Clear All
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          className={Styles.BtnDesign}
                          htmlType="submit"

                          //   loading={isLoading}
                          //disabled={!(isValid && dirty)}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

export default Forms;
