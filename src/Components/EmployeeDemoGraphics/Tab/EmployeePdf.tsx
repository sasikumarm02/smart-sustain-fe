import { useEffect, useState } from 'react';
import PdfIcon from '../../../assets/Svg/PdfIcon';
import { useAuth } from '../../../Hooks/useAuth';
import { get } from '../../../Services';
import { isEmpty } from '../../../Utils/isEmpty';
import pdfMake from 'pdfmake/build/pdfmake';
import PdfMainPageImge from '../../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../../assets/finalpage.png';
import { Button, message, Spin } from 'antd';
import PdfFormat from '../../../assets/Svg/Dashboard/PdfFormat';
import {
  formatYearRange,
  getCurrentDate,
} from '../../Emissions/Scope3/Helpers';
import { useSelector } from 'react-redux';
import DownloadIcon from '../../../assets/Svg/DownloadIcon';
import styles from '../CountCards/CountCard.module.scss';
import DownloadPdf from '../../../assets/Svg/DownloadPdf';

function EmployeePdf(report: any) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const pdfFonts = require('pdfmake/build/vfs_fonts');

  const [pdfData, setPdfData] = useState<any>({});
  const formatter = new Intl.NumberFormat('en-US', {});
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const getData = () => {
    setIsLoading(true);
    get(
      `/employee/download_employee_data/?entity_Id=${user.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
    )
      .then((res: any) => {
        if (!isEmpty(res) && res) {
          if (Array.isArray(res.data) && res.data.length === 0) {
            // Handle the case where res.data is an empty array
            console.warn('No data available');
            setPdfData([]); // Clear pdfData or handle it as needed
          } else {
            setPdfData(res);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching employee data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const getBase64Image = (data: { female: number; male: number }): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const outerRadius = 80;
    const innerRadius = 40; // The inner cutout to make it a donut

    canvas.width = width;
    canvas.height = height;

    const colors = ['rgba(30, 73, 226, 1)', '#FD349C']; // Male - Blue, Female - Pink
    const labels = ['Male', 'Female'];
    const values = [data.male, data.female]; // Ensure Male is first
    const total = values.reduce((sum, value) => sum + value, 0);

    let startAngle = Math.PI / 2; // Set start angle to 90° (bottom center)

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      // Draw pie slice
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.arc(
        width / 2,
        height / 2,
        outerRadius,
        startAngle,
        startAngle + sliceAngle
      );
      ctx.lineTo(width / 2, height / 2); // Close the shape
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Cut out the center to make it a donut
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white'; // This makes it transparent
    ctx.fill();

    // Reset start angle for text positioning
    startAngle = Math.PI / 2; // Apply the same rotation to labels

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const midAngle = startAngle + sliceAngle / 2;

      // Adjust label positioning slightly outward
      const textX = width / 2 + (outerRadius / 1.3) * Math.cos(midAngle);
      const textY = height / 2 + (outerRadius / 1.3) * Math.sin(midAngle);

      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${((value / total) * 100).toFixed(1)}%`, textX, textY);

      startAngle += sliceAngle;
    });

    return canvas.toDataURL('image/png');
  };

  const getBase64ImageAge = (data: {
    below: number;
    thirty: number;
    above: number;
  }): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const outerRadius = 80;
    const innerRadius = 40; // Inner cutout for donut effect

    canvas.width = width;
    canvas.height = height;

    const colors = [
      'rgba(9, 142, 126, 1)',
      'rgba(114, 19, 234, 1)',
      'rgba(0, 184, 245, 1)',
    ]; // Colors for each age group
    const values = [data.below, data.thirty, data.above]; // Data values
    const total = values.reduce((sum, value) => sum + value, 0);

    let startAngle = Math.PI / 2; // Start from the top (12 o'clock position)

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;

      // Draw the slice
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.arc(
        width / 2,
        height / 2,
        outerRadius,
        startAngle,
        startAngle + sliceAngle
      );
      ctx.lineTo(width / 2, height / 2);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Create the donut hole
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Reset start angle for text positioning
    startAngle = Math.PI / 2;

    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const midAngle = startAngle + sliceAngle / 2;

      // Adjust label positioning
      const textX = width / 2 + (outerRadius / 1.4) * Math.cos(midAngle);
      const textY = height / 2 + (outerRadius / 1.4) * Math.sin(midAngle);

      ctx.fillStyle = 'white'; // Ensuring text is white for contrast
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${((value / total) * 100).toFixed(1)}%`, textX, textY);

      startAngle += sliceAngle;
    });

    return canvas.toDataURL('image/png');
  };

  const fetchPdf = async () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const response = pdfData?.response;
    const finance_year = response['Reporting Period FY'];
    const firstYear = finance_year?.match(/\b\d{4}\b/)?.[0] || '';
    const employeeNumberData = response?.data[0];
    const employeeTurnOverData = response?.data[1];
    const employeeHiringData = response?.data[2];
    const formatPDFData = (data: any[]) => {
      if (data.length === 0) return [];
      const headers = Object.keys(data[0]);
      return data?.map((item: any, index: number) => [
        index + 1,
        ...headers.map((key: string) => item[key]),
      ]);
    };
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

    const maleNum = employeeNumberData?.data?.[0]?.['Male'] || 0;
    const femaleNum = employeeNumberData?.data?.[0]?.['Female'] || 0;
    const pieChartImage = getBase64Image({ female: femaleNum, male: maleNum });
    const ageBelThirtyNum = employeeNumberData?.data?.[0]?.['Age <30'] || 0;
    const ageThirtyNum = employeeNumberData?.data?.[0]?.['Age 30-50'] || 0;
    const ageAboThirtyNum = employeeNumberData?.data?.[0]?.['Age >50'] || 0;
    const pieChartAge = getBase64ImageAge({
      below: ageBelThirtyNum,
      thirty: ageThirtyNum,
      above: ageAboThirtyNum,
    });

    const maleHire = employeeHiringData?.data?.[0]?.['Male'] || 0;
    const femaleHire = employeeHiringData?.data?.[0]?.['Female'] || 0;
    const pieChartImageTwo = getBase64Image({
      female: maleHire,
      male: femaleHire,
    });
    const ageBelThirtyHire = employeeHiringData?.data?.[0]?.['Age <30'] || 0;
    const ageThirtyHire = employeeHiringData?.data?.[0]?.['Age 30-50'] || 0;
    const ageAboThirtyHire = employeeHiringData?.data?.[0]?.['Age >50'] || 0;
    const pieChartAgeTwo = getBase64ImageAge({
      below: ageBelThirtyHire,
      thirty: ageThirtyHire,
      above: ageAboThirtyHire,
    });

    const maleTurn = employeeTurnOverData?.data?.[0]?.['Male'] || 0;
    const femaleTurn = employeeTurnOverData?.data?.[0]?.['Female'] || 0;
    const pieChartImageThree = getBase64Image({
      female: maleTurn,
      male: femaleTurn,
    });
    const ageBelThirtyTurn = employeeTurnOverData?.data?.[0]?.['Age <30'] || 0;
    const ageThirtyTurn = employeeTurnOverData?.data?.[0]?.['Age 30-50'] || 0;
    const ageAboThirtyTurn = employeeTurnOverData?.data?.[0]?.['Age >50'] || 0;
    const pieChartAgeThree = getBase64ImageAge({
      below: ageBelThirtyTurn,
      thirty: ageThirtyTurn,
      above: ageAboThirtyTurn,
    });

    const totalEmployees = formatter.format(
      employeeNumberData?.['Total Number of Employees'] || 0
    );
    const totalTurnOver = formatter.format(
      employeeTurnOverData?.['Total Number of Employee Turnover'] || 0
    );
    const totalHiring = formatter.format(
      employeeHiringData?.['Total Number of New Hires'] || 0
    );

    const formatEmployeeData = formatPDFData(employeeNumberData?.data || []);
    const formatEmployeeTurnOverData = formatPDFData(
      employeeTurnOverData?.data || []
    );
    const formatEmployeeHiringData = formatPDFData(
      employeeHiringData?.data || []
    );

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
            text: 'Employee Demographics Report',
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
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Employee Demographics Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
 
        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
 
        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },
      {
        text: 'Employee Demographics Report',
        style: 'titleOne',
        pageBreak: 'before',
      },
      {
        text: `Reporting Period: FY ${firstYear} (${finance_year})`,
        style: 'title',
      },

      { text: 'Number of Employees', style: 'title' },
      // {
      //   columns: [
      //     {
      //       image: pieChartImage, // First chart (Gender)
      //       width: 130,
      //       height: 130,
      //       margin: [50, 0, 0, 0],
      //     },
      //     {
      //       image: pieChartAge, // Second chart (Age)
      //       width: 130,
      //       height: 130,
      //       margin: [150, 0, 0, 0], // Reduce margin for proper spacing
      //     }
      //   ]
      // },
      {
        text: `Total Number of Employees: ${totalEmployees}`,
        style: 'subtitle',
      },
      // Table section
      {
        style: 'tableExample',
        table: {
          widths: [50, 100, 90, 90, 90, 90, 90, 100],
          headerRows: 1,
          body: [
            [
              { text: 'S.No.', style: 'tableHeader' },
              { text: 'Employee Type', style: 'tableHeader' },
              { text: 'Male', style: 'tableHeader' },
              { text: 'Female', style: 'tableHeader' },
              { text: 'Age <30', style: 'tableHeader' },
              { text: 'Age 30-50', style: 'tableHeader' },
              { text: 'Age >50', style: 'tableHeader' },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],

            ...(formatEmployeeData && formatEmployeeData.length > 0
              ? formatEmployeeData.map((row: any) =>
                  row.map((cell: any) => ({
                    text:
                      cell !== null && cell !== undefined
                        ? cell.toString()
                        : '',
                    style: 'tableCell',
                  }))
                )
              : [
                  [
                    {
                      text: 'Data Not Available',
                      colSpan: 8,
                      style: 'tableCell',
                      alignment: 'center',
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
      { text: '\n' },
      // section2
      { text: 'Employee Turnover', style: 'title' },

      // {
      //   columns: [
      //     {
      //       image: pieChartImageTwo, // Embed pie chart
      //       width: 130,
      //       height: 130,
      //       margin: [50, 0, 0, 0],
      //     },
      //     {
      //       image: pieChartAgeTwo, // Second chart (Age)
      //       width: 130,
      //       height: 130,
      //       margin: [150, 0, 0, 0], // Reduce margin for proper spacing
      //     }
      //   ]
      // },
      {
        text: `Total Number of Employee Turnover: ${totalTurnOver}`,
        style: 'subtitle',
      },

      // Table section
      {
        style: 'tableExample',
        table: {
          widths: [50, 100, 90, 90, 90, 90, 90, 100],
          headerRows: 1,
          body: [
            [
              { text: 'S.No.', style: 'tableHeader' },
              { text: 'Turnover Type', style: 'tableHeader' },
              { text: 'Male', style: 'tableHeader' },
              { text: 'Female', style: 'tableHeader' },
              { text: 'Age <30', style: 'tableHeader' },
              { text: 'Age 30-50', style: 'tableHeader' },
              { text: 'Age >50', style: 'tableHeader' },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],

            ...(formatEmployeeTurnOverData &&
            formatEmployeeTurnOverData.length > 0
              ? formatEmployeeTurnOverData.map((row: any) =>
                  row.map((cell: any) => ({
                    text:
                      cell !== null && cell !== undefined
                        ? cell.toString()
                        : '',
                    style: 'tableCell',
                  }))
                )
              : [
                  [
                    {
                      text: 'Data Not Available',
                      colSpan: 8,
                      style: 'tableCell',
                      alignment: 'center',
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

      { text: '\n' },
      // section3
      { text: 'New Hires', style: 'title' },

      // {
      //   columns: [
      //     {
      //       image: pieChartImageThree, // Embed pie chart
      //       width: 130,
      //       height: 130,
      //       margin: [50, 0, 0, 0],
      //     },
      //     {
      //       image: pieChartAgeThree, // Second chart (Age)
      //       width: 130,
      //       height: 130,
      //       margin: [150, 0, 0, 0], // Reduce margin for proper spacing
      //     }
      //   ]
      // },
      { text: `Total New Hires: ${totalHiring}`, style: 'subtitle' }, // Replace '45' with dynamic data

      // Table section
      {
        style: 'tableExample',
        table: {
          widths: [50, 100, 90, 90, 90, 90, 90, 100],
          headerRows: 1,
          body: [
            [
              { text: 'S.No.', style: 'tableHeader' },
              { text: 'Hiring Type', style: 'tableHeader' },
              { text: 'Male', style: 'tableHeader' },
              { text: 'Female', style: 'tableHeader' },
              { text: 'Age <30', style: 'tableHeader' },
              { text: 'Age 30-50', style: 'tableHeader' },
              { text: 'Age >50', style: 'tableHeader' },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],

            ...(formatEmployeeHiringData && formatEmployeeHiringData.length > 0
              ? formatEmployeeHiringData.map((row: any) =>
                  row.map((cell: any) => ({
                    text:
                      cell !== null && cell !== undefined
                        ? cell.toString()
                        : '',
                    style: 'tableCell',
                  }))
                )
              : [
                  [
                    {
                      text: 'Data Not Available',
                      colSpan: 8,
                      style: 'tableCell',
                      alignment: 'center',
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
                    margin: [35, 0, 0, 0], // Adjust left margin
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
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#060606',
          margin: [15, 5, 0, 15],
        },
        content: {
          margin: [0, 10],
        },
        footer: {
          margin: [0, 10],
          alignment: 'center',
        },
        title: {
          fontSize: 14,
          bold: true,
          color: '#060606',
          margin: [20, 5, 0, 15],
        },
        tableExample: {
          margin: [20, 5, 0, 15],
        },
        footer2: {
          fontSize: 10,
          color: '#060606',
          margin: [0, 6, 0, 10],
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
      .download('Employee Demographics Report .pdf');
  };

  const handlePdfClick = () => {
    if (pdfData.length === 0) {
      message.warning('No data found');
      return;
    }
    fetchPdf();
    getData();
  };

  return (
    <>
      {isEmpty(report) ? (
        <>
          <Button
            loading={isLoading}
            onClick={handlePdfClick}
            className={styles.pdfButton}
            icon={<DownloadPdf />}
          ></Button>
        </>
      ) : (
        <Button
          loading={isLoading}
          className="mx-1"
          onClick={handlePdfClick}
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
}

export default EmployeePdf;
