import { useEffect, useState } from 'react';
import { Col, Row, Tabs } from 'antd';
import CountCard from '../CountCards/CountCard';
import FormComponent from '../Form/FormComponent';
import { PageCardComponent } from '../../../DesignLibrary';
import { useAuth } from '../../../Hooks/useAuth';
import { get } from '../../../Services';
import styles from '../CountCards/CountCard.module.scss';
import {
  Total,
  Male,
  Female,
  BelowThirty,
  ThirtyToFifty,
  AboveFifty,
} from '../../../assets/Svg/Demographics/index';
import { useLocation } from 'react-router-dom';
import { isEmpty } from '../../../Utils/isEmpty';

const { TabPane } = Tabs;

const TabsForms = () => {
  const [stats1, setStats1] = useState([]);
  const [stats2, setStats2] = useState([]);
  const [stats3, setStats3] = useState([]);
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location?.state || '1');

  const formProps = [
    {
      title: 'Number of Employee',
      subtitle: 'Please Select the Proper Employment Type',
      columnHeaders: ['Employment Category', 'Gender Category', 'Age Category'],
      fieldName: 'Type of Employee',
      getApi: '/employee/get_employee_number/',
      createApi: '/employee/create_employee_number/',
      formOptions: [
        'Full-time Employees',
        'Part-time Employees',
        'Permanent Employees',
        'Temporary Employees',
        'Contractual Employees',
        'Non-Guaranteed Hours Employees',
      ],
      initialValue: [
        {
          employee_type: '',
          male: null,
          female: null,
          age_lt_30: null,
          age_30_to_50: null,
          age_gt_50: null,
        },
      ],
      countCardData: [
        {
          imageSrc: <Total />,
          ...(stats1.length > 0 ? stats1[0] : { title: 'Total', value: 0 }),
        },
        {
          imageSrc: <Male />,
          ...(stats1.length > 0
            ? stats1[1]
            : { title: 'Total Male ', value: 0 }),
        },
        {
          imageSrc: <Female />,
          ...(stats1.length > 0
            ? stats1[2]
            : { title: 'Total Female', value: 0 }),
        },
        {
          imageSrc: <BelowThirty />,
          ...(stats1.length > 0 ? stats1[3] : { title: 'Age <30 ', value: 0 }),
        },
        {
          imageSrc: <ThirtyToFifty />,
          ...(stats1.length > 0 ? stats1[4] : { title: 'Age 30-50', value: 0 }),
        },
        {
          imageSrc: <AboveFifty />,
          ...(stats1.length > 0 ? stats1[5] : { title: 'Age >50', value: 0 }),
        },
      ],
    },
    {
      title: 'Employee Turnover',
      subtitle: 'Please select the proper Turnover Type',
      getApi: '/employee/get_employee_turnover/',
      columnHeaders: ['Turn Over Category', 'Gender Category', 'Age Category'],
      createApi: '/employee/create_employee_turnover/',
      formOptions: ['Voluntary Turnover', 'Involuntary Turnover'],
      fieldName: 'Type of Turnover',
      countCardData: [
        {
          imageSrc: <Total />,
          ...(stats2.length > 0 ? stats2[0] : { title: 'Total', value: 0 }),
        },
        {
          imageSrc: <Male />,
          ...(stats2.length > 0
            ? stats2[1]
            : { title: 'Total Male ', value: 0 }),
        },
        {
          imageSrc: <Female />,
          ...(stats2.length > 0
            ? stats2[2]
            : { title: 'Total Female', value: 0 }),
        },
        {
          imageSrc: <BelowThirty />,
          ...(stats2.length > 0 ? stats2[3] : { title: 'Age <30 ', value: 0 }),
        },
        {
          imageSrc: <ThirtyToFifty />,
          ...(stats2.length > 0 ? stats2[4] : { title: 'Age 30-50', value: 0 }),
        },
        {
          imageSrc: <AboveFifty />,
          ...(stats2.length > 0 ? stats2[5] : { title: 'Age >50', value: 0 }),
        },
      ],
      initialValue: [
        {
          turnover_type: '',
          male: null,
          female: null,
          age_lt_30: null,
          age_30_to_50: null,
          age_gt_50: null,
        },
      ],
    },
    {
      title: 'New Hires',
      subtitle: 'Please Enter the Proper Hiring Type',
      columnHeaders: ['Hiring Category', 'Gender Category', 'Age Category'],
      createApi: '/employee/create_employee_hire/',
      getApi: '/employee/get_employee_new_hire/',
      fieldName: 'Hiring',
      countCardData: [
        {
          imageSrc: <Total />,
          ...(stats3.length > 0 ? stats3[0] : { title: 'Total', value: 0 }),
        },
        {
          imageSrc: <Male />,
          ...(stats3.length > 0
            ? stats3[1]
            : { title: 'Total Male ', value: 0 }),
        },
        {
          imageSrc: <Female />,
          ...(stats3.length > 0
            ? stats3[2]
            : { title: 'Total Female', value: 0 }),
        },
        {
          imageSrc: <BelowThirty />,
          ...(stats3.length > 0 ? stats3[3] : { title: 'Age <30 ', value: 0 }),
        },
        {
          imageSrc: <ThirtyToFifty />,
          ...(stats3.length > 0 ? stats3[4] : { title: 'Age 30-50', value: 0 }),
        },
        {
          imageSrc: <AboveFifty />,
          ...(stats3.length > 0 ? stats3[5] : { title: 'Age >50', value: 0 }),
        },
      ],
      formOptions: [
        'Full-time Employees',
        'Part-time Employees',
        'Permanent Employees',
        'Temporary Employees',
        'Contractual Employees',
        'Non-Guaranteed Hours Employees',
      ],
      initialValue: [
        {
          hiring_type: '',
          male: null,
          female: null,
          age_lt_30: null,
          age_30_to_50: null,
          age_gt_50: null,
        },
      ],
    },
  ];
  const { user } = useAuth();
  const fetchData = (activeKey: any) => {
    const apiPath = formProps[parseInt(activeKey) - 1].getApi;
    get(`${apiPath}?entity_Id=${user.entity_Id}`)
      .then((res: any) => {
        if (!isEmpty(res?.response?.status) && res?.response?.status === true) {
          if (res?.response?.data) {
            if (activeKey === '1') {
              setStats1(res?.response?.stats);
            } else if (activeKey === '2') {
              setStats2(res?.response?.stats);
            } else {
              setStats3(res?.response?.stats);
            }
          } else {
          }
        }
      })
      .catch((err) => {})
      .finally(() => {});
  };
  const handleTabChange = (activeKey: any) => {
    fetchData(activeKey);
    setActiveKey(activeKey);
  };

  useEffect(() => {
    fetchData(activeKey);
  }, []);
  return (
    <>
      {/* <h4 className="pageTitle mt-4 mb-2">
        Reporting Period Employee Demographics
      </h4> */}
      <PageCardComponent customClass={styles.pageCardStyle}>
        <Tabs
          onChange={handleTabChange}
          defaultActiveKey={activeKey}
          className="employee"
        >
          {formProps.map((props, index) => (
            <TabPane tab={props.title} key={String(index + 1)}>
              <Row gutter={[0, 15]} justify="center" align="middle">
                {props?.countCardData?.map((card: any, index: any) => (
                  <Col
                    xl={4}
                    lg={6}
                    md={10}
                    sm={12}
                    xs={24}
                    key={index}
                    className={
                      index === props.countCardData.length - 1
                        ? ''
                        : styles.customPaddingRight
                    }
                  >
                    {/* <CountCard
                      imageSrc={card.imageSrc}
                      title={card.title}
                      total={card.value}
                    /> */}
                    <div
                      style={{
                        backgroundColor: '#0D304A',
                        borderRadius: '16px',
                        padding: '20px',
                        width: '100%', // changed from fixed 220px to full column width
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
                        {card.title}
                      </h5>
                      <p
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#fff',
                        }}
                      >
                        {card.value}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
              <FormComponent {...props} activetab={activeKey} />
            </TabPane>
          ))}
        </Tabs>
      </PageCardComponent>
    </>
  );
};

export default TabsForms;
