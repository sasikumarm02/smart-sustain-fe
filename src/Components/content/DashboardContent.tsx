import { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  Typography,
  Card,
  Tabs,
  Spin,
  Select,
  message,
} from 'antd';

import Styles from '../../Modules/UserScreen/dashboard.module.scss';
import Styles2 from '../../Components/Emissions/Scope3/scope3.module.scss';
import { useNavigate, useLocation, useFetcher } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { Icon } from '@iconify/react';
import { apiBaseUrl, get, post, put, upload } from '../../Services';
import Triangle from '../../assets/Svg/Emissions/triange';
import { useNotification } from '../../Hooks/useNotification';
import { useSelector, useDispatch } from 'react-redux';

import {
  setExpandedKeys,
  setFacilitySelected,
  setMaxDR,
  setSelectedEmissionTab,
  setSelectedRowKeys,
  setStationaryFilters,
  setStationaryTabData,
  updateSelectedRowKeys,
} from '../../Redux/Actions';

import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import { formatNumberUS, roundUp } from '../../Utils/Strings';
import {
  deleteSatausMapping,
  getRowIdFromUniqueId,
  insertColumn,
  removeElementByValue,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from '../Emissions/Scope3/Helpers';
import UpdateSection from './UpdateSection';
import { isEmpty } from '../../Utils/isEmpty';

interface Item {
  key: string;
  id: string;
  status: string;
}

interface Disclosure {
  disclosure: string;
  file_name: string;
  id: number;
  quantity: number;
  tCO2e: number; // Using number to represent the tCO₂e value
}

export default function DashboardContent({
  dataSource,
  columns,
  table2DataSource,
  table2Columns,
  breadcrumb,
  btnPath,
  btnLabel,
  showSelect,
  reportingPeriod,
  companyName,
  apiUrl,
  superApi,
  separatorReq,
  table2title,
  mutliData,
  listData,
  authRole,
  showDatePicker,
  tableAuth,
  dataTab,
  pathEntity,
  scope,
  type,
}: any) {
  interface EditItem {
    id: number;
    uuid: any;
    quantity: any;
    comment: string;
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [height, setHeight] = useState(0);
  const { openToast } = useNotification();
  const [tableData, setTableData] = useState<any>([]);
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });

  const { company, financialYear } = location?.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [attachement, setAttachement] = useState(null);
  const dispatch = useDispatch();
  const selectedRows = useSelector(
    (state: any) => state?.rowSelection?.selectedRowKeys
  );
  const facilitySelected = useSelector((state: any) => state?.facilitySelected);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const [selectedRowEdit, setSetSelectedRowEdit] = useState<Disclosure>();
  const [selectedRecord, setSelectedRecord] = useState<any>({});
  const { Option } = Select;
  const [tabIndex, setTabIndex] = useState(location?.state || 0);
  const [tableDataApi, setTableDataApi] = useState('');
  const [editList, setEditList] = useState<EditItem[]>([]);

  const [disableResubmit, setDisableResubmit] = useState<boolean>(true);
  const [entityData, setEntityData] = useState<any>([]);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState(
    location?.state?.tabKey && typeof location?.state?.tabKey !== 'number'
      ? 1
      : location?.state?.tabKey || 0
  );

  const [filterValue, setFilterValue] = useState<string | undefined>(undefined);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    if (activeKey === null && location.state === null) {
      setActiveKey(0);
    }
    if (window.location.pathname === '/environment/scope2') {
      setActiveKey(0);
    }
  }, [window.location.href]);

  const editApiPath = [
    'Emissions/stationary_edit',
    'Emissions/mobile_edit',
    'Emissions/process_edit',
    'Emissions/fugitive_edit',
  ];
  const updateEmissionsApiPath = [
    'Emissions/stationary_put',
    'Emissions/mobile_put',
    'Emissions/process_put',
    'Emissions/fugitive_put',
  ];

  const getDeleteApiPath = [
    'manage-stationary-deletion',
    'manage_deletion_for_mobile_combustion',
    'manage_deletion_for_process_emission',
    'manage_deletion_for_fugitive_emission',
  ];

  const updateEmissionsApiPathScope2 = ['energy/energy_put'];
  const editApiPathScope2 = ['energy/update-energy-energy_edit'];

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      const fetchFaclityData = () => {
        get(`/facility/get_Facility/?entity_Id=${user?.entity_Id}`)
          .then((res: any) => {
            if (
              !isEmpty(res?.response) &&
              !isEmpty(res?.response.status) &&
              res?.response?.status !== false
            ) {
              if (
                !isEmpty(res?.response) &&
                !isEmpty(res?.response.data) &&
                res?.response?.data
              ) {
                setFacilityList(res?.response?.data);
              }
            } else {
              setFacilityList([]);
              openToast({
                content: `${res?.message}`,
                type: 'error',
              });
            }
          })
          .catch((err) => console.log(err));
      };
      if (!facilityList.length) {
        fetchFaclityData();
      }
    }
  }, []);

  const getApiFacility = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      let data =
        (!isEmpty(response) &&
          !isEmpty(response?.response) &&
          !isEmpty(response?.response?.data) &&
          response?.response?.data) ||
        [];
      // let newObject = { facility_Id: '', facility_Name: 'All' };
      // data.unshift(newObject);
      setFacilityOptions(data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 360);
    };
    setHeight(window.innerHeight - 360);
    window.addEventListener('resize', handleResize);
    fetchEnityData('/entity/getEntitiesListByUserId/');
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    if (!isEmpty(facilityList) && user?.role !== 'SUPER_ADMIN') {
      getApiFacility();
    }
  }, [facilityList]);
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
      setMaxDR(
        !isEmpty(entityData) && !isEmpty(entityData[0]) && entityData[0]?.max_DR
      );
    }
  }, [entityData, facilitySelected]);

  const handleRemove = (record: any, file_name: any, uuid: any) => {
    if (selectedRecord && selectedRecord.disclosure && file_name && uuid) {
      const update = { ...record };
      removeElementByValue(update.disclosure, file_name);
      removeElementByValue(update.disclosure_uuids, uuid);
      setSelectedRecord(update);
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
  const fetchData = (apiUrl: any) => {
    setLoader(true);
    setTableData([]);
    if (!isEmpty(apiUrl)) {
      get(apiUrl)
        .then((res: any) => {
          if (
            !isEmpty(res) &&
            !isEmpty(res.response) &&
            !isEmpty(res.response.status) &&
            res.response.status !== false
          ) {
            const data =
              !isEmpty(res.response.data) && Array.isArray(res.response.data)
                ? res.response.data
                : [];
            const updatedData = data.map((item: any, index: any) => ({
              ...item,

              uniqueId: index,
            }));
            setTableData((!isEmpty(updatedData) && updatedData) || []);
            dispatch(setStationaryTabData(data));

            dispatch(
              setStationaryFilters(data.map((obj: any) => obj?.fuel_type))
            );

            setLoader(false);
          } else {
            setLoader(false);
            setTableData([]);
          }
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      setLoader(false);

      setTableData([]);
    }
  };

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (
        mutliData &&
        activeKey &&
        activeKey != null &&
        mutliData[activeKey]?.apiUrl !== undefined
      ) {
        if (pathEntity === true) {
          fetchData(
            `${mutliData[activeKey]?.apiUrl}?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
          );
        } else if (scope === 'Scope1') {
          fetchData(
            `${mutliData[activeKey]?.apiUrl}?entity_Id=${user?.entity_Id}&scope=${scope}`
          );
        } else {
          fetchData(mutliData[activeKey]?.apiUrl);
        }
      } else {
        if (pathEntity === true) {
          fetchData(
            `${apiUrl}?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
          );
        } else if (scope === 'Scope1') {
          fetchData(`${apiUrl}?entity_Id=${user?.entity_Id}&scope=${scope}`);
        } else {
          fetchData(apiUrl);
        }
      }
    }
  }, [facilitySelected, window.location.href, activeKey]);

  const defaultActiveKey = 0; // Example default key
  const superApiFormat = mutliData[activeKey || defaultActiveKey]?.superApi;

  const fetchSuperData = (
    superApiFormat: string,
    entityId: string,
    financialYear: string
  ) => {
    if (user?.role !== 'SUPER_ADMIN') return;

    setLoader(true);
    setTableData([]);
    if (isEmpty(superApiFormat)) {
      setLoader(false);
      return;
    }

    const apiUrl = `${superApiFormat}?entity_Id=${entityId}&financial_year=${financialYear}`;

    get(apiUrl)
      .then((res: any) => {
        const isValidResponse =
          res?.response?.status !== false && !isEmpty(res?.response?.data);
        if (!isValidResponse) {
          setLoader(false);
          setTableData([]);
          return;
        }

        const data = Array.isArray(res.response.data) ? res.response.data : [];
        const updatedData = data.map((item: any, index: number) => ({
          ...item,
          uniqueId: index,
        }));

        setTableData(updatedData);
        dispatch(setStationaryTabData(data));
        dispatch(setStationaryFilters(data.map((obj: any) => obj?.fuel_type)));
      })
      .catch((err: any) => {
        console.error('Error fetching super data:', err);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      fetchSuperData(superApiFormat, company.value, financialYear);
    }
  }, [activeKey, mutliData, superApiFormat, user?.role, window.location.href]);

  const getNotApprovedIds = (data: any) => {
    const notApprovedIds: number[] = [];
    if (!isEmpty(data)) {
      Object.keys(data).forEach((month) => {
        const details = data[month];
        if (typeof details === 'object' && details?.status !== 'Approved') {
          if (details?.id !== undefined) {
            notApprovedIds.push(details.id);
          }
        }
      });
    }

    return notApprovedIds;
  };

  const updateData = (idsLst: any, action: any, actionType: any) => {
    const path =
      window.location.pathname === '/environment/emissions'
        ? updateEmissionsApiPath[activeKey]
        : updateEmissionsApiPathScope2[activeKey];

    setIsLoading(true);

    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst?.forEach((item: any) => {
        const notApprovedIds = getNotApprovedIds(item);
        const rowData = {
          id: item.id,
          month_ids: notApprovedIds,
        };

        ids.push(rowData);
      });
    }
    const body = {
      entity_Id: user.entity_Id,
      action,
      ids: ids,
    };

    const hasNullValues =
      !isEmpty(idsLst) &&
      Array.isArray(idsLst) &&
      idsLst.every(
        (item: any) =>
          (item.emission_factor_name && item.emission_factor_name === '') ||
          item.emission_factor_name === null ||
          item.kg_CO2_emission_per_unit === 0
      );

    if (
      hasNullValues &&
      user.role !== 'DATA_PROVIDER' &&
      actionType !== 'Revert'
    ) {
      message.warning('Please calculate the values.');
    } else {
      put(`${path}/`, body)
        .then((res: any) => {
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          if (res?.response?.status_code === 500) {
            openToast({
              content: `${res?.message}`,
              type: 'error',
            });
          } else {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
          }
        })
        .catch((err) => {
          openToast({
            content: `${err.message}`,
            type: 'error',
          });
        })
        .finally(() => {
          if (pathEntity === true) {
            const updateApi = mutliData[activeKey]?.apiUrl;

            fetchData(updateApi + `?entity_Id=` + user.entity_Id);
          }
          setIsLoading(false);
          dispatch(setExpandedKeys([]));
        });
    }
  };

  const handleRevert = (idsLst: any) => {
    updateData(idsLst, revertstatusMessage, 'Revert');
  };

  const handleApprove = (idsLst: any) => {
    updateData(idsLst, forwardstatusMessage, 'Forward');
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

    const url = `Emissions/${getDeleteApiPath[activeKey]}/`;

    post(
      window.location.pathname === '/environment/emissions'
        ? url
        : 'energy/manage_deletion_for_enerrgy_consumption/',
      {
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
      }
    )
      .then((response: any) => {
        message.success(
          (getStatusMapping(currentRecord.status) !== undefined &&
            getStatusMapping(currentRecord.status)?.includes(user?.role)) ||
            user?.role === maxApproverLevel
            ? 'Deletion successful.'
            : 'Deletion request submitted.'
        );
        const updateApi = mutliData[activeKey]?.apiUrl;
        fetchData(updateApi + `?entity_Id=` + user.entity_Id);
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

  const statusColumn = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'cellWidth',
      filters:
        !isEmpty(tableData) &&
        tableData
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
      render: (status: any) => {
        return (
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
                : !isEmpty(failureStatuses) && failureStatuses.includes(status)
                  ? 'failure'
                  : !isEmpty(warningStatuses) &&
                      warningStatuses.includes(status)
                    ? 'warning'
                    : 'warning'
            }
          />
        );
      },
    },
  ];

  const totalCol = {
    title: 'Total Quantity',
    dataIndex: 'total_quantity_of_fuel',
    key: 'total_quantity_of_fuel',
    className: 'total_quantity_of_fuel',
    align: 'right',
    render: (text: any) => {
      return <span>{formatNumberUS(text)}</span>;
    },
  };

  const emissionCol = {
    title: 'Total Quantity',
    dataIndex: 'total_emission_emmited_by_fuel_in_tonnes',
    key: 'total_emission_emmited_by_fuel_in_tonnes',
    className: 'total_emission_emmited_by_fuel_in_tonnes',
    align: 'right',
    render: (text: any) => {
      return <span>{formatNumberUS(text)}</span>;
    },
  };

  const updateEmissionData = (
    record: any,
    body: any,
    apiUrl: string,
    apiPath: string
  ) => {
    setIsLoading(true);

    put(apiPath, body)
      .then((res: any) => {
        if (
          !isEmpty(res) &&
          !isEmpty(res?.response) &&
          !isEmpty(res?.response?.status) &&
          res?.response?.status === true
        ) {
          fetchData(`${apiUrl}?entity_Id=${user.entity_Id}`);
          openToast({
            content: `${res?.message}`,
            type: 'success',
          });
          setDatabase('');
        } else {
          openToast({
            content: `${res?.message}`,
            type: 'warning',
          });
        }
      })
      .catch((err) => {
        fetchData(`${apiUrl}?entity_Id=${user.entity_Id}`);
        openToast({
          content: `${err?.message}`,
          type: 'warning',
        });
        setDatabase('');
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const excludeKeys = Object.keys(tableData[0] ? tableData[0] : {}).filter(
    (key) =>
      key !== 'id' && // Exclude id
      key !== 'contentEditable' &&
      key !== 'emission_factor_name' &&
      key !== 'total_quantity_of_fuel' &&
      key !== 'status' &&
      key !== 'uniqueId' &&
      key !== 'disclosure_urls' &&
      key !== 'disclosure' &&
      key !== 'disclosure_uuids' &&
      !key.includes('-') &&
      !(
        !roleLevels.reviewer.includes(user.role) &&
        !roleLevels.approver.includes(user.role) &&
        (key === 'total_emission_emmited_by_fuel_in_tonnes' ||
          key === 'kg_CO2_emission_per_unit' ||
          key === 'total_emission_emmited_by_fuel' ||
          key === 'emission_factor_database')
      )
  );
  const [postFilterRecords, setPostFilterRecords] = useState(undefined);
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
  function generateFiltersAndOnFilter(
    column: any,
    tableData: any,
    filteredInfo: any
  ) {
    let filters = null;
    let onFilter = null;
    let filteredValue;
    if (
      column === 'fuel_type' ||
      column === 'uom' ||
      column === 'equipment_type' ||
      column === 'gas_or_refrigerant' ||
      column === 'vehicle_type' ||
      column === 'source_of_energy' ||
      column === 'emission_factor_name'
    ) {
      filters = tableData
        .map((entry: any) => entry[column])
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        )
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        }));

      filteredValue = filteredInfo[column] || null;
      if (column !== 'total_emission_emmited_by_fuel') {
        onFilter = (value: any, record: any) => record[column] === value;
      }
    }

    return { filters, onFilter, filteredValue };
  }

  const columnsWithFilters = excludeKeys.map((column) => {
    const { filters, onFilter, filteredValue } = generateFiltersAndOnFilter(
      column,
      tableData,
      filteredInfo
    );
    if (column === 'emission_factor_database') {
      return {
        title: 'Emission Factor Database',
        dataIndex: 'emission_factor_name',
        key: 'emission_factor_name',
        type: 'select',
        filters: (() => {
          return tableData
            .map((entry: any) => entry['emission_factor_name'])
            .filter((value: any) => value)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            )
            .map((filterValue: any) => ({
              text: filterValue,
              value: filterValue,
            }));
        })(),
        filteredValue: filteredInfo.emission_factor_name || null,
        onFilter: (value: any, record: any) => {
          return record.emission_factor_name === value;
        },
        render: (text: any, record: any, rowIndex: any) => (
          <>
            {allowedStatuses.has(record.status) &&
            roleLevels.reviewer.includes(user.role) ? (
              <Select
                value={
                  rowIndex === currentRowIndex
                    ? database !== ''
                      ? database
                      : record.emission_factor_name
                    : record.emission_factor_name
                }
                showSearch
                onChange={(value) => {
                  setCurrentRowIndex(rowIndex);

                  const body = {
                    id: record.id,
                    database: value,
                  };
                  updateEmissionData(
                    record,
                    body,
                    mutliData[activeKey].apiUrl
                      ? mutliData[activeKey].apiUrl
                      : apiUrl,
                    mutliData[activeKey].calculateApi
                  );
                  setDatabase(value);
                }}
                className={Styles.dbDropdown}
                style={{ width: '150px', border: 0 }}
              >
                {record.emission_factor_database?.map((option: any) => {
                  const displayValue =
                    option === 'UK-DEFRA(2023-2024)'
                      ? 'UK-DEFRA 2023'
                      : option === 'UK-DEFRA(2024-2025)'
                        ? 'UK-DEFRA 2024'
                        : option === 'CUSTOM-EF'
                          ? 'Custom EF'
                          : option;

                  const isDisabled = option === 'US-EPA';

                  return (
                    <Option key={option} value={option} disabled={isDisabled}>
                      {displayValue}
                    </Option>
                  );
                })}
              </Select>
            ) : (
              <div>
                {record.emission_factor_name === 'UK-DEFRA(2023-2024)'
                  ? 'UK-DEFRA 2023'
                  : record.emission_factor_name === 'UK-DEFRA(2024-2025)'
                    ? 'UK-DEFRA 2024'
                    : record.emission_factor_name === 'CUSTOM-EF'
                      ? 'Custom EF'
                      : record.emission_factor_name}
              </div>
            )}
          </>
        ),
      };
    }

    if (column === 'total_emission_emmited_by_fuel_in_tonnes') {
      return {
        title: (
          <div>
            Emissions <br /> (<span className={Styles.smallCaps}>tCO₂e</span>)
          </div>
        ),
        dataIndex: 'total_emission_emmited_by_fuel_in_tonnes',
        key: 'total_emission_emmited_by_fuel_in_tonnes',
        type: 'number',
        align: 'right',
        render: (text: any, record: any, rowIndex: any) => (
          <>
            <span>{formatNumberUS(text)}</span>
          </>
        ),
      };
    }
    if (column === 'vehicle_type') {
      return {
        title: 'Vehicle Type',
        dataIndex: 'vehicle_type',
        key: 'vehicle_type',
        type: 'text',
        className: 'cellWidth',
        filters: (() => {
          return tableData
            .map((entry: any) => entry['vehicle_type'])
            .filter((value: any) => value)
            .filter(
              (value: any, index: any, self: any) =>
                self.indexOf(value) === index
            )
            .map((filterValue: any) => ({
              text: filterValue,
              value: filterValue,
            }));
        })(),
        filteredValue: filteredInfo.vehicle_type || null,
        onFilter: (value: any, record: any) => {
          return record.vehicle_type === value;
        },
        render: (text: any, record: any, rowIndex: any) => <>{text}</>,
      };
    }

    // For other columns
    return {
      title:
        column === 'uom' ? (
          'UOM'
        ) : column === 'total_emission_emmited_by_fuel' ? (
          <div>
            Emissions <br /> (<span className={Styles.smallCaps}>kgCO₂e</span>)
          </div>
        ) : column === 'kg_CO2_emission_per_unit' ? (
          <div>
            Emission Factor <br /> (
            <span className={Styles.smallCaps}>kgCO₂e</span>/unit)
          </div>
        ) : column === 'gas_or_refrigerant' ? (
          <div>
            Gas <span className={Styles.smallCaps}>or</span> Refrigerant
          </div>
        ) : (
          <span style={{ textTransform: 'capitalize' }}>
            {column.replace(/_/g, ' ')}
          </span>
        ),
      dataIndex: column,
      key: column,
      className:
        column === 'total_emission_emmited_by_fuel'
          ? 'transformUnit cellWidth'
          : 'cellWidth',
      filteredValue,
      filters,
      onFilter,
      render: (text: any, record: any, index: any) => {
        const isNumericString = !isNaN(Number(text));
        if (typeof text === 'number' || isNumericString) {
          const numericValue = typeof text === 'number' ? text : Number(text);
          return formatter.format(numericValue);
        } else {
          return text;
        }
      },
    };
  });

  const [database, setDatabase] = useState('');

  const insertTotalCol =
    columnsWithFilters?.length > 0
      ? [...insertColumn(columnsWithFilters, totalCol, ['uom'])]
      : [];

  const totalInsertCol =
    columnsWithFilters?.length > 0
      ? [
          ...insertColumn(columnsWithFilters, emissionCol, [
            'total_emission_emmited_by_fuel',
          ]),
        ]
      : [];

  const allowedStatuses = roleStatusMapping[user.role] || new Set();

  const dynamicColumns = [...statusColumn, ...insertTotalCol];

  const handleAdd = (btnPath: any) => {
    if (
      window.location.pathname === '/user-access-management/user-role-mapping'
    ) {
      navigate(`${btnPath}/?entity_Id=${user.entity_Id}`);
    } else {
      navigate(btnPath, { state: activeKey + 1 });
    }
  };

  const mergedColumns = !mutliData
    ? columns.map((col: any) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: Item) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
          }),
        };
      })
    : null;

  const editClick = (key: any, record: any) => {
    navigate(`/map-user?auth_Id=${record.auth_Id}`);
  };

  const tableActions = {
    callback: editClick,
    items: [
      {
        label: (
          <Typography.Text>
            {' '}
            <Button type="primary" ghost>
              {' '}
              <Icon
                icon="jam:write"
                inline
                fontSize={16}
                style={{ marginRight: '5px' }}
              />
              Edit{' '}
            </Button>{' '}
          </Typography.Text>
        ),
        key: 'edit',
      },
    ],
  };

  const [showUpdateSection, setShowUpdateSection] = useState(true);

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
    resetFilters();
    setShowUpdateSection(true);
  }, [window.location.href]);

  const [comment, setComment] = useState('');

  useEffect(() => {
    if (selectedRows.length > 0) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');

  const getCurrentLevelIndex = (role: any) => {
    if (!isEmpty(role) && role?.includes('REVIEWER')) {
      return roleLevels.reviewer.indexOf(role);
    } else if (!isEmpty(role) && role?.includes('APPROVER')) {
      return roleLevels.approver.indexOf(role);
    }
    return -1;
  };

  const currentLevelIndex = getCurrentLevelIndex(currentRole);

  const getMaxLevelIndex = (roleType: any, maxLevel: any) => {
    return (
      !isEmpty(roleLevels) && roleLevels[roleType as any].indexOf(maxLevel)
    );
  };

  const maxReviewerLevelIndex = getMaxLevelIndex('reviewer', maxReviewerLevel);
  const maxApproverLevelIndex = getMaxLevelIndex('approver', maxApproverLevel);

  const valueToDisplayForRevert =
    !isEmpty(currentRole) &&
    currentRole?.includes('REVIEWER') &&
    currentLevelIndex > 0
      ? !isEmpty(roleLevels) && roleLevels.reviewer[currentLevelIndex - 1]
      : currentRole.includes('APPROVER')
        ? currentLevelIndex <= 0
          ? !isEmpty(roleLevels) && roleLevels?.reviewer[maxReviewerLevelIndex]
          : (!isEmpty(roleLevels) &&
              roleLevels?.approver[currentLevelIndex - 1]) ||
            ''
        : 'DATA_PROVIDER';

  let valueToDisplayForForward: any = currentRole.includes('REVIEWER')
    ? currentLevelIndex < roleLevels.reviewer.length - 1 &&
      currentLevelIndex !== maxReviewerLevelIndex
      ? !isEmpty(roleLevels) && roleLevels.reviewer[currentLevelIndex + 1]
      : !isEmpty(roleLevels) && roleLevels.approver[0]
    : currentRole.includes('APPROVER')
      ? currentLevelIndex < roleLevels.approver.length - 1 &&
        currentLevelIndex !== maxApproverLevelIndex
        ? !isEmpty(roleLevels) && roleLevels.approver[currentLevelIndex + 1]
        : 'Approved'
      : roleLevels.reviewer[0];

  const failureStatuses: any =
    !isEmpty(statusMapForRevert) && Object.values(statusMapForRevert);
  const warningStatuses: any =
    !isEmpty(statusMapForForward) && Object.values(statusMapForForward);
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

  useEffect(() => {
    if (activeKey === undefined) {
      setActiveKey(0);
    }
    dispatch(setFacilitySelected(''));
  }, [window.location.href, activeKey]);

  useEffect(() => {
    setShowUpdateSection(true);
    if (!isEmpty(tableData) && expandedKeys.length > 0) {
      const foundObject = tableData.find(
        (item: any) => item.id === expandedKeys[0]
      );
      setSelectedRecord(foundObject);
      const months = Object.entries(foundObject).filter(
        ([key, value]) => key.includes('-') && (value as any).quantity > 0
      );
      const firstMonthWithWaste = months.length > 0 ? months[0][0] : null;
      setSelectedDataIndex(firstMonthWithWaste);
    }
  }, [expandedKeys]);

  const columnDefinitions: any =
    !isEmpty(tableData) &&
    Object.keys(tableData[0] || {})
      .filter((key) => /^[A-Za-z]{3}-\d{2}$/.test(key))
      .map((month, index) => ({
        title: month,
        dataIndex: month,
        key: index,
        className: 'cellWidth',
        align: 'right',
        ellipsis: true,
      }));

  const firstMonthName =
    columnDefinitions.length > 0 ? columnDefinitions[0].title : null;

  const [selectedDataIndex, setSelectedDataIndex] = useState<any>();

  const handleSaveClick = (record: any, index: any) => {
    const path =
      window.location.pathname === '/environment/emissions'
        ? editApiPath[activeKey]
        : editApiPathScope2[activeKey];

    let editableDivValue: any = null;
    const idPattern = `editable-cell-${index}-${selectedDataIndex}`;
    const parentElement: any | null = document.querySelector(
      `[id^="rc-tabs-"][id$="panel-${activeKey}"]`
    );

    const elements = parentElement?.querySelectorAll(`[id^="${idPattern}"]`);

    const elementsArray: any = !isEmpty(elements) && Array.from(elements);

    const lastElement: any =
      !isEmpty(elementsArray) && elementsArray[elementsArray.length - 1];

    editableDivValue = lastElement
      ? lastElement.textContent.replace(/,/g, '')
      : null;

    if (isEmpty(editableDivValue) || parseFloat(editableDivValue) <= 0) {
      message.warning("The values can't be '0' or empty");
    } else {
      const newItem = {
        id: record && record[selectedDataIndex].id,
        uuid: attachement || '',
        quantity: parseFloat(editableDivValue),
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
            if (pathEntity === true) {
              const updateApi =
                !isEmpty(activeKey) && mutliData[activeKey]?.apiUrl;
              fetchData(updateApi + `?entity_Id=` + user.entity_Id);
            }
            setComment('');
            dispatch(setSelectedRowKeys([]));
            dispatch(updateSelectedRowKeys([]));
            dispatch(setExpandedKeys([]));
            setIsLoading(false);
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

  const expandedRowContent = (record: any, index: any) => {
    return (
      <div style={{ background: '#fbfbfd' }}>
        <Row gutter={10} className="p-2">
          <Col span={2} className={Styles.dataLabel}>
            <p className={Styles.qtyHeader}>Months:</p>
            <p className={Styles.qtyHeader}>Quantity:</p>
          </Col>
          <Col span={22}>
            <Row gutter={10}>
              {!isEmpty(columnDefinitions) &&
                columnDefinitions.map((col: any) => {
                  return (
                    <Col className={Styles.monthData}>
                      <p className="mt-3 mb-3">{col.title}</p>
                      <p className="mt-3 mb-1">
                        <div
                          style={{
                            display:
                              !isEmpty(record) &&
                              !isEmpty(record[col.dataIndex]) &&
                              !isEmpty(record[col.dataIndex].quantity) &&
                              record[col.dataIndex].quantity === 0
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
                                  `[id^="rc-tabs-"][id$="panel-${activeKey}"]`
                                );

                              const elements = parentElement?.querySelectorAll(
                                `[id^="${idPattern}"]`
                              );

                              const elementsArray: any =
                                !isEmpty(elements) && Array.from(elements);

                              const lastElement: any =
                                !isEmpty(elementsArray) &&
                                elementsArray[elementsArray.length - 1];
                              const span = lastElement.querySelector('span');
                              span.textContent = formatter.format(
                                record[selectedDataIndex].quantity
                              );
                              setUploadedFileName(null);
                              setSetSelectedRowEdit(record[col.dataIndex]);
                              const isFocused =
                                record.contentEditable &&
                                selectedDataIndex === col.dataIndex;
                              if (
                                !isFocused &&
                                !showUpdateSection &&
                                col.dataIndex
                              ) {
                                handleCellClick(
                                  getRowIdFromUniqueId(
                                    record.uniqueId,
                                    dataSource
                                  ),
                                  col.dataIndex
                                );
                                let test = [...tableData];
                                test[record.uniqueId].contentEditable = false;
                                setTableData((!isEmpty(test) && test) || []);
                              }
                              if (
                                record[col.dataIndex].id !== undefined &&
                                !isEmpty(getNotApprovedIds) &&
                                !getNotApprovedIds(record).includes(
                                  record[col.dataIndex]?.id
                                )
                              ) {
                                let test = [...tableData];
                                test[index].contentEditable = false;
                                setTableData((!isEmpty(test) && test) || []);
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
                            {record[col.dataIndex]?.quantity &&
                            !isEmpty(getNotApprovedIds) &&
                            getNotApprovedIds(record).includes(
                              record[col.dataIndex]?.id
                            ) ? (
                              <span
                                style={{
                                  color: '#FF9012',
                                  cursor: 'pointer',
                                }}
                              >
                                {formatter.format(
                                  record[col.dataIndex].quantity
                                )}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: '#036323',
                                  cursor: 'pointer',
                                }}
                              >
                                {!isEmpty(record) &&
                                  !isEmpty(record[col.dataIndex]) &&
                                  !isEmpty(record[col.dataIndex].quantity) &&
                                  formatter.format(
                                    record[col.dataIndex].quantity
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
              tableData={tableData}
              index={index}
              setTableData={setTableData}
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

  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const financialYearGetApi = (financialYear: string) => {
    setIsLoading(true);

    const defaultActiveKey = 0;

    const url = `${apiBaseUrl}${mutliData[activeKey || defaultActiveKey]?.restatedApi}?entity_Id=${user.entity_Id}&financial_year_cal=${financialYear}`;

    const body = {};

    put(url, body) // Pass the payload (body) along with the URL
      .then((res: any) => {
        if (
          !isEmpty(res) &&
          !isEmpty(res?.response) &&
          !isEmpty(res?.response?.status) &&
          res?.response?.status === true
        ) {
          fetchData(
            `${mutliData[activeKey || defaultActiveKey]?.apiUrl}?entity_Id=${user.entity_Id}`
          );
          openToast({
            content: `${res?.message}`,
            type: 'success',
          });
        } else {
          // Handle case when response status is not successful
          openToast({
            content: `${res?.message}`,
            type: 'warning',
          });
        }
      })
      .catch((err) => {
        // Handle errors, show warning toast, and refetch data
        fetchData(
          `${mutliData[activeKey || defaultActiveKey]?.apiUrl}?entity_Id=${user.entity_Id}`
        );
        openToast({
          content: `${err?.message}`,
          type: 'warning',
        });
      })
      .finally(() => {
        // Ensure loading state is turned off
        setIsLoading(false);
      });
  };

  const handleFinancialYearChange = (value: string) => {
    setSelectedFinancialYear(value); // Update the selected financial year
    financialYearGetApi(value); // Call the API with the selected value
  };

  return (
    <div className={Styles.pageCardStyle}>
      <>
        {reportingPeriod ? (
          <Row className="mt-4 mb-2">
            <Col>
              <strong>{companyName}</strong>
            </Col>
            <Col className="d-flex justify-content-end font-large">
              Reporting Period : {reportingPeriod}
            </Col>
          </Row>
        ) : null}
      </>

      {!mutliData && (
        <Row className="mt-3">
          <Col span={24}>
            {window.location.pathname ===
            '/user-access-management/user-role-mapping' ? (
              <PageCardComponent style={{ padding: '5vh', width: '100%' }}>
                <Row>
                  <Col
                    className="d-flex justify-content-end"
                    style={{ gap: '20px', width: '100%' }}
                  >
                    {showDatePicker ? showDatePicker : null}
                    {showSelect ? showSelect : null}

                    {btnLabel
                      ? (user.role === authRole || authRole === '*') && (
                          <ButtonComponent
                            hierarchy="secondary-gray"
                            onClick={() => handleAdd(btnPath)}
                          >
                            {btnLabel} &nbsp; +
                          </ButtonComponent>
                        )
                      : null}
                  </Col>
                </Row>

                <TableComponent
                  isRowExpand={false}
                  data={tableData?.length !== 0 ? tableData : dataSource}
                  enableRowSelection={false}
                  columnHeader={[
                    ...mergedColumns.map((column: any) => ({
                      ...column,
                      showSorterTooltip: false,
                    })),

                    // ...getActionCol(),
                  ]}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                />
              </PageCardComponent>
            ) : (
              <PageCardComponent
                style={{ padding: '5vh', marginTop: '-3vh', width: '100%' }}
              >
                <Row>
                  <Col
                    className="d-flex justify-content-end"
                    style={{ gap: '20px', width: '100%' }}
                  >
                    {showDatePicker ? showDatePicker : null}
                    {showSelect ? showSelect : null}

                    {btnLabel
                      ? (user.role === authRole || authRole === '*') && (
                          <ButtonComponent
                            hierarchy="secondary-gray"
                            onClick={() => handleAdd(btnPath)}
                          >
                            {btnLabel} &nbsp; +
                          </ButtonComponent>
                        )
                      : null}
                  </Col>
                </Row>

                <TableComponent
                  isRowExpand={false}
                  data={tableData?.length !== 0 ? tableData : dataSource}
                  enableRowSelection={false}
                  columnHeader={[
                    ...mergedColumns.map((column: any) => ({
                      ...column,
                      showSorterTooltip: false,
                    })),

                    // ...getActionCol(),
                  ]}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                />
              </PageCardComponent>
            )}
          </Col>
        </Row>
      )}

      {table2title && (
        <Row className="mt-3">
          {tableAuth.includes(user.role) && (
            <>
              <Col
                span={24}
                className="tableHeading font-weight-bold breadTitle"
              >
                <div className="d-flex justify-content-between mb-1">
                  <p className="pageTitle">{table2title}</p>
                  <Button
                    className="primary-act-btn"
                    onClick={() =>
                      navigate('/settings/company/onboarding-company')
                    }
                  >
                    Add +
                  </Button>
                </div>
              </Col>
              <Col span={24}>
                <TableComponent
                  isRowExpand={false}
                  data={table2DataSource}
                  enableRowSelection={false}
                  columnHeader={table2Columns}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                />
              </Col>
            </>
          )}
        </Row>
      )}

      <Row gutter={12}>
        {!dataTab &&
          mutliData &&
          mutliData.map((item: any, index: number) => (
            <>
              {(item.multiAuthRole === '*' ||
                item.multiAuthRole.includes(user.role)) && (
                <Col
                  className="mt-3"
                  span={item.size ? item.size : 24}
                  key={index}
                >
                  <PageCardComponent style={{ marginTop: '-3vh' }}>
                    <Row justify="center" align="middle" className="mt-1">
                      <Col span={12} className={Styles2.pageSubTitle}>
                        {(user.role === 'COMPANY_AUTHORIZER' ||
                          item.multiAuthRole === '*') && (
                          <p className="page-Title">{item.title}</p>
                        )}
                      </Col>
                      <Col
                        span={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        {showDatePicker ? showDatePicker : null}
                        {showSelect ? showSelect : null}

                        {btnLabel
                          ? (user.role === authRole || authRole === '*') && (
                              <ButtonComponent
                                hierarchy="secondary-gray"
                                onClick={() => handleAdd(btnPath)}
                              >
                                {btnLabel} &nbsp; +
                              </ButtonComponent>
                            )
                          : null}
                      </Col>
                    </Row>

                    <TableComponent
                      isRowExpand={false}
                      data={
                        tableData && tableData?.length !== 0
                          ? tableData
                          : item?.dataSource
                            ? item?.dataSource
                            : []
                      }
                      enableRowSelection={false}
                      columnHeader={item?.columns ? item?.columns : []}
                      showOnlyCount={false}
                      columnCheckBoxDataAttribute="key"
                    />
                  </PageCardComponent>
                </Col>
              )}
            </>
          ))}
      </Row>

      {listData && user.role === 'COMPANY_AUTHORIZER' && (
        <>
          <p className="pageTitle mt-5">Material Topics Selected</p>
          <Card>
            <Row>
              {listData &&
                listData.map((item: any, index: number) => (
                  <Col span={8}>
                    <p className="pageTitle">{item.title}</p>
                    {item?.selectedItems?.map((selected: any) => (
                      <p style={{ color: '#17A2B8' }}>{selected}</p>
                    ))}
                  </Col>
                ))}
            </Row>
          </Card>
        </>
      )}
      {dataTab && (
        <Row>
          <Col span={24} className={!filterValue ? 'disableSelectAll' : ''}>
            <PageCardComponent>
              <Col
                className="d-flex justify-content-end"
                style={{
                  marginBottom:
                    user.role !== 'DATA_PROVIDER' && user.role !== 'SUPER_ADMIN'
                      ? '-35px'
                      : '',
                }}
              >
                {showDatePicker ? showDatePicker : null}
                {showSelect ? showSelect : null}

                {btnLabel
                  ? (user.role === authRole || authRole === '*') && (
                      <Row className="mb-4">
                        <div className={Styles2.facilityLabel}>Facility :</div>
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
                          {facilityOptions?.map((facility: any) => (
                            <Option
                              key={facility?.facility_Id}
                              value={facility?.facility_Id}
                            >
                              {facility?.facility_Name}
                            </Option>
                          ))}
                        </Select>

                        <ButtonComponent
                          disabled={
                            !(hasPermissionToAdd && facilitySelected !== '')
                          }
                          onClick={() => handleAdd(btnPath)}
                        >
                          {btnLabel} &nbsp; +
                        </ButtonComponent>
                      </Row>
                    )
                  : null}

                {user.role !== 'DATA_PROVIDER' &&
                  user.role !== 'SUPER_ADMIN' && (
                    <>
                      <div className={Styles2.facilityLabel}>Facility :</div>
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
                        {facilityOptions?.map((facility: any) => (
                          <Option
                            key={facility?.facility_Id}
                            value={facility?.facility_Id}
                          >
                            {facility?.facility_Name}
                          </Option>
                        ))}
                      </Select>
                      {/* <div className={Styles2.facilityLabel}>
                        Reporting Period :
                      </div>
                      <Select
                        className={Styles.fyDropdown}
                        placeholder={'Reporting Period'}
                        onChange={handleFinancialYearChange}
                        value={selectedFinancialYear}
                      >
                        <Option value="FY2023">FY2023</Option>
                        <Option value="FY2024">FY2024</Option>
                      </Select> */}
                    </>
                  )}
              </Col>{' '}
              <div
                className={
                  user.role === authRole || authRole === '*'
                    ? Styles.cardMargin
                    : ''
                }
              >
                <Tabs
                  activeKey={activeKey}
                  className={
                    window.location.pathname === '/environment/scope2'
                      ? 'energy'
                      : 'emission'
                  }
                  onChange={(e: any) => {
                    resetFilters();
                    setUploadedFileName(null);
                    dispatch(setSelectedRowKeys([]));
                    dispatch(updateSelectedRowKeys([]));
                    setTabIndex(e);
                    setActiveKey(e);
                    dispatch(setSelectedEmissionTab(e));
                    setShowUpdateSection(true);
                    setSelectedDataIndex(firstMonthName);
                    setFilterValue(undefined);
                    setComment('');

                    // Check if the user is not SUPER_ADMIN before calling fetchData
                    if (user?.role !== 'SUPER_ADMIN') {
                      if (pathEntity === true && mutliData[e].apiUrl) {
                        setTableData(
                          (!isEmpty(mutliData[e].apiUrl) &&
                            mutliData[e].apiUrl) ||
                            []
                        );

                        fetchData(
                          `${mutliData[e]?.apiUrl}?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
                        );
                      } else if (mutliData[e].scope) {
                        fetchData(
                          `${mutliData[e].apiUrl}?entity_Id=${user.entity_Id}&scope=${mutliData[e].scope}`
                        );
                      } else {
                        fetchData(mutliData[e].apiUrl);
                      }
                    }
                  }}
                  items={mutliData?.map((data: any, index: number) => ({
                    key: index,
                    label: data.title,
                    children: (
                      <>
                        <Spin spinning={loader}>
                          <TableComponent
                            onchange={handleChange}
                            postFilterRecords={postFilterRecords}
                            handleRevert={handleRevert}
                            handleApprove={handleApprove}
                            onHandleDelete={handleDelete}
                            maxApproverLevel={maxApproverLevel}
                            maxReviewerLevel={maxReviewerLevel}
                            isNewDelte={
                              data.title === 'Stationary Combustion' ||
                              'Mobile Combustion' ||
                              'Fugitive'
                                ? true
                                : false
                            }
                            expandableRowRenderer={expandedRowContent}
                            isRowExpand={true}
                            data={
                              !isEmpty(tableData) && tableData.length !== 0
                                ? tableData
                                : data.dataSource
                            }
                            enableRowSelection={false}
                            allowedStatuses={allowedStatuses}
                            columnHeader={
                              window.location.pathname ===
                              '/environment/emissions'
                                ? [
                                    ...data.columns.filter(
                                      (column: any) =>
                                        column.dataIndex !== 'status'
                                    ),
                                    ...dynamicColumns,
                                  ]
                                : window.location.pathname ===
                                    '/environment/scope2'
                                  ? [...data.columns, ...dynamicColumns]
                                  : data.columns
                            }
                            showOnlyCount={false}
                            columnCheckBoxDataAttribute="key"
                            noText={
                              user.role === 'SUPER_ADMIN'
                                ? `No Approved Data for this Reporting Period`
                                : null
                            }
                          />
                        </Spin>
                      </>
                    ),
                  }))}
                />
              </div>
              {user.role === 'SUPER_ADMIN' && (
                <>
                  <Row justify="end" className="mt-4">
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
          </Col>
          <ModalComponent
            isOpen={deleteModal}
            content={modalContent}
            onCancel={() => setDeleteModal(false)}
            onClose={() => setDeleteModal(false)}
            onProceed={() => handleDeleteRequest()}
          ></ModalComponent>
        </Row>
      )}
    </div>
  );
}
