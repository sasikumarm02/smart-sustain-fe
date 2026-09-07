import React from 'react';
import { Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export default function ReportTable() {
  const dataSource = [
    {
      key: '1',
      sNo: '1',
      question:
        'Does your organization implement green practices like reducing energy or managing waste?',
      stage1: 'true',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '2',
      sNo: '2',
      question:
        'Does your organization have environmental goals, like cutting carbon or using more renewable energy? ',
      stage1: 'true',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '3',
      sNo: '3',
      question:
        'Does your organization use a system (EMS) to track environmental impact (emissions, water, waste)? ',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '4',
      sNo: '4',
      question:
        'Has your organization invested in energy-saving technologies (LED lights, efficient HVAC) to reduce energy use? ',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '5',
      sNo: '5',
      question:
        'Does your organization design new products or change existing ones to be more eco-friendly (use less material, reduce waste, be more recyclable)?',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '6',
      sNo: '6',
      question:
        'Has your organization digitized processes (documents, buying, communication) to use less paper?',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '7',
      sNo: '7',
      question:
        'Does your organization have targets to reduce its emissions (direct, indirect from energy, and supply chain)?',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '8',
      sNo: '8',
      question:
        'Does your organization use renewable energy (solar, wind) or capture carbon to reduce emissions? ',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '9',
      sNo: '9',
      question:
        'Have your sustainability efforts been recognized by major frameworks (GRI, ISSB) or rating agencies (EcoVadis)? ',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '10',
      sNo: '10',
      question:
        'Has your organization assessed and planned for climate risks (weather events, regulations, market shifts)? ',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '11',
      sNo: '11',
      question:
        'Can you measure your sustainability impact (carbon reduction, water conservation, waste diversion)? ',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '12',
      sNo: '12',
      question:
        'Can your organization participate in the carbon credit market (buy or sell credits from emission reductions)?',
      stage1: '',
      stage2: 'true',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '13',
      sNo: '13',
      question:
        'Has the organization implemented measures or targets to promote adherence to legal and regulatory requirements, ethical standards, and corporate governance best practices?​',
      stage1: '',
      stage2: '',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '14',
      sNo: '14',
      question:
        "Have the organization's governance-related ESG reports or initiatives been recognized by industry-standard frameworks such as Global Reporting Initiative(GRI)? ​",
      stage1: '',
      stage2: '',
      stage3: 'true',
      stage4: 'true',
    },
    {
      key: '15',
      sNo: '15',
      question:
        'Does the organization have established metrics and verification processes to quantify and validate its governance impact?​',
      stage1: '',
      stage2: '',
      stage3: '',
      stage4: 'true',
    },
  ];

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sNo',
      key: 'sNo',
    },
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Stage-1',
      dataIndex: 'stage1',
      key: 'stage1',
      width: 90,
      render: (text: any, record: any) =>
        record.stage1 ? <CheckOutlined style={{ color: 'black' }} /> : null,
    },
    {
      title: 'Stage-2',
      dataIndex: 'stage2',
      key: 'stage2',
      width: 90,
      render: (text: any, record: any) =>
        record.stage2 ? <CheckOutlined style={{ color: 'black' }} /> : null,
    },
    {
      title: 'Stage-3',
      dataIndex: 'stage3',
      key: 'stage3',
      width: 90,
      render: (text: any, record: any) =>
        record.stage3 ? <CheckOutlined style={{ color: 'black' }} /> : null,
    },
    {
      title: 'Stage-4',
      dataIndex: 'stage4',
      key: 'stage4',
      width: 90,
      render: (text: any, record: any) =>
        record.stage4 ? <CheckOutlined style={{ color: 'black' }} /> : null,
    },
  ];

  return (
    <div>
      <Table
        className="report-table"
        dataSource={dataSource}
        columns={columns}
        rowClassName={(record, index) => (index % 2 === 1 ? 'even-row' : '')}
        pagination={false}
      />
    </div>
  );
}
