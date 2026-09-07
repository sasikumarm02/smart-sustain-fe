import React from 'react';
import DashboardContent from '../../Components/content/DashboardContent';
import { envWasteGenCols, envWasteGenDataSource } from '../Emission/mock';
import { Col, Row } from 'antd';

export default function SupplierView({ mutliData, companyName }: any) {
  return (
    <>
      <Row className="mt-4 mb-0 d-flex align-items-center">
        <Col span={12}>
          <h5 style={{ color: '#23456A' }}>{companyName}</h5>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <p>
            Reporting Period:{' '}
            <span style={{ color: '#040404', fontWeight: 700 }}>
              FY 2023-24
            </span>
          </p>
          <p>
            Due Date:{' '}
            <span style={{ color: '#00B8F5', fontWeight: 700 }}>
              22-April-2024
            </span>
          </p>
        </Col>
      </Row>
      <DashboardContent
        mutliData={mutliData}
        breadcrumb=""
        separatorReq="true"
        // authRole="COMPANY_MAKER"
      />
    </>
  );
}
