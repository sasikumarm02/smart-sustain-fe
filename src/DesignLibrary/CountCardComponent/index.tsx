import React from 'react';
import { Card, Row, Col, Typography, Image } from 'antd';
import styles from './CountCard.module.scss';

const { Title } = Typography;

interface CountCardComponentProps {
  imageSrc: any;
  title: string;
  total: any;
}

const CountCardComponent: React.FC<CountCardComponentProps> = ({
  imageSrc,
  title,
  total,
}) => {
  return (
    <Card className={styles.CountCardComponentWrap}>
      <Row gutter={[10, 30]} align="middle" justify="center">
        <Col xl={8} lg={8} md={10} sm={10} xs={10}>
          {imageSrc}
        </Col>
        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
          <h6 className={styles.CountCardComponentTitle}>{title}</h6>
          <p className={styles.CountCardComponentTotal}>{total}</p>
        </Col>
      </Row>
    </Card>
  );
};

export default CountCardComponent;
