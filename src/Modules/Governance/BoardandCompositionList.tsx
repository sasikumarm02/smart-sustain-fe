import { useState, useEffect } from 'react';
import { Row, Col, message, Input, Select } from 'antd';
import {
  PageCardComponent,
  ButtonComponent,
  TableComponent,
  ModalComponent,
} from '../../DesignLibrary';
import Styles from './governance.module.scss';
import { apiBaseUrl, get, post, put } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { boardManagementTabColumns } from '../Emission/mock';
import CountCardComponent from '../../DesignLibrary/CountCardComponent';
import BoardComposition from '../../assets/Svg/Environment/BoardComposition';
import ManagementTeam from '../../assets/Svg/Environment/ManagementTeam';
import { useSelector, useDispatch } from 'react-redux';
import {
  setExpandedKeys,
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../Redux/Actions';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import {
  getRowIdFromUniqueId,
  removeDuplicates,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from '../../Components/Emissions/Scope3/Helpers';
import EditSession from '../../Components/content/EditSession';
import { formatNumberUS } from '../../Utils/Strings';
import { isEmpty } from '../../Utils/isEmpty';
import BoardPdf from './BoardPdf';
import LoaderComponent from '../../DesignLibrary/LoaderComponent';

const initialState = {
  no_of_directors: '',
  no_of_independent_directors: '',
  no_of_board_of_director_male: '',
  no_of_board_of_director_female: '',
  // tenure: '',
  board_committees: '',
  no_of_executive: '',
  no_of_management_team_male: '',
  no_of_management_team_female: '',
};

export default function BoardandCompositionList({}: any) {
  const location = useLocation();
  const { company, financialYear } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [dataSources, setdataSources] = useState<any>([]);
  const [boardCompositionData, setBoardCompositionData] = useState<any>(
    initialState || []
  );
  const [disableResubmit, setDisableResubmit] = useState<any>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState<any>(false);
  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );

  const getBoardComposition = async () => {
    try {
      const res = await get(
        `/board_and_management/fetch-data-for-board-and-management?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );
      const resData = res?.response?.data;
      if (!isEmpty(resData) && resData) {
        setBoardCompositionData(resData[resData?.length - 1]);
        let arr = [];
        arr.push(resData[resData?.length - 1]);
        const updatedData = arr.map((item: any, index: any) => ({
          ...item,
          uniqueId: index,
        }));
        setdataSources(updatedData);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getBoardComposition();
    }
  }, []);

  useEffect(() => {
    if (isUpdate === true && user?.role !== 'SUPER_ADMIN') {
      getBoardComposition();
    }
  }, [isUpdate]);

  const getSuperBoard = async (entityId: any, financialYear: any) => {
    try {
      const res = await get(
        `/board_and_management/super_fetch_data_for_board_and_management/?entity_Id=${entityId}&financial_year=${financialYear}`
      );
      const resData = res?.response?.data;

      if (!isEmpty(resData) && resData) {
        setBoardCompositionData(resData[resData?.length - 1]);
        let arr = [];
        arr.push(resData[resData?.length - 1]);
        const updatedData = arr.map((item: any, index: any) => ({
          ...item,
          uniqueId: index,
        }));
        setdataSources(updatedData);
      }
    } catch (err) {
      console.error('Error fetching governance compliance:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      getSuperBoard(company.value, financialYear);
    }
  }, [user?.role]);

  const handleStatusApi = (idsLst: any, statusValue: any) => {
    let ids: { id: number }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }
    const path = '/board_and_management/update_board_and_management_status/';
    const body = {
      entity_Id: user.entity_Id,
      ids: ids,
      status: statusValue,
    };

    put(`${path}`, body)
      .then((res: any) => {
        message.success(
          !isEmpty(res?.message) ? res?.message : 'Successfully Updated'
        );
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
        setEditList([]);
      })
      .catch((err) => {
        message.error(
          !isEmpty(err?.response?.data.message)
            ? err?.response?.data.message
            : 'Something Went Wrong'
        );
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
        setEditList([]);
      })
      .finally(() => {
        setEditList([]);
        getBoardComposition();
      });
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [editList, setEditList] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editMap, setEditMap] = useState<{ [key: string]: boolean }>({});
  const [pdfData, setPdfData] = useState<any>({});
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);
  const allowedStatuses = roleStatusMapping[user.role] || new Set();

  const handleSave = (record: any) => {
    const {
      no_of_executive,
      no_of_management_team_male,
      no_of_management_team_female,
      no_of_directors,
      no_of_independent_directors,
      no_of_board_of_director_male,
      no_of_board_of_director_female,
    } = record;

    if (
      parseInt(no_of_executive) !==
      parseInt(no_of_management_team_male) +
        parseInt(no_of_management_team_female)
    ) {
      message.warning(
        'Sum of male and female management team does not equal number of executives.'
      );
    } else if (
      parseInt(no_of_directors) !==
      parseInt(no_of_board_of_director_male) +
        parseInt(no_of_board_of_director_female)
    ) {
      message.warning(
        'Sum of male and female board of directors does not equal number of directors.'
      );
    } else if (
      parseInt(no_of_independent_directors) >= parseInt(no_of_directors)
    ) {
      message.warning(
        'Number of independent directors should be less than total number of directors.'
      );
    } else {
      const newItem = {
        ...record,
        comment: comment,
      };

      const indexToModify = dataSources.findIndex(
        (item: any) => item.id === record.id
      );
      dataSources[indexToModify] = newItem;
      const updatedData = [...dataSources].map((item: any, index: any) => ({
        ...item,
        uniqueId: index,
      }));
      setdataSources(updatedData);

      setExpandedRowKeys([]);
      setSelectedRowKeys([]);
      setComment('');
      setEditMap({
        ...editMap,
        [getRowIdFromUniqueId(record.uniqueId, dataSources)]: false,
      });
      setEditing(false);

      const finalEditList = Object.values(
        removeDuplicates([...editList, newItem])
      );
      setEditList(finalEditList);
      editData(user.entity_Id, finalEditList);
      const isCurrentRowExpanded =
        !isEmpty(expandedKeys) && expandedKeys?.includes(record.uniqueId);
      if (isCurrentRowExpanded) {
        dispatch(
          setExpandedKeys(
            expandedKeys.filter((k: any) => k !== record.uniqueId)
          )
        );
      } else {
        dispatch(setExpandedKeys([]));
      }
    }
  };

  const editData = (entity: any, finalEditList: any) => {
    dispatch(setSelectedRowKeys([]));
    if (isEmpty(finalEditList) && finalEditList) {
      message.warning('Please edit before update');
    } else {
      const body = {
        entity_Id: entity,
        entity_role: user.role,
        updatedValue: finalEditList,
      };
      put(`/board_and_management/board-and-management-data-edit/`, body)
        .then((res: any) => {
          message.success(
            !isEmpty(res?.message) ? res?.message : 'Successfully Updated'
          );
          getBoardComposition();
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          message.error(`${!isEmpty(err?.message) && err?.message}`);
        })
        .finally(() => {
          getBoardComposition();
          setComment('');
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          setEditList([]);
          setIsUpdate(true);
        });
    }
  };

  const handleEditClick = (key: string) => {
    setEditMap((prevEditMap) => {
      const newEditMap: any = {};
      newEditMap[key] = true;
      return newEditMap;
    });
    setEditing(!editing);
  };

  useEffect(() => {
    setEditMap((prevEditMap) => {
      const newEditMap = Object.keys(prevEditMap).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as Record<string, boolean>
      );

      return newEditMap;
    });
    setEditing(false);
  }, [expandedKeys]);

  const generatedColumns = (columns: any[]) => {
    return (
      columns
        //?.filter((column: any) => column.dataIndex === 'status')
        ?.map((column: any) => {
          const { title, dataIndex, key, type, options } = column;

          const renderFunction = (text: any, record: any, rowIndex: any) => {
            if (
              editMap[getRowIdFromUniqueId(record.uniqueId, dataSources)] &&
              editing
            ) {
              if (type === 'number') {
                return (
                  <div>
                    <Input
                      style={{ width: '80px' }}
                      defaultValue={
                        dataIndex === 'tenure'
                          ? formatNumberUS(record[dataIndex])
                          : record[dataIndex]
                      }
                      onKeyDown={(e: any) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                        if (dataIndex !== 'tenure') {
                          if (e.key === '.') {
                            e.preventDefault();
                          }
                        }
                      }}
                      onChange={(e) => {
                        const parsedValue =
                          dataIndex === 'tenure'
                            ? parseFloat(e.target.value)
                            : parseInt(e.target.value);
                        record[dataIndex] = parsedValue;
                        const recid = getRowIdFromUniqueId(
                          record.uniqueId,
                          dataSources
                        );
                        const updatedData = dataSources.map((item: any) => {
                          if (item.id === recid) {
                            return {
                              ...item,
                              [dataIndex]: parsedValue,
                            };
                          }
                          return item;
                        });
                        setdataSources(updatedData);
                      }}
                    />
                  </div>
                );
              } else if (type === 'select') {
                return (
                  <>
                    <div>
                      <Select
                        style={{ width: '180px' }}
                        defaultValue={text}
                        onChange={(value) => {
                          record[dataIndex] = value;
                          const recid = getRowIdFromUniqueId(
                            record.uniqueId,
                            dataSources
                          );
                          const updatedData = dataSources.map((item: any) => {
                            if (item.id === recid) {
                              return {
                                ...item,
                                [dataIndex]: value,
                              };
                            }
                            return item;
                          });
                          setdataSources(updatedData);
                        }}
                      >
                        {options?.map((option: any) => (
                          <Select.Option key={option} value={option}>
                            {option}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </>
                );
              } else if (type === 'text') {
                return (
                  <div>
                    <Input
                      style={{ width: '150px' }}
                      defaultValue={
                        !isEmpty(record[dataIndex]) && record[dataIndex]
                      }
                      onKeyDown={(e: any) => {
                        if (e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const parsedValue = e.target.value;
                        record[dataIndex] = parsedValue;
                        const recid = getRowIdFromUniqueId(
                          record.uniqueId,
                          dataSources
                        );
                        const updatedData = dataSources.map((item: any) => {
                          if (item.id === recid) {
                            return {
                              ...item,
                              [dataIndex]: parsedValue,
                            };
                          }
                          return item;
                        });
                        setdataSources(updatedData);
                      }}
                    />
                  </div>
                );
              }
            } else {
              return (
                <span>{!isEmpty(record[dataIndex]) && record[dataIndex]}</span>
              );
            }
          };

          if (dataIndex == 'status') {
            return {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              render: (status: any) => (
                <StatusComponent
                  text={
                    maxReviewerLevel === 'L1_DATA_REVIEWER' &&
                    status === 'For L1 Review'
                      ? 'For Review'
                      : status
                  }
                  status={
                    status === 'Approved'
                      ? 'success'
                      : !isEmpty(failureStatuses) &&
                          failureStatuses?.includes(status)
                        ? 'failure'
                        : !isEmpty(warningStatuses) &&
                            warningStatuses?.includes(status)
                          ? 'warning'
                          : 'warning'
                  }
                />
              ),
            };
          } else {
            return {
              title:
                dataIndex === 'tenure' ? (
                  <span style={{ textTransform: 'initial' }}>
                    {formatNumberUS(title)}
                  </span>
                ) : (
                  <span style={{ textTransform: 'initial' }}>{title}</span>
                ),
              dataIndex: dataIndex,
              key: key,
              render: renderFunction,
            };
          }

          return null;
        })
        .filter(Boolean) || []
    );
  };

  const combinedColumns = [...generatedColumns(boardManagementTabColumns)];

  useEffect(() => {
    if (!isEmpty(selectedRows) && selectedRows) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [entityData, setEntityData] = useState<any>([]);
  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');
  const [facilityList, setFacilityList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  const getApiFacility = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      const data = response?.response?.data;
      if (!isEmpty(data) && data) {
        setFacilityOptions(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    if (!isEmpty(facilityList) && facilityList) {
      getApiFacility();
    }
  }, [facilityList]);

  useEffect(() => {
    const fetchFaclityData = () => {
      get(`/facility/get_Facility/?entity_Id=${user.entity_Id}`)
        .then((res: any) => {
          if (
            !isEmpty(res) &&
            !isEmpty(res?.response) &&
            !isEmpty(res.response?.status) &&
            res.response?.status !== false
          ) {
            if (!isEmpty(res.response?.data) && res.response?.data) {
              setFacilityList(res.response?.data);
            }
          } else {
            setFacilityList([]);
          }
        })
        .catch((err) => console.log(err));
    };
    fetchFaclityData();
  }, []);

  const fetchEnityData = (apiUrl: any) => {
    get(apiUrl)
      .then((res) => {
        if (
          !isEmpty(res) &&
          !isEmpty(res?.response) &&
          !isEmpty(res?.response?.status) &&
          res?.response?.status !== false
        ) {
          const data = !isEmpty(res?.response?.data) && res?.response?.data;
          setEntityData(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  };
  useEffect(() => {
    fetchEnityData('/entity/getEntitiesListByUserId/');
  }, []);
  const getStatusMapping = (status: string): string[] | undefined => {
    if (requestedDeleteStatusMapping.hasOwnProperty(status)) {
      return requestedDeleteStatusMapping[status];
    }
    return undefined;
  };

  const getCurrentRoleSortForm = (level: any) => {
    let roleCode = '';
    switch (level) {
      case 'DATA_PROVIDER':
        roleCode = 'DP';
        break;
      case 'L1_DATA_REVIEWER':
        roleCode = 'DR';
        break;
      case 'L2_DATA_REVIEWER':
        roleCode = 'DR2';
        break;
      case 'L3_DATA_REVIEWER':
        roleCode = 'DR3';
        break;
      case 'L1_DATA_APPROVER':
        roleCode = 'DA';
        break;
      case 'L2_DATA_APPROVER':
        roleCode = 'DA2';
        break;
    }
    return roleCode;
  };

  const handleDeleteRequest = () => {
    let roleCode = '';
    switch (user.role) {
      case 'DATA_PROVIDER':
        roleCode = 'DP';
        break;
      case 'L1_DATA_REVIEWER':
        if (
          currentRecord?.status === 'For Approval' ||
          currentRecord?.status === 'Approved' ||
          maxReviewerLevel === 'L1_DATA_REVIEWER'
        ) {
          roleCode = 'DR';
        } else {
          roleCode = 'DR1';
        }
        break;
      case 'L2_DATA_REVIEWER':
        roleCode = 'DR2';
        break;
      case 'L3_DATA_REVIEWER':
        roleCode = 'DR3';
        break;
      case 'L1_DATA_APPROVER':
        if (
          maxApproverLevel === 'L1_DATA_APPROVER' ||
          maxApproverLevel === 'L1_DATA_APPROVER'
        ) {
          roleCode = 'DA';
        } else {
          roleCode = 'DA1';
        }
        break;
      case 'L2_DATA_APPROVER':
        roleCode = 'DA2';
        break;
    }

    const url = `/board_and_management/manage_deletion_for_board_and_mgmt/`;

    post(url, {
      id: currentRecord.id,
      role: roleCode,
      action:
        currentRecord?.status === 'For Deletion'
          ? user?.role === maxApproverLevel
            ? 'acknowledge'
            : 'request'
          : getStatusMapping(currentRecord.status) !== undefined &&
              getStatusMapping(currentRecord.status)?.includes(user?.role)
            ? 'acknowledge'
            : 'request',
      max_data_reviewer: getCurrentRoleSortForm(maxReviewerLevel),
      max_data_approver: getCurrentRoleSortForm(maxApproverLevel),
    })
      .then((response: any) => {
        message.success(
          (getStatusMapping(currentRecord.status) !== undefined &&
            getStatusMapping(currentRecord.status)?.includes(user?.role)) ||
            user?.role === maxApproverLevel
            ? 'Deleted successful.'
            : 'Deletion request submitted.'
        );
        getBoardComposition();
      })
      .catch((error: any) => {
        if (
          error?.response?.data?.message ===
          'No pending deletion request found.'
        ) {
          message.error(
            "You can't directly delete , you first need to raise a request first"
          );
        } else {
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => {
        setDeleteModal(false);
      });
  };

  const handleDelete = (record: any) => {
    record?.status === 'For Deletion'
      ? setModalContent(
          'Please confirm if you wish to proceed with permanently deleting this record. Once acknowledged, this action is final and cannot be undone.'
        )
      : getStatusMapping(record.status) !== undefined &&
          getStatusMapping(record.status)?.includes(user?.role)
        ? setModalContent(
            'Please confirm if you wish to proceed with permanently deleting this record. Once acknowledged, this action is final and cannot be undone.'
          )
        : setModalContent(
            'Are you sure you want to delete this record? This action is permanent and will disable the approval and revert options. Please confirm to proceed.'
          );
    setCurrentRecord(record);
    setDeleteModal(true);
  };
  const getCurrentLevelIndex = (role: any) => {
    if (role?.includes('REVIEWER')) {
      return roleLevels.reviewer.indexOf(role);
    } else if (role?.includes('APPROVER')) {
      return roleLevels.approver.indexOf(role);
    }
    return -1;
  };
  const currentLevelIndex = getCurrentLevelIndex(currentRole);

  const getMaxLevelIndex = (roleType: any, maxLevel: any) => {
    return roleLevels[roleType as any].indexOf(maxLevel);
  };
  const maxReviewerLevelIndex = getMaxLevelIndex('reviewer', maxReviewerLevel);
  const maxApproverLevelIndex = getMaxLevelIndex('approver', maxApproverLevel);

  const valueToDisplayForRevert =
    currentRole?.includes('REVIEWER') && currentLevelIndex > 0
      ? roleLevels.reviewer[currentLevelIndex - 1]
      : currentRole.includes('APPROVER')
        ? currentLevelIndex <= 0
          ? roleLevels?.reviewer[maxReviewerLevelIndex]
          : roleLevels?.approver[currentLevelIndex - 1] || ''
        : 'DATA_PROVIDER';

  const valueToDisplayForForward: any = currentRole.includes('REVIEWER')
    ? currentLevelIndex < roleLevels.reviewer.length - 1 &&
      currentLevelIndex !== maxReviewerLevelIndex
      ? roleLevels.reviewer[currentLevelIndex + 1]
      : roleLevels.approver[0]
    : currentRole.includes('APPROVER')
      ? currentLevelIndex < roleLevels.approver.length - 1 &&
        currentLevelIndex !== maxApproverLevelIndex
        ? roleLevels.approver[currentLevelIndex + 1]
        : 'Approved'
      : roleLevels.reviewer[0];

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (!isEmpty(entityData) && entityData && facilitySelected !== '') {
        const isFacilityPresent = entityData?.some((entity: any) => {
          const roleMatch = entity?.entity_Role?.some((role: any) => {
            return role?.facility_Id?.includes(facilitySelected);
          });

          return roleMatch;
        });
        setHasPermissionToAdd(isFacilityPresent);
      }
      if (!isEmpty(entityData) && facilitySelected === '') {
        const facilityIds = entityData?.flatMap((entity: any) => {
          return entity?.entity_Role
            ?.map((role: any) => {
              if (role?.facility_Id) {
                return role.facility_Id;
              }
              return null;
            })
            .filter((facilityId: any) => facilityId !== null);
        });

        if (user.role === 'DATA_PROVIDER') {
          dispatch(setFacilitySelected(facilityIds[0][0]));
        }
      }
      setMaxApproverLevel(
        !isEmpty(entityData) && !isEmpty(entityData[0]) && entityData[0]?.max_DA
      );
      setMaxReviewerLevel(
        !isEmpty(entityData) && !isEmpty(entityData[0]) && entityData[0]?.max_DR
      );
    }
  }, [entityData, facilitySelected]);

  const failureStatuses = !isEmpty(statusMapForRevert)
    ? Object.values(statusMapForRevert)
    : [];
  const warningStatuses = !isEmpty(statusMapForRevert)
    ? Object.values(statusMapForForward)
    : [];

  let forwardstatusMessage =
    statusMapForForward[valueToDisplayForForward] || '';

  let revertstatusMessage = statusMapForRevert[valueToDisplayForRevert] || '';

  if (
    maxReviewerLevel === 'L1_DATA_REVIEWER' &&
    forwardstatusMessage === 'For L1 Review'
  ) {
    forwardstatusMessage = 'For Review';
  } else if (
    maxApproverLevel === 'L1_DATA_APPROVER' &&
    forwardstatusMessage === 'For L1 Approval'
  ) {
    forwardstatusMessage = 'For Approval';
  } else if (
    maxApproverLevel === 'L1_DATA_APPROVER' &&
    revertstatusMessage === 'For L1 DR Revision'
  ) {
    revertstatusMessage = 'For DR Revision';
  }
  useEffect(() => {
    dispatch(setFacilitySelected(''));
  }, [window.location.href]);

  const expandedRowContent = (record: any, index: any) => {
    return (
      <EditSession
        record={record}
        index={index}
        comment={comment}
        setComment={setComment}
        handleSaveClick={handleSave}
        handleEditClick={handleEditClick}
        data={dataSources}
        maxReviewerLevel={maxReviewerLevel}
        maxApproverLevel={maxApproverLevel}
      />
    );
  };

  const handleRevert = (idsLst: any) => {
    handleStatusApi(idsLst, revertstatusMessage);
  };

  const handleApprove = (idsLst: any) => {
    handleStatusApi(idsLst, forwardstatusMessage);
  };

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <LoaderComponent spinning={loading}>
          <Row justify="end" className="d-flex justify-content-end">
            {user.role !== 'SUPER_ADMIN' && (
              <Col
                className={`d-flex align-items-center ${user.role === 'DATA_PROVIDER' ? Styles.customPaddingRight : ''}`}
              >
                <BoardPdf />
              </Col>
            )}
            {user.role === 'DATA_PROVIDER' && (
              <>
                <ButtonComponent
                  onClick={() => navigate('/board-composition-form')}
                >
                  Add +
                </ButtonComponent>
              </>
            )}
          </Row>

          <Row
            justify="start"
            align="middle"
            gutter={[0, 20]}
            className={`${user.role === 'DATA_PROVIDER' ? Styles.governanceMargin : Styles.boardMargin} ${user.role === 'SUPER_ADMIN' ? 'mt-1' : ''}`}
          >
            <Col
              xl={6}
              lg={6}
              md={12}
              sm={24}
              className={Styles.customPaddingRight}
            >
              <div
                style={{
                  backgroundColor: '#0D304A', // light gray background, change as needed
                  borderRadius: '16px',
                  padding: '20px',
                  width: '220px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h5
                  style={{
                    fontSize: '12px',
                    marginBottom: '10px',
                    color: '#fff',
                  }}
                >
                  Total Number of Directors
                </h5>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {boardCompositionData?.no_of_directors}
                </p>
              </div>
            </Col>
            <Col
              xl={6}
              lg={6}
              md={12}
              sm={24}
              className={Styles.customPaddingRight}
            >
              <div
                style={{
                  backgroundColor: '#0D304A', // light gray background, change as needed
                  borderRadius: '16px',
                  padding: '20px',
                  width: '220px',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h5
                  style={{
                    fontSize: '12px',
                    marginBottom: '10px',
                    color: '#fff',
                  }}
                >
                  Total Number of Management Team Members
                </h5>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {boardCompositionData?.no_of_executive}
                </p>
              </div>
            </Col>
          </Row>
          <Row className={Styles.customPaddingTop}>
            <TableComponent
              handleRevert={handleRevert}
              handleApprove={handleApprove}
              onHandleDelete={handleDelete}
              maxApproverLevel={maxApproverLevel}
              maxReviewerLevel={maxReviewerLevel}
              expandableRowRenderer={expandedRowContent}
              isRowExpand={true}
              data={dataSources}
              enableRowSelection={false}
              isNewDelte={true}
              allowedStatuses={allowedStatuses}
              columnHeader={combinedColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
              noText={
                user.role === 'SUPER_ADMIN'
                  ? `No Approved Data for this Reporting Period`
                  : null
              }
            />
          </Row>
          {user.role === 'SUPER_ADMIN' && (
            <>
              <Row justify="end" className={Styles.customPaddingTop}>
                <ButtonComponent
                  hierarchy="tertiary"
                  onClick={() => {
                    navigate('/super-view', {
                      state: {
                        company: company,
                        financialYear: financialYear,
                      },
                    });
                  }}
                >
                  Back
                </ButtonComponent>
              </Row>
            </>
          )}
        </LoaderComponent>
      </PageCardComponent>
      <ModalComponent
        isOpen={deleteModal}
        content={modalContent}
        onCancel={() => setDeleteModal(false)}
        onClose={() => setDeleteModal(false)}
        onProceed={() => handleDeleteRequest()}
      ></ModalComponent>
    </>
  );
}
