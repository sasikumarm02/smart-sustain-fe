import React from 'react';
import { Button, Card, Col, Image, Row } from 'antd';
import noData from '../../assets/Svg/Nodataavailable.png';

function PageNotFound() {
  return (
    <Card>
      <Row
        justify="center"
        align="middle"
        gutter={[12, 12]}
        style={{ textAlign: 'center' }}
      >
        <Col span={24}>
          <Image className="nodata-image" preview={false} src={noData} />
        </Col>
        <Col span={24}>
          <div className="nodata-heading">No Data Available</div>
        </Col>
        <Col span={24}>
          <div className="nodata-subheading">
            There is no data to show you right now
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default PageNotFound;
