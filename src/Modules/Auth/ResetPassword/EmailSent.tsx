import { Row, Col, Typography, Image } from 'antd';
import VerifyIcon from '@assets/SVG/verifyIcon.svg';
import styles from '../Auth.module.scss';

const { Title, Text } = Typography;

export const EmailSent = () => {
  return (
    <>
      <Row>
        <Col span={18} offset={3}>
          <Title level={2} style={{ textAlign: 'center' }}>
            Email Verification
          </Title>
          <Col
            span={24}
            style={{ marginTop: styles.whitespace3, textAlign: 'center' }}
          >
            <Image loading="lazy" src={VerifyIcon} preview={false} />
          </Col>
          <Col
            span={24}
            style={{ marginTop: styles.whitespace3, textAlign: 'center' }}
          >
            <Typography.Text className={styles.loginDontText}>
              We have sent a verification code to your registered email ID.
              Please enter verification code below.
            </Typography.Text>
          </Col>
        </Col>
      </Row>
    </>
  );
};
