import React, { useEffect, useState } from 'react';
import pdfIcon from '../../assets/image/carbon-footprint-btn.png';
import { Button, Flex, Spin } from 'antd';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { get } from '../../Services';
import { message as notificationMessage } from 'antd';
import { useAuth } from '../../Hooks/useAuth';
import { formatNumberUS } from '../../Utils/Strings';
import PdfMainPageImge from '../../assets/Disclosure Page.png';
import PdfLastPageImg from '../../assets/finalpage.png';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import { isEmpty } from '../../Utils/isEmpty';
import { formatYearRange, getCurrentDate } from '../Emissions/Scope3/Helpers';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import DownloadPdf from '../../assets/Svg/DownloadPdf';
import styles from '../Emissions/Scope3/scope3.module.scss';

const pdfFonts = require('pdfmake/build/vfs_fonts');

const EmissionPdf = (report: any) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cat13data, setCat13Data] = useState<any>([]);

  const [reportingYear, setReportingYear] = useState<any>([]);

  const NodataArray = (cols: number, res: [any][any]) => {
    if (res.length !== 0) {
      return res;
    }

    return [
      Array.from({ length: cols }, () => ({
        text: 'No data',
        alignment: 'center',
        style: 'content',
      })),
    ];
  };

  function convertToMonthYear(timestamp: string): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    }; // Use proper literals
    return date.toLocaleDateString('en-US', options);
  }
  const start = convertToMonthYear(user?.financial_year[0]);
  const end = convertToMonthYear(user?.financial_year[1]);

  const fetchPdf = async (pdfData: any, reportYear: any) => {
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
    const content = [
      {
        image: HomeImage1,
        width: 800,
        height: 1000,
        absolutePosition: { x: 0, y: 0 },
        fit: [844, 1100],
      },
      {
        absolutePosition: { x: 30, y: 350 },
        stack: [
          {
            svg: `<svg width="520" height="140">
                    <rect width="520" height="140" fill="#000000" fill-opacity="0.4"/>
                  </svg>`,
          },
          {
            absolutePosition: { x: 40, y: 370 },
            text: 'GHG Emission Report',
            fontSize: 40,
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
        style: 'header2',
      },
      {
        text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of GHG Emission Report, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsover, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.

        The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.

        The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
        style: 'disclaimer',
        alignment: 'justify',
      },
      {
        text: 'GHG Emissions',
        style: 'header2',
        pageBreak: 'before',
      },
      {
        text: `Reporting Period FY ${reportYear}`,
        style: 'title',
      },
      {
        text: 'Total Carbon Emissions',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 2,
          widths: [50, 250, 100, 100, 100, 100],
          body: [
            [
              {
                text: 'S.No',
                rowSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'GHG Emission',
                rowSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Target',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
              {
                text: 'Actual',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
            ],
            [
              '',
              '',
              { text: 'kgCO₂e', alignment: 'center', style: 'tableHeader2' },
              { text: 'tCO₂e', alignment: 'center', style: 'tableHeader2' },
              { text: 'kgCO₂e', alignment: 'center', style: 'tableHeader2' },
              { text: 'tCO₂e', alignment: 'center', style: 'tableHeader2' },
            ],
            ...pdfData?.total_carbon_emission[0]?.data?.map(
              (data: any, index: any) => [
                {
                  text: data?.module === 'Total' ? '' : (index + 1).toString(),
                  alignment: 'center',
                  style: 'tableData',
                  fillColor: data?.module === 'Total' ? '#0D304A' : null,
                },
                {
                  text: data?.module,
                  alignment: 'center',
                  style: data?.module === 'Total' ? 'tableHeader' : 'tableData',
                  colspan: data?.module === 'Total' ? 2 : 1,
                  fillColor: data?.module === 'Total' ? '#0D304A' : null,
                },
                {
                  text: formatNumberUS(data?.target_kgCO2e),
                  alignment: 'center',
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.target_tCO2e),
                  alignment: 'center',
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_kgCO2e),
                  alignment: 'center',
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_tCO2e),
                  alignment: 'center',
                  style: 'tableData',
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
      },

      {
        text: 'Scope 1 Emissions',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 2,
          widths: [50, 250, 100, 100, 100, 100],
          body: [
            [
              { text: 'S.No', rowSpan: 2, style: 'tableHeader' },
              { text: 'Activity Type', rowSpan: 2, style: 'tableHeader' },
              {
                text: 'Target',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
              {
                text: 'Actual',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
            ],
            [
              '',
              '',
              { text: 'kgCO₂e', style: 'tableHeader2' },
              { text: 'tCO₂e', style: 'tableHeader2' },
              { text: 'kgCO₂e', style: 'tableHeader2' },
              { text: 'tCO₂e', style: 'tableHeader2' },
            ],
            ...pdfData?.scope1_module_wise_data[0]?.data.map(
              (data: any, index: any) => [
                {
                  text:
                    data?.activity_type === 'Total Scope 1 Emissions'
                      ? '' // Keep the cell blank
                      : (index + 1).toString(),
                  style: 'tableData',
                  fillColor:
                    data?.activity_type === 'Total Scope 1 Emissions'
                      ? '#0D304A'
                      : null, // Add the background color
                },
                {
                  text: data?.activity_type,
                  alignment: 'center',
                  style:
                    data?.activity_type === 'Total Scope 1 Emissions'
                      ? 'tableHeader'
                      : 'tableData',
                  colspan:
                    data?.activity_type === 'Total Scope 1 Emissions' ? 2 : 1,
                  fillColor:
                    data?.activity_type === 'Total Scope 1 Emissions'
                      ? '#0D304A'
                      : null, // Ensure color consistency
                },
                {
                  text: formatNumberUS(data?.target_kgCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.target_tCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_kgCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_tCO2e),
                  style: 'tableData',
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
      },

      {
        text: 'Scope 2 Emissions',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 2,
          widths: [50, 250, 100, 100, 100, 100],
          body: [
            [
              { text: 'S.No', rowSpan: 2, style: 'tableHeader' },
              { text: 'Activity Type', rowSpan: 2, style: 'tableHeader' },
              {
                text: 'Target',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
              {
                text: 'Actual',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
            ],
            [
              '',
              '',
              { text: 'kgCO₂e', style: 'tableHeader2' },
              { text: 'tCO₂e', style: 'tableHeader2' },
              { text: 'kgCO₂e', style: 'tableHeader2' },
              { text: 'tCO₂e', style: 'tableHeader2' },
            ],
            ...pdfData?.scope2_module_wise_data[0]?.data.map(
              (data: any, index: any) => [
                {
                  text:
                    data?.activity_type === 'Total Scope 2 Emissions'
                      ? ''
                      : (index + 1).toString(),
                  style: 'tableData',
                  fillColor:
                    data?.activity_type === 'Total Scope 2 Emissions'
                      ? '#0D304A'
                      : null,
                },
                {
                  text: data?.activity_type,
                  alignment: 'center',
                  style:
                    data?.activity_type === 'Total Scope 2 Emissions'
                      ? 'tableHeader'
                      : 'tableData',
                  colspan:
                    data?.activity_type === 'Total Scope 2 Emissions' ? 2 : 1,
                  fillColor:
                    data?.activity_type === 'Total Scope 2 Emissions'
                      ? '#0D304A'
                      : null,
                },
                {
                  text: formatNumberUS(data?.target_kgCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.target_tCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_kgCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_tCO2e),
                  style: 'tableData',
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
      },
      {
        text: 'Scope 3 Emissions',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 2,
          widths: [50, 250, 100, 100, 100, 100],
          body: [
            [
              { text: 'S.No', rowSpan: 2, style: 'tableHeader' },
              { text: 'Activity Type', rowSpan: 2, style: 'tableHeader' },
              {
                text: 'Target',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
              {
                text: 'Actual',
                colSpan: 2,
                alignment: 'center',
                style: 'tableHeader',
              },
              '',
            ],
            [
              '',
              '',
              { text: 'kgCO₂e', style: 'tableHeader2' },
              { text: 'tCO₂e', style: 'tableHeader2' },
              { text: 'kgCO₂e', style: 'tableHeader2' },
              { text: 'tCO₂e', style: 'tableHeader2' },
            ],
            ...pdfData?.scope3_module_wise_data[0]?.data.map(
              (data: any, index: any) => [
                {
                  text:
                    data?.module === 'Total Scope 3 Emissions '
                      ? ''
                      : (index + 1).toString(),
                  style: 'tableData',
                  fillColor:
                    data?.module === 'Total Scope 3 Emissions '
                      ? '#0D304A'
                      : null,
                },
                {
                  text:
                    data?.module === 'Total Scope 3 Emissions '
                      ? 'Total Selected Scope 3 Emissions' // Override title for display
                      : data?.module,
                  alignment: 'center',
                  style:
                    data?.module === 'Total Scope 3 Emissions '
                      ? 'tableHeader'
                      : 'tableData',
                  colspan: data?.module === 'Total Scope 3 Emissions ' ? 2 : 1,
                  fillColor:
                    data?.module === 'Total Scope 3 Emissions '
                      ? '#0D304A'
                      : null,
                },
                {
                  text: formatNumberUS(data?.target_kgCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.target_tCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_kgCO2e),
                  style: 'tableData',
                },
                {
                  text: formatNumberUS(data?.actual_tCO2e),
                  style: 'tableData',
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
      },
      {
        pageBreak: 'after',
        text: '',
      },

      {
        text: 'Emission Scope Inventory ',
        style: 'Maintitle',
      },
      { text: '\n' },
      {
        text: 'Scope 1 Emissions',
        style: 'title',
      },
      { text: '\n' },
      {
        text: ' A. Stationary Combustion ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 94, 94, 94, 94, 94, 96, 96],
          body: [
            [
              { text: 'S.No.', alignment: 'center', style: 'tableHeader' },
              { text: 'Fuel Type', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Total Quantity',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'UOM',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor Database',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor\n(kgCO₂e/unit)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in kgCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in tCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
            ],
            ...(pdfData?.inDepth_data_for_scope1[0]?.data.length
              ? pdfData?.inDepth_data_for_scope1[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.fuel,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_name || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission / 1000),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 8, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            // Conditionally add the "Total" row
            ...(pdfData?.inDepth_data_for_scope1[0]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.inDepth_data_for_scope1[0]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.total_emission || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []), // If data array is empty, skip the "Total" row
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
        text: ' B. Mobile Combustion ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              { text: 'S.No.', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Vehicle Type',
                alignment: 'center',
                style: 'tableHeader',
              },
              { text: 'Fuel Type', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Total Quantity',
                alignment: 'center',
                style: 'tableHeader',
              },
              { text: 'UOM', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Emission Factor Database',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor\n(kgCO₂e/unit)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in kgCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in tCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
            ],
            ...(pdfData?.inDepth_data_for_scope1[1]?.data.length
              ? pdfData?.inDepth_data_for_scope1[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData?.vehicle_type,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.fuel,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_name || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit || 0),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission / 1000),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            // Conditionally add the "Total" row
            ...(pdfData?.inDepth_data_for_scope1[1]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.inDepth_data_for_scope1[1]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.total_emission || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' C. Process Emissions',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 83, 83, 83, 83, 83, 83, 83, 83],
          body: [
            [
              { text: 'S.No.', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Equipment Type',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Quantity',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'UOM',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor Database',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Gas or refrigerant',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor\n(kgCO₂e/unit)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in kgCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in tCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
            ],
            ...(pdfData?.inDepth_data_for_scope1[2]?.data?.length
              ? pdfData?.inDepth_data_for_scope1[2]?.data?.map(
                  (subData: any, index: any) => [
                    { text: index + 1, alignment: 'center', style: 'content' },
                    {
                      text: subData.equipment_type,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_name || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.gas_or_refrigerant),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(
                        subData?.kg_CO2e_per_unit !== null
                          ? subData?.kg_CO2e_per_unit
                          : 0
                      ),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission / 1000),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            // Conditionally add the "Total" row
            ...(pdfData?.inDepth_data_for_scope1[2]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.inDepth_data_for_scope1[2]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.total_emission || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' D. Fugitive Emissions',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 83, 83, 83, 83, 83, 83, 83, 83],
          body: [
            [
              { text: 'S.No.', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Equipment Type',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Quantity',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'UOM',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor Database',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Gas or refrigerant',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor\n(kgCO₂e/unit)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in kgCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in tCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
            ],
            ...(pdfData?.inDepth_data_for_scope1[3]?.data?.length
              ? pdfData?.inDepth_data_for_scope1[3]?.data?.map(
                  (subData: any, index: any) => [
                    { text: index + 1, alignment: 'center', style: 'content' },
                    {
                      text: subData.equipment_type,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_name || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.gas_or_refrigerant),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(
                        subData?.kg_CO2e_per_unit !== null
                          ? subData?.kg_CO2e_per_unit
                          : 0
                      ),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission / 1000),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            // Conditionally add the "Total" row
            ...(pdfData?.inDepth_data_for_scope1[3]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.inDepth_data_for_scope1[3]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.total_emission || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },
      {
        text: 'Scope 2 Emissions',
        style: 'title',
      },
      { text: '\n' },
      {
        style: 'tableExample',
        table: {
          widths: [30, 83, 83, 83, 83, 83, 83, 83, 83],
          body: [
            [
              { text: 'S.No.', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Vehicle Type ',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Quantity',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'UOM',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor Database',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Source of Energy',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor\n(kgCO₂e/unit)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in kgCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in tCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
            ],
            ...(pdfData?.inDepth_data_for_scope2[0]?.data.length
              ? pdfData?.inDepth_data_for_scope2[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.vehicle_type || '-',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_name || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.source_of_energy),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(
                        subData?.kg_CO2e_per_unit !== null
                          ? subData?.kg_CO2e_per_unit
                          : 0
                      ),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission / 1000),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            // Conditionally add the "Total" row
            ...(pdfData?.inDepth_data_for_scope2[0]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.inDepth_data_for_scope1[0]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.total_emission || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },

      {
        text: 'Scope 3 Emissions',
        style: 'title',
      },
      { text: '\n' },
      {
        text: ' A.  Category 1 - Purchased Goods and Services ',
        style: 'Maintitle',
      },
      { text: '\n' },
      {
        text: ' a. Average-data Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              { text: 'S.No.', alignment: 'center', style: 'tableHeader' },
              {
                text: 'Purchased Goods and Services ',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Quantity',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'UOM',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor Database',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Material',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Emission Factor \n(kgCO₂e/unit)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in kgCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
              {
                text: 'Total Emission\n(in tCO₂e)',
                alignment: 'center',
                style: 'tableHeader',
              },
            ],
            ...(pdfData?.scope_three[0]?.data[0]?.data.length
              ? pdfData.scope_three[0]?.data[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData['Purchased Goods and Services'],
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.material),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            // Conditionally add the "Total" row
            ...(pdfData?.scope_three[0]?.data[0]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[0]?.data[0]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[0]?.data[0]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' b. Spend-based Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Purchased Goods and Services',
              'Amount',
              'Currency ',
              'Emission Factor Database',
              'NAICS Code & Title ',
              'Emission Factor \n(kgCO₂e/USD)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[0]?.data[1]?.data.length
              ? pdfData?.scope_three[0]?.data[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData['Purchased Goods and Services'],
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.amount),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.currency,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.naics_code_title),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[0]?.data[1]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[0]?.data[1]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[0]?.data[1]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' c. Supplier-specific Method  ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Purchased Goods and Services',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor ',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[0]?.data[2]?.data.length
              ? pdfData?.scope_three[0]?.data[2]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData['Purchased Goods and Services'],
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.emission_factor),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[0]?.data[2]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[0]?.data[2]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[0]?.data[2]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },

      {
        text: ' B.  Category 2 - Capital Goods ',
        style: 'Maintitle',
      },
      { text: '\n' },
      {
        text: ' a. Average-data Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Type of Capital Goods',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Material ',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[1]?.data[0]?.data.length
              ? pdfData?.scope_three[1]?.data[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData['Purchased Goods and Services'],
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.material),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[1]?.data[0]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[1]?.data[0]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[1]?.data[0]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' b. Spend-based Method  ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Type of Capital Goods',
              'Amount ',
              'Currency ',
              'Emission Factor Database',
              'NAICS Code & Title ',
              'Emission Factor \n(kgCO₂e/USD)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[1]?.data[1]?.data.length
              ? pdfData?.scope_three[1]?.data[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData['Purchased Goods and Services'],
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.amount),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.currency,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.naics_code_title),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[1]?.data[1]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[1]?.data[1]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[1]?.data[1]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' c. Supplier Specific Method  ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Type of Capital Goods',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor ',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[1]?.data[2]?.data.length
              ? pdfData?.scope_three[1]?.data[2]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData['Purchased Goods and Services'],
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.emission_factor),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[1]?.data[2]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[1]?.data[2]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[1]?.data[2]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },

      {
        text: ' C.  Category 3 - Fuel & Energy-related Activities ',
        style: 'Maintitle',
      },
      { text: '\n' },
      {
        text: ' a. Upstream Emissions of Purchased Fuels  ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 94, 94, 94, 94, 96, 96, 96],
          body: [
            [
              'S.No.',
              'Fuel Type ',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[2]?.data[0]?.data.length
              ? pdfData?.scope_three[2]?.data[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.fuel_type,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 8, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[2]?.data[0]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[2]?.data[0]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[2]?.data[0]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' b. Upstream Emissions of Purchased Electricity   ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Source of Energy ',
              'Quantity of Electricity Purchased',
              'UOM',
              'Vehicle Type',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[2]?.data[1]?.data.length
              ? pdfData?.scope_three[2]?.data[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.source_of_energy || '-',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.quantity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.vehicle_type || '-',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[2]?.data[1]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[2]?.data[1]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[2]?.data[1]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' c. Transmission and Distribution (T&D) losses ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'T&D Loss Rate \n(%) ',
              'Activity ',
              'Energy Consumed ',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[2]?.data[2]?.data.length
              ? pdfData?.scope_three[2]?.data[2]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.t_and_d_loss_rate,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.activity),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.energy_purchased,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[2]?.data[2]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[2]?.data[2]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[2]?.data[2]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' d. Generation of Purchased Electricity that is sold to end users ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 94, 94, 94, 94, 96, 96, 96],
          body: [
            [
              'S.No.',
              'Activity ',
              'Quantity of Electricity Purchased for Resale and Sold to End Users  ',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[2]?.data[3]?.data.length
              ? pdfData?.scope_three[2]?.data[3]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.activity,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.electricity_purchased),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 8, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[2]?.data[3]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[2]?.data[3]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[2]?.data[3]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },

      {
        text: ' D. Category 5 - Waste Generated in Operations ',
        style: 'Maintitle',
      },
      { text: '\n' },
      {
        text: ' a. Supplier-specific Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [145, 145, 145, 145, 145],
          body: [
            [
              'S.No.',
              'Allocated Scope 1 Emission \n(tCO₂e) ',
              'Allocated Scope 2 Emission \n(tCO₂e)  ',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[3]?.data[0]?.data.length
              ? pdfData?.scope_three[3]?.data[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.allocated_scope1_emission,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.allocated_scope2_emission),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emissions_kg_co2e,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emissions_t_co2e || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 5, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[3]?.data[0]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[3]?.data[0]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[3]?.data[0]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"

                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' b. Waste-type Specific Method  ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Waste Type ',
              'Waste Treatment ',
              'Quantity of Waste Produced',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[3]?.data[1]?.data.length
              ? pdfData?.scope_three[3]?.data[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.waste_type,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.waste_treatment),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.quantity,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[3]?.data[1]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[3]?.data[1]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[3]?.data[1]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' c. Average-data Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Waste Treatment ',
              'Total Waste Produced ',
              'Proportion \n(100%)',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[3]?.data[2]?.data.length
              ? pdfData?.scope_three[3]?.data[2]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.waste_treatment,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_waste),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.proportion,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[3]?.data[2]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[3]?.data[2]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[3]?.data[2]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },

      {
        text: ' E.  Category 6 -  Business Travel',
        style: 'Maintitle',
      },
      { text: '\n' },
      {
        text: ' a. Fuel-based Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Transport Mode ',
              'Fuel Type ',
              'Quantity of Fuel Consumed ',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[4]?.data[0]?.data.length
              ? pdfData?.scope_three[4]?.data[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.transport_mode,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.fuel_type),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.quantity,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[4]?.data[0]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[4]?.data[0]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[4]?.data[0]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' b. Distance-based Method  ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Transport Mode ',
              'Travel Class',
              'No. of employees ',
              'No. of Trips ',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[4]?.data[1]?.data.length
              ? pdfData?.scope_three[4]?.data[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.transport_mode,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.travel_class),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.no_of_employees,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.no_of_trips,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[4]?.data[1]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[4]?.data[1]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[4]?.data[1]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' c. Spend-based Method   ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 94, 94, 94, 94, 94, 96, 96],
          body: [
            [
              'S.No.',
              'Transport Mode ',
              'Amount spent ',
              'Currency ',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/USD)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[4]?.data[2]?.data.length
              ? pdfData?.scope_three[4]?.data[2]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.transport_mode,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.amount),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.currency,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 8, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[4]?.data[2]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[4]?.data[2]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[4]?.data[2]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' d. Accommodation Method',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 112, 110, 110, 112, 112, 112],
          body: [
            [
              'S.No.',
              'Destination Country ',
              'Number of Nights ',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[4]?.data[3]?.data.length
              ? pdfData?.scope_three[4]?.data[3]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.country,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.no_of_nights),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 7, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[4]?.data[3]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[4]?.data[3]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[4]?.data[3]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        pageBreak: 'after',
        text: '',
      },

      {
        text: ' F.  Category 13 -  Downstream Leased Assets',
        style: 'Maintitle',
      },
      { text: '\n' },

      {
        text: ' a. Asset-specific Method with Sub-Meter ',
        style: 'title',
      },

      { text: '\n' },
      {
        text: ' 1. Stationary Combustion ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 82, 82, 82, 82, 82, 82, 82, 82],
          body: [
            [
              'S.No.',
              'Lessee Name',
              'Fuel Type',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[5]?.data[0]?.data.length
              ? pdfData?.scope_three[5]?.data[0]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.lessee_name,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.fuel,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.qty,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission_kgco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission_tco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 9, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[5]?.data[0]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.scope_three[5]?.data[0]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.emissions_kg_co2e || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' 2. Process Emissions ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 72, 72, 72, 72, 72, 72, 72, 72, 72],
          body: [
            [
              'S.No.',
              'Lessee Name',
              'Equipment Type',
              'Gas/Refrigerant',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[5]?.data[1]?.data.length
              ? pdfData?.scope_three[5]?.data[1]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.lessee_name,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.equipmentType,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.gas_or_refrigerant,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.qty,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission_kgco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission_tco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 10, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[5]?.data[1]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.scope_three[5]?.data[1]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.emissions_kg_co2e || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' 3. Fugitive Emissions ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 72, 72, 72, 72, 72, 72, 72, 72, 72],
          body: [
            [
              'S.No.',
              'Lessee Name',
              'Equipment Type',
              'Gas/Refrigerant',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[5]?.data[2]?.data.length
              ? pdfData?.scope_three[5]?.data[2]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.lessee_name,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.equipmentType,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.gas_or_refrigerant,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.qty,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission_kgco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.total_emission_tco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 10, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[5]?.data[2]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.scope_three[5]?.data[2]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.emissions_kg_co2e || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' 4. Energy Combustion ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 72, 72, 72, 72, 72, 72, 72, 72, 72],
          body: [
            [
              'S.No.',
              'Lessee Name',
              'Energy Source',
              'Vehicle Type',
              'Total Quantity',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[5]?.data[3]?.data.length
              ? pdfData?.scope_three[5]?.data[3]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.lessee_name,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.source_of_energy,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.vehicle_type,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.qty,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.UOM,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission_kgco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.total_emission_tco2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 10, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[5]?.data[3]?.data.length
              ? [
                  (() => {
                    const emissionsData: any[] =
                      pdfData?.scope_three[5]?.data[3]?.data || '';

                    const totalKgCO2e: any = emissionsData
                      .map((subData: any) => subData.emissions_kg_co2e || 0)
                      .reduce((sum: any, val: any) => sum + val, 0);

                    const totalTCO2e: any = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' b. Asset-specific Method without Sub-Meter ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 95, 95, 95, 95, 95, 95, 95],
          body: [
            [
              'S.No.',
              'Fuel ',
              'Fuel Consumed ',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(cat13data?.length
              ? cat13data?.map((subData: any, index: any) => [
                  { text: index + 1, alignment: 'center', style: 'tableData' },
                  {
                    text: subData.fuel,
                    alignment: 'center',
                    style: 'tableData',
                  },
                  {
                    text: formatNumberUS(subData.fuel_consumed),
                    alignment: 'center',
                    style: 'tableData',
                  },
                  {
                    text: subData.uom,
                    alignment: 'center',
                    style: 'tableData',
                  },
                  {
                    text: subData.emission_factor_database || 'UK-DEFRA',
                    alignment: 'center',
                    style: 'tableData',
                  },
                  {
                    text: formatNumberUS(subData?.kg_CO2e_per_unit),
                    alignment: 'center',
                    style: 'tableData',
                  },
                  {
                    text: formatNumberUS(subData?.total_emission),
                    alignment: 'center',
                    style: 'tableData',
                  },
                  {
                    text: formatNumberUS(subData?.total_emission / 1000),
                    alignment: 'center',
                    style: 'tableData',
                  },
                ])
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 8, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(cat13data.length
              ? [
                  (() => {
                    const emissionsData: any[] = cat13data || '';

                    const totalKgCO2e: number = emissionsData
                      .map((subData: any) => {
                        return subData.total_emission || 0; // Default to 0 for null/undefined
                      })
                      .reduce((sum: number, val: number) => sum + val, 0);

                    const totalTCO2e: number = totalKgCO2e / 1000;

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' c. Lessee-specific Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 70, 70, 70, 70, 70, 70, 70, 74, 74],
          body: [
            [
              'S.No.',
              'Lessee Name',
              'Total Lessee’s Scope 1 and 2 emissions',
              'UOM',
              'Leased Assest Area/Volume/Quantity',
              'Leased Assest UOM',
              'Total Leased Assest Area/Volume/Quantity',
              'Total Leased Assest UOM',
              'Total Downstream Leased Assets Emissions​ (kgCO2e)',
              'Total Downstream Leased Assets Emissions​ (tCO2e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[5]?.data[5]?.data.length
              ? pdfData?.scope_three[5]?.data[5]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.lessee_name,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.total_lessee_scope1_scope2_emission,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.total_scope1_scope2_uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.lessee_asset_area_vol_qty,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData?.lessee_asset_uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.total_lessee_asset_area_vol_qty,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.total_lessee_asset_uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.total_downstream_lessed_asset_kgco2e,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.total_downstream_lessed_asset_tco2e,
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 10, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[5]?.data[5]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[5]?.data[5]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[5]?.data[5]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
        text: ' d. Average-data Method ',
        style: 'title',
      },
      {
        style: 'tableExample',
        table: {
          widths: [30, 72, 72, 72, 72, 72, 72, 72, 72, 72],
          body: [
            [
              'S.No.',
              'Lessee Name',
              'Category ',
              'Description ',
              'Quantity of Fuel Consumed ',
              'UOM',
              'Emission Factor Database',
              'Emission Factor \n(kgCO₂e/unit)',
              'Total Emission \n(in kgCO₂e)',
              'Total Emission \n(in tCO₂e)',
            ].map((data) => ({
              text: data,
              alignment: 'center',
              style: 'tableHeader',
            })),
            ...(pdfData?.scope_three[5]?.data[6]?.data.length
              ? pdfData?.scope_three[5]?.data[6]?.data.map(
                  (subData: any, index: any) => [
                    {
                      text: index + 1,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData?.lessee_name,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData?.category,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.description),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.quantity,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.uom,
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: subData.emission_factor_database || 'UK-DEFRA',
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData?.kg_CO2e_per_unit),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_kg_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                    {
                      text: formatNumberUS(subData.emissions_t_co2e),
                      alignment: 'center',
                      style: 'tableData',
                    },
                  ]
                )
              : [
                  [
                    {
                      text: 'No Data Available',
                      colSpan: 10, // Span across all columns
                      alignment: 'center',
                      style: 'tableData',
                      fillColor: 'white',
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                  ],
                ]),
            ...(pdfData?.scope_three[5]?.data[6]?.data.length
              ? [
                  (() => {
                    const totalKgCO2e: any =
                      pdfData?.scope_three[5]?.data[6]?.total_kgco2e || '';

                    const totalTCO2e: any =
                      pdfData?.scope_three[5]?.data[6]?.total_tco2e || '';

                    return [
                      {
                        text: 'Total',
                        colSpan: 2,
                        alignment: 'center',
                        style: 'tableHeader',
                        fillColor: '#0D304A', // Background color for "Total"
                      },
                      {}, // Spanned column for "Fuel Type"
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: '-',
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalKgCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                      {
                        text: formatNumberUS(totalTCO2e),
                        alignment: 'center',
                        style: 'tableData',
                        fillColor: 'white',
                      },
                    ];
                  })(),
                ]
              : []),
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
            margin: [0, -8, 0, 20], //[left, top, right, bottom]
          };
        }
      },
      styles: {
        disclaimer: {
          fontSize: 12,
          bold: false,
          color: '#060606',
          margin: [15, 0, 15, 15],
        },
        titleOne: {
          alignment: 'center',
          bold: true,
          color: '#00737B',
        },
        header: {
          fillColor: '#00737B',
          color: '#fff',
          bold: true,
          margin: [0, 10],
        },
        header2: {
          fontSize: 18,
          bold: true,
          margin: [15, 20, 0, 10],
          alignment: 'left',
          color: '#0D304A',
          fontWeight: 'bold',
          fontFamily: 'Arial',
        },
        subheader: {
          fillColor: '#00737B',
          color: '#fff',
          bold: true,
          margin: [0, 10],
        },
        content: {
          fontSize: 8,
          color: '#060606',
          fontFamily: 'Arial',
          alignment: 'center',
          margin: [0, 10, 0, 4],
        },
        footer: {
          margin: [0, 10],
          alignment: 'center',
        },
        title: {
          fontSize: 12,
          bold: true,
          color: '#060606',
          margin: [15, 5, 0, 0],
          fontFamily: 'Arial',
        },
        Maintitle: {
          fontSize: 12,
          bold: true,
          color: '#0D304A',
          margin: [15, 10, 0, 0],
          fontFamily: 'Arial',
        },
        Semititle: {
          bold: true,
          color: '#00737B',
          margin: [15, 10, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: '#fff',
          fillColor: '#0D304A',
          fontFamily: 'Arial',
          alignment: 'center',
          margin: [0, 10, 0, 5],
        },
        tableHeader2: {
          bold: true,
          fontSize: 8,
          color: '#fff',
          fillColor: '#416680',
          fontFamily: 'Arial',
          alignment: 'center',
          margin: [0, 10, 0, 5],
        },
        tableData: {
          fontSize: 8,
          color: '#060606',
          fontFamily: 'Arial',
          alignment: 'center',
          margin: [0, 10, 0, 4],
        },
        tableExample: {
          margin: [15, 3, 0, 15],
        },

        footer2: {
          fontSize: 10,
          color: '#060606',
          margin: [0, 6, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('GHG Emission Report.pdf');
  };

  function fetchApiData() {
    setIsLoading(true);
    get(`/Emissions/emissions_overview_for_pdf/?entity_Id=${user.entity_Id}`)
      .then((res: any) => {
        if (res?.status === 'Success') {
          if (res.response.status === true) {
            setReportingYear(res?.response);
            fetchPdf(res.response.data, res?.response?.['Reporting Period FY']);
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        notificationMessage.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const getCat13data = () => {
    get(
      `/scope3_cat13/preload_data_for_scope1_and_scope2/?entity_Id=${user.entity_Id}`
    )
      .then((res) => {
        if (res?.status === 'Success') {
          const result =
            res?.response?.data?.inDepth_data_for_scope1_and_scope2;
          if (!isEmpty(result)) {
            setCat13Data(result);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getCat13data();
  }, []);

  return (
    <>
      {isEmpty(report) ? (
        <Flex>
          <Button
            loading={isLoading}
            onClick={() => fetchApiData()}
            className={styles.pdfButton}
            icon={<DownloadPdf />}
          ></Button>
        </Flex>
      ) : (
        <Button
          loading={isLoading}
          onClick={() => fetchApiData()}
          style={{ border: 'none', marginTop: '-10px', background: 'none ' }}
          icon={<DownloadIcon />}
        ></Button>
      )}
    </>
  );
};

export default EmissionPdf;
