import { useEffect, useState } from 'react';
import { PageCardComponent } from '../../DesignLibrary';
import styles from './Audit.module.scss';
import { Col, Row, Select, DatePicker, Spin, Table } from 'antd';
import Styles from '../../DesignLibrary/TableComponent/table.module.scss';
import { useAuth } from '../../Hooks/useAuth';
import { get } from '../../Services';
import AuditExcel from './AuditExcel';
import moment from 'moment';
import PaginationPrevArrow from '../../assets/Svg/DesignLibrary/PaginationPrevArrow';
import PaginationNextArrow from '../../assets/Svg/DesignLibrary/PaginationNextArrow';
import TableFilterSelectedIcon from '../../assets/Svg/DesignLibrary/TableFilterSelectedIcon';
import TableFilterIcon from '../../assets/Svg/DesignLibrary/TableFilterIcon';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function AuditView() {
  const { user } = useAuth();
  const [loding, setLoding] = useState(false);
  const [totalRecords, setTotalRecords] = useState<any>(0);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const actionTypes = [
    { label: 'Create', value: 'POST' },
    { label: 'Update', value: 'PUT' },
    { label: 'Delete', value: 'DELETE' },
  ];
  const [dates, setDates] = useState(null);

  const handleDateChange = (dates: any) => {
    setDates(dates);
    if (dates && dates.length) {
      const formattedDates = dates.map((date: any) =>
        date.format('YYYY-MM-DD')
      );
      if (dates && dates.length === 2) {
        const [start, end] = dates;
        setStartDate(formattedDates[0]);
        setEndDate(formattedDates[1]);
      }
    }
  };

  const [dataSources, setDataSources] = useState([]);
  const [pageNumber, setPageNumber] = useState<any>(1);

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setFilteredInfo(filters);
    setPageNumber(pagination.current);
  };

  const resetFilters = () => {
    setFilteredInfo({});
  };

  useEffect(() => {
    resetFilters();
  }, [window.location.href]);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      filters: dataSources
        ?.map((entry: any) => entry.userName)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.userName?.indexOf(value) === 0,
      filteredValue: filteredInfo?.userName || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
      filterIcon: (filtered: boolean) =>
        filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      filters: dataSources
        ?.map((entry: any) => entry.role)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue.replace(/_/g, ' '), // Remove underscores in the displayed text
          value: filterValue.replace(/_/g, ' '), // Remove underscores in the filter value
        })),
      onFilter: (value: any, record: any) =>
        record?.role?.replace(/_/g, ' ').indexOf(value) === 0, // Compare with underscores removed
      filteredValue: filteredInfo?.role || null,
      filterSearch: true,
      render: (text: string) => <span>{text.replace(/_/g, ' ')}</span>, // Render with underscores removed
      filterIcon: (filtered: boolean) =>
        filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />,
    },
    {
      title: 'Timestamp',
      dataIndex: 'added_on',
      key: 'added_on',
      width: 180,
      render: (text: any) => {
        const date = moment.utc(text).local();
        let newformattedDate;
        let formattedTimeAgo;

        newformattedDate = date.format('DD-MMM-YYYY');
        formattedTimeAgo = date.format('hh:mm A');

        return (
          <p>
            {newformattedDate}
            <br />
            {formattedTimeAgo}
          </p>
        );
      },
    },
    {
      title: 'Action Type',
      dataIndex: 'method',
      key: 'method',
      width: 140,
      filters: dataSources
        ?.map((entry: any) => entry.method)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.method?.indexOf(value) === 0,
      filteredValue: filteredInfo?.method || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
      filterIcon: (filtered: boolean) =>
        filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />,
    },
    {
      title: 'Module',
      dataIndex: 'Module',
      key: 'Module',
      width: 220,
      filters: dataSources
        ?.map((entry: any) => entry.Module)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.Module?.indexOf(value) === 0,
      filteredValue: filteredInfo?.Module || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
      filterIcon: (filtered: boolean) =>
        filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: 'Response Code',
      dataIndex: 'status_code',
      key: 'status_code',
      width: 140,
    },
  ];

  const [pageSize, setPageSize] = useState<any>(10);
  const [method, setMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
  };

  const getLogs = (
    method: any,
    start_date: any,
    end_date: any,
    page_size: any,
    currentPage: any
  ) => {
    setLoding(true);
    get(
      `/log/log_list/?entity_Id=${user?.entity_Id}&method=${method}&start_date=${start_date}&end_date=${end_date}&page_size=${pageSize}&page=${currentPage}`
    )
      .then((res: any) => {
        if (res?.status === 'Success') {
          setTotalRecords(res?.response?.total_records);
          setDataSources(res?.response?.data || []);
          setLoding(false);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoding(false));
  };

  useEffect(() => {
    if (
      selectedMethod === '' &&
      startDate === '' &&
      endDate === '' &&
      pageSize === '' &&
      pageNumber === ''
    ) {
    } else {
      getLogs(
        selectedMethod === undefined ? '' : selectedMethod,
        dates !== null ? startDate : '',
        dates !== null ? endDate : '',
        pageSize,
        pageNumber
      );
    }
  }, [selectedMethod, startDate, endDate, pageSize, pageNumber, dates]);

  useEffect(() => {
    getLogs(selectedMethod, startDate, endDate, pageSize, pageNumber);
  }, []);

  const itemRender = (_: any, type: any, originalElement: any) => {
    if (type === 'prev') {
      return (
        <a className={`${Styles['paginationText']} ${Styles['prevText']}`}>
          <PaginationPrevArrow />
          Prev
        </a>
      );
    }
    if (type === 'next') {
      return (
        <a className={`${Styles['paginationText']} ${Styles['nextText']}`}>
          Next
          <PaginationNextArrow />
        </a>
      );
    }
    return originalElement;
  };

  return (
    <>
      <PageCardComponent customClass={styles.pageCardStyle}>
        <Row gutter={24}>
          <Col xl={4} lg={6} md={8} sm={8}>
            <p className={styles.labelStyle}>Action Type</p>
            <Select
              //mode="multiple"
              allowClear
              showSearch
              style={{ height: '40px' }}
              placeholder={'Select Action Type'}
              onChange={(value) => {
                setSelectedMethod(value);
                setPageNumber(1);
              }}
              value={selectedMethod}
              className={styles['action-type']}
            >
              {actionTypes.map((action) => (
                <Option key={action.value} value={action.value}>
                  {action.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xl={4} lg={6} md={8} sm={8}>
            <p className={styles.labelStyle}>Date Range</p>
            <RangePicker
              allowClear
              className={styles['date-pick']}
              value={dates}
              onChange={(e) => {
                handleDateChange(e);
                setPageNumber(1);
              }}
            />
          </Col>
          <Col
            span={13}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: '25px',
            }}
          >
            <div style={{ marginRight: '10px' }}>Audit Report</div>
            <AuditExcel />
          </Col>

          <Col span={3} className={styles.rowsDiv}>
            <p className={styles.rowsHeading}>Rows:</p>
            <Select
              className={styles.rowsSelect}
              onChange={handlePageSizeChange}
              defaultValue={10}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
          </Col>
        </Row>
        <Row className="mt-3" style={{ display: 'block' }}>
          <Spin spinning={loding}>
            <Table
              className={`${Styles['tableStyle']}`}
              rowClassName={(record, index) =>
                index % 2 === 0 ? Styles['rowOdd'] : Styles['rowEven']
              }
              columns={columns}
              dataSource={dataSources}
              pagination={{
                current: pageNumber,
                pageSize: pageSize,
                total: totalRecords,
                itemRender: itemRender,
              }}
              onChange={handleTableChange}
              scroll={{
                scrollToFirstRowOnChange: true,
              }}
            />
          </Spin>
        </Row>
      </PageCardComponent>
    </>
  );
}
