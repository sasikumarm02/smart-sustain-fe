import React, { useState, useEffect } from 'react';
import { Col, Input, message, Row } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { useLocation, useNavigate } from 'react-router-dom';
import { put } from '../../Services';
import styles from './Assessement.module.scss';
import { isEmpty } from '../../Utils/isEmpty';

function AssessmentLevelScoreEdit() {
  const location = useLocation();

  const scores = !isEmpty(location?.state?.scores)
    ? location?.state?.scores
    : '';
  const navigate = useNavigate();

  const initialDataSource2 = [
    {
      key: '1',
      level: 'L0 - Absent',
      value: '',
    },
    {
      key: '2',
      level: 'L1 - Aware',
      value: '',
    },
    {
      key: '3',
      level: 'L2 - Advance',
      value: '',
    },
    {
      key: '4',
      level: 'L3 - Adept',
      value: '',
    },
    {
      key: '5',
      level: 'L4 - Adaptive',
      value: '',
    },
  ];

  const initialDataSource = [
    {
      key: '1',
      level: 'L0 - Absent',
      value: isEmpty(scores) ? '' : String(scores[0]?.value),
    },
    {
      key: '2',
      level: 'L1 - Aware',
      value: isEmpty(scores) ? '' : String(scores[1]?.value),
    },
    {
      key: '3',
      level: 'L2 - Advance',
      value: isEmpty(scores) ? '' : String(scores[2]?.value),
    },
    {
      key: '4',
      level: 'L3 - Adept',
      value: isEmpty(scores) ? '' : String(scores[3]?.value),
    },
    {
      key: '5',
      level: 'L4 - Adaptive',
      value: isEmpty(scores) ? '' : String(scores[4]?.value),
    },
  ];

  const tableColumns = [
    {
      title: 'Levels',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Scores',
      dataIndex: 'value',
      key: 'value',
      render: (value: any, record: any, index: any) => (
        <Input
          type="number"
          value={value}
          className={styles.fontFamily}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => {
            if (
              e.key === '-' ||
              e.key === '.' ||
              e.key === 'e' ||
              e.key === 'E'
            ) {
              e.preventDefault();
            }
          }}
        />
      ),
    },
  ];

  const [dataSource, setDataSource] = useState(initialDataSource);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleInputChange = (e: any, index: any) => {
    const updatedData = [...dataSource];
    updatedData[index].value = e.target.value;
    setDataSource(updatedData);
  };

  const validateValues = () => {
    const l0 = parseFloat(dataSource[0].value);
    const l1 = parseFloat(dataSource[1].value);
    const l2 = parseFloat(dataSource[2].value);
    const l3 = parseFloat(dataSource[3].value);
    const l4 = parseFloat(dataSource[4].value);

    if (l0 >= l1 || l1 >= l2 || l2 >= l3 || l3 >= l4) {
      message.error('The values must satisfy L0 < L1 < L2 < L3 < L4.');
      return false;
    }

    const diff1 = l1 - l0;
    const diff2 = l2 - l1;
    const diff3 = l3 - l2;
    const diff4 = l4 - l3;

    if (diff1 !== diff2 || diff2 !== diff3 || diff3 !== diff4) {
      message.error(
        'The differences between consecutive levels must be equal.'
      );
      return false;
    }

    return true;
  };

  const checkFormCompleteness = () => {
    const allFilled = dataSource.every((item) => item.value.trim() !== '');
    setIsButtonDisabled(allFilled);
  };

  useEffect(() => {
    checkFormCompleteness();
  }, [dataSource]);

  const handleSave = async () => {
    if (!validateValues()) {
      return;
    }

    let payload = {
      Score: {
        L0: dataSource[0]?.value,
        L1: dataSource[1]?.value,
        L2: dataSource[2]?.value,
        L3: dataSource[3]?.value,
        L4: dataSource[4]?.value,
      },
    };

    try {
      const resData = await put(
        `/maturityAssessment/update_maturity_score/`,
        payload
      );
      if (!isEmpty(resData)) {
        message.success(resData?.message);
      }
      navigate(`/maturity-levelscore`);
    } catch (error) {
      if (!isEmpty(error)) {
        console.error('Error updating form:', error);
      }
    }
  };

  const handleReset = () => {
    if (!isEmpty(initialDataSource2)) {
      setDataSource(initialDataSource2);
    }
  };

  return (
    <>
      <PageCardComponent customClass={styles.pageCardStyle}>
        {/* <Row>
          <p className="pageTitle mt-2">Maturity Assessment Level Score Edit</p>
        </Row> */}
        <Row>
          <Col span={12}>
            <TableComponent
              isRowExpand={false}
              data={dataSource}
              enableRowSelection={false}
              columnHeader={tableColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
            />
          </Col>
        </Row>
        <Row justify="end" className="mt-3">
          <ButtonComponent
            className="mx-3"
            hierarchy="tertiary"
            size="xl"
            onClick={handleReset}
          >
            Reset
          </ButtonComponent>
          <ButtonComponent
            hierarchy="primary"
            onClick={handleSave}
            disabled={!isButtonDisabled}
          >
            Save & Update
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default AssessmentLevelScoreEdit;
