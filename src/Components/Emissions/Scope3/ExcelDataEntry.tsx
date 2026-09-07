import { Col, Input, Row } from 'antd';
import CustomDownload from '../../../Components/FileHanddle/customDownload';
import CustomUpload from '../../../Components/FileHanddle/customUpload';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ButtonComponent, TableComponent } from '../../../DesignLibrary';
import { useState } from 'react';

export const ScopeExcelDataEntry = ({
  type,
  tabKey,
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
  showField,
  onInputChange,
}: any) => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [wasteProduct, setWasteProduct] = useState('');
  return (
    <>
      <Row gutter={10} className="mt-4">
        <Col span={24}>
          {ExcelUploaded &&
          datasources &&
          datasources.length &&
          Object.keys(datasources[0]).length ? (
            <>
              <Row gutter={[0, 15]} align="middle">
                {showField === true && (
                  <Col span={24}>
                    <span className="extraFields">Total Waste Produced :</span>
                    <Input
                      value={wasteProduct}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value;
                        // Replace non-numeric and non-decimal characters with an empty string
                        const filteredValue = inputValue.replace(
                          /[^0-9.]/g,
                          ''
                        );

                        // Update state with filtered value
                        onInputChange(filteredValue);
                        setWasteProduct(filteredValue);
                      }}
                      style={{
                        width: '100px',
                        display: 'inline',
                        height: '44px',
                      }}
                    />
                    <span className="suffixValue">tonnes</span>
                  </Col>
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
                  <ButtonComponent
                    hierarchy="link-gray"
                    size="xl"
                    onClick={() =>
                      navigate(postSubmit, { state: { activeTab } })
                    }
                  >
                    Cancel
                  </ButtonComponent>

                  <ButtonComponent
                    disabled={disableSubmit}
                    onClick={() => handleSubmit(activeTab)}
                  >
                    Submit
                  </ButtonComponent>
                </Col>
              </Row>
            </>
          ) : (
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

              <CustomUpload
                loading={loading}
                emission_type={emissionType}
                initializeForm={initializeForm}
                setFileName={setFileName}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};
