import React, { useState } from 'react';
import { Layout, Menu, Button, Input, Drawer } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Row, Col } from 'antd';
import Styles from './ResponsiveHeader.module.css'; // Assuming you have a CSS module for styling

import { Grid, Typography, Switch, Image } from 'antd';
import { useNavigate } from 'react-router-dom';

import type { MenuProps } from 'antd';
import DashboardIcon from '../assets/Svg/dashboard.png';
import EnvironmentIcon from '../assets/Svg/environment.png';
import socialIcon from '../assets/Svg/social.png';
import goveranceIcon from '../assets/Svg/goverance.png';
import communityIcon from '../assets/Svg/community.png';
import lightIcon from '../assets/Svg/lightMode.png';
import settingIcon from '../assets/Svg/setting.png';
const { Sider } = Layout;
const { useBreakpoint } = Grid;
const { Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const ResponsiveHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const { md, lg } = useBreakpoint();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const collapsed = !(md && lg);
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4'];
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const items: MenuItem[] = [
    getItem(
      'Dashboard ',
      '/dashboard',
      <Image
        loading="lazy"
        src={DashboardIcon}
        preview={false}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '0.3vw',
        }}
      />
    ),
    getItem(
      'Environment',
      'sub1',
      <Image
        loading="lazy"
        src={EnvironmentIcon}
        preview={false}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '0.3vw',
        }}
      />,
      [
        getItem('GHG Emissions', '/environment/emissions'),
        getItem('Energy Consumption', '/environment/energy-consumption'),
        getItem('Water Consumption', '/environment/water-consumption'),
        getItem('Waste Generation', '/environment/waste-generation'),
      ]
    ),
    getItem(
      'Social',
      'sub2',
      <Image
        loading="lazy"
        src={socialIcon}
        preview={false}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '0.3vw',
        }}
      />,
      [
        getItem('Gender Diversity', '/social/gender-diversity'),
        getItem('Age Based Diversity', '/social/age-based-diversity'),
        getItem('Employment Turnover', '/social/employment'),
        getItem('Occupational Health & Safety', '/social/occupational-health'),
        getItem('Development & Training', '/social/development-training'),
      ]
    ),
    getItem(
      'Governance',
      'sub3',
      <Image
        loading="lazy"
        src={goveranceIcon}
        preview={false}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '0.3vw',
        }}
      />,
      [
        getItem('Board Composition', '/goverance/board-composition'),
        getItem('Management Diversity', '/goverance/management-diversity'),
        getItem('Ethical Behavior', '/goverance/ethical-behavior'),
        getItem('Certification', '/goverance/certification'),
        getItem(
          'Alignment with Frameworks ',
          '/goverance/alignment-with-frameworks'
        ),
        getItem('Assurance', '/goverance/assurance'),
      ]
    ),
    getItem(
      'Community',
      '1',
      <Image
        loading="lazy"
        src={communityIcon}
        preview={false}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '0.3vw',
        }}
      />
    ),
    getItem(
      'Settings',
      'sub4',
      <Image
        loading="lazy"
        src={settingIcon}
        preview={false}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '0.3vw',
        }}
      />,
      [
        getItem('Onboarded Companies', '/settings/onBoard-companies'),
        getItem('Facilites', '/settings/name-of-the-facilities'),
        getItem('Product&Services', '/settings/name-of-the-facilities'),
      ]
    ),
  ];

  return (
    <Header className="header">
      <Row gutter={16} align="middle" className={Styles.MainWrapper}>
        {/* <Col xs={24} sm={12} md={14} lg={12} className={Styles.searchWrap}>
          <Input
            prefix={<SearchOutlined className={Styles.searchIcon} />}
            placeholder="Search for people, documents, community .."
            style={{ border: "none" }}
          />
        </Col> */}
        <Col xs={10} sm={12} md={6} lg={6}></Col>
        <Col xs={10} sm={12} md={6} lg={6}></Col>
        <Col xs={4} sm={12} md={6} lg={6} className="">
          {/* <Button className="menu-icon" onClick={toggleMenu}>
            <MenuOutlined />
          </Button> */}
          <Drawer
            title="Menu"
            placement="right"
            onClose={toggleMenu}
            visible={menuOpen}
            className="drawer-menu"
          >
            <Sider className={Styles.sider} style={{ position: 'relative' }}>
              <Menu
                mode="inline"
                onClick={(e) => navigate(e.key)}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                style={{
                  borderRight: '1px solid #e8e8e8',
                  marginTop: '20px',
                  background: '#f6f9ff',
                }}
                items={items}
                getPopupContainer={function test(node) {
                  return node.parentNode as HTMLElement;
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  border: 0,
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    margin: '0 15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    loading="lazy"
                    src={lightIcon}
                    preview={false}
                    style={{
                      width: '18px',
                      height: '18px',
                    }}
                  />
                  <Typography.Text>Light Mode</Typography.Text>
                  <Switch
                    size="small"
                    defaultChecked
                    className={Styles.switch}
                    onChange={() => ''}
                  />
                </div>
                <Menu style={{ border: 0, background: '#f6f9ff' }}>
                  {/* <Menu.Item
              key="settings"
              icon={<SettingOutlined />}
              onClick={() => navigate("")}
              style={{ background: "#00338D", color: "#fff" }}
            >
              Settings
            </Menu.Item> */}
                  <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    onClick={() => navigate('')}
                    style={{ color: 'red' }}
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              </div>
            </Sider>
          </Drawer>
        </Col>
      </Row>
    </Header>
  );
};

export default ResponsiveHeader;
