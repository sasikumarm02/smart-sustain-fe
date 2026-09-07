import { useState, useCallback, useEffect } from 'react';

import { Select, Tabs, Form } from 'antd';

import { PageCardComponent } from '../../../DesignLibrary';
import { useAuth } from '../../../Hooks/useAuth';

import Styles from './Enviroment.module.scss';

import { useLocation, useNavigate } from 'react-router-dom';
import RecyledForm from './Recyled';
import DisposedForm from './Disposed';

const { TabPane } = Tabs;

const monthsForCurrentYear = Array.from(
  { length: 12 },
  (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }) + '-24'
);

const EnvironmentForm = ({ cateTitle }: any) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [recycledRows, setRecycledRows] = useState<string[]>(['row-0']);
  const [disposedRows, setDisposedRows] = useState<string[]>(['row-0']);
  const [fileLists, setFileLists] = useState<any[]>([]);

  const [activeKey, setActiveKey] = useState(
    location.state ? (location.state === 'Recycled' ? '1' : '2') : '1'
  );
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);

  const checkFormValidity = useCallback(() => {
    const checkFields = (rows: string[], type: string) => {
      return rows.some((rowId) => {
        const fields = monthsForCurrentYear.map((_, monthIndex) => ({
          quantity: form.getFieldValue(
            `quantity-${type}-${rowId}-${monthIndex}`
          ),
          disclosure: fileLists[rows.indexOf(rowId)]?.[monthIndex],
        }));
        return fields.some(
          ({ quantity, disclosure }) => quantity || disclosure
        );
      });
    };

    const isRecycledValid =
      activeKey === '1' ? checkFields(recycledRows, 'recycled') : false;
    const isDisposedValid =
      activeKey === '2' ? checkFields(disposedRows, 'disposed') : false;

    setSubmitDisabled(!(isRecycledValid || isDisposedValid));
  }, [form, fileLists, activeKey, recycledRows, disposedRows]);

  useEffect(() => {
    checkFormValidity();
  }, [
    form,
    fileLists,
    activeKey,
    recycledRows,
    disposedRows,
    checkFormValidity,
  ]);

  return (
    <>
      <PageCardComponent className={Styles.pageCardStyleForm}>
        <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
          <TabPane tab="Recycled" key="1">
            <RecyledForm></RecyledForm>
          </TabPane>
          <TabPane tab="Disposed" key="2">
            <DisposedForm></DisposedForm>
          </TabPane>
        </Tabs>
      </PageCardComponent>
    </>
  );
};

export default EnvironmentForm;
