import React, { useState, useEffect, useRef } from "react";
import { Table, ConfigProvider, Button, Row, Col, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import Styles from "./table.module.scss";

import DownChevron from "../../assets/svg/DesignLibrary/DownChevron";
import UpChevron from "../../assets/svg/DesignLibrary/UpChevron";
import TableFilterSelectedIcon from "../../assets/svg/DesignLibrary/TableFilterSelectedIcon";
import TableFilterIcon from "../../assets/svg/DesignLibrary/TableFilterIcon";
import SortAscendIcon from "../../assets/svg/DesignLibrary/SortAscendIcon";
import SortDescendIcon from "../../assets/svg/DesignLibrary/SortDescendIcon";
import SortIconForTable from "../../assets/svg/DesignLibrary/SortIconForTable";
import PaginationPrevArrow from "../../assets/svg/DesignLibrary/PaginationPrevArrow";
import PaginationNextArrow from "../../assets/svg/DesignLibrary/PaginationNextArrow";
import { Key } from "antd/lib/table/interface";
import RevertIcon from "../../assets/svg/Emissions/revertIcon";
import ApproveIcon from "../../assets/svg/Emissions/ApproveIcon";

// import { useAuth } from '../../Hooks/useAuth';
const useAuth = () => ({ user: { role: "SUPER_ADMIN" } });
/* import {
  customFormattColumns,
  deleteSatausMapping,
  deleteSatausMappingFunc,
  getRowIdFromUniqueId,
  requestedDeleteStatusMapping,
  roleLevels,
  totalColumnsList,
} from '../../Components/Emissions/Scope3/Helpers'; */

const customFormattColumns: string[] = [];
const deleteSatausMapping: any = {};
const deleteSatausMappingFunc: any = () => [];
const getRowIdFromUniqueId: any = (key: any, data?: any) => key;
const requestedDeleteStatusMapping: any = {};
const roleLevels: any = { reviewer: [], approver: [] };
const totalColumnsList: string[] = [];
import Triangle from "../../assets/svg/Emissions/triange";
import { uniqueId } from "lodash";

import Delete from "../../assets/svg/Emissions/Delete";
import NotFound from "../../assets/svg/DesignLibrary/NotFound";
// import { formatNumberUS } from '../../Utils/Strings';
const formatNumberUS = (val: any) => val;

interface TableComponentProps {
  data: any[];
  columnHeader: any[];
  enableRowSelection: boolean;
  columnCheckBoxTitle?: string;
  columnCheckBoxDataAttribute?: string;
  expandableRowRenderer?: any;
  isRowExpand?: boolean;
  showCountForCheckBox?: boolean;
  showOnlyCount?: boolean;
  onRowClick?: (record: any) => void;
  allowedStatuses?: any;
  handleRevert?: any;
  handleApprove?: any;
  onchange?: any;
  pageSize?: number;
  onHandleDelete?: any;
  isNewDelte?: boolean;
  showActionColumn?: any;
  noText?: any;
  maxApproverLevel?: any;
  maxReviewerLevel?: any;
  postFilterRecords?: any;
  tableSummary?: any;
  isForm?: any;
  currentPage?: any;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  columnHeader,
  enableRowSelection,
  pageSize,
  columnCheckBoxTitle,
  columnCheckBoxDataAttribute,
  expandableRowRenderer,
  isRowExpand,
  showCountForCheckBox,
  showOnlyCount = false,
  onRowClick,
  allowedStatuses,
  handleRevert,
  handleApprove,
  onchange,
  showActionColumn,
  onHandleDelete,
  isNewDelte,
  noText,
  maxApproverLevel,
  maxReviewerLevel,
  postFilterRecords,
  tableSummary,
  isForm,
  currentPage,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const { user } = useAuth();

  const recordsPerPage = 10;

  const getStatusMapping = (status: string): string[] | undefined => {
    if (requestedDeleteStatusMapping.hasOwnProperty(status)) {
      return requestedDeleteStatusMapping[status] || [];
    }
    return undefined;
  };

  const generateFilters = (
    data: any[],
    key: string,
  ): { text: string; value: any }[] => {
    const uniqueValues = Array.from(new Set(data?.map((item) => item[key])));
    return uniqueValues?.map((value) => ({
      text: value?.toString(),
      value: value,
    }));
  };

  const columnsWithFilters: TableColumnsType<any[]> = columnHeader?.map(
    (column) => {
      const columnConfig: any = { ...column };
      if (customFormattColumns?.includes(column.key)) {
        columnConfig.align = "right";
      }
      if (column.onFilter) {
        columnConfig.filterIcon = (filtered: any) =>
          filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />;
        columnConfig.filters = generateFilters(data, column.key);
      }
      if (column.sorter) {
        columnConfig.sortIcon = ({ sortOrder }: { sortOrder: string }) =>
          sortOrder === "ascend" ? (
            <SortAscendIcon />
          ) : sortOrder === "descend" ? (
            <SortDescendIcon />
          ) : (
            <SortIconForTable />
          );
        columnConfig.showSorterTooltip = false;
      }
      return columnConfig;
    },
  );

  const handleExpandClick = (key: any) => {
    const rowId = getRowIdFromUniqueId(key, data);
    if (rowId === null) return;
    const isCurrentRowExpanded = expandedKeys.includes(rowId);
    if (isCurrentRowExpanded) {
      setExpandedKeys(expandedKeys.filter((k: any) => k !== rowId));
    } else {
      setExpandedKeys([rowId]);
    }
  };

  useEffect(() => {
    setExpandedKeys([]);
  }, [window.location.href]);

  const handleRowClick = (record: any) => {
    if (onRowClick !== undefined && record !== undefined) {
      onRowClick(record);
    }
  };

  const rowProps = (record: any) => ({
    onClick: () => handleRowClick(record),
    // onDoubleClick, onMouseEnter, onMouseLeave, etc.
  });

  useEffect(() => {
    setExpandedKeys([]);
  }, []);

  const updateWithUniqueIds = data?.map((item: any, index: any) => ({
    ...item,
    uniqueId: index,
  }));

  const finalColumns = showOnlyCount
    ? [
        {
          key: "serialNumber",
          title: "S.No",
          render: (text: any, record: any, index: number) =>
            record.uniqueId + 1,
          width: 80,
        },
        ...columnsWithFilters,
      ]
    : columnsWithFilters;

  const columnHeaderUpdated: any = isRowExpand
    ? [
        ...finalColumns,
        ...(finalColumns.length > 0
          ? [
              {
                title: "View More",
                dataIndex: "",
                key: "expand",
                align: "center",
                className: "custom-cursor",
                render: (text: any, record: any) => (
                  <div onClick={() => handleExpandClick(record.uniqueId)}>
                    {expandedKeys.includes(
                      getRowIdFromUniqueId(record.uniqueId, data),
                    ) ? (
                      <div className="d-flex flex-column align-items-center">
                        <div style={{ position: "relative", top: "10px" }}>
                          <UpChevron />
                        </div>
                        <div
                          style={{
                            position: "relative",
                            top: "35px",
                            zIndex: 9,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Triangle />
                        </div>
                      </div>
                    ) : (
                      <DownChevron />
                    )}
                  </div>
                ),
              },
            ]
          : []),
        ...(!showActionColumn && user.role !== "SUPER_ADMIN"
          ? [
              {
                title: "Action",
                dataIndex: "",
                key: "revert",
                align: "left",
                render: (text: any, record: any) => (
                  <div style={{ display: "flex", gap: "10px" }}>
                    {user.role !== "DATA_PROVIDER" && (
                      <Tooltip title="Revert">
                        <Button
                          onClick={() => {
                            const arr = [record];
                            setSelectedRowKeys(arr);
                            handleRevert(arr);
                          }}
                          disabled={!allowedStatuses?.has(record.status)}
                          className={`${Styles.revertActBtn} ${!allowedStatuses?.has(record.status) ? Styles.disabledBtn : ""}`}
                        >
                          <RevertIcon />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip
                      title={
                        roleLevels.reviewer.includes(user.role)
                          ? `Send for Approval`
                          : roleLevels.approver.includes(user.role)
                            ? "Approve"
                            : `Send for Review`
                      }
                    >
                      <Button
                        onClick={() => {
                          const arr = [record];
                          setSelectedRowKeys(arr);
                          handleApprove(arr);
                        }}
                        disabled={!allowedStatuses?.has(record.status)}
                        className={`${Styles.approveActBtn} ${!allowedStatuses?.has(record.status) ? Styles.disabledBtn : ""}`}
                      >
                        <ApproveIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        onClick={() => {
                          if (isNewDelte === true) {
                            onHandleDelete(record);
                          }
                        }}
                        disabled={
                          (isNewDelte &&
                            isNewDelte === true &&
                            getStatusMapping(record?.status) !== undefined &&
                            getStatusMapping(record?.status)?.includes(
                              user?.role,
                            )) ||
                          deleteSatausMappingFunc(
                            maxApproverLevel,
                            maxReviewerLevel,
                            user,
                            record?.status,
                          )?.findIndex((ele: string) => ele === user?.role) ===
                            0 ||
                          (record?.status === "Approved" &&
                            (maxApproverLevel &&
                            maxApproverLevel === "L1_DATA_APPROVER"
                              ? user?.role === "L1_DATA_REVIEWER"
                              : user?.role ===
                                `L${+maxApproverLevel[1] - 1}_DATA_APPROVER`)) ||
                          (record?.status === "For Deletion" &&
                            user?.role === maxApproverLevel)
                            ? false
                            : true
                        }
                        className={
                          isNewDelte &&
                          ((getStatusMapping(record.status) !== undefined &&
                            getStatusMapping(record.status)?.includes(
                              user?.role,
                            )) ||
                            deleteSatausMappingFunc(
                              maxApproverLevel,
                              maxReviewerLevel,
                              user,
                              record?.status,
                            )?.findIndex(
                              (ele: string) => ele === user?.role,
                            ) === 0 ||
                            (record?.status === "Approved" &&
                              (maxApproverLevel &&
                              maxApproverLevel === "L1_DATA_APPROVER"
                                ? user?.role === "L1_DATA_REVIEWER"
                                : user?.role ===
                                  `L${+maxApproverLevel[1] - 1}_DATA_APPROVER`)) ||
                            (record?.status === "For Deletion" &&
                              user?.role === maxApproverLevel))
                            ? Styles.deleteIconNew
                            : `${Styles.deleteIcon} ${Styles.disabledBtn}`
                        }
                      >
                        <Delete />
                      </Button>
                    </Tooltip>
                  </div>
                ),
              },
            ]
          : []),
      ]
    : finalColumns;

  const rowSelection = {
    onChange: (selectedRowKeys: Key[], selectedRowsRedux: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
    getCheckboxProps: (record: any) => {
      return {
        disabled: !allowedStatuses?.has(record.status),
      };
    },
  };

  const itemRender = (_: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <a className={`${Styles["paginationText"]} ${Styles["prevText"]}`}>
          <PaginationPrevArrow />
          Prev
        </a>
      );
    }
    if (type === "next") {
      return (
        <a className={`${Styles["paginationText"]} ${Styles["nextText"]}`}>
          Next
          <PaginationNextArrow />
        </a>
      );
    }
    return originalElement;
  };

  const [tableHeight, setTableHeight] = useState<number>(300); // Default height

  const updateTableHeight = () => {
    setTableHeight(window.innerHeight - 400); // Adjust this value as needed
  };

  useEffect(() => {
    updateTableHeight();
    window.addEventListener("resize", updateTableHeight);

    return () => {
      window.removeEventListener("resize", updateTableHeight);
    };
  }, []);

  const dynamicSummary = finalColumns?.map((column: any) => {
    if (!isForm) {
      if (totalColumnsList.includes(column.key)) {
        let total = 0;
        if (postFilterRecords && postFilterRecords.length > 0) {
          total = postFilterRecords.reduce(
            (acc: any, curr: any) => acc + curr[column.dataIndex],
            0,
          );
        } else {
          if (updateWithUniqueIds && updateWithUniqueIds.length > 0) {
            total = updateWithUniqueIds.reduce(
              (acc: any, curr: any) => acc + curr[column.dataIndex],
              0,
            );
          }
        }
        let convertedTotal = Number(total);
        return formatNumberUS(convertedTotal.toFixed(2));
      } else {
        return "";
      }
    }
  });

  return (
    <ConfigProvider
      theme={{
        hashed: false,
        components: {
          Table: {
            cellPaddingBlock: 8,
            cellPaddingInline: 10,
            headerColor: "#475467",
          },
        },
      }}
    >
      <Table<any[]>
        // rowSelection={rowSelection}
        rowClassName={(record, index) =>
          index % 2 === 0 ? Styles["rowOdd"] : Styles["rowEven"]
        }
        // className={`${Styles['tableStyle']} ${expandedRowKeys?.length > 0 ? Styles['additionalRow'] : Styles['notExpandedRow']} `}
        className={`${Styles["tableStyle"]} ${Styles["notExpandedRow"]} ${onRowClick && Styles["onRowClick"]}`}
        locale={{
          emptyText: (
            <Row justify="center">
              {" "}
              <Col span={24}>
                <NotFound />
              </Col>{" "}
              <Col span={24}>
                <span>{noText}</span>
              </Col>
            </Row>
          ),
        }}
        columns={columnHeaderUpdated}
        dataSource={updateWithUniqueIds}
        rowKey="id"
        onRow={rowProps}
        onChange={onchange}
        {...(enableRowSelection && {
          rowSelection: { type: "checkbox", ...rowSelection },
        })}
        expandable={{
          expandedRowKeys: expandedKeys,
          expandedRowRender: expandableRowRenderer,
          onExpand: handleExpandClick,
        }}
        summary={() =>
          !isForm &&
          updateWithUniqueIds &&
          updateWithUniqueIds.length > 0 &&
          finalColumns?.some((column: any) =>
            totalColumnsList.includes(column.key),
          ) && (
            <Table.Summary.Row>
              {dynamicSummary.map((summaryValue, index) => (
                <>
                  <Table.Summary.Cell key={index} index={index}>
                    {index == 0 ? (
                      <div className="fw-bold fs-6">Total</div>
                    ) : (
                      <div className="text-end fw-bold">{summaryValue}</div>
                    )}
                  </Table.Summary.Cell>
                </>
              ))}
            </Table.Summary.Row>
          )
        }
        pagination={
          postFilterRecords &&
          postFilterRecords?.length > 10 &&
          updateWithUniqueIds?.length > 10
            ? {
                position: ["bottomCenter"],
                pageSize: pageSize,
                current: currentPage,
                total: updateWithUniqueIds?.length,
                itemRender: itemRender,
              }
            : (postFilterRecords?.length === undefined ||
                  postFilterRecords?.length === 0) &&
                updateWithUniqueIds?.length > 10
              ? {
                  position: ["bottomCenter"],
                  pageSize: pageSize,
                  current: currentPage,
                  total: updateWithUniqueIds?.length,
                  itemRender: itemRender,
                }
              : false
        }
        scroll={{
          scrollToFirstRowOnChange: true,
        }}
      />
    </ConfigProvider>
  );
};

export default TableComponent;
