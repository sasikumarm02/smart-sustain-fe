import { useState, useEffect } from 'react';
import { Row, Col, message, Input, Select, Spin } from 'antd';
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
import { fatalitiesInjuriesTabColumns } from '../Emission/mock';
import CountCardComponent from '../../DesignLibrary/CountCardComponent';
import EmployeeFatality from '../../assets/Svg/Environment/EmployeeFatalities';
import ContractorFatality from '../../assets/Svg/Environment/ContractorFatalities';
import ConsequenceInjuries from '../../assets/Svg/Environment/ConsequenceInjuries';
import RecordableInjuries from '../../assets/Svg/Environment/RecordableInjuries';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  setExpandedKeys,
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../Redux/Actions';
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
import { isEmpty } from '../../Utils/isEmpty';
import SafetyPdf from './SafetyPdf';

const initialState = {
  no_of_emp_fatalities: '',
  no_of_contractor_fatalities: '',
  specific_incidents_list: '',
  no_of_high_consequence_injuries: '',
  no_of_recordable_injuries: '',
  no_of_lost_time_injuries: '',
  no_of_lost_workdays: '',
};

export default function FacilitiesandInjuriesList({}: any) {
  const location = useLocation();
  const { company, financialYear } = location.state || {};

  const [dataSources, setdataSources] = useState<any>([]);
  const [fatalitiesInjuriesData, setFatalitiesInjuriesData] = useState<any>(
    initialState || []
  );
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const [totalEmployee, setTotalEmployee] = useState<number>();
  const [totalContract, setTotalContract] = useState<number>();
  const [totalConsequence, setTotalConsequence] = useState<number>();
  const [totalRecordable, setTotalRecordable] = useState<number>();
  const [disableResubmit, setDisableResubmit] = useState<any>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUpdate, setIsUpdate] = useState<any>(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );

  const getFatInjurires = async () => {
    try {
      setLoading(true);
      const res = await get(
        `/injury_management/fetch-data-for-fatalities-and-injuries?entity_Id=${user?.entity_Id}${
          facilitySelected ? `&facility_Id=${facilitySelected}` : ''
        }`
      );
      const resData = res?.response?.data;

      if (!isEmpty(resData)) {
        setFatalitiesInjuriesData(resData);
        setTotalEmployee(res?.response?.total_no_of_emp_fatalities);
        setTotalContract(res?.response?.total_no_of_contractor_fatalities);
        setTotalConsequence(
          res?.response?.total_no_of_high_consequence_injuries
        );
        setTotalRecordable(res?.response?.total_no_of_recordable_injuries);

        const updatedData = resData?.map((item: any, index: any) => ({
          ...item,
          uniqueId: index,
        }));

        setdataSources(updatedData);
      } else {
        setdataSources([]);
        setTotalEmployee(0);
        setTotalContract(0);
        setTotalConsequence(0);
        setTotalRecordable(0);
      }
    } catch (err) {
      console.error('Error fetching data for fatalities and injuries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getFatInjurires();
    }
  }, []);

  useEffect(() => {
    if (isUpdate === true && user?.role !== 'SUPER_ADMIN') {
      getFatInjurires();
    }
  }, [isUpdate]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getFatInjurires();
    }
  }, [facilitySelected]);

  const getSuperSafety = async (entityId: any, financialYear: any) => {
    try {
      setLoading(true);
      const res = await get(
        `/injury_management/super_fetch_fatalities_and_injuries_data/?entity_Id=${entityId}&financial_year=${financialYear}`
      );
      const resData = res?.response?.data;

      if (!isEmpty(resData)) {
        setFatalitiesInjuriesData(resData);
        setTotalEmployee(res?.response?.total_no_of_emp_fatalities);
        setTotalContract(res?.response?.total_no_of_contractor_fatalities);
        setTotalConsequence(
          res?.response?.total_no_of_high_consequence_injuries
        );
        setTotalRecordable(res?.response?.total_no_of_recordable_injuries);
        const updatedData = resData?.map((item: any, index: any) => ({
          ...item,
          uniqueId: index,
        }));
        setdataSources(updatedData);
      } else {
        setdataSources([]);
        setTotalEmployee(0);
        setTotalContract(0);
        setTotalConsequence(0);
        setTotalRecordable(0);
      }
    } catch (err) {
      console.error('Error fetching governance compliance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      getSuperSafety(company.value, financialYear);
    }
  }, [user?.role]);

  const handleStatusApi = (idsLst: any, statusValue: any) => {
    let ids: { id: number }[] = [];
    if (Array.isArray(selectedRows)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }

    const path = '/injury_management/update_fatalities_and_injuries_status/';
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
        getFatInjurires();
      });
  };

  const [comment, setComment] = useState('');
  const [editList, setEditList] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editMap, setEditMap] = useState<{ [key: string]: boolean }>({});
  const [pdfData, setPdfData] = useState<any>({});

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
      [getRowIdFromUniqueId(record.uniqueId, dataSources)]: false,
    });

    const finalEditList = Object.values(
      removeDuplicates([...editList, newItem])
    );
    setEditList(finalEditList);
    editData(user.entity_Id, finalEditList);
    setEditing(false);
    const isCurrentRowExpanded =
      !isEmpty(expandedKeys) && expandedKeys?.includes(record?.uniqueId);
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
    if (isEmpty(finalEditList)) {
      message.warning('Please edit before update');
    } else {
      const body = {
        entity_Id: entity,
        entity_role: user?.role,
        updatedValue: finalEditList,
      };

      put(`/injury_management/injury-and-fatalities-data-edit/`, body)
        .then((res: any) => {
          message.success(
            !isEmpty(res?.message) ? res?.message : 'Successfully Updated'
          );
          getFatInjurires();
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          message.error(`${!isEmpty(err?.message) && err?.message}`);
        })
        .finally(() => {
          getFatInjurires();
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

  const failureStatuses = !isEmpty(statusMapForRevert)
    ? Object.values(statusMapForRevert)
    : [];
  const warningStatuses = !isEmpty(statusMapForRevert)
    ? Object.values(statusMapForForward)
    : [];

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

  const generatedColumns = (columns: any[]) => {
    return (
      columns
        //?.filter((column: any) => column.dataIndex === 'status')
        ?.map((column: any) => {
          const { title, dataIndex, key, type, options } = column;

          const renderFunction = (text: any, record: any, rowIndex: any) => {
            if (
              editMap[getRowIdFromUniqueId(record?.uniqueId, dataSources)] &&
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
                        if (
                          e.key === '-' ||
                          e.key === '.' ||
                          e.key === 'e' ||
                          e.key === 'E'
                        ) {
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
                      defaultValue={!isEmpty(text) ? text : ''}
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
                        !isEmpty(record[dataIndex]) ? record[dataIndex] : ''
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
                <span style={{ textTransform: 'capitalize' }}>
                  {!isEmpty(record[dataIndex]) ? record[dataIndex] : ''}
                </span>
              );
            }
          };

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
              className: 'cellWidth',
              render: renderFunction,
            };
          }

          return null;
        })
        .filter(Boolean) || []
    );
  };

  const fatalityInjuryColsUpdate = fatalitiesInjuriesTabColumns.filter(
    (col) => col.dataIndex !== 'action'
  );

  const combinedColumns = [
    ...generatedColumns(fatalityInjuryColsUpdate),
    // ...fatalitiesInjuriesTabColumns.filter(
    //   (col: any) => col.dataIndex !== 'status'
    // ),
  ];

  useEffect(() => {
    if (!isEmpty(selectedRows)) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  const [entityData, setEntityData] = useState<any>([]);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);

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

  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');
  const [facilityList, setFacilityList] = useState([]);

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
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);

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

    const url = `/injury_management/manage_deletion_for_injury_mgmt/`;

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
        getFatInjurires();
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
      {/* <div className={Styles.governanceHeader}>Safety Performance</div> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row justify="end" className="d-flex justify-content-end">
          {user.role !== 'SUPER_ADMIN' && (
            <Col
              className={`d-flex align-items-center ${Styles.customPaddingRight}`}
            >
              <SafetyPdf />
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
              onClick={() => navigate('/fatalities-injuries-form')}
            >
              Add +
            </ButtonComponent>
          )}
        </Row>

        <Row
          justify="start"
          align="middle"
          gutter={[16, 20]} // added horizontal gutter for spacing between columns
          className={Styles.customPaddingTop}
        >
          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={Styles.customPaddingRight}
          >
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Fatalities
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {totalEmployee}
              </p>
            </div>
          </Col>

          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={Styles.customPaddingRight}
          >
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Contractor Fatalities
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {totalContract}
              </p>
            </div>
          </Col>

          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={Styles.customPaddingRight}
          >
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee High-Consequence Injuries
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {totalConsequence}
              </p>
            </div>
          </Col>

          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Recordable Injuries
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {totalRecordable}
              </p>
            </div>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Col span={24} className={Styles.customPaddingTop}>
            <TableComponent
              onchange={handleChange}
              postFilterRecords={postFilterRecords}
              handleRevert={handleRevert}
              handleApprove={handleApprove}
              expandableRowRenderer={expandedRowContent}
              onHandleDelete={handleDelete}
              isRowExpand={true}
              data={dataSources}
              enableRowSelection={false}
              allowedStatuses={allowedStatuses}
              columnHeader={combinedColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
              noText={
                user.role === 'SUPER_ADMIN'
                  ? `No Approved Data for this Reporting Period`
                  : null
              }
              isNewDelte={true}
              maxApproverLevel={maxApproverLevel}
              maxReviewerLevel={maxReviewerLevel}
            />
          </Col>
        </Spin>
        <ModalComponent
          isOpen={deleteModal}
          content={modalContent}
          onCancel={() => setDeleteModal(false)}
          onClose={() => setDeleteModal(false)}
          onProceed={() => handleDeleteRequest()}
        ></ModalComponent>
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
      </PageCardComponent>
    </>
  );
}
