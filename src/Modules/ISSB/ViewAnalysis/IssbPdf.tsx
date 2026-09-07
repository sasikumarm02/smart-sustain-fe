import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import PdfFormat from '../../../assets/Svg/Dashboard/PdfFormat';
import { get } from '../../../Services';
import { useAuth } from '../../../Hooks/useAuth';
import { isEmpty } from '../../../Utils/isEmpty';
import { Button } from 'antd';
import {
  formatYearRange,
  getCurrentDate,
} from '../../../Components/Emissions/Scope3/Helpers';
import PdfMainPageImge from '../../../assets/Disclosure Page.png';
import DownloadIcon from '../../../assets/Svg/DownloadIcon';
import styles from './ViewAnalysis.module.scss';
import DownloadPdf from '../../../assets/Svg/DownloadPdf';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function IssbPdf({ report, onClick }: any) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [colors, setColors] = useState({
    requirementNotMet: '#B16104',
    requirementPartiallyMet: '#91B4FF',
    requirementMet: '#036323',
    requirementTbc: '#43596F',
  });

  const [dataSource, setDataSource] = useState<any>([]);
  const [reportYear, setReportYear] = useState<any>([]);

  const capitalizeWords = (str: string) => {
    return str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleClick = (flag: any) => {
    if (typeof onClick === 'function') {
      onClick(flag);
    } else {
      console.warn('onClick is not a function');
    }
    setIsLoading(true);
    setTimeout(() => {
      if (typeof onClick === 'function') {
        onClick(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  const transformData = (data: any) => {
    return Object.keys(data).map((topic) => ({
      key: topic,
      topic: capitalizeWords(topic),
      s1: {
        req_met: data[topic]?.S1?.Requirement_met || 0,
        req_partially_met: data[topic]?.S1?.Requirement_partially_met || 0,
        req_not_met: data[topic]?.S1?.Requirement_not_met || 0,
        not_disclosure_req: data[topic]?.S1?.Not_disclosure_requirement || 0,
      },
      s2: {
        req_met: data[topic]?.S2?.Requirement_met || 0,
        req_partially_met: data[topic]?.S2?.Requirement_partially_met || 0,
        req_not_met: data[topic]?.S2?.Requirement_not_met || 0,
        not_disclosure_req: data[topic]?.S2?.Not_disclosure_requirement || 0,
      },
    }));
  };

  const fetchData = () => {
    setIsLoading(true);
    get(`/issb/get_gap_analysis/?entity_Id=${user?.entity_Id}`)
      .then((res: any) => {
        const transformedData = transformData(res?.response?.data);
        setDataSource(transformedData);
        setReportYear(res?.response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false); // Removed the unused "err" argument
      });
  };

  const topicCounts: Record<string, number> = {
    Objective: 6,
    Scope: 7,
    'Conceptual Foundations': 18,
    'Core Content': 164,
    'General Requirements': 31,
    'Judgements Uncertainties And Errors': 16,
    'Effective Date': 4,
    Transition: 7,
    'Application Guidance': 170,
  };

  const getBase64Image = (data: string): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 200; // Width of the donut chart
    const height = 200; // Height of the donut chart
    const outerRadius = 100; // Outer radius of the donut
    const innerRadius = 60; // Inner radius (hole size) of the donut

    canvas.width = width;
    canvas.height = height;

    // Pie chart data
    const values = data.split('/').map(Number); // Parse values from string
    const total = values.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
      // If all values are zero, return an empty canvas
      return canvas.toDataURL('image/png');
    }

    // Calculate angles and percentages
    const angles = values.map((value) => (value / total) * 2 * Math.PI);
    const percentages = values.map((value) => (value / total) * 100); // Percentages with 1 decimal

    let startAngle = 0;

    // Draw the donut chart slices
    values.forEach((value, i) => {
      if (value > 0) {
        // Only draw slices for non-zero values
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2); // Center of the donut
        ctx.arc(
          width / 2,
          height / 2,
          outerRadius,
          startAngle,
          startAngle + angles[i]
        );
        ctx.arc(
          width / 2,
          height / 2,
          innerRadius,
          startAngle + angles[i],
          startAngle,
          true
        ); // Draw the inner circle to create the hole
        ctx.closePath();
        ctx.fillStyle = Object.values(colors)[i] as string; // Assuming colors contain strings
        ctx.fill();

        // Calculate text position (centering within the slice)
        const midAngle = startAngle + angles[i] / 2;
        const textX = width / 2 + (outerRadius - 20) * Math.cos(midAngle);
        const textY = height / 2 + (outerRadius - 20) * Math.sin(midAngle);

        // Draw percentage text on the chart slice
        ctx.fillStyle = 'black'; // White color for text
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `${percentages[i].toFixed(2)}% (${values[i]})`,
          textX,
          textY
        );

        startAngle += angles[i];
      }
    });

    return canvas.toDataURL('image/png');
  };

  const generatePDF = async () => {
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

    const finance_year = reportYear?.['Reporting Period FY'];
    const firstYear = finance_year?.match(/\b\d{4}\b/)?.[0] || '';
    const HomeImage1 = await getBase64ImageFromUrl(PdfMainPageImge);

    function chunkArray(arr: any, chunkSize: any) {
      const result = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
      }
      return result;
    }

    // Break the dataSource into chunks of 3 rows
    const chunkedData = chunkArray(dataSource, 3);

    // Prepare table chunks based on the chunked data
    const tableChunks = chunkedData.map((chunk, index) => {
      // Legend for each page
      const pageLegend = {
        columns: [
          {
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 15,
                    h: 15,
                    color: colors?.requirementMet,
                  },
                ],
              },
              {
                text: 'Requirement Met',
                margin: [20, -13, 0, 0],
                fontSize: 10,
              },
            ],
          },
          {
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 15,
                    h: 15,
                    color: colors?.requirementPartiallyMet,
                  },
                ],
              },
              {
                text: 'Requirement Partially Met',
                margin: [20, -13, 0, 0],
                fontSize: 10,
              },
            ],
          },
          {
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 15,
                    h: 15,
                    color: colors?.requirementNotMet,
                  },
                ],
              },
              {
                text: 'Requirement Not Met',
                margin: [20, -13, 0, 0],
                fontSize: 10,
              },
            ],
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 10],
        // Add page break for the first content in the page
        pageBreak: index > 0 ? 'before' : undefined,
      };

      // Table content
      const tableContent = {
        style: 'tableExample',
        table: {
          widths: [150, 292, 292],
          body: [
            [
              {
                text: 'Topic',
                bold: true,
                fillColor: '#0D304A',
                color: '#fff',
                alignment: 'center',
                margin: [0, 5, 0, 5],
              },
              {
                text: 'S1 Donut Chart',
                bold: true,
                fillColor: '#0D304A',
                color: '#fff',
                alignment: 'center',
                margin: [0, 5, 0, 5],
              },
              {
                text: 'S2 Donut Chart',
                bold: true,
                fillColor: '#0D304A',
                color: '#fff',
                alignment: 'center',
                margin: [0, 5, 0, 5],
              },
            ],
            ...chunk.map((item: any) => {
              const s1Base64Image = getBase64Image(
                `${item.s1.req_not_met}/${item.s1.req_partially_met}/${item.s1.req_met}`
              );
              const s2Base64Image = getBase64Image(
                `${item.s2.req_not_met}/${item.s2.req_partially_met}/${item.s2.req_met}`
              );

              // Color squares as labels for S1
              const s1Label = [
                {
                  columns: [
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 15,
                          h: 15,
                          color: colors?.requirementMet,
                        },
                      ],
                    },
                    {
                      text: ` ${item.s1.req_met}`,
                      fontSize: 10,
                      margin: [-20, 0, 0, 0],
                    },
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 15,
                          h: 15,
                          color: colors?.requirementPartiallyMet,
                        },
                      ],
                    },
                    {
                      text: ` ${item.s1.req_partially_met}`,
                      fontSize: 10,
                      margin: [-20, 0, 0, 0],
                    },
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 15,
                          h: 15,
                          color: colors?.requirementNotMet,
                        },
                      ],
                    },
                    {
                      text: ` ${item.s1.req_not_met}`,
                      fontSize: 10,
                      margin: [-20, 0, 0, 0],
                    },
                  ],
                  columnGap: 1,
                  margin: [40, 5, 0, 5],
                },
              ];

              // Color squares as labels for S2
              const s2Label = [
                {
                  columns: [
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 15,
                          h: 15,
                          color: colors?.requirementMet,
                        },
                      ],
                    },
                    {
                      text: ` ${item.s2.req_met}`,
                      fontSize: 10,
                      margin: [-20, 0, 0, 0],
                    },
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 15,
                          h: 15,
                          color: colors?.requirementPartiallyMet,
                        },
                      ],
                    },
                    {
                      text: ` ${item.s2.req_partially_met}`,
                      fontSize: 10,
                      margin: [-20, 0, 0, 0],
                    },
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 15,
                          h: 15,
                          color: colors?.requirementNotMet,
                        },
                      ],
                    },
                    {
                      text: ` ${item.s2.req_not_met}`,
                      fontSize: 10,
                      margin: [-20, 0, 0, 0],
                    },
                  ],
                  columnGap: 1,
                  margin: [40, 5, 0, 5],
                },
              ];

              return [
                {
                  text: `${item.topic} (${topicCounts[item.topic] || 0})`,
                  alignment: 'center',
                  margin: [0, 55, 0, 55],
                },
                {
                  stack: [
                    {
                      image: s1Base64Image,
                      width: 90,
                      height: 90,
                      alignment: 'center',
                    },
                    { stack: s1Label, margin: [0, 5, 0, 0] },
                  ],
                },
                {
                  stack: [
                    {
                      image: s2Base64Image,
                      width: 90,
                      height: 90,
                      alignment: 'center',
                    },
                    { stack: s2Label, margin: [0, 5, 0, 0] },
                  ],
                },
              ];
            }),
          ],
        },
        layout: {
          hLineColor: '#E6E6E6',
          vLineColor: '#E6E6E6',
          paddingLeft: (i: any, node: any) => 4,
          paddingRight: (i: any, node: any) => 4,
          paddingTop: (i: any, node: any) => 2,
          paddingBottom: (i: any, node: any) => 2,
        },
      };

      // Return the legend and table content
      return [pageLegend, tableContent];
    });

    const docDefinition: any = {
      pageOrientation: 'landscape',
      // pageMargins: [15, 39, 0, 86],
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
              text: 'ISSB Gap Analysis Report',
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
          text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of ISSB Gap Analysis Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
         
                The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
         
                The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
          style: 'disclaimer',
          alignment: 'justify',
        },

        {
          text: 'ISSB Gap Analysis Report',
          style: 'header',
          pageBreak: 'before',
        },
        {
          text: `Reporting Period: FY ${firstYear} (${finance_year})`,
          style: 'title',
        },

        // The table with pie charts and colored labels
        ...tableChunks,
      ],

      footer: function (currentPage: any, pageCount: any) {
        if (currentPage > 1) {
          return {
            stack: [
              // Top line divider
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
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
          color: '#0D304A',
        },
        tableExample: {
          margin: [0, 0, 0, 20],
        },
        titleOne: {
          alignment: 'left',
          fontSize: 18,
          bold: true,
          color: '#0D304A',
          margin: [0, 10, 0, 0],
        },
        title: {
          fontSize: 14,
          bold: true,
          color: '#060606',
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('ISSB Gap Analysis Report.pdf'); // Download PDF
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div>
      <>
        {isEmpty(report) ? (
          <>
            <Button
              loading={isLoading}
              onClick={() => {
                handleClick(true);
                generatePDF();
              }}
              className={styles.pdfButton}
              icon={<DownloadPdf />}
            ></Button>
          </>
        ) : (
          <Button
            loading={isLoading}
            onClick={() => {
              handleClick(true);
              generatePDF();
            }}
            style={{ cursor: 'pointer', border: 'none', background: 'none' }}
            icon={<DownloadIcon />}
          ></Button>
        )}
      </>
    </div>
  );
}

export default IssbPdf;
