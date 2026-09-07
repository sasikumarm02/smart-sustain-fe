import React, { useState, useEffect, useRef } from 'react';
import { Table, ConfigProvider, Button, Row, Col, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Styles from './table.module.scss';

import DownChevron from '../../assets/Svg/DesignLibrary/DownChevron';
import UpChevron from '../../assets/Svg/DesignLibrary/UpChevron';
import TableFilterSelectedIcon from '../../assets/Svg/DesignLibrary/TableFilterSelectedIcon';
import TableFilterIcon from '../../assets/Svg/DesignLibrary/TableFilterIcon';
import SortAscendIcon from '../../assets/Svg/DesignLibrary/SortAscendIcon';
import SortDescendIcon from '../../assets/Svg/DesignLibrary/SortDescendIcon';
import SortIconForTable from '../../assets/Svg/DesignLibrary/SortIconForTable';
import PaginationPrevArrow from '../../assets/Svg/DesignLibrary/PaginationPrevArrow';
import PaginationNextArrow from '../../assets/Svg/DesignLibrary/PaginationNextArrow';
import {
  setExpandedKeys,
  setSelectedRowKeys,
  updateSelectedRowKeys,
} from '../../Redux/Actions';
import { Key } from 'antd/lib/table/interface';
import RevertIcon from '../../assets/Svg/Emissions/revertIcon';
import ApproveIcon from '../../assets/Svg/Emissions/ApproveIcon';

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAuth } from '../../Hooks/useAuth';
import {
  customFormattColumns,
  deleteSatausMapping,
  deleteSatausMappingFunc,
  getRowIdFromUniqueId,
  requestedDeleteStatusMapping,
  roleLevels,
  totalColumnsList,
} from '../../Components/Emissions/Scope3/Helpers';
import Triangle from '../../assets/Svg/Emissions/triange';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import Delete from '../../assets/Svg/Emissions/Delete';
import NotFound from '../../assets/Svg/DesignLibrary/NotFound';
import { formatNumberUS } from '../../Utils/Strings';

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
  const dispatch = useDispatch();
  const expandedKeys = useSelector((state: any) => state.expandedRowkeys);

  const { user } = useAuth();

  const recordsPerPage = 10;
  const selectedRowKeys = useSelector(
    (state: any) => state.selectedRowKeys.selectedRowKeys
  );

  const getStatusMapping = (status: string): string[] | undefined => {
    if (requestedDeleteStatusMapping.hasOwnProperty(status)) {
      return requestedDeleteStatusMapping[status] || [];
    }
    return undefined;
  };

  const generateFilters = (
    data: any[],
    key: string
  ): { text: string; value: any }[] => {
    const uniqueValues = Array.from(new Set(data?.map((item) => item[key])));
    return uniqueValues?.map((value) => ({
      text: value?.toString(),
      value: value,
    }));
  };

  const columnsWithFilters: ColumnsType<any[]> = columnHeader?.map((column) => {
    const columnConfig: any = { ...column };
    if (customFormattColumns?.includes(column.key)) {
      columnConfig.align = 'right';
    }
    if (column.onFilter) {
      columnConfig.filterIcon = (filtered: any) =>
        filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />;
      columnConfig.filters = generateFilters(data, column.key);
    }
    if (column.sorter) {
      columnConfig.sortIcon = ({ sortOrder }: { sortOrder: string }) =>
        sortOrder === 'ascend' ? (
          <SortAscendIcon />
        ) : sortOrder === 'descend' ? (
          <SortDescendIcon />
        ) : (
          <SortIconForTable />
        );
      columnConfig.showSorterTooltip = false;
    }
    return columnConfig;
  });

  const handleExpandClick = (key: any) => {
    const rowId = getRowIdFromUniqueId(key, data);
    if (rowId === null) return;
    const isCurrentRowExpanded = expandedKeys.includes(rowId);
    if (isCurrentRowExpanded) {
      dispatch(setExpandedKeys(expandedKeys.filter((k: any) => k !== rowId)));
    } else {
      dispatch(setExpandedKeys([rowId]));
    }
  };

  useEffect(() => {
    dispatch(setExpandedKeys(expandedKeys));
  }, [expandedKeys]);

  useEffect(() => {
    dispatch(setExpandedKeys([]));
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
    dispatch(setExpandedKeys([]));
  }, []);

  const updateWithUniqueIds = data?.map((item: any, index: any) => ({
    ...item,
    uniqueId: index,
  }));

  const finalColumns = showOnlyCount
    ? [
        {
          key: 'serialNumber',
          title: 'S.No',
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
                title: 'View More',
                dataIndex: '',
                key: 'expand',
                align: 'center',
                className: 'custom-cursor',
                render: (text: any, record: any) => (
                  <div onClick={() => handleExpandClick(record.uniqueId)}>
                    {expandedKeys.includes(
                      getRowIdFromUniqueId(record.uniqueId, data)
                    ) ? (
                      <div className="d-flex flex-column align-items-center">
                        <div style={{ position: 'relative', top: '10px' }}>
                          <UpChevron />
                        </div>
                        <div
                          style={{
                            position: 'relative',
                            top: '35px',
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
        ...(!showActionColumn && user.role !== 'SUPER_ADMIN'
          ? [
              {
                title: 'Action',
                dataIndex: '',
                key: 'revert',
                align: 'left',
                render: (text: any, record: any) => (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {user.role !== 'DATA_PROVIDER' && (
                      <Tooltip title="Revert">
                        <Button
                          onClick={() => {
                            const arr = [record];
                            dispatch(setSelectedRowKeys(arr));
                            handleRevert(arr);
                          }}
                          disabled={!allowedStatuses?.has(record.status)}
                          className={`${Styles.revertActBtn} ${!allowedStatuses?.has(record.status) ? Styles.disabledBtn : ''}`}
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
                            ? 'Approve'
                            : `Send for Review`
                      }
                    >
                      <Button
                        onClick={() => {
                          const arr = [record];
                          dispatch(setSelectedRowKeys(arr));
                          handleApprove(arr);
                        }}
                        disabled={!allowedStatuses?.has(record.status)}
                        className={`${Styles.approveActBtn} ${!allowedStatuses?.has(record.status) ? Styles.disabledBtn : ''}`}
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
                              user?.role
                            )) ||
                          deleteSatausMappingFunc(
                            maxApproverLevel,
                            maxReviewerLevel,
                            user,
                            record?.status
                          )?.findIndex((ele: string) => ele === user?.role) ===
                            0 ||
                          (record?.status === 'Approved' &&
                            (maxApproverLevel &&
                            maxApproverLevel === 'L1_DATA_APPROVER'
                              ? user?.role === 'L1_DATA_REVIEWER'
                              : user?.role ===
                                `L${+maxApproverLevel[1] - 1}_DATA_APPROVER`)) ||
                          (record?.status === 'For Deletion' &&
                            user?.role === maxApproverLevel)
                            ? false
                            : true
                        }
                        className={
                          isNewDelte &&
                          ((getStatusMapping(record.status) !== undefined &&
                            getStatusMapping(record.status)?.includes(
                              user?.role
                            )) ||
                            deleteSatausMappingFunc(
                              maxApproverLevel,
                              maxReviewerLevel,
                              user,
                              record?.status
                            )?.findIndex(
                              (ele: string) => ele === user?.role
                            ) === 0 ||
                            (record?.status === 'Approved' &&
                              (maxApproverLevel &&
                              maxApproverLevel === 'L1_DATA_APPROVER'
                                ? user?.role === 'L1_DATA_REVIEWER'
                                : user?.role ===
                                  `L${+maxApproverLevel[1] - 1}_DATA_APPROVER`)) ||
                            (record?.status === 'For Deletion' &&
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
      //setSelectedRowKeys(selectedRowKeys);
      dispatch(setSelectedRowKeys(selectedRowKeys));
      dispatch(updateSelectedRowKeys(selectedRowsRedux));
    },
    selectedRowKeys,
    getCheckboxProps: (record: any) => {
      return {
        disabled: !allowedStatuses?.has(record.status),
      };
    },
  };

  const itemRender = (_: any, type: any, originalElement: any) => {
    if (type === 'prev') {
      return (
        <a className={`${Styles['paginationText']} ${Styles['prevText']}`}>
          <PaginationPrevArrow />
          Prev
        </a>
      );
    }
    if (type === 'next') {
      return (
        <a className={`${Styles['paginationText']} ${Styles['nextText']}`}>
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
    window.addEventListener('resize', updateTableHeight);

    return () => {
      window.removeEventListener('resize', updateTableHeight);
    };
  }, []);

  const dynamicSummary = finalColumns?.map((column: any) => {
    if (!isForm) {
      if (totalColumnsList.includes(column.key)) {
        let total = 0;
        if (postFilterRecords && postFilterRecords.length > 0) {
          total = postFilterRecords.reduce(
            (acc: any, curr: any) => acc + curr[column.dataIndex],
            0
          );
        } else {
          if (updateWithUniqueIds && updateWithUniqueIds.length > 0) {
            total = updateWithUniqueIds.reduce(
              (acc: any, curr: any) => acc + curr[column.dataIndex],
              0
            );
          }
        }
        let convertedTotal = Number(total);
        return formatNumberUS(convertedTotal.toFixed(2));
      } else {
        return '';
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
            headerColor: '#475467',
          },
        },
      }}
    >
      <Table<any[]>
        // rowSelection={rowSelection}
        rowClassName={(record, index) =>
          index % 2 === 0 ? Styles['rowOdd'] : Styles['rowEven']
        }
        // className={`${Styles['tableStyle']} ${expandedRowKeys?.length > 0 ? Styles['additionalRow'] : Styles['notExpandedRow']} `}
        className={`${Styles['tableStyle']} ${Styles['notExpandedRow']} ${onRowClick && Styles['onRowClick']}`}
        locale={{
          emptyText: (
            <Row justify="center">
              {' '}
              <Col span={24}>
                <NotFound />
              </Col>{' '}
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
          rowSelection: { type: 'checkbox', ...rowSelection },
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
            totalColumnsList.includes(column.key)
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
                position: ['bottomCenter'],
                pageSize: pageSize,
                current: currentPage,
                total: updateWithUniqueIds?.length,
                itemRender: itemRender,
              }
            : (postFilterRecords?.length === undefined ||
                  postFilterRecords?.length === 0) &&
                updateWithUniqueIds?.length > 10
              ? {
                  position: ['bottomCenter'],
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
