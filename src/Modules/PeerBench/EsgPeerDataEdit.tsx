import { useEffect, useState } from 'react';
import { Row, Col, Select, DatePicker, message } from 'antd';
import {
  ButtonComponent,
  InputComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import Styles from './Peerbench.module.scss';
import { CloseCircleOutlined } from '@ant-design/icons';
import { get, post, put } from '../../Services';
import { Dayjs } from 'dayjs';
import type { DatePickerProps } from 'antd';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileExcelFilled, FileWordFilled } from '@ant-design/icons';
import CustomDownload from '../../Components/FileHanddle/customDownload';
import CustomUpload from '../../Components/FileHanddle/customUpload';
import { isEmpty } from '../../Utils/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { setPeerDataEdit } from '../../Redux/Actions';

function EsgPeerDataEdit() {
  const dispatch = useDispatch();
  const editmode = useSelector((state: any) => state.peereditData);
  const { Option } = Select;
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [industry, setIndustry] = useState('');
  const [company, setCompany] = useState('');
  const [id, setId] = useState('');
  const [editAdd, setEditAdd] = useState(false);
  const [selectedDataPoints, setSelectedDataPoints] = useState<any[]>([]);
  const [financialPrefilled, setFinancialPrefilled] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [radioValue, setRadioValue] = useState(1);
  const [tableData, setTableData] = useState([
    {
      key: 1,
      id: 1,
      data_point: '',
      units: '',
      value: '',
      edit_id: '',
      editAdd: true,
    },
  ]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [dataPointOptions, setDataPointOptions] = useState([]);

  const industryDropdownData = async () => {
    try {
      const res = await get(`/peerBenchmarking/get_industry_dropdown/`);
      if (!isEmpty(res?.response) && res?.response) {
        const industry = res?.response?.industries || [];
        setIndustryOptions(industry);
      }
    } catch (error) {
      console.error('Error fetching industry options:', error);
    }
  };

  useEffect(() => {
    industryDropdownData();
  }, []);

  const dataPointDropdownData = async () => {
    try {
      const res = await get(`/peerBenchmarking/data_points_dropdown/`);
      if (!isEmpty(res?.response) && res?.response) {
        const dataPoint = res?.response?.data_points || [];
        setDataPointOptions(dataPoint);
      }
    } catch (error) {
      console.error('Error fetching industry options:', error);
    }
  };

  useEffect(() => {
    dataPointDropdownData();
  }, []);

  const industryCompany = async () => {
    const formattedYear = selectedYear
      ? selectedYear.replace('FY', '').split(' - ').join(' - ') // Process `selectedYear` if it's set
      : financialPrefilled
        ? financialPrefilled
            .replace('FY', '')
            .split(' - ')
            .map((year, index, years) => {
              // Correctly handle the end year for prefilled values
              return index === 1 && year.length === 2
                ? `${years[0].slice(0, 2)}${year}`
                : year;
            })
            .join(' - ')
        : '';
    try {
      // Use template literals to append both industry and company as path parameters
      const res = await get(
        `/peerBenchmarking/get_filtered_peer_benchmarking_values/?industry=${industry}&&company=${company}&&financial_year=${formattedYear}`
      );

      if (!isEmpty(res?.response) && res?.response) {
        const industryCompany = res?.response?.data || [];
        const formatted = industryCompany.map((item: any, index: number) => ({
          ...item,
          key: item.key || index + 1,
          id: item.id || index + 1,
        }));
        setTableData(formatted);
      }
    } catch (error) {
      console.error('Error fetching industry options:', error);
    }
  };

  useEffect(() => {
    if (financialPrefilled) {
      industryCompany(); // Call the function only when the condition is true
    }
  }, [financialPrefilled]); // Dependencies to watch

  useEffect(() => {
    if (state && state.record) {
      setId(state.record.id);
      setIndustry(state.record.industry);
      setCompany(state.record.company);
      setFinancialPrefilled(state.record.financial_year);
      setTableData(
        state.values.map((value: any, index: any) => ({
          key: index + 1,
          id: index + 1,
          data_point: value.data_point,
          edit_id: value.edit_id,
          units: value.units,
          value: value.value,
          editAdd: false,
        }))
      );
    }
  }, [state]);

  useEffect(() => {
    dispatch(setPeerDataEdit(financialPrefilled));
  }, [financialPrefilled]);

  const handleIndustryChange = (value: any) => {
    setIndustry(value);
  };

  const handleCompanyChange = (e: any) => {
    setCompany(e.target.value);
  };

  const handleInputChange = async (key: any, field: any, value: any) => {
    let newData = tableData.map((item) => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });

    if (field === 'data_point') {
      try {
        const res = await get(
          `/peerBenchmarking/data_points_dropdown/?data_point=${value}`
        );
        if (!isEmpty(res?.response) && res?.response) {
          const units = res?.response?.units?.[0] || ''; // Assuming only one unit is returned
          newData = newData.map((item) => {
            if (item.key === key) {
              return { ...item, units };
            }
            return item;
          });
        }
      } catch (error) {
        console.error('Error fetching UOM:', error);
      }
    }

    setTableData(newData);
  };

  const addRow = () => {
    const newRow = {
      key: tableData.length + 1, // or another unique identifier
      id: tableData.length + 1,
      data_point: '',
      units: '',
      value: '',
      edit_id: '',
      editAdd: true,
    };
    setEditAdd(true);
    setTableData([...tableData, newRow]);
  };

  const handleDelete = (key: any) => {
    const newData = tableData.filter((item) => item.key !== key);
    const reKeyedData = newData.map((item, index) => ({
      ...item,
      key: index + 1,
      id: index + 1,
    }));
    setTableData(reKeyedData);
  };

  const [filteredDataPointOptions, setFilteredDataPointOptions] = useState([]);

  const handleSelectChange = (key: any, value: any) => {
    const selectDataPoint = [...selectedDataPoints, value];
    setSelectedDataPoints(selectDataPoint);
    const updatedata = dataPointOptions.filter(
      (dataPoint) => !selectDataPoint.includes(dataPoint)
    );
    setFilteredDataPointOptions(updatedata);
    handleInputChange(key, 'data_point', value);
  };

  useEffect(() => {
    const selecteddata = tableData
      .map((item: any) => item.data_point) // Extract data_point
      .filter((dataPoint: any) => dataPoint !== '');
    if (selecteddata.length > 0) {
      setSelectedDataPoints(selecteddata);
      const updatedata = dataPointOptions.filter(
        (dataPoint) => !selecteddata.includes(dataPoint)
      );
      setFilteredDataPointOptions(updatedata);
    } else {
      setFilteredDataPointOptions(dataPointOptions);
    }
  }, [dataPointOptions]);

  const columns = [
    {
      title: 'Data Point',
      dataIndex: 'data_point',
      key: 'data_point',
      width: '400px',
      render: (text: any, record: any) =>
        // Render Select dropdown if not prefilled, otherwise text
        financialPrefilled && !record?.editAdd ? (
          <span>{text}</span>
        ) : (
          <Select
            placeholder="Select Data Point"
            value={text || undefined}
            onChange={(value) => handleSelectChange(record.key, value)}
            className={Styles.formSelect}
          >
            {filteredDataPointOptions.map((dataPoint) => (
              <Option key={dataPoint} value={dataPoint}>
                {dataPoint}
              </Option>
            ))}
          </Select>
        ),
    },
    {
      title: 'UOM',
      dataIndex: 'units',
      key: 'units',
      width: '300px',
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '220px',
      render: (text: any, record: any) => (
        <InputComponent
          placeHolder="Enter value"
          className={Styles.formSelect}
          type="text"
          value={text}
          onChange={(e: any) =>
            handleInputChange(record.key, 'value', e.target.value)
          }
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '80px',
      render: (text: any, record: any) => (
        <CloseCircleOutlined
          className="text-danger user-select-all"
          onClick={() => handleDelete(record.key)}
          style={{ cursor: 'pointer', marginLeft: '20px' }}
        />
      ),
    },
  ];

  const generateFinancialYears = () => {
    const years = [];
    for (let startYear = 2000; startYear <= 2099; startYear++) {
      const nextYear = startYear + 1;
      years.push({
        displayValue: `FY ${startYear}`, // Value shown in the dropdown
        backendValue: `FY${startYear} - ${nextYear}`, // Value sent to the backend
      });
    }
    return years;
  };

  const financialYears = generateFinancialYears();

  const getCurrentFinancialYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `FY${currentYear} - ${nextYear}`;
  };

  useEffect(() => {
    // Set the initial selected year to the current financial year
    setSelectedYear(getCurrentFinancialYear());
  }, []);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleFinancialYearChange = (year: string) => {
    setFinancialPrefilled(year);
    setSelectedYear(year);
  };

  const handleSubmit = async () => {
    const formattedYear = selectedYear ? selectedYear.replace('FY', '') : '';

    const payload = {
      financial_year: formattedYear,
      Industry: industry,
      Company: company,
      Values: tableData.map((item) => ({
        'Data Point': item.data_point,
        UOM: item.units,
        Value: item.value,
      })),
    };

    try {
      const resData = await post(
        '/peerBenchmarking/peer_benchmarking_values/',
        payload
      );
      message.success(resData?.message);
      navigate(`/ESG-peer-data`);
    } catch (error: any) {
      console.error('Error submitting data:', error);
      message.warning(error.response?.data?.message);
    }
  };

  const handleUpdate = async () => {
    const formattedYear = financialPrefilled
      ? financialPrefilled
          .replace('FY', '')
          .split(' - ')
          .map((year, index, years) => {
            // For the end year, use the first two digits from the start year
            return index === 1 && year.length === 2
              ? `${years[0].slice(0, 2)}${year}` // Prepend first two digits of start year
              : year;
          })
          .join(' - ')
      : '';

    const payload = {
      id: id,
      financial_year: formattedYear,
      Industry: industry,
      Company: company,
      Values: tableData.map((item) => ({
        'Data Point': item.data_point,
        EditId: item.edit_id,
        UOM: item.units,
        Value: item.value,
      })),
    };

    try {
      const resData = await put(
        '/peerBenchmarking/update_peer_benchmarking_values/',
        payload
      );
      message.success(resData?.message);
      navigate(`/ESG-peer-data`);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleReset = () => {
    setIndustry('');
    setCompany('');
    setSelectedYear(null);
    setTableData([
      {
        key: 1,
        id: 1,
        data_point: '',
        units: '',
        value: '',
        edit_id: '',
        editAdd: true,
      },
    ]);
    setExcelUploaded(false); // Reset Excel uploaded state
    setloading(false);
  };

  const isFormValid = () => {
    return (
      industry &&
      company &&
      selectedYear &&
      tableData.length > 0 &&
      tableData.every(
        (item) =>
          item.data_point &&
          item.units &&
          item.value !== '' &&
          item.value !== null
      )
    );
  };

  const handleClickradio = (e: any) => {
    if (e.target.innerHTML === 'Input Data Entry') {
      setRadioValue(1);
    } else {
      setRadioValue(2);
    }
  };

  const [loading, setloading] = useState(false);
  const [ExcelUploaded, setExcelUploaded] = useState(false);

  const [fileName, setFileName] = useState<any>();
  // const [tableData, setTableData] = useState<any>();

  const initializeForm = (data: any) => {
    // Process and update tableData state with response data
    const formattedData = data.map((item: any, index: number) => ({
      key: index + 1,
      id: index + 1,
      data_point: item['Data Point'],
      units: item['UOM'],
      value: item['Value'],
      editAdd: true,
    }));
    setTableData(formattedData);
    setRadioValue(1); // Switch to "Input Data Entry" tab
  };

  return (
    <>
      <PageCardComponent className={Styles.pageCardPaddingPeermanage}>
        {!editmode ? (
          <Col span={24}>
            <ButtonComponent
              icon={<FileWordFilled />}
              hierarchy={radioValue === 1 ? 'primary' : 'secondary'}
              onClick={handleClickradio}
              style={{ height: '35px', marginBottom: '15px' }}
            >
              Input Data Entry
            </ButtonComponent>
            <ButtonComponent
              icon={<FileExcelFilled />}
              disabled={loading}
              style={{
                marginLeft: '15px',
                marginBottom: '15px',
                height: '35px',
              }}
              hierarchy={radioValue === 2 ? 'primary' : 'secondary'}
              onClick={handleClickradio}
            >
              Excel Data Entry
            </ButtonComponent>
          </Col>
        ) : (
          <Row></Row>
        )}

        {/* Show these inputs only for Input Data Entry */}
        {radioValue === 1 && (
          <Row gutter={16} justify="space-between">
            <Col span={7} className="selectInput">
              <p className={Styles.quesHeading}>Select Sector</p>
              {financialPrefilled ? (
                <InputComponent
                  className={Styles.formSelect}
                  value={industry}
                  disabled
                />
              ) : (
                <Select
                  showSearch
                  className={Styles.formSelect}
                  value={industry || undefined}
                  onChange={handleIndustryChange}
                  placeholder="Select Sector"
                >
                  {industryOptions.map((industry) => (
                    <Option key={industry} value={industry}>
                      {industry}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col span={7}>
              <p className={Styles.quesHeading}>Company</p>
              {financialPrefilled ? (
                <InputComponent
                  className={Styles.formSelect}
                  value={company}
                  disabled
                />
              ) : (
                <InputComponent
                  className={Styles.formSelect}
                  value={company}
                  onChange={handleCompanyChange}
                  placeHolder="Enter Company Name"
                />
              )}
            </Col>
            <Col span={7} className="selectInput">
              <p className={Styles.quesHeading}>Reporting Period</p>
              {financialPrefilled ? (
                <Select
                  className={Styles.formSelect}
                  onChange={handleFinancialYearChange}
                  value={financialPrefilled || undefined}
                >
                  {financialYears.map((year) => (
                    <Option key={year.backendValue} value={year.backendValue}>
                      {year.displayValue}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Select
                  placeholder="Select Reporting Period"
                  className={Styles.formSelect}
                  onChange={handleYearChange}
                  value={selectedYear || undefined}
                >
                  {financialYears.map((year) => (
                    <Option key={year.backendValue} value={year.backendValue}>
                      {year.displayValue}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
            <Col span={3} className={Styles.addrowMargin}>
              <ButtonComponent
                hierarchy="secondary-gray"
                onClick={addRow}
                className={Styles.addRowButton}
              >
                Add Row +
              </ButtonComponent>
            </Col>
          </Row>
        )}

        {radioValue === 1 ? (
          // Input Data Entry Form
          <>
            <Row className={Styles.paddingTop}>
              <Col span={24}>
                <TableComponent
                  data={tableData}
                  columnHeader={columns}
                  enableRowSelection={false}
                  columnCheckBoxTitle="S.No."
                  columnCheckBoxDataAttribute="key"
                  isRowExpand={false}
                  showCountForCheckBox={true}
                  showOnlyCount={true}
                />
              </Col>
            </Row>
            <Row justify="end" className={Styles.paddingTop}>
              {editmode ? (
                <ButtonComponent
                  onClick={handleUpdate}
                  disabled={!isFormValid()}
                >
                  Save & Submit
                </ButtonComponent>
              ) : (
                <>
                  <ButtonComponent
                    className="mx-3"
                    hierarchy="tertiary"
                    size="xl"
                    onClick={handleReset}
                  >
                    Reset
                  </ButtonComponent>
                  <ButtonComponent
                    className="ml-2"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                  >
                    Save
                  </ButtonComponent>
                </>
              )}
            </Row>
          </>
        ) : (
          // Excel Data Entry View
          <>
            <Col span={24}>
              <p
                style={{
                  textAlign: 'center',
                  fontWeight: 'normal',
                  fontSize: '20px',
                }}
              >
                Download the template file and fill up the user details in the
                given format{' '}
              </p>
            </Col>
            <Col span={24}>
              <CustomDownload type="Company_Data" />
            </Col>
            <Col span={24} className="mt-4">
              <CustomUpload
                setloading={setloading}
                loading={loading}
                emission_type="Company Data"
                peerBench={true}
                setFileName={setFileName}
                setExcelUploaded={setExcelUploaded}
                initializeForm={initializeForm}
              ></CustomUpload>
            </Col>
          </>
        )}
      </PageCardComponent>
    </>
  );
}

export default EsgPeerDataEdit;
