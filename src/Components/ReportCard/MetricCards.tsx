import { Card, Col, Progress, Row, Tag } from 'antd';
import styles from './Metrics.module.scss';
import './Metrics.css';
import { ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const getTagProps = (
  date: string,
  value: number
): { color: string; text: string } => {
  const currentDate = moment();
  const dataMoment = moment(date, 'DD-MM-YYYY');
  const today = moment().startOf('day');
  const dayOfMonth = dataMoment.date();

  if (value == 100) {
    return { color: '#008000', text: 'Completed' };
  } else if (dataMoment.isSame(currentDate, 'day')) {
    return { color: '#AB0D0D', text: date };
  } else if (dayOfMonth >= 1 && dayOfMonth <= 25) {
    return { color: '#008000', text: date };
  } else if (dayOfMonth >= 26 && dayOfMonth <= 30) {
    return { color: '#F6AA37', text: date };
  } else {
    return { color: '#098E7E', text: date };
  }
};

export const CardTags = ({ date, value }: any) => {
  const { color, text }: { color: any; text: any } = getTagProps(
    date,
    value
  ) || { color: '', text: '' };

  return (
    <Tag icon={<ClockCircleOutlined />} color={color}>
      {text}
    </Tag>
  );
};

export const MetricCards = ({ data, onclick }: any) => {
  const navigate = useNavigate();

  const handleCardClick = (data: any) => {
    // const query = encodeURIComponent(data.category_id);
    navigate(
      `/reports/compliance?category_id=${data.category_id}&&category_name=${data.category_name}`
    );
  };

  return (
    <Row style={{ padding: '10px 20px' }} gutter={24}>
      {data.map((item: any, index: any) => (
        <Col key={index} span={6}>
          <Card
            style={{ height: '20vh' }}
            className={styles.main}
            onClick={() => handleCardClick(item)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className={styles.card}>
                <h3 className={styles.title}>{item.category_id}</h3>
                <p className={styles.text}>{item.category_name}</p>
              </div>
              <Progress
                strokeColor="#7213EA"
                type="circle"
                size={[70, 40]}
                percent={item.completion_percentage}
              />
            </div>
            {/* <CardTags date={item.date} value={item.value} /> */}
          </Card>
        </Col>
      ))}
    </Row>
  );
};
