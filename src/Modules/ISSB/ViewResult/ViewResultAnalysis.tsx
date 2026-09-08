import React, { useEffect, useState } from 'react';
import { Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  ButtonComponent,
  PageCardComponent,
  TableComponent,
} from '../../../DesignLibrary';
import { useAuth } from '../../../Hooks/useAuth';
import Styles from './ViewResult.module.scss';
// Import PptxGenJS
import PptxGenJS from 'pptxgenjs';
import { get } from '../../../Services/api.service';
import PptIssbSvg from '../../../assets/Svg/ISSBSvg/PptIssbSvg';
import { useNavigate } from 'react-router-dom';

interface GapData {
  key: any;
  Topic: any;
  Disclosure: any;
  Summary: any;
}

const GapAnalysisTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<GapData[]>([]);
  const { user } = useAuth();

  const navigate = useNavigate();

  const fetchData = () => {
    get(`/issb/gap_analysis_report/?entity_Id=${user?.entity_Id}`)
      .then((res: any) => {
        const apiData = res?.response?.topics;

        const transformedData = apiData.map((item: any, index: number) => ({
          key: String(index + 1),
          Topic: item.topic,
          Disclosure: item.topic_sub,
          Summary: item.summary,
        }));

        setDataSource(transformedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [filteredInfo, setFilteredInfo] = useState<any>({});

  const columns: ColumnsType<GapData> = [
    {
      title: 'Topic',
      dataIndex: 'Topic',
      key: 'Topic',
      filters: dataSource
        ?.map((entry: any) => entry.Topic)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.Topic?.indexOf(value) === 0,
      filteredValue: filteredInfo?.Topic || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Disclosure Aspects',
      dataIndex: 'Disclosure',
      key: 'Disclosure',
    },
    {
      title: 'Summary of Gaps',
      dataIndex: 'Summary',
      key: 'Summary',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setFilteredInfo(filters);
  };

  const resetFilters = () => {
    setFilteredInfo({});
  };

  useEffect(() => {
    resetFilters();
  }, [window.location.href]);

  const downloadPPT = () => {
    const pptx = new PptxGenJS();
    const maxRowsPerSlide = 10;
    let currentSlide = pptx.addSlide();

    currentSlide.addText('Summary of ISSB gap analysis', {
      x: 0.5,
      y: 0.3,
      fontSize: 28,
      bold: true,
      color: '003399',
    });

    currentSlide.addText(
      'This table outlines the critical areas for improvement identified in our ISSB gap analysis.',
      { x: 0.5, y: 1.0, fontSize: 14 }
    );

    const headers = [
      [
        {
          text: 'Topic',
          options: { fill: { color: '003399' }, color: 'ffffff', bold: true },
        },
        {
          text: 'Disclosure aspects',
          options: { fill: { color: '003399' }, color: 'ffffff', bold: true },
        },
        {
          text: 'Summary of gaps',
          options: { fill: { color: '003399' }, color: 'ffffff', bold: true },
        },
      ],
    ];

    const tableRows = dataSource.map((item) => [
      {
        text: item.Topic,
        options: { valign: 'top', align: 'left' as PptxGenJS.HAlign },
      },
      {
        text: item.Disclosure,
        options: { valign: 'top', align: 'left' as PptxGenJS.HAlign },
      },
      {
        text: item.Summary,
        options: { valign: 'top', align: 'left' as PptxGenJS.HAlign },
      },
    ]);

    let currentTableData = [...headers];
    let rowCount = 0;

    tableRows.forEach((row: any, index) => {
      currentTableData.push(row);
      rowCount++;

      if (rowCount === maxRowsPerSlide || index === tableRows.length - 1) {
        console.log('Adding table data to slide:', currentTableData);

        currentSlide.addTable(currentTableData, {
          x: 0.5,
          y: 1.5,
          colW: [2.0, 3.0, 4.0],
          fontSize: 12,
          border: { pt: 1, color: 'C0C0C0' },
        });

        if (index !== tableRows.length - 1) {
          currentSlide = pptx.addSlide();
          currentTableData = [...headers];
          rowCount = 0;
        }
      }
    });

    currentSlide.addText(
      '© 2025 Smart Sustain.AI Services Pte. Ltd. All rights reserved.',
      { x: 0.5, y: 6.5, fontSize: 8, color: '666666' }
    );

    pptx
      .writeFile({ fileName: 'Gap_Analysis_Report.pptx' })
      .then(() => {
        console.log('PPT downloaded successfully.');
      })
      .catch((err: any) => {
        console.error('Error generating PPT:', err);
      });
  };

  return (
    <PageCardComponent>
      <div>
        {/* <div
          className={`d-flex justify-content-end align-items-center gap-3 mt-2 mb-2 ${Styles.cursorPointer}`}
        >
          <div
            className={`${Styles.ReportText} d-flex gap-3`}
            onClick={downloadPPT}
          >
            <div>
              <PptIssbSvg /> Download Gap Analysis Report
            </div>
          </div>
        </div> */}
        <Row justify="end" className="mb-3">
          <ButtonComponent onClick={() => navigate('/ISSB-Gap-Results')}>
            Add +
          </ButtonComponent>
        </Row>

        <TableComponent
          onchange={handleChange}
          columnHeader={columns}
          data={dataSource}
          enableRowSelection={false}
          isRowExpand={false}
          showOnlyCount={true}
        />
      </div>
    </PageCardComponent>
  );
};

export default GapAnalysisTable;
