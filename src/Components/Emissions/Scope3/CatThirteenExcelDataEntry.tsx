import { Col, Input, Row } from 'antd';
import CustomDownload from '../../../Components/FileHanddle/customDownload';
import CustomUpload from '../../../Components/FileHanddle/customUpload';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ButtonComponent, TableComponent } from '../../../DesignLibrary';
import { useState } from 'react';
import { Radio } from 'antd';
import styles from './scope3.module.scss';
import { useAuth } from '../../../Hooks/useAuth';
export const CatThirteenExcelEntry = ({
  type,
  emissionType,
  tabcolumns,
  activeTab,
  postSubmit,
  initializeForm,
  disableSubmit,
  datasources,
  ExcelUploaded,
  handleSubmit,
  loading,
  handleRadioValueSelect,
  totalDownstream,
  totalemissions,
  handleExcelInputChange,
  leasedArea,
  withOutleasedArea,
  buildingArea,
  withOutbuildingArea,
  utilizedOccupancyRatio,
  withOututilizedOccupancyRatio,
  occupancy,
  cat13Lesse,
  leasedAssets,
  lesseeAssets,
  valueselected,
}: any) => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [radioSelected, setRadioSelected] = useState(valueselected);
  const { user } = useAuth();

  const handleChange = (e: any, type: any) => {
    handleExcelInputChange(e, type);
  };

  return (
    <>
      <Row gutter={10} className="mt-4">
        {!ExcelUploaded ? (
          <>
            <Col span={24}>
              <p
                style={{
                  textAlign: 'center',
                  fontWeight: 'normal',
                  fontSize: '20px',
                }}
              >
                Download the template file and fill up the user details in the
                given format{' '}
              </p>
            </Col>
            <Col span={24}>
              <CustomDownload type={type} />
            </Col>
            <Col span={24}>
              <CustomUpload
                loading={loading}
                emission_type={emissionType}
                initializeForm={initializeForm}
                setFileName={setFileName}
                cat13Lesse={cat13Lesse}
              />
            </Col>
          </>
        ) : (
          <Col span={24}>
            <>
              <Row gutter={[0, 15]} align="middle">
                {activeTab == '1' && (
                  <>
                    <Row gutter={16} align="middle">
                      <Col span={12}>
                        <p className={styles.label}>Leased Area (m²):</p>
                        <Input value={leasedArea} className={styles.input} />
                      </Col>
                      <Col span={12}>
                        <p className={styles.label}>
                          Building's Total Area (m²):
                        </p>
                        <Input value={buildingArea} className={styles.input} />
                      </Col>
                      <Col span={12}>
                        <p className={styles.label}>Arial Ratio:</p>
                        <Input
                          value={
                            utilizedOccupancyRatio === 0 ||
                            utilizedOccupancyRatio == 'Infinity'
                              ? ''
                              : utilizedOccupancyRatio
                          }
                          disabled
                          className={styles.input}
                        />
                      </Col>
                      {/* <Col span={12}>
                        <div className={styles.container}>
                          <Col span={14}>
                            <p className={styles.label}>Leased Area (m²):</p>
                          </Col>
                          <Col span={10}>
                            {radioSelected === 'with-submeter' ? (
                              <Input
                                value={leasedArea}                              
                                className={styles.input}
                              />
                            ) : (
                              <Input
                                value={withOutleasedArea}
                              
                                className={styles.input}
                              />
                            )}
                          </Col>
                        </div>
                      </Col> */}

                      {/* Building's Total Area */}
                      {/* 
                      <Col span={12}>
                        <div className={styles.container}>
                          <Col span={14}>
                            <p className={styles.label}>
                              Building's Total Area (m²):
                            </p>
                          </Col>
                          <Col span={10}>
                            {radioSelected === 'with-submeter' ? (
                              <Input
                                value={buildingArea}                      
                              
                                className={styles.input}
                              />
                            ) : (
                              <Input
                                value={withOutbuildingArea}
                              
                                className={styles.input}
                              />
                            )}
                          </Col>
                        </div>
                      </Col> */}

                      {/* <Col span={8}>
                        {radioSelected === 'without-submeter' && (
                          <div className={styles.container}>
                            <Col span={14}>
                              <p className={styles.label}>Occupancy Rate:</p>
                            </Col>
                            <Col span={10}>
                              <Input
                                value={occupancy}                              
                                className={styles.input}
                              />
                            </Col>
                          </div>
                        )}
                      </Col> */}
                    </Row>

                    <Row gutter={16} align="middle">
                      {/* <Col span={7}>
                        <div className={styles.container}>
                          <Col span={14}>
                            {radioSelected === 'without-submeter' ? (
                              <p className={styles.label}>
                                Utilized Occupancy Ratio:
                              </p>
                            ) : (
                              <p className={styles.label}>Arial Ratio:</p>
                            )}
                          </Col>
                          <Col span={10}>
                            {radioSelected === 'with-submeter' ? (
                              <Input
                                value={
                                  utilizedOccupancyRatio === 0 ||
                                  utilizedOccupancyRatio == 'Infinity'
                                    ? ''
                                    : utilizedOccupancyRatio
                                }
                                disabled
                                className={styles.input}
                              />
                            ) : (
                              <Input
                                value={
                                  withOututilizedOccupancyRatio === 0 ||
                                  withOututilizedOccupancyRatio == 'Infinity'
                                    ? ''
                                    : withOututilizedOccupancyRatio
                                }
                                disabled
                                className={styles.input}
                              />
                            )}
                          </Col>
                        </div>
                      </Col> */}

                      {/* Total Emissions (Scope 1 + Scope 2) (Disabled) */}

                      {/* {(user.role != 'DATA_PROVIDER' ||
                        radioSelected === 'without-submeter') && (
                        <Col span={8}>
                          <div className={styles.container}>
                            <Col span={14}>
                              <p className={styles.label}>
                                Total Emissions <br /> (Scope 1 + Scope 2):
                              </p>
                            </Col>
                            <Col span={10}>
                              <Input
                                value={totalemissions.toLocaleString()}
                                disabled
                                className={styles.input}
                              />
                            </Col>
                          </div>
                        </Col>
                      )} */}

                      {/* Total Emissions From Downstream Leased Assets (Disabled) */}
                      {/* {(user.role != 'DATA_PROVIDER' ||
                        radioSelected === 'without-submeter') && (
                        <Col span={9}>
                          <div className={styles.container}>
                            <Col span={14}>
                              <p className={styles.label}>
                                Total Emissions from <br /> Downstream Leased
                                Assets (kgCO₂e):
                              </p>
                            </Col>
                            <Col span={10}>
                              <Input
                                value={totalDownstream.toLocaleString()}
                                disabled
                                className={styles.input}
                              />
                            </Col>
                          </div>
                        </Col>
                      )} */}
                    </Row>
                  </>
                )}
                {activeTab == '2' && (
                  <Row gutter={16} align="middle">
                    <Col span={8}>
                      <div className={styles.container}>
                        <p className={styles.label}>
                          Physical Area of Leased Assets (m²) :
                        </p>
                        <Input
                          value={leasedAssets}
                          className={styles.input}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col span={9}>
                      <div className={styles.container}>
                        <p className={styles.label}>
                          Total Physical Area of Lessor Assets (m²) :
                        </p>
                        <Input
                          value={lesseeAssets}
                          className={styles.input}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col span={7}>
                      <div className={styles.container}>
                        <p className={styles.label}>
                          Leased to Lessor Area Ratio :
                        </p>
                        <span className={styles.value}>
                          {lesseeAssets && leasedAssets
                            ? (
                                parseFloat(leasedAssets) /
                                parseFloat(lesseeAssets)
                              ).toFixed(2)
                            : ''}
                        </span>
                      </div>
                    </Col>
                  </Row>
                )}
                <Col span={24}>
                  <TableComponent
                    isForm={true}
                    isRowExpand={false}
                    data={datasources}
                    enableRowSelection={false}
                    columnHeader={tabcolumns}
                    showOnlyCount={false}
                    columnCheckBoxDataAttribute="key"
                  />
                </Col>
                <Col
                  span={24}
                  style={{
                    textAlign: 'right',
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'end',
                  }}
                  // className={styles.customPaddingTop}
                >
                  {/* <ButtonComponent
                    hierarchy="link-gray"
                    size="xl"
                    onClick={() =>
                      navigate(postSubmit, { state: { activeTab } })
                    }
                  >
                    Cancel
                  </ButtonComponent> */}

                  <ButtonComponent
                    disabled={disableSubmit}
                    onClick={() => handleSubmit(activeTab)}
                  >
                    Submit
                  </ButtonComponent>
                </Col>
              </Row>
            </>
          </Col>
        )}
      </Row>
    </>
  );
};
