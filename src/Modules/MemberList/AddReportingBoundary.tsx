import React from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  Card,
  Col,
  Row,
} from 'antd';
import { Formik, useFormik } from 'formik';
import CustomSelect from '../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';

export default function AddReportingMember({ formFields, pageTitle }: any) {
  const navigate = useNavigate();

  console.log(formFields, 'formFields');

  const initialValues = formFields.reduce((accumulator: any, field: any) => {
    accumulator[field.name] = '';
    return accumulator;
  }, {});

  return (
    <>
      <h4 className="highlightText font-weight-bold breadTitle">{pageTitle}</h4>
      <Card style={{ minHeight: '400px', overflow: 'hidden' }}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            console.log('values', values);
            navigate('/community');
            resetForm();
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
          }) => (
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              onReset={handleReset}
            >
              {formFields.map((field: any, index: any) => (
                <Row
                  key={index}
                  gutter={10}
                  className="mt-3"
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                  }}
                >
                  <Col span={5}>
                    {' '}
                    <strong style={{ color: '#00338D' }}>{field.label}</strong>
                  </Col>
                  <Col span={12}>
                    {field.type === 'select' ? (
                      <CustomSelect
                        name={field.name}
                        placeholder={field.placeholder}
                        options={field.options}
                        errors={errors[field.name as any]}
                        touched={touched[field.name as any]}
                        value={values[field.name as any]}
                        secondChange={setFieldValue}
                        hook={handleChange}
                        blur={handleBlur}
                        status={
                          (touched[field.name as any] &&
                            errors[field.name as any] &&
                            'error') ||
                          ''
                        }
                      />
                    ) : (
                      <Input
                        name={field.name}
                        placeholder={field.placeholder}
                        value={values[field.name as keyof typeof initialValues]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ height: '45px' }}
                      />
                    )}
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  htmlType="submit"
                  className="btn-prim"
                  style={{
                    borderRadius: '30px',
                    background: '#00338D',
                    color: '#fff',
                    float: 'right',
                    marginTop: '30px',
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
}
