import React from 'react';
import ModuleCard from '../../../Components/Dashboard/ModuleCard';
import { Row, Col, Card, Table, Image } from 'antd';
import BarGraph from '../../../Components/Graph/BarGraph';
import emissionIcon from '../../../assets/Svg/emission.svg';
import energyIcon from '../../../assets/Svg/energy.svg';
import waterIcon from '../../../assets/Svg/water.svg';
import wasteIcon from '../../../assets/Svg/waste.svg';
import MixBarChart from '../../../Components/Graph/MixBarChart';
import WasteGraph from '../../../Components/Graph/WasteGraph';
import { wasteManagementData } from '../../Emission/mock';
import Index from '../../BelowHeader';
import Card1 from '../../../assets/Cards/Card-1.png';
import Card2 from '../../../assets/Cards/Card-2.png';
import Card3 from '../../../assets/Cards/Card-3.png';
import Card4 from '../../../assets/Cards/Card-4.png';

const emissionCards = [Card1, Card2, Card3, Card4];

export default function MainDashboard() {
  const data = [
    {
      AnswerRef: 'one',
      Year: '2019-20',
      qty: 1200,
    },
    {
      AnswerRef: 'two',
      Year: '2020-21',
      qty: 4322,
    },
    {
      AnswerRef: 'three',
      Year: '2021-2022',
      qty: 2400,
    },
    {
      AnswerRef: 'four',
      Year: '2022-23',
      qty: 543,
    },
  ];
  const data2 = [
    {
      name: '2019-20',
      'Electricity From Renewables': 4000,
      'Other Electricity': 2400,
      Fuels: 2400,
    },
    {
      name: '2020-21',
      'Electricity From Renewables': 3000,
      'Other Electricity': 1398,
      Fuels: 2210,
    },
    {
      name: '2021-22',
      'Electricity From Renewables': 2000,
      'Other Electricity': 9800,
      Fuels: 2290,
    },
    {
      name: '2022-23',
      'Electricity From Renewables': 2780,
      'Other Electricity': 3908,
      Fuels: 2000,
    },
  ];
  const WaterConsumptionData = [
    {
      name: '2019-20',
      'Surface Water': 4000,
      'Ground Water': 2400,
      'Sea Water': 2400,
    },
    {
      name: '2020-21',
      'Surface Water': 3000,
      'Ground Water': 1398,
      'Sea Water': 2210,
    },
    {
      name: '2021-22',
      'Surface Water': 2000,
      'Ground Water': 9800,
      'Sea Water': 2290,
    },
    {
      name: '2022-23',
      'Surface Water': 2780,
      'Ground Water': 3908,
      'Sea Water': 2000,
    },
  ];
  const data3 = [
    {
      name: 'CompanyH',
      'Bio Degradable Waste': 2000,
      'Plastic Waste': 9800,
      'E Waste': 2290,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyG',
      'Bio Degradable Waste': 2780,
      'Plastic Waste': 3908,
      'E Waste': 2000,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyF',
      'Bio Degradable Waste': 4000,
      'Plastic Waste': 2400,
      'E Waste': 2400,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyE',
      'Bio Degradable Waste': 3000,
      'Plastic Waste': 1398,
      'E Waste': 2210,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyD',
      'Bio Degradable Waste': 2000,
      'Plastic Waste': 9800,
      'E Waste': 2290,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyC',
      'Bio Degradable Waste': 2780,
      'Plastic Waste': 3908,
      'E Waste': 2000,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyB',
      'Bio Degradable Waste': 4000,
      'Plastic Waste': 2400,
      'E Waste': 2400,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
    {
      name: 'CompanyA',
      'Bio Degradable Waste': 3000,
      'Plastic Waste': 1398,
      'E Waste': 2210,
      'Radio active Waste': 2450,
      'Bio Medical Waste': 1456,
      'Construction Demo lition Waste': 753,
      'Battery Waste': 2642,
    },
  ];

  const barColors1 = [' #00B8F5', '#B497FF', '#00C0AE'];
  const barColors2 = ['#FFA3DA', '#B497FF', '#00B8F5'];

  return (
    <div className="mb-4">
      {/* {<Index />} */}
      {/* <Row gutter={12}>
        {[
          {
            title: "GHG Emissions",
            buttonLabel: "View",
            actualValue: "19,859 tCO2e",
            progressBarColor1: "#F5CA47",
            progressBarColor2: "transparent",
            progressBarBorderColor: "#269924",
            progressBarValue1: "19,859 tCO2e",
            progressBarValue2: "20K tCO2e",
            progressBarValue1Percent: 35,
            progressBarValue2Percent: 40,
            img: emissionIcon,
            style: {
              background: "linear-gradient(109.92deg, rgba(12, 192, 170, 0.5) -17.49%, rgba(63, 243, 221, 0.5) 117.65%)",


            },
          },
          {
            title: "Energy Consumption",
            buttonLabel: "View",
            actualValue: "75,000 GJ",
            progressBarColor1: "rgba(245, 71, 71, 1)",
            progressBarColor2: "transparent",
            progressBarBorderColor: "#269924",
            progressBarValue1: "19,859 tCO2e",
            progressBarValue2: "70K GJ",
            progressBarValue1Percent: 35,
            progressBarValue2Percent: 40,
            img: energyIcon,
            style: {
              background: "linear-gradient(109.92deg, rgba(241, 196, 77, 0.5) -17.49%, rgba(248, 227, 170, 0.5) 117.65%)",

            },
          },
          {
            title: "Water Consumption ",
            buttonLabel: "View",
            actualValue: "21,0100  ML",
            progressBarColor1: "rgba(71, 245, 150, 1)",
            progressBarColor2: "transparent",
            progressBarBorderColor: "#269924",
            progressBarValue1: "19,859 tCO2e",
            progressBarValue2: "25K ML",
            progressBarValue1Percent: 35,
            progressBarValue2Percent: 40,
            img: waterIcon,
            style: {
              background: "linear-gradient(109.92deg, rgba(0, 184, 245, 0.5) -17.49%, rgba(143, 227, 255, 0.5) 117.65%)",

            },
          },
          {
            title: "Waste Generation",
            buttonLabel: "View",
            actualValue: "15,591 t",
            progressBarColor1: "rgba(71, 245, 150, 1)",
            progressBarColor2: "transparent",
            progressBarBorderColor: "#269924",
            progressBarValue1: "19,859 tCO2e",
            progressBarValue2: "20K t",
            progressBarValue1Percent: 35,
            progressBarValue2Percent: 40,
            img: wasteIcon,
            style: {
              background: "linear-gradient(109.92deg, rgba(102, 102, 102, 0.5) -17.49%, rgba(179, 179, 179, 0.5) 117.65%)",
            },
          },
        ].map((data: any, index: number) => (
          
        ))}
      </Row> */}
      <p className="pageTitle mt-4">Environment Dashboard</p>
      <Row className="mt-2">
        {emissionCards.map((img, index) => (
          <Col xl={6} lg={8} md={12} style={{ width: '100%' }} key={index}>
            <div
              style={{
                width: 'auto',
                height: '30vh',
                background: `url(${img}) center center / cover no-repeat`,
              }}
            ></div>
            {/* <Image src={img} style={{width:"100%"}} preview={false} className="emissionImgs"/> */}
          </Col>
        ))}
      </Row>
      <Row gutter={[12, 12]}>
        <Col xl={12} lg={12} md={24} style={{ width: '100%' }}>
          <BarGraph
            title="Scope 1 Absolute Emissions"
            subTitle="tCO2e"
            data={data}
            fill="#BC8EF6"
          />
        </Col>{' '}
        <Col xl={12} lg={12} md={24} style={{ width: '100%' }}>
          <BarGraph
            title="Scope 2 Absolute Emissions"
            subTitle="tCO2e"
            data={data}
            fill="#85E0FF"
          />
        </Col>{' '}
        <Col xl={12} lg={12} md={24} style={{ width: '100%' }}>
          <MixBarChart
            title="Energy Consumption"
            subTitle="MWh"
            data={data2}
            scop1="Electricity from Renewables"
            scop2="Other Electricity"
            scop3="Fuels"
            barColors={barColors1}
            unit=""
          />
        </Col>
        <Col xl={12} lg={12} md={24} style={{ width: '100%' }}>
          <MixBarChart
            title="Water Consumption"
            subTitle="ML"
            data={WaterConsumptionData}
            scop1="Surface Water"
            scop2="Ground Water"
            scop3="Sea Water"
            barColors={barColors2}
            unit=""
          />
        </Col>
        <Col xl={12} lg={12} md={24} style={{ width: '100%' }}>
          <WasteGraph
            title="Waste Management"
            data={data3}
            barColors={[
              '#00338D',
              '#B2B2B2',
              '#5FDCED',
              '#1E49E2',
              '#40B09C',
              '#FFA3DA',
              '#95B7C7',
            ]}
          />
        </Col>
        {/* <Col xl={12} lg={12} md={24} style={{ width: "100%" }}>
          <Card bordered={false} style={{ width: "100%" ,height:"100%"  }}>
        <Col xl={12} lg={12} md={24} style={{ width: "100%" }}>
          <Card bordered={false} style={{ width: "100%", height: "100%" }}>
            <h2
              style={{ background: "#E6E6E6", color: "#040404" }}
              className="text-center p-2"
            >
              ESG Compliance Scorecard
            </h2>
            <Table
              className="table-responsive"
              columns={dashboardcolumns}
              dataSource={dashboardDataSource}
              pagination={false}
            />
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}
