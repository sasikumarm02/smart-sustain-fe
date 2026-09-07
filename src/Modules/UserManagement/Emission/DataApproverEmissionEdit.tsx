import { DatePicker, message, Row, Select, Spin } from 'antd';
import { ButtonComponent, TableComponent } from '../../../DesignLibrary';
import Styles from './mapping.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UseTable from '../../../Components/content/UseTable';
import { useAuth } from '../../../Hooks/useAuth';
import { isEmpty } from '../../../Utils/isEmpty';
import { apiBaseUrl, get, post, put } from '../../../Services';
import moment from 'moment';
import { PageCardComponent, ModalComponent } from '../../../DesignLibrary';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const { Option } = Select;

const DataApproverEmissionEdit = () => {
  const [User, SetUser] = useState([]);
  const location = useLocation();
  const tabkeyEdit = location?.state?.tabkey;
  const { user } = useAuth();
  const [data, setData] = useState<any>([
    {
      key: 1,
      no: 1,
      frameworks: user.entity_name,
      L1: [],
      L2: [],
      target_date: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = data.map((obj: any) => {
        return {
          entity_Id: user.entity_Id,
          role: {
            L1: obj.L1.map((l1User: any) => l1User.auth_Id),
            L2: obj.L2.map((l2User: any) => l2User.auth_Id),
          },
          target_date: obj?.target_date,
        };
      });
      const response = await put(
        `${apiBaseUrl}/user/edit_roles_to_data_approver/`,
        payload
      );
      message.success(response?.message);
      navigate(`/role-mapping-emission`, { state: tabkeyEdit });
    } catch (err: any) {
      console.log(err);
      setErrMsg(err?.response?.data?.message);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (updatedData: any) => {
    const isValid = updatedData.every(
      (item: any) => item.L1.length > 0 && item.target_date
    );
    setIsFormValid(isValid);
  };

  const handleDateChange = (date: any, dateString: any, key: number) => {
    setIsFormChanged(true);

    const updatedData = data.map((item: any) => {
      if (item.entity_Id === key) {
        return { ...item, target_date: date ? date.toISOString() : '' };
      }
      return item;
    });
    setData(updatedData);
    validateForm(updatedData);
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
      } else if (level === 'L2') {
        updatedItem.L1 = updatedItem.L1.filter(
          (user: any) => !value.includes(user.auth_Id)
        );
      }

      return updatedItem;
    });

    setData(updatedData);
    validateForm(updatedData);
  };

  const settingEditData = () => {
    if (location.state && location.state.data) {
      const existingData = location.state.data;
      setData([existingData]);
      const combinedUser: any = [
        ...existingData?.unmapped_users,
        ...existingData?.L1,
        ...existingData?.L2,
      ];
      SetUser(combinedUser || []);
    }
  };

  useEffect(() => {
    settingEditData();
  }, [location.state]);

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
        const updatedArr = userArray.filter((user1: any) => {
          return !record.L2.some(
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
            value={record?.L1?.map((l1Item: any) => l1Item.auth_Id)}
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
        const userArray = [...User];
        const updatedArr = userArray.filter((user1: any) => {
          return !record.L1.some(
            (l1User: any) => l1User.auth_Id === user1.auth_Id
          );
        });
        return (
          <Select
            mode="multiple"
            style={{ width: 200 }}
            className={Styles.selectNew}
            onChange={(value: any) =>
              handleLevelChange(value, 'L2', record.key)
            }
            value={record?.L2?.map((l2Item: any) => l2Item.auth_Id)}
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
              handleDateChange(date, dateString, record.entity_Id)
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
              onClick={handleSubmit}
              disabled={!isFormChanged || !isFormValid}
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

export default DataApproverEmissionEdit;
