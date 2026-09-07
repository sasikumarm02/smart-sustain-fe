import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import CustomTable from '../Components/Table/CustomTable';
import Styles from './DataList.module.css';

const DataList = () => {
  //   const [data, setData] = useState([]);
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

  return (
    <>
      <Breadcrumb items={item} />
      <Row>
        <Col span={24} className={Styles.tableCss}>
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
    </>
  );
};
export default DataList;
