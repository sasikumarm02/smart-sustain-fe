import { Button, Col, Row } from 'antd';
import React from 'react';
import CustomTable from '../Table/CustomTable';
import FormFooter from '../../Utils/FormFooter';

const item = [
  {
    title: 'Settings',
  },
  {
    title: 'Onboarded Companies',
  },
];
const columns = [
  {
    title: 'S No.',
    dataIndex: 'no',
    key: 'no',
    render: (text: any, record: any, index: any) => index + 1,
    width: 80,
  },
  {
    title: 'Company Name',
    dataIndex: 'CompanyName',
    key: 'CompanyName',
    width: 160,
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => a.age - b.age,
  },

  {
    title: 'Identification Number',
    dataIndex: 'IdentificationNumber',
    key: '8',
    width: 180,
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => a.age - b.age,
  },
  {
    title: 'LegalEntity',
    dataIndex: 'LegalEntity',
    key: 'LegalEntity',
    width: 160,
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => a.age - b.age,
  },

  {
    title: 'Country',
    dataIndex: 'Country',
    key: '8',
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => a.age - b.age,
    width: 160,
  },
  {
    title: 'IncorporationDate',
    dataIndex: 'IncorporationDate',
    key: '8',
    width: 160,
    defaultSortOrder: 'descend',
    sorter: (a: any, b: any) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'Address',
    key: 'Address',
    width: 160,
  },

  {
    title: 'Action',
    dataIndex: 'Action',
    key: '8',
    width: 160,
  },
];
const data = [
  { CompanyName: '23', IdentificationNumber: '67' },
  { CompanyName: '23', IdentificationNumber: '67' },
  { CompanyName: '23', IdentificationNumber: '67' },
  { CompanyName: '23', IdentificationNumber: '67' },
];
const updateData = () => {};
const fetchData = () => {};

export default function Preview({ onPrev }: any) {
  const handlePrev = () => {
    onPrev();
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <CustomTable
            columnName={columns}
            columnData={data}
            // columnSetData={setData}
            firstAction={updateData}
            apiPath=""
            apiCall={fetchData}
          />
        </Col>
      </Row>
      <Row justify="end" gutter={[10, 10]} className="mt-4">
        <Col>
          <Button
            type="default"
            onClick={handlePrev}
            style={{
              borderRadius: '30px',
              borderColor: '#00338D',
              background: '#fff',
              color: '#00338D',
            }}
          >
            Prev
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              borderRadius: '30px',
              background: '#00338D',
              color: '#fff',
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
}
