import { ButtonComponent } from '../../DesignLibrary';
import styles from './UpdateSection.module.scss';
import { Button, Col, message, Row, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import {
  getFirstLetters,
  getRowIdFromUniqueId,
  roleStatusMapping,
} from '../Emissions/Scope3/Helpers';
import { useAuth } from '../../Hooks/useAuth';
import { apiBaseUrl } from '../../Services';

export default function EditSession({
  setComment,
  comment,
  record,
  handleSaveClick,
  index,
  handleEditClick,
  handleEditUploadFile,
  uploadedFileName,
  showIsUpload,
  data,
  maxReviewerLevel,
  maxApproverLevel,
}: any) {
  const getObjectById = (array: any, id: any) => {
    return array.find((item: any) => item.id === id);
  };

  const { user } = useAuth();
  const allowedStatuses = roleStatusMapping[user.role] || new Set();
  const isShow =
    allowedStatuses.has(record.status) &&
    record.status != 'For L1 Approval' &&
    record.status != 'For L1 Re-approval' &&
    record.status != 'For L2 Approval' &&
    record.status != 'For Approval';

  const enableComments = !allowedStatuses.has(record.status);
  const recid = getRowIdFromUniqueId(record.uniqueId, data);

  return (
    <>
      <Row gutter={24} className="justify-content-start p-3">
        {isShow && showIsUpload && (
          <Col span={4} className="p-2">
            <p className={styles.heading}>Attachments</p>
            <div
              className={`${styles.updateBox} d-flex align-items-center justify-content-between`}
            >
              <div>
                <span style={{ marginLeft: '5px', color: '#00338d' }}>
                  {uploadedFileName?.length > 6
                    ? uploadedFileName?.substring(0, 8) + '...'
                    : uploadedFileName}
                </span>
              </div>

              <div>
                <Upload
                  maxCount={1}
                  showUploadList={false}
                  onChange={handleEditUploadFile}
                  beforeUpload={(file) => {
                    const maxSize = 2.5 * 1024 * 1024;
                    if (file.size > maxSize) {
                      message.warning('File size must be less than 2.5MB.');
                      return false;
                    }
                    return true;
                  }}
                  name="uploaded_file"
                  action={`${apiBaseUrl}/file/file_upload_view/`}
                  headers={{
                    Authorization: `Bearer ${user.token}`,
                  }}
                  style={{ pointerEvents: 'none', float: 'right' }}
                >
                  <Button className={styles['browse-btn']}>Browse</Button>
                </Upload>
              </div>
            </div>
          </Col>
        )}
        {!enableComments && (
          <Col span={8}>
            <p className={styles.heading}>Comments</p>
            <TextArea
              className={styles.updateBox}
              placeholder="Type Something"
              value={comment}
              style={{ height: '150px' }}
              onChange={(e) => setComment(e.target.value)}
            />
          </Col>
        )}
        <Col span={8}>
          <p className={styles.heading}>Comments History</p>
          <div className={styles.wrapper}>
            {Array.isArray(record?.comments) && record.comments.length > 0 ? (
              record.comments.map((item: any, index: number) =>
                item.comments ? (
                  <Row key={index} gutter={16} style={{ marginBottom: '8px' }}>
                    <Col span={3}>
                      <p className={styles['role-circle']}>
                        {getFirstLetters(item.entity_Roles)}
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
                        <span className={styles['comment-text']}>
                          {item.comments}
                        </span>
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
                ) : null
              )
            ) : (
              <p>No comments available</p>
            )}
          </div>
        </Col>
      </Row>

      <Row justify="end" className="mt-4 mb-4">
        <Col>
          {isShow && (
            <ButtonComponent
              hierarchy="secondary-gray"
              className="mx-3"
              onClick={() => {
                handleEditClick(getRowIdFromUniqueId(record.uniqueId, data));
              }}
            >
              Edit
            </ButtonComponent>
          )}
          {!enableComments && (
            <ButtonComponent
              onClick={() => handleSaveClick(getObjectById(data, recid))}
            >
              Save
            </ButtonComponent>
          )}
        </Col>
      </Row>
    </>
  );
}
