import { useState } from 'react';

import { Row, Col, CheckboxProps } from 'antd';

import MixBarChart from '../../../Components/Graph/MixBarChart';
import WasteGraph from '../../../Components/Graph/WasteGraph';

import HorizontalModuleCard from '../../../Components/Dashboard/HorizontalModuleCard';
import PieChartWithCustomizablelabel from '../../../Components/Graph/PieChartWithCustomizablelabel';

import GHGEmissionIcon from '../../../assets/image/GHG Emission Icon.png';

import { useNavigate } from 'react-router-dom';

import BelowHeader from '../../BelowHeader';
interface FormValues {
  year: string;
  framework: string;
  ghgEmissionFactors: string;
  gwpDataset: string;
}
export default function Details() {
  const [filter, setFilter] = useState(false);
  const navigate = useNavigate();
  const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const PieChartdata1 = [
    { name: 'Group A', value: 170 },
    { name: 'Group B', value: 240 },
    { name: 'Group C', value: 320 },
  ];
  const PieChartdata2 = [
    { name: 'Group A', value: 30 },
    { name: 'Group B', value: 40 },
    { name: 'Group C', value: 80 },
    { name: 'Group D', value: 200 },
  ];
  const PieChartdata3 = [
    { name: 'Group A', value: 20 },
    { name: 'Group B', value: 10 },
    { name: 'Group C', value: 300 },
  ];
  const data2 = [
    {
      name: '2019-20',
      ElectricityFromRenewables: 4000,
      OtherElectricity: 2400,
      Fuels: 2400,
    },
    {
      name: '2020-21',
      ElectricityFromRenewables: 3000,
      OtherElectricity: 1398,
      Fuels: 2210,
    },
    {
      name: '2021-22',
      ElectricityFromRenewables: 2000,
      OtherElectricity: 9800,
      Fuels: 2290,
    },
    {
      name: '2022-23',
      ElectricityFromRenewables: 2780,
      OtherElectricity: 3908,
      Fuels: 2000,
    },
  ];
  const barColors2 = ['#FFA3DA', '#B497FF', '#00B8F5'];
  const barColors1 = [' #00B8F5', '#B497FF', '#00C0AE'];
  const data3 = [
    {
      name: 'CompanyH',
      'Scope 1': 2000,
      'Scope 2': 1800,
      'Scope 3': 2290,
    },
    {
      name: 'CompanyG',
      'Scope 1': 2200,
      'Scope 2': 2400,
      'Scope 3': 2000,
    },

    {
      name: 'CompanyE',
      'Scope 1': 2400,
      'Scope 2': 2600,
      'Scope 3': 2210,
    },
    {
      name: 'CompanyD',
      'Scope 1': 2600,
      'Scope 2': 2800,
      'Scope 3': 2290,
    },
    {
      name: 'CompanyC',
      'Scope 1': 2800,
      'Scope 2': 3000,
      'Scope 3': 2000,
    },
    {
      name: 'CompanyB',
      'Scope 1': 3000,
      'Scope 2': 3200,
      'Scope 3': 2400,
    },
    {
      name: 'CompanyA',
      'Scope 1': 8000,
      'Scope 2': 8200,
      'Scope 3': 2210,
    },
  ];
  const COLORS1 = ['#FFA3DA', '#76D2FF', '#63EBDA'];
  const COLORS2 = ['#B497FF', '#00C0AE', '#76D2FF', '#EED694'];
  const COLORS3 = ['#EED694', '#00B8F5', '#B497FF'];
  const handleFilter = () => {
    if (filter === true) {
      setFilter(false);
    } else {
      setFilter(true);
    }
  };
  const handleCloseFilter = () => {
    setTimeout(() => {
      setFilter(false);
    }, 600); // Delay should match the transition duration in milliseconds
  };
  const yourDataArray = [
    {
      name: 'year',
      placeholder: 'Period',
      mode: 'multiple',
      options: [
        { value: 'FY 2024-25', label: 'FY 2024-25' },
        { value: 'FY 2023-24', label: 'FY 2023-24' },
        { value: 'FY 2022-23', label: 'FY 2022-23' },
      ],
    },
    {
      name: 'framework',
      placeholder: 'All Sectors',
      mode: 'multiple',
      options: [
        { value: 'gri', label: 'GRI' },
        { value: 'tcfd', label: 'TCFD' },
        { value: 'brsr', label: 'BRSR' },
        { value: 'FTES', label: 'FTES' },
        { value: 'CDP', label: 'CDP' },
        { value: 'SASB', label: 'SASB' },
        { value: 'IIRC', label: 'IIRC' },
      ],
    },
    {
      name: 'ghgEmissionFactors',
      placeholder: 'All Countries',
      mode: 'multiple',
      options: [
        {
          value: 'UK - DEFRA 2023 Version 1.1',
          label: 'UK - DEFRA 2023 Version 1.1',
        },
        {
          value: 'US-EPA 20230912',
          label: 'US-EPA 20230912',
        },
      ],
    },
    {
      name: 'gwpDataset',
      placeholder: 'All Companies',
      mode: 'multiple',
      options: [
        {
          value: '2007 IPCC Fourth Assessment',
          label: '2007 IPCC Fourth Assessment',
        },
        {
          value: '2014 IPCC Fifth Assessment',
          label: '2014 IPCC Fifth Assessment',
        },
      ],
    },
    {
      name: 'gwpDataset2',
      placeholder: 'All Facilities',
      mode: 'multiple',
      options: [
        {
          value: '2007 IPCC Fourth Assessment',
          label: '2007 IPCC Fourth Assessment',
        },
        {
          value: '2014 IPCC Fifth Assessment',
          label: '2014 IPCC Fifth Assessment',
        },
      ],
    },
  ];

  return (
    <>
      <BelowHeader detailPageName="GHG Emissions Dashboard" />
      <Row gutter={12}>
        {[
          {
            title: 'Scope 1 Emissions',
            buttonLabel: 'View More',
            actualValue: '15,000 tCO2e',
            progressBarColor1: '#FFC000',
            progressBarColor2: 'transparent',
            progressBarBorderColor: '#269924',
            progressBarValue1: '19,859 tCO2e',
            progressBarValue2: '20K tCO2e',
            progressBarValue1Percent: 35,
            progressBarValue2Percent: 40,
            img: GHGEmissionIcon,
            style: {
              background: `linear-gradient(90deg, rgba(12, 35, 60, 0.7) 0%, rgba(9, 142, 126, 0.5) 100%)`,
            },
          },
          {
            title: 'Scope 2 Emissions',
            buttonLabel: 'View More',
            actualValue: '21,254 tCO2e',
            progressBarColor1: '#47F596',
            progressBarColor2: 'transparent',
            progressBarBorderColor: '#269924',
            progressBarValue1: '19,859 tCO2e',
            progressBarValue2: '20K tCO2e',
            progressBarValue1Percent: 35,
            progressBarValue2Percent: 40,
            img: GHGEmissionIcon,
            style: {
              background: `linear-gradient(90deg, rgba(114, 19, 234, 0.5) 0%, rgba(30, 73, 226, 0.5) 100%)`,
            },
          },
        ].map((data: any, index: number) => (
          <Col key={index} lg={12}>
            <HorizontalModuleCard
              style={data.style}
              title={data.title}
              buttonLabel={data.buttonLabel}
              actualValue={data.actualValue}
              progressBarColor1={data.progressBarColor1}
              progressBarColor2={data.progressBarColor2}
              progressBarBorderColor={data.progressBarBorderColor}
              progressBarValue1={data.progressBarValue1}
              progressBarValue2={data.progressBarValue2}
              progressBarValue1Percent={data.progressBarValue1Percent}
              progressBarValue2Percent={data.progressBarValue2Percent}
              img={data.img}
            />
          </Col>
        ))}
      </Row>
      <Row justify="space-between">
        <Col
          span={8}
          style={{
            height: '65vh',
            background: '#fff',
            padding: '10px',
            borderRadius: '10px',
            marginRight: '5px',
          }}
          className=""
        >
          <PieChartWithCustomizablelabel
            data={PieChartdata1}
            title="Emissions Distribution "
            barColors={COLORS1}
          />
        </Col>
        <Col lg={15}>
          <WasteGraph
            title="Top 10 Companies /Facilities by Emissions "
            barColors={['#00B8F5', '#7213EA', '#5FDCED', '#00C0AE']}
            data={data3}
          />
        </Col>
        <Col
          span={7}
          style={{
            height: '55vh',
            background: '#fff',
            padding: '10px',
            borderRadius: '10px',
          }}
          className="m-2"
        >
          <PieChartWithCustomizablelabel
            data={PieChartdata2}
            title="Scope 1 Emissions by Category"
            barColors={COLORS2}
          />
        </Col>
        <Col
          span={8}
          style={{
            height: '55vh',
            background: '#fff',
            padding: '10px',
            borderRadius: '10px',
          }}
          className="m-2"
        >
          <PieChartWithCustomizablelabel
            data={PieChartdata3}
            title="Scope 2 Emissions by Category"
            barColors={COLORS3}
          />
        </Col>
        <Col
          span={8}
          style={{
            height: '55vh',
            background: '#fff',
            padding: '10px',
            borderRadius: '10px',
          }}
          className="m-2"
        >
          <PieChartWithCustomizablelabel
            data={PieChartdata3}
            title="Scope 3 Emissions by Category"
            barColors={COLORS3}
          />
        </Col>
        <Col lg={12} className="m-2">
          <MixBarChart
            title="Scope 1 Emissions by Category  (YOY)"
            subTitle="MWh"
            data={data2}
            scop1="Electricity from Renewables"
            scop2="Other Electricity"
            scop3="Fuels"
            barColors={barColors1}
            unit=""
          />
        </Col>
        <Col lg={11} className="m-2">
          <MixBarChart
            title="Scope 2 Emissions by Category (YOY)"
            subTitle="ML"
            data={data2}
            scop1="Surface Water"
            scop2="Ground Water"
            scop3="Sea Water"
            barColors={barColors2}
            unit=""
          />
        </Col>
      </Row>
    </>
  );
}
