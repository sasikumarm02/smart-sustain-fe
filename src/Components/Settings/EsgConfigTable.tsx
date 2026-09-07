import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
  TableComponent,
} from '../../DesignLibrary';
import ViewIcon from '../../assets/Svg/viewIcon';
import EditIcon from '../../assets/Svg/EditIcon';
import { Col, message, Row, Switch } from 'antd';
import Styles from './Setting.module.scss';
import { get, put } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { useAuth } from '../../Hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EsgConfigTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | undefined>();
  const [data, setData] = useState<any[]>([]);
  const [pendingToggle, setPendingToggle] = useState<{
    entity_Id: any;
    framework_Id: any;
  } | null>(null);

  const [entityData, setEntityData] = useState<any>([]);

  const fetchEntityData = (apiUrl: string) => {
    get(apiUrl)
      .then((res) => {
        if (
          !isEmpty(res) &&
          !isEmpty(res?.response) &&
          !isEmpty(res?.response?.status) &&
          res?.response?.status !== false
        ) {
          const data = !isEmpty(res?.response?.data) && res?.response?.data;

          setEntityData(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  };

  useEffect(() => {
    fetchEntityData('/entity/getEntitiesListByUserId/');
  }, []);

  const getConfigData = async () => {
    try {
      const res = await get(
        `/framework/get_ESGframework/?entity_Id=${user?.entity_Id}`
      );
      if (!isEmpty(res?.response?.data)) {
        const responseData = res.response.data;
        setData(responseData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching ESG configuration data:', error);
    }
  };

  useEffect(() => {
    getConfigData();
  }, []);

  const tableData = data.map((item) => {
    const fyMatch = item.financial_year.match(/^(\w{3}) (\d{4})/); // match first month and year
    const fyYear = fyMatch ? fyMatch[2] : ''; // extract the first year
    return {
      key: item.id,
      financial_year: `FY ${fyYear} (${item.financial_year})`,
      frameworks: item.frameworks.join(', '),
      status: item.status,
      entity_Id: item.entity_Id,
      framework_Id: item.framework_Id,
    };
  });

  const columns = [
    {
      title: 'Reporting Period',
      dataIndex: 'financial_year',
      key: 'financial_year',
      type: 'text',
    },
    {
      title: 'Frameworks',
      dataIndex: 'frameworks',
      key: 'frameworks',
      type: 'text',
    },
    {
      title: 'Active/Inactive',
      dataIndex: 'status',
      key: 'status',
      type: 'text',
      render: (text: any, record: any) => (
        <Switch
          className={text === 'Active' ? Styles.greenSwitch : ''}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={text === 'Active'}
          onChange={() => {
            if (user.role === 'ESG_ASSURER') {
              // Show popup for assurer role
              setErrMsg("Assurer can't change the status.");
              setIsOpen(true);
              return; // Exit early to prevent further logic
            }
            if (text === 'Active') {
              setErrMsg(
                'We cannot make it inactive. The system requires one active reporting period.'
              );
              setIsOpen(true);
            } else {
              setErrMsg(
                'If you want to make this active, the remaining reporting periods will become inactive.'
              );
              setIsOpen(true);
              setPendingToggle({
                entity_Id: record.entity_Id,
                framework_Id: record.framework_Id,
              });
            }
          }}
        />
      ),
    },
    {
      title: 'View',
      dataIndex: 'view',
      key: 'view',
      type: 'text',
      render: (text: any, record: any) => (
        <div
          // className={Styles.iconCenter}
          onClick={() => {
            // Find the full record in data based on record.key
            const fullRecord = data.find((item) => item.id === record.key);
            navigate('/view-config', { state: fullRecord }); // Pass the full record object as state
          }}
        >
          <ViewIcon />
        </div>
      ),
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      key: 'edit',
      type: 'text',
      render: (text: any, record: any) => (
        <div>
          <EditIcon
            onClick={() => {
              // Find the full record in data based on record.key
              const fullRecord = data.find((item) => item.id === record.key);
              navigate('/esg-config-edit', { state: fullRecord }); // Pass the full record object as state
            }}
          />
        </div>
      ),
    },
  ];

  const filteredColumns = columns.filter((column) => {
    if (user.role === 'ESG_ASSURER' && column.key === 'edit') {
      return false; // Exclude "Active/Inactive" and "Edit" columns for non-admin users
    }
    return true; // Include other columns
  });

  const activityStatus = async (entity_Id: any, framework_Id: any) => {
    const payload = {
      entity_Id,
      framework_Id,
    };

    try {
      const resData = await put(
        '/framework/update_esg_framework_status/',
        payload
      );
      message.success(resData?.message);
      await getConfigData();
      await fetchEntityData('/entity/getEntitiesListByUserId/');
    } catch (error: any) {
      console.error('Error submitting data:', error);
      message.warning(
        error?.response?.data?.message || 'Failed to update status.'
      );
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    if (pendingToggle) {
      activityStatus(pendingToggle.entity_Id, pendingToggle.framework_Id);
      setPendingToggle(null);
    }
  };

  return (
    <>
      <PageCardComponent style={{ border: '1px solid #B6B3B2' }}>
        {user.role === 'ADMIN' && (
          <Col
            span={24}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <ButtonComponent
              hierarchy="secondary"
              onClick={() => navigate('/esg-config')}
            >
              Add +
            </ButtonComponent>
          </Col>
        )}

        <Col span={24} className="mt-3">
          <TableComponent
            data={tableData}
            columnHeader={filteredColumns}
            enableRowSelection={false}
            noText={`Please visit the ESG Configuration`}
          />
        </Col>
        <ModalComponent
          isOpen={isOpen}
          content={errMsg}
          onCancel={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
          onProceed={handleModalClose}
          cancelBtnText="Cancel"
          submitBtnText="Confirm"
        />
      </PageCardComponent>
    </>
  );
}

export default EsgConfigTable;
