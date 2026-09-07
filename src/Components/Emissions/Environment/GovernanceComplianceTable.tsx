import { useState, useEffect } from 'react';
import { Row, Col, message, Input, Select, Spin } from 'antd';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import Styles from '../../../Modules/Governance/governance.module.scss';
import { apiBaseUrl, get, post, put } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import CountCardComponent from '../../../DesignLibrary/CountCardComponent';
import Incidents from '../../../assets/Svg/Environment/Incidents';
import { corruptionCols } from '../../../Modules/Emission/mock';
import StatusComponent from '../../../DesignLibrary/StatusComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  setExpandedKeys,
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../../Redux/Actions';
import {
  capitalizeFirstWord,
  getRowIdFromUniqueId,
  removeDuplicates,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
  generateFiltersAndOnFilter,
} from '../Scope3/Helpers';

import EditSession from '../../content/EditSession';
import { isEmpty } from '../../../Utils/isEmpty';
import GovernanceCompliancePdf from './GovernanceCompliancePdf';

const formatter = new Intl.NumberFormat('en-US', {});

export default function GovernanaceComplianceTable({}: any) {
  const location = useLocation();
  const { company, financialYear } = location.state || {};

  const [dataSources, setdataSources] = useState<any>([]);
  const [totalIncidents, setTotalIncidents] = useState<number>();
  const [disableResubmit, setDisableResubmit] = useState<any>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUpdate, setIsUpdate] = useState<any>(false);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [loading, setLoading] = useState(false);

  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );

  const getGovernanceCompliance = async () => {
    try {
      setLoading(true);
      const res = await get(
        `/corruption/fetch-corruptions-data?entity_Id=${user?.entity_Id}&facility_Id=${facilitySelected}`
      );
      const resData = res?.response?.data;
      if (!isEmpty(resData) && resData) {
        setTotalIncidents(res?.response?.total_no_of_incidents);
        const updatedData = res?.response?.data.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
          })
        );
        setdataSources(updatedData);
      } else {
        setdataSources([]);
        setTotalIncidents(0);
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getGovernanceCompliance();
    }
  }, []);

  useEffect(() => {
    if (isUpdate === true && user?.role !== 'SUPER_ADMIN') {
      getGovernanceCompliance();
    }
  }, [isUpdate]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getGovernanceCompliance();
    }
  }, [facilitySelected]);

  const getSuperGovernanceCompliance = async (
    entityId: any,
    financialYear: any
  ) => {
    try {
      setLoading(true);
      const res = await get(
        `/corruption/super_fetch_corruptions_data/?entity_Id=${entityId}&financial_year=${financialYear}`
      );
      const resData = res?.response?.data;

      if (!isEmpty(resData) && resData) {
        setTotalIncidents(res?.response?.total_no_of_incidents);
        const updatedData = res?.response?.data.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
          })
        );
        setdataSources(updatedData);
      } else {
        setdataSources([]);
        setTotalIncidents(0);
      }
    } catch (err) {
      console.error('Error fetching governance compliance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      getSuperGovernanceCompliance(company.value, financialYear);
    }
  }, [user?.role]);

  const handleStatusApi = (idsLst: any, statusValue: any) => {
    let ids: { id: number }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }
    const path = '/corruption/update_corruption_status/';
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
        getGovernanceCompliance();
      });
  };

  const [comment, setComment] = useState('');
  const [editList, setEditList] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editMap, setEditMap] = useState<{ [key: string]: boolean }>({});

  const allowedStatuses = roleStatusMapping[user.role] || new Set();
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);

  const handleSave = (record: any) => {
    const newItem = {
      ...record,
      comment: comment,
    };

    const indexToModify = dataSources.findIndex(
      (item: any) => item.id === record.id
    );
    dataSources[indexToModify] = record;
    let test = dataSources.map((item: any) => ({
      ...item,
      status:
        maxReviewerLevel === 'L1_DATA_REVIEWER' &&
        item.status === 'For L1 Review'
          ? 'For Review'
          : item.status,
    }));
    setdataSources(test);
    setSelectedRowKeys([]);
    setComment('');
    setEditMap({
      ...editMap,
      [getRowIdFromUniqueId(record.key, dataSources)]: false,
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
        setExpandedKeys(expandedKeys.filter((k: any) => k !== record.uniqueId))
      );
    } else {
      dispatch(setExpandedKeys([]));
    }
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

      put(`/corruption/corruption-related-data-edit/`, body)
        .then((res: any) => {
          message.success(
            !isEmpty(res?.message) ? res?.message : 'Successfully Updated'
          );
          getGovernanceCompliance();
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          message.error(`${!isEmpty(err?.message) && err?.message}`);
        })
        .finally(() => {
          getGovernanceCompliance();
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

  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [postFilterRecords, setPostFilterRecords] = useState([]);
  // Function to handle filter changes
  const handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setFilteredInfo(filters);
    setPostFilterRecords(extra.currentDataSource);
  };

  // Function to reset filters
  const resetFilters = () => {
    setFilteredInfo({});
  };

  useEffect(() => {
    resetFilters();
  }, []);

  const generatedColumns = (columns: any[]) => {
    return (
      columns
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
                        !isEmpty(record[dataIndex]) ? record[dataIndex] : ''
                      }
                      onKeyDown={(e: any) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value);
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
                  <div>
                    <Select
                      style={{ width: '180px' }}
                      defaultValue={
                        !isEmpty(record[dataIndex]) && record[dataIndex]
                      }
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
              if (dataIndex === 'outcomes') {
                return <span>{capitalizeFirstWord(record[dataIndex])}</span>;
              }
              return (
                <span>{!isEmpty(record[dataIndex]) && record[dataIndex]}</span>
              );
            }
          };

          const { filters, onFilter, filteredValue } =
            generateFiltersAndOnFilter(column, dataSources, filteredInfo);

          if (dataIndex !== 'status') {
            return {
              title: title,
              dataIndex: dataIndex,
              key: key,
              render: renderFunction,
              ...(dataIndex === 'incident_category' && {
                filteredValue,
                filters,
                onFilter,
              }),
            };
          }

          if (dataIndex == 'status') {
            return {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              filters: dataSources
                ?.map((entry: any) => entry.status) // Extracting status values
                ?.filter(
                  (value: any, index: any, self: any) =>
                    self.indexOf(value) === index
                ) // Keeping only unique values
                ?.map((filterValue: any) => ({
                  text: filterValue,
                  value: filterValue,
                })),
              onFilter: (value: any, record: any) =>
                record.status.indexOf(value) === 0,
              filteredValue: filteredInfo.status || null,
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
              title: <span style={{ textTransform: 'initial' }}>{title}</span>,
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

  const corruptionColsUpdate = corruptionCols.filter(
    (col) => col.dataIndex !== 'action'
  );

  const combinedColumns = [...generatedColumns(corruptionColsUpdate)];

  useEffect(() => {
    if (!isEmpty(selectedRows) && selectedRows) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  const formattedNumber =
    totalIncidents != null ? formatter.format(totalIncidents) : '';

  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [entityData, setEntityData] = useState<any>([]);
  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');
  const [facilityList, setFacilityList] = useState([]);

  const getApiFacility = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      let data = response?.response?.data;
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
    fetchEnityData('/entity/getEntitiesListByUserId/');
  }, []);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (!isEmpty(entityData) && facilitySelected !== '') {
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
          dispatch(
            setFacilitySelected(
              location?.state?.currentFacility || facilityIds[0][0]
            )
          );
        }
      }
      setMaxApproverLevel(
        (entityData && entityData[0] && entityData[0].max_DA) || ''
      );
      setMaxReviewerLevel(
        (entityData && entityData[0] && entityData[0].max_DR) || ''
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
  }, []);

  const handleRevert = (idsLst: any) => {
    handleStatusApi(idsLst, revertstatusMessage);
  };

  const handleApprove = (idsLst: any) => {
    handleStatusApi(idsLst, forwardstatusMessage);
  };

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

  const [modalContent, setModalContent] = useState('');
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [deleteModal, setDeleteModal] = useState(false);
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
          maxApproverLevel == 'L1_DATA_APPROVER' ||
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

    const url = `/corruption/manage_deletion_for_corruption/`;

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
            ? 'Deletion successful.'
            : 'Deletion request submitted.'
        );
        getGovernanceCompliance();
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

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row justify="end" className="d-flex justify-content-end">
          {user.role !== 'SUPER_ADMIN' && (
            <Col
              className={`d-flex align-items-center ${Styles.customPaddingRight}`}
            >
              <GovernanceCompliancePdf />
            </Col>
          )}

          {user.role !== 'SUPER_ADMIN' && (
            <>
              <div className={Styles.facilityLabel}>Facility :</div>
              <Select
                className={Styles.facilityDropdown}
                placeholder={facilitySelected ? undefined : 'Facility Name'}
                value={facilitySelected}
                onChange={(selectedOption) =>
                  dispatch(setFacilitySelected(selectedOption))
                }
              >
                {facilityOptions?.map((facility: any) => (
                  <Select.Option
                    key={facility?.facility_Id}
                    value={facility?.facility_Id}
                  >
                    {facility?.facility_Name}
                  </Select.Option>
                ))}
              </Select>
            </>
          )}
          {user.role === 'DATA_PROVIDER' && (
            <ButtonComponent
              disabled={!(hasPermissionToAdd && facilitySelected !== '')}
              onClick={() => navigate('/governance/Incidents-form')}
            >
              Add +
            </ButtonComponent>
          )}
        </Row>
        <Row
          justify="start"
          align="middle"
          className={`${user.role === 'DATA_PROVIDER' ? Styles.governanceMargin : Styles.boardMargin} ${user.role === 'SUPER_ADMIN' ? 'mt-1' : ''}`}
        >
          <Col xl={5} lg={12} md={12} sm={24}>
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
                Total Number of <br /> Non Compliance Incidents
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {formattedNumber}
              </p>
            </div>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <Row className={Styles.customPaddingTop}>
            <Col span={24}>
              <TableComponent
                onchange={handleChange}
                postFilterRecords={postFilterRecords}
                handleRevert={handleRevert}
                handleApprove={handleApprove}
                expandableRowRenderer={expandedRowContent}
                isRowExpand={true}
                data={dataSources}
                enableRowSelection={false}
                allowedStatuses={allowedStatuses}
                columnHeader={combinedColumns}
                showOnlyCount={false}
                isNewDelte={true}
                columnCheckBoxDataAttribute="key"
                noText={
                  user.role === 'SUPER_ADMIN'
                    ? `No Approved Data for this Reporting Period`
                    : null
                }
                maxApproverLevel={maxApproverLevel}
                maxReviewerLevel={maxReviewerLevel}
                onHandleDelete={handleDelete}
              />
            </Col>
          </Row>
        </Spin>
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
        <ModalComponent
          isOpen={deleteModal}
          content={modalContent}
          onCancel={() => setDeleteModal(false)}
          onClose={() => setDeleteModal(false)}
          onProceed={() => handleDeleteRequest()}
        ></ModalComponent>
      </PageCardComponent>
    </>
  );
}
