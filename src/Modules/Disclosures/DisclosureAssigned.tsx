import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  Radio,
  Row,
  Tabs,
  Collapse,
  Input,
  TabsProps,
  Checkbox,
  Typography,
  Space,
} from 'antd';
import { Formik } from 'formik';

import Styles from '../../Components/Social/form.module.scss';
import * as Yup from 'yup';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const { Panel } = Collapse;

export default function DisclosureAssigned() {
  const [openPanel, setOpenPanel] = useState<string | string[] | undefined>(
    undefined
  );

  const handlePanelChange = (key: string | string[]) => {
    setOpenPanel(key);
  };

  const data = [
    {
      key: '1',
      header:
        'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
      label: 'Field 1',
    },
    {
      key: '2',
      header:
        'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
      label: 'Field 2',
    },
    {
      key: '3',
      header:
        'If the organization has multiple entities, approach for acquisitions, mergers etc.',
      label: 'Field 2',
    },
    {
      key: '4',
      header:
        'If the organization has multiple entities, how the approach differs ',
      label: 'Field 2',
    },
    {
      key: '5',
      header:
        'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
      label: 'Field 2',
    },
  ];

  interface FormValues {
    [key: string]: string;
  }

  const customExpandIcon = ({ isActive }: any) =>
    isActive ? <MinusOutlined /> : <PlusOutlined />;

  return (
    <>
      <Row gutter={10} className="mt-3">
        <Col span={6}>
          <p style={{ color: '#00338D', fontWeight: '700', fontSize: '24px' }}>
            Answer Disclosures Questions
          </p>{' '}
        </Col>

        <Col
          span={18}
          style={{ display: 'flex', gap: '10px', justifyContent: 'end' }}
        >
          <span style={{ fontWeight: '700', color: '#969BA0' }}>
            No. of Questions Assigned :{' '}
            <span style={{ color: '#00B8F5' }}>9</span>
          </span>
          <span style={{ fontWeight: '700', color: '#969BA0' }}>
            Responded : <span style={{ color: '#00B8F5' }}>7</span>
          </span>
          <span style={{ fontWeight: '700', color: '#969BA0' }}>
            Accepted : <span style={{ color: '#00B8F5' }}>7</span>
          </span>
          <span style={{ fontWeight: '700', color: '#969BA0' }}>
            Due Date : <span style={{ color: '#00B8F5' }}>22-April-2024</span>
          </span>
        </Col>
        <Col lg={24}>
          <Formik
            initialValues={{
              selectValue: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={async (values, { resetForm }) => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
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
                  <Row>
                    <Col lg={24}>
                      <Collapse
                        style={{ width: '100%' }}
                        defaultActiveKey={['0']}
                        expandIconPosition="end"
                        expandIcon={({ isActive }) =>
                          isActive ? <MinusOutlined /> : <PlusOutlined />
                        }
                        onChange={() => ''}
                        ghost
                      >
                        {[
                          'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
                          'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
                          'If the organization has multiple entities, approach for acquisitions, mergers etc.',
                          'If the organization has multiple entities, how the approach differs ',
                          'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
                        ].map((data: string, index: number) => (
                          <Panel
                            header={`${index + 1} ${data}`}
                            key={index}
                            className={Styles.collapseTitle}
                          >
                            <TextArea rows={4} />
                          </Panel>
                        ))}
                      </Collapse>
                    </Col>
                  </Row>
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
