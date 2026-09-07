import { useRef, useState } from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel-xlsx';
import ExcelIcon from '../../assets/svg/ExcelIcon';
import { isEmpty } from '../../Utils/isEmpty';
import { Button, message } from 'antd';

interface ExcelExportProps {
  filename: string;
  sheet: string;
  headers: string[];
  data: any[];
  isTableVisible?: boolean;
  columnWidths?: number[]; // Optional column widths
  alignLeftColumns?: string[];
}

const ExcelComponent: React.FC<ExcelExportProps> = ({
  filename,
  sheet,
  headers,
  data,
  isTableVisible,
  columnWidths,
  alignLeftColumns = [],
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleExcelClick = () => {
    if (data.length === 0) {
      message.warning('No data found');
      return;
    }

    // Show the spinner for a short period
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate a quick loading effect
  };

  return (
    <div>
      {data.length > 0 ? (
        <DownloadTableExcel
          filename={filename}
          sheet={sheet}
          currentTableRef={tableRef.current}
        >
          <Button
            loading={isLoading}
            onClick={handleExcelClick}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: 'none',
            }}
            icon={<ExcelIcon />}
          ></Button>
        </DownloadTableExcel>
      ) : (
        <Button
          loading={isLoading}
          onClick={handleExcelClick}
          style={{
            cursor: 'pointer',
            border: 'none',
            background: 'none',
          }}
          icon={<ExcelIcon />}
        ></Button>
      )}

      <table
        ref={tableRef}
        style={{
          display: 'none',
          borderCollapse: 'collapse',
          border: '1px solid black',
        }}
      >
        <colgroup>
          {columnWidths &&
            columnWidths.map((width, index) => (
              <col key={index} style={{ width: `${width}px` }} />
            ))}
        </colgroup>
        <thead>
          <tr>
            {!isEmpty(headers) &&
              headers?.map((header) => (
                <th
                  key={header}
                  style={{
                    border: '1px solid black',
                    padding: '5px',
                    textAlign: 'center',
                  }}
                >
                  {header}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {!isEmpty(data) &&
            data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      border: '1px solid black',
                      padding: '5px',
                      textAlign: alignLeftColumns.includes(header)
                        ? 'left'
                        : 'center',
                    }}
                  >
                    {row[header] || '-'}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExcelComponent;
