import { useReducer, useEffect, useState } from 'react';
import { DatePicker, Row, Col, Select, Spin, message } from 'antd';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../../../DesignLibrary';
import Styles from '../mapping.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import UseTable from '../../../../Components/content/UseTable';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { ColumnsType } from 'antd/es/table';
import { apiBaseUrl, put } from '../../../../Services';
import { useAuth } from '../../../../Hooks/useAuth';
import { useNotification } from '../../../../Hooks/useNotification';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';

dayjs.extend(customParseFormat);

const { Option } = Select;

const DataApproverEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabKey } = location?.state ? location?.state : '1';

  const [User, SetUser] = useState([]);
  const { user } = useAuth();
  const [data, setData] = useState<any>([
    {
      key: 1,
      no: 1,
      entity_Id: user?.entity_Id,
      frameworks: ['GRI'],
      L1: [],
      L2: [],
      target_date: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { openToast } = useNotification();

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const settingEditData = () => {
    const existingData = location.state?.data || {};
    setData([existingData]);

    const combinedUser: any = [
      ...(existingData?.unmapped_user || []),
      ...(existingData?.L1 || []),
      ...(existingData?.L2 || []),
    ];
    SetUser(combinedUser);
  };

  useEffect(() => {
    settingEditData();
  }, [location.state]);

  const validateForm = (updatedData: any) => {
    const isValid = updatedData.every(
      (item: any) => item.L1.length > 0 && item.target_date
    );
    setIsFormValid(isValid);
  };

  const handleLevelChange = (value: string[], level: string, key: number) => {
    setIsFormChanged(true);
    const filteredArray = User.filter((val: any) =>
      value.includes(val.auth_Id)
    );

    const updatedData = data.map((item: any) => {
      const updatedItem = {
        ...item,
        [level]: filteredArray,
      };

      if (level === 'L1') {
        updatedItem.L2 = (updatedItem.L2 || []).filter(
          (user: any) => !value.includes(user.auth_Id)
        );
      } else if (level === 'L2') {
        updatedItem.L1 = (updatedItem.L1 || []).filter(
          (user: any) => !value.includes(user.auth_Id)
        );
      }

      return updatedItem;
    });

    setData(updatedData);
    validateForm(updatedData);
  };

  const handleDateChange = (date: any, dateString: any, key: number) => {
    setIsFormChanged(true);
    const updatedData = data.map((item: any) => ({
      ...item,
      target_date: date ? date.toISOString() : '',
    }));
    setData(updatedData);
    validateForm(updatedData);
  };

  const columnsApprover: ColumnsType<any> = [
    {
      title: 'Frameworks',
      dataIndex: 'frameworks',
      key: 'frameworks',
      render: () => <div style={{ width: 230 }}>GRI</div>,
    },
    {
      title: 'Level 1',
      dataIndex: 'L1',
      key: 'L1',
      render: (text: any, record: any) => {
        const userArray = [...User];
        const updatedArr = userArray.filter((user1: any) => {
          return !(record?.L2 || []).some(
            (l2User: any) => l2User.auth_Id === user1.auth_Id
          );
        });
        return (
          <Select
            mode="multiple"
            className={Styles.selectNew}
            style={{ width: 200 }}
            onChange={(value: any) =>
              handleLevelChange(value, 'L1', record.key)
            }
            value={(record?.L1 || []).map((l1Item: any) => l1Item.auth_Id)}
          >
            {updatedArr &&
              updatedArr.map((levelone: any) => (
                <Option key={levelone?.auth_Id} value={levelone?.auth_Id}>
                  {levelone?.userName}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: 'Level 2',
      dataIndex: 'L2',
      key: 'L2',
      render: (text: any, record: any) => {
        const userArray = [...User];
        const updatedArr = userArray.filter((user1: any) => {
          return !(record?.L1 || []).some(
            (l1User: any) => l1User.auth_Id === user1.auth_Id
          );
        });
        return (
          <Select
            mode="multiple"
            className={Styles.selectNew}
            style={{ width: 200 }}
            onChange={(value: any) =>
              handleLevelChange(value, 'L2', record.key)
            }
            value={(record?.L2 || []).map((l2Item: any) => l2Item.auth_Id)}
          >
            {updatedArr &&
              updatedArr.map((leveltwo: any) => (
                <Option key={leveltwo?.auth_Id} value={leveltwo?.auth_Id}>
                  {leveltwo?.userName}
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
              handleDateChange(date, dateString, record.entity_Id)
            }
            value={record?.target_date ? dayjs(record.target_date) : null}
            disabledDate={(current) =>
              current && current < moment().startOf('day')
            }
          />
        );
      },
    },
  ];

  const onFinish = async () => {
    const payload = data.map((obj: any) => {
      return {
        entity_Id: user.entity_Id,
        role: {
          L1: obj.L1.map((l1User: any) => l1User.auth_Id),
          L2: obj.L2.map((l2User: any) => l2User.auth_Id),
        },
        frameworks: ['GRI'],
        target_date: obj?.target_date,
      };
    });
    setLoading(true);
    try {
      const response = await put(`${apiBaseUrl}/user/GRI_DA_EDIT/`, payload);
      message.success(response?.message);
      navigate(`/role-mapping-compliance`, { state: { currentTab: tabKey } });
    } catch (error: any) {
      setErrMsg(error?.response?.data?.message);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoaderComponent spinning={loading}>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <div className={Styles.tableContent}>
          <TableComponent
            data={data}
            columnHeader={columnsApprover}
            enableRowSelection={false}
            isRowExpand={false}
            showOnlyCount={true}
          />
          <Row justify="end" style={{ marginTop: '15px' }}>
            <ButtonComponent
              style={{ marginLeft: '15px' }}
              onClick={onFinish}
              disabled={!isFormChanged || !isFormValid}
            >
              Submit
            </ButtonComponent>
          </Row>
        </div>
      </PageCardComponent>
      <ModalComponent
        isOpen={isOpen}
        content={errMsg}
        cancelBtnText="Ok"
        onClose={() => {
          settingEditData();
          setIsOpen(false);
        }}
      />
    </LoaderComponent>
  );
};

export default DataApproverEdit;
