import { useEffect, useState } from 'react';
import { Col, Input, message, Row, Select, Spin, Tabs } from 'antd';
import { useAuth } from '../../../Hooks/useAuth';
import { apiBaseUrl, get, post, put } from '../../../Services';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../CountCards/CountCard.module.scss';
import {
  Total,
  Male,
  Female,
  BelowThirty,
  ThirtyToFifty,
  AboveFifty,
} from '../../../assets/Svg/Demographics/index';
import CountCard from '../CountCards/CountCard';
import { useSelector } from 'react-redux';
import {
  setExpandedKeys,
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import StatusComponent from '../../../DesignLibrary/StatusComponent';
import {
  getRowIdFromUniqueId,
  removeDuplicates,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
  generateFiltersAndOnFilter,
} from '../../Emissions/Scope3/Helpers';
import EditSession from '../../content/EditSession';
import { isEmpty } from '../../../Utils/isEmpty';
import EmployeePdf from './EmployeePdf';

const { TabPane } = Tabs;

const TabDataView = () => {
  const [data1, setData1] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [data3, setData3] = useState<any[]>([]);
  const [dataSources, setDataSources] = useState<any>([]);
  const [stats1, setStats1] = useState([]);
  const [stats2, setStats2] = useState([]);
  const [stats3, setStats3] = useState([]);
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(() => {
    const key =
      location?.state?.activeKey && typeof location.state.activeKey !== 'string'
        ? null
        : location?.state?.activeKey;

    return key ?? '1'; // Default to '1' if key is null or undefined
  });

  const { company, financialYear } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);

  const formProps = [
    {
      title: 'Number of Employee',
      subtitle: 'Please Select the Proper Employment Type',
      columnHeaders: ['Employment Category', 'Gender Category', 'Age Category'],
      getApi: '/employee/get_employee_number/',
      superApi: '/employee/super_get_employee_number/',
      datasources: data1 || [],
      columns: [
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          type: 'text',
        },
        ,
        {
          title: 'Employee Type',
          dataIndex: 'employee_type',
          key: 'employee_type',
          type: 'select',
          options: [
            'Full-time Employees',
            'Part-time Employees',
            'Permanent Employees',
            'Temporary Employees',
            'Contractual Employees',
            'Non-Guaranteed Hours Employees',
          ],
        },
        {
          title: 'Male',
          dataIndex: 'male',
          key: 'male',
          type: 'input',
        },
        {
          title: 'Female',
          dataIndex: 'female',
          key: 'female',
          type: 'input',
        },
        {
          title: 'Age <30',
          dataIndex: 'age_lt_30',
          key: 'age_lt_30',
          type: 'input',
        },
        {
          title: 'Age 30-50',
          dataIndex: 'age_30_to_50',
          key: 'age_30_to_50',
          type: 'input',
        },
        {
          title: 'Age >50',
          dataIndex: 'age_gt_50',
          key: 'age_gt_50',
          type: 'input',
        },
      ],
      countCardData: [
        {
          imageSrc: <Total />,
          ...(stats1.length > 0 ? stats1[0] : { title: 'Total', value: 0 }),
        },
        {
          imageSrc: <Male />,
          ...(stats1.length > 0
            ? stats1[1]
            : { title: 'Total Male ', value: 0 }),
        },
        {
          imageSrc: <Female />,
          ...(stats1.length > 0
            ? stats1[2]
            : { title: 'Total Female', value: 0 }),
        },
        {
          imageSrc: <BelowThirty />,
          ...(stats1.length > 0 ? stats1[3] : { title: 'Age <30 ', value: 0 }),
        },
        {
          imageSrc: <ThirtyToFifty />,
          ...(stats1.length > 0 ? stats1[4] : { title: 'Age 30-50', value: 0 }),
        },
        {
          imageSrc: <AboveFifty />,
          ...(stats1.length > 0 ? stats1[5] : { title: 'Age >50', value: 0 }),
        },
      ],
    },
    {
      title: 'Employee Turnover',
      subtitle: 'Please enter the proper Turnover Type',
      columnHeaders: ['Turn Over Category', 'Gender Category', 'Age Category'],
      getApi: '/employee/get_employee_turnover/',
      superApi: '/employee/super_get_employee_turnover/',
      datasources: data2 || [],
      countCardData: [
        {
          imageSrc: <Total />,
          ...(stats2.length > 0 ? stats2[0] : { title: 'Total', value: 0 }),
        },
        {
          imageSrc: <Male />,
          ...(stats2.length > 0
            ? stats2[1]
            : { title: 'Total Male ', value: 0 }),
        },
        {
          imageSrc: <Female />,
          ...(stats2.length > 0
            ? stats2[2]
            : { title: 'Total Female', value: 0 }),
        },
        {
          imageSrc: <BelowThirty />,
          ...(stats2.length > 0 ? stats2[3] : { title: 'Age <30 ', value: 0 }),
        },
        {
          imageSrc: <ThirtyToFifty />,
          ...(stats2.length > 0 ? stats2[4] : { title: 'Age 30-50', value: 0 }),
        },
        {
          imageSrc: <AboveFifty />,
          ...(stats2.length > 0 ? stats2[5] : { title: 'Age >50', value: 0 }),
        },
      ],
      columns: [
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          type: 'text',
        },
        {
          title: 'Turnover Type',
          dataIndex: 'turnover_type',
          key: 'turnover_type',
          type: 'select',
          options: ['Voluntary Turnover', 'Involuntary Turnover'],
        },

        {
          title: 'Male',
          dataIndex: 'male',
          key: 'male',
          type: 'input',
        },

        {
          title: 'Female',
          dataIndex: 'female',
          key: 'female',
          type: 'input',
        },

        {
          title: 'Age <30',
          dataIndex: 'age_lt_30',
          key: 'age_lt_30',
          type: 'input',
        },

        {
          title: 'Age 30-50',
          dataIndex: 'age_30_to_50',
          key: 'age_30_to_50',
          type: 'input',
        },

        {
          title: 'Age >50',
          dataIndex: 'age_gt_50',
          key: 'age_gt_50',
          type: 'input',
        },
      ],
    },
    {
      title: 'New Hires',
      subtitle: 'Please Enter the Proper Hiring Type',
      columnHeaders: ['Hiring Category', 'Gender Category', 'Age Category'],
      getApi: '/employee/get_employee_new_hire/',
      superApi: '/employee/super_get_employee_new_hire/',
      datasources: data3 || [],
      columns: [
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          type: 'text',
        },
        {
          title: 'Hiring Type',
          dataIndex: 'hiring_type',
          key: 'hiring_type',
          type: 'select',
          options: [
            'Full-time Employees',
            'Part-time Employees',
            'Permanent Employees',
            'Temporary Employees',
            'Contractual Employees',
            'Non-Guaranteed Hours Employees',
          ],
        },
        {
          title: 'Male',
          dataIndex: 'male',
          key: 'male',
          type: 'input',
        },
        {
          title: 'Female',
          dataIndex: 'female',
          key: 'female',
          type: 'input',
        },
        {
          title: 'Age <30',
          dataIndex: 'age_lt_30',
          key: 'age_lt_30',
          type: 'input',
        },
        {
          title: 'Age 30-50',
          dataIndex: 'age_30_to_50',
          key: 'age_30_to_50',
          type: 'input',
        },
        {
          title: 'Age >50',
          dataIndex: 'age_gt_50',
          key: 'age_gt_50',
          type: 'input',
        },
      ],

      countCardData: [
        {
          imageSrc: <Total />,
          ...(stats3.length > 0 ? stats3[0] : { title: 'Total', value: 0 }),
        },
        {
          imageSrc: <Male />,
          ...(stats3.length > 0
            ? stats3[1]
            : { title: 'Total Male ', value: 0 }),
        },
        {
          imageSrc: <Female />,
          ...(stats3.length > 0
            ? stats3[2]
            : { title: 'Total Female', value: 0 }),
        },
        {
          imageSrc: <BelowThirty />,
          ...(stats3.length > 0 ? stats3[3] : { title: 'Age <30 ', value: 0 }),
        },
        {
          imageSrc: <ThirtyToFifty />,
          ...(stats3.length > 0 ? stats3[4] : { title: 'Age 30-50', value: 0 }),
        },
        {
          imageSrc: <AboveFifty />,
          ...(stats3.length > 0 ? stats3[5] : { title: 'Age >50', value: 0 }),
        },
      ],
    },
  ];

  const fetchData = (activeKey: any) => {
    setIsLoading(true);
    const apiPath = formProps[parseInt(activeKey) - 1]?.getApi;

    get(
      `${apiPath}?entity_Id=${user.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
    )
      .then((res: any) => {
        if (!isEmpty(res?.response?.status) && res?.response?.status === true) {
          const data = res?.response?.data || []; // Default to an empty array if data is null/undefined
          const stats = res?.response?.stats || []; // Default stats to an empty array if not provided

          const updatedData = data.map((item: any, index: any) => ({
            ...item,
            uniqueId: index,
            key: index, // Adding key property for consistency
          }));

          if (activeKey === '1') {
            setData1(updatedData);
            setDataSources(updatedData);
            setStats1(stats);
          } else if (activeKey === '2') {
            setData2(updatedData);
            setDataSources(updatedData);
            setStats2(stats);
          } else if (activeKey === '3') {
            setData3(updatedData);
            setDataSources(updatedData);
            setStats3(stats);
          }
        } else {
          // Handle when response status is not true
          if (activeKey === '1') {
            setData1([]);
            setDataSources([]);
            setStats1([]);
          } else if (activeKey === '2') {
            setData2([]);
            setDataSources([]);
            setStats2([]);
          } else if (activeKey === '3') {
            setData3([]);
            setDataSources([]);
            setStats3([]);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTabChange = (activeKey: any) => {
    fetchData(activeKey);
    setActiveKey(activeKey);
    setEditing(false);
    dispatch(setExpandedKeys([]));
    setEditing(false);
    dispatch(updateSelectedRowKeys([]));
    dispatch(setSelectedRowKeys([]));
  };

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      fetchData(activeKey);
    }
  }, [activeKey, facilitySelected]);

  const fetchSuperData = (
    activeKey: any,
    entityId: any,
    financialYear: any
  ) => {
    setIsLoading(true);
    const apiPath = formProps[parseInt(activeKey) - 1]?.superApi;
    get(`${apiPath}?entity_Id=${entityId}&financial_year=${financialYear}`)
      .then((res: any) => {
        if (!isEmpty(res?.response?.status) && res?.response?.status === true) {
          if (res?.response?.data) {
            if (activeKey === '1') {
              const updatedData = res?.response?.data.map(
                (item: any, index: any) => ({
                  ...item,
                  uniqueId: index,
                })
              );

              setData1(updatedData);
              setDataSources(updatedData);
              setStats1(res?.response?.stats);
            } else if (activeKey === '2') {
              const updatedData = res?.response?.data.map(
                (item: any, index: any) => ({
                  ...item,
                  key: index,
                  uniqueId: index,
                })
              );
              setData2(updatedData);
              setDataSources(updatedData);
              setStats2(res?.response?.stats);
            } else {
              const updatedData = res?.response?.data.map(
                (item: any, index: any) => ({
                  ...item,
                  key: index,
                  uniqueId: index,
                })
              );
              setData3(updatedData);
              setDataSources(updatedData);
              setStats3(res?.response?.stats);
            }
          } else {
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSuperTabChange = (activeKey: any) => {
    fetchSuperData(activeKey, company.value, financialYear);
    setActiveKey(activeKey);
    setEditing(false);
    dispatch(setExpandedKeys([]));
    setEditing(false);
    dispatch(updateSelectedRowKeys([]));
    dispatch(setSelectedRowKeys([]));
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      fetchSuperData(activeKey, company.value, financialYear);
    }
  }, [activeKey]);

  const editData = (entity: any, finalEditList: any) => {
    setIsLoading(true);
    dispatch(setSelectedRowKeys([]));
    let tabTybe;
    if (activeKey === '1') {
      tabTybe = 'employee_number';
    } else if (activeKey === '2') {
      tabTybe = 'employee_turnover';
    } else {
      tabTybe = 'employee_new_hire';
    }

    //const tabTybe =

    if (isEmpty(finalEditList) && finalEditList) {
      message.warning('Please edit before update');
    } else {
      const body = {
        entity_Id: entity,
        entity_role: user.role,
        data_type: tabTybe,
        updatedValue: finalEditList,
      };

      put(`/employee/employee_related_data_edit/`, body)
        .then((res: any) => {
          message.success(`${!isEmpty(res?.message) && res?.message}`);
          fetchData(activeKey);
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          message.error(`${!isEmpty(err?.message) && err?.message}`);
        })
        .finally(() => {
          fetchData(activeKey);
          setComment('');
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          setIsLoading(false);
          setEditList([]);
        });
    }

    setIsLoading(false);
  };

  const statusApis = [
    '/employee/update_employee_number_status/',
    '/employee/update_employee_turnover_status/',
    '/employee/update_employee_new_hire_status/',
  ];

  const deleteApis = [
    'employee/manage_deletion_for_emp_no',
    'employee/manage_deletion_for_emp_turnover',
    'employee/manage_deletion_for_emp_newhire',
  ];
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

    const url = `${deleteApis[+activeKey - 1]}/`;

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
        fetchData(activeKey);
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

  const handleStatusApi = (idsLst: any, statusValue: any) => {
    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }
    let body;
    const hasNullValues = selectedRows.some(
      (item: any) => item.emissions_kg_co2e === null
    );
    if (hasNullValues) {
      message.warning('Please calulate the values');
    } else {
      const path = statusApis[parseInt(activeKey) - 1];
      body = {
        entity_Id: user.entity_Id,
        ids: ids,
        status: statusValue,
      };
      put(`${path}`, body)
        .then((res: any) => {
          fetchData(activeKey);
          message.success(
            !isEmpty(res?.message) ? res?.message : 'Successfully Updated'
          );
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          message.error(
            !isEmpty(err?.response?.data.message)
              ? err?.response?.data.message
              : 'Something Went Wrong'
          );
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .finally(() => {
          fetchData(activeKey);
        });
    }
  };
  const handleRevert = (idsLst: any) => {
    handleStatusApi(idsLst, revertstatusMessage);
  };

  const handleApprove = (idsLst: any) => {
    handleStatusApi(idsLst, forwardstatusMessage);
  };

  const [comment, setComment] = useState('');
  const [editList, setEditList] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editMap, setEditMap] = useState<{ [key: string]: boolean }>({});

  const allowedStatuses = roleStatusMapping[user.role] || new Set();

  const handleCellClick = (key: any) => {
    setEditing(true);
  };

  const handleSave = (record: any) => {
    const { male, female, age_lt_30, age_30_to_50, age_gt_50 } = record;
    const sumGender = male + female;
    const sumAges = age_lt_30 + age_30_to_50 + age_gt_50;

    if (sumGender !== sumAges) {
      message.warning('Sum of genders does not equal sum of ages.');
    } else {
      const newItem = {
        ...record,
        comment: comment,
      };

      if (activeKey === '1') {
        const indexToModify = data1.findIndex(
          (item: any) => item.id === record.id
        );
        data1[indexToModify] = record;
        setData1([...data1]);
      } else if (activeKey === '2') {
        const indexToModify = data2.findIndex(
          (item: any) => item.id === record.id
        );
        data2[indexToModify] = record;
        setData2([...data2]);
      } else if (activeKey === '3') {
        const indexToModify = data3.findIndex(
          (item: any) => item.id === record.id
        );
        data3[indexToModify] = record;
        setData3([...data3]);
      }

      const finalEditList = Object.values(
        removeDuplicates([...editList, newItem])
      );

      setEditList(finalEditList);
      editData(user.entity_Id, finalEditList);
      dispatch(setExpandedKeys([]));
      setSelectedRowKeys([]);
      setComment('');
      setEditMap({
        ...editMap,
        [getRowIdFromUniqueId(record.uniqueId, dataSources)]: false,
      });
      setEditing(false);
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

  const handleEditClick = (key: string) => {
    setEditMap((prevEditMap) => {
      const newEditMap: any = {};
      newEditMap[key] = true;
      return newEditMap;
    });
    setEditing(!editing);
  };

  useEffect(() => {
    dispatch(setFacilitySelected(''));
  }, [window.location.href]);

  const [entityData, setEntityData] = useState<any>([]);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const fetchEnityData = (apiUrl: any) => {
    setIsLoading(true);
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
      .finally(() => setIsLoading(false));
  };
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

  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');

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
  const [facilityList, setFacilityList] = useState([]);
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

  const getObjectById = (array: any, id: any) => {
    return array.find((item: any) => item.id === id);
  };
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

  useEffect(() => {
    if (!isEmpty(facilityList) && facilityList) {
      if (!facilityOptions.length) {
        getApiFacility();
      }
    }
  }, [facilityList]);

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

  const generatedColumns = (columns: any[]) =>
    columns
      ?.map((column: any) => {
        const { title, dataIndex, key, type, options } = column;

        const renderFunction = (text: any, record: any, rowIndex: any) => {
          if (
            editMap[getRowIdFromUniqueId(record.uniqueId, dataSources)] &&
            editing
          ) {
            if (type === 'input') {
              return (
                <div>
                  <Input
                    style={{ width: '80px' }}
                    type="number"
                    defaultValue={
                      !isEmpty(record[dataIndex]) && record[dataIndex]
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

                      setDataSources(updatedData);
                    }}
                  />
                </div>
              );
            } else if (type === 'select') {
              return (
                <div>
                  <Select
                    defaultValue={!isEmpty(text) && text}
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

                      setDataSources(updatedData);
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
                <span style={{ textTransform: 'capitalize' }}>{text}</span>
              );
            }
          } else {
            return (
              <span style={{ textTransform: 'capitalize' }}>
                {!isEmpty(record[dataIndex]) && record[dataIndex]}
              </span>
            );
          }
        };

        const { filters, onFilter, filteredValue } = generateFiltersAndOnFilter(
          column,
          dataSources,
          filteredInfo
        );

        if (dataIndex !== 'status') {
          return {
            title: title,
            dataIndex: dataIndex,
            key: key,
            render: renderFunction,
            ...((dataIndex === 'employee_type' ||
              dataIndex === 'turnover_type' ||
              dataIndex === 'hiring_type') && {
              filteredValue,
              filters,
              onFilter,
            }),
          };
        }

        if (dataIndex === 'status') {
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
      .filter(Boolean) || [];

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

  return (
    <>
      {/* <h4 className="pageTitle mt-4 mb-4">
        Reporting Period Employee Demographics
      </h4> */}
      <PageCardComponent customClass={styles.pageCardStyle}>
        {user.role === 'SUPER_ADMIN' && <Row className="mt-4"></Row>}
        <Row
          justify="end"
          align="middle"
          className="d-flex justify-content-end"
        >
          <Col
            className={`d-flex align-items-center ${styles.customPaddingRight}`}
          >
            {user.role !== 'SUPER_ADMIN' && <EmployeePdf />}
          </Col>

          <Row className="d-flex justify-content-end">
            {user.role !== 'SUPER_ADMIN' && (
              <>
                <div className={styles.facilityLabel}>Facility :</div>
                <Select
                  className={styles.facilityDropdown}
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
                style={{ float: 'right', zIndex: '99' }}
                onClick={() => navigate('/employeeForm', { state: activeKey })}
              >
                Add +
              </ButtonComponent>
            )}
          </Row>
        </Row>

        <div>
          <Tabs
            defaultActiveKey={activeKey}
            onChange={
              user?.role === 'SUPER_ADMIN'
                ? handleSuperTabChange
                : handleTabChange
            }
            className={`employee ${user.role === 'DATA_PROVIDER' ? styles.employeeMargin : styles.employeeDrMargin}`}
          >
            {formProps.map((props, index) => (
              <TabPane tab={props.title} key={String(index + 1)}>
                <Row gutter={[20, 20]} justify="center" align="middle">
                  {props?.countCardData?.map((card: any, index: any) => (
                    <Col xl={4} lg={6} md={10} sm={12} xs={24} key={index}>
                      <div
                        style={{
                          backgroundColor: '#0D304A',
                          borderRadius: '16px',
                          padding: '20px',
                          width: '100%', // changed from fixed 220px to full column width
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
                          {card.title}
                        </h5>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#fff',
                          }}
                        >
                          {card.value}
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>

                <Spin spinning={isLoading}>
                  <Row className={styles.customPaddingTop}>
                    <TableComponent
                      onchange={handleChange}
                      postFilterRecords={postFilterRecords}
                      handleRevert={handleRevert}
                      handleApprove={handleApprove}
                      expandableRowRenderer={expandedRowContent}
                      onHandleDelete={handleDelete}
                      maxApproverLevel={maxApproverLevel}
                      maxReviewerLevel={maxReviewerLevel}
                      isNewDelte={true}
                      isRowExpand={true}
                      data={props?.datasources || []}
                      enableRowSelection={false}
                      allowedStatuses={allowedStatuses}
                      columnHeader={[...generatedColumns(props?.columns || [])]}
                      showOnlyCount={false}
                      columnCheckBoxDataAttribute="key"
                      noText={
                        user.role === 'SUPER_ADMIN'
                          ? `No Approved Data for this Reporting Period`
                          : null
                      }
                    />
                  </Row>
                </Spin>
              </TabPane>
            ))}
          </Tabs>
          {user.role === 'SUPER_ADMIN' && (
            <>
              <Row justify="end" className={styles.customPaddingTop}>
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
        </div>
      </PageCardComponent>
    </>
  );
};

export default TabDataView;
