import React from 'react';
import { Formik, FieldArray, Field } from 'formik';
import { Input, Form, Button, Card, Col, Row, Typography, Select } from 'antd';
import CustomInput from '../../Components/FormInput/CustomInput';
import { FYear } from '../../Utils/Strings';
import { MinusCircleOutlined } from '@ant-design/icons';
import { UomDropdown } from '../../Components/EntityMeasurments/Measurments';
interface Values {}

export default function SupplierForm() {
  const inputStyle = {
    height: '40px',
  };
  const label = {
    fontWeight: '700',
    fontSize: '16px',
    color: '#666666',
  };

  const reset = {
    border: '1px solid #1E5190',
    color: '#1E5190',
    background: 'transparent',
    borderRadius: '30px',
  };
  const submit = {
    border: '1px solid #1E5190',
    color: '#fff',
    background: '#1E5190',
    borderRadius: '30px',
  };
  return (
    <div className="bg-white p-4 mt-4">
      <Row gutter={10}>
        <Col span={12}>
          <Typography.Text
            className="font-weight-bolder h4 titleTag"
            style={{ color: '#23456A' }}
          >
            Name of Supplier
          </Typography.Text>
        </Col>
        <Col span={12}>
          <h6 style={{ textAlign: 'right' }}>
            Reporting Period :{' '}
            <span style={{ color: '#040404', fontWeight: '700' }}>
              FY&nbsp;{FYear}
            </span>
          </h6>
        </Col>
        <Col span={24} className="mt-4">
          <Formik
            initialValues={{
              nameOfTheCompany: '',
              nameOfTheContactPerson: '',
              emailId: '',
              phoneNumber: '',
              products: [{ productName: '', uom: '', quantity: '' }],
            }}
            onSubmit={(values) => {
              console.log(values);
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
            }) => (
              <Form
                layout="vertical"
                onFinish={handleSubmit}
                onReset={handleReset}
              >
                {[
                  { label: 'Name of the Company:', name: 'nameOfTheCompany' },
                  {
                    label: 'Name of them Contact Person:',
                    name: 'nameOfTheContactPerson',
                  },
                  { label: 'Email Id', name: 'emailId' },
                  { label: 'Phone Number:', name: 'phoneNumber' },
                ].map((data: any, index: number) => (
                  <Row key={index}>
                    <Col xl={8} lg={8} md={10} sm={24} xs={24}>
                      <label
                        htmlFor="nameOfTheCompany"
                        className="secondaryFont"
                        style={label}
                      >
                        {data.label}
                      </label>
                    </Col>
                    <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                      <CustomInput
                        size="large"
                        name={data.name}
                        type="text"
                        errors={
                          touched[data.name as keyof Values] &&
                          errors[data.name as keyof Values]
                        }
                        touched={touched}
                        value={values[data.name as keyof Values]}
                        hook={handleChange}
                        blur={handleBlur}
                        status={
                          (touched[data.name as keyof Values] &&
                            errors[data.name as keyof Values] &&
                            'error') ||
                          ''
                        }
                      />
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col lg={24} className="mb-3">
                    <label
                      htmlFor="nameOfTheCompany"
                      className="secondaryFont"
                      style={label}
                    >
                      Name of the product or service
                    </label>
                  </Col>
                  <Col lg={24}>
                    <Form.List name="products" initialValue={[{}]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }, index) => (
                            <Row gutter={12} key={key}>
                              <Col xl={8} lg={10} md={8} sm={14} xs={24}>
                                <div>
                                  <Form.Item
                                    className="gstFormItem"
                                    // {...restField}
                                  >
                                    <Input
                                      size="large"
                                      value={
                                        values.products[index]?.productName
                                      }
                                      placeholder="Name of the product"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `products[${index}].productName`,
                                          e.target.value
                                        );
                                      }}
                                      style={{
                                        borderRadius: '8px',
                                        width: '100%',
                                      }}
                                    />
                                  </Form.Item>
                                </div>
                              </Col>
                              <Col xl={6} lg={6} md={7} sm={14} xs={24}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'uom']}
                                  style={{
                                    marginBottom: 0,
                                  }}
                                >
                                  <Select
                                    size="large"
                                    placeholder="UOM"
                                    options={UomDropdown}
                                    onChange={(value: any) =>
                                      setFieldValue(
                                        `products[${index}].uom`,
                                        value
                                      )
                                    }
                                  />
                                </Form.Item>
                              </Col>
                              <Col xl={6} lg={6} md={7} sm={14} xs={24}>
                                <div>
                                  <Form.Item
                                    className="gstFormItem"
                                    // {...restField}
                                  >
                                    <Input
                                      size="large"
                                      placeholder="Quantity"
                                      value={values.products[index]?.quantity}
                                      onChange={(e) => {
                                        setFieldValue(
                                          `products[${index}].quantity`,
                                          e.target.value
                                        );
                                      }}
                                      style={{
                                        borderRadius: '8px',
                                        width: '100%',
                                      }}
                                    />
                                  </Form.Item>
                                </div>
                              </Col>
                              <Col xl={2} lg={1} md={2}>
                                {fields.length > 1 && (
                                  <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                    style={{
                                      marginTop: '15px',
                                      color: '#1455B2',
                                      marginLeft: '10px',
                                    }}
                                  />
                                )}
                              </Col>
                              <Col xl={2} lg={2} md={2} sm={4}>
                                {index === fields.length - 1 && (
                                  <Form.Item>
                                    <Button
                                      onClick={() => add()}
                                      block
                                      style={{
                                        height: '30px',
                                        color: '#1455B2',
                                        padding: '0',
                                        borderColor: '#1455B2',
                                      }}
                                    >
                                      +
                                    </Button>
                                  </Form.Item>
                                )}
                              </Col>
                            </Row>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </Col>
                </Row>
                <Row justify="end" style={{ paddingTop: '20px', gap: '20px' }}>
                  <Form.Item>
                    <Button size="large" htmlType="reset" style={reset}>
                      Clear All
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    <Button size="large" htmlType="submit" style={submit}>
                      Send Invite
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </div>
  );
}
