import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import ISSBAssessment from '../ISSBAssessment';
import { get } from '../../../../Services';
import { useAuth } from '../../../../Hooks/useAuth';

type QuestionCategory = {
  id: string;
  text: string;
  options: { [key: string]: string };
  Q_id: string;
  requirement: string;
};

export default function ISSBQuestionsPage() {
  const location = useLocation();
  const [data, setData] = useState<QuestionCategory[]>();
  const [draft, setDraft] = useState<any>();
  const [noquesMessage, setNoquesMessage] = useState<any[]>();
  const [SubmittedQuestion, setSubmittedQuestion] = useState();
  const { user } = useAuth();

  const coreContent = location.state?.coreContent;
  const strategy = location.state?.strategy;
  const fixedValue = location.state?.fixedValue;

  const fetchDraftData = (domain: any) => {
    const dummyDraftData = {
      Q1: '',
      Q2: '',
      Q3: '',
    };
    setDraft(dummyDraftData);
  };
  const getSubmittedQuestion = (domain: any) => {
    get(
      `/issb/get_submitted_answers/?entity_Id=${user?.entity_Id}&topic=${domain}&sub_topic=${fixedValue}`
    )
      .then((res: any) => {
        const apiData = res?.response?.data;
        setSubmittedQuestion(apiData || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchApiData = (domain: any) => {
    get(`/issb/get_topic_questions/?name=${domain}&topic=${fixedValue}`)
      .then((res: any) => {
        if (res?.response?.status === true) {
          const result = res?.response?.data?.map(
            (data: any, index: number) => ({
              id: data?.id,
              text: data?.disclosure,
              options: data?.type,
              Q_id: data.reference,
            })
          );
          setData(result);
        }
      })
      .catch((err) => {
        setNoquesMessage(err?.message);
      });
  };

  useEffect(() => {
    const domain = coreContent || strategy;
    if (domain) {
      fetchApiData(domain);
      fetchDraftData(domain);
      getSubmittedQuestion(domain);
    }
  }, [coreContent, strategy]);

  return (
    <>
      {data ? (
        <ISSBAssessment
          questions={data}
          draft={draft}
          SubmittedQuestion={SubmittedQuestion}
          fixedValue={fixedValue}
          domain={coreContent || strategy}
        />
      ) : (
        <Spin spinning={true}></Spin>
      )}
    </>
  );
}
