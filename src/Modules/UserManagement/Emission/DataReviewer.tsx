import { Spin } from 'antd';
import { useAuth } from '../../../Hooks/useAuth';
import moment from 'moment';
import { TableComponent } from '../../../DesignLibrary';
import EditIcon from '../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from '../../../Utils/isEmpty';
import LoaderComponent from '../../../DesignLibrary/LoaderComponent';

const DataReviewer = ({ data, loading, tabkey }: any) => {
  const { user } = useAuth();
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
      title: 'Level 3',
      dataIndex: 'L3',
      key: 'L3',
      render: (L3: any) =>
        Array.isArray(L3) && L3.length > 0
          ? L3.map((item: any) => item.name).join('; ')
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
      dataIndex: 'Action',
      key: 'Action',
      render: (value: any, record: any) => {
        if (isEmpty(record?.target_date) || isEmpty(record?.L1)) {
          return '';
        }
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/edit-role-mapping-emission-reviewer', {
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

export default DataReviewer;
