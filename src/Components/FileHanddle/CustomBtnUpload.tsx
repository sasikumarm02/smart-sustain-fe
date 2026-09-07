import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { useAuth } from '../../Hooks/useAuth';

const { user } = useAuth();

const props: UploadProps = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const btn = {
  border: '1px solid #009BD2',
  padding: '19.5px 40px 19.5px 40px',
  borderRadius: '6px',
  justify: 'space-between',
  display: 'flex',
  alignItems: 'center',
  color: '#009BD2',
};

const BtnUpload: React.FC = () => (
  <Upload {...props}>
    <Button style={btn}>
      {' '}
      Upload <UploadOutlined />{' '}
    </Button>
  </Upload>
);

export default BtnUpload;
