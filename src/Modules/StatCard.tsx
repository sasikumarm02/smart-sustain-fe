import React, { FC } from 'react';
import { Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface StatCardProps {
  count: number;
  name: string;
  img: string;
}

const StatCard: FC<StatCardProps> = ({ count, name, img }) => {
  const cardStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
  };

  const h2Style: React.CSSProperties = {
    color: '#fff',
  };

  const paraStyle: React.CSSProperties = {
    color: '#fff',
  };

  return (
    <Card style={cardStyle}>
      <img src={img} alt={name} />
      <h2 style={h2Style}>{count}</h2>
      <p style={paraStyle}>{name}</p>
    </Card>
  );
};

export default StatCard;
