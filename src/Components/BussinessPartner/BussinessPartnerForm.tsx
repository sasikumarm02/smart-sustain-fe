import React, { useState } from 'react';
import { Col, Row, Form, Button, Typography, Form as AntdForm } from 'antd';
import { useNotification } from '../../Hooks/useNotification';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../Components/FormInput/CustomInput';
import Styles from '../Social/form.module.scss';

interface Values {}

function BussinessPartnerForm() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const wasteData = [
    {
      key: 1,
      title: 'Name of the Business Partner',
      title1: 'Details',
      name1: 'NumberParentalLeaveFemale',
    },
    {
      key: 2,
      title: 'Name of the contact person',
      name1: 'TookParentalLeaveFemale',
    },
    {
      key: 3,
      title: 'Designation of the contact  person',
      name1: 'returnedAfterRarentalLeaveFeamle',
    },
    {
      key: 4,
      title: 'Mobile number of the contact person',
      name1: 'returnedAfterRarentalLeaveRetainedFeamle',
    },
    {
      key: 5,
      title: 'Email id of the contact person',
      name1: 'returnedAfterRarentalLeaveRetainedFeamle',
    },
  ];
  const navigate = useNavigate();
  function handleLabel(key: any, title: any) {
    if (key === 1) {
      return title;
    } else return null;
  }
  const fieldNames = [
    'NumberParentalLeaveFemale',
    'NumberParentalLeaveMale',
    'TookParentalLeaveFemale',
    'TookParentalLeaveMale',
    'returnedAfterRarentalLeaveFeamle',
    'returnedAfterRarentalLeaveMale',
    'returnedAfterRarentalLeaveRetainedFeamle',
    'returnedAfterRarentalLeaveRetainedMale',
  ];
  const validationSchema = Yup.object().shape({
    premiseId: Yup.array()
      .of(Yup.string())
      .required('Required!')
      .min(1, 'At least one premise must be selected'),
    ...fieldNames.reduce(
      (acc: any, fieldName: any) => ({
        ...acc,
        [fieldName]: Yup.string().required('Required!'),
      }),
      {}
    ),
  });
  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            <span>Invite Business Partner</span>{' '}
          </p>
        </Col>
      </Row>
      <Row justify="end" style={{ background: '#fff' }}>
        <Col span={24} className="AnttabSty">
          <p
            style={{
              color: '#23456A',
              fontSize: '24px',
              fontWeight: '600',
              fontFamily: 'Arial',
            }}
          >
            Invite Business Partnerr
          </p>
          <Formik
            initialValues={{
              NumberParentalLeaveFemale: '',
              NumberParentalLeaveMale: '',
              TookParentalLeaveFemale: '',
              TookParentalLeaveMale: '',
              returnedAfterRarentalLeaveFeamle: '',
              returnedAfterRarentalLeaveMale: '',
              returnedAfterRarentalLeaveRetainedFeamle: '',
              returnedAfterRarentalLeaveRetainedMale: '',
            }}
            // validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              //   values.entity_id = entityName;
              // values.premiseId = values.premiseId.toString();
              // setIsLoading(true);
              // post(``, values)
              //   .then((res: any) => {
              //     if (res?.status === "Success") {
              //       if (res?.response?.status === true) {
              //         openToast({
              //           content: `${res.message}`,
              //           type: "success",
              //         });
              //         resetForm();
              //         navigate(`/add-data/environment/waste`);
              //       }
              //     }
              //   })
              //   .catch((err) =>
              //     openToast({
              //       content: `${err}`,
              //       type: "error",
              //     })
              //   )
              //   .finally(() => setIsLoading(false));
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
                  layout="vertical"
                  onFinish={handleSubmit}
                  onReset={handleReset}
                >
                  {wasteData.map((data: any, index: any) => {
                    const i = data.key;

                    return (
                      <Row gutter={12} align="middle" key={index}>
                        <Col lg={8} className={Styles.allFormLabel}>
                          <p className={Styles.paratitleSty}>{data.title} </p>
                        </Col>
                        <Col lg={10} className="center-label-input">
                          <CustomInput
                            label={handleLabel(i, `${data.title1}`)}
                            size="large"
                            name={data.name1}
                            labelColor="#666666"
                            placeholder="Enter"
                            type="text"
                            errors={
                              touched[data.name1 as keyof Values] &&
                              errors[data.name1 as keyof Values]
                            }
                            touched={touched}
                            value={values[data.name1 as keyof Values]}
                            hook={handleChange}
                            blur={handleBlur}
                            status={
                              (touched[data.name1 as keyof Values] &&
                                errors[data.name1 as keyof Values] &&
                                'error') ||
                              ''
                            }
                          />
                        </Col>
                      </Row>
                    );
                  })}
                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Reset
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

export default BussinessPartnerForm;
