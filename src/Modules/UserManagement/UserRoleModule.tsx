import React, { useEffect, useState } from 'react';
import { Select, Input, DatePicker, Col, Row } from 'antd';
import { get, post, put } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { useQuery } from '../../Hooks/useQuery';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { GetProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { message as notificationMessage } from 'antd';
dayjs.extend(customParseFormat);
const { Option } = Select;

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
// Define interfaces for row data and column configuration
interface RowData {
  entity_Id: string;
  auth_Id: string;
  target_date: string;
  material_topic: string[] | null;
  sub_material_topic: string[] | null;
  userName: string;
  entity_Role: string;
}

interface ColumnConfig {
  title: string;
  dataIndex: keyof RowData;
  key: string;
  type: 'text' | 'select' | 'upload' | '' | 'Date' | 'SecondSelect'; // Add other types as needed
  options?: string[];
}

interface Category {
  category_id: string;
  category_name: string;
  sub_categories: SubCategory[];
}

interface SubCategory {
  sub_category_id: string;
  sub_category: string;
}

const UserRoleModule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const query = useQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [frameData, setFrameData] = useState<any>([]);
  const [subTopic, setSubTopic] = useState<any>();
  const location = useLocation();
  const [IsFilledData, setIsFilledData] = React.useState(false);
  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    return current && current < dayjs().endOf('day');
  };

  const catFiveWasteMethodcols: ColumnConfig[] = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      type: '',
    },
    {
      title: 'User Role',
      dataIndex: 'entity_Role',
      key: 'entity_Role',
      type: '',
    },
    {
      title: 'Material Topics',
      dataIndex: 'material_topic',
      key: 'material_topic',
      type: 'select',
      options: frameData,
    },
    {
      title: 'Sub Material Topics',
      dataIndex: 'sub_material_topic',
      key: 'sub_material_topic',
      type: 'SecondSelect',
      options: [''],
    },
    {
      title: 'Target Date',
      dataIndex: 'target_date',
      key: 'target_date',
      type: 'Date',
    },
  ];

  const fetchData = async (api: string) => {
    get(api)
      .then((res: any) => {
        if (res.response.status !== false) {
          const result = res.response.data.filter(
            (item: any) => item.material_topic === null
          );
          setRowData(result);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchFrameData = () => {
    get(
      `/report/get_entity_categories_and_subcategories/?entity_Id=${user.entity_Id}`
    )
      .then((res: any) => {
        if (res.response.status !== false) {
          setFrameData(res?.response?.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const updateApiData = (rowData: any) => {
    setIsLoading(true);
    put(`/invite/update_user_map/`, rowData)
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res?.response?.status === true) {
            navigate('/user-access-management/user-role-mapping');
          }
        }
        setIsLoading(false);
      })
      .catch((err) => notificationMessage.error(err.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!query.get('action')) {
      if (!query.get('auth_Id')) {
        if (window.location.pathname === '/map-user') {
          fetchData(`/invite/unmapped_user/?entity_Id=${user.entity_Id}`);
        } else {
          fetchData(
            `/invite/data_providerList/?entity_Id=${
              user.entity_Id
            }&auth_Id=${null}`
          );
        }
      } else {
        fetchData(
          `/invite/data_providerList/?entity_Id=${
            user.entity_Id
          }&auth_Id=${query.get('auth_Id')}`
        );
      }
    } else {
      if (
        location?.state &&
        location.state !== undefined &&
        location.state !== null
      ) {
        setIsFilledData(true);
        setRowData(() => [...rowData, location.state]);
      }
    }
    fetchFrameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, user.entity_Id]);
  const postData = () => {
    setIsLoading(true);
    post(`/invite/Map_User/`, {
      entity_Id: user.entity_Id,
      user_data: rowData,
    })
      .then((res: any) => {
        if (res.response.status !== false) {
          navigate('/user-access-management/user-role-mapping');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        notificationMessage.error(err.message);
      });
  };

  const handleInputChange = (
    value: string,
    rowIndex: number,
    columnName: keyof RowData
  ) => {
    const updatedData = [...rowData];

    updatedData[rowIndex] = {
      ...updatedData[rowIndex], // maintain existing properties
      [columnName]: value, // update the specific property
    };
    setRowData(updatedData);
  };

  const mergeSubTopic = (value: any, currentRowIndex: any) => {
    const data = frameData.filter((item: any) =>
      value.includes(item.category_name)
    );
    let newData: any = {};
    newData[currentRowIndex.toString()] = [];
    data.forEach((obj: any) => {
      newData[currentRowIndex.toString()] = newData[
        currentRowIndex.toString()
      ].concat(obj.sub_categories);
    });
    setSubTopic(newData);
  };
  const generateColumns = (columnsFromBackend: ColumnConfig[]) => {
    const generatedColumns = columnsFromBackend.map((column) => {
      const { title, dataIndex, key, type, options } = column;
      let renderFunction = null;

      switch (type) {
        case 'text':
          renderFunction = (
            text: string,
            record: RowData,
            rowIndex: number
          ) => (
            <Input
              value={text}
              onChange={(e) =>
                handleInputChange(e.target.value, rowIndex, dataIndex)
              }
            />
          );
          break;
        case 'select':
          renderFunction = (
            text: string,
            record: RowData,
            rowIndex: number
          ) => {
            return (
              <Select
                mode="multiple"
                value={text}
                onChange={(value) => {
                  mergeSubTopic(value, rowIndex);
                  handleInputChange(value, rowIndex, dataIndex);
                }}
                style={{ width: 200 }}
              >
                {options &&
                  options?.map((option: any, index: number) => (
                    <Option key={index} value={option.category_name}>
                      {option.category_name}
                    </Option>
                  ))}
              </Select>
            );
          };
          break;
        case 'SecondSelect':
          renderFunction = (
            text: string,
            record: RowData,
            rowIndex: number
          ) => {
            return (
              <Select
                mode="multiple"
                value={text}
                onChange={(value) => {
                  handleInputChange(value, rowIndex, dataIndex);
                }}
                style={{ width: 200 }}
              >
                {subTopic &&
                  subTopic[Number(rowIndex)] &&
                  subTopic[Number(rowIndex)]?.map(
                    (option: any, index: number) => (
                      <Option
                        key={index}
                        value={(option.category_id || ' ').concat(
                          ' ',
                          option.category_name || ''
                        )}
                      >
                        {option.category_id}&nbsp;
                        {option.category_name}
                      </Option>
                    )
                  )}
              </Select>
            );
          };
          break;
        case 'Date':
          renderFunction = (text: any, record: RowData, rowIndex: number) => (
            <>
              <DatePicker
                disabledDate={disabledDate}
                value={
                  IsFilledData
                    ? rowData &&
                      rowData[rowIndex] &&
                      rowData[rowIndex].target_date !== null &&
                      rowData[rowIndex].target_date !== undefined &&
                      dayjs(rowData[rowIndex].target_date, 'YYYY-MM-DD')
                    : text
                }
                onChange={(value) => {
                  handleInputChange(value, rowIndex, dataIndex);
                }}
              />
            </>
          );
          break;
        default:
          // Handle other types if needed
          break;
      }

      return {
        title: title,
        dataIndex: dataIndex,
        key: key,
        render: renderFunction,
      };
    });

    return generatedColumns;
  };

  return (
    <div>
      <PageCardComponent style={{ marginTop: '5vh' }}>
        <p className="pageTitle mt-3">Map User</p>

        <TableComponent
          isRowExpand={false}
          data={rowData}
          enableRowSelection={false}
          columnHeader={generateColumns(catFiveWasteMethodcols)}
          showOnlyCount={false}
          columnCheckBoxDataAttribute="key"
        />
        <Row justify="end">
          {IsFilledData ? (
            <Col lg={2} className="mt-2">
              <ButtonComponent
                onClick={() => updateApiData(rowData[0])}
                loading={isLoading}
              >
                Update
              </ButtonComponent>
            </Col>
          ) : (
            <Col lg={2} className="mt-2">
              <ButtonComponent onClick={() => postData()} loading={isLoading}>
                Submit
              </ButtonComponent>
            </Col>
          )}
        </Row>
      </PageCardComponent>
    </div>
  );
};

export default UserRoleModule;
