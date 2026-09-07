import { useEffect, useState } from 'react';
import { Row, Col, Select, Spin, Image, Input, message } from 'antd';
import {
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';

import {
  ButtonComponent,
  InputComponent,
  TabsComponent,
} from '../../../DesignLibrary';
import styles from './scope3.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiBaseUrl, get, post, put } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useNotification } from '../../../Hooks/useNotification';

import { useDispatch } from 'react-redux';
import {
  setExpandedKeys,
  setFacilitySelected,
  setScopeThreeColumns,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../../Redux/Actions';
import {
  excludedDataIndices,
  generateFiltersAndOnFilter,
  getRowIdFromUniqueId,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from './Helpers';
import linkIcon from '../../../assets/link.png';
import { useSelector } from 'react-redux';
import StatusComponent from '../../../DesignLibrary/StatusComponent';

import EditSession from '../../content/EditSession';
import { formatNumberUS } from '../../../Utils/Strings';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';
import { isEmpty } from '../../../Utils/isEmpty';
import { Tooltip } from 'antd';
const { Option } = Select;

const ScopeThreeTable = ({
  cateTitle,
  mutliData,
  tabTitles,
  btnPath,
  updateapis,
  revertApis,
  deleteApis,
  restatedApis,
  subTabs,
  multiSubTabData,
  editApiPath,
  subHeadings = {},
}: any) => {
  const { user } = useAuth();
  const { openToast } = useNotification();
  const dispatch = useDispatch();
  const location = useLocation();

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  });
  const [loading, setLoading] = useState(false);
  const [dataSources, setDataSources] = useState<any>(
    mutliData[0]?.dataSource || []
  );

  const { company, financialYear } = location.state || {};

  const [columns, setColumns] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<string>(
    location?.state?.activeTab || '1'
  );

  const activeTabData = Number(location?.state?.activeTab) || Number('1');
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const defaultSubTabKey =
    subTabs !== undefined &&
    subTabs[activeTabData] !== undefined &&
    subTabs[activeTabData]?.[0] !== undefined &&
    subTabs[activeTabData]?.[0]?.key !== undefined &&
    subTabs[activeTabData]?.[0]?.key
      ? subTabs[activeTabData]?.[0]?.key
      : '';
  const [activeSubTab, setActiveSubTab] = useState<string>(defaultSubTabKey);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [disableResubmit, setDisableResubmit] = useState<boolean>(true);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    dispatch(setSelectedRowKeys([]));
    dispatch(updateSelectedRowKeys([]));
    setEditList([]);
    resetFilters();
  }, []);

  useEffect(() => {
    setColumns(mutliData[0]?.columns);
  }, [window.location.href]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      const key = activeTab;
      if (multiSubTabData !== undefined) {
        let subTabColumn;
        if (multiSubTabData?.length > 0) {
          const selectedTabData = multiSubTabData[Number(activeTab) - 1];
          if (
            selectedTabData !== undefined &&
            selectedTabData?.isSubTab &&
            selectedTabData?.columns &&
            selectedTabData?.columns?.length > 0
          ) {
            subTabColumn = selectedTabData?.columns?.filter(
              (e: any, index: any) => {
                return e?.id === activeSubTab;
              }
            );
          } else {
            if (!selectedTabData?.isSubTab) {
              subTabColumn = [selectedTabData?.columns[0]];
            }
          }
        }
        //setColumns(subTabColumn[0]?.column);
      } else {
        if (mutliData?.length > 0) {
          if (mutliData[parseInt(key) - 1]?.apiPath) {
            fetchApiData(mutliData[parseInt(key) - 1]?.apiPath);
          } else if (mutliData[0]?.apiPath) {
            fetchApiData(mutliData[0]?.apiPath);
            setActiveTab('1');
          } else {
            setDataSources(mutliData[parseInt(key) - 1]?.dataSource);

            //setColumns(mutliData[parseInt(key) - 1]?.columns);
          }
        }
      }
    }
  }, [mutliData, multiSubTabData, activeSubTab, activeTab, facilitySelected]);

  useEffect(() => {
    if (user?.role == 'SUPER_ADMIN') {
      const key = activeTab;
      if (multiSubTabData !== undefined) {
        let subTabColumn;
        if (multiSubTabData?.length > 0) {
          const selectedTabData = multiSubTabData[Number(activeTab) - 1];
          if (
            selectedTabData !== undefined &&
            selectedTabData?.isSubTab &&
            selectedTabData?.columns &&
            selectedTabData?.columns?.length > 0
          ) {
            subTabColumn = selectedTabData?.columns?.filter(
              (e: any, index: any) => {
                return e?.id === activeSubTab;
              }
            );
          } else {
            if (!selectedTabData?.isSubTab) {
              subTabColumn = [selectedTabData?.columns[0]];
            }
          }
        }
        //setColumns(subTabColumn[0]?.column);
      } else {
        if (mutliData?.length > 0) {
          if (mutliData[parseInt(key) - 1]?.superApi) {
            fetchSuperApiData(
              mutliData[parseInt(key) - 1]?.superApi,
              company.value,
              financialYear
            );
          } else if (mutliData[0]?.superApi) {
            fetchSuperApiData(
              mutliData[0]?.superApi,
              company.value,
              financialYear
            );
            setActiveTab('1');
          } else {
            setDataSources(mutliData[parseInt(key) - 1]?.dataSource);

            //setColumns(mutliData[parseInt(key) - 1]?.columns);
          }
        }
      }
    }
  }, [mutliData, multiSubTabData, activeSubTab, activeTab, facilitySelected]);

  useEffect(() => {
    setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
  }, []);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  const handleTabChange = (key: string) => {
    if (user?.role !== 'SUPER_ADMIN') {
      resetFilters();
      setNewValue(-1);
      setNewValue2(-1);
      dispatch(setSelectedRowKeys([]));
      dispatch(updateSelectedRowKeys([]));
      setActiveTab(key);
      setColumns(mutliData[Number(key) - 1].columns);
      setExpandedRowKeys([]);
      setComment(''); // Clear comment after saving
      setEditing(false);
      setUploadedFileName('');
      dispatch(setExpandedKeys([]));
      if (
        subTabs !== undefined &&
        subTabs[Number(key)] !== undefined &&
        subTabs[Number(key)]?.length > 0 &&
        subTabs[Number(key)][0] !== undefined
      ) {
        setActiveSubTab(subTabs[Number(key)][0]?.key);
      }
      if (multiSubTabData !== undefined) {
        let subTabColumn = [];
        if (multiSubTabData?.length > 0) {
          const selectedTabData = multiSubTabData[Number(key) - 1];
          if (
            selectedTabData !== undefined &&
            selectedTabData?.isSubTab &&
            selectedTabData?.columns &&
            selectedTabData?.columns?.length > 0
          ) {
            subTabColumn = selectedTabData?.columns?.filter(
              (e: any, index: any) => {
                return e?.id === activeSubTab;
              }
            );
          } else {
            if (!selectedTabData?.isSubTab) {
              subTabColumn = [selectedTabData?.columns[0]];
            }
          }
        }
        //setColumns(subTabColumn[0]?.column);
      } else {
        if (mutliData?.length > 0) {
          if (mutliData[parseInt(key) - 1].apiPath) {
            fetchApiData(mutliData[parseInt(key) - 1].apiPath);
          } else {
            setDataSources(mutliData[parseInt(key) - 1].dataSource);
            //setColumns(mutliData[parseInt(key) - 1].columns);
          }
        }
      }
    }
  };

  const handleSuperTabChange = (key: string) => {
    if (user?.role == 'SUPER_ADMIN') {
      resetFilters();
      setNewValue(-1);
      setNewValue2(-1);
      dispatch(setSelectedRowKeys([]));
      dispatch(updateSelectedRowKeys([]));
      setActiveTab(key);
      setColumns(mutliData[Number(key) - 1].columns);
      setExpandedRowKeys([]);
      setComment(''); // Clear comment after saving
      setEditing(false);
      setUploadedFileName('');
      dispatch(setExpandedKeys([]));
      if (
        subTabs !== undefined &&
        subTabs[Number(key)] !== undefined &&
        subTabs[Number(key)]?.length > 0 &&
        subTabs[Number(key)][0] !== undefined
      ) {
        setActiveSubTab(subTabs[Number(key)][0]?.key);
      }
      if (multiSubTabData !== undefined) {
        let subTabColumn = [];
        if (multiSubTabData?.length > 0) {
          const selectedTabData = multiSubTabData[Number(key) - 1];
          if (
            selectedTabData !== undefined &&
            selectedTabData?.isSubTab &&
            selectedTabData?.columns &&
            selectedTabData?.columns?.length > 0
          ) {
            subTabColumn = selectedTabData?.columns?.filter(
              (e: any, index: any) => {
                return e?.id === activeSubTab;
              }
            );
          } else {
            if (!selectedTabData?.isSubTab) {
              subTabColumn = [selectedTabData?.columns[0]];
            }
          }
        }
        //setColumns(subTabColumn[0]?.column);
      } else {
        if (mutliData?.length > 0) {
          if (mutliData[parseInt(key) - 1].superApi) {
            fetchApiData(mutliData[parseInt(key) - 1].superApi);
          } else {
            setDataSources(mutliData[parseInt(key) - 1].dataSource);
            //setColumns(mutliData[parseInt(key) - 1].columns);
          }
        }
      }
    }
  };

  const handleSubTabChange = (key: string) => {
    dispatch(setSelectedRowKeys([]));
    dispatch(updateSelectedRowKeys([]));
    setActiveSubTab(key);
  };

  const editData = (entity: any, path: string, finalEditList: any) => {
    setIsLoading(true);

    if (!finalEditList.length) {
      openToast({
        content: 'Please edit before resubmit',
        type: 'warning',
      });
    } else {
      const body = {
        entity_Id: entity,
        entity_role: user.role,
        updates: finalEditList,
      };

      put(`${path}`, body)
        .then((res: any) => {
          openToast({
            content: `${res?.message}`,
            type: 'success',
          });

          fetchApiData(mutliData[parseInt(activeTab) - 1].apiPath);
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          setAttachement('');
          setUploadedFileName('');
        })
        .catch((err) => {
          setAttachement('');
          setUploadedFileName('');
          openToast({
            content: `${err.message}`,
            type: 'error',
          });
        })
        .finally(() => {
          setComment('');
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
          setIsLoading(false);
          setAttachement('');
          setUploadedFileName('');
          setEditList([]);
        });
    }

    setIsLoading(false);
  };

  function convertDatesToSystemTimeZone(data: any) {
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return data.map((item: any) => ({
      ...item,
      check_in: new Date(item.check_in).toLocaleDateString('en-US', {
        timeZone: systemTimeZone,
        dateStyle: 'medium',
      }),
      check_out: new Date(item.check_out).toLocaleDateString('en-US', {
        timeZone: systemTimeZone,
        dateStyle: 'medium',
      }),
    }));
  }

  const fetchApiData = (apiPath: string) => {
    if (user?.role !== 'SUPER_ADMIN') {
      setIsLoading(true);
      setDataSources([]);
      get(
        `${apiPath}?entity_Id=${user.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      )
        .then((res: any) => {
          if (res?.response?.status === true) {
            const dataWithLocalDates = convertDatesToSystemTimeZone(
              res?.response?.data
            );
            const updatedData = dataWithLocalDates.map(
              (item: any, index: any) => ({
                ...item,
                uniqueId: index,
              })
            );

            setDataSources(updatedData);
            dispatch(setScopeThreeColumns(res?.response?.cols));
            if (mutliData[parseInt(activeTab) - 1]?.columns) {
              //setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
              dispatch(
                setScopeThreeColumns(
                  mutliData[parseInt(activeTab) - 1]?.columns
                )
              );
            }
          } else {
            setDataSources([]);
            if (res?.response?.error_message && !res?.response?.data.length) {
            }
            if (mutliData[parseInt(activeTab) - 1]?.columns) {
              dispatch(setScopeThreeColumns(res?.response?.cols));
              //setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
              dispatch(
                setScopeThreeColumns(
                  mutliData[parseInt(activeTab) - 1]?.columns
                )
              );
            }

            //setColumns(res?.response?.cols);
            dispatch(setScopeThreeColumns(res?.response?.cols));
          }
        })
        .catch((err) => {
          //setColumns([]);
          setIsLoading(false);
          //setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const fetchSuperApiData = (
    superApi: string,
    entityId: any,
    financialYear: any
  ) => {
    if (user?.role == 'SUPER_ADMIN') {
      setIsLoading(true);
      setDataSources([]);
      get(`${superApi}?entity_Id=${entityId}&financial_year=${financialYear}`)
        .then((res: any) => {
          if (res?.response?.status === true) {
            const dataWithLocalDates = convertDatesToSystemTimeZone(
              res?.response?.data
            );
            const updatedData = dataWithLocalDates.map(
              (item: any, index: any) => ({
                ...item,
                uniqueId: index,
              })
            );
            setDataSources(updatedData);
            dispatch(setScopeThreeColumns(res?.response?.cols));
            if (mutliData[parseInt(activeTab) - 1]?.columns) {
              //setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
              dispatch(
                setScopeThreeColumns(
                  mutliData[parseInt(activeTab) - 1]?.columns
                )
              );
            }
          } else {
            setDataSources([]);
            if (res?.response?.error_message && !res?.response?.data.length) {
            }
            if (mutliData[parseInt(activeTab) - 1]?.columns) {
              dispatch(setScopeThreeColumns(res?.response?.cols));
              //setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
              dispatch(
                setScopeThreeColumns(
                  mutliData[parseInt(activeTab) - 1]?.columns
                )
              );
            }

            //setColumns(res?.response?.cols);
            dispatch(setScopeThreeColumns(res?.response?.cols));
          }
        })
        .catch((err) => {
          //setColumns([]);
          setIsLoading(false);
          //setColumns(mutliData[parseInt(activeTab) - 1]?.columns);
        })
        .finally(() => setIsLoading(false));
    }
  };

  //for img name length
  const truncateText = (text: any, maxLength: any) => {
    if (!text) {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const statusColumn = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: dataSources
        ?.map((entry: any) => entry.status) // Extracting status values
        ?.filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        ?.map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,
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
              : failureStatuses.includes(status)
                ? 'failure'
                : warningStatuses.includes(status)
                  ? 'warning'
                  : 'warning'
          }
        />
      ),
    },
  ];

  const updatedDataSources =
    user.role !== 'DATA_PROVIDER'
      ? columns
      : columns?.filter(
          (item: any) => !excludedDataIndices.includes(item.dataIndex)
        );

  const [enteredValue, setEnteredValue] = useState('');

  const updateEmissionData = (record: any, body: any, apiPath: string) => {
    setIsLoading(true);

    put(apiPath, body)
      .then((res: any) => {
        if (res?.response?.status === true) {
          fetchApiData(mutliData[parseInt(activeTab) - 1].apiPath);
          message.success(res.message || 'Emission Calculated Successfully');
        } else {
          if (res.notification) {
            message.warning(res?.notification);
          }
          fetchApiData(mutliData[parseInt(activeTab) - 1].apiPath);
          if (res?.response?.error) {
            openToast({
              content: `${res?.response?.error}`,
              type: 'error',
            });
          } else {
            if (res?.message) {
              openToast({
                content: `${res?.message}`,
                type: 'warning',
              });
            }
          }
        }
      })
      .catch((err) => {
        fetchApiData(mutliData[parseInt(activeTab) - 1].apiPath);
        openToast({
          content: `${err?.response?.data?.message}`,
          type: 'error',
        });

        setDataBase('');
        setDatabase('');
        setMaterial('');
        setEmissionFactor('');
        setEmissionkgco2('');
      })
      .finally(() => {
        setIsLoading(false);
        setDataBase('');
        setDatabase('');
        setMaterial('');
        setEmissionkgco2('');
        setEmissionFactor('');
      });
  };

  const handleClick = (url: any) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'downloaded_file'); // Specify the file name here
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      message.error(`Something Went Wrong !`);
    }
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedDataIndex, setSelectedDataIndex] = useState<any>();
  const [attachement, setAttachement] = useState(''); // State for quantity
  const [comment, setComment] = useState('');
  const [editList, setEditList] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);

  const [editMap, setEditMap] = useState<{ [key: string]: boolean }>({});
  const [cellClicked, setCellClcked] = useState(null);

  const [newValue, setNewValue] = useState(-1);
  const [newValue2, setNewValue2] = useState(-1);

  const handleEditClick = (key: string) => {
    setEditMap((prevEditMap) => {
      const newEditMap: any = {};
      newEditMap[key] = true;
      return newEditMap;
    });
    setEditing(!editing);
  };

  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleSave = async (record: any) => {
    const fieldToUpdate =
      record.quantity !== undefined
        ? 'quantity'
        : record.amount !== undefined
          ? 'amount'
          : record.fuel_consumed !== undefined
            ? 'fuel_consumed'
            : record.energy_purchased !== undefined
              ? 'energy_purchased'
              : record.proportion !== undefined
                ? 'proportion'
                : record.no_of_rooms !== undefined
                  ? 'no_of_rooms'
                  : record.allocated_scope1_emission !== undefined
                    ? 'allocated_scope1_emission'
                    : record.allocated_scope2_emission !== undefined
                      ? 'allocated_scope2_emission'
                      : record.no_of_employees !== undefined
                        ? 'no_of_employees'
                        : record.no_of_trips !== undefined
                          ? 'no_of_trips'
                          : record.no_of_rooms !== undefined
                            ? 'no_of_rooms'
                            : record.no_of_nights !== undefined
                              ? 'no_of_nights'
                              : record.electricity_purchased !== undefined
                                ? 'electricity_purchased'
                                : '';

    let modifiedValue;
    let modifiedValue2;

    const index = dataSources.findIndex(
      (item: any) =>
        item.id === getRowIdFromUniqueId(record.uniqueId, dataSources)
    );

    if (index !== -1) {
      // Update the quantity value with the new value
      if (fieldToUpdate === 'quantity') {
        if (newValue === -1) {
          setNewValue(record.quantity);
          modifiedValue = record.quantity;
        } else {
          modifiedValue = newValue;
        }
        newValue !== -1
          ? (dataSources[index].quantity = newValue)
          : (dataSources[index].quantity = record.quantity);
      } else if (fieldToUpdate === 'amount') {
        if (newValue === -1) {
          setNewValue(record.amount);
          modifiedValue = record.amount;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].amount = newValue)
          : (dataSources[index].amount = record.amount);
      } else if (fieldToUpdate === 'electricity_purchased') {
        if (newValue === -1) {
          setNewValue(record.electricity_purchased);
          modifiedValue = record.electricity_purchased;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].electricity_purchased = newValue)
          : (dataSources[index].electricity_purchased =
              record.electricity_purchased);
      } else if (fieldToUpdate === 'fuel_consumed') {
        if (newValue === -1) {
          setNewValue(record.fuel_consumed);
          modifiedValue = record.fuel_consumed;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].fuel_consumed = newValue)
          : (dataSources[index].fuel_consumed = record.fuel_consumed);
      } else if (fieldToUpdate === 'energy_purchased') {
        if (newValue === -1) {
          setNewValue(record.energy_purchased);
          modifiedValue = record.energy_purchased;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].energy_purchased = newValue)
          : (dataSources[index].energy_purchased = record.energy_purchased);
      } else if (fieldToUpdate === 'proportion') {
        if (newValue === -1) {
          setNewValue(record.proportion);
          modifiedValue = record.proportion;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].proportion = newValue)
          : (dataSources[index].proportion = record.proportion);
      } else if (fieldToUpdate === 'no_of_rooms') {
        if (newValue === -1) {
          setNewValue(record.no_of_rooms);
          modifiedValue = record.no_of_rooms;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].no_of_rooms = newValue)
          : (dataSources[index].no_of_rooms = record.no_of_rooms);
      } else if (fieldToUpdate === 'no_of_nights') {
        if (newValue === -1) {
          setNewValue(record.no_of_nights);
          modifiedValue = record.no_of_nights;
        } else {
          modifiedValue = newValue;
        }
        newValue != -1
          ? (dataSources[index].no_of_nights = newValue)
          : (dataSources[index].no_of_nights = record.no_of_nights);
      }
      if (record.hasOwnProperty('allocated_scope1_emission')) {
        if (newValue === -1) {
          setNewValue(record.allocated_scope1_emission);
          modifiedValue = record.allocated_scope1_emission;
        } else {
          modifiedValue = newValue;
        }
        dataSources[index].allocated_scope1_emission =
          newValue != -1 ? newValue : record.allocated_scope1_emission;
      }

      // Update allocated_scope2_emission if present
      if (record.hasOwnProperty('allocated_scope2_emission')) {
        if (newValue2 === -1) {
          setNewValue2(record.allocated_scope2_emission);
          modifiedValue2 = record.allocated_scope2_emission;
        } else {
          modifiedValue2 = newValue2;
        }
        dataSources[index].allocated_scope2_emission =
          newValue2 != -1 ? newValue2 : record.allocated_scope2_emission;
      }
      if (record.hasOwnProperty('no_of_employees')) {
        if (newValue === -1) {
          setNewValue(record.no_of_employees);
          modifiedValue = record.no_of_employees;
        } else {
          modifiedValue = newValue;
        }
        dataSources[index].no_of_employees =
          newValue != -1 ? newValue : record.no_of_employees;
      }

      // Update allocated_scope2_emission if present
      if (record.hasOwnProperty('no_of_trips')) {
        if (newValue2 === -1) {
          setNewValue2(record.no_of_trips);
          modifiedValue2 = record.no_of_trips;
        } else {
          modifiedValue2 = newValue2;
        }
        dataSources[index].no_of_trips =
          newValue2 != -1 ? newValue2 : record.no_of_trips;
      }
    }
    if (record.hasOwnProperty('no_of_rooms')) {
      if (newValue === -1) {
        setNewValue(record.no_of_rooms);
        modifiedValue = record.no_of_rooms;
      } else {
        modifiedValue = newValue;
      }
      dataSources[index].no_of_rooms =
        newValue != -1 ? newValue : record.no_of_rooms;
    }

    // Update allocated_scope2_emission if present
    if (record.hasOwnProperty('no_of_nights')) {
      if (newValue2 === -1) {
        setNewValue2(record.no_of_nights);
        modifiedValue2 = record.no_of_nights;
      } else {
        modifiedValue2 = newValue2;
      }
      dataSources[index].no_of_nights =
        newValue2 != -1 ? newValue2 : record.no_of_nights;
    }

    let newItem;

    if (
      (record.hasOwnProperty('allocated_scope1_emission') &&
        record.hasOwnProperty('allocated_scope2_emission')) ||
      (record.hasOwnProperty('no_of_employees') &&
        record.hasOwnProperty('no_of_trips')) ||
      (record.hasOwnProperty('no_of_rooms') &&
        record.hasOwnProperty('no_of_nights'))
    ) {
      if (
        (modifiedValue !== undefined && modifiedValue <= 0) ||
        (modifiedValue !== undefined && isNaN(modifiedValue)) ||
        (modifiedValue2 !== undefined && isNaN(modifiedValue2)) ||
        (modifiedValue2 !== undefined && modifiedValue2 <= 0)
      ) {
        message.warning("The values can't be '0' or empty");
      } else {
        newItem = {
          id: getRowIdFromUniqueId(record.uniqueId, dataSources),
          uuid: attachement,
          quantity1: modifiedValue,
          quantity2: modifiedValue2,
          comment: comment,
        };

        const finalEditList = [...editList, newItem];
        setEditList(finalEditList);

        if (finalEditList.length > 0) {
          editData(
            user.entity_Id,
            editApiPath[parseInt(activeTab) - 1],
            finalEditList
          );
        }

        setNewValue(-1);
        setNewValue2(-1);
        setExpandedRowKeys([]);
        setComment(''); // Clear comment after saving
        setEditMap({
          ...editMap,
          [getRowIdFromUniqueId(record.uniqueId, dataSources)]: false,
        });
        setEditing(false);
        dispatch(setExpandedKeys([]));
      }
    } else {
      if (
        (modifiedValue !== undefined && modifiedValue <= 0) ||
        (modifiedValue !== undefined &&
          isNaN(modifiedValue) &&
          modifiedValue2 === undefined)
      ) {
        message.warning("The values can't be '0' or empty");
      } else {
        newItem = {
          id: getRowIdFromUniqueId(record.uniqueId, dataSources),
          uuid: attachement,
          quantity: modifiedValue,
          comment: comment,
        };

        const finalEditList = [...editList, newItem];
        setEditList(finalEditList);

        await editData(
          user.entity_Id,
          editApiPath[parseInt(activeTab) - 1],
          finalEditList
        );

        if (
          editApiPath[parseInt(activeTab) - 1] ===
          '/scope3_cat6/cat6_spend_based_edit/'
        ) {
          await fetchApiData(mutliData[parseInt(activeTab) - 1]?.apiPath);

          updateEmissionData(
            record,
            {
              id: getRowIdFromUniqueId(record.uniqueId, dataSources),
              material: record.kg_CO2e_per_unit,
            },
            updateapis[parseInt(activeTab) - 1]
          );
        }

        setNewValue(-1);
        setNewValue2(-1);
        dispatch(setExpandedKeys([]));
        setExpandedRowKeys([]);
        setComment(''); // Clear comment after saving
        setEditMap({ ...editMap, [record.key]: false });
        setEditing(false);

        setUploadedFileName('');
      }
    }
  };

  const [dataBase, setDataBase] = useState('');
  const [material, setMaterial] = useState('');
  const [emissionFactor, setEmissionFactor] = useState('');
  const [emissionkgco2, setEmissionkgco2] = useState('');

  const onCancelEditable = (index: number, dataIndex: any) => {
    const editableDiv = document.getElementById(
      `editable-cell-${index}-${dataIndex}`
    );

    if (editableDiv) {
      editableDiv.innerHTML = dataSources[index][dataIndex].quantity;
    }
  };

  interface RecordType {
    [key: string]: any;
  }

  const [updatedRecord, setUpdatedRecord] = useState<RecordType>({});
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);

  const [database, setDatabase] = useState('');
  const allowedStatuses = roleStatusMapping[user.role] || new Set();

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

  // Function to reset filters
  const resetFilters = () => {
    setFilteredInfo({});
  };

  const dbdropdown: any = [
    {
      title: 'Emission Factor Database',
      dataIndex: 'emission_factor_database',
      key: 'emission_factor_database',
      type: 'select',
      filters: (() => {
        return dataSources
          .map((entry: any) => entry['emission_factor_database'])
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          }));
      })(),
      filteredValue: filteredInfo.emission_factor_database || null,
      onFilter: (value: any, record: any) => {
        return record.emission_factor_database.indexOf(value) === 0;
      },
      render: (text: any, record: any, rowIndex: any) => {
        if (allowedStatuses.has(record.status)) {
          return (
            <Select
              defaultValue={
                rowIndex === currentRowIndex
                  ? database !== ''
                    ? database
                    : record.emission_factor_database
                  : record.emission_factor_database
              }
              showSearch
              onChange={(value: any) => {
                setCurrentRowIndex(
                  getRowIdFromUniqueId(record.uniqueId, dataSources)
                );
                const body = {
                  id: getRowIdFromUniqueId(record.uniqueId, dataSources),
                  database: value,
                };
                updateEmissionData(
                  record,
                  body,
                  updateapis[parseInt(activeTab) - 1]
                );
                setDatabase(value);
              }}
              className={styles.dbDropdown}
              style={{ width: '150px' }}
            >
              {record.dropdown?.map((option: any) => {
                const displayValue =
                  option === 'UK-DEFRA(2023-2024)'
                    ? 'UK-DEFRA 2023'
                    : option === 'UK-DEFRA(2024-2025)'
                      ? 'UK-DEFRA 2024'
                      : option;

                return (
                  <Option key={option} value={option}>
                    {displayValue}
                  </Option>
                );
              })}
              {/* {record.dropdown?.map((option: any) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))} */}
            </Select>
          );
        } else {
          return text;
        }
      },
    },
  ];

  const [dbOptions, setDBOPtions] = useState<any>([]);

  const getEmissionFactorOptions = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/scope3_emissions/get_dropdown_options_as_per_dB/`
      );
      const data = response.response.data;
      setDBOPtions(data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    getEmissionFactorOptions();
  }, []);

  const [materialOptions, setMaterialOptions] = useState<any>([]);

  const getData = (data: any, key: any) => {
    return data[key] || [];
  };

  useEffect(() => {
    const values = getData(dbOptions, dataBase);
    setMaterialOptions(values);
  }, [dataBase]);

  const generatedColumns =
    updatedDataSources
      ?.map((column: any) => {
        const { title, dataIndex, key, type, options } = column;
        let updatedOptions: any;
        if (dataIndex === 'emission_factor_database') {
          updatedOptions = Object.keys(dbOptions);
        } else if (
          dataIndex === 'naics_code_title' ||
          dataIndex === 'material' ||
          dataIndex === 'emission_factor_name'
        ) {
          updatedOptions = materialOptions;
        }
        const { filters, onFilter, filteredValue } = generateFiltersAndOnFilter(
          column,
          dataSources,
          filteredInfo
        );
        const hasTitle = updatedDataSources.some(
          (item: any) =>
            item.dataIndex === 'material' ||
            item.dataIndex === 'naics_code_title' ||
            item.dataIndex === 'emission_factor_name'
        );

        const hasMaterial = updatedDataSources.some(
          (item: any) => item.dataIndex === 'material'
        );

        const hasNaics = updatedDataSources.some(
          (item: any) => item.dataIndex === 'naics_code_title'
        );

        const hasEmissionFactor = updatedDataSources.some(
          (item: any) => item.dataIndex === 'emission_factor_name'
        );

        const hasWasteType = updatedDataSources.some(
          (item: any) => item.dataIndex === 'waste_type'
        );

        const hasorigin = updatedDataSources.some(
          (item: any) => item.dataIndex === 'origin_location'
        );

        const hasfuel = updatedDataSources.some(
          (item: any) => item.dataIndex === 'fuel'
        );

        const hascategory = updatedDataSources.some(
          (item: any) => item.dataIndex === 'category'
        );

        let renderFunction = null;
        if (type === 'select') {
          dataIndex === 'uom' ||
          dataIndex === 'currency' ||
          dataIndex === 'activity' ||
          dataIndex === 'fuel_type' ||
          dataIndex === 'transport_mode' ||
          dataIndex === 'country' ||
          dataIndex === 'trip_description' ||
          dataIndex === 'origin_location' ||
          dataIndex === 'destination_location' ||
          dataIndex === 'travel_class' ||
          dataIndex === 'no_of_employees' ||
          dataIndex === 'no_of_trips' ||
          dataIndex === 'category'
            ? (renderFunction = null)
            : (renderFunction = (text: any, record: any, rowIndex: any) => (
                <>
                  {allowedStatuses.has(record.status) &&
                  !roleLevels.approver.includes(user.role) ? (
                    <Select
                      value={
                        getRowIdFromUniqueId(record.uniqueId, dataSources) ===
                        currentRowIndex
                          ? dataIndex === 'emission_factor_database'
                            ? dataBase || record.emission_factor_database
                            : material ||
                              record.material ||
                              record.naics_code_title ||
                              record.emission_factor_name
                          : record[dataIndex]
                      }
                      showSearch
                      className={`${styles.dbDropdown}
                        ${
                          dataIndex === 'uom'
                            ? 'tableSelectWidthUom'
                            : dataIndex === 'material' ||
                                dataIndex === 'fuel_type'
                              ? 'materialWidth'
                              : 'tableSelectWidth'
                        }`}
                      onChange={(value: any) => {
                        setCurrentRowIndex(
                          getRowIdFromUniqueId(record.uniqueId, dataSources)
                        );

                        //other tabs
                        if (dataIndex === 'emission_factor_database') {
                          setDataBase(value);
                          dataSources[
                            record.uniqueId
                          ].emission_factor_database = value;

                          dataSources[record.uniqueId].material = null;
                          dataSources[record.uniqueId].naics_code_title = null;
                          dataSources[record.uniqueId].emission_factor_name =
                            null;

                          if (!hasTitle) {
                            if (
                              cateTitle != 'Category 6 - Business Travel' ||
                              tabTitles[parseInt(activeTab) - 1].tab !=
                                'Spend-based'
                            ) {
                              const body = {
                                id: getRowIdFromUniqueId(
                                  record.uniqueId,
                                  dataSources
                                ),
                                database: value,
                              };
                              updateEmissionData(
                                record,
                                body,
                                updateapis[parseInt(activeTab) - 1]
                              );
                            }
                          }

                          if (material) {
                            const body = {
                              id: getRowIdFromUniqueId(
                                record.uniqueId,
                                dataSources
                              ),
                              database: value,
                              material:
                                material ||
                                record.material ||
                                record.naics_code_title,
                            };
                            // Check if both database and material are selected

                            updateEmissionData(
                              record,
                              body,
                              updateapis[parseInt(activeTab) - 1]
                            );
                          }
                        }

                        if (
                          dataIndex === 'material' ||
                          dataIndex === 'naics_code_title' ||
                          dataIndex === 'emission_factor_name'
                        ) {
                          setMaterial(value);

                          if (
                            dataBase != '' ||
                            record.emission_factor_database !== null
                          ) {
                            if (dataBase) {
                              let body;
                              if (dataIndex === 'material') {
                                body = {
                                  id: getRowIdFromUniqueId(
                                    record.uniqueId,
                                    dataSources
                                  ),
                                  database:
                                    dataBase || record.emission_factor_database,
                                  material: value || record.material,
                                };
                              } else if (dataIndex === 'naics_code_title') {
                                body = {
                                  id: getRowIdFromUniqueId(
                                    record.uniqueId,
                                    dataSources
                                  ),
                                  database:
                                    dataBase || record.emission_factor_database,
                                  material: value || record.naics_code_title,
                                };
                              } else if (dataIndex === 'emission_factor_name') {
                                body = {
                                  id: getRowIdFromUniqueId(
                                    record.uniqueId,
                                    dataSources
                                  ),
                                  database:
                                    dataBase || record.emission_factor_database,
                                  material:
                                    value || record.emission_factor_name,
                                };
                              }

                              // Check if both database and material are selected

                              updateEmissionData(
                                record,
                                body,
                                updateapis[parseInt(activeTab) - 1]
                              );
                            } else if (
                              record.emission_factor_database != null
                            ) {
                              const body = {
                                id: getRowIdFromUniqueId(
                                  record.uniqueId,
                                  dataSources
                                ),
                                database: record.emission_factor_database,
                                material: value,
                              };

                              // Check if both database and material are selected

                              updateEmissionData(
                                record,
                                body,
                                updateapis[parseInt(activeTab) - 1]
                              );
                            } else {
                              message.warning('Please Select Database');
                            }
                          } else {
                            message.warning('Please select database');
                          }
                        }
                      }}
                      style={{ minWidth: '100%' }}
                    >
                      {(updatedOptions?.length
                        ? updatedOptions
                        : getData(dbOptions, record['emission_factor_database'])
                      )?.map((option: any) => {
                        const displayLabel = option.includes('UK-DEFRA')
                          ? `${option.split('(')[0].trim()} ${option.match(/\d{4}/)?.[0]}` // e.g. UK-DEFRA 2023
                          : option;

                        return (
                          <Option
                            key={option}
                            value={option}
                            disabled={
                              (dataIndex === 'emission_factor_database' &&
                                hasMaterial &&
                                (option === 'US-EPA' ||
                                  option === 'CUSTOM-EF')) ||
                              (dataIndex === 'emission_factor_database' &&
                                hasNaics &&
                                (option === 'UK-DEFRA(2023-2024)' ||
                                  option === 'UK-DEFRA(2024-2025)' ||
                                  option === 'CUSTOM-EF')) ||
                              (dataIndex === 'emission_factor_database' &&
                                hasEmissionFactor &&
                                (option === 'UK-DEFRA(2023-2024)' ||
                                  option === 'UK-DEFRA(2024-2025)' ||
                                  option === 'US-EPA')) ||
                              (dataIndex === 'emission_factor_database' &&
                                hasWasteType &&
                                (option === 'CUSTOM-EF' ||
                                  option === 'US-EPA')) ||
                              (dataIndex === 'emission_factor_database' &&
                                (hasorigin || hascategory || hasfuel) &&
                                option === 'CUSTOM-EF') ||
                              false
                            }
                          >
                            {displayLabel}
                          </Option>
                        );
                      })}
                    </Select>
                  ) : (
                    <span>
                      {' '}
                      {text === 'UK-DEFRA(2023-2024)'
                        ? 'UK-DEFRA 2023'
                        : text === 'UK-DEFRA(2024-2025)'
                          ? 'UK-DEFRA 2024'
                          : text === 'CUSTOM-EF'
                            ? 'Custom EF'
                            : text}
                    </span>
                  )}
                </>
              ));
        } else if (type === 'input') {
          renderFunction = (text: any, record: any, rowIndex: any) => {
            return (
              <>
                <Tooltip
                  title="Hit Enter after entering value"
                  overlayStyle={{ fontSize: '12px', lineHeight: '1.4' }}
                >
                  {allowedStatuses.has(record.status) &&
                  !roleLevels.approver.includes(user.role) ? (
                    <InputComponent
                      style={{
                        width: '120px',
                        height: '40px',
                        padding: '4px 8px',
                        boxSizing: 'border-box',
                      }}
                      value={record[dataIndex]}
                      type="number"
                      onKeyDown={(e: any) => {
                        if (e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e: any) => {
                        const inputValue = e.target.value;
                        const updatedRecord = { ...record }; // Create a copy of record to update immutably
                        updatedRecord[dataIndex] = inputValue; // Update the dataIndex field in the copied record
                        setEmissionkgco2(e.target.value);
                        setCurrentRowIndex(
                          getRowIdFromUniqueId(record.uniqueId, dataSources)
                        );
                        if (dataIndex === 'kg_CO2e_per_unit') {
                          setEmissionFactor(e.target.value);
                          dataSources[record.uniqueId].kg_CO2e_per_unit =
                            inputValue;
                          record[dataIndex] = inputValue;
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === '-') {
                          e.preventDefault();
                        }
                        setCurrentRowIndex(
                          getRowIdFromUniqueId(record.uniqueId, dataSources)
                        );

                        if (e.key === 'Enter') {
                          setCurrentRowIndex(-1);

                          const body = {
                            id: getRowIdFromUniqueId(
                              record.uniqueId,
                              dataSources
                            ),
                            material: parseFloat(record[dataIndex]),
                          };

                          updateEmissionData(
                            record,
                            body,
                            updateapis[parseInt(activeTab) - 1]
                          );
                        }
                      }}
                    />
                  ) : dataIndex === 'kg_CO2e_per_unit' ? (
                    <span>{formatter.format(text)}</span>
                  ) : (
                    <span>{text}</span>
                  )}
                </Tooltip>
              </>
            );
          };
        } else if (type === 'upload') {
          renderFunction = (text: any, record: any, rowIndex: any) => {
            return (
              <div>
                {text && (
                  <>
                    <Image
                      src={linkIcon}
                      preview={false}
                      style={{ height: '15px', width: '15px' }}
                    />
                    <span
                      style={{ marginLeft: '5px', cursor: 'pointer' }}
                      onClick={() => handleClick(record.disclosure)}
                    >
                      {truncateText(text, 4)}
                    </span>
                  </>
                )}
              </div>
            );
          };
        } else if (type === 'text') {
          renderFunction = (text: any) => {
            if (
              dataIndex === 'emissions_kg_co2e' ||
              dataIndex === 'emissions_t_co2e'
            ) {
              return <span>{formatNumberUS(text)}</span>;
            } else if (dataIndex === 'kg_CO2e_per_unit') {
              return <span>{formatter.format(text)}</span>;
            } else {
              return <span>{text}</span>;
            }
          };
        } else {
          // Default render function for other types or columns
          renderFunction = renderFunction = (text: any) => {
            if (dataIndex === 'invoice_no') {
              return <span>{text}</span>;
            } else {
              return isNaN(+text) ? (
                <span>{text}</span>
              ) : (
                <span>{formatter.format(text)}</span>
              );
            }
          };
        }
        const allowedDataIndexes = [
          'quantity',
          'amount',
          'fuel_consumed',
          'energy_purchased',
          'proportion',
          'no_of_rooms',
          'allocated_scope1_emission',
          'allocated_scope2_emission',
          'no_of_employees',
          'no_of_trips',
          'no_of_rooms',
          'no_of_nights',
          'electricity_purchased',
        ];
        if (allowedDataIndexes.includes(dataIndex)) {
          renderFunction = (text: any, record: any, rowIndex: any) => (
            <>
              {editMap[getRowIdFromUniqueId(record.uniqueId, dataSources)] &&
              editing ? (
                <div>
                  <Input
                    style={{ width: '80px' }}
                    type="number"
                    defaultValue={record[dataIndex]}
                    onFocus={() => {
                      setCellClcked(dataIndex);
                    }}
                    onKeyDown={(e: any) => {
                      if (
                        e.key === '-' ||
                        e.key === 'e' ||
                        e.keyCode === 40 ||
                        e.keyCode === 38 ||
                        e.key === 'E'
                      ) {
                        e.preventDefault();
                      }
                      if (
                        dataIndex === 'no_of_rooms' ||
                        dataIndex === 'no_of_nights' ||
                        dataIndex === 'no_of_trips'
                      ) {
                        if (e.key === '.') {
                          e.preventDefault();
                        }
                      }
                    }}
                    onChange={(e) => {
                      let value;
                      if (
                        dataIndex === 'amount' ||
                        dataIndex === 'quantity' ||
                        dataIndex === 'proportion' ||
                        dataIndex === 'allocated_scope1_emission' ||
                        dataIndex === 'allocated_scope2_emission' ||
                        dataIndex === 'fuel_consumed'
                      ) {
                        value = parseFloat(e.target.value);
                      } else {
                        value = parseInt(e.target.value);
                      }

                      record[dataIndex] = value;
                      if (
                        cellClicked === 'allocated_scope1_emission' ||
                        cellClicked === 'no_of_employees' ||
                        cellClicked === 'no_of_rooms'
                      ) {
                        record[dataIndex] = value;
                        setNewValue(value);
                      } else if (
                        cellClicked === 'allocated_scope2_emission' ||
                        cellClicked === 'no_of_trips' ||
                        cellClicked === 'no_of_nights'
                      ) {
                        record[dataIndex] = value;
                        setNewValue2(value);
                      } else {
                        record[dataIndex] = value;
                        setNewValue(value);
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                  }}
                >
                  <div>
                    {
                      dataIndex === 'quantity' || dataIndex === 'proportion'
                        ? formatter.format(record[dataIndex]) // Apply formatter.format for both quantity and proportion
                        : formatter.format(record[dataIndex]) // Apply formatter.format for other cases as well
                    }
                  </div>
                </div>
              )}
            </>
          );
        }

        if (dataIndex !== 'status') {
          return {
            title: (
              <span style={{ textTransform: 'initial' }}>
                {dataIndex === 'proportion' ? 'Proportion (100%)' : title}
              </span>
            ),
            dataIndex: dataIndex,
            key: key,
            className: 'cellWidth',
            width: dataIndex === 'naics_code_title' ? '300px' : '',
            align:
              dataIndex === 'invoice_no' ||
              dataIndex === 't_and_d_loss_rate' ||
              dataIndex === 'electricity_purchased' ||
              dataIndex === 'kg_CO2e_per_unit'
                ? 'right'
                : '',
            render: renderFunction,
            filteredValue,
            filters,
            onFilter,
          };
        }

        return null;
      })
      ?.filter(Boolean) || [];

  const specificColumn = 'kg_CO2e_per_unit';
  const specificColumnIndex = generatedColumns.findIndex(
    (column: any) => column.key === specificColumn
  );

  const finalColumns =
    generatedColumns?.length > 0
      ? [
          ...statusColumn,
          ...generatedColumns.slice(0, specificColumnIndex),
          ...generatedColumns.slice(specificColumnIndex),
        ]
      : [];

  const updateData = (entity: any, action: string, path: string) => {
    setIsLoading(true);
  };

  let body;
  const handleRevertAction = (idsLst: any) => {
    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(selectedRows)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }

    const path = revertApis[parseInt(activeTab) - 1];
    body = {
      entity_Id: user.entity_Id,
      ids: ids,
      status: revertstatusMessage,
    };
    put(`${path}`, body)
      .then((res: any) => {
        fetchApiData(mutliData[parseInt(activeTab) - 1]?.apiPath);
        openToast({
          content: `${res?.message}`,
          type: 'success',
        });
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
        setUploadedFileName('');
        setEditList([]);
      })
      .catch((err) => {
        openToast({
          content: `${err?.response?.data.message}`,
          type: 'error',
        });
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
        setEditList([]);
      })
      .finally(() => {
        setEditList([]);
      });
  };
  const handleSubmitForNextLevel = (idsLst: any) => {
    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }

    const hasNullValues = idsLst.every((item: any) => {
      return (
        ((item.emission_factor_database === null ||
          item.emission_factor_database === '') &&
          (item.kg_CO2e_per_unit === null || item.kg_CO2e_per_unit === 0)) ||
        item.emissions_kg_co2e === null ||
        item.emissions_kg_co2e === 0 ||
        item.emissions_t_co2e === null
      );
    });

    if (hasNullValues && user.role !== 'DATA_PROVIDER') {
      message.warning('Please calculate the values.');
    } else {
      const path = revertApis[parseInt(activeTab) - 1];
      body = {
        entity_Id: user.entity_Id,
        ids: ids,
        status: forwardstatusMessage,
      };
      put(`${path}`, body)
        .then((res: any) => {
          openToast({
            content: `${res?.message}`,
            type: 'success',
          });

          fetchApiData(mutliData[parseInt(activeTab) - 1]?.apiPath);

          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          openToast({
            content: `${err.message}`,
            type: 'error',
          });
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .finally(() => {});
    }
  };

  const handleEditUploadFile = (info: any) => {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      setUploadedFileName(info?.file?.name);
      openToast({
        content: `${info.file.name}`,
        type: 'success',
      });
      const UID = info.file.response?.response?.data;
      setAttachement(UID);
    }
  };

  const handleRevert = (idsLst: any) => {
    handleRevertAction(idsLst);
  };

  const handleApprove = (idsLst: any) => {
    handleSubmitForNextLevel(idsLst);
  };

  const expandedRowContent = (record: any, index: any) => {
    return (
      <EditSession
        showIsUpload={true}
        handleEditUploadFile={handleEditUploadFile}
        record={record}
        index={index}
        comment={comment}
        setComment={setComment}
        handleSaveClick={handleSave}
        handleEditClick={handleEditClick}
        data={dataSources}
        allowedStatuses={allowedStatuses}
        uploadedFileName={uploadedFileName}
        maxReviewerLevel={maxReviewerLevel}
        maxApproverLevel={maxApproverLevel}
      />
    );
  };

  const [entityData, setEntityData] = useState<any>([]);
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const fetchEntityData = async (apiUrl: string) => {
    setLoading(true);
    try {
      const res = await get(apiUrl);
      if (
        !isEmpty(res) &&
        !isEmpty(res?.response) &&
        !isEmpty(res?.response?.status) &&
        res?.response?.status !== false
      ) {
        const data = !isEmpty(res?.response?.data) ? res?.response?.data : [];
        setEntityData(data);
      }
    } catch (err) {
      console.error('Error fetching entity data:', err);
    } finally {
      setLoading(false); // Hide loader after API call
    }
  };

  useEffect(() => {
    fetchEntityData('/entity/getEntitiesListByUserId/');
  }, []);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (entityData.length && facilitySelected !== '') {
        const isFacilityPresent = entityData.some((entity: any) => {
          const roleMatch = entity.entity_Role.some((role: any) => {
            return role.facility_Id?.includes(facilitySelected);
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
          facilityIds &&
            facilityIds.length > 0 &&
            facilityIds[0].length > 0 &&
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

  const getApiFacility = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      let data = response?.response?.data;
      setFacilityOptions(data);
    } catch (err) {
      console.log(err);
    } finally {
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
    setComment('');
  }, [expandedKeys]);

  useEffect(() => {
    if (facilityList.length && user?.role !== 'SUPER_ADMIN') {
      getApiFacility();
    }
  }, [facilityList]);

  useEffect(() => {
    if (location.state?.activeTab === undefined) {
      setActiveTab('1');
    }
    dispatch(setFacilitySelected(''));
  }, [window.location.href]);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      const fetchFaclityData = () => {
        get(`/facility/get_Facility/?entity_Id=${user.entity_Id}`)
          .then((res: any) => {
            if (res.response?.status !== false) {
              if (res.response?.data) {
                setFacilityList(res.response?.data);
              }
            } else {
              setFacilityList([]);
              openToast({
                content: `${res.message}`,
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

  const getClassName = () => {
    if (window.location.pathname === '/scope3/category-3') {
      return user.role === 'DATA_PROVIDER'
        ? styles.cat3Margin
        : styles.cardDrMargin;
    }

    return user.role === 'DATA_PROVIDER'
      ? styles.cat3Margin
      : styles.cardDrMargin;
  };

  const className = getClassName();

  const excludedProperties = [
    'check_in',
    'check_out',
    'comments',
    'disclosure_uuid',
    'file_name',
    'kg_CO2e_per_unit',
    'emission_factor_database',
    'emissions_kg_co2e',
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

    const url = deleteApis[parseInt(activeTab) - 1];

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
        fetchApiData(mutliData[parseInt(activeTab) - 1]?.apiPath);
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

  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');
  const financialYearGetApi = (financialYear: string) => {
    setIsLoading(true);

    const url = `${apiBaseUrl}${restatedApis[parseInt(activeTab) - 1]}?entity_Id=${user.entity_Id}&financial_year_cal=${financialYear}`;

    const body = {};

    put(url, body) // Pass the payload (body) along with the URL
      .then((res: any) => {
        if (
          !isEmpty(res) &&
          !isEmpty(res?.response) &&
          !isEmpty(res?.response?.status) &&
          res?.response?.status === true
        ) {
          fetchApiData(mutliData[parseInt(activeTab) - 1]?.apiPath);
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
        fetchApiData(mutliData[parseInt(activeTab) - 1]?.apiPath);
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
    <>
      {/* <Row justify="center" align="middle" className="mt-4 mb-4">
        <Col span={24}>
          <p className="pageTitle">Scope 3 Emission Calculator</p>
        </Col>
      </Row> */}
      {/* <Card> */}
      <PageCardComponent customClass={styles.pageCardStyle}>
        <LoaderComponent spinning={loading}>
          {user.role == 'DATA_PROVIDER' ? (
            <Row justify="end" align="middle">
              {/* <Col span={12} className={styles.pageSubTitle}>
              {cateTitle}
            </Col> */}
              <Col span={12} className="d-flex justify-content-end">
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
                      <Option
                        key={facility?.facility_Id}
                        value={facility?.facility_Id}
                      >
                        {facility?.facility_Name}
                      </Option>
                    ))}
                  </Select>
                  <ButtonComponent
                    disabled={!(hasPermissionToAdd && facilitySelected !== '')}
                    onClick={() => {
                      navigate(btnPath, {
                        state: { activeTab, columns },
                      });
                    }}
                  >
                    Add &nbsp; +
                  </ButtonComponent>
                </>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={24} className={styles.pageSubTitle}>
                {/* {cateTitle} */}
              </Col>
            </Row>
          )}

          {user.role !== 'DATA_PROVIDER' && user.role !== 'SUPER_ADMIN' && (
            <>
              <Row justify="end" align="middle">
                <Col
                  span={12}
                  className="d-flex justify-content-end"
                  style={{
                    marginBottom:
                      btnPath === '/scope3/category-3/form' ? '10px' : '-35px',
                  }}
                >
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
                      <Option
                        key={facility?.facility_Id}
                        value={facility?.facility_Id}
                      >
                        {facility?.facility_Name}
                      </Option>
                    ))}
                  </Select>
                  {/* <div className={styles.facilityLabel}>Reporting period :</div>
                  <Select
                    className={styles.fyDropdown}
                    placeholder={'Reporting Period'}
                    onChange={handleFinancialYearChange}
                    value={selectedFinancialYear}
                    disabled={
                      (btnPath === '/scope3/category-1/form' &&
                        activeTab === '3') ||
                      (btnPath === '/scope3/category-2/form' &&
                        activeTab === '3') ||
                      (btnPath === '/scope3/category-3/form' &&
                        activeTab === '4') ||
                      (btnPath === '/scope3/category-5/form' &&
                        (activeTab === '1' || activeTab === '3')) ||
                      (btnPath === '/scope3/category-6/form' &&
                        activeTab === '3')
                    }
                  >
                    <Option value="FY2023">FY2023</Option>
                    <Option value="FY2024">FY2024</Option>
                  </Select> */}
                </Col>
              </Row>
            </>
          )}
          <div className={className}>
            <TabsComponent
              activeKey={activeTab}
              onChange={
                user?.role === 'SUPER_ADMIN'
                  ? handleSuperTabChange
                  : handleTabChange
              }
              tabs={tabTitles}
            />
          </div>

          {subTabs !== undefined &&
            subTabs[Number(activeTab)] !== undefined &&
            subTabs[Number(activeTab)] !== '' && (
              <div className={styles.subTabRow}>
                <TabsComponent
                  activeKey={activeSubTab}
                  onChange={handleSubTabChange}
                  tabs={subTabs[Number(activeTab)]}
                />
              </div>
            )}
          {subHeadings[activeTab] && <p>{subHeadings[activeTab]}</p>}
          <Spin spinning={isLoading}>
            <TableComponent
              onchange={handleChange}
              handleRevert={handleRevert}
              isNewDelte={true}
              onHandleDelete={handleDelete}
              postFilterRecords={postFilterRecords}
              maxApproverLevel={maxApproverLevel}
              maxReviewerLevel={maxReviewerLevel}
              handleApprove={handleApprove}
              expandableRowRenderer={expandedRowContent}
              isRowExpand={true}
              data={dataSources}
              enableRowSelection={false}
              allowedStatuses={allowedStatuses}
              columnHeader={finalColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
              noText={
                user.role === 'SUPER_ADMIN'
                  ? `No Approved Data for this Reporting Period`
                  : null
              }
            />
          </Spin>
        </LoaderComponent>
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
};

export default ScopeThreeTable;
