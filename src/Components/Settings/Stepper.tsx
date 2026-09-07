import React, { useState } from 'react';
import { Steps, Button, Row, Col, Space } from 'antd';
import ESGConfiguration from './ESGConfiguration';
import { CheckOutlined } from '@ant-design/icons';
import Styles from './Setting.module.scss';
import { PageCardComponent } from '../../DesignLibrary';
const { Step } = Steps;

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);

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
    <PageCardComponent style={{ border: '1px solid #B6B3B2' }}>
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
          <ESGConfiguration
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </Col>
      </Row>
    </PageCardComponent>
  );
};

export default Stepper;
