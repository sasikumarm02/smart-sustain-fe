import { useLocation, Link } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { breadcrumbConfig, pathRoutes } from "../../Utils/BreadCrumbConfig";
import Styles from "./breadcrumb.module.scss";
import { useAuth } from "../../Hooks/useAuth";
import { useSelector } from "react-redux";

const coreContent = [
  "Governance",
  "Risk Management",
  "Business Model and Value Chain",
  "Climate Resilience",
  "Climate-related Risks and Opportunities",
  "Financial Position, Financial Performance and Cash Flows",
  "Resilience",
  "Strategy",
  "Strategy and Decision Making",
  "Sustainability-related Risks and Opportunities",
  "Climate-related Targets",
  "Metrics and Targets",
  "Climate-related Metrics",
];

const ApplicationContent = [
  "Climate Resilience",
  "Climate-related Targets",
  "Comparative Information",
  "Connected Information",
  "Cross-industry Metric Categories",
  "Enhancing Qualitative Characteristics of Useful-sustainability-related Financial Information",
  "Fundamental Qualitative Characteristics of Useful sustainability-related Financial Information",
  "Greenhouse Gases",
  "Information Included by Cross-reference",
  "Interim Reporting",
  "Introduction",
  "Materiality",
  "Reporting Entity",
  "Sources of Guidance",
  "Sustainability-related Risks and Opportunities",
];
const Breadcrumb = () => {
  const location = useLocation();
  const { pathname, search } = location;
  const authContext = useAuth();
  const user = authContext?.user || null;
  const assessmentType = useSelector((state: any) => state.assessmentType);

  const [routes, setRoutes] = useState<string[]>([]);
  const editmode = useSelector((state: any) => state.editMode);

  const editdata = useSelector((state: any) => state.peereditData);

  useEffect(() => {
    let pathnames =
      breadcrumbConfig[pathname as keyof typeof breadcrumbConfig] || "Unknown";
    if (pathname === "/ISSBQuestionsPage") {
      if (!coreContent.includes(assessmentType)) {
        pathnames = `ISSB Gap Assessment / ${assessmentType}`;
      } else {
        pathnames = `ISSB Gap Assessment / ${assessmentType}`;
      }
    }
    if (pathname === "/ISSBQuestionsPage") {
      if (!ApplicationContent.includes(assessmentType)) {
        pathnames = `ISSB Gap Assessment / ${assessmentType}`;
      } else {
        pathnames = `ISSB Gap Assessment / ${assessmentType}`;
      }
    }
    if (pathname === "/peer-benchmarking-add") {
      if (editmode === true) {
        pathnames = `Peer Benchmarking Manage ESG Metrics / Edit Data Point`;
      } else {
        pathnames = `Peer Benchmarking Manage ESG Metrics / Add New Data Point`;
      }
    }
    if (pathname === "/ESG-peer-data-edit") {
      if (editdata) {
        pathnames = `Peer Data Management / Edit`;
      } else {
        pathnames = `Peer Data Management / Add`;
      }
    }

    if (pathname === "/add-company") {
      if (user?.role === "ADMIN") {
        pathnames = `Manage Company Profile / Edit`;
      } else {
        pathnames = `Company Profiles / Create`;
      }
    }

    const newRoutes = pathnames.split("/").filter((x) => x);
    setRoutes(newRoutes);

    return () => {
      setRoutes([]);
    };
  }, [pathname, search, editmode, editdata]);

  const queryParams = new URLSearchParams(search);
  const category_name = queryParams.get("category_name");
  const action = queryParams.get("action");

  let breadcrumbItems: JSX.Element[] = [];

  breadcrumbItems = routes.map((route, index) => {
    const path = `${routes
      .slice(index, index + 1)
      .join("/")
      .trim()}`;

    let link = "#";

    if (path && path === "GHG Emission") {
      if (routes[index + 1]?.trim() === "Scope - 1") {
        link = "environment/emissions";
      } else if (routes[index + 1]?.trim() === "Scope - 2") {
        link = "environment/scope2";
      } else if (routes && routes[index + 1]?.trim() === "Scope - 3") {
        switch (routes[index + 2]?.trim()) {
          case "Category 1":
            link = "scope3/category-1";
            break;
          case "Category 2":
            link = "scope3/category-2";
            break;
          case "Category 3":
            link = "scope3/category-3";
            break;
          case "Category 5":
            link = "scope3/category-5";
            break;
          case "Category 6":
            link = "scope3/category-6";
            break;
          case "Category 13":
            link = "scope3/category-13";
            break;
          default:
            link = "#";
        }
      }
    } else if (path && path === "Manage Company Profile") {
      if (user?.role !== "ADMIN") {
        link = "manage-client/create-profile";
      } else {
        link = "settings/onBoard-companies";
      }
    } else if (path && path === "Water") {
      if (routes[index + 1]?.trim() === "Water Withdrawal and Consumption") {
        link = "environment/water-withdrawal-consumption";
      } else if (routes[index + 1]?.trim() === "Effluents") {
        {
          link = "environment/effluents";
        }
      }
    } else if (path && path === "User Role Mapping") {
      if (routes[index + 1]?.trim() === "ISSB") {
        link = "issb-role-mapping";
      } else if (routes[index + 1]?.trim() === "Reporting Compliance") {
        link = "role-mapping-compliance";
      } else if (routes[index + 1]?.trim() === "GHG Calculation") {
        link = "role-mapping-emission";
      }
    } else if (path && path === "Edit") {
      if (routes[index - 1]?.trim() === "Manage Company Profile") {
        if (user?.role !== "ADMIN") {
          return (
            <span>
              <Link
                to={link}
                style={{
                  textDecoration: "none",
                  color: "#636363",
                }}
              >
                {"Form"}
              </Link>
            </span>
          );
        }
      }
    } else {
      link = pathRoutes[path] || "#";
    }

    return (
      <span>
        <Link
          to={link}
          className={
            index === routes?.length - 1
              ? Styles.lastTabColor
              : Styles.otherTabColor
          }
        >
          {route}
        </Link>
        {index < routes?.length - 1 && " > "}
      </span>
    );
  });

  if (queryParams.toString() && !action) {
    breadcrumbItems.pop();
    breadcrumbItems.push(
      <span>
        <Link
          to={"reporting-compliance/questionnaire"}
          className={Styles.otherTabColor}
        >
          {"GRI Standards"}
        </Link>
      </span>,
    );
    breadcrumbItems.push(
      <span
        className={Styles.textColor}
        key="queryParams"
      >{` > ${category_name?.toString()}`}</span>,
    );
  }

  if (queryParams.toString() && !category_name && action) {
    breadcrumbItems.pop();
    breadcrumbItems.push(
      <span className={Styles.textColor} key="queryParams">{` Edit`}</span>,
    );
  }

  return <nav className={Styles.wrapper}>{breadcrumbItems}</nav>;
};

export default Breadcrumb;
