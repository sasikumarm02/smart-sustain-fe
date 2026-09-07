import React, { useEffect, useState } from 'react';
import { Col, message, Row, Select, Tabs } from 'antd';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';

import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../../Hooks/useAuth';
import CountCardComponent from '../../../DesignLibrary/CountCardComponent';

import WaterGenerated from '../../../assets/Svg/Environment/WaterGenerated';
import WaterRecycled from '../../../assets/Svg/Environment/WaterRecycled';
import WaterDisposed from '../../../assets/Svg/Environment/WaterDisposed';

import Styles from './Enviroment.module.scss';
import axios from 'axios';
import { apiBaseUrl, get, post, put } from '../../../Services';
import StatusComponent from '../../../DesignLibrary/StatusComponent';
import { WastePDF } from './WastePDF';
import { useNotification } from '../../../Hooks/useNotification';
import { useSelector } from 'react-redux';

import {
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { formatNumberUS } from '../../../Utils/Strings';

import {
  getRowIdFromUniqueId,
  removeElementByValue,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from '../Scope3/Helpers';
import UpdateSection from '../../content/UpdateSection';
import Triangle from '../../../assets/Svg/Emissions/triange';
import { isEmpty } from '../../../Utils/isEmpty';

const { TabPane } = Tabs;

interface ResponseData {
  dataSource: any[];
  waterCubic: number;
  waterMega: number;
  wasteGenerated: number;
  wasteDiverted: number;
  wasteDisposed: number;
  totalIncidents: number;
}

interface APIResponseData {
  Recycled: ResponseData;
  Disposed: ResponseData;
}

interface Disclosure {
  disclosure: string;
  file_name: string;
  id: number;
  waste_in_tonnes: number;
  tCO2e: number;
}
interface EditItem {
  id: number;
  uuid: any;
  waste_in_tonnes: any;
  disclosure: string;
  comments: string;
}

const formatData = (response: any) => {
  return {
    dataSource: response.data,
    waterCubic: response.water_consumed_in_cubic_metres ?? 0,
    waterMega: response.water_consumed_in_mega_litres ?? 0,
    wasteGenerated: response.total_waste_generated ?? 0,
    wasteDiverted: response.total_waste_diverted ?? 0,
    wasteDisposed: response.total_waste_disposed ?? 0,
    totalIncidents: response.total_no_of_incidents ?? 0,
  };
};

const EnvironmentTable = ({ btnPath, cateTitle, tableData, type }: any) => {
  const [apiData, setApiData] = useState({
    data: [],
    overall_disposed: 0,
    overall_recycled: 0,
    overall_waste: 0,
  });
  const [dataSource, setDataSource] = useState<any>([]);

  const [tabIndex, setTabIndex] = useState(0);
  const [editList, setEditList] = useState<EditItem[]>([]);
  const { openToast } = useNotification();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedRowEdit, setSetSelectedRowEdit] = useState<Disclosure>();
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [attachement, setAttachement] = useState(null);
  const [selectedDataIndex, setSelectedDataIndex] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [handleEdit, setHandleEdit] = useState<boolean>(false);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [entityData, setEntityData] = useState<any>([]);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<any>(
    location && location.state ? location.state : 'Recycled'
  );
  const [selectedRecord, setSelectedRecord] = useState<any>({});

  const { company, financialYear } = location.state || {};

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
    if (!isEmpty(location?.state)) {
      setActiveTab(!isEmpty(location?.state?.tab) && location?.state?.tab);
    }
  }, [location?.state]);
  useEffect(() => {
    dispatch(setFacilitySelected(''));
  }, []);
  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (!isEmpty(entityData?.length) && facilitySelected !== '') {
        const isFacilityPresent = entityData?.some((entity: any) => {
          const roleMatch =
            !isEmpty(entity?.entity_Role) &&
            entity?.entity_Role?.some((role: any) => {
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

  useEffect(() => {
    if (!isEmpty(entityData?.length) && facilitySelected !== '') {
      const isFacilityPresent = entityData?.some((entity: any) => {
        const roleMatch =
          !isEmpty(entity?.entity_Role) &&
          entity?.entity_Role?.some((role: any) => {
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
      (entityData && entityData[0] && entityData[0].max_DA) || ''
    );
    setMaxReviewerLevel(
      (entityData && entityData[0] && entityData[0].max_DR) || ''
    );
  }, []);

  const [currentRole, setCurrentRole] = useState(user.role);

  const [facilityList, setFacilityList] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  const getCurrentLevelIndex = (role: any) => {
    if (role?.includes('REVIEWER')) {
      return roleLevels?.reviewer?.indexOf(role);
    } else if (role?.includes('APPROVER')) {
      return roleLevels?.approver?.indexOf(role);
    }
    return -1;
  };

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

    const url = `waste/manage_deletion_for_waste/`;

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
        getApiData(activeTab);
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

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });

  const currentLevelIndex = getCurrentLevelIndex(currentRole);

  const getMaxLevelIndex = (roleType: any, maxLevel: any) => {
    return roleLevels[roleType as any].indexOf(maxLevel);
  };

  const maxReviewerLevelIndex = getMaxLevelIndex('reviewer', maxReviewerLevel);
  const maxApproverLevelIndex = getMaxLevelIndex('approver', maxApproverLevel);

  const allowedStatuses = roleStatusMapping[user.role] || new Set();

  const expandedKeys = useSelector((state: any) => state?.expandedRowkeys);
  const valueToDisplayForRevert =
    currentRole?.includes('REVIEWER') && currentLevelIndex > 0
      ? roleLevels?.reviewer[currentLevelIndex - 1]
      : currentRole?.includes('APPROVER')
        ? currentLevelIndex <= 0
          ? roleLevels?.reviewer[maxReviewerLevelIndex]
          : roleLevels?.approver[currentLevelIndex - 1] || ''
        : 'DATA_PROVIDER';

  const valueToDisplayForForward: any = currentRole?.includes('REVIEWER')
    ? currentLevelIndex < roleLevels?.reviewer?.length - 1 &&
      currentLevelIndex !== maxReviewerLevelIndex
      ? roleLevels?.reviewer[currentLevelIndex + 1]
      : roleLevels?.approver[0]
    : currentRole.includes('APPROVER')
      ? currentLevelIndex < roleLevels?.approver?.length - 1 &&
        currentLevelIndex !== maxApproverLevelIndex
        ? roleLevels?.approver[currentLevelIndex + 1]
        : 'Approved'
      : roleLevels?.reviewer[0];

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

  const failureStatuses = Object.values(statusMapForRevert);
  const warningStatuses = Object.values(statusMapForForward);

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

  const dispatch = useDispatch();
  const selectedRows = useSelector(
    (state: any) => state?.rowSelection?.selectedRowKeys
  );

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
    if (str.length === 0) return false;
    const space = str.split(' ').length - 1;
    return space === str.length;
  };

  const revertbtnLable =
    user.role === 'DATA_REVIEWER'
      ? 'Revert'
      : user.role === 'DATA_APPROVER'
        ? 'Reject'
        : null;

  const nextLevelLabel =
    user.role === 'DATA_REVIEWER'
      ? 'Submit for Approval'
      : user.role === 'DATA_APPROVER' && 'Approve';

  const revertStatusLabels =
    user.role === 'DATA_REVIEWER'
      ? 'For DP Revision'
      : user.role === 'DATA_APPROVER'
        ? 'Not Approved'
        : null;

  const nextStatusLabels =
    user.role === 'DATA_REVIEWER'
      ? 'For Approval'
      : user.role === 'DATA_APPROVER' && 'Approved';

  const apiResponse = async (wasteType: 'Recycled' | 'Disposed') => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/waste/get_waste_data/?entity_Id=${user.entity_Id}&waste_management_type=${wasteType}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      return response;
    } catch (err) {
      console.log(err);
    }
  };
  const flattenMonthlyData = (data: any) => {
    return data?.map((item: any) => {
      const { monthly_data, ...rest } = item;

      const flattenedMonthlyData = Object.entries(monthly_data).reduce(
        (acc: any, [month, values]) => {
          acc[month] = values;
          return acc;
        },
        {}
      );

      return { ...rest, ...flattenedMonthlyData };
    });
  };

  useEffect(() => {
    setShowUpdateSection(true);

    if (!isEmpty(dataSource) && expandedKeys.length > 0) {
      const foundObject = dataSource.find(
        (item: any) => item.id === expandedKeys[0]
      );
      setSelectedRecord(foundObject);
      const months = Object.entries(foundObject).filter(
        ([key, value]) =>
          key.includes('-') && (value as any).waste_in_tonnes > 0
      );

      const firstMonthWithWaste = months.length > 0 ? months[0][0] : null;
      setSelectedDataIndex(firstMonthWithWaste);
    }
  }, [expandedKeys]);

  const [showUpdateSection, setShowUpdateSection] = useState(false);

  const getApiData = async (wasteType: any) => {
    setDataSource([]);
    setApiData({
      data: [],
      overall_disposed: 0,
      overall_recycled: 0,
      overall_waste: 0,
    });
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/waste/get_waste_data/?entity_Id=${user.entity_Id}&waste_management_type=${wasteType}&facility_Id=${facilitySelected}`
      );
      const updatedData = flattenMonthlyData(response.response.data).map(
        (item: any, index: any) => ({
          ...item,
          uniqueId: index,
        })
      );
      setDataSource(updatedData);

      setApiData(response.response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getSuperApiData = async (
    entityId: any,
    wasteType: any,
    financialYear: any
  ) => {
    setDataSource([]);
    setApiData({
      data: [],
      overall_disposed: 0,
      overall_recycled: 0,
      overall_waste: 0,
    });
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/waste/super_get_waste_data/?entity_Id=${entityId}&waste_management_type=${wasteType}&financial_year=${financialYear}`
      );
      const updatedData = flattenMonthlyData(response.response.data).map(
        (item: any, index: any) => ({
          ...item,
          uniqueId: index,
        })
      );
      setDataSource(updatedData);

      setApiData(response.response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      const tab =
        activeTab === 'Recycled' || activeTab === 'Disposed'
          ? activeTab
          : 'Recycled'; // Fallback if activeTab is undefined/false
      getSuperApiData(company.value, tab, financialYear);
    }
  }, [user?.role, activeTab]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      getApiData(activeTab);
    }
  }, [activeTab, facilitySelected]);

  const recycledTableColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      defaultSortOrder: 'descend',
      filters:
        !isEmpty(dataSource) &&
        dataSource
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
      render: (status: string) => (
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
      title: 'Waste Category',
      dataIndex: 'waste_category',
      key: 'waste_category',
      filters: dataSource
        ?.map((entry: any) => entry.waste_category)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.waste_category?.indexOf(value) === 0,
      filteredValue: filteredInfo?.waste_category || null,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Waste Type',
      dataIndex: 'waste_type',
      key: 'waste_type',
      filters: dataSource
        ?.map((entry: any) => entry?.waste_type)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.waste_type?.indexOf(value) === 0,
      filteredValue: filteredInfo?.waste_type || null,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Recycled Process',
      dataIndex: 'recycling_process',
      key: 'recycling_process',
      filters: dataSource
        ?.map((entry: any) => entry?.recycling_process)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.recycling_process?.indexOf(value) === 0,
      filteredValue: filteredInfo?.recycling_process || null,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Total Recycled Waste in tonnes',
      dataIndex: 'total_waste',
      key: 'total_waste',
      render: (text: string) => <span>{formatNumberUS(text)}</span>,
    },
    // Monthly data columns
  ];

  const disposedTableColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      defaultSortOrder: 'descend',
      filters:
        !isEmpty(dataSource) &&
        dataSource
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
      render: (status: string) => (
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
              : failureStatuses?.includes(status)
                ? 'failure'
                : warningStatuses?.includes(status)
                  ? 'warning'
                  : 'warning'
          }
        />
      ),
    },
    {
      title: 'Waste Category',
      dataIndex: 'waste_category',
      key: 'waste_category',
      filters: dataSource
        ?.map((entry: any) => entry?.waste_category)
        .filter(
          (value: any, index: any, self: any) => self?.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record.waste_category.indexOf(value) === 0,
      filteredValue: filteredInfo?.waste_category || null,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Waste Type',
      dataIndex: 'waste_type',
      key: 'waste_type',
      filters: dataSource
        ?.map((entry: any) => entry?.disposal_method)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.waste_type?.indexOf(value) === 0,
      filteredValue: filteredInfo?.waste_type || null,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Disposal Method',
      dataIndex: 'disposal_method',
      key: 'disposal_method',
      filters: dataSource
        ?.map((entry: any) => entry?.disposal_method)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.disposal_method?.indexOf(value) === 0,
      filteredValue: filteredInfo?.disposal_method || null,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Total Disposed Waste in tonnes',
      dataIndex: 'total_waste',
      key: 'total_waste',

      render: (text: string) => formatter.format(Number(text)),
    },
    // Monthly data columns
  ];

  const columnDefinitions = Object.keys(
    dataSource && dataSource[0] !== undefined ? dataSource[0] : {}
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

  const expandedRowContent = (record: any, index: any) => {
    return (
      <div className="p-2">
        <Row gutter={10} className="p-2">
          <Col span={2} className={Styles.dataLabel}>
            <p className={Styles.qtyHeader}>Months:</p>
            <p className={Styles.qtyHeader}>Quantity:</p>
          </Col>
          <Col span={22}>
            <Row gutter={10}>
              {!isEmpty(columnDefinitions) &&
                columnDefinitions?.map((col) => {
                  return (
                    <Col className={Styles.monthData}>
                      <p className="mt-3 mb-3">{col.title}</p>
                      <p className="mt-3 mb-1">
                        <div
                          style={{
                            display:
                              record[col.dataIndex].waste_in_tonnes === 0
                                ? 'none'
                                : 'flex',
                            alignItems: 'center',
                            justifyContent: 'right',
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
                              const idPattern = `editable-cell-${index}-${selectedDataIndex}`;
                              const parentElement: any | null =
                                document.querySelector(
                                  `[id^="rc-tabs-"][id$="panel-${activeTab}"]`
                                );
                              const elements = parentElement?.querySelectorAll(
                                `[id^="${idPattern}"]`
                              );
                              const elementsArray = Array.from(elements);
                              const lastElement: any =
                                elementsArray[elementsArray.length - 1];
                              const span = lastElement.querySelector('span');
                              span.textContent = formatter.format(
                                record[selectedDataIndex].waste_in_tonnes
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
                                    dataSource
                                  ),
                                  col.dataIndex
                                );
                                let test = [...dataSource];
                                test[index].contentEditable = false;
                                setDataSource(test);
                              }
                              setSelectedDataIndex(col.dataIndex);
                            }}
                            style={{
                              color: 'blue',
                              cursor: 'pointer',
                              marginLeft: '8px', // Space between quantity and icon
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLElement;
                              let currentText = target.innerText;
                              if (/[a-zA-Z]/.test(currentText)) {
                                e.preventDefault();
                                openToast({
                                  content: `Alphabetic characters are not allowed`,
                                  type: 'warning',
                                });
                                currentText = currentText.replace(
                                  /[a-zA-Z]/g,
                                  ''
                                );
                                target.innerText = currentText;
                              }

                              if (currentText.includes('-')) {
                                openToast({
                                  content: `Negative values are not allowed`,
                                  type: 'warning',
                                });

                                currentText = currentText.replace(
                                  /[a-zA-Z]/g,
                                  ''
                                );
                                target.innerText = currentText;
                              }
                            }}
                          >
                            {record[col.dataIndex].waste_in_tonnes &&
                            getNotApprovedIds(record).includes(
                              record[col.dataIndex]?.id
                            ) ? (
                              <span style={{ color: '#B8961D' }}>
                                {formatter.format(
                                  record[col.dataIndex].waste_in_tonnes
                                )}
                              </span>
                            ) : (
                              <span style={{ color: '#098E7E' }}>
                                {formatter.format(
                                  record[col.dataIndex].waste_in_tonnes
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </p>
                      {showUpdateSection &&
                        selectedDataIndex === col.dataIndex && (
                          <div>
                            <Triangle />
                          </div>
                        )}
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
              handleRemove={handleRemove}
              comment={comment}
              setComment={setComment}
              selectedRecord={
                Object.keys(selectedRecord).length > 0 ? selectedRecord : record
              }
              selectedDataIndex={
                isEmpty(selectedDataIndex) ? firstMonthName : selectedDataIndex
              }
              record={record}
              tableData={dataSource}
              index={index}
              setTableData={setDataSource}
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

  const handleSaveClick = (record: any, index: any) => {
    const path = '/waste/update_waste_data';
    let editableDivValue: string | null = null;
    const idPattern = `editable-cell-${index}-${selectedDataIndex}`;
    const parentElement: any | null = document.querySelector(
      `[id^="rc-tabs-"][id$="panel-${activeTab}"]`
    );
    const elements = parentElement?.querySelectorAll(`[id^="${idPattern}"]`);
    const elementsArray = Array.from(elements);
    const lastElement: any = elementsArray[elementsArray.length - 1];
    editableDivValue = lastElement ? lastElement.textContent : null;
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
        waste_in_tonnes: sanitizedValue,

        comments: comment,
      };
      const updates = [newItem];
      const body = {
        entity_Id: user.entity_Id,
        entity_role: user.role,
        disclosure: selectedRecord.disclosure_uuids,
        updates,
      };

      put(`${path}/`, body)
        .then((res: any) => {
          openToast({
            content: `${res?.message}`,
            type: 'success',
          });
          getApiData(activeTab);
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          setAttachement(null);
        })
        .catch((err) => {
          setAttachement(null);

          openToast({
            content: `${err.message}`,
            type: 'error',
          });
        })
        .finally(() => {
          getApiData(activeTab);
          setComment('');
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          setAttachement(null);
          setEditList([]);
          setSelectedDataIndex(firstMonthName);
          setAttachement(null);
          setComment('');
          setShowUpdateSection(true);
        });
    }
  };

  const renderCards = () => {
    return (
      <>
        {/* <Row justify="end">
         
        </Row> */}
        <Row justify="space-between" align="middle" gutter={[0, 0]}>
          <Col span={user?.role === 'SUPER_ADMIN' ? 24 : 14}>
            <Row justify={'start'} style={{ gap: '15px' }}>
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
                  Total Waste Generated:
                </h5>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {`${apiData?.overall_waste != undefined ? formatter.format(apiData?.overall_waste) : '0'} tonnes`}
                </p>
              </div>

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
                  Total Waste Recycled:
                </h5>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {`${apiData?.overall_recycled != undefined ? formatter.format(apiData?.overall_recycled) : '0'} tonnes`}
                </p>
              </div>

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
                  Total Waste Disposed:
                </h5>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {`${apiData?.overall_disposed != undefined ? formatter.format(apiData?.overall_disposed) : '0'} tonnes`}
                </p>
              </div>
            </Row>
          </Col>
          <Col span={10} className={Styles.wasteColDiv}>
            {user.role !== 'SUPER_ADMIN' && (
              <WastePDF activeTab={activeTab}></WastePDF>
            )}
            {user.role !== 'SUPER_ADMIN' && (
              <>
                <div className={Styles.facilityLabel}>Facility :</div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <Select
                    className={Styles.facilityDropdown}
                    placeholder={facilitySelected ? undefined : 'Facility Name'}
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
                </div>
              </>
            )}
            {user.role === 'DATA_PROVIDER' && (
              <ButtonComponent
                disabled={!(hasPermissionToAdd && facilitySelected !== '')}
                onClick={() => navigate(btnPath, { state: activeTab })}
              >
                Add +
              </ButtonComponent>
            )}
          </Col>
        </Row>
      </>
    );
  };

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
    const path = '/waste/update-waste-status/';
    const body = {
      entity_Id: user.entity_Id,
      ids: ids,
      status: statusValue,
    };
    put(`${path}`, body)
      .then((res: any) => {
        message.success(res?.message);
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
      })
      .finally(() => {
        Promise.all([apiResponse('Recycled'), apiResponse('Disposed')]).then(
          (res) => {
            if (activeTab === 'Disposed') {
              setDataSource(flattenMonthlyData(res[1]?.data?.response?.data));
            } else {
              setDataSource(flattenMonthlyData(res[0]?.data?.response?.data));
            }
          }
        );
      });
  };

  const editData = (entity: any, path: string, updates: any) => {
    try {
      setLoading(true);
      let ids: { id: number; month_ids: number[] }[] = [];
      if (Array.isArray(selectedRows)) {
        selectedRows.forEach((item: any) => {
          const notApprovedIds = getNotApprovedIds(item);
          const rowData = {
            id: item.id,
            month_ids: notApprovedIds,
          };
          ids.push(rowData);
        });
      }
      if (ids.length > 0) {
        if (!updates.length) {
          openToast({
            content: 'Please edit before resubmit',
            type: 'warning',
          });
        } else if (haveAllSpace(updates[0].comments)) {
          openToast({
            content: "You can't enter empty string !",
            type: 'warning',
          });
        } else {
          const body = {
            entity_Id: entity,
            entity_role: user.role,
            updates,
          };
          put(`/waste/update_waste_data/`, body)
            .then((res: any) => {
              openToast({
                content: `${res?.message}`,
                type: 'success',
              });
              dispatch(setSelectedRowKeys([]));
              dispatch(updateSelectedRowKeys([]));
              setAttachement(null);
            })
            .catch((err) => {
              setAttachement(null);
              openToast({
                content: `${err.message}`,
                type: 'error',
              });
            })
            .finally(() => {
              setActiveTab(activeTab);
              setComment('');
              dispatch(setSelectedRowKeys([]));
              dispatch(updateSelectedRowKeys([]));
              setLoading(false);
              setAttachement(null);
              setEditList([]);
            });
        }
      } else {
        openToast({
          content: 'Please select at least one row',
          type: 'warning',
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setHandleEdit(!handleEdit);
      getApiData(activeTab);
    }
  };

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

  const handleRevert = (idsLst: any) => {
    handleStatusApi(idsLst, revertstatusMessage);
  };

  const handleApprove = (idsLst: any) => {
    handleStatusApi(idsLst, forwardstatusMessage);
  };

  useEffect(() => {
    resetFilters();

    setShowUpdateSection(true);
  }, [window.location.href]);

  return (
    <>
      {/* <Row justify="center" align="middle" className="mt-4 mb-4">
        <Col span={24}>
          <p className="pageTitle">{cateTitle}</p>
        </Col>
      </Row> */}

      <PageCardComponent customClass={Styles.pageCardStyle} loading={loading}>
        {renderCards()}

        <Tabs
          style={{ marginTop: '3vh' }}
          defaultActiveKey={activeTab}
          onChange={(key) => {
            resetFilters();
            setActiveTab(key === 'Recycled' ? 'Recycled' : 'Disposed');
          }}
        >
          <TabPane tab="Recycled" key="Recycled">
            <TableComponent
              onchange={handleChange}
              postFilterRecords={postFilterRecords}
              handleRevert={handleRevert}
              handleApprove={handleApprove}
              onHandleDelete={handleDelete}
              maxApproverLevel={maxApproverLevel}
              maxReviewerLevel={maxReviewerLevel}
              expandableRowRenderer={expandedRowContent}
              isRowExpand={true}
              isNewDelte={true}
              data={dataSource || []}
              enableRowSelection={false}
              allowedStatuses={allowedStatuses}
              columnHeader={recycledTableColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
              noText={
                user.role === 'SUPER_ADMIN'
                  ? `No Approved Data for this Reporting Period`
                  : null
              }
            />
          </TabPane>
          <TabPane tab="Disposed" key="Disposed">
            <TableComponent
              onchange={handleChange}
              handleRevert={handleRevert}
              onHandleDelete={handleDelete}
              maxApproverLevel={maxApproverLevel}
              maxReviewerLevel={maxReviewerLevel}
              handleApprove={handleApprove}
              expandableRowRenderer={expandedRowContent}
              isRowExpand={true}
              data={dataSource || []}
              enableRowSelection={false}
              isNewDelte={true}
              allowedStatuses={allowedStatuses}
              columnHeader={disposedTableColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
              noText={
                user.role === 'SUPER_ADMIN'
                  ? `No Approved Data for this Reporting Period`
                  : null
              }
            />
          </TabPane>
        </Tabs>
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
      </PageCardComponent>
    </>
  );
};

export default EnvironmentTable;
