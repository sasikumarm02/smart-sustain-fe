import { Row, Col, Table, Button, Spin, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../Services';
import { useNotification } from '../../Hooks/useNotification';
import type { TableProps } from 'antd';
import moment from 'moment';
import Styles from '../../Modules/UserScreen/dashboard.module.scss';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import EditIcon from '../../assets/Svg/EditIcon';

const plusIcon = {
  width: '12px',
  height: '12px',
  verticalAlign: 'middle',
  padding: '0 5px',
};
const addCompanyButton = {
  //padding: "24px 32px ",
  borderRadius: '8px',
  border: '1px solid #00338D',
  color: '#00338D',
  fontSize: '14px',
  fontWeight: '400px',
  display: 'flex',
  alignItems: 'center',
};

interface DataType {
  key: string;
  entity_name: string;
  entity_Country: string;
  financial_year: string[];
  date_of_incorporation: string;
}

export default function AdminList() {
  const [data, setData] = React.useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { openToast } = useNotification();

  const handleEditClick = (record: any) => {
    navigate('/edit-company', {
      state: { record }, // Passing the record as state
    });
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Company Name',
      dataIndex: 'entity_name',
      key: 'entity_name',
      ellipsis: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Country',
      dataIndex: 'entity_Country',
      key: 'entity_Country',
    },
    {
      title: 'Reporting Period',
      dataIndex: 'financial_year',
      key: 'financial_year',
      ellipsis: true,
      render: (text: any, record: any, index: any) => {
        return (
          <div>
            {record.start_date.substring(0, 3)} -{' '}
            {record.end_date.substring(0, 3)}
            {/* {moment(record.start_date, "YYYY-MM-DD").format("DD-MM-YYYY")}{" "}
            <br /> {moment(record.end_date, "YYYY-MM-DD").format("DD-MM-YYYY")} */}
          </div>
        );
      },
    },
    {
      title: 'Date of Incorporation',
      dataIndex: 'date_of_incorporation',
      key: 'date_of_incorporation',
      render: (text: any, record: any, index: any) => (
        <div>
          {moment(record.date_of_incorporation, 'YYYY-MM-DD').format(
            'DD-MM-YYYY'
          )}
        </div>
      ),
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (text: any, record: any, index: any) => (
        <div>{moment(record.createdOn, 'YYYY-MM-DD').format('DD-MM-YYYY')}</div>
      ),
    },
    {
      title: 'Admin Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <EditIcon onClick={() => handleEditClick(record)} />
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    get('/entity/all_entity/')
      .then((res: any) => {
        if (res.response.status !== false) {
          setData(res.response.data);
        }
      })
      .catch((err) =>
        openToast({
          content: `${err?.message}`,
          type: 'error',
        })
      )
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <Row className="mt-3">
        <Col span={12}>
          <p className="pageTitle">
            <span>Client Profiles</span>{' '}
          </p>
        </Col>
      </Row> */}
      <PageCardComponent className={Styles.pageCardStyleNew}>
        <Row justify={'end'}>
          <Col span={12} className="d-flex justify-content-end ">
            <ButtonComponent
              hierarchy="secondary-gray"
              onClick={() => navigate('/add-company')}
            >
              Create Client{' '}
              <span style={{ margin: '1px 0px 0px 4px' }}> +</span>
            </ButtonComponent>
          </Col>
        </Row>

        <Col span={24} style={{ marginTop: '15px', marginBottom: '4vh' }}>
          <Spin spinning={isLoading}>
            <TableComponent
              isRowExpand={false}
              data={data}
              enableRowSelection={false}
              columnHeader={columns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
            />
          </Spin>
        </Col>
      </PageCardComponent>
    </>
  );
}
