import { DatePicker, message, Row, Select } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import styles from './issb.module.scss';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useEffect, useState } from 'react';
import { isEmpty } from '../../../Utils/isEmpty';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';
dayjs.extend(customParseFormat);

const ISSBMappingForm = () => {
  const { Option } = Select;

  interface unMappeduserType {
    auth_Id: string;
    userName: string;
  }

  interface mappedUser {
    auth_Id: string[];
    entity_Id: string;
    target_date: string;
    role: string;
    userName: string[];
  }

  const Navigate = useNavigate();
  const { user } = useAuth();
  const [unMappeduser, setunMappeduser] = useState<unMappeduserType[]>();
  const [mappedUser, setMappedUser] = useState<mappedUser[]>();
  const [dpData, setDpdata] = useState<string[]>([]);
  const [drData, setDrdata] = useState<string[]>([]);
  const [daData, setDaData] = useState<string>('');
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [isFormModified, setIsFormModified] = useState<boolean>(false);
  const [dateData, setDate] = useState<any>({
    DP: '',
    DR: '',
    DA: '',
  });
  const [submitBtnState, setSubmitBtnState] = useState(true);

  const getApiData = async () => {
    try {
      const response = await get(
        `user/get_ISSB_Users/?entity_Id=${user.entity_Id}`
      );

      const data = response?.response?.data;
      if (!isEmpty(data)) {
        setunMappeduser(data?.unmapped_users);
        setMappedUser(data?.mapped_users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateData = (
    dpData: any,
    daData: any,
    drData: any,
    dateData: any
  ) => {
    if (
      (dateData?.DP === '' && dpData?.length >= 1) ||
      (dateData?.DP !== '' && dpData?.length <= 0)
    ) {
      setSubmitBtnState(true);
    } else if (
      (dateData?.DR === '' && drData?.length >= 1) ||
      (dateData?.DR !== '' && drData?.length <= 0)
    ) {
      setSubmitBtnState(true);
    } else if (
      (dateData?.DA === '' && daData != '') ||
      (dateData?.DA !== '' && daData === '')
    ) {
      setSubmitBtnState(true);
    } else {
      setSubmitBtnState(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const handleUserChange = (type: string, data: any) => {
    setIsFormModified(true);
    if (type === 'DP') {
      const dpData = data;
      setDpdata(data);
      validateData(dpData, daData, drData, dateData);
    } else if (type === 'DR') {
      const drData = data;
      setDrdata(data);
      validateData(dpData, daData, drData, dateData);
    } else if (type === 'DA') {
      const daData = data;
      setDaData(data);
      validateData(dpData, daData, drData, dateData);
    }
  };

  const handleDateChange = (type: string, data: any) => {
    setIsFormModified(true);
    if (type === 'DP') {
      const dateData = data;
      setDate(data);
      validateData(dpData, daData, drData, dateData);
    } else if (type === 'DR') {
      const dateData = data;
      setDate(data);
      validateData(dpData, daData, drData, dateData);
    } else if (type === 'DA') {
      const dateData = data;
      setDate(data);
      validateData(dpData, daData, drData, dateData);
    }
  };

  const dataTable = [
    {
      dataIndex: 'userRole',
      key: 'userRole',
      userRole: 'Data Provider',
    },
    {
      dataIndex: 'userRole',
      key: 'userRole',
      userRole: 'Data Reviewer',
    },
    {
      dataIndex: 'userRole',
      key: 'userRole',
      userRole: 'Data Approver',
    },
  ];

  const ISSBCols = [
    {
      title: 'S.No.',
      dataIndex: 'sNo',
      key: 'sNo',
      render: (text: any, record: any, index: any) => index + 1,
    },
    {
      title: 'User Role',
      dataIndex: 'userRole',
      key: 'userRole',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: any, record: any) => {
        if (record.uniqueId === 0)
          return (
            <Select
              onChange={(value) => {
                handleUserChange('DP', value);
              }}
              value={
                mappedUser && mappedUser[0]?.auth_Id.length > 0
                  ? mappedUser[0]?.userName
                  : dpData
              }
              mode="multiple"
              className={styles.selectNew}
              disabled={mappedUser && mappedUser[0]?.auth_Id.length > 0}
              style={{ width: 240 }}
            >
              {unMappeduser?.map(
                (ele: any) =>
                  daData !== ele?.auth_Id &&
                  drData?.find((val) => val === ele?.auth_Id) === undefined && (
                    <Option key={ele?.auth_Id} value={ele?.auth_Id}>
                      {ele?.userName}
                    </Option>
                  )
              )}
            </Select>
          );
        else if (record.uniqueId === 1)
          return (
            <Select
              style={{ width: 240 }}
              className={styles.selectNew}
              mode="multiple"
              value={
                mappedUser && mappedUser[1]?.auth_Id.length > 0
                  ? mappedUser[1]?.userName
                  : drData
              }
              disabled={mappedUser && mappedUser[1]?.auth_Id.length > 0}
              onChange={(value) => {
                if (value?.length > 2) {
                  message.warning(
                    'You can not select more than 2 option for data reveiwer'
                  );
                } else {
                  handleUserChange('DR', value);
                }
              }}
            >
              {unMappeduser?.map(
                (ele: any) =>
                  dpData?.find((val) => val === ele?.auth_Id) === undefined &&
                  daData !== ele?.auth_Id && (
                    <Option key={ele?.auth_Id} value={ele?.auth_Id}>
                      {ele?.userName}
                    </Option>
                  )
              )}
            </Select>
          );
        else if (record.uniqueId === 2)
          return (
            <Select
              style={{ width: 240 }}
              className={styles.selectNew}
              onChange={(value) => {
                handleUserChange('DA', value);
              }}
              allowClear
              disabled={mappedUser && mappedUser[2]?.auth_Id.length > 0}
              value={
                mappedUser && mappedUser[2]?.auth_Id.length > 0
                  ? mappedUser[2]?.userName
                  : daData
              }
            >
              {unMappeduser?.map(
                (ele: any) =>
                  dpData?.find((val) => val === ele?.auth_Id) === undefined &&
                  drData?.find((val) => val === ele?.auth_Id) === undefined && (
                    <Option key={ele?.auth_Id} value={ele?.auth_Id}>
                      {ele?.userName}
                    </Option>
                  )
              )}
            </Select>
          );
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'TargetData',
      key: 'TargetData',
      defaultSortOrder: 'descend',
      render: (text: any, record: any) => (
        <DatePicker
          style={{ width: 200 }}
          format="DD-MM-YYYY"
          disabled={
            record?.uniqueId === 0
              ? mappedUser && !isEmpty(mappedUser[0]?.target_date)
              : record?.uniqueId === 1
                ? mappedUser && !isEmpty(mappedUser[1]?.target_date)
                : mappedUser && !isEmpty(mappedUser[2]?.target_date)
          }
          disabledDate={(current) =>
            current && current < moment().startOf('day')
          }
          value={
            record?.uniqueId === 0
              ? mappedUser && !isEmpty(mappedUser[0]?.target_date)
                ? dayjs(mappedUser[0]?.target_date, 'YYYY-MM-DD') // Assuming target_date is in ISO format
                : dateData.DP !== ''
                  ? dayjs(dateData.DP, 'DD-MM-YYYY') // Parse the dateData.DP directly
                  : null
              : record?.uniqueId === 1
                ? mappedUser && !isEmpty(mappedUser[1]?.target_date)
                  ? dayjs(mappedUser[1]?.target_date, 'YYYY-MM-DD')
                  : dateData.DR !== ''
                    ? dayjs(dateData.DR, 'DD-MM-YYYY')
                    : null
                : mappedUser && !isEmpty(mappedUser[2]?.target_date)
                  ? dayjs(mappedUser[2]?.target_date, 'YYYY-MM-DD')
                  : dateData.DA !== ''
                    ? dayjs(dateData.DA, 'DD-MM-YYYY')
                    : null
          }
          onChange={(date, dateString) => {
            if (record?.uniqueId === 0) {
              handleDateChange('DP', {
                DP: dateString,
                DR: dateData?.DR,
                DA: dateData?.DA,
              });
            } else if (record?.uniqueId === 1) {
              handleDateChange('DR', {
                DP: dateData?.DP,
                DR: dateString,
                DA: dateData?.DA,
              });
            } else if (record?.uniqueId === 2) {
              handleDateChange('DA', {
                DP: dateData?.DP,
                DR: dateData?.DR,
                DA: dateString,
              });
            }
          }}
        />
      ),
    },
  ];

  const handleReset = () => {
    setDaData('');
    setDrdata([]);
    setDpdata([]);
    setDate({
      DP: '',
      DR: '',
      DA: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setIsloading(true);
      let payload = [];
      if (dateData?.DP !== '' && dpData.length >= 1) {
        const isoFormat = moment(dateData?.DP, 'DD-MM-YYYY').toISOString();
        const obj = {
          auth_Id: dpData,
          entity_Id: user?.entity_Id,
          target_date: isoFormat,
          role: 'DATA_PROVIDER',
        };
        payload.push(obj);
      }
      if (dateData?.DR !== '' && drData.length >= 1) {
        const isoFormat = moment(dateData?.DR, 'DD-MM-YYYY').toISOString();
        const obj = {
          auth_Id: drData,
          entity_Id: user?.entity_Id,
          target_date: isoFormat,
          role: 'L1_DATA_REVIEWER',
        };
        payload.push(obj);
      }

      if (dateData?.DA !== '' && daData !== '') {
        const isoFormat = moment(dateData?.DA, 'DD-MM-YYYY').toISOString();
        const obj = {
          auth_Id: [daData],
          entity_Id: user?.entity_Id,
          target_date: isoFormat,
          role: 'L1_DATA_APPROVER',
        };
        payload.push(obj);
      }

      const response = await post(`/user/create_issb_user/`, payload);

      if (response.status === 'Success') {
        message.success(response.message);
        setIsloading(false);
        Navigate('/issb-role-mapping');
      }
    } catch (err) {
      console.error(err);
      message.error("ISSB user can't be created");
      setIsloading(false);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <PageCardComponent className={styles.pageCardStyle}>
      <LoaderComponent spinning={isLoading}>
        <Row>
          <TableComponent
            isRowExpand={false}
            data={dataTable}
            enableRowSelection={false}
            columnHeader={ISSBCols}
            showOnlyCount={false}
            columnCheckBoxDataAttribute="key"
          ></TableComponent>
        </Row>
        <Row justify={'end'} style={{ marginTop: '15px' }}>
          <ButtonComponent onClick={() => handleReset()} hierarchy="tertiary">
            Reset
          </ButtonComponent>
          <ButtonComponent
            disabled={submitBtnState || !isFormModified}
            style={{ marginLeft: '15px' }}
            onClick={() => handleSubmit()}
          >
            Submit
          </ButtonComponent>
        </Row>
      </LoaderComponent>
    </PageCardComponent>
  );
};

export default ISSBMappingForm;
