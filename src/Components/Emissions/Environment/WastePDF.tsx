import React, { useEffect, useState } from 'react';
import pdfIcon from '../../../assets/Svg/Emissionfactor.svg';
import { Button, Flex, Spin } from 'antd';
import { message as notificationMessage } from 'antd';
import { useAuth } from '../../../Hooks/useAuth';
import { get } from '../../../Services';
import pdfMake from 'pdfmake/build/pdfmake';
import {
  capitalizeEachWord,
  formatYearRange,
  getCurrentDate,
} from '../Scope3/Helpers';
import PdfMainPageImge from '../../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../../assets/finalpage.png';
import PdfFormat from '../../../assets/Svg/Dashboard/PdfFormat';
import { isEmpty } from '../../../Utils/isEmpty';
import { formatNumberUS } from '../../../Utils/Strings';
import { clearConfigCache } from 'prettier';
import { useSelector } from 'react-redux';
import DownloadIcon from '../../../assets/Svg/DownloadIcon';
import styles from './Enviroment.module.scss';
import DownloadPdf from '../../../assets/Svg/DownloadPdf';

const pdfFonts = require('pdfmake/build/vfs_fonts');

const samplePdfData = [
  {
    'Total Waste Generated': 0,
  },
  {
    'Total Waste Recycled': 0,
    'Waste Recycled': [],
  },
  {
    'Total Waste Disposed': 0,
    'Waste Disposed': [],
  },
];

interface wastePdfProps {
  activeTab: string;
  report?: boolean;
}

export const WastePDF = ({ activeTab, report }: wastePdfProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [reportingYear, setReportingYear] = useState<any>([]);
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  function formatDate(dateStr: any) {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(2, 2);
    return `${month}-${year}`;
  }

  const getBase64Image = (data: {
    recycle: number;
    disposed: number;
  }): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const radius = 80; // Full pie chart (no cutout)

    canvas.width = width;
    canvas.height = height;

    const colors = ['rgba(180, 151, 255, 1)', 'rgba(99, 235, 218, 1)']; // Male - Blue, Female - Pink
    const labels = ['Recycle', 'Disposed'];
    const values = [data.recycle, data.disposed]; // Ensure Male is first
    const total = values.reduce((sum, value) => sum + value, 0);

    let startAngle = Math.PI; // Start from left side (180° rotation)

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
      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Reset start angle for text positioning
    startAngle = Math.PI;

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const midAngle = startAngle + sliceAngle / 2;

      // Adjust label positioning slightly inward
      const textX = width / 2 + (radius / 2) * Math.cos(midAngle);
      const textY = height / 2 + (radius / 2) * Math.sin(midAngle);

      ctx.fillStyle = '#fff'; // White text for better contrast
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${labels[i]}: ${((value / total) * 100).toFixed(1)}%`,
        textX,
        textY
      );

      startAngle += sliceAngle;
    });

    return canvas.toDataURL('image/png');
  };

  const getBase64ImageTwo = (data: {
    hazardous: number;
    Nonhazardous: number;
  }): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const radius = 80; // Full pie chart (no cutout)

    canvas.width = width;
    canvas.height = height;

    const colors = ['rgba(118, 210, 255, 1)', 'rgba(99, 235, 218, 1)']; // Male - Blue, Female - Pink
    const labels = ['Hazardous', 'Non-Hazardous'];
    const values = [data.hazardous, data.Nonhazardous]; // Ensure Male is first
    const total = values.reduce((sum, value) => sum + value, 0);

    let startAngle = Math.PI; // Start from left side (180° rotation)

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
      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Reset start angle for text positioning
    startAngle = Math.PI;

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const midAngle = startAngle + sliceAngle / 2;

      // Adjust label positioning slightly inward
      const textX = width / 2 + (radius / 2) * Math.cos(midAngle);
      const textY = height / 2 + (radius / 2) * Math.sin(midAngle);

      ctx.fillStyle = '#fff'; // White text for better contrast
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${labels[i]}: ${((value / total) * 100).toFixed(1)}%`,
        textX,
        textY
      );

      startAngle += sliceAngle;
    });

    return canvas.toDataURL('image/png');
  };

  const fetchPdf = async (pdfData: any, reportYear: any) => {
    const financialYear = user.financial_year
      ? user.financial_year
      : ['2024-01-04T18:30:00Z', '2024-12-04T18:30:00Z'];
    const formattedFinancialYear = `${formatDate(financialYear[0])} - ${formatDate(financialYear[1])}`;

    const totalWasteConsumption = formatNumberUS(
      pdfData[0]['Total Waste Generated']
    );
    const waterRecycled = pdfData[1];
    const waterDisposed = pdfData[2];
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

    const watRecycle =
      waterRecycled?.['Waste Recycled']?.[0]?.['Waste Recycled in tonnes'] || 0;
    const watDisposed =
      waterDisposed?.['Waste Disposed']?.[0]?.['Waste Disposed in tonnes'] || 0;

    const pieChartImage = getBase64Image({
      recycle: watRecycle,
      disposed: watDisposed,
    });

    const pieChartImageTwo = getBase64ImageTwo({
      hazardous: watRecycle,
      Nonhazardous: watDisposed,
    });

    const firstYear = reportYear.match(/\b\d{4}\b/)[0];

    const HomeImage1 = await getBase64ImageFromUrl(PdfMainPageImge);
    const HomeLastImage = await getBase64ImageFromUrl(PdfLastPageImg);
    const docDefinition: any = {
      content: [
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
              text: 'Waste Management Report',
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
          style: 'headerTitle',
        },
        {
          text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Waste Management Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.

          The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
   
          The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
          style: 'disclaimer',
          alignment: 'justify',
        },
        {
          text: 'Waste Management Report',
          style: 'headerTitle',
          pageBreak: 'before',
        },
        {
          text: `Reporting Period: FY ${firstYear} (${reportYear})`,
          style: 'titleReport',
        },
        // {
        //   columns: [
        //     {
        //       image: pieChartImageTwo, // Embed pie chart
        //       width: 130,
        //       height: 130,
        //       margin: [50, 0, 0, 0],
        //     },
        //     {
        //       image: pieChartImage, // Embed pie chart
        //       width: 130,
        //       height: 130,
        //       margin: [100, 0, 0, 0],
        //     },
        //   ]
        // },
        {
          text: `Total Waste Generated: ${totalWasteConsumption} tonnes`,
          style: 'subtitle',
        },
        {
          text: `Waste Recycled`,
          style: 'header',
        },
        {
          text: `Total Waste Recycled: ${formatNumberUS(waterRecycled['Total Waste Recycled'])} tonnes`,
          style: 'subtitle',
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [50, 255, 140, 140, 140],
            body: [
              [
                { text: 'S.No.', style: 'tableHeader' },
                { text: 'Recycling Process', style: 'tableHeader' },
                { text: 'Waste Category', style: 'tableHeader' },
                { text: 'Waste Type', style: 'tableHeader' },
                { text: 'Waste Recycled in tonnes', style: 'tableHeader' },
              ],
              ...(waterRecycled['Waste Recycled'].length > 0
                ? waterRecycled['Waste Recycled'].map((item: any, ind: any) => [
                    { text: ind + 1, style: 'tableContent' },
                    {
                      text: capitalizeEachWord(item['Recycling Process']),
                      style: 'tableContent',
                    },
                    {
                      text: capitalizeEachWord(item['Waste Category']),
                      style: 'tableContent',
                    },
                    {
                      text: capitalizeEachWord(item['Waste Type']),
                      style: 'tableContent',
                    },
                    {
                      text: item['Waste Recycled in tonnes'],
                      style: 'tableContent',
                    },
                  ])
                : [
                    [
                      { text: '', style: 'tableContent' },
                      {
                        text: 'No data available',
                        colSpan: 4,
                        style: 'tableContent',
                        alignment: 'center',
                      },
                      {},
                      {},
                      {},
                    ],
                  ]),
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

        {
          text: `Waste Disposed`,
          style: 'header',
        },
        {
          text: `Total Waste Disposed: ${formatNumberUS(waterDisposed['Total Waste Disposed'])} tonnes`,
          style: 'subtitle',
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [50, 255, 140, 140, 140],
            body: [
              [
                { text: 'S.No.', style: 'tableHeader' },
                { text: 'Disposal Method', style: 'tableHeader' },
                { text: 'Waste Category', style: 'tableHeader' },
                { text: 'Waste Type', style: 'tableHeader' },
                { text: 'Waste Disposed in tonnes', style: 'tableHeader' },
              ],
              ...(waterDisposed['Waste Disposed'].length > 0
                ? waterDisposed['Waste Disposed'].map((item: any, ind: any) => [
                    { text: ind + 1, style: 'tableContent' },
                    { text: item['Disposal Method '], style: 'tableContent' },
                    { text: item['Waste Category'], style: 'tableContent' },
                    { text: item['Waste Type'], style: 'tableContent' },
                    {
                      text: item['Waste Disposed in tonnes'],
                      style: 'tableContent',
                    },
                  ])
                : [
                    [
                      { text: '', style: 'tableContent' },
                      {
                        text: 'No data available',
                        colSpan: 4,
                        style: 'tableContent',
                        alignment: 'center',
                      },
                      {},
                      {},
                      {},
                    ],
                  ]),
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
      ],
      styles: {
        disclaimer: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [20, 0, 35, 15],
        },
        headerTitle: {
          alignment: 'left',
          fontSize: 18,
          bold: true,
          color: '#0D304A',
          margin: [20, 15, 0, 15],
        },
        tableExample: {
          margin: [20, 5, 0, 15],
        },
        subtitle: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [20, 5, 0, 15],
        },
        titleReport: {
          fontSize: 13,
          bold: true,
          color: '#060606',
          margin: [20, 5, 0, 15],
        },
        header: {
          fontSize: 14,
          bold: true,
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
        tableContent: {
          fontSize: 10,
          color: '#060606',
          // fontFamily: 'Arial',
          alignment: 'center',
          margin: [0, 7, 0, 7],
        },
        footer2: {
          fontSize: 10,
          color: '#060606',
          margin: [0, 6, 0, 10],
        },
      },
      pageOrientation: 'landscape',
      pageMargins: [15, 40, 0, 86],
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
    };

    pdfMake.createPdf(docDefinition).download('Waste Management Report.pdf');
  };
  function fetchApiData() {
    setIsLoading(true);
    get(
      `/waste/download_waste_data/?entity_Id=${user.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
    )
      .then((res: any) => {
        if (res.status === 'Success') {
          if (res?.response?.status === true) {
            setReportingYear(res?.response);
            fetchPdf(
              res?.response?.data,
              res?.response?.['Reporting Period FY']
            );
          } else {
            fetchPdf(samplePdfData, res?.response?.['Reporting Period FY']);
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
        notificationMessage.error(err.message);
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
            onClick={() => fetchApiData()}
            className={styles.pdfButton}
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
