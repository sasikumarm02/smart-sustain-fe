import { DatePicker, Row, Col, Select, message } from 'antd';
import { ButtonComponent, TableComponent } from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../../Hooks/useAuth';
import { apiBaseUrl, get, post } from '../../../Services';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProviderMapping = ({ tabkey }: any) => {
  const [User, SetUser] = useState([]);
  const { user } = useAuth();
  const [Facility, setFacility] = useState<any>();
  const [data, setData] = useState<any>([
    {
      key: 1,
      no: 1,
      organization: user.entity_name,
      facility: '',
      user: '',
      targetDate: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const payload = data.map((obj: any) => {
      return {
        entity_Id: user.entity_Id,
        auth_Id: obj?.user,
        facility_Id: obj?.facility,
        target_date: obj?.targetDate,
      };
    });

    try {
      setLoading(true);
      const response = await post(
        `${apiBaseUrl}/user/assign_roles_to_emission_DP/`,
        payload
      );
      message.success(response?.message);
      navigate(`/role-mapping-emission`, { state: tabkey });
    } catch (err: any) {
      console.log(err);
      message.error(err?.response?.data?.message);
    }
  };

  const handleUserChange = (value: string, key: number) => {
    const newData = data.map((item: any) => {
      if (item.key == key) {
        return { ...item, user: value };
      }
      return item;
    });
    setData(newData);
  };

  const handleDateChange = (date: any, dateString: any, key: number) => {
    const newData = data.map((item: any) => {
      if (item.key == key) {
        return { ...item, targetDate: date };
      }
      return item;
    });
    setData(newData);
  };

  const handleFacilityChange = (value: string, key: number) => {
    const newData = data.map((item: any) => {
      if (item.key === key) {
        return { ...item, facility: value };
      }
      return item;
    });
    setData(newData);
  };

  const handleAddRow = () => {
    const newRow = {
      key: data.length + 1,
      no: data.length + 1,
      organization: user.entity_name,
      facility: '',
      user: '',
      targetDate: '',
    };
    setData([...data, newRow]);
  };

  const getApiData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/user/Emission_user_DP?entity_Id=${user.entity_Id}`
      );
      const data = response?.response;
      const facilitiesWithNoUsers = data?.mapped_users?.filter(
        (facility: any) => facility?.authorised_users?.length === 0
      );

      // Set the facility objects with both facility_Id and facility_Name
      const facilities = facilitiesWithNoUsers?.map((facility: any) => ({
        facility_Id: facility?.facility_Id,
        facility_Name: facility?.facility_Name,
      }));
      setFacility(facilities); // Store the full facility objects
      SetUser(data?.unmapped_users);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const resetDataSources = () => {
    setData([
      {
        key: 1,
        no: 1,
        organization: user.entity_name,
        facility: '',
        user: '',
        targetDate: '',
      },
    ]);
  };

  const handleRemoveRow = (key: number) => {
    if (key === 1) {
      // Prevent removing the first row
      return;
    }
    setData(
      (prevData: any) => prevData.filter((item: any) => item.key !== key) // Filter out the row with the matching key
    );
  };

  const columnsProvider = [
    {
      title: 'Facility',
      dataIndex: 'facility',
      key: 'facility',
      render: (text: any, record: any) => {
        const selectedFacility = data[Number(record?.key) - 1]?.facility;

        // Function to filter out previously selected facilities
        const filterFacilities = (facilityList: any) => {
          if (!facilityList || !Array.isArray(facilityList)) return [];
          return facilityList.filter((facility: any) => {
            return !data.some(
              (item: any) =>
                item.key !== record.key &&
                item.facility === facility.facility_Id
            );
          });
        };

        // Check if 'Facility' and 'data' are valid and filter
        const filteredFacilities = filterFacilities(Facility);

        return (
          <Select
            style={{ width: 240 }}
            className={Styles.selectNew}
            onChange={(value) => handleFacilityChange(value, record.key)}
            value={selectedFacility}
          >
            {filteredFacilities?.map((facility: any) => (
              <Option key={facility?.facility_Id} value={facility?.facility_Id}>
                {facility?.facility_Name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text: any, record: any) => (
        <Select
          mode="multiple"
          style={{ width: 240 }}
          className={Styles.selectNew}
          onChange={(value) => handleUserChange(value, record.key)}
          value={data[Number(record?.key) - 1]?.user || []}
        >
          {User?.map((ele: any) => (
            <Option key={ele?.auth_Id} value={ele?.auth_Id}>
              {ele?.userName}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Target Date',
      dataIndex: 'targetDate',
      key: 'targetDate',
      render: (text: any, record: any) => (
        <DatePicker
          style={{ width: 240 }}
          className={Styles.selectNew}
          format="DD-MM-YYYY"
          onChange={(date, dateString) =>
            handleDateChange(date, dateString, record.key)
          }
          value={
            data[Number(record?.key) - 1]?.targetDate
              ? data[Number(record?.key) - 1]?.targetDate
              : null
          }
          disabledDate={(current) =>
            current && current < moment().startOf('day')
          }
        />
      ),
    },
    {
      title: <span style={{ fontFamily: 'Arial' }}>Action</span>,
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, rowIndex: any) => (
        <>
          <CloseCircleOutlined
            className="text-danger user-select-all"
            onClick={() => {
              if (record.key) {
                handleRemoveRow(record.key);
              }
            }}
          />
        </>
      ),
    },
  ];

  const isFormValid = () => {
    return data.every(
      (item: any) => item.facility && item.user && item.targetDate
    );
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(!isFormValid());
  }, [data]);

  return (
    <>
      <div className={Styles.tableMargin}>
        <Row justify="end" align="top" gutter={[0, 15]}>
          <Col>
            <ButtonComponent
              hierarchy="secondary-gray"
              size="xl"
              onClick={handleAddRow}
            >
              Add Row
            </ButtonComponent>
          </Col>
          <Col span={24}>
            <TableComponent
              data={data}
              columnHeader={columnsProvider}
              enableRowSelection={false}
              isRowExpand={false}
              showOnlyCount={true}
            />
          </Col>
          <Col>
            <div className={Styles.submitBtn}>
              <ButtonComponent
                hierarchy="tertiary"
                size="xl"
                style={{ marginRight: '10px' }}
                onClick={resetDataSources}
              >
                Reset
              </ButtonComponent>
              <ButtonComponent
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Submit
              </ButtonComponent>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProviderMapping;
