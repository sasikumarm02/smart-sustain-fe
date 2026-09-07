import { useEffect, useState } from 'react';
import PdfMainPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import { get } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import pdfMake from 'pdfmake/build/pdfmake';
import { useAuth } from '../../Hooks/useAuth';
import { Button, message, Spin } from 'antd';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import {
  formatYearRange,
  getCurrentDate,
} from '../../Components/Emissions/Scope3/Helpers';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import DownloadPdf from '../../assets/Svg/DownloadPdf';
import styles from './governance.module.scss';

const pdfFonts = require('pdfmake/build/vfs_fonts');

function BoardPdf(report: any) {
  const { user } = useAuth();
  const [pdfData, setPdfData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const fetchCompositionData = async () => {
    setIsLoading(true);
    try {
      const resData = await get(
        `/board_and_management/download_board_and_management_data/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(resData?.response) && resData?.response) {
        setPdfData(resData.response);
        if (resData?.response?.data) {
          setPdfData(resData.response);
        }
      }
    } catch (error) {
      setPdfData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompositionData();
  }, []);

  const getBase64Image = (data: { female: number; male: number }): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const radius = 80;

    canvas.width = width;
    canvas.height = height;

    const colors = ['rgba(30, 73, 226, 1)', '#FD349C']; // Male - Blue, Female - Pink
    const labels = ['Male', 'Female'];
    const values = [data.male, data.female]; // Ensure Male is first
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
      ctx.fillStyle = colors[i];
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
      ctx.font = '14px Arial';
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

  const fetchPdf = async () => {
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

    const HomeImage1 = await getBase64ImageFromUrl(PdfMainPageImge);
    const HomeLastImage = await getBase64ImageFromUrl(PdfLastPageImg);

    const femaleDirectors =
      pdfData?.data?.[0]?.['Board Composition']?.[0]?.[
        'Number of Female Directors'
      ] || 0;
    const maleDirectors =
      pdfData?.data?.[0]?.['Board Composition']?.[0]?.[
        'Number of Male Directors '
      ] || 0;
    const pieChartImage = getBase64Image({
      female: femaleDirectors,
      male: maleDirectors,
    });

    const femaleExecutives =
      pdfData?.data?.[1]?.['Management Team']?.[0]?.[
        'Number of Female Executives'
      ] || 0;
    const maleExecutives =
      pdfData?.data?.[1]?.['Management Team']?.[0]?.[
        'Number of Male Executives '
      ] || 0;
    const pieChartImageTwo = getBase64Image({
      female: femaleExecutives,
      male: maleExecutives,
    });

    const finance_year = pdfData?.['Reporting Period FY'];
    const boardPdfData =
      Array.isArray(pdfData?.data) && pdfData.data[0]?.['Board Composition']
        ? pdfData.data[0]['Board Composition']
        : [];
    const managePdfData =
      Array.isArray(pdfData?.data) && pdfData.data[1]?.['Management Team']
        ? pdfData.data[1]['Management Team']
        : [];

    const firstYear = finance_year?.match(/\b\d{4}\b/)[0] || '';

    const formatPDFData = (data: any[]) => {
      if (data.length === 0) return [];
      const headers = Object.keys(data[0]);

      return data.map((item: any, index: number) => [
        ...headers.map((key: string) => item[key]),
      ]);
    };

    const formatBoardData = formatPDFData(boardPdfData || []);
    const formatManageData = formatPDFData(managePdfData || []);

    const content = [
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
            text: 'Board and Management Composition Report',
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
        style: 'titleOne',
      },
      {
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Board and Management Composition Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
 
        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
 
        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },
      {
        text: 'Board and Management Composition Report',
        style: 'titleOne',
        pageBreak: 'before',
      },
      {
        text: `Reporting Period: FY ${firstYear} (${finance_year})`,
        style: 'title',
      },

      { text: 'Board Composition', style: 'title' },
      // {
      //   image: pieChartImage, // Embed pie chart
      //   width: 130,
      //   height: 130,
      //   margin: [50, 0, 0, 0],
      // },
      // Board Composition Table section
      {
        style: 'tableExample',
        table: {
          widths: [145, 145, 145, 145, 146],
          headerRows: 1,
          body: [
            [
              { text: 'Total Number of Directors', style: 'tableHeader' },
              { text: 'Number of Female Directors', style: 'tableHeader' },
              { text: 'Number of Male Directors', style: 'tableHeader' },
              { text: 'Number of Independent Directors', style: 'tableHeader' },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],
            ...(formatBoardData && formatBoardData.length > 0
              ? formatBoardData.map((row: any) =>
                  row
                    .filter(
                      (_: any, index: number) => index !== 3 && index !== 5
                    ) // Exclude the Tenure and Board Committees columns
                    .map((cell: any) => ({
                      text: cell,
                      style: 'tableCell',
                    }))
                )
              : [
                  [
                    {
                      text: 'No data available',
                      colSpan: 5,
                      style: 'tableCell',
                    },
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

      { text: 'Management Team', style: 'title' },

      // {
      //   image: pieChartImageTwo, // Embed pie chart
      //   width: 130,
      //   height: 130,
      //   margin: [50, 0, 0, 0],
      // },
      // Management Team Table section
      {
        style: 'tableExample',
        table: {
          widths: [184, 184, 184, 184],
          headerRows: 1,
          body: [
            [
              {
                text: 'Total Number of Management Team Members',
                style: 'tableHeader',
              },
              {
                text: 'Number of Females in the Management Team',
                style: 'tableHeader',
              },
              {
                text: 'Number of Males in the Management Team',
                style: 'tableHeader',
              },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],
            ...(formatManageData && formatManageData.length > 0
              ? formatManageData.map((row: any) =>
                  row.map((cell: any) => ({
                    text: cell,
                    style: 'tableCell',
                  }))
                )
              : [
                  [
                    {
                      text: 'No data available',
                      colSpan: 4,
                      style: 'tableCell',
                    },
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
    ];

    var docDefinition: any = {
      content: content,
      pageOrientation: 'landscape',
      pageMargins: [15, 36, 0, 86],
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
        titleOne: {
          alignment: 'left',
          fontSize: 18,
          bold: true,
          color: '#0D304A',
          margin: [20, 15, 0, 15],
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
        tableExample: {
          margin: [20, 5, 0, 15],
        },
        subheader: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [20, 5, 0, 15],
        },
        content: {
          margin: [0, 6],
        },
        footer: {
          margin: [0, 6],
          alignment: 'center',
        },
        title: {
          fontSize: 12,
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
        tableCell: {
          fontSize: 10,
          color: '#060606',
          alignment: 'center',
          margin: [0, 7, 0, 7],
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download('Board and Management Composition Report.pdf');
  };

  const handlePdfClick = () => {
    setIsLoading(true);
    fetchCompositionData();
    fetchPdf().finally(() => setIsLoading(false));
  };
  return (
    <>
      {isEmpty(report) ? (
        <>
          <Button
            loading={isLoading}
            className={styles.pdfButton}
            onClick={handlePdfClick}
            style={{
              marginTop:
                window.location.pathname ===
                '/governance/boardcomposition/dashboard'
                  ? '-5px'
                  : '',
            }}
            icon={<DownloadPdf />}
          ></Button>
        </>
      ) : (
        <Button
          loading={isLoading}
          className="mx-1"
          onClick={handlePdfClick}
          style={{ cursor: 'pointer', border: 'none', background: 'none' }}
          icon={<DownloadIcon />}
        ></Button>
      )}
    </>
  );
}

export default BoardPdf;
