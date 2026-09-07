// navigate.tsx
import { NavigateFunction } from 'react-router-dom';

/**
 * Function to get the navigation route based on the module and sub-module.
 * @param {string} module - The module name from the notification.
 * @param {string} subModulePage - The sub-module page identifier from the notification.
 * @param {NavigateFunction} navigate - The navigate function from react-router-dom.
 */
export const handleDynamicNavigation = (
  module: string,
  subModulePage: string,
  navigate: NavigateFunction
) => {
  // Define route mapping for each module and its sub-modules
  const routeMapping: Record<string, Record<string, string>> = {
    PEER_BENCHMARK: {
      PEER_BENCHMARK_DATA_MODIFIED: '/admin-bench',
      PEER_BENCHMARK_DATA_POINT_CREATED: '/admin-bench',
      PEER_BENCHMARK_DATA_ADDED: '/admin-bench',
    },
    BOARD_AND_MGMT_VIEW: {
      BOARD_AND_MGMT_VIEW: '/board-composition',
    },
    CORRUPTION: {
      CORRUPTION_VIEW: '/governance/Incidents',
    },
    ESG_MATURITY_ASSESSMENT: {
      ESG_MATURITY_ASSESSMENT_GOVERNANCE: '/assessment-start',
      ESG_MATURITY_ASSESSMENT_SOCIAL: '/assessment-start',
      ESG_MATURITY_ASSESSMENT_ENVIRONMENT: '/assessment-start',
    },
    EMISSION: {
      STATIOANARY_COMBUSTION: '/environment/emissions',
      MOBILE_COMBUSTION: '/environment/emissions',
      PROCESS_EMISSION: '/environment/emissions',
      FUGITIVE_EMISSION: '/environment/emissions',
    },
    SCOPE_2: {
      ENERGY_CONSUMPTION: '/environment/scope2',
    },
    SCOPE_3: {
      CAT1_TAB1: '/scope3/category-1',
      CAT1_TAB2: '/scope3/category-1',
      CAT1_TAB3: '/scope3/category-1',
      CAT2_TAB1: '/scope3/category-2',
      CAT2_TAB2: '/scope3/category-2',
      CAT2_TAB3: '/scope3/category-2',
      CAT5_TAB1: '/scope3/category-5',
      CAT5_TAB2: '/scope3/category-5',
      CAT5_TAB3: '/scope3/category-5',
      CAT6_TAB1: '/scope3/category-6',
      CAT6_TAB2: '/scope3/category-6',
      CAT6_TAB3: '/scope3/category-6',
      CAT6_TAB4: '/scope3/category-6',
      CAT13_TAB1: '/scope3/category-13',
      CAT13_TAB2: '/scope3/category-13',
      CAT13_TAB3: '/scope3/category-13',
      CAT13_TAB1_SUBTAB1: '/scope3/category-13',
    },
    GRI_REPORTING: {
      GRI_REPORTING_ROLE_MAPPING: '/user-access-management/user-management',
      GRI_MAPPING_DATA_PROVIDER: '/role-mapping-compliance',
      GRI_MAPPING_DATA_APPROVER: '/role-mapping-compliance',
      GRI_MAPPING_DATA_REVIEWER: '/role-mapping-compliance',
      GRI_REPORTING_MATERIAL_TOPIC: '/reporting-compliance/questionnaire',
    },
    GRI_MAPPING: {
      GRI_REPORTING_ROLE_MAPPING: '/user-access-management/user-management',
      GRI_MAPPING_DATA_PROVIDER: '/reporting-compliance/questionnaire',
      GRI_MAPPING_DATA_APPROVER: '/reporting-compliance/questionnaire',
      GRI_MAPPING_DATA_REVIEWER: '/reporting-compliance/questionnaire',
      GRI_REPORTING_MATERIAL_TOPIC: '/reporting-compliance/questionnaire',
    },
    EMISSION_MAPPING: {
      EMISSION_MAPPING_DATA_PROVIDER: '/environment/emissions',
      EMISSION_MAPPING_DATA_REVIEWER: '/environment/emissions',
      EMISSION_MAPPING_DATA_APPROVER: '/environment/emissions',
    },

    DEFAULT: {
      DEFAULT: '/',
    },
  };

  // Check if the module exists in routeMapping, if not, use the "DEFAULT" module
  const moduleRoutes = routeMapping[module] || routeMapping.DEFAULT;

  // Check if the sub-module exists in the module, if not, use the "DEFAULT" route for that module
  const route = moduleRoutes[subModulePage] || moduleRoutes.DEFAULT;

  // Navigate to the route
  navigate(route);
};
