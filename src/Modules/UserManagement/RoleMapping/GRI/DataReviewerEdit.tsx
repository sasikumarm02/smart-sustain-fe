import { useReducer } from 'react';
import { DatePicker, Row, Col, Select, Spin, Flex, message } from 'antd';
import {
  PageCardComponent,
  ButtonComponent,
  ModalComponent,
  TableComponent,
} from '../../../../DesignLibrary';
import Styles from '../mapping.module.scss';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UseTable from '../../../../Components/content/UseTable';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { GetProps } from 'antd';
import { apiBaseUrl, get, post, put } from '../../../../Services';
import { useAuth } from '../../../../Hooks/useAuth';
import { isEmpty } from '../../../../Utils/isEmpty';
import { useNotification } from '../../../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';

dayjs.extend(customParseFormat);

const { Option } = Select;

const DataReviewerEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabKey } = location?.state ? location?.state : '1';
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
      material_topic: [],
      L1: [],
      L2: [],
      L3: [],
      target_date: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { openToast } = useNotification();

  const settingEditData = () => {
    const existingData = location?.state?.data;

    setData([existingData]);
    const combinedUser: any = [
      ...(existingData?.unmapped_user || []),
      ...(existingData?.L1 || []),
      ...(existingData?.L2 || []),
      ...(existingData?.L3 || []),
    ];
    SetUser(combinedUser);
  };

  useEffect(() => {
    settingEditData();
  }, [location.state]);

  const validateForm = (updatedData: any) => {
    // Check if all entries have L1 and target_date filled
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

  const columnsReviewer = [
    {
      title: 'Material Topic',
      dataIndex: 'material_topic',
      key: 'material_topic',
      render: (value: any, record: any) => {
        return <div style={{ width: 230 }}>{record?.material_topic?.[0]}</div>;
      },
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
                {user.userName}
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
                {user.userName}
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

  const submitReviewer = async () => {
    try {
      setLoading(true);
      const payload = data.map((obj: any) => ({
        entity_Id: user.entity_Id,
        role: {
          L1: obj.L1.map((l1User: any) => l1User.auth_Id),
          L2: obj.L2.map((l2User: any) => l2User.auth_Id),
          L3: obj.L3.map((l3User: any) => l3User.auth_Id),
        },
        target_date: obj.target_date,
        material_topic: obj.material_topic,
        subtopic: obj.subtopic,
      }));
      const response = await put(`${apiBaseUrl}/user/GRI_DR_EDIT/`, payload);
      message.success(response?.message);
      navigate(`/role-mapping-compliance`, { state: { currentTab: tabKey } });
    } catch (err: any) {
      setErrMsg(err?.response?.data?.message);
      setIsOpen(true);
      // message.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    submitReviewer();
  };

  return (
    <>
      {/* <div className={Styles.Heading}>User Role Mapping</div> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
        {/* <Row justify="space-between" className={Styles.subHeading}>
          Reporting Compliance - Map User
        </Row> */}

        <LoaderComponent spinning={loading}>
          <div>
            <TableComponent
              data={data}
              columnHeader={columnsReviewer}
              enableRowSelection={false}
              isRowExpand={false}
              showOnlyCount={true}
            />
          </div>
          <Row className={Styles.editSubmitBtn} justify={'end'}>
            <ButtonComponent
              // disabled={!isFormComplete()}
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

export default DataReviewerEdit;
