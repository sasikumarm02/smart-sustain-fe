import { TableComponent } from '../../../DesignLibrary';
import { useAuth } from '../../../Hooks/useAuth';
import { Spin, Image } from 'antd';
import moment from 'moment';
import EditIcon from '../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../../../Utils/isEmpty';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const DataApprover = ({ data, loading, tabkey }: any) => {
  const navigate = useNavigate();
  const columns = [
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
      // render: (L1: any) =>
      //   Array.isArray(L1) && L1.length > 0
      //     ? L1.map((item: any, index: number) => (
      //         <div key={index}>{item.name}</div>
      //       ))
      //     : '',
      render: (L1: any) =>
        Array.isArray(L1) && L1.length > 0
          ? L1.map((item: any) => item.name).join('; ')
          : '',
    },
    {
      title: 'Level 2',
      dataIndex: 'L2',
      key: 'L2',
      render: (L2: any) =>
        Array.isArray(L2) && L2.length > 0
          ? L2.map((item: any) => item.name).join('; ')
          : '',
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
        if (isEmpty(record?.target_date) || isEmpty(record?.L1)) {
          return '';
        }
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/edit-role-mapping-emission-approver', {
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

  const { user } = useAuth();

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

export default DataApprover;
