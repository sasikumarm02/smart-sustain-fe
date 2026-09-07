import React, { useEffect, useState } from 'react';
import { Table, TableProps, ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Styles from '../../DesignLibrary/TableComponent/table.module.scss';
import { Key } from 'antd/lib/table/interface';
import { setSelectedRowKeys, updateSelectedRowKeys } from '../../Redux/Actions';
import { useDispatch, useSelector } from 'react-redux';
import TableFilterSelectedIcon from '../../assets/Svg/DesignLibrary/TableFilterSelectedIcon';
import TableFilterIcon from '../../assets/Svg/DesignLibrary/TableFilterIcon';
import SortAscendIcon from '../../assets/Svg/DesignLibrary/SortAscendIcon';
import SortDescendIcon from '../../assets/Svg/DesignLibrary/SortDescendIcon';
import SortIconForTable from '../../assets/Svg/DesignLibrary/SortIconForTable';
import PaginationPrevArrow from '../../assets/Svg/DesignLibrary/PaginationPrevArrow';
import PaginationNextArrow from '../../assets/Svg/DesignLibrary/PaginationNextArrow';

import { useAuth } from '../../Hooks/useAuth';
import { formatNumberUS } from '../../Utils/Strings';
import {
  customFormattColumns,
  roleStatusMapping,
} from '../Emissions/Scope3/Helpers';
import UpdateSection from './UpdateSection';

interface UseTableProps<T> extends TableProps<T> {
  dataSource: T[];
  columns: any[];
  propClassName: string;
  height?: number;
  loading?: boolean;
  onRowSelect?: any;
  showRowSelection: boolean;
  filterCriteria?: (item: T) => boolean;
}

const UseTable = <T extends object>({
  dataSource,
  columns,
  propClassName,
  loading = false,
  height,
  expandable,
  showRowSelection,
  filterCriteria,
  ...restProps
}: UseTableProps<T>) => {
  const [tableHeight, setTableHeight] = useState(
    height ?? window.innerHeight - 300
  );
  const { user } = useAuth();

  const [filteredData, setFilteredData] = useState(dataSource);

  const selectedRowsRedux = useSelector(
    (state: any) => state.rowSelection.selectedRowKeys
  );
  const selectedRowKeys = useSelector(
    (state: any) => state.selectedRowKeys.selectedRowKeys
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (filterCriteria) {
      setFilteredData(dataSource?.filter(filterCriteria));
    } else {
      setFilteredData(dataSource);
    }
  }, [dataSource, filterCriteria]);

  const columnsWithFilters: any = columns.map((column) => {
    const columnConfig: any = { ...column };

    if (customFormattColumns.includes(column.key)) {
      columnConfig.align = 'right';
    }

    if (column.onFilter) {
      columnConfig.filterIcon = (filtered: any) =>
        filtered ? <TableFilterSelectedIcon /> : <TableFilterIcon />;
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

  const rowSelection = {
    onChange: (selectedRowKeys: Key[], selectedRowsRedux: any) => {
      //setSelectedRowKeys(selectedRowKeys);
      dispatch(setSelectedRowKeys(selectedRowKeys));
      dispatch(updateSelectedRowKeys(selectedRowsRedux));
    },
    selectedRowKeys,
    getCheckboxProps: (record: any) => {
      const allowedStatuses = roleStatusMapping[user.role] || new Set();
      return {
        disabled: !allowedStatuses.has(record.status),
      };
    },
  };

  const addKeyToData = filteredData?.map((item: any, index: any) => {
    return {
      ...item,
      kg_CO2_emission_per_unit: formatNumberUS(
        item['kg_CO2_emission_per_unit']
      ),
      total_emission_emmited_by_fuel: formatNumberUS(
        item['total_emission_emmited_by_fuel']
      ),
      // // quantity:formatNumberUS(item["quantity"]),
      // amount:formatNumberUS(item["amount"]),
      key: `${index + 1}`,
    };
  });

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

  return (
    <div className={propClassName}>
      <ConfigProvider
        theme={{
          hashed: false,
          components: {
            Table: {
              // cellPaddingBlock: 8,
              // cellPaddingInline: 10,
              headerColor: '#475467',
            },
          },
        }}
      >
        <Table
          bordered={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? Styles['rowOdd'] : Styles['rowEven']
          }
          className={`${Styles['tableStyle']} ${Styles['notExpandedRow']} `}
          dataSource={addKeyToData}
          columns={columnsWithFilters}
          pagination={
            addKeyToData?.length > 10
              ? {
                  position: ['bottomCenter'],
                  pageSize: 10,
                  total: addKeyToData?.length,
                  itemRender: itemRender,
                }
              : false
          }
          // scroll={{ y: 300 }}
          expandable={expandable}
          loading={loading}
          {...restProps}
          {...(showRowSelection && {
            rowSelection: { type: 'checkbox', ...rowSelection },
          })}
          // onRow={(record) => ({
          //   onClick: () => {
          //     handleRowClick(record);
          //   },
          // })}
          // footer={() =>}
        />
      </ConfigProvider>
    </div>
  );
};

export default UseTable;
