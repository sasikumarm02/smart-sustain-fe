import React, { FC } from 'react';
import { Card, Row, Col } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const { Meta } = Card;

interface CustomCardProps {
  title: string;
  imageUrl: string;
  description: string;
  linkUrl: string;
}

const CustomCard: FC<CustomCardProps> = ({
  title,
  imageUrl,
  description,
  linkUrl,
}) => {
  const cardStyle: React.CSSProperties = {
    textAlign: 'left',
    background: '#12594D',
    color: '#fff',
    border: 'none',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '21px',
    fontWeight: 400,
    marginBottom: '8px',
    marginTop: '0px',
  };

  return (
    <Card style={cardStyle}>
      <Row>
        <Col span={18}>
          <Col span={4} style={{ margin: '0px' }}>
            <h2 className="card-title" style={titleStyle}>
              {title}
            </h2>
          </Col>

          <Meta />
          <div className="card-content">
            <p
              className="card-text"
              style={{ fontSize: '12px', color: '#D3D3D3' }}
            >
              {description}
            </p>
            <a
              href={linkUrl}
              className="card-link"
              style={{
                color: '#fff',
                border: '1px solid #ffffff',
                borderRadius: ' 50%',
                padding: '2px 4px',
              }}
            >
              <ArrowRightOutlined />
            </a>
          </div>
        </Col>
        <Col span={6}>
          {' '}
          <img alt={title} src={imageUrl} className="card-image" />
        </Col>
      </Row>
    </Card>
  );
};

export default CustomCard;
