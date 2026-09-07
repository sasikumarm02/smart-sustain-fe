import { useEffect, useState } from 'react';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import ExcelComponent from '../../DesignLibrary/ExcelComponent';
import { isEmpty } from '../../Utils/isEmpty';
import { formatNumberUS } from '../../Utils/Strings';

const PeerExcel = ({ selectedYear }: any) => {
  const { user } = useAuth();
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [alignLeftColumns, setAlignLeftColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await get(
        `/peerBenchmarking/pb_pdf/?entity_Id=${user?.entity_Id}${
          selectedYear ? `&financial_year=${selectedYear}` : ''
        }`
      );

      if (!isEmpty(response) && response) {
        const newValueData = response?.value_data || [];

        const valueCompanyNames = newValueData.length
          ? Object.keys(newValueData[0].data)
          : [];

        setHeaders([
          'Data Point',
          'UOM',
          'Material Topic',
          ...valueCompanyNames,
        ]);
        setAlignLeftColumns([
          'Data Point',
          'UOM',
          'Material Topic',
          ...valueCompanyNames,
        ]);

        const newData = newValueData.map((topic: any) => ({
          'Data Point': topic['Data Point'] || '-',
          UOM: topic['UOM'] || '-',
          'Material Topic': topic.material_topic || '-',
          ...valueCompanyNames.reduce((acc: any, company: string) => {
            const companyValue = topic.data[company];

            acc[company] =
              !isNaN(companyValue) && companyValue !== null
                ? formatNumberUS(companyValue)
                : companyValue || '-';
            return acc;
          }, {}),
        }));

        setData(newData);

        const fixedWidths = [200, 200, 200]; // Fixed widths for 'Data Point' and 'UOM'
        const dynamicWidths = valueCompanyNames.map(() => 200); // Example width for company columns
        setColumnWidths([...fixedWidths, ...dynamicWidths]);
        setIsTableVisible(true);
      } else {
        setHeaders([]);
        setData([]);
        setIsTableVisible(false);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  return (
    <div>
      <ExcelComponent
        filename="Peers Benchmarking Report"
        sheet="Peers Benchmarking Report"
        headers={headers}
        data={data}
        isTableVisible={isTableVisible}
        columnWidths={columnWidths}
        alignLeftColumns={alignLeftColumns}
      />
    </div>
  );
};

export default PeerExcel;
