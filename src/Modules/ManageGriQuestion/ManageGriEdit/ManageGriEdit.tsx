import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ButtonComponent, PageCardComponent } from '../../../DesignLibrary';
import Styles from './Peerbench.module.scss';
import { Row, Col, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { setPeerEditMode } from '../../../Redux/Actions';
import { apiBaseUrl, post } from '../../../Services';

function ManageGriEdit() {
  const navigate = useNavigate();
  const { Option } = Select;
  const dispatch = useDispatch();
  const editmode = useSelector((state: any) => state.editMode);

  const location = useLocation();

  // Retrieve state passed via navigate
  const {
    mainCategory,
    griDisclosureTopic,
    griCategory,
    subCategoryCodeTopic,
    subCategory,
    questionId,
    question,
    guidance,
    referenceAnswer,
  } = location.state || {};

  const [gri, setGri] = useState<string>(mainCategory || '');
  const [griDisclosure, setGriDisclosure] = useState<string>(
    griDisclosureTopic || ''
  );
  const [griCat, setGriCat] = useState<string>(griCategory || '');
  const [subCategoryCode, setSubCategoryCode] = useState<string>(
    subCategoryCodeTopic || ''
  );
  const [subCat, setSubCat] = useState<string>(subCategory || '');

  const [questionText, setQuestionText] = useState<string>(question || '');
  const [guidanceText, setGuidanceText] = useState<string>(guidance || '');
  const [referenceAnswerText, setReferenceAnswerText] = useState<string>(
    referenceAnswer || ''
  );

  const [griOptions, setGriOptions] = useState<string[]>([]); // For dropdown options
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);

  const isEditMode = !!location.state?.record;

  dispatch(setPeerEditMode(isEditMode));

  useEffect(() => {
    // Fetch data or handle other side effects here if needed
    if (location.state) {
      setGri(mainCategory);
      setGriDisclosure(griDisclosureTopic);
      setGriCat(griCategory);
      setSubCategoryCode(subCategoryCodeTopic);
      setSubCat(subCategory);
      setQuestionText(question);
      setGuidanceText(guidance);
      setReferenceAnswerText(referenceAnswer);
    }
  }, [location.state]);

  const handleSaveSubmit = async () => {
    console.log(
      subCat,
      subCategoryCode,
      griCat,
      griDisclosure,
      gri,
      'griDisclosure'
    );

    const updatedData = {
      entity_role: 'SUPER_ADMIN',
      sub_cat_id: subCategoryCode,
      cat_id: griDisclosure,
      question_id: questionId,
      question: questionText,
      guidance: guidanceText,
      reference_answer: referenceAnswerText,
    };
    console.log(updatedData, 'updatedData');
    try {
      const response = await post(
        `${apiBaseUrl}/report/edit_questionnaire/`,
        updatedData
      );
      message.success(response?.message);
      navigate('/manage-gri-questions-table', {
        state: {
          updatedData: {
            mainCategory: gri,
            griDisclosureTopic: griDisclosure,
            griCategory: griCat,
            subCategoryCodeTopic: subCategoryCode,
            subCategory: subCat,
          },
        },
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <PageCardComponent className={Styles.managePage}>
      <Row className="mt-3" gutter={16} justify="space-between">
        <Col span={4}>
          <p className={Styles.subheading}>Main Category</p>
          <Select
            showSearch
            value={gri}
            placeholder="Select GRI"
            onChange={(value) => setGri(value)}
            className={Styles.formSelect}
          >
            {griOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={4}>
          <p className={Styles.subheading}>GRI Disclosure</p>
          <Select
            showSearch
            value={griDisclosure}
            placeholder="Select GRI Disclosure"
            onChange={(value) => setGriDisclosure(value)}
            className={Styles.formSelect}
          >
            {griOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <p className={Styles.subheading}>GRI Category</p>
          <Select
            showSearch
            value={griCat}
            placeholder="Select GRI Category"
            onChange={(value) => setGriCat(value)}
            className={Styles.formSelect}
          >
            {griOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={4}>
          <p className={Styles.subheading}>Sub - Category Code</p>
          <Select
            showSearch
            value={subCategoryCode}
            placeholder="Select Sub Category Code"
            onChange={(value) => setSubCategoryCode(value)}
            className={Styles.formSelect}
          >
            {griOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <p className={Styles.subheading}>Sub - Category</p>
          <Select
            showSearch
            value={subCat}
            placeholder="Select Sub Category"
            onChange={(value) => setSubCat(value)}
            className={Styles.formSelect}
          >
            {griOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col span={4}>
          <p className={Styles.subheading}>Question ID</p>
          <p className={Styles.Questionback}>{questionId}</p>
        </Col>
        <Col span={20}>
          <p className={Styles.subheading}>Question</p>
          <TextArea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className={Styles.paddingInput}
            placeholder="Enter Question"
            rows={1}
          />
        </Col>
      </Row>

      <div className="mt-3">
        <p className={Styles.subheading}>Guidance</p>
        <TextArea
          value={guidanceText}
          onChange={(e) => setGuidanceText(e.target.value)}
          className={Styles.paddingInput}
          placeholder="Enter Guidance"
          rows={4}
        />
      </div>
      <div className="mt-3">
        <p className={Styles.subheading}>Reference Answer</p>
        <TextArea
          value={referenceAnswerText}
          onChange={(e) => setReferenceAnswerText(e.target.value)}
          className={Styles.paddingInput}
          placeholder="Enter Reference Answer"
          rows={4}
        />
      </div>
      <Row justify="end" className="mt-5">
        <ButtonComponent onClick={handleSaveSubmit} disabled={isSaveDisabled}>
          Save & Update
        </ButtonComponent>
      </Row>
    </PageCardComponent>
  );
}

export default ManageGriEdit;
