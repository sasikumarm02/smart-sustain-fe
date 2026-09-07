import React, { useState } from 'react';
import { Row, Col, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  InputComponent,
  SelectComponent,
  ButtonComponent,
  ToggleComponent,
  TabsComponent,
  PageCardComponent,
  TableComponent,
} from '../index';
import InputPrefixSampleIcon from '../../assets/svg/DesignLibrary/InputPrefixSampleIcon';
import InputSuffixSampleIcon from '../../assets/svg/DesignLibrary/InputSuffixSampleIcon';
import Styles from './samplerendering.module.scss';

const SampleRenderingComponent: React.FC<any> = () => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('');
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const handleChange = (value: string) => {
    setSelectedOption(value);
  };
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleTabsChange = (value: string) => {
    console.log('test the tabs', value);
    setCurrentTab(value);
  };

  const columnHeader: ColumnsType<any[]> = [
    {},
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      align: 'left',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 200,
      align: 'left',
      onFilter: (value: any, record: any) => record.age === value,
      sorter: (a: any, b: any) => a.age - b.age,
      render: (text) => (
        <span style={{ display: 'flex', textAlign: 'right', color: 'red' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 300,
    },
    {
      title: 'Address',
      dataIndex: 'address1',
      key: 'address1',
      width: 300,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          {/* Add action buttons or links here */}
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const dataT = [
    {
      key: '1',
      name: 'vohn Doe',
      age: 32,
      address: '10 Downing Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '2',
      name: 'dane Smith',
      age: 28,
      address: '123 Elm Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '3',
      name: 'aohn 3324Doe',
      age: 32,
      address: '10 Downing Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '4',
      name: 'eane444 Smith',
      age: 28,
      address: '123 Elm Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '5',
      name: 'bohn555 Doe',
      age: 32,
      address: '10 Downing Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '6',
      name: 'cane666 Smith',
      age: 28,
      address: '123 Elm Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '7',
      name: 'vohn Doe',
      age: 32,
      address: '10 Downing Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '8',
      name: 'dane Smith',
      age: 28,
      address: '123 Elm Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '9',
      name: 'aohn 3324Doe',
      age: 32,
      address: '10 Downing Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '10',
      name: 'eane444 Smith',
      age: 28,
      address: '123 Elm Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '11',
      name: 'bohn555 Doe',
      age: 32,
      address: '10 Downing Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    {
      key: '12',
      name: 'cane666 Smith',
      age: 28,
      address: '123 Elm Street',
      address1: '10 Downing Street',
      address2: '10 Downing Street',
      address3: '10 Downing Street',
      address4: '10 Downing Street',
      address5: '10 Downing Street',
      address6: '10 Downing Street',
    },
    // Add more data as needed
  ];

  const expandableRowRenderer = (record: any) => (
    <div className={Styles.expandedRowContainer}>
      <div>Display the age - {record?.age}</div>
    </div>
  );

  const tabsData = [
    { tab: 'Tab 1', key: '1' },
    { tab: 'Tab 2', key: '2' },
    { tab: 'Tab 3', key: '3' },
  ];

  return (
    <PageCardComponent>
      <Row gutter={24} className={Styles['rowStyles']}>
        <Col span={6}>
          <SelectComponent
            mode="multiple"
            showSearch={true}
            options={options}
            value={selectedOption}
            onChange={handleChange}
            placeHolder="Sample component"
          />
        </Col>
        <Col span={5}>
          <InputComponent
            value={inputValue}
            size="large"
            placeHolder="Sample Input Placeholder"
            onChange={handleInputChange}
            prefixIcon={<InputPrefixSampleIcon />}
            suffixIcon={<InputSuffixSampleIcon />}
          />
        </Col>
        <Col span={1}>
          <ButtonComponent hierarchy="primary">Proceed</ButtonComponent>
        </Col>
        <Col span={5}>
          <ToggleComponent />
        </Col>
      </Row>
      <Row gutter={24} className={Styles['rowTabStyles']}>
        <TabsComponent tabs={tabsData} onChange={handleTabsChange} />
      </Row>
      <Row gutter={24} className={Styles['rowStyles']}>
        {currentTab === '1' ? (
          <Row className={Styles['rowStyles']}>display tab 1</Row>
        ) : (
          <Row className={Styles['rowStyles']}>display other tabs</Row>
        )}
      </Row>
      <Row>
        <TableComponent
          data={dataT}
          columnHeader={columnHeader}
          enableRowSelection={true}
          columnCheckBoxTitle="S.No."
          columnCheckBoxDataAttribute="key"
          expandableRowRenderer={expandableRowRenderer}
          isRowExpand={true}
          showCountForCheckBox={true}
        />
      </Row>
    </PageCardComponent>
  );
};

export default SampleRenderingComponent;
