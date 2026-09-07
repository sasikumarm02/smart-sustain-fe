import React from 'react';
import { Card, Col, Row, Progress } from 'antd';
import './EmissionCard.css'; // Ensure you have the CSS imported
import { formatNumberUS } from '../../Utils/Strings';

interface EmissionCardProps {
  title: string;
  subtitle: string;
  actualValue: string;
  progressValue: number;
  unit: string;
  startValue: string;
  endValue: string;
  image: string;
  backgroundColor: string;
}

const EmissionCard: React.FC<EmissionCardProps> = ({
  title,
  subtitle,
  actualValue,
  progressValue,
  unit,
  startValue,
  endValue,
  image,
  backgroundColor,
}) => {
  return (
    <Card
      style={{ backgroundColor: `${backgroundColor}` }}
      className="emission-card"
      bordered={false}
    >
      <Row>
        <Col
          span={6}
          style={{
            marginTop: '-2vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={image}
            alt="icon"
            style={{ maxWidth: '100%', height: '70%' }}
          />
        </Col>
        <Col
          span={8}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              {title}
            </p>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {subtitle}
            </p>
            <p
              style={{
                margin: 0,
                color: 'white',
                fontSize: '22px',
                fontWeight: '600',
              }}
            >
              {formatNumberUS(actualValue)} {unit}
            </p>
          </div>
        </Col>
        <Col
          span={1}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="vertical-line"></div>
        </Col>
        <Col
          span={9}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: '4vh',
          }}
        >
          <Progress
            percent={progressValue}
            showInfo={false}
            strokeColor="#AB0D82"
            trailColor="#EAEAEA"
            strokeWidth={35}
          />
          <Row>
            <Col
              span={12}
              style={{
                textAlign: 'left',
                color: 'white',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {/* {formatNumberUS(startValue)} */}
              {startValue}
            </Col>
            <Col
              span={12}
              style={{
                textAlign: 'right',
                color: 'white',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              {formatNumberUS(endValue)}
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default EmissionCard;
