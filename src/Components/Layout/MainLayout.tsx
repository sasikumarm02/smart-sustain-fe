import React, { ReactNode } from 'react';
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content, Footer } = Layout;

interface MainLayoutProps {
  content: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ content }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={80} theme="light">
        <Menu theme="light" mode="vertical" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<PieChartOutlined />} />
          <Menu.Item key="2" icon={<DesktopOutlined />} />
          <Menu.Item key="3" icon={<FileOutlined />} />
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {content}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Your Footer Goes Here</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
