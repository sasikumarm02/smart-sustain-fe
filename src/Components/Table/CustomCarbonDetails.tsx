import {
  CarbonDetails,
  CarbonDetails2,
  CarbonDetails3,
  CarbonDetailsMobile,
} from '../../Modules/Emission/mock';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiURL } from '../../Utils/Constants';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { Row, Button, Col, Flex } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TableComponent } from '../../DesignLibrary';

const CustomCarbonDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentType, setCurrentType] = useState<string | undefined>();
  const [tabData, setTabData] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');

  const location = useLocation();

  function extractCarbonDetails(data: any) {
    const result = data
      ?.filter((item: any) => item.status === 'Approved')
      .map((item: any, index: number) => ({
        sNo: index + 1,
        vehicle_type: item.vehicle_type,
        fuel_type: item.fuel_type,
        uom: item.uom,
        equipment_type: item.equipment_type,
        gas_or_refrigerant: item.gas_or_refrigerant,
        source_of_energy: item.source_of_energy,
        total_quantity_of_fuel: item.total_quantity_of_fuel,
        total_emission_emmited_by_fuel: item.total_emission_emmited_by_fuel,
        total_emission_emmited_by_fuel_in_tonnes:
          item.total_emission_emmited_by_fuel_in_tonnes,
      }));
    return result;
  }

  const fetchData = (apiUrl: string) => {
    if (apiUrl) {
      get(apiUrl)
        .then((res: any) => {
          if (res?.response?.status !== false) {
            if (res?.response?.data) {
              const data = extractCarbonDetails(res?.response?.data);
              console.log(data);
              setTabData(data);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (location?.state) {
      const record = location.state;
      let target = '';
      console.log(record);

      if (record?.record?.module) {
        setCurrentType(record?.record?.module);
        setTitle(record?.record?.module);
      }

      switch (record?.record?.module) {
        case 'Process Emission':
          target = 'get_process_emission';
          break;
        case 'Fugitive Emission':
          target = 'get_fugitive_emission';
          break;
        case 'Stationary Combustion':
          target = 'get_stationary_combustion';
          break;
        case 'Energy Consumption':
          target = 'get_energy_consumption';
          break;
        case 'Mobile Combustion':
          target = 'get_mobile_combustion';
          break;
      }

      const url =
        record?.record?.module === 'Energy Consumption'
          ? `${apiURL}/api/energy/get-energy-consumption/?entity_Id=${user.entity_Id}`
          : `${apiURL}/api/Emissions/${target}/?entity_Id=${user.entity_Id}`;

      fetchData(url);
      console.log(apiURL);
    }
  }, [location, user.entity_Id]);

  const getColumns = (type: string | undefined) => {
    if (type === 'Stationary Combustion') {
      return CarbonDetails;
    } else if (type === 'Mobile Combustion') {
      return CarbonDetailsMobile;
    } else if (type === 'Process Emission' || type === 'Fugitive Emission') {
      return CarbonDetails2;
    } else if (type === 'Energy Consumption') {
      return CarbonDetails3;
    } else {
      return CarbonDetails;
    }
  };

  return (
    <>
      <Row>
        {/* <Col lg={24}>
          <h4 className="pageTitle">
            Emission from {title} for the Reporting Period
          </h4>
        </Col> */}
        <Col span={24}>
          <TableComponent
            isRowExpand={false}
            data={tabData}
            enableRowSelection={false}
            columnHeader={getColumns(currentType)}
            showOnlyCount={false}
            columnCheckBoxDataAttribute="key"
          />
        </Col>
        <Col span={24} className="mt-2">
          <Flex justify="end">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/environment/carbon-footprint/')}
              // style={{ position: "absolute", left: "32px" }}
            />
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default CustomCarbonDetails;
