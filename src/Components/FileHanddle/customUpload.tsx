import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Spin, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { apiBaseUrl, post } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { AxiosError } from 'axios';

const { Dragger } = Upload;

type EmissionType =
  | 'Mobile Combustion'
  | 'Process Combustion'
  | 'Fugitive Combustion'
  | 'Energy Consumption'
  | 'Stationary Combustion'
  | 'Company Data'
  | 'Water Consumption'
  | 'Effluents'
  | 'Waste Recycle'
  | 'Waste Disposal'
  | 'Cat1 Average'
  | 'Cat1 Supplier'
  | 'Custom Emissoin Factor';

interface CustomUploadProps {
  setExcelUploaded?: React.Dispatch<React.SetStateAction<boolean>>;
  setloading?: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
  emission_type: EmissionType;
  initializeForm?: (data: any) => void;
  setFileName?: any;
  peerBench?: any;
  cat13Lesse?: any;
}

const CustomUpload: React.FC<CustomUploadProps> = ({
  setExcelUploaded,
  setloading,
  loading,
  emission_type,
  initializeForm,
  setFileName,
  peerBench,
  cat13Lesse,
}) => {
  const { user } = useAuth();
  const beforeUpload = (file: RcFile): boolean | Promise<void> => {
    const isExcelOrCsv =
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'text/csv';

    if (!isExcelOrCsv) {
      message.error('Only Excel or CSV files can be uploaded.');
    }
    return isExcelOrCsv;
  };

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: peerBench // If action is 'peerBench'
      ? `${apiBaseUrl}/peerBenchmarking/upload_pb_file/`
      : cat13Lesse
        ? `${apiBaseUrl}/scope3_cat13/read_and_write_excel_for_scope3/?emission_type=${emission_type}&entity_Id=${user.entity_Id}`
        : `${apiBaseUrl}/Emissions/fetch-excel-data/?emission_type=${emission_type}&entity_Id=${user.entity_Id}`, // Else the default API
    beforeUpload: beforeUpload,
    showUploadList: false,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Spin spinning={loading} size="large">
      <Dragger
        {...props}
        onChange={(info: any) => {
          const { status, response } = info.file;

          if (status === 'done') {
            if (setloading !== undefined) setloading(true);
            initializeForm && initializeForm(response.response.data);

            setFileName(info?.file?.name);

            if (setExcelUploaded !== undefined) setExcelUploaded(true);
            if (setloading !== undefined) setloading(true);
            message.success(
              `File '${info?.file?.name}' uploaded successfully.`
            );
          } else if (status === 'error') {
            if (setloading !== undefined) setloading(false);
            if (setExcelUploaded !== undefined) setExcelUploaded(false);
            if (setloading !== undefined) setloading(false);
            message.error(`${info?.file?.name} not uploaded successfully.`);
            initializeForm && initializeForm(status);
          }
        }}
        style={{ width: '50%', margin: '0 auto' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: '#00338D' }} />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
    </Spin>
  );
};

export default CustomUpload;
