import React from 'react';
import { Table, Image } from 'antd';
import type { TableProps } from 'antd';
import CheckSvg from '../../../assets/Svg/checkSvg.png';
import CrossSvg from '../../../assets/Svg/crossSvg.png';
import Styles from '../socialdashboard.module.scss';

interface DataType {
  key: string;
  name: any;
  money: any;
  address: any;
  partTime: any;
}

const Paragraph = ({ children }: { children: React.ReactNode }) => {
  return <p className={Styles.paragraphSty}>{children}</p>;
};
const Paragraph2 = ({ children }: { children: React.ReactNode }) => {
  return <p className={Styles.paragraphSty1}>{children}</p>;
};
const ImageIcon = ({ src }: { src: string }) => {
  return (
    <Image
      loading="lazy"
      src={src}
      preview={false}
      style={{
        width: '18px',
        height: '18px',
      }}
    />
  );
};

const columns: TableProps<DataType>['columns'] = [
  {
    title: <Paragraph>Category</Paragraph>,
    dataIndex: 'name',
  },
  {
    title: <Paragraph>Full-Time</Paragraph>,
    dataIndex: 'money',
    align: 'center',
  },
  {
    title: <Paragraph>Temporary</Paragraph>,
    dataIndex: 'address',
    align: 'center',
  },
  {
    title: <Paragraph>Part-Time</Paragraph>,
    dataIndex: 'partTime',
    align: 'center',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: <Paragraph2> Life Insurance</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CrossSvg} />,
    partTime: <ImageIcon src={CrossSvg} />,
  },
  {
    key: '2',
    name: <Paragraph2>Health Care</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CheckSvg} />,
    partTime: <ImageIcon src={CheckSvg} />,
  },
  {
    key: '3',
    name: <Paragraph2> Disability and Invalidity Coverage</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CrossSvg} />,
    partTime: <ImageIcon src={CrossSvg} />,
  },
  {
    key: '4',
    name: <Paragraph2> Parental Leave</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CrossSvg} />,
    partTime: <ImageIcon src={CrossSvg} />,
  },
  {
    key: '5',
    name: <Paragraph2>Retirement Provision</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CheckSvg} />,
    partTime: <ImageIcon src={CrossSvg} />,
  },
  {
    key: '6',
    name: <Paragraph2>Stock Ownership</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CrossSvg} />,
    partTime: <ImageIcon src={CrossSvg} />,
  },
  {
    key: '7',
    name: <Paragraph2>Others</Paragraph2>,
    money: <ImageIcon src={CheckSvg} />,
    address: <ImageIcon src={CheckSvg} />,
    partTime: <ImageIcon src={CrossSvg} />,
  },
];

const BenefitList = () => (
  <div
    className="table-benefit-div"
    style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}
  >
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      bordered
      title={() => <Paragraph>Benefits list by employment type</Paragraph>}
    />
  </div>
);

export default BenefitList;
