import React, { useEffect, useState } from 'react';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { Radio, Tooltip } from 'antd';
import styles from './scope3.module.scss';
import {
  Row,
  Col,
  Tabs,
  message,
  Select,
  Input,
  Upload,
  Button,
  Image,
  Popover,
  List,
} from 'antd';
import { useAuth } from '../../../Hooks/useAuth';
import { apiBaseUrl, get, post, put } from '../../../Services';
import linkIcon from '../../../assets/link.png';
import editIcon from '../../../assets/edit.png';
import {
  excludedDataIndicesCatthirteen,
  generateFiltersAndOnFilter,
  getRowIdFromUniqueId,
  requestedDeleteStatusMapping,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from './Helpers';
import {
  catThirteenAssestSpecificcolsScope1,
  catThirteenAssestSpecificcolsScope2,
  catThirteenAssestSpecificcolsWithoutTable,
  catThirteenAvgDatacolsAsset,
  catThirteenAvgDatacolsFloor,
  catThirteenLesseSpecificcols,
  energyCombustionColCat13,
  fugitiveEmissionsColCat13,
  processEmissionsColCat13,
  stationaryCombustionColCat13,
} from '../../../Modules/Emission/mock';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNotification } from '../../../Hooks/useNotification';
import { useDispatch } from 'react-redux';
import {
  setExpandedKeys,
  setFacilitySelected,
  setScopeThreeColumns,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../../Redux/Actions';
import EditSession from '../../content/EditSession';
import StatusComponent from '../../../DesignLibrary/StatusComponent';
import { formatNumberUS } from '../../../Utils/Strings';
import { isEmpty } from '../../../Utils/isEmpty';

const { TabPane } = Tabs;

type DataKey = 'scope1' | 'scope2' | 'lessee' | 'floor' | 'asset' | 'without';

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
});

const formatToDigitTwo = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function CatThirteenTable() {
  const [fuelData, setFuelData] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [lesseeData, setLesseeData] = useState([]);
  const [floorData, setFloorData] = useState([]);
  const [withoutData, setWithoutData] = useState<any>();
  const [withData, setWithData] = useState<any>();

  const [pathstatus, setPathStatus] = useState('');
  const [pathdropdown, setPathDropdown] = useState(
    '/scope3_cat13/calculate_emissions_from_asset_specific_sub_meter_cat13/'
  );
  const [pathedit, setPathEdit] = useState(
    '/scope3_cat13/edit_cat13_asset_specific_data/'
  );

  const dispatch = useDispatch();
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);

  const location = useLocation();
  const [leasedAssets, setLeasedAssets] = useState('');
  const [lesseeAssets, setLesseeAssets] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [attachement, setAttachement] = useState(''); // State for quantity
  const [selectedDataIndex, setSelectedDataIndex] = useState<any>();
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState('');
  const [facilityList, setFacilityList] = useState([]);

  const [editMap, setEditMap] = useState<{ [key: string]: boolean }>({});

  const [cellClicked, setCellClcked] = useState(null);
  const [newValue, setNewValue] = useState(-1);
  const [newValue2, setNewValue2] = useState(-1);
  const [newValue3, setNewValue3] = useState(-1);

  const { openToast } = useNotification();
  const selectedRows = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );

  const { user } = useAuth();
  const navigate = useNavigate();

  const { company, financialYear } = location.state || {};

  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('');

  const [activeTab, setActiveTab] = useState(location?.state?.activeTab || '1');
  const [quantityedit, setQuantityEdit] = useState('');
  const [activeSubTab, setActiveSubTab] = useState(
    location?.state?.activeSubTab || '4'
  );
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);
  const [currentRole, setCurrentRole] = useState(user.role);
  const [disableResubmit, setDisableResubmit] = useState<boolean>(true);

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const showAddButton = false;

  const [editList, setEditList] = useState<any[]>([]);
  const [valueselected, setValueSelected] = useState(
    location.state?.valueselected || 'with-submeter'
  );

  const [subActiveTabTitle, setSubActiveTabTitle] = useState('Home');
  const [subActiveTabKey, setSubActiveTabKey] = useState(
    location?.state?.subActiveTabKey || '1'
  );

  const filterColumnsByRole = (
    columns: any[],
    role: string,
    excludedIndices: any[]
  ) => {
    // Define the status column
    const statusColumn = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
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

    // Add the status column to the existing columns
    let updatedColumns = [...columns];
    updatedColumns = [...statusColumn, ...columns];

    // Return columns based on role filtering
    return role !== 'DATA_PROVIDER'
      ? updatedColumns // No filtering for other roles
      : updatedColumns?.filter(
          (item: any) => !excludedIndices.includes(item.dataIndex) // Filter based on excludedIndices
        );
  };

  const CalcApis = [
    '/scope3_cat13/calculate_cat_13_stationary/',
    '/scope3_cat13/calculate_cat_13_process/',
    '/scope3_cat13/calculate_cat_13_fugitive/',
    '/scope3_cat13/calculate_cat_13_energy/',
    '/scope3_cat13/calculate_emissions_from_lessee_specific_method_cat13/',
    '/scope3_cat13/calculate_floor_average_emissions/',
  ];

  const { Option } = Select;

  const editApis = [
    '/scope3_cat13/cat13_stationary_edit/',
    '/scope3_cat13/cat13_process_edit/',
    '/scope3_cat13/cat13_fugitive_edit/',
    '/scope3_cat13/cat13_energy_edit/',
    '/scope3_cat13/edit_cat13_asset_specific_data/',
    '/scope3_cat13/edit_cat13_lessee_specific/',
    '/scope3_cat13/edit_cat13_floor_average_data/',
  ];
  const deleteApis = [
    '/scope3_cat13/manage_deletion_for_cat13_stationary/',
    '/scope3_cat13/manage_deletion_for_cat13_Process/',
    '/scope3_cat13/manage_deletion_for_cat13_fugitive/',
    '/scope3_cat13/manage_deletion_for_cat13_energy/',
    '',
    '/scope3_cat13/manage_deletion_for_cat13_lesse_specific/',
    '/scope3_cat13/manage_deletion_for_cat13_average_data_method/',
  ];

  const [entityData, setEntityData] = useState<any>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);
  useEffect(() => {
    if (activeTab === '1' && valueselected === 'with-submeter') {
      if (subActiveTabKey === '1') {
        setPathDropdown(CalcApis[0]);
      } else if (subActiveTabKey === '2') {
        setPathDropdown(CalcApis[1]);
      } else if (subActiveTabKey === '3') {
        setPathDropdown(CalcApis[2]);
      } else if (subActiveTabKey === '4') {
        setPathDropdown(CalcApis[3]);
      }
    } else if (activeTab === '1' && valueselected === 'without-submeter') {
      setPathDropdown(
        '/scope3_cat13/calculate_emissions_from_asset_specific_without_sub_meter_method/'
      );
    } else if (activeTab === '2') {
      setPathDropdown(CalcApis[4]);
    } else if (activeTab === '3') {
      setPathDropdown(CalcApis[5]);
    }
  }, [activeTab, valueselected, subActiveTabKey]);

  const fetchEnityData = (apiUrl: any) => {
    get(apiUrl)
      .then((res) => {
        if (res.response.status !== false) {
          setEntityData(res.response.data);
        }
      })
      .finally();
  };
  useEffect(() => {
    fetchEnityData('/entity/getEntitiesListByUserId/');
    resetFilters();
  }, []);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      if (entityData.length && facilitySelected !== '') {
        const isFacilityPresent = entityData.some((entity: any) => {
          const roleMatch = entity.entity_Role.some((role: any) => {
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
    }
  }, [entityData, facilitySelected]);

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
    if (user?.role !== 'SUPER_ADMIN') {
      const fetchFaclityData = () => {
        get(`/facility/get_Facility/?entity_Id=${user.entity_Id}`).then(
          (res: any) => {
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
          }
        );
      };
      fetchFaclityData();
    }
  }, []);

  useEffect(() => {
    if (activeTab === '1' && valueselected === 'with-submeter') {
      if (subActiveTabKey === '1') {
        setPathEdit(editApis[0]);
      } else if (subActiveTabKey === '2') {
        setPathEdit(editApis[1]);
      } else if (subActiveTabKey === '3') {
        setPathEdit(editApis[2]);
      } else if (subActiveTabKey === '4') {
        setPathEdit(editApis[3]);
      }
    } else if (activeTab === '1' && valueselected === 'without-submeter') {
      setPathEdit(
        '/scope3_cat13/edit_asset_specific_without_submeter_method_data/'
      );
    } else if (activeTab === '2') {
      setPathEdit(editApis[5]);
    } else if (activeTab === '3') {
      setPathEdit(editApis[6]);
    }
  }, [activeTab, valueselected, subActiveTabKey]);

  const editablecols = [
    'quantity',
    'fuel_consumed',
    'no_of_assets',
    'asset_area',
    'qty',
    'total_lessee_asset_area_vol_qty',
    'lessee_asset_area_vol_qty',
    'total_lessee_scope1_scope2_emission',
  ];

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

  const [filteredInfo, setFilteredInfo] = useState<any>({});

  const truncateText = (text: any, maxLength: any) => {
    if (!text) {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const [dataActive, setDataActive] = useState<any>([]);
  const handleGetData = () => {
    if (
      activeTab === '1' &&
      valueselected === 'with-submeter' &&
      user?.role !== 'SUPER_ADMIN'
    ) {
      handleScopeoneFuelDataGetApi(subActiveTabKey);
    } else if (
      activeTab === '1' &&
      valueselected === 'without-submeter' &&
      user?.role !== 'SUPER_ADMIN'
    ) {
      handleWithoutSubmeterGetData();
    } else if (activeTab === '2' && user?.role !== 'SUPER_ADMIN') {
      handleLesseeDataGetApi();
      const updatedData: any = lesseeData.map((item: any, index: any) => ({
        ...item,
        uniqueId: index,
        status:
          maxReviewerLevel === 'L1_DATA_REVIEWER' &&
          item.status === 'For L1 Review'
            ? 'For Review'
            : item.status,
      }));
      setDataActive(updatedData);
    } else if (activeTab == '3' && user?.role !== 'SUPER_ADMIN') {
      handleFloorDataGetApi();
      const updatedData: any = floorData?.map((item: any, index: any) => ({
        ...item,
        uniqueId: index,
        status:
          maxReviewerLevel === 'L1_DATA_REVIEWER' &&
          item.status === 'For L1 Review'
            ? 'For Review'
            : item.status,
      }));
      setDataActive(updatedData);
    }
  };

  const handleGetSuperData = () => {
    if (
      activeTab === '1' &&
      valueselected === 'with-submeter' &&
      user?.role === 'SUPER_ADMIN'
    ) {
      handleScopeoneFuelDataSuperGetApi(
        company.value,
        financialYear,
        subActiveTabKey
      );
    } else if (
      activeTab === '1' &&
      valueselected === 'without-submeter' &&
      user?.role === 'SUPER_ADMIN'
    ) {
      handleWithoutSubmeterSuperGetData(company.value, financialYear);
    } else if (activeTab === '2' && user?.role === 'SUPER_ADMIN') {
      handleLesseeDataSuperGetApi(company.value, financialYear);
      const updatedData: any = lesseeData.map((item: any, index: any) => ({
        ...item,
        uniqueId: index,
        status:
          maxReviewerLevel === 'L1_DATA_REVIEWER' &&
          item.status === 'For L1 Review'
            ? 'For Review'
            : item.status,
      }));
      setDataActive(updatedData);
    } else if (activeTab == '3' && user?.role === 'SUPER_ADMIN') {
      handleFloorDataSuperGetApi(company.value, financialYear);
      const updatedData: any = floorData?.map((item: any, index: any) => ({
        ...item,
        uniqueId: index,
        status:
          maxReviewerLevel === 'L1_DATA_REVIEWER' &&
          item.status === 'For L1 Review'
            ? 'For Review'
            : item.status,
      }));
      setDataActive(updatedData);
    }
  };

  const [dbValue, setDbValue] = useState(null);

  const modifyColumnsWithRowStatus = (columns: any, role: any) => {
    return columns.map((column: any) => {
      if (editablecols.includes(column.dataIndex)) {
        return {
          ...column,

          render: (text: any, record: any) => {
            const { status } = record;
            const id = record.id;
            const handleInputChange = (value: any) => {
              setQuantityEdit(value);
            };
            if (
              (role === 'DATA_PROVIDER' && status === 'For DP Revision') ||
              (role === 'L1_DATA_REVIEWER' &&
                (status === 'For L1 Review' ||
                  status === 'For Review' ||
                  status === 'For L1 DR Revision' ||
                  status === 'For DR Revision')) ||
              (role === 'L2_DATA_REVIEWER' &&
                (status === 'For L2 Review' ||
                  status === 'For L2 DR Revision')) ||
              (role === 'L3_DATA_REVIEWER' &&
                (status === 'For L3 Review' || status === 'For L3 DR Revision'))
            ) {
              return (
                <>
                  {editMap[getRowIdFromUniqueId(record.uniqueId, dataActive)] &&
                  editing ? (
                    <div>
                      <Input
                        style={{ width: '80px' }}
                        type="number"
                        onFocus={() => {
                          setCellClcked(column.dataIndex);
                        }}
                        onKeyDown={(e: any) => {
                          if (e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                          }
                        }}
                        defaultValue={text}
                        onChange={(e: any) => {
                          const value = e.target.value;
                          handleInputChange(value);

                          if (
                            cellClicked ===
                            'total_lessee_scope1_scope2_emission'
                          ) {
                            record[column.dataIndex] = value;
                            setNewValue(value);
                          } else if (
                            cellClicked === 'lessee_asset_area_vol_qty'
                          ) {
                            record[column.dataIndex] = value;
                            setNewValue2(value);
                          } else if (
                            cellClicked === 'total_lessee_asset_area_vol_qty'
                          ) {
                            record[column.dataIndex] = value;
                            setNewValue3(value);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className={styles.more}>
                      {text && (
                        <>
                          <p>{formatNumberUS(text)}</p>
                        </>
                      )}
                    </div>
                  )}
                </>
              );
            } else {
              return formatNumberUS(text);
            }
          },
        };
      } else if (
        column.dataIndex === 'total_emission_kgco2e' ||
        column.dataIndex === 'total_emission_tco2e' ||
        column.dataIndex === 'total_downstream_lessed_asset_tco2e' ||
        column.dataIndex === 'total_downstream_lessed_asset_kgco2e' ||
        column.dataIndex === 'emissions_t_co2e' ||
        column.dataIndex === 'emissions_kg_co2e' ||
        column.dataIndex === 'total_emission'
      ) {
        return {
          ...column,
          render: (text: any, record: any) => {
            return <span>{formatNumberUS(text)}</span>;
          },
        };
      } else if (
        column.dataIndex === 'emission_factor_database' ||
        column.dataIndex === 'emission_factor_name'
      ) {
        return {
          ...column,
          onFilter: (value: any, record: any) =>
            record.emission_factor_database.indexOf(value) === 0,
          filteredValue: filteredInfo.emission_factor_database || null,
          render: (text: any, record: any, rowIndex: any) => {
            const { status } = record;
            const id = getRowIdFromUniqueId(record.uniqueId, dataActive);

            // Define editable statuses per role
            const editableStatusesByRole: { [key: string]: string[] } = {
              L1_DATA_REVIEWER: [
                'For L1 Review',
                'For L1 DR Revision',
                'For Review',
              ],
              L2_DATA_REVIEWER: [
                'For L2 Review',
                'For L2 DR Revision',
                'For Review',
              ],
              L3_DATA_REVIEWER: [
                'For L3 Review',
                'For L3 DR Revision',
                'For Review',
              ],
            };

            const isReviewerEditable =
              editableStatusesByRole[role]?.includes(status);

            const handleDChange = (value: any, index: any) => {
              setDbValue(value);
              const commonPayload = {
                database: value,
              };

              const payload =
                activeTab !== '3' || activeSubTab === '2'
                  ? {
                      ...commonPayload,
                      entity_Id: user.entity_Id,
                      id: record.id,
                    }
                  : { ...commonPayload, id };

              put(pathdropdown, payload)
                .then((res) => {
                  const errMsg = res?.message;
                  message.success(errMsg);
                  handleGetData();
                })
                .catch((err) => {
                  message.error(
                    'The selected activity type does not exist in the emission factor database.'
                  );

                  handleGetData();
                });
            };

            if (isReviewerEditable) {
              return (
                <Select
                  defaultValue={
                    rowIndex === currentRowIndex
                      ? dbValue !== ''
                        ? dbValue
                        : record.emission_factor_name
                      : record.emission_factor_name
                  }
                  style={{ width: '160px' }}
                  onChange={(e) => {
                    handleDChange(e, rowIndex);
                    setCurrentRowIndex(rowIndex);
                  }}
                  className={styles.dbDropdown}
                >
                  {dropdownOptions?.map((option: any) => {
                    const displayValue =
                      option === 'UK-DEFRA(2023-2024)'
                        ? 'UK-DEFRA 2023'
                        : option === 'UK-DEFRA(2024-2025)'
                          ? 'UK-DEFRA 2024'
                          : option === 'CUSTOM-EF'
                            ? 'Custom EF'
                            : option;

                    return (
                      <Option
                        key={option}
                        value={option}
                        disabled={option === 'US-EPA'}
                      >
                        {displayValue}
                      </Option>
                    );
                  })}
                </Select>
              );
            } else {
              let readableText = record.emission_factor_name;

              if (readableText === 'UK-DEFRA(2023-2024)') {
                readableText = 'UK-DEFRA 2023';
              } else if (readableText === 'UK-DEFRA(2024-2025)') {
                readableText = 'UK-DEFRA 2024';
              } else if (readableText === 'CUSTOM-EF') {
                readableText = 'Custom EF';
              }

              return <span>{readableText}</span>;
            }
          },
        };
      } else if (column.dataIndex === 'kg_CO2e_per_unit') {
        if (
          (activeTab === '1' && valueselected === 'without-submeter') ||
          activeTab === '3'
        ) {
          return {
            ...column,
            render: (text: any, record: any) => {
              const { status } = record;
              const id = getRowIdFromUniqueId(record.uniqueId, dataActive);

              const handleIChange = (value: any) => {
                let payload;

                if (activeTab === '3') {
                  payload = {
                    id: id,
                    material: parseFloat(value),
                  };
                } else {
                  if (
                    valueselected === 'without-submeter' &&
                    activeTab === '1'
                  ) {
                    payload = {
                      id: id,
                      kg_CO2e_per_unit: parseFloat(value),
                      total_emission_preload: withoutTotalData,
                    };
                  } else {
                    payload = {
                      id: id,
                      kg_CO2e_per_unit: parseFloat(value),
                    };
                  }
                }
                put(pathdropdown, payload)
                  .then((res) => {
                    message.success('Calculated successfully');
                    handleGetData();
                  })
                  .catch((err) => {
                    message.error(err?.response?.data.message);
                  });
              };
              if (
                (role === 'L1_DATA_REVIEWER' &&
                  (status === 'For L1 Review' ||
                    status === 'For Review' ||
                    status === 'For L1 DR Revision' ||
                    status === 'For DR Revision')) ||
                (role === 'L2_DATA_REVIEWER' &&
                  (status === 'For L2 Review' ||
                    status === 'For L2 DR Revision')) ||
                (role === 'L3_DATA_REVIEWER' &&
                  (status === 'For L3 Review' ||
                    status === 'For L3 DR Revision'))
              ) {
                return (
                  <>
                    <Tooltip
                      title="Hit Enter after entering value"
                      overlayStyle={{ fontSize: '12px', lineHeight: '1.4' }}
                    >
                      <Input
                        defaultValue={record[column.dataIndex]}
                        value={
                          dataActive &&
                          dataActive[
                            getRowIdFromUniqueId(record.uniqueId, dataActive)
                          ] &&
                          dataActive[
                            getRowIdFromUniqueId(record.uniqueId, dataActive)[
                              column.dataIndex
                            ]
                          ] !== null &&
                          dataActive[
                            getRowIdFromUniqueId(record.uniqueId, dataActive)[
                              column.dataIndex
                            ]
                          ]
                        }
                        style={{ width: '100%' }}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (
                            dataActive &&
                            dataActive[
                              record &&
                                record.uniqueId &&
                                dataActive[record.uniqueId]?.kg_CO2e_per_unit
                            ]
                          ) {
                            dataActive[record.uniqueId].kg_CO2e_per_unit =
                              value;
                          }
                        }}
                        onKeyPress={(e) => {
                          const target = e.target as HTMLInputElement;
                          const currentValue = target.value;

                          if (!/[\d.]/.test(e.key) || e.key === '-') {
                            e.preventDefault();
                          }
                          if (e.key === 'Enter') {
                            handleIChange(currentValue);
                          }
                        }}
                      ></Input>
                    </Tooltip>
                  </>
                );
              } else {
                return (
                  <>
                    {' '}
                    <span>{formatter.format(text)}</span>
                  </>
                );
              }
            },
          };
        } else {
          return {
            ...column,
            render: (text: any, record: any) => {
              return (
                <>
                  <span style={{ marginLeft: '5px' }}>
                    {formatter.format(text)}
                  </span>
                </>
              );
            },
          };
        }
      } else if (column.dataIndex === 'disclosure') {
        return {
          ...column,
          render: (text: any, record: any) => {
            const { status } = record;
            const id = getRowIdFromUniqueId(record.uniqueId, dataActive);
            return (
              <>
                <Image
                  src={linkIcon}
                  preview={false}
                  style={{ height: '15px', width: '15px' }}
                />

                <span
                  style={{ marginLeft: '5px', cursor: 'pointer' }}
                  onClick={() => {
                    if (valueselected === 'without-submeter') {
                      handleClick(record.disclosure_urls);
                    } else {
                      handleClick(record.disclosure);
                    }
                  }}
                >
                  {valueselected === 'without-submeter'
                    ? truncateText(record.disclosure, 4)
                    : truncateText(record.file_name, 4)}
                </span>
              </>
            );
          },
        };
      } else if (
        column.dataIndex === 'emissions_t_co2e' &&
        activeTab === '1' &&
        valueselected == 'without-submeter'
      ) {
        return {
          ...column,
          render: (text: any, record: any) => {
            const { status } = record;
            const id = getRowIdFromUniqueId(record.uniqueId, dataActive);
            return (
              <>
                <span style={{ marginLeft: '5px' }}>
                  {formatNumberUS(Number(record?.total_emission) / 1000)}
                </span>
              </>
            );
          },
        };
      } else {
        return {
          ...column,
          onFilter: (value: any, record: any) =>
            record[column.dataIndex].indexOf(value) === 0,
          filteredValue: filteredInfo[column.dataIndex] || null,
          render: (text: any, record: any) => {
            return text;
          },
        };
      }
    });
  };

  // Refactored column assignments using the utility function
  const columns: Record<DataKey, any[]> = {
    scope1: filterColumnsByRole(
      modifyColumnsWithRowStatus(
        subActiveTabKey === '1'
          ? stationaryCombustionColCat13
          : subActiveTabKey === '2'
            ? processEmissionsColCat13
            : subActiveTabKey === '3'
              ? fugitiveEmissionsColCat13
              : subActiveTabKey === '4'
                ? energyCombustionColCat13
                : [],
        user.role
      ),
      user.role,
      excludedDataIndicesCatthirteen
    ),
    without: filterColumnsByRole(
      modifyColumnsWithRowStatus(
        catThirteenAssestSpecificcolsWithoutTable,
        user.role
      ),
      user.role,
      excludedDataIndicesCatthirteen
    ),
    scope2: filterColumnsByRole(
      modifyColumnsWithRowStatus(
        catThirteenAssestSpecificcolsScope2,
        user.role
      ),
      user.role,
      excludedDataIndicesCatthirteen
    ),
    lessee: filterColumnsByRole(
      modifyColumnsWithRowStatus(catThirteenLesseSpecificcols, user.role),
      user.role,
      excludedDataIndicesCatthirteen
    ),
    floor: filterColumnsByRole(
      modifyColumnsWithRowStatus(catThirteenAvgDatacolsFloor, user.role),
      user.role,
      excludedDataIndicesCatthirteen
    ),
    asset: filterColumnsByRole(
      modifyColumnsWithRowStatus(catThirteenAvgDatacolsAsset, user.role),
      user.role,
      excludedDataIndicesCatthirteen
    ),
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

  const revertApis = [
    '/scope3_cat13/update_cat13_stationary/',
    '/scope3_cat13/update_cat13_process/',
    '/scope3_cat13/update_cat13_fugitive/',
    '/scope3_cat13/update_cat13_energy/',
    '/scope3_cat13/update_cat13_lesse_specific/',
    '/scope3_cat13/update_cat13_floor_assets_status/',
  ];

  const maxReviewerLevelIndex = getMaxLevelIndex('reviewer', maxReviewerLevel);
  const maxApproverLevelIndex = getMaxLevelIndex('approver', maxApproverLevel);

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      handleGetData();
      dispatch(setSelectedRowKeys([]));
      dispatch(updateSelectedRowKeys([]));
    }
  }, [facilitySelected, activeTab, activeSubTab, subActiveTabKey]);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      handleGetSuperData();
      dispatch(setSelectedRowKeys([]));
      dispatch(updateSelectedRowKeys([]));
    }
  }, []);

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

  const handleRevert = (idsLst: any) => {
    let ids: { id: number; month_ids: number[] }[] = [];
    if (Array.isArray(idsLst)) {
      idsLst.forEach((item: any) => {
        ids.push(item.id);
      });
    }

    const body = {
      entity_Id: user.entity_Id,
      ids: ids,
      status: revertstatusMessage, // Use 'status' in other cases
    };

    put(`${pathstatus}`, body)
      .then((res: any) => {
        openToast({
          content: `${res?.message}`,
          type: 'success',
        });
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
      })
      .catch((err) => {
        openToast({
          content: `${err?.response?.data.message}`,
          type: 'error',
        });
        dispatch(setSelectedRowKeys([]));
        dispatch(updateSelectedRowKeys([]));
      })
      .finally(() => {
        handleGetData();
        setEditList([]);
      });
  };

  useEffect(() => {
    if (activeTab === '1' && valueselected === 'with-submeter') {
      if (subActiveTabKey === '1') {
        setPathStatus(revertApis[0]);
      } else if (subActiveTabKey === '2') {
        setPathStatus(revertApis[1]);
      } else if (subActiveTabKey === '3') {
        setPathStatus(revertApis[2]);
      } else if (subActiveTabKey === '4') {
        setPathStatus(revertApis[3]);
      }
    } else if (activeTab === '1' && valueselected === 'without-submeter') {
      setPathStatus(
        '/scope3_cat13/update_asset_specific_without_sub_meter_status/'
      );
    } else if (activeTab === '2') {
      setPathStatus(revertApis[4]);
    } else if (activeTab === '3') {
      setPathStatus(revertApis[5]);
    }
  }, [valueselected, activeTab, subActiveTabKey]);

  const allowedStatuses = roleStatusMapping[user.role] || new Set();

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
        data={dataActive}
        allowedStatuses={allowedStatuses}
        uploadedFileName={uploadedFileName}
        maxReviewerLevel={maxReviewerLevel}
        maxApproverLevel={maxApproverLevel}
      />
    );
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
        ((item.emission_factor_name === null ||
          item.emission_factor_name === 'N/A' ||
          item.emission_factor_name === '') &&
          (item.kg_CO2e_per_unit === null ||
            item.kg_CO2e_per_unit === 0 ||
            item.kg_CO2e_per_unit === '')) ||
        item.emissions_kg_co2e === null ||
        item.emissions_kg_co2e === 0 ||
        item.emissions_t_co2e === null
      );
    });

    if (hasNullValues && user.role != 'DATA_PROVIDER') {
      message.warning('Please calulate the values');
    } else {
      let body;

      body = {
        entity_Id: user.entity_Id,
        ids: ids,
        status: forwardstatusMessage, // Use 'status' in other cases
      };

      put(`${pathstatus}`, body)
        .then((res: any) => {
          openToast({
            content: `${res?.message}`,
            type: 'success',
          });
          dispatch(setSelectedRowKeys([]));
          dispatch(updateSelectedRowKeys([]));
        })
        .catch((err) => {
          openToast({
            content: `${err.message}`,
            type: 'error',
          });
        })
        .finally(() => {
          handleGetData();
        });
    }
  };

  useEffect(() => {
    dispatch(setSelectedRowKeys([]));
    dispatch(updateSelectedRowKeys([]));
    setEditList([]);
  }, []);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

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

  const handleEditClick = (key: string) => {
    setEditMap((prevEditMap) => {
      const newEditMap: any = {};
      newEditMap[key] = true;
      return newEditMap;
    });
    setEditing(!editing);
  };

  const handleSave = (record: any) => {
    const quantityValue =
      quantityedit !== ''
        ? parseFloat(quantityedit)
        : activeTab === '3'
          ? record?.quantity
          : record?.fuel_consumed;

    let modifiedValue;
    let modifiedValue2;
    let modifiedValue3;

    let newItem;

    // const  newItem = {
    //   id: record && record.id,
    //   uuid: attachement,
    //   quantity: quantityValue,
    //   comment: comment,
    // };

    if (record.hasOwnProperty('total_lessee_scope1_scope2_emission')) {
      if (newValue === -1) {
        setNewValue(record.total_lessee_scope1_scope2_emission);
        modifiedValue = record.total_lessee_scope1_scope2_emission;
      } else {
        modifiedValue = newValue;
      }
    }

    if (record.hasOwnProperty('lessee_asset_area_vol_qty')) {
      if (newValue2 === -1) {
        setNewValue2(record.lessee_asset_area_vol_qty);
        modifiedValue2 = record.lessee_asset_area_vol_qty;
      } else {
        modifiedValue2 = newValue2;
      }
    }

    if (record.hasOwnProperty('total_lessee_asset_area_vol_qty')) {
      if (newValue3 === -1) {
        setNewValue3(record.total_lessee_asset_area_vol_qty);
        modifiedValue3 = record.total_lessee_asset_area_vol_qty;
      } else {
        modifiedValue3 = newValue3;
      }
    }

    if (
      record.hasOwnProperty('total_lessee_scope1_scope2_emission') &&
      record.hasOwnProperty('lessee_asset_area_vol_qty') &&
      record.hasOwnProperty('total_lessee_asset_area_vol_qty') &&
      activeTab === '2'
    ) {
      if (
        (modifiedValue !== undefined &&
          (isNaN(modifiedValue) || modifiedValue <= 0)) ||
        (modifiedValue2 !== undefined &&
          (isNaN(modifiedValue2) || modifiedValue2 <= 0)) ||
        (modifiedValue3 !== undefined &&
          (isNaN(modifiedValue3) || modifiedValue3 <= 0))
      ) {
        message.warning("The values can't be '0' or empty");
      } else if (
        modifiedValue !== undefined &&
        modifiedValue2 !== undefined &&
        modifiedValue3 !== undefined
      ) {
        newItem = {
          id: getRowIdFromUniqueId(record.uniqueId, lesseeData),
          uuid: attachement,
          quantity1: Number(modifiedValue),
          quantity2: Number(modifiedValue2),
          quantity3: Number(modifiedValue3),
          comment: comment,
        };
      }
    } else {
      // fallback when the 3 fields aren't all present
      newItem = {
        id: record && record.id,
        uuid: attachement,
        quantity: quantityValue,
        comment: comment,
      };
    }

    setNewValue(-1);
    setNewValue2(-1);
    setComment(''); // Clear comment after saving

    const finalEditList = [...editList, newItem];
    setEditList(finalEditList);
    editData(finalEditList);
    dispatch(setExpandedKeys([]));
    setEditing(false);
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

  const handleApprove = (idsLst: any) => {
    handleSubmitForNextLevel(idsLst);
  };

  const [leasedArea, setLeasedArea] = useState(200); // default value 200
  const [buildingArea, setBuildingArea] = useState(2000); // default value 2000
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [modalContent, setModalContent] = useState('');

  const utilizedOccupancyRatio = (leasedArea / buildingArea).toFixed(3); // Calculated statically
  const totalEmissions = 9900; // Static value
  const totalEmissionsFromLeasedAssets = 1320;

  const onChange = (e: any) => {
    setValueSelected(e.target.value);
    setSubActiveTabKey('1');
  };

  const getStatusMapping = (status: string): string[] | undefined => {
    if (requestedDeleteStatusMapping.hasOwnProperty(status)) {
      return requestedDeleteStatusMapping[status];
    }
    return undefined;
  };

  const columnsWith: Record<string, any[]> = {
    '1': stationaryCombustionColCat13,
    '2': processEmissionsColCat13,
    '3': fugitiveEmissionsColCat13,
    '4': energyCombustionColCat13,
  };

  const tabData = [
    {
      key: '1',
      title: 'Stationary Combustion',
      content: 'Welcome to the Home tab!',
    },
    {
      key: '2',
      title: 'Process Emissions',
      content: 'Adjust your Settings here.',
    },
    {
      key: '3',
      title: 'Fugitive Emissions',
      content: 'Adjust your Settings here.',
    },
    {
      key: '4',
      title: 'Energy Combustion',
      content: 'This is your Profile info.',
    },
  ];

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

    let deleteApiUrl = '';
    const subKey = Number(subActiveTabKey);

    if (activeTab === '1' && valueselected === 'with-submeter') {
      if (subKey === 1) {
        deleteApiUrl = deleteApis[0];
      } else if (subKey === 2) {
        deleteApiUrl = deleteApis[1];
      } else if (subKey === 3) {
        deleteApiUrl = deleteApis[2];
      } else if (subKey === 4) {
        deleteApiUrl = deleteApis[3];
      }
    } else if (activeTab === '1' && valueselected === 'without-submeter') {
      deleteApiUrl = deleteApis[4];
    } else if (activeTab === '2') {
      deleteApiUrl = deleteApis[5];
    } else if (activeTab === '3') {
      deleteApiUrl = deleteApis[6];
    }

    if (!deleteApiUrl) {
      message.error('No delete API found for this selection.');
      return;
    }

    post(deleteApiUrl, {
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
        handleGetData();
      })
      .catch((error: any) => {
        if (
          error?.response?.data?.message ===
          'No pending deletion request found.'
        ) {
          message.error(
            "You can't directly delete, you first need to raise a request first"
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

  const renderTableTab = (
    key: DataKey,
    data: any,
    tabName: string,
    active: any
  ) => {
    return (
      <TabPane
        tab={
          <span
            onClick={() => {
              setActiveSubTab(active);
            }}
          >
            {tabName}
          </span>
        }
        key={active}
      >
        {(key === 'scope1' || key === 'without') && (
          <>
            <Radio.Group onChange={onChange} value={valueselected}>
              <Radio value="with-submeter">With Sub-Meter</Radio>
              <Radio value="without-submeter">Without Sub-Meter</Radio>
            </Radio.Group>

            <Row gutter={16} align="middle">
              {valueselected === 'with-submeter' && (
                <>
                  <Col span={12}>
                    <div className={styles.container}>
                      <Col span={14}>
                        <p className={styles.label}>
                          Total Downstream Leased Assest Emission (tCO₂e):
                        </p>
                      </Col>
                      <Col span={10}>
                        <Input
                          value={tco2e}
                          disabled
                          className={styles.input}
                        />
                      </Col>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.container}>
                      <Col span={14}>
                        <p className={styles.label}>
                          Total Downstream Leased Assest Emission (kgCO₂e):
                        </p>
                      </Col>
                      <Col span={10}>
                        <Input
                          value={kgco2e}
                          disabled
                          className={styles.input}
                        />
                      </Col>
                    </div>
                  </Col>
                </>
              )}

              {valueselected === 'without-submeter' && (
                <Col span={7}>
                  <div className={styles.container}>
                    <Col span={14}>
                      <p className={styles.label}>Leased Area (m²):</p>
                    </Col>
                    <Col span={10}>
                      <Input
                        value={withoutData?.leased_area}
                        disabled
                        className={styles.input}
                      />
                    </Col>
                  </div>
                </Col>
              )}

              {/* Building's Total Area */}
              {valueselected === 'without-submeter' && (
                <Col span={8}>
                  <div className={styles.container}>
                    <Col span={14}>
                      <p className={styles.label}>
                        Building's Total Area (m²):
                      </p>
                    </Col>
                    <Col span={10}>
                      <Input
                        value={withoutData?.building_total_area}
                        disabled
                        className={styles.input}
                      />
                    </Col>
                  </div>
                </Col>
              )}

              {valueselected === 'without-submeter' && (
                <Col span={9}>
                  <div className={styles.container}>
                    <Col span={14}>
                      <p className={styles.label}>Occupancy Rate:</p>
                    </Col>
                    <Col span={10}>
                      <Input
                        value={withoutData?.occupancy_rate}
                        disabled
                        className={styles.input}
                      />
                    </Col>
                  </div>
                </Col>
              )}
            </Row>

            <Row gutter={16} align="middle">
              {/* Utilized Occupancy Ratio (Disabled) */}
              {valueselected === 'without-submeter' && (
                <Col span={7}>
                  <div className={styles.container}>
                    <Col span={14}>
                      <p className={styles.label}>Utilized Occupancy Ratio:</p>
                    </Col>
                    <Col span={10}>
                      <Input
                        value={withoutData?.utilised_occupancy_rate}
                        disabled
                        className={styles.input}
                      />
                    </Col>
                  </div>
                </Col>
              )}
            </Row>
          </>
        )}

        {activeTab == 1 && valueselected === 'with-submeter' && (
          <Tabs
            className="mt-3"
            defaultActiveKey={subActiveTabKey}
            onChange={(key) => {
              if (user?.role === 'SUPER_ADMIN') {
                handleScopeoneFuelDataSuperGetApi(
                  company.value,
                  financialYear,
                  key
                );
              } else {
                handleScopeoneFuelDataGetApi(key);
              }
              setSubActiveTabKey(key);
              const selectedTab = tabData.find((tab) => tab.key === key);
              if (selectedTab) {
                setSubActiveTabTitle(selectedTab.title);
              }
            }}
          >
            {tabData.map((tab) => (
              <TabPane tab={tab.title} key={tab.key}>
                <TableComponent
                  data={data}
                  columnHeader={columns[key]}
                  onchange={handleChange}
                  handleRevert={handleRevert}
                  postFilterRecords={postFilterRecords}
                  handleApprove={handleApprove}
                  expandableRowRenderer={expandedRowContent}
                  onHandleDelete={handleDelete}
                  maxApproverLevel={maxApproverLevel}
                  maxReviewerLevel={maxReviewerLevel}
                  isRowExpand={true}
                  isNewDelte={true}
                  enableRowSelection={false}
                  allowedStatuses={allowedStatuses}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                  noText={
                    user.role === 'SUPER_ADMIN'
                      ? `No Approved Data for this Reporting Period`
                      : null
                  }
                />
              </TabPane>
            ))}
          </Tabs>
        )}

        {(activeTab != 1 ||
          (activeTab == 1 && valueselected === 'without-submeter')) && (
          <TableComponent
            data={data}
            columnHeader={columns[key]}
            onchange={handleChange}
            handleRevert={handleRevert}
            postFilterRecords={postFilterRecords}
            handleApprove={handleApprove}
            expandableRowRenderer={expandedRowContent}
            onHandleDelete={handleDelete}
            maxApproverLevel={maxApproverLevel}
            maxReviewerLevel={maxReviewerLevel}
            isRowExpand={true}
            isNewDelte={active === '1' ? false : true}
            enableRowSelection={false}
            allowedStatuses={allowedStatuses}
            showOnlyCount={false}
            columnCheckBoxDataAttribute="key"
            noText={
              user.role === 'SUPER_ADMIN'
                ? `No Approved Data for this Reporting Period`
                : null
            }
          />
        )}
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
      </TabPane>
    );
  };

  const [assetTData, setAssetTData] = useState([]);
  const [withoutTotalData, setWithoutTotalData] = useState<any>();

  const handleWithoutSubmeterGetData = () => {
    const path = '/scope3_cat13/preload_data_for_scope1_and_scope2/';
    get(`${path}?entity_Id=${user.entity_Id}&facility_Id=${facilitySelected}`)
      .then((res) => {
        if (res?.status === 'Error' || !res?.response?.data) {
          // Handle the error or empty data
          setWithoutData([]);
          setAssetTData([]);
          setDataActive([]);
          setWithoutTotalData([]);
        } else {
          setWithoutData(res?.response);
          const updatedData: any =
            res?.response?.data?.inDepth_data_for_scope1_and_scope2?.map(
              (item: any, index: any) =>
                item.status !== 'Approved'
                  ? {
                      ...item,
                      uniqueId: index,
                      emissions_t_co2e: item.total_emission / 1000,
                      status:
                        maxReviewerLevel === 'L1_DATA_REVIEWER' &&
                        item.status === 'For L1 Review'
                          ? 'For Review'
                          : item.status,
                    }
                  : {
                      ...item,
                      uniqueId: index,
                      emissions_t_co2e: item.total_emission / 1000,
                    }
            );

          setAssetTData(updatedData);
          setDataActive(updatedData);

          setWithoutTotalData(
            res?.response?.data?.total_emission_emitted_by_scope1_and_scope2
          );
        }
      })
      .catch((err) => {
        // Handle any other error that occurs during the request
        setWithoutData([]);
        setAssetTData([]);
        setDataActive([]);
        setWithoutTotalData([]);
        // message.error(err?.response?.data.message || 'An unexpected error occurred');
      });
  };

  const handleWithoutSubmeterSuperGetData = (
    entityId: any,
    financialYear: any
  ) => {
    const path = '/scope3_cat13/super_preload_data_for_scope1_and_scope2/';
    get(`${path}?entity_Id=${entityId}&financial_year=${financialYear}`)
      .then((res) => {
        setWithoutData(res?.response);
        const updatedData: any =
          res?.response?.data?.inDepth_data_for_scope1_and_scope2?.map(
            (item: any, index: any) =>
              item.status !== 'Approved'
                ? {
                    ...item,
                    uniqueId: index,
                    status:
                      maxReviewerLevel === 'L1_DATA_REVIEWER' &&
                      item.status === 'For L1 Review'
                        ? 'For Review'
                        : item.status,
                  }
                : item
          );
        setAssetTData(updatedData);
        setDataActive(updatedData);

        setWithoutTotalData(
          res?.response?.data?.total_emission_emitted_by_scope1_and_scope2
        );
      })
      .catch((err) => {
        console.log(err?.response?.data.message);
      });
  };

  const [tco2e, setTco2e] = useState<any>('');
  const [kgco2e, setKgco2e] = useState<any>('');

  const handleScopeoneFuelDataGetApi = (tabKey: string) => {
    const apiPaths: Record<string, string> = {
      '1': '/scope3_cat13/get_cat13_stationary/',
      '2': '/scope3_cat13/get_cat13_Process/',
      '3': '/scope3_cat13/get_cat13_Fugitive/',
      '4': '/scope3_cat13/get_cat13_energy/',
    };

    const selectedPath = apiPaths[tabKey];

    if (!selectedPath) {
      message.error('Invalid tab selection');
      return;
    }

    get(
      `${selectedPath}?entity_Id=${user.entity_Id}&facility_Id=${facilitySelected}`
    )
      .then((res) => {
        const updatedData = res?.response?.data?.map(
          (item: any, index: number) => ({
            ...item,
            uniqueId: index,
            status:
              maxReviewerLevel === 'L1_DATA_REVIEWER' &&
              item.status === 'For L1 Review'
                ? 'For Review'
                : item.status,
          })
        );

        setWithData(res?.response);
        setFuelData(updatedData);
        setDataActive(updatedData);
        setTco2e(res?.response?.summary.t_co2e);
        setKgco2e(res?.response?.summary.kg_co2e);

        setDropdownOptions(res?.response?.data[0]?.emission_factor_database);
      })
      .catch((err) => {
        message.error(err?.response?.data.message || 'Something went wrong');
      });
  };

  const handleScopeoneFuelDataSuperGetApi = (
    entityId: any,
    financialYear: any,
    tabKey: any
  ) => {
    const apiPaths: Record<string, string> = {
      '1': '/scope3_cat13/super_get_cat13_stationary/',
      '2': '/scope3_cat13/super_get_cat13_Process/',
      '3': '/scope3_cat13/super_get_cat13_Fugitive/',
      '4': '/scope3_cat13/super_get_cat13_energy/',
    };

    const selectedPath = apiPaths[tabKey];

    if (!selectedPath) {
      message.error('Invalid tab selection');
      return;
    }

    get(`${selectedPath}?entity_Id=${entityId}&financial_year=${financialYear}`)
      .then((res) => {
        const updatedData = res?.response?.data?.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
            status:
              maxReviewerLevel === 'L1_DATA_REVIEWER' &&
              item.status === 'For L1 Review'
                ? 'For Review'
                : item.status,
          })
        );
        setWithData(res?.response);

        setFuelData(updatedData);
        setDataActive(updatedData);
        setDropdownOptions(
          res?.response?.data[0]?.dropdown_options_for_emission_factor_dataBase
        );
      })
      .catch((err) => {
        console.log(err?.response?.data.message);
      });
  };

  const [lesseeTopData, setLesseeTopData] = useState<any>();

  const handleLesseeDataGetApi = () => {
    const path = '/scope3_cat13/get_lessee_specific/';
    get(`${path}?entity_Id=${user.entity_Id}&facility_Id=${facilitySelected}`)
      .then((res) => {
        const updatedData: any = res?.response?.data?.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
            status:
              maxReviewerLevel === 'L1_DATA_REVIEWER' &&
              item.status === 'For L1 Review'
                ? 'For Review'
                : item.status,
          })
        );
        setLesseeData(updatedData);
        setDataActive(updatedData);
        setLeasedAssets(res?.response?.leased_asset_area);
        setLesseeAssets(res?.response?.lessee_asset_area);
        setLesseeTopData(res?.response);
        setDropdownOptions(
          res?.response?.data[0]?.dropdown_options_for_emission_factor_dataBase
        );
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
      });
  };

  const handleLesseeDataSuperGetApi = (entityId: any, financialYear: any) => {
    const path = '/scope3_cat13/super_get_lessee_specific/';
    get(`${path}?entity_Id=${entityId}&financial_year=${financialYear}`)
      .then((res) => {
        const updatedData: any = res?.response?.data?.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
            status:
              maxReviewerLevel === 'L1_DATA_REVIEWER' &&
              item.status === 'For L1 Review'
                ? 'For Review'
                : item.status,
          })
        );
        setLesseeData(updatedData);
        setDataActive(updatedData);
        setLeasedAssets(res?.response?.leased_asset_area);
        setLesseeAssets(res?.response?.lessee_asset_area);
        setLesseeTopData(res?.response);
        setDropdownOptions(
          res?.response?.data[0]?.dropdown_options_for_emission_factor_dataBase
        );
      })
      .catch((err) => {
        console.log(err?.response?.data.message);
      });
  };

  const handleFloorDataGetApi = () => {
    const path = '/scope3_cat13/fetch_floor_average_data/';
    get(`${path}?entity_Id=${user.entity_Id}&facility_Id=${facilitySelected}`)
      .then((res) => {
        const updatedData: any = res?.response?.data?.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
            status:
              maxReviewerLevel === 'L1_DATA_REVIEWER' &&
              item.status === 'For L1 Review'
                ? 'For Review'
                : item.status,
          })
        );
        setFloorData(updatedData);
        setDataActive(updatedData);
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
      });
  };

  const handleFloorDataSuperGetApi = (entityId: any, financialYear: any) => {
    const path = '/scope3_cat13/super_fetch_floor_average_data/';
    get(`${path}?entity_Id=${entityId}&financial_year=${financialYear}`)
      .then((res) => {
        const updatedData: any = res?.response?.data?.map(
          (item: any, index: any) => ({
            ...item,
            uniqueId: index,
            status:
              maxReviewerLevel === 'L1_DATA_REVIEWER' &&
              item.status === 'For L1 Review'
                ? 'For Review'
                : item.status,
          })
        );
        setFloorData(updatedData);
        setDataActive(updatedData);
      })
      .catch((err) => {
        console.log(err?.response?.data.message);
      });
  };

  const handleTabChange = (key: any) => {
    setActiveTab(key);
    if (activeSubTab != '7' && key === '3') {
      setActiveSubTab('6');
    }
    if (activeSubTab != '5' && key === '1') {
      setActiveSubTab('4');
    }
  };

  const editData = (finalEditList: any) => {
    if (finalEditList.length > 0) {
      if (!finalEditList.length) {
        message.warning('Please edit before resubmit');
      } else {
        const body = {
          entity_Id: user.entity_Id,
          entity_role: user.role,
          updates: finalEditList,
        };
        put(pathedit, body)
          .then((res: any) => {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
            handleGetData();
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
            setAttachement('');
            setUploadedFileName('');
            setEditList([]);
          });
      }
    } else {
      openToast({
        content: 'Please select at least one row',
        type: 'warning',
      });
    }
  };

  const getApiFacility = async () => {
    try {
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      const data = response?.response?.data;
      setFacilityOptions(data);
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    if (user?.role !== 'SUPER_ADMIN') {
      handleGetData();
    }
  }, [activeSubTab, valueselected, activeTab, subActiveTabKey]);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      handleGetSuperData();
    }
  }, [activeSubTab, valueselected, activeTab, subActiveTabKey]);

  useEffect(() => {
    if (facilityList.length && user?.role !== 'SUPER_ADMIN') {
      getApiFacility();
    }
  }, [facilityList]);

  return (
    <>
      <PageCardComponent className={styles.pageCardStyle2}>
        <Row justify="end">
          {user.role === 'DATA_PROVIDER' && (
            <Col
              xl={12}
              lg={12}
              md={24}
              sm={24}
              className="d-flex justify-content-end"
            >
              {!showAddButton && (
                <>
                  <div className={styles.facilityLabel}>Facility :</div>
                  <Select
                    className={styles.facilityDropdown}
                    placeholder={facilitySelected ? undefined : 'Facility Name'}
                    value={facilitySelected || null}
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
                      navigate('/scope3/category-13/form', {
                        state: { activeTab, valueselected, subActiveTabKey },
                      });
                    }}
                  >
                    Add &nbsp; +
                  </ButtonComponent>
                </>
              )}
            </Col>
          )}
        </Row>

        {user.role !== 'DATA_PROVIDER' && user.role !== 'SUPER_ADMIN' && (
          <Row justify="end" style={{ marginBottom: '-40px' }}>
            <div className={styles.facilityLabel}>Facility :</div>
            <Select
              className={styles.facilityDropdown}
              placeholder={facilitySelected ? undefined : 'Facility Name'}
              value={facilitySelected || null}
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
            {/* <div className={styles.facilityLabel}>Reporting Period :</div>
            <Select
              className={styles.fyDropdown}
              placeholder={'Reporting Period'}
              disabled
            >
              <Option value="FY2023">FY2023</Option>
              <Option value="FY2024">FY2024</Option>
            </Select> */}
          </Row>
        )}

        <div
          className={
            user.role === 'DATA_PROVIDER' && !showAddButton
              ? styles.cat3Margin
              : styles.cardDrMargin
          }
        >
          <Tabs
            defaultActiveKey={activeTab}
            onChange={(key) => {
              // user.role === 'SUPER_ADMIN'
              //   ? handleGetSuperData()
              //   : handleGetData();
              handleTabChange(key);
              resetFilters();
              setSubActiveTabKey('1');
            }}
            className={styles.mainTabs}
          >
            {valueselected === 'with-submeter'
              ? renderTableTab('scope1', fuelData, 'Asset-specific Method', '1')
              : renderTableTab(
                  'without',
                  assetTData,
                  'Asset-specific Method',
                  '1'
                )}
            {renderTableTab(
              'lessee',
              lesseeData,
              'Lessee-specific Method',
              '2'
            )}

            {renderTableTab('floor', floorData, 'Average-data Method', '3')}
          </Tabs>
        </div>
      </PageCardComponent>
    </>
  );
}

export default CatThirteenTable;
