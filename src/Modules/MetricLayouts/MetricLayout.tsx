import React, { useState } from 'react';
import {
  Row,
  Col,
  Button,
  Typography,
  Table,
  Select,
  Modal,
  Form,
  Input,
  Radio,
} from 'antd';
import Styles from './metric.module.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';
import GHGEmissionGraph from '../Emission/GHGEmissionGraph';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MinusCircleOutlined } from '@ant-design/icons';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function MetricLayout(props: any) {
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const columnData = [
    {
      title: props.label,
      dataIndex: 'GHGEmissions',
      key: 'GHGEmissions',
    },
    {
      title: 'UOM',
      dataIndex: 'UOM',
      key: 'UOM',
    },
    {
      title: 'Base Year 2019-2020',
      children: [
        {
          title: 'Total',
          dataIndex: 'firstActually',
          key: 'firstActually',
        },
      ],
    },
    {
      title: '2020-2021',
      children: [
        {
          title: 'Total',
          dataIndex: 'secondActually',
          key: 'secondActually',
        },
      ],
    },
    {
      title: '2021-2022',
      children: [
        {
          title: 'Total',
          dataIndex: 'thirdActually',
          key: 'thirdActually',
        },
      ],
    },
    {
      title: '2022-2023',
      children: [
        {
          title: 'Total',
          dataIndex: 'fourthActually',
          key: 'fourthActually',
        },
      ],
    },
  ];

  const EmissionColumns = [
    {
      title: props.label,
      dataIndex: 'GHGEmissions',
      key: 'GHGEmissions',
    },
    {
      title: 'UOM',
      dataIndex: 'UOM',
      key: 'UOM',
    },
    {
      title: 'Base Year 2019-2020',
      children: [
        {
          title: 'Absolute',
          dataIndex: 'firstActually',
          key: 'firstActually',
        },
        {
          title: '* Intensity',
          dataIndex: 'firstInitially',
          key: 'firstInitially',
        },
      ],
    },
    {
      title: '2021-2022',
      children: [
        {
          title: 'Absolute',
          dataIndex: 'secondActually',
          key: 'secondActually',
        },
        {
          title: '* Intensity',
          dataIndex: 'secondInitially',
          key: 'secondInitially',
        },
      ],
    },
    {
      title: '2022-2023',
      children: [
        {
          title: 'Absolute',
          dataIndex: 'thirdActually',
          key: 'thirdActually',
        },
        {
          title: '* Intensity',
          dataIndex: 'thirdInitially',
          key: 'thirdInitially',
        },
      ],
    },
    {
      title: '2023-2024',
      children: [
        {
          title: 'Absolute',
          dataIndex: 'fourthActually',
          key: 'fourthActually',
        },
        {
          title: '* Intensity',
          dataIndex: 'fourthInitially',
          key: 'fourthInitially',
        },
      ],
    },
  ];

  return (
    <>
      <Modal
        open={open}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        width={
          window.innerWidth <= 1000
            ? window.innerWidth
            : window.innerWidth - window.innerWidth * 0.5
        }
      >
        <div style={{ textAlign: 'end' }}>
          <CloseCircleOutlined
            style={{ color: '#000', fontSize: '24px' }}
            onClick={() => setOpen(false)}
          />
        </div>

        <Formik
          initialValues={{
            select: '',
            compliance: [{ principles: '', codes: '' }],
          }}
          validationSchema={Yup.object().shape({})}
          onSubmit={async (values, { resetForm }) => {}}
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
                <Row className="modal-content" justify="center" gutter={12}>
                  <Col span={24} style={{ marginBottom: '1.5rem' }}>
                    <Row justify="space-between">
                      <Col className="form-title">{props.label}</Col>
                      <Col lg={4}>
                        <Select
                          size="large"
                          showSearch
                          placeholder="Country"
                          optionFilterProp="children"
                          onChange={() => console.log('')}
                          style={{ width: '100%' }}
                          options={[
                            {
                              value: 'Country',
                              label: 'Country',
                            },
                          ]}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <div
                      style={{
                        maxHeight: '300px',
                        // overflowY: "auto",
                      }}
                    >
                      <Form.List name="compliance" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(
                              ({ key, name, ...restField }, index) => (
                                <Row key={key} gutter={12}>
                                  <Col span={7}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'principles']}
                                      style={{
                                        marginBottom: 0,
                                      }}
                                    >
                                      <Select
                                        placeholder="Fuel"
                                        options={data}
                                        onChange={(value: any) =>
                                          setFieldValue(
                                            `compliance[${index}].principles`,
                                            value
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={7}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'principles']}
                                      style={{
                                        marginBottom: 0,
                                      }}
                                    >
                                      <Select
                                        placeholder="Unit of Measurment"
                                        options={data}
                                        onChange={(value: any) =>
                                          setFieldValue(
                                            `compliance[${index}].principles`,
                                            value
                                          )
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col span={7}>
                                    <div>
                                      <Form.Item
                                        className="gstFormItem"
                                        // {...restField}
                                      >
                                        <Input
                                          value={
                                            values.compliance[index]?.codes
                                          }
                                          placeholder="Quantity"
                                          onChange={(e) => {
                                            setFieldValue(
                                              `compliance[${index}].codes`,
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
                                  <Col lg={1}>
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
                                  <Col span={1}>
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
                              )
                            )}
                          </>
                        )}
                      </Form.List>
                    </div>
                  </Col>
                  <Col span={18}></Col>
                  <Col span={3} style={{ marginTop: '32px' }}>
                    <Form.Item>
                      <Button
                        type="primary"
                        block
                        size="middle"
                        className="form-control"
                        onClick={() => {
                          setOpen(false);
                        }}
                        style={{
                          background: 'transparent',
                          color: '#12594D',
                          border: '1px solid #12594D',
                        }}
                      >
                        Reset
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={3} style={{ marginTop: '32px' }}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        disabled={!(isValid && dirty)}
                        size="middle"
                        className="form-control"
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Modal>
      <Row justify="center">
        <Col lg={23} className={Styles.mainLayout}>
          <Row justify="space-between" align="middle">
            <Col lg={6}>
              <div
                className={Styles.metricTitle}
                style={{ marginLeft: '10px' }}
              >
                {props.label} Summary
              </div>
              <div>
                <Button type="link" onClick={() => navigate('/esg-modules')}>
                  <ArrowLeftOutlined /> Back
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <Row gutter={12}>
                <Col lg={15}>
                  <Select
                    className={Styles.metricSelect}
                    size="large"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    defaultValue="lucy"
                    style={{ width: '100%' }}
                    onChange={() => console.log('')}
                    options={[
                      {
                        value: 'jack',
                        label: 'Singapore',
                      },
                      {
                        value: 'lucy',
                        label: 'Indonesia',
                      },
                      {
                        value: 'disabled',
                        label: 'Brunei',
                      },
                    ]}
                  />
                </Col>
                <Col lg={9}>
                  <Button
                    className={Styles.metricButton}
                    size="large"
                    block
                    ghost
                    onClick={() => setOpen(true)}
                  >
                    Add &nbsp; +
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={23} className={Styles.customtable}>
          <Table
            columns={
              window.location.pathname === '/emissions'
                ? EmissionColumns
                : columnData
            }
            dataSource={props.dataSource}
            pagination={false}
            bordered
          />
        </Col>
        <Col lg={23} style={{ background: '#fff', padding: '15px' }}>
          <GHGEmissionGraph label={props.label} data={props.data} />
        </Col>
      </Row>
    </>
  );
}
