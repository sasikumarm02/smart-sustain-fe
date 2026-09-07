import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import Styles from '../../Modules/UserScreen/dashboard.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { get } from '../../Services';
import { useSelector, useDispatch } from 'react-redux';
import {
  setFacilitySelected,
  setStationaryFilters,
  setStationaryTabData,
} from '../../Redux/Actions';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import { isEmpty } from '../../Utils/isEmpty';

interface Item {
  key: string;
  id: string;
  status: string;
}

export default function ManageCompanyDashboardContent({
  dataSource,
  columns,
  btnPath,
  btnLabel,
  showSelect,
  apiUrl,
  mutliData,
  authRole,
  showDatePicker,
  pathEntity,
  scope,
  type,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tableData, setTableData] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const selectedRows = useSelector(
    (state: any) => state?.rowSelection?.selectedRowKeys
  );
  const facilitySelected = useSelector((state: any) => state?.facilitySelected);
  const [disableResubmit, setDisableResubmit] = useState<boolean>(true);
  const [entityData, setEntityData] = useState<any>([]);
  const [hasPermissionToAdd, setHasPermissionToAdd] = useState(false);
  const [activeKey, setActiveKey] = useState(location?.state);

  useEffect(() => {
    if (activeKey === null && location.state === null) {
      setActiveKey(0);
    }
    if (window.location.pathname === '/environment/scope2') {
      setActiveKey(0);
    }
  }, [window.location.href]);

  useEffect(() => {
    if (entityData?.length && facilitySelected !== '') {
      const isFacilityPresent = entityData?.some((entity: any) => {
        const roleMatch = entity?.entity_Role?.some((role: any) => {
          return role?.facility_Id?.includes(facilitySelected);
        });
        return roleMatch;
      });
      setHasPermissionToAdd(isFacilityPresent);
    }
    if (!isEmpty(entityData) && facilitySelected === '') {
      const facilityIds = entityData?.flatMap((entity: any) => {
        return entity?.entity_Role
          ?.map((role: any) => {
            if (role?.facility_Id) {
              return role.facility_Id;
            }
            return null;
          })
          .filter((facilityId: any) => facilityId !== null);
      });

      if (user.role === 'DATA_PROVIDER') {
        dispatch(setFacilitySelected(facilityIds[0][0]));
      }
    }
  }, [entityData, facilitySelected]);

  const fetchData = (apiUrl: any) => {
    setLoader(true);
    setTableData([]);
    if (apiUrl && (apiUrl !== undefined || apiUrl !== null || apiUrl !== '')) {
      get(`${apiUrl}?entity_Id=${user?.entity_Id}`)
        .then((res: any) => {
          if (res?.response?.status !== false) {
            setTableData([res?.response?.data]);
            dispatch(setStationaryTabData([res?.response?.data]));
            dispatch(
              setStationaryFilters(
                [...res?.response?.data].map((obj) => obj?.fuel_type)
              )
            );

            setLoader(false);
          } else {
            setLoader(false);
            setTableData([]);
          }
        })
        .catch((err) => {
          setLoader(false);
        });
    } else {
      setLoader(false);

      setTableData([]);
    }
  };

  useEffect(() => {
    if (pathEntity === true) {
      fetchData(
        `${apiUrl}?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );
    } else if (scope === 'Scope1') {
      fetchData(`${apiUrl}?entity_Id=${user?.entity_Id}&scope=${scope}`);
    } else {
      fetchData(apiUrl);
    }
  }, [facilitySelected, window.location.href]);

  const [filteredInfo, setFilteredInfo] = useState<any>({});

  // Function to reset filters
  const resetFilters = () => {
    setFilteredInfo({});
  };
  const handleAdd = (btnPath: any) => {
    if (
      window.location.pathname === '/user-access-management/user-role-mapping'
    ) {
      navigate(`${btnPath}/?entity_Id=${user.entity_Id}`);
    } else {
      navigate(btnPath, { state: activeKey + 1 });
    }
  };

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

  const filteredTabColumns =
    user.role === 'ADMIN'
      ? columns
      : columns.filter((column: any) => column.key !== 'Action');

  const mergedManageColumns = !mutliData
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

  useEffect(() => {
    resetFilters();
  }, [window.location.href]);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  return (
    <div className={Styles.pageCardStyle}>
      {!mutliData && (
        <Row className="mt-3">
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
                <Row style={{ paddingTop: '20px' }}>
                  <TableComponent
                    isRowExpand={false}
                    data={tableData.length !== 0 ? tableData : dataSource}
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
                </Row>
              </PageCardComponent>
            ) : (
              <div
                style={{ marginTop: '-3vh', width: '100%', padding: '20px' }}
              >
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
                <Row style={{ paddingTop: '20px' }}>
                  <TableComponent
                    isRowExpand={false}
                    data={tableData.length !== 0 ? tableData : dataSource}
                    enableRowSelection={false}
                    columnHeader={[
                      ...mergedManageColumns.map((column: any) => ({
                        ...column,
                        showSorterTooltip: false,
                      })),

                      // ...getActionCol(),
                    ]}
                    showOnlyCount={false}
                    columnCheckBoxDataAttribute="key"
                  />
                </Row>
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}
