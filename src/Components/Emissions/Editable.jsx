import React, { useState } from "react";
import { Table, Input, Button, Form, Upload, message, Row, Col } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const EditableCell = ({
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  handleSave,
  expandedRowKeys,
  setExpandedRowKeys,
  ...restProps
}) => {
  const [fileList, setFileList] = useState([]);
  const [comment, setComment] = useState("");
  const [cellValue, setCellValue] = useState(record[dataIndex]);
  const [editing, setEditing] = useState(false);

  const toggleExpand = () => {
    setExpandedRowKeys(
      expandedRowKeys.includes(record.key)
        ? expandedRowKeys.filter((key) => key !== record.key)
        : [...expandedRowKeys, record.key]
    );
    setEditing(false); // Close editing when expanding/collapsing
  };

  const handleFileChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Limit to one file
    setFileList(fileList);
  };

  const handleEditSave = () => {
    // Handle file upload logic here
    message.success("Commented successfully.");
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    handleSave({ ...record, [dataIndex]: cellValue });
  };

  return (
    <td {...restProps}>
      {editing ? ( // Render the Input component only if editing
        <Form.Item style={{ margin: 0 }}>
          <Input
            value={cellValue}
            onChange={(e) => {
              setCellValue(e.target.value);
            }}
          />
        </Form.Item>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {children}
          <Button type="link" icon={<MoreOutlined />} onClick={toggleExpand} />
        </div>
      )}
      {expandedRowKeys.includes(record.key) && (
        <div style={{ marginTop: 8 }}>
          <Row>
            <Col span={4}>
              <Upload
              
                fileList={fileList}
                beforeUpload={(file) => {
                  const maxSize = 2.5 * 1024 * 1024;
                  if (file.size > maxSize) {
                    message.warning('File size must be less than 2.5MB.');
                    return false;
                  }
                  return true;
                }}
                onChange={handleFileChange}
                
              >
                Upload Image
              </Upload>
              <Button onClick={handleEdit}>Edit</Button>
              {/* //<div>Delete</div> */}
            </Col>
            <Col span={8}>
              <label>Comments</label>
              <TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </Col>
            <Col>
              <Button onClick={handleEditSave}>Save</Button>
            </Col>
          </Row>
        </div>
      )}
    </td>
  );
};

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    editable: true,
  },
  {
    title: "Age",
    dataIndex: "age",
    editable: true,
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    comment: "This is a comment for John Brown.",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    comment: "This is a comment for Jim Green.",
  },
];

const EditableTable = () => {
  const [form] = Form.useForm();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Manage expanded row keys
const [editingKey,setEditingKey] = useState(null)

  const isEditing = (record) => record.key === editingKey; // Define isEditing here

  const edit = (record) => {
    form.setFieldsValue({
      name: record.name,
      age: record.age,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => record.key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
      } else {
        newData.push(row);
      }

      setEditingKey("");
    } catch (errInfo) {
    }
  };

  const handleSave = (record) => {
    save(record);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        handleSave: handleSave,
        expandedRowKeys: expandedRowKeys,
        setExpandedRowKeys: setExpandedRowKeys,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;
