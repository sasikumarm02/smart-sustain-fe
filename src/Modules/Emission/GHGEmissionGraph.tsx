import { Col, Row, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Dot1 from '../../assets/image/Dot.png';
import Dot2 from '../../assets/image/Dot (1).png';
import Dot3 from '../../assets/image/Dot (2).png';
import { Icon } from '@iconify/react';
const GHGEmissionGraph = ({ label, data }: any) => {
  return (
    <>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>{label}</h3>
        <Row style={{ paddingBottom: '20px' }}>
          <Col span={3}>
            <Space>
              <Icon
                icon="icon-park-outline:dot"
                style={{
                  fontSize: 25,
                  color: '#2C5C54',
                }}
              />{' '}
              2019-2020
            </Space>
          </Col>
          <Col span={3}>
            <Space>
              <Icon
                icon="icon-park-outline:dot"
                style={{
                  fontSize: 25,
                  color: '#DA7031',
                }}
              />{' '}
              2020-2021
            </Space>
          </Col>
          <Col span={3}>
            <Space>
              <Icon
                icon="icon-park-outline:dot"
                style={{
                  fontSize: 25,
                  color: '#23456A',
                }}
              />{' '}
              2021-2022
            </Space>
          </Col>
          <Col span={3}>
            <Space>
              <Icon
                icon="icon-park-outline:dot"
                style={{
                  fontSize: 25,
                  color: '#95B7C7',
                }}
              />{' '}
              2022-2023
            </Space>
          </Col>
        </Row>
        <BarChart
          data={data}
          width={800}
          height={300}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend  />  */}
          <Bar dataKey="2019-2020" fill="#2C5C54" barSize={15} />
          <Bar dataKey="2020-2021" fill="#DA7031" barSize={15} />
          <Bar dataKey="2021-2022" fill="#23456A" barSize={15} />
          <Bar dataKey="2022-2023" fill="#95B7C7" barSize={15} />
        </BarChart>
      </div>
    </>
  );
};

export default GHGEmissionGraph;
