import { Button, Col, Radio, Row, Space, Image } from 'antd';
import React, { useState } from 'react';
import Styles from './Questionairres.module.scss';
import QuestionairresImg from '../../../assets/questionerries2.png';
import { ButtonComponent } from '../../../DesignLibrary';

interface Props {}

type AnswerOption = 'yes' | 'no';

interface Question {
  id: any; // Ensure id is string
  text: string;
  options: { label: string; value: AnswerOption }[];
  next: Record<AnswerOption, any>; // Ensure next values are strings
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Based on screening, does the purchased good or service contribute significantly to scope 3 emissions or is supplier engagement otherwise relevant to the business goals?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 2, no: 4 },
  },
  {
    id: 2,
    text: 'Are data available on the physical quantity of the purchased good or service?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 3, no: 5 },
  },
  {
    id: 3,
    text: 'Can the tier 1 supplier provide product-level cradle-to-gate GHG data of sufficient quality to meet the business goals for the purchased good or service?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'result-supplier', no: 6 },
  },
  {
    id: 4,
    text: 'Are data available on the physical quantity of the purchased good or service?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'result-average', no: 'Use-the-spend' },
  },
  {
    id: 5,
    text: 'Can the supplier provide allocated scope 1 and 2 data (of sufficient quality) to meet the business goals relating to the purchased good or service?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'Use-the-hybrid', no: 'Use-the-spend' },
  },
  {
    id: 6,
    text: 'Can the supplier provide allocated scope 1 and 2 data (of sufficient quality) to meet the business goals relating to the purchased good or service?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'Use-the-hybrid', no: 'result-average' },
  },
];

const results: any = {
  'result-supplier': [
    'Supplier-Specific Method ',
    'This method involves collecting detailed, product-level cradle-to-gate GHG inventory data directly from your capital goods suppliers. It provides the most accurate emissions estimates but requires significant supplier engagement and data collection efforts. ',
  ],
  'Use-the-hybrid': [
    'Hybrid Method ',
    'This method combines supplier-specific data (where available) with secondary data to fill gaps. It collects allocated Scope 1 and 2 emission data from suppliers and calculates upstream emissions based on supplier data on materials, fuel, electricity, and waste associated with production. Additionally, it uses secondary data when supplier-specific data is unavailable. ',
  ],
  'result-average': [
    'Average-Product Method ',
    'This method estimates emissions based on the mass or other relevant units of capital goods purchased. It uses industry-average emission factors to multiply by purchase quantities. This method offers a simpler approach but may provide less accurate estimates compared to the Supplier-Specific or Hybrid methods. ',
  ],
  'Use-the-spend': [
    'Spend-Based Method ',
    'This method estimates emissions based on the total economic value of capital goods purchased. It uses industry-average emission factors per unit of monetary value. This method is often used as a proxy for emissions when more detailed data is unavailable, but it may provide less accurate estimates compared to the other methods. ',
  ],
};

function Questionairres2(props: Props) {
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
                disabled={history.length === 0} // Disable 'Back' if there's no history
              >
                Back
              </ButtonComponent>
              <ButtonComponent
                hierarchy="primary"
                size="xl"
                onClick={handleNext}
                disabled={isNextDisabled} // Disable 'Next' if answer not selected
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

export default Questionairres2;
