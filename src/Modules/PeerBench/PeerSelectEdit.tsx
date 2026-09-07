import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { Col, Row, Select, Checkbox, message } from 'antd';
import { formatNumberUS } from '../../Utils/Strings';
import Styles from './Peerbench.module.scss';
import { useEffect, useState } from 'react';
import { isEmpty } from '../../Utils/isEmpty';
import { get, post } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import ExcelComponent from '../../DesignLibrary/ExcelComponent';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

function PeerSelectEdit() {
  const { Option } = Select;
  const { user } = useAuth();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedMetricsGroup, setSelectedMetricsGroup] = useState([]);
  const [peerSelectData, setPeerSelectData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [excelHeaders, setExcelHeaders] = useState<any[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isColumnVisible, setIsColumnVisible] = useState(true);

  const industryDropdownData = async () => {
    try {
      const res = await get(
        `/peerBenchmarking/get_companies_dropdown/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(res?.response) && res?.response) {
        const companies = res?.response?.companies || [];
        // setSelectedCompanies(companies);
        setCompanyOptions(companies);
      }
    } catch (error) {
      console.error('Error fetching company options:', error);
    }
  };

  useEffect(() => {
    industryDropdownData();
  }, []);

  const handleNext = async () => {
    // Filter out `currentCompany` from the selectedCompanies array
    const filteredCompanies = selectedCompanies.filter(
      (company) => company !== currentCompany
    );

    // Check if the filtered companies exceed the limit
    if (filteredCompanies.length > 4) {
      message.warning('You can only select a maximum of 4 companies.');
      return;
    }

    const companiesToSend = Array.from(
      new Set([...selectedCompanies, currentCompany])
    );

    const payload = {
      entity_Id: user?.entity_Id,
      selected_companies: companiesToSend,
      selected_data_points: selectedMetricsGroup,
    };

    try {
      const resData = await post(
        `/peerBenchmarking/get_finance_values/`,
        payload
      );

      if (resData?.response) {
        message.success(resData?.message);

        const { companies, data_points, uom, data } = resData.response;

        const serialNumberColumn = {
          title: 'S.No',
          children: [
            {
              title: '',
              dataIndex: 'serialNumber',
              key: 'serialNumber',
              render: (_: any, __: any, index: any) => index + 1,
            },
          ],
        };

        const companyColumn = {
          title: 'Company',
          children: [
            {
              title: '',
              dataIndex: 'company',
              key: 'company',
            },
          ],
        };

        const dynamicColumns = data_points.map((point: any, index: any) => ({
          title: point,
          children: [
            {
              title: uom[index] || 'N/A',
              dataIndex: point,
              key: point,
              align: 'right',
              render: (value: any) =>
                value !== 'NA' ? formatNumberUS(value) : 'NA',
            },
          ],
        }));

        // Set table columns
        setColumns([serialNumberColumn, companyColumn, ...dynamicColumns]);

        // Set table data
        const formattedData = companies.map((company: any, index: any) => ({
          key: index,
          company,
          ...data[index],
          serialNumber: index + 1,
        }));
        setPeerSelectData(formattedData);

        // Set Excel data after table data is ready
        const headers = [
          'S.No',
          'Company',
          ...data_points.map(
            (point: any, index: any) => `${point} (${uom[index] || 'N/A'})`
          ),
        ];

        const dataForExcel = companies.map((company: any, index: any) => ({
          'S.No': index + 1,
          Company: company,
          ...data_points.reduce((acc: any, point: any) => {
            const value = data[index][point];
            acc[`${point} (${uom[data_points.indexOf(point)] || 'N/A'})`] =
              value !== 'NA' ? formatNumberUS(value) : 'NA'; // Apply formatting for non-NA values
            return acc;
          }, {}),
        }));

        setExcelHeaders(headers);
        setExcelData(dataForExcel);
        setIsTableVisible(true);
      } else {
        message.error('Failed to fetch data');
      }
    } catch (error) {
      message.error('Error fetching data.');
    }
  };

  const metricOptions = [
    { label: 'Revenue', value: 'Revenue' },
    { label: 'Market Capitalisation', value: 'Market Capitalisation' },
    { label: 'Operating Income', value: 'Operating Income' },
    {
      label: 'Employee Wages and Benefits',
      value: 'Employee Wages and Benefits',
    },
    { label: 'Retirement Benefits', value: 'Retirement Benefits' },
    {
      label: 'Payments to Providers of Capital',
      value: 'Payments to Providers of Capital',
    },
    { label: 'Payments to Government', value: 'Payments to Government' },
    {
      label:
        'Total Monetary Value of Financial Assistance Received by the Organisation from any Government',
      value:
        'Total Monetary Value of Financial Assistance Received by the Organisation from any Government',
    },
    { label: 'Community Investments', value: 'Community Investments' },
    { label: 'Headcount', value: 'Headcount' },
  ];

  const handleMetricChangeGroup = (checkedValues: any) => {
    setSelectedMetricsGroup(checkedValues);
  };

  const toggleColumnVisibility = () => {
    setIsColumnVisible(!isColumnVisible);
  };

  const resetSelections = () => {
    setSelectedCompanies([]);
    setSelectedMetricsGroup([]);
    setPeerSelectData([]);
    setColumns([]);
    setIsTableVisible(false);
  };

  const currentCompany = user.entity_name;

  return (
    <>
      <PageCardComponent className={Styles.pageCardPadding}>
        <Row gutter={[16, 16]}>
          {isColumnVisible && (
            <Col span={7}>
              <p className={Styles.subtitle}>Select Companies</p>
              <Select
                mode="multiple"
                value={selectedCompanies.filter(
                  (company) => company !== currentCompany
                )}
                onChange={setSelectedCompanies}
                placeholder="Select companies..."
                style={{ width: '100%' }}
                className={Styles.selectItemTwo}
              >
                {companyOptions
                  .filter((company: any) => company !== currentCompany) // Exclude currentCompany
                  .map((company: any) => (
                    <Option key={company} value={company}>
                      {company}
                    </Option>
                  ))}
              </Select>

              <Checkbox.Group
                options={metricOptions}
                value={selectedMetricsGroup}
                onChange={handleMetricChangeGroup}
                className={Styles.checkboxGroup}
                style={{ marginTop: '20px' }}
              />
            </Col>
          )}

          <Col span={1}>
            {isColumnVisible ? (
              <>
                <LeftOutlined
                  onClick={toggleColumnVisibility}
                  className={Styles.leftOutlined}
                />
              </>
            ) : (
              <RightOutlined onClick={toggleColumnVisibility} />
            )}
          </Col>

          <Col span={1}>
            {isColumnVisible ? (
              <>
                <div style={{ borderLeft: '2px solid #ccc', height: '110%' }} />
              </>
            ) : (
              ''
            )}
          </Col>

          <Col span={isColumnVisible ? 15 : 24}>
            {/* <Row
              justify="end"
              className={isColumnVisible ? 'mt-2' : ''}
              style={{ marginTop: isColumnVisible ? '' : '-20px' }}
            >
              <p className={Styles.freportMargin}>Financial Metrics Report</p>
              <ExcelComponent
                filename="Financial_Metrics_Report"
                sheet="Financial Metrics Report"
                headers={excelHeaders}
                data={excelData}
                isTableVisible={isTableVisible}
              />
            </Row> */}

            <Row className="mt-5 peerTable">
              <TableComponent
                data={peerSelectData}
                columnHeader={columns}
                enableRowSelection={false}
                noText={`"Empower your ESG strategy" Select companies and categories to unlock peer benchmarking insights.`}
              />
            </Row>
          </Col>
        </Row>
        <Row justify="end" className="mt-2">
          {isColumnVisible ? (
            <>
              <ButtonComponent
                onClick={resetSelections}
                className="mx-2"
                hierarchy="tertiary"
                size="xl"
              >
                Reset
              </ButtonComponent>
              <ButtonComponent onClick={handleNext}>
                Generate Report
              </ButtonComponent>
            </>
          ) : (
            ''
          )}
        </Row>
      </PageCardComponent>
    </>
  );
}

export default PeerSelectEdit;
