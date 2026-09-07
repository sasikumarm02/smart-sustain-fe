import React, { useState, Suspense, lazy } from 'react';
import { Menu, Image, Grid, Switch, Typography } from 'antd';
import type { MenuProps } from 'antd';
import DashboardIcon from '../../assets/Svg/dashboard.png';
import EnvironmentIcon from '../../assets/Svg/environment.png';
import socialIcon from '../../assets/Svg/social.png';
import goveranceIcon from '../../assets/Svg/goverance.png';
import communityIcon from '../../assets/Svg/community.png';
import lightIcon from '../../assets/Svg/lightMode.png';
import settingIcon from '../../assets/Svg/setting.png';
import chatbotIcon from '../../assets/Svg/chatbot.png';
import compnayIcon from '../../assets/Svg/company.png';
import logoutIcon from '../../assets/Svg/logout.png';
import reportIcon from '../../assets/Svg/report.png';
import maturityIcon from '../../assets/Svg/maturity.png';
import { useAuth } from '../../Hooks/useAuth';
import { permissions } from '../../Utils/Roles';
import { useHasAccess } from '../../Hooks/useHasAccess';
import { useNavigate } from 'react-router-dom';
import type { MenuTheme } from 'antd';
const { useBreakpoint } = Grid;
type MenuItem = Required<MenuProps>['items'][number];

const styleImage = {
  marginTop: '0.5vw',
  marginRight: '0.3vw',
};
function MenuBar() {
  const { hasPermissions } = useHasAccess();
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState(['']);
  const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];

  const [theme, setTheme] = useState<MenuTheme>('light');
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelectChange = (e: any) => {
    if (rootSubmenuKeys.includes(e.keyPath[1])) {
      return null;
    } else {
      setOpenKeys(['']);
    }
  };

  if (!user) {
    navigate('/auth/login');
  }

  const path =
    user.role !== 'DATA_PROVIDER' && user.role !== 'DATA_APPROVER'
      ? '/assessment-start'
      : '/assessment-report';
  const authPer =
    user.role !== 'DATA_PROVIDER' && user.role !== 'DATA_APPROVER'
      ? [permissions.VIEW_ASSESMENT]
      : [permissions.VIEW_ASSESMENT_REPORT];

  function getItem(
    roles: string[],
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],

    type?: 'group'
  ): MenuItem {
    if (hasPermissions(roles)) {
      return {
        key,
        icon,
        children,
        label,
        type,
      } as MenuItem;
    } else {
      return null;
    }
  }

  const items: MenuItem[] = [
    getItem(
      [permissions.VIEW_ADMIN_DASHBOARD],
      'Dashboard',
      '/admin-dashboard',
      <Image
        loading="lazy"
        src={communityIcon}
        preview={false}
        className="menu-icon"
      />
    ),
    getItem(
      [permissions.VIEW_COMPANY],
      'Companies',
      'sub4',
      <Image
        loading="lazy"
        src={compnayIcon}
        preview={false}
        className="menu-icon"
      />,
      [
        getItem(
          [permissions.VIEW_COMPANY_LIST],
          'Companies List',
          '/settings/onBoard-companies'
        ),
        getItem(
          [permissions.VIEW_FACILITIES],
          'Facilites List',
          '/settings/name-of-the-facilities'
        ),
      ]
    ),
    getItem(
      [permissions.VIEW_ENVIORNMENT],
      'Environment',
      'sub1',
      <Image
        loading="lazy"
        src={EnvironmentIcon}
        preview={false}
        className="menu-icon"
      />,
      [
        getItem(
          [permissions.VIEW_ENVIORNMENT_DASHBOARD],
          'Dashboard',
          '/dashboard'
        ),
        getItem(
          [permissions.VIEW_EMISSIONS],
          'GHG Emissions',
          '/environment/emissions'
        ),
        getItem(
          [permissions.VIEW_ENERGY],
          'Energy Consumption',
          '/environment/energy-consumption'
        ),
        getItem(
          [permissions.VIEW_WATER],
          'Water Consumption',
          '/environment/water-consumption'
        ),
        getItem(
          [permissions.VIEW_WASTE],
          'Waste Generation',
          '/environment/waste-generation'
        ),
        getItem(
          [permissions.VIEW_CARBON_FOOTPRINT],
          'Carbon Footprint',
          '/environment/carbon-footprint'
        ),
      ]
    ),

    getItem(
      [permissions.VIEW_SOCIAL],
      'Social',
      'sub2',
      <Image
        loading="lazy"
        src={socialIcon}
        preview={false}
        className="menu-icon"
      />,
      [
        getItem(
          [permissions.VIEW_SOCIAL_DASHBOARD],
          'Dashboard',
          '/social/dashboard'
        ),

        getItem([permissions.VIEW_EMPLOYESS], 'Employees', '/social/employees'),
        getItem(
          [permissions.VIEW_PATERNAL],
          'Parental leave',
          '/social/paternal-leave'
        ),
        getItem([permissions.VIEW_BENEFITS], 'Benefits', '/social/benefits'),
        getItem(
          [permissions.VIEW_DEVELOPMENT_TRAINING],
          'Development & Training',
          '/social/development-training'
        ),
        getItem(
          [permissions.VIEW_PERFORMANCE_CAREER],
          'Performance & career development reviews',
          '/social/performance-career'
        ),
        getItem(
          [permissions.VIEW_INCIDENTS_DISCRIMINATION],
          'Incidents of discrimination',
          '/social/incidents-discrimination'
        ),
        getItem(
          [permissions.VIEW_IMPACT_ASSESSMENT],
          'Social Impact Assessment including Gender impact Assessment',
          '/social/impact-assessment'
        ),
        getItem(
          [permissions.VIEW_ENVIRONMENT_ASSESSMENT],
          'Environment Impact Assessment',
          '/social/environment-assessment'
        ),
        getItem(
          [permissions.VIEW_COMMUNITY_DEVELOPMENT],
          'Community Development Programs',
          '/social/community-development'
        ),
        getItem(
          [permissions.VIEW_OCCUPATIONAL],
          'Occupational Health & Safety',
          '/social/occupational-health'
        ),
      ]
    ),
    getItem(
      [permissions.VIEW_GOVERANCE],
      'Governance',
      'sub3',
      <Image
        loading="lazy"
        src={goveranceIcon}
        preview={false}
        className="menu-icon"
      />,
      [
        getItem(
          [permissions.VIEW_GOVERANCE_DASHBOARD],
          'Dashboard',
          '/goverance/dashboard'
        ),
        getItem(
          [permissions.VIEW_DATA_BREACH],
          'Data breach incidents during the period',
          '/governance/data-breach-incidents'
        ),
        getItem(
          [permissions.VIEW_ETHICAL_BEHAVIOR],
          'Ethical Behavior',
          '/goverance/ethical-behavior'
        ),
        getItem(
          [permissions.VIEW_CERTIFICATION],
          'Certification',
          '/goverance/certification'
        ),
        getItem(
          [permissions.VIEW_SUSTAINABILITY_DISCLOSURES],
          'Sustainability Disclosures',
          '/goverance/sustainability-disclosures'
        ),
        getItem(
          [permissions.VIEW_ASSURANCE],
          'Assurance',
          '/goverance/assurance'
        ),
      ]
    ),

    getItem(
      authPer,
      'ESG Maturity Assessment',
      `${path}`,
      <Image
        loading="lazy"
        src={maturityIcon}
        preview={false}
        className="menu-icon"
      />
    ),
    getItem(
      [permissions.VIEW_REPORTS],
      'Reports',
      '/reports',
      <Image
        loading="lazy"
        src={reportIcon}
        preview={false}
        className="menu-icon"
      />
    ),

    getItem(
      [permissions.VIEW_COMMUNITY],
      'User Access Management',
      'sub6',
      <Image
        loading="lazy"
        src={communityIcon}
        preview={false}
        className="menu-icon"
      />,
      [
        getItem([permissions.VIEW_COMMUNITY], 'User Management', '/community'),
        getItem(
          [permissions.VIEW_COMMUNITY],
          'User-Role Mapping',
          '/user-role-mapping'
        ),
        // getItem(
        //   [permissions.VIEW_COMMUNITY],
        //   "User Role Mapping",
        //   "/settings/name-of-the-facilities"
        // ),
      ]
    ),

    getItem(
      [permissions.VIEW_SETTING],
      'Settings',
      'sub5',
      <Image
        loading="lazy"
        src={settingIcon}
        preview={false}
        className="menu-icon"
      />,
      [
        getItem(
          [permissions.VIEW_FRAME_WORK_LIST],
          'ESG Configuration',
          '/esg-config'
        ),
        getItem(
          [permissions.VIEW_REPORTING_BOUNDARY],
          'Reporting Boundary',
          '/setting/reporting-boundary'
        ),
        getItem(
          [permissions.VIEW_DISCLOSURES],
          'Assign Disclosures Questionnarie',
          '/settings/disclosures-Questionnarie'
        ),
        // getItem(
        //   [permissions.VIEW_BUSINESS_PARTNER],
        //   "Business Partner",
        //   "/business-partner"
        // ),
        // getItem(
        //   [permissions.VIEW_PRODUCT_SERVICE],
        //   "Products and Service",
        //   "/product-services"
        // ),
        getItem(
          [permissions.VIEW_SUPPLIER_DASHBOARD],
          'Supplier List',
          '/settings/supplier-dashboard'
        ),
        getItem(
          [permissions.VIEW_ASSIGNED_DISCLOSURE],
          'Answer Disclosure Questions',
          '/disclosure/assigned'
        ),
        getItem(
          [permissions.VIEW_REVIEWED_DISCLOURE],
          'Review Disclosures Answers',
          '/disclosure/review'
        ),
      ]
    ),
    getItem(
      [permissions.VIEW_LOGOUT],
      <Typography.Text className="logout-menu-item">Logout</Typography.Text>,
      '/',
      <Image
        loading="lazy"
        src={logoutIcon}
        preview={false}
        className="menu-icon"
        onClick={() => logout()}
      />
    ),
  ];

  return (
    <>
      <Menu
        theme={theme}
        mode="inline"
        // mode="vertical"
        onClick={(e) => navigate(e.key)}
        openKeys={openKeys}
        onSelect={(e) => onSelectChange(e)}
        onOpenChange={onOpenChange}
        defaultSelectedKeys={['1']}
        items={items}
      />
    </>
  );
}

export default MenuBar;

// Your imports remain unchanged

// import React, { useEffect, useState } from 'react';
// import { Image, Menu } from 'antd';
// import { permissions } from '../../Utils/Roles';
// import { useHasAccess } from '../../Hooks/useHasAccess';
// import { useAuth } from '../../Hooks/useAuth';
// import { useNavigate } from 'react-router-dom';
// import type { MenuProps, MenuTheme } from 'antd';
// import { useSelector, useDispatch } from 'react-redux';
// import { setModal, setReportModal } from '../../Redux/Actions';

// import ManageClientIcon from '../../assets/Svg/ManageClientIcon';
// import SocialIcon from '../../assets/Svg/SocialIcon';
// import EnvironmentIcon from '../../assets/Svg/EnvironmentIcon';

// const { SubMenu } = Menu;

// type MenuItem = Required<MenuProps>['items'][number];
// type NavbarProps = { collapsed: boolean, setCollapsed: (val: boolean) => void };

// const Navbar: React.FC<NavbarProps> = ({ collapsed, setCollapsed }) => {
//   const { hasPermissions } = useHasAccess();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [openKeys, setOpenKeys] = useState(['']);
//   const [theme] = useState<MenuTheme>('light');
//   const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
//   const [pendingSubmenu, setPendingSubmenu] = useState<string | null>(null);
//   const [activeNestedSubMenu, setActiveNestedSubMenu] = useState<string | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       const floatingMenus = document.querySelectorAll('.floating-submenu');
//       const isClickInside = Array.from(floatingMenus).some(menu => menu.contains(target));
//       if (!isClickInside) {
//         setActiveSubMenu(null);
//         setPendingSubmenu(null);
//         setActiveNestedSubMenu(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'sub12', 'sub13', 'subpeer', 'subSuper', 'subMat', 'subTarget'];

//   const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
//     if (collapsed && keys.length > 0) {
//       setCollapsed(false);
//       return;
//     }

//     const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
//     if (rootSubmenuKeys.includes(latestOpenKey as string)) {
//       setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//     } else {
//       setOpenKeys(keys);
//     }

//     if (!['sub4', 'subMat', 'sub3', 'sub5', 'subTarget'].some(k => keys.includes(k))) {
//       setActiveSubMenu(null);
//       setPendingSubmenu(null);
//     }
//   };

//   const onSelectChange = (e: any) => {
//     if (!rootSubmenuKeys.includes(e.keyPath[1])) {
//       setOpenKeys(['']);
//     }
//   };

//   if (!user) navigate('/auth/login');

//   const keyRoleMap: Record<string, { roles: string[] }> = {};

//   const getItem = (
//     roles: string[],
//     label: React.ReactNode,
//     key: React.Key,
//     icon?: React.ReactNode,
//     children?: MenuItem[],
//     type?: 'group'
//   ): MenuItem | null => {
//     if (key === '/auth/login') {
//       keyRoleMap[key.toString()] = { roles };
//     }
//     return hasPermissions(roles) ? { key, icon, children, label, type } as MenuItem : null;
//   };

//   const menuItems = [
//     getItem(
//       [permissions.VIEW_MANAGE_CLIENT],
//       'Manage Client',
//       'sub1',
//       <ManageClientIcon className="dashboard-icon" />,
//       [
//         getItem([permissions.VIEW_CREATE_CLIENT_PROFILE], 'Create Client Profile', '/manage-client/create-profile'),
//         getItem([permissions.VIEW_MANAGE_CLIENT_PROFILE], 'Manage Client Profile', '/manage-client/manage-profile'),
//         getItem([permissions.VIEW_MANAGE_MODULE_ACCESS], 'Manage Module Access', '/manage-client/manage-module-access'),
//         getItem([permissions.VIEW_MANAGE_REPORT_ACCESS], 'Manage Report Access', '/manage-client/manage-report-access'),
//       ].filter(Boolean)
//     ),
//   ].filter(Boolean);

//   const dataProviderItems = [
//     getItem(
//       [permissions.VIEW_ENV_SOC_GOV],
//       'Environment',
//       'sub5',
//       <EnvironmentIcon className="dashboard-icon" />,
//       [
//         getItem([permissions.VIEW_SUBMIT_SCOPE_1], 'GHG - Scope 1', '/environment/emissions'),
//         getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'GHG - Scope 2', '/environment/scope2'),
//         getItem([permissions.VIEW_SCOPE_3_TABLE], 'GHG - Scope 3', 'subtitileGHG'),
//         getItem([permissions.VIEW_SCOPE_3_TABLE], 'Water', 'subWater'),
//         getItem([permissions.VIEW_ENVIRONMENT_WATER], 'Waste Management', '/environment/waste-management'),
//       ].filter(Boolean)
//     ),
//     getItem(
//       [permissions.VIEW_ENV_SOC_GOV],
//       'Social',
//       'sub13',
//       <SocialIcon className="dashboard-icon" />,
//       [
//         getItem([permissions.VIEW_ENVIRONMENT_WATER], 'Employee Demographics', '/employee-demographics'),
//         getItem([permissions.VIEW_FATALITIES_INJURIES], 'Safety Performance', '/fatalities-injuries'),
//       ]
//     ),
//   ].filter(Boolean);

//   const items: MenuItem[] = [...menuItems, ...dataProviderItems];

//   const floatingSubMenus: Record<string, MenuItem[]> = {
//     GHGEmissions: [
//       getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 1', 'Cat1'),
//       getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 2', 'Cat2'),
//       getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 3', 'Cat3'),
//       getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 5', 'Cat5'),
//       getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 6', 'Cat6'),
//       getItem([permissions.VIEW_SCOPE_3_TABLE], 'Category 13', 'Cat13'),
//     ].filter(Boolean)
//   };

//   const nestedFloatingSubMenus: Record<string, MenuItem[]> = {
//     Cat1: [
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Calculations', '/scope3/category-1'),
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Guidance', '/scope3/category-1/questionairres'),
//     ],
//     Cat2: [
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Calculations', '/scope3/category-2'),
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Guidance', '/scope3/category-2/questionairres'),
//     ],
//     Cat3: [
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Calculations', '/scope3/category-3/landing'),
//     ],
//     Cat5: [
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Calculations', '/scope3/category-5'),
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Guidance', '/scope3/category-5/questionairres'),
//     ],
//     Cat6: [
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Calculations', '/scope3/category-6'),
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Guidance', '/scope3/category-6/questionairres'),
//     ],
//     Cat13: [
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Calculations', '/scope3/category-13'),
//       getItem([permissions.VIEW_SUBMIT_SCOPE_2], 'Guidance', '/scope3/category-13/questionairres'),
//     ],
//   };

//   const renderFloatingSubMenu = (key: string, submenuItems: MenuItem[]) => {
//     if (activeSubMenu !== key) return null;

//     return (
//       <div className="floating-submenu">
//         <Menu
//           mode="vertical"
//           theme="light"
//           items={submenuItems}
//           onClick={(e) => {
//             const isNestedParent = Object.keys(nestedFloatingSubMenus).includes(e.key);
//             if (isNestedParent) {
//               setTimeout(() => setActiveNestedSubMenu(e.key), 100);
//               return;
//             }

//             if (e.key.startsWith('/')) navigate(e.key);

//             setTimeout(() => {
//               setActiveSubMenu(null);
//               setPendingSubmenu(null);
//               setActiveNestedSubMenu(null);
//             }, 150);
//           }}
//         />
//       </div>
//     );
//   };

//   const renderNestedFloatingSubMenu = (key: string, submenuItems: MenuItem[]) => {
//     if (activeNestedSubMenu !== key) return null;

//     return (
//       <div className="floating-submenu nested">
//         <Menu
//           mode="vertical"
//           theme="light"
//           items={submenuItems}
//           onClick={(e) => {
//             if (e.key.startsWith('/')) navigate(e.key);

//             setTimeout(() => {
//               setActiveNestedSubMenu(null);
//               setActiveSubMenu(null);
//             }, 150);
//           }}
//         />
//       </div>
//     );
//   };

//   useEffect(() => {
//     if (
//       pendingSubmenu &&
//       ['sub4', 'subMat', 'sub3', 'sub5', 'subTarget'].some(k => openKeys.includes(k))
//     ) {
//       setActiveSubMenu(pendingSubmenu);
//       setPendingSubmenu(null);
//     }
//   }, [openKeys, pendingSubmenu]);

//   return (
//     <>
//       <Menu
//         className="menu-arrow"
//         theme={theme}
//         mode="inline"
//         inlineCollapsed={collapsed}
//         triggerSubMenuAction="click"
//         openKeys={collapsed ? [] : openKeys}
//         onOpenChange={onOpenChange}
//         onClick={(e) => {
//           const submenuMap: Record<string, { parentKey: string; label: string }> = {
//             subtitileGHG: { parentKey: 'sub5', label: 'GHGEmissions' },
//             subWater: { parentKey: 'sub5', label: 'WaterConsumption' },
//           };

//           const selectedInfo = submenuMap[e.key];
//           const isFloatingItem = !!selectedInfo;
//           const isNestedItem = Object.keys(nestedFloatingSubMenus).includes(e.key);

//           if (isFloatingItem) {
//             const { parentKey, label } = selectedInfo;
//             if (!openKeys.includes(parentKey)) {
//               setOpenKeys([parentKey]);
//             }
//             setPendingSubmenu(label);
//             setActiveSubMenu(label);
//             return;
//           }

//           if (window.location.pathname === '/assesment') {
//             dispatch(setModal({ isOpen: true, nextRoute: e.key }));
//           } else if (
//             user?.role === 'DATA_PROVIDER' &&
//             window?.location?.pathname === '/reports/compliance'
//           ) {
//             dispatch(setReportModal({ isOpen: true, nextRoute: e.key }));
//           } else if (e.key.startsWith('/')) {
//             navigate(e.key);
//           }

//           if (!isFloatingItem && !isNestedItem) {
//             setPendingSubmenu(null);
//             setActiveSubMenu(null);
//             setActiveNestedSubMenu(null);
//           }
//         }}
//         onSelect={(e) => {
//           onSelectChange(e);
//           setActiveSubMenu(null);
//           setActiveNestedSubMenu(null);
//         }}
//         defaultSelectedKeys={['1']}
//         items={items}
//       />

//       {Object.entries(floatingSubMenus).map(([key, menu]) => renderFloatingSubMenu(key, menu))}
//       {Object.entries(nestedFloatingSubMenus).map(([key, menu]) => renderNestedFloatingSubMenu(key, menu))}
//     </>
//   );
// };

// export default Navbar;
