import React, { useState } from 'react';
import pdfIcon from '../../assets/image/carbon-footprint-btn.png';
import { Button, Select, Flex, Modal } from 'antd';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { useAuth } from '../../Hooks/useAuth';
const pdfFonts = require('pdfmake/build/vfs_fonts');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { Option } = Select;

const BoardAndCompositionPdf = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState('current');

  const handleOk = () => {
    setIsModalVisible(false);
    setIsLoading(true);
    fetchPdf(dummyData);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchPdf = (pdfData: any) => {
    const chartDataRow = [
      {
        text:
          pdfData.fatalities.chartData.find(
            (data: any) => data.name === 'Independent'
          )?.value || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.chartData.find(
            (data: any) => data.name === 'others'
          )?.value || '',
        alignment: 'center',
        style: 'content',
      },
    ];

    const chartDataRowTwo = [
      {
        text:
          pdfData.fatalities.cardDataTwo.find(
            (data: any) => data.title === 'Male'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.cardDataTwo.find(
            (data: any) => data.title === 'Female'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
    ];

    const chartDataRowThree = [
      {
        text:
          pdfData.fatalities.cardDataThree.find(
            (data: any) => data.title === ' < 30'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.cardDataThree.find(
            (data: any) => data.title === ' 30 - 50 '
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.cardDataThree.find(
            (data: any) => data.title === '> 50'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
    ];

    const content = [
      {
        text: `Board And Composition Report - ${selectedYear === 'current' ? 'Current Year' : 'Previous Year'}`,
        style: 'titleOne',
      },
      { text: `${pdfData.fatalities.title} `, style: 'title' },
      {
        table: {
          headerRows: 2,
          widths: ['*', '*'],
          body: [
            [
              { text: 'Independent', style: 'subheader', alignment: 'center' },
              { text: 'others', style: 'subheader', alignment: 'center' },
            ],
            chartDataRow,
          ],
        },
      },
      {
        text: 'By Gender',
        style: 'title',
      },
      {
        table: {
          headerRows: 2,
          widths: ['*', '*'],
          body: [
            [
              { text: 'Male', style: 'subheader', alignment: 'center' },
              { text: 'Female', style: 'subheader', alignment: 'center' },
            ],
            chartDataRowTwo,
          ],
        },
      },
      {
        text: 'By Age Group',
        style: 'title',
      },
      {
        table: {
          headerRows: 2,
          widths: ['*', '*', '*'],
          body: [
            [
              { text: ' < 30', style: 'subheader', alignment: 'center' },
              { text: ' 30 - 50 ', style: 'subheader', alignment: 'center' },
              { text: '> 50', style: 'subheader', alignment: 'center' },
            ],
            chartDataRowThree,
          ],
        },
      },
    ];

    const docDefinition: TDocumentDefinitions = {
      content: content,
      styles: {
        titleOne: {
          alignment: 'center',
          bold: true,
          color: '#00737B',
        },
        header: {
          fillColor: '#00737B',
          color: '#fff',
          bold: true,
          margin: [0, 10],
        },
        subheader: {
          fillColor: '#00737B',
          color: '#fff',
          bold: true,
          margin: [0, 10],
        },
        content: {
          margin: [0, 10],
        },
        footer: {
          margin: [0, 10],
          alignment: 'center',
        },
        title: {
          fontSize: 13,
          bold: true,
          color: '#00737B',
          margin: [0, 20],
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download('Board_and_Composition_report.pdf');
    setIsLoading(false);
  };

  const dummyData = {
    fatalities: {
      title: 'Board Independence',
      chartData: [
        { name: 'Independent', value: '15%' },
        { name: 'others', value: '20%' },
      ],
      cardDataTwo: [
        { title: 'Male', content: '42%' },
        { title: 'Female', content: '58%' },
      ],
      cardDataThree: [
        { title: ' < 30', content: '33%' },
        { title: ' 30 - 50 ', content: '23%' },
        { title: '> 50', content: '44%' },
      ],
    },
  };

  return (
    <Flex align="center">
      <Button
        loading={isLoading}
        onClick={() => setIsModalVisible(true)}
        style={{ border: 'none', marginTop: '-10px' }}
        icon={<img src={pdfIcon} alt="" />}
      >
        Board and Composition report
      </Button>
      <Modal
        title="Select Year"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Download"
        cancelText="Cancel"
      >
        <Select
          defaultValue="current"
          style={{ width: 200 }}
          onChange={(value) => setSelectedYear(value)}
        >
          <Option value="current">Current Year</Option>
          <Option value="previous">Previous Year</Option>
        </Select>
      </Modal>
    </Flex>
  );
};

export default BoardAndCompositionPdf;
