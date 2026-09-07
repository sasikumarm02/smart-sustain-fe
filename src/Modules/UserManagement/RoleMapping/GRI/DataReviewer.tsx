import { TableComponent } from '../../../../DesignLibrary';
import { Spin } from 'antd';
import moment from 'moment';
import { isEmpty } from '../../../../Utils/isEmpty';
import EditIcon from '../../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';

const DataReviewer = ({ data, loading, tabKey }: any) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: 'Material Topic',
      dataIndex: 'material_topic',
      key: 'material_topic',
    },
    {
      title: 'Level 1',
      dataIndex: 'L1',
      key: 'L1',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 230 }}>
            {!isEmpty(record?.L1) &&
              record?.L1?.map(
                (e: any, index: any) =>
                  `${e?.userName}${record?.L1?.length - 1 !== index ? '; ' : ''}`
              )}
          </div>
        );
      },
    },
    {
      title: 'Level 2',
      dataIndex: 'L2',
      key: 'L2',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 230 }}>
            {!isEmpty(record?.L2) &&
              record?.L2?.map(
                (e: any, index: any) =>
                  `${e?.userName}${record?.L2?.length - 1 !== index ? '; ' : ''}`
              )}
          </div>
        );
      },
    },
    {
      title: 'Level 3',
      dataIndex: 'L3',
      key: 'L3',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 230 }}>
            {!isEmpty(record?.L3) &&
              record?.L3?.map(
                (e: any, index: any) =>
                  `${e?.userName}${record?.L3?.length - 1 !== index ? '; ' : ''}`
              )}
          </div>
        );
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
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
              navigate('/edit-user-compliance-reviewer', {
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
        data={data ? data : []}
        columnHeader={columns}
        enableRowSelection={false}
        isRowExpand={false}
        showOnlyCount={true}
      />
    </LoaderComponent>
  );
};

export default DataReviewer;
