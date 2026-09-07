import { Button, Card, Col, Row } from 'antd';
import BarChartWithSingle from '../../Components/Graph/BarChartWithSingle';
import { useNavigate } from 'react-router-dom';

const suppliers = [
  {
    name: 'Number of suppliers with ESG reporting',
    uv: 4000,
  },
  {
    name: 'Number of suppliers responded',
    uv: 3000,
  },
  {
    name: 'Number of suppliers surveyed',
    uv: 3000,
  },
  {
    name: 'Number of suppliers',
    uv: 2000,
  },
];
const products = [
  {
    name: 'Number of products with self assessed Emission Factors',
    uv: 4000,
  },
  {
    name: 'Number of products with reported Emission Factors',
    uv: 3000,
  },
  {
    name: 'Number of products requiring Emission Factors ',
    uv: 3000,
  },
  {
    name: 'Number of products',
    uv: 2000,
  },
];

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const handleChange = () => {};
  return (
    <>
      <Row className="mt-4">
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            className="primary-act-btn"
            onClick={() => navigate('/settings/supplier/form')}
          >
            Invite Supplier +
          </Button>
        </Col>
      </Row>
      <Card className="mt-3">
        <Row gutter={10}>
          <Col span={24}>
            <h6 style={{ textAlign: 'right' }}>
              Reporting Period :{' '}
              <span style={{ color: '#040404', fontWeight: '700' }}>
                FY 2023-24
              </span>
            </h6>
          </Col>
          <Col lg={12} md={24}>
            <BarChartWithSingle
              data={suppliers}
              title="Suppliers"
              buttonLabel="View More"
            />
          </Col>
          <Col lg={12} md={24}>
            <BarChartWithSingle data={products} title="Products" />
          </Col>
        </Row>
      </Card>{' '}
    </>
  );
}
