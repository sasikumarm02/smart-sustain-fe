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
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '8px',
  };

  return (
    <Card style={cardStyle}>
      <Row>
        <Col span={18}>
          <h2 className="card-title" style={titleStyle}>
            {title}
          </h2>
          <Meta />
          <div className="card-content">
            <p className="card-text">{description}</p>
            <a href={linkUrl} className="card-link" style={{ color: '#fff' }}>
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
