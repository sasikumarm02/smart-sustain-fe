import React from 'react';
import { Row, Col, Typography, Flex, Button, Image, Table } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import AdminIcon from '../../assets/Svg/Capa_1.svg';
import Styles from './Dashboard.module.scss';
export default function AdminDashboard() {
  return (
    <>
      <Row justify="space-around" className="mt-2">
        {[
          {
            text: 'Total Number of companies Onboarded',
            bgColor: '#00338D',
          },
          {
            text: 'Total Number of companies having Sustainability Report',
            bgColor: '#00C0AE',
          },
          {
            text: 'Total Number of Companies with Compliance data ',
            bgColor: '#00B8F5',
          },
          {
            text: 'Total Number of companies not having Sustainability Report ',
            bgColor: '#AB0D82',
          },
          {
            text: 'Total Number of Companies without Compliance data ',
            bgColor: '#7213EA',
          },
          {
            text: 'List of Frame works in Platform ',
            bgColor: '#666666',
          },
        ].map((res: any, index: number) => (
          <Col lg={11} key={index} className={`${Styles.admin_backgroud} mt-3`}>
            <Row gutter={12}>
              <Col span={7}>
                <div
                  className={Styles.admin_img}
                  style={{
                    background: res.bgColor,
                  }}
                >
                  <Image
                    loading="lazy"
                    src={AdminIcon}
                    alt="img"
                    width={80}
                    height={100}
                    preview={false}
                  />
                </div>
              </Col>
              <Col span={17} className="bg-white">
                <div className={Styles.admin_text}>
                  <Typography.Text className={Styles.admin_title}>
                    {res.text}
                  </Typography.Text>
                  <Flex justify="space-between" align="center">
                    <Typography.Text className={Styles.admin_count}>
                      50
                    </Typography.Text>
                    <Button type="link" className={Styles.admin_button}>
                      <u>View More</u>&nbsp;
                      <ArrowRightOutlined />
                    </Button>
                  </Flex>
                </div>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={8} offset={1} className="mt-4">
          <Table
            dataSource={[
              {
                list: 'GRI',
              },
              {
                list: 'SASB',
              },
              {
                list: 'FTES',
              },
              {
                list: 'BRSR',
              },
            ]}
            columns={[
              {
                title: 'Frameworks List',
                dataIndex: 'list',
                key: 'list',
              },
            ]}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
}
