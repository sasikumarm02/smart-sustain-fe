import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Styles from './AssessmentSub.module.scss';
import { Card, Col, Select, Image, Row, message } from 'antd';
import { subtopic2 } from '../../assets/Svg/MaturityAssessment/index';
import { goldenleaf } from '../../assets/Svg/MaturityAssessment/index';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import { PageCardComponent } from '../../DesignLibrary';

function getValuesByKey(key: any, data: any) {
  if (!isEmpty(data) && data.hasOwnProperty(key)) {
    return data[key];
  } else {
    return [];
  }
}

const { Option } = Select;

type Description = Record<string, string>;

type Levels = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

type Data = Record<Levels, { description: Description }>;

const AssessmentSub: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const { title = '', level = '' } = location?.state || {}; // Destructure title from the location state

  const [current_level, setCurrent_Level] = useState('');
  const [data, setData] = useState<Data | null>(null);
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [response, setResponse] = useState(null);

  const maturityMap: Record<string, string> = {
    'L0 Absent': 'L0',
    'L1 Aware': 'L1',
    'L2 Advance': 'L2',
    'L3 Adept': 'L3',
    'L4 Adaptive': 'L4',
  };

  const maturityMap2: any = {
    L0: 'L0-Absent',
    L1: 'L1-Aware',
    L2: 'L2-Advance',
    L3: 'L3-Adept',
    L4: 'L4-Adaptive',
  };

  const selectedLevelKey = selectedLevel.split(' ')[0] as Levels;

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  const handleSubtopicChange = (value: string) => {
    setSelectedSubtopic(value);
  };

  const handleTopicwiseRecommendationGetApi = async () => {
    const path = 'maturityAssessment/overall_recommendation/';
    try {
      const res = await get(
        `${path}?entity_Id=${user.entity_Id}&topic=${title}&maturity_rating=${maturityMap[level]}`
      );
      if (!isEmpty(res?.response?.data)) {
        const apiData = res?.response?.data;
        setData(apiData);
        setResponse(res?.response);
        const currentLevel =
          maturityMap2[getValuesByKey('Maturity Rating', res?.response)];
        setCurrent_Level(currentLevel);
        const firstLevelKey = Object.keys(apiData)[0] as Levels;
        setSubtopics(Object.keys(apiData[firstLevelKey]?.description));
        if (current_level !== 'L4-Adaptive') {
          setSelectedSubtopic(
            Object.keys(apiData[firstLevelKey]?.description)[0]
          );
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleTopicwiseRecommendationGetApi();
  }, []);

  useEffect(() => {
    const levelOptions = generateLevelOptions();
    if (!isEmpty(levelOptions) && levelOptions.length > 0) {
      setSelectedLevel(levelOptions[0]);
    }
  }, [current_level]);

  const generateLevelOptions = () => {
    const levelOptions: string[] = [];
    if (current_level === 'L0-Absent') {
      levelOptions.push(
        'L1 - Aware',
        'L2 - Advance',
        'L3 - Adept',
        'L4 - Adaptive'
      );
    } else if (current_level === 'L1-Aware') {
      levelOptions.push('L2 - Advance', 'L3 - Adept', 'L4 - Adaptive');
    } else if (current_level === 'L2-Advance') {
      levelOptions.push('L3 - Adept', 'L4 - Adaptive');
    } else if (current_level === 'L3-Adept') {
      levelOptions.push('L4 - Adaptive');
    }
    return levelOptions;
  };

  const levelOptions = generateLevelOptions();

  const containerStyle: any = {
    position: 'relative',
    // backgroundImage: `url(${greenframe})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    width: '102%',
    left: '-5px',
  };

  function replaceUnderscoresWithSpaces(text: any) {
    return text.replace(/_/g, ' ');
  }

  return (
    <>
      {/* <h4 className={Styles.title}>Assessment Recommendations</h4> */}
      <PageCardComponent style={{ padding: '0px' }}>
        <div className={Styles.wrapper}>
          <p className={Styles.titles}>Sub Topics</p>
          {current_level === '' && (
            <Image src={goldenleaf} className={Styles.golden} preview={false} />
          )}
          <p className={Styles.subhead}>Your Current Level</p>
          <h1 className={Styles.currentLevel}>{current_level}</h1>
          <p className={Styles.tagline}>“Discover Your ESG Footprint”</p>

          <p className={Styles.subhead}>Topic</p>
          <h3 className={Styles.head}>{title}</h3>

          <p className={Styles.subhead}>Target Level</p>

          <Select
            value={current_level === '' ? 'L4 - Adaptive' : selectedLevel}
            onChange={handleLevelChange}
            className={`${Styles.dropdown} matSub`}
            disabled={levelOptions.length === 0}
          >
            {!isEmpty(levelOptions) &&
              levelOptions.map((level) => (
                <Option key={level} value={level}>
                  <div className={Styles.levelcombine}>
                    <span className={Styles.leveldisplay}>{level}</span>
                    <span className={Styles.taglineSmall}>
                      Building a Strong ESG Foundation
                    </span>
                  </div>
                </Option>
              ))}
          </Select>

          <p className={Styles.subhead}>Sub Topics</p>
          <div className={Styles.subtopicsContainer}>
            {!isEmpty(subtopics) &&
              subtopics.map((topic) => (
                <span
                  key={topic}
                  className={`${Styles.subtopic} ${selectedSubtopic === topic ? Styles.selectedSubtopic : ''}`}
                  onClick={() =>
                    current_level !== 'L4-Adaptive' &&
                    handleSubtopicChange(topic)
                  }
                >
                  {replaceUnderscoresWithSpaces(topic)}
                </span>
              ))}
          </div>

          <p className={Styles.subhead}>Directions</p>
          <p className={Styles.description}>
            {data &&
              selectedLevelKey &&
              data[selectedLevelKey]?.description[selectedSubtopic]}
          </p>
        </div>
      </PageCardComponent>
    </>
  );
};

export default AssessmentSub;
