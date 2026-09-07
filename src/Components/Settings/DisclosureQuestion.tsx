import {
  Button,
  Col,
  Form,
  Radio,
  Row,
  Tabs,
  Collapse,
  Input,
  TabsProps,
  Checkbox,
  Typography,
  Space,
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Styles from '../Social/form.module.scss';
import { Formik } from 'formik';
import * as Yup from 'yup';

export const QuestionData = ({ index }: any) => {
  const { TextArea } = Input;
  const { Panel } = Collapse;
  return (
    <Row>
      {index === 1 && (
        <Col lg={24}>
          <Formik
            initialValues={{
              selectValue: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={async (values, { resetForm }) => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
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
                  <Row className="mt-2">
                    <Col span={24}>
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={() => console.log('')}
                      >
                        <Row className="mb-3">
                          {[
                            'General Questions',
                            'Environment',
                            'Social',
                            'Governance',
                          ].map((data: any, index: number) => (
                            <Col lg={5} md={6} sm={10} xs={20} key={index}>
                              <Checkbox
                                value={data}
                                className={Styles.checkmain}
                              >
                                {data}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </Col>
                    <Col span={24} className="mt-4">
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={() => console.log('')}
                      >
                        <Row>
                          {[
                            'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
                            'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
                            'If the organization has multiple entities, approach for acquisitions, mergers etc.',
                            'If the organization has multiple entities, how the approach differs ',
                            'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
                          ].map((data: any, index: number) => (
                            <Col span={24} key={index} className="mb-5">
                              <Checkbox
                                value={data}
                                className={Styles.checkTilte}
                              >
                                {index + 1}&nbsp;
                                {data}
                              </Checkbox>
                            </Col>
                          ))}
                        </Row>
                      </Checkbox.Group>
                    </Col>
                  </Row>
                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Reset
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          className={Styles.BtnDesign}
                          htmlType="submit"
                          //   loading={isLoading}
                          //disabled={!(isValid && dirty)}
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
      )}
      {index === 2 && (
        <Col lg={24}>
          <Formik
            initialValues={{
              selectValue: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={async (values, { resetForm }) => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
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
                  <Row>
                    <Col lg={24}>
                      <Collapse
                        style={{ width: '100%' }}
                        defaultActiveKey={['1']}
                        expandIconPosition="end"
                        expandIcon={({ isActive }) =>
                          isActive ? <MinusOutlined /> : <PlusOutlined />
                        }
                        onChange={() => ''}
                        ghost
                      >
                        {[
                          'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
                          'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
                          'If the organization has multiple entities, approach for acquisitions, mergers etc.',
                          'If the organization has multiple entities, how the approach differs ',
                          'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
                        ].map((data: string, index: number) => (
                          <Panel
                            header={`${index + 1} ${data}`}
                            key={index}
                            className={Styles.collapseTitle}
                          >
                            <TextArea rows={4} />
                          </Panel>
                        ))}
                      </Collapse>
                    </Col>
                  </Row>
                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Reset
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          className={Styles.BtnDesign}
                          htmlType="submit"
                          //   loading={isLoading}
                          //disabled={!(isValid && dirty)}
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
      )}
      {index === 3 && (
        <Row>
          {[
            'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
            'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
            'If the organization has multiple entities, approach for acquisitions, mergers etc.',
            'If the organization has multiple entities, how the approach differs ',
            'If the organization’s sustainability reporting has been externally assured: i. Provide a link or reference to the external assurance report(s) or assurance statement(s); ii. Describe what has been assured and on what basis, including the assurance standards used, the level of assurance obtained, and any limitations of the assurance process; iii. Describe the relationship between the organization and the assurance provider.',
            'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
            'List the committees of the highest governance body that are responsible for decisionmaking on and overseeing the management of the organization’s impacts on the economy, environment, and people;',
            'Describe the nomination and selection processes for the highest governance body and its committees;',
          ].map((data: string, index: number) => (
            <Col lg={24} key={index} className={Styles.checkTilte}>
              <Space>
                {index + 1}&nbsp;
                {data}
              </Space>
            </Col>
          ))}
        </Row>
      )}
      {index === 4 && (
        <Col lg={24}>
          <Formik
            initialValues={{
              selectValue: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={async (values, { resetForm }) => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
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
                  <Row>
                    <Col lg={24}>
                      <ol>
                        {[
                          'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
                          'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
                          'If the organization has multiple entities, approach for acquisitions, mergers etc.',
                          'If the organization has multiple entities, how the approach differs ',
                          'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
                        ].map((data: string, index: number) => (
                          <>
                            <li style={{ marginTop: '2rem  ' }} value={data}>
                              <b>{data}</b>
                            </li>
                            <Typography.Text
                              style={{
                                fontSize: '18px',
                                color: '#989898',
                                fontWeight: 400,
                                width: '97%',
                              }}
                            >
                              A. Lorem Ipsum is simply dummy text of the
                              printing and typesetting industry. Lorem Ipsum has
                              been the industry's standard dummy text ever since
                              the 1500s, when an unknown printer took a galley
                              of type and scrambled it to make a type specimen
                              book. Lorem Ipsum is simply dummy text of the
                              printing and typesetting industry.
                            </Typography.Text>
                          </>
                        ))}
                      </ol>
                    </Col>
                  </Row>

                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Reset
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          className={Styles.BtnDesign}
                          htmlType="submit"
                          //   loading={isLoading}
                          //disabled={!(isValid && dirty)}
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
      )}
      {index === 5 && (
        <Col lg={24}>
          <Formik
            initialValues={{
              selectValue: '',
            }}
            validationSchema={Yup.object().shape({})}
            onSubmit={async (values, { resetForm }) => {
              console.log(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
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
                  <Row>
                    <Col span={20} lg={24}>
                      <ol>
                        {[
                          'Comparison of list of entities as per financial reporting vis-à-vis Sustainability reporting. Are there any entities included in one report but not the other? If so, why?',
                          'If the organization has multiple entities, approach for consolidating incl adjustment for minority interests',
                          'If the organization has multiple entities, approach for acquisitions, mergers etc.',
                          'If the organization has multiple entities, how the approach differs ',
                          'Report restatements of information made from previous reporting periods and explain: i. The reasons for the restatements; ii. The effect of the restatements.',
                        ].map((data: string, index: number) => (
                          <>
                            <li style={{ marginTop: '2rem  ' }} value={data}>
                              <b>{data}</b>
                            </li>
                            <Typography.Paragraph
                              style={{
                                fontSize: '18px',
                                color: '#989898',
                                fontWeight: 400,
                                width: '97%',
                              }}
                            >
                              A. Lorem Ipsum is simply dummy text of the
                              printing and typesetting industry. Lorem Ipsum has
                              been the industry's standard dummy text ever since
                              the 1500s, when an unknown printer took a galley
                              of type and scrambled it to make a type specimen
                              book. Lorem Ipsum is simply dummy text of the
                              printing and typesetting industry.
                            </Typography.Paragraph>
                          </>
                        ))}
                      </ol>
                    </Col>
                  </Row>

                  <Row justify="end" style={{ paddingTop: '20px' }}>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          htmlType="reset"
                          className={Styles.BtnDesign1}
                        >
                          Reset
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={4} className={Styles.DisplayButton}>
                      <Form.Item>
                        <Button
                          type="primary"
                          size="middle"
                          className={Styles.BtnDesign}
                          htmlType="submit"
                          //   loading={isLoading}
                          //disabled={!(isValid && dirty)}
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
      )}
    </Row>
  );
};

export default function DisclosureQuestion() {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'All Questions (89)',
      children: <QuestionData index={1} />,
    },
    {
      key: '2',
      label: 'Not Assigned (25)',
      children: <QuestionData index={2} />,
    },
    {
      key: '3',
      label: 'Response Awaited (25)',
      children: <QuestionData index={3} />,
    },
    {
      key: '4',
      label: 'Responded (64)',
      children: <QuestionData index={4} />,
    },
    {
      key: '5',
      label: 'Finalized(14)',
      children: <QuestionData index={5} />,
    },
  ];

  return (
    <>
      <Row justify="center" style={{ paddingTop: '10px' }}>
        <Col span={24}>
          <p className={Styles.breadCrumbMain}>
            Settings /<span>Disclosures Questionnaire</span>{' '}
          </p>
        </Col>
        <Col span={24}>
          <Tabs
            tabBarStyle={{ color: '#61b5de' }}
            tabBarGutter={24}
            defaultActiveKey="1"
            items={items}
          />
        </Col>
      </Row>
    </>
  );
}
