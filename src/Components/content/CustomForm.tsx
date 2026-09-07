import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Form, Button, Typography, Input } from 'antd';
import styles from '../FormInput/FromItems.module.scss';
import CustomInput from '../FormInput/CustomInput';
import CustomSelect from '../FormInput/CustomSelect';
import CustomDatePicker from '../FormInput/CustomDatePicker';
import { post } from '../../Services';
import { useSelector } from 'react-redux';

interface Values {}
const CustomForm = (props: any) => {
  const data = props.formData;
  return (
    <Formik
      initialValues={props.initialValues}
      validationSchema={Yup.object().shape({})}
      onSubmit={(values, { resetForm }) => {
        post(props.apiPath, values);
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
          <Form layout="vertical" onFinish={handleSubmit} onReset={handleReset}>
            <Row justify="center" gutter={10}>
              {data.map((data: any, index: number) => (
                <Col
                  lg={data.screenSize}
                  key={index}
                  className="custom-select-icon-dgn"
                >
                  {data.dataType === 'input' && (
                    <CustomInput
                      label={data.label}
                      size="large"
                      name={data.name}
                      type="text"
                      labelColor="#00338D"
                      errors={errors[data.name as keyof Values]}
                      touched={touched[data.name as keyof Values]}
                      value={values[data.name as keyof Values]}
                      hook={handleChange}
                      blur={() => setFieldTouched(`${data.name}`, true)}
                      status={
                        (touched[data.name as keyof Values] &&
                          errors[data.name as keyof Values] &&
                          'error') ||
                        ''
                      }
                    />
                  )}
                  {data.dataType === 'select' && (
                    <CustomSelect
                      name={data.name}
                      size="large"
                      label={data.label}
                      options={data.list}
                      labelColor="#00338D"
                      errors={errors[data.name as keyof Values]}
                      touched={touched[data.name as keyof Values]}
                      value={values[data.name as keyof Values]}
                      secondChange={setFieldValue}
                      hook={handleChange}
                      blur={() => setFieldTouched(`${data.name}`, true)}
                      status={
                        (touched[data.name as keyof Values] &&
                          errors[data.name as keyof Values] &&
                          'error') ||
                        ''
                      }
                    />
                  )}
                  {data.dataType === 'datePicker' && (
                    <CustomDatePicker
                      label={data.label}
                      name={data.name}
                      labelColor="#00338D"
                      errors={errors[data.name as keyof Values]}
                      touched={touched[data.name as keyof Values]}
                      value={values[data.name as keyof Values]}
                      secondChange={setFieldValue}
                      blur={() => setFieldTouched(`${data.name}`, true)}
                      size="large"
                      status={
                        (touched[data.name as keyof Values] &&
                          errors[data.name as keyof Values] &&
                          'error') ||
                        ''
                      }
                    />
                  )}
                  {data.dataType === 'textArea' && (
                    <Form.Item
                      label={
                        <label
                          className={styles.formLabel}
                          style={{ color: '#00338D' }}
                        >
                          {data.label}
                        </label>
                      }
                    >
                      <Input.TextArea
                        rows={4}
                        name={data.name}
                        value={values[data.name as keyof Values]}
                        onChange={handleChange}
                        onBlur={() => setFieldTouched(`${data.name}`, true)}
                        status={
                          (touched[data.name as keyof Values] &&
                            errors[data.name as keyof Values] &&
                            'error') ||
                          ''
                        }
                        style={{ borderRadius: '5px' }}
                      />
                      {errors[data.name as keyof Values] &&
                        touched[data.name as keyof Values] && (
                          <Typography.Text
                            type="danger"
                            style={{ textAlign: 'left' }}
                          >
                            errors[data.name as keyof Values]
                          </Typography.Text>
                        )}
                    </Form.Item>
                  )}
                </Col>
              ))}
            </Row>
            <Row justify="center" gutter={12}>
              <Col lg={10}>
                <Form.Item>
                  <Button
                    className={styles.guestButton}
                    size="large"
                    block
                    htmlType="reset"
                  >
                    Reset
                  </Button>
                </Form.Item>
              </Col>
              <Col lg={10}>
                <Form.Item>
                  <Button
                    className={styles.LoginButton}
                    block
                    htmlType="submit"
                    disabled={!(isValid && dirty)}
                    size="large"
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
  );
};

export default CustomForm;
