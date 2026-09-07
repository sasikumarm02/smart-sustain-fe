import { useEffect, useState } from 'react';
import PdfIcon from '../../assets/Svg/PdfIcon';
import PdfMainPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import { get } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import pdfMake from 'pdfmake/build/pdfmake';
import { useAuth } from '../../Hooks/useAuth';
import { Button, message, Spin } from 'antd';
import { useSelector } from 'react-redux';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import {
  formatYearRange,
  getCurrentDate,
} from '../../Components/Emissions/Scope3/Helpers';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import styles from './governance.module.scss';
import DownloadPdf from '../../assets/Svg/DownloadPdf';

const pdfFonts = require('pdfmake/build/vfs_fonts');

function SafetyPdf(report: any) {
  const { user } = useAuth();

  const [injuriesData, setInjuriesData] = useState<any>({});
  const facilitySelected = useSelector((state: any) => state.facilitySelected);
  const [fatalitiesData, setFatalitiesData] = useState<any>({});
  const [pdfData, setPdfData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const fetchFatalityData = async () => {
    setIsLoading(true);
    try {
      const resData = await get(
        `/injury_management/fetch_fatalities_report/?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );
      if (
        !isEmpty(resData?.response?.data) &&
        resData?.response?.data! == null
      ) {
        setFatalitiesData(resData?.response);
      } else if (resData?.response) {
        setFatalitiesData(resData?.response);
      } else {
        console.error('No data found');
      }
    } catch (error) {
      console.error('Error fetching board data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFatalityData();
  }, []);

  const fetchInjuriesData = async () => {
    try {
      const resData = await get(
        `/injury_management/fetch_injury_report/?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );
      if (!isEmpty(resData?.response?.data) && resData?.response?.data) {
        setInjuriesData(resData?.response);
      } else if (resData?.response) {
        setInjuriesData(resData?.response);
      } else {
        console.error('No data found');
      }
    } catch (error) {
      setInjuriesData([]);
      console.error('Error fetching management data:', error);
    }
  };

  useEffect(() => {
    fetchInjuriesData();
  }, []);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getBase64Image = (data: {
    employee: number;
    contractor: number;
  }): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200;
    const height = 200;
    const radius = 80; // Full pie chart (no cutout)

    canvas.width = width;
    canvas.height = height;

    const colors = ['#00338D', '#7FD0FA'];
    const labels = ['Employee', 'Contractor'];
    const values = [data.employee, data.contractor];
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

  const fetchPdf = async () => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let finance_year = fatalitiesData.financial_year;
    const firstYear = finance_year.match(/\b\d{4}\b/)[0] || '';
    let total_emp_fatalities = fatalitiesData.total_emp_fatalities || 0;
    let total_contractor_fatalities =
      fatalitiesData.total_contractor_fatalities || 0;
    let total_high_consequence_injury =
      injuriesData.total_high_consequence_injury || 0;
    let total_recordable_injury = injuriesData.total_recordable_injury || 0;
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

    const employee = fatalitiesData?.data?.[0]?.no_of_emp_fatalities || 0;
    const contractor =
      fatalitiesData?.data?.[0]?.no_of_contractor_fatalities || 0;
    const pieChartImage = getBase64Image({
      employee: employee,
      contractor: contractor,
    });

    const formatPDFData = (data: any) => {
      if (!data || data.length === 0) return [];

      const headers = [
        'S.No',
        ...Object.keys(data[0]).filter((key) => key !== 'S.No'),
      ];

      return data.map((item: any) => [
        item['S.No'],
        ...headers.slice(1).map((key) => {
          if (key === 'createdOn') {
            return formatDate(item[key]);
          }
          return item[key];
        }),
      ]);
    };

    const formatFatalityData = formatPDFData(fatalitiesData.data);
    const formatInjuryData = formatPDFData(injuriesData.data);

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
                    <rect width="620" height="140" fill="#000000" fill-opacity="0.4"/>
                  </svg>`,
          },
          {
            absolutePosition: { x: 30, y: 370 },
            text: 'Safety Performance Report',
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
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Safety Performance Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
 
        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
 
        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },

      {
        text: 'Safety Performance Report',
        style: 'titleOne',
        pageBreak: 'before',
      },
      {
        text: `Reporting Period: FY ${firstYear} (${finance_year})`,
        style: 'title',
      },
      { text: 'Fatalities', style: 'title' },
      // {
      //   image: pieChartImage, // Embed pie chart
      //   width: 130,
      //   height: 130,
      //   margin: [50, 0, 0, 0],
      // },
      {
        text: `Total Number of Employee Fatalities: ${total_emp_fatalities}`,
        style: 'subtitle',
      },
      {
        text: `Total Number of Contractor Fatalities: ${total_contractor_fatalities} `,
        style: 'subtitle',
        margin: [20, -5, 0, 15],
      },

      // Board Composition Table section
      {
        style: 'tableExample',
        table: {
          widths: [50, 155, 155, 185, 180],
          headerRows: 1,
          body: [
            [
              { text: 'S.No.', style: 'tableHeader' },
              { text: 'Number of Employee Fatalities', style: 'tableHeader' },
              { text: 'Number of Contractor Fatalities', style: 'tableHeader' },
              {
                text: 'List Specific Incidents of Fatality',
                style: 'tableHeader',
              },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],
            ...(formatFatalityData && formatFatalityData.length > 0
              ? formatFatalityData.map((row: any) =>
                  row.map((cell: any) => ({
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

      { text: 'Injuries', style: 'title' },
      {
        text: `Total Number of High-Consequence Injuries: ${total_high_consequence_injury}`,
        style: 'subtitle',
      },
      {
        text: `Total Number of Recordable Injuries: ${total_recordable_injury} `,
        style: 'subtitle',
        margin: [20, -5, 0, 15],
      },
      // Management Team Table section
      {
        style: 'tableExample',
        table: {
          widths: [50, 121, 121, 121, 125, 180],
          headerRows: 1,
          body: [
            [
              { text: 'S.No.', style: 'tableHeader' },
              {
                text: 'Number of High-Consequence Injuries',
                style: 'tableHeader',
              },
              { text: 'Number of Recordable Injuries', style: 'tableHeader' },
              { text: 'Number of Lost-Time Injuries', style: 'tableHeader' },
              { text: 'Number of Lost Workdays', style: 'tableHeader' },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],
            ...(formatInjuryData && formatInjuryData.length > 0
              ? formatInjuryData.map((row: any) =>
                  row.map((cell: any) => ({
                    text: cell,
                    style: 'tableCell',
                  }))
                )
              : [
                  [
                    {
                      text: 'No data available',
                      colSpan: 6,
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
          fillColor: '#00737B',
          color: '#fff',
          bold: true,
          margin: [0, 6],
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
      footer2: {
        fontSize: 10,
        color: '#060606',
        margin: [0, 6, 0, 10],
      },
    };

    pdfMake.createPdf(docDefinition).download('Safety Performance Report.pdf');
  };

  const handlePdfClick = () => {
    setIsLoading(true);
    fetchFatalityData();
    fetchInjuriesData();
    fetchPdf().finally(() => setIsLoading(false));
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
          style={{ cursor: 'pointer', border: 'none', background: 'none' }}
          icon={<DownloadIcon />}
        ></Button>
      )}
    </>
  );
}

export default SafetyPdf;
