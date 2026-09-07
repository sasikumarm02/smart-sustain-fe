import { useEffect, useState } from 'react';
import { Row, Col, Select, Switch, message } from 'antd';
import Styles from '../../Modules/UserScreen/dashboard.module.scss';
import Styles2 from '../../Components/Emissions/Scope3/scope3.module.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { get, put } from '../../Services';
import { useSelector, useDispatch } from 'react-redux';
import active from '../../assets/Svg/User/Active.svg';
import Inactive from '../../assets/Svg/User/Inactive.svg';

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
import ModalComponent from '../../DesignLibrary/ModalComponent';
import StatusComponent from '../../DesignLibrary/StatusComponent';
import LoaderComponent from '../../DesignLibrary/LoaderComponent';

export default function UserMgmtDashboardContent({
  btnPath,
  btnLabel,
  showSelect,
  apiUrl,
  mutliData,
  authRole,
  showDatePicker,
  dataTab,
  pathEntity,
  scope,
}: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [tableData, setTableData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<number>();
  const [currentState, setCurrentState] = useState<boolean>();
  const [modalLoading, setModalLoading] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const selectedRows = useSelector(
    (state: any) => state?.rowSelection?.selectedRowKeys
  );
  const facilitySelected = useSelector((state: any) => state?.facilitySelected);
  const { Option } = Select;
  const [tabIndex, setTabIndex] = useState(0);
  const [disableResubmit, setDisableResubmit] = useState<boolean>(true);
  const [entityData, setEntityData] = useState<any>([]);
  const [activeKey, setActiveKey] = useState(location?.state);

  useEffect(() => {
    fetchEnityData('/entity/getEntitiesListByUserId/');
  }, []);

  const fetchEnityData = (apiUrl: any) => {
    setIsLoading(true);
    get(apiUrl)
      .then((res) => {
        if (res?.response?.status !== false) {
          setEntityData(res?.response?.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const fetchData = (apiUrl: any) => {
    setLoader(true);
    setTableData([]);
    if (apiUrl && (apiUrl !== undefined || apiUrl !== null || apiUrl !== '')) {
      get(apiUrl)
        .then((res: any) => {
          if (res?.response?.status !== false) {
            setTableData([...res?.response?.data]);
            dispatch(setStationaryTabData([...res?.response?.data]));

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

  const handleUserStatus = () => {
    if (currentRow) {
      setIsLoading(true);
      put(`invite/user_status/?id=${currentRow}&isActive=${!currentState}`, {})
        .then((res: any) => {
          if (res?.response?.status_code === 403) {
            message.error(res?.message);
          } else if (res?.response?.status !== false) {
            message.success(res?.message);
            fetchData(`${apiUrl}?entity_Id=${user?.entity_Id}`);
            fetchEnityData('/entity/getEntitiesListByUserId/');
          } else {
            message.error(res?.message);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setModalLoading(false);
          setIsOpen(false);
        });
    }
  };

  const handleSwitchChange = (record: any) => {
    try {
      if (record?.email_address === user?.email && user?.role === 'ADMIN') {
        message.warning("You can't set admin as Inactive");
      } else {
        setIsOpen(true);
        setCurrentState(record?.isActive);
        setCurrentRow(record?.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTabIndex(0);
    setActiveKey(0);
  }, [window?.location?.href]);

  useEffect(() => {
    if (
      mutliData &&
      activeKey &&
      activeKey != null &&
      activeKey <= mutliData?.length &&
      mutliData[activeKey]?.apiUrl !== undefined
    ) {
      if (pathEntity === true) {
        fetchData(
          `${mutliData[activeKey]?.apiUrl}?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
        );
      } else if (scope === 'Scope1') {
        fetchData(
          `${mutliData[activeKey]?.apiUrl}?entity_Id=${user?.entity_Id}&scope=${scope}`
        );
      } else {
        fetchData(mutliData[activeKey]?.apiUrl);
      }
    } else {
      if (pathEntity === true) {
        fetchData(
          `${apiUrl}?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
        );
      } else if (scope === 'Scope1') {
        fetchData(`${apiUrl}?entity_Id=${user?.entity_Id}&scope=${scope}`);
      } else {
        fetchData(`${apiUrl}?entity_Id=${user?.entity_Id}`);
      }
    }
  }, [facilitySelected, activeKey, window?.location?.href, mutliData, apiUrl]);

  const handleAdd = (btnPath: any) => {
    if (
      window.location.pathname === '/user-access-management/user-role-mapping'
    ) {
      navigate(`${btnPath}/?entity_Id=${user.entity_Id}`);
    } else {
      navigate(btnPath, { state: activeKey + 1 });
    }
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    setExpandedRowKeys([]);
  }, [window.location.href]);

  useEffect(() => {
    if (selectedRows.length > 0) {
      setDisableResubmit(false);
    } else {
      setDisableResubmit(true);
    }
  }, [selectedRows]);

  useEffect(() => {
    dispatch(setFacilitySelected(''));
  }, [window.location.href]);

  const communityCols = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email Address',
      dataIndex: 'email_address',
      key: 'email_address',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      defaultSortOrder: 'descend',
      render: (status: any) => (
        <StatusComponent
          text={status === 'Accepted' ? status : 'Invited'}
          status={
            status === 'Approved' || status === 'Accepted'
              ? 'success'
              : status === 'For DP Revision' || status === 'Not Approved'
                ? 'failure'
                : status === 'For Review' || status === 'For Approval'
                  ? 'warning'
                  : 'warning'
          }
        />
      ),
    },
    {
      title: 'Active/Inactive',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      render: (text: any, record: any) => (
        <div className="eFSwitch">
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            checked={record?.isActive}
            onChange={() => handleSwitchChange(record)}
          />
        </div>
      ),
    },
    {
      title: 'ESG Metrics',
      dataIndex: 'emission_user',
      key: 'emission_user',
      align: 'center',
      render: (record: boolean) => (
        <>
          {record ? (
            <>
              <img src={active} alt="" />
            </>
          ) : (
            <>
              <img src={Inactive} alt="" />
            </>
          )}
        </>
      ),
    },
    {
      title: 'Reporting Compliance',
      dataIndex: 'gri_user',
      key: 'gri_user',
      align: 'center',
      render: (record: boolean) => (
        <>
          {record ? (
            <>
              <img src={active} alt="" />
            </>
          ) : (
            <>
              <img src={Inactive} alt="" />
            </>
          )}
        </>
      ),
    },
    {
      title: 'ISSB Gap Assessment',
      dataIndex: 'issb_user',
      key: 'issb_user',
      align: 'center',
      width: 180,
      render: (record: boolean) => (
        <>
          {record ? (
            <>
              <img src={active} alt="" />
            </>
          ) : (
            <>
              <img src={Inactive} alt="" />
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <PageCardComponent customClass={Styles.pageCardStyle}>
      <LoaderComponent spinning={loader}>
        <Row gutter={12}>
          {!dataTab &&
            mutliData &&
            mutliData.map((item: any, index: number) => (
              <>
                {(item.multiAuthRole === '*' ||
                  item.multiAuthRole.includes(user.role)) && (
                  <Col span={item.size ? item.size : 24} key={index}>
                    <Row justify="center" align="middle" gutter={[15, 20]}>
                      <Col span={12} className={Styles2.pageSubTitle}>
                        {(user.role === 'COMPANY_AUTHORIZER' ||
                          item.multiAuthRole === '*') && (
                          <p className="page-Title fw-bold fs-5 mt-3">
                            {item.title}
                          </p>
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

                      <Col span={24}>
                        <TableComponent
                          isRowExpand={false}
                          data={
                            tableData && tableData?.length !== 0
                              ? tableData
                              : item?.dataSource
                                ? item?.dataSource
                                : []
                          }
                          enableRowSelection={false}
                          columnHeader={communityCols}
                          showOnlyCount={true}
                          columnCheckBoxDataAttribute="key"
                        />
                      </Col>
                    </Row>
                    <ModalComponent
                      isOpen={isOpen}
                      cancelBtnText="No"
                      content={
                        currentState
                          ? 'Do you want to make this user inactive'
                          : 'Do you want to make this user active ?'
                      }
                      submitBtnText="Yes"
                      onClose={() => setIsOpen(false)}
                      onProceed={handleUserStatus}
                    ></ModalComponent>
                    {/* </PageCardComponent> */}
                  </Col>
                )}
              </>
            ))}
        </Row>
      </LoaderComponent>
    </PageCardComponent>
  );
}
