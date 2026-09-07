import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Image,
  List,
  Popover,
  Row,
  Select,
  Upload,
  Spin,
  message,
} from 'antd';
import linkIcon from '../../../assets/link.png';
import { MoreOutlined } from '@ant-design/icons';
import { InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import editIcon from '../../../assets/edit.png';
import { useNotification } from '../../../Hooks/useNotification';
import { formatNumberUS } from '../../../Utils/Strings';
import StatusComponent from '../../../DesignLibrary/StatusComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  setFacilitySelected,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../../Redux/Actions';
import Styles from './Enviroment.module.scss';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiBaseUrl, get, post, put } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import WaterPDF from './WaterPDF';
import {
  getRowIdFromUniqueId,
  removeElementByValue,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from '../Scope3/Helpers';
import Edit from '../../../assets/Svg/Emissions/editIcon';
import UpdateSection from '../../content/UpdateSection';
import Triangle from '../../../assets/Svg/Emissions/triange';
import { isEmpty } from '../../../Utils/isEmpty';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

interface Disclosure {
  disclosure: string;
  file_name: string;
  id: number;
  consumed_water: number;
  tCO2e: number; // Using number to represent the tCO₂e value
}
interface EditItem {
  id: number;
  uuid: any;
  consumed_water: any;
  comment: string;
}

const Water = ({ btnPath, cateTitle, tableData, type }: any) => {
  const location = useLocation();
  const { company, financialYear } = location.state || {};

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [wasteGenerated, setWasteGenerated] = useState<number>();
  const [wasteDiverted, setWasteDiverted] = useState<number>();
  const [wasteDisposed, setWasteDisposed] = useState<number>();
  const [totalIncidents, setTotalIncidents] = useState<number>();
  const [tabIndex, setTabIndex] = useState(0);
  const [editList, setEditList] = useState<EditItem[]>([]);
  const { openToast } = useNotification();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedRowEdit, setSetSelectedRowEdit] = useState<Disclosure>();
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [attachement, setAttachement] = useState(null);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [selectedDataIndex, setSelectedDataIndex] = useState<any>();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [selectedRecord, setSelectedRecord] = useState<any>({});

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
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });

  useEffect(() => {
    resetFilters();
    setShowUpdateSection(true);
  }, [window.location.href]);

  const apiUrl =
    user?.role === 'SUPER_ADMIN' ? tableData?.superApi : tableData?.apiPath;

  // const apiUrl = tableData?.apiPath;
  const [entityData, setEntityData] = useState<any>([]);
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

    const url = `water/manage_deletion_for_water/`;

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
        apiResponse();
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
    fetchEnityData('/entity/getEntitiesListByUserId/');
    dispatch(setFacilitySelected(''));
  }, []);

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
        !isEmpty(entityData) && entityData[0] && entityData[0]?.max_DA
      );
      setMaxReviewerLevel(
        !isEmpty(entityData) && entityData[0] && entityData[0]?.max_DR
      );
    }
  }, [entityData, facilitySelected]);

  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');
  const [facilityList, setFacilityList] = useState([]);

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
    ? currentLevelIndex < roleLevels?.reviewer?.length - 1 &&
      currentLevelIndex !== maxReviewerLevelIndex
      ? roleLevels?.reviewer[currentLevelIndex + 1]
      : roleLevels?.approver[0]
    : currentRole.includes('APPROVER')
      ? currentLevelIndex < roleLevels?.approver?.length - 1 &&
        currentLevelIndex !== maxApproverLevelIndex
        ? roleLevels?.approver[currentLevelIndex + 1]
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
        get(`/facility/get_Facility/?entity_Id=${user?.entity_Id}`)
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
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);
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

  const apiResponse = async () => {
    try {
      setLoading(true);
      const resData = await get(
        `${apiUrl}?entity_Id=${user.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );

      if (
        !isEmpty(resData?.response?.data) &&
        resData?.response?.data !== 'null'
      ) {
        const updatedData = resData?.response?.data?.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
          })
        );

        setDataSource(updatedData);
        setWasteGenerated(
          !isEmpty(resData?.response?.total_waste_generated) &&
            resData?.response?.total_waste_generated
        );
        setWasteDiverted(
          !isEmpty(resData?.response?.total_waste_diverted) &&
            resData?.response?.total_waste_diverted
        );
        setWasteDisposed(
          !isEmpty(resData?.response?.total_waste_disposed) &&
            resData?.response?.total_waste_disposed
        );
        setTotalIncidents(
          !isEmpty(resData?.response?.total_no_of_incidents) &&
            resData?.response?.total_no_of_incidents
        );
      } else {
        // Explicitly handle `null` or empty response
        setDataSource([]);
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  const apiSuperResponse = async (entityId: any, financialYear: any) => {
    try {
      setLoading(true);
      const resData = await get(
        `${apiUrl}?entity_Id=${entityId}&financial_year=${financialYear}`
      );

      if (
        !isEmpty(resData?.response?.data) &&
        resData?.response?.data !== 'null'
      ) {
        const updatedData =
          !isEmpty(resData?.response?.data) &&
          resData?.response?.data?.map((item: any, index: any) => ({
            ...item,

            uniqueId: index,
          }));
        setDataSource(updatedData);
        setWasteGenerated(
          !isEmpty(resData?.response?.total_waste_generated) &&
            resData?.response?.total_waste_generated
        );
        setWasteDiverted(
          !isEmpty(resData?.response?.total_waste_diverted) &&
            resData?.response?.total_waste_diverted
        );
        setWasteDisposed(
          !isEmpty(resData?.response?.total_waste_disposed) &&
            resData?.response?.total_waste_disposed
        );
        setTotalIncidents(
          !isEmpty(resData?.response?.total_no_of_incidents) &&
            resData?.response?.total_no_of_incidents
        );
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      apiSuperResponse(company.value, financialYear);
    }
  }, [user?.role]);

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

  const allowedStatuses = roleStatusMapping[user.role] || new Set();

  const haveAllSpace = (str: string) => {
    if (str === '') return false;
    const space = str.split(' ').length - 1;
    return space === str.length;
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

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      apiResponse();
    }
  }, [window.location.href, facilitySelected]);

  const dynamicCol = [
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
      title: <div className="col-title-transform">Source of Water</div>,
      dataIndex: 'source_of_water',
      key: 'source_of_water',
      filters: (() => {
        return dataSource
          .map((entry: any) => entry?.source_of_water)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          }));
      })(),
      filteredValue: filteredInfo?.source_of_water || null,
      onFilter: (value: any, record: any) => {
        return record?.source_of_water?.includes(value as string);
      },
    },
    // {
    //   title: 'Total Quantity',
    //   dataIndex: 'total_water_consumed_in_cubic_meters',
    //   key: 'total_water_consumed_in_cubic_meters',
    // },
    {
      title: 'Total Quantity',
      key: 'consumed_water',
      render: (record: any) => {
        if (!record) return <>0</>; // Handle undefined or null record

        const monthlyKeys = Object.keys(record).filter(
          (key) => key.match(/^\w{3}-\d{2}$/) // Matches keys like "Jan-24", "Feb-24", etc.
        );

        const totalDischarged = monthlyKeys.reduce((sum, key) => {
          const value = parseFloat(record[key]?.consumed_water || 0);
          return sum + (isNaN(value) ? 0 : value); // Ensure numeric addition
        }, 0);

        return <>{formatNumberUS(totalDischarged)}</>;
      },
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      filters: (() => {
        return dataSource
          .map((entry: any) => entry?.uom)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          }));
      })(),
      filteredValue: filteredInfo?.uom || null,
      onFilter: (value: any, record: any) => {
        return record?.uom?.includes(value as string);
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

  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const handleStatusApi = (idsLst: any, statusValue: any) => {
    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        const notApprovedIds = getNotApprovedIds(item);
        const rowData = {
          id: item?.id,
          month_ids: notApprovedIds,
        };

        ids.push(rowData);
      });
    }
    const path = '/water/update_water_status/';
    const body = {
      entity_Id: user?.entity_Id,
      ids: ids,
      status: statusValue,
    };
    put(`${path}`, body)
      .then((res: any) => {
        message.success(!isEmpty(res?.message) && res?.message);
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
      })
      .catch((err) => {
        message.error(
          !isEmpty(err?.response?.data?.message) && err?.response?.data?.message
        );
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
      })
      .finally(() => {
        apiResponse();
      });
  };

  const handleRemove = (record: any, file_name: any, uuid: any) => {
    if (selectedRecord && selectedRecord.disclosure && file_name && uuid) {
      const update = { ...record };
      removeElementByValue(update.disclosure, file_name);
      removeElementByValue(update.disclosure_uuids, uuid);
      setSelectedRecord(update);
    }
  };

  const handleRevert = (idsLst: any) => {
    handleStatusApi(idsLst, revertstatusMessage);
  };

  const handleApprove = (idsLst: any) => {
    handleStatusApi(idsLst, forwardstatusMessage);
  };

  const handleSaveClick = (record: any, index: any) => {
    const path = 'water/ water_consumption_edit';

    let editableDivValue: string | null = null;
    const idPattern = `editable-cell-${index}-${selectedDataIndex}`;
    const element: any | null = document.querySelector(`[id^="${idPattern}"]`);

    editableDivValue = element ? element.textContent : null;

    if (
      !editableDivValue || // simplified null/empty check
      parseFloat(editableDivValue) <= 0
    ) {
      message.warning("The values can't be '0' or empty");
    } else {
      const sanitizedValue = editableDivValue.replace(/,/g, '');

      const newItem: EditItem = {
        id: record && record[selectedDataIndex].id,
        uuid: attachement ? attachement : '',
        consumed_water: sanitizedValue,
        comment: comment,
      };
      const updates = [newItem];
      const body = {
        entity_Id: user?.entity_Id,
        entity_role: user?.role,
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
            apiResponse();
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
          });
      } else {
        message.warning('Please make sure to have atleast one disclosure');
      }
    }
  };

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

  useEffect(() => {
    setShowUpdateSection(true);
    if (!isEmpty(dataSource) && expandedKeys.length > 0) {
      const foundObject = dataSource.find(
        (item: any) => item.id === expandedKeys[0]
      );
      setSelectedRecord(foundObject);
      const months = Object.entries(foundObject).filter(
        ([key, value]) => key.includes('-') && (value as any).consumed_water > 0
      );
      const firstMonthWithWaste = months.length > 0 ? months[0][0] : null;
      setSelectedDataIndex(firstMonthWithWaste);
    }
  }, [expandedKeys]);

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
                columnDefinitions.map((col) => {
                  return (
                    <Col style={{ width: '100px' }}>
                      <p className="mt-3 mb-3">{col.title}</p>
                      <p className="mt-3">
                        <div
                          style={{
                            display:
                              record[col.dataIndex].consumed_water === 0
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
                              const idPattern = `editable-cell-${index}-${selectedDataIndex}`;
                              const element: any | null =
                                document.querySelector(`[id^="${idPattern}"]`);

                              const span = element.querySelector('span');
                              span.textContent = formatter.format(
                                record[selectedDataIndex].consumed_water
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
                            {record[col.dataIndex].consumed_water &&
                            getNotApprovedIds(record).includes(
                              record[col.dataIndex]?.id
                            ) ? (
                              <span style={{ color: '#B8961D' }}>
                                {record[col.dataIndex].consumed_water == 0
                                  ? ''
                                  : formatter.format(
                                      record[col.dataIndex].consumed_water
                                    )}
                              </span>
                            ) : (
                              <span style={{ color: '#098E7E' }}>
                                {record[col.dataIndex].consumed_water == 0
                                  ? ''
                                  : formatter.format(
                                      record[col.dataIndex].consumed_water
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
              selectedRecord={
                Object.keys(selectedRecord).length > 0 ? selectedRecord : record
              }
              handleEditUploadFile={handleEditUploadFile}
              handleRemove={handleRemove}
              comment={comment}
              setComment={setComment}
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

  return (
    <>
      {/* <Row justify="start" className="mt-4 mb-4">
        <p className="pageTitle">{cateTitle}</p>
      </Row> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Spin spinning={loading}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Row justify="end">
                {user.role !== 'SUPER_ADMIN' && <WaterPDF></WaterPDF>}
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
                    disabled={!(hasPermissionToAdd && facilitySelected !== '')}
                    onClick={() =>
                      navigate('/environment/water-withdrawal-consumption-form')
                    }
                  >
                    Add +
                  </ButtonComponent>
                )}
              </Row>
            </Col>
          </Row>
          <Row className={Styles.envMarginTop}>
            <Col span={24}>
              {
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
                  data={
                    dataSource === null || dataSource.length <= 0
                      ? []
                      : dataSource
                  }
                  enableRowSelection={false}
                  isNewDelte={true}
                  allowedStatuses={allowedStatuses}
                  columnHeader={dynamicCol === null ? [] : dynamicCol}
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
        </Spin>
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

export default Water;
