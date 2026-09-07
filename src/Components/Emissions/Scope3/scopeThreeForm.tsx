import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Tabs,
  Select,
  Input,
  Upload,
  Image,
  Spin,
  DatePicker,
  Popover,
  message,
} from 'antd';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { apiBaseUrl, post, get } from '../../../Services';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  UploadOutlined,
  FileExcelFilled,
  FileWordFilled,
} from '@ant-design/icons';
import disclosureIcon from '../../../assets/disclosureIcon.png';

import styles from './scope3.module.scss';
import {
  ButtonComponent,
  InputComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { useNotification } from '../../../Hooks/useNotification';
import { useAuth } from '../../../Hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  setScopeThreeColumns,
  setStationaryOptions,
} from '../../../Redux/Actions';
import {
  blockSpecialChar,
  excludedDataIndices,
  specialCharacters,
} from './Helpers';

import axios from 'axios';

import { treatmentOptionsMap } from '../../../Modules/Emission/mock';

import { ScopeExcelDataEntry } from './ExcelDataEntry';

const { TabPane } = Tabs;
const { Option } = Select;

const ScopeThreeForm = ({
  cateTitle,
  tabData,
  formSubmitAPi,
  showField,
  postSubmit,
  subTabs,
  exceltype,
  currentExcelName,
  emissionType,
}: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const scopeThreeCols = useSelector((state: any) => state.scopeThreeColumns);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [fileList, setFileList] = useState(true);
  const [wasteProduct, setWasteProduct] = useState('');
  const [colTitles, setColTitles] = useState([]);
  const [totalLeasedAssest, setTotalLeasedAssest] = useState('');
  const [totalLesseesAssest, setTotalLesseesAssest] = useState('');
  const [totalAreaLeasedAssest, setTotalAreaLeasedAssest] = useState('');
  const [countryList, setCountryList] = useState([null]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [selectedSourceOfEnergy, setSelectedSourceOfEnergy] = useState<
    string | null
  >(null);

  const fetchCountryList = async () => {
    try {
      const res = await axios.get(
        'https://countriesnow.space/api/v0.1/countries/flag/images'
      );
      if (res.data.error !== true) {
        const data = res.data.data;
        const list = data.map((item: any) => item.name);
        setCountryList(list);
      }
    } catch (err) {
      openToast({ content: `${err}`, type: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  useEffect(() => {
    fetchCountryList();
  }, []);

  const initializeDataSources = (tabData: any[]) => {
    const initDataSources: Record<string, any[]> = {};
    tabData.forEach((tab) => {
      switch (tab.key) {
        case '1':
          initDataSources[tab.key] = [{}];
          break;
        case '2':
          initDataSources[tab.key] = [{}];
          break;
        case '3':
          initDataSources[tab.key] = [{}];
          break;
        case '4':
          initDataSources[tab.key] = [{}];
          break;
        case '5':
          initDataSources[tab.key] = [{}];
          break;
        case '6':
          initDataSources[tab.key] = [{}];
          break;
        case '7':
          initDataSources[tab.key] = [{}];
          break;
        default:
          initDataSources[tab.key] = [{}];
          break;
      }
    });
    return initDataSources;
  };
  const { openToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
  const [dataSources, setDataSources] = useState(
    initializeDataSources(tabData)
  );
  const [activeTab, setActiveTab] = useState(location?.state?.activeTab);
  const fetchFuelList = (value: string) => {
    // Start loading
    setIsLoading(true);

    // Make the API call with the determined scope
    get(`/Emissions/get_dropdown_optoins/?scope=${value}`)
      .then((res: any) => {
        if (res.response.status === true) {
          if (value === 'Scope1') {
            dispatch(
              setStationaryOptions(
                res?.response?.data?.stationaryDropdownOptionsData || [] // Use empty array as fallback
              )
            );
          }
        } else {
          openToast({
            content: `${res?.response?.message}`,
            type: 'warning',
          });
        }
      })
      .catch((err) =>
        openToast({
          content: `${err.message}`,
          type: 'error',
        })
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setStationaryOptions([]);
    if (
      activeTab === '1' &&
      tabData[0]?.title === 'Upstream emissions of purchased fuels'
    ) {
      fetchFuelList('Scope1');
    }
  }, [activeTab, tabData]);

  const stationaryOptions = useSelector(
    (state: any) => state.stationaryOptions
  );

  const [activityData, setActivityData] = useState<any[]>([]);
  const [selectedActivityData, setSelectedActivityData] = useState({
    uom: '',
    quantity: '',
  });
  const fetchActivityData = async () => {
    try {
      const res = await get(
        `/scope3_cat3/fetch_total_electricity_consumed_from_scope2/?entity_Id=${user?.entity_Id}`
      );
      if (res?.response?.data && res?.response?.status) {
        setActivityData(res.response.data);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }
  };
  useEffect(() => {
    if (
      (activeTab === '2' &&
        tabData[1]?.title === 'Upstream emissions of purchased electricity') ||
      (activeTab === '3' &&
        tabData[2]?.title === 'Transmission and Distribution (T&D) losses')
    ) {
      fetchActivityData();
    }
  }, [activeTab, tabData]);

  const handleActivityChange = (value: string, rowIndex: any) => {
    // Find the selected activity from the activity data (API response)
    const selectedActivity = activityData.find(
      (item) => item.activity === value
    );
    // If the selected activity exists, update the state with uom and total_electricity
    if (selectedActivity) {
      setSelectedActivityData({
        uom: selectedActivity.uom,
        quantity: selectedActivity.total_electricity,
      });
    }

    setDataSources((prevDataSources) => ({
      ...prevDataSources,
      [activeTab]: prevDataSources[activeTab]?.map((data: any, idx: number) =>
        idx === rowIndex
          ? {
              ...data,
              disclosure: '',
              uom: selectedActivity.uom,
              ...(activeTab === '3'
                ? { energy_purchased: selectedActivity?.total_electricity } // Include `energy_purchased` for tab '3'
                : { quantity: selectedActivity?.total_electricity }),
              activity: value,
            }
          : data
      ),
    }));
  };

  const { user } = useAuth();

  const handleEditUploadFile = (
    info: any,
    rowIndex: number,
    activeTab: string
  ) => {
    setDataSources((prevDataSources) => ({
      ...prevDataSources,
      [activeTab]: prevDataSources[activeTab]?.map((data: any, idx: number) =>
        idx === rowIndex ? { ...data, disclosure: '' } : data
      ),
    }));

    if (info.file.status === 'done') {
      const uploadedFileName = info.file.name;
      setFileList(true);
      const UID = info.file.response?.response?.data;

      // Display success message for file upload
      message.success(`${uploadedFileName} file uploaded successfully.`);

      // Update data source for the specific tab and row
      setDataSources((prevDataSources) => ({
        ...prevDataSources,
        [activeTab]: prevDataSources[activeTab]?.map(
          (data: any, idx: number) =>
            idx === rowIndex ? { ...data, disclosure: UID } : data
        ),
      }));
    }

    if (info.file.status === 'removed') {
      const removedFileName = info.file.name;

      // Display success message for file deletion
      message.success(`File removed successfully.`);

      // Clear the `disclosure` field for the specific tab and row
      setDataSources((prevDataSources) => ({
        ...prevDataSources,
        [activeTab]: prevDataSources[activeTab]?.map(
          (data: any, idx: number) =>
            idx === rowIndex ? { ...data, disclosure: '' } : data
        ),
      }));
    }
  };

  const handleAddRow = (tabKey: any) => {
    const colTitles = updatedDataSources
      ?.filter((col: any) => col.title !== 'Action') // Corrected the filtering condition
      ?.map((col: any) => col.title);
    const dataIndexes = scopeThreeCols
      ?.filter((col: any) => colTitles.includes(col.title))
      ?.map((col: any, index: any, array: any) => {
        if (index === array.length - 1 && col.dataIndex === 'file_name') {
          return 'disclosure';
        }
        return col.dataIndex;
      });

    setDataSources((prevDataSources) => {
      const currentRows = prevDataSources[tabKey];
      if (currentRows && currentRows.length > 0) {
        const allColumnsPresent = currentRows.every((row) =>
          dataIndexes.every((title: any) => row.hasOwnProperty(title))
        );

        if (
          currentRows.every((row) => Object.keys(row).length > 0) &&
          allColumnsPresent
        ) {
          return {
            ...prevDataSources,
            [tabKey]: [...currentRows, {}],
          };
        } else {
          openToast({
            content: `Please complete all required fields.`,
            type: 'warning',
          });
          return prevDataSources;
        }
      } else {
        // If no existing rows, initialize with one row
        return {
          ...prevDataSources,
          [tabKey]: [{}],
        };
      }
    });
  };

  const handleExcelInputChange = (newValue: any) => {
    setWasteProduct(newValue);
  };

  const handleInputChange = (
    value: any,
    rowIndex: any,
    columnName: any,
    tabKey: any
  ) => {
    const trimmedValue = value;
    setDataSources((prevDataSources) => {
      const currentData = prevDataSources[tabKey]?.[rowIndex] || {};
      const updatedData = { ...currentData, [columnName]: trimmedValue };
      const newDataSources = {
        ...prevDataSources,
        [tabKey]: prevDataSources[tabKey]?.map((data, index) =>
          index === rowIndex ? updatedData : data
        ),
      };
      if (tabKey === '4') {
        const checkInDateStr = updatedData.check_in || currentData.check_in;
        const checkOutDateStr = updatedData.check_out || currentData.check_out;
        if (checkInDateStr && checkOutDateStr) {
          const checkInDate = new Date(checkInDateStr);
          const checkOutDate = new Date(checkOutDateStr);

          if (checkOutDate < checkInDate) {
            updatedData.check_out = '';
            message.warning('Check-out date is earlier than check-in date');
            return {
              ...prevDataSources,
              [tabKey]: prevDataSources[tabKey]?.map((data, index) =>
                index === rowIndex ? updatedData : data
              ),
            };
          }
        }
      } else if (tabKey === '2') {
        const originLocation =
          updatedData.origin_location || currentData.origin_location;
        const destinationLocation =
          updatedData.destination_location || currentData.destination_location;

        if (
          originLocation &&
          destinationLocation &&
          originLocation === destinationLocation
        ) {
          updatedData.origin_location = '';
          updatedData.destination_location = '';
          message.warning(
            'Origin and destination locations cannot be the same'
          );

          return {
            ...prevDataSources,
            [tabKey]: prevDataSources[tabKey]?.map((data, index) =>
              index === rowIndex ? updatedData : data
            ),
          };
        }
      }
      return newDataSources;
    });
  };

  const handleSubmit = (tabKey: any) => {
    resetDataSources();
    setWasteProduct('');
    setIsLoading(true);
    // condition for waste produced to be send to api
    //tabData[tabKey].showField ? :

    let body;
    if (wasteProduct !== '') {
      body = {
        entity_Id: user.entity_Id,
        facility_Id: facilitySelected ? facilitySelected : '',
        waste_produced: parseInt(wasteProduct, 10),
        method_data: dataSources[tabKey],
      };
    } else if (totalAreaLeasedAssest !== '') {
      body = {
        entity_Id: user.entity_Id,
        facility_Id: facilitySelected ? facilitySelected : '',
        method_data: dataSources[tabKey],
      };
    } else {
      body = {
        entity_Id: user.entity_Id,
        facility_Id: facilitySelected ? facilitySelected : '',
        method_data: dataSources[tabKey],
      };
    }

    post(formSubmitAPi[tabKey - 1], body)
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            openToast({
              content: `${res?.message}`,
              type: 'success',
            });
          } else {
            openToast({
              content: `${res?.response?.message}`,
              type: 'error',
            });
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        openToast({
          content: `${err?.message}`,
          type: 'error',
        });
        setIsLoading(false);
      })
      .finally(() => {
        navigate(postSubmit, {
          state: {
            activeTab: activeTab,
            currentFacility: facilitySelected,
          },
        });
        setIsLoading(false);
      });
  };

  const resetDataSources = () => {
    const initialDataSources = initializeDataSources(tabData);
    setDataSources(initialDataSources);
    setFileList(false);
    setWasteProduct('');
    setTotalLeasedAssest('');
    setTotalLesseesAssest('');
    setSelectedActivityData({ uom: '', quantity: '' });
  };

  const updatedDataSources =
    user.role !== 'DATA_PROVIDER'
      ? scopeThreeCols
      : scopeThreeCols?.filter(
          (item: any) => !excludedDataIndices.includes(item.dataIndex)
        );

  const [propSum, setPropSum] = useState(0);

  const generateColumns = (
    columnsFromBackend: any,
    activeTab: any,
    isExcel?: any
  ) => {
    const generatedColumns = columnsFromBackend?.map((column: any) => {
      let { title, dataIndex, key, type, options, columns, width } = column;
      const isDisabled = (record: any) =>
        record[dataIndex] && record[dataIndex] !== '' && isExcel;
      let renderFunction = null;

      if (
        dataIndex == 'country' &&
        countryList.length &&
        title != 'Destination Country'
      ) {
        options = countryList;
      }

      switch (type) {
        case 'text':
          if (tabData[activeTab - 1].changeTextType) {
            renderFunction = null;
          } else {
            renderFunction = (text: any, record: any, rowIndex: any) => (
              <InputComponent
                defaultValue={text}
                // value={text}
                value={
                  key === 'uomCat3tab2' || key === 'uomCat3tab3'
                    ? record.uom
                    : text
                }
                disabled={isDisabled(record)}
                onKeyDown={(e: any) => {
                  blockSpecialChar(e);
                }}
                onChange={(e: any) => {
                  const inputValue = e.target.value;
                  handleInputChange(inputValue, rowIndex, dataIndex, activeTab);
                }}
              />
            );
          }
          break;
        case 'number':
          renderFunction = (text: any, record: any, rowIndex: any) => (
            <InputComponent
              // value={text}
              value={
                key === 'amountCat3' && key === 'engCat3tab3'
                  ? record.quantity
                  : text
              }
              type="number"
              id={dataIndex}
              disabled={isDisabled(record)}
              onKeyDown={(e: any) => {
                if (
                  dataIndex === 'no_of_trips' ||
                  dataIndex === 'no_of_employees' ||
                  dataIndex === 'no_of_nights' ||
                  dataIndex === 'no_of_rooms'
                ) {
                  if (e.key === '.' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }
                if (e.target.value === '' && e.key === '0') {
                  e.preventDefault();
                  message.warning('Value cannot be zero');
                }
                if (
                  specialCharacters.includes(e.key) ||
                  e.key === 'e' ||
                  e.key === 'E'
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e: any) => {
                let inputValue = e.target.value;
                if (e.target.id === 'proportion') {
                  const numericValue = parseFloat(inputValue);
                  let totalSum = 0;
                  dataSources['3'].forEach((item: any, index: number) => {
                    if (index !== rowIndex) {
                      totalSum += parseFloat(item.proportion || 0);
                    }
                  });
                  totalSum += numericValue;
                  setPropSum(totalSum);
                  if (totalSum > 100) {
                    message.warning(
                      'The total proportion should not exceed 100'
                    );
                    inputValue = inputValue.slice(0, inputValue.length - 1);
                  }
                }
                if (
                  inputValue > 100 &&
                  (e.target.id === 't_and_d_loss_rate' ||
                    e.target.id === 'proportion')
                ) {
                  message.warning('The value should not exceed 100');
                  inputValue = inputValue.slice(0, inputValue.length - 1);
                }

                handleInputChange(inputValue, rowIndex, dataIndex, activeTab);
              }}
            />
          );
          break;

        case 'select':
          renderFunction = (text: any, record: any, rowIndex: any) => {
            if (dataIndex === 'fuel') {
              options = stationaryOptions?.fuelRelatedOptions
                ? Object?.keys(stationaryOptions.fuelRelatedOptions)
                    .sort()
                    .map((data) => data)
                : [];
            }

            if (key === 'cat3Uom') {
              options =
                stationaryOptions && stationaryOptions?.fuelRelatedOptions
                  ? stationaryOptions?.fuelRelatedOptions[record?.fuel]
                  : [];
            }
            // Get the selected waste type from the current row's record
            const selectedWasteType = record.waste_type; // Use 'record' to access the current row's data

            // If we're in the waste_treatment column, update options
            if (dataIndex === 'waste_treatment') {
              options = treatmentOptionsMap[selectedWasteType] || []; // Get treatment options based on waste type
            }

            return (
              <>
                <Select
                  showSearch
                  disabled={isDisabled(record)}
                  value={text}
                  onChange={(value) => {
                    if (key === 'cat3Activity' || key === 'cat3ActTab3') {
                      // Handle activity change specifically
                      handleActivityChange(value, rowIndex);
                    } else {
                      // Handle other dataIndex changes
                      handleInputChange(
                        value.toString(),
                        rowIndex,
                        dataIndex,
                        activeTab
                      );
                    }
                  }}
                  style={{ width: '100%', height: '44px' }}
                >
                  {options?.map((option: any) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </>
            );
          };
          break;

        case 'upload':
          renderFunction = (text: any, record: any, rowIndex: any) => (
            <Upload
              className="scope-form-upload"
              maxCount={1}
              showUploadList={fileList}
              beforeUpload={(file) => {
                const maxSize = 2.5 * 1024 * 1024;
                if (file.size > maxSize) {
                  message.warning('File size must be less than 2.5MB.');
                  return false;
                }
                return true;
              }}
              onChange={(info) =>
                handleEditUploadFile(info, rowIndex, activeTab)
              }
              name="uploaded_file"
              action={`${apiBaseUrl}/file/file_upload_view/`}
              headers={{
                Authorization: `Bearer ${user.token}`,
              }}
              style={{ pointerEvents: 'none' }}
            >
              <Image
                src={disclosureIcon}
                preview={false}
                style={{ height: '15px', width: '15px', cursor: 'pointer' }}
              />
            </Upload>
          );
          break;
        case 'date':
          renderFunction = (text: any, record: any, rowIndex: any) => (
            <DatePicker
              value={record[dataIndex]}
              onChange={(date, dateString) => {
                const updatedRecord = { ...record };
                updatedRecord[dataIndex] = date ? date : null;
                handleInputChange(
                  updatedRecord[dataIndex],
                  rowIndex,
                  dataIndex,
                  activeTab
                );
              }}
              style={{ width: '100%', height: '44px' }}
            />
          );
          break;
        default:
          // Handle any other types if needed
          break;
      }

      return {
        title: (
          <span>
            {dataIndex === 'proportion' ? (
              <>
                Proportion (100%)
                <Popover
                  content={
                    <div
                      style={{
                        color: '#00338D',
                        backgroundColor: '#fff',
                        fontFamily: 'Rubik',
                        fontWeight: '400',
                        fontSize: '14px',
                      }}
                    >
                      Please ensure that the sum of all the proportions is 100%.
                    </div>
                  }
                  trigger="hover"
                >
                  <span style={{ cursor: 'pointer' }}>
                    <InfoCircleOutlined
                      style={{
                        fontSize: '16px',
                        marginLeft: '5px',
                      }}
                    />
                  </span>
                </Popover>
              </>
            ) : (
              title
            )}
          </span>
        ),
        dataIndex: dataIndex,
        key: key,
        width: width,

        render: renderFunction,
      };
    });

    // Adding Action column
    generatedColumns.push({
      title: <span style={{ fontFamily: 'Arial' }}>Action</span>,
      dataIndex: 'action',
      key: 'action',
      //className: 'text-center',
      render: (text: any, record: any, rowIndex: any) => (
        <>
          <CloseCircleOutlined
            className="text-danger user-select-all"
            onClick={() => {
              if (rowIndex !== 0) {
                handleRemoveRow(rowIndex, activeTab);
              }
            }}
          />
        </>
      ),
    });

    return generatedColumns;
  };

  const RadioWrapper = ({ label }: any) => {
    return (
      <>
        <Col span={12}>
          <ButtonComponent
            hierarchy={radioValue === 1 ? 'primary' : 'secondary'}
            style={{ height: '35px' }}
            icon={<FileWordFilled></FileWordFilled>}
            onClick={(e) => handleClickradio(e)}
          >
            Input Data Entry
          </ButtonComponent>

          {tabData[activeTab - 1].title !=
            'Upstream emissions of purchased electricity' &&
            tabData[activeTab - 1].title !==
              'Transmission and Distribution (T&D) losses' && (
              <ButtonComponent
                hierarchy={radioValue === 1 ? 'secondary' : 'primary'}
                icon={<FileExcelFilled />}
                style={{ marginLeft: '10px', height: '35px' }}
                onClick={(e) => handleClickradio(e)}
              >
                Excel Data Entry
              </ButtonComponent>
            )}
        </Col>
        <Col
          span={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {radioValue === 1 && !tabData[activeTab - 1]?.changeTextType && (
            <ButtonComponent
              hierarchy="secondary-gray"
              size="xl"
              onClick={() => handleAddRow(activeTab)}
            >
              Add Row
            </ButtonComponent>
          )}
        </Col>
      </>
    );
  };

  const handleRemoveRow = (index: any, tabKey: any) => {
    setDataSources((prevDataSources) => ({
      ...prevDataSources,
      [tabKey]: prevDataSources[tabKey]?.filter((_, idx) => idx !== index),
    }));
  };
  const handleClickradio = (e: any) => {
    resetDataSources();
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
    } else {
      setRadioValue(2);
    }
  };

  useEffect(() => {
    if (dataSources['3'].length > 0) {
      const arr = dataSources['3'];
      if (arr[0].hasOwnProperty('proportion')) {
        const tot = arr.reduce((sum: any, curr: any) => {
          return (sum = sum + Number(curr.proportion));
        }, 0);

        if (tot !== 100) {
          setPropSum(tot);
        } else {
          setPropSum(tot);
        }
      }
    }
  }, [dataSources]);

  // for static

  const handleTabChange = (tabKey: any) => {
    setRadioValue(1);
    setWasteProduct('');
    setActiveTab(tabKey);
    resetDataSources();
    dispatch(setScopeThreeColumns(tabData[tabKey - 1]?.columns));
    setColTitles(
      tabData[activeTab - 1].columns.map((obj: any) => obj?.dataIndex)
    );
  };

  useEffect(() => {
    const tabKey = activeTab;
    dispatch(setScopeThreeColumns(tabData[tabKey - 1]?.columns));
    setColTitles(
      tabData[activeTab - 1].columns.map((obj: any) => obj?.dataIndex)
    );
  }, [activeTab]);

  useEffect(() => {
    const colTitles = updatedDataSources
      ?.filter(
        (col: any) => typeof col.title === 'string' && col.title != 'Action'
      )
      ?.map((col: any) => col.title);

    const dataIndexes = scopeThreeCols
      ?.filter((col: any) => colTitles.includes(col.title))
      ?.map((col: any, index: any, array: any) => {
        if (index === array.length - 1 && col.dataIndex === 'file_name') {
          return 'disclosure';
        }
        return col.dataIndex;
      });

    const checkKeysHaveValues = (dataArray: any, keysToCheck: any) => {
      if (dataArray) {
        for (let data of dataArray) {
          for (let key of keysToCheck) {
            // Check that data[key] is neither null nor undefined
            if (data[key] === null || data[key] === undefined) {
              return false;
            }
            // Also check if 'disclosure' exists
            if (key === 'disclosure' && !data[key]) {
              return false;
            }
          }
        }
        return true;
      }
    };

    if (checkKeysHaveValues(dataSources[activeTab], dataIndexes)) {
      setDisableSubmit(false);

      if (showField) {
        if (propSum !== 100) {
          setDisableSubmit(true);
        } else {
          setDisableSubmit(false);
        }
      }

      if (dataIndexes.includes('proportion')) {
        if (propSum !== 100 || wasteProduct == '') {
          setDisableSubmit(true);
        } else {
          setDisableSubmit(false);
        }
      }
    } else {
      setDisableSubmit(true);
    }
  }, [
    dataSources,
    activeTab,
    showField,
    propSum,
    wasteProduct,
    scopeThreeCols,
  ]);

  // Function to calculate and update total area
  const updateTotalArea = (leasedAssets: any, lesseesAssets: any) => {
    const leased = parseFloat(leasedAssets) || 0; // Parse to float, default to 0 if NaN
    const lessees = parseFloat(lesseesAssets) || 0; // Parse to float, default to 0 if NaN
    const totalArea = leased / lessees;
    const totalAreaString = `${totalArea}`; // Calculate total area
    setTotalAreaLeasedAssest(totalAreaString); // Update state with total area
  };

  const [ExcelUploaded, setExcelUploaded] = useState(false);
  function initializeForm(response: any) {
    setExcelUploaded(true);
    setIsLoading(true);
    const tabNames: any = [
      'cat1_avg_data',
      'cat1_spend_data',
      'cat1_supplier_data',
      'cat2_avg_data',
      'cat2_spend_data',
      'cat2_supplier_data',
      'cat5_supplier_data',
      'cat5_waste_type_data',
      'cat5_avg_data',
      'cat6_fuel_based_data',
      'cat6_distance_based_data',
      'cat6_spend_based_data',
      'cat6_accomodation_based_data',
      'cat3_upstream_emission_fuels',
      'cat3_upstream_generation_of_electricity',
      'Cat3_ Elec_Sold_template',
    ];

    let processedData: any = [];
    tabNames.forEach((tabName: any) => {
      if (response[tabName]) {
        switch (tabName) {
          case 'cat1_avg_data':
            processedData = response['cat1_avg_data'];
            return processedData;
          case 'cat1_spend_data':
            processedData = response['cat1_spend_data'];
            return processedData;
          case 'cat1_supplier_data':
            processedData = response['cat1_supplier_data'];
            return processedData;
          case 'cat2_avg_data':
            processedData = response['cat2_avg_data'];
            return processedData;
          case 'cat2_spend_data':
            processedData = response['cat2_spend_data'];
            return processedData;
          case 'cat2_supplier_data':
            processedData = response['cat2_supplier_data'];
            return processedData;
          case 'cat5_supplier_data':
            processedData = response['cat5_supplier_data'];
            return processedData;
          case 'cat5_waste_type_data':
            processedData = response['cat5_waste_type_data'];
            return processedData;
          case 'cat5_avg_data':
            processedData = response['cat5_avg_data'];
            return processedData;
          case 'cat6_fuel_based_data':
            processedData = response['cat6_fuel_based_data'];
            return processedData;
          case 'cat6_distance_based_data':
            processedData = response['cat6_distance_based_data'];
            return processedData;
          case 'cat6_spend_based_data':
            processedData = response['cat6_spend_based_data'];
            return processedData;
          case 'cat6_accomodation_based_data':
            processedData = response['cat6_accomodation_based_data'].map(
              (item: any) => {
                const checkInDate = dayjs(item.check_in);
                const checkOutDate = dayjs(item.check_out);
                return {
                  ...item,
                  check_in: checkInDate,
                  check_out: checkOutDate,
                };
              }
            );
            return processedData;
          case 'cat6_accomodation_based_data':
            processedData = response['cat6_accomodation_based_data'].map(
              (item: any) => {
                const checkInDate = dayjs(item.check_in);
                const checkOutDate = dayjs(item.check_out);
                return {
                  ...item,
                  check_in: checkInDate,
                  check_out: checkOutDate,
                };
              }
            );
            return processedData;
          case 'cat3_upstream_generation_of_electricity':
            processedData = response[
              'cat3_upstream_generation_of_electricity'
            ].map((item: any) => {
              const checkInDate = dayjs(item.check_in);
              const checkOutDate = dayjs(item.check_out);
              return {
                ...item,
                check_in: checkInDate,
                check_out: checkOutDate,
              };
            });
            return processedData;
          case 'cat3_upstream_emission_fuels':
            processedData = response['cat3_upstream_emission_fuels'];
            return processedData;

          default:
            return null; // Default return case
        }
      }
    });
    setIsLoading(false);
    if (processedData.length === 0) {
      setTimeout(() => {
        message.warning('No data found');
      }, 1000);
    }
    if (
      processedData &&
      processedData.length > 0 &&
      processedData[0].hasOwnProperty('proportion')
    ) {
      const tot = processedData.reduce((sum: any, curr: any) => {
        return (sum = sum + curr.proportion);
      }, 0);

      if (tot !== 100) {
        setPropSum(tot);
        setTimeout(() => {
          message.warning('The sum of proportions should equal 100');
        }, 1500);
      } else {
        setPropSum(tot);
      }
    }
    setDataSources((prevDataSources) => ({
      ...prevDataSources,
      [activeTab]: processedData,
    }));
  }

  return (
    <>
      <PageCardComponent className={styles.pageCardStyle}>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {tabData?.map((tab: any) => (
            <TabPane key={tab.key} tab={tab.title}>
              <Row>
                <RadioWrapper />
                <Col span={24} className={styles.customPaddingTop}>
                  {radioValue === 1 ? (
                    <>
                      <Row gutter={[0, 15]} align="middle">
                        {tab.showField === true && (
                          <Col span={24}>
                            <span className="extraFields">
                              Total Waste Produced :
                            </span>
                            <Input
                              value={wasteProduct}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const inputValue = e.target.value;
                                // Replace non-numeric and non-decimal characters with an empty string
                                const filteredValue = inputValue.replace(
                                  /[^0-9.]/g,
                                  ''
                                );

                                // Update state with filtered value
                                setWasteProduct(filteredValue);
                              }}
                              style={{
                                width: '100px',
                                display: 'inline',
                                height: '44px',
                              }}
                            />
                            <span className="suffixValue">tonnes</span>
                          </Col>
                        )}
                        {tab.showTotalArea === true && (
                          <>
                            <Col span={8}>
                              <span className="extraFields">
                                Total Area of leased Assets (in m2) :
                              </span>
                              <Input
                                value={totalLeasedAssest}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const inputValue = e.target.value;
                                  // Replace non-numeric and non-decimal characters with an empty string
                                  const filteredValue = inputValue.replace(
                                    /[^0-9.]/g,
                                    ''
                                  );
                                  setTotalLeasedAssest(filteredValue);
                                  updateTotalArea(
                                    filteredValue,
                                    totalLesseesAssest
                                  );
                                }}
                                style={{ width: '50px', display: 'inline' }}
                              />
                            </Col>
                            <Col span={8}>
                              <span className="extraFields">
                                Total area of lessee's assets (in m2) :
                              </span>
                              <Input
                                value={totalLesseesAssest}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const inputValue = e.target.value;
                                  // Replace non-numeric and non-decimal characters with an empty string
                                  const filteredValue = inputValue.replace(
                                    /[^0-9.]/g,
                                    ''
                                  );
                                  setTotalLesseesAssest(filteredValue);
                                  updateTotalArea(
                                    totalLeasedAssest,
                                    filteredValue
                                  );
                                }}
                                style={{ width: '50px', display: 'inline' }}
                              />
                            </Col>
                            <Col span={8}>
                              <span className="extraFields">
                                Total Area of leased Assets (in m2) :
                              </span>
                              {totalAreaLeasedAssest}
                            </Col>
                          </>
                        )}

                        <Col span={24}>
                          <Spin spinning={isLoading}>
                            <TableComponent
                              isForm={true}
                              isRowExpand={false}
                              data={dataSources[tab.key]}
                              enableRowSelection={false}
                              columnHeader={generateColumns(
                                updatedDataSources,
                                activeTab
                              )}
                              showOnlyCount={false}
                              columnCheckBoxDataAttribute="key"
                            />
                          </Spin>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <ScopeExcelDataEntry
                      type={currentExcelName[activeTab - 1]}
                      emissionType={emissionType && emissionType[activeTab - 1]}
                      tabcolumns={generateColumns(
                        updatedDataSources,
                        activeTab,
                        true
                      )}
                      activeTab={activeTab}
                      postSubmit={postSubmit}
                      scopeThreeCols={scopeThreeCols}
                      initializeForm={initializeForm}
                      disableSubmit={disableSubmit}
                      datasources={dataSources[tab.key]}
                      ExcelUploaded={ExcelUploaded}
                      handleSubmit={handleSubmit}
                      loading={isLoading}
                      showField={tab.showField}
                      onInputChange={handleExcelInputChange}
                    />
                  )}
                </Col>
              </Row>
            </TabPane>
          ))}
        </Tabs>
        <Col
          span={24}
          style={{
            textAlign: 'right',
            display: 'flex',
            gap: '15px',
            justifyContent: 'end',
          }}
          className={styles.customPaddingTop}
        >
          {radioValue === 1 && !tabData[activeTab - 1]?.changeTextType && (
            <ButtonComponent
              hierarchy="tertiary"
              size="xl"
              onClick={() =>
                navigate(postSubmit, {
                  state: {
                    activeTab: activeTab,
                    currentFacility: facilitySelected,
                  },
                })
              }
            >
              Cancel
            </ButtonComponent>
          )}
          {radioValue === 1 && !tabData[activeTab - 1]?.changeTextType && (
            <ButtonComponent
              hierarchy="secondary"
              size="xl"
              onClick={resetDataSources}
            >
              Reset
            </ButtonComponent>
          )}
          {radioValue === 1 && !tabData[activeTab - 1]?.changeTextType && (
            <ButtonComponent
              disabled={disableSubmit}
              onClick={() => handleSubmit(activeTab)}
            >
              Submit
            </ButtonComponent>
          )}
        </Col>
      </PageCardComponent>
    </>
  );
};

export default ScopeThreeForm;
