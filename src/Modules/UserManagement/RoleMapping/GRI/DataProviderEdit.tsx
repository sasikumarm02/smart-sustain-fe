// DataApproverEdit.tsx
import { useReducer, useEffect, useState } from 'react';
import { DatePicker, Row, Col, Select, Spin, Button, message } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../../DesignLibrary';
import UseTable from '../../../../Components/content/UseTable';
import Styles from '../mapping.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { apiBaseUrl, get, put } from '../../../../Services';
import { useAuth } from '../../../../Hooks/useAuth';
import { useNotification } from '../../../../Hooks/useNotification';
import { isEmpty } from '../../../../Utils/isEmpty';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';

dayjs.extend(customParseFormat);

const { Option } = Select;

const DataApproverEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabKey } = location?.state ? location?.state : '1';
  const { user } = useAuth();
  const { openToast } = useNotification();
  const [providerData, setProviderData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [User, SetUser] = useState<any>([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [subtopicData, setSubtopicData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data = [];
      try {
        const catSubCatData = await get(
          `${apiBaseUrl}/report/get_entity_categories_and_subcategories/?entity_Id=${user.entity_Id}`
        );
        data = catSubCatData?.response?.data;
      } catch (err) {
        console.error(err);
      }
      if (location.state) {
        const existingData = location?.state?.data;
        const updatedSubTopics = data?.filter(
          (cat: any) =>
            !isEmpty(existingData?.material_topic) &&
            !isEmpty(existingData?.material_topic[0]) &&
            existingData?.material_topic[0] === cat?.category_name
        );
        setProviderData([existingData]);
        setSubtopicData([...(updatedSubTopics[0]?.sub_categories || [])]);
        SetUser([
          ...(existingData?.mapped_user || []),
          ...(existingData?.unmapped_user || []),
        ]);
      }
      setLoading(false);
    };

    fetchData();
  }, [location.state]);

  const validateForm = (updatedData: any) => {
    const isValid = updatedData.every(
      (item: any) =>
        item.subtopic?.length > 0 &&
        item.mapped_user?.length > 0 &&
        item.target_date
    );
    setIsFormValid(isValid);
  };

  const handleUpdateRowData = (value: any, key: number, type: string) => {
    setIsFormChanged(true);

    const updatedData = providerData.map((item: any, index: number) => {
      return {
        ...item,
        subtopic: value,
      };
    });

    setProviderData(updatedData);
    validateForm(updatedData);
  };

  const handleDataProvider = (value: any, key: number, type: string) => {
    setIsFormChanged(true);

    const updatedData = providerData.map((item: any, index: number) => {
      return {
        ...item,
        mapped_user: value.map((authId: any) => ({ auth_Id: authId })),
      };
    });

    setProviderData(updatedData);
    validateForm(updatedData);
  };

  const handleDateChange = (date: any, dateString: any, key: number) => {
    setIsFormChanged(true);
    const updatedData = providerData.map((item: any) => {
      return { ...item, target_date: date ? date.toISOString() : '' };
    });
    setProviderData(updatedData);
    validateForm(updatedData);
  };
  const columnsProvider = [
    {
      title: 'Material Topic',
      dataIndex: 'material_topic',
      key: 'material_topic',
    },
    {
      title: 'Sub Topics',
      dataIndex: 'subtopic',
      key: 'subtopic',
      render: (value: any, record: any) => {
        const filteredSubCategories = [...subtopicData];
        return (
          <Select
            mode="multiple"
            style={{ width: 200 }}
            onChange={(value) =>
              handleUpdateRowData(value, record?.key, 'subCat')
            }
            value={record?.subtopic || []}
          >
            {filteredSubCategories.map((subCat: any) => (
              <Option
                key={subCat?.sub_category_id}
                value={
                  subCat?.sub_category_id + ' ' + subCat?.sub_category_name
                }
              >
                {subCat?.sub_category_id + ' ' + subCat?.sub_category_name}
              </Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: 'Data Provider',
      dataIndex: 'mapped_user',
      key: 'mapped_user',
      render: (value: any, record: any) => {
        const userArray = [...User];

        return (
          <Select
            mode="multiple"
            style={{ width: 200 }}
            className={Styles.selectNew}
            onChange={(value) =>
              handleDataProvider(value, record?.key, 'mapped_user')
            }
            value={record?.mapped_user?.map((user: any) => user.auth_Id)}
          >
            {userArray.map((user) => (
              <Option key={user.auth_Id} value={user.auth_Id}>
                {user.userName}
              </Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      render: (text: any, record: any) => {
        return (
          <DatePicker
            style={{ width: 240 }}
            format="DD-MM-YYYY"
            onChange={(date, dateString) =>
              handleDateChange(date, dateString, record.key)
            }
            value={record.target_date ? dayjs(record.target_date) : null}
            disabledDate={(current) =>
              current && current < moment().startOf('day')
            }
          />
        );
      },
    },
  ];

  const onFinish = async () => {
    setLoading(true);
    const postData = providerData.map((obj: any) => {
      return {
        auth_Id: obj.mapped_user.map((l1User: any) => l1User.auth_Id),
        entity_Id: obj.entity_Id,
        material_topic: obj.material_topic,
        subtopic: obj.subtopic,
        target_date: obj.target_date,
        role: 'DATA_PROVIDER',
      };
    });
    try {
      const response = await put(`${apiBaseUrl}/user/GRI_DP_EDIT/`, postData);
      message.success(response?.message);
      navigate(`/role-mapping-compliance`, { state: { currentTab: tabKey } });
    } catch (error: any) {
      openToast({
        content: 'Failed to submit data: ' + error.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoaderComponent spinning={loading}>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <div>
          <TableComponent
            data={providerData}
            columnHeader={columnsProvider}
            enableRowSelection={false}
            isRowExpand={false}
            showOnlyCount={true}
          />
        </div>
        <Row className={Styles.editSubmitBtn} justify={'end'}>
          <ButtonComponent
            disabled={!isFormChanged || !isFormValid}
            onClick={onFinish}
          >
            Submit
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </LoaderComponent>
  );
};

export default DataApproverEdit;
