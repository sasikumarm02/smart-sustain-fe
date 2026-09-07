import { useReducer } from 'react';
import { DatePicker, Row, Col, Select, Spin, Flex } from 'antd';
import {
  PageCardComponent,
  ButtonComponent,
  TabsComponent,
  TableComponent,
} from '../../../../DesignLibrary';
import Styles from '../mapping.module.scss';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { GetProps } from 'antd';
import { apiBaseUrl, get, post } from '../../../../Services';
import { useAuth } from '../../../../Hooks/useAuth';
import { isEmpty } from '../../../../Utils/isEmpty';
import { useNotification } from '../../../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import LoaderComponent from '../../../../DesignLibrary/LoaderComponent';
import { CloseCircleOutlined } from '@ant-design/icons';
import Nouser from '../../../../assets/Nouser.svg';

dayjs.extend(customParseFormat);
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { Option } = Select;

const initialState = {
  material_topic: [],
  subtopic: null,
  resData: [],
  reviewerData: [],
};

const tabData = [
  { tab: 'Data Provider', key: '1' },
  { tab: 'Data Reviewer', key: '2' },
  { tab: 'Data Approver', key: '3' },
];

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_material_topic':
      return { ...state, material_topic: action.payload };
    case 'UPDATE_ALL_USERS':
      return { ...state, resData: action.payload };
    case 'UPDATE_REVIEWER_DATA':
      return { ...state, reviewerData: action.payload };
    default:
      return state;
  }
};

const RoleMappingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activatedKeyValue = !isEmpty(location?.state?.activeKey)
    ? location?.state?.activeKey
    : '1';
  const [currentTab, setCurrentTab] = useState(activatedKeyValue);
  const [Facility, setFacility] = useState([]);
  const [User, SetUser] = useState([]);
  const [col, setCol] = useState([{}]);
  const { user } = useAuth();

  const [reviewerData, setReviewerData] = useState<any>([]);
  const [reviewerDataForReset, setReviewerDataForReset] = useState<any>([]);
  const [approverCheck, setApproverCheck] = useState<boolean>(false);
  const [approverData, setApproverData] = useState<any>([
    {
      key: 1,
      no: 1,
      entity_Id: user?.entity_Id,
      frameworks: ['GRI'],
      L1: [],
      L2: [],
      target_date: '',
    },
  ]);
  const [approverUnmappedUsers, setApproverUnmappedUsers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { openToast } = useNotification();
  const [providerData, setProviderData] = useState<any>([
    {
      key: 1,
      no: 1,
      entity_Id: user?.entity_Id,
      material_topic: [],
      subtopic: [],
      auth_Id: [],
      target_date: '',
      role: activatedKeyValue === '1' ? 'DATA_PROVIDER' : 'DATA_PROVIDER',
    },
  ]);
  const [providerMappedData, setProviderMappedData] = useState<any>([]);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handlePageLoad = () => {
    setLoading(true);
    if (location.state) {
      setCurrentTab(location.state.activeKey);
      setFacility(location?.state?.data?.facility_Ids);
      SetUser(location?.state?.data?.unmapped_users);
    } else {
      setCurrentTab('');
      setCol([]);
      setFacility([]);
    }
    setLoading(false);
  };

  const convertSubTopics = (data: any) => {
    return data?.map(
      (e: any) => e?.sub_category_id + ' ' + e?.sub_category_name
    );
  };

  const getresData1 = async () => {
    setLoading(true);
    const entityId = user?.entity_Id;

    if (!entityId) {
      return;
    }

    let urlForList;

    switch (currentTab) {
      case '1':
        urlForList = `${apiBaseUrl}/user/GRI_DP_LIST/?entity_Id=${entityId}`;
        break;
      case '2':
        urlForList = `${apiBaseUrl}/user/GRI_DR_LIST/?entity_Id=${entityId}`;
        break;
      default:
        urlForList = `${apiBaseUrl}/user/GRI_DA_LIST/?entity_Id=${entityId}`;
        break;
    }
    if (currentTab === '3') {
      try {
        const listResponse = await get(urlForList);
        const data = listResponse?.response?.data[0]?.unmapped_user;
        if (
          listResponse?.response?.data[0]?.L1?.length > 0 &&
          !isEmpty(listResponse?.response?.data[0]?.target_date)
        ) {
          setApproverCheck(true);
        }
        setApproverUnmappedUsers(data);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        console.error('Error fetching data:', err.message || err);
      }
    }

    if (currentTab === '2') {
      try {
        const catSubCatUrl = `${apiBaseUrl}/report/get_entity_categories_and_subcategories/?entity_Id=${user.entity_Id}`;
        const [listResponse, catSubCatResponse] = await Promise.all([
          get(urlForList),
          get(catSubCatUrl),
        ]);
        const data = listResponse?.response?.data;
        const catSubCatResponseData = catSubCatResponse?.response?.data;
        const updatedDataWithSubtopics = data.map((dt: any) => {
          const matchingCategory = catSubCatResponseData?.find(
            (cS: any) =>
              (dt?.material_topic &&
                dt?.material_topic === cS?.category_name) ||
              (dt?.material_topic[0] &&
                dt?.material_topic[0] === cS?.category_name)
          );
          if (matchingCategory) {
            return {
              ...dt,
              subtopic: convertSubTopics(matchingCategory?.sub_categories),
            };
          } else {
            return dt;
          }
        });
        const filteredDataForReviewerUnmapped =
          updatedDataWithSubtopics?.filter(
            (mat: any) => isEmpty(mat?.L1) && isEmpty(mat?.target_date)
          );
        const updatedData = filteredDataForReviewerUnmapped?.map(
          (mat: any, index: number) => {
            const obj = {
              key: index + 1,
              no: index + 1,
              entity_Id: user?.entity_Id || '',
              material_topic: [mat.material_topic || ''],
              subtopic: mat?.subtopic || [],
              target_date: '',
              level: mat?.unmapped_user || '',
              L1: [],
              L2: [],
              L3: [],
            };
            return obj;
          }
        );
        setReviewerData(updatedData);
        setReviewerDataForReset(updatedData);
        dispatch({ type: 'UPDATE_REVIEWER_DATA', payload: updatedData });
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        console.error('Error fetching data:', err.message || err);
      }
    }

    if (currentTab === '1') {
      try {
        const catSubCatUrl = `${apiBaseUrl}/report/get_entity_categories_and_subcategories/?entity_Id=${user.entity_Id}`;
        const [dpResponse, catSubCatResponse] = await Promise.all([
          get(urlForList),
          get(catSubCatUrl),
        ]);
        const data = dpResponse?.response?.data;
        const filteredDataForProviderUnmapped = data?.filter(
          (mat: any) => isEmpty(mat?.mapped_user) && isEmpty(mat?.target_date)
        );
        const catSubCatData = catSubCatResponse?.response?.data;
        const filteredCatSubCat = catSubCatData?.filter((cat: any) =>
          filteredDataForProviderUnmapped.some(
            (fd: any) => fd?.material_topic === cat?.category_name
          )
        );
        setProviderMappedData(filteredDataForProviderUnmapped);
        dispatch({
          type: 'UPDATE_material_topic',
          payload: filteredCatSubCat,
        });
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        console.error('Error fetching data:', err.message || err);
      }
    }
  };

  useEffect(() => {
    handlePageLoad();
  }, [location.state]);

  useEffect(() => {
    getresData1();
  }, [currentTab]);

  const updateData = (data: any[], key: number, type: string, value: any) => {
    return data.map((d: any) => {
      if (currentTab === '1' && Number(d?.key) !== Number(key)) return d;
      if (currentTab === '2' && d?.material_topic[0] !== key) return d;
      if (currentTab === '3' && d?.frameworks[0] !== key) return d;
      switch (type) {
        case 'cat':
          return { ...d, material_topic: [value], subtopic: [], auth_Id: [] };
        case 'subCat':
          return { ...d, subtopic: value };
        case 'L1':
          return { ...d, L1: value };
        case 'L2':
          return { ...d, L2: value };
        case 'L3':
          return { ...d, L3: value };
        case 'user':
          return { ...d, auth_Id: value };
        case 'date':
        default:
          return { ...d, target_date: value };
      }
    });
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    return current && current < dayjs().startOf('day');
  };

  const handleUpdateRowData = (value: any, key: number, type: string) => {
    if (currentTab === '2') {
      setReviewerData((prevData: any) =>
        updateData(prevData, key, type, value)
      );
    } else if (currentTab === '1') {
      setProviderData((prevData: any) =>
        updateData(prevData, key, type, value)
      );
    } else if (currentTab === '3') {
      setApproverData((prevData: any) =>
        updateData(prevData, key, type, value)
      );
    }
  };

  const handleRemoveRow = (key: number) => {
    if (key === 1) {
      // Prevent removing the first row
      return;
    }

    if (currentTab === '1') {
      setProviderData((prevData: any) => {
        const updatedData = prevData.filter(
          (_: any, index: number) => index !== key - 1
        );
        return updatedData.map((item: any, index: number) => ({
          ...item,
          no: index + 1,
          key: index + 1,
        }));
      });
    } else if (currentTab === '2') {
      setReviewerData((prevData: any) => {
        const updatedData = prevData.filter(
          (_: any, index: number) => index !== key - 1
        );
        return updatedData.map((item: any, index: number) => ({
          ...item,
          no: index + 1,
          key: index + 1,
        }));
      });
    } else if (currentTab === '3') {
      setApproverData((prevData: any) => {
        const updatedData = prevData.filter(
          (_: any, index: number) => index !== key - 1
        );
        return updatedData.map((item: any, index: number) => ({
          ...item,
          no: index + 1,
          key: index + 1,
        }));
      });
    }
  };

  const columnsReviewer = [
    {
      title: 'S.No.',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Material Topic',
      dataIndex: 'material_topic',
      key: 'material_topic',
      render: (value: any, record: any) => {
        return (
          <div style={{ width: 230 }}>
            {reviewerData[Number(record?.key) - 1]?.material_topic[0]}
          </div>
        );
      },
    },
    {
      title: 'Level 1',
      dataIndex: 'L1',
      key: 'L1',
      render: (value: any, record: any) => {
        const currentLevelUsers = !isEmpty(reviewerData)
          ? reviewerData[Number(record?.key) - 1]?.level
          : [];
        const levelUser = !isEmpty(currentLevelUsers)
          ? currentLevelUsers.filter((lu: any) => {
              const reviewerDataItem = reviewerData[Number(record?.key) - 1];
              return (
                !reviewerDataItem.L2.includes(lu.auth_Id) &&
                !reviewerDataItem.L3.includes(lu.auth_Id)
              );
            })
          : [];
        return (
          <Select
            mode="multiple"
            className={Styles.selectNew}
            style={{ width: 200 }}
            notFoundContent={
              <div style={{ textAlign: 'center', height: '80px' }}>
                <img
                  src={Nouser}
                  style={{ width: '35px', height: '35px', marginTop: '10px' }}
                />
                <p style={{ marginTop: '10px' }}>No user available</p>
              </div>
            }
            onChange={(value) =>
              handleUpdateRowData(value, record?.material_topic[0], 'L1')
            }
            value={
              !isEmpty(reviewerData)
                ? reviewerData[Number(record?.key) - 1]?.L1
                : []
            }
          >
            {!isEmpty(levelUser) &&
              levelUser?.map((userr: any) => {
                return (
                  <Option key={userr?.auth_Id} value={userr?.auth_Id}>
                    {userr?.userName}
                  </Option>
                );
              })}
          </Select>
        );
      },
    },
    {
      title: 'Level 2',
      dataIndex: 'L2',
      key: 'L2',
      render: (value: any, record: any) => {
        const currentLevelUsers = !isEmpty(reviewerData)
          ? reviewerData[Number(record?.key) - 1]?.level
          : [];
        const levelUser = !isEmpty(currentLevelUsers)
          ? currentLevelUsers.filter((lu: any) => {
              const reviewerDataItem = reviewerData[Number(record?.key) - 1];
              return (
                !reviewerDataItem.L3.includes(lu.auth_Id) &&
                !reviewerDataItem.L1.includes(lu.auth_Id)
              );
            })
          : [];
        return (
          <Select
            mode="multiple"
            className={Styles.selectNew}
            style={{ width: 200 }}
            notFoundContent={
              <div style={{ textAlign: 'center', height: '80px' }}>
                <img
                  src={Nouser}
                  style={{ width: '35px', height: '35px', marginTop: '10px' }}
                />
                <p style={{ marginTop: '10px' }}>No user available</p>
              </div>
            }
            onChange={(value) =>
              handleUpdateRowData(value, record?.material_topic[0], 'L2')
            }
            value={
              !isEmpty(reviewerData)
                ? reviewerData[Number(record?.key) - 1]?.L2
                : []
            }
          >
            {!isEmpty(levelUser) &&
              levelUser?.map((userr: any) => {
                return (
                  <Option key={userr?.auth_Id} value={userr?.auth_Id}>
                    {userr?.userName}
                  </Option>
                );
              })}
          </Select>
        );
      },
    },
    {
      title: 'Level 3',
      dataIndex: 'L3',
      key: 'L3',
      render: (value: any, record: any) => {
        const currentLevelUsers = !isEmpty(reviewerData)
          ? reviewerData[Number(record?.key) - 1]?.level
          : [];
        const levelUser = !isEmpty(currentLevelUsers)
          ? currentLevelUsers?.filter((lu: any) => {
              const reviewerDataItem = reviewerData[Number(record?.key) - 1];
              return (
                !reviewerDataItem.L2.includes(lu.auth_Id) &&
                !reviewerDataItem.L1.includes(lu.auth_Id)
              );
            })
          : [];
        return (
          <Select
            mode="multiple"
            className={Styles.selectNew}
            style={{ width: 200 }}
            notFoundContent={
              <div style={{ textAlign: 'center', height: '80px' }}>
                <img
                  src={Nouser}
                  style={{ width: '35px', height: '35px', marginTop: '10px' }}
                />
                <p style={{ marginTop: '10px' }}>No user available</p>
              </div>
            }
            onChange={(value) =>
              handleUpdateRowData(value, record?.material_topic[0], 'L3')
            }
            value={
              !isEmpty(reviewerData)
                ? reviewerData[Number(record?.key) - 1]?.L3
                : []
            }
          >
            {!isEmpty(levelUser) &&
              levelUser?.map((userr: any) => {
                return (
                  <Option key={userr?.auth_Id} value={userr?.auth_Id}>
                    {userr?.userName}
                  </Option>
                );
              })}
          </Select>
        );
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      render: (value: any, record: any) => (
        <DatePicker
          style={{ width: 200 }}
          format="DD-MM-YYYY"
          value={reviewerData[record?.key - 1]?.target_date}
          onChange={(date, dateString) =>
            handleUpdateRowData(date, record?.material_topic[0], 'date')
          }
          disabledDate={disabledDate}
        />
      ),
    },
  ];

  const columnsApprover = [
    {
      title: 'S.No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: any, index: any) => <div>{index + 1}</div>,
    },
    {
      title: 'Frameworks',
      dataIndex: 'frameworks',
      key: 'frameworks',
      render: (value: any, record: any) => {
        return <div style={{ width: 230 }}>GRI</div>;
      },
    },
    {
      title: 'Level 1',
      dataIndex: 'L1',
      key: 'L1',
      render: (value: any, record: any) => {
        const levelUser = !isEmpty(approverUnmappedUsers)
          ? approverUnmappedUsers?.filter((lu: any) => {
              return !approverData[0].L2.includes(lu.auth_Id);
            })
          : [];
        return (
          <Select
            style={{ width: 200 }}
            className={Styles.selectNew}
            onChange={(value) =>
              handleUpdateRowData(value, record?.frameworks[0], 'L1')
            }
            mode="multiple"
            value={
              !isEmpty(approverData)
                ? approverData[Number(record?.key) - 1]?.L1
                : []
            }
          >
            {!isEmpty(levelUser) &&
              levelUser?.map((userr: any) => (
                <Option key={userr?.auth_Id} value={userr?.auth_Id}>
                  {userr?.userName}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: 'Level 2',
      dataIndex: 'L2',
      key: 'L2',
      render: (value: any, record: any) => {
        const levelUser = !isEmpty(approverUnmappedUsers)
          ? approverUnmappedUsers?.filter((lu: any) => {
              return !approverData[0].L1.includes(lu.auth_Id);
            })
          : [];
        return (
          <Select
            mode="multiple"
            style={{ width: 200 }}
            className={Styles.selectNew}
            onChange={(value) =>
              handleUpdateRowData(value, record?.frameworks[0], 'L2')
            }
            value={
              !isEmpty(approverData)
                ? approverData[Number(record?.key) - 1]?.L2
                : []
            }
          >
            {!isEmpty(levelUser) &&
              levelUser?.map((userr: any) => (
                <Option key={userr?.auth_Id} value={userr?.auth_Id}>
                  {userr?.userName}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      render: (value: any, record: any) => (
        <DatePicker
          style={{ width: 200 }}
          format="DD-MM-YYYY"
          value={approverData[record?.key - 1]?.target_date}
          onChange={(date) =>
            handleUpdateRowData(date, record?.frameworks[0], 'date')
          }
          disabledDate={disabledDate}
        />
      ),
    },
  ];

  const columnsProvider = [
    {
      title: 'S.No.',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Material Topic',
      dataIndex: 'material_topic',
      key: 'material_topic',
      render: (value: any, record: any) => {
        return (
          <Select
            style={{ width: 200 }}
            className={Styles.selectNew}
            onChange={(value) => handleUpdateRowData(value, record?.key, 'cat')}
            // mode="multiple"
            value={providerData[record?.key - 1]?.material_topic}
          >
            {state?.material_topic?.map((userr: any) => (
              <Option key={userr?.category_id} value={userr?.category_name}>
                {userr?.category_name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Sub Topics',
      dataIndex: 'subtopic',
      key: 'subtopic',
      render: (value: any, record: any) => {
        const allSelectedSubtopics = providerData.flatMap(
          (record1: any) => record1.subtopic || []
        );
        const selectedCategory =
          state?.material_topic &&
          state?.material_topic?.filter((category: any) =>
            record?.material_topic?.includes(category.category_name)
          );
        const filteredSubCategories = selectedCategory.flatMap(
          (category: any) =>
            category?.sub_categories?.filter((sub_category: any) => {
              const subCatIdName =
                sub_category?.sub_category_id +
                ' ' +
                sub_category?.sub_category_name;
              return (
                !allSelectedSubtopics.includes(subCatIdName) ||
                (!isEmpty(record?.subtopic) &&
                  record?.subtopic?.includes(subCatIdName))
              );
            })
        );
        return (
          <Select
            style={{ width: 200, height: 50, overflow: 'auto' }}
            mode="multiple"
            onChange={(value) => {
              if (value.includes('ALL')) {
                const allValues = filteredSubCategories.map(
                  (userr: any) =>
                    userr?.sub_category_id + ' ' + userr?.sub_category_name
                );
                handleUpdateRowData(allValues, record?.key, 'subCat');
              } else {
                handleUpdateRowData(value, record?.key, 'subCat');
              }
            }}
            value={providerData[record?.key - 1]?.subtopic}
          >
            {/* "Select All" Option */}
            {filteredSubCategories?.length > 0 && (
              <Option key="ALL" value="ALL">
                Select All
              </Option>
            )}

            {/* Other options */}
            {filteredSubCategories?.map((userr: any) => (
              <Option
                key={userr?.sub_category_id}
                value={userr?.sub_category_id + ' ' + userr?.sub_category_name}
              >
                {userr?.sub_category_id + ' ' + userr?.sub_category_name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Data Provider',
      dataIndex: 'auth_Id',
      key: 'auth_Id',
      render: (value: any, record: any) => {
        const updatedMappedUsers = !isEmpty(providerMappedData)
          ? providerMappedData.filter(
              (md: any) =>
                !isEmpty(record) &&
                !isEmpty(record?.material_topic) &&
                !isEmpty(record?.material_topic[0]) &&
                md?.material_topic === record?.material_topic[0]
            )
          : [];

        return (
          <Select
            style={{ width: 200 }}
            className={Styles.selectNew}
            onChange={(value) =>
              handleUpdateRowData(value, record?.key, 'user')
            }
            mode="multiple"
            value={providerData[record?.key - 1]?.auth_Id}
          >
            {updatedMappedUsers &&
              updatedMappedUsers[0] &&
              updatedMappedUsers[0]?.unmapped_user &&
              updatedMappedUsers[0]?.unmapped_user?.map((userr: any) => (
                <Option key={userr?.auth_Id} value={userr?.auth_Id}>
                  {userr?.userName}
                </Option>
              ))}
          </Select>
        );
      },
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      render: (value: any, record: any) => (
        <DatePicker
          style={{ width: 200 }}
          format="DD-MM-YYYY"
          value={providerData[record?.key - 1]?.target_date}
          disabledDate={disabledDate}
          onChange={(date, dateString) =>
            handleUpdateRowData(date, record?.key, 'date')
          }
        />
      ),
    },
    {
      title: <span style={{ fontFamily: 'Arial' }}>Action</span>,
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, rowIndex: any) => (
        <>
          <CloseCircleOutlined
            className="text-danger user-select-all"
            onClick={() => {
              if (record.key) {
                handleRemoveRow(record.key);
              }
            }}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    switch (currentTab) {
      case '1':
        setCol(columnsProvider);
        break;
      case '2':
        setCol(columnsReviewer);
        break;
      case '3':
        setCol(columnsApprover);
        break;
      // default:
      //   setCol([]);
      //   setData(data);
      //   break;
    }
  }, [
    currentTab,
    reviewerData,
    providerData,
    providerMappedData,
    approverData,
    approverUnmappedUsers,
  ]);

  const handleAddRow = () => {
    const newRow = {
      entity_Id: user?.entity_Id,
      key: providerData.length + 1,
      no: providerData.length + 1,
      material_topic: [''],
      subtopic: [],
      target_date: '',
      role: 'DATA_PROVIDER',
    };
    setProviderData([...providerData, newRow]);
  };

  const isFormComplete = (): boolean => {
    const data =
      currentTab === '2'
        ? reviewerData
        : currentTab === '1'
          ? providerData
          : approverData;
    let filteredData: any = [];
    if (currentTab === '2') {
      filteredData = data?.filter(
        (dataT: any) =>
          dataT?.L1?.length > 0 ||
          dataT?.L2?.length > 0 ||
          dataT?.L3?.length > 0 ||
          !isEmpty(dataT?.target_date)
      );
    }
    if (currentTab === '3') {
      filteredData = data;
    }
    if (currentTab === '1') {
      filteredData = data;
    }

    if (filteredData.length > 0) {
      const commonChecks = (item: any) => {
        if (currentTab === '2') {
          return (
            !isEmpty(item.L1) &&
            item?.L1?.length > 0 &&
            !isEmpty(item.entity_Id) &&
            !isEmpty(item.key) &&
            !isEmpty(item.material_topic) &&
            item.material_topic.length > 0 &&
            !isEmpty(item.no) &&
            !isEmpty(item.target_date)
          );
        }
        if (currentTab === '3') {
          return (
            !isEmpty(item.L1) &&
            item?.L1?.length > 0 &&
            !isEmpty(item.entity_Id) &&
            !isEmpty(item.key) &&
            !isEmpty(item.no) &&
            !isEmpty(item.target_date)
          );
        }
        return (
          !isEmpty(item.entity_Id) &&
          !isEmpty(item.key) &&
          !isEmpty(item.material_topic) &&
          item.material_topic.length > 0 &&
          !isEmpty(item.subtopic) &&
          item.subtopic.length > 0 &&
          !isEmpty(item.auth_Id) &&
          item.auth_Id.length > 0 &&
          !isEmpty(item.no) &&
          !isEmpty(item.role) &&
          !isEmpty(item.target_date)
        );
      };
      if (currentTab === '1') {
        return filteredData.every(commonChecks);
      }
      if (currentTab === '3') {
        return approverData.every((item: any) => {
          return approverData.every((item: any) => {
            return commonChecks(item);
          });
        });
      } else {
        return filteredData.every(commonChecks);
      }
    } else {
      return false;
    }
  };

  const handleReset = () => {
    if (currentTab === '1') {
      setProviderData([
        {
          key: 1,
          no: 1,
          entity_Id: user?.entity_Id,
          material_topic: [],
          subtopic: [],
          auth_Id: [],
          target_date: '',
          role: 'DATA_PROVIDER',
        },
      ]);
    }
    if (currentTab === '2') {
      setReviewerData(reviewerDataForReset);
    }
    if (currentTab === '3') {
      setApproverData([
        {
          key: 1,
          no: 1,
          entity_Id: user?.entity_Id,
          frameworks: ['GRI'],
          L1: [],
          L2: [],
          target_date: '',
        },
      ]);
    }
  };

  interface DataItem {
    entity_Id: string;
    key: number;
    material_topic: string[];
    no: number;
    level: any[];
    L1: any[];
    L2: any[];
    L3: any[];
    subtopic: string[] | null;
    target_date: Date | string;
  }

  const submitReviewer = async () => {
    const removeAttributes = (data: DataItem[]): Partial<DataItem>[] => {
      return data.map(
        ({ key, no, level, target_date, L1, L2, L3, ...rest }) => ({
          ...rest,
          role: {
            L1: L1,
            L2: L2,
            L3: L3,
          },
          target_date: target_date ? formatTargetDate(target_date) : '',
        })
      );
    };
    const updatedData = removeAttributes(reviewerData);
    const filteredData = updatedData?.filter(
      (dataT: any) =>
        dataT?.L1?.length > 0 ||
        dataT?.L2?.length > 0 ||
        dataT?.L3?.length > 0 ||
        !isEmpty(dataT?.target_date)
    );
    try {
      const response = await post(
        `${apiBaseUrl}/user/GRI_DR_MAPPING/`,
        filteredData
      );
      handleResponse(response);
    } catch (err: any) {
      console.log(err);
      const errMsg = err?.message || err;
      openToast({
        content: errMsg,
        type: 'warning',
      });
    }
  };

  const submitProvider = async () => {
    const removeAttributes = (data: DataItem[]): Partial<DataItem>[] => {
      return data.map(({ key, no, target_date, ...rest }) => ({
        ...rest,
        target_date: target_date ? formatTargetDate(target_date) : '',
      }));
    };

    const updatedData = removeAttributes(providerData);
    try {
      const response = await post(
        `${apiBaseUrl}/user/GRI_DP_MAPPING/`,
        updatedData
      );
      handleResponse(response);
    } catch (err: any) {
      console.log(err);
      const errMsg = err?.message || err;
      openToast({
        content: errMsg,
        type: 'warning',
      });
    }
  };

  const formatTargetDate = (date?: any) => {
    const facDate = date ? date.toISOString() : '';
    return date ? moment(facDate).format('YYYY-MM-DD') : '';
  };

  const handleResponse = (response: any) => {
    if (response?.status === 'Success') {
      openToast({
        content: response.message,
        type: 'success',
      });
      navigate('/role-mapping-compliance', {
        state: { currentTab },
      });
    } else {
      openToast({
        content: 'An error occurred',
        type: 'warning',
      });
    }
  };

  const submitApprover = async () => {
    const transformData = (data: DataItem[]): Partial<DataItem>[] =>
      data.map(({ key, no, target_date, L1, L2, ...rest }) => ({
        ...rest,
        role: { L1, L2 },
        target_date: target_date ? formatTargetDate(target_date) : '',
      }));
    const updatedData = transformData(approverData);
    const filteredData = updatedData.filter(
      ({ L1, L2, target_date }) =>
        (L1?.length ?? 0) > 0 || (L2?.length ?? 0) > 0 || !isEmpty(target_date)
    );

    try {
      const response = await post(
        `${apiBaseUrl}/user/GRI_DA_MAPPING/`,
        filteredData
      );
      handleResponse(response);
    } catch (error: any) {
      openToast({
        content: error.message || 'An error occurred',
        type: 'warning',
      });
    }
  };

  const handleSubmit = async () => {
    if (currentTab === '2') {
      submitReviewer();
    }
    if (currentTab === '1') {
      submitProvider();
    }
    if (currentTab === '3') {
      submitApprover();
    }
  };

  const handleTabChange = (event: any) => {
    if (event === '1' || event === '2') {
      setApproverCheck(false);
    }
    setCurrentTab(event);
  };

  return (
    <>
      <PageCardComponent customClass={Styles.pageCardStyle}>
        <Row justify="space-between" align="top">
          <Col lg={18}>
            <TabsComponent
              className={Styles.tabMargin}
              tabs={tabData}
              activeKey={currentTab}
              onChange={handleTabChange}
            />
          </Col>
          <Col lg={5}>
            <Flex justify="end">
              {currentTab === '1' && (
                <ButtonComponent
                  onClick={handleAddRow}
                  hierarchy="secondary-gray"
                >
                  Add Row
                </ButtonComponent>
              )}
            </Flex>
          </Col>
        </Row>

        <LoaderComponent spinning={loading}>
          <div>
            {currentTab && approverCheck ? (
              <>
                <div className={Styles?.daApproved}>
                  <div className={Styles?.daApprovedTitle}>
                    You Cannot Map User
                  </div>
                </div>
                <div className={Styles?.daApproved}>
                  <div className={Styles?.daApprovedSubTitle}>
                    Data Approver has been already assigned
                  </div>
                </div>
              </>
            ) : (
              <TableComponent
                isRowExpand={false}
                data={
                  currentTab === '2'
                    ? reviewerData
                    : currentTab === '1'
                      ? providerData
                      : approverData
                }
                enableRowSelection={false}
                columnHeader={col}
                showOnlyCount={false}
                columnCheckBoxDataAttribute="key"
              />
            )}
          </div>
          {!approverCheck && (
            <Row justify="end" style={{ marginTop: '15px' }}>
              <ButtonComponent hierarchy="tertiary" onClick={handleReset}>
                Reset
              </ButtonComponent>
              <ButtonComponent
                disabled={!isFormComplete()}
                style={{ marginLeft: '15px' }}
                onClick={handleSubmit}
              >
                Submit
              </ButtonComponent>
            </Row>
          )}
        </LoaderComponent>
      </PageCardComponent>
    </>
  );
};

export default RoleMappingForm;
