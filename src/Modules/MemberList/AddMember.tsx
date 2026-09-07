import React from 'react';
import { Form, Button, Card, Col, Row } from 'antd';
import Styles from '../../Components/Social/form.module.scss';
import { Formik } from 'formik';
import CustomSelect from '../../Components/FormInput/CustomSelect';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../Components/FormInput/CustomInput';

interface Values {}
export default function AddMember({ formFields, pageTitle }: any) {
  const navigate = useNavigate();

  const initialValues = formFields.reduce((accumulator: any, field: any) => {
    accumulator[field.name] = '';
    return accumulator;
  }, {});

  return (
    <>
      <h4 className="highlightText font-weight-bold breadTitle mt-4 mb-2">
        {pageTitle}
      </h4>
      <Card className="p-2">
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
                <Row key={index} gutter={10} align="middle">
                  <Col
                    lg={6}
                    md={8}
                    sm={12}
                    xs={24}
                    className="formLabel mt-4 mt-md-3 mt-sm-2"
                  >
                    <p>{field.label}</p>
                  </Col>
                  <Col lg={10} md={12} sm={14} xs={24} className="mt-3">
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
                        size="large"
                        status={
                          (touched[field.name as any] &&
                            errors[field.name as any] &&
                            'error') ||
                          ''
                        }
                      />
                    ) : (
                      <CustomInput
                        size="large"
                        name={field.name}
                        type="text"
                        errors={
                          touched[field.name as keyof Values] &&
                          errors[field.name as keyof Values]
                        }
                        touched={touched}
                        value={values[field.name as keyof Values]}
                        hook={handleChange}
                        blur={handleBlur}
                        status={
                          (touched[field.name as keyof Values] &&
                            errors[field.name as keyof Values] &&
                            'error') ||
                          ''
                        }
                      />
                    )}
                  </Col>
                </Row>
              ))}
              <Row justify="end" style={{ paddingTop: '20px' }}>
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
          )}
        </Formik>
      </Card>
    </>
  );
}
