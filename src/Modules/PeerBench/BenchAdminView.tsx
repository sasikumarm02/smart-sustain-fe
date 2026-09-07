import { Row, Col, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import Styles from './Peerbench.module.scss';
import { PageCardComponent, TableComponent } from '../../DesignLibrary';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import NoDataImage from '../../assets/Svg/NoData';
import { formatNumberUS } from '../../Utils/Strings';
import PeerExcel from './PeerExcel';
import PeerPdf from './PeerPdf';
import { isEmpty } from '../../Utils/isEmpty';
import moment from 'moment';

function BenchAdminView() {
  const { user } = useAuth();
  const { Option } = Select;
  const [peerBenchData, setPeerBenchData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  const currentDate = new Date().toJSON().slice(0, 10);

  const startYear = moment(currentDate, 'YYYY-MM-DD').format('YYYY');
  const endYear = moment(currentDate, 'YYYY-MM-DD').add(1, 'y').format('YYYY');

  const FYear = `${startYear} - ${endYear.slice(0, 2)}${endYear.slice(2)}`;

  const selectedFy = `FY${FYear}`;

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
  };

  const toggleExpand = (key: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const benchGetData = async (year: string | null = null) => {
    setIsLoading(true);
    try {
      const formattedYear = selectedYear ? selectedYear.replace('FY', '') : '';
      const res = await get(
        `/peerBenchmarking/get_comparison_values/?entity_Id=${user?.entity_Id}${
          formattedYear ? `&financial_year=${formattedYear}` : ''
        }`
      );
      if (res?.response && !isEmpty(res.response)) {
        const response = res.response.map((ele: any, index: any) => ({
          id: index + 1,
          benchmarking_topic: ele.benchmarking_topic,
          data_point: ele.data_point,
          units: ele.units,
          gri_disclosure: ele.gri_disclosure,
          data: ele.data,
        }));
        setPeerBenchData(response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  const currentCompany = user.entity_name;

  const setDynamicColumns = (data: any[]) => {
    const uniqueCompanies: string[] = [];
    const companySet: Set<string> = new Set<string>();

    data.forEach((item) => {
      item.data.forEach((dataItem: any) => {
        if (!companySet.has(dataItem.company)) {
          companySet.add(dataItem.company);
          uniqueCompanies.push(dataItem.company);
        }
      });
    });

    const sortedCompanies = [...uniqueCompanies].sort((a, b) => {
      if (a === currentCompany) return -1; // Place currentCompany first
      if (b === currentCompany) return 1;
      return 0; // Preserve original order for others
    });

    const companyColumns = sortedCompanies.map((company) => ({
      title: company,
      dataIndex: company, // Align dataIndex with the key in tableData
      key: company,
      align: 'right',
      render: (text: string, record: any) => {
        if (text === 'NA' || typeof text === 'number') {
          return formatNumberUS(text);
        }

        if (typeof text === 'string' && text.length > 20) {
          const truncatedText = text.slice(0, 20) + '...';
          const isExpanded = expandedRows[record.uniqueId] || false;
          return (
            <>
              {isExpanded ? text : truncatedText}
              <span
                onClick={() => toggleExpand(record.uniqueId)}
                className={Styles.viewMore}
              >
                {isExpanded ? 'View Less' : 'View More'}
              </span>
            </>
          );
        }

        return formatNumberUS(text);
      },
    }));

    setColumns(companyColumns);
  };

  const handleYearChange = (year: string) => {
    const formattedYear = year ? year.replace('FY', '') : '';
    setSelectedYear(formattedYear);
  };

  const staticColumns = [
    {
      title: 'Topic',
      dataIndex: 'benchmarking_topic',
      key: 'benchmarking_topic',
      filters: peerBenchData
        .map((entry) => entry.benchmarking_topic)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((filterValue) => ({ text: filterValue, value: filterValue })),
      filteredValue: filteredInfo.benchmarking_topic || null,
      onFilter: (value: any, record: any) =>
        record.benchmarking_topic.includes(value as string),
      filterSearch: true,
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'GRI Disclosure',
      dataIndex: 'gri_disclosure',
      key: 'gri_disclosure',
      filters: peerBenchData
        .map((entry) => entry.gri_disclosure)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((filterValue) => ({ text: filterValue, value: filterValue })),
      filteredValue: filteredInfo.gri_disclosure || null,
      onFilter: (value: any, record: any) =>
        record.gri_disclosure.includes(value),
      filterSearch: true,
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'Data Point',
      dataIndex: 'data_point',
      key: 'data_point',
      filters: peerBenchData
        .map((entry) => entry.data_point)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((filterValue) => ({ text: filterValue, value: filterValue })),
      filteredValue: filteredInfo.data_point || null,
      onFilter: (value: any, record: any) => record.data_point.includes(value),
      filterSearch: true,
      render: (text: any) => <span>{text}</span>,
    },
    {
      title: 'UOM',
      dataIndex: 'units',
      key: 'units',
    },
  ];

  const finalCols = [...staticColumns, ...columns];
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

  useEffect(() => {
    benchGetData();
    resetFilters();
  }, [selectedYear]);

  useEffect(() => {
    setDynamicColumns(peerBenchData);
  }, [peerBenchData, expandedRows]);

  const tableData = peerBenchData
    .map((item) => {
      const rowData: any = {
        benchmarking_topic: item.benchmarking_topic,
        data_point: item.data_point,
        gri_disclosure: item.gri_disclosure,
        units: item.units,
      };

      item.data.forEach((companyData: any) => {
        rowData[companyData.company] = companyData.value;
      });

      return rowData;
    })
    .sort((a, b) => {
      // Sort to ensure rows related to the current company appear first
      const aCompanyData = a[currentCompany];
      const bCompanyData = b[currentCompany];
      if (aCompanyData !== undefined && bCompanyData === undefined) return -1;
      if (aCompanyData === undefined && bCompanyData !== undefined) return 1;
      return 0;
    });

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

  return (
    <>
      <Spin spinning={isLoading}>
        {tableData.length < 0 ? (
          <Row justify="center" className="mt-4 mb-4">
            <Col span={22}>
              <PageCardComponent>
                <div className="text-center p-4">
                  <NoDataImage />
                </div>
                <p className={Styles.dataNotFoundDesc}>
                  Please visit the ESG Performance Comparison and select the
                  companies & Data points to view the report here.
                </p>
              </PageCardComponent>
            </Col>
          </Row>
        ) : (
          <PageCardComponent className={Styles.pageCardPadding}>
            <Row>
              {/* Reporting Period Dropdown */}
              <Col md={9} lg={15}>
                <p className={Styles.subtitle}>Select Reporting Period</p>
                <Select
                  style={{ width: '200px', height: '50px' }}
                  onChange={handleYearChange}
                  value={selectedYear ? `FY${selectedYear}` : selectedFy}
                >
                  {financialYears.map((year) => (
                    <Option key={year.backendValue} value={year.backendValue}>
                      {year.displayValue}
                    </Option>
                  ))}
                </Select>
              </Col>

              {/* Rows and PDF side by side */}
              <Col md={15} lg={9} className={Styles.rowsDiv}>
                <div className="d-flex justify-content-end align-items-end gap-3">
                  <div className="d-flex align-items-center">
                    <p
                      className={Styles.rowsHeading}
                      style={{ marginBottom: 0, marginRight: '8px' }}
                    >
                      Rows:
                    </p>
                    <Select
                      className={Styles.rowsSelect}
                      onChange={handlePageSizeChange}
                    >
                      <Option value={20}>20</Option>
                      <Option value={50}>50</Option>
                      <Option value={100}>100</Option>
                    </Select>
                  </div>
                  <PeerPdf selectedYear={selectedYear} />
                  {/* <PeerExcel selectedYear={selectedYear} /> */}
                </div>
              </Col>
            </Row>

            <Row className="mt-2 mb-3">
              <TableComponent
                onchange={handleChange}
                postFilterRecords={postFilterRecords}
                data={tableData}
                columnHeader={finalCols}
                enableRowSelection={false}
                pageSize={pageSize}
                noText={`Please visit the ESG Performance Comparison and select the
                companies & Data points to view the report here.`}
              />
            </Row>
          </PageCardComponent>
        )}
      </Spin>
    </>
  );
}

export default BenchAdminView;
