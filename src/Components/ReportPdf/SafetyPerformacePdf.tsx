import React, { useState } from 'react';
import pdfIcon from '../../assets/image/carbon-footprint-btn.png';
import { Button, Flex } from 'antd';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { useAuth } from '../../Hooks/useAuth';
const pdfFonts = require('pdfmake/build/vfs_fonts');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const SafetyPerformancePdf = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchPdf = (pdfData: any) => {
    const chartDataRow = [
      {
        text:
          pdfData.fatalities.chartData.find(
            (data: any) => data.name === 'Group A'
          )?.value || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.chartData.find(
            (data: any) => data.name === 'Group B'
          )?.value || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.chartData.find(
            (data: any) => data.name === 'Group C'
          )?.value || '',
        alignment: 'center',
        style: 'content',
      },
    ];

    const chartDataRowTwo = [
      {
        text:
          pdfData.fatalities.cardDataTwo.find(
            (data: any) => data.title === 'High Consequence'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.cardDataTwo.find(
            (data: any) => data.title === 'Recordable'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.cardDataTwo.find(
            (data: any) => data.title === 'Lost Time'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
      {
        text:
          pdfData.fatalities.cardDataTwo.find(
            (data: any) => data.title === 'Lost Working days'
          )?.content || '',
        alignment: 'center',
        style: 'content',
      },
    ];

    const content = [
      { text: 'Safety Performance Report', style: 'titleOne' },
      { text: pdfData.fatalities.title, style: 'title' },
      {
        table: {
          headerRows: 2,
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Employee', style: 'subheader', alignment: 'center' },
              { text: 'Contractor', style: 'subheader', alignment: 'center' },
              {
                text: 'List-specific',
                style: 'subheader',
                alignment: 'center',
              },
            ],
            chartDataRow,
          ],
        },
      },
      {
        text: ' ',
        style: 'title',
      },
      {
        table: {
          headerRows: 2,
          widths: ['*', '*', '*', '*'],
          body: [
            [
              {
                text: 'High Consequence',
                style: 'subheader',
                alignment: 'center',
              },
              { text: 'Recordable', style: 'subheader', alignment: 'center' },
              { text: 'Lost Time', style: 'subheader', alignment: 'center' },
              {
                text: 'Lost Working days',
                style: 'subheader',
                alignment: 'center',
              },
            ],
            chartDataRowTwo,
          ],
        },
      },
    ];

    var docDefinition: TDocumentDefinitions = {
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

    pdfMake.createPdf(docDefinition).download('Safety_Performance_Report.pdf');
  };

  // Dummy data for testing
  const dummyData = {
    fatalities: {
      title: 'Fatalities',
      chartData: [
        { name: 'Group A', value: '15%' },
        { name: 'Group B', value: '20%' },
        { name: 'Group C', value: '65%' },
      ],
      cardDataTwo: [
        { title: 'High Consequence', content: '1' },
        { title: 'Recordable', content: '2' },
        { title: 'Lost Time', content: '1' },
        { title: 'Lost Working days', content: '1' },
      ],
    },
  };

  return (
    <Flex>
      <p style={{ fontWeight: 500, fontSize: '14px' }}>
        Safety Performance Report
      </p>
      <Button
        loading={isLoading}
        onClick={() => fetchPdf(dummyData)}
        style={{ border: 'none', marginTop: '-10px' }}
        icon={<img src={pdfIcon} alt="" />}
      />
    </Flex>
  );
};

export default SafetyPerformancePdf;
