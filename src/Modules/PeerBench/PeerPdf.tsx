import { useEffect, useState } from 'react';
import PdfMainPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import pdfMake from 'pdfmake/build/pdfmake';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import Styles from './Peerbench.module.scss';
import { Button, message, Spin } from 'antd';
import { isEmpty } from '../../Utils/isEmpty';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import { formatNumberUS } from '../../Utils/Strings';
import {
  formatYearRange,
  getCurrentDate,
} from '../../Components/Emissions/Scope3/Helpers';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import styles from './Peerbench.module.scss';
import DownloadPdf from '../../assets/Svg/DownloadPdf';

const pdfFonts = require('pdfmake/build/vfs_fonts');
function PeerPdf({ selectedYear, report }: any) {
  const yearToUse = selectedYear || '2024';
  const formattedYear = yearToUse
    ? yearToUse.replace(
        /(\d{4}) - (\d{4})/,
        (_: any, startYear: any, endYear: any) => {
          return `${startYear}`;
        }
      )
    : '';

  const { user } = useAuth();

  const [pdfData, setPdfData] = useState<any>([]);
  const [mappingData, setMappingData] = useState<any>([]);
  const [valueData, setValueData] = useState<any>([]);
  const [industry, setIndustry] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const peerPdfData = async () => {
    setIsLoading(true);
    try {
      const res = await get(
        `/peerBenchmarking/pb_pdf/?entity_Id=${user?.entity_Id}${
          selectedYear ? `&financial_year=${selectedYear}` : ''
        }`
      );
      if (!isEmpty(res) && res) {
        setIndustry(res?.industry || '');
        setPdfData(res?.data_point_data || []);
        setMappingData(res?.mapping_data || []);
        setValueData(res?.value_data || []);
      }
    } catch (error) {
      console.error('Error fetching industry options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    peerPdfData();
  }, [selectedYear]);

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

    const companyNames = pdfData.length ? Object.keys(pdfData[0].data) : [];

    const tableHeader = [
      { text: 'Material Topic', style: 'tableHeader' },
      ...companyNames.map((company) => ({
        text: company,
        style: 'tableHeader',
      })),
    ];

    const tableBody = pdfData.map((topic: any) => [
      { text: topic['Material Topic'] || '-', style: 'tableCell' },
      ...companyNames.map((company) => ({
        text: Array.isArray(topic.data[company])
          ? topic.data[company].join(', ')
          : topic.data[company] || '-',
        style: 'tableCell',
      })),
    ]);

    const mappingCompanyNames = mappingData.length
      ? Object.keys(mappingData[0].data)
      : [];

    const tableTwoHeader = [
      { text: 'Material Topic', style: 'tableTwoHeader' },
      ...mappingCompanyNames.map((company) => ({
        text: company,
        style: 'tableTwoHeader',
      })),
    ];

    const tableTwoBody =
      mappingData.length > 0
        ? mappingData.map((topic: any) => {
            return [
              { text: topic['Material Topic'] || '-', style: 'tableTwoCell' },
              ...mappingCompanyNames.map((company) => {
                const normalizedCompany = company.trim();
                const value = topic.data[normalizedCompany]?.trim();

                return {
                  canvas: [
                    value === 'YES'
                      ? {
                          type: 'ellipse',
                          x: 15,
                          y: 9,
                          r1: 6,
                          r2: 6,
                          color: '#269924',
                        }
                      : {
                          type: 'ellipse',
                          x: 15,
                          y: 9,
                          r1: 6,
                          r2: 6,
                          color: '#D9D9D9',
                        },
                  ],
                  style: 'tableTwoCell',
                  alignment: 'center',
                  margin: [6, 6],
                };
              }),
            ];
          })
        : [
            [
              {
                text: 'No data available',
                style: 'tableTwoCell',
                colSpan: 1,
                alignment: 'center',
              },
              ...mappingCompanyNames.map(() => ({})), // Empty cells for other columns
            ],
          ];

    const valueCompanyNames = valueData.length
      ? Object.keys(valueData[0].data)
      : [];

    const tableThreeHeader = [
      { text: 'Data Point', style: 'tableThreeHeader' },
      { text: 'UOM', style: 'tableThreeHeader' },
      { text: 'Material Topic', style: 'tableThreeHeader' },
      ...valueCompanyNames.map((company) => ({
        text: company,
        style: 'tableHeader',
      })),
    ];

    const tableThreeWidths = [
      100,
      100,
      100,
      ...Array(valueCompanyNames.length).fill(80),
    ];

    const tableThreeBody =
      valueData.length > 0
        ? valueData.map((topic: any) => [
            { text: topic['Data Point'] || '-', style: 'tableThreeCell' },
            { text: topic['UOM'] || '-', style: 'tableThreeCell' },
            { text: topic.material_topic || '-', style: 'tableThreeCell' },
            ...valueCompanyNames.map((company) => {
              const value = topic.data[company];
              const formattedValue =
                typeof value === 'number' ? formatNumberUS(value) : value;

              return {
                text: Array.isArray(formattedValue)
                  ? formattedValue.join(', ')
                  : formattedValue || '-',
                style: 'tableThreeCell',
              };
            }),
          ])
        : [
            [
              {
                text: 'No data available',
                style: 'tableThreeCell',
                colSpan: 3,
                alignment: 'center',
              },
              {}, // Placeholder for empty cells
              {},
              ...Array(valueCompanyNames.length).fill({}), // Empty cells for company columns
            ],
          ];

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
            text: 'Peer Benchmarking Report',
            fontSize: 39,
            bold: true,
            color: '#fff',
          },
          {
            absolutePosition: { x: 30, y: 430 },
            text: `Reporting Period FY ${formattedYear}`,
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
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of Peer Benchmarking Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
 
        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
 
        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },

      {
        text: 'Peer Benchmarking',
        style: 'titleOne',
        pageBreak: 'before',
      },
      {
        text: `Selected Reporting Period: FY${formattedYear}`,
        style: 'title',
      },
      { text: `Sector:  ${industry} `, style: 'titleIndustry' },
      // { text: 'Metrics Reported by Peers', style: 'subtitle' },
      // {
      //   style: 'tableExample',
      //   table: {
      //     headerRows: 1,
      //     widths: Array(companyNames.length + 1).fill(118),
      //     body: [tableHeader, ...tableBody],
      //   },
      //   layout: {
      //     hLineColor: '#E6E6E6',
      //     vLineColor: '#E6E6E6',
      //     paddingLeft: function (i: any, node: any) {
      //       return 4;
      //     },
      //     paddingRight: function (i: any, node: any) {
      //       return 4;
      //     },
      //     paddingTop: function (i: any, node: any) {
      //       return 2;
      //     },
      //     paddingBottom: function (i: any, node: any) {
      //       return 2;
      //     },
      //   },
      // },

      // { text: '\n' },
      {
        text: 'Material Topics Reported by Peers',
        style: 'subtitle',
      },
      {
        columns: [
          {
            canvas: [
              {
                type: 'ellipse',
                x: 5,
                y: 6, // Adjust vertical positioning
                r1: 6,
                r2: 6,
                color: '#269924', // Green ellipse
              },
            ],
            width: 'auto', // Auto size for canvas
          },
          {
            text: 'Reported by Peers',
            margin: [5, 0, 0, 0], // Adjust left and right margin for spacing
            style: 'tableExample',
            alignment: 'left',
          },
          {
            canvas: [
              {
                type: 'ellipse',
                x: 5,
                y: 6, // Adjust vertical positioning
                r1: 6,
                r2: 6,
                color: '#D9D9D9', // Grey ellipse
              },
            ],
            width: 'auto', // Auto size for canvas
          },
          {
            text: 'Not Reported by Peers',
            margin: [5, 0, 0, 0], // Adjust left margin
            style: 'tableExample',
            alignment: 'left',
          },
        ],
        columnGap: 10,
        margin: [25, 0, 400, 10], // Reduce overall spacing above and below legend
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: Array(mappingCompanyNames.length + 1).fill(118),
          body: [tableTwoHeader, ...tableTwoBody],
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
      {
        text: 'Consolidated Data Points from Peers',
        style: 'subtitle',
        pageBreak: 'before',
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: tableThreeWidths,
          body: [tableThreeHeader, ...tableThreeBody],
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

    const docDefinition: any = {
      content: content,
      pageMargins: [15, 36, 0, 86],
      pageOrientation: 'landscape',
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
                    text: `Smart Sustain.AI FY ${formattedYear}`,
                    alignment: 'left',
                    style: 'footerText',
                    fontSize: 8,
                    margin: [20, 0, 0, 0], // Adjust left margin
                    width: 150, // Narrow column
                  },
                  // Center column (wider)
                  {
                    text: `© ${formattedYear} Smart Sustain.AI Services Pte. Ltd. (Registration No: 200003956G), a Singapore incorporated company and a member firm of the Smart Sustain.AI global organisation of independent member firms affiliated with Smart Sustain.AI International Limited, a private English company limited by guarantee. All rights reserved.`,
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
            margin: [0, -10, 0, 20],
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
          fontSize: 18,
          alignment: 'left',
          bold: true,
          color: '#0D304A',
          margin: [25, 15, 25, 15],
        },
        titleIndustry: {
          fontSize: 16,
          alignment: 'left',
          bold: false,
          color: '#060606',
          margin: [25, 5, 25, 15],
        },
        subtitle: {
          fontSize: 14,
          alignment: 'left',
          bold: true,
          color: '#060606',
          margin: [25, 5, 0, 15],
        },
        tableExample: {
          margin: [25, 5, 0, 15],
        },
        footer2: {
          fontSize: 10,
          color: '#060606',
          margin: [0, 6, 0, 10],
        },
        tableHeader: {
          color: '#fff',
          fillColor: '#0D304A',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 7, 0, 7],
        },
        tableCell: {
          fontSize: 10,
          color: '#060606',
          alignment: 'center',
          margin: [0, 7, 0, 7],
        },
        tableTwoHeader: {
          color: '#fff',
          fillColor: '#0D304A',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [1, 5, 1, 5],
        },
        tableTwoCell: {
          fontSize: 10,
          color: '#060606',
          alignment: 'center',
          margin: [1, 5, 1, 5],
        },
        tableThreeHeader: {
          color: '#fff',
          fillColor: '#0D304A',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [1, 5, 1, 5],
        },
        tableThreeCell: {
          fontSize: 10,
          color: '#060606',
          alignment: 'center',
          margin: [1, 5, 1, 5],
        },
        title: {
          fontSize: 14,
          bold: true,
          color: '#060606',
          margin: [25, 5, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('Peer Benchmarking Report.pdf');
  };

  const handlePdfClick = () => {
    setIsLoading(true);
    fetchPdf().finally(() => setIsLoading(false));
    peerPdfData();
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

export default PeerPdf;
