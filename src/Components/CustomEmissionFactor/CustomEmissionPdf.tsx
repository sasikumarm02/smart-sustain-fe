import React, { useEffect, useState } from 'react';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import pdfMake from 'pdfmake/build/pdfmake';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import {
  formatYearRange,
  getCurrentDate,
  getYearFromDate,
} from '../Emissions/Scope3/Helpers';
import { Button, message, Spin } from 'antd';
import PdfIcon from '../../assets/Svg/PdfIcon';
import { isEmpty } from '../../Utils/isEmpty';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import PdfMainPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import DownloadPdf from '../../assets/Svg/DownloadPdf';
import styles from './index.module.scss';

function CustomEmissionPdf(report: any) {
  const { user } = useAuth();
  const pdfFonts = require('pdfmake/build/vfs_fonts');
  const [pdfData, setPdfData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const getPdfData = () => {
    setIsLoading(true);
    get(
      `/custom_ef_database/report_for_custom_ef_DB/?entity_Id=${user.entity_Id}`
    )
      .then((res: any) => {
        setPdfData(res);
        fetchPdf(res);
      })
      .catch((err) => {
        setPdfData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchPdf = async (pdfData: any) => {
    const response = pdfData?.response;
    const finance_year = response?.['Reporting Period FY'];
    const firstYear = finance_year?.match(/\b\d{4}\b/)[0] || '';
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const showData = response?.data;

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

    const generateContentForEmissionTypes = (data: any) => {
      const contentSections: any[] = [];

      if (data?.length === 0) {
        contentSections.push({
          table: {
            widths: [50, 103, 103, 80, 80, 103, 103, 80],
            headerRows: 1,
            body: [
              [
                { text: 'S.No.', style: 'tableHeader' },
                { text: 'Activity Type', style: 'tableHeader' },
                { text: 'Custom Emission Factor Name', style: 'tableHeader' },
                { text: 'Emission Factor Value', style: 'tableHeader' },
                { text: 'UOM', style: 'tableHeader' },
                { text: 'Source', style: 'tableHeader' },
                { text: 'Reference Link', style: 'tableHeader' },
                { text: 'Year', style: 'tableHeader' },
              ],
              [
                {
                  text: 'No data available',
                  colSpan: 8,
                  alignment: 'center',
                  style: 'tableCell',
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ],
            ],
          },
          margin: [15, 0, 15, 0],
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
        });
      } else {
        data?.forEach((emission: any) => {
          // Add heading for the emission type
          contentSections.push({
            text: `Emission Type: ${emission['Emission Type']}`,
            style: 'subtitle',
          });

          // Add table for the emission type
          const rows =
            emission.custom_data.length > 0
              ? emission.custom_data.map((row: any, index: any) => [
                  { text: (index + 1).toString(), style: 'tableCell' },
                  { text: row.activity_type.toString(), style: 'tableCell' },
                  { text: row.custom_ef_name.toString(), style: 'tableCell' },
                  {
                    text: row.emission_factor_per_unit.toString(),
                    style: 'tableCell',
                  },
                  {
                    text:
                      row.uom.toString() === 'N/A'
                        ? row.uom.toString()
                        : `kgCO₂e / ${row.uom.toString()}`,
                    style: 'tableCell',
                  },
                  { text: row.source_of_ef.toString(), style: 'tableCell' },
                  { text: row.reference_link.toString(), style: 'tableCell' },
                  { text: getYearFromDate(row.year), style: 'tableCell' },
                ])
              : [
                  [
                    {
                      text: 'No data available',
                      colSpan: 8,
                      alignment: 'center',
                      style: 'tableCell',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ];

          contentSections.push({
            table: {
              widths: [50, 103, 103, 80, 80, 103, 103, 80],
              headerRows: 1,
              body: [
                [
                  { text: 'S.No.', style: 'tableHeader' },
                  { text: 'Activity Type', style: 'tableHeader' },
                  {
                    text: 'Custom Emission Factor Name',
                    style: 'tableHeader',
                  },
                  { text: 'Emission Factor Value', style: 'tableHeader' },
                  { text: 'UOM', style: 'tableHeader' },
                  { text: 'Source', style: 'tableHeader' },
                  { text: 'Reference Link', style: 'tableHeader' },
                  { text: 'Year', style: 'tableHeader' },
                ],
                ...rows,
              ],
            },
            margin: [15, 0, 15, 0],
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
          });
        });
      }

      return [
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
              text: 'Custom Emission Factor Report',
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
          text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Custom Emission Factor Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
           
                  The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
           
                  The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
          style: 'disclaimer',
          alignment: 'justify',
        },
        {
          text: 'Custom Emission Factor Report',
          style: 'titleOne',
          pageBreak: 'before',
        },

        {
          text: `Reporting Period: FY ${firstYear} (${finance_year})`,
          style: 'title',
        },

        ...contentSections,
      ];
    };

    var docDefinition: TDocumentDefinitions = {
      content: generateContentForEmissionTypes(showData),
      pageOrientation: 'landscape',
      pageMargins: [15, 36, 0, 86],
      styles: {
        titleOne: {
          alignment: 'left',
          fontSize: 18,
          bold: true,
          color: '#003085',
          margin: [20, 15, 15, 15],
        },
        disclaimer: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [20, 0, 35, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: '#fff',
          fillColor: '#00338D',
          alignment: 'center',
          margin: [0, 7, 0, 7],
        },

        subheader: {
          fillColor: '#00737B',
          color: '#fff',
          bold: true,
          margin: [0, 5],
        },
        content: {
          margin: [0, 5],
        },
        footer: {
          margin: [0, 5],
          alignment: 'center',
        },
        title: {
          fontSize: 13,
          bold: true,
          color: '#060606',
          margin: [20, 5, 15, 15],
        },
        subtitle: {
          fontSize: 12,
          bold: true,
          color: '#060606',
          margin: [20, 15, 15, 15],
        },
        tableCell: {
          fontSize: 10,
          alignment: 'center',
          color: '#060606',
          margin: [6, 6],
        },
      },
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

    pdfMake
      .createPdf(docDefinition)
      .download('Custom Emission Factor Report.pdf');
  };

  const handlePdfClick = () => {
    getPdfData();
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
          onClick={handlePdfClick}
          style={{ cursor: 'pointer', border: 'none', background: 'none' }}
          icon={<DownloadIcon />}
        ></Button>
      )}
    </>
  );
}

export default CustomEmissionPdf;
