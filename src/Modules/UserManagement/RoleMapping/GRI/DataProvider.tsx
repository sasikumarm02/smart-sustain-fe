// DataProvider.tsx
import { Spin, Image } from 'antd';
import moment from 'moment';
import { isEmpty } from '../../../../Utils/isEmpty';
import { TableComponent } from '../../../../DesignLibrary';
import EditIcon from '../../../../assets/Svg/User/EditIcon';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';

const DataProvider = ({ data, loading, tabKey }: any) => {
  const navigate = useNavigate();

  const handleEdit = (record: any) => {
    navigate('/edit-user-compliance-provider', {
      state: { data: record, tabKey: tabKey },
    });
  };

  const columns = [
    {
      title: 'Material Topic',
      dataIndex: 'material_topic',
      key: 'material_topic',
    },
    {
      title: 'Sub Topics',
      dataIndex: 'subtopic',
      key: 'subtopic',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 350 }}>
            {record.subtopic &&
              record.subtopic?.map((e: any) => <div key={e}>{e}</div>)}
          </div>
        );
      },
    },
    {
      title: 'Data Provider',
      dataIndex: 'mapped_user',
      key: 'mapped_user',
      render: (value: any, record: any) => {
        return (
          <div>
            {record.mapped_user &&
              record.mapped_user?.map(
                (e: any, index: any) =>
                  `${e?.userName}${record?.mapped_user?.length - 1 !== index ? '; ' : ''}`
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
      dataIndex: 'Action',
      key: 'Action',
      render: (value: any, record: any) => {
        if (isEmpty(record?.target_date) || isEmpty(record?.mapped_user)) {
          return '';
        }
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => handleEdit(record)}>
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

export default DataProvider;
