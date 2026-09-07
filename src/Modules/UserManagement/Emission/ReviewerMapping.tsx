import { DatePicker, message, Row, Select, Spin } from 'antd';
import { ButtonComponent, TableComponent } from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../../Hooks/useAuth';
import { isEmpty } from '../../../Utils/isEmpty';
import { apiBaseUrl, get, post } from '../../../Services';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const { Option } = Select;

const Reviewermapping = ({ tabkey }: any) => {
  const [User, SetUser] = useState([]);
  const { user } = useAuth();
  const [data, setData] = useState<any>([
    {
      key: 1,
      no: 1,
      organization: user.entity_name,
      L1: [],
      L2: [],
      L3: [],
      targetDate: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [approverCheck, setApproverCheck] = useState<boolean>(false);

  const [selectedLevels, setSelectedLevels] = useState({
    L1: [],
    L2: [],
    L3: [],
  });

  const columnsReview = [
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
        const userArr = User;
        const updatedArr = userArr.filter((user1: any) => {
          return (
            !record?.L2?.includes(user1?.auth_Id) &&
            !record?.L3?.includes(user1?.auth_Id)
          );
        });
        return (
          <Select
            mode="multiple"
            style={{ width: 180 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L1', record.key)
            }
            value={data[Number(record?.key) - 1]?.L1}
          >
            {updatedArr &&
              updatedArr?.map((levelone: any) => (
                <Option key={levelone?.auth_Id} value={levelone?.auth_Id}>
                  {levelone?.name}
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
        const userArr = User;
        const updatedArr = userArr.filter((user1: any) => {
          return (
            !record?.L1?.includes(user1?.auth_Id) &&
            !record?.L3?.includes(user1?.auth_Id)
          );
        });
        return (
          <Select
            mode="multiple"
            style={{ width: 180 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L2', record.key)
            }
            value={data[Number(record?.key) - 1]?.L2}
          >
            {updatedArr &&
              updatedArr?.map((leveltwo: any) => (
                <Option key={leveltwo?.auth_Id} value={leveltwo?.auth_Id}>
                  {leveltwo?.name}
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
        const userArr = User;
        const updatedArr = userArr.filter((user1: any) => {
          return (
            !record?.L1?.includes(user1?.auth_Id) &&
            !record?.L2?.includes(user1?.auth_Id)
          );
        });
        return (
          <Select
            mode="multiple"
            style={{ width: 180 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L3', record.key)
            }
            value={data[Number(record?.key) - 1]?.L3}
          >
            {updatedArr &&
              updatedArr?.map((levelthree: any) => (
                <Option key={levelthree?.auth_Id} value={levelthree?.auth_Id}>
                  {levelthree?.name}
                </Option>
              ))}
          </Select>
        );
      },
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
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = data.map((obj: any) => {
        return {
          entity_Id: user.entity_Id,
          role: {
            L1: obj.L1,
            L2: obj.L2,
            L3: obj.L3,
          },
          target_date: obj?.targetDate,
        };
      });
      const response = await post(
        `${apiBaseUrl}/user/create_emission_users_DR/`,
        payload
      );
      message.success(response?.message);
      navigate(`/role-mapping-emission`, { state: tabkey });
    } catch (err: any) {
      console.log(err);
      message.error(err?.response?.data?.message);
    }
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

  const handleLevelChange = (value: string, level: string, key: number) => {
    const newData = data.map((item: any) => {
      if (item.key == key) {
        return { ...item, [level]: value };
      }
      return item;
    });
    setData(newData);
    setSelectedLevels((prevLevels) => ({ ...prevLevels, [level]: value }));
  };

  const getApiData = async () => {
    try {
      setLoading(true);
      const responseData = await get(
        `${apiBaseUrl}/user/Emission_user_DR_DA?entity_Id=${user.entity_Id}&role=DATA_REVIEWER`
      );
      const data = responseData?.response?.data;
      SetUser(data[0]?.unmapped_users || []);
      if (
        responseData?.response?.data[0]?.L1?.length > 0 &&
        !isEmpty(responseData?.response?.data[0]?.target_date)
      ) {
        setApproverCheck(true);
      }
    } catch (err) {
      console.log(err);
      SetUser([]);
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
        L1: [],
        L2: [],
        L3: [],
        targetDate: '',
      },
    ]);
  };

  const isFormValid = () => {
    return data.every((item: any) => item.L1 && item.targetDate);
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  useEffect(() => {
    setIsSubmitDisabled(!isFormValid());
  }, [data]);

  return (
    <>
      <LoaderComponent spinning={loading}>
        <div>
          {approverCheck ? (
            <>
              <div className={Styles.daApproved}>
                <div className={Styles.daApprovedTitle}>
                  You Cannot Map User
                </div>
              </div>
              <div className={Styles.daApproved}>
                <div className={Styles.daApprovedSubTitle}>
                  Data Reviewer has been already assigned
                </div>
              </div>
            </>
          ) : (
            <TableComponent
              data={data}
              columnHeader={columnsReview}
              enableRowSelection={false}
              isRowExpand={false}
              showOnlyCount={true}
            />
          )}
        </div>
        {!approverCheck && (
          <Row className={Styles.submitBtn} justify={'end'}>
            <ButtonComponent
              hierarchy="tertiary"
              size="xl"
              style={{ marginRight: '10px', marginTop: '15px' }}
              onClick={resetDataSources}
            >
              Reset
            </ButtonComponent>
            <ButtonComponent onClick={handleSubmit} disabled={isSubmitDisabled}>
              Submit
            </ButtonComponent>
          </Row>
        )}
      </LoaderComponent>
    </>
  );
};

export default Reviewermapping;
