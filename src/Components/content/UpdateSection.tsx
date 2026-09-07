import { Button, Col, Image, message, Row, Upload } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { ButtonComponent } from '../../DesignLibrary';
import { apiBaseUrl } from '../../Services';
import { getFirstLetters } from '../Emissions/Scope3/Helpers';
import { useAuth } from '../../Hooks/useAuth';
import styles from './UpdateSection.module.scss';
import moment from 'moment';
import CloudIcon from '../../assets/Svg/Emissions/uploadColud';
import File from '../../assets/Svg/Emissions/fileImg';
import Cancel from '../../assets/Svg/Emissions/Cancel';
import { isEmpty } from '../../Utils/isEmpty';
import { useEffect } from 'react';
export default function UpdateSection({
  uploadedFileName,
  selectedRowEdit,
  handleEditUploadFile,
  comment,
  setComment,
  selectedDataIndex,
  record,
  tableData,
  index,
  setTableData,
  handleSaveClick,
  allowedStatuses,
  getNotApprovedIds,
  selectedRecord,
  handleRemove,
  fileNames,
  maxReviewerLevel,
  maxApproverLevel,
}: any) {
  const { user } = useAuth();

  const isDisabled = !(
    (record[selectedDataIndex]?.quantity ||
      record[selectedDataIndex]?.total_effluents_discharged ||
      record[selectedDataIndex]?.consumed_water ||
      record[selectedDataIndex]?.waste_in_tonnes) &&
    allowedStatuses.has(record.status) &&
    record.status !== 'For L1 Approval' &&
    record.status !== 'For L1 Re-approval' &&
    record.status !== 'For L2 Approval' &&
    getNotApprovedIds(record).includes(record[selectedDataIndex]?.id)
  );

  const enableComments = !(
    (record[selectedDataIndex]?.quantity ||
      record[selectedDataIndex]?.total_effluents_discharged ||
      record[selectedDataIndex]?.consumed_water ||
      record[selectedDataIndex]?.waste_in_tonnes) &&
    allowedStatuses.has(record.status) &&
    getNotApprovedIds(record).includes(record[selectedDataIndex]?.id)
  );

  return (
    <>
      <Row gutter={24} className="justify-content-start p-3">
        <Col span={8}>
          <p className={styles.heading}>Attachments</p>
          <div className={`${styles.updateBox} `}>
            <Row align="middle" gutter={24}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginLeft: '120px',
                }}
                className={styles.uploadHead}
              >
                <span>Drag file or&nbsp;</span>
                <Upload
                  disabled={isDisabled}
                  beforeUpload={(file) => {
                    const maxSize = 2.5 * 1024 * 1024;
                    if (file.size > maxSize) {
                      message.warning('File size must be less than 2.5MB.');
                      return false;
                    }
                    return true;
                  }}
                  showUploadList={false}
                  onChange={handleEditUploadFile}
                  name="uploaded_file"
                  action={`${apiBaseUrl}/file/file_upload_view/`}
                  headers={{
                    Authorization: `Bearer ${user.token}`,
                  }}
                >
                  <span
                    style={{
                      color: '#036323',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: '600',
                    }}
                  >
                    browse
                  </span>
                </Upload>
              </div>
              <span
                style={{
                  color: '#928E8D',
                  fontSize: '14px',
                  marginLeft: '70px',
                }}
              >
                Format: pdf, docx, doc & Max file size: 2.5 MB
              </span>
            </Row>

            <ul
              style={{
                listStyle: 'none',
                maxHeight: '100px',
                overflow: 'auto',
              }}
              className="p-0"
            >
              {selectedRecord?.disclosure?.map((item: any, index: any) => (
                <li className="my-2" key={index}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <span>
                        <File />
                      </span>

                      <span
                        onClick={() => {
                          const fileUrl =
                            selectedRecord?.disclosure_urls?.[index];
                          if (fileUrl) {
                            //window.location.href = fileUrl;
                            // Or, for direct download:
                            const a = document.createElement('a');
                            a.href = fileUrl;
                            a.download = item; // Optionally set the file name to save
                            a.click();
                          }
                        }}
                        className={styles.fileName}
                      >
                        {item}
                      </span>
                    </Col>
                    <Col>
                      <span
                        className={styles.cancel}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                          } else {
                            handleRemove(
                              selectedRecord,
                              item,
                              selectedRecord?.disclosure_uuids?.length
                                ? selectedRecord.disclosure_uuids[index]
                                : []
                            );
                          }
                        }}
                      >
                        <Cancel />
                      </span>
                    </Col>{' '}
                  </Row>
                </li>
              ))}
            </ul>
            {/* <div>
              {uploadedFileName !== '' ? (
                <span style={{ marginLeft: '5px', color: '#00338d' }}>
                  {uploadedFileName?.length > 6
                    ? uploadedFileName?.substring(0, 8) + '...'
                    : uploadedFileName}
                </span>
              ) : (
                <>
                  {record[selectedDataIndex] &&
                    record[selectedDataIndex]?.file_name &&
                    record[selectedDataIndex]?.file_name.substring(0, 12) +
                      '...'}
                </>
              )}
 
              {selectedRowEdit?.file_name !== null ||
              uploadedFileName !== '' ? (
                <DownloadOutlined
                  style={{ color: '#1643cb', marginLeft: '10px' }}
                  onClick={() => window.open(selectedRowEdit?.disclosure)}
                />
              ) : (
                'No attachments available'
              )}
            </div> */}

            {/* <div>
              <Upload
                maxCount={1}
                beforeUpload={(file) => {
                  const allowedTypes = [
                    'image/jpeg',
                    'image/png',
                    'application/pdf',
                  ];
                  const isAllowed = allowedTypes.includes(file.type);
                  if (!isAllowed) {
                    message.warning(
                      'You can only upload JPG, PNG, or PDF files!'
                    );
                  }
                  const maxSize = 2 * 1024 * 1024; // 5MB in bytes
                  if (file.size > maxSize) {
                    message.warning('File size must be less than 5MB!');
 
                    return false;
                  }
                  return isAllowed;
                }}
                showUploadList={false}
                onChange={handleEditUploadFile}
                name="uploaded_file"
                action={`${apiBaseUrl}/file/file_upload_view/`}
                headers={{ authorization: 'authorization-text' }}
                style={{ pointerEvents: 'none', float: 'right' }}
              >
                <Button className={styles['browse-btn']} disabled={isDisabled}>
                  Browse
                </Button>
              </Upload>
              {selectedRowEdit?.file_name && (
                <DeleteOutlined
                  style={{ color: 'red' }}
                  disabled
                  className="mx-2"
                />
              )}
            </div> */}
          </div>
        </Col>

        <Col span={8}>
          <p className={styles.heading}>Comments</p>
          <TextArea
            className={styles.commentBox}
            placeholder="Enter your comments"
            disabled={enableComments}
            value={comment}
            style={{ height: '180px' }}
            onChange={(e) => setComment(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <p className={styles.heading}>Comments History</p>
          <div className={styles.wrapper}>
            {Array.isArray(record && record[selectedDataIndex]?.comments) &&
            record &&
            record[selectedDataIndex]?.comments.length > 0 ? (
              record &&
              record[selectedDataIndex]?.comments.map(
                (item: any, index: any) => (
                  <>
                    {item.comments && (
                      <Row
                        key={index}
                        gutter={16}
                        style={{ marginBottom: '8px' }}
                      >
                        <Col span={3}>
                          <p className={styles['role-circle']}>
                            {getFirstLetters(item?.entity_Roles)}
                          </p>
                        </Col>
                        <Col span={11}>
                          <p>
                            <span className={styles.author}>
                              by{' '}
                              {maxReviewerLevel === 'L1_DATA_REVIEWER' &&
                              item.entity_Roles === 'L1_DATA_REVIEWER'
                                ? 'DATA REVIEWER'
                                : maxApproverLevel === 'L1_DATA_APPROVER' &&
                                    item.entity_Roles === 'L1_DATA_APPROVER'
                                  ? 'DATA APPROVER'
                                  : item.entity_Roles}
                            </span>{' '}
                            <p className={styles['comment-text']}>
                              {item.comments}
                            </p>
                          </p>
                        </Col>
                        <Col span={10}>
                          <p>
                            {moment
                              .utc(item.commenting_date)
                              .local()
                              .format('DD-MMM-YYYY hh:mm A')}
                          </p>
                        </Col>
                      </Row>
                    )}
                  </>
                )
              )
            ) : (
              <p>No comments available</p>
            )}
          </div>
        </Col>
      </Row>

      <Row justify="end" className="p-3">
        <Col>
          {!isDisabled && (
            <ButtonComponent
              hierarchy="secondary-gray"
              className="mx-3"
              onClick={() => {
                let test = [...tableData];

                if (
                  test[record.uniqueId].contentEditable === false ||
                  test[record.uniqueId].contentEditable === undefined
                ) {
                  test[record.uniqueId].contentEditable = true;
                } else {
                  test[record.uniqueId].contentEditable = false;
                }
                setTableData(test);
              }}
            >
              Edit
            </ButtonComponent>
          )}
          {!enableComments && (
            <ButtonComponent
              onClick={() => {
                handleSaveClick(record, index);
              }}
            >
              Save
            </ButtonComponent>
          )}
        </Col>
      </Row>
    </>
  );
}
