import { Button, Card, Col, Row } from 'antd';
import Styles from './Assessement.module.scss';
import { useNavigate } from 'react-router-dom';
import RadialChart from './RadialChart';
import CircularChart from './CircularChart';
import { Icon } from '@iconify/react';
export default function MaturityReport() {
  return (
    <div>
      <h4 className={Styles.title}>Target ESG Maturity</h4>
      <p className={Styles.SubTitile}>
        Which stage do you want your organisation to reach?​
      </p>
      <Card className="pb-4 pt-4">
        <Row className="p-4">
          <Col span={13}>
            <h4>Radar Chart</h4>
            <Row>
              <Col span={7} style={{ paddingLeft: '6px', paddingTop: '25px' }}>
                {[
                  {
                    title: 'Data Protection',
                    color: '#1E49E2',
                  },
                  {
                    title: 'Risk Management',
                    color: '',
                  },
                  {
                    title: ' Labor Standard',
                    color: '',
                  },
                  {
                    title: 'Human Rights',
                    color: '',
                  },
                  {
                    title: '  Equal Opportunity',
                    color: '',
                  },
                ].map((data: any, index: number) => (
                  <div
                    className={`${Styles.LabelPosition}`} //${Styles.AnotherClass}
                    key={index}
                  >
                    <Icon
                      icon="material-symbols:square"
                      color={data?.color}
                      fontSize={24}
                    />
                    <div style={{ fontSize: '20px', paddingLeft: '6px' }}>
                      {' '}
                      {data?.title}
                    </div>
                  </div>
                ))}
              </Col>
              <Col span={17}>
                {' '}
                <RadialChart />
              </Col>
            </Row>
          </Col>
          <Col
            span={1}
            style={{ borderLeft: '2px solid black', height: '80vh' }}
          >
            <div style={{ borderLeft: '2px solid black' }}></div>
          </Col>
          <Col span={10}>
            <h4>Overall Assessment Report</h4>
            <Row>
              <Col span={10}>
                {' '}
                <CircularChart
                  color={'#006400'}
                  text1={2}
                  text2={'nd'}
                  text3={'Environment'}
                />
              </Col>
              <Col span={14}>
                <p>
                  Organisations at this stage have taken concrete steps towards
                  sustainability. They have implemented Environmental Management
                  Systems, invested in energy and water efficiency improvements,
                  developed eco-friendly products, and begun to digitise parts
                  of their business. However, these efforts are still in the
                  early stages.​
                </p>
              </Col>
              <Col span={10}>
                {' '}
                <CircularChart
                  color={'#800080'}
                  text1={1}
                  text2={'st'}
                  text3={'Social'}
                />
              </Col>
              <Col span={14}>
                <p>
                  Organisations at this stage are in the initial phases of
                  considering sustainability practices. They may have started
                  exploring the concept of ESG (Environmental, Social, and
                  Governance). However, they have yet to fully integrate
                  sustainability into their operations.​
                </p>
              </Col>
              <Col span={10}>
                {' '}
                <CircularChart
                  color={'#FF1493'}
                  text1={3}
                  text2={'rd'}
                  text3={'Governance'}
                />
              </Col>
              <Col span={14}>
                <p>
                  At this stage, organisations have progressed to implementing
                  measures and setting targets to reduce their emissions across
                  all scopes (Scope 1, Scope 2, and Scope 3). They have adopted
                  renewable energy and/or carbon capture solutions where
                  applicable. Their ESG efforts have gained recognition from
                  industry standards such as GRI/ISSB and Eco Vadis, and they
                  have conducted stress tests to assess climate risks.​
                </p>
              </Col>
            </Row>
          </Col>
          <Col span={24} className={Styles.ButtonItemPosition2}>
            {' '}
            <Button className={Styles.ButtonSty}>Download Report</Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
