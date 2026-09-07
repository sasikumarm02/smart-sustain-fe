import React from 'react';
import Styles from '../Dashboard/Dashboard.module.scss';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row } from 'antd';

function AboutUs() {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation instead of the global "location"

  // Get the previous page from state (fallback to home if undefined)
  const previousPage = location.state?.from;

  const handleBack = () => {
    navigate(previousPage);
  };

  return (
    <>
      <PageCardComponent style={{ height: '500px' }}>
        <p className={Styles.title}>About Us</p>
        <p className={Styles.aboutText}>
          SMART - Sustain.AI is designed for internal use by ESG team. As
          sustainability reporting becomes a key milestone in an organisation’s
          sustainability journey, many face challenges such as data
          fragmentation, inconsistent standards, and increasing regulatory
          pressures. That’s where SMART comes in, the tool addresses these
          industry-wide challenges by simplifying and streamlining the reporting
          process, ensuring accuracy, compliance, and transparency. Beyond its
          suite of sustainability-related reporting tools, including ESG
          Dashboards and Metrics, the Emissions Calculator, GRI Disclosures
          Tool, and ISSB Gap Assessment, SMART also offers Maturity Assessment
          and Peer Benchmarking features. These powerful tools empower
          organisations to assess their ESG standing, benchmark against market
          expectations and regulatory requirements, and gain strategic insights
          by comparing progress with industry peers. With SMART, our clients can
          navigate their ESG journey with confidence, clarity, and efficiency.
        </p>
        <Row justify="end">
          <ButtonComponent
            hierarchy="tertiary"
            onClick={handleBack}
            style={{ marginTop: '200px' }}
          >
            Back to Home
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default AboutUs;
