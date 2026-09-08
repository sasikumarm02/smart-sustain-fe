import { Card, Col, Collapse, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Styles from './report.module.scss';
import jsonData from './reportQuestion.json';
import image from '../../assets/image/image 8.png';
import cardImage from '../../assets/image/image_gri.png';
import cardImage_1 from '../../assets/image/image_gri_1.png';
import cardImage_2 from '../../assets/image/image_gri_2.png';
import { ImageCard } from '../../Components/ReportCard/ImageCard';
import tree from '../../assets/Svg/RectangleTree.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import GriPdfReport from '../../Components/ReportPdf/GriPdfReport';
import { ModalComponent, TableComponent } from '../../DesignLibrary';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { isEmpty } from '../../Utils/isEmpty';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import CardlistComponent from '../../DesignLibrary/CardDesignComponent';
import GriPdfReportWithIcon from '../../Components/ReportPdf/GriPdfReportWithIcon';
import { getCurrentYear } from '../../Components/Emissions/Scope3/Helpers';
import Flower1 from '../../assets/Svg/MaturityAssessment/MatVector1.svg';
import griImg from '../../assets/Svg/griStartImg.svg';

// import { apiBaseUrl } from "../../Services";

const { Panel } = Collapse;

export default function Report() {
  const { user } = useAuth();
  const [cureentTab, setCurrentTab] = useState<string>('0');
  const [data, setdata] = useState([{}]);
  const [catSubCatData, setCatSubCatData] = useState<any[]>([]);
  const assignedValue = [
    jsonData.general,
    jsonData.Environmental,
    jsonData.Social,
    jsonData.Governance,
  ];

  function convertResponseToMetricData(response: any) {
    let metricData = [];
    let keyCounter = 1;

    for (const category in response) {
      if (response.hasOwnProperty(category)) {
        const categoryData = response[category];
        metricData.push({
          key: keyCounter.toString(),
          title: categoryData.category_id,
          description: `${categoryData.category_id} ${categoryData.category_name}`,

          date: '01-June-2024',
        });
        keyCounter++;
      }
    }

    return metricData;
  }

  const gristatusConverter = (status: string) => {
    const numStatus = Number(status);
    switch (true) {
      case numStatus === 0:
        return 'Not Yet Started';
      case numStatus > 0 && numStatus < 100:
        return 'In Progress';
      case numStatus === 100:
        return 'Completed';
      default:
        return ' - ';
    }
  };

  const columnHeader: ColumnsType<any[]> = [
    {
      title: 'Material Topics',
      dataIndex: 'category_name',
      key: 'category_name',
      align: 'left',
      width: user.role === 'DATA_PROVIDER' ? '30%' : '40%',
      onFilter: (value: any, record: any) => record.category_name === value,
      sorter: (a: any, b: any) =>
        a.category_name.localeCompare(b.category_name),
    },
    // {
    //   title: 'Sub Topics',
    //   dataIndex: 'sub_category_name_id',
    //   key: 'sub_category_name_id',
    //   align: 'left',
    //   width: 400,
    //   onFilter: (value: any, record: any) => record.sub_category_name_id === (value),
    //   sorter: (a: any, b: any) => a.sub_category_name_id.localeCompare(b.sub_category_name_id),
    // },
    {
      title: 'Completion %',
      dataIndex:
        user.role !== 'DATA_PROVIDER'
          ? 'completion_percentage'
          : 'sub_category_completion_percentage',
      key:
        user.role !== 'DATA_PROVIDER'
          ? 'completion_percentage'
          : 'sub_category_completion_percentage',
      width: user.role === 'DATA_PROVIDER' ? '20%' : '30%',
      sorter: (a: any, b: any) =>
        user.role !== 'DATA_PROVIDER'
          ? a.completion_percentage - b.completion_percentage
          : a.sub_category_completion_percentage -
            b.sub_category_completion_percentage,
      render: (value: any) => <div>{value}%</div>,
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      width: user.role === 'DATA_PROVIDER' ? '20%' : '30%',
      render: (value: any) => {
        return (
          <div>{!isEmpty(value) && moment(value).format('DD-MM-YYYY')}</div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex:
        user.role === 'DATA_PROVIDER'
          ? 'subcategory_status_data'
          : 'category_status_data',
      key:
        user.role === 'DATA_PROVIDER'
          ? 'subcategory_status_data'
          : 'category_status_data',
      width: user.role === 'DATA_PROVIDER' ? '20%' : '30%',
      onFilter: (value: any, record: any) =>
        user.role === 'DATA_PROVIDER'
          ? record.subcategory_status_data === value
          : record.category_status_data === value,
      render: (status: any) => (
        <StatusComponent
          text={status}
          status={
            status === 'Completed'
              ? 'success'
              : status === 'Not Yet Started'
                ? 'failure'
                : status === 'In Progress'
                  ? 'warning'
                  : 'warning'
          }
        />
      ),
    },
  ];

  const findActionReq = (val: any) => {
    if (user.role === 'DATA_PROVIDER') {
      if (val === 'For DP Submission' || val === 'For DP Revision') {
        return true;
      }
    } else if (user.role === 'L1_DATA_REVIEWER') {
      if (val === 'For L1 DR Revision' || val === 'For L1 Review') {
        return true;
      }
    } else if (user.role === 'L2_DATA_REVIEWER') {
      if (val === 'For L2 DR Revision' || val === 'For L2 Review') {
        return true;
      }
    } else if (user.role === 'L3_DATA_REVIEWER') {
      if (val === 'For L3 DR Revision' || val === 'For L3 Review') {
        return true;
      }
    } else if (user.role === 'L1_DATA_APPROVER') {
      if (val === 'For L1 DA Re-approval' || val === 'For L1 Approval') {
        return true;
      }
    } else if (user.role === 'L2_DATA_APPROVER') {
      if (val === 'For L2 Approval') {
        return true;
      }
    }
    return false;
  };

  const griResponseDataConverter = (resArray: any[]) => {
    // Map categories
    const categoryArr = resArray
      .map((obj, index) => ({
        category_id: obj.category_id,
        category_name: obj.category_name,
        completion_percentage: obj.completion_percentage,
        category_status: obj.category_status,
        category_status_data: gristatusConverter(obj.completion_percentage),
        max_DR: obj?.max_DR,
        max_DA: obj?.max_DA,
        target_date: obj?.target_date,
        update_status: obj?.sub_categories?.filter((subVal: any) => {
          return findActionReq(subVal?.status);
        }),
      }))
      // Sort categories alphabetically by `category_name`
      .sort((a, b) => a.category_name.localeCompare(b.category_name));

    // Map categories with subcategories
    const categoryWithSubcategories = resArray
      .flatMap((category) => {
        return category.sub_categories.map((subcategory: any) => ({
          category_id: category.category_id,
          category_name: category.category_name,
          completion_percentage: category.completion_percentage,
          category_status: category.category_status,
          sub_category_id: subcategory.sub_category_id,
          sub_category_name: subcategory.sub_category_name,
          sub_category_name_id: `${subcategory.sub_category_id} - ${subcategory.sub_category_name}`,
          sub_category_completion_percentage:
            subcategory.sub_category_completion_percentage,
          sub_category_status: subcategory.sub_category_status,
          category_status_data: gristatusConverter(
            category.completion_percentage
          ),
          subcategory_status_data: gristatusConverter(
            subcategory.sub_category_completion_percentage
          ),
          max_DR: category?.max_DR,
          max_DA: category?.max_DA,
          target_date: category?.target_date,
          sub_category_count: subcategory.question_count,
          update_status: category.sub_categories?.filter((subVal: any) => {
            return findActionReq(subVal?.status);
          }),
        }));
      })
      // Sort subcategories by `category_name` and `sub_category_id`
      .sort((a, b) => {
        // First sort by category_name alphabetically
        const categoryCompare = a.category_name.localeCompare(b.category_name);
        if (categoryCompare !== 0) return categoryCompare;

        // If category_name is the same, sort by sub_category_id numerically
        return a.sub_category_id.localeCompare(b.sub_category_id, undefined, {
          numeric: true,
        });
      });

    // Bind data based on user role
    if (user.role === 'DATA_PROVIDER') {
      setCatSubCatData(categoryWithSubcategories);
    } else {
      setCatSubCatData(categoryArr);
    }
  };

  useEffect(() => {
    get(
      `/report/get_reporting_analytics/?entityID=${user.entity_Id}&role=${user.role}`
    )
      .then((res: any) => {
        if (res.response.status !== false) {
          // setdata(res.response.data);
          griResponseDataConverter(res.response.data);
          // setdata(jsonDataRes.response.data);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageData = [
    {
      image: cardImage,
      description: 'Facility Transparency & Accountability',
      additionalData: [
        { number: 1 },
        { number: 2 },
        { number: 3 },
        { number: 4 },
      ],
      title: 'GRI Reporters',
      count: '14,000',
    },
    {
      image: cardImage_1,
      description: 'Universal Framework for Sustainability reporting',
      additionalData: [{ number: 4 }, { number: 5 }, { number: 6 }],
      title: 'Countries',
      count: 100,
    },
    {
      image: cardImage_2,
      description: 'Defines Sector Specific Standards',
      title: 'G250 Companies reports GRI',
      count: '78%',
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const handleCardClick = (data: any) => {
    const query = encodeURIComponent(data.category_id);

    navigate(`/reports/compliance/${query}`);
  };

  const handleRowClick = (record: any) => {
    navigate(
      `/reports/compliance?category_id=${record.category_id}&category_name=${record.category_name}&sub_category_id=${record.sub_category_id}&sub_category_name=${record.sub_category_name}&max_DR=${record?.max_DR}&max_DA=${record?.max_DA}`
    );
  };

  const columnsUpdated = () => {
    const a = [...columnHeader];
    if (user.role === 'DATA_PROVIDER') {
      a.splice(1, 0, {
        title: 'Sub Topics',
        dataIndex: 'sub_category_name_id',
        key: 'sub_category_name_id',
        align: 'left',
        width: '30%',
        onFilter: (value: any, record: any) =>
          record.sub_category_name_id === value,
        sorter: (a: any, b: any) =>
          a.sub_category_name_id.localeCompare(b.sub_category_name_id),
      });
    }
    return a;
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const levels = [
    { level: 'GRI Reporters', label: '14,000' },
    { level: 'Countries', label: '100' },
    { level: 'G250 Companies reports GRI', label: '78%' },
  ];

  return (
    <>
      <div>
        <Row
          style={{ height: '100%' }}
          className={`${Styles.customWidth90} d-flex justify-content-around`}
        >
          <Col
            span={24}
            className={`${Styles.customBorderRadius15} ${Styles.customBoxShadow} bg-white `}
          >
            <Row className="p-4" gutter={[16, 16]}>
              {/* Text Section */}
              <Col xs={24} md={12}>
                <h6
                  className={`${Styles.customfontsize21} ${Styles.lineHeight28} fw-normal`}
                >
                  Welcome to the
                </h6>
                <h4
                  className={`${Styles.fontSize36} ${Styles.lineHeight40} ${Styles.primeColor} fw-normal`}
                >
                  GRI Standards
                </h4>
                <p
                  className={`${Styles.customfontsize17} ${Styles.lineHeight28} ${Styles.customTextColorGrey} fw-normal`}
                >
                  GRI provide the world's most widely used sustainability
                  reporting standards, which cover topics that range from
                  biodiversity to tax, waste to emissions, diversity and
                  equality to health and safety. As such, GRI reporting is the
                  enabler for transparency and dialogue between companies and
                  their stakeholders.
                </p>
              </Col>

              {/* Image Section */}
              <Col
                xs={24}
                sm={12}
                md={6}
                className="d-flex flex-column align-items-center"
              >
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <img
                    src={Flower1}
                    alt="Flower One"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      marginBottom: '1rem',
                    }}
                  />
                  <img
                    src={griImg}
                    alt="Gri Image"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </Col>

              {/* Card Section */}
              <Col xs={24} sm={12} md={6}>
                <div className={Styles.cardOneMat}>
                  <div className={Styles.levelTextHead}>
                    Countries Under going GRI
                  </div>
                  {levels.map(({ level, label }) => (
                    <div className={Styles.levelText} key={level}>
                      <span>{level}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            {/* Card List Component */}
            <CardlistComponent
              cardHeaderContent={
                'Contribute towards your organisation’s sustainability goals.'
              }
              data={catSubCatData}
            />
          </Col>
        </Row>

        <ModalComponent
          isOpen={isOpen}
          content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
          onCancel={() => setIsOpen(false)}
          onProceed={() => setIsOpen(false)}
          submitBtnText="Ok"
        />
      </div>
    </>
  );
}
