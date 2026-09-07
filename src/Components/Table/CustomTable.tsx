import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Space,
  Button,
  Tooltip,
} from 'antd';
import { put } from '../../Services';

const RevertIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 19 18"
      fill="none"
    >
      <path
        d="M9.40039 16.3125C7.461 16.3125 5.60103 15.5421 4.22967 14.1707C2.85831 12.7994 2.08789 10.9394 2.08789 9H3.21289C3.21299 10.4869 3.74854 11.9241 4.72155 13.0485C5.69456 14.1729 7.03993 14.9093 8.51145 15.1229C9.98296 15.3365 11.4822 15.0131 12.7348 14.2118C13.9873 13.4105 14.9094 12.185 15.3324 10.7594C15.7553 9.33389 15.6507 7.80374 15.0377 6.44901C14.4248 5.09428 13.3445 4.00558 11.9945 3.38217C10.6446 2.75877 9.11529 2.64234 7.68653 3.0542C6.25777 3.46607 5.0251 4.37867 4.21414 5.625H7.71289V6.75H2.65039V1.6875H3.77539V4.33125C4.56161 3.38348 5.57444 2.64961 6.71995 2.1977C7.86546 1.74579 9.10654 1.59049 10.3281 1.74619C11.5496 1.90189 12.7121 2.36356 13.7076 3.08837C14.7031 3.81318 15.4995 4.77766 16.0228 5.89235C16.5461 7.00704 16.7795 8.23584 16.7012 9.46477C16.6229 10.6937 16.2356 11.883 15.5751 12.9223C14.9146 13.9616 14.0023 14.8172 12.9229 15.4099C11.8434 16.0026 10.6318 16.313 9.40039 16.3125Z"
        fill="#23456A"
      />
    </svg>
  );
};
const SubmitIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 19 18"
      fill="none"
    >
      <g clip-path="url(#clip0_1460_6941)">
        <path
          d="M2.44954 12.7815H3.5625V14.625C3.56327 15.3707 3.85984 16.0856 4.38712 16.6129C4.9144 17.1402 5.62932 17.4367 6.375 17.4375H15.375C16.1207 17.4367 16.8356 17.1402 17.3629 16.6129C17.8902 16.0856 18.1867 15.3707 18.1875 14.625V6.55875C18.1882 6.18794 18.1153 5.82068 17.9731 5.47821C17.831 5.13574 17.6223 4.82486 17.3592 4.56357L14.1867 1.39107C13.9254 1.12788 13.6145 0.919131 13.272 0.776907C12.9294 0.634684 12.5621 0.561811 12.1912 0.562505H6.375C5.62932 0.563279 4.9144 0.859844 4.38712 1.38712C3.85984 1.9144 3.56327 2.62932 3.5625 3.375V7.46854H2.44954C2.14803 7.46911 1.85905 7.58918 1.64592 7.80244C1.43278 8.0157 1.31289 8.30475 1.3125 8.60625V11.6438C1.31289 11.9453 1.43278 12.2343 1.64592 12.4476C1.85905 12.6608 2.14803 12.7809 2.44954 12.7815ZM4.6875 3.375C4.68801 2.92761 4.86596 2.49868 5.18232 2.18232C5.49867 1.86596 5.9276 1.68801 6.375 1.68751H12.1912C12.4143 1.68713 12.6352 1.73103 12.8411 1.81665C13.047 1.90228 13.2339 2.02793 13.3909 2.18633L16.5634 5.35883C16.7219 5.51589 16.8475 5.70281 16.9332 5.90879C17.0189 6.11476 17.0628 6.33568 17.0625 6.55875V14.625C17.062 15.0724 16.884 15.5013 16.5677 15.8177C16.2513 16.134 15.8224 16.312 15.375 16.3125H6.375C5.9276 16.312 5.49867 16.134 5.18232 15.8177C4.86596 15.5013 4.68801 15.0724 4.6875 14.625V12.7815H8.62275V12.9232C8.62229 13.1483 8.68872 13.3685 8.8136 13.5558C8.93847 13.7431 9.11618 13.8891 9.32416 13.9753C9.53214 14.0614 9.76102 14.0839 9.98177 14.0397C10.2025 13.9956 10.4052 13.8869 10.5641 13.7274L13.3557 10.9292C13.5677 10.7149 13.6866 10.4257 13.6865 10.1243C13.6864 9.82295 13.5673 9.53379 13.3552 9.31973L10.5652 6.52365C10.4064 6.36402 10.2038 6.25516 9.98303 6.21088C9.76228 6.1666 9.53335 6.1889 9.32529 6.27495C9.11724 6.361 8.93944 6.50692 8.81446 6.69419C8.68947 6.88146 8.62294 7.10164 8.62331 7.32679V7.46854H4.6875V3.375ZM2.4375 8.60625C2.43741 8.6046 2.43765 8.60294 2.43821 8.60137C2.43877 8.59981 2.43963 8.59837 2.44075 8.59715C2.44187 8.59592 2.44323 8.59493 2.44474 8.59423C2.44625 8.59354 2.44788 8.59315 2.44954 8.59309H4.1196L4.125 8.59501L4.1304 8.59399H9.18525C9.33443 8.59399 9.47751 8.53473 9.583 8.42924C9.68849 8.32375 9.74775 8.18068 9.74775 8.03149L9.76755 7.31847L12.5587 10.1354L9.74775 12.9232V12.219C9.74775 12.0698 9.68849 11.9267 9.583 11.8212C9.47751 11.7157 9.33443 11.6565 9.18525 11.6565L2.4375 11.6438V8.60625Z"
          fill="#26D637"
        />
      </g>
      <defs>
        <clipPath id="clip0_1460_6941">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(0.75)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

const EditIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 19 18"
      fill="none"
    >
      <path
        d="M6 12.7605L9.30975 12.7493L16.5338 5.59428C16.8173 5.31078 16.9733 4.93428 16.9733 4.53378C16.9733 4.13328 16.8173 3.75678 16.5338 3.47328L15.3442 2.28378C14.7772 1.71678 13.788 1.71978 13.2255 2.28153L6 9.43803V12.7605ZM14.2838 3.34428L15.4755 4.53153L14.2778 5.71803L13.0883 4.52928L14.2838 3.34428ZM7.5 10.0635L12.0225 5.58378L13.212 6.77328L8.69025 11.2515L7.5 11.2553V10.0635Z"
        fill="#4D5FFF"
      />
      <path
        d="M4.5 15.75H15C15.8273 15.75 16.5 15.0773 16.5 14.25V7.749L15 9.249V14.25H6.8685C6.849 14.25 6.82875 14.2575 6.80925 14.2575C6.7845 14.2575 6.75975 14.2507 6.73425 14.25H4.5V3.75H9.63525L11.1353 2.25H4.5C3.67275 2.25 3 2.92275 3 3.75V14.25C3 15.0773 3.67275 15.75 4.5 15.75Z"
        fill="#4D5FFF"
      />
    </svg>
  );
};

const DeleteIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="21"
      viewBox="0 0 24 24"
    >
      <g fill="none">
        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="red"
          d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07A1.01 1.01 0 0 1 4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z"
        />
      </g>
    </svg>
  );
};

interface Item {
  key: string;
  id: string;
  status: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CustomTable = (props: any) => {
  const columns = props.columnName;
  const data = props.columnData;
  const setData = props.columnSetData;
  const firstAction = props.firstAction;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const dataWithKeys = data?.map((item: any, index: number) => ({
    ...item,
    key: index.toString(),
  }));
  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const mergedColumns = columns?.map((col: any) => {
    if (!col.editable) {
      if (col.children && col.children.length > 0) {
        const subcols = col.children.map((childcol: any) => {
          if (childcol.editable) {
            return {
              ...childcol,
              onCell: (record: Item) => ({
                record,
                inputType: childcol.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: childcol.dataIndex,
                title: childcol.title,
                editing: isEditing(record),
              }),
            };
          } else {
            return childcol;
          }
        });

        // Return the updated col object with modified children
        return {
          ...col,
          children: subcols,
        };
      } else {
        return col;
      }
    } else {
      return {
        ...col,
        onCell: (record: Item) => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    }
  });

  // const mergedColumns = columns.map((col: any) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record: Item) => ({
  //       record,
  //       inputType: col.dataIndex === "age" ? "number" : "text",
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       editing: isEditing(record),
  //     }),
  //   };
  // });

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        console.log(item);
        put(`${props.apiPath}`, item)
          .then(() => {
            setEditingKey('');
          })
          .catch((err) => '');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const getActionCol = () => {
    return [
      {
        title: 'operation',
        dataIndex: 'operation',
        fixed: 'right',
        width: 200,
        render: (_: any, record: Item) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(record.id)}
                style={{ marginRight: 8 }}
              >
                Save
              </Typography.Link>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => setEditingKey('')}
              >
                <Typography.Link>Cancel</Typography.Link>
              </Popconfirm>
            </span>
          ) : (
            <>
              {record.status === 'unseen' && (
                <Space>
                  <Button
                    type="link"
                    onClick={() => firstAction(record.id, 'Accepted')}
                  >
                    <SubmitIcon />
                  </Button>
                  <Button type="link">
                    <Typography.Link
                      disabled={editingKey !== ''}
                      onClick={() => edit(record)}
                    >
                      <EditIcon />
                    </Typography.Link>
                  </Button>

                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => firstAction(record.id, 'Rejected')}
                  >
                    <Button type="link">
                      <DeleteIcon />
                    </Button>
                  </Popconfirm>
                </Space>
              )}
              {record.status === 'Accepted' && (
                <Popconfirm
                  title="Sure want to revert?"
                  onConfirm={() => firstAction(record.id, 'unseen')}
                >
                  <Button
                    // onClick={() => firstAction(record.id, "unseen")}
                    style={{
                      border: '1px solid #23456A',
                    }}
                  >
                    <Tooltip
                      title="Data will Revet Back To Add Data"
                      color="#da7031"
                      key="#da7031"
                    >
                      <RevertIcon />
                    </Tooltip>
                  </Button>
                </Popconfirm>
              )}
            </>
          );
        },
      },
    ];
  };

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={dataWithKeys}
        columns={[
          ...mergedColumns?.map((column: any) => ({
            ...column,
            showSorterTooltip: false,
          })),
          ...getActionCol(),
        ]}
        rowClassName="editable-row"
        pagination={false}
        bordered
        scroll={{ x: 'calc(700px + 90%)', y: '70vh' }}
        className="custom-table responsive-table"
      />
    </Form>
  );
};

export default CustomTable;
