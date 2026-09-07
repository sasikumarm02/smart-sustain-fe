import { useNavigate } from 'react-router-dom';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import Styles from './Peerbench.module.scss';
import { Row, Col, Image } from 'antd';
import EditIcon from '../../assets/Svg/EditIcon';
import { useEffect, useState } from 'react';
import { get } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

function EsgPeerManage() {
  const navigate = useNavigate();

  const [manageData, setManageData] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

  const manageGetData = async () => {
    try {
      const res = await get(`/peerBenchmarking/get_data_points/`);
      if (!isEmpty(res?.response) && res?.response) {
        const results = res?.response?.data;
        setManageData(results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    manageGetData();
  }, []);

  const toggleExpand = (key: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const columns = [
    {
      title: 'Benchmark Topic',
      dataIndex: 'benchmarking_topic',
      key: 'benchmarking_topic',
      filters: manageData
        ?.map((entry: any) => entry.benchmarking_topic)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.benchmarking_topic?.indexOf(value) === 0,
      filteredValue: filteredInfo?.benchmarking_topic || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Data Point',
      dataIndex: 'data_point',
      key: 'data_point',
      filters: manageData
        ?.map((entry: any) => entry.data_point)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.data_point?.indexOf(value) === 0,
      filteredValue: filteredInfo?.data_point || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Definition',
      dataIndex: 'defination',
      key: 'defination',
      render: (text: string, record: any) => {
        const uniqueKey = record.id;
        const isExpanded = expandedRows[uniqueKey] || false;

        if (text.length <= 150) {
          return text;
        }

        const truncatedText = text.slice(0, 150) + '...';

        return (
          <>
            {isExpanded ? text : truncatedText}
            <span
              onClick={() => toggleExpand(uniqueKey)}
              className={Styles.viewMore}
            >
              {isExpanded ? 'View Less' : 'View More'}
            </span>
          </>
        );
      },
    },
    {
      title: 'UOM',
      dataIndex: 'units',
      key: 'units',
    },
    {
      title: 'GRI Disclosure',
      dataIndex: 'gri_disclosure',
      key: 'gri_disclosure',
      filters: manageData
        ?.map((entry: any) => entry.gri_disclosure)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.gri_disclosure?.indexOf(value) === 0,
      filteredValue: filteredInfo?.gri_disclosure || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <EditIcon onClick={() => handleEdit(record)} />
      ),
    },
  ];

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

  useEffect(() => {
    resetFilters();
  }, [window.location.href]);

  const handleEdit = (record: any) => {
    navigate('/peer-benchmarking-add', { state: { record } });
  };

  return (
    <>
      <PageCardComponent className={Styles.pageCardPaddingPeermanage}>
        <Row justify="end" align="middle">
          <ButtonComponent onClick={() => navigate('/peer-benchmarking-add')}>
            Add Row +
          </ButtonComponent>
        </Row>
        <Row className={Styles.TableComponentPeerManage}>
          <TableComponent
            onchange={handleChange}
            postFilterRecords={postFilterRecords}
            data={manageData}
            columnHeader={columns}
            enableRowSelection={false}
            columnCheckBoxTitle="S.No."
            columnCheckBoxDataAttribute="key"
            isRowExpand={false}
            showCountForCheckBox={true}
            showOnlyCount={true}
          />
        </Row>
      </PageCardComponent>
    </>
  );
}

export default EsgPeerManage;
