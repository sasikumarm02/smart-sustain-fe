import { DatePicker, Row, Select, Spin, message } from 'antd';
import { ButtonComponent, TableComponent } from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import UseTable from '../../../Components/content/UseTable';
import { useAuth } from '../../../Hooks/useAuth';
import { apiBaseUrl, get, post, put } from '../../../Services';
import { PageCardComponent, TabsComponent } from '../../../DesignLibrary';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const { Option } = Select;
dayjs.extend(customParseFormat);
const DataProviderEmissionEdit = () => {
  const [User, SetUser] = useState([]);
  const { user } = useAuth();
  const [Facility, setFacility] = useState<any>();
  const [data, setData] = useState<any>([
    {
      key: 1,
      no: 1,
      organization: user.entity_name,
      facility_Id: '',
      user: '',
      target_date: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tabkeyEdit = location?.state?.tabkey;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const handleSubmit = async () => {
    const payload = data.map((obj: any) => {
      return {
        id: obj.id,
        entity_Id: user.entity_Id,
        auth_Id: obj?.user,
        facility_Id: obj?.facility,
        target_date: obj?.target_date,
      };
    });

    try {
      setLoading(true);
      const response = await put(`${apiBaseUrl}/user/Emission_DP_Edit/`, [
        payload[0],
      ]);
      message.success(response?.message);
      navigate(`/role-mapping-emission`, { state: tabkeyEdit });
    } catch (err: any) {
      console.log(err);
      message.error(err?.response?.data?.message);
    }
  };
  const validateForm = (updatedData: any) => {
    // Ensure user and target_date fields are not empty
    const isValid = updatedData.every(
      (item: any) => item.user.length > 0 && item.target_date
    );
    setIsFormValid(isValid); // Update form validity state
  };

  const handleUserChange = (value: string[], key: number) => {
    setIsFormChanged(true);

    // Update the data array without overwriting other users' data
    const newData = data.map((item: any) => {
      if (item.key === key) {
        // If the key matches, update the 'authorised_users' field with the selected users
        return {
          ...item,
          user: value, // Update the user field with selected values
          authorised_users: value.map((authId) => ({ auth_Id: authId })),
        };
      }
      return item;
    });

    setData(newData); // Update the state with new data
    validateForm(newData); // Call form validation after update
  };

  const handleDateChange = (date: any, dateString: any, key: number) => {
    setIsFormChanged(true);
    const updatedData = data.map((item: any) => {
      if (item.key === key) {
        return { ...item, target_date: date ? date.toISOString() : '' };
      }
      return item;
    });
    setData(updatedData);
    validateForm(updatedData);
  };

  const getApiData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/user/Emission_user_DP?entity_Id=${user.entity_Id}`
      );
      const data = response?.response;
      SetUser(data?.unmapped_users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getApiFacility = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/facility/get_Facility/?entity_Id=${user.entity_Id}`
      );
      const data = response?.response?.data;
      setFacility(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiFacility();
    getApiData();

    if (location.state && location.state.data) {
      const initialData = location.state.data;
      setData([
        {
          ...initialData,
          facility: initialData.facility_Id || '',
          user: initialData.auth_Id || '',
          target_date: initialData.target_date || '',
        },
      ]);
    }
  }, [location.state]);

  const columnsProvider = [
    {
      title: 'S.No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'Facility',
      dataIndex: 'facility_Name',
      key: 'facility_Name',
    },
    {
      title: 'User',
      dataIndex: 'unmapped_users',
      key: 'unmapped_users',
      render: (text: any, record: any) => {
        const selectedUserIds =
          record?.authorised_users?.map((user: any) => user.auth_Id) || [];

        return (
          <Select
            mode="multiple"
            style={{ width: 240 }}
            className={Styles.selectNew}
            onChange={(value) => handleUserChange(value, record.key)} // Update selected users
            value={selectedUserIds || []} // Reflect the current selection in the dropdown
          >
            {User?.map((ele: any) => (
              <Option key={ele?.auth_Id} value={ele?.auth_Id}>
                {ele?.userName}
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

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <div>
          <Spin spinning={loading}>
            <TableComponent
              data={data}
              columnHeader={columnsProvider}
              enableRowSelection={false}
              isRowExpand={false}
            />
          </Spin>
        </div>
        <Row className={Styles.editSubmitBtn} justify={'end'}>
          <ButtonComponent
            disabled={!isFormChanged || !isFormValid}
            onClick={handleSubmit}
          >
            Submit
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </>
  );
};

export default DataProviderEmissionEdit;
