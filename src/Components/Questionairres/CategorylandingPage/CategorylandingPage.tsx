import { Col, Image, Row } from 'antd';
import React from 'react';
import Category3LandingImg from '../../../assets/category3LandingImg.png';
import Styles from './CategorylandingPage.module.scss';
import { Typography } from 'antd';
import { ButtonComponent } from '../../../DesignLibrary';
import { useNavigate } from 'react-router-dom';
const { Title, Paragraph } = Typography;
interface Props {}

function CategorylandingPage(props: Props) {
  const navigation = useNavigate();
  const {} = props;
  const handleNext = () => {
    navigation('/scope3/category-3');
  };
  return (
    <>
      <Row className={Styles.QuestionairresBack}>
        <Col span={8} className={Styles.customPaddingRight}>
          <Image src={Category3LandingImg} alt="" preview={false} />
        </Col>
        <Col span={16}>
          <div>
            <Title level={3} className={Styles.pageText}>
              "Fuel & Energy-related Activities"
            </Title>
            <Paragraph className={Styles.pageText}>
              Category 3 emissions refer to fuel- and energy-related emissions
              that are not captured under Scope 1 or Scope 2.
            </Paragraph>
            <Paragraph className={Styles.pageText}>
              This category includes four main activities:
            </Paragraph>
            <Title level={5} className={Styles.pageText}>
              A. Upstream Emissions of Purchased Fuels:
            </Title>
            <Paragraph className={Styles.pageText}>
              Emissions generated during the extraction, production, and
              transportation of fuels consumed by the reporting company.
            </Paragraph>

            <Title level={5} className={Styles.pageText}>
              B. Upstream Emissions of Purchased Electricity:
            </Title>
            <Paragraph className={Styles.pageText}>
              Emissions that arise during the extraction, production, and
              transportation of fuels used in the generation of electricity,
              steam, heating, and cooling consumed by the reporting company.
            </Paragraph>

            <Title level={5} className={Styles.pageText}>
              C. Transmission and Distribution (T&D) Losses:
            </Title>
            <Paragraph className={Styles.pageText}>
              Emissions from the generation of electricity, steam, heating, and
              cooling that are lost in transmission and distribution systems
              before reaching the end user. These losses are relevant to end
              users of electricity, steam, heating, and cooling.
            </Paragraph>

            <Title level={5} className={Styles.pageText}>
              D. Generation of Purchased Electricity That Is Sold to End Users:
            </Title>
            <Paragraph className={Styles.pageText}>
              These emissions occur when purchased electricity, steam, heating,
              and cooling is purchased by the reporting company and resold to
              end users.
            </Paragraph>

            <Paragraph className={Styles.pageText}>
              You are required to report these emissions if any of your
              activities match the description above.
            </Paragraph>
          </div>
          <Col span={24}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                marginTop: '150px',
              }}
            >
              <ButtonComponent
                hierarchy="primary"
                size="lg"
                onClick={handleNext}
              >
                Next
              </ButtonComponent>
            </div>
          </Col>
        </Col>
      </Row>
    </>
  );
}

export default CategorylandingPage;
