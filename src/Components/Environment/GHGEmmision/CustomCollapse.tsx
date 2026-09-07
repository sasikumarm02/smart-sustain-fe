import { Button, Col, Collapse, Input, Row, Table } from 'antd';
import { useState } from 'react';
import './ExpandTable.css';
import styles from './ExpandTable.module.scss';
import { ReactComponent as File } from '../../../assets/Svg/file_attachement.svg';
import { ReactComponent as Edit } from '../../../assets/Svg/edit.svg';
import { DeleteOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Key } from 'antd/lib/table/interface';
import dashStyles from '../../../Modules/UserScreen/dashboard.module.scss';

const { Panel } = Collapse;

interface DetailType {
  key: string;
  sNo: number;
  VehicleType: string;
  FuelType: string;
  UOM: string;
  Year: number;
  Quantity: number;
}

interface DataType {
  key: string;
  sNo: string;
  VehicleType: string;
  FuelType: string;
  UOM: string;
  Year: string;
  Quantity: string;
  details?: DetailType[];
}

export const ExpandableTable = ({ column, data }: any) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

  const handleExpand = (record: any) => {
    const isExpanded = expandedRowKeys.includes(record.key);
    let newExpandedRowKeys: React.Key[];

    if (isExpanded) {
      newExpandedRowKeys = expandedRowKeys.filter((key) => key !== record.key);
    } else {
      newExpandedRowKeys = [...expandedRowKeys, record.key];
    }

    setExpandedRowKeys(newExpandedRowKeys);
  };

  const addKeyToData = data.map((item: any, index: any) => {
    return {
      ...item,
      key: `${index + 1}`,
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys: Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
    selectedRowKeys,
  };

  return (
    <>
      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        scroll={{ x: 800 }}
        dataSource={addKeyToData}
        columns={column}
        expandable={{
          expandedRowRender: (record) => (
            <Collapse>
              {record.details && Array.isArray(record.details) ? (
                <div className={styles.table}>
                  <span className={styles.buttons}>
                    <Button className={styles.button}>
                      <p>
                        <File /> Image.jpeg
                      </p>
                    </Button>
                    <Button className={styles.button}>
                      <p>
                        <Edit /> Edit
                      </p>
                    </Button>
                    <Button icon={<DeleteOutlined />} className={styles.button}>
                      Delete
                    </Button>
                  </span>
                  <span className={styles.inputBox}>
                    <h6>Comments</h6>
                    <Input.TextArea />
                  </span>
                  <span className={styles.save}>
                    <Button
                      style={{ backgroundColor: '#00338D', color: 'white' }}
                    >
                      Save
                    </Button>
                  </span>
                  {record.details.map((detail) => (
                    <>
                      <Row>
                        <Col span={6}></Col>
                        <Col span={6}></Col>
                      </Row>
                    </>
                  ))}
                </div>
              ) : (
                <p>No details available</p>
              )}
            </Collapse>
          ),
          rowExpandable: (record) => true,
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => handleExpand(record),
        }}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleExpand(record),
        })}
        className={dashStyles.tableCss}
      />
    </>
  );
};
