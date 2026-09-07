import { useState, useEffect } from 'react';
import { Row, Col, Spin, message, Select } from 'antd';
import {
  PageCardComponent,
  ButtonComponent,
  TableComponent,
  ModalComponent,
} from '../../DesignLibrary';
import Styles from '../Governance/governance.module.scss';
import { apiBaseUrl, get, post, put } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { useAuth } from '../../Hooks/useAuth';

import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../Redux/Actions';
import { useNotification } from '../../Hooks/useNotification';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import EffuentsPdf from './EffuentsPDF';
import {
  getRowIdFromUniqueId,
  removeElementByValue,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from '../../Components/Emissions/Scope3/Helpers';
import Triangle from '../../assets/Svg/Emissions/triange';
import UpdateSection from '../../Components/content/UpdateSection';
import { formatNumberUS } from '../../Utils/Strings';

interface Disclosure {
  disclosure: string;
  file_name: string;
  id: number;
  total_effluents_discharged: number;
  tCO2e: number; // Using number to represent the tCO₂e value
}
interface EditItem {
  id: number;
  uuid: any;
  total_effluents_discharged: any;
  comment: string;
}

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
});

export default function EffluentsList({}: any) {
  const location = useLocation();
  const { company, financialYear } = location.state || {};

  const [effluentsData, setEffluentsData] = useState<any>();
  const [tabIndex, setTabIndex] = useState(0);
  const [editList, setEditList] = useState<EditItem[]>([]);
  const [tableData, setTableData] = useState<any>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { openToast } = useNotification();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedRowEdit, setSetSelectedRowEdit] = useState<Disclosure>();
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [attachement, setAttachement] = useState(null);
  const [selectedDataIndex, setSelectedDataIndex] = useState<any>();
  const [comment, setComment] = useState('');
  const [entityData, setEntityData] = useState<any>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  const fetchEnityData = (apiUrl: any) => {
    get(apiUrl)
      .then((res) => {
        if (
          !isEmpty(res?.response?.status) &&
          res?.response?.status !== false
        ) {
          setEntityData(!isEmpty(res?.response?.data) && res?.response?.data);
        }
      })
      .catch((err) => console.error(err));
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

    const url = `/effluents/manage_deletion_for_effluents/`;

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

  useEffect(() => {
    resetFilters();
    setShowUpdateSection(true);
  }, [window.location.href]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (entityData.length && facilitySelected !== '') {
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
  const allowedStatuses = roleStatusMapping[user.role] || new Set();

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
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);
  const valueToDisplayForRevert =
    currentRole?.includes('REVIEWER') && currentLevelIndex > 0
      ? roleLevels?.reviewer[currentLevelIndex - 1]
      : currentRole?.includes('APPROVER')
        ? currentLevelIndex <= 0
          ? roleLevels?.reviewer[maxReviewerLevelIndex]
          : roleLevels?.approver[currentLevelIndex - 1] || ''
        : 'DATA_PROVIDER';

  const valueToDisplayForForward: any = currentRole.includes('REVIEWER')
    ? currentLevelIndex < roleLevels.reviewer.length - 1 &&
      currentLevelIndex !== maxReviewerLevelIndex
      ? roleLevels?.reviewer[currentLevelIndex + 1]
      : roleLevels?.approver[0]
    : currentRole.includes('APPROVER')
      ? currentLevelIndex < roleLevels.approver.length - 1 &&
        currentLevelIndex !== maxApproverLevelIndex
        ? roleLevels.approver[currentLevelIndex + 1]
        : 'Approved'
      : roleLevels.reviewer[0];

  const getApiFacility = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      let data = !isEmpty(response?.response?.data) && response?.response?.data;

      setFacilityOptions(data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const handleRemove = (record: any, file_name: any, uuid: any) => {
    if (selectedRecord && selectedRecord.disclosure && file_name && uuid) {
      const update = { ...record };
      removeElementByValue(update.disclosure, file_name);
      removeElementByValue(update.disclosure_uuids, uuid);
      setSelectedRecord(update);
    }
  };

  useEffect(() => {
    if (
      !isEmpty(facilityList?.length) &&
      facilityList?.length &&
      user?.role !== 'SUPER_ADMIN'
    ) {
      getApiFacility();
    }
  }, [facilityList, user?.role]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      const fetchFaclityData = () => {
        get(`/facility/get_Facility/?entity_Id=${user.entity_Id}`)
          .then((res: any) => {
            if (
              !isEmpty(res?.response?.status) &&
              res?.response?.status !== false
            ) {
              if (!isEmpty(res?.response?.data) && res?.response?.data) {
                setFacilityList(
                  !isEmpty(res?.response?.data) && res?.response?.data
                );
              }
            } else {
              setFacilityList([]);
              openToast({
                content: `${!isEmpty(res?.message) && res?.message}`,
                type: 'error',
              });
            }
          })
          .catch((err) => console.log(err));
      };
      fetchFaclityData();
    }
  }, []);

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

  const getNotApprovedIds = (data: any) => {
    const notApprovedIds: number[] = [];
    Object.keys(data).forEach((month) => {
      const details = data[month];
      if (typeof details === 'object' && details?.status !== 'Approved') {
        if (details?.id !== undefined) {
          notApprovedIds.push(details.id);
        }
      }
    });
    return notApprovedIds;
  };

  const haveAllSpace = (str: string) => {
    if (str === '') return false;
    const space = str.split(' ').length - 1;
    return space === str.length;
  };

  const getFatInjurires = async () => {
    try {
      setLoading(true);
      const res = await get(
        `/effluents/fetch-data-for-effluents?entity_Id=${user?.entity_Id}&facility_Id=${facilitySelected}`
      );
      const resData = res?.response?.data;
      if (!isEmpty(resData)) {
        const updatedData = resData?.map((item: any, index: any) => ({
          ...item,

          uniqueId: index,
        }));
        const transformedData = updatedData.map((item: any) => ({
          ...item,
          primary: item.primary[0],
          secondary: item.secondary[0],
          tertiary: item.tertiary[0],
        }));

        setEffluentsData(transformedData);
      } else {
        // Explicitly clear the table data if the response is null or empty
        setEffluentsData([]);
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  const getSuperFatInjurires = async (entityId: any, financialYear: any) => {
    try {
      setLoading(true);
      const res = await get(
        `/effluents/super_fetch_data_for_effluents/?entity_Id=${entityId}&financial_year=${financialYear}`
      );
      const resData = res?.response?.data;
      if (!isEmpty(resData)) {
        const updatedData = resData?.map((item: any, index: any) => ({
          ...item,

          uniqueId: index,
        }));
        const transformedData = updatedData.map((item: any) => ({
          ...item,
          primary: item.primary[0],
          secondary: item.secondary[0],
          tertiary: item.tertiary[0],
        }));

        setEffluentsData(transformedData);
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      getSuperFatInjurires(company.value, financialYear);
    }
  }, [user?.role]);

  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );

  const handleStatusApi = (idsLst: any, statusValue: any) => {
    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        const notApprovedIds = getNotApprovedIds(item);
        const rowData = {
          id: item.id,
          month_ids: notApprovedIds,
        };

        ids.push(rowData);
      });
    }

    let body;

    const hasNullValues = selectedRows.some(
      (item: any) => item.emissions_kg_co2e === null
    );
    if (hasNullValues) {
      message.warning('Please calulate the values');
    } else {
      const path = 'effluents/update-effluent-status/';
      body = {
        entity_Id: user?.entity_Id,
        ids: ids,
        status: statusValue,
      };
      put(`${path}`, body)
        .then((res: any) => {
          getFatInjurires();
          message.success(`${res?.message}`);
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          message.error(err?.response?.data.message);
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .finally(() => {});
    }
  };

  const handleCellClick = (key: any, month: any) => {
    if (showUpdateSection === true) {
      setSelectedDataIndex(month);
      if (selectedDataIndex === month) {
        setShowUpdateSection(false);
      }
    } else {
      setShowUpdateSection(true);
      setSelectedDataIndex(firstMonthName);
    }
  };

  const dynamicCol = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      defaultSortOrder: 'descend',
      filters:
        !isEmpty(effluentsData) &&
        effluentsData
          .map((entry: any) => entry.status)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          ) // Keeping only unique values
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          })),
      onFilter: (value: any, record: any) =>
        !isEmpty(record) &&
        !isEmpty(record.status) &&
        record.status.indexOf(value) === 0,
      filteredValue: (!isEmpty(filteredInfo) && filteredInfo.status) || null,
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
              : failureStatuses.includes(status)
                ? 'failure'
                : warningStatuses.includes(status)
                  ? 'warning'
                  : 'warning'
          }
        />
      ),
    },
    {
      title: 'Primary',
      dataIndex: 'primary',
      key: 'primary',
      filters:
        !isEmpty(effluentsData) &&
        effluentsData
          .map((entry: any) => entry.primary)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          ) // Keeping only unique values
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          })),
      onFilter: (value: any, record: any) =>
        !isEmpty(record) &&
        !isEmpty(record.primary) &&
        record.primary.indexOf(value) === 0,
      filteredValue: (!isEmpty(filteredInfo) && filteredInfo.primary) || null,
      render: (record: any) => {
        return <>{record}</>;
      },
    },

    {
      title: 'Secondary',
      dataIndex: 'secondary',
      key: 'secondary',
      filters:
        !isEmpty(effluentsData) &&
        effluentsData
          .map((entry: any) => entry.secondary)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          ) // Keeping only unique values
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          })),
      onFilter: (value: any, record: any) =>
        !isEmpty(record) &&
        !isEmpty(record.secondary) &&
        record.secondary.indexOf(value) === 0,
      filteredValue: (!isEmpty(filteredInfo) && filteredInfo.secondary) || null,
      render: (record: any) => {
        return <>{record}</>;
      },
    },
    {
      title: 'Tertiary',
      dataIndex: 'tertiary',
      key: 'tertiary',
      filters:
        !isEmpty(effluentsData) &&
        effluentsData
          .map((entry: any) => entry.tertiary)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          ) // Keeping only unique values
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          })),
      onFilter: (value: any, record: any) =>
        !isEmpty(record) &&
        !isEmpty(record.tertiary) &&
        record.tertiary.indexOf(value) === 0,
      filteredValue: (!isEmpty(filteredInfo) && filteredInfo.tertiary) || null,
      render: (record: any) => {
        return <>{record}</>;
      },
    },
    // {
    //   title: 'Total Quantity',
    //   dataIndex: 'total_effluents_in_cubic_meters',
    //   key: 'total_effluents_in_cubic_meters',
    //   render: (record: any) => {
    //     return <>{record}</>;
    //   },
    // },
    {
      title: 'Total Quantity',
      key: 'total_effluents_discharged',
      render: (record: any) => {
        if (!record) return <>0</>; // Handle undefined or null record

        const monthlyKeys = Object.keys(record).filter(
          (key) => key.match(/^\w{3}-\d{2}$/) // Matches keys like "Jan-24", "Feb-24", etc.
        );

        const totalDischarged = monthlyKeys.reduce((sum, key) => {
          const value = parseFloat(
            record[key]?.total_effluents_discharged || 0
          );
          return sum + (isNaN(value) ? 0 : value); // Ensure numeric addition
        }, 0);

        return <>{formatNumberUS(totalDischarged)}</>;
      },
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      filters:
        !isEmpty(effluentsData) &&
        effluentsData
          .map((entry: any) => entry.uom)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          ) // Keeping only unique values
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          })),
      onFilter: (value: any, record: any) =>
        !isEmpty(record) &&
        !isEmpty(record.uom) &&
        record.uom.indexOf(value) === 0,
      filteredValue: (!isEmpty(filteredInfo) && filteredInfo.uom) || null,
      render: (record: any) => {
        return <>{record ? record : ''}</>;
      },
    },
  ];

  const handleEditUploadFile = (info: any) => {
    if (
      !isEmpty(info) &&
      !isEmpty(info?.file) &&
      !isEmpty(info?.file?.status) &&
      info?.file?.status !== 'uploading'
    ) {
    }
    if (
      !isEmpty(info) &&
      !isEmpty(info?.file) &&
      !isEmpty(info?.file?.status) &&
      info?.file?.status === 'done'
    ) {
      setUploadedFileName(info?.file?.name);

      openToast({
        content: `${info?.file?.name}`,
        type: 'success',
      });

      const UID =
        !isEmpty(info) &&
        !isEmpty(info?.file) &&
        !isEmpty(info?.file?.response) &&
        !isEmpty(info?.file?.response?.response) &&
        info?.file?.response?.response?.data;

      setAttachement(UID);
      const updatedRec = { ...selectedRecord };
      if (updatedRec.disclosure !== null) {
        updatedRec.disclosure.push(info?.file?.name);
        setSelectedRecord(updatedRec);
      }

      if (updatedRec.disclosure_uuids == null) {
        updatedRec.disclosure_uuids = [];
      }

      updatedRec.disclosure_uuids.push(UID);
      setSelectedRecord(updatedRec);
    }
  };
  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getFatInjurires();
      dispatch(setFacilitySelected(''));
    }
  }, []);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getFatInjurires();
    }
  }, [facilitySelected]);

  // Function to handle filter changes
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

  const resetFilters = () => {
    setFilteredInfo({});
  };

  const handleRevert = (idsLst: any) => {
    handleStatusApi(idsLst, revertstatusMessage);
  };

  const handleApprove = (idsLst: any) => {
    handleStatusApi(idsLst, forwardstatusMessage);
  };
  useEffect(() => {
    setShowUpdateSection(true);

    if (!isEmpty(effluentsData) && expandedKeys.length > 0) {
      const foundObject = effluentsData.find(
        (item: any) => item.id === expandedKeys[0]
      );
      setSelectedRecord(foundObject);
      const months = Object.entries(foundObject).filter(
        ([key, value]) =>
          key.includes('-') && (value as any).total_effluents_discharged > 0
      );
      const firstMonthWithWaste = months.length > 0 ? months[0][0] : null;
      setSelectedDataIndex(firstMonthWithWaste);
    }
  }, [expandedKeys]);

  const columnDefinitions = Object.keys(
    effluentsData && effluentsData[0] !== undefined ? effluentsData[0] : {}
  )
    .filter((key) => /^[A-Za-z]{3}-\d{2}$/.test(key))
    .map((month, index) => ({
      title: month,
      dataIndex: month,
      key: index,
      className: 'cellWidth',
      align: 'center',
      ellipsis: true,
    }));

  const firstMonthName =
    columnDefinitions.length > 0 ? columnDefinitions[0].title : null;

  const handleSaveClick = (record: any, index: any) => {
    const path = 'effluents/edit-effluents-data';
    let editableDivValue: string | null = null;

    const element = document.getElementById(
      `editable-cell-${index}-${selectedDataIndex}`
    );

    editableDivValue = element ? element?.textContent : null;

    if (
      editableDivValue === null ||
      editableDivValue === '0' ||
      parseFloat(editableDivValue) <= 0 ||
      editableDivValue === ''
    ) {
      message.warning("The values can't be '0' or empty");
    } else {
      const sanitizedValue = editableDivValue.replace(/,/g, '');
      const newItem: any = {
        id: record && record[selectedDataIndex].id,
        uuid: attachement ? attachement : '',
        total_effluents_discharged: sanitizedValue,
        comment: comment,
      };
      const updates = [newItem];
      const body = {
        entity_Id: user.entity_Id,
        entity_role: user.role,
        disclosure: selectedRecord.disclosure_uuids,
        updates,
      };

      if (
        selectedRecord.disclosure_uuids !== null &&
        selectedRecord.disclosure_uuids &&
        selectedRecord.disclosure_uuids.length !== 0
      ) {
        put(`${path}/`, body)
          .then((res: any) => {
            openToast({
              content: `${!isEmpty(res?.message) && res?.message}`,
              type: 'success',
            });

            dispatch(setSelectedRowKeys([]));
            dispatch(updateSelectedRowKeys([]));
            setAttachement(null);
          })
          .catch((err) => {
            setAttachement(null);
            openToast({
              content: `${!isEmpty(err?.message) && err?.message}`,
              type: 'error',
            });
          })
          .finally(() => {
            setComment('');
            dispatch(setSelectedRowKeys([]));
            dispatch(updateSelectedRowKeys([]));
            setAttachement(null);
            setEditList([]);
            setSelectedDataIndex(firstMonthName);
            setAttachement(null);
            setComment('');
            setShowUpdateSection(false);
            getFatInjurires();
          });
      } else {
        message.warning('Please make sure to have atleast one disclosure');
      }
    }
  };

  const expandedRowContent = (record: any, index: any) => {
    return (
      <div className="p-2">
        <Row gutter={10} className="p-2">
          <Col span={2}>
            <p className={Styles.qtyHeader}>Months:</p>
            <p className={Styles.qtyHeader}>Quantity:</p>
          </Col>
          <Col span={22}>
            <Row gutter={10}>
              {columnDefinitions.map((col) => {
                return (
                  <Col style={{ width: '100px' }}>
                    <p>{col.title}</p>
                    <p>
                      <div
                        style={{
                          display:
                            record[col.dataIndex].total_effluents_discharged ===
                            0
                              ? 'none'
                              : 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          id={`editable-cell-${index}-${col.dataIndex}`}
                          contentEditable={
                            record.contentEditable &&
                            selectedDataIndex === col.dataIndex
                          }
                          className={
                            record.contentEditable &&
                            selectedDataIndex === col.dataIndex
                              ? 'editable-cell-focused'
                              : ''
                          }
                          onClick={() => {
                            const element: any = document.getElementById(
                              `editable-cell-${index}-${selectedDataIndex}`
                            );
                            const span = element.querySelector('span');
                            span.textContent = formatter.format(
                              record[selectedDataIndex]
                                .total_effluents_discharged
                            );
                            setUploadedFileName('');
                            setSetSelectedRowEdit(record[col.dataIndex]);
                            const isFocused =
                              record.contentEditable &&
                              selectedDataIndex === col.dataIndex;
                            if (!isFocused && !showUpdateSection) {
                              handleCellClick(
                                getRowIdFromUniqueId(
                                  record.uniqueId,
                                  effluentsData
                                ),
                                col.dataIndex
                              );
                              let test = [...effluentsData];
                              test[index].contentEditable = false;
                              setEffluentsData(test);
                            }
                            setSelectedDataIndex(col.dataIndex);

                            setAttachement(record[col.dataIndex].disclosure);
                          }}
                          style={{
                            color: 'blue',
                            cursor: 'pointer',
                            marginLeft: '8px', // Space between quantity and icon
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLElement;
                            let currentText = target.innerText;
                            if (currentText.includes('-')) {
                              openToast({
                                content: `Negative values are not allowed`,
                                type: 'warning',
                              });

                              currentText = currentText.replace(/-/g, '');
                              target.innerText = currentText;
                            }
                          }}
                        >
                          {record[col.dataIndex].total_effluents_discharged &&
                          getNotApprovedIds(record).includes(
                            record[col.dataIndex]?.id
                          ) ? (
                            <span style={{ color: '#B8961D' }}>
                              {formatter.format(
                                record[col.dataIndex].total_effluents_discharged
                              )}
                            </span>
                          ) : (
                            <span style={{ color: '#098E7E' }}>
                              {formatter.format(
                                record[col.dataIndex].total_effluents_discharged
                              )}
                            </span>
                          )}
                        </div>
                        {showUpdateSection &&
                          selectedDataIndex === col.dataIndex && (
                            <div>
                              <Triangle />
                            </div>
                          )}
                      </div>
                    </p>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>

        {showUpdateSection && (
          <>
            <UpdateSection
              uploadedFileName={uploadedFileName}
              selectedRowEdit={selectedRowEdit}
              handleEditUploadFile={handleEditUploadFile}
              selectedRecord={
                Object.keys(selectedRecord).length > 0 ? selectedRecord : record
              }
              handleRemove={handleRemove}
              comment={comment}
              setComment={setComment}
              selectedDataIndex={
                isEmpty(selectedDataIndex) ? firstMonthName : selectedDataIndex
              }
              record={record}
              tableData={effluentsData}
              index={index}
              setTableData={setEffluentsData}
              handleSaveClick={handleSaveClick}
              allowedStatuses={allowedStatuses}
              getNotApprovedIds={getNotApprovedIds}
              maxReviewerLevel={maxReviewerLevel}
              maxApproverLevel={maxApproverLevel}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* <div className={Styles.governanceHeader}>Effluents</div> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Spin spinning={loading}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Row justify="end">
                {user.role !== 'SUPER_ADMIN' && <EffuentsPdf></EffuentsPdf>}
                {user.role !== 'SUPER_ADMIN' && (
                  <>
                    <div className={Styles.facilityLabel}>Facility :</div>
                    <Select
                      className={Styles.facilityDropdown}
                      placeholder={
                        facilitySelected ? undefined : 'Facility Name'
                      }
                      value={facilitySelected}
                      onChange={(selectedOption) =>
                        dispatch(setFacilitySelected(selectedOption))
                      }
                    >
                      {!isEmpty(facilityOptions) &&
                        facilityOptions?.map((facility: any) => (
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
                    className="ml-3"
                    disabled={!(hasPermissionToAdd && facilitySelected !== '')}
                    onClick={() => navigate('/environment/effluents-form')}
                  >
                    Add +
                  </ButtonComponent>
                )}
              </Row>
            </Col>
          </Row>
          <Row className={Styles.tableMarginTop}>
            <Col span={24}>
              {
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
                  data={effluentsData === null ? [] : effluentsData}
                  enableRowSelection={false}
                  allowedStatuses={allowedStatuses}
                  columnHeader={dynamicCol}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                  noText={
                    user.role === 'SUPER_ADMIN'
                      ? `No Approved Data for this Reporting Period`
                      : null
                  }
                />
              }
            </Col>
          </Row>
          {user.role === 'SUPER_ADMIN' && (
            <>
              <Row justify="end" className="mt-2">
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
        </Spin>
      </PageCardComponent>
    </>
  );
}
