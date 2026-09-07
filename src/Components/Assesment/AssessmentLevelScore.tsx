import React, { useEffect, useRef, useState } from 'react';
import { Col, message, Row } from 'antd';
import { PageCardComponent, TableComponent } from '../../DesignLibrary';
import LevelScore from '../../assets/Svg/Assessment/levelscore.png';
import { useNavigate } from 'react-router-dom';
import { get } from '../../Services';
import Styles from './Assessement.module.scss';
import { isEmpty } from '../../Utils/isEmpty';
import EditIcon from '../../assets/Svg/EditIcon';

const levelMapping = {
  L0: 'L0 - Absent',
  L1: 'L1 - Aware',
  L2: 'L2 - Advance',
  L3: 'L3 - Adept',
  L4: 'L4 - Adaptive',
};

function AssessmentLevelScore() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<any[]>([]);
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);
  const tableRef = useRef<HTMLDivElement>(null);

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
    },
  ];

  const handleScoresGetApi = () => {
    const path = '/maturityAssessment/get_maturity_scores/';
    get(`${path}`)
      .then((res) => {
        if (!isEmpty(res?.response?.data)) {
          const data = res?.response?.data;
          const transformedData = Object.keys(data).map((key) => ({
            level: (levelMapping as any)[key] || key,
            value: data[key],
          }));
          !isEmpty(transformedData) && setScores(transformedData);
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message || 'Error fetching scores');
        }
      });
  };

  useEffect(() => {
    handleScoresGetApi();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (tableRef.current) {
        setTableHeight(tableRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [scores]);

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row className="pageTitle d-flex align-items-center">
          Edit
          <EditIcon
            onClick={() =>
              navigate('/maturity-levelscore-edit', {
                state: { scores: scores },
              })
            }
            className={Styles.editIcon2}
          />
        </Row>

        <Row
          className="mt-3"
          gutter={[16, 16]}
          style={{
            alignItems: 'stretch',
          }}
        >
          <Col span={12}>
            <div ref={tableRef}>
              <TableComponent
                isRowExpand={false}
                data={scores}
                enableRowSelection={false}
                columnHeader={tableColumns}
                showOnlyCount={false}
                columnCheckBoxDataAttribute="key"
              />
            </div>
          </Col>

          <Col span={12}>
            <div
              style={{
                height: tableHeight || '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={LevelScore}
                alt="Level Score"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>
          </Col>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default AssessmentLevelScore;
