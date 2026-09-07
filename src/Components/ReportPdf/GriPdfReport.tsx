import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Row, Col, Spin } from 'antd';
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
import PdfLastPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import {
  formatYearRange,
  getCurrentDate,
} from '../../Components/Emissions/Scope3/Helpers';

const pdfFonts = require('pdfmake/build/vfs_fonts');
const GriPdfReport = () => {
  const { user } = useAuth();
  const { openToast } = useNotification();
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);

  const generatePdf = async (data: any) => {
    setIsLoading(true);
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

    const HomeImage1 = await getBase64ImageFromUrl(PdfLastPageImge);
    const HomeLastImage = await getBase64ImageFromUrl(PdfLastPageImg);

    const content = [
      {
        image: HomeImage1,
        width: 800,
        height: 1000,
        absolutePosition: { x: 0, y: 0 },
        fit: [844, 1000],
      },
      {
        absolutePosition: { x: 30, y: 380 },
        stack: [
          {
            svg: `<svg width="400" height="140">
                    <rect width="400" height="140" fill="#000000" fill-opacity="0.4"/>
                  </svg>`,
          },
          {
            absolutePosition: { x: 40, y: 410 },
            text: 'GRI Report',
            fontSize: 40,
            bold: true,
            color: '#fff',
          },
          {
            absolutePosition: { x: 40, y: 470 },
            text: `Reporting Period FY ${formatYearRange(user.financial_year)} `,
            fontSize: 16,
            bold: true,
            color: '#fff',
          },
          {
            absolutePosition: { x: 40, y: 500 },
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
        text: `GRI Content Index`,
        style: 'classHeader',
        pageBreak: 'before',
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
      ].map((res: any, index: number) => ({
        margin: [0, 0, 0, 20],
        table: {
          widths: ['auto', 'auto', '*', '*'],
          body: [
            [
              {
                text: res[0].Standard,
                colSpan: 4,
              },
              {},
              {},
              {},
            ],
            [
              ...[
                'Disclosure',
                'Disclosure Title',
                'Location',
                'GRI Sector Standard Ref. No',
              ].map((data: string) => ({
                text: data,
                fillColor: '#00338D',
                color: '#fff',
                margin: [5, 5, 5, 5],
              })),
            ],
            ...res.map((data: any, index: number) => [
              data.Disclosure,
              data.Title,
              data.Location,
              data.Sector,
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
      })),

      ...data.flatMap((res: any, index: number) => [
        {
          text: `${res.category_name}`,
          style: 'classHeader',
        },
        ...res.sub_category.map((subRes: any, subIndex: number) => ({
          margin: [0, 0, 0, 20],
          table: {
            headerRows: 1,
            widths: [40, '*', '*'],
            body: [
              [
                {
                  text: `Disclosure: ${
                    subRes?.sub_category_id !== null
                      ? subRes?.sub_category_id
                      : ''
                  } ${subRes?.sub_category_name}`,
                  colSpan: 3,
                },
                {},
                {},
              ],
              [
                {
                  text: 'S.No.',
                  fillColor: '#00338D',
                  color: '#fff',
                  bold: true,
                  margin: [5, 5, 5, 5],
                },
                {
                  text: 'Questions',
                  alignment: 'center',
                  fillColor: '#00338D',
                  color: '#fff',
                  bold: true,
                  margin: [5, 5, 5, 5],
                },
                {
                  text: 'Response',
                  alignment: 'center',
                  fillColor: '#00338D',
                  color: '#fff',
                  bold: true,
                  margin: [5, 5, 5, 5],
                },
              ],
              ...subRes?.qna[0]?.questions?.map(
                (question: any, index: number) => [
                  {
                    text: romanNumerals?.includes(question.question_id)
                      ? `${question.question_id})`
                      : question.question_id
                          .split('-')
                          .pop()
                          .slice(-2)
                          .toUpperCase(),
                    margin: [5, 5, 5, 5],
                  },
                  {
                    text: question.question,
                    margin: [5, 5, 5, 5],
                  },
                  {
                    text: question.answer,
                    margin: [5, 5, 5, 5],
                  },
                ]
              ),
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
        })),
      ]),

      {
        image: HomeLastImage,
        width: 844,
        height: 400,
        pageBreak: 'before',
        absolutePosition: { x: 0, y: 0 },
        fit: [844, 400],
      },
      {
        text: 'Disclaimer',
        alignment: 'left',
        color: '#003085',
        bold: true,
        fontSize: 17,
        margin: [25, 360, 0, 0],
      },

      {
        text: 'This report is prepared solely for the use of Smart Sustain.AI, for the purpose of GRI Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above has context menu.',
        alignment: 'justify',
        fontFamily: 'Arial',
        fontSize: 12,
        margin: [25, 10, 25, 4],
      },
      {
        text: 'The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.',
        alignment: 'left',
        fontFamily: 'Arial',
        fontSize: 12,
        margin: [25, 0, 25, 10],
      },
    ];

    var docDefinition: TDocumentDefinitions = {
      content: content,
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
          color: '#003085',
          margin: [0, 15, 0, 15],
        },
        indexTable: {
          fontSize: 13,
          bold: true,
          color: '#fff',
          fillColor: '#00338D',
          margin: [0, 0, 0, 10],
        },
        disclaimer: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [0, 0, 15, 15],
        },
      },
    };

    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      const pdfUrl = URL.createObjectURL(blob);
      setPdfDataUrl(pdfUrl);
      setIsLoading(false);
      setShowDisclaimer(false);
    });
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
        if (res.response.status === true) {
          const updatedData = processQuestions(res?.response?.data);
          generatePdf(updatedData);
        } else {
          setShowDisclaimer(true);
        }
      } else {
        throw new Error(`Request failed with status: ${res.status}`);
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row>
      <Col lg={24}>
        <Spin className={Styles.spinnerPosition} spinning={isLoading}>
          {pdfDataUrl ? (
            <div style={{ maxHeight: '170vh' }}>
              <iframe
                src={pdfDataUrl}
                style={{ width: '100%', height: '85vh' }}
                title="PDF Viewer"
              />
            </div>
          ) : showDisclaimer ? (
            <Row justify="center" className="mt-4 mb-4">
              <Col span={22}>
                <PageCardComponent className={Styles.pageCardStyle}>
                  <div className="text-center p-4">
                    <NoDataImage />
                  </div>

                  <p className={Styles.dataNotFoundDesc}>
                    All Material Topics are currently being reviewed by our Data
                    Reviewers.
                    <br /> Please revisit this space for updates in the future.
                  </p>
                </PageCardComponent>
              </Col>
            </Row>
          ) : (
            ''
          )}
        </Spin>
      </Col>
    </Row>
  );
};

export default GriPdfReport;
