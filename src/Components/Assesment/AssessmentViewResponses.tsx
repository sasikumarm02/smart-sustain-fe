import { useEffect, useRef, useState } from 'react';
import { PageCardComponent, TableComponent } from '../../DesignLibrary';
import Styles from './Assessement.module.scss';
import { Row, Button, Tabs, message, Popover } from 'antd';
import EditIcon from '../../assets/Svg/EditIcon';
import Responseicon from '../../assets/Svg/Assessment/responseicon';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';
import { useLocation, useNavigate } from 'react-router-dom';
import NoDataImage from '../../assets/Svg/NoData';
import nodata from '../../assets/Svg/Assessment/nodata.png';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../Redux/Actions';
import { render } from '@testing-library/react';

const { TabPane } = Tabs;

function AssessmentViewResponses() {
  const location = useLocation();

  const { active_tab, currentPageNum } = location.state || {};
  const [activeTab, setActiveTab] = useState(active_tab || 'Environment');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [data, setData] = useState([]);

  const handleGetApi = () => {
    setLoading(true);
    setData([]);
    const path = 'maturityAssessment/get_all_choosed_options/';
    get(`${path}?entity_Id=${user?.entity_Id}&pillar=${activeTab}`)
      .then((res) => {
        if (!isEmpty(res?.response?.data)) {
          setData(res?.response?.data);
        } else {
        }
      })
      .catch((err) => {
        if (!isEmpty(err?.response?.data.message)) {
          message.error(err?.response?.data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleGetApi();
  }, [activeTab]);

  const handleEditClick = (questionItem: any) => {
    navigate('/assessment-edit-responses', {
      state: {
        pillar: activeTab,
        questionId: questionItem.question_id,
        question: questionItem.question,
        answer: questionItem.answer,
        score: questionItem.score,
        options: questionItem.options,
        currentPage: currentPage,
      },
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Question Code',
      dataIndex: 'question_id',
      key: 'question_id',
    },
    {
      title: 'Questions',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Response',
      dataIndex: 'answer',
      key: 'answer',
      render: (text: any, questionItem: any) => (
        <Popover content={<span>{text}</span>} title="Response" trigger="hover">
          <Button icon={<Responseicon />} type="link" />
        </Popover>
      ),
    },
    {
      title: 'Level of Maturity',
      dataIndex: 'score',
      key: 'score',
      render: (text: any, questionItem: any) => (
        <span style={{ color: '#1E49E2', fontWeight: 'bold' }}>{text}</span>
      ),
    },
    {
      title: 'Action',
      key: 'edit',
      render: (text: any, questionItem: any) => (
        // <img
        //   src={EditIcon}
        //   className={Styles.editIcon3}

        // ></img>
        <EditIcon onClick={() => handleEditClick(questionItem)} />
      ),
    },
  ];

  const [isTabChanged, setIsTabChanged] = useState(false);

  // Handle tab change
  const handleTabChange = (key: string) => {
    setIsTabChanged(true);
    setActiveTab(key);
  };

  const currentPage = useSelector((state: any) => state.currentPage);

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    dispatch(setCurrentPage(pagination.current));
  };

  useEffect(() => {
    if (isTabChanged) {
      dispatch(setCurrentPage(1));
    } else {
      if (currentPageNum) {
        dispatch(setCurrentPage(currentPageNum));
      }
    }
  }, [isTabChanged, currentPageNum]);

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle} loading={loading}>
        <Tabs
          defaultActiveKey={activeTab}
          className={Styles.tabMargin}
          onChange={handleTabChange}
        >
          <TabPane tab="Environment" key="Environment">
            {!isEmpty(data) ? (
              <TableComponent
                onchange={handleTableChange}
                currentPage={currentPage}
                data={data}
                columnHeader={columns}
                enableRowSelection={false}
              />
            ) : (
              <div className={Styles.centerContent}>
                <img src={nodata}></img>
                <p>Please complete the assessment first </p>
              </div>
            )}
          </TabPane>
          <TabPane tab="Social" key="Social">
            {/* Render Social questions */}
            {!isEmpty(data) ? (
              <TableComponent
                data={data}
                columnHeader={columns}
                enableRowSelection={false}
                onchange={handleTableChange}
                currentPage={currentPage}
              />
            ) : (
              <div className={Styles.centerContent}>
                <img src={nodata}></img>
                <p>Please complete the assessment first </p>
              </div>
            )}
          </TabPane>
          <TabPane tab="Governance" key="Governance">
            {/* Render Governance questions */}
            {!isEmpty(data) ? (
              <TableComponent
                data={data}
                columnHeader={columns}
                enableRowSelection={false}
                onchange={handleTableChange}
                currentPage={currentPage}
              />
            ) : (
              <div className={Styles.centerContent}>
                <img src={nodata}></img>
                <p>Please complete the assessment first </p>
              </div>
            )}
          </TabPane>
        </Tabs>
      </PageCardComponent>
    </>
  );
}

export default AssessmentViewResponses;
