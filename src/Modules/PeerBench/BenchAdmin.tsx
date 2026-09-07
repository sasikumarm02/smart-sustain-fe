import { Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import Styles from './Peerbench.module.scss';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import Edit from './PeerEdit';
import { useLocation, useNavigate } from 'react-router-dom';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { isEmpty } from '../../Utils/isEmpty';

function BenchAdmin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [companies, setCompanies] = useState([]);
  const [data, setData] = useState([]);

  const performanceGetData = async () => {
    try {
      const res = await get(
        `/peerBenchmarking/peer_selection/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(res?.response) && res?.response) {
        const results = res?.response;
        setSelectedIndustry(results?.industry || '');
        setCompanies(results?.companies || []);

        const mappedData =
          results?.data?.map((item: any, index: any) => ({
            key: index + 1,
            topic: item.topic,
            data_point: item.data_points,
          })) || [];

        setData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    performanceGetData();
  }, []);

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: '450px',
    },
    {
      title: 'Data Point',
      dataIndex: 'data_point',
      key: 'data_point',
      render: (data_points: any) => (
        <div>
          {data_points.map((point: any, index: any) => (
            <span key={index} className={Styles.dataPointItem}>
              {point}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const handleEditClick = () => {
    navigate('/admin-bench-edit', {
      state: { data, companies, selectedIndustry },
    });
  };

  const { state } = useLocation();
  const companies2 = state?.companies || [];
  const data2 = state?.data || [];
  const industry = state?.selectedIndustry;

  useEffect(() => {
    if (!isEmpty(companies2.length !== 0) && companies2.length !== 0) {
      setCompanies(companies2);
    }
    if (!isEmpty(data2.length !== 0) && data2.length !== 0) {
      setData(data2);
    }
    if (!isEmpty(industry) && industry) {
      setSelectedIndustry(industry);
    }
  }, [companies2, data2, industry]);

  const currentCompany = user.entity_name;

  return (
    <>
      <PageCardComponent className={Styles.pageCardPadding}>
        <Row className={Styles.header}>
          <Col span={8}>
            <p className={Styles.subtitle}>Sector</p>
            <p className={Styles.industryTitle}>{selectedIndustry}</p>
          </Col>
          <Col span={10}>
            <p className={Styles.subtitle}>Selected Companies</p>
            {companies
              .filter((company) => company !== currentCompany) // Exclude currentCompany
              .map((company, index) => (
                <div key={index} className={Styles.companyItem}>
                  {company}
                </div>
              ))}
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <ButtonComponent onClick={handleEditClick}>
              Edit <Edit className={Styles.editpsvg} />
            </ButtonComponent>
          </Col>
        </Row>

        <TableComponent
          data={data}
          columnHeader={columns}
          enableRowSelection={false}
          columnCheckBoxTitle="S.No."
          columnCheckBoxDataAttribute="key"
          isRowExpand={false}
          showCountForCheckBox={true}
          showOnlyCount={true}
          noText={`The configuration for this company has not been completed yet.
                  Please visit the ESG Configuration page to complete the
                  configuration.`}
        />
      </PageCardComponent>
    </>
  );
}

export default BenchAdmin;
