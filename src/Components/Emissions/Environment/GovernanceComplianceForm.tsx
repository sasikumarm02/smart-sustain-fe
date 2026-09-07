import { useEffect, useState } from 'react';
import { Col, Input, Row, Select } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { post } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Incidents from '../../../assets/Svg/Environment/Incidents';
import CountCardComponent from '../../../DesignLibrary/CountCardComponent';
import { corruptionCols as originalCorruptionCols } from '../../../Modules/Emission/mock';
import Styles from '../../../Modules/Governance/governance.module.scss';
import { useSelector } from 'react-redux';
import { isEmpty } from '../../../Utils/isEmpty';
import { useNotification } from '../../../Hooks/useNotification';
import { CloseCircleOutlined } from '@ant-design/icons';

const corruptionCols = originalCorruptionCols.filter(
  (col) => col.dataIndex !== 'status'
);

const GovernanceComplianceForm = ({}) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [initialDataSource, setInitialDataSource] = useState<any>({
    incident_category: '',
    no_of_incidents: '',
    outcomes: '',
    key: '1',
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openToast } = useNotification();
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const dropDownIncidentCategory = [
    'Bribery',
    'Fraud',
    'Environmental Violation',
    'Data Safety Breach',
  ];

  useEffect(() => {
    setDataSource([{ ...initialDataSource }]);
  }, [initialDataSource]);

  const handleAddRow = () => {
    const newRow = { ...initialDataSource, key: dataSource.length + 1 };
    setDataSource([...dataSource, newRow]);
  };

  const handleChange = (value: any, index: any, key: any) => {
    const newDataSource = [...dataSource];
    newDataSource[index][key] = value;
    setDataSource(newDataSource);
  };

  const handleSubmit = async () => {
    let body = {
      entity_Id: user.entity_Id,
      facility_Id: facilitySelected ? facilitySelected : '',
      row_data: dataSource,
    };

    try {
      const resData = await post(
        `/corruption/create-data-for-corruptions/`,
        body
      );
      openToast({
        content: `${!isEmpty(resData.message) && resData.message}`,
        type: 'success',
      });
      navigate(`/governance/Incidents`, {
        state: {
          currentFacility: facilitySelected,
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetDataSources = () => {
    setDataSource([{ ...initialDataSource }]);
  };

  const handleRemoveRow = (key: number) => {
    setDataSource((prevData: any) => {
      if (prevData.length === 1) {
        // Prevent removing the last remaining row
        return prevData;
      }

      // Remove the row with the given key
      const updatedData = prevData.filter((item: any) => item.key !== key);

      return updatedData;
    });
  };

  const renderColumn = (column: any, index: any) => {
    switch (column.type) {
      case 'select':
        let options: string[] = [];
        if (column.dataIndex === 'incident_category') {
          options = dropDownIncidentCategory;
        }
        return {
          ...column,
          render: (text: any, record: any, idx: any) => (
            <Select
              showSearch
              value={record[column.dataIndex]}
              style={{ width: column.width }}
              onChange={(value) => handleChange(value, idx, column.dataIndex)}
            >
              {options.map((option, index) => (
                <Select.Option key={index} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          ),
        };
      case 'text':
        return {
          ...column,
          render: (text: any, record: any, idx: any) => (
            <Input
              value={record[column.dataIndex]}
              onChange={(e) =>
                handleChange(e.target.value, idx, column.dataIndex)
              }
            />
          ),
        };
      case 'number':
        return {
          ...column,
          render: (text: any, record: any, idx: any) => (
            <Input
              type="number"
              onKeyDown={(e: any) => {
                if (e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              value={record[column.dataIndex]}
              onChange={(e) => {
                const value = e.target.value;
                if (!/^\d*$/.test(value)) {
                  return;
                }
                handleChange(value, idx, column.dataIndex);
              }}
            />
          ),
        };
      case 'action':
        return {
          ...column,
          render: (text: any, record: any, rowIndex: any) => (
            <>
              <CloseCircleOutlined
                className="text-danger user-select-all"
                onClick={() => {
                  if (record.key) {
                    handleRemoveRow(record.key);
                  }
                }}
              />
            </>
          ),
        };

      default:
        return column;
    }
  };

  const tableColumns = corruptionCols.map((column, index) =>
    renderColumn(column, index)
  );

  const getTotalNoOfIncidents = () => {
    return dataSource.reduce((total, row) => {
      const totalIncidents = parseFloat(row.no_of_incidents) || 0;
      return total + totalIncidents;
    }, 0);
  };

  const renderCards = () => {
    return (
      <>
        <Row justify="end">
          <ButtonComponent
            hierarchy="secondary-gray"
            size="xl"
            onClick={handleAddRow}
          >
            Add Row
          </ButtonComponent>
        </Row>
        <Row
          justify="start"
          align="middle"
          className={Styles.governanceFormMargin}
        >
          <Col xl={6} lg={12} md={12} sm={24}>
            <div
              style={{
                backgroundColor: '#0D304A', // light gray background, change as needed
                borderRadius: '16px',
                padding: '20px',
                width: '220px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of <br /> Non Compliance Incidents
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {parseFloat(getTotalNoOfIncidents().toFixed(2))}
              </p>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  // Validate form submission
  const isFormValid = () => {
    return dataSource.every((row) =>
      Object.values(row).every((value) => value !== '')
    );
  };

  return (
    <>
      {/* <Row justify="start" className="mt-4">
        <div className={Styles.governanceHeader}>Governance Compliance</div>
      </Row> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
        {renderCards()}

        <Row className={Styles.customPaddingTop}>
          <Col span={24}>
            <TableComponent
              isRowExpand={false}
              data={dataSource}
              enableRowSelection={false}
              columnHeader={tableColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
            />
          </Col>
        </Row>

        <Row justify="end" className={Styles.customPaddingTop}>
          <Col className={Styles.customPaddingRight}>
            <ButtonComponent
              hierarchy="tertiary"
              onClick={() => navigate('/governance/Incidents')}
            >
              Cancel
            </ButtonComponent>
          </Col>
          <Col className={Styles.customPaddingRight}>
            <ButtonComponent
              hierarchy="secondary"
              size="xl"
              onClick={resetDataSources}
            >
              Reset
            </ButtonComponent>
          </Col>

          <Col>
            <ButtonComponent onClick={handleSubmit} disabled={!isFormValid()}>
              Submit
            </ButtonComponent>
          </Col>
        </Row>
      </PageCardComponent>
    </>
  );
};

export default GovernanceComplianceForm;
