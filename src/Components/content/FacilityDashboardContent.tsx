import { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  Breadcrumb,
  Typography,
  Card,
  Tabs,
  Space,
  Image,
  Upload,
  Spin,
  Select,
  Popover,
  List,
} from 'antd';
import { InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';

import Styles from '../../Modules/UserScreen/dashboard.module.scss';
import Styles2 from '../../Components/Emissions/Scope3/scope3.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { Icon } from '@iconify/react';
import { apiBaseUrl, get, post, put, upload } from '../../Services';
import { MoreOutlined } from '@ant-design/icons';

import { useNotification } from '../../Hooks/useNotification';
import editIcon from '../../assets/edit.png';
import linkIcon from '../../assets/link.png';
import { useSelector, useDispatch } from 'react-redux';

import {
  setFacilitySelected,
  setSelectedEmissionTab,
  setSelectedRowKeys,
  setStationaryFilters,
  setStationaryTabData,
  updateSelectedRowKeys,
} from '../../Redux/Actions';

import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import { formatNumberUS } from '../../Utils/Strings';
import {
  approversLevels,
  insertColumn,
  reviewrsLevels,
  roleLevels,
  roleStatusMapping,
  statusMapForForward,
  statusMapForRevert,
} from '../Emissions/Scope3/Helpers';

interface Item {
  key: string;
  id: string;
  status: string;
}

interface Disclosure {
  disclosure: string;
  file_name: string;
  id: number;
  quantity: number;
  tCO2e: number;
}

export default function FacilityDashboardContent({
  dataSource,
  columns,
  table2DataSource,
  table2Columns,
  breadcrumb,
  btnPath,
  btnLabel,
  showSelect,
  reportingPeriod,
  companyName,
  apiUrl,
  separatorReq,
  table2title,
  mutliData,
  listData,
  authRole,
  showDatePicker,
  tableAuth,
  dataTab,
  pathEntity,
  scope,
  type,
}: any) {
  interface EditItem {
    id: number;
    uuid: any;
    quantity: any;
    comment: string;
  }
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [height, setHeight] = useState(0);
  const { openToast } = useNotification();
  const [tableData, setTableData] = useState<any>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [attachement, setAttachement] = useState(null);
  const dispatch = useDispatch();
  const selectedRows = useSelector(
    (state: any) => state?.rowSelection?.selectedRowKeys
  );
  const facilitySelected = useSelector((state: any) => state?.facilitySelected);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [selectedRowEdit, setSetSelectedRowEdit] = useState<Disclosure>();
  const { Option } = Select;
  const [tabIndex, setTabIndex] = useState(location.state || 0);
  const [tableDataApi, setTableDataApi] = useState('');
  const [editList, setEditList] = useState<EditItem[]>([]);

  const [disableResubmit, setDisableResubmit] = useState<boolean>(true);
  const [entityData, setEntityData] = useState<any>([]);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState(location?.state);

  useEffect(() => {
    if (activeKey === null && location.state === null) {
      setActiveKey(0);
    }
    if (window.location.pathname === '/environment/scope2') {
      setActiveKey(0);
    }
  }, [window.location.href]);

  const editApiPath = [
    'Emissions/stationary_edit',
    'Emissions/mobile_edit',
    'Emissions/process_edit',
    'Emissions/fugitive_edit',
  ];
  const updateEmissionsApiPath = [
    'Emissions/stationary_put',
    'Emissions/mobile_put',
    'Emissions/process_put',
    'Emissions/fugitive_put',
  ];

  const updateEmissionsApiPathScope2 = ['energy/energy_put'];
  const editApiPathScope2 = ['energy/update-energy-energy_edit'];

  useEffect(() => {
    const fetchFaclityData = () => {
      get(`/facility/get_Facility/?entity_Id=${user?.entity_Id}`)
        .then((res: any) => {
          if (res?.response?.status !== false) {
            if (res?.response?.data) {
              setFacilityList(res?.response?.data);
              setTableData(res?.response?.data);
            }
          } else {
            setFacilityList([]);
            //openToast({
            //  content: `${res?.message}`,
            //  type: 'error',
            //});
          }
        })
        .catch((err) => console.log(err));
    };
    fetchFaclityData();
  }, []);

  const [filterValue, setFilterValue] = useState<string | undefined>(undefined);

  const getFilterCriteria = () => {
    if (filterValue) {
      return (item: { status: string }) => item.status === filterValue;
    }
    return undefined;
  };

  const getNotApprovedIds = (data: any) => {
    const notApprovedIds: number[] = [];
    Object.keys(data).forEach((month) => {
      const details = data[month];
      if (typeof details === 'object' && details?.status !== 'Approved') {
        if (details?.id !== undefined) {
          notApprovedIds.push(details.id);
        }
      }
    });
    return notApprovedIds;
  };

  const statusColumn = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'cellWidth',
      filters: tableData
        .map((entry: any) => entry.status) // Extracting status values
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) => record.status.indexOf(value) === 0,

      render: (status: any) => (
        <StatusComponent
          text={
            maxReviewerLevel === 'L1_DATA_REVIEWER' &&
            status === 'For L1 Review'
              ? 'For Review'
              : status
          }
          status={
            status === 'Approved'
              ? 'success'
              : failureStatuses.includes(status)
                ? 'failure'
                : warningStatuses.includes(status)
                  ? 'warning'
                  : 'warning'
          }
        />
      ),
    },
  ];

  const totalCol = {
    title: 'Total Quantity',
    dataIndex: 'total_quantity_of_fuel',
    key: 'total_quantity_of_fuel',
    className: 'total_quantity_of_fuel',
  };

  const [currentRowIndex, setCurrentRowIndex] = useState(-1);

  const excludeKeys = Object.keys(tableData[0] ? tableData[0] : {}).filter(
    (key) =>
      key !== 'id' && // Exclude id
      key !== 'contentEditable' &&
      key !== 'emission_factor_name' &&
      key !== 'total_quantity_of_fuel' &&
      key !== 'status' &&
      !key.includes('-') &&
      !(
        !roleLevels.reviewer.includes(user.role) &&
        !roleLevels.approver.includes(user.role) &&
        (key === 'total_emission_emmited_by_fuel_in_tonnes' ||
          key === 'kg_CO2_emission_per_unit' ||
          key === 'total_emission_emmited_by_fuel' ||
          key === 'emission_factor_database')
      )
  );

  function generateFiltersAndOnFilter(column: any, tableData: any) {
    let filters = null;
    let onFilter = null;
    if (
      column === 'fuel_type' ||
      column === 'uom' ||
      column === 'equipment_type' ||
      column === 'gas_or_refrigerant' ||
      column === 'vehicle_type' ||
      column === 'source_of_energy' ||
      column === 'emission_factor_name'
    ) {
      filters = tableData
        .map((entry: any) => entry[column])
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        )
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        }));

      if (column !== 'total_emission_emmited_by_fuel') {
        onFilter = (value: any, record: any) =>
          record[column].indexOf(value) === 0;
      }
    }

    return { filters, onFilter };
  }

  const handleAdd = (btnPath: any) => {
    if (
      window.location.pathname === '/user-access-management/user-role-mapping'
    ) {
      navigate(`${btnPath}/?entity_Id=${user.entity_Id}`);
    } else {
      navigate(btnPath, { state: activeKey + 1 });
    }
  };

  const filteredTabColumns =
    user.role === 'ADMIN'
      ? columns
      : columns.filter((column: any) => column.key !== 'Action');

  const mergedFacilityColumns = !mutliData
    ? filteredTabColumns.map((col: any) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: Item) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
          }),
        };
      })
    : null;

  const mergedColumns = !mutliData
    ? columns.map((col: any) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: Item) => ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
          }),
        };
      })
    : null;

  const editClick = (key: any, record: any) => {
    navigate(`/map-user?auth_Id=${record.auth_Id}`);
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  const [currentRole, setCurrentRole] = useState(user.role);
  const [maxReviewerLevel, setMaxReviewerLevel] = useState('');
  const [maxApproverLevel, setMaxApproverLevel] = useState('L1_DATA_REVIEWER');

  const getCurrentLevelIndex = (role: any) => {
    if (role?.includes('REVIEWER')) {
      return roleLevels.reviewer.indexOf(role);
    } else if (role?.includes('APPROVER')) {
      return roleLevels.approver.indexOf(role);
    }
    return -1;
  };

  const currentLevelIndex = getCurrentLevelIndex(currentRole);

  const getMaxLevelIndex = (roleType: any, maxLevel: any) => {
    return roleLevels[roleType as any].indexOf(maxLevel);
  };

  const maxReviewerLevelIndex = getMaxLevelIndex('reviewer', maxReviewerLevel);
  const maxApproverLevelIndex = getMaxLevelIndex('approver', maxApproverLevel);

  const valueToDisplayForRevert =
    currentRole?.includes('REVIEWER') && currentLevelIndex > 0
      ? roleLevels.reviewer[currentLevelIndex - 1]
      : currentRole.includes('APPROVER')
        ? currentLevelIndex <= 0
          ? roleLevels?.reviewer[maxReviewerLevelIndex]
          : roleLevels?.approver[currentLevelIndex - 1] || ''
        : 'DATA_PROVIDER';

  const valueToDisplayForForward: any = currentRole.includes('REVIEWER')
    ? currentLevelIndex < roleLevels.reviewer.length - 1 &&
      currentLevelIndex !== maxReviewerLevelIndex
      ? roleLevels.reviewer[currentLevelIndex + 1]
      : roleLevels.approver[0]
    : currentRole.includes('APPROVER')
      ? currentLevelIndex < roleLevels.approver.length - 1 &&
        currentLevelIndex !== maxApproverLevelIndex
        ? roleLevels.approver[currentLevelIndex + 1]
        : 'Approved'
      : roleLevels.reviewer[0];

  const failureStatuses = Object.values(statusMapForRevert);
  const warningStatuses = Object.values(statusMapForForward);

  const forwardstatusMessage =
    statusMapForForward[valueToDisplayForForward] || '';
  const revertstatusMessage = statusMapForRevert[valueToDisplayForRevert] || '';
  useEffect(() => {
    dispatch(setFacilitySelected(''));
  }, [window.location.href]);

  return (
    <div>
      <>
        {/* <Row
          justify="space-between"
          align="middle"
          className={Styles['page-title']}
        >
          <Col>
            {breadcrumb && (
              <Breadcrumb separator={!separatorReq ? '/' : ''}>
                {breadcrumb.map((data: any, index: any) => (
                  <Breadcrumb.Item
                    key={index}
                    className={
                      index + 1 === breadcrumb.length
                        ? 'pageTitle'
                        : 'breadTitle'
                    }
                  >
                    {data.label}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            )}
          </Col>
        </Row> */}
        {reportingPeriod ? (
          <Row className="mt-4 mb-2">
            <Col>
              <strong>{companyName}</strong>
            </Col>
            <Col className="d-flex justify-content-end font-large">
              Reporting Period : {reportingPeriod}
            </Col>
          </Row>
        ) : null}
      </>

      {!mutliData && (
        <Row>
          <Col span={24}>
            {window.location.pathname ===
            '/user-access-management/user-role-mapping' ? (
              <PageCardComponent style={{ padding: '5vh', width: '100%' }}>
                <Row>
                  <Col
                    className="d-flex justify-content-end"
                    style={{ gap: '20px', width: '100%' }}
                  >
                    {showDatePicker ? showDatePicker : null}
                    {showSelect ? showSelect : null}

                    {btnLabel
                      ? (user.role === authRole || authRole === '*') && (
                          <ButtonComponent
                            hierarchy="secondary-gray"
                            onClick={() => handleAdd(btnPath)}
                          >
                            {btnLabel} &nbsp; +
                          </ButtonComponent>
                        )
                      : null}
                  </Col>
                </Row>

                <TableComponent
                  isRowExpand={false}
                  data={tableData?.length !== 0 ? tableData : dataSource}
                  enableRowSelection={false}
                  columnHeader={[
                    ...mergedColumns.map((column: any) => ({
                      ...column,
                      showSorterTooltip: false,
                    })),

                    // ...getActionCol(),
                  ]}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                />
              </PageCardComponent>
            ) : (
              <PageCardComponent className={Styles.pageCardStyleSpecial}>
                {user.role === 'ADMIN' && (
                  <Row className={Styles.padding}>
                    <Col
                      className="d-flex justify-content-end"
                      style={{ gap: '20px', width: '100%' }}
                    >
                      {showDatePicker ? showDatePicker : null}
                      {showSelect ? showSelect : null}

                      {btnLabel
                        ? (user.role === authRole || authRole === '*') && (
                            <ButtonComponent
                              hierarchy="secondary-gray"
                              onClick={() => handleAdd(btnPath)}
                            >
                              {btnLabel} &nbsp; +
                            </ButtonComponent>
                          )
                        : null}
                    </Col>
                  </Row>
                )}

                <TableComponent
                  isRowExpand={false}
                  data={tableData.length !== 0 ? tableData : dataSource}
                  enableRowSelection={false}
                  columnHeader={[
                    ...mergedFacilityColumns.map((column: any) => ({
                      ...column,
                      showSorterTooltip: false,
                    })),

                    // ...getActionCol(),
                  ]}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                  noText={`Please visit the Manage Facility Profile page and add the facility`}
                />
              </PageCardComponent>
            )}
          </Col>
        </Row>
      )}

      {table2title && (
        <Row className="mt-3">
          {tableAuth.includes(user.role) && (
            <>
              <Col
                span={24}
                className="tableHeading font-weight-bold breadTitle"
              >
                <div className="d-flex justify-content-between mb-1">
                  <p className="pageTitle">{table2title}</p>
                  <Button
                    className="primary-act-btn"
                    onClick={() =>
                      navigate('/settings/company/onboarding-company')
                    }
                  >
                    Add +
                  </Button>
                </div>
              </Col>
              <Col span={24}>
                <TableComponent
                  isRowExpand={false}
                  data={table2DataSource}
                  enableRowSelection={false}
                  columnHeader={table2Columns}
                  showOnlyCount={false}
                  columnCheckBoxDataAttribute="key"
                />
              </Col>
            </>
          )}
        </Row>
      )}

      <Row gutter={12}>
        {!dataTab &&
          mutliData &&
          mutliData.map((item: any, index: number) => (
            <>
              {(item.multiAuthRole === '*' ||
                item.multiAuthRole.includes(user.role)) && (
                <Col
                  className="mt-3"
                  span={item.size ? item.size : 24}
                  key={index}
                >
                  <PageCardComponent style={{ marginTop: '-3vh' }}>
                    <Row justify="center" align="middle" className="mt-1">
                      <Col span={12} className={Styles2.pageSubTitle}>
                        {(user.role === 'COMPANY_AUTHORIZER' ||
                          item.multiAuthRole === '*') && (
                          <p className="page-Title">{item.title}</p>
                        )}
                      </Col>
                      <Col
                        span={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        {showDatePicker ? showDatePicker : null}
                        {showSelect ? showSelect : null}

                        {btnLabel
                          ? (user.role === authRole || authRole === '*') && (
                              <ButtonComponent
                                hierarchy="secondary-gray"
                                onClick={() => handleAdd(btnPath)}
                              >
                                {btnLabel} &nbsp; +
                              </ButtonComponent>
                            )
                          : null}
                      </Col>
                    </Row>

                    <TableComponent
                      isRowExpand={false}
                      data={
                        tableData && tableData?.length !== 0
                          ? tableData
                          : item?.dataSource
                            ? item?.dataSource
                            : []
                      }
                      enableRowSelection={true}
                      columnHeader={item?.columns ? item?.columns : []}
                      showOnlyCount={false}
                      columnCheckBoxDataAttribute="key"
                    />
                  </PageCardComponent>
                </Col>
              )}
            </>
          ))}
      </Row>

      {listData && user.role === 'COMPANY_AUTHORIZER' && (
        <>
          <p className="pageTitle mt-5">Material Topics Selected</p>
          <Card>
            <Row>
              {listData &&
                listData.map((item: any, index: number) => (
                  <Col span={8}>
                    <p className="pageTitle">{item.title}</p>
                    {item?.selectedItems?.map((selected: any) => (
                      <p style={{ color: '#17A2B8' }}>{selected}</p>
                    ))}
                  </Col>
                ))}
            </Row>
          </Card>
        </>
      )}
      {dataTab && (
        <Row>
          <Col span={24} className={!filterValue ? 'disableSelectAll' : ''}>
            <PageCardComponent>
              <Col className="d-flex justify-content-end gap-4">
                {showDatePicker ? showDatePicker : null}
                {showSelect ? showSelect : null}

                {btnLabel
                  ? (user.role === authRole || authRole === '*') && (
                      <>
                        <Select
                          className={Styles.facilityDropdown}
                          placeholder="Select Facilty"
                          value={facilitySelected}
                          onChange={(selectedOption) =>
                            dispatch(setFacilitySelected(selectedOption))
                          }
                        >
                          {facilityOptions?.map((facility: any) => (
                            <Option
                              key={facility?.facility_Id}
                              value={facility?.facility_Id}
                            >
                              {facility?.facility_Name}
                            </Option>
                          ))}
                        </Select>
                        <ButtonComponent
                          disabled={
                            !(hasPermissionToAdd && facilitySelected !== '')
                          }
                          hierarchy="secondary-gray"
                          onClick={() => handleAdd(btnPath)}
                        >
                          {btnLabel} &nbsp; +
                        </ButtonComponent>
                      </>
                    )
                  : null}
              </Col>{' '}
            </PageCardComponent>
          </Col>
        </Row>
      )}
    </div>
  );
}
