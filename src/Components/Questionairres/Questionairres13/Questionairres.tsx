import { Button, Col, Radio, Row, Space, Image } from 'antd';
import React, { useState } from 'react';
import Styles from './Questionairres.module.scss';
import QuestionairresImg from '../../../assets/questionerries13.png';
import { ButtonComponent } from '../../../DesignLibrary';
interface Props {}

type AnswerOption = 'yes' | 'no';

interface Question {
  id: any;
  text: string;
  options: { label: string; value: AnswerOption }[];
  next: Record<AnswerOption, any>;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Does the leased asset contribute significantly to scope 3 emissions (based on screening) or are emissions from leased assets otherwise relevant to the business goals?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 2, no: 3 },
  },
  {
    id: 2,
    text: ' Is asset-specific (e.g., site-specific) fuel and energy data or scope 1 and scope 2 emissions data available?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'result-supplier', no: 3 },
  },
  {
    id: 3,
    text: 'Can the lessee provide scope 1 and scope 2 emissions data, allocated to the relevant leased asset?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'result-waste-type', no: 'result-average' },
  },
];

const results: any = {
  'result-supplier': [
    'Asset-Specific Method',
    'The method involves collecting specific data from individual leased assets, such as fuel consumption and energy use (electricity, steam, heating, cooling), and calculating Scope 1 (direct emissions) and Scope 2 (indirect emissions) for each asset. Emission factors are applied based on site-specific or regional data for fuel and energy sources, making this method highly accurate when precise data is available. ',
  ],
  'result-waste-type': [
    'Lessee-Specific Method',
    'This method collects Scope 1 and Scope 2 emissions data from the lessee. These emissions are then allocated to the relevant leased assets, either in part or whole, based on the size of the space or other factors. This approach works well when the lessee has detailed emissions data, but sub-metering for leased assets is not available. ',
  ],
  'result-average': [
    'Average Data Method',
    'This approach estimates emissions based on average statistics for leased assets. For buildings, this could include emissions per square meter of floor space, or by asset type. The method is less accurate than the asset- or lessee-specific methods, but is useful when detailed data is unavailable. Emission factors are typically sourced from general databases or industry benchmarks. ',
  ],
};

function Questionairres13(props: Props) {
  const {} = props;
  const [currentStep, setCurrentStep] = useState<string>(questions[0].id);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [history, setHistory] = useState<string[]>([]);
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value as AnswerOption });
  };

  const handleNext = () => {
    const currentQuestion = questions.find((q) => q.id === currentStep);
    if (!currentQuestion) return;

    const nextStep = currentQuestion.next[answers[currentStep] as AnswerOption];

    if (nextStep) {
      setHistory((prevHistory) => [...prevHistory, currentStep]); // Add the current step to history before moving to the next
      setCurrentStep(nextStep); // Move to the next step
    }
  };

  const handlePrev = () => {
    if (history.length === 0) return;

    const previousStep = history[history.length - 1]; // Get the last step from history
    setHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove the last step from history
    setCurrentStep(previousStep); // Set the current step to the last step in history
  };

  const getQuestionComponent = () => {
    const currentQuestion = questions.find((q) => q.id === currentStep);
    if (!currentQuestion) return null;

    return (
      <>
        <div className={Styles.QuestionairresText}>
          {' '}
          Q. {currentQuestion.text}
        </div>
        <Radio.Group
          onChange={onChange}
          value={answers[currentStep]}
          name={currentStep}
        >
          <Space direction="vertical">
            {currentQuestion.options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </>
    );
  };

  const renderFinalResult = () => {
    const finalResult = results[currentStep];
    if (!finalResult) return null;

    return (
      <div>
        <Row gutter={24}>
          <Col span={9}>
            <Image src={QuestionairresImg} alt="" preview={false} />
          </Col>
          <Col span={14}>
            <div className={Styles.FinalPageHeading}>{finalResult[0]}</div>
            <div className={Styles.subText}>
              Based on your inputs, the recommended method is: {finalResult[0]}
            </div>
            <div className={`${Styles.subText} pt-1`}>{finalResult[1]}</div>
          </Col>
        </Row>
      </div>
    );
  };
  const isNextDisabled = !answers[currentStep];
  return (
    <>
      <Row className={Styles.QuestionairresBack}>
        <Col span={24}>
          {results[currentStep] ? renderFinalResult() : getQuestionComponent()}
        </Col>
        {!results[currentStep] && (
          <Col span={24}>
            <div className={Styles.buttonRow}>
              <ButtonComponent
                hierarchy="secondary"
                size="xl"
                onClick={handlePrev}
                disabled={history.length === 0}
              >
                Back
              </ButtonComponent>
              <ButtonComponent
                hierarchy="primary"
                size="xl"
                onClick={handleNext}
                disabled={isNextDisabled}
              >
                Next
              </ButtonComponent>
            </div>
          </Col>
        )}
      </Row>
    </>
  );
}

export default Questionairres13;
