import React, { ReactNode } from 'react';
import { Row, Col, Card } from 'antd';
import './Footer.scss';

const Footer = () => {
  return (
    <>
      <div style={{ paddingTop: '4rem' }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: '16px',
            color: '#BBBBBB',
            background: '#fff',
            padding: '10px 10px',
          }}
        >
          © 2024 KPMGESG UI. All Rights Reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
