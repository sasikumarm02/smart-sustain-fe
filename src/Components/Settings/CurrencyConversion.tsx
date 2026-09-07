import { Card, Col, Row, Spin, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import Styles from '../../Modules/ReportingScreens/report.module.scss';
import image from '../../assets/Svg/currency.svg';
import TypographyComponent from '../../DesignLibrary/Typography';
import TableComponent from '../../DesignLibrary/TableComponent';
import { get, post, put } from '../../Services';
import {
  Inr,
  Sgd,
  Usd,
  Myr,
  Idr,
  Cny,
  Gbp,
  Jpy,
} from '../../assets/Svg/CurrencyConversion';
import {
  ButtonComponent,
  ModalComponent,
  PageCardComponent,
} from '../../DesignLibrary';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { getCurrentYear } from '../Emissions/Scope3/Helpers';

interface CurrencyItem {
  key: string;
  code: string;
  country_flag: JSX.Element | string;
  id?: string;
  country?: string;
  conversion_rate?: string;
  currency?: string;
}

interface CurrencyAPIResponseItem {
  id: string;
  country: string;
  conversion_rate: string;
  currency: string;
}

export default function CurrencyConversion() {
  const currencyCode: CurrencyItem[] = [
    { key: '01', code: 'USD', country_flag: <Usd /> },
    { key: '03', code: 'SGD', country_flag: <Sgd /> },
    { key: '02', code: 'INR', country_flag: <Inr /> },
    { key: '04', code: 'CNY', country_flag: <Cny /> },
    { key: '05', code: 'JPY', country_flag: <Jpy /> },
    { key: '06', code: 'IDR', country_flag: <Idr /> },
    { key: '07', code: 'MYR', country_flag: <Myr /> },
    { key: '08', code: 'GBP', country_flag: <Gbp /> },
  ];

  const [data, setData] = useState<CurrencyItem[]>([]);
  const [originalData, setOriginalData] = useState<CurrencyItem[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState<boolean>(false);
  const [hasEmptyRate, setHasEmptyRate] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCurrencyData = async () => {
    try {
      const res = await get(
        `scope3_emissions/get_country_currency_and_corresponding_conversion/?entity_Id=${user?.entity_Id}`
      );

      if (res?.status?.toLowerCase() === 'success') {
        const currencyData: CurrencyAPIResponseItem[] = res?.response?.data;

        const combinedArray = currencyCode.map((item) => {
          const matched = currencyData.find(
            (entry) => entry.currency === item.code
          );
          return {
            ...item,
            id: matched?.id || '',
            country: matched?.country || '',
            conversion_rate: matched?.conversion_rate || '',
            currency: matched?.currency || '',
          };
        });

        setData(combinedArray);
        setOriginalData(combinedArray);
        setHasEmptyRate(
          combinedArray.some((item) => item.conversion_rate === '')
        );
        if (combinedArray.every((item) => item.conversion_rate === '')) {
          setIsEditing(true);
        }
      }
    } catch (err) {
      console.error('Error fetching currency data:', err);
    }
  };

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, conversion_rate: value } : item
    );
    setData(updatedData);
    validateFields(updatedData);
  };

  const validateFields = (items: CurrencyItem[]) => {
    const allFilled = items.every(
      (item) => item.conversion_rate !== '' && item.conversion_rate !== null
    );
    setAllFieldsFilled(allFilled);
  };

  const handleEdit = async () => {
    try {
      const editedItems = data.filter(
        (item, index) =>
          originalData[index]?.conversion_rate !== item.conversion_rate
      );

      const payload = editedItems.map((item) => ({
        id: item.id || '',
        country: item.country || '',
        currency: item.currency || '',
        conversion_rate: item.conversion_rate || '',
      }));

      if (payload.length > 0) {
        const res = await put(
          `/scope3_emissions/modify_currency_value_as_per_country/`,
          payload
        );
        message.success(res?.message);
        setIsEditing(false);
      } else {
        message.info('No changes to save.');
      }
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  const handleSave = async () => {
    const payload = data.map((item) => ({
      entity_Id: user?.entity_Id || '',
      country: item.country || '',
      currency: item.currency || '',
      conversion_rate: item.conversion_rate || '',
    }));

    try {
      const res = await post(
        `/scope3_emissions/create_currency_conversions/`,
        payload
      );
      message.success(res?.message);
      setIsEditing(false);
      fetchCurrencyData();
    } catch (error: any) {
      message.error(error?.message || 'Failed to save data.');
      console.error('Save error:', error);
      fetchCurrencyData();
    }
  };

  const handleReset = () => {
    const resetData = data.map((item) => ({
      ...item,
      conversion_rate: '',
    }));
    setData(resetData);
  };

  const handleOpenModal = () => setIsOpen(true);

  return (
    <Spin spinning={false}>
      <div>
        <PageCardComponent className={Styles.pageCardStyle}>
          <Row gutter={30} className="mt-2">
            <Col span={12}>
              <div className="m-3">
                <p>
                  <span className={Styles.headingBreak}>Welcome to the</span>
                  <br />
                  <span className={Styles.headingBreak2}>
                    Currency{' '}
                  </span> <br />{' '}
                  <span className={Styles.headingBreak2}> Conversion Rate</span>
                </p>
                <p className={Styles.backgroundText}>
                  Currency conversion involves exchanging one currency for
                  another at the current exchange rate. Please input the
                  currency conversion rates here for use across the entire ESG
                  reporting platform. This will ensure uniform reporting across
                  all modules and standardised currencies for easy comparison.
                </p>
              </div>
            </Col>
            <Col span={12}>
              <img src={image} alt="currency" style={{ width: '100%' }} />
            </Col>
          </Row>

          <Card style={{ margin: '30px' }}>
            <TypographyComponent
              ClassName={Styles.titleHeader}
              size="xs"
              type="bold"
              color="#120A08"
            >
              Currency Conversion Rate to USD
            </TypographyComponent>

            <div className={Styles.tableDiv}>
              <Row gutter={[16, 16]}>
                {data.map((item) => {
                  const currencyInfo: Record<string, string> = {
                    USD: 'United States',
                    SGD: 'Singapore',
                    INR: 'India',
                    CNY: 'China',
                    JPY: 'Japan',
                    IDR: 'Indonesia',
                    MYR: 'Malaysia',
                    GBP: 'United Kingdom',
                  };

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.key}>
                      <div className={Styles.currencyCard}>
                        <div className={Styles.currencyLabel}>
                          <p className={Styles.inputText}>
                            {item.code} – {currencyInfo[item.code]}
                          </p>
                        </div>
                        <Input
                          type="number"
                          style={{ height: '50px', background: '#FAF9FF' }}
                          value={item.conversion_rate}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handleInputChange(item.key, e.target.value)
                          }
                          onKeyDown={(e) => {
                            const key = e.key;
                            if (
                              key === '-' ||
                              key === 'e' ||
                              key === 'E' ||
                              (key === '0' && e.currentTarget.value === '')
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {user?.role === 'ADMIN' && (
                <Row justify="end" className={Styles.marginTopBtn}>
                  <ButtonComponent
                    hierarchy="tertiary"
                    size="xl"
                    className="mx-1"
                    onClick={handleReset}
                    disabled={!isEditing}
                  >
                    Reset
                  </ButtonComponent>
                  {!hasEmptyRate && (
                    <ButtonComponent
                      onClick={() => setIsEditing(true)}
                      className="mx-1"
                    >
                      Edit
                    </ButtonComponent>
                  )}
                  <ButtonComponent
                    onClick={() =>
                      !hasEmptyRate ? handleEdit() : handleSave()
                    }
                    disabled={!isEditing || !allFieldsFilled}
                  >
                    Save
                  </ButtonComponent>
                </Row>
              )}
            </div>
          </Card>
        </PageCardComponent>

        <ModalComponent
          isOpen={isOpen}
          content="Smart Sustain.AI is developed and designed for internal use of ESG team"
          onCancel={() => setIsOpen(false)}
          onProceed={() => setIsOpen(false)}
          submitBtnText="Ok"
        />
      </div>
    </Spin>
  );
}
