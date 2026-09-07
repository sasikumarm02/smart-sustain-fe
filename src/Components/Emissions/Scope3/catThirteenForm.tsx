import React, { useEffect, useState } from 'react';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { Radio } from 'antd';
import styles from './scope3.module.scss';
import {
  Row,
  Col,
  Tabs,
  Input,
  Upload,
  Image,
  Button,
  message,
  Select,
} from 'antd';
import linkIcon from '../../../assets/link.png';
import editIcon from '../../../assets/edit.png';
import {
  catThirteenAssestSpecificcolsScope1,
  catThirteenAssestSpecificcolsScope2,
  catThirteenAssestSpecificcolsWithout,
  catThirteenAvgDatacolsAsset,
  catThirteenAvgDatacolsFloor,
  catThirteenLesseSpecificcols,
  energyCombustionColCat13,
  fugitiveEmissionsColCat13,
  processEmissionsColCat13,
  stationaryCombustionColCat13,
} from '../../../Modules/Emission/mock';
import { useLocation, useNavigate } from 'react-router-dom';
import disclosureIcon from '../../../assets/disclosureIcon.png';
import {
  UploadOutlined,
  FileExcelFilled,
  FileWordFilled,
  CloudFilled,
} from '@ant-design/icons';
import { useAuth } from '../../../Hooks/useAuth';
import { get, post, apiBaseUrl } from '../../../Services';
import { useNotification } from '../../../Hooks/useNotification';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { excludedDataIndicesCatthirteenForm } from './Helpers';
import UseTable from '../../content/UseTable';
import { isEmpty } from '../../../Utils/isEmpty';
import axios from 'axios';
import { CatThirteenExcelEntry } from './CatThirteenExcelDataEntry';
import { useSelector } from 'react-redux';
import {
  setEnergyConsumptionOptions,
  setFugitiveOptions,
  setProcessOptions,
  setStationaryOptions,
} from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';

const { TabPane } = Tabs;
const { Option } = Select;

function CatThirteenForm() {
  const location = useLocation();
  const { openToast } = useNotification();

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(location?.state?.activeTab || '1');
  const [activeSubTab, setActiveSubTab] = useState(
    location?.state?.activeSubTab || '6'
  );

  const [withoutTopData, setWithoutTopData] = useState<any>();

  const [leasedAssets, setLeasedAssets] = useState('');
  const [lesseeAssets, setLesseeAssets] = useState('');
  const [disableSubmit, setdisableSubmit] = useState(true);
  const [disableAdd, setdisableAdd] = useState(true);

  const [uploadedFileName, setUploadedFileName] = useState<any>({});
  const [attachement, setAttachement] = useState('');

  const [valueselected, setValueSelected] = useState(
    location.state?.valueselected || 'with-submeter'
  );

  const [floorData, setFloorData] = useState([
    {
      key: '1',
      lessee_name: '',
      asset_category: '',
      description: '',
      quantity: '',
      uom: '',
      disclosure: null,
    },
  ]);

  const [stationaryData, setStationaryData] = useState([
    {
      key: '1',
      lessee_name: '',
      fuel: '',
      UOM: '',
      qty: '',
      disclosure: null,
    },
  ]);

  const [energyData, setEnergyData] = useState([
    {
      key: '1',
      lessee_name: '',
      source_of_energy: '',
      vehicle_type: '',
      UOM: '',
      qty: '',
      disclosure: null,
    },
  ]);

  const [processData, setProcessData] = useState([
    {
      key: '1',
      lessee_name: '',
      equipmentType: '',
      gas_or_refrigerant: '',
      UOM: '',
      qty: '',
      disclosure: null,
    },
  ]);

  const [fugitiveData, setFugitiveData] = useState([
    {
      key: '1',
      lessee_name: '',
      equipmentType: '',
      gas_or_refrigerant: '',
      UOM: '',
      qty: '',
      disclosure: null,
    },
  ]);

  const [withDataEntry, setWithDataEntry] = useState([
    {
      key: '1',
      lessee_name: '',
      fuel: '',
      UOM: '',
      qty: '',
      disclosure: null,
    },
  ]);

  const [withoutDataEntry, setWithoutDataEntry] = useState([
    {
      key: '1',
      fuel: '',
      fuel_consumed: '',
      uom: '',
      disclosure: null,
    },
  ]);

  const [lesseeDataEntry, setLesseeDataEntry] = useState([
    {
      key: '1',
      lessee_name: '',
      total_lessee_scope1_scope2_emission: '',
      total_scope1_scope2_uom: '',
      lessee_asset_area_vol_qty: '',
      lessee_asset_uom: '',
      total_lessee_asset_area_vol_qty: '',
      total_lessee_asset_uom: '',
      disclosure: null,
    },
  ]);

  const isDataValid = (data: any) => {
    return data.every((item: any) => {
      return Object.values(item).every(
        (value) => value !== null && value !== ''
      );
    });
  };

  const isDataValidWithout = (data: any) => {
    return data.every((item: any) => {
      const hasRequiredKeys = [
        'fuel',
        'fuel_consumed',
        'disclosure',
        'uom',
      ].every((key) => item[key] !== null && item[key] !== '');
      const hasTotalEmissions = 'total_emission' in item;

      return hasRequiredKeys || hasTotalEmissions;
    });
  };
  // Determine if the submit button should be enabled

  const [lesseeData, setLesseeData] = useState([]);

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

  const truncateText = (text: any, maxLength: any) => {
    if (!text) {
      return '';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const modifyColumnsWithRowStatus = (columns: any, role: any) => {
    return columns.map((column: any) => {
      if (column.dataIndex === 'disclosure') {
        return {
          ...column,
          render: (text: any, record: any) => {
            const { status } = record;
            const id = record.id;
            return (
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
            );
          },
        };
      }
      return column;
    });
  };

  const [identifier, setIdentifier] = useState(2);

  const handleInputChange = (value: any, key: any, column: any) => {
    if (activeTab === '3') {
      const newData = floorData.map((item) =>
        item.key === key ? { ...item, [column]: value } : item
      );

      setFloorData(newData);
    }
    // if (activeTab === '1' && valueselected === 'with-submeter') {
    //   const newData = withDataEntry.map((item) =>
    //     item.key === key ? { ...item, [column]: value } : item
    //   );

    //   setWithDataEntry(newData);
    // }
    if (activeTab === '1' && valueselected === 'with-submeter') {
      switch (subActiveTabKey) {
        case '1': {
          const newData = stationaryData.map((item) =>
            item.key === key ? { ...item, [column]: value } : item
          );
          setStationaryData(newData);
          break;
        }
        case '2': {
          const newData = processData.map((item) =>
            item.key === key ? { ...item, [column]: value } : item
          );
          setProcessData(newData);
          break;
        }
        case '3': {
          const newData = fugitiveData.map((item) =>
            item.key === key ? { ...item, [column]: value } : item
          );
          const updatedData =
            key === currentRowIndex ? { ...newData, [column]: value } : newData;

          setFugitiveData(updatedData);
          break;
        }
        case '4': {
          const newData = energyData.map((item, index) =>
            item.key === key ? { ...item, [column]: value } : item
          );

          const updatedData =
            key === currentRowIndex ? { ...newData, [column]: value } : newData;
          setEnergyData(updatedData);

          break;
        }
      }
    }
    if (activeTab === '1' && valueselected === 'without-submeter') {
      const newData = withoutDataEntry.map((item) =>
        item.key === key ? { ...item, [column]: value } : item
      );
      setWithoutDataEntry(newData);
    }
    if (activeTab === '2') {
      const newData = lesseeDataEntry.map((item) =>
        item.key === key ? { ...item, [column]: value } : item
      );

      setLesseeDataEntry(newData);
    }
  };

  const [fileList, setFileList] = useState(true);

  const handleEditUploadFile = (
    info: any,
    key: any,
    column: any,
    index: any
  ) => {
    const file = info.file.originFileObj;

    if (info.file.status === 'done') {
      // Use activeTab, valueselected, and key to uniquely identify the file
      setFileList(true);
      setUploadedFileName((prevFileNames: any) => ({
        ...prevFileNames,
        [`${activeTab}-${valueselected}-${key}`]: info?.file?.name, // Include valueselected here
      }));

      // Handle data change based on the response
      handleInputChange(info.file.response?.response?.data, key, column);

      // Update submit button state based on activeTab
      if (activeTab === '3') setdisableSubmit(!isDataValid(floorData));
      // if (activeTab === '1') setdisableSubmit(!isDataValid(withDataEntry));

      if (activeTab === '1') {
        let currentData: any[] = [];

        switch (subActiveTabKey) {
          case '1':
            currentData = stationaryData;
            break;
          case '2':
            currentData = processData;
            break;
          case '3':
            currentData = fugitiveData;
            break;
          case '4':
            currentData = energyData;
            break;
        }

        setdisableSubmit(!isDataValid(currentData));
      }

      if (activeTab === '2') setdisableSubmit(!isDataValid(lesseeDataEntry));

      // Display success toast message
      openToast({
        content: `${info.file.name} file uploaded successfully.`,
        type: 'success',
      });

      // Update attachment state with UID from response
      const UID = info.file.response?.response?.data;
      setAttachement(UID);
    }
    if (info.file.status === 'removed') {
      if (activeTab === '1') {
        if (valueselected === 'with-submeter') {
          switch (subActiveTabKey) {
            case '1':
              const updatedData = [...stationaryData];
              const item = updatedData.find((item) => item.key === index);
              if (item) {
                item.disclosure = null;
              }

              setStationaryData(updatedData);

              break;
            case '2':
              const updatedData1 = [...processData];
              const item1 = updatedData1.find((item) => item.key === index);
              if (item1) {
                item1.disclosure = null;
              }
              setProcessData(updatedData1);
              break;
            case '3':
              const updatedData2 = [...fugitiveData];

              const item2 = updatedData2.find((item) => item.key === index);

              if (item2) {
                item2.disclosure = null;
              }
              setFugitiveData(updatedData2);
              break;
            case '4':
              const updatedData3 = [...energyData];
              const item3 = updatedData3.find((item) => item.key === index);
              if (item3) {
                item3.disclosure = null;
              }
              setEnergyData(updatedData3);
              break;

            default:
          }
        } else if (valueselected === 'without-submeter') {
          const updatedData = [...withoutDataEntry];
          const item = updatedData.find((item) => item.key === index);
          if (item) {
            item.disclosure = null;
          }
          setWithoutDataEntry(updatedData);
        }
      } else if (activeTab === '2') {
        const updatedData = [...lesseeDataEntry];
        const item = updatedData.find((item) => item.key === index);
        if (item) {
          item.disclosure = null;
        }
        setLesseeDataEntry(updatedData);
      } else if (activeTab === '3') {
        const updatedData = [...floorData];
        const item = updatedData.find((item) => item.key === index);
        if (item) {
          item.disclosure = null;
        }
        setFloorData(updatedData);
      }

      // Handle removal logic (e.g., update state or API call for file removal)

      // Display remove success toast message
      openToast({
        content: `File removed successfully.`,
        type: 'success',
      });

      // Optionally, update related states if necessary
      setUploadedFileName((prevFileNames: any) => {
        const updatedFileNames = { ...prevFileNames };
        delete updatedFileNames[`${activeTab}-${valueselected}-${key}`];
        return updatedFileNames;
      });

      // Reset attachment state or perform cleanup
      setAttachement('');
    }
  };

  const handleKeyDown = (event: any) => {
    // Prevent scrolling with arrow keys, Page Up/Down, Home/End
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === '-'
    ) {
      event.preventDefault();
    }
  };

  const [selectedFuel, setSelectedFuel] = useState<any[]>([]);
  const [selectedGasOne, setSelectedGasOne] = useState<any[]>([]);
  const [selectedGasTwo, setSelectedGasTwo] = useState<any[]>([]);
  const [selectedEnergy, setSelectedEnergy] = useState<string>('');

  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [uomOptions, setUomOptions] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(-1);

  let options = [];

  const renderInput = (
    type: any,
    value: any,
    record: any,
    column: any,
    rowIndex: any
  ) => {
    if (
      !(
        'total_emission' in record &&
        activeTab === '1' &&
        valueselected === 'without-submeter'
      )
    ) {
      if (type === 'dropdown') {
        return (
          <Select
            value={value}
            disabled={ExcelUploaded ? true : false}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
            style={{ width: '100%' }}
          >
            {record.asset_category == 'floor' && (
              <Option value="m2">
                m<sup>2</sup>
              </Option>
            )}
            {record.asset_category == 'asset' && (
              <Option value="Unit">
                <span>UNIT</span>
              </Option>
            )}
          </Select>
        );
      }
      if (type === 'dropdown2') {
        return (
          <Select
            value={value}
            disabled={ExcelUploaded ? true : false}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
            style={{ width: '100%' }}
          >
            <Option value="floor">Floor Space</Option>
            <Option value="asset">Asset</Option>
          </Select>
        );
      }
      if (type === 'uomdropdown') {
        return (
          <Select
            value={value}
            disabled={ExcelUploaded ? true : false}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
            style={{ width: '100px' }}
          >
            <Option value="tco2e">tco2e</Option>
            <Option value="kgco2e">kgco2e</Option>
          </Select>
        );
      }
      if (type === 'text') {
        return (
          <Input
            value={value}
            disabled={ExcelUploaded ? true : false}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              const inputValue = e.target.value;
              const decimalRegex = /^(?!-)[0-9]*\.?[0-9]*$/; // Allows decimals for 'asset_area'
              const integerRegex = /^(?!-)[0-9]*$/; // Only allows integers for 'no_of_assets'

              if (
                (column === 'quantity' && activeTab != '3') ||
                column === 'fuel_consumed'
              ) {
                // Use the decimalRegex for 'asset_area'
                if (decimalRegex.test(inputValue) || inputValue === '') {
                  handleInputChange(inputValue, record.key, column);
                }
              } else if (activeTab === '3' && column === 'quantity') {
                // Use the integerRegex for 'no_of_assets'
                if (integerRegex.test(inputValue) || inputValue === '') {
                  handleInputChange(inputValue, record.key, column);
                }
              } else {
                handleInputChange(inputValue, record.key, column);
              }
            }}
          />
        );
      }
      if (type === 'upload') {
        return (
          <Upload
            className="scope-form-upload"
            maxCount={1}
            showUploadList={fileList}
            onChange={(info: any) => {
              handleEditUploadFile(
                info,
                record.key,
                column,
                (rowIndex + 1).toString()
              );
            }}
            name="uploaded_file"
            beforeUpload={(file) => {
              const maxSize = 2.5 * 1024 * 1024;
              if (file.size > maxSize) {
                message.warning('File size must be less than 2.5MB.');
                return false;
              }

              return true;
            }}
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
      }
      if (type === 'fuelDropdown') {
        options = stationaryOptions?.fuelRelatedOptions
          ? Object.keys(stationaryOptions.fuelRelatedOptions).sort()
          : [];

        return (
          <Select
            value={record[column]}
            disabled={ExcelUploaded}
            style={{ width: '280px' }}
            onChange={(selectedValue) => {
              setSelectedFuel(selectedValue);
              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }
      if (type === 'fuelUom') {
        const fuelOptions =
          stationaryOptions?.fuelRelatedOptions?.[record?.fuel || selectedFuel];
        options = fuelOptions || [];

        return (
          <Select
            value={value}
            disabled={ExcelUploaded}
            style={{ width: '150px' }}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((opt: any) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }
      if (type === 'gasProcess') {
        // Check if `gasOrRefrigerant` exists in `processOptions`
        options = processOptions?.gasOrRefrigerant
          ? Object.keys(processOptions.gasOrRefrigerant).sort()
          : [];

        return (
          <Select
            value={record[column]}
            disabled={ExcelUploaded}
            style={{ width: '280px' }}
            onChange={(selectedValue) => {
              setSelectedGasOne(selectedValue); // Update selected gas
              handleInputChange(selectedValue, record.key, column); // Handle input change
            }}
          >
            {options.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }

      if (type === 'uomProcess') {
        // Fetch the fuel or gas related UOMs based on selected fuel or selected gas
        const prosOptions =
          processOptions?.gasOrRefrigerant?.[record?.fuel || selectedGasOne];

        // If no options are found, fallback to an empty array
        options = prosOptions || [];

        return (
          <Select
            value={value}
            disabled={ExcelUploaded}
            style={{ width: '150px' }}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((opt: any) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }

      if (type === 'gasFugitive') {
        // Check if `gasOrRefrigerant` exists in `processOptions`
        options = processOptions?.gasOrRefrigerant
          ? Object.keys(processOptions.gasOrRefrigerant).sort()
          : [];

        return (
          <Select
            value={record[column]}
            disabled={ExcelUploaded}
            style={{ width: '280px' }}
            onChange={(selectedValue) => {
              setSelectedGasTwo(selectedValue); // Update selected gas
              handleInputChange(selectedValue, record.key, column); // Handle input change
            }}
          >
            {options.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }

      if (type === 'uomFugitive') {
        // Fetch the fuel or gas related UOMs based on selected fuel or selected gas
        const fugitiveOptions =
          processOptions?.gasOrRefrigerant?.[record?.fuel || selectedGasTwo];

        // If no options are found, fallback to an empty array
        options = fugitiveOptions || [];

        return (
          <Select
            value={value}
            disabled={ExcelUploaded}
            style={{ width: '150px' }}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((opt: any) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }

      if (type === 'energyDropdown') {
        options = energyConsumptionOptions?.sourceOfEnergy
          ? Object.keys(energyConsumptionOptions.sourceOfEnergy).sort()
          : [];

        return (
          <Select
            value={record[column]}
            disabled={ExcelUploaded}
            style={{ width: '280px' }}
            onChange={(selectedValue) => {
              setSelectedEnergy(selectedValue);

              // If not "Electricity for EVs", clear vehicle dropdown
              if (selectedValue !== 'Electricity for EVs') {
                setSelectedVehicle('');
              }

              const updatedData = [...energyData];
              const item = updatedData.find((item) => item.key === record.key);
              if (item) {
                item.UOM = '';
                item.vehicle_type = '';
              }
              setEnergyData(updatedData);

              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((opt: any) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
        );
      }
      if (type === 'vechileDropdown') {
        options = energyConsumptionOptions?.vehicleRelatedOptions
          ? Object.keys(energyConsumptionOptions.vehicleRelatedOptions).sort()
          : [];

        const isElectricity = record.source_of_energy === 'Electricity for EVs';

        const isVehicleDropdownEnabled = isElectricity && !ExcelUploaded;

        // Disable in all other cases
        const isDisabled = !isVehicleDropdownEnabled;

        return (
          <Select
            value={isDisabled ? '' : record[column]}
            disabled={isDisabled}
            style={{ width: '280px' }}
            onChange={(selectedValue) => {
              setSelectedVehicle(selectedValue);
              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((vehicle: any) => (
              <Option key={vehicle} value={vehicle}>
                {vehicle}
              </Option>
            ))}
          </Select>
        );
      }

      if (type === 'energyUom') {
        const isVehicleDropdownEnabled =
          selectedEnergy === 'Electricity for EVs';

        const source = isVehicleDropdownEnabled
          ? energyConsumptionOptions?.vehicleRelatedOptions?.[selectedVehicle]
          : energyConsumptionOptions?.sourceOfEnergy?.[selectedEnergy];

        options = Array.isArray(source)
          ? source.sort()
          : source
            ? Object.keys(source).sort()
            : [];

        return (
          <Select
            value={record[column]}
            disabled={ExcelUploaded}
            style={{ width: '80px' }}
            onChange={(selectedValue) => {
              handleInputChange(selectedValue, record.key, column);
            }}
          >
            {options.map((uom: any) => (
              <Option key={uom} value={uom}>
                {uom}
              </Option>
            ))}
          </Select>
        );
      }

      if (type === 'number') {
        return (
          <Input
            value={value}
            onKeyDown={(e) => {
              if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              handleInputChange(e.target.value, record.key, column);
            }}
          />
        );
      }

      if (type === 'lesseUom') {
        return (
          <Select
            value={value}
            disabled={!!ExcelUploaded}
            onChange={(selectedValue) =>
              handleInputChange(selectedValue, record.key, column)
            }
            style={{ width: '120px' }}
          >
            <Option value="tCO₂e">tCO₂e</Option>
            <Option value="kgCO₂e">kgCO₂e</Option>
          </Select>
        );
      }
    }

    return value;
  };

  const filterColumnsByRole = (
    columns: any[],
    role: string,
    excludedIndices: any[]
  ) => {
    return role !== 'DATA_PROVIDER'
      ? columns
      : columns?.filter(
          (item: any) => !excludedIndices.includes(item.dataIndex)
        );
  };

  const withoutcols = filterColumnsByRole(
    catThirteenAssestSpecificcolsWithout,
    user.role,
    excludedDataIndicesCatthirteenForm
  );

  const stationaryCols = filterColumnsByRole(
    stationaryCombustionColCat13,
    user.role,
    excludedDataIndicesCatthirteenForm
  );
  const processCols = filterColumnsByRole(
    processEmissionsColCat13,
    user.role,
    excludedDataIndicesCatthirteenForm
  );
  const fugitiveCols = filterColumnsByRole(
    fugitiveEmissionsColCat13,
    user.role,
    excludedDataIndicesCatthirteenForm
  );
  const energyCols = filterColumnsByRole(
    energyCombustionColCat13,
    user.role,
    excludedDataIndicesCatthirteenForm
  );

  const lesseeCols = filterColumnsByRole(
    catThirteenLesseSpecificcols,
    user.role,
    excludedDataIndicesCatthirteenForm
  );

  const floorcolumns = filterColumnsByRole(
    catThirteenAvgDatacolsFloor,
    user.role,
    excludedDataIndicesCatthirteenForm
  );

  const handleRemoveRow = async (key: any) => {
    if (activeTab === '3') {
      // Remove the specific row from floorData
      setFloorData(floorData.filter((row) => row.key !== key));
    }
    // if (activeTab === '1' && valueselected === 'with-submeter') {
    //   setWithDataEntry(withDataEntry.filter((row) => row.key !== key));
    // }
    if (activeTab === '1' && valueselected === 'with-submeter') {
      switch (subActiveTabKey) {
        case '1':
          setStationaryData(stationaryData.filter((row) => row.key !== key));
          break;
        case '2':
          setProcessData(processData.filter((row) => row.key !== key));
          break;
        case '3':
          setFugitiveData(fugitiveData.filter((row) => row.key !== key));
          break;
        case '4':
          setEnergyData(energyData.filter((row) => row.key !== key));
          break;
      }
    }

    if (activeTab === '1' && valueselected === 'without-submeter') {
      setWithoutDataEntry(withoutDataEntry.filter((row) => row.key !== key));
    }
    if (activeTab === '2') {
      setLesseeDataEntry(lesseeDataEntry.filter((row) => row.key !== key));
    }
  };

  const enhancedFloorColumns = [
    ...floorcolumns.map((col) => ({
      ...col,
      render: (text: any, record: any, rowIndex: any) =>
        renderInput(
          col.type,
          record[col.dataIndex],
          record,
          col.dataIndex,
          rowIndex
        ),
    })),
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any, index: any) => (
        <div>
          <button
            className="text-danger user-select-all no-border"
            onClick={() => {
              handleRemoveRow((index + 1).toString());
            }}
            style={{ border: 'none' }}
          >
            <CloseCircleOutlined />
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (activeTab === '1') {
      if (valueselected === 'with-submeter') {
        switch (subActiveTabKey) {
          case '1':
            stationaryData.map((item, index) => {
              item.key = (index + 1).toString();
            });
            break;
          case '2':
            processData.map((item, index) => {
              item.key = (index + 1).toString();
            });
            break;

          case '3':
            fugitiveData.map((item, index) => {
              item.key = (index + 1).toString();
            });
            break;

          case '4':
            energyData.map((item, index) => {
              item.key = (index + 1).toString();
            });
            break;

          default:
        }
      } else if (valueselected === 'without-submeter') {
        withoutDataEntry.map((item, index) => {
          item.key = (index + 1).toString();
        });
      }
    } else if (activeTab === '2') {
      lesseeDataEntry.map((item, index) => {
        item.key = (index + 1).toString();
      });
    } else if (activeTab === '3') {
      floorData.map((item, index) => {
        item.key = (index + 1).toString();
      });
    }
  }, [
    withoutDataEntry,
    lesseeDataEntry,
    stationaryData,
    processData,
    fugitiveData,
    energyData,
    floorData,
  ]);

  // Enhanced column definitions with input rendering for Asset tab
  const enhancedWithColumns = (cols: any) => [
    ...cols.map((col: any) => ({
      ...col,
      render: (text: any, record: any, index: any) =>
        renderInput(
          col.type,
          record[col.dataIndex],
          record,
          col.dataIndex,
          index
        ),
    })),
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any, index: any) => (
        <div>
          <button
            className="text-danger user-select-all noborder"
            onClick={() => {
              handleRemoveRow((index + 1).toString());
            }}
            style={{ border: 'none' }}
          >
            <CloseCircleOutlined className={styles.noborder} />
          </button>
        </div>
      ),
    },
  ];

  const columnsByTabKey = {
    '1': enhancedWithColumns(stationaryCols),
    '2': enhancedWithColumns(processCols),
    '3': enhancedWithColumns(fugitiveCols),
    '4': enhancedWithColumns(energyCols),
  };

  const enhancedWithoutColumns = [
    ...withoutcols.map((col) => ({
      ...col,
      render: (text: any, record: any, index: any) =>
        renderInput(
          col.type,
          record[col.dataIndex],
          record,
          col.dataIndex,
          index
        ),
    })),
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div>
          <button
            className="text-danger user-select-all noborder"
            onClick={() => handleRemoveRow(record.key)}
            style={{ border: 'none' }}
          >
            <CloseCircleOutlined className={styles.noborder} />
          </button>
        </div>
      ),
    },
  ];

  const enhancedLesseeColumns = [
    ...lesseeCols.map((col) => ({
      ...col,
      render: (text: any, record: any, index: any) =>
        renderInput(
          col.type,
          record[col.dataIndex],
          record,
          col.dataIndex,
          index
        ),
    })),
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div>
          <button
            className="text-danger user-select-all noborder"
            onClick={() => handleRemoveRow(record.key)}
            style={{ border: 'none' }}
          >
            <CloseCircleOutlined className={styles.noborder} />
          </button>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  const handleChange = (e: any, field: any) => {
    const { value } = e.target;
    // Validate input: allow only positive numbers
    const isValidInput = /^\d*\.?\d*$/.test(value);
    if (field === 'leasedArea' && isValidInput) {
      setLeasedArea(value);
    }
    if (field === 'withOutleasedArea' && isValidInput) {
      setwithOutLeasedArea(value);
    }
    if (field === 'occupancy' && isValidInput) {
      setOccupancy(value);
    }
    if (field === 'buildingarea' && isValidInput) {
      setBuildingArea(value);
    }
    if (field === 'withOutbuildingArea' && isValidInput) {
      setwithOutBuildingArea(value);
    }
    if (field === 'leasedAssets' && isValidInput) {
      setLeasedAssets(value);
    } else if (field === 'lesseeAssets' && isValidInput) {
      setLesseeAssets(value);
    }
  };

  const handleAddRow = (activeTab: any) => {
    const newKey = String(identifier); // Generate a unique key for the new row
    setIdentifier(identifier + 1);
    if (activeTab === '3') {
      setFloorData([
        ...floorData,
        {
          key: (floorData.length + 1).toString(),
          lessee_name: '',
          asset_category: '',
          description: '',
          quantity: '',
          uom: '',
          disclosure: null,
        },
      ]);
    }
    if (activeTab === '1' && valueselected === 'with-submeter') {
      switch (subActiveTabKey) {
        case '1':
          setStationaryData([
            ...stationaryData,
            {
              key: (stationaryData.length + 1).toString(),
              lessee_name: '',
              fuel: '',
              UOM: '',
              qty: '',
              disclosure: null,
            },
          ]);
          break;
        case '2':
          setProcessData([
            ...processData,
            {
              key: (processData.length + 1).toString(),
              lessee_name: '',
              equipmentType: '',
              gas_or_refrigerant: '',
              UOM: '',
              qty: '',
              disclosure: null,
            },
          ]);
          break;
        case '3':
          setFugitiveData([
            ...fugitiveData,
            {
              key: (fugitiveData.length + 1).toString(),
              lessee_name: '',
              equipmentType: '',
              gas_or_refrigerant: '',
              UOM: '',
              qty: '',
              disclosure: null,
            },
          ]);
          break;
        case '4':
          setEnergyData([
            ...energyData,
            {
              key: (energyData.length + 1).toString(),
              lessee_name: '',
              source_of_energy: '',
              vehicle_type: '',
              UOM: '',
              qty: '',
              disclosure: null,
            },
          ]);
          break;
      }
    }

    if (activeTab === '1' && valueselected === 'without-submeter') {
      setWithoutDataEntry([
        ...withoutDataEntry,
        {
          key: (withoutDataEntry.length + 1).toString(),
          fuel: '',
          fuel_consumed: '',
          uom: '',
          disclosure: null,
        },
      ]);
    }
    if (activeTab === '2') {
      setLesseeDataEntry([
        ...lesseeDataEntry,
        {
          key: (lesseeDataEntry.length + 1).toString(),
          lessee_name: '',
          total_lessee_scope1_scope2_emission: '',
          total_scope1_scope2_uom: '',
          lessee_asset_area_vol_qty: '',
          lessee_asset_uom: '',
          total_lessee_asset_area_vol_qty: '',
          total_lessee_asset_uom: '',
          disclosure: null,
        },
      ]);
    }
  };

  const [loading, setLoading] = useState(false);

  const handleLesseeDataGetApi = () => {
    const path = '/scope3_cat13/get_cat13_data_for_lessee_specific_method/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        setLesseeData(res?.response?.data);
        setLeasedAssets(res?.response?.leased_asset_area);
        setLesseeAssets(res?.response?.lessee_asset_area);
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
      });
  };

  // const handleGetAssetadditionalData = () => {
  //   setLoading(true);

  //   const path = 'scope3_cat13/fetch_assets_specific_data/';
  //   get(`${path}?entity_Id=${user.entity_Id}`)
  //     .then((res) => {
  //       setWithoutTopData(res?.response?.data);
  //     })
  //     .catch((err) => {
  //       message.error(err?.response?.data.message);
  //     });
  //   setLoading(false);
  // };

  useEffect(() => {
    //handleLesseeDataGetApi();
    if (user.role !== 'DATA_PROVIDER') {
      handleWithoutSubmeterGetData();
      handleWithSubmeterGetData();
    }
  }, []);

  const [leasedArea, setLeasedArea] = useState(''); // Start with 0
  const [withOutleasedArea, setwithOutLeasedArea] = useState(''); // Start with 0
  const [buildingArea, setBuildingArea] = useState('');
  const [withOutbuildingArea, setwithOutBuildingArea] = useState('');
  const [occupancy, setOccupancy] = useState('');
  const [utilizedOccupancyRatio, setUtilizedOccupancyRatio] = useState<any>(0);
  const [withOututilizedOccupancyRatio, setwithOutUtilizedOccupancyRatio] =
    useState<any>(0); // Initialize as 0
  const [totalemissions, setTotalEmissions] = useState<any>(0);
  const [totalDownstream, setTotalDownStream] = useState<any>(0);

  const [withData, setWithData] = useState([]);
  const [withTopData, setWithTopData] = useState<any>();
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const handleWithSubmeterGetData = () => {
    const path = '/scope3_cat13/get_cat13_data_for_asset_specific_sub_meter/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        setWithData(res?.response?.data);
        setWithTopData(res?.response);
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
      });
  };
  useEffect(() => {
    if (withoutTopData && valueselected === 'without-submeter') {
      const newLeasedArea = withoutTopData?.leased_area || 0;
      const newBuildingArea = withoutTopData?.building_total_area || 0;
      const newOccupancy = withoutTopData?.occupancy_rate || 0;
      const newTotalEmissions = withoutTopData?.total_emission || 0;

      setwithOutLeasedArea(newLeasedArea);
      setwithOutBuildingArea(newBuildingArea);
      setOccupancy(newOccupancy);
      setTotalEmissions(newTotalEmissions);

      //Calculate utilizedOccupancyRatio safely after setting state values
      const newUtilizedOccupancyRatio =
        newLeasedArea / (newBuildingArea * newOccupancy) || 0;
      setwithOutUtilizedOccupancyRatio(
        Number(newUtilizedOccupancyRatio.toFixed(3))
      );

      //Calculate totalDownstream
      setTotalDownStream(
        Number((newUtilizedOccupancyRatio * newTotalEmissions).toFixed(2))
      );
    } else if (withTopData && valueselected === 'with-submeter') {
      const newLeasedArea = withTopData?.leased_area || 0;
      const newBuildingArea = withTopData?.building_total_area || 0;
      const newTotalEmissions = withTopData?.total_emission || 0;

      setLeasedArea(newLeasedArea);
      setBuildingArea(newBuildingArea);
      setTotalEmissions(newTotalEmissions);

      // Calculate utilizedOccupancyRatio safely after setting state values
      const newUtilizedOccupancyRatio = newLeasedArea / newBuildingArea || 0;
      setUtilizedOccupancyRatio(Number(newUtilizedOccupancyRatio.toFixed(3)));

      // Calculate totalDownstream
      setTotalDownStream(
        Number((newUtilizedOccupancyRatio * newTotalEmissions).toFixed(2))
      );
    }
  }, [withoutTopData, withTopData, valueselected]);

  useEffect(() => {
    let newUtilizedOccupancyRatio = 0;

    if (valueselected === 'without-submeter') {
      newUtilizedOccupancyRatio =
        Number(withOutleasedArea) /
          (Number(withOutbuildingArea) * Number(occupancy)) || 0;

      setwithOutUtilizedOccupancyRatio(
        Number(newUtilizedOccupancyRatio.toFixed(3))
      );
    } else {
      newUtilizedOccupancyRatio =
        Number(leasedArea) / Number(buildingArea) || 0;

      setUtilizedOccupancyRatio(Number(newUtilizedOccupancyRatio.toFixed(3)));
    }

    if (Number((newUtilizedOccupancyRatio * totalemissions).toFixed(2)) > 0) {
      setTotalDownStream(
        Number((newUtilizedOccupancyRatio * totalemissions).toFixed(2))
      );
    }
  }, [
    withOutleasedArea,
    withOutbuildingArea,
    occupancy,
    valueselected,
    leasedArea,
    buildingArea,
    totalemissions,
  ]);

  const [withoutData, setWithoutData] = useState<any[]>([]);

  const dataBySubTabKey: Record<string, any[]> = {
    '1': stationaryData,
    '2': processData,
    '3': fugitiveData,
    '4': energyData,
  };

  useEffect(() => {
    // Validation Logic for energyData (skip vehicle_type validation)
    const isEnergyDataValid =
      valueselected === 'with-submeter' && subActiveTabKey === '4'
        ? energyData.every(
            (row) =>
              row.lessee_name && // lessee_name should not be empty
              row.source_of_energy && // source_of_energy should not be empty
              row.UOM && // UOM should not be empty
              row.qty !== '' && // qty should not be empty
              row.disclosure !== null // disclosure should not be null
            // Ignore vehicle_type field here
          )
        : isDataValid(
            dataBySubTabKey[subActiveTabKey as '1' | '2' | '3' | '4']
          );

    if (activeTab === '1') {
      if (valueselected === 'with-submeter') {
        const currentData = dataBySubTabKey[subActiveTabKey];
        setdisableAdd(!isDataValid(currentData));

        // Continue with existing code
      } else {
        isDataValidWithout(withoutDataEntry)
          ? setdisableAdd(false)
          : setdisableAdd(true);
      }

      if (valueselected === 'with-submeter' && subActiveTabKey === '4') {
        setdisableAdd(!isEnergyDataValid); // Enable Add when energy data is valid (vehicle_type skipped)
      }

      if (
        (valueselected === 'with-submeter' && isEnergyDataValid) ||
        (valueselected === 'without-submeter' &&
          !isEmpty(withOutleasedArea) &&
          !isEmpty(withOutbuildingArea) &&
          (!isEmpty(occupancy) || valueselected === 'with-submeter') &&
          isDataValidWithout(withoutDataEntry))
      ) {
        setdisableSubmit(false); // Enable submit button
      } else {
        setdisableSubmit(true); // Disable submit button
      }
    }

    if (activeTab == '2') {
      isDataValid(lesseeDataEntry) ? setdisableAdd(false) : setdisableAdd(true);
      if (isDataValid(lesseeDataEntry)) {
        setdisableSubmit(false);
      } else {
        setdisableSubmit(true);
      }
    }

    if (activeTab === '3' && isDataValid(floorData)) {
      setdisableAdd(false);
      setdisableSubmit(false);
    } else if (activeTab === '3') {
      setdisableAdd(true);
      setdisableSubmit(true);
    }
  }, [
    leasedArea,
    buildingArea,
    occupancy,
    uploadedFileName,
    leasedAssets,
    lesseeAssets,
    withDataEntry,
    lesseeDataEntry,
    withoutDataEntry,
    floorData,
    activeTab,
    valueselected,
    withOutleasedArea,
    withOutbuildingArea,
    stationaryData,
    processData,
    fugitiveData,
    energyData, // Ensure energyData is included for updates
  ]);

  const handleLesseeDataPostApi = () => {
    const path = '/scope3_cat13/create_lessee_specific/';

    const payload = lesseeDataEntry.map((entry) => ({
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected || '',
      lessee_name: entry.lessee_name,
      total_lessee_scope1_scope2_emission:
        entry.total_lessee_scope1_scope2_emission,
      total_scope1_scope2_uom: entry.total_scope1_scope2_uom,
      lessee_asset_area_vol_qty: entry.lessee_asset_area_vol_qty,
      lessee_asset_uom: entry.lessee_asset_uom,
      total_lessee_asset_area_vol_qty: entry.total_lessee_asset_area_vol_qty,
      total_lessee_asset_uom: entry.total_lessee_asset_uom,
      disclosure: entry.disclosure,
    }));

    post(path, payload).catch((err) => {
      message.error(
        err?.response?.data?.message || 'Failed to submit lessee data'
      );
    });
  };

  const convertDataFloor = (data: any) => {
    return data.map((item: any) => ({
      lessee_name: item.lessee_name,
      asset_category: item.asset_category,
      description: item.description,
      quantity: item.quantity,
      disclosure: item.disclosure ? item.disclosure : 'uuid', // Replace null with "uuid"
      uom: item.uom,
    }));
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
      title: 'Energy Consumption',
      content: 'This is your Profile info.',
    },
  ];

  const [subActiveTabKey, setSubActiveTabKey] = useState(
    location?.state?.subActiveTabKey || '1'
  );
  const [subActiveTabTitle, setSubActiveTabTitle] = useState(tabData[0].title);

  const dispatch = useDispatch();

  const fetchFuelList = (value: string) => {
    // Start loading
    setIsLoading(true);

    // Make the API call with the determined scope
    get(`/Emissions/get_dropdown_optoins/?scope=${value}`)
      .then((res: any) => {
        if (res.response.status === true) {
          if (value === 'Scope1') {
            // Dispatch stationary options
            dispatch(
              setStationaryOptions(
                res?.response?.data?.stationaryDropdownOptionsData || [] // Fallback to empty array if data is not available
              )
            );
            // Dispatch process options
            dispatch(
              setProcessOptions(
                res?.response?.data?.processOrFugitiveDropdownOptionsData
              )
            );
          } else {
            dispatch(
              setEnergyConsumptionOptions(
                res?.response?.data?.energyConsumptionDropdownOptionsData
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
    if (['1', '2', '3'].includes(subActiveTabKey)) {
      fetchFuelList('Scope1');
    } else if (subActiveTabKey === '4') {
      fetchFuelList('Scope2');
    }
  }, [subActiveTabKey]); // Only depend on subActiveTabKey

  const stationaryOptions = useSelector(
    (state: any) => state.stationaryOptions
  );

  const processOptions = useSelector((state: any) => state.processOptions);

  const energyConsumptionOptions = useSelector(
    (state: any) => state.energyConsumptionOptions
  );

  const [withoutTotalData, setWithoutTotalData] = useState();

  const [withoutTemp, setWithoutTemp] = useState<any[]>([]);

  const handleWithoutSubmeterGetData = () => {
    setLoading(true);
    const path = '/scope3_cat13/preload_data_for_scope1_and_scope2/';
    get(`${path}?entity_Id=${user.entity_Id}`)
      .then((res) => {
        setWithoutTemp(res?.response?.data?.inDepth_data_for_scope1_and_scope2);
        setWithoutData(res?.response?.data?.inDepth_data_for_scope1_and_scope2);
        setWithoutTopData(res?.response);
        setWithoutTotalData(
          res?.response?.data?.total_emission_emitted_by_scope1_and_scope2
        );
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
      });
    setLoading(false);
  };

  const handleFloorDataPostApi = (dataArr: any) => {
    const payload = {
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected ? facilitySelected : '',
      method_data: convertDataFloor(dataArr),
    };
    const path = '/scope3_cat13/create_cat13_floor_average_data/';
    post(path, payload)
      .then((res) => {
        //message.success('Data added successfully');
      })
      .catch((err) => {
        message.error(err?.response?.data.message);
      });
  };

  const handleWithoutDataPostApi = () => {
    const filteredData = withoutDataEntry?.filter(
      (item: any) => !item.status // If 'status' exists, it is considered pre-filled, so remove it
    );
    const payload = {
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected ? facilitySelected : '',
      leased_area: withOutleasedArea,
      building_total_area: withOutbuildingArea,
      occupancy_rate: occupancy,
      utilised_occupancy_rate: withOututilizedOccupancyRatio,
      total_emission: totalemissions,
      downstream_emission: totalDownstream,
      secondary_data: filteredData,
    };
    const path =
      'scope3_cat13/create_cat13_assets_specific_without_sub_meter_data/';
    post(path, payload).catch((err) => {
      message.error(err?.response?.data.message);
    });
  };

  const handleWithDataPostApi = () => {
    let path = '';
    let dataToSubmit = [];

    switch (subActiveTabKey) {
      case '1':
        path = '/scope3_cat13/create_cat13_stationary_combustion/';
        dataToSubmit = stationaryData;
        break;
      case '2':
        path = '/scope3_cat13/create_cat13_process/';
        dataToSubmit = processData;
        break;
      case '3':
        path = '/scope3_cat13/create_cat13_fugitive/';
        dataToSubmit = fugitiveData;
        break;
      case '4':
        path = '/scope3_cat13/create_cat13_energy/';
        dataToSubmit = energyData;
        break;
      default:
        message.error('Invalid tab selection.');
        return;
    }

    // Create an array of payloads
    const payloadArray = dataToSubmit.map((entry) => ({
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected || '',
      ...entry,
    }));

    // Send all records in one API call
    post(path, payloadArray).catch((err) => {
      message.error(err?.response?.data?.message || 'Failed to submit data');
    });
  };

  const handleSubmit = () => {
    if (activeTab === '1' && valueselected === 'without-submeter') {
      if (Number(occupancy) > 1) {
        message.error('Occupancy should not be greater than 1');
      } else if (Number(withOutleasedArea) > Number(withOutbuildingArea)) {
        message.error('leased area should not be greater than building area');
      } else {
        message.success('Data added successfully');
        handleWithoutDataPostApi();
        navigate('/scope3/category-13', {
          state: { activeTab, valueselected },
        });
      }
    }
    if (activeTab === '1' && valueselected === 'with-submeter') {
      message.success('Data added successfully');
      handleWithDataPostApi();
      navigate('/scope3/category-13', {
        state: { activeTab, valueselected, subActiveTabKey },
      });
    }
    if (activeTab === '2') {
      message.success('Data added successfully');
      handleLesseeDataPostApi();
      navigate('/scope3/category-13', {
        state: { activeTab, valueselected },
      });
    }
    if (activeTab === '3') {
      message.success('Data added successfully');
      handleFloorDataPostApi(floorData);

      navigate('/scope3/category-13', {
        state: { activeTab, valueselected },
      });
    }
  };

  const handleReset = () => {
    if (activeTab === '1') {
      if (valueselected === 'with-submeter') {
        switch (subActiveTabKey) {
          case '1':
            setStationaryData([
              {
                key: '1',
                lessee_name: '',
                fuel: '',
                UOM: '',
                qty: '',
                disclosure: null,
              },
            ]);
            break;
          case '2':
            setProcessData([
              {
                key: '1',
                lessee_name: '',
                equipmentType: '',
                gas_or_refrigerant: '',
                UOM: '',
                qty: '',
                disclosure: null,
              },
            ]);
            break;
          case '3':
            setFugitiveData([
              {
                key: '1',
                lessee_name: '',
                equipmentType: '',
                gas_or_refrigerant: '',
                UOM: '',
                qty: '',
                disclosure: null,
              },
            ]);
            break;
          case '4':
            setEnergyData([
              {
                key: '1',
                lessee_name: '',
                source_of_energy: '',
                vehicle_type: '',
                UOM: '',
                qty: '',
                disclosure: null,
              },
            ]);
            break;
          default:
            message.error('Invalid subtab selection.');
            return;
        }
        setUploadedFileName({});
        setFileList(false);
        setAttachement('');
        setSelectedFuel([]);
        setSelectedGasOne([]);
        setSelectedGasTwo([]);
        setSelectedEnergy('');
        setSelectedVehicle('');
      } else if (valueselected === 'without-submeter') {
        setWithoutDataEntry([
          {
            key: '1',
            fuel: '',
            fuel_consumed: '',
            uom: '',
            disclosure: null,
          },
        ]);
        setwithOutBuildingArea('');
        setwithOutLeasedArea('');
        setOccupancy('');
        setUploadedFileName({});
        setFileList(false);
      }
    } else if (activeTab === '3') {
      setFloorData([
        {
          key: '1',
          lessee_name: '',
          asset_category: '',
          description: '',
          quantity: '',
          uom: '',
          disclosure: null,
        },
      ]);
      setUploadedFileName({});
      setFileList(false);
    } else {
      setLesseeDataEntry([
        {
          key: '1',
          lessee_name: '',
          total_lessee_scope1_scope2_emission: '',
          total_scope1_scope2_uom: '',
          lessee_asset_area_vol_qty: '',
          lessee_asset_uom: '',
          total_lessee_asset_area_vol_qty: '',
          total_lessee_asset_uom: '',
          disclosure: null,
        },
      ]);
      setUploadedFileName({});
      setFileList(false);
    }
  };

  const handleTabChange = (key: any) => {
    handleReset();
    setActiveTab(key);
    setRadioValue(1);
    setExcelUploaded(false);
    setLeasedAssets('');
    setLesseeAssets('');
  };

  const onChange2 = (e: any) => {
    setValueSelected(e.target.value);
    setExcelUploaded(false);
  };

  const [radioValue, setRadioValue] = useState(1);

  const handleClickradio = (e: any) => {
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
      setFloorData([]);
      setLesseeDataEntry([]);
      setWithDataEntry([]);
      setLeasedArea('');
      setBuildingArea('');
      setUtilizedOccupancyRatio('');
    } else {
      setRadioValue(2);
    }
    setExcelUploaded(false);
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
          {/* {(activeTab !== '1' || valueselected !== 'without-submeter') && (
            <ButtonComponent
              hierarchy={radioValue === 1 ? 'secondary' : 'primary'}
              icon={<FileExcelFilled />}
              style={{ marginLeft: '10px', height: '35px' }}
              onClick={(e) => handleClickradio(e)}
            >
              Excel Data Entry
            </ButtonComponent>
          )} */}
        </Col>
      </>
    );
  };

  const [ExcelUploaded, setExcelUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  function initializeForm(response: any) {
    setExcelUploaded(true);
    setIsLoading(true);
    const tabNames: any = [
      'cat13_average_data_method',
      'lessee_fuel_data',
      'asset_fuel_data',
    ];

    let processedData: any;
    tabNames.forEach((tabName: any) => {
      if (response[tabName]) {
        switch (tabName) {
          case 'asset_fuel_data':
            processedData = response['asset_fuel_data'];
            setBuildingArea(response?.metadata?.building_area || '');
            setLeasedArea(response?.metadata?.leased_area || '');
            setUtilizedOccupancyRatio(response?.metadata?.arial_ratio || '');
            processedData = processedData.map((item: any) => ({
              fuel: item.fuel_type, // Rename 'fuel_type' to 'fuel'
              fuel_consumed: item.quantity,
              uom: item.UOM,
            }));
            processedData = processedData.map((item: any, index: any) => ({
              ...item,
              disclosure: '',
              key: index,
            }));

            return processedData;

          case 'lessee_fuel_data':
            processedData = response['lessee_fuel_data'];
            setLeasedAssets(response?.metadata?.physical_area || '');
            setLesseeAssets(response?.metadata?.total_area || '');
            processedData = processedData.map((item: any) => ({
              fuel: item.fuel_type, // Rename 'fuel_type' to 'fuel'
              fuel_consumed: item.quantity,
              uom: item.UOM,
            }));
            processedData = processedData.map((item: any, index: any) => ({
              ...item,
              disclosure: '',
              key: index,
            }));

            return processedData;
          case 'cat13_average_data_method':
            processedData = response['cat13_average_data_method'];
            processedData = processedData.map((item: any, index: any) => ({
              ...item,
              disclosure: '',
              key: index,
            }));

            return processedData;

          default:
            return null; // Default return case
        }
      }
    });
    setIsLoading(false);

    if (activeTab === '1' && valueselected === 'with-submeter') {
      setWithDataEntry(processedData);
    } else if (activeTab === '1' && valueselected === 'without-submeter') {
    } else if (activeTab === '2') {
      setLesseeDataEntry(processedData);
    } else if (activeTab === '3') {
      setFloorData(processedData);
    }
  }

  return (
    <>
      <PageCardComponent className={styles.pageCardStyle} loading={loading}>
        <Tabs
          defaultActiveKey={activeTab}
          onChange={(key) => handleTabChange(key)}
        >
          {/* 1st Tab with Inner Tabs for Scope 1 and Scope 2 */}
          <TabPane tab="Asset-specific Method" key="1">
            <Radio.Group onChange={onChange2} value={valueselected}>
              <Radio value="with-submeter">With Sub-Meter</Radio>
              {!ExcelUploaded && radioValue !== 2 && (
                <Radio value="without-submeter">Without Sub-Meter</Radio>
              )}
            </Radio.Group>

            {radioValue === 1 && (
              <>
                <Row gutter={16} align="middle">
                  {/* Leased Area */}
                  {valueselected === 'without-submeter' && (
                    <Col span={7}>
                      <div className={styles.container}>
                        <Col span={14}>
                          <p className={styles.label}>Leased Area (m²):</p>
                        </Col>
                        <Col span={10}>
                          <Input
                            value={withOutleasedArea}
                            onKeyDown={(e: any) => {
                              if (e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) =>
                              handleChange(e, 'withOutleasedArea')
                            }
                            type="number"
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
                            value={withOutbuildingArea}
                            onKeyDown={(e: any) => {
                              if (e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) =>
                              handleChange(e, 'withOutbuildingArea')
                            }
                            type="number"
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
                            value={occupancy}
                            onChange={(e) => handleChange(e, 'occupancy')}
                            onKeyDown={(e: any) => {
                              if (e.key === 'e' || e.key === 'E') {
                                e.preventDefault();
                              }
                            }}
                            type="number"
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
                          <p className={styles.label}>
                            Utilized Occupancy Ratio:
                          </p>
                        </Col>
                        <Col span={10}>
                          {valueselected === 'with-submeter' ? (
                            <Input
                              value={
                                utilizedOccupancyRatio === 0 ||
                                utilizedOccupancyRatio == 'Infinity'
                                  ? ''
                                  : utilizedOccupancyRatio
                              }
                              disabled
                              className={styles.input}
                            />
                          ) : (
                            <Input
                              value={
                                withOututilizedOccupancyRatio === 0 ||
                                withOututilizedOccupancyRatio == 'Infinity'
                                  ? ''
                                  : withOututilizedOccupancyRatio
                              }
                              disabled
                              className={styles.input}
                            />
                          )}
                        </Col>
                      </div>
                    </Col>
                  )}

                  {/* Total Emissions (Scope 1 + Scope 2) (Disabled) */}
                  {(user.role != 'DATA_PROVIDER' ||
                    valueselected === 'without-submeter') && (
                    <Col span={8}>
                      <div className={styles.container}>
                        <Col span={14}>
                          <p className={styles.label}>
                            Total Emissions <br /> (Scope 1 + Scope 2):
                          </p>
                        </Col>
                        <Col span={10}>
                          <Input
                            value={totalemissions.toLocaleString()}
                            disabled
                            className={styles.input}
                          />
                        </Col>
                      </div>
                    </Col>
                  )}

                  {/* Total Emissions From Downstream Leased Assets (Disabled) */}
                  {(user.role != 'DATA_PROVIDER' ||
                    valueselected === 'without-submeter') && (
                    <Col span={9}>
                      <div className={styles.container}>
                        <Col span={14}>
                          <p className={styles.label}>
                            Total Emissions from <br /> Downstream Leased Assets
                            (kgCO₂e):
                          </p>
                        </Col>
                        <Col span={10}>
                          <Input
                            value={totalDownstream.toLocaleString()}
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

            {valueselected === 'without-submeter' ? (
              <>
                <Row>
                  <RadioWrapper />
                  {radioValue === 1 && (
                    <Col
                      span={12}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <ButtonComponent
                        hierarchy="secondary-gray"
                        size="xl"
                        onClick={() => handleAddRow(activeTab)}
                        disabled={disableAdd}
                      >
                        Add Row
                      </ButtonComponent>
                    </Col>
                  )}
                </Row>
                <Row className={`${styles.customPaddingTop} mt-2`}>
                  {radioValue === 1 ? (
                    <TableComponent
                      isForm={true}
                      data={withoutDataEntry}
                      columnHeader={enhancedWithoutColumns}
                      enableRowSelection={false}
                      columnCheckBoxTitle="S.No."
                      columnCheckBoxDataAttribute="key"
                      isRowExpand={false}
                      showCountForCheckBox={true}
                      showOnlyCount={true}
                    />
                  ) : (
                    <CatThirteenExcelEntry
                      loading={false}
                      ExcelUploaded={ExcelUploaded}
                      type="Cat13_Asset_Specific_Without_Sub_meter"
                    />
                  )}
                </Row>
              </>
            ) : (
              <>
                <Row className="mt-3">
                  <RadioWrapper />
                  {radioValue === 1 && (
                    <Col
                      span={12}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <ButtonComponent
                        hierarchy="secondary-gray"
                        size="xl"
                        onClick={() => handleAddRow(activeTab)}
                        disabled={disableAdd}
                      >
                        Add Row
                      </ButtonComponent>
                    </Col>
                  )}
                </Row>

                <Row className={`${styles.customPaddingTop}`}>
                  {radioValue === 1 ? (
                    <>
                      <Col span={24}>
                        <Tabs
                          className="mt-3"
                          defaultActiveKey={subActiveTabKey}
                          onChange={(key) => {
                            handleReset();
                            setSubActiveTabKey(key);
                            const selectedTab = tabData.find(
                              (tab) => tab.key === key
                            );
                            if (selectedTab) {
                              setSubActiveTabTitle(selectedTab.title);
                            }
                          }}
                        >
                          {tabData.map((tab) => (
                            <TabPane tab={tab.title} key={tab.key}>
                              <Col span={24}>
                                <TableComponent
                                  isForm={true}
                                  data={
                                    subActiveTabKey === '1'
                                      ? stationaryData
                                      : subActiveTabKey === '2'
                                        ? processData
                                        : subActiveTabKey === '3'
                                          ? fugitiveData
                                          : subActiveTabKey === '4'
                                            ? energyData
                                            : [] // Default case if no subtab matches
                                  }
                                  columnHeader={
                                    columnsByTabKey[
                                      tab.key as keyof typeof columnsByTabKey
                                    ]
                                  }
                                  enableRowSelection={false}
                                  columnCheckBoxTitle="S.No."
                                  columnCheckBoxDataAttribute="key"
                                  isRowExpand={false}
                                  showCountForCheckBox={true}
                                  showOnlyCount={true}
                                />
                              </Col>
                            </TabPane>
                          ))}
                        </Tabs>
                      </Col>
                    </>
                  ) : (
                    <CatThirteenExcelEntry
                      loading={false}
                      ExcelUploaded={ExcelUploaded}
                      type="Cat13_Asset_Specific_With _Sub_meter"
                      emissionType="Asset Specific With Submeter"
                      initializeForm={initializeForm}
                      tabcolumns={enhancedWithColumns}
                      datasources={withDataEntry}
                      activeTab={activeTab}
                      handleSubmit={handleSubmit}
                      disableSubmit={disableSubmit}
                      cat13Lesse={true}
                      valueselected={valueselected}
                      leasedArea={leasedArea}
                      buildingArea={buildingArea}
                      utilizedOccupancyRatio={utilizedOccupancyRatio}
                    />
                  )}
                </Row>
              </>
            )}
          </TabPane>

          {/* 2nd Tab with Single Content */}
          <TabPane tab="Lessee-specific Method" key="2">
            <Row>
              <RadioWrapper />
              {radioValue === 1 && (
                <Col
                  span={12}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '10px',
                  }}
                >
                  <ButtonComponent
                    hierarchy="secondary-gray"
                    size="xl"
                    onClick={() => handleAddRow(activeTab)}
                    disabled={disableAdd}
                  >
                    Add Row
                  </ButtonComponent>
                </Col>
              )}
            </Row>
            <Row className={`${styles.customPaddingTop} mt-2`}>
              {radioValue === 1 ? (
                <TableComponent
                  isForm={true}
                  data={lesseeDataEntry}
                  columnHeader={enhancedLesseeColumns}
                  enableRowSelection={false}
                  columnCheckBoxTitle="S.No."
                  columnCheckBoxDataAttribute="key"
                  isRowExpand={false}
                  showCountForCheckBox={true}
                  showOnlyCount={true}
                />
              ) : (
                <CatThirteenExcelEntry
                  loading={false}
                  ExcelUploaded={ExcelUploaded}
                  type="Cat13_Lessee_Specific"
                  emissionType="Lessee Specific"
                  initializeForm={initializeForm}
                  tabcolumns={enhancedLesseeColumns}
                  datasources={lesseeDataEntry}
                  activeTab={activeTab}
                  handleSubmit={handleSubmit}
                  disableSubmit={disableSubmit}
                  cat13Lesse={true}
                  lesseeAssets={lesseeAssets}
                  leasedAssets={leasedAssets}
                />
              )}
            </Row>
          </TabPane>

          {/* 3rd Tab with Inner Tabs for Floor and Asset */}
          <TabPane tab="Average-data Method" key="3">
            <Row>
              <RadioWrapper />
              {radioValue === 1 && (
                <Col
                  span={12}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <ButtonComponent
                    hierarchy="secondary-gray"
                    size="xl"
                    onClick={() => handleAddRow(activeTab)}
                    disabled={disableAdd}
                  >
                    Add Row
                  </ButtonComponent>
                </Col>
              )}
            </Row>
            <Row className={`${styles.customPaddingTop} mt-2`}>
              {radioValue === 1 ? (
                <TableComponent
                  isForm={true}
                  data={floorData}
                  columnHeader={enhancedFloorColumns}
                  enableRowSelection={false}
                  columnCheckBoxTitle="S.No."
                  columnCheckBoxDataAttribute="key"
                  isRowExpand={false}
                  showCountForCheckBox={true}
                  showOnlyCount={true}
                />
              ) : (
                <CatThirteenExcelEntry
                  loading={false}
                  ExcelUploaded={ExcelUploaded}
                  type="Cat13_Average_Data"
                  emissionType="Cat 13 Average Data Method"
                  initializeForm={initializeForm}
                  tabcolumns={enhancedFloorColumns}
                  datasources={floorData}
                  activeTab={activeTab}
                  handleSubmit={handleSubmit}
                  disableSubmit={disableSubmit}
                />
              )}
            </Row>
          </TabPane>
        </Tabs>
        {radioValue === 1 && (
          <Row justify="end" className={styles.customPaddingTop}>
            <Col>
              <ButtonComponent
                hierarchy="secondary"
                style={{ marginRight: '15px' }}
                size="xl"
                onClick={handleReset}
              >
                Reset
              </ButtonComponent>
              <ButtonComponent
                hierarchy="primary"
                size="xl"
                disabled={disableSubmit}
                onClick={handleSubmit}
              >
                Submit
              </ButtonComponent>
            </Col>
          </Row>
        )}
      </PageCardComponent>
    </>
  );
}

export default CatThirteenForm;
