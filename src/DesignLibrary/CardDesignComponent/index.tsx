import React, { useEffect, useState } from "react";
import {
  Card,
  Progress,
  Input,
  Button,
  Row,
  Col,
  Select,
  List,
  Typography,
  message,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import Styles from "./cardList.module.scss";
import moment from "moment";
import { useQuery } from "../../Hooks/useQuery";
import { useAuth } from "../../Hooks/useAuth";
import FilterIcon from "../../../src/assets/svg/filter.svg";
import { apiBaseUrl } from "../../Services";
import { get, post } from "../../Services";
import { upperFirst } from "lodash";
import { useNavigate } from "react-router-dom";

interface CardlistComponentProps {
  data: any[];
  // onRowClick?: (record: any) => void;
  cardHeaderContent: string;
}

interface Category {
  category: string;
  category_id: string;
  status: any;
}

interface SubCategory {
  sub_category: string | any;
  sub_category_id: string;
  question_count: number;
  answer_count: number;
  update: any;
}

interface ExtractedQuestion {
  question: string;
  question_id: string;
}

interface Question {
  answer: string;
  question: string;
  isAnswered: boolean;
  question_id: string;
  question_type: string;
  sub_questions: Question[] | string;
  is_sub_questions: boolean;
  dependent_questions: Question[] | string;
  is_dependent_question: boolean;
}

const statusColors: Record<string, { font: string; bg: string }> = {
  "For L3 DR Revision": { font: "#7A0202", bg: "#7A02021A" },
  "For L2 DR Revision": { font: "#7A0202", bg: "#7A02021A" },
  "For L1 DR Revision": { font: "#7A0202", bg: "#7A02021A" },
  "For L1 DA Re-approval": { font: "#7A0202", bg: "#7A02021A" },
  "For DP Revision": { font: "#7A0202", bg: "#7A02021A" },
  Approved: { font: "#036323", bg: "#e6f4e6" },
  null: { font: "orange", bg: "#fff3e0" },
  "For L1 Review": { font: "orange", bg: "#fff3e0" },
  "For L2 Review": { font: "orange", bg: "#fff3e0" },
  "For L3 Review": { font: "orange", bg: "#fff3e0" },
  "For L1 Approval": { font: "orange", bg: "#fff3e0" },
  "For L2 Approval": { font: "orange", bg: "#fff3e0" },
  "For DP Submission": { font: "orange", bg: "#fff3e0" },
};

const getStatusStyle = (status: string) => {
  const colors = statusColors[status as keyof typeof statusColors] || {
    font: "orange",
    bg: "#fff3e0",
    border: `2px solid orange`,
  };
  return {
    color: colors.font,
    fontWeight: "bold",
    padding: "0px 0px",
    borderRadius: "5px",
    // backgroundColor: colors.bg,
    // border: `2px solid ${colors.font}`,
    // width: '180px',
  };
};

const getDotStyle = (status: string) => {
  const colors: any = statusColors[status as keyof typeof statusColors] || {
    backgroundColor: "red",
  };
  return {
    backgroundColor: colors.font,
  };
};

const CardlistComponent: React.FC<CardlistComponentProps> = ({
  data,
  // onRowClick,
  cardHeaderContent,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>(data);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subCategoriesFull, setSubCategoriesFull] = useState<SubCategory[]>([]);
  const [title, setTitle] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [progressStatus, setProgressStatus] = useState({
    total_questions: 0,
    total_answered: 0,
    completion_percentage: 10,
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>();
  const [selectedCategory, setSelectedCategory] = useState<SubCategory>();
  const [isModifyVal, setisModifyVal] = useState<boolean>(false);
  const [questionsForInput, setQuestionsForInput] = useState<any[]>([]);
  const [questionsForInputForComments, setQuestionsForInputForComments] =
    useState<any[]>([]);
  const [filterValue, setFilterValue] = useState<string>("All");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [accessQuestionairesData, setAccessQuestionairesData] = useState<any>();
  const [categoriesStatus, setCategoriesStatus] = useState<any>();
  const [canBeApproved, setCanBeApproved] = useState<boolean>(false);
  const [savedSubCategory, setSavedSubCategory] = useState<boolean>(false);
  const [maxDrLevel, setMaxDrLevel] = useState();
  const [maxDaLevel, setMaxDaLevel] = useState();
  const { Option } = Select;
  const navigate = useNavigate();
  const authContext = useAuth();
  const user = authContext?.user || null;

  function extractQuestions(questions: Question[]): ExtractedQuestion[] {
    let extractedQuestions: ExtractedQuestion[] = [];

    function processQuestions(questions: Question[]): void {
      questions.forEach((question) => {
        extractedQuestions.push({
          question: question.question,
          question_id: question?.question_id,
        });

        if (question.is_sub_questions) {
          if (Array.isArray(question.sub_questions)) {
            processQuestions(question.sub_questions);
          } else if (typeof question.sub_questions === "string") {
            extractedQuestions.push({
              question: question.sub_questions,
              question_id: question?.question_id,
            });
          }
        }

        if (question.is_dependent_question) {
          if (Array.isArray(question.dependent_questions)) {
            processQuestions(question.dependent_questions);
          } else if (typeof question.dependent_questions === "string") {
            extractedQuestions.push({
              question: question.dependent_questions,
              question_id: question?.question_id,
            });
          }
        }
      });
    }

    processQuestions(questions);

    return extractedQuestions;
  }

  let quesData: Question[] = [];
  let updateData: any = {};

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    const statusMapping: { [key: string]: string } = {
      null: "For DP Submission",
      "For DP Revision": "For DP Revision",
      "For L1 Review": "For L1 Review",
      "For L2 Review": "For L2 Review",
      "For L3 Review": "For L3 Review",
      "For L1 DR Revision": "For L1 DR Revision",
      "For L2 DR Revision": "For L2 DR Revision",
      "For L3 DR Revision": "For L3 DR Revision",
      "For L1 Approval": "For L1 Approval",
      "For L2 Approval": "For L2 Approval",
      "For L1 DA Re-approval": "For L1 DA Re-approval",
      Approved: "Approved",
    };

    let filteredSubCategories =
      value === "All"
        ? subCategoriesFull.filter((sub) => sub?.update?.status !== undefined)
        : value === "For DP Submission"
          ? subCategoriesFull.filter((sub) => sub?.update?.status === null)
          : subCategoriesFull.filter(
              (sub) => sub?.update?.status === statusMapping[value],
            );

    setSubCategories(filteredSubCategories);
  };

  const onActionUser = (val: any) => {
    if (
      user?.role === "DATA_PROVIDER" &&
      (val.update.status === null ||
        val.update.status?.trim() === "For DP Revision" ||
        val.update.status?.trim() === "For DP Submission")
    ) {
      return true;
    } else if (
      user?.role === "L1_DATA_REVIEWER" &&
      (val.update.status?.trim() === "For L1 Review" ||
        val.update.status?.trim() === "For L1 DR Revision")
    ) {
      return true;
    } else if (
      (user?.role === "L2_DATA_REVIEWER" &&
        val.update.status?.trim() === "For L2 Review") ||
      val.update.status?.trim() === "For L2 DR Revision"
    ) {
      return true;
    } else if (
      user?.role === "L3_DATA_REVIEWER" &&
      (val.update.status?.trim() === "For L3 Review" ||
        val.update.status?.trim() === "For L3 DR Revision")
    ) {
      return true;
    } else if (
      user?.role === "L2_DATA_APPROVER" &&
      val.update.status?.trim() === "For L2 Approval"
    ) {
      return true;
    } else if (
      user?.role === "L1_DATA_APPROVER" &&
      (val.update.status?.trim() === "For L1 Approval" ||
        val.update.status?.trim() === "For L1 DA Re-approval")
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleCardClick = (record: any, index: any) => {
    fetchData(record);
    setSelectedCategory(
      record?.sub_category_name
        ? record?.sub_category_name
        : record?.category_name,
    );
    setMaxDrLevel(record?.max_DR);
    setMaxDaLevel(record?.max_DA);
  };

  const [categoryStatus, setCategoryStatus] = useState();

  useEffect(() => {
    if (data) {
      fetchData(data[0]);
      setSelectedCategory(
        data[0]?.sub_category_name
          ? data[0]?.sub_category_name
          : data[0]?.category_name,
      );
      setMaxDrLevel(data[0]?.max_DR);
      setMaxDaLevel(data[0]?.max_DA);
    }
  }, [data]);

  // useEffect(() => {
  //   setFilterValue('All');
  // }, [subCategoriesFull]);

  const fetchData = async (record: any) => {
    if (record) {
      try {
        get(
          `/report/get_category_summary/?categoryName=${record.category_name}&category_id=${record.category_id}&entityID=${user?.entity_Id || user?.currentOrganisationId}`,
        ).then((res: any) => {
          const data = res?.response?.data;
          const categoryData: Category = {
            category: data.category_id,
            category_id: data.category_name,
            status: data?.update,
          };
          const subcategoryData: SubCategory[] = data.sub_category_info;
          setSubCategories(subcategoryData);
          setSubCategoriesFull(subcategoryData);
          setTitle(data.category_name);
          setCategoryId(data.category_id);
          setCategories([categoryData]);
          setProgressStatus({
            total_questions: data.total_questions,
            total_answered: data.total_answered,
            completion_percentage: data.completion_percentage,
          });
        });
      } catch (error: any) {
        message.error("No Data");
      }
    }
  };

  const handleRowClick = (record: any, index: any) => {
    navigate(
      `/reports/compliance?category_id=${categoryId}&category_name=${title}&sub_category_id=${record.sub_category_id}&sub_category_name=${record.sub_category_name}&max_DR=${maxDrLevel}&max_DA=${maxDaLevel}&index=${index}`,
    );
  };

  const getItemStatus = (item: any) => {
    if (!item?.update?.status) {
      return "For DP Submission";
    }

    switch (item?.update?.status) {
      case "For L1 Review":
        return maxDrLevel === "L1_DATA_REVIEWER"
          ? "For Review"
          : item?.update?.status;
      case "For L1 Approval":
        return maxDaLevel === "L1_DATA_APPROVER"
          ? "For Approval"
          : item?.update?.status;
      case "For L1 DR Revision":
        return maxDrLevel === "L1_DATA_REVIEWER"
          ? "For DR Revision"
          : item?.update?.status;
      default:
        return item?.update?.status;
    }
  };

  return (
    <Row style={{ height: "90vh" }} className={Styles.cardListContainer}>
      <div className="d-flex justify-content-between p-2">
        <h4 className={`${Styles.cardHeadContent}`}>{cardHeaderContent}</h4>
        <div className="d-flex align-items-center">
          <ExclamationOutlined className={`${Styles.excalmationB}`} />
          Action to be Taken
        </div>
      </div>
      <Row className=" d-flex justify-content-around" gutter={40}>
        <Col className={`${Styles.pad35R}`} span={8}>
          <List
            style={{ height: "65vh", overflow: "auto", overflowX: "hidden" }}
            className={`${Styles.cardLists}`}
          >
            {(() => {
              const uniqueItems: any[] = [];
              const seenCatIds = new Set();

              (searchText ? filteredData : data).forEach((item) => {
                if (!seenCatIds.has(item.category_id)) {
                  uniqueItems.push(item);
                  seenCatIds.add(item.category_id);
                }
              });

              return uniqueItems.map((item, index) => (
                <>
                  <List.Item
                    key={item.key}
                    style={{
                      width: "100%",
                      borderBottom: "none",
                      backgroundColor:
                        selectedCategory ===
                        (user?.role === "DATA_PROVIDER"
                          ? item["sub_category_name"]
                          : item["category_name"])
                          ? "#036323"
                          : "transparent",
                      color:
                        selectedCategory ===
                        (user?.role === "DATA_PROVIDER"
                          ? item["sub_category_name"]
                          : item["category_name"])
                          ? "white"
                          : "black",
                      padding: "0px 15px 0px 15px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className={`${Styles.cardStyle}`}
                      onClick={() => handleCardClick(item, index)}
                    >
                      <div className={`${Styles.cardHeader}`}>
                        <div
                          style={{
                            marginLeft:
                              item.update_status.length > 0 ? "-15px" : "unset",
                          }}
                          className="d-flex align-items-baseline"
                        >
                          {item.update_status.length > 0 && (
                            <span className={`${Styles.excalmationCat}`}>
                              <ExclamationOutlined />
                            </span>
                          )}
                          <h4
                            className={`${Styles.customFontSize15} fw-normal`}
                          >
                            {item.category_name}
                          </h4>
                        </div>
                      </div>
                      <div>
                        <span>
                          <span className={`${Styles.lightGrey}`}>
                            Target Date:{" "}
                          </span>
                          <span>
                            {moment(item.target_date).format("DD-MM-yyyy")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </List.Item>
                </>
              ));
            })()}
          </List>
        </Col>
        <Col className={`${Styles.pad35L}`} span={16}>
          {/* <Select
            placeholder={
              <>
                <img loading="lazy" src={FilterIcon} alt="Filter Icon" /> Filter
              </>
            }
            onChange={handleFilterChange}
            className={`${Styles.filterInput} ${Styles.mtop5} w-100`}
            value={filterValue}
          >
            <Option value="All">All</Option>
            <Option value="For DP Submission">For DP Submission</Option>
            <Option value="For DP Revision">For DP Revision </Option>
            <Option value="For L1 Review">For L1 Review</Option>
            <Option value="For L2 Review">For L2 Review</Option>
            <Option value="For L3 Review">For L3 Review</Option>
            <Option value="For L1 DR Revision">For L1 DR Revision</Option>
            <Option value="For L2 DR Revision">For L2 DR Revision </Option>
            <Option value="For L3 DR Revision">For L3 DR Revision </Option>
            <Option value="For L1 Approval">For L1 Approval</Option>
            <Option value="For L2 Approval">For L2 Approval</Option>
            <Option value="For L1 DA Re-approval">For L1 DA Re-approval</Option>
            <Option value="For L2 Re-approval">For L2 Re-approval</Option>
            <Option value="Approved">Approved</Option>
          </Select> */}

          <List
            style={{ height: "60vh", overflow: "auto", overflowX: "hidden" }}
            size="small"
            dataSource={subCategories}
            bordered={false}
            renderItem={(item: any, index) => (
              <>
                <List.Item
                  key={item["sub_category_id"]}
                  className={`d-flex ${Styles.completed} ${
                    item["sub_category"] ===
                    selectedSubCategory?.["sub_category"]
                      ? Styles.selected
                      : ""
                  }`}
                  onClick={() => handleRowClick(item, index)}
                  style={{
                    padding: "10px 10px 0px 10px",
                    cursor: "pointer",
                  }}
                >
                  <div className={`${Styles.rightListInner}`}>
                    <div
                      style={{
                        marginLeft: onActionUser(item) ? "-15px" : "unset",
                      }}
                      className="d-flex align-items-baseline"
                    >
                      {onActionUser(item) && (
                        <span className={`${Styles.excalmationCat}`}>
                          <ExclamationOutlined />
                        </span>
                      )}
                      <Typography.Text
                        className={`${Styles.rightListInnerText}`}
                      >
                        {`${item?.["sub_category_id"]} ${item?.["sub_category"]}`}
                      </Typography.Text>
                    </div>
                    <div>
                      <span>
                        <span className={`${Styles.lightGrey}`}>
                          Target Date:{" "}
                        </span>
                        {moment(item.target_date).format("DD-MM-yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className={`${Styles.questionCnt}`}>
                    <div className={`${Styles.checkedDiv}`}>
                      <span
                        className={`${Styles.questionCntInner} d-inline-block`}
                        style={{
                          transform:
                            Number(item?.["question_count"]) < 10
                              ? "translate(9px, 4px)"
                              : "translate(6px, 4px)",
                        }}
                      >
                        {item?.["question_count"]}
                      </span>

                      <span className="text-center">
                        <div style={{ fontSize: "21px", fontWeight: "700" }}>
                          {item.sub_category_count}
                        </div>
                        <div className={`${Styles.questionColor}`}>
                          Questions
                        </div>
                      </span>
                    </div>
                    <div>
                      <div className={Styles.cardContent}>
                        <div
                          className={Styles.statusBadge}
                          style={getStatusStyle(item.update.status?.trim())}
                        >
                          <span
                            style={getDotStyle(item.update.status?.trim())}
                            className={`${Styles.dot}`}
                          >
                            {}
                          </span>
                          {getItemStatus(item)}
                        </div>
                      </div>
                    </div>
                  </div>
                </List.Item>
              </>
            )}
            className={Styles.questionList}
          />
        </Col>
      </Row>
    </Row>
  );
};

export default CardlistComponent;
