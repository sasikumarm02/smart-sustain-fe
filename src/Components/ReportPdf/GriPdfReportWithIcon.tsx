import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Row, Col, Spin, Button, message } from 'antd';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';
import {
  Gri2IndexData,
  Gri201Index,
  Gri202Index,
  Gri205Index,
  Gri206Index,
  Gri207Index,
  Gri301Index,
  Gri302Index,
  Gri303Index,
  Gri305Index,
  Gri306Index,
  Gri308Index,
  Gri401Index,
  Gri403Index,
  Gri404Index,
  Gri405Index,
  Gri414Index,
  Gri416Index,
} from '../../Modules/Emission/mock';
import { PageCardComponent } from '../../DesignLibrary';
import NoDataImage from '../../assets/Svg/NoData';
import Styles from '../../Modules/ReportingScreens/report.module.scss';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import { formatYearRange, getCurrentDate } from '../Emissions/Scope3/Helpers';
import PdfLastPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import DownloadIcon from '../../assets/Svg/DownloadIcon';

const pdfFonts = require('pdfmake/build/vfs_fonts');

const GriPdfReportWithIcon = (report: any) => {
  const { user } = useAuth();
  const { openToast } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const generatePdf = async (data: any, reportYear: any) => {
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

    const finance_year = reportYear?.['Reporting Period FY'];
    const firstYear = finance_year?.match(/\b\d{4}\b/)[0] || '';

    const HomeImage1 = await getBase64ImageFromUrl(PdfLastPageImge);
    const HomeLastImage = await getBase64ImageFromUrl(PdfLastPageImg);

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
            text: 'GRI Report',
            fontSize: 39,
            bold: true,
            color: '#fff',
          },
          {
            absolutePosition: { x: 40, y: 430 },
            text: `Reporting Period FY ${formatYearRange(user.financial_year)} `,
            fontSize: 16,
            bold: true,
            color: '#fff',
          },
          {
            absolutePosition: { x: 40, y: 460 },
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
        style: 'classHeader',
      },
      {
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of GRI Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.

        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.

        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },

      {
        text: `Reporting Period: FY ${firstYear} (${finance_year})`,
        style: 'title',
        pageBreak: 'before',
      },
      {
        text: `GRI Content Index`,
        style: 'classHeader',
      },
      {
        table: {
          widths: [150, '*'],
          body: [
            ...[
              'Statement of Use',
              'GRI 1 used',
              'Applicable GRI Sector Standard(s)',
            ].map((data: string) => [
              {
                text: `${data}`,
                style: 'indexTable',
                margin: [0, 7, 0, 7],
              },
              '',
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
        margin: [0, 0, 0, 20],
      },

      ...[
        Gri2IndexData,
        Gri201Index,
        Gri202Index,
        Gri205Index,
        Gri206Index,
        Gri207Index,
        Gri301Index,
        Gri302Index,
        Gri303Index,
        Gri305Index,
        Gri306Index,
        Gri308Index,
        Gri401Index,
        Gri403Index,
        Gri404Index,
        Gri405Index,
        Gri414Index,
        Gri416Index,
      ]
        .map((res: any, index: number) => [
          {
            margin: [0, 0, 0, 10],
            table: {
              headerRows: 2, // Set to include both the "Disclosure" row and the column headers
              widths: [100, 480, 150], // Adjusted widths for three columns
              body: [
                // Disclosure Row
                [
                  {
                    text: res[0].Standard,
                    colSpan: 3, // The "Disclosure" row spans all three columns
                    bold: true,
                  },
                  {},
                  {},
                ],
                // Column Headers
                [
                  {
                    text: 'Disclosure',
                    fillColor: '#0D304A',
                    color: '#fff',
                    margin: [5, 5, 5, 5],
                    alignment: 'center', // Center align
                    bold: true,
                  },
                  {
                    text: 'Disclosure Title',
                    alignment: 'center', // Left align
                    fillColor: '#0D304A',
                    color: '#fff',
                    margin: [5, 5, 5, 5],
                    bold: true,
                  },
                  {
                    text: 'Location',
                    alignment: 'center', // Left align
                    fillColor: '#0D304A',
                    color: '#fff',
                    margin: [5, 5, 5, 5],
                    bold: true,
                  },
                ],
                // Data Rows
                ...res.map((data: any) => [
                  {
                    text: data.Disclosure,
                    alignment: 'center', // Center align the Disclosure column
                    margin: [5, 5, 5, 5],
                  },
                  {
                    text: data.Title,
                    alignment: 'left', // Left align the Title column
                    margin: [5, 5, 5, 5],
                  },
                  {
                    text: data.Location,
                    alignment: 'center', // Left align the Location column
                    margin: [5, 5, 5, 5],
                  },
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
          { text: '\n' }, // Adding a space after each table
          { text: '\n' },
        ])

        .flat(), // Use .flat() to flatten the array into a single array of objects

      ...data.flatMap((res: any, index: number) => [
        {
          text: `${res.category_name}`,
          style: 'classHeader',
        },
        ...res.sub_category.flatMap((subRes: any, subIndex: number) => [
          {
            margin: [0, 0, 0, 10],
            table: {
              headerRows: 2, // Set to include both the "Disclosure" row and the column headers
              widths: [100, 480, 150],
              body: [
                // Disclosure Row
                [
                  {
                    text: `Disclosure: ${
                      subRes?.sub_category_id !== null
                        ? subRes?.sub_category_id
                        : ''
                    } ${subRes?.sub_category_name}`,
                    colSpan: 3,
                    bold: true,
                  },
                  {},
                  {},
                ],
                // Column Headers
                [
                  {
                    text: 'S.No.',
                    fillColor: '#0D304A',
                    color: '#fff',
                    bold: true,
                    margin: [5, 5, 5, 5],
                    alignment: 'center',
                  },
                  {
                    text: 'Questions',
                    alignment: 'center',
                    fillColor: '#0D304A',
                    color: '#fff',
                    bold: true,
                    margin: [5, 5, 5, 5],
                  },
                  {
                    text: 'Response',
                    alignment: 'center',
                    fillColor: '#0D304A',
                    color: '#fff',
                    bold: true,
                    margin: [5, 5, 5, 5],
                  },
                ],
                // Data Rows
                ...subRes?.qna[0]?.questions?.map((question: any) => [
                  {
                    text: romanNumerals?.includes(question.question_id)
                      ? `${question.question_id})`
                      : question.question_id
                          .split('-')
                          .pop()
                          .slice(-2)
                          .toUpperCase(),
                    margin: [5, 5, 5, 5],
                    alignment: 'center',
                  },
                  {
                    text: question.question,
                    margin: [5, 5, 5, 5],
                    alignment: 'left',
                  },
                  {
                    text: question.answer,
                    margin: [5, 5, 5, 5],
                    alignment: 'center',
                  },
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
          // Adding space after each table
          { text: '\n' },
          { text: '\n' },
        ]),
      ]),
    ];

    var docDefinition: TDocumentDefinitions = {
      content: content,
      pageMargins: [36, 36, 36, 86],
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
      pageOrientation: 'landscape',
      styles: {
        header: {
          color: '#0E5563',
          fontSize: 20,
          bold: true,
          alignment: 'center',
        },
        subHeader: {
          alignment: 'left',
          fillColor: '#0E5563',
          color: 'white',
          margin: [0, 5, 0, 5],
        },
        classHeader: {
          alignment: 'left',
          fontSize: 18,
          bold: true,
          color: '#0D304A',
          margin: [0, 15, 0, 15],
        },
        indexTable: {
          fontSize: 13,
          bold: true,
          color: '#fff',
          fillColor: '#0D304A',
          margin: [0, 0, 30, 10],
        },
        disclaimer: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [0, 0, 5, 15],
        },
        title: {
          fontSize: 14,
          bold: true,
          color: '#060606',
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`GRI Report.pdf`);
  };

  const romanNumerals = [
    'i',
    'ii',
    'iii',
    'iv',
    'v',
    'vi',
    'vii',
    'viii',
    'ix',
    'x',
  ];

  function toRomanNumeral(index: number): string {
    return romanNumerals[index] || 'x';
  }

  const processQuestions = (dataArray: any) => {
    return dataArray.map((category: any) => ({
      ...category,
      sub_category: category.sub_category.map((subCategory: any) => ({
        ...subCategory,
        qna: subCategory.qna.map((qna: any) => ({
          ...qna,
          questions: qna.questions.flatMap((question: any, index: any) => {
            if (question.answer === 'Yes' && question.dependent_questions) {
              const updatedDependentQuestions =
                question.dependent_questions.map(
                  (depQuestion: any, depIndex: number) => ({
                    ...depQuestion,
                    question_id: toRomanNumeral(depIndex),
                  })
                );

              return [question, ...updatedDependentQuestions];
            }
            if (
              question.question_type === 'Multiresponse' &&
              question.sub_questions
            ) {
              const updatedDependentQuestions = question.sub_questions.map(
                (depQuestion: any, depIndex: number) => ({
                  ...depQuestion,
                  question_id: toRomanNumeral(depIndex),
                })
              );

              return [question, ...updatedDependentQuestions];
            }
            if (
              question.question_type === 'List' &&
              question.dependent_questions
            ) {
              const formattedAnswers = question.answer
                .map((answer: string, index: number) => {
                  return `${romanNumerals[index] || 'x'}) ${answer}`;
                })
                .join('\n');
              return [
                {
                  ...question,
                  answer: formattedAnswers,
                },
              ];
            }
            return [question];
          }),
        })),
      })),
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res = await get(`/report/generate_pdf/?entityID=${user.entity_Id}`);
      if (res.status === 'Success') {
        const updatedData = processQuestions(res?.response?.data);
        generatePdf(updatedData, res?.response);
      }
    } catch (err: any) {
      openToast({
        content: `${err.message}`,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfClick = () => {
    fetchData();
  };

  return (
    <Row>
      <Col lg={24}>
        <div className={Styles.pdfReport}>
          <Button
            loading={isLoading}
            onClick={handlePdfClick}
            style={{ cursor: 'pointer', border: 'none', background: 'none' }}
            icon={<DownloadIcon />}
          ></Button>
        </div>
      </Col>
    </Row>
  );
};

export default GriPdfReportWithIcon;
