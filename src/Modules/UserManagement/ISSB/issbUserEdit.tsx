import { DatePicker, message, Row, Select } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import styles from './issb.module.scss';
import EditIcon from '../../../assets/Svg/User/EditIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import { get, put } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useEffect, useState } from 'react';
import { isEmpty } from '../../../Utils/isEmpty';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const ISSBMappingEdit = () => {
  dayjs.extend(customParseFormat);
  const { Option } = Select;
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsloading] = useState<boolean>(false);
  const [users, setusers] = useState<any>();
  const [usersOption, setUsersOption] = useState<any>();
  const [date, setDate] = useState<any>();
  const [selectUsers, setSelectedUser] = useState<[]>();

  const getApiData = async () => {
    try {
      const data = await get(
        `user/get_ISSB_Users/?entity_Id=${user.entity_Id}`
      );
      const unmapped_users = data?.response?.data?.unmapped_users;
      if (!isEmpty(unmapped_users)) {
        setUsersOption(unmapped_users);
        setIsloading(false);
      } else {
        setIsloading(false);
      }
    } catch (error) {
      console.error(error);
      setIsloading(false);
    }
  };

  useEffect(() => {
    setIsloading(true);
    const data = location?.state?.record;
    if (!isEmpty(data)) {
      setusers([data]);
      setDate(moment(data?.target_date).format('DD-MM-YYYY'));
      setSelectedUser(data?.userName);
    } else {
      setusers([{}]);
    }
    getApiData();
  }, []);

  const ISSBCols = [
    {
      title: 'S.No.',
      dataIndex: 'sNo',
      key: 'sNo',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      key: 'role',
      render: (text: any, record: any, index: any) => (
        <>{text?.replace('_', ' ').replace('L1', '').replace('_', ' ')}</>
      ),
    },
    {
      title: 'User Name',
      dataIndex: 'email_address',
      key: 'email_address',
      render: (text: any, record: any) => {
        return (
          <Select
            mode="multiple"
            className={styles.selectNew}
            style={{ width: 240 }}
            onChange={(value) => {
              setSelectedUser(value);
            }}
            defaultValue={users[0]?.userName}
          >
            {usersOption?.map((ele: any) => (
              <Option key={ele?.userName} value={ele?.userName}>
                {ele?.userName}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Target date',
      dataIndex: 'target_date',
      key: 'target_date',
      defaultSortOrder: 'descend',
      render: (text: any, record: any) => {
        return (
          <DatePicker
            style={{ width: 240 }}
            format="DD-MM-YYYY"
            onChange={(date, dateString) => setDate(dateString)}
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
      setIsloading(true);
      const AuthId = selectUsers?.map((ele: any) => {
        const res = usersOption?.find((usr: any) => ele === usr?.userName);
        if (res != undefined) return res?.auth_Id;
        else {
          const index = users[0]?.userName?.indexOf(ele);
          if (index !== -1) {
            return users[0]?.auth_Id[index];
          }
        }
      });
      if (isEmpty(AuthId)) {
        message.warning('you should atleast have one value !!');
        setIsloading(false);
      } else {
        const newDate = date?.substr(0, 10);
        const isoFormat = moment(newDate, 'DD-MM-YYYY').toISOString();
        const payLoad = {
          id: users[0]?.id,
          target_date: isoFormat,
          auth_Id: AuthId,
        };

        const response = await put('user/edit_issb_user/', payLoad);
        if (response?.status === 'Success') {
          message.success(response?.message);
          setIsloading(false);
          navigate('/issb-role-mapping');
        } else {
          message.error(response?.message);
        }
      }
    } catch (error) {
      console.error(error);
      setIsloading(false);
      message.error('Unable to Update the record');
    }
  };

  const handleReset = () => {
    setusers([]);
  };

  return (
    <PageCardComponent className={styles.pageCardStyle}>
      <LoaderComponent spinning={isLoading}>
        <Row>
          <TableComponent
            isRowExpand={false}
            data={users}
            enableRowSelection={false}
            columnHeader={ISSBCols}
            showOnlyCount={false}
            columnCheckBoxDataAttribute="key"
          ></TableComponent>
        </Row>
        <Row justify={'end'} style={{ marginTop: '15px' }}>
          <ButtonComponent onClick={() => handleSubmit()}>
            Submit
          </ButtonComponent>
        </Row>
      </LoaderComponent>
    </PageCardComponent>
  );
};

export default ISSBMappingEdit;
