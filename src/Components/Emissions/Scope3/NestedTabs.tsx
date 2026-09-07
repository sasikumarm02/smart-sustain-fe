import React from 'react';
import { Tabs } from 'antd';
import ScopeThreeForm from './scopeThreeForm';

const { TabPane } = Tabs;

const tabData = [
  {
    key: '1',
    title: 'Tab 1',
    content: (
      <ScopeThreeForm
        cateTitle="Category 1 - Purchased Goods & Services"
        postSubmit="/scope3/category-1"
        getTableDataApi={[
          '/scope3_emissions/fetch-goods-and-service-avg-data/',
          '/scope3_emissions/fetch-goods-and-service-spend-based-data/',
          '/scope3_emissions/fetch-goods-and-service-supplier-data/',
        ]}
        formSubmitAPi={[
          '/scope3_emissions/create_cat1_avg_data/',
          '/scope3_emissions/create-cat1-spend-based-data/',
          '/scope3_emissions/create-cat1-supplier-specific-data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Average-data Method',
          },
          {
            key: '2',
            title: 'Spend-based Method',
          },
          {
            key: '3',
            title: 'Supplier-specific Method',
          },
        ]}
      />
    ),
  },
  { key: '2', title: 'Tab 2', content: 'Content of Tab 2' },
  { key: '3', title: 'Tab 3', content: 'Content of Tab 3' },
];

const NestedTabs = () => {
  function callback(key: any) {}

  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      {tabData.map((tab) => (
        <TabPane tab={tab.title} key={tab.key}>
          {tab.content}
        </TabPane>
      ))}
    </Tabs>
  );
};

export default NestedTabs;
