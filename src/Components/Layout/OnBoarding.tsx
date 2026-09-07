import { Layout, Row, Col, Card } from 'antd';
// import logo from "@assets/SVG/logo.svg";

export const OnBoarding = (props: any) => {
  return (
    <Layout.Content>
      <Row style={{ height: window.innerHeight }} align="middle">
        <Col xs={{ span: 0 }} md={{ span: 12 }}></Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <div>
            <Row justify="center" style={{ width: '100%' }}>
              <Col xs={{ span: 24 }} md={{ span: 16 }}>
                <Row gutter={8} justify="center" align="middle">
                  {/* <Image loading="lazy" src={`logo`} width={295} height={52} preview={false} /> */}
                </Row>
              </Col>
            </Row>
            <Row justify="center" align="middle" style={{ width: '100%' }}>
              <Col xs={{ span: 24 }} md={{ span: 18 }}>
                <Card
                  bodyStyle={{
                    width: '100%',
                    margin: 'auto',
                  }}
                >
                  {props.children}
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Layout.Content>
  );
};
