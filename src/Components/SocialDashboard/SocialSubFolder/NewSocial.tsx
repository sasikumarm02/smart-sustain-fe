import { Col, Row, Spin } from 'antd';
import { Card } from 'antd';
import { useEffect, useState } from 'react';
import PieChartWithPaddingAngle2 from '../../Graph/PieChartWithPaddingAngle2';
import Styles from '../socialdashboard.module.scss';
import YellowLegend from '../../../assets/Svg/Dashboard/YellowLegend';
import BlueLegend from '../../../assets/Svg/Dashboard/BlueLegend';
import PinkLegend from '../../../assets/Svg/Dashboard/PinkLegend';
import OrangeLegend from '../../../assets/Svg/Dashboard/OrangeLengend';
import GreenLegend from '../../../assets/Svg/Dashboard/GreenLegend';
import PurpleLegend from '../../../assets/Svg/Dashboard/PurpleLegend';
import { ModalComponent, PageCardComponent } from '../../../DesignLibrary';
import { apiBaseUrl, get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { isEmpty } from '../../../Utils/isEmpty';
import DeepBlueLegend from '../../../assets/Svg/Dashboard/DeepBlueLegend';
import { useLocation, useNavigate } from 'react-router-dom';
import TargetVsActualBarChart from '../../Graph/TargetVsActualBarChart';
import EmployeePdf from '../../EmployeeDemoGraphics/Tab/EmployeePdf';
import { number } from 'yup';
import { getCurrentYear } from '../../Emissions/Scope3/Helpers';

export default function NewSocial() {
  const { user } = useAuth();
  const COLORS3 = ['#F9B15C', '#036323', '#0D304A'];

  const COLORS1 = ['#F9B15C', '#036323'];

  const summaryData = [
    { name: 'Total No. of Employees', id: 'Employee_number' },
    { name: 'New Hires', id: 'Employee_new_hire' },
    { name: 'Total Turnover', id: 'Employee_turnover' },
  ];

  const [employeeData, setEmployeeData] = useState<any>({
    // Employee_number: {
    //   total_count: 0,
    //   pie_chart: {
    //     male: 0,
    //     female: 0,
    //     others: 0,
    //     age_lt_30: 0,
    //     age_30_to_50: 0,
    //     age_gt_50: 0,
    //   },
    // },
    // Employee_new_hire: {
    //   total_count: 0,
    //   pie_chart: {
    //     male: 0,
    //     female: 0,
    //     others: 0,
    //     age_lt_30: 0,
    //     age_30_to_50: 0,
    //     age_gt_50: 0,
    //   },
    // },
    // Employee_turnover: {
    //   total_count: 0,
    //   pie_chart: {
    //     male: 0,
    //     female: 0,
    //     others: 0,
    //     age_lt_30: 0,
    //     age_30_to_50: 0,
    //     age_gt_50: 0,
    //   },
    // },
    // Targets: {
    //   Gender: {
    //     Male: 0,
    //     Female: 0,
    //   },
    //   Age: {
    //     '<30': 0,
    //     '30-50': 0,
    //     '>50': 0,
    //   },
    // },
  });
  const [loading, setLoading] = useState(false);

  const getDataByIndex = (index: number) => {
    switch (index) {
      case 5:
        return [
          {
            name: 'Male',
            value:
              employeeData?.Employee_number?.pie_chart?.male.male_percentage,
            number: employeeData?.Employee_number?.pie_chart?.male.male_number,
          },
          {
            name: 'Female',
            value:
              employeeData?.Employee_number?.pie_chart?.female
                .female_percentage,
            number:
              employeeData?.Employee_number?.pie_chart?.female.female_number,
          },
        ];
      case 6:
        return [
          {
            name: 'Male',
            value:
              employeeData?.Employee_new_hire?.pie_chart?.male.male_percentage,
            number:
              employeeData?.Employee_new_hire?.pie_chart?.male.male_number,
          },
          {
            name: 'Female',
            value:
              employeeData?.Employee_new_hire?.pie_chart?.female
                .female_percentage,
            number:
              employeeData?.Employee_new_hire?.pie_chart?.female.female_number,
          },
        ];
      case 7:
        return [
          {
            name: 'Male',
            value:
              employeeData?.Employee_turnover?.pie_chart?.male.male_percentage,
            number:
              employeeData?.Employee_turnover?.pie_chart?.male.male_number,
          },
          {
            name: 'Female',
            value:
              employeeData?.Employee_turnover?.pie_chart?.female
                .female_percentage,
            number:
              employeeData?.Employee_turnover?.pie_chart?.female.female_number,
          },
        ];
      case 9:
        return [
          {
            name: '< 30',
            value:
              employeeData?.Employee_number?.pie_chart?.age_lt_30
                .age_lt_30_percentage,
            number:
              employeeData?.Employee_number?.pie_chart?.age_lt_30
                .age_lt_30_number,
          },
          {
            name: '30 - 50',
            value:
              employeeData?.Employee_number?.pie_chart?.age_30_to_50
                .age_30_to_50_percentage,
            number:
              employeeData?.Employee_number?.pie_chart?.age_30_to_50
                .age_30_to_50_number,
          },
          {
            name: '> 50',
            value:
              employeeData?.Employee_number?.pie_chart?.age_gt_50
                .age_gt_50_percentage,
            number:
              employeeData?.Employee_number?.pie_chart?.age_gt_50
                .age_gt_50_number,
          },
        ];
      case 10:
        return [
          {
            name: '< 30',
            value:
              employeeData?.Employee_new_hire?.pie_chart?.age_lt_30
                .age_lt_30_percentage,
            number:
              employeeData?.Employee_new_hire?.pie_chart?.age_lt_30
                .age_lt_30_number,
          },
          {
            name: '30 - 50',
            value:
              employeeData?.Employee_new_hire?.pie_chart?.age_30_to_50
                .age_30_to_50_percentage,
            number:
              employeeData?.Employee_new_hire?.pie_chart?.age_30_to_50
                .age_30_to_50_number,
          },
          {
            name: '> 50',
            value:
              employeeData?.Employee_new_hire?.pie_chart?.age_gt_50
                .age_gt_50_percentage,
            number:
              employeeData?.Employee_new_hire?.pie_chart?.age_gt_50
                .age_gt_50_number,
          },
        ];
      case 11:
        return [
          {
            name: '< 30',
            value:
              employeeData?.Employee_turnover?.pie_chart?.age_lt_30
                .age_lt_30_percentage,
            number:
              employeeData?.Employee_turnover?.pie_chart?.age_lt_30
                .age_lt_30_number,
          },
          {
            name: '30 - 50',
            value:
              employeeData?.Employee_turnover?.pie_chart?.age_30_to_50
                .age_30_to_50_percentage,
            number:
              employeeData?.Employee_turnover?.pie_chart?.age_30_to_50
                .age_30_to_50_number,
          },
          {
            name: '> 50',
            value:
              employeeData?.Employee_turnover?.pie_chart?.age_gt_50
                .age_gt_50_percentage,
            number:
              employeeData?.Employee_turnover?.pie_chart?.age_gt_50
                .age_gt_50_number,
          },
        ];
      default:
        return {
          total_count: 0,
          pie_chart: {
            male: 0,
            female: 0,
            others: 0,
            age_lt_30: 0,
            age_30_to_50: 0,
            age_gt_50: 0,
          },
        };
    }
  };

  const getApiData = async () => {
    try {
      setLoading(true);
      const response = await get(
        `${apiBaseUrl}/employee/get_employee_statistics/?entity_Id=${user.entity_Id}`
      );
      if (response?.response?.data) {
        setEmployeeData(response?.response?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
  }, []);

  const PieChartSectionGender = (props: any) => {
    const { index } = props;

    return (
      <Col span={20} className={Styles.socialCharts}>
        <PieChartWithPaddingAngle2
          height={200}
          width={320}
          data={getDataByIndex(index)}
          color={COLORS1}
          labels={['Male', 'Female']}
          unit="%"
        />
      </Col>
    );
  };

  const PieChartSectionAge = (props: any) => {
    const { index } = props;
    return (
      <Col span={20} className={Styles.socialCharts}>
        <PieChartWithPaddingAngle2
          height={200}
          width={320}
          data={getDataByIndex(index)}
          color={COLORS3}
          labels={['<30', '30-50', '>50']}
          unit="%"
        />
      </Col>
    );
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const genderDiversityDataEmployeeNumber = [
    {
      name: 'Male',
      target: employeeData.Targets?.Gender?.Male || 0,
      actual: employeeData.Employee_number?.pie_chart.male.male_number || 0,
    },
    {
      name: 'Female',
      target: employeeData.Targets?.Gender?.Female,
      actual: employeeData.Employee_number?.pie_chart.female.female_number,
    },
  ];

  const ageDiversityDataEmployeeNumber = [
    {
      name: '<30',
      target: employeeData.Targets?.Age['<30'],
      actual:
        employeeData.Employee_number?.pie_chart.age_lt_30.age_lt_30_number,
    },
    {
      name: '30-50',
      target: employeeData.Targets?.Age['30-50'],
      actual:
        employeeData.Employee_number?.pie_chart.age_30_to_50
          .age_30_to_50_number,
    },
    {
      name: '>50',
      target: employeeData.Targets?.Age['>50'] || 0,
      actual:
        employeeData.Employee_number?.pie_chart?.age_gt_50.age_gt_50_number,
    },
  ];

  const ageDiversityNewHiresData = [
    {
      name: '<30',
      target: employeeData.Targets?.Age['<30'],
      actual:
        employeeData.Employee_new_hire?.pie_chart?.age_lt_30.age_lt_30_number,
    },
    {
      name: '30-50',
      target: employeeData.Targets?.Age['30-50'],
      actual:
        employeeData.Employee_new_hire?.pie_chart?.age_30_to_50
          .age_30_to_50_number,
    },

    {
      name: '>50',
      target: employeeData.Targets?.Age['>50'] || 0,
      actual:
        employeeData.Employee_new_hire?.pie_chart?.age_gt_50.age_gt_50_number,
    },
  ];

  const ageDiversityTurnOverData = [
    {
      name: '<30',
      target: employeeData.Targets?.Age['<30'],
      actual:
        employeeData.Employee_turnover?.pie_chart?.age_lt_30.age_lt_30_number,
    },
    {
      name: '30-50',
      target: employeeData.Targets?.Age['30-50'],
      actual:
        employeeData.Employee_turnover?.pie_chart?.age_30_to_50
          .age_30_to_50_number,
    },

    {
      name: '>50',
      target: employeeData.Targets?.Age['>50'] || 0,
      actual:
        employeeData.Employee_turnover?.pie_chart?.age_gt_50.age_gt_50_number,
    },
  ];

  const genderDiversityNewHiresData = [
    {
      name: 'Male',
      target: employeeData.Targets?.Gender?.Male,
      actual: employeeData.Employee_new_hire?.pie_chart.male.male_number,
    },
    {
      name: 'Female',
      target: employeeData.Targets?.Gender.Female,
      actual: employeeData.Employee_new_hire?.pie_chart?.female.female_number,
    },
  ];

  const genderDiversityTurnOverData = [
    {
      name: 'Male',
      target: employeeData.Targets?.Gender?.Male,
      actual: employeeData.Employee_turnover?.pie_chart?.male.male_number,
    },
    {
      name: 'Female',
      target: employeeData.Targets?.Gender?.Female,
      actual: employeeData.Employee_turnover?.pie_chart?.female.female_number,
    },
  ];

  return (
    <Spin spinning={loading}>
      <PageCardComponent className={Styles?.socialPageCardStyle}>
        <Row justify="end" className="mb-2" style={{ marginTop: '-20px' }}>
          <EmployeePdf />
        </Row>

        {/* === Total No. of Employees Section === */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <h4 style={{ fontSize: '20px' }}>
              Total No. of Employees{' '}
              <b>{employeeData?.Employee_number?.total_count || 0}</b>
            </h4>
          </Col>

          <Col span={12}>
            <Card>
              <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Gender Based Diversity
              </h4>
              <Row gutter={10} align="middle" justify="center">
                {/* Pie Chart Section */}
                <Col span={12} style={{ textAlign: 'center' }}>
                  <PieChartSectionGender index={5} />
                </Col>

                {/* Bar Chart Section */}
                <Col span={12}>
                  <TargetVsActualBarChart
                    title=""
                    data={genderDiversityDataEmployeeNumber}
                    actualKey="actual"
                    targetKey="target"
                    actualColor="#F9B15C" // orange
                    targetColor="#036323" // dark green
                    xAxisLabel="name"
                    showtick={true}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Age Based Diversity
              </h4>
              <Row gutter={10} align="middle" justify="center">
                {/* Pie Chart Section */}
                <Col span={12} style={{ textAlign: 'center' }}>
                  <PieChartSectionAge index={9} />
                </Col>
                {/* Bar Chart Section */}
                <Col span={12}>
                  <TargetVsActualBarChart
                    title="Age Based Diversity"
                    data={ageDiversityDataEmployeeNumber}
                    actualKey="actual"
                    targetKey="target"
                    actualColor="#F9B15C"
                    targetColor="#036323"
                    xAxisLabel="name"
                    showtick={true}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* === New Hires Section === */}
          <Col span={24}>
            <h4 style={{ fontSize: '20px' }}>
              New Hires{' '}
              <b>{employeeData?.Employee_new_hire?.total_count || 0}</b>
            </h4>
          </Col>

          <Col span={12}>
            <Card>
              <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Gender Based Diversity
              </h4>
              <Row gutter={10} align="middle" justify="center">
                {/* Pie Chart Section */}
                <Col span={12} style={{ textAlign: 'center' }}>
                  <PieChartSectionGender index={6} />
                </Col>
                {/* Bar Chart Section */}
                <Col span={12}>
                  <TargetVsActualBarChart
                    title="Gender Diversity"
                    data={genderDiversityNewHiresData}
                    actualKey="actual"
                    targetKey="target"
                    actualColor="#F9B15C"
                    targetColor="#036323"
                    xAxisLabel="name"
                    showtick={true}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Age Based Diversity
              </h4>
              <Row gutter={10} align="middle" justify="center">
                {/* Pie Chart Section */}
                <Col span={12} style={{ textAlign: 'center' }}>
                  <PieChartSectionAge index={10} />
                </Col>
                {/* Bar Chart Section */}
                <Col span={12}>
                  <TargetVsActualBarChart
                    title="Age Based Diversity"
                    data={ageDiversityNewHiresData}
                    actualKey="actual"
                    targetKey="target"
                    actualColor="#F9B15C"
                    targetColor="#036323"
                    xAxisLabel="name"
                    showtick={true}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* === Total Turnover Section === */}
          <Col span={24}>
            <h4 style={{ fontSize: '20px' }}>
              Total Turnover{' '}
              <b>{employeeData?.Employee_turnover?.total_count || 0}</b>
            </h4>
          </Col>

          <Col span={12}>
            <Card>
              <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Gender Based Diversity
              </h4>
              <Row gutter={10} align="middle" justify="center">
                {/* Pie Chart Section */}
                <Col span={12} style={{ textAlign: 'center' }}>
                  <PieChartSectionGender index={7} />
                </Col>
                {/* Bar Chart Section */}
                <Col span={12}>
                  <TargetVsActualBarChart
                    title="Gender Diversity"
                    data={genderDiversityTurnOverData}
                    actualKey="actual"
                    targetKey="target"
                    actualColor="#F9B15C"
                    targetColor="#036323"
                    xAxisLabel="name"
                    showtick={true}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Age Based Diversity
              </h4>
              <Row gutter={10} align="middle" justify="center">
                {/* Pie Chart Section */}
                <Col span={12} style={{ textAlign: 'center' }}>
                  <PieChartSectionAge index={11} />
                </Col>
                {/* Bar Chart Section */}
                <Col span={12}>
                  <TargetVsActualBarChart
                    title="Age Based Diversity"
                    data={ageDiversityTurnOverData}
                    actualKey="actual"
                    targetKey="target"
                    actualColor="#F9B15C"
                    targetColor="#036323"
                    xAxisLabel="name"
                    showtick={true}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </PageCardComponent>

      {/* Modal */}
      <ModalComponent
        isOpen={isOpen}
        content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
        onCancel={() => setIsOpen(false)}
        onProceed={() => setIsOpen(false)}
        submitBtnText="Ok"
      />
    </Spin>
  );
}
