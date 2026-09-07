import React, { useEffect, useState } from 'react';
import pdfIcon from '../../assets/Svg/Emissionfactor.svg';
import { Button, Flex, Spin } from 'antd';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { get } from '../../Services';
import { message as notificationMessage } from 'antd';
import { useAuth } from '../../Hooks/useAuth';
import PdfMainPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import { isEmpty } from '../../Utils/isEmpty';
import {
  formatYearRange,
  getCurrentDate,
} from '../../Components/Emissions/Scope3/Helpers';
import { useSelector } from 'react-redux';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import DownloadPdf from '../../assets/Svg/DownloadPdf';
import Styles from '../Governance/governance.module.scss';

const pdfFonts = require('pdfmake/build/vfs_fonts');

const EffuentsPdf = (report: any) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [reportingYear, setReportingYear] = useState<any>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${month}-${year}`;
  }

  interface Effluent {
    'Effluents Discharged': number;
    Primary: string[];
    'Secondary ': string[];
    Tertiary: string[];
    'Date of Entry': string | null;
  }

  const getBase64Image = (data: Record<string, number>): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const radius = 80;

    canvas.width = width;
    canvas.height = height;

    const colors = [
      'rgba(99, 235, 218, 1)',
      'rgba(118, 210, 255, 1)',
      'rgba(180, 151, 255, 1)',
      'rgba(255, 163, 218, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 159, 64, 1)',
    ];
    const labels = Object.keys(data);
    const values = Object.values(data);
    const total = values.reduce((sum, value) => sum + value, 0);

    let startAngle = Math.PI; // Rotating left (180° from right)

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      // Draw pie slice
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.arc(
        width / 2,
        height / 2,
        radius,
        startAngle,
        startAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Reset start angle for text positioning
    startAngle = Math.PI;

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const midAngle = startAngle + sliceAngle / 2;

      // Adjust label positioning
      const textX = width / 2 + (radius / 1.6) * Math.cos(midAngle);
      const textY = height / 2 + (radius / 1.6) * Math.sin(midAngle);

      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${((value / total) * 100).toFixed(2)}%`, textX, textY);

      startAngle += sliceAngle;
    });

    return canvas.toDataURL('image/png');
  };

  const fetchPdf = async (pdfData: any, reportYear: any) => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const getBase64ImageFromUrl = async (url: any) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    const firstYear = reportYear?.match(/\b\d{4}\b/)[0];

    const HomeImage1 = await getBase64ImageFromUrl(PdfMainPageImge);
    const HomeLastImage = await getBase64ImageFromUrl(PdfLastPageImg);
    if (Object.keys(pdfData).length) {
      const financialYear = user.financial_year
        ? user.financial_year
        : ['2024-01-04T18:30:00Z', '2024-12-04T18:30:00Z'];
      const formattedFinancialYear = `${formatDate(financialYear[0])} - ${formatDate(financialYear[1])}`;

      const totalEffluentsDischarge = pdfData['Total Effluents Discharged'];
      const effluenntsData = pdfData['Effluents'];

      const generateEffluentPieChart = (effluentsData: any) => {
        const aggregatedData: Record<string, number> = {};

        effluentsData.forEach((record: any) => {
          const primaryValue = record.Primary.length; // Assuming Primary is an array
          const effluentDischarged = record['Effluents Discharged (in m³)'];

          aggregatedData[record.Primary] =
            (aggregatedData[record.Primary] || 0) + effluentDischarged;
        });

        // Generate Base64 pie chart
        const pieChartImage = getBase64Image(aggregatedData);

        // Return PDF-compatible object
        return {
          image: pieChartImage,
          width: 130,
          height: 130,
          margin: [50, 0, 0, 0],
        };
      };

      // Example Usage
      const pieChartImage = generateEffluentPieChart(pdfData['Effluents']);

      const transformData = (data: any) => {
        const safeData = data ?? []; // Ensure data is an array

        if (safeData?.length === 0) {
          return [
            [
              {
                text: 'No data available',
                colSpan: 5,
                style: 'tableCell',
                alignment: 'center',
              },
              {}, // Empty cells for the remaining columns
              {},
              {},
              {},
            ],
          ];
        }

        return safeData?.map((item: any, index: any) => [
          {
            text: (index + 1).toString(),
            style: 'tableCell',
            alignment: 'center',
          },
          {
            text: item['Effluents Discharged (in m³)']?.toFixed(2) || '0.00',
            style: 'tableCell',
            alignment: 'center',
          },
          {
            text: item['Primary']?.[0] || '-',
            style: 'tableCell',
            alignment: 'center',
          },
          {
            text: item['Secondary ']?.[0] || '-',
            style: 'tableCell',
            alignment: 'center',
          },
          {
            text: item['Tertiary']?.[0] || '-',
            style: 'tableCell',
            alignment: 'center',
          },
        ]);
      };

      const content: any[] = [
        {
          image: HomeImage1,
          width: 800,
          height: 1000,
          absolutePosition: { x: 0, y: 0 },
          fit: [844, 1100],
        },
        {
          absolutePosition: { x: 20, y: 350 },
          stack: [
            {
              svg: `<svg width="800" height="140">
                      <rect width="800" height="140" fill="#000000" fill-opacity="0.4"/>
                    </svg>`,
            },
            {
              absolutePosition: { x: 30, y: 370 },
              text: 'Effluents Report',
              fontSize: 39,
              bold: true,
              color: '#fff',
            },
            {
              absolutePosition: { x: 30, y: 430 },
              text: `Reporting Period FY ${formatYearRange(user.financial_year)} `,
              fontSize: 16,
              bold: true,
              color: '#fff',
            },
            {
              absolutePosition: { x: 30, y: 460 },
              text: `${getCurrentDate()}`,
              fontSize: 14,
              bold: true,
              color: '#fff',
            },
          ],
        },
        {
          text: 'Disclaimer',
          pageBreak: 'before', // Ensures this content starts on a new page
          style: 'title',
        },
        {
          text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Effluents Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
   
          The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
   
          The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
          style: 'disclaimer',
          alignment: 'justify',
        },
        {
          text: 'Effluents Report',
          style: 'title',
          pageBreak: 'before',
        },
        // {
        //   ...pieChartImage,
        // },
        {
          text: `Reporting Period: FY ${firstYear} (${reportYear})`,
          style: 'titleReport',
        },
        {
          text: `Total Effluents Discharged: ${totalEffluentsDischarge || 0}m³`,
          style: 'subtitle',
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 2,
            widths: [50, 250, 141, 141, 141, 141],
            body: [
              [
                {
                  text: 'S.No.',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                },
                {
                  text: 'Effluents Discharged \n(in m³)',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                },
                {
                  text: 'Treatment Method',
                  colSpan: 3,
                  alignment: 'center',
                  style: 'tableHeader',
                },
                {},
                {},
              ],
              [
                { text: ' ', style: 'tableHeader', alignment: 'center' },
                { text: ' ', style: 'tableHeader', alignment: 'center' },
                { text: 'Primary', style: 'tableHeader2', alignment: 'center' },
                {
                  text: 'Secondary',
                  style: 'tableHeader2',
                  alignment: 'center',
                },
                {
                  text: 'Tertiary',
                  style: 'tableHeader2',
                  alignment: 'center',
                },
                { text: ' ', style: 'tableHeader', alignment: 'center' },
              ],
              // Data rows
              ...transformData(effluenntsData),
            ],
          },
          layout: {
            hLineColor: '#E6E6E6',
            vLineColor: '#E6E6E6',
            paddingLeft: function (i: any, node: any) {
              return 4;
            },
            paddingRight: function (i: any, node: any) {
              return 4;
            },
            paddingTop: function (i: any, node: any) {
              return 2;
            },
            paddingBottom: function (i: any, node: any) {
              return 2;
            },
          },
        },
      ];

      const effluents = pdfData[0]?.Effluents || [];
      effluents.forEach((effluent: Effluent, index: number) => {
        content[3]?.table?.body?.push([
          { text: `${index + 1}`, alignment: 'center' },
          {
            text: effluent['Effluents Discharged'].toString(),
            alignment: 'center',
          },
          { text: effluent.Primary.join(', '), alignment: 'center' },
          { text: effluent['Secondary '].join(', '), alignment: 'center' },
          { text: effluent.Tertiary.join(', '), alignment: 'center' },
        ]);
      });

      const docDefinition: any = {
        content: content,
        pageOrientation: 'landscape',
        pageMargins: [15, 39, 0, 86],
        footer: function (currentPage: any, pageCount: any) {
          if (currentPage > 1) {
            return {
              stack: [
                // Top line divider
                {
                  text: '',
                  margin: [10, 20],
                },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0,
                      y1: 0,
                      x2: 900, // Adjust width based on page size
                      y2: 0,
                      lineWidth: 1,
                      lineColor: '#E6E6E6',
                    },
                  ],
                  margin: [0, 10, 0, 10],
                },
                // Footer content with adjusted column widths
                {
                  columns: [
                    {
                      text: `Smart Sustain.AI FY ${formatYearRange(user.financial_year)}`,
                      alignment: 'left',
                      style: 'footerText',
                      fontSize: 8,
                      margin: [20, 0, 0, 0], // Adjust left margin
                      width: 150, // Narrow column
                    },
                    // Center column (wider)
                    {
                      text: `© ${formatYearRange(user.financial_year)} Smart Sustain.AI Services Pte. Ltd. (Registration No: 200003956G), a Singapore incorporated company and a member firm of the Smart Sustain.AI global organisation of independent member firms affiliated with Smart Sustain.AI International Limited, a private English company limited by guarantee. All rights reserved.`,
                      alignment: 'center',
                      style: 'footerSmallText',
                      margin: [0, 0, 0, 0],
                      fontSize: 8,
                      width: 600, // Wider column
                    },
                    // Right column (narrow)
                    {
                      text: `${currentPage}`,
                      alignment: 'right',
                      style: 'footerText',
                      fontSize: 8,
                      margin: [0, 0, 0, 0], // Adjust right margin
                      width: 60, // Narrow column
                    },
                  ],
                  margin: [0, 0, 0, 10], // Adjust top and bottom margins for spacing
                },
              ],
              margin: [0, -20, 0, 20],
            };
          }
        },
        styles: {
          disclaimer: {
            fontSize: 12,
            bold: false,
            color: '#060606',
            margin: [20, 0, 35, 15],
          },
          title: {
            alignment: 'left',
            fontSize: 18,
            bold: true,
            color: '#0D304A',
            margin: [20, 15, 0, 15],
          },
          titleReport: {
            fontSize: 13,
            bold: true,
            color: '#060606',
            margin: [20, 5, 0, 15],
          },
          subtitle: {
            fontSize: 12,
            bold: false,
            color: '#060606',
            margin: [20, 5, 0, 15],
          },
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: '#fff',
            fillColor: '#0D304A',
            fontFamily: 'Arial',
            alignment: 'center',
            margin: [0, 7, 0, 7],
          },
          tableHeader2: {
            bold: true,
            fontSize: 11,
            color: '#fff',
            fillColor: '#416680',
            fontFamily: 'Arial',
            alignment: 'center',
            margin: [0, 7, 0, 7],
          },
          header: {
            fontSize: 14,
            bold: true,
            color: '#060606',
            margin: [20, 5, 0, 15],
          },
          tableExample: {
            margin: [20, 5, 0, 15],
          },
          tableCell: {
            fontSize: 10,
            color: '#060606',
            alignment: 'center',
            margin: [0, 7, 0, 7],
          },
          footer2: {
            fontSize: 10,
            color: '#060606',
            margin: [0, 6, 0, 10],
          },
        },
      };

      pdfMake.createPdf(docDefinition).download('Effluents Report.pdf');
    }
  };

  function fetchApiData() {
    setIsLoading(true);

    get(
      `/effluents/download_effluents_data/?entity_Id=${user.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
    )
      .then((res: any) => {
        if (res.status === 'Success') {
          if (res?.response?.status === true) {
            setReportingYear(res?.response);
            fetchPdf(
              res?.response?.data[0],
              res?.response?.['Reporting Period FY']
            );
          } else {
            fetchPdf(
              [
                {
                  'Total Effluents Discharged (in m³)': 0,
                  'Effluents Data': [],
                },
              ],
              res?.response?.['Reporting Period FY']
            );
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isEmpty(report) ? (
        <div className="d-flex align-items-center mx-2">
          <Button
            loading={isLoading}
            className={Styles.pdfButton}
            onClick={() => fetchApiData()}
            icon={<DownloadPdf />}
          ></Button>
        </div>
      ) : (
        <Button
          loading={isLoading}
          className="mx-1"
          onClick={() => fetchApiData()}
          style={{
            cursor: 'pointer',
            border: 'none',
            background: 'none',
          }}
          icon={<DownloadIcon />}
        ></Button>
      )}
    </>
  );
};

export default EffuentsPdf;
