import { Spin, Image } from 'antd';
import moment from 'moment';
import { TableComponent } from '../../../DesignLibrary';
import EditIcon from '../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../../../Utils/isEmpty';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const DataProvider = ({ data, loading, tabkey }: any) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: 'Facility',
      dataIndex: 'facility_Name',
      key: 'facility_Name',
    },
    {
      title: 'User',
      dataIndex: 'authorised_users',
      key: 'authorised_users',
      render: (value: any, record: any) => {
        // Join usernames of all authorized users
        const userNames = record?.authorised_users
          ?.map((user: any) => user.userName)
          .join('; ');
        return <div>{userNames || ''}</div>; // Handle empty users gracefully
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      render: (value: any, record: any) => {
        return (
          <div>
            {record?.target_date &&
              moment(record.target_date).format('DD-MM-YYYY')}
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'targetDate',
      key: 'targetDate',
      render: (value: any, record: any) => {
        // Check if `authorised_users` is not empty
        if (
          !record?.authorised_users ||
          record?.authorised_users?.length === 0
        ) {
          return null; // Do not display anything if no users
        }
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/edit-role-mapping-emission-provider', {
                state: { data: record, tabkey: tabkey },
              });
            }}
          >
            <EditIcon />
          </div>
        );
      },
    },
  ];

  return (
    <LoaderComponent spinning={loading}>
      <TableComponent
        data={data}
        columnHeader={columns}
        enableRowSelection={false}
        isRowExpand={false}
        showOnlyCount={true}
      />
    </LoaderComponent>
  );
};

export default DataProvider;
