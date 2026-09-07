import { useEffect, useState } from 'react';
import Styles from './Assessement.module.scss';
import { PageCardComponent, TableComponent } from '../../../DesignLibrary';
import { Row, Col, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import EditIcon from '../../../assets/Svg/EditIcon';
import { get } from '../../../Services';
import { isEmpty } from '../../../Utils/isEmpty';

function ManageGriTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { Option } = Select;
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedGRIDisclosureTopic, setSelectedGRIDisclosureTopic] =
    useState<string>('');
  const [selectedGRICategory, setSelectedGRICategory] = useState<string>('');
  const [selectedSubCategoryCodeTopic, setSelectedSubCategoryCodeTopic] =
    useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [topics, setTopics] = useState<any>([]);
  const [subTopics, setSubTopics] = useState<any>([]);
  const [listQuestions, setListQuestions] = useState<any>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    if (selectedGRIDisclosureTopic && topics[selectedGRIDisclosureTopic]) {
      handleGRICategoryChange(topics[selectedGRIDisclosureTopic]);
    }
  }, [selectedGRIDisclosureTopic]);
  useEffect(() => {
    if (
      selectedSubCategoryCodeTopic &&
      subTopics[selectedSubCategoryCodeTopic]
    ) {
      handleSubCategoryChange(
        subTopics[selectedSubCategoryCodeTopic],
        selectedGRIDisclosureTopic,
        selectedGRICategory,
        selectedSubCategoryCodeTopic
      );
    }
  }, [selectedSubCategoryCodeTopic]);

  useEffect(() => {
    if (location.state) {
      const {
        mainCategory,
        griDisclosureTopic,
        griCategory,
        subCategoryCodeTopic,
        subCategory,
      } = location.state.updatedData || {};

      setSelectedMainCategory(mainCategory || '');
      setSelectedGRIDisclosureTopic(griDisclosureTopic || '');
      setSelectedGRICategory(griCategory || '');
      setSelectedSubCategoryCodeTopic(subCategoryCodeTopic || '');
      // setSelectedSubCategory(subCategory);

      handleSubCategoryChange(
        subCategory,
        griDisclosureTopic,
        griCategory,
        subCategoryCodeTopic
      );
    }
  }, [location.state]);
  const clearForm = () => {
    setSelectedGRIDisclosureTopic('');
    setSelectedGRICategory('');
    setSelectedSubCategoryCodeTopic('');
    setSelectedSubCategory('');
  };
  const handleMainCategoryChange = async (value: string) => {
    setSelectedMainCategory(value);
    clearForm();

    try {
      const response = await get(
        `/report/get_category_values/?entity_role=SUPER_ADMIN&category=${value}`
      );
      setTopics(response.response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleGRIDisclosureChange = (value: string) => {
    setSelectedGRIDisclosureTopic(value);
  };

  const handleGRICategoryChange = async (value: string) => {
    setSelectedGRICategory(value);
    try {
      const response = await get(
        `/report/get_sub_category_values/?entity_role=SUPER_ADMIN&cat_id=${selectedGRIDisclosureTopic}&category=${value}`
      );
      setSubTopics(response.response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleSubCategoryCodeChange = (value: string) => {
    setSelectedSubCategoryCodeTopic(value);
  };

  const handleSubCategoryChange = async (
    value: string,
    selectedGRIDisclosureTopic: any,
    selectedGRICategory: any,
    selectedSubCategoryCodeTopic: any
  ) => {
    setSelectedSubCategory(value);
    try {
      const response = await get(
        `/report/get_questionnaire/?entity_role=SUPER_ADMIN&cat_id=${selectedGRIDisclosureTopic}&category=${selectedGRICategory}&sub_cat_id=${selectedSubCategoryCodeTopic}&sub_category=${value}`
      );
      setListQuestions(response.response.data.questions);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleEditClick = (questionItem: any) => {
    navigate('/manage-gri-questions-edit', {
      state: {
        mainCategory: selectedMainCategory,
        griDisclosureTopic: selectedGRIDisclosureTopic,
        griCategory: selectedGRICategory,
        subCategoryCodeTopic: selectedSubCategoryCodeTopic,
        subCategory: selectedSubCategory,
        questionId: questionItem.question_id,
        question: questionItem.question,
        guidance: questionItem.guidance,
        referenceAnswer: questionItem.reference_answer,
      },
    });
  };

  const columns2 = [
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
      title: 'Action',
      key: 'action',
      render: (text: any, questionItem: any) => (
        <EditIcon
          className={Styles.editIcon3}
          onClick={() => handleEditClick(questionItem)}
        />
      ),
    },
  ];

  const expandedRowRender = (record: any) => {
    return (
      <div className={Styles.expandedRowContent}>
        <div className={Styles.guidanceContent}>
          <p className={Styles.Guidance}>Guidance:</p>
          <p>{record.guidance || 'No guidance available'}</p>
        </div>
        <div className={Styles.referenceAnswerContent}>
          <p className={Styles.Reference}>Reference Answer:</p>
          <p>{record.reference_answer || 'No reference answer available'}</p>
        </div>
      </div>
    );
  };

  const exampleData = listQuestions.map((value: any, index: any) => ({
    id: index,
    question_id: value.question_id,
    question: value.question,
    guidance: value.guidance,
    reference_answer: value.reference_answer,
    uniqueId: index,
  }));

  return (
    <PageCardComponent className={Styles.pageCardStyle}>
      <Row gutter={16}>
        <Col span={4}>
          <p className={Styles.quesHeading}>Main Category</p>
          <Select
            style={{ width: '100%', height: '50px' }}
            onChange={handleMainCategoryChange}
            value={selectedMainCategory}
          >
            <Option value="Environment">Environment</Option>
            <Option value="Social">Social</Option>
            <Option value="Governance">Governance</Option>
          </Select>
        </Col>

        {/* GRI Disclosure Select */}
        <Col span={4}>
          <p className={Styles.quesHeading}>GRI Disclosure</p>
          <Select
            style={{ width: '100%', height: '50px' }}
            onChange={handleGRIDisclosureChange}
            value={selectedGRIDisclosureTopic}
          >
            {!isEmpty(topics) &&
              Object.keys(topics).map((topic) => (
                <Option key={topic} value={topic}>
                  {topic}
                </Option>
              ))}
          </Select>
        </Col>

        {/* GRI Category Select */}
        <Col span={6}>
          <p className={Styles.quesHeading}>GRI Category</p>
          <Select
            style={{ width: '100%', height: '50px' }}
            onChange={handleGRICategoryChange}
            value={selectedGRICategory}
          >
            {selectedGRIDisclosureTopic && (
              <Option
                key={selectedGRIDisclosureTopic}
                value={topics[selectedGRIDisclosureTopic]}
              >
                {topics[selectedGRIDisclosureTopic]}
              </Option>
            )}
          </Select>
        </Col>

        {/* Sub Category Code Select */}
        <Col span={4}>
          <p className={Styles.quesHeading}>Sub - Category Code</p>
          <Select
            style={{ width: '100%', height: '50px' }}
            value={selectedSubCategoryCodeTopic}
            onChange={handleSubCategoryCodeChange}
          >
            {!isEmpty(subTopics) &&
              Object.keys(subTopics).map((topic: any) => (
                <Option key={topic} value={topic}>
                  {topic}
                </Option>
              ))}
          </Select>
        </Col>

        <Col span={6}>
          <p className={Styles.quesHeading}>Sub - Category</p>
          <Select
            style={{ width: '100%', height: '50px' }}
            value={selectedSubCategory || ''}
            onChange={(value) =>
              handleSubCategoryChange(
                value,
                selectedGRIDisclosureTopic,
                selectedGRICategory,
                selectedSubCategoryCodeTopic
              )
            }
          >
            {Array.isArray(subTopics[selectedSubCategoryCodeTopic]) ? (
              subTopics[selectedSubCategoryCodeTopic].map((subTopic: any) => (
                <Option key={subTopic} value={subTopic}>
                  {subTopic}
                </Option>
              ))
            ) : (
              <Option value={subTopics[selectedSubCategoryCodeTopic]}>
                {subTopics[selectedSubCategoryCodeTopic]}
              </Option>
            )}
          </Select>
        </Col>
      </Row>

      <Row className={`${Styles.table} tableLastHide`}>
        <TableComponent
          expandableRowRenderer={expandedRowRender}
          isRowExpand={true}
          data={exampleData}
          enableRowSelection={false}
          columnHeader={columns2}
          showOnlyCount={false}
          columnCheckBoxDataAttribute="question_id"
          showActionColumn={true}
        />
      </Row>
    </PageCardComponent>
  );
}

export default ManageGriTable;
