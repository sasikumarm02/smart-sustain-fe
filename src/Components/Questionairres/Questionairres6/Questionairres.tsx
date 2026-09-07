import { Button, Col, Radio, Row, Space, Image } from 'antd';
import React, { useState } from 'react';
import Styles from './Questionairres.module.scss';
import QuestionairresImg from '../../../assets/questionerries6.png';
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
    text: 'Q. Does business travel contribute significantly to scope 3 emissions (based on screening) or is engagement with travel providers otherwise relevant to the business goals?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 2, no: 3 },
  },
  {
    id: 2,
    text: 'Q. Is data available on the types and quantities/cost of fuels consumed during travel?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'Use-the-fuel', no: 3 },
  },
  {
    id: 3,
    text: 'Q. Is data available on distance travelled?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'Use-the-distance', no: 4 },
  },
  {
    id: 4,
    text: 'Q. Is data available on the amount of money spent on travel providers?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'Use-the-spend', no: 'Use-the-spend' },
  },
];

const results: any = {
  'Use-the-fuel': [
    'Fuel-based Method',
    'This approach calculates the emissions based on the actual fuel consumed during business travel. It involves determining the quantity and type of fuel used by transport providers and then applying the appropriate emission factors (specific to the fuel type). This method provides accurate results if detailed data on fuel consumption is available. It captures Scope 1 (direct emissions from company-owned vehicles) and Scope 2 (indirect emissions from purchased energy for transport providers). ',
  ],
  'Use-the-distance': [
    'Distance-based Method',
    'This method calculates emissions by measuring the distance travelled during business trips and identifying the mode of transportation (e.g., car, train, airplane). Once the distance and mode are known, an appropriate emission factor is applied based on the transportation type. This method is useful when fuel consumption data is unavailable but trip distances are well-documented. ',
  ],
  'Use-the-spend': [
    'Spend-based Method',
    'The method estimates emissions based on the amount of money spent on business travel. By applying secondary emission factors from Environmental Extended Input-Output (EEIO) data, it links the financial expenditure on different travel modes to associated emissions. This method is used when detailed information on fuel consumption or distances is unavailable, making it a more generalized way to estimate emission ',
  ],
};

function Questionairres6(props: Props) {
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
        <div className={Styles.QuestionairresText}>{currentQuestion.text}</div>
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

export default Questionairres6;
