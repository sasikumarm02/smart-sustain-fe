import React from 'react';
import { Card, Row, Col, Typography, Image } from 'antd';
import styles from './CountCard.module.scss';

const { Title } = Typography;

interface CountCardProps {
  imageSrc: any;
  title: string;
  total: number;
}

const CountCard: React.FC<CountCardProps> = ({ imageSrc, title, total }) => {
  return (
    <Card className={styles.countCardWrap}>
      <div className={styles.countCardContent}>
        <div>{imageSrc}</div>
        <div>
          <div className={styles.countCardTitle}>{title}</div>
          <div className={styles.countCardTotal}>{total}</div>
        </div>
      </div>
    </Card>
  );
};

export default CountCard;
