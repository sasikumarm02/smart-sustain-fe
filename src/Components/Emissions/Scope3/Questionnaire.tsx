import React, { useState } from 'react';
import { Card, Radio, Button, Row, Col } from 'antd';
import img from '../../../assets/image/ques_scop3-cat1.png';
import { ButtonComponent } from '../../../DesignLibrary';

const questions = [
  {
    id: 1,
    question:
      'Q. Based on screening, does the purchased good or service contribute significantly to scope 3 emissions or is supplier engagement otherwise relevant to the business goals?',
    options: ['Yes', 'No'],
  },
  {
    id: 2,
    question:
      'Q. Are data available on the physical quantity of the purchased good or service?',
    options: ['Yes', 'No'],
  },
  {
    id: 3,
    question:
      'Q. Can the tier 1 supplier provide product-level cradle-to-gate GHG data (of sufficient quality* to meet the business goals) for the purchased good or service?',
    options: ['Yes', 'No'],
  },
  {
    id: 4,
    question:
      'Q. Can the supplier provide allocated scope 1 and 2 data (of sufficient quality* to meet the business goals) relating to the purchased good or service?',
    options: ['Yes', 'No'],
  },
];

const QuestionSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleSaveAndNext = () => {
    console.log('Saved question:', currentQuestion + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(1);

      console.log('Survey completed!');
    }
  };

  const handleSkip = () => {
    console.log('Skipped question:', currentQuestion + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(1);

      console.log('Survey completed!');
    }
  };

  return (
    <Card
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <p style={{ fontWeight: '500', fontSize: '17px' }}>
          {questions[currentQuestion].question}
        </p>
        <Radio.Group style={{ width: '100%', fontWeight: '500' }}>
          {questions[currentQuestion].options.map((option, index) => (
            <Radio
              key={index}
              style={{ display: 'block', marginBottom: '10px' }}
              value={option}
            >
              {option}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <div>
        <Row justify="end" className="mt-2">
          <Col style={{ display: 'flex', gap: '1vw' }}>
            <ButtonComponent
              onClick={handleSkip}
              size="md"
              hierarchy="secondary"
            >
              Skip
            </ButtonComponent>
            <ButtonComponent size="md">Save & Next</ButtonComponent>
          </Col>
        </Row>
      </div>
      <div style={{ textAlign: 'left', paddingTop: '20px' }}>
        <img
          src={img}
          alt="Decorative"
          style={{
            width: '40%', // Adjust the size as needed
            height: '55%', // Adjust the size as needed
          }}
        />
      </div>
    </Card>
  );
};

export default QuestionSection;
