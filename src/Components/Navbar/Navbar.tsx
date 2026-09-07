import React, { useEffect, useState } from 'react';
import { Image, Menu } from 'antd';
import { permissions } from '../../Utils/Roles';
import { useHasAccess } from '../../Hooks/useHasAccess';
import { useAuth } from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { MenuProps, MenuTheme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { apiBaseUrl } from '../../Services';
import { setModal, setReportModal } from '../../Redux/Actions';

import UserAccessIcon from '../../assets/Svg/UserAccessIcon';
import ReportsDashboardsIcon from '../../assets/Svg/ReportsDashboardsIcon';
import TargetIcon from '../../assets/Svg/TargetIcon';
import ToolManageIcon from '../../assets/Svg/toolManageIcon';
import ManageClientIcon from '../../assets/Svg/ManageClientIcon';
import SuperViewIcon from '../../assets/Svg/SuperViewIcon';
import CompanyConfigurationIcon from '../../assets/Svg/CompanyConfiguratin';
import LogoutIcon from '../../assets/Svg/LogoutIcon';
import PeerBenchIcon from '../../assets/Svg/PeerBenchIcon';
import MaturityAssessmentIcon from '../../assets/Svg/MaturityAssessmentIcon';
import ReportComplainceIcon from '../../assets/Svg/ReportComplianceIcon';
import ISSBIcon from '../../assets/Svg/ISSBSvg/ISSBIcon';
import GovernanceIcon from '../../assets/Svg/GovernanceIcon';
import SocialIcon from '../../assets/Svg/SocialIcon';
import EnvironmentIcon from '../../assets/Svg/EnvironmentIcon';

const { SubMenu } = Menu;

type MenuItem = Required<MenuProps>['items'][number];
type NavbarProps = { collapsed: boolean; setCollapsed: (val: boolean) => void };

const Navbar: React.FC<NavbarProps> = ({ collapsed, setCollapsed }) => {
  const { hasPermissions } = useHasAccess();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openKeys, setOpenKeys] = useState(['']);
  const [theme] = useState<MenuTheme>('light');
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [pendingSubmenu, setPendingSubmenu] = useState<string | null>(null);
  const [activeNestedSubMenu, setActiveNestedSubMenu] = useState<string | null>(
    null
  );
  const [activeSubMenuItemKey, setActiveSubMenuItemKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const floatingMenus = document.querySelectorAll('.floating-submenu');
      const isClickInside = Array.from(floatingMenus).some((menu) =>
        menu.contains(target)
      );
      if (!isClickInside) {
        setActiveSubMenu(null);
        setPendingSubmenu(null);
        setActiveNestedSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rootSubmenuKeys = [
    'sub1',
    'sub2',
    'sub3',
    'sub4',
    'sub5',
    'sub6',
    'sub7',
    'sub12',
    'sub13',
    'subpeer',
    'subSuper',
    'subMat',
    'subTarget',
  ];

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    if (collapsed && keys.length > 0) {
      setCollapsed(false);
      return;
    }

    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.includes(latestOpenKey as string)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }

    if (
      !['sub4', 'subMat', 'sub3', 'sub5', 'subTarget'].some((k) =>
        keys.includes(k)
      )
    ) {
      setActiveSubMenu(null);
      setPendingSubmenu(null);
    }
  };

  const onSelectChange = (e: any) => {
    if (!rootSubmenuKeys.includes(e.keyPath[1])) {
      setOpenKeys(['']);
    }
  };

  if (!user) navigate('/auth/login');

  const keyRoleMap: Record<string, { roles: string[] }> = {};

  const getItem = (
    roles: string[],
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem | null => {
    if (key === '/auth/login') {
      keyRoleMap[key.toString()] = { roles };
    }
    return hasPermissions(roles)
      ? ({ key, icon, children, label, type } as MenuItem)
      : null;
  };

  const menuItems = [
    getItem(
      [permissions.VIEW_MANAGE_CLIENT],
      'Manage Client',
      'sub1',
      <ManageClientIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_CREATE_CLIENT_PROFILE],
          'Create Client Profile',
          '/manage-client/create-profile'
        ),
        getItem(
          [permissions.VIEW_MANAGE_CLIENT_PROFILE],
          'Manage Client Profile',
          '/manage-client/manage-profile'
        ),
        getItem(
          [permissions.VIEW_MANAGE_MODULE_ACCESS],
          'Manage Module Access',
          '/manage-client/manage-module-access'
        ),
        getItem(
          [permissions.VIEW_MANAGE_REPORT_ACCESS],
          'Manage Report Access',
          '/manage-client/manage-report-access'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_SUPER_VIEW],
      'Manage Platform',
      'subMat',
      <ToolManageIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_SUPER_VIEW],
          'Maturity Assessment',
          'submat1Title'
        ),
        getItem(
          [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
          'Peer Benchmarking',
          'submat2Title'
        ),
        getItem(
          [permissions.VIEW_GRI_SUPER_ADMIN],
          'Manage GRI Questions',
          '/manage-gri-questions-table'
        ),
      ].filter(Boolean)
    ),

    getItem(
      [permissions.VIEW_SUPER_VIEW],
      'Super View',
      'subSuper',
      <SuperViewIcon className="dashboard-icon" />,
      [getItem([permissions.VIEW_SUPER_VIEW], 'All Modules', '/super-view')]
    ),

    getItem(
      [permissions.VIEW_CUSTOM_EMISSION_FACTOR],
      'Configuration',
      'sub2',
      <CompanyConfigurationIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_MANAGE_COMPANY_PROFILE],
          'Manage Company Profile',
          '/settings/onBoard-companies'
        ),
        getItem(
          [permissions.VIEW_MANAGE_FACILITY_PROFILE],
          'Manage Facility Profile',
          '/settings/name-of-the-facilities'
        ),
        getItem(
          [permissions.VIEW_ESG_CONFIGURATION_TABLE],
          'ESG Configuration',
          '/view-config-table'
        ),
        getItem(
          [permissions.VIEW_CURRENCY_CONVERSION],
          'Currency Conversion',
          '/view-currency-conversion'
        ),
        getItem(
          [permissions.VIEW_CUSTOM_EMISSION_FACTOR],
          'Custom Emission Factor',
          '/emissionFactorList'
        ),
        getItem([permissions.VIEW_AUDIT_LOGS], 'Audit Logs', '/audit/logs'),
      ]
    ),

    getItem(
      [permissions.VIEW_ACCESS_REPORTS_DASHBOARDS],
      'Dashboard',
      'sub4',
      <ReportsDashboardsIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_ENVIORNMENT_DASHBOARD],
          'Environment',
          'subtitile4'
        ),
        getItem(
          [permissions.VIEW_ENVIORNMENT_DASHBOARD],
          'Social',
          'subtitile8'
        ),
        getItem(
          [permissions.VIEW_ENVIORNMENT_DASHBOARD],
          'Governance',
          'subtitile9'
        ),
        getItem(
          [permissions.VIEW_SOCIAL_DASHBOARD],
          'Reports',
          '/reports/dashboard'
        ),
      ].filter(Boolean)
    ),

    getItem(
      [permissions.VIEW_USER_ACCESS_MANAGEMENT],
      'User Access',
      'sub3',
      <UserAccessIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_USER_MANAGEMENT],
          'User Management',
          '/user-access-management/user-management'
        ),
        getItem(
          [permissions.VIEW_USER_ROLE_MAPPING],
          'User Role Mapping',
          'subtitileUserMapping'
        ),
      ].filter(Boolean)
    ),
  ].filter(Boolean);

  const dataProviderItems = [
    getItem(
      [permissions.VIEW_ENV_SOC_GOV],
      'Environment',
      'sub5',
      <EnvironmentIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_SUBMIT_SCOPE_1],
          'GHG - Scope 1',
          '/environment/emissions'
        ),
        getItem(
          [permissions.VIEW_SUBMIT_SCOPE_2],
          'GHG - Scope 2',
          '/environment/scope2'
        ),
        getItem(
          [permissions.VIEW_SCOPE_3_TABLE],
          'GHG - Scope 3',
          'subtitileGHG'
        ),
        getItem([permissions.VIEW_SCOPE_3_TABLE], 'Water', 'subWater'),
        getItem(
          [permissions.VIEW_ENVIRONMENT_WATER],
          'Waste Management',
          '/environment/waste-management'
        ),
      ].filter(Boolean)
    ),
    getItem(
      [permissions.VIEW_ENV_SOC_GOV],
      'Social',
      'sub13',
      <SocialIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_ENVIRONMENT_WATER],
          'Employee Demographics',
          '/employee-demographics'
        ),
        getItem(
          [permissions.VIEW_FATALITIES_INJURIES],
          'Safety Performance',
          '/fatalities-injuries'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_ENV_SOC_GOV],
      'Governance',
      'sub12',
      <GovernanceIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_BOARD_COMPOSITION],
          'Board Composition',
          `/board-composition`
        ),
        getItem(
          [permissions.VIEW_ENVIRONMENT_WATER],
          'Governance Compliance',
          '/governance/Incidents'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_ISSB_GAP_ADMIN],
      'ISSB',
      'sub1',
      <ISSBIcon className="dashboard-icon" />,
      [
        // getItem([permissions.VIEW_MENU_TITLE], 'ISSB Gap Assessment', ''),
        getItem(
          [permissions.VIEW_ISSB_GAP],
          user.role === 'L1_DATA_REVIEWER' || user.role === 'L1_DATA_APPROVER'
            ? 'View Assessment'
            : 'Conduct Assessment',
          `/issb-gap-assesment`
        ),
        getItem(
          [permissions.VIEW_ISSB_GAP_ADMIN],
          'View Gap Result',
          '/ISSB-Gap-Analysis-Results'
        ),

        getItem(
          [permissions.VIEW_ISSB_GAP_ADMIN],
          'Summarised Results',
          '/ISSB-Gap-Results-analysis'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_REPORTING_QUESTIONNAIRE_COMPLIANCE],
      'Reporting Compliance',
      'sub6',
      <ReportComplainceIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_QUESTIONNAIRE],
          'GRI Standards',
          '/reporting-compliance/questionnaire'
        ),
        getItem(
          [permissions.VIEW_SIGN_OFF],
          'Sign Off',
          '/reporting-compliance/sign-off'
        ),
        getItem(
          [permissions.VIEW_RESPONSES],
          'Responses',
          '/reporting-compliance/view-responses'
        ),
        getItem(
          [permissions.VIEW_VIEW_APPROVED_REPORT],
          'View Approved Report',
          '/reporting-compliance/view-approved-report'
        ),
      ]
    ),
    getItem(
      [permissions.VIEW_ESG_MATURITY_ASSESSMENT_RESULTS],
      <div>
        ESG Maturity
        <br />
        Assessment
      </div>,
      'sub7',
      <MaturityAssessmentIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_ASSESMENT],
          'Conduct Assessment ',
          `/assessment-start`
        ),
        getItem(
          [permissions.VIEW_ASSESMENT_REPORT],
          'ESG Maturity',
          `/assessment-report`
        ),
        getItem(
          [permissions.VIEW_ASSESMENT_SCORECARD],
          'View Recommendations',
          '/assessment-end'
        ),
        getItem(
          [permissions.VIEW_RESPONSES_MA],
          'View Responses',
          '/assessment-view-responses'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_TARGET_SETTING],
      'Targets',
      'subTarget',
      <TargetIcon className="dashboard-icon" />,
      [
        getItem([permissions.VIEW_TARGET_SETTING], 'Environment', 'env1'),
        getItem([permissions.VIEW_TARGET_SETTING], 'Social', '/target/social'),
        getItem(
          [permissions.VIEW_TARGET_SETTING],
          'Governance',
          '/target/governance'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_PEER_BENCH_ADMIN],
      <div>
        Peer
        <br />
        <span style={{ fontSize: '11px' }}>Benchmarking</span>
      </div>,
      'subpeer',
      <PeerBenchIcon className="dashboard-icon" />,
      [
        getItem(
          [permissions.VIEW_PEER_BENCH_ADMIN],
          'Benchmark Configuration',
          '/admin-bench'
        ),
        getItem(
          [permissions.VIEW_PEER_BENCH_ADMIN],
          'Peer Data Overview',
          '/admin-bench-view'
        ),
        getItem(
          [permissions.VIEW_PEER_BENCH_ADMIN],
          'Financial Filters',
          '/admin-peer-selection'
        ),
      ]
    ),

    // getItem(
    //   [permissions.VIEW_LOGOUT],
    //   'logout',
    //   '/auth/login',
    //   <LogoutIcon
    //     className="logout-icon"
    //   />,
    // ),
  ].filter(Boolean);

  const items: MenuItem[] = [...menuItems, ...dataProviderItems];

  const floatingSubMenus: Record<string, MenuItem[]> = {
    Environment: [
      getItem(
        [permissions.VIEW_CARBON_FOOTPRINT],
        'GHG Inventory',
        '/environment/carbon-footprint'
      ),
      getItem(
        [permissions.VIEW_SOCIAL_DASHBOARD],
        'Water & Effluents',
        '/watermanagement/dashboard'
      ),
      getItem(
        [permissions.VIEW_SOCIAL_DASHBOARD],
        'Waste Management',
        '/wastemanagement/dashboard'
      ),
    ],
    Social: [
      getItem(
        [permissions.VIEW_SOCIAL_DASHBOARD],
        'Employee Demographics',
        '/social/demographics/dashboard'
      ),
      getItem(
        [permissions.VIEW_SOCIAL_DASHBOARD],
        'Safety Performance',
        '/social/safetyperformance/dashboard'
      ),
    ],
    Governance: [
      getItem(
        [permissions.VIEW_SOCIAL_DASHBOARD],
        'Board Composition',
        '/governance/boardcomposition/dashboard'
      ),
      getItem(
        [permissions.VIEW_SOCIAL_DASHBOARD],
        'Governance Compliance',
        '/governance/compliance/dashboard'
      ),
    ],
    MaturityAssessment: [
      getItem(
        [permissions.VIEW_SUPER_VIEW],
        'Questionnaire',
        '/maturity-questionnaire'
      ),
      getItem(
        [permissions.VIEW_SUPER_VIEW],
        'Level Score',
        '/maturity-levelscore'
      ),
    ],
    PeerBenchmarking: [
      getItem(
        [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
        'Manage ESG Metrics',
        '/peer-benchmarking'
      ),
      getItem(
        [permissions.VIEW_PEER_BENCH_SUPER_ADMIN],
        'Peer Data Management',
        '/ESG-peer-data'
      ),
    ],
    UserRoleMapping: [
      getItem(
        [permissions.VIEW_USER_MANAGEMENT],
        'ESG Metrics',
        '/role-mapping-emission'
      ),
      getItem(
        [permissions.VIEW_USER_MANAGEMENT],
        'Reporting Compliance',
        '/role-mapping-compliance'
      ),
      getItem(
        [permissions.VIEW_USER_MANAGEMENT],
        'ISSB Gap Assessment',
        '/issb-role-mapping'
      ),
    ],
    TargetsEnvironment: [
      getItem(
        [permissions.VIEW_TARGET_SETTING],
        'GHG Emissions',
        '/target/environment-ghg'
      ),
      getItem(
        [permissions.VIEW_TARGET_SETTING],
        'Water & Effluents',
        '/target/environment-water'
      ),
      getItem(
        [permissions.VIEW_TARGET_SETTING],
        'Waste Management',
        '/target/environment-waste'
      ),
    ],
    GHGEmissions: [
      getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 1', 'Cat1'),
      getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 2', 'Cat2'),
      getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 3', 'Cat3'),
      getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 5', 'Cat5'),
      getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 6', 'Cat6'),
      getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 13', 'Cat13'),
    ].filter(Boolean),
    WaterConsumption: [
      getItem(
        [permissions.VIEW_ENVIRONMENT_WATER],
        'Water Withdrawal & Consumption',
        '/environment/water-withdrawal-consumption'
      ),
      getItem(
        [permissions.VIEW_EFFLUENTS],
        'Effluents',
        '/environment/effluents'
      ),
    ],
  };

  const nestedFloatingSubMenus: Record<string, MenuItem[]> = {
    Cat1: [
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Calculations',
        '/scope3/category-1'
      ),
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Guidance',
        '/scope3/category-1/questionairres'
      ),
    ],
    Cat2: [
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Calculations',
        '/scope3/category-2'
      ),
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Guidance',
        '/scope3/category-2/questionairres'
      ),
    ],
    Cat3: [
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Calculations',
        '/scope3/category-3/landing'
      ),
    ],
    Cat5: [
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Calculations',
        '/scope3/category-5'
      ),
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Guidance',
        '/scope3/category-5/questionairres'
      ),
    ],
    Cat6: [
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Calculations',
        '/scope3/category-6'
      ),
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Guidance',
        '/scope3/category-6/questionairres'
      ),
    ],
    Cat13: [
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Calculations',
        '/scope3/category-13'
      ),
      getItem(
        [permissions.VIEW_SUBMIT_SCOPE_2],
        'Guidance',
        '/scope3/category-13/questionairres'
      ),
    ],
  };

  const renderFloatingSubMenu = (key: string, submenuItems: MenuItem[]) => {
    if (activeSubMenu !== key) return null;

    return (
      <div
        className="floating-submenu"
        style={{
          top:
            activeSubMenuItemKey === 'env1'
              ? '380px'
              : activeSubMenuItemKey === 'subtitile8'
                ? '240px'
                : activeSubMenuItemKey === 'subtitile9'
                  ? '270px'
                  : activeSubMenuItemKey === 'subtitileUserMapping'
                    ? '290px'
                    : '200px',
        }}
      >
        <Menu
          mode="vertical"
          theme="light"
          items={submenuItems}
          onClick={(e) => {
            setActiveSubMenuItemKey(e.key);

            const isNestedParent = Object.keys(nestedFloatingSubMenus).includes(
              e.key
            );
            if (isNestedParent) {
              setTimeout(() => setActiveNestedSubMenu(e.key), 100);
              return;
            }

            if (e.key.startsWith('/')) navigate(e.key);

            setTimeout(() => {
              setActiveSubMenu(null);
              setPendingSubmenu(null);
              setActiveNestedSubMenu(null);
            }, 150);
          }}
        />
      </div>
    );
  };

  const renderNestedFloatingSubMenu = (
    key: string,
    submenuItems: MenuItem[]
  ) => {
    if (activeNestedSubMenu !== key) return null;

    return (
      <div
        className="floating-submenu nested"
        style={{
          top:
            activeSubMenuItemKey === 'Cat1'
              ? '200px'
              : activeSubMenuItemKey === 'Cat2'
                ? '240px'
                : activeSubMenuItemKey === 'Cat3'
                  ? '280px'
                  : activeSubMenuItemKey === 'Cat5'
                    ? '320px'
                    : activeSubMenuItemKey === 'Cat6'
                      ? '360px'
                      : activeSubMenuItemKey === 'Cat13'
                        ? '400px'
                        : '200px',
        }}
      >
        <Menu
          mode="vertical"
          theme="light"
          items={submenuItems}
          onClick={(e) => {
            setActiveSubMenuItemKey(e.key);

            if (e.key.startsWith('/')) navigate(e.key);

            setTimeout(() => {
              setActiveNestedSubMenu(null);
              setActiveSubMenu(null);
            }, 150);
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    if (
      pendingSubmenu &&
      ['sub4', 'subMat', 'sub3', 'sub5', 'subTarget'].some((k) =>
        openKeys.includes(k)
      )
    ) {
      setActiveSubMenu(pendingSubmenu);
      setPendingSubmenu(null);
    }
  }, [openKeys, pendingSubmenu]);

  return (
    <>
      <Menu
        className="menu-arrow"
        theme={theme}
        mode="inline"
        inlineCollapsed={collapsed}
        triggerSubMenuAction="click"
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={onOpenChange}
        onClick={(e) => {
          setActiveSubMenuItemKey(e.key);

          const submenuMap: Record<
            string,
            { parentKey: string; label: string }
          > = {
            subtitile4: { parentKey: 'sub4', label: 'Environment' },
            subtitile8: { parentKey: 'sub4', label: 'Social' },
            subtitile9: { parentKey: 'sub4', label: 'Governance' },
            submat1Title: { parentKey: 'subMat', label: 'MaturityAssessment' },
            submat2Title: { parentKey: 'subMat', label: 'PeerBenchmarking' },
            subtitileUserMapping: {
              parentKey: 'sub3',
              label: 'UserRoleMapping',
            },
            env1: { parentKey: 'subTarget', label: 'TargetsEnvironment' },
            subtitileGHG: { parentKey: 'sub5', label: 'GHGEmissions' },
            subWater: { parentKey: 'sub5', label: 'WaterConsumption' },
          };

          const selectedInfo = submenuMap[e.key];
          const isFloatingItem = !!selectedInfo;
          const isNestedItem = Object.keys(nestedFloatingSubMenus).includes(
            e.key
          );

          if (isFloatingItem) {
            const { parentKey, label } = selectedInfo;
            if (!openKeys.includes(parentKey)) {
              setOpenKeys([parentKey]);
            }
            setPendingSubmenu(label);
            setActiveSubMenu(label);
            return;
          }

          if (window.location.pathname === '/assesment') {
            dispatch(setModal({ isOpen: true, nextRoute: e.key }));
          } else if (
            user?.role === 'DATA_PROVIDER' &&
            window?.location?.pathname === '/reports/compliance'
          ) {
            dispatch(setReportModal({ isOpen: true, nextRoute: e.key }));
          } else if (e.key.startsWith('/')) {
            navigate(e.key);
          }

          if (!isFloatingItem && !isNestedItem) {
            setPendingSubmenu(null);
            setActiveSubMenu(null);
            setActiveNestedSubMenu(null);
          }
        }}
        onSelect={(e) => {
          onSelectChange(e);
          setActiveSubMenu(null);
          setActiveNestedSubMenu(null);
        }}
        defaultSelectedKeys={['1']}
        items={items}
      />

      {Object.entries(floatingSubMenus).map(([key, menu]) =>
        renderFloatingSubMenu(key, menu)
      )}
      {Object.entries(nestedFloatingSubMenus).map(([key, menu]) =>
        renderNestedFloatingSubMenu(key, menu)
      )}
    </>
  );
};

export default Navbar;
