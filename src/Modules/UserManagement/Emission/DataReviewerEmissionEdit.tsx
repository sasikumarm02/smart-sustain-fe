import { DatePicker, message, Row, Select, Spin } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  ModalComponent,
  TableComponent,
} from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../../Hooks/useAuth';
import UseTable from '../../../Components/content/UseTable';
import { apiBaseUrl, get, put } from '../../../Services';
import dayjs from 'dayjs';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';
const { Option } = Select;

const DataReviewerEmissionEdit = () => {
  const location = useLocation();
  const tabkeyEdit = location?.state?.tabkey;
  const { user } = useAuth();
  const [User, SetUser] = useState([]);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [data, setData] = useState<any>([
    {
      key: 1,
      no: 1,
      organization: user.entity_name,
      L1: [],
      L2: [],
      L3: [],
      target_date: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const settingEditData = () => {
    if (location.state && location.state.data) {
      const existingData = location.state.data;
      setData([existingData]);
      const combinedUser: any = [
        ...existingData?.unmapped_users,
        ...existingData?.L1,
        ...existingData?.L2,
        ...existingData?.L3,
      ];
      SetUser(combinedUser || []);
    }
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
        updatedItem.L2 = updatedItem.L2.filter(
          (user: any) => !value.includes(user.auth_Id)
        );
        updatedItem.L3 = updatedItem.L3.filter(
          (user: any) => !value.includes(user.auth_Id)
        );
      } else if (level === 'L2') {
        updatedItem.L1 = updatedItem.L1.filter(
          (user: any) => !value.includes(user.auth_Id)
        );
        updatedItem.L3 = updatedItem.L3.filter(
          (user: any) => !value.includes(user.auth_Id)
        );
      } else if (level === 'L3') {
        updatedItem.L1 = updatedItem.L1.filter(
          (user: any) => !value.includes(user.auth_Id)
        );
        updatedItem.L2 = updatedItem.L2.filter(
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
    const updatedData = data.map((item: any) => {
      return { ...item, target_date: date ? date.toISOString() : '' };
    });
    setData(updatedData);
    validateForm(updatedData);
  };

  const columnsReview = [
    {
      title: 'S.No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Organisation',
      dataIndex: 'organization',
      key: 'organization',
      render: () => <>{user.entity_name}</>,
    },
    {
      title: 'Level 1',
      dataIndex: 'L1',
      key: 'L1',
      render: (text: any, record: any) => {
        const userArray = [...User];
        const availableUsers = userArray.filter(
          (userItem: any) =>
            !record.L2.some(
              (l2User: any) => l2User.auth_Id === userItem.auth_Id
            ) &&
            !record.L3.some(
              (l3User: any) => l3User.auth_Id === userItem.auth_Id
            )
        );
        return (
          <Select
            mode="multiple"
            style={{ width: 180 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L1', record.key)
            }
            value={record?.L1?.map((l1Item: any) => l1Item.auth_Id)}
            // value={record?.L1}
          >
            {availableUsers.map((user: any) => (
              <Option key={user.auth_Id} value={user.auth_Id}>
                {user.name}
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
        const availableUsers = userArray.filter(
          (userItem: any) =>
            !record.L1.some(
              (l1User: any) => l1User.auth_Id === userItem.auth_Id
            ) &&
            !record.L3.some(
              (l3User: any) => l3User.auth_Id === userItem.auth_Id
            )
        );
        return (
          <Select
            mode="multiple"
            style={{ width: 180 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L2', record.key)
            }
            value={record?.L2?.map((l1Item: any) => l1Item.auth_Id)}
          >
            {availableUsers.map((user: any) => (
              <Option key={user.auth_Id} value={user.auth_Id}>
                {user.name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Level 3',
      dataIndex: 'L3',
      key: 'L3',
      render: (text: any, record: any) => {
        const userArray = [...User];
        const availableUsers = userArray.filter(
          (userItem: any) =>
            !record.L1.some(
              (l1User: any) => l1User.auth_Id === userItem.auth_Id
            ) &&
            !record.L2.some(
              (l2User: any) => l2User.auth_Id === userItem.auth_Id
            )
        );
        return (
          <Select
            mode="multiple"
            style={{ width: 180 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L3', record.key)
            }
            value={record?.L3?.map((l1Item: any) => l1Item.auth_Id)}
          >
            {availableUsers.map((user: any) => (
              <Option key={user.auth_Id} value={user.auth_Id}>
                {user.name}
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
            className={Styles.selectNew}
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = data.map((obj: any) => ({
        entity_Id: obj.entity_Id,
        role: {
          L1: obj.L1.map((l1User: any) => l1User.auth_Id),
          L2: obj.L2.map((l2User: any) => l2User.auth_Id),
          L3: obj.L3.map((l3User: any) => l3User.auth_Id),
        },
        target_date: obj.target_date,
      }));

      const response = await put(
        `${apiBaseUrl}/user/edit_roles_to_data_reviewer/`,
        payload
      );
      message.success(response?.message);
      navigate(`/role-mapping-emission`, { state: tabkeyEdit });
    } catch (err: any) {
      setErrMsg(err?.response?.data?.message);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <LoaderComponent spinning={loading}>
          <div>
            <TableComponent
              data={data}
              columnHeader={columnsReview}
              enableRowSelection={false}
              isRowExpand={false}
            />
          </div>
          <Row className={Styles.editSubmitBtn} justify={'end'}>
            <ButtonComponent
              disabled={!isFormChanged || !isFormValid}
              onClick={handleSubmit}
            >
              Submit
            </ButtonComponent>
          </Row>
        </LoaderComponent>
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
    </>
  );
};

export default DataReviewerEmissionEdit;
