import { Row } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import styles from './issb.module.scss';
import EditIcon from '../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import { get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useEffect, useState } from 'react';
import { isEmpty } from '../../../Utils/isEmpty';
import moment from 'moment';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const ISSB = () => {
  const Navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [users, setusers] = useState<[]>();
  const { user } = useAuth();
  const getApiData = async () => {
    try {
      setLoading(true);
      const data = await get(
        `user/get_ISSB_Users/?entity_Id=${user.entity_Id}`
      );
      const mapped_user = data?.response?.data?.mapped_users;
      if (!isEmpty(mapped_user)) {
        setusers(mapped_user);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const handleEditClick = (record: any) => {
    Navigate('/issb-role-mapping-edit', {
      state: {
        record,
      },
    });
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

  const allUsernamesFilled = users?.every(
    (user: any) => !isEmpty(user.userName)
  );

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
      render: (text: any, record: any) => {
        const formattedText = text
          ?.replace(/_/g, ' ')
          .replace('L1', '')
          .split(' ')
          .map(
            (word: any) =>
              word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
          )
          .join(' ');

        return <div className={styles.editBtnStyle}>{formattedText}</div>;
      },
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: any, record: any) => (
        <div className={styles.editBtnStyle}>{`${text} `}</div>
      ),
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      defaultSortOrder: 'descend',
      render: (text: any, record: any) => (
        <div>{!isEmpty(text) && moment(text).format('DD-MM-YYYY')}</div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'action',
      render: (text: any, record: any) =>
        record?.userName?.length !== 0 && (
          <div
            className={styles.editBtnStyle}
            onClick={() => handleEditClick(record)}
          >
            <EditIcon />
          </div>
        ),
    },
  ];

  return (
    <PageCardComponent className={styles.pageCardStyle}>
      <LoaderComponent spinning={isLoading}>
        <Row justify={'end'}>
          <ButtonComponent
            onClick={() => Navigate('/issb-role-mapping-form')}
            hierarchy="secondary-gray"
            disabled={allUsernamesFilled}
          >
            Map User &nbsp; +
          </ButtonComponent>
        </Row>
        <Row style={{ marginTop: '15px' }}>
          <TableComponent
            isRowExpand={false}
            data={users ? users : []}
            enableRowSelection={false}
            columnHeader={ISSBCols}
            showOnlyCount={false}
            columnCheckBoxDataAttribute="key"
          ></TableComponent>
        </Row>
      </LoaderComponent>
    </PageCardComponent>
  );
};

export default ISSB;
