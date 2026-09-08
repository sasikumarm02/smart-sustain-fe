import { useEffect, useState } from 'react';
import ExcelComponent from '../../../DesignLibrary/ExcelComponent';
import { useAuth } from '../../../Hooks/useAuth';
import { get } from '../../../Services';

function IssbExcel() {
  const { user } = useAuth();
  const [questionData, setQuestionData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const transformQuestionData = (data: any) => {
    return data.map((item: any) => ({
      id: item.id,
      topic: item.question_data.topic,
      reference: item.question_data.reference,
      section: item.question_data.section,
      sub_section: item.question_data.sub_section,
      sub_sub_section: item.question_data.sub_sub_section,
      disclosure: item.question_data.disclosure,
      evaluation: item.evaluation,
      analysis: item.analysis,
      source: item.source,
      location: item.location,
      page_number: item.page_number,
      priority_level: item.priority_level,
      recommendation: item.recommendation,
    }));
  };

  const fetchQuestionData = () => {
    setIsLoading(true);
    get(`/issb/answers_download/?entity_Id=${user?.entity_Id}`)
      .then((res: any) => {
        const transformedData = transformQuestionData(res?.response?.answers);
        setQuestionData(transformedData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const excelQuestionHeaders = [
    { label: 'ID', key: 'Id' },
    { label: 'Topic', key: 'Topic' },
    { label: 'Reference', key: 'Reference' },
    { label: 'Section', key: 'Section' },
    { label: 'Sub Section', key: 'Sub-Section' },
    { label: 'Sub Sub Section', key: 'Sub-sub-section' },
    { label: 'Disclosure', key: 'Disclosure' },
    { label: 'Evaluation', key: 'Evaluation' },
    { label: 'Analysis', key: 'Analysis' },
    { label: 'Source', key: 'Source' },
    { label: 'Location', key: 'Location' },
    { label: 'Page Number', key: 'Page number' },
    { label: 'Priority Level', key: 'Priority level' },
    { label: 'Recommendation', key: 'Recommendation' },
  ];

  const flattenQuestionDataSource = questionData.map((item: any) => ({
    Id: item.id || '',
    Topic: item.topic || '',
    Reference: item.reference || '',
    Section: item.section || '',
    'Sub-Section': item.sub_section || '',
    'Sub-sub-section': item.sub_sub_section || '',
    Disclosure: item.disclosure || '',
    Evaluation: item.evaluation || '',
    Analysis: item.analysis || '',
    Source: item.source || '',
    Location: item.location || '',
    'Page number': item.page_number || '',
    'Priority level': item.priority_level || '',
    Recommendation: item.recommendation || '',
  }));

  const headerQuestionKeys = excelQuestionHeaders.map((header) => header.key);

  useEffect(() => {
    fetchQuestionData();
  }, [user]);

  return (
    <div>
      <ExcelComponent
        filename="Question Analysis Report"
        sheet="Question Analysis Report"
        headers={headerQuestionKeys}
        data={flattenQuestionDataSource}
        isTableVisible={true}
      />
    </div>
  );
}

export default IssbExcel;
