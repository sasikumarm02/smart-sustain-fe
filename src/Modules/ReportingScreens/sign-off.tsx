import {
  Button,
  Card,
  Col,
  Radio,
  Row,
  Spin,
  Typography,
  Checkbox,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Styles from './report.module.scss';
import image from '../../assets/image/sign-off.png';
import { get, put } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import NoDataImage from '../../assets/Svg/NoData';
import { getCurrentYear } from '../../Components/Emissions/Scope3/Helpers';
import Flower1 from '../../assets/Svg/MaturityAssessment/MatVector1.svg';
import griImg from '../../assets/Svg/griStartImg.svg';

export default function Signoff() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setdata] = useState<any>([]);
  const [selectedData, setSelectedData] = useState<any>([]);
  const { openToast } = useNotification();

  const fetchData = () => {
    setIsLoading(true);
    get(
      `/report/get_categories_with_complete_assessments/?entity_Id=${user.entity_Id}`
    )
      .then((res: any) => {
        if (res.response.status !== false) {
          setdata(res.response.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = () => {
    setIsLoading(true);
    put(`/report/update_isSignOff_status/`, {
      entity_Id: user.entity_Id,
      category_ids: selectedData,
    })
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
            fetchData();
          } else {
            openToast({
              content: `${res?.message}`,
              type: 'warning',
            });
          }
        }
        setIsLoading(false);
      })
      .catch((err) =>
        openToast({
          content: `${err?.message}`,
          type: 'error',
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const levels = [
    { level: 'GRI Reporters', label: '14,000' },
    { level: 'Countries', label: '100' },
    { level: 'G250 Companies reports GRI', label: '78%' },
  ];

  return (
    <Spin spinning={isLoading}>
      {data.length !== 0 ? (
        <div>
          {/* <h4 className={Styles.reportHead}>Reporting Compliance Sign Off</h4> */}
          <Card
          // className={Styles.pageCardStyle}
          // style={{ borderRadius: '2rem' }}
          >
            <Row>
              <Col span={24}>
                <Row gutter={20}>
                  <Col span={12} className="mt-5">
                    <h4
                      className={`${Styles.fontSize36} ${Styles.lineHeight40} ${Styles.primeColor} fw-normal`}
                    >
                      ESG Reporting: Your Sign-Off Ensures Transparency
                    </h4>
                    <p
                      className={`${Styles.customfontsize17} ${Styles.lineHeight28} ${Styles.customTextColorGrey} fw-normal`}
                    >
                      Your organisation’s data reviewers have meticulously
                      assessed the GRI questions, and your final approval is the
                      critical step in ensuring the accuracy and completeness of
                      your organisation’s ESG report. This report will be
                      compiled in accordance with the Global Reporting
                      Initiative (GRI) framework. By clicking on each material
                      topic, you will finalize the data submission and provide
                      your final sign-off on the reviewed information. This
                      signifies your endorsement of the comprehensive and
                      reliable picture presented in the ESG report.
                    </p>
                  </Col>
                  <Col span={6}>
                    <div style={{ marginLeft: '30px' }}>
                      <img src={Flower1} alt="Flower One" />
                    </div>
                    <div>
                      <img src={griImg} alt="Gri Image" />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={Styles.cardOneMat}>
                      <div className={Styles.levelTextHead}>
                        Countries Under going GRI
                      </div>
                      {levels.map(({ level, label }) => (
                        <div className={Styles.levelText} key={level}>
                          <span>{level}</span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="mt-5">
              <Row>
                <h4
                  style={{
                    color: '#0D304A',
                  }}
                >
                  GRI Material Topics
                </h4>
              </Row>
              {data.length > 0 ? (
                <Row
                  style={{ padding: '10px 20px', marginTop: '100px' }}
                  gutter={24}
                >
                  {data.map((item: any, index: number) => {
                    let str = item.category_name;
                    if (item?.category_name?.length > 20) {
                      str = str.substr(0, 20);
                      str += '...';
                    }
                    return (
                      <Col key={index} span={12}>
                        <Card
                          style={{
                            height: '15vh',
                            display: 'flex',
                            justifyContent: 'left',
                            alignItems: 'center',
                            border: 'none',
                          }}
                        >
                          <Typography.Text
                            ellipsis={true}
                            className={Styles.text}
                            style={{ marginLeft: '10vw' }}
                          >
                            <Checkbox
                              style={{ marginRight: '10px' }}
                              onChange={() =>
                                setSelectedData((selectedData: any) => [
                                  ...selectedData,
                                  item?.category_id,
                                ])
                              }
                            ></Checkbox>
                            {item.category_name}
                          </Typography.Text>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <></>
              )}
              <ButtonComponent
                style={{ marginLeft: '80vw', marginBottom: '10px' }}
                onClick={() => updateData()}
              >
                Sign Off
              </ButtonComponent>
            </Row>
          </Card>
          <footer
            className={`${Styles.footer} d-flex justify-content-between align-items-center `}
          >
            <div className={Styles.footerRights} style={{ marginLeft: '65vw' }}>
              © {getCurrentYear()} SMART SUSTAIN.AI. All Rights Reserved.
            </div>
          </footer>
        </div>
      ) : (
        <div>
          {/* <h4 className={Styles.reportHead}>Reporting Compliance Sign Off</h4> */}
          <Card
            className={Styles.pageCardStyle}
            style={{ borderRadius: '2rem' }}
          >
            <Row>
              <Col span={24}>
                <Row gutter={20}>
                  <Col span={12} className="mt-5">
                    <h4
                      className={`${Styles.fontSize36} ${Styles.lineHeight40} ${Styles.primeColor} fw-normal`}
                    >
                      ESG Reporting: Your Sign-Off Ensures Transparency
                    </h4>
                    <p
                      className={`${Styles.customfontsize17} ${Styles.lineHeight28} ${Styles.customTextColorGrey} fw-normal`}
                    >
                      Your organisation’s data reviewers have meticulously
                      assessed the GRI questions, and your final approval is the
                      critical step in ensuring the accuracy and completeness of
                      your organisation’s ESG report. This report will be
                      compiled in accordance with the Global Reporting
                      Initiative (GRI) framework. By clicking on each material
                      topic, you will finalize the data submission and provide
                      your final sign-off on the reviewed information. This
                      signifies your endorsement of the comprehensive and
                      reliable picture presented in the ESG report.
                    </p>
                  </Col>
                  <Col span={6}>
                    <div style={{ marginLeft: '30px' }}>
                      <img src={Flower1} alt="Flower One" />
                    </div>
                    <div>
                      <img src={griImg} alt="Gri Image" />
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className={Styles.cardOneMat}>
                      <div className={Styles.levelTextHead}>
                        Countries Under going GRI
                      </div>
                      {levels.map(({ level, label }) => (
                        <div className={Styles.levelText} key={level}>
                          <span>{level}</span>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="mt-6" gutter={[0, 16]}>
              <Col span={24}>
                <h4 style={{ color: '#0D304A' }}>GRI Material Topics</h4>
              </Col>

              <Col span={24}>
                <PageCardComponent>
                  <div className="text-center p-4">
                    <NoDataImage />
                  </div>
                  <p className={Styles.dataNotFoundDesc}>
                    All Material Topics are currently being reviewed by our Data
                    Reviewers.
                    <br /> Please revisit this space for updates in the future.
                  </p>
                </PageCardComponent>
              </Col>

              <Col span={24}>
                <ButtonComponent
                  disabled
                  style={{ marginLeft: '80vw', marginBottom: '10px' }}
                  onClick={() => updateData()}
                >
                  Sign Off
                </ButtonComponent>
              </Col>
            </Row>
          </Card>
          <footer
            className={`${Styles.footer} d-flex justify-content-between align-items-center `}
          >
            <div className={Styles.footerRights} style={{ marginLeft: '65vw' }}>
              © {getCurrentYear()} SMART SUSTAIN.AI. All Rights Reserved.
            </div>
          </footer>
        </div>
      )}
    </Spin>
  );
}
