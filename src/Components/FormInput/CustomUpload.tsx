import React from 'react';
import { Form, Upload, Button, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Styles from './FromItems.module.scss';
const { Text } = Typography;
const CustomUpload = (props: any) => {
  return (
    <>
      <Form.Item
        label={<label className={Styles.formLabel}>{props.label}</label>}
        style={{ fontWeight: 600 }}
        rules={[
          {
            required: true,
            message: 'Required',
          },
        ]}
      >
        <Upload
          {...props.file}
          accept=".pdf"
          maxCount={props.count}
          fileList={props.fileList}
        >
          <Button
            icon={<UploadOutlined />}
            type="primary"
            ghost
            block
            shape="round"
            className="form-control"
            disabled={
              props.fileList && props.fileList.length === 0 ? false : true
            }
          >
            Upload File
          </Button>
        </Upload>
        {props.errors && props.touched && (
          <Text type="danger" style={{ textAlign: 'left' }}>
            {props.errors}
          </Text>
        )}
      </Form.Item>
    </>
  );
};

export default CustomUpload;
