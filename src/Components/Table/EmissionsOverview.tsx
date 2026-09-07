import { Col, Row, Button, Select } from 'antd';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import Styles from '../../Modules/ReportingScreens/report.module.scss';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';
import { getCurrentYear } from '../Emissions/Scope3/Helpers';

const EmissionOverView = () => {
  const { openToast } = useNotification();
  const { Option } = Select;

  const [currentScope, setCurrentScope] = useState<number>(1);
  const [dataSource, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const { user } = useAuth();

  const location = useLocation();

  const fetchApiData = () => {
    setIsLoading(true);
    get(`${''}?entity_Id=${user.entity_Id}`)
      .then((res: any) => {
        if (res?.response?.status === true) {
          setDataSources(res?.response?.data);
        } else {
          openToast({
            content: `${res?.message}`,
            type: 'warning',
          });
        }
      })
      .catch((err) =>
        openToast({
          content: `${err}`,
          type: 'error',
        })
      )
      .finally(() => setIsLoading(false));
  };

  const data = [
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
    },
  ];

  const Data2 = [
    {
      key: 1,
      activity: 'Coking coal',
      totalQty: 205.96,
      uom: 'tonnes',
      emissionFactorSelection: 'US-EPA',
      emissionFactor: 3164.65,
      emissionskgCO2e: 651791.31,
      emissionstCO2e: 23432,
    },
    {
      key: 2,
      activity: 'Butane',
      totalQty: 1200,
      uom: 'litres',
      emissionFactorSelection: 'UK-DEFRA',
      emissionFactor: 1.75,
      emissionskgCO2e: 2100,
      emissionstCO2e: 233343,
    },
  ];

  const columns = [
    { title: 'Activity', dataIndex: 'activity', key: 'activity' },
    { title: 'Total Qty (All)', dataIndex: 'totalQty', key: 'totalQty' },
    { title: 'UOM', dataIndex: 'uom', key: 'uom' },
    {
      title: 'Emission Factor Selection',
      dataIndex: 'emissionFactorSelection',
      key: 'emissionFactorSelection',
      render: (text: string) => (
        <Select defaultValue={text} style={{ width: 120 }}>
          <Option value="US-EPA">US-EPA</Option>
          <Option value="UK-DEFRA">UK-DEFRA</Option>
        </Select>
      ),
    },
    {
      title: (
        <span style={{ textTransform: 'none' }}>
          Emission Factor (kgCO₂e/unit)
        </span>
      ),
      dataIndex: 'emissionFactor',
      key: 'emissionFactor',
    },
    {
      title: <span style={{ textTransform: 'none' }}>Emissions (kgCO₂e)</span>,
      dataIndex: 'emissionskgCO2e',
      key: 'emissionskgCO2e',
    },
    {
      title: <span style={{ textTransform: 'none' }}>Emissions (tCO₂e)</span>,
      dataIndex: 'emissionstCO2e',
      key: 'emissionstCO2e',
    },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path) {
      if (path[path.length - 1] == '1') {
        setCurrentScope(1);
      } else if (path[path.length - 1] == '2') {
        setCurrentScope(2);
      }
    }
  });

  return (
    <>
      <Row justify="center" align="middle" className="mt-4">
        <Col span={24}>
          <p className="pageTitle">Emissions Overview</p>
        </Col>
      </Row>
      <Row>
        <PageCardComponent title={`Scope ${currentScope.toString()}`}>
          <TableComponent
            isRowExpand={false}
            data={Data2}
            enableRowSelection={false}
            columnHeader={columns}
            showOnlyCount={false}
            columnCheckBoxDataAttribute="key"
          />
          <div
            style={{
              marginTop: '3vh',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'end',
              gap: '1vw',
            }}
          >
            <ButtonComponent size="md" hierarchy="secondary">
              Revert
            </ButtonComponent>
            <ButtonComponent size="md">Approve</ButtonComponent>
          </div>
        </PageCardComponent>
      </Row>

      <footer
        className={`${Styles.footer} d-flex justify-content-between align-items-center`}
      >
        <div className={Styles.footerRights} style={{ marginLeft: '65vw' }}>
          © {getCurrentYear()} SMART SUSTAIN.AI. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default EmissionOverView;
