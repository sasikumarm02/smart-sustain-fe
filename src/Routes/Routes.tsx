import { ReactNode, lazy, Suspense } from 'react';
import Login from '../Modules/UserScreen/Logins/Login';
import DashboardContent from '../Components/content/DashboardContent';
import {
  AssuranceSecondCols,
  AssurancefirstCols,
  GHGEmissionEnergyConsumptionCol,
  GHGEmissionMobileCol,
  GHGEmissionProcessCol,
  GHGEmissionStationaryCol,
  HoldingColumns,
  HoldingDataSource,
  ProductCols,
  SuppGeneralCols,
  SuppSustainCols,
  SuppTargetCols,
  SupplierCols,
  WasteData,
  WasteFirstCol,
  WasteSecondCol,
  WaterCol,
  addPartnerFormFields,
  businessPartnerCols,
  businessPartnersData,
  catFiveAvgMethodcols,
  catFiveSupplierMethodcols,
  catFiveWasteMethodcols,
  catTwoAvgMethodcols,
  catTwoSpendMethodcols,
  catTwoSupplierMethodcols,
  communityCols,
  emissionFacCols,
  envEnergyConsumpCols,
  goveranceEticalsecondCol,
  governanceCertificationsCols,
  governanceDataBreachIncidentsCols,
  governanceEthicalCols,
  governanceSustainabilityCols,
  reportingBoundaryCols,
  settingsEsgNextReportPeriodsCols,
  settingsEsgPrevReportPeriodsCols,
  settingsMaterialTopicsDataSource,
  socialBenefitsCols,
  socialCommunityCols,
  socialCommunityDevelopmentCols,
  socialDevelopmentCols,
  socialEmployeesOpeningCols,
  socialImpactAssesmentsCols,
  socialImpactAssesmentsGenSecCols,
  socialImpactAssesmentsGenderCols,
  socialImpactAssesmentsSecCols,
  socialIncidentsCols,
  socialOccHealthCols,
  socialOccSafeCols,
  socialParentalCols,
  socialPerformanceCols,
  userRoleMappingCols,
  catThirteenAssestSpecificcolsScope1,
  catThirteenAssestSpecificcolsScope2,
  catThirteenAvgDatacolsAsset,
  catThirteenAvgDatacolsFloor,
  catThirteenLesseSpecificcols,
  catThreeTransmisson,
  catThreeGeneration,
  catThreePurchasedElectricity,
  catThreePurchasedFuels,
  catSixSpendBasedcols,
  catSixDistanceBasedcols,
  catSixFuelBasedcols,
  catSixAccommodationcols,
  catOneAvgMethodcols,
  catOneSpendMethodcols,
  catOneSupplierMethodcols,
  waterWithdrawalCols,
  wasteManagementCols,
  catOneAvgMethodTabCols,
  catOneSpendMethodTabCols,
  catOneSupplierMethodTabCols,
  catTwoAvgMethodTabCols,
  catTwoSpendMethodTabCols,
  catTwoSupplierMethodTabCols,
  catFiveSupplierMethodTabCols,
  catFiveWasteMethodTabcols,
  catFiveAvgMethodTabCols,
  catThreeTransmissonTabCols,
  catThreeGenerationTabCols,
  catSixFuelBasedTabCols,
  catSixDistanceBasedTabCols,
  catSixSpendBasedTabCols,
  catSixAccommodationTabCols,
  catThreePurchasedFuelsTabCols,
  catThreePurchasedElectricityTabCols,
} from '../Modules/Emission/mock';
import {
  mockNameFaciColumns,
  mockOnBoardingColumns,
} from '../Modules/Emission/mock';

import AddEntity from '../Modules/UserScreen/CompanyOnboard/AddEntity';
import AddCompany from '../Modules/UserScreen/CompanyOnboard/AddCompany';
import AddFacility from '../Modules/UserScreen/CompanyOnboard/AddFacility';
import SignUp from '../Modules/UserScreen/SignUp/SignUp';
import ProcessEmission from '../Modules/UserScreen/ProcessEmission/ProcessEmission';
import Details from '../Modules/UserScreen/Dashboards/Detail';

import BenefitsForm from '../Components/Social/Benefits/Form';
import CommunityDevelopment from '../Components/Social/CommunityDevelopment/Form';
import DevelopmentTraining from '../Components/Social/Development&Training/Form';
import EnvironmentImpact from '../Components/Social/EnvironmentImpact/Form';
import ReportingBoundary from '../Components/Social/ReportingBoundary/Form';
import IncidentOfDiscrimination from '../Components/Social/IncidentOfDiscrimination/Form';
import OccuptionalHealthSafety from '../Components/Social/OccuptionalHealth&Safety/Form';
import PaternalLeave from '../Components/Social/PaternalLeave/Form';
import PerformanceCareer from '../Components/Social/Performance&Career/Form';
import SocialImpactAssesment from '../Components/Social/SocialImpactAssesment/Form';
import DataBreach from '../Components/Governance/DataBreachInci/Forms';
import AntiCorruptionTraining from '../Components/Governance/TrainingAboutAntiCorruption/Forms';
import EnergyConsumption from '../Components/Environment/EnergyConsumption/Forms';
import WaterConsumption from '../Components/Environment/WaterConsumption/Forms';
import WasteGeneration from '../Components/Environment/WasteGeneration/Forms';
import EmployeeForm from '../Components/Social/Employee/Forms';
import Stepper from '../Components/Settings/Stepper';
import ChangePassword from '../Modules/Auth/ChangePassword/ChangePassword';
import CreatePassword from '../Modules/Auth/CreatePassword/CreatePassword';
import { ResetPassword } from '../Modules/Auth/ResetPassword/ResetPassword';
import VerifyOtp from '../Modules/Auth/ResetPassword/VerifyOtp';
import AddMember from '../Modules/MemberList/AddMember';
import CommunityForm from '../Components/Community/CommunityForm';
import BussinessPartnerForm from '../Components/BussinessPartner/BussinessPartnerForm';
import ProductServicesForm from '../Components/ProductServices/ProductServicesForm';
import Certification from '../Components/Governance/Certification/Form';
import Sustainability from '../Components/Governance/Sustainability/Form';
import Assurance from '../Components/Governance/Assurance/Form';
import { permissions } from '../Utils/Roles';
import DisclosureQuestion from '../Components/Settings/DisclosureQuestion';
import AddBoardingCompany from '../Modules/UserScreen/CompanyOnboard/AddBoardingCompany';
import SupplierView from '../Modules/Suppliers/SupplierView';
import SupplierDashboard from '../Modules/Suppliers/SupplierDashboard';
import AdminDashboard from '../Components/Dashboard/AdminDashboard';
import SupplierForm from '../Modules/Suppliers/SupplierForm';
import DisclosureAssigned from '../Modules/Disclosures/DisclosureAssigned';
import DisclosureReview from '../Modules/Disclosures/DisclosureReview';
import Report from '../Modules/ReportingScreens/Report';
import QuestionsPage from '../Modules/QuestionsPage';
import AssessmentReport from '../Components/Assesment/AssessmentReport';
import CompanyList from '../Modules/UserScreen/CompanyOnboard/CompanyList';
import AssessmentStart from '../Components/Assesment/AssessmentStart';
import BoardandComposition from '../Modules/Governance/BoardandComposition';
import AssessmentEnd from '../Components/Assesment/AssessmentEnd';
import MaturityStart from '../Components/Assesment/MaturityStart';
import AssessmentLevel from '../Components/Assesment/AssessmentLevel';

import AdminList from '../Modules/Admin/AdminList';
import ReportCompliance from '../Modules/ReportingScreens/ReportCompliance';
import {
  UserLandingPage,
  AdminLandingPage,
  DataProviderLandingPage,
} from '../Modules/Admin/UserLandingPage';
import MapUser from '../Modules/UserManagement/mapUser';
import AssesmentBenchMark from '../Components/Graph/AssesmentBenchMark';
import ScopeTwoForm from '../Modules/UserScreen/ProcessEmission/ScopeTwoForm';
import GriPdfReport from '../Components/ReportPdf/GriPdfReport';
import CustomCarbonTable from '../Components/Table/CustomCarbonTable';
import CustomCarbonDetails from '../Components/Table/CustomCarbonDetails';
import ViewConfig from '../Components/Settings/ViewConfig';
import CurrencyConversion from '../Components/Settings/CurrencyConversion';
import Signoff from '../Modules/ReportingScreens/sign-off';
import SampleRenderingComponent from '../DesignLibrary/SampleRenderingComponent';
import ScopeThreeTable from '../Components/Emissions/Scope3/scopethreeTable';
import ScopeThreeForm from '../Components/Emissions/Scope3/scopeThreeForm';
import UserRoleModule from '../Modules/UserManagement/UserRoleModule';
import UserRoleSelect from '../Modules/UserScreen/CompanyOnboard/UserRoleSelect';
import TabsForms from '../Components/EmployeeDemoGraphics/Tab/Tab';
import TabDataView from '../Components/EmployeeDemoGraphics/Tab/TabDataView';
import NestedTabs from '../Components/Emissions/Scope3/NestedTabs';
import NewSocial from '../Components/SocialDashboard/SocialSubFolder/NewSocial';
import FacilitiesandInjuries from '../Modules/Governance/FacilitiesandInjuries';
import FacilitiesandInjuriesList from '../Modules/Governance/FatalitiesandInjuriesList';
import BoardandCompositionList from '../Modules/Governance/BoardandCompositionList';
import EnvironmentForm from '../Components/Emissions/Environment/EnvironmentForm';
import EnvironmentTable from '../Components/Emissions/Environment/EnvironmentTable';
import Effluents from '../Modules/Environment/Effluents';
import EffluentsList from '../Modules/Environment/EffluentsList';
import SafetyPerformance from '../Components/SocialDashboard/SocialSubFolder/SafetyPerformance';
import BoardandManagementCompositionDashboard from '../Components/Dashboard/GovernanceDashboard/BoardandManagementCompositionDashboard';
import GovernanceComplianceDashboard from '../Components/Dashboard/GovernanceDashboard/GovernanceCompliance';
import AcceptRejectNotification from '../Modules/UserScreen/CompanyOnboard/AcceptRejectNotification';
import EmissionCalculatorMapping from '../Modules/UserManagement/Emission/EmissionCalculatorMapping';
import UserMapping from '../Modules/UserManagement/Emission/ReviewerMapping';
import TargetEnvironmentGHG from '../Components/Targets/TargetEnvironmentGHG';
import TargetEnvironmentWater from '../Components/Targets/TargetEnvironmentWater';
import TargetEnvironmentWaste from '../Components/Targets/TargetEnvironmentWaste';
import TargetGovernance from '../Components/Targets/TargetGovernance';
import TargetSocial from '../Components/Targets/TargetSocial';
import GovernanaceComplianceTable from '../Components/Emissions/Environment/GovernanceComplianceTable';
import GovernanceComplianceForm from '../Components/Emissions/Environment/GovernanceComplianceForm';
import CustomEFForm from '../Components/CustomEmissionFactor/Form';
import EmissionFactorList from '../Components/CustomEmissionFactor/List';
import EnviromentInputForm from '../Components/Emissions/Environment/EnviromentInputForm';
import Water from '../Components/Emissions/Environment/Water';
import RoleMappingForm from '../Modules/UserManagement/RoleMapping/GRI/RoleMappingForm';
import ReportingComplianceMapping from '../Modules/UserManagement/RoleMapping/GRI';
import EmissionMapForm from '../Modules/UserManagement/Emission/EmissionMapForm';
import AssessmentSub from '../Components/Assesment/AssessmentSub';
import MaturityAssessmentQues from '../Components/Assesment/MaturityAssessmentQues';
import EditMaturityAsses from '../Components/Assesment/EditMaturityAsses';
import AssessmentLevelScore from '../Components/Assesment/AssessmentLevelScore';
import UserMgmtDashboardContent from '../Components/content/UserMgmtDashboardContent';
import FacilityDashboardContent from '../Components/content/FacilityDashboardContent';
import AssessmentLevelScoreEdit from '../Components/Assesment/AssessmentLevelScoreEdit';
import ManageCompanyDashboardContent from '../Components/content/ManageCompanyDashboardContent';
import CatThirteenTable from '../Components/Emissions/Scope3/catThirteenTable';
import CatThirteenForm from '../Components/Emissions/Scope3/catThirteenForm';
import ForgotPassword from '../Modules/Auth/ResetPassword/ForgotPassword';
import EsgPeerData from '../Modules/PeerBench/EsgPeerData';
import EsgPeerDataEdit from '../Modules/PeerBench/EsgPeerDataEdit';
import EsgPeerManage from '../Modules/PeerBench/EsgPeerManage';
import BenchAdmin from '../Modules/PeerBench/BenchAdmin';
import BenchAdminEdit from '../Modules/PeerBench/BenchAdminEdit';
import BenchAdminView from '../Modules/PeerBench/BenchAdminView';
import EsgPeerManageEdit from '../Modules/PeerBench/EsgPeerManageEdit';
import Questionairres from '../Components/Questionairres/Questionairres1/Questionairres';
import Questionairres2 from '../Components/Questionairres/Questionairres2/Questionairres';
import Questionairres5 from '../Components/Questionairres/Questionairres5/Questionairres';
import Questionairres6 from '../Components/Questionairres/Questionairres6/Questionairres';
import Questionairres13 from '../Components/Questionairres/Questionairres13/Questionairres';
import CategorylandingPage from '../Components/Questionairres/CategorylandingPage/CategorylandingPage';
import DataApproverEdit from '../Modules/UserManagement/RoleMapping/GRI/DataApproverEdit';
import DataProviderEdit from '../Modules/UserManagement/RoleMapping/GRI/DataProviderEdit';
import DataReviewerEdit from '../Modules/UserManagement/RoleMapping/GRI/DataReviewerEdit';
import DataApproverEmissionEdit from '../Modules/UserManagement/Emission/DataApproverEmissionEdit';
import DataReviewerEmissionEdit from '../Modules/UserManagement/Emission/DataReviewerEmissionEdit';
import DataProviderEmissionEdit from '../Modules/UserManagement/Emission/DataProviderEmissionEdit';
import WasteManagementDashboard from '../Components/Dashboard/WasteManagementDashboard';
import WaterManagementDashboard from '../Components/Dashboard/WaterManagementDashboard';
import AssessmentViewResponses from '../Components/Assesment/AssessmentViewResponses';
import AssessmentEditResponses from '../Components/Assesment/AssessmentEditResponses';
import CompleteISSB from '../Modules/ISSB/CompleteISSB/CompleteISSB';
import ReportsTable from '../Components/Dashboard/Reports';
import ViewAnalysis from '../Modules/ISSB/ViewAnalysis/ViewAnalysis';
import ISSBQuestionsPage from '../Modules/ISSB/CompleteISSB/ISSBQuestionsPage/ISSBQuestionsPage';
import ViewResult from '../Modules/ISSB/ViewResult/ViewResult';
import ISSBCoreContent from '../Modules/ISSB/ISSBCoreContent/ISSBCoreContent';
import ISSBApplicationGuidance from '../Modules/ISSB/ISSBApplicationGuidance/ISSBApplicationGuidance';
import PeerSelectEdit from '../Modules/PeerBench/PeerSelectEdit';
import ViewResultAnalysis from '../Modules/ISSB/ViewResult/ViewResultAnalysis';
import ManageGriTable from '../Modules/ManageGriQuestion/ManageGriTable/ManageGriTable';
import ManageGriEdit from '../Modules/ManageGriQuestion/ManageGriEdit/ManageGriEdit';
import VerifyResetOtp from '../Modules/Auth/ResetPassword/VerifyResetPassword';
import ISSB from '../Modules/UserManagement/ISSB';
import ISSBMappingForm from '../Modules/UserManagement/ISSB/issbUserMaping';
import ISSBMappingEdit from '../Modules/UserManagement/ISSB/issbUserEdit';
import TargetSettingGHG from '../Modules/TargetScreens/TargetSettingGHG';
import TargetSettingWater from '../Modules/TargetScreens/TargetSettingWater';
import TargetSettingWaste from '../Modules/TargetScreens/TargetSettingWaste';
import TargetSettingGovernance from '../Modules/TargetScreens/TargetSettingGovernance';
import TargetSettingSocial from '../Modules/TargetScreens/TargetSettingSocial';
import AuditView from '../Modules/AuditLogs/AuditView';
import EsgConfigTable from '../Components/Settings/EsgConfigTable';
import StepperEdit from '../Components/Settings/StepperEdit';
import SuperView from '../Modules/SuperAdmin/SuperView';
import AboutUs from '../Components/Dashboard/AboutUs';
import CustomEFEdit from '../Components/CustomEmissionFactor/CustomEFEdit';
import EditCompany from '../Modules/UserScreen/CompanyOnboard/EditCompany';

interface RouteBase {
  path: string;
  element: ReactNode;
}

interface ProtectedRoutes extends RouteBase {
  roles: string[];
}

export const protectRoutes: ProtectedRoutes[] = [
  {
    path: '/emission-calculator',
    //element: <MainDashboard />,
    element: <CustomCarbonTable />,
    roles: [permissions.VIEW_ENVIORNMENT_DASHBOARD],
  },
  {
    path: '/process-emission',
    element: <ProcessEmission />,
    roles: [permissions.VIEW_EMISSIONS_FORM],
  },
  {
    path: '/environment/emissions',
    element: (
      <DashboardContent
        dataTab={true}
        showFilter={true}
        mutliData={[
          {
            title: 'Stationary Combustion',
            dataSource: [],
            calculateApi: 'Emissions/calculate_stationary_emissions/',
            columns: GHGEmissionStationaryCol,
            multiAuthRole: '*',
            apiUrl: '/Emissions/get_stationary_combustion/',
            superApi: '/Emissions/super_get_stationary_combustion/',
            restatedApi: '/Emissions/calculate_stationary_emissions_as_per_FY/',
          },
          {
            title: 'Mobile Combustion',
            dataSource: [],
            calculateApi: '/Emissions/calculate_mobile_related_emission/',
            columns: GHGEmissionMobileCol,
            multiAuthRole: '*',
            apiUrl: '/Emissions/get_mobile_combustion/',
            superApi: '/Emissions/super_get_mobile_combustion/',
            restatedApi: '/Emissions/calculate_mobile_combustion_as_per_FY/',
          },
          {
            title: 'Process Emissions',
            dataSource: [],
            calculateApi: '/Emissions/calculate_process_related_emission/',
            columns: GHGEmissionProcessCol,
            multiAuthRole: '*',
            apiUrl: '/Emissions/get_process_emission/',
            superApi: '/Emissions/super_get_process_emission/',
            restatedApi: '/Emissions/calculate_process_emission_as_per_FY/',
          },
          {
            title: 'Fugitive Emissions',
            dataSource: [],
            calculateApi: '/Emissions/calculate_fugitive_related_emission/',
            columns: GHGEmissionProcessCol,
            multiAuthRole: '*',
            apiUrl: '/Emissions/get_fugitive_emission/',
            superApi: '/Emissions/super_get_fugitive_emission/',
            restatedApi: '/Emissions/calculate_fugitive_emission_as_per_FY/',
          },
        ]}
        btnPath="/process-emission"
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'Emission Calculator', path: 'null' },
        ]}
        btnLabel="Add"
        authRole="DATA_PROVIDER"
        separatorReq="true"
        pathEntity={true}
        apiUrl="/Emissions/get_stationary_combustion/"
      />
    ),
    roles: [permissions.VIEW_SUBMIT_SCOPE_1],
  },
  {
    path: '/environment/carbon-footprint',
    element: <CustomCarbonTable />,
    roles: [permissions.VIEW_CARBON_FOOTPRINT],
  },
  {
    path: '/environment/carbon-footprint/details',
    element: <CustomCarbonDetails />,

    roles: [permissions.VIEW_CARBON_FOOTPRINT],
  },
  {
    path: '/emission/scope-two',
    element: <ScopeTwoForm />,
    roles: [permissions.VIEW_EMISSIONS_SECOND_FORM],
  },

  {
    path: '/environment/scope2',
    element: (
      <DashboardContent
        dataTab={true}
        mutliData={[
          {
            title: 'Energy Consumption',
            dataSource: [],
            columns: GHGEmissionEnergyConsumptionCol,
            calculateApi: '/energy/calculate_energy_emissions/',
            multiAuthRole: '*',
            apiUrl: '/energy/get-energy-consumption/',
            superApi: '/energy/super_get_energy_consumption/',
            restatedApi: '/energy/calculate_energy_consumption_as_per_FY/',
          },
        ]}
        btnPath="/emission/scope-two"
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'Emission Calculator', path: 'null' },
        ]}
        btnLabel="Add"
        authRole="DATA_PROVIDER"
        separatorReq="true"
        pathEntity={true}
        apiUrl="/energy/get-energy-consumption/"
      />
    ),
    roles: [permissions.VIEW_SUBMIT_SCOPE_2],
  },
  {
    path: '/environment/energy-consumption',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={envEnergyConsumpCols}
        btnPath="/environment/energy-consumption/forms"
        breadcrumb={[
          { label: 'Environment /', path: 'null' },
          { label: 'Energy Consumption', path: 'null' },
        ]}
        btnLabel="Add"
        authRole="*"
        separatorReq="true"
      />
    ),
    roles: [permissions.VIEW_ENERGY],
  },
  {
    path: '/environment/water-consumption',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={WaterCol}
        btnPath="/environment/water-consumption/forms"
        breadcrumb={[
          { label: 'Environment /', path: 'null' },
          { label: 'Water Consumption', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="FACILITY_MAKER"
      />
    ),
    roles: [permissions.VIEW_WATER],
  },
  {
    path: '/environment/waste-generation',
    element: (
      <DashboardContent
        dataTab={true}
        mutliData={[
          {
            title: 'Waste Generation and Reuse',
            dataSource: [],
            columns: WasteFirstCol,
            multiAuthRole: [
              'COMPANY_AUTHORIZER',
              'COMPANY_MAKER',
              'FACILITY_AUTHORIZER',
              'FACILITY_MAKER',
            ],
          },
          {
            title: 'Waste Disposal',
            dataSource: WasteData,
            columns: WasteSecondCol,
            multiAuthRole: [
              'COMPANY_AUTHORIZER',
              'COMPANY_MAKER',
              'FACILITY_AUTHORIZER',
              'FACILITY_MAKER',
            ],
          },
        ]}
        btnPath="/environment/waste-generation/forms"
        breadcrumb={[
          { label: 'Environment /', path: 'null' },
          { label: 'Waste Generation', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="FACILITY_MAKER"
      />
    ),
    roles: [permissions.VIEW_WASTE],
  },
  {
    path: '/social/employees',
    element: (
      <DashboardContent
        dataTab={true}
        mutliData={[
          {
            title: 'Opening Number of Employees',
            dataSource: [],
            columns: socialEmployeesOpeningCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            title: 'Left during the Period',
            dataSource: [],
            columns: socialEmployeesOpeningCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            title: 'New hires',
            dataSource: [],
            columns: socialEmployeesOpeningCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            title: 'Current No. of Employees',
            dataSource: [],
            columns: socialEmployeesOpeningCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
        ]}
        btnPath="/social/employee/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Employees', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_EMPLOYESS],
  },
  {
    path: '/social/occupational-health',
    element: (
      <DashboardContent
        mutliData={[
          {
            dataSource: [],
            columns: socialOccHealthCols,
            multiAuthRole: ['FACILITY_MAKER'],
            size: '12',
          },
          {
            dataSource: [],
            columns: socialOccSafeCols,
            multiAuthRole: ['FACILITY_MAKER'],
            size: '12',
          },
        ]}
        btnPath="/social/occuptional-health/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Occupational Health & Safety', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="FACILITY_MAKER"
      />
    ),
    roles: [permissions.VIEW_OCCUPATIONAL],
  },
  {
    path: '/social/development-training',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={socialDevelopmentCols}
        btnPath="/social/add-development-training/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Development & Training', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_DEVELOPMENT_TRAINING],
  },
  {
    path: '/social/performance-career',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={socialPerformanceCols}
        btnPath="/social/add-performance-career/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Performance & career development reviews', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_PERFORMANCE_CAREER],
  },
  {
    path: '/social/incidents-discrimination',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={socialIncidentsCols}
        btnPath="/social/incidentof-discrimination/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Incidents of discrimination', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_INCIDENTS_DISCRIMINATION],
  },
  {
    path: '/social/impact-assessment',
    element: (
      <DashboardContent
        mutliData={[
          {
            dataSource: [],
            columns: socialImpactAssesmentsGenderCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            dataSource: [],
            columns: socialImpactAssesmentsGenSecCols,
            multiAuthRole: ['COMPANY_MAKER'],
          },
        ]}
        btnPath="/social/add-impact-assessment/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          {
            label: 'Social Impact Assessment including Gender impact Assesment',
            path: 'null',
          },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_IMPACT_ASSESSMENT],
  },
  {
    path: '/social/environment-assessment',
    element: (
      <DashboardContent
        mutliData={[
          {
            dataSource: [],
            columns: socialImpactAssesmentsCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            dataSource: [],
            columns: socialImpactAssesmentsSecCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
        ]}
        btnPath="/social/envoronmental-impact/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          {
            label: 'Environmental Impact Assessment',
            path: 'null',
          },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_ENVIRONMENT_ASSESSMENT],
  },
  {
    path: '/social/community-development',
    element: (
      <DashboardContent
        mutliData={[
          {
            dataSource: [],
            columns: socialCommunityDevelopmentCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            dataSource: [],
            columns: socialCommunityCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
        ]}
        btnPath="/social/community-development/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Community Development Programs', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_COMMUNITY_DEVELOPMENT],
  },
  {
    path: '/governance/data-breach-incidents',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={governanceDataBreachIncidentsCols}
        btnPath="/governance/add-data-breach/form"
        breadcrumb={[
          { label: 'Governance /', path: 'null' },
          { label: 'Data breach incidents during the period', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_DATA_BREACH],
  },
  {
    path: '/goverance/ethical-behavior',
    element: (
      <DashboardContent
        dataTab={true}
        mutliData={[
          {
            title: 'Incidents',
            dataSource: [],
            columns: governanceEthicalCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            title: 'Communication and Training',
            dataSource: [],
            columns: goveranceEticalsecondCol,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
        ]}
        btnPath="/governance/add-ethical/form"
        breadcrumb={[
          { label: 'Governance /', path: 'null' },
          { label: 'Ethical Behavior', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_ETHICAL_BEHAVIOR],
  },
  {
    path: '/supplier/view',
    element: (
      <SupplierView
        mutliData={[
          {
            title: 'General ',
            dataSource: [],
            columns: SuppGeneralCols,
            multiAuthRole: [
              'COMPANY_AUTHORIZER',
              'COMPANY_MAKER',
              'COMPANY_USER',
            ],
          },
          {
            title: 'Sustainability ',
            dataSource: [],
            columns: SuppSustainCols,
            multiAuthRole: [
              'COMPANY_AUTHORIZER',
              'COMPANY_MAKER',
              'COMPANY_USER',
            ],
          },
          {
            title: 'Emission factors for the Products',
            dataSource: [],
            columns: emissionFacCols,
            multiAuthRole: [
              'COMPANY_AUTHORIZER',
              'COMPANY_MAKER',
              'COMPANY_USER',
            ],
          },
          {
            title: 'Target',
            dataSource: [],
            columns: SuppTargetCols,
            multiAuthRole: [
              'COMPANY_AUTHORIZER',
              'COMPANY_MAKER',
              'COMPANY_USER',
            ],
          },
        ]}
        breadcrumb={[
          { label: '', path: 'null' },
          { label: '', path: 'null' },
        ]}
        companyName="Virtual Company Ltd"
      />
    ),
    roles: [permissions.VIEW_ETHICAL_BEHAVIOR],
  },
  {
    path: '/goverance/certification',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={governanceCertificationsCols}
        btnPath="/governance/certification/form"
        breadcrumb={[
          { label: 'Goverance /', path: 'null' },
          { label: 'Certifications', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_CERTIFICATION],
  },
  {
    path: '/goverance/sustainability-disclosures',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={governanceSustainabilityCols}
        btnPath="/governance/sustainability/form"
        breadcrumb={[
          { label: 'Goverance /', path: 'null' },
          { label: 'Sustainability Disclosures', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_SUSTAINABILITY_DISCLOSURES],
  },
  {
    path: '/goverance/assurance',
    element: (
      <DashboardContent
        dataTab={true}
        mutliData={[
          {
            title: 'Internal',
            dataSource: [],
            columns: AssurancefirstCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
          {
            title: 'External',
            dataSource: [],
            columns: AssuranceSecondCols,
            multiAuthRole: ['COMPANY_AUTHORIZER', 'COMPANY_MAKER'],
          },
        ]}
        btnPath="/governance/assurance/form"
        breadcrumb={[
          { label: 'Goverance /', path: 'null' },
          { label: 'Assurance', path: 'null' },
        ]}
        separatorReq="true"
        btnLabel="Add"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_ASSURANCE],
  },

  {
    path: '/settings/name-of-the-facilities',
    element: (
      <FacilityDashboardContent
        dataSource={[]}
        columns={mockNameFaciColumns}
        btnPath="/add-facility"
        breadcrumb={[{ label: 'Facility Profiles', path: 'null' }]}
        btnLabel="Create Facility"
        authRole="*"
        separatorReq="true"
        apiUrl="/facility/get_Facility/"
        pathEntity={true}
        type="facilty"
      />
    ),
    roles: [permissions.VIEW_MANAGE_FACILITY_PROFILE],
  },
  {
    path: '/settings/onBoard-companies',
    element: (
      <ManageCompanyDashboardContent
        dataSource={[]}
        columns={mockOnBoardingColumns}
        table2DataSource={HoldingDataSource}
        table2Columns={HoldingColumns}
        table2title="Holding, Subsidiary & Associate Companies"
        btnPath="/add-entity"
        breadcrumb={[{ label: 'Manage Company Profile', path: 'null' }]}
        btnLabel="Add Company"
        tableAuth={['COMPANY_AUTHORIZER', 'COMPANY_MAKER']}
        separatorReq="true"
        apiUrl="/entity/entityByEntityId/"
        //authRole="ADMIN"
        path="companyList"
        selectCompany={true}
      />
    ),
    roles: [permissions.VIEW_COMPANY_LIST],
  },
  {
    path: '/company-list',
    element: <CompanyList />,
    roles: [permissions.VIEW_COMPANY_LIST],
  },
  {
    path: '/issb-gap-assesment',
    element: <CompleteISSB />,
    roles: [permissions.VIEW_ISSB_GAP],
  },
  {
    path: '/ISSB-Gap-Analysis-Results',
    element: <ViewAnalysis />,
    roles: [permissions.VIEW_ISSB_GAP_ADMIN],
  },
  {
    path: '/ISSB-Gap-assesment/core-content',
    element: <ISSBCoreContent />,
    roles: [permissions.VIEW_ISSB_GAP],
  },
  {
    path: '/ISSB-Gap-assesment/application-guidance',
    element: <ISSBApplicationGuidance />,
    roles: [permissions.VIEW_ISSB_GAP],
  },
  {
    path: '/ISSB-Gap-Results',
    element: <ViewResult />,
    roles: [permissions.VIEW_ISSB_GAP_ADMIN],
  },
  {
    path: '/ISSB-Gap-Results-analysis',
    element: <ViewResultAnalysis />,
    roles: [permissions.VIEW_ISSB_GAP_ADMIN],
  },
  {
    path: '/user-role',
    element: <UserRoleSelect />,
    roles: [permissions.VIEW_COMPANY_LIST],
  },
  {
    path: '/manage-client/create-profile',
    element: <AdminList />,
    roles: [permissions.VIEW_CREATE_CLIENT_PROFILE],
  },
  {
    path: '/super-admin-landing',
    element: <UserLandingPage />,
    roles: [permissions.VIEW_USER_LANDING_PAGE],
  },
  {
    path: '/admin-landing',
    element: <AdminLandingPage />,
    roles: [permissions.VIEW_ADMIN_LANDING_PAGE],
  },
  {
    path: '/landing-page',
    element: <DataProviderLandingPage />,
    roles: [permissions.VIEW_LANDING_PAGE],
  },
  {
    path: '/notification-acceptance',
    element: <AcceptRejectNotification />,
    roles: [permissions.VIEW_COMPANY_LIST],
  },
  {
    path: '/user-access-management/user-management',
    element: (
      <UserMgmtDashboardContent
        mutliData={[
          {
            title: '',
            dataSource: [],
            columns: communityCols,
            multiAuthRole: '*',
            apiUrl: '/entity/users_list/',
          },
        ]}
        btnPath="/community/form"
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'User Management', path: 'null' },
        ]}
        btnLabel="Create User"
        separatorReq="true"
        authRole="*"
        apiUrl="/entity/users_list/"
      />
    ),
    roles: [permissions?.VIEW_USER_MANAGEMENT],
  },
  {
    path: '/map-user-emission',
    element: <UserMapping></UserMapping>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/role-mapping-emission',
    element: <EmissionCalculatorMapping></EmissionCalculatorMapping>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/issb-role-mapping',
    element: <ISSB></ISSB>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/issb-role-mapping-form',
    element: <ISSBMappingForm></ISSBMappingForm>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/issb-role-mapping-edit',
    element: <ISSBMappingEdit></ISSBMappingEdit>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/edit-role-mapping-emission-approver',
    element: <DataApproverEmissionEdit />,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/edit-role-mapping-emission-provider',
    element: <DataProviderEmissionEdit />,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/edit-role-mapping-emission-reviewer',
    element: <DataReviewerEmissionEdit />,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/map-user-compliance',
    element: <RoleMappingForm></RoleMappingForm>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/edit-user-compliance-approver',
    element: <DataApproverEdit />,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/edit-user-compliance-provider',
    element: <DataProviderEdit />,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/edit-user-compliance-reviewer',
    element: <DataReviewerEdit />,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/user-mapping-emission',
    element: <EmissionMapForm></EmissionMapForm>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/role-mapping-compliance',
    element: <ReportingComplianceMapping></ReportingComplianceMapping>,
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/user-access-management/user-role-mapping',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={userRoleMappingCols}
        btnPath="/map-user"
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'User-Role Mapping', path: 'null' },
        ]}
        btnLabel="Map User"
        separatorReq="true"
        authRole="*"
        apiUrl="/invite/data_providerList/"
        pathEntity={true}
        stats={[
          { title: 'Total Material Topics', value: '6' },
          { title: 'Assigned', value: '6' },
          { title: 'Completed', value: '6' },
          { title: 'Overdue', value: '6' },
          { title: 'Pending', value: '6' },
        ]}
      />
    ),
    roles: [permissions.VIEW_USER_ROLE_MAPPING],
  },
  {
    path: '/map-user',
    element: <UserRoleModule />,
    roles: [permissions.VIEW_COMMUNITY_FORM],
  },

  {
    path: '/business-partner',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={businessPartnerCols}
        btnPath="/add-partner"
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'Business Partners', path: 'null' },
        ]}
        btnLabel="Invite Business Partner"
        separatorReq="true"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_BUSINESS_PARTNER],
  },
  {
    path: '/product-services',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={ProductCols}
        btnPath="/product-services/form"
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'Business Partners', path: 'null' },
        ]}
        btnLabel="Add"
        separatorReq="true"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_PRODUCT_SERVICE],
  },
  {
    path: '/add-partner',
    element: (
      <AddMember
        formFields={addPartnerFormFields}
        pageTitle="Invite Business Partner"
      />
    ),
    roles: [permissions.VIEW_PARTNER_FORM],
  },
  {
    path: '/dashboard/details',
    element: <Details />,
    roles: [permissions.VIEW_EMISSIONS_DASHBOARD],
  },
  {
    path: '/governance/boardcomposition/dashboard',
    element: <BoardandManagementCompositionDashboard />,
    roles: [permissions.VIEW_GOVERANCE_DASHBOARD],
  },
  {
    path: '/governance/compliance/dashboard',
    element: <GovernanceComplianceDashboard />,
    roles: [permissions.VIEW_GOVERANCE_DASHBOARD],
  },
  {
    path: '/social/demographics/dashboard',
    element: <NewSocial />,
    roles: [permissions.VIEW_SOCIAL_DASHBOARD],
  },
  {
    path: '/social/safetyperformance/dashboard',
    element: <SafetyPerformance />,
    roles: [permissions.VIEW_SOCIAL_DASHBOARD],
  },
  {
    path: '/reports/dashboard',
    element: <ReportsTable />,
    roles: [permissions.VIEW_SOCIAL_DASHBOARD],
  },
  {
    path: '/target/environment-ghg',
    element: <TargetSettingGHG />,
    roles: [permissions.VIEW_TARGET_SETTING],
  },
  {
    path: '/target/environment-water',
    element: <TargetSettingWater />,
    roles: [permissions.VIEW_TARGET_SETTING],
  },
  {
    path: '/target/environment-waste',
    element: <TargetSettingWaste />,
    roles: [permissions.VIEW_TARGET_SETTING],
  },
  {
    path: '/target/governance',
    element: <TargetSettingGovernance />,
    roles: [permissions.VIEW_TARGET_SETTING],
  },
  {
    path: '/target/social',
    element: <TargetSettingSocial />,
    roles: [permissions.VIEW_TARGET_SETTING],
  },

  {
    path: '/add-facility',
    element: <AddFacility />,
    roles: [permissions.VIEW_FACILITY_FORM],
  },
  {
    path: '/add-entity',
    element: <AddEntity />,
    roles: [permissions.VIEW_ENTITY_FORM],
  },
  {
    path: '/add-company',
    element: <AddCompany />,
    roles: [permissions.VIEW_CREATE_CLIENT_PROFILE],
  },
  {
    path: '/edit-company',
    element: <EditCompany />,
    roles: [permissions.VIEW_CREATE_CLIENT_PROFILE],
  },

  {
    path: '/product-services/form',
    element: <ProductServicesForm />,
    roles: [permissions.VIEW_SERVICES_FORM],
  },
  {
    path: '/social/community-development/form',
    element: <CommunityDevelopment />,
    roles: [permissions.VIEW_COMMUNITY_DEVELOPMENT_FORM],
  },
  {
    path: '/social/add-development-training/form',
    element: <DevelopmentTraining />,
    roles: [permissions.VIEW_TRAINING_FORM],
  },
  {
    path: '/social/envoronmental-impact/form',
    element: <EnvironmentImpact />,
    roles: [permissions.VIEW_ENVIORNMENT_IMPACT_FORM],
  },
  {
    path: '/social/incidentof-discrimination/form',
    element: <IncidentOfDiscrimination />,
    roles: [permissions.VIEW_DISCRIMAINATION_FORM],
  },
  {
    path: '/social/occuptional-health/form',
    element: <OccuptionalHealthSafety />,
    roles: [permissions.VIEW_OCCUPTIONAL_FORM],
  },
  {
    path: '/social/paternal-leave',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={socialParentalCols}
        btnPath="/social/add-parental-leaves/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Parental leave', path: 'null' },
        ]}
        btnLabel="Add"
        separatorReq="true"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_PATERNAL],
  },
  {
    path: '/social/add-parental-leaves/form',
    element: <PaternalLeave />,
    roles: [permissions.VIEW_PATERNAL_FORM],
  },
  {
    path: '/social/benefits',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={socialBenefitsCols}
        btnPath="/social/add-benefits/form"
        breadcrumb={[
          { label: 'Social /', path: 'null' },
          { label: 'Benefits', path: 'null' },
        ]}
        btnLabel="Add"
        separatorReq="true"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_BENEFITS],
  },
  {
    path: '/social/add-benefits/form',
    element: <BenefitsForm />,
    roles: [permissions.VIEW_BENEFITS_FORM],
  },
  {
    path: '/social/add-performance-career/form',
    element: <PerformanceCareer />,
    roles: [permissions.VIEW_PERFORMANCE_FORM],
  },
  {
    path: '/social/add-impact-assessment/form',
    element: <SocialImpactAssesment />,
    roles: [permissions.VIEW_SOCIAL_IMPACT_FORM],
  },
  {
    path: '/social/employee/form',
    element: <EmployeeForm />,
    roles: [permissions.VIEW_EMPLOYEE_FORM],
  },
  {
    path: '/governance/add-data-breach/form',
    element: <DataBreach />,
    roles: [permissions.VIEW_DATA_BREACH_FORM],
  },
  {
    path: '/governance/add-ethical/form',
    element: <AntiCorruptionTraining />,
    roles: [permissions.VIEW_ANTI_CORRUPTION_FORM],
  },
  {
    path: '/governance/certification/form',
    element: <Certification />,
    roles: [permissions.VIEW_CERTIFICATION_FORM],
  },
  {
    path: '/governance/sustainability/form',
    element: <Sustainability />,
    roles: [permissions.VIEW_SUSTAINABILITY_FORM],
  },
  {
    path: '/governance/assurance/form',
    element: <Assurance />,
    roles: [permissions.VIEW_ASSURANCE_FORM],
  },
  {
    path: '/environment/energy-consumption/forms',
    element: <EnergyConsumption />,
    roles: [permissions.VIEW_ENERY_FORM],
  },
  {
    path: '/environment/water-consumption/forms',
    element: <WaterConsumption />,
    roles: [permissions.VIEW_WATER_FORM],
  },
  {
    path: '/environment/waste-generation/forms',
    element: <WasteGeneration />,
    roles: [permissions.VIEW_WASTE_FORM],
  },

  {
    path: '/community/form',
    element: <CommunityForm />,
    roles: [permissions.VIEW_COMMUNITY_FORM],
  },
  {
    path: '/bussiness-partner/form',
    element: <BussinessPartnerForm />,
    roles: [permissions.VIEW_BUSSINESS_PARTNER_FORM],
  },
  {
    path: '/esg-config',
    element: <Stepper />,
    roles: [permissions.VIEW_ESG_CONFIGURATION],
  },
  {
    path: '/esg-config-edit',
    element: <StepperEdit />,
    roles: [permissions.VIEW_ESG_CONFIGURATION],
  },
  {
    path: '/view-config',
    element: <ViewConfig />,
    roles: [permissions.VIEW_ESG_CONFIGURATION_TABLE],
  },
  {
    path: '/view-config-table',
    element: <EsgConfigTable />,
    roles: [permissions.VIEW_ESG_CONFIGURATION_TABLE],
  },
  {
    path: '/view-currency-conversion',
    element: <CurrencyConversion />,
    roles: [permissions.VIEW_CURRENCY_CONVERSION],
  },
  {
    path: '/setting/reporting-boundary',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={reportingBoundaryCols}
        btnPath="/reporting-boundary/form"
        breadcrumb={[
          { label: 'Settings /', path: 'null' },
          { label: 'Reporting Boundary', path: 'null' },
        ]}
        btnLabel="Add Reporting boundary"
        separatorReq="true"
        authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_REPORTING_BOUNDARY],
  },
  {
    path: '/reporting-boundary/form',
    element: <ReportingBoundary />,
    roles: [permissions.VIEW_REPORTING_BOUNDARY_FORM],
  },
  {
    path: '/settings/esgReport-framework',
    element: (
      <DashboardContent
        mutliData={[
          {
            title: 'Previous Reporting Periods',
            dataSource: [],
            columns: settingsEsgPrevReportPeriodsCols,
            multiAuthRole: '*',
          },
          {
            title: 'Next Reporting Period',
            dataSource: [],
            columns: settingsEsgNextReportPeriodsCols,
            multiAuthRole: ['COMPANY_AUTHORIZER'],
          },
        ]}
        listData={settingsMaterialTopicsDataSource}
        // showSelect={
        //   <CompanysList
        //     options={[
        //       { value: "companyA", label: "Company A" },
        //       { value: "companyB", label: "Company B" },
        //       { value: "companyC", label: "Company C" },
        //       { value: "companyD", label: "Company D" },
        //     ]}
        //   />
        // }
        btnPath="/esg-config"
        breadcrumb={[
          { label: 'Settings /', path: 'null' },
          { label: 'ESG Reporting Framework', path: 'null' },
        ]}
        btnLabel="Add"
        authRole="*"
        separatorReq="true"
        // apiUrl="/framework/get_ESGframework/"
      />
    ),
    roles: [permissions.VIEW_FRAME_WORK_LIST],
  },
  {
    path: '/settings/company/onboarding-company',
    element: <AddBoardingCompany />,
    roles: [permissions.VIEW_ONBOARDING_COMPANY],
  },
  {
    path: '/settings/supplier-list',
    element: (
      <DashboardContent
        dataSource={[]}
        columns={SupplierCols}
        breadcrumb={[
          { label: '', path: 'null' },
          { label: 'Supplier List', path: 'null' },
        ]}
        btnLabel="Add"
        separatorReq="true"
        // authRole="COMPANY_MAKER"
      />
    ),
    roles: [permissions.VIEW_SUPPLIER_LIST],
  },
  {
    path: '/settings/supplier-dashboard',
    element: <SupplierDashboard />,
    roles: [permissions.VIEW_SUPPLIER_DASHBOARD],
  },
  {
    path: '/settings/supplier/form',
    element: <SupplierForm />,
    roles: [permissions.VIEW_SUPPLIER_FORM],
  },
  {
    path: '/settings/disclosures-Questionnarie',
    element: <DisclosureQuestion />,
    roles: [permissions.VIEW_DISCLOSURES],
  },
  {
    path: '/disclosure/assigned',
    element: <DisclosureAssigned />,
    roles: [permissions.VIEW_ASSIGNED_DISCLOSURE],
  },
  {
    path: '/disclosure/review',
    element: <DisclosureReview />,
    roles: [permissions.VIEW_REVIEWED_DISCLOURE],
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
    roles: [permissions.VIEW_ADMIN_DASHBOARD],
  },
  {
    path: '/reporting-compliance/questionnaire',
    element: <Report />,
    roles: [permissions.VIEW_QUESTIONNAIRE],
  },
  {
    path: '/reporting-compliance/generate-pdf',
    element: <GriPdfReport />,
    roles: [permissions.VIEW_QUESTIONNAIRE],
  },
  {
    path: '/reporting-compliance/sign-off',
    element: <Signoff />,
    roles: [permissions.VIEW_QUESTIONNAIRE],
  },
  {
    path: '/reports/compliance/',
    element: <ReportCompliance />,
    roles: [permissions.VIEW_REPORTING_COMPLIANCE_REVIEW],
  },
  {
    path: '/assessment-start',
    element: <AssessmentStart />,
    roles: [permissions.VIEW_ASSESMENT],
  },
  {
    path: '/assesment',
    element: <QuestionsPage />,
    roles: [permissions.VIEW_ASSESMENT],
  },
  {
    path: '/ISSBQuestionsPage',
    element: <ISSBQuestionsPage />,
    roles: [permissions.VIEW_ISSB_GAP_ADMIN],
  },
  {
    path: '/assessment-level',
    element: <AssessmentLevel />,
    roles: [permissions.VIEW_ASSESMENT],
  },
  {
    path: '/assessment-report',
    element: <AssessmentReport />,
    roles: [permissions.VIEW_ASSESMENT_REPORT],
  },
  {
    path: '/assessment-end',
    element: <AssessmentEnd />,
    roles: [permissions.VIEW_ASSESMENT_SCORECARD],
  },
  {
    path: '/assessment-subtopics',
    element: <AssessmentSub />,
    roles: [permissions.VIEW_ASSESMENT_SCORECARD],
  },

  {
    path: '/maturity-questionnaire',
    element: <MaturityAssessmentQues />,
    roles: [permissions.VIEW_SUPER_VIEW],
  },
  {
    path: '/maturity-questionnaire-edit',
    element: <EditMaturityAsses />,
    roles: [permissions.VIEW_SUPER_VIEW],
  },
  {
    path: '/assessment-view-responses',
    element: <AssessmentViewResponses />,
    roles: [permissions.VIEW_RESPONSES_MA],
  },
  {
    path: '/maturity-levelscore',
    element: <AssessmentLevelScore />,
    roles: [permissions.VIEW_SUPER_VIEW],
  },
  {
    path: '/assessment-edit-responses',
    element: <AssessmentEditResponses />,
    roles: [permissions.VIEW_ASSESMENT_SCORECARD],
  },
  {
    path: '/maturity-levelscore-edit',
    element: <AssessmentLevelScoreEdit />,
    roles: [permissions.VIEW_SUPER_VIEW],
  },

  {
    path: '/scope3/category-13',
    element: <CatThirteenTable />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },

  {
    path: '/scope3/category-13/form',
    element: <CatThirteenForm />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },

  {
    path: '/ESG-peer-data',
    element: <EsgPeerData />,
    roles: [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
  },
  {
    path: '/ESG-peer-data-edit',
    element: <EsgPeerDataEdit />,
    roles: [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
  },

  {
    path: '/peer-benchmarking',
    element: <EsgPeerManage />,
    roles: [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
  },
  {
    path: '/peer-benchmarking-add',
    element: <EsgPeerManageEdit />,
    roles: [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
  },
  {
    path: '/manage-gri-questions-edit',
    element: <ManageGriEdit />,
    roles: [permissions.VIEW_GRI_SUPER_ADMIN],
  },
  {
    path: '/manage-gri-questions-table',
    element: <ManageGriTable />,
    roles: [permissions.VIEW_GRI_SUPER_ADMIN],
  },

  {
    path: '/admin-bench',
    element: <BenchAdmin />,
    roles: [permissions.VIEW_PEER_BENCH_ADMIN],
  },
  {
    path: '/admin-bench-edit',
    element: <BenchAdminEdit />,
    roles: [permissions.VIEW_PEER_BENCH_ADMIN],
  },
  {
    path: '/admin-bench-view',
    element: <BenchAdminView />,
    roles: [permissions.VIEW_PEER_BENCH_ADMIN],
  },
  {
    path: '/admin-peer-selection',
    element: <PeerSelectEdit />,
    roles: [permissions.VIEW_PEER_BENCH_ADMIN],
  },

  // category1
  {
    path: '/scope3/category-1',
    element: (
      <ScopeThreeTable
        cateTitle="Category 1 - Purchased Goods & Services"
        btnPath="/scope3/category-1/form"
        tabTitles={[
          { key: '1', tab: 'Average-data Method' },
          { key: '2', tab: 'Spend-based Method' },
          { key: '3', tab: 'Supplier-specific Method' },
        ]}
        subHeadings={{
          '1': 'Mass or number of units of purchased goods/services x emission factor.',
          '2': 'Amount spent on purchased goods /services x emission factor.',
          '3': 'Quantities of good purchased x suppliers’ emission factor.',
        }}
        updateapis={[
          '/scope3_emissions/calculate-avg-emissions/',
          '/scope3_emissions/calculate-spend-based-emissions/',
          '/scope3_emissions/calculate-supplier-specific-emissions/',
        ]}
        editApiPath={[
          '/scope3_emissions/cat1_average_data_edit/',
          '/scope3_emissions/cat1_spend_based_edit/',
          '/scope3_emissions/cat1_supplier_specific_edit/',
        ]}
        revertApis={[
          '/scope3_emissions/update_goods_services_status/',
          '/scope3_emissions/update_cat1_spend_based_status/',
          '/scope3_emissions/update_cat1_supplier_specific_status/',
        ]}
        deleteApis={[
          '/scope3_emissions/manage_deletion_for_cat1_avg_method_data/',
          '/scope3_emissions/manage_deletion_for_cat1_spend_based_data/',
          '/scope3_emissions/manage_deletion_for_cat1_supplier_specific_method/',
        ]}
        restatedApis={[
          '/scope3_emissions/calculate_emission_for_cat1_avg_data_as_per_FY/',
          '/scope3_emissions/calculate_emission_for_cat1_spend_based_data_as_per_FY/',
          '',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Average-data Method',
          },
          {
            key: '2',
            title: 'Spend-based Method',
          },
          {
            key: '3',
            title: 'Supplier-specific Method',
          },
        ]}
        mutliData={[
          {
            apiPath: '/scope3_emissions/fetch-goods-and-service-avg-data/',
            superApi:
              '/scope3_emissions/super_fetch_goods_and_service_avg_data/',
            columns: catOneAvgMethodTabCols,
          },
          {
            apiPath:
              '/scope3_emissions/fetch-goods-and-service-spend-based-data/',
            superApi:
              '/scope3_emissions/super_fetch_goods_and_service_spend_based_data/',
            columns: catOneSpendMethodTabCols,
          },
          {
            apiPath: '/scope3_emissions/fetch-goods-and-service-supplier-data/',
            superApi:
              '/scope3_emissions/super_fetch_goods_and_service_supplier_data/',
            columns: catOneSupplierMethodTabCols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-1/form',
    element: (
      <ScopeThreeForm
        emissionType={['Cat1 Average', 'Cat1 Spend', 'Cat1 Supplier']}
        currentExcelName={[
          'Cat1_Average Data',
          'Cat1_Spend based',
          'Cat1_Supplier_specific',
        ]}
        cateTitle="Category 1 - Purchased Goods & Services"
        postSubmit="/scope3/category-1"
        getTableDataApi={[
          '/scope3_emissions/fetch-goods-and-service-avg-data/',
          '/scope3_emissions/fetch-goods-and-service-spend-based-data/',
          '/scope3_emissions/fetch-goods-and-service-supplier-data/',
        ]}
        formSubmitAPi={[
          '/scope3_emissions/create_cat1_avg_data/',
          '/scope3_emissions/create-cat1-spend-based-data/',
          '/scope3_emissions/create-cat1-supplier-specific-data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Average-data Method',
            columns: catOneAvgMethodcols,
          },
          {
            key: '2',
            title: 'Spend-based Method',
            columns: catOneSpendMethodcols,
          },
          {
            key: '3',
            title: 'Supplier-specific Method',
            columns: catOneSupplierMethodcols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },

  {
    path: '/scope3/category-1/questionairres',
    element: <Questionairres />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-2/questionairres',
    element: <Questionairres2 />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-5/questionairres',
    element: <Questionairres5 />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-6/questionairres',
    element: <Questionairres6 />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-3/landing',
    element: <CategorylandingPage />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-13/questionairres',
    element: <Questionairres13 />,
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  // scope3 - category 2
  {
    path: '/scope3/category-2',
    element: (
      <ScopeThreeTable
        cateTitle="Category 2 - Capital Goods"
        btnPath="/scope3/category-2/form"
        tabTitles={[
          { key: '1', tab: 'Average-data Method' },
          { key: '2', tab: 'Spend-based Method' },
          { key: '3', tab: 'Supplier-specific Method' },
        ]}
        subHeadings={{
          '1': 'Mass or number of units of purchased goods/services x emission factor.',
          '2': 'Amount spent on purchased goods or services x emission factor.',
          '3': 'Quantities of capital goods purchased x suppliers’ emission factor.',
        }}
        editApiPath={[
          '/scope3_cat2/cat2_average_data_edit/',
          '/scope3_cat2/cat2_spend_based_edit/',
          '/scope3_cat2/cat2_supplier_specific_edit/',
        ]}
        updateapis={[
          '/scope3_cat2/calculate-avg-emissions/',
          '/scope3_cat2/calculate-spend-based-emissions/',
          '/scope3_cat2/calculate-supplier-specific-emissions/',
        ]}
        revertApis={[
          '/scope3_cat2/update_goods_services_status/',
          '/scope3_cat2/update_cat2_spend_based_status/',
          '/scope3_cat2/update_cat2_supplier_specific_status/',
        ]}
        deleteApis={[
          '/scope3_cat2/manage_deletion_for_cat2_avg_method_data/',
          '/scope3_cat2/manage_deletion_for_cat2_spend_based_data/',
          '/scope3_cat2/manage_deletion_for_cat2_supplier_specific_method/',
        ]}
        restatedApis={[
          '/scope3_cat2/calculate_emission_for_cat2_avg_data_as_per_FY/',
          '/scope3_cat2/calculate_emission_for_cat2_spend_based_data_as_per_FY/',
          '',
        ]}
        mutliData={[
          {
            apiPath: '/scope3_cat2/fetch-goods-and-service-avg-data/',
            superApi: '/scope3_cat2/super_fetch_goods_and_service_avg_data/',
            columns: catTwoAvgMethodTabCols,
          },
          {
            apiPath: '/scope3_cat2/fetch-goods-and-service-spend-based-data/',
            superApi:
              '/scope3_cat2/super_fetch_goods_and_service_spend_based_data/',
            columns: catTwoSpendMethodTabCols,
          },
          {
            apiPath: '/scope3_cat2/fetch-goods-and-service-supplier-data/',
            superApi:
              '/scope3_cat2/super_fetch_goods_and_service_supplier_data/',
            columns: catTwoSupplierMethodTabCols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-2/form',

    element: (
      <ScopeThreeForm
        emissionType={['Cat2 Average', 'Cat2 Spend', 'Cat2 Supplier']}
        currentExcelName={[
          'Cat_2_Average_Data',
          'Cat_2_Spend_Based',
          'Cat_2_Supplier_specific',
        ]}
        cateTitle="Category 2 - Capital Goods"
        postSubmit="/scope3/category-2"
        getTableDataApi={[
          '/scope3_cat2/fetch-goods-and-service-avg-data/',
          '/scope3_cat2/fetch-goods-and-service-spend-based-data/',
          '/scope3_cat2/fetch-goods-and-service-supplier-data/',
        ]}
        formSubmitAPi={[
          '/scope3_cat2/create_cat2_avg_data/',
          '/scope3_cat2/create-cat2-spend-based-data/',
          '/scope3_cat2/create-cat2-supplier-specific-data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Average-data Method',
            columns: catTwoAvgMethodcols,
          },
          {
            key: '2',
            title: 'Spend-based Method',
            columns: catTwoSpendMethodcols,
          },
          {
            key: '3',
            title: 'Supplier-specific Method',
            columns: catTwoSupplierMethodcols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },
  // scope3 - category 13
  {
    path: '/scope3/category-13',
    element: (
      <ScopeThreeTable
        cateTitle="Category 13 - Downstream Leased Assets"
        btnPath="/scope3/category-13/form"
        subTabs={{
          '1': [
            {
              key: 'scope1',
              tab: 'Scope 1',
            },
            {
              key: 'scope2',
              tab: 'Scope 2',
            },
          ],
          '3': [
            {
              key: 'floor_space',
              tab: 'Floor Space',
            },
            {
              key: 'asset',
              tab: 'Asset',
            },
          ],
        }}
        tabTitles={[
          {
            key: '1',
            tab: 'Asset-specific Method',
          },
          {
            key: '2',
            tab: 'Lessee-specific Method',
          },
          {
            key: '3',
            tab: 'Average-data Method',
          },
        ]}
        multiSubTabData={[
          {
            id: '1',
            isSubTab: true,
            columns: [
              {
                id: 'scope1',
                column: catThirteenAssestSpecificcolsScope1,
                apiPath: '',
              },
              {
                id: 'scope2',
                column: catThirteenAssestSpecificcolsScope2,
                apiPath: '',
              },
            ],
          },
          {
            id: '2',
            isSubTab: false,
            columns: [
              {
                id: 'Lessee-specific Method',
                column: catThirteenLesseSpecificcols,
                apiPath: '',
              },
            ],
          },
          {
            id: '3',
            isSubTab: true,
            columns: [
              {
                id: 'floor_space',
                column: catThirteenAvgDatacolsFloor,
                apiPath: '',
              },
              {
                id: 'asset',
                column: catThirteenAvgDatacolsAsset,
                apiPath: '',
              },
            ],
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-13/form',
    element: (
      <ScopeThreeForm
        cateTitle="Category 13 - Downstream Leased Assets"
        postSubmit="/scope3/category-13"
        getTableDataApi={[
          '/scope3_emissions/fetch-goods-and-service-avg-data/',
          '/scope3_emissions/fetch-goods-and-service-spend-based-data/',
          '/scope3_emissions/fetch-goods-and-service-supplier-data/',
        ]}
        formSubmitAPi={[
          '/scope3_emissions/create_cat1_avg_data/',
          '/scope3_emissions/create-cat1-spend-based-data/',
          '/scope3_emissions/create-cat1-supplier-specific-data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Asset-specific Method',
          },
          {
            key: '2',
            title: 'Lessee-specific Method',
            showTotalArea: true,
          },
          {
            key: '3',
            title: 'Average-data Method',
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },
  // scope3 - category 5
  {
    path: '/scope3/category-5',
    element: (
      <ScopeThreeTable
        cateTitle="Category 5 -  Waste Generated in Operations"
        btnPath="/scope3/category-5/form"
        tabTitles={[
          { key: '1', tab: 'Supplier-specific Method' },
          { key: '2', tab: 'Waste-type Specific Method' },
          { key: '3', tab: 'Average-data Method' },
        ]}
        updateapis={[
          '',
          '/scope3_cat5/calculate_waste_type_emissions/',
          '/scope3_cat5/calculate_cat5_average_emissions/',
        ]}
        editApiPath={[
          '/scope3_cat5/cat5_supplier_specific_edit/',
          '/scope3_cat5/cat5_waste_edit/',
          '/scope3_cat5/cat5_average_data_edit/',
        ]}
        revertApis={[
          '/scope3_cat5/update_cat5_service_supplier_status/',
          '/scope3_cat5/update_cat5_waste_type_status/',
          '/scope3_cat5/update_cat5_average_status/',
        ]}
        deleteApis={[
          '/scope3_cat5/manage_deletion_for_cat5_supplier_specific_method/',
          '/scope3_cat5/manage_deletion_for_cat5_waste_type_method/',
          '/scope3_cat5/manage_deletion_for_cat5_average_data_method/',
        ]}
        restatedApis={[
          '',
          '/scope3_cat5/calculate_emission_for_cat5_waste_type_data_as_per_FY/',
          '',
        ]}
        mutliData={[
          {
            apiPath: '/scope3_cat5/fetch_goods_and_service_supplier_data/',
            superApi: '/scope3_cat5/super_fetch_cat5_average_data/',
            columns: catFiveSupplierMethodTabCols,
          },
          {
            apiPath: '/scope3_cat5/fetch_waste_type_data/',
            superApi:
              '/scope3_cat5/super_fetch_goods_and_service_supplier_data/',
            columns: catFiveWasteMethodTabcols,
          },
          {
            apiPath: '/scope3_cat5/fetch_cat5_average_data/',
            superApi: '/scope3_cat5/super_fetch_waste_type_data/',
            columns: catFiveAvgMethodTabCols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-5/form',
    element: (
      <ScopeThreeForm
        emissionType={['Cat5 Supplier', 'Cat5 Waste Type', 'Cat5 Average']}
        currentExcelName={[
          'Cat_5_Supplier_Specific',
          'Cat_5_Waste_Type_Specific',
          'Cat_5_Average_Data',
        ]}
        cateTitle="Category 5 -  Waste Generated in Operations"
        postSubmit="/scope3/category-5"
        getTableDataApi={[
          '/scope3_cat5/fetch_goods_and_service_supplier_data/',
          '/scope3_cat5/fetch_waste_type_data/',
          '/scope3_cat5/fetch_cat5_average_data/',
        ]}
        formSubmitAPi={[
          '/scope3_cat5/create_cat5_supplier_specific_data/',
          '/scope3_cat5/create_cat5_waste_type_data/',
          '/scope3_cat5/create_cat5_average_data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Supplier-specific Method',
            columns: catFiveSupplierMethodcols,
          },
          {
            key: '2',
            title: 'Waste-type Specific Method',
            columns: catFiveWasteMethodcols,
          },
          {
            key: '3',
            title: 'Average-data Method',
            columns: catFiveAvgMethodcols,
            showField: true,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },
  //category 3
  {
    path: '/scope3/category-3',
    element: (
      <ScopeThreeTable
        cateTitle="Category 3 - Fuel & Energy-related Activities"
        btnPath="/scope3/category-3/form"
        updateapis={[
          '/scope3_cat3/calculate_cat3_fuel_emissions/',
          '/scope3_cat3/calculate_cat3_energy_emissions/',
          '/scope3_cat3/calculate_transmission_and_distribution_emissions/',
          '/scope3_cat3/calculate_electricity_generation_emissions/',
        ]}
        editApiPath={[
          '/scope3_cat3/edit_cat3_upstream_purchased_fuel_data/',
          '/scope3_cat3/edit_cat3_upstream_purchased_energy_data/',
          '/scope3_cat3/cat3_transmission_data_edit/',
          '/scope3_cat3/cat3_generation_data_edit/',
        ]}
        revertApis={[
          '/scope3_cat3/update_cat3_upstream_purchased_fuel_status/',
          '/scope3_cat3/update_cat3_upstream_purchased_energy_status/',
          '/scope3_cat3/update_cat3_transmission_status/',
          '/scope3_cat3/update_cat3_electricity_generation_status/',
        ]}
        deleteApis={[
          '/scope3_cat3/manage_deletion_for_cat3_upstream_fuel_data_method/',
          '/scope3_cat3/manage_deletion_for_cat3_tab2_purchased_electricity/',
          '/scope3_cat3/manage_deletion_for_cat3_tab3_T_and_D_losses/',
          '/scope3_cat3/manage_deletion_for_cat3_electricity_generation_data_method/',
        ]}
        restatedApis={[
          '/scope3_cat3/calculate_emission_for_cat3_purchased_fuel_as_per_FY/',
          '/scope3_cat3/calculate_emission_for_cat3_purchased_electricity_as_per_FY/',
          '/scope3_cat3/calculate_emission_for_cat3_t_and_d_loss_data_as_per_FY/',
          '',
        ]}
        tabTitles={[
          { key: '1', tab: 'Upstream emissions of purchased fuels' },
          { key: '2', tab: 'Upstream emissions of purchased electricity' },
          { key: '3', tab: 'Transmission and Distribution (T&D) losses' },
          {
            key: '4',
            tab: 'Generation of purchased electricity that is sold to end users',
          },
        ]}
        mutliData={[
          {
            apiPath: '/scope3_cat3/get_cat3_upstream_purchased_fuel_data/',
            superApi:
              '/scope3_cat3/super_get_cat3_upstream_purchased_fuel_data/',
            columns: catThreePurchasedFuelsTabCols,
          },
          {
            apiPath: '/scope3_cat3/get_cat3_upstream_purchased_energy_data/',
            superApi:
              '/scope3_cat3/super_get_cat3_upstream_purchased_energy_data/',
            columns: catThreePurchasedElectricityTabCols,
          },
          {
            apiPath: '/scope3_cat3/fetch_transmission_and_distribution_data/',
            superApi:
              '/scope3_cat3/super_fetch_transmission_and_distribution_data/',
            columns: catThreeTransmissonTabCols,
          },
          {
            apiPath: '/scope3_cat3/fetch_electricity_generation_data/',
            superApi: '/scope3_cat3/super_fetch_electricity_generation_data/',
            columns: catThreeGenerationTabCols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-3/form',
    element: (
      <ScopeThreeForm
        emissionType={[
          'Cat3 Upstream Emission Fuels',
          '',
          '',
          'Cat3 Upstream Generation of Electricity',
        ]}
        currentExcelName={[
          `Cat3_Upstream_Emission_Purchased_Fuel`,
          '',
          '',
          'Cat3_ Elec_Sold_template',
        ]}
        cateTitle="Category 3 - Fuel & Energy-related Activities"
        postSubmit="/scope3/category-3"
        getTableDataApi={[
          '/Emissions/get_stationary_combustion/',
          '/energy/get-energy-consumption/',
          '/scope3_cat3/fetch_transmission_and_distribution_data/',
          '/scope3_cat3/fetch_electricity_generation_data/',
        ]}
        formSubmitAPi={[
          '/scope3_cat3/create_cat3_purchased_fuel_data/',
          '/scope3_cat3/create_cat3_upstream_emissions_electricity_data/',
          '/scope3_cat3/create_cat3_transmission_data/',
          '/scope3_cat3/create_cat3_electricity_generation_data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Upstream emissions of purchased fuels',
            columns: catThreePurchasedFuels,
          },
          {
            key: '2',
            title: 'Upstream emissions of purchased electricity',
            columns: catThreePurchasedElectricity,
          },
          {
            key: '3',
            title: 'Transmission and Distribution (T&D) losses',
            columns: catThreeTransmisson,
          },
          {
            key: '4',
            title:
              'Generation of purchased electricity that is sold to end users',
            columns: catThreeGeneration,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },

  {
    path: '/scope3/category-13',
    element: (
      <ScopeThreeTable
        cateTitle="Category 13 - Downstream Leased Assets"
        btnPath="/scope3/category-13/form"
        updateapis={[
          '',
          '',
          '',
          '/scope3_cat13/calculate_transmission_and_distribution_emissions/',
          '/scope3_cat13/calculate_assets_average_emissions/',
        ]}
        // editApiPath={[
        //   "",
        //   "",
        //   "",
        //   "",
        //   "",
        // ]}
        revertApis={[
          '',
          '',
          '',
          '/scope3_cat13/update_cat13_assets_avg_status/',
          '/scope3_cat13/update_cat13_floor_assets_status/',
        ]}
        subTabs={{
          '1': [
            {
              key: 'scope1',
              tab: 'Scope 1',
            },
            {
              key: 'scope2',
              tab: 'Scope 2',
            },
          ],
          '3': [
            {
              key: 'floor_space',
              tab: 'Floor Space',
            },
            {
              key: 'asset',
              tab: 'Asset',
            },
          ],
        }}
        tabTitles={[
          {
            key: '1',
            tab: 'Asset-specific Method',
          },
          {
            key: '2',
            tab: 'Lessee-specific Method',
          },
          {
            key: '3',
            tab: 'Average-data Method',
          },
        ]}
        // mutliData={[
        //   {
        //     dataSource: catFiveSupplierMethodData,
        //     columns: catFiveSupplierMethodcols,
        //   },
        // ]}
        multiSubTabData={[
          {
            id: '1',
            isSubTab: true,
            columns: [
              {
                id: 'scope1',
                column: catThirteenAssestSpecificcolsScope1,
                apiPath: '',
              },
              {
                id: 'scope2',
                column: catThirteenAssestSpecificcolsScope2,
                apiPath: '',
              },
            ],
          },
          {
            id: '2',
            isSubTab: false,
            columns: [
              {
                id: 'Lessee-specific Method',
                column: catThirteenLesseSpecificcols,
                apiPath: '/Emissions/get_stationary_combustion/',
              },
            ],
          },
          {
            id: '3',
            isSubTab: true,
            columns: [
              {
                id: 'floor_space',
                column: catThirteenAvgDatacolsFloor,
                apiPath: '/scope3_cat13/fetch_floor_average_data/',
              },
              {
                id: 'asset',
                column: catThirteenAvgDatacolsAsset,
                apiPath: '/scope3_cat13/fetch_assets_average_data/',
              },
            ],
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-13/form',
    element: (
      <ScopeThreeForm
        cateTitle="Category 13 - Downstream Leased Assets"
        postSubmit="/scope3/category-13"
        getTableDataApi={[
          '',
          '',
          '',
          '/scope3_cat13/fetch_floor_average_data/',
          '/scope3_cat13/fetch_assets_average_data/',
        ]}
        formSubmitAPi={[
          '',
          '',
          '',
          '/scope3_cat13/create_cat13_floor_average_data/',
          '/scope3_cat13/create_cat13_assets_average_data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Asset-specific Method',
          },
          {
            key: '2',
            title: 'Lessee-specific Method',
            showTotalArea: true,
          },
          {
            key: '3',
            title: 'Average-data Method',
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },

  // scope6
  {
    path: '/scope3/category-6',
    element: (
      <ScopeThreeTable
        cateTitle="Category 6 - Business Travel"
        btnPath="/scope3/category-6/form"
        tabTitles={[
          { key: '1', tab: 'Fuel-based' },
          { key: '2', tab: 'Distance-based' },
          { key: '3', tab: 'Spend-based' },
          { key: '4', tab: 'Accommodation' },
        ]}
        updateapis={[
          '/scope3_cat6/calculate_fuel_based_emissions_as_per_database/',
          '/scope3_cat6/calculate_distance_based_emissions_as_per_database/',
          '/scope3_cat6/calculate_spend_based_emissions_as_per_database/',
          '/scope3_cat6/calculate_accomodation_emissions_as_per_database/',
        ]}
        editApiPath={[
          '/scope3_cat6/cat6_fuel_based_edit/',
          '/scope3_cat6/cat6_distance_based_edit/',
          '/scope3_cat6/cat6_spend_based_edit/',
          '/scope3_cat6/cat6_accommodations_edit/',
        ]}
        revertApis={[
          '/scope3_cat6/update_cat6_fuel_based_data_status/',
          '/scope3_cat6/update_cat6_distance_based_data_status/',
          '/scope3_cat6/update_cat6_spend_based_status/',
          '/scope3_cat6/update_cat6_accommodations_status/',
        ]}
        deleteApis={[
          '/scope3_cat6/manage_deletion_for_cat6_fuel_based_data_method/',
          '/scope3_cat6/manage_deletion_for_cat6_distance_based_data_method/',
          '/scope3_cat6/manage_deletion_for_cat6_spend_based_data_method/',
          '/scope3_cat6/manage_deletion_for_cat6_accomdation_data_method/',
        ]}
        restatedApis={[
          '/scope3_cat6/calculate_emission_for_cat6_fuel_based_data_as_per_FY/',
          '/scope3_cat6/calculate_emission_for_cat6_distance_based_data_as_per_FY/',
          '',
          '/scope3_cat6/calculate_emission_for_cat6_accommodation_data_as_per_FY/',
        ]}
        mutliData={[
          {
            apiPath: '/scope3_cat6/fetch_cat6_fuel_based_data/',
            superApi: '/scope3_cat6/super_fetch_cat6_fuel_based_data/',
            columns: catSixFuelBasedTabCols,
          },
          {
            apiPath: '/scope3_cat6/fetch_distance_based_data/',
            superApi: '/scope3_cat6/super_fetch_distance_based_data/',
            columns: catSixDistanceBasedTabCols,
          },
          {
            apiPath: '/scope3_cat6/fetch_cat6_spend_based_data/',
            superApi: '/scope3_cat6/super_fetch_cat6_spend_based_data/',
            columns: catSixSpendBasedTabCols,
          },
          {
            apiPath: '/scope3_cat6/fetch_cat6_accomadation_data/',
            superApi: '/scope3_cat6/super_fetch_cat6_accomadation_data/',
            columns: catSixAccommodationTabCols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_TABLE],
  },
  {
    path: '/scope3/category-6/form',
    element: (
      <ScopeThreeForm
        emissionType={[
          'Cat6 Fuel Based',
          'Cat6 Distance Based',
          'Cat6 Spend Based',
          'Cat6 Accomodation Based',
        ]}
        currentExcelName={[
          'Cat6_ Fuel_Based',
          'Cat6_Distance_Based',
          'Cat6_Spend_Based',
          'Cat6_ Accomodation',
        ]}
        cateTitle="Category 6 - Business Travel"
        postSubmit="/scope3/category-6"
        getTableDataApi={[
          '/scope3_cat6/fetch_cat6_fuel_based_data/',
          'scope3_cat6/fetch_distance_based_data/',
          '/scope3_cat6/fetch_cat6_spend_based_data/',
          '/scope3_cat6/fetch_cat6_accomadation_data/',
        ]}
        formSubmitAPi={[
          '/scope3_cat6/create_cat6_fuel_based_data/',
          '/scope3_cat6/create_cat6_distance_based_data/',
          '/scope3_cat6/create_cat6_spend_based_data/',
          '/scope3_cat6/create_cat6_accommodation_data/',
        ]}
        tabData={[
          {
            key: '1',
            title: 'Fuel-based',
            columns: catSixFuelBasedcols,
          },
          {
            key: '2',
            title: 'Distance-based',
            columns: catSixDistanceBasedcols,
          },
          {
            key: '3',
            title: 'Spend-based',
            columns: catSixSpendBasedcols,
          },
          {
            key: '4',
            title: 'Accommodation',
            columns: catSixAccommodationcols,
          },
        ]}
      />
    ),
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },
  {
    path: '/board-composition-form',
    element: <BoardandComposition />,
    roles: [permissions.VIEW_BOARD_COMPOSITION],
  },
  {
    path: '/board-composition',
    element: <BoardandCompositionList />,
    roles: [permissions.VIEW_BOARD_COMPOSITION],
  },
  {
    path: '/fatalities-injuries-form',
    element: <FacilitiesandInjuries />,
    roles: [permissions.VIEW_FATALITIES_INJURIES],
  },
  {
    path: '/fatalities-injuries',
    element: <FacilitiesandInjuriesList />,
    roles: [permissions.VIEW_FATALITIES_INJURIES],
  },
  {
    path: '/employee-demographics',
    element: <TabDataView />,
    roles: [permissions.VIEW_FATALITIES_INJURIES],
  },

  {
    path: '/employeeForm',
    element: <TabsForms />,
    roles: [permissions.VIEW_SCOPE_3_FORM],
  },

  //water consumption
  {
    path: '/environment/water-withdrawal-consumption',
    element: (
      <Water
        type="water"
        cateTitle="Water Withdrawal & Consumption"
        btnPath="/environment/water-withdrawal-consumption-form"
        tableData={{
          apiPath: '/water/fetch-data-for-water-consumption/',
          superApi: '/water/super_fetch_water_consumption_data/',
          columns: waterWithdrawalCols,
        }}
      />
    ),
    roles: [permissions.VIEW_ENVIRONMENT_WATER],
  },
  {
    path: '/environment/water-withdrawal-consumption-form',
    element: <EnviromentInputForm />,
    roles: [permissions.VIEW_ENVIRONMENT_WATER],
  },

  // waste management
  {
    path: '/environment/waste-management',
    element: (
      <EnvironmentTable
        type="waste"
        cateTitle="Waste Management"
        btnPath="/environment/waste-management-form"
        tableData={{
          apiPath: '/waste/fetch-waste-management-data/',
          columns: wasteManagementCols,
        }}
      />
    ),
    roles: [permissions.VIEW_ENVIRONMENT_WATER],
  },
  {
    path: '/environment/waste-management-form',
    element: (
      <EnvironmentForm
        type="waste"
        cateTitle="Waste Management"
        postSubmit="/environment/waste-management"
        formSubmitAPi={['/waste/create-data-for-waste-management/']}
        tableData={{
          columns: wasteManagementCols,
        }}
      />
    ),
    roles: [permissions.VIEW_ENVIRONMENT_WATER],
  },
  {
    path: '/environment/effluents',
    element: <EffluentsList />,
    roles: [permissions.VIEW_EFFLUENTS],
  },
  {
    path: '/environment/effluents-form',
    element: <Effluents />,
    roles: [permissions.VIEW_EFFLUENTS],
  },
  {
    path: '/audit/logs',
    element: <AuditView />,
    roles: [permissions.VIEW_AUDIT_LOGS],
  },

  //governance compliance
  {
    path: '/governance/Incidents',
    element: <GovernanaceComplianceTable />,
    roles: [permissions.VIEW_ENVIRONMENT_WATER],
  },
  {
    path: '/governance/Incidents-form',
    element: <GovernanceComplianceForm />,
    roles: [permissions.VIEW_ENVIRONMENT_WATER],
  },

  {
    path: '/wastemanagement/dashboard',
    element: <WasteManagementDashboard />,
    roles: [permissions.VIEW_SOCIAL_DASHBOARD],
  },
  {
    path: '/watermanagement/dashboard',
    element: <WaterManagementDashboard />,
    roles: [permissions.VIEW_SOCIAL_DASHBOARD],
  },
  {
    path: '/emissionFactor',
    element: <CustomEFForm />,
    roles: [permissions.VIEW_CUSTOM_EMISSION_FACTOR],
  },
  {
    path: '/emissionFactor/edit',
    element: <CustomEFEdit />,
    roles: [permissions.VIEW_CUSTOM_EMISSION_FACTOR],
  },
  {
    path: '/emissionFactorList',
    element: <EmissionFactorList />,
    roles: [permissions.VIEW_CUSTOM_EMISSION_FACTOR],
  },
  {
    path: '/super-view',
    element: <SuperView />,
    roles: [permissions.VIEW_SUPER_VIEW],
  },
  {
    path: '/about-us',
    element: <AboutUs />,
    roles: [permissions.VIEW_SOCIAL_DASHBOARD],
  },
];

export const globalRoutes = [
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/auth/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/auth/create-password',
    element: <CreatePassword />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/verify-otp',
    element: <VerifyOtp />,
  },
  {
    path: '/auth/reset/verify-otp',
    element: <VerifyResetOtp />,
  },
  {
    path: '/company-list',
    element: <CompanyList />,
  },
];
