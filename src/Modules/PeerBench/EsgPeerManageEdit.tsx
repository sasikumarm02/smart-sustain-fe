import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ButtonComponent,
  InputComponent,
  PageCardComponent,
} from '../../DesignLibrary';
import Styles from './Peerbench.module.scss';
import { Row, Col, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { get, post, put } from '../../Services';
import { isEmpty } from '../../Utils/isEmpty';
import { setPeerEditMode } from '../../Redux/Actions';

function EsgPeerManageEdit() {
  const navigate = useNavigate();
  const { Option } = Select;
  const dispatch = useDispatch();
  const editmode = useSelector((state: any) => state.editMode);

  const location = useLocation();

  const [benchmark, setBenchmark] = useState('');
  const [dataPoint, setDataPoint] = useState('');
  const [uom, setUom] = useState('');
  const [gri, setGri] = useState('');
  const [definition, setDefinition] = useState('');
  const [griOptions, setGriOptions] = useState<string[]>([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const isEditMode = !!location.state?.record;

  dispatch(setPeerEditMode(isEditMode));

  const griDropdownData = async () => {
    try {
      const res = await get(`/peerBenchmarking/get_gri_disclosure_dropdown/`);
      if (!isEmpty(res?.response) && res?.response) {
        const topics = res?.response?.topics || [];
        setGriOptions(topics);
      }
    } catch (error) {
      console.error('Error fetching GRI options:', error);
    }
  };

  useEffect(() => {
    griDropdownData();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const {
        benchmarking_topic,
        data_point,
        defination,
        units,
        gri_disclosure,
      } = location.state.record;
      setBenchmark(benchmarking_topic || '');
      setDataPoint(data_point || '');
      setUom(units || '');
      setGri(gri_disclosure || '');
      setDefinition(defination || '');
    }
  }, [isEditMode, location.state]);

  useEffect(() => {
    const areAllFieldsFilled = () => {
      return benchmark && dataPoint && uom && gri && definition;
    };

    setIsSaveDisabled(!areAllFieldsFilled());
  }, [benchmark, dataPoint, uom, gri, definition]);

  const handleReset = () => {
    setDataPoint('');
    setUom('');
    setGri('');
    setDefinition('');
    setBenchmark('');
    setIsSaveDisabled(true);
  };

  const handleUpdateSubmit = async () => {
    const recordId = location.state.record.id;
    const payload = {
      id: recordId,
      benchmarking_topic: benchmark,
      data_point: dataPoint,
      units: uom,
      gri_disclosure: gri,
      defination: definition,
    };

    try {
      const resData = await put(
        `/peerBenchmarking/update_data_point/`,
        payload
      );
      message.success(resData?.message);
      navigate(`/peer-benchmarking`);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleSaveSubmit = async () => {
    const payload = {
      benchmarking_topic: benchmark,
      data_point: dataPoint,
      units: uom,
      gri_disclosure: gri,
      defination: definition,
    };

    try {
      const resData = await post(
        `/peerBenchmarking/create_data_points/`,
        payload
      );
      message.success(resData?.message);
      navigate(`/peer-benchmarking`);
    } catch (error: any) {
      console.error('Error saving data:', error);
      message.warning(error.response?.data?.message);
    }
  };

  return (
    <>
      <PageCardComponent className={Styles.pageCardPaddingPeermanage}>
        <Row gutter={16} justify="space-between">
          <Col span={6}>
            <p className={Styles.subheading}>Benchmark Topic</p>
            <InputComponent
              value={benchmark}
              onChange={(e: any) => setBenchmark(e.target.value)}
              className={Styles.paddingInput}
              placeHolder="Enter Benchmark Topic"
            />
          </Col>
          <Col span={6}>
            <p className={Styles.subheading}>Data Point</p>
            <InputComponent
              value={dataPoint}
              onChange={(e: any) => setDataPoint(e.target.value)}
              className={Styles.paddingInput}
              placeHolder="Enter Data Point"
            />
          </Col>
          <Col span={6}>
            <p className={Styles.subheading}>UOM</p>
            <InputComponent
              value={uom}
              onChange={(e: any) => setUom(e.target.value)}
              className={Styles.paddingInput}
              placeHolder="Enter UOM"
            />
          </Col>
          <Col span={6} className="selectInput">
            <p className={Styles.subheading}>GRI Disclosure</p>
            <Select
              showSearch
              value={gri || undefined}
              placeholder="Select GRI"
              onChange={(value) => setGri(value)}
              className={Styles.formSelect}
            >
              {griOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <p className={Styles.subheading}>Definition</p>
          <TextArea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className={Styles.paddingText}
            placeholder="Enter Definition"
          />
        </Row>
        <Row justify="end" className="mt-3">
          {!isEditMode && (
            <ButtonComponent
              className="mx-3"
              hierarchy="tertiary"
              size="xl"
              onClick={handleReset}
            >
              Reset
            </ButtonComponent>
          )}
          <ButtonComponent
            onClick={isEditMode ? handleUpdateSubmit : handleSaveSubmit}
            disabled={isSaveDisabled}
          >
            {isEditMode ? 'Save & Update' : 'Save'}
          </ButtonComponent>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default EsgPeerManageEdit;
