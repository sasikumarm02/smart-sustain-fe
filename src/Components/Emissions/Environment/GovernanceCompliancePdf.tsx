import React, { useEffect, useState } from 'react';
import PdfIcon from '../../../assets/Svg/PdfIcon';
import { Button, message, Spin } from 'antd';
import { isEmpty } from '../../../Utils/isEmpty';
import { get } from '../../../Services';
import PdfMainPageImge from '../../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../../assets/finalpage.png';
import pdfMake from 'pdfmake/build/pdfmake';
import { useAuth } from '../../../Hooks/useAuth';
import { useSelector } from 'react-redux';
import PdfFormat from '../../../assets/Svg/Dashboard/PdfFormat';
import { formatYearRange, getCurrentDate } from '../Scope3/Helpers';
import DownloadIcon from '../../../assets/Svg/DownloadIcon';
import styles from './Enviroment.module.scss';
import DownloadPdf from '../../../assets/Svg/DownloadPdf';

const pdfFonts = require('pdfmake/build/vfs_fonts');

function GovernanceCompliancePdf(report: any) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfData, setPdfData] = useState<any>({});

  const [governanceData, setGovernanceData] = useState<any>({});
  const facilitySelected = useSelector((state: any) => state.facilitySelected);

  const fetchGovernanceData = async () => {
    setIsLoading(true);
    try {
      const resData = await get(
        `/corruption/download_corruption_data/?entity_Id=${user?.entity_Id}${facilitySelected ? `&facility_Id=${facilitySelected}` : ''}`
      );

      if (!isEmpty(resData?.response) && resData?.response) {
        setPdfData(resData.response);
        if (resData?.response?.data) {
          setGovernanceData(resData?.response.data);
        }
      }
    } catch (error) {
      setGovernanceData([]);
      setPdfData([]);
      console.error('Error fetching board data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernanceData();
  }, []);

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
    const finance_year = pdfData?.['Reporting Period FY'];

    const firstYear = finance_year?.match(/\b\d{4}\b/)[0] || '';

    const total_incidents = pdfData?.data[0]?.['Total Incidents'] || 0;

    const formatPDFData = (data: any[]) => {
      if (data.length === 0) return [];

      const headers = Object.keys(data[0]);

      return data.map((item: any, index: number) => [
        index + 1,
        ...headers.map((key: string) => item[key]),
      ]);
    };

    const formatGovernanceData = formatPDFData(
      pdfData?.data?.[0]?.Incidents || []
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
            text: 'Governance Compliance Report',
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
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Governance Compliance Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
 
        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
 
        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },

      {
        text: 'Governance Compliance Report',
        style: 'titleOne',
        pageBreak: 'before',
      },
      {
        text: `Reporting Period: FY ${firstYear} (${finance_year})`,
        style: 'title',
      },
      { text: `Total Incidents: ${total_incidents} `, style: 'subtitle' },
      // Governance Compliance Table section
      {
        style: 'tableExample',
        table: {
          widths: [50, 200, 145, 170, 160],
          headerRows: 1,
          body: [
            [
              { text: 'S.No.', style: 'tableHeader' },
              { text: 'Incident category', style: 'tableHeader' },
              { text: 'Number of incidents', style: 'tableHeader' },
              { text: 'Remarks', style: 'tableHeader' },
              { text: 'Date of Entry', style: 'tableHeader' },
            ],
            ...(formatGovernanceData && formatGovernanceData.length > 0
              ? formatGovernanceData.map((row: any) =>
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
        tableExample: {
          margin: [20, 5, 0, 15],
        },
        title: {
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

    pdfMake
      .createPdf(docDefinition)
      .download('Governance Compliance Report.pdf');
  };

  const handlePdfClick = () => {
    setIsLoading(true);
    fetchGovernanceData();
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

export default GovernanceCompliancePdf;
