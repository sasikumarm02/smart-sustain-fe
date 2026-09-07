import { Row, Col, Select, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import Styles from './Peerbench.module.scss';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CloseCircleOutlined } from '@ant-design/icons';
import './Peerbench.module.scss';
import { get, post } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';

function BenchAdminEdit() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const [editAdd, setEditAdd] = useState(false);
  const [dataPointOptions, setDataPointOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(
    undefined
  );
  const [lastPage, setLastPage] = useState(1);
  const getLastPage = (data: any) => {
    return Math.ceil(data.length / 10);
  };

  const initialCompanies = state?.companies || [];
  const initialData = state?.data || [];
  const industry = state?.selectedIndustry || [];

  const [selectedCompanies, setSelectedCompanies] =
    useState<any[]>(initialCompanies);
  const [data, setData] = useState<any[]>(initialData);

  const { Option } = Select;

  // Function to merge initial companies with dropdown companies
  const mergeCompanyDropdownData = async () => {
    try {
      const res = await get(
        `/peerBenchmarking/get_companies_dropdown/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(res?.response) && res?.response) {
        const fetchedCompanies = res?.response?.companies || [];
        // Merge initial companies with fetched companies
        const mergedCompanies = Array.from(new Set([...initialCompanies]));
        setSelectedCompanies(mergedCompanies);
        setIndustryOptions(fetchedCompanies);
      }
    } catch (error) {
      console.error('Error fetching company options:', error);
    }
  };

  useEffect(() => {
    mergeCompanyDropdownData();
  }, []);

  const dataPointDropdownData = async () => {
    try {
      const res = await get(`/peerBenchmarking/data_points_dropdown/`);
      if (!isEmpty(res?.response) && res?.response) {
        const dataPoint = res?.response?.data_points || [];
        setDataPointOptions(dataPoint);
      }
    } catch (error) {
      console.error('Error fetching data points:', error);
    }
  };

  useEffect(() => {
    dataPointDropdownData();
  }, []);

  const topicDropdownData = async () => {
    try {
      const res = await get(`/peerBenchmarking/topic_and_data_point_dropdown/`);
      if (!isEmpty(res?.response) && res?.response) {
        const topics = res?.response?.topics || [];

        setTopicOptions(topics);
      }
    } catch (error) {
      console.error('Error fetching topic options:', error);
    }
  };

  useEffect(() => {
    topicDropdownData();
  }, []);

  const getFilterDataPoints = () => {
    return data.reduce((acc, row) => {
      return [...acc, ...row.data_point];
    }, []);
  };

  const handleDataPointSelect = (topicKey: any, value: any) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === topicKey
          ? {
              ...item,
              data_point: Array.from(new Set([...item.data_point, value])),
            }
          : item
      )
    );
  };

  const handleDataPointRemove = (topicKey: any, pointToRemove: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === topicKey
          ? {
              ...item,
              data_point: item.data_point.filter(
                (point: string) => point !== pointToRemove
              ),
            }
          : item
      )
    );
  };

  const handleTopicChange = async (key: any, field: any, value: string) => {
    if (field === 'topic') {
      try {
        const res = await get(
          `/peerBenchmarking/topic_and_data_point_dropdown/?topic=${value}`
        );
        if (!isEmpty(res?.response) && res?.response) {
          const dataPoints = res?.response?.data_points || [];
          setData((prevData) =>
            prevData.map((item) =>
              item.key === key
                ? { ...item, topic: value, data_point: dataPoints } // Update both topic and data_points
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error fetching data points:', error);
      }
    }
  };

  const handleSaveAndUpdate = async () => {
    // Filter out `currentCompany` from the selectedCompanies array
    const filteredCompanies = selectedCompanies.filter(
      (company) => company !== currentCompany
    );

    // Check if the filtered companies exceed the limit
    if (filteredCompanies.length > 4) {
      message.warning('You can only select a maximum of 4 companies.');
      return;
    }

    // Validate that all items in `data` have non-empty topic and data_point
    const invalidData = data.some((item) => !item.topic || !item.data_point);
    if (invalidData) {
      message.warning('All topics and data points must be filled out.');
      return;
    }

    const Data_Points = data.map((item) => ({
      topic: item.topic,
      data_points: item.data_point,
    }));

    const companiesToSend = Array.from(
      new Set([...selectedCompanies, currentCompany])
    );

    const payload = {
      entity_Id: user.entity_Id,
      Industry: industry,
      Companies: companiesToSend, // Includes currentCompany by default
      Data_Points: Data_Points,
    };

    try {
      const resData = await post(
        '/peerBenchmarking/create_peer_selection/',
        payload
      );
      message.success(resData?.message);
      navigate(`/admin-bench`);
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    setLastPage(1);
  };

  const handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setLastPage(pagination.current);
  };

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: '450px',
      render: (text: any, record: any) => {
        return record.editAdd ? (
          <Select
            showSearch
            mode="tags"
            placeholder="Select Topic"
            value={text || undefined}
            onChange={(value) => {
              if (value.length > 1) {
                // Only keep the last value, effectively disabling multi-select
                value = [value[value.length - 1]];
              }
              handleTopicChange(record.key, 'topic', value[0]); // Update with the single value
            }}
            style={{ width: '100%' }}
          >
            {topicOptions.map((topic) => (
              <Option key={topic} value={topic}>
                {topic}
              </Option>
            ))}
          </Select>
        ) : (
          <p>{record.topic}</p>
        );
      },
    },
    {
      title: 'Data Point',
      dataIndex: 'data_point',
      key: 'data_point',
      render: (data_points: string[], record: any) => {
        const usedDataPoints = getFilterDataPoints();
        const availableDataPoints = dataPointOptions.filter(
          (dataPoint) =>
            !usedDataPoints.includes(dataPoint) ||
            data_points.includes(dataPoint)
        );

        return (
          <div>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              value={data_points}
              onSelect={(value) => handleDataPointSelect(record.key, value)}
              onDeselect={(value) => handleDataPointRemove(record.key, value)}
              className={Styles.selectItem}
            >
              {availableDataPoints.map((dataPoint) => (
                <Option key={dataPoint} value={dataPoint}>
                  {dataPoint}
                </Option>
              ))}
            </Select>
          </div>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <CloseCircleOutlined
          className="text-danger user-select-all"
          onClick={() => handleDelete(record.key)}
          style={{ cursor: 'pointer', marginLeft: '20px' }}
        />
      ),
    },
  ];

  const handleDelete = (key: any) => {
    const updatedData = data.filter((item) => item.key !== key);

    setData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {
      key: data.length + 1,
      topic: '',
      data_point: [],
      editAdd: true,
    };
    setEditAdd(true);
    setData([...data, newRow]);
    setLastPage(getLastPage(data));
  };

  const currentCompany = user.entity_name;

  return (
    <>
      <PageCardComponent className={Styles.pageCardPadding}>
        <Row>
          <Col span={8}>
            <p className={Styles.subtitle}>Sector</p>
            <p className={Styles.industryTitle}>{industry}</p>
          </Col>
          <Col span={10}>
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
              {industryOptions
                .filter((company: any) => company !== currentCompany) // Exclude currentCompany
                .map((company: any) => (
                  <Option key={company} value={company}>
                    {company}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col span={6} className="d-flex justify-content-end">
            <ButtonComponent
              className={Styles.addrowMargin}
              hierarchy="secondary-gray"
              onClick={handleAddRow}
            >
              Add Row +
            </ButtonComponent>
          </Col>
        </Row>
        <Row className={Styles.paddingTop}>
          <TableComponent
            onchange={handleChange}
            data={data ? data : []}
            columnHeader={columns}
            enableRowSelection={false}
            columnCheckBoxTitle="S.No."
            columnCheckBoxDataAttribute="key"
            isRowExpand={false}
            showCountForCheckBox={true}
            showOnlyCount={true}
            currentPage={lastPage}
          />
        </Row>
        <Row justify="end" className={Styles.paddingTop}>
          <ButtonComponent onClick={handleSaveAndUpdate} className="ml-2">
            Save & Update
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default BenchAdminEdit;
