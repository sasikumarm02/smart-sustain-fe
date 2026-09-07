import { useEffect, useState } from 'react';
import { Row, Col, Input } from 'antd';
import {
  PageCardComponent,
  ButtonComponent,
  TableComponent,
} from '../../DesignLibrary';
import Styles from './governance.module.scss';
import { post } from '../../Services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';
import { fatalitiesInjuriesTabColumns } from '../Emission/mock';
import CountCardComponent from '../../DesignLibrary/CountCardComponent';
import EmployeeFatality from '../../assets/Svg/Environment/EmployeeFatalities';
import ContractorFatality from '../../assets/Svg/Environment/ContractorFatalities';
import ConsequenceInjuries from '../../assets/Svg/Environment/ConsequenceInjuries';
import RecordableInjuries from '../../assets/Svg/Environment/RecordableInjuries';
import { isEmpty } from '../../Utils/isEmpty';
import { useSelector } from 'react-redux';
import { CloseCircleOutlined } from '@ant-design/icons';

export default function FacilitiesandInjuries() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [initialDataSource, setInitialDataSource] = useState<any>({
    no_of_emp_fatalities: '',
    no_of_contractor_fatalities: '',
    specific_incidents_list: '',
    no_of_high_consequence_injuries: '',
    no_of_recordable_injuries: '',
    no_of_lost_time_injuries: '',
    no_of_lost_workdays: '',
    key: '1',
  });
  const { user } = useAuth();
  const { openToast } = useNotification();
  const navigate = useNavigate();
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  useEffect(() => {
    setDataSource([{ ...initialDataSource }]);
  }, [initialDataSource]);

  const handleAddRow = () => {
    const newRow = { ...initialDataSource, key: dataSource.length + 1 }; // Assign the key dynamically
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
      const res = await post(
        `/injury_management/create-data-for-fatalities-and-injuries/`,
        body
      );
      openToast({
        content: `${!isEmpty(res.message) && res.message}`,
        type: 'success',
      });
      navigate('/fatalities-injuries', {
        state: {
          currentFacility: facilitySelected,
        },
      });
    } catch (err) {
      console.error('Error:', err);
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
      case 'text':
        return {
          ...column,
          render: (text: any, record: any, idx: any) => (
            <Input
              value={record[column.dataIndex]}
              onChange={(e) => {
                const value = e.target.value;
                handleChange(value, idx, column.dataIndex);
              }}
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
                if (
                  column.dataIndex === 'no_of_lost_workdays'
                    ? /^[0-9]*\.?[0-9]*$/.test(value)
                    : /^\d*$/.test(value)
                ) {
                  handleChange(value, idx, column.dataIndex);
                }
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

  const filteredColumns = fatalitiesInjuriesTabColumns
    .filter((column) => column.key !== 'status')
    .map((column, index) => renderColumn(column, index));

  const isFormValid = () => {
    return dataSource.every((row) =>
      Object.values(row).every((value) => value !== '')
    );
  };

  const getTotalEmpFatalities = () => {
    return dataSource.reduce((total, row) => {
      const totalEmployees = parseFloat(row.no_of_emp_fatalities) || 0;
      return total + totalEmployees;
    }, 0);
  };

  const getTotalConFatalities = () => {
    return dataSource.reduce((total, row) => {
      const totalContractors = parseFloat(row.no_of_contractor_fatalities) || 0;
      return total + totalContractors;
    }, 0);
  };

  const getTotalConInjuries = () => {
    return dataSource.reduce((total, row) => {
      const totalConsequences =
        parseFloat(row.no_of_high_consequence_injuries) || 0;
      return total + totalConsequences;
    }, 0);
  };

  const getTotalRecInjuries = () => {
    return dataSource.reduce((total, row) => {
      const totalRecords = parseFloat(row.no_of_recordable_injuries) || 0;
      return total + totalRecords;
    }, 0);
  };

  return (
    <>
      {/* <div className={Styles.governanceHeader}>Safety Performance</div> */}
      <PageCardComponent customClass={Styles.pageCardStyle}>
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
          gutter={[15, 30]}
          className={Styles.customPaddingTop}
        >
          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={Styles.customPaddingRight}
          >
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Fatalities
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {parseFloat(getTotalEmpFatalities().toFixed(2))}
              </p>
            </div>
          </Col>

          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={Styles.customPaddingRight}
          >
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Contractor Fatalities
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {parseFloat(getTotalConFatalities().toFixed(2))}
              </p>
            </div>
          </Col>

          <Col
            xl={6}
            lg={6}
            md={12}
            sm={24}
            xs={24}
            className={Styles.customPaddingRight}
          >
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Contractor Injuries
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {parseFloat(getTotalConInjuries().toFixed(2))}
              </p>
            </div>
          </Col>

          <Col xl={6} lg={6} md={12} sm={24} xs={24}>
            <div
              style={{
                backgroundColor: '#0D304A',
                borderRadius: '16px',
                padding: '20px',
                height: '100px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h5
                style={{
                  fontSize: '12px',
                  marginBottom: '10px',
                  color: '#fff',
                }}
              >
                Total Number of Employee Recordable Injuries
              </h5>
              <p
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}
              >
                {parseFloat(getTotalRecInjuries().toFixed(2))}
              </p>
            </div>
          </Col>
        </Row>

        <Row className={Styles.customPaddingTop}>
          <Col span={24}>
            <TableComponent
              isRowExpand={false}
              data={dataSource}
              enableRowSelection={false}
              columnHeader={filteredColumns}
              showOnlyCount={false}
              columnCheckBoxDataAttribute="key"
            />
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: '15px' }}>
          <Col className={Styles.customPaddingRight}>
            <ButtonComponent
              hierarchy="tertiary"
              onClick={() => navigate('/fatalities-injuries')}
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
}
