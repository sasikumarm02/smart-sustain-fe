import { Button, Col, Radio, Row, Space, Image } from 'antd';
import React, { useState } from 'react';
import Styles from './Questionairres.module.scss';
import QuestionairresImg from '../../../assets/questionerries5.png';
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
    text: 'Does waste generated in operations contribute significantly to scope 3 emissions (based on screening) or is engagement with waste treatment providers otherwise relevant to the business goals?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 2, no: 3 },
  },
  {
    id: 2,
    text: 'Can the waste treatment company provide waste-specific scope 1 and scope 2 data?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'result-supplier', no: 3 },
  },
  {
    id: 3,
    text: 'Can the reporting company differentiate its waste streams?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    next: { yes: 'result-waste-type', no: 'result-average' },
  },
];

const results: any = {
  'result-supplier': [
    'Supplier-Specific Method',
    'This method involves collecting detailed, waste-specific data directly from waste treatment companies. It provides the most accurate emissions estimates but requires significant supplier engagement and data collection efforts. ',
  ],
  'result-waste-type': [
    'Waste-Type Specific Method ',
    'This method utilizes emission factors for specific waste types and their corresponding treatment methods. It collects data on waste types and quantities generated, as well as specific treatment methods applied to each waste type. This method offers a more granular approach to emissions estimation. ',
  ],
  'result-average': [
    'Average-Product Method',
    'This method estimates total waste generated and identifies the proportion of waste sent to different treatment methods (landfill, recycling, etc.). It uses average emission factors for each disposal method. This method is suitable for companies lacking detailed waste data, but it may provide less accurate estimates compared to the other methods. ',
  ],
};

function Questionairres5(props: Props) {
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

export default Questionairres5;
