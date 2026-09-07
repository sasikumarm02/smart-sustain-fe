// Import necessary React and Ant Design components
import React, { useState } from 'react';
import { Layout, Typography, Button, Menu, Row, Col, Tabs, Card } from 'antd';

import {
  BellOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  InstagramOutlined,
  TwitterOutlined,
  FacebookOutlined,
} from '@ant-design/icons';
import CardComponent from './CustomCard';
import StatCard from './StatCard';
import ActionBtn from './ActionBtn';
import Logo from '../assets/image/Frame 1.png';
import MainImage from '../assets/image/Rectangle 1.png';
import { useNavigate } from 'react-router-dom';
import './LandingPage.scss';
import CardImage from '../assets/image/Group 2243.png';
import CardImage2 from '../assets/image/Group.png';
import Environmental from '../assets/image/85151 1.png';
import CardImage3 from '../assets/image/Group 3612.png';
import CardImage4 from '../assets/image/Group 3616.png';
import CardImage5 from '../assets/image/Group4.png';
import CardImage6 from '../assets/image/OUTLINE.png';
import CardImage7 from '../assets/image/g3840.png';
import EnvioFactor from '../assets/image/EnvioFactor.png';
import Climate from '../assets/image/climateChange.png';
import Resource from '../assets/image/ResourceConservation.png';
import Pollution from '../assets/image/PollutionWaste.png';
import Logo2 from '../assets/image/scarmp logo 1 (1).png';
const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

// Functional component for the landing page
const LandingPage = () => {
  const cardStyle: React.CSSProperties = {
    textAlign: 'left',
    background: '#12594D',
    color: '#fff',
  };

  const statcardStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
  };

  const h2Style: React.CSSProperties = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '400',
  };
  const paraStyle: React.CSSProperties = {
    color: '#fff',
    opacity: 0.6,
    fontSize: '16px',
  };

  const navigate = useNavigate();
  const { TabPane } = Tabs;

  const menuItems = [
    { key: 'why-scarmp', label: 'Why SCARMP' },
    { key: 'solutions', label: 'Solutions' },
    { key: 'customer-success', label: 'Customer Success' },
    { key: 'resources', label: 'Resources' },
  ];

  const mainLayoutStyle: React.CSSProperties = {
    background: '#002831',
  };

  const logoImgStyle: React.CSSProperties = {
    maxWidth: '150px',
  };

  const [activeKey, setActiveKey] = useState<string>('1');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };
  const handleExploreMore = () => {
    // Your logic here
  };
  const handleDiscoverSCARMP = () => {};
  return (
    <Layout style={mainLayoutStyle}>
      <Header
        style={{
          background: '#002831',
          color: '#fff',
          display: 'grid',
          justifyContent: 'space-between',
          gridTemplateColumns: '8% auto 15%',
          padding: '0 10%',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <div className="logo">
          <img src={Logo} alt="Your Logo" style={logoImgStyle} />
        </div>

        <Menu
          mode="horizontal"
          defaultSelectedKeys={['home']}
          className="nav-container"
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ marginRight: '15px', color: '#FBBD09' }}
          />
          <Button
            type="text"
            icon={<UserOutlined />}
            style={{ marginRight: '15px', color: '#FBBD09' }}
          />

          <ActionBtn text="Login" onClick={() => navigate('/auth/login')} />
        </div>
      </Header>
      <Layout>
        <Content
          style={{
            padding: '0 10%',
            textAlign: 'center',
            background: '#002831',
          }}
        >
          <Layout>
            <Row className="main-image-back">
              <Col
                span={12}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Title
                  level={2}
                  style={{
                    textAlign: 'left',
                    color: '#fff',
                    fontSize: '50px',
                    fontWeight: '300',
                  }}
                >
                  "Streamline Compliance,
                  <br />
                  Empower Sustainability
                  <br />
                  with <b>SCARMP</b>"<br />
                  <ActionBtn text="Explore More" onClick={handleExploreMore} />
                </Title>
              </Col>
              {/* <Col span={12}>col-12</Col> */}
            </Row>
          </Layout>
          <Layout
            style={{ width: '85%', margin: '0 auto', background: '#002831' }}
          >
            <Row style={{ paddingBottom: '60px' }}>
              <Col
                span={12}
                style={{
                  textAlign: 'left',
                  background: '#F9BE07',
                  padding: '20px',
                }}
              >
                <Row align="middle">
                  <Col span={13}>
                    {' '}
                    <Title style={{ color: '#12594D' }}>About SCARMP </Title>
                  </Col>
                  <Col span={11}>
                    <p style={{ borderBottom: '2px solid #12594D' }}></p>
                  </Col>
                </Row>

                <Paragraph style={{ color: '#002129', fontSize: '14px' }}>
                  Welcome to SCARMP, your all-in-one solution for sustainability
                  compliance analyzing and reporting. We empower businesses of
                  all sizes to seamlessly navigate the complexities of
                  sustainability regulations and achieve their environmental
                  goals. With our comprehensive platform, you can efficiently
                  track, assess, and report your sustainability performance,
                  ensuring compliance with industry standards and regulations.
                  <br />
                </Paragraph>
                <ActionBtn
                  text="Discover SCARMP"
                  onClick={handleDiscoverSCARMP}
                />
                <div style={{ position: 'absolute', left: '6vw', top: '8vw' }}>
                  <img
                    src={Environmental}
                    alt="environment"
                    style={{ maxWidth: '600px' }}
                  />
                </div>
              </Col>

              <Col span={12} style={{ paddingLeft: '4px' }}>
                <Row>
                  <Col
                    span={12}
                    style={{ paddingRight: '2px', paddingBottom: '2px' }}
                  >
                    <CardComponent
                      title="Compliance Tracking"
                      imageUrl={CardImage}
                      description="Compliance tracking, also known as compliance monitoring, is the process of monitoring and organizing compliance-related information and activities."
                      linkUrl="/details"
                    />
                  </Col>
                  <Col span={12}>
                    <CardComponent
                      title="ESG Reporting"
                      imageUrl={CardImage2}
                      description="Compliance tracking, also known as compliance monitoring, is the process of monitoring and organizing compliance-related information and activities."
                      linkUrl="/details"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    span={12}
                    style={{ paddingRight: '2px', paddingBottom: '2px' }}
                  >
                    <CardComponent
                      title="Data Analysis"
                      imageUrl={CardImage}
                      description="Compliance tracking, also known as compliance monitoring, is the process of monitoring and organizing compliance-related information and activities."
                      linkUrl="/details"
                    />
                  </Col>
                  <Col span={12}>
                    <CardComponent
                      title="Sustainability Insights"
                      imageUrl={CardImage}
                      description="Compliance tracking, also known as compliance monitoring, is the process of monitoring and organizing compliance-related information and activities."
                      linkUrl="/details"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Statistic */}
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#002831',
                border: '1px solid #12594D',
                borderLeft: 'none',
                borderRight: 'none',
                margin: '20px 0',
              }}
            >
              <Col span={4}>
                <Card style={statcardStyle}>
                  <img src={CardImage3} alt="" />
                  <h2 style={h2Style}>500+</h2>
                  <p style={paraStyle}>Happy Customers</p>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={statcardStyle}>
                  <img src={CardImage7} alt="" />
                  <h2 style={h2Style}>35</h2>
                  <p style={paraStyle}>Projects</p>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={statcardStyle}>
                  <img src={CardImage5} alt="" />
                  <h2 style={h2Style}>858</h2>
                  <p style={paraStyle}>Energy Utilities</p>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={statcardStyle}>
                  <img src={CardImage6} alt="" />
                  <h2 style={h2Style}>25</h2>
                  <p style={paraStyle}>New Innovations</p>
                </Card>
              </Col>
              <Col span={4}>
                <Card style={statcardStyle}>
                  <img src={CardImage4} alt="" />
                  <h2 style={h2Style}>6+</h2>
                  <p style={paraStyle}>Years of Expertise</p>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col span={12} style={{ paddingBottom: '20px' }}>
                <h2 style={{ textAlign: 'left', fontSize: '27px' }}>
                  Environment, Social and Governance
                </h2>
                <p style={{ textAlign: 'left', paddingBottom: '20px' }}>
                  Each puzzle piece represents a vital aspect of sustainability,
                  symbolizing the interconnectedness and interdependence of
                  these elements. The Environmental piece focuses on addressing
                  climate change, resource conservation, and pollution control.
                  The Social piece emphasizes fair labor practices, community
                  engagement, and diversity and inclusion. The Governance piece
                  highlights transparency, ethics, and shareholder rights. By
                  understanding how these pieces fit together, users can grasp
                  the comprehensive nature of sustainability and its impact on
                  the environment, society, and responsible business practices.
                  The Sustainability Puzzle serves as a visual reminder that by
                  integrating ESG components, individuals and organisations can
                  contribute to positive change and create a more sustainable
                  future.
                </p>
              </Col>
              <Col span={12}></Col>
            </Row>

            {/* tabs sec */}

            <Tabs
              defaultActiveKey="1"
              activeKey={activeKey}
              onChange={handleTabChange}
              type="card"
            >
              <TabPane tab="Environment" key="1">
                <Row>
                  <Col span={24} style={{ textAlign: 'left', color: '#fff' }}>
                    <h2>Environment Factors</h2>
                    <p>
                      Focuses on a company's impact on the natural environment,
                      including its efforts to mitigate climate change, conserve
                      resources, and reduce pollution.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <img src={EnvioFactor} alt="" />
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Climate}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Climate Change</h2>
                        <p>
                          Assessing a company's efforts to reduce greenhouse gas
                          emissions, transition to renewable energy sources, and
                          mitigate the effects of climate change.
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Resource}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Resource Conservation</h2>
                        <p>
                          Evaluating the responsible use of natural resources,
                          including water, energy, and raw materials, as well as
                          waste management and recycling practices.
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Pollution}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Pollution and Waste</h2>
                        <p>
                          Considering a company's measures to minimize
                          pollution, control emissions, manage hazardous
                          materials, and reduce waste generation.
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Social" key="2">
                <Row>
                  <Col span={24} style={{ textAlign: 'left', color: '#fff' }}>
                    <h2>Social</h2>
                    <p>
                      Focuses on a company's impact on the natural environment,
                      including its efforts to mitigate climate change, conserve
                      resources, and reduce pollution.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <img src={EnvioFactor} alt="" />
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Climate}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Climate Change</h2>
                        <p>
                          Assessing a company's efforts to reduce greenhouse gas
                          emissions, transition to renewable energy sources, and
                          mitigate the effects of climate change.
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Resource}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Resource Conservation</h2>
                        <p>
                          Evaluating the responsible use of natural resources,
                          including water, energy, and raw materials, as well as
                          waste management and recycling practices.
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Pollution}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Pollution and Waste</h2>
                        <p>
                          Considering a company's measures to minimize
                          pollution, control emissions, manage hazardous
                          materials, and reduce waste generation.
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Governance" key="3">
                <Row>
                  <Col span={24} style={{ textAlign: 'left', color: '#fff' }}>
                    <h2>Governance</h2>
                    <p>
                      Focuses on a company's impact on the natural environment,
                      including its efforts to mitigate climate change, conserve
                      resources, and reduce pollution.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <img src={EnvioFactor} alt="" />
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Climate}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Climate Change</h2>
                        <p>
                          Assessing a company's efforts to reduce greenhouse gas
                          emissions, transition to renewable energy sources, and
                          mitigate the effects of climate change.
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Resource}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Resource Conservation</h2>
                        <p>
                          Evaluating the responsible use of natural resources,
                          including water, energy, and raw materials, as well as
                          waste management and recycling practices.
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: '100%' }} />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={Pollution}
                        alt=""
                        style={{ paddingRight: '20px' }}
                      />
                      <div style={{ textAlign: 'left', color: '#fff' }}>
                        <h2>Pollution and Waste</h2>
                        <p>
                          Considering a company's measures to minimize
                          pollution, control emissions, manage hazardous
                          materials, and reduce waste generation.
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Layout>
        </Content>
      </Layout>

      <Layout style={{ background: 'red' }}>
        <Row
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: './beautiful-morning-jungle-taken-from-top-view 1.png',
          }}
          className="challenges"
        ></Row>
      </Layout>

      {/* footer */}
      <Footer
        style={{ background: '#12594D', color: '#fff', padding: '50px 0 20px' }}
      >
        <Layout
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: '#12594D',
          }}
          className="footer-layout"
        >
          <Row
            style={{
              background: '#002129',
              padding: '30px',
            }}
          >
            <Col span={12}>
              <h1>Subscribe For Latest Updates</h1>
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '1.4',
                  fontWeight: '300',
                  fontFamily: 'sora',
                }}
              >
                Stay informed and be part of the sustainable revolution.
                Subscribe to our email updates and join a community dedicated to
                shaping a better future for the planet. Receive the latest ESG
                insights, real-time news, and actionable tips directly in your
                inbox. Together, let's make a positive impact on the world we
                share.
              </p>
            </Col>
            <Col
              span={12}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <form>
                <input
                  type="text"
                  placeholder="Enter your email address"
                  style={{
                    background: 'rgb(18, 89, 77)',
                    padding: '13px 14px',
                    border: 'none',
                    width: 'calc(17vw - 1.2vw)',
                    borderTopLeftRadius: '14px',
                    borderBottomLeftRadius: '14px',
                    boxShadow: 'inset 0 0 0 1px #ffffff',
                  }}
                />
                <Button
                  type="primary"
                  style={{
                    border: '1px solid #ffffff',
                    width: '5vw',
                    height: 'calc(2.3vw + 2px)', // Adjusted to account for input field padding and border
                    borderTopLeftRadius: '0',
                    borderBottomLeftRadius: '0',
                    borderTopRightRadius: '25px',
                    borderBottomRightRadius: '25px',
                  }}
                >
                  Submit
                </Button>
              </form>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={7}>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <img src={Logo2} alt="" />
                </li>
                <li>
                  <p>
                    Streamline Compliance, Empower Sustainability with SCARMP
                  </p>
                </li>
              </ul>
            </Col>
            <Col span={4}>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <a href="#">Resources</a>
                </li>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </Col>
            <Col span={4}>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <a href="#">SCARMP</a>
                </li>
                <li>
                  <a href="#">Environment </a>
                </li>
                <li>
                  <a href="#">Governance</a>
                </li>
                <li>
                  <a href="#">Social</a>
                </li>
              </ul>
            </Col>
            <Col span={4}>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <a href="#">ESG Challenges</a>
                </li>
                <li>
                  <a href="#">Environment </a>
                </li>
                <li>
                  <a href="#">Governance</a>
                </li>
                <li>
                  <a href="#">Social</a>
                </li>
              </ul>
            </Col>
            <Col span={5}>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <PhoneOutlined /> <a href="tel:000-000-0000">000-000-0000</a>
                </li>
                <li>
                  <MailOutlined />{' '}
                  <a href="mailto:scarmp@gmail.com">scarmp@gmail.com</a>
                </li>
                <li>
                  <a href="#">
                    <InstagramOutlined />
                  </a>
                  <a href="#">
                    {' '}
                    <TwitterOutlined />
                  </a>
                  <a href="#">
                    <FacebookOutlined />
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
        </Layout>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
