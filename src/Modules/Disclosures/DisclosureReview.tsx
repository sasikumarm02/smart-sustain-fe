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

export default function DisclosureReview() {
  return (
    <>
      <Row gutter={10} className="mt-3">
        <Col span={6}>
          <p style={{ color: '#00338D', fontWeight: '700', fontSize: '24px' }}>
            Review Disclosures Answers
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
        <Col>
          <h6 className="mt-1" style={{ fontSize: '18px' }}>
            <span style={{ color: '#00338D' }}>Draft Answers Prepared by:</span>{' '}
            demo@companya.com
          </h6>
        </Col>

        <Col>
          {[
            {
              question:
                'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
              answer:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
            {
              question:
                'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
              answer:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
            {
              question:
                'If the organization has multiple entities, approach for acquisitions, mergers etc.',
              answer:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
            {
              question:
                'If the organization has multiple entities, how the approach differs',
              answer:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
            {
              question:
                'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
              answer:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            },
          ].map((item, index) => (
            <div key={index.toString()} className="mt-2">
              <p
                style={{
                  color: '#304CFD',
                  fontSize: '18px',
                  fontWeight: '500',
                }}
              >
                <strong>
                  {index + 1}. {item.question}
                </strong>
              </p>
              <p style={{ color: '#708DF5', fontSize: '18px' }}>
                <strong>A: </strong>
                {item.answer}
              </p>
            </div>
          ))}
        </Col>
      </Row>
    </>
  );
}
