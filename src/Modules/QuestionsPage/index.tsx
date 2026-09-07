import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MaturityAssessment from '../../Components/Assesment/MaturityAssessment';
import { get } from '../../Services';
import { useAuth } from '../../Hooks/useAuth';
import { Spin } from 'antd';
import { isEmpty } from '../../Utils/isEmpty';

type QuestionCategory = {
  id: string;
  text: string;
  options: { [key: string]: string };
  Q_id: string;
};

type QuestionsObject = {
  [key: string]: QuestionCategory[];
};

export default function QuestionsPage() {
  const location = useLocation();

  const [data, setData] = useState<QuestionsObject>();
  const [draft, setdraft] = useState();

  const fetchDraftData = (domain: any) => {
    get(
      `maturityAssessment/get_choosed_options/?entity_Id=${user?.entity_Id}&pillar=${domain}`
    )
      .then((res: any) => {
        if (res?.response?.status === true) {
          const result = res?.response?.data;
          setdraft(result);
        }
      })
      .catch((err) => {})
      .finally(() => '');
  };

  const [noquesMessage, setNoquesMessage] = useState<any[]>();

  const fetchApiData = (domain: any) => {
    console.log(domain, 'entered');
    get(`/maturityAssessment/maturity_questions/?pillar=${domain}`)
      .then((res: any) => {
        if (res?.response?.status === true) {
          const result = res?.response?.data?.map(
            (data: any, index: number) => ({
              id: data?.id,
              text: data?.question,
              options: data?.options,
              Q_id: data.question_number,
            })
          );
          setData(result);
        }
      })
      .catch((err) => {
        setNoquesMessage(err?.message);
      })
      .finally(() => '');
  };

  useEffect(() => {
    const dataReceived = location.state;
    let domain;
    if (
      !isEmpty(dataReceived) &&
      Array.isArray(dataReceived) &&
      dataReceived?.length > 1
    ) {
      domain = dataReceived[dataReceived?.length - 1];
    } else {
      domain = dataReceived;
    }
    fetchApiData(domain);
    fetchDraftData(domain);
  }, []);

  const { user } = useAuth();
  const assessmentType = useSelector((state: any) => state.assessmentType);

  return (
    <>
      {data !== undefined ? (
        <MaturityAssessment questions={data} draft={draft} />
      ) : !isEmpty(noquesMessage) ? (
        <p>{noquesMessage}</p>
      ) : (
        <Spin spinning={true}></Spin>
      )}
    </>
  );
}
