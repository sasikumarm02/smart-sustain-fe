import { useEffect, useState } from 'react';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import ExcelComponent from '../../DesignLibrary/ExcelComponent';
import { isEmpty } from '../../Utils/isEmpty';
import moment from 'moment';

const AuditExcel = () => {
  const { user } = useAuth();
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(false);

  function formatDate(isoString: string): string {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    // Format the date
    const formattedDate = date
      .toLocaleString('en-GB', options)
      .replace(',', '');

    return formattedDate;
  }

  const fetchData = async () => {
    try {
      const response = await get(
        `/log/log_list/?entity_Id=${user?.entity_Id}&method=&start_date=&end_date=`
      );

      if (!isEmpty(response) && response?.status === 'Success') {
        const logData = response?.response?.data || [];

        // Set headers including S.No as the first column
        setHeaders([
          'S.No',
          'ID',
          'Username',
          'Role',
          'Timestamp',
          'Action Type',
          'Client Ip address',
          'Response Code',
          'Module',
          'Description',
        ]);

        // Format the data and add S.No
        const formattedData = logData.map((log: any, index: number) => {
          const date = moment.utc(log?.added_on).local();
          const newFormattedDate = date.isValid()
            ? date.format('DD-MMM-YYYY')
            : '-';
          const formattedTimeAgo = date.isValid()
            ? date.format('hh:mm A')
            : '-';
          const formattedRole = log?.role ? log.role.replace(/_/g, ' ') : '-';

          return {
            'S.No': index + 1,
            ID: log?.id || '-',
            Username: log?.userName || '-',
            Role: formattedRole || '-',
            Timestamp: `${newFormattedDate} ${formattedTimeAgo}`,
            'Action Type': log?.method || '-',
            'Client Ip address': log?.client_ip_address || '-',
            'Response Code': log?.status_code || '-',
            Module: log?.Module || '-',
            Description: log?.Description || '-',
          };
        });

        setData(formattedData);
        setIsTableVisible(true);
      } else {
        setHeaders([]);
        setData([]);
        setIsTableVisible(false);
      }
    } catch (error) {
      console.error('Error fetching audit log data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ExcelComponent
        filename="Audit Report"
        sheet="Audit Report"
        headers={headers}
        data={data}
        isTableVisible={isTableVisible}
      />
    </div>
  );
};

export default AuditExcel;
