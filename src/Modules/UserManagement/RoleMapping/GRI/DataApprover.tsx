import { Spin } from 'antd';
import moment from 'moment';
import { isEmpty } from '../../../../Utils/isEmpty';
import { TableComponent } from '../../../../DesignLibrary';
import EditIcon from '../../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';
const DataApprover = ({ data, loading, tabKey }: any) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: 'Frameworks',
      dataIndex: 'frameworks',
      key: 'frameworks',
      render: (value: any, record: any) => {
        return <div style={{ width: 230 }}>GRI</div>;
      },
    },
    {
      title: 'Level 1',
      dataIndex: 'L1',
      key: 'L1',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 230 }}>
            {record?.L1?.map(
              (e: any, index: any) =>
                `${e?.userName}${record?.L1?.length - 1 !== index ? '; ' : ''}`
            )}
          </div>
        );
      },
    },
    {
      title: 'Level 2',
      dataIndex: 'level2',
      key: 'level2',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 230 }}>
            {record?.L2?.map(
              (e: any, index: any) =>
                `${e?.userName}${record?.L2?.length - 1 !== index ? '; ' : ''}`
            )}
          </div>
        );
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'targetDate',
      key: 'targetDate',
      render: (value: any, record: any) => {
        return (
          <div>
            {!isEmpty(record?.target_date) &&
              moment(record?.target_date).format('DD-MM-YYYY')}
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
          return null;
        }
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/edit-user-compliance-approver', {
                state: { data: record, tabKey: tabKey },
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

export default DataApprover;
