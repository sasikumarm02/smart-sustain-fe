import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { Col, Image, Row } from 'antd';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CustomEmissionPdf from './CustomEmissionPdf';
import EditIcon from '../../assets/Svg/EditIcon';

export default function EmissionFactorList() {
  const { user } = useAuth();
  const [tableData, setTableData] = useState<any>([]);
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const ActionCell = ({ record }: { record: any }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
      if (window.location.pathname === '/settings/onBoard-companies') {
        navigate('/add-company', { state: record });
      } else if (
        window.location.pathname === '/settings/name-of-the-facilities'
      ) {
        navigate('/add-facility/?action=edit', { state: record });
      } else if (
        window.location.pathname === '/user-access-management/user-role-mapping'
      ) {
        navigate('/map-user/?action=edit', { state: record });
      } else if (window.location.pathname === '/emissionFactorList') {
        navigate('/emissionFactor/edit', { state: record });
      }
    };

    return (
      <span
        className="ellipsis"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          cursor: 'pointer',
        }}
        onClick={handleNavigation}
      >
        <EditIcon />
      </span>
    );
  };
  const [postFilterRecords, setPostFilterRecords] = useState(undefined);
  const handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setFilteredInfo(filters);
    setPostFilterRecords(extra.currentDataSource);
  };
  const originalEmissionTabColumns = [
    {
      title: 'Custom Emission Factor Name',
      dataIndex: 'custom_ef_name',
      key: 'custom_ef_name',
      type: 'text',
      filters: (() => {
        return tableData
          .map((entry: any) => entry['custom_ef_name'])
          .filter((value: any) => value)
          .filter(
            (value: any, index: any, self: any) => self.indexOf(value) === index
          )
          .map((filterValue: any) => ({
            text: filterValue,
            value: filterValue,
          }));
      })(),
      filteredValue: filteredInfo.custom_ef_name || null,
      onFilter: (value: any, record: any) => {
        return record.custom_ef_name === value;
      },
    },
    {
      title: 'Reporting Period',
      dataIndex: 'year',
      key: 'year',
      type: 'text',
      render: (text: any) => {
        if (text == null) {
          return <span>{text}</span>;
        } else {
          const date = new Date(text);
          return <span>{date.getFullYear()}</span>;
        }
      },
    },
    {
      title: 'Emission Type',
      dataIndex: 'emission_type',
      key: 'emission_type',
      type: 'text',
    },
    {
      title: 'Activity Type',
      dataIndex: 'activity_type',
      key: 'activity_type',
      type: 'text',
    },
    {
      title: 'Emission Factor Value',
      dataIndex: 'emission_factor_per_unit',
      key: 'emission_factor_per_unit',
      type: 'text',
      align: 'right',
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      type: 'text',
      render: (text: any) => {
        return text && !text.includes('kgCO₂e') && text !== 'N/A'
          ? `kgCO₂e / ${text}`
          : text || '';
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      type: 'text',
      render: (text: any) => (text ? 'Active' : 'Inactive'),
    },

    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      width: 100,
      render: (text: any, record: any) => <ActionCell record={record} />,
    },
  ];

  // Filter columns to include the Action column only for ADMIN role

  const emissionTabColumns =
    user.role === 'ADMIN'
      ? originalEmissionTabColumns
      : originalEmissionTabColumns.filter((column) => column.key !== 'Action');

  const getData = () => {
    get(
      `/custom_ef_database/fetch_custom_ef_database/?entity_Id=${user.entity_Id}`
    )
      .then((res: any) => {
        const data = res?.response?.data;
        setTableData(data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <PageCardComponent className={styles.pageCardStyle}>
        <Row justify="end" align="middle" className={styles.padding}>
          <Col
            span={12}
            className="d-flex justify-content-end align-items-center"
          >
            <div className="d-flex justify-content-end align-items-center mb-3">
              <CustomEmissionPdf />
            </div>

            {user.role === 'ADMIN' && (
              <ButtonComponent
                onClick={() => navigate('/emissionFactor')}
                className={styles.paddingBtn}
              >
                Add
              </ButtonComponent>
            )}
          </Col>
          <Col span={24} className={user.role === 'ADMIN' ? '' : 'mt-3'}>
            <TableComponent
              onchange={handleChange}
              postFilterRecords={postFilterRecords}
              isRowExpand={false}
              data={tableData}
              enableRowSelection={false}
              columnHeader={emissionTabColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
            />
          </Col>
        </Row>
      </PageCardComponent>
    </>
  );
}
