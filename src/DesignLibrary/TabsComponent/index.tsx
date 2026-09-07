import React, { ReactNode } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import Styles from './tabs.module.scss';

interface CommonTabsProps {
  tabs: any;
  defaultActiveKey?: string;
  onChange?: (activeKey: string) => void;
  tabBarExtraContent?: ReactNode;
  customClass?: any;
}

const TabsComponent: React.FC<CommonTabsProps & TabsProps> = ({
  tabs,
  defaultActiveKey,
  onChange,
  tabBarExtraContent,
  customClass,
  ...restTabsProps
}) => {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        components: {
          Tabs: {
            itemActiveColor: '#036323 !important',
            itemSelectedColor: '#036323 !important',
            horizontalItemGutter: 24,
            inkBarColor: '#036323',
          },
        },
      }}
    >
      <Tabs
        className={`${Styles['tabsStyle']} ${customClass}`}
        defaultActiveKey={defaultActiveKey}
        onChange={onChange}
        tabBarExtraContent={tabBarExtraContent}
        {...restTabsProps}
        indicator={{ size: (origin) => origin, align: 'start' }}
        // centered={true}
      >
        {tabs.map((tab: any) => (
          <Tabs.TabPane tab={tab.tab} key={tab.key} />
        ))}
      </Tabs>
    </ConfigProvider>
  );
};

export default TabsComponent;
