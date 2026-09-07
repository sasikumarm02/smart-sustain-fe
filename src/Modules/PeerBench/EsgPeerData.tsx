import { useNavigate } from 'react-router-dom';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import Styles from './Peerbench.module.scss';
import { Row, Col, Image, Switch, message } from 'antd';
import EditIcon from '../../assets/Svg/EditIcon';
import { useEffect, useState } from 'react';
import { get, put } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';

function EsgPeerData() {
  const navigate = useNavigate();
  const [peerData, setPeerData] = useState<any[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const peerGetData = async () => {
    try {
      const url = `/peerBenchmarking/get_peer_benchmarking_values`;
      const res = await get(url);
      if (!isEmpty(res?.response) && res?.response) {
        const results = res?.response?.data;
        setPeerData(results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    peerGetData();
  }, []);

  const handleSwitchChange = (checked: boolean, record: any) => {
    // Open the modal to confirm the change
    setCurrentRecord(record);
    setNewStatus(checked ? 'Active' : 'Inactive');
    setIsOpen(true);
  };

  const confirmSwitchChange = async () => {
    // Proceed with updating the status after confirmation
    const updatedPeerData = peerData.map((item: any) =>
      item.id === currentRecord.id
        ? { ...item, activity_status: newStatus }
        : item
    );
    setPeerData(updatedPeerData);

    const queryParams = `id=${currentRecord.id}&activity_status=${newStatus}`;

    try {
      const resData = await put(
        `/peerBenchmarking/update_activity_status/?${queryParams}`,
        null
      );
      message.success(
        resData?.message || 'Activity status updated successfully'
      );
    } catch (error) {
      console.error('Error updating activity status:', error);
      message.error('Failed to update activity status');
    } finally {
      setIsOpen(false);
      setCurrentRecord(null);
      setNewStatus('');
    }
  };

  const columns = [
    {
      title: 'Industry Point',
      dataIndex: 'industry',
      key: 'industry',
      filters: peerData
        ?.map((entry: any) => entry.industry)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.industry?.indexOf(value) === 0,
      filteredValue: filteredInfo?.industry || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      filters: peerData
        ?.map((entry: any) => entry.company)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.company?.indexOf(value) === 0,
      filteredValue: filteredInfo?.company || null,
      filterSearch: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        // <Image
        //   src={EditIcon}
        //   alt="edit"
        //   preview={false}
        //   width={12}
        //   height={12}
        //   onClick={() => handleEditClick(record)}
        //   style={{ cursor: 'pointer', marginLeft: '15px' }}
        // />
        <EditIcon onClick={() => handleEditClick(record)} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'activity_status',
      key: 'activity_status',
      filters: peerData
        ?.map((entry: any) => entry.activity_status)
        .filter(
          (value: any, index: any, self: any) => self.indexOf(value) === index
        ) // Keeping only unique values
        .map((filterValue: any) => ({
          text: filterValue,
          value: filterValue,
        })),
      onFilter: (value: any, record: any) =>
        record?.activity_status?.indexOf(value) === 0,
      filteredValue: filteredInfo?.activity_status || null,
      filterSearch: true,
      render: (text: any, record: any) => (
        <Switch
          className={text === 'Active' ? Styles.greenSwitch : ''}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={text === 'Active'}
          onChange={(checked) => handleSwitchChange(checked, record)}
        />
      ),
    },
  ];

  const [postFilterRecords, setPostFilterRecords] = useState([]);
  // Function to handle filter changes
  const handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => {
    setFilteredInfo(filters);
    setPostFilterRecords(extra.currentDataSource);
  };

  const resetFilters = () => {
    setFilteredInfo({});
  };

  useEffect(() => {
    resetFilters();
  }, [window.location.href]);

  const handleEditClick = (record: any) => {
    navigate('/ESG-peer-data-edit', {
      state: {
        record,
        values: record.values,
        updatedStatus: record.activity_status,
      },
    });
  };

  return (
    <>
      <PageCardComponent className={Styles.pageCardPaddingPeermanage}>
        <Row>
          <Col span={24}>
            <Row align={'bottom'} justify={'space-between'}>
              <Col></Col>
              <Col>
                <ButtonComponent
                  onClick={() => navigate('/ESG-peer-data-edit')}
                >
                  Add +
                </ButtonComponent>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col span={24}>
                <TableComponent
                  onchange={handleChange}
                  postFilterRecords={postFilterRecords}
                  data={peerData}
                  columnHeader={columns}
                  enableRowSelection={false}
                  columnCheckBoxTitle="S.No."
                  columnCheckBoxDataAttribute="key"
                  isRowExpand={false}
                  showCountForCheckBox={true}
                  showOnlyCount={true}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <ModalComponent
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onProceed={confirmSwitchChange}
          content={`Do you want to change the activity status to ${newStatus}?`}
        />
      </PageCardComponent>
    </>
  );
}

export default EsgPeerData;
