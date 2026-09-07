import React from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

export default function CustomDownload({ type }: { type: string }) {
  const handleClick = () => {
    try {
      const link = document.createElement('a');
      link.href = `${window.location.origin}/${type}.xlsx`;
      link.download = `${type}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      message.error(`Something Went Wrong !`);
    }
  };

  return (
    <div>
      <Button
        className="primary-act-btn d-flex mb-4"
        style={{ margin: '0 auto' }}
        onClick={handleClick}
      >
        <DownloadOutlined />
        Download Excel
      </Button>
    </div>
  );
}

//Excel _Template_Stationery_Combustion_V0.1.xlsx
