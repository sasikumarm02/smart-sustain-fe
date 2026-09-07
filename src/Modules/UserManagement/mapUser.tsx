import { Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'antd';
import { Formik } from 'formik';
import { useAuth } from '../../Hooks/useAuth';
import { useNotification } from '../../Hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { get, post } from '../../Services';
import CustomSelect from '../../Components/FormInput/CustomSelect';
import CustomDatePicker from '../../Components/FormInput/CustomDatePicker';
import {
  environmentConfig,
  goveranceConfig,
  socialConfig,
} from '../../Utils/Strings';
import { useQuery } from '../../Hooks/useQuery';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { DatePicker, GetProps } from 'antd';
dayjs.extend(customParseFormat);
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
interface Values {}
export default function MapUser() {
  const { user } = useAuth();
  const query = useQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const { openToast } = useNotification();
  const navigate = useNavigate();

  function handleLabel(key: any, title: any) {
    if (key === 1) {
      return title;
    } else return null;
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current: any) => {
    return current && current < dayjs().endOf('day');
  };

  const fetchData = async (api: string) => {
    get(api)
      .then((res: any) => {
        if (res.response.status !== false) {
          const result = res.response.data.filter(
            (item: any) => item.material_topic === null
          );
          setUserData(result);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!query.get('auth_Id')) {
      if (window.location.pathname === '/map-user') {
        fetchData(`/invite/unmapped_user/?entity_Id=${user.entity_Id}`);
      } else {
        fetchData(
          `/invite/data_providerList/?entity_Id=${
            user.entity_Id
          }&auth_Id=${null}`
        );
      }
    } else {
      fetchData(
        `/invite/data_providerList/?entity_Id=${
          user.entity_Id
        }&auth_Id=${query.get('auth_Id')}`
      );
    }
  }, [query, user.entity_Id]);

  return (
    <>
      <p className="pageTitle mt-4">Map User</p>
      <Card>
        <Row>
          <Col span={24} className="AnttabSty">
            <Formik
              initialValues={{}}
              validationSchema={Yup.object().shape({})}
              onSubmit={async (values, { resetForm }) => {
                const data = userData.map((data: any, index: number) => ({
                  auth_Id: data.auth_Id,
                  userName: data.userName,
                  entity_Role: data.entity_Role,
                  material_topic: values[`material_${index}` as keyof Values],
                  target_date: values[`target_${index}` as keyof Values],
                }));
                setIsLoading(true);
                post(`/invite/Map_User/`, {
                  entity_Id: user.entity_Id,
                  user_data: data,
                })
                  .then((res: any) => {
                    if (res?.status === 'Success') {
                      if (res?.response?.status === true) {
                        openToast({
                          content: `${res.message}`,
                          type: 'success',
                        });
                        resetForm();
                        navigate(`/user-access-management/user-role-mapping`);
                      } else {
                        openToast({
                          content: `${res.message}`,
                          type: 'warning',
                        });
                      }
                    }
                  })
                  .catch((err) => {
                    setIsLoading(false);
                    openToast({
                      content: `${err}`,
                      type: 'error',
                    });
                  })
                  .finally(() => setIsLoading(false));
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                setFieldValue,
                handleSubmit,
                handleBlur,
                setFieldTouched,
                handleReset,
                isValid,
                dirty,
              }) => {
                return (
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    onReset={handleReset}
                  >
                    <Row className="mb-3" gutter={[10, 24]}>
                      {[
                        'S.No',
                        'User Name',
                        'User Role',
                        'Material Topics',
                        'Target Date',
                      ].map((data: string, index: number) => (
                        <Col
                          span={index === 0 ? 2 : index === 3 ? 8 : 4}
                          key={index}
                        >
                          <p className="mapUserColHead">{data}</p>
                        </Col>
                      ))}
                    </Row>
                    {userData &&
                      userData.map((data: any, index: number) => {
                        return (
                          <Row key={index} gutter={[10, 24]}>
                            <Col span={2}>
                              <p className="userMapData">{index + 1}</p>
                            </Col>
                            <Col span={4} className="center-label-input">
                              <Typography.Text
                                className="userMapData"
                                ellipsis={true}
                              >
                                {' '}
                                {data.userName}
                              </Typography.Text>
                            </Col>
                            <Col
                              span={4}
                              className="center-label-input userMapData"
                            >
                              <p className="userMapData"> {data.entity_Role}</p>
                            </Col>
                            <Col span={8} className="mapUserSelect">
                              <CustomSelect
                                label=""
                                multiple={true}
                                name={`material_${index}`}
                                type="text"
                                size="large"
                                options={[
                                  ...environmentConfig,
                                  ...socialConfig,
                                  ...goveranceConfig,
                                ].map((item: any) => ({
                                  value: item,
                                }))}
                                errors={
                                  errors[`material_${index}` as keyof Values]
                                }
                                touched={
                                  touched[`material_${index}` as keyof Values]
                                }
                                value={
                                  values[`material_${index}` as keyof Values]
                                }
                                secondChange={setFieldValue}
                                hook={handleChange}
                                blur={handleBlur}
                                status={
                                  (touched[
                                    `material_${index}` as keyof Values
                                  ] &&
                                    errors[
                                      `material_${index}` as keyof Values
                                    ] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                            <Col lg={4}>
                              <CustomDatePicker
                                disabledDate={disabledDate}
                                name={`target_${index}`}
                                labelColor="#00338D"
                                errors={
                                  errors[`target_${index}` as keyof Values]
                                }
                                touched={
                                  touched[`target_${index}` as keyof Values]
                                }
                                value={
                                  values[`target_${index}` as keyof Values]
                                }
                                secondChange={setFieldValue}
                                blur={() =>
                                  setFieldTouched(`target_${index}`, true)
                                }
                                size="large"
                                status={
                                  (touched[`target_${index}` as keyof Values] &&
                                    errors[`target_${index}` as keyof Values] &&
                                    'error') ||
                                  ''
                                }
                              />
                            </Col>
                          </Row>
                        );
                      })}
                    <Row justify="end" style={{ paddingTop: '20px' }}>
                      {/* <Col span={3}>
                        <Form.Item>
                          <Button size="large" htmlType="reset" block>
                            Reset
                          </Button>
                        </Form.Item>
                      </Col> */}
                      <Col span={3}>
                        <Form.Item>
                          <Button
                            htmlType="submit"
                            loading={isLoading}
                            disabled={!(isValid && dirty)}
                            className="submitBtn"
                          >
                            Submit
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </Card>
    </>
  );
}
