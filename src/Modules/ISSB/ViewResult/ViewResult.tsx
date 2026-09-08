import React, { useEffect, useState } from 'react';
import { Input, Radio, Select, Image, message } from 'antd';
import TableComponent from '../../../DesignLibrary/TableComponent';
import PageCardComponent from '../../../DesignLibrary/PageCardComponent';
import Styles from './ViewResult.module.scss';
import { ButtonComponent } from '../../../DesignLibrary';
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { get, post } from '../../../Services/api.service';
import { useAuth } from '../../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ViewResult = () => {
  const [dataSource, setDataSource] = useState<any>([
    {
      key: '1',
      topic: '',
      disclosureAspects: '',
      summaryOfGaps: '',
      priorityLevel: '',
    },
  ]);
  const [topics, setTopics] = useState<any[]>([]);
  const [subTopics, setSubTopics] = useState<any[]>([]);
  const [isFormValid, setIsFormValid] = useState(false); // State to track form validity
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const isValid = dataSource.every(
      (item: any) => item.topic && item.disclosureAspects && item.summaryOfGaps
    );
    setIsFormValid(isValid);
  };

  const handleSubmitQuestion = () => {
    const payload = {
      entity_Id: user.entity_Id,
      data: dataSource.map((item: any) => ({
        topic: item.topic,
        disclosure: item.disclosureAspects,
        summary: item.summaryOfGaps,
        priority: item.priorityLevel,
      })),
    };

    post('/issb/create_issb_gap_report/', payload)
      .then((res: any) => {
        message.success('Submitted successfully.');
        navigate('/ISSB-Gap-Results-analysis');
      })
      .catch((err) => {
        console.error('Error in submission:', err);
        message.error('Submission failed');
      });
  };

  const fetchTopics = () => {
    get(`/issb/get_topic_dropdown/?entity_Id=${user?.entity_Id}`)
      .then((res: any) => {
        const apiData = res?.response?.topics;
        setTopics(apiData || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchSubTopics = (topic: string) => {
    get(`/issb/get_topic_dropdown/?entity_Id=${user?.entity_Id}&topic=${topic}`)
      .then((res: any) => {
        const apiData = res?.response?.sub_topics;
        setSubTopics(apiData || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddRow = () => {
    const newRow = {
      key: (dataSource.length + 1).toString(),
      topic: '',
      disclosureAspects: '',
      summaryOfGaps: '',
      priorityLevel: '',
    };
    setDataSource([...dataSource, newRow]);
  };

  const handleDeleteRow = (key: string) => {
    // Check if the row is the first one in the dataSource
    if (key === dataSource[0].key) {
      // If it's the first row, just reset its values instead of deleting
      const newData = dataSource.map((item: any) => {
        if (item.key === key) {
          return {
            ...item,
            topic: '',
            disclosureAspects: '',
            summaryOfGaps: '',
            priorityLevel: '',
          };
        }
        return item;
      });
      setDataSource(newData);
    } else {
      // Allow deleting other rows
      const newData = dataSource.filter((item: any) => item.key !== key);
      setDataSource(newData);
    }
  };

  const handleFieldChange = (key: string, field: string, value: any) => {
    const newData = dataSource.map((item: any) => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setDataSource(newData);
  };

  const handleTopicChange = (key: string, topic: string) => {
    handleFieldChange(key, 'topic', topic);
    fetchSubTopics(topic);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    validateForm();
  }, [dataSource]);

  const handleReset = () => {
    const resetData = [
      {
        key: '1',
        topic: '',
        disclosureAspects: '',
        summaryOfGaps: '',
        priorityLevel: '',
      },
    ];

    setDataSource(resetData);
  };

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: '300px',
      render: (text: string, record: any) => (
        <Select
          value={record.topic || undefined}
          onChange={(value) => handleTopicChange(record.key, value)}
          placeholder="Select Topic"
          style={{ width: '100%', height: '50px' }}
        >
          {topics.map((option: any) => (
            <Option key={option.id} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Disclosure Aspects',
      dataIndex: 'disclosureAspects',
      key: 'disclosureAspects',
      width: '300px',
      render: (text: string, record: any) => {
        // Filter out already selected disclosure aspects
        const selectedDisclosureAspects = dataSource
          .map((item: any) => item.disclosureAspects)
          .filter(Boolean); // Exclude empty values

        const availableOptions = subTopics.filter(
          (option: any) =>
            !selectedDisclosureAspects.includes(option) ||
            option === record.disclosureAspects
        );

        return (
          <Select
            value={record.disclosureAspects || ''}
            onChange={(value) =>
              handleFieldChange(record.key, 'disclosureAspects', value)
            }
            placeholder="Select Disclosure Aspect"
            style={{ width: '100%', height: '50px' }}
          >
            {availableOptions.map((option: any) => (
              <Option key={option.id} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Summary of Gaps',
      dataIndex: 'summaryOfGaps',
      key: 'summaryOfGaps',
      width: '340px',
      render: (text: string, record: any) => (
        <Input.TextArea
          style={{ height: '50px', background: '#FAF9FF' }}
          value={record.summaryOfGaps}
          onChange={(e) =>
            handleFieldChange(record.key, 'summaryOfGaps', e.target.value)
          }
          placeholder="Enter Your Comments"
          rows={1}
        />
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '100px',
      align: 'center',
      render: (text: string, record: any) => (
        <>
          <button
            className="text-danger user-select-all"
            onClick={() => handleDeleteRow(record.key)}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <CloseCircleOutlined />
          </button>
        </>
      ),
    },
  ];

  return (
    <PageCardComponent>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className={Styles.title}></h4>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <ButtonComponent onClick={handleAddRow} hierarchy="secondary-gray">
            Add Row +
          </ButtonComponent>
        </div>
      </div>

      <TableComponent
        data={dataSource}
        columnHeader={columns}
        enableRowSelection={false}
        isRowExpand={false}
        showOnlyCount={true}
      />
      <div className="d-flex justify-content-end align-items-center mt-3">
        <ButtonComponent
          className="mx-3"
          onClick={handleReset}
          hierarchy="tertiary"
        >
          Reset
        </ButtonComponent>
        <ButtonComponent
          onClick={handleSubmitQuestion}
          hierarchy="primary"
          disabled={!isFormValid} // Disable button if form is invalid
        >
          Submit
        </ButtonComponent>
      </div>
    </PageCardComponent>
  );
};

export default ViewResult;
