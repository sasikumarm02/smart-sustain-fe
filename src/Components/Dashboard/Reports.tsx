import { PageCardComponent, TableComponent } from '../../DesignLibrary';
import Styles from './Dashboard.module.scss';
import PeerPdf from '../../Modules/PeerBench/PeerPdf';
import PeerExcel from '../../Modules/PeerBench/PeerExcel';
import WaterPDF from '../Emissions/Environment/WaterPDF';
import EffuentsPdf from '../../Modules/Environment/EffuentsPDF';
import { WastePDF } from '../Emissions/Environment/WastePDF';
import EmissionPdf from '../../Components/ReportPdf/EmissionPdf';
import AssessmentPDF from '../Assesment/AssessmentPDF';
import BoardPdf from '../../Modules/Governance/BoardPdf';
import GovernanceCompliancePdf from '../Emissions/Environment/GovernanceCompliancePdf';
import SafetyPdf from '../../Modules/Governance/SafetyPdf';
import EmployeePdf from '../EmployeeDemoGraphics/Tab/EmployeePdf';
import { useAuth } from '../../Hooks/useAuth';
import CustomEmissionPdf from '../CustomEmissionFactor/CustomEmissionPdf';
import GriPdfReportWithIcon from '../ReportPdf/GriPdfReportWithIcon';
import IssbPdf from '../../Modules/ISSB/ViewAnalysis/IssbPdf';
import IssbExcel from '../../Modules/ISSB/ViewAnalysis/IssbExcel';
import { Row, Select } from 'antd';
import PdfUploadISvg from '../../assets/Svg/ISSBSvg/PdfUploadISvg';
import DownloadIssbSvg from '../../assets/Svg/ISSBSvg/DownloadIssbSvg';

const dataSource = [
  {
    key: '1',
    module: 'Environment',
    reportName: 'GHG Emissions Report',
    format: <EmissionPdf report={true} />,
  },
  {
    key: '2',
    module: 'Environment',
    reportName: 'Water Withdrawal & Consumption Report',
    format: <WaterPDF report={true} />,
  },
  {
    key: '3',
    module: 'Environment',
    reportName: 'Effluents Report',
    format: <EffuentsPdf report={true} />,
  },
  {
    key: '4',
    module: 'Environment',
    reportName: 'Waste Management Report',
    format: <WastePDF activeTab="Disposed" report={true} />,
  },
  {
    key: '5',
    module: 'Social',
    reportName: 'Employee Demographics Report',
    format: <EmployeePdf report={true} />,
  },
  {
    key: '6',
    module: 'Social',
    reportName: 'Safety Performance Report',
    format: <SafetyPdf report={true} />,
  },
  {
    key: '7',
    module: 'Governance',
    reportName: 'Board and Management Composition Report',
    format: <BoardPdf report={true} />,
  },
  {
    key: '8',
    module: 'Governance',
    reportName: 'Governance Compliance Report',
    format: <GovernanceCompliancePdf report={true} />,
  },
  {
    key: '9',
    module: 'ESG Maturity Assessment',
    reportName: 'Maturity Assessment Report',
    format: <AssessmentPDF report={true} />,
  },
  {
    key: '10',
    module: 'Peer Benchmarking',
    reportName: 'Peer Benchmarking Report',
    format: [<PeerPdf report={true} />, <PeerExcel />],
  },
  {
    key: '11',
    module: 'GRI Standards',
    reportName: 'GRI Report',
    format: <GriPdfReportWithIcon report={true} />,
  },
  {
    key: '12',
    module: 'General',
    reportName: 'Custom Emission Factor Report',
    format: <CustomEmissionPdf report={true} />,
  },
  {
    key: '13',
    module: 'ISSB',
    reportName: 'ISSB Gap Assessment Report',
    format: [<IssbPdf report={true} />, <IssbExcel />],
  },
];

const columns = [
  {
    title: 'S.No.',
    dataIndex: 'key',
    key: 'key',
    width: 60,
  },
  {
    title: 'Module',
    dataIndex: 'module',
    key: 'module',
  },
  {
    title: 'Report Name',
    dataIndex: 'reportName',
    key: 'reportName',
  },
  {
    title: 'Format',
    dataIndex: 'format',
    key: 'format',
    render: (formats: any) => (
      <div className={`${Styles.formats}`}>
        {Array.isArray(formats) ? (
          formats.map((format: any, index: number) => (
            <>
              <span>{format}</span>
            </>
          ))
        ) : (
          <span>{formats}</span>
        )}
      </div>
    ),
  },
];

const ReportsTable = () => {
  const { user } = useAuth();

  // Function to filter the data source based on the user's role
  const getFilteredDataSource = () => {
    // If user is ADMIN, return all reports

    return dataSource;
  };

  // Function to adjust S.No. dynamically
  const adjustedDataSource = getFilteredDataSource().map((item, index) => ({
    ...item,
    key: (index + 1).toString(), // Adjust serial number based on filtered data
  }));

  return (
    <>
      <PageCardComponent className={Styles.pageStyle}>
        <>
          <Row>
            <p className={Styles.headingRepOne}>
              Access and download all your reports in one centralized dashboard.
              Use the category filters to quickly find and download specific
              types of reports. With support for multiple categories, you can
              choose to view all reports or narrow down by selecting your
              desired categories for a more streamlined experience.
            </p>
          </Row>
          <Row>
            <p className={Styles.headingRep}>Environment</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>GHG Emissions Report</div>
              <div className="ms-auto">
                <EmissionPdf report={true} />
              </div>
            </div>

            <div
              className={`d-flex align-items-center mx-2 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>
                Water Withdrawal & Consumption Report
              </div>
              <div className="ms-auto">
                <WaterPDF report={true} />
              </div>
            </div>

            <div
              className={`d-flex align-items-center mx-2  ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Effluents Report</div>
              <div className="ms-auto">
                <EffuentsPdf report={true} />
              </div>
            </div>

            <div
              className={`d-flex align-items-center mx-2 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Waste Management Report</div>
              <div className="ms-auto">
                <WastePDF activeTab="Disposed" report={true} />
              </div>
            </div>
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>Social</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Employee Demographics Report</div>
              <div className="ms-auto">
                <EmployeePdf report={true} />
              </div>
            </div>

            <div
              className={`d-flex align-items-center mx-2 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Safety Performance Report</div>
              <div className="ms-auto">
                <SafetyPdf report={true} />
              </div>
            </div>
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>Governance</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Board Composition Report</div>
              <div className="ms-auto">
                <BoardPdf report={true} />
              </div>
            </div>

            <div
              className={`d-flex align-items-center mx-2 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Governance Compliance Report</div>
              <div className="ms-auto">
                <GovernanceCompliancePdf report={true} />
              </div>
            </div>
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>ESG Maturity Assessment</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>
                ESG Maturity Assessment Report
              </div>
              <div className="ms-auto">
                <AssessmentPDF report={true} />
              </div>
            </div>
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>Peer Benchmarking</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>Peer Benchmarking Report</div>
              <div className="ms-auto">
                <PeerPdf report={true} />
              </div>
            </div>

            {/* <div className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}>
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>
                Peer Benchmarking Excel
              </div>
              <div className="ms-auto">
                <PeerExcel report={true} />
              </div>
            </div> */}
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>Custom Emission Factor</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>
                Custom Emission Factor Report
              </div>
              <div className="ms-auto">
                <CustomEmissionPdf report={true} />
              </div>
            </div>
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>GRI</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>GRI Report</div>
              <div className="ms-auto">
                <GriPdfReportWithIcon report={true} />
              </div>
            </div>
          </Row>

          <Row className="mt-2">
            <p className={Styles.headingRep}>ISSB</p>
          </Row>

          <Row>
            <div
              className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}
            >
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>ISSB Gap Analysis Report</div>
              <div className="ms-auto">
                <IssbPdf report={true} />
              </div>
            </div>

            {/* <div className={`d-flex align-items-center mx-2 mb-3 ${Styles.reportsDiv}`}>
              <div className="me-2">
                <PdfUploadISvg />
              </div>
              <div style={{ color: 'black' }}>
                ISSB Excel
              </div>
              <div className="ms-auto">
                <IssbExcel />
              </div>
            </div> */}
          </Row>

          {/* 
          <TableComponent
            data={adjustedDataSource}
            columnHeader={columns}
            enableRowSelection={false}
          /> */}
        </>
      </PageCardComponent>
    </>
  );
};

export default ReportsTable;
