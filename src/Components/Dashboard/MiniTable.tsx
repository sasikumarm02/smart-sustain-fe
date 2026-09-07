import { Card, Table } from 'antd';
import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const MiniTable = ({ header, dataSource }: any) => {
  const columns = Object.keys(dataSource[0])
    .filter((key) => key !== 'key')
    .map((key) => ({
      dataIndex: key,
      title: key,
    }));

  return (
    <>
      <Card style={{ marginTop: '10px' }}>
        {header ? (
          <h3 style={{ background: '#EEE3FC', padding: '15px' }}>{header}</h3>
        ) : null}

        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          // title={() => "Header"}
          bordered
          showHeader={false} // Hide default header
        />
      </Card>
    </>
  );
};

export default MiniTable;
