import { Button, Col, Row, Form } from 'antd';
import React, { useState } from 'react';
import styles from './index.module.css';
import FilterIcon from '../../assets/image/filterIcon.png';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomSelect from '../../Components/FormInput/CustomSelect';

interface FormValues {
  year: string;
  framework: string;
  ghgEmissionFactors: string;
  gwpDataset: string;
}

export default function Index({ detailPageName }: any) {
  const [filter, setFilter] = useState(false);
  const [submittedValues, setSubmittedValues] = useState(null);

  const handleFilter = () => {
    if (filter === true) {
      setFilter(false);
    } else {
      setFilter(true);
    }
  };
  const handleCloseFilter = () => {
    setTimeout(() => {
      setFilter(false);
    }, 600); // Delay should match the transition duration in milliseconds
  };

  const filterData = [
    {
      name: 'year',
      placeholder: 'Period',
      options: [
        { value: 'FY 2024-25', label: 'FY 2024-25' },
        { value: 'FY 2023-24', label: 'FY 2023-24' },
        { value: 'FY 2022-23', label: 'FY 2022-23' },
      ],
    },
    {
      name: 'framework',
      placeholder: 'All Sectors',
      mode: 'multiple',
      options: [
        { value: 'gri', label: 'GRI' },
        { value: 'tcfd', label: 'TCFD' },
        { value: 'brsr', label: 'BRSR' },
        { value: 'FTES', label: 'FTES' },
        { value: 'CDP', label: 'CDP' },
        { value: 'SASB', label: 'SASB' },
        { value: 'IIRC', label: 'IIRC' },
      ],
    },
    {
      name: 'ghgEmissionFactors',
      placeholder: 'All Countries',
      mode: 'multiple',
      options: [
        {
          value: 'UK - DEFRA 2023 Version 1.1',
          label: 'UK - DEFRA 2023 Version 1.1',
        },
        { value: 'US-EPA 20230912', label: 'US-EPA 20230912' },
      ],
    },
    {
      name: 'gwpDataset',
      placeholder: 'All Companies',
      mode: 'multiple',
      options: [
        {
          value: '2007 IPCC Fourth Assessment',
          label: '2007 IPCC Fourth Assessment',
        },
        {
          value: '2014 IPCC Fifth Assessment',
          label: '2014 IPCC Fifth Assessment',
        },
      ],
    },
    {
      name: 'gwpDataset2',
      placeholder: 'All Facilities',
      mode: 'multiple',
      options: [
        {
          value: '2007 IPCC Fourth Assessment',
          label: '2007 IPCC Fourth Assessment',
        },
        {
          value: '2014 IPCC Fifth Assessment',
          label: '2014 IPCC Fifth Assessment',
        },
      ],
    },
  ];
  return (
    <>
      <Row justify="space-between">
        <Col lg={12} md={24} xl={24}>
          <p className={styles.headerText}>{detailPageName}</p>
        </Col>
        <Col lg={12} md={24} xl={24}>
          <p className={styles.headerSubText}>
            Reporting Period : <span>2024-25</span>
          </p>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col lg={4}>
          <Button className={styles.BtnFilter} onClick={handleFilter}>
            Filter <img alt="" src={FilterIcon} width={20} />
          </Button>
        </Col>
        {/* <Col lg={20}>
          <p className={styles.headerSubText}>
            Last Updated Date : <span>11-March-2024</span>
          </p>
        </Col> */}
      </Row>

      <Row
        style={{
          // overflow: "hidden",
          transition: 'max-height 0.6s ease-in-out',
          maxHeight: filter ? '10000px' : '0',
        }}
        // onAnimationEnd={!filter ? handleCloseFilter : undefined}
      >
        {filter ? (
          <Col span={24}>
            <Formik
              initialValues={{
                year: '',
                framework: '',
                ghgEmissionFactors: '',
                gwpDataset: '',
                gwpDataset2: '',
              }}
              validationSchema={Yup.object().shape({
                year: Yup.string().required('Year Required'),
                framework: Yup.string().required('Framework Required'),
                ghgEmissionFactors: Yup.string().required(
                  'GHG Emission Factors Required'
                ),
                gwpDataset: Yup.string().required('GWP Dataset Required'),
                gwpDataset2: Yup.string().required('GWP Dataset Required'),
              })}
              onSubmit={(values: any, { resetForm }: any) => {}}
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
                  <Row
                    justify="space-around"
                    align="middle"
                    gutter={10}
                    style={{ paddingTop: '10px', paddingBottom: '10px' }}
                  >
                    {filterData.map((data: any, index: any) => (
                      <Col
                        lg={4}
                        md={8}
                        sm={24}
                        xs={24}
                        className="detail-select"
                        key={index}
                      >
                        <CustomSelect
                          name={data.name}
                          placeholder={data.placeholder}
                          mode={data.mode}
                          options={data.options}
                          //   errors={
                          //     errors[data.name as keyof FormValues]
                          //   }
                          //   touched={
                          //     touched[data.name as keyof FormValues]
                          //   }
                          value={values[data.name as keyof FormValues]}
                          secondChange={setFieldValue}
                          hook={handleChange}
                          blur={handleBlur}
                          status={
                            ((touched[
                              data.name as keyof FormValues
                            ] as boolean) &&
                              (errors[
                                data.name as keyof FormValues
                              ] as string) &&
                              'error') ||
                            ''
                          }
                        />
                      </Col>
                    ))}
                    <Col
                      lg={4}
                      md={8}
                      sm={24}
                      xs={24}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'inherit',
                      }}
                    >
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className={styles.BtnFilter}
                        >
                          Apply
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        ) : null}
      </Row>
    </>
  );
}
