import { Button, Card, Col, Input, message, Row, Spin, Upload } from 'antd';
import StylesB from './AssessmentStart.module.scss';
import { useNavigate } from 'react-router-dom';
import { setAssessmentType } from '../../../Redux/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleOutlined, ExclamationOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import GlobeImage from '../../../assets/ISSBStartimg.svg';
import { isEmpty } from '../../../Utils/isEmpty';
import ObjectiveIcon from '../../../assets/Svg/ISSBSvg/ObjectiveIcon';
import ApplicationGuiadianceIcon from '../../../assets/Svg/ISSBSvg/ApplicationGuiadianceIcon';
import ConceptualFoundationIcon from '../../../assets/Svg/ISSBSvg/ConceptualFoundationIcon';
import CoreContentIcon from '../../../assets/Svg/ISSBSvg/CoreContentIcon';
import EffectiveDateIcon from '../../../assets/Svg/ISSBSvg/EffectiveDateIcon';
import GeneralRequirementIcon from '../../../assets/Svg/ISSBSvg/GeneralRequirementIcon';
import JudgementsErrorsIcon from '../../../assets/Svg/ISSBSvg/JudgementsErrorsIcon';
import ScopeIcon from '../../../assets/Svg/ISSBSvg/ScopeIcon';
import TransitionIcon from '../../../assets/Svg/ISSBSvg/TransitionIcon';
import { apiBaseUrl, get, post, remove } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import PriorityHighSvg from '../../../assets/Svg/ISSBSvg/PriorityHighSvg';
import PriorityMediumSvg from '../../../assets/Svg/ISSBSvg/PriorityMediumSvg';
import PriorityLowSvg from '../../../assets/Svg/ISSBSvg/PriorityLowSvg';
import DownloadIssbSvg from '../../../assets/Svg/ISSBSvg/DownloadIssbSvg';
import PdfUploadISvg from '../../../assets/Svg/ISSBSvg/PdfUploadISvg';
import FileUploadSvg from '../../../assets/Svg/ISSBSvg/FileUploadSvg';
import IssbDeleteSvg from '../../../assets/Svg/ISSBSvg/IssbDeleteSvg';
import Delete from '../../../assets/Svg/Emissions/Delete';
import {
  getDotStyle,
  getStatusStyle,
  handleStatus,
  shouldHideButton,
  statusColorMapping,
} from '../../../Components/Emissions/Scope3/Helpers';
import { TableComponent } from '../../../DesignLibrary';
import EditIcon from '../../../assets/Svg/EditIcon';
import ViewIcon from '../../../assets/Svg/viewIcon';

const { Dragger } = Upload;
export default function CompleteISSB() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const assessmentType = useSelector((state: any) => state.assessmentType);
  const [clickedCards, setClickedCards] = useState<string[]>([]);

  const assesmentLevel = useSelector((state: any) => state.assessmentLevel);
  const [questionCount, setQuesCount] = useState<any>({});
  const [coreCountData, setCoreCountData] = useState({});
  const [error, setError] = useState<boolean>(false);
  const [companyLink, setCompanyLink] = useState<string>('');
  const [fileUiId, setFileUiId] = useState<any>([]);
  const [fileList, setFileList] = useState<any>([]);

  const [getUploaded, setGetUploaded] = useState<any>([]);

  const hanldeGetQuesCount = async () => {
    setLoading(true);
    try {
      const url = `/issb/get_topics_count/?entity_Id=${user?.entity_Id}`;
      const result: any = await get(url);
      if (!isEmpty(result?.response?.data)) {
        setQuesCount(result?.response?.data);
        setCoreCountData(result?.response?.core_count);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getUploadedData = () => {
    get(`/issb/get_issb_documents/?entity_Id=${user?.entity_Id}`)
      .then((res) => {
        if (res.response?.files) {
          setGetUploaded(
            res.response.files.map((file: any) => ({
              id: file.file_id,
              name: file.file_name,
              size: file.file_size,
            }))
          );
        }
        setCompanyLink(res.response.company_link || '');
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    hanldeGetQuesCount();
    getUploadedData();
  }, []);

  const props = {
    name: 'file',
    multiple: true,
    action: `${apiBaseUrl}/file/file_upload_view/`,
    headers: { Authorization: `Bearer ${user.token}` },
    beforeUpload: (file: any) => {
      const maxSize = 2.5 * 1024 * 1024;
      if (file.size > maxSize) {
        message.warning('File size must be less than 2.5MB.');
        return false;
      }
      return true;
    },
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileList((prev: any) => [...prev, info.file]);
        setFileUiId((prev: any) => [...prev, response.response.data]);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const [loading, setLoading] = useState(false);
  const cardData = [
    {
      icon: (
        <ObjectiveIcon
          className={`${clickedCards.includes('Objective') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Objective',
      heading: 'Objective',
      number: questionCount?.Objective?.total,
      status: questionCount?.Objective?.status,
    },
    {
      icon: (
        <ScopeIcon
          className={`${clickedCards.includes('Scope') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Scope',
      heading: 'Scope',
      number: questionCount?.Scope?.total,
      status: questionCount?.Scope?.status,
    },
    {
      icon: (
        <ConceptualFoundationIcon
          className={`${clickedCards.includes('Conceptual foundations') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Conceptual foundations',
      heading: 'Conceptual foundations',
      number: questionCount['Conceptual foundations']?.total,
      status: questionCount['Conceptual foundations']?.status,
    },
    {
      icon: (
        <CoreContentIcon
          className={`${clickedCards.includes('Core Content') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Core Content',
      heading: 'Core Content',
      number: questionCount['Core Content']?.total,
      status: questionCount['Core Content']?.status,
    },
    {
      icon: (
        <GeneralRequirementIcon
          className={`${clickedCards.includes('General Requirements') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'General Requirements',
      heading: 'General Requirements',
      number: questionCount['General Requirements']?.total,
      status: questionCount['General Requirements']?.status,
    },
    {
      icon: (
        <JudgementsErrorsIcon
          className={`${clickedCards.includes('Judgements, uncertainties and errors') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Judgements, uncertainties and errors',
      heading: 'Judgements, Uncertainties and Errors',
      number: questionCount['Judgements, uncertainties and errors']?.total,
      status: questionCount['Judgements, uncertainties and errors']?.status,
    },
    {
      icon: (
        <ApplicationGuiadianceIcon
          className={`${clickedCards.includes('Application Guidance') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Application Guidance',
      heading: 'Application Guidance',
      number: questionCount['Application Guidance']?.total,
      status: questionCount['Application Guidance']?.status,
    },
    {
      icon: (
        <EffectiveDateIcon
          className={`${clickedCards.includes('Effective date') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Effective date',
      heading: 'Effective date',
      number: questionCount['Effective date']?.total,
      status: questionCount['Effective date']?.status,
    },
    {
      icon: (
        <TransitionIcon
          className={`${clickedCards.includes('Transition') ? StylesB.cardIconFontActive : StylesB.cardIconFont}`}
        />
      ),
      alt: 'Transition',
      heading: 'Transition',
      number: questionCount['Transition']?.total,
      status: questionCount['Transition']?.status,
    },
  ];

  useEffect(() => {
    setClickedCards([]);
  }, []);

  const handleQuestionClick = (goals: any) => {
    dispatch(setAssessmentType(goals));
    const index = clickedCards.indexOf(goals);
    if (index === -1) {
      if (!isEmpty(goals)) {
        setClickedCards([goals]);
      }
    } else if (!isEmpty(clickedCards)) {
      setClickedCards(
        clickedCards && clickedCards.length > 0
          ? clickedCards.filter((card) => card !== goals)
          : []
      );
    }
  };

  const handleStartAssessment = async (card: any) => {
    if (isEmpty(companyLink) && fileUiId.length === 0) {
      setError(true);
      message.error(
        'Please enter your company web link or upload at least one file.'
      );
      return;
    }

    setError(false);

    const disclosureFiles = fileUiId.map((fileId: string) => fileId);

    const payload = {
      entity_Id: user.entity_Id,
      company_link: companyLink,
      disclosure: disclosureFiles,
    };

    try {
      const response = await post('/issb/upload_documents/', payload);

      if (response) {
        if (card.alt === 'Core Content') {
          navigate('/ISSB-Gap-assesment/core-content');
        } else if (card.alt === 'Application Guidance') {
          navigate('/ISSB-Gap-assesment/application-guidance');
        } else {
          const selectedValues = {
            strategy: [card.alt],
            fixedValue: [card.alt],
          };
          navigate('/ISSBQuestionsPage', { state: selectedValues });
        }
      } else {
        message.error('Failed to submit assessment data. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred while submitting the data.');
      console.error('Submission error:', error);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await get(
        `/issb/get_issb_documents/?entity_Id=${user.entity_Id}`
      );
      if (response.status === 'Success') {
        const file = response?.response?.files?.find(
          (f: any) => f.file_id === fileId
        );
        const link = document.createElement('a');
        link.href = file.file_link;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        message.success('File downloaded successfully.');
      } else {
        message.error('Failed to retrieve files.');
      }
    } catch (error) {
      message.error('File download failed.');
      console.error(error);
    }
  };
  const handleDelete = async (fileId: string) => {
    console.log(fileId, 'test');
    try {
      await remove(
        `${apiBaseUrl}/issb/issb_delete_files/?entity_Id=${user?.entity_Id}&file_Id=${fileId}`
      );

      console.log('Attempting to delete file with ID:', fileId);

      setGetUploaded((prevFiles: any[]) => {
        console.log('Previous uploaded files:', prevFiles);

        const updatedFiles = prevFiles.filter((file) => {
          console.log('Comparing:', file.id, '!==', fileId);
          return file.id !== fileId;
        });

        console.log('Updated file list after deletion:', updatedFiles);
        return updatedFiles;
      });

      message.success('File deleted successfully.');
    } catch (err) {
      message.error('File deletion failed.');
      console.error('Delete API Error:', err);
    }
  };

  const urlPattern =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

  const handleInputChange = (e: any) => {
    const link = e.target.value;
    setCompanyLink(link);

    // Check if the link matches the pattern
    if (!urlPattern.test(link)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const Columns = [
    {
      title: 'S.No',
      dataIndex: 'key',
      key: 'key',
      render: (text: any, record: any, index: any) => index + 1, // To show serial number starting from 1
    },
    {
      title: 'Title',
      dataIndex: 'heading',
      key: 'heading',
    },
    {
      title: 'No. of questions',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => (
        <div
          className={StylesB.statusBadge}
          style={getStatusStyle(status?.trim(), user.role)}
        >
          <span
            className={StylesB.dot}
            style={getDotStyle(status?.trim(), user.role)}
          >
            {' '}
          </span>
          {handleStatus(status?.trim())}
        </div>
      ),
    },
    {
      title:
        user.role === 'L1_DATA_REVIEWER' || user.role === 'L1_DATA_APPROVER'
          ? 'View Assessment'
          : 'Start Assessment',
      dataIndex: 'startView',
      key: 'startView',
      render: (_: any, record: any) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={() => handleStartAssessment(record)}
        >
          {user.role === 'L1_DATA_REVIEWER' ||
          user.role === 'L1_DATA_APPROVER' ? (
            <ViewIcon />
          ) : (
            <EditIcon />
          )}
        </div>
      ),
    },
  ];

  const dataSources = cardData
    .filter((card) => card.number > 0)
    .map((card, index) => ({
      key: index, // unique key for the row
      heading: card.heading,
      number: card.number,
      status: card.status,
      alt: card.alt, // if needed for onClick or other
      icon: card.icon, // if you want to show icon in table (optional)
    }));

  return (
    <div>
      <Row gutter={[35, 12]} className="mb-4 d-flex p-3 ">
        <div
          className={`bg-white p-0 ${StylesB.customBorderRadius15} ${StylesB.customBoxShadow}`}
        >
          <Row gutter={[48, 16]} className="p-3 m-0">
            <Col
              lg={{ span: 10, offset: 0 }}
              md={{ span: 24, offset: 0 }}
              sm={{ span: 24, offset: 0 }}
              xs={{ span: 24, offset: 0 }}
            >
              <div>
                <h6
                  className={`${StylesB.customfontsize21} ${StylesB.lineHeight28} fw-normal mb-3`}
                >
                  Welcome to the
                </h6>
                <h4
                  className={`${StylesB.fontSize36} ${StylesB.lineHeight40} ${StylesB.primeColor} fw-normal mb-4`}
                >
                  ISSB Gap Assessments
                </h4>
              </div>
              <div>
                <p
                  className={`${StylesB.customfontsize17} ${StylesB.lineHeight28} ${StylesB.customTextColorGrey} fw-normal`}
                >
                  ISSB Gap Assessments are based on foundational standards from
                  the International Sustainability Standards Board (ISSB) that
                  guide companies in reporting on sustainability and
                  climate-related impacts. ISSB 1 focuses on general
                  sustainability-related disclosure requirements, while ISSB 2
                  hones in on climate-related disclosures specifically. For
                  users completing an assessment, these standards are invaluable
                  as they provide a structured framework for understanding and
                  evaluating how organisations manage and report their
                  environmental and climate risks.
                </p>
              </div>

              <div
                className={`container mt-3 bg-white ${StylesB.customBorderRadius15} ${StylesB['file-upload-container']} ${StylesB.customBoxBorder} w-100`}
              >
                <div className={`p-4  rounded ${StylesB['upload-box']} `}>
                  <h5 className={`mb-3 ${StylesB.titleUpload}`}>
                    Your Company Web Link
                  </h5>
                  <Input
                    placeholder="Enter company website link"
                    style={{ height: '50px', background: '#FAF9FF' }}
                    value={companyLink}
                    onChange={handleInputChange}
                    onBlur={() => setError(!companyLink)} // Set error on blur if the field is empty
                  />
                  {error && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                      {companyLink
                        ? 'Please enter a valid company website link.'
                        : ''}
                    </div>
                  )}

                  <p
                    className={`${StylesB.SubTextUpload} muted-text mt-3 pt-2`}
                  >
                    Please upload the necessary documents (Sustainability Report
                    / Annual Report)
                  </p>

                  <div className="upload-disable-antd">
                    <Dragger
                      {...props}
                      className={`mb-4 ${StylesB.dragger}`}
                      name="uploaded_file"
                    >
                      <p className={`mt-3 ${StylesB['ant-upload-text']}`}>
                        Drop file or{' '}
                        <span style={{ color: '#036323' }}>Browse</span>.
                      </p>
                      <p className={StylesB['ant-upload-hint']}>
                        Format: pdf, docx, doc & Max file size: 2.5 MB
                      </p>
                    </Dragger>

                    <div className="sidebar-container">
                      <div className="sidebar-section">
                        <div className={StylesB['file-list']}>
                          {fileList.map((file: any, index: any) => (
                            <div
                              key={index}
                              className={`d-flex justify-content-between align-items-center mb-2 ${StylesB['file-item']}`}
                            >
                              <div className="d-flex align-items-center">
                                <div className="m-2">
                                  <PdfUploadISvg />
                                </div>
                                <div className="mt-3">
                                  <p
                                    className={StylesB.pdfUpoadedName}
                                    title={file.name}
                                  >
                                    {file.name.length > 20
                                      ? `${file.name.slice(0, 20)}...`
                                      : file.name}
                                  </p>
                                  <p className={StylesB.pdfUpoadedValue}>
                                    {file.size}
                                  </p>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div
                                  className={StylesB.cursorSty}
                                  onClick={() =>
                                    handleDownload(file.file_id, file.file_name)
                                  }
                                >
                                  <DownloadIssbSvg />
                                </div>
                                <div
                                  className={StylesB.cursorSty}
                                  onClick={() => handleDelete(file.id)}
                                >
                                  <IssbDeleteSvg />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="sidebar-section">
                        <div className={StylesB['file-list']}>
                          {getUploaded?.map((file: any, index: any) => {
                            console.log('File object:', file); // 👈 Add this line

                            return (
                              <div
                                key={index}
                                className={`d-flex justify-content-between align-items-center mb-2 ${StylesB['file-item']}`}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="m-2">
                                    <PdfUploadISvg />
                                  </div>
                                  <div className="mt-3">
                                    <p
                                      className={StylesB.pdfUpoadedName}
                                      title={file.name}
                                    >
                                      {file.name.length > 20
                                        ? `${file.name.slice(0, 20)}...`
                                        : file.name}
                                    </p>
                                    <p className={StylesB.pdfUpoadedValue}>
                                      {file.size}
                                    </p>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div
                                    className={StylesB.cursorSty}
                                    onClick={() =>
                                      handleDownload(file.id, file.name)
                                    }
                                  >
                                    <DownloadIssbSvg />
                                  </div>
                                  <div
                                    className={StylesB.cursorSty}
                                    onClick={() => handleDelete(file.id)}
                                  >
                                    <IssbDeleteSvg />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              lg={{ span: 14 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
              className="m-0 p-0 d-flex align-items-center justify-content-center"
              style={{ height: '100%' }}
            >
              <div style={{ width: '100%' }}>
                <p className={StylesB.proTitle} style={{ marginLeft: '10PX' }}>
                  Priority Level
                </p>

                <Row
                  justify="space-between"
                  className="mb-3"
                  style={{ marginLeft: '10PX' }}
                >
                  <Col span={3}>
                    <div className={StylesB.priorityitem}>
                      <span className={`${StylesB.icon} ${StylesB.high}`}>
                        <PriorityHighSvg />
                      </span>
                      <span className={StylesB.PrioritySubTitleHigh}>High</span>
                    </div>
                  </Col>
                  <Col span={3}>
                    <div className={StylesB.priorityitem}>
                      <span className={`${StylesB.icon} ${StylesB.medium}`}>
                        <PriorityMediumSvg />
                      </span>
                      <span className={StylesB.PrioritySubTitleMedium}>
                        Medium
                      </span>
                    </div>
                  </Col>
                  <Col span={3}>
                    <div className={StylesB.priorityitem}>
                      <span className={`${StylesB.icon} ${StylesB.low}`}>
                        <PriorityLowSvg />
                      </span>
                      <span className={StylesB.PrioritySubTitleLow}>Low</span>
                    </div>
                  </Col>
                </Row>

                <div style={{ width: '100%', padding: '0 10px' }}>
                  <img
                    src={GlobeImage}
                    alt="Globe"
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row
            className={`${StylesB.customMargin25} p-2 m-0  d-flex justify-content-between`}
            style={{ marginLeft: '50px' }}
          >
            <div
              className={`${StylesB.customTextDark} ${StylesB.customfontsize17} fw-medium mx-4`}
            >
              Please select a Topic for ISSB Gap Assessment
            </div>
          </Row>

          <Spin spinning={loading}>
            <Row className="m-3">
              <TableComponent
                isForm={true}
                isRowExpand={false}
                data={dataSources}
                enableRowSelection={false}
                columnHeader={Columns}
                showOnlyCount={false}
                columnCheckBoxDataAttribute="key"
              />
            </Row>
          </Spin>
        </div>
      </Row>
    </div>
  );
}
