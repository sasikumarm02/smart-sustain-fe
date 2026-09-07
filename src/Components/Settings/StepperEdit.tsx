import React, { useState } from 'react';
import { Steps, Button, Row, Col, Space } from 'antd';
import EsgConfigEdit from './EsgConfigEdit';
import { CheckOutlined } from '@ant-design/icons';
import Styles from './Setting.module.scss';
import { PageCardComponent } from '../../DesignLibrary';
import { useLocation } from 'react-router-dom';
const { Step } = Steps;

const StepperEdit = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const location = useLocation();
  const fullRecordData = location.state;

  const steps = [
    {
      key: 1,
      content: (
        <div
          className={
            currentStep >= 0 ? Styles.stepWrapper : Styles.stepWrapperInactive
          }
        >
          <div className="stepIconActive stepAvatar">
            {currentStep === 0 ? (
              <div className={Styles.numberDiv}>1</div>
            ) : (
              <CheckOutlined className="c-fff" />
            )}
          </div>
          <div className={Styles.stepTitleActive}>ESG Framework Selection</div>
        </div>
      ),
    },
    {
      key: 2,
      content: (
        <div
          className={
            currentStep >= 1 ? Styles.stepWrapper : Styles.stepWrapperInactive
          }
        >
          <div className={currentStep >= 1 ? 'stepIconActive' : 'stepIcon'}>
            {currentStep > 1 ? (
              <CheckOutlined className="c-fff" />
            ) : currentStep === 1 ? (
              <div className={Styles.numberDiv}>2</div>
            ) : (
              <div className={Styles.numberDiv2}>2</div>
            )}
          </div>
          <div
            className={
              Styles[currentStep >= 1 ? 'stepTitleActive' : 'stepTitle']
            }
          >
            Emission Factor Database
          </div>
        </div>
      ),
    },
    {
      key: 3,
      content: (
        <div
          className={
            currentStep >= 2 ? Styles.stepWrapper : Styles.stepWrapperInactive
          }
        >
          <div className={currentStep >= 2 ? 'stepIconActive' : 'stepIcon'}>
            {currentStep > 2 ? (
              <CheckOutlined className="c-fff" />
            ) : currentStep === 2 ? (
              <div className={Styles.numberDiv}>3</div>
            ) : (
              <div className={Styles.numberDiv2}>3</div>
            )}
          </div>
          <div
            className={
              Styles[currentStep >= 2 ? 'stepTitleActive' : 'stepTitle']
            }
          >
            Preview & Save
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageCardComponent>
      <Row>
        <Col lg={24} md={24} sm={24} xs={24}>
          <div className={Styles.stepsContainer}>
            {steps.map((item, index) => (
              <div key={item.key} className={Styles.stepItem}>
                {item.content}
                {index < steps.length - 1 && (
                  <div
                    className={
                      index < currentStep
                        ? Styles.connectorActive
                        : Styles.connector
                    }
                  ></div>
                )}
              </div>
            ))}
          </div>
          <EsgConfigEdit
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            fullRecordData={fullRecordData}
          />
        </Col>
      </Row>
    </PageCardComponent>
  );
};

export default StepperEdit;
