import React, { useEffect, useRef, useState } from 'react';
import pdfIcon from '../../assets/image/carbon-footprint-btn.png';
import { Button, Flex, message, Spin } from 'antd';
import * as echarts from 'echarts';
import Page1 from '../../assets/image/page1.png';
import Page21 from '../../assets/image/page2(1).png';
import Page22 from '../../assets/image/page2(2).png';
import Page31 from '../../assets/image/page3(1).png';
import Page31_2 from '../../assets/image/image 127 (1).png';
import Page32 from '../../assets/image/page3(2).png';
import Page41 from '../../assets/image/page4(1).png';
import Page42 from '../../assets/image/page4(2).png';
import Page5 from '../../assets/image/page5.png';
import Page61 from '../../assets/image/page6(1).png';
import Page62 from '../../assets/image/page6(2).png';
import Page71 from '../../assets/image/page7(1).png';
import Page72 from '../../assets/image/page7(2).png';
import Page81 from '../../assets/image/page8(1).png';
import Page82 from '../../assets/image/page8(2).png';
import Page9 from '../../assets/image/page9.png';
import HomeImage from '../../assets/image/PPT-1 (1).png';
import MainLogo from '../../assets/image/MainPdfLogo.png';
import CardBackground from '../../assets/image/CardBackground.png';
import Sustainability from '../../assets/image/Sustainability.png';
import ESGPerformImg from '../../assets/image/ESGPerform.png';
import AssessmentResultsImg from '../../assets/image/AssessmentResults.png';
import socialAssessImg from '../../assets/image/socialAssess.jpg';
import RiskImg from '../../assets/image/Risk.jpg';
import HumanImg from '../../assets/image/HumanCapital.jpg';
import EngageImg from '../../assets/image/Engagement.jpg';
import GovernanceImg from '../../assets/image/governance.jpg';
import RecommendImg from '../../assets/image/Recommendations.jpg';
import AssessReportImg from '../../assets/image/AssessReport.png';
import mergeImages from 'merge-images';

import { message as notificationMessage } from 'antd';
import { useAuth } from '../../Hooks/useAuth';
import { get } from '../../Services';
import pdfMake from 'pdfmake/build/pdfmake';
import { isEmpty } from '../../Utils/isEmpty';
import PdfFormat from '../../assets/Svg/Dashboard/PdfFormat';
import {
  formatYearRange,
  getCurrentDate,
  removeLastWord,
} from '../Emissions/Scope3/Helpers';
import { Line } from 'recharts';
import DownloadIcon from '../../assets/Svg/DownloadIcon';
import DownloadPdf from '../../assets/Svg/DownloadPdf';
import Styles from './Assessement.module.scss';

const pdfFonts = require('pdfmake/build/vfs_fonts');

const AssessmentPDF = (report: any) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef<HTMLDivElement | null>(null);

  pdfMake.vfs = pdfFonts?.pdfMake.vfs;

  function formatDate(dateStr: any) {
    const date = new Date(dateStr);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear()?.toString()?.substr(2, 2);
    return `${month}-${year}`;
  }

  const financialYear = user?.financial_year
    ? user?.financial_year
    : ['2024-01-04T18:30:00Z', '2024-12-04T18:30:00Z'];
  const formattedFinancialYear = `${formatDate(financialYear[0])} - ${formatDate(financialYear[1])}`;

  function createCircularProgressBarImage(
    percentage: number,
    size: number = 200,
    strokeWidth: number = 25,
    progressColor: string = 'rgba(0, 48, 133, 1)',
    backgroundColor: string = 'rgba(229, 229, 229, 1)',
    font: string = '30px Arial',
    textColor: string = '#000000'
  ): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Unable to get canvas context');

    canvas.width = size;
    canvas.height = size;

    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.lineWidth = strokeWidth;
    context.strokeStyle = backgroundColor;
    context.stroke();

    const endAngle = (2 * Math.PI * percentage) / 100;
    context.beginPath();
    context.arc(centerX, centerY, radius, -Math.PI / 2, endAngle - Math.PI / 2);
    context.strokeStyle = progressColor;
    context.stroke();

    context.font = font;
    context.fillStyle = textColor;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    const text = `${Math.round(percentage)}%`;
    context.fillText(text, centerX, centerY);

    return canvas.toDataURL();
  }

  const generatePdf = async (data: any) => {
    const imageUrl =
      'https://image.freepik.com/free-photo/close-up-earth-nature-background-esg-environmental-social-corporate-governance-concept-nature-onservation-ecology-social-responsibility-sustainability_193146657.jpg'; // Example direct image URL

    try {
      const progressBarEnv = createCircularProgressBarImage(
        data?.['pillar_wise_scores']?.['Environment']?.['Pillar_Percentage']
      );
      const progressBarSoc = createCircularProgressBarImage(
        data?.['pillar_wise_scores']?.['Social']?.['Pillar_Percentage']
      );
      const progressBarGov = createCircularProgressBarImage(
        data?.['pillar_wise_scores']?.['Governance']?.['Pillar_Percentage']
      );

      const Com_Eng_Topic_Rating =
        data?.['topic_wise_scores'][0]?.[
          'Community_Engagement_and_Customer_Relations'
        ]?.['maturity_rating'];

      const Sust_strat_Topic_Rating =
        data?.['topic_wise_scores'][0]?.[
          'Sustainability_Strategy_and_Policies'
        ]?.['maturity_rating'];

      const Imple_Moni_Topic_Rating =
        data?.['topic_wise_scores'][0]?.[
          'Implementation_Monitoring_and_Reporting'
        ]?.['maturity_rating'];

      const Risk_Topic_Rating =
        data?.['topic_wise_scores'][0]?.['Risk_and_Opportunity_Management']?.[
          'maturity_rating'
        ];

      const Governance_Topic_Rating =
        data?.['topic_wise_scores'][0]?.['Governance_and_Ethical_Practices']?.[
          'maturity_rating'
        ];

      const Human_Capital_Topic_Rating =
        data?.['topic_wise_scores'][0]?.['Human_Capital']?.['maturity_rating'];

      const getBase64ImageFromUrl = async (url: any) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const HomeImage1 = await getBase64ImageFromUrl(HomeImage);
      const BackgroundImage = await getBase64ImageFromUrl(CardBackground);
      const PageImage1 = await getBase64ImageFromUrl(Page1);
      const PageImage21 = await getBase64ImageFromUrl(Page21);
      const PageImage22 = await getBase64ImageFromUrl(Page22);
      const PageImage31 = await getBase64ImageFromUrl(Page31);
      const PageImage31_2 = await getBase64ImageFromUrl(Page31_2);
      const PageImage41 = await getBase64ImageFromUrl(Page41);
      const PageImage42 = await getBase64ImageFromUrl(Page42);
      const PageImage5 = await getBase64ImageFromUrl(Page5);
      const PageImage61 = await getBase64ImageFromUrl(Page61);
      const PageImage62 = await getBase64ImageFromUrl(Page62);
      const PageImage71 = await getBase64ImageFromUrl(Page71);
      const PageImage72 = await getBase64ImageFromUrl(Page72);
      const PageImage81 = await getBase64ImageFromUrl(Page81);
      const PageImage82 = await getBase64ImageFromUrl(Page82);
      const PageImage9 = await getBase64ImageFromUrl(Page9);
      const logo = await getBase64ImageFromUrl(MainLogo);
      const SustainabilityImg = await getBase64ImageFromUrl(Sustainability);
      const ESGPerform = await getBase64ImageFromUrl(ESGPerformImg);
      const AssessmentResults =
        await getBase64ImageFromUrl(AssessmentResultsImg);
      const socialAssess = await getBase64ImageFromUrl(socialAssessImg);
      const Governance = await getBase64ImageFromUrl(GovernanceImg);
      const Recommendations = await getBase64ImageFromUrl(RecommendImg);
      const Engage = await getBase64ImageFromUrl(EngageImg);
      const Human = await getBase64ImageFromUrl(HumanImg);
      const Risk = await getBase64ImageFromUrl(RiskImg);
      const AssessReport = await getBase64ImageFromUrl(AssessReportImg);

      const docDefinition: any = {
        content: [
          //***** page 1 starts *****
          {
            image: HomeImage1,
            width: 520,
            height: 650,
          },
          {
            text: `${user?.entity_name}`,
            absolutePosition: { x: 80, y: 400 },
            fontSize: 64,
            bold: true,
            fontFamily: 'Arial',
            color: '#14AB4D',
          },
          {
            text: `ESG Maturity Assessment`,
            absolutePosition: { x: 80, y: 470 },
            fontSize: 35,
            bold: true,
            fontFamily: 'Arial',
            color: '#fff',
          },
          {
            text: `This report contains next key actionable steps as you plan, implement and advance in your sustainability journey.`,
            absolutePosition: { x: 80, y: 530 },
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#fff',
            margin: [10, 10],
            width: '80%',
          },
          {
            absolutePosition: { x: 80, y: 580 },
            text: `Reporting Period FY ${formatYearRange(user.financial_year)} `,
            fontSize: 16,
            bold: true,
            color: '#fff',
          },
          {
            absolutePosition: { x: 80, y: 600 },
            text: `${getCurrentDate()}`,
            fontSize: 14,
            bold: true,
            color: '#fff',
          },
          //***** page 1 ends  *****
          //***** Disclaimer  *****
          {
            text: 'Disclaimer',
            pageBreak: 'before', // Ensures this content starts on a new page
            style: 'header2',
          },
          {
            text: `This report is prepared solely for the use of the ${user.entity_name}, for the purpose of ESG Maturity Assessment, and should not be used, quoted, referred to or relied upon, in whole or in part, without Smart Sustain.AI Services Pte. Ltd.’s prior written permission, by any third party or for any other purposes. We do not assume responsibility for loss and expressly disclaim any liability to any party whatsoever, however arising, out of the use of this report contrary to the purpose of this engagement as set out above.
    
            The information contained herein is of a general nature and is not intended to address the circumstances of any particular individual or entity. Although we endeavour to provide accurate and timely information, there can be no guarantee that such information is accurate as of the date it is received or that it will continue to be accurate in the future. No one should act on such information without appropriate professional advice after a thorough examination of the particular situation.
    
            The Smart Sustain.AI name and logo are trademarks used under license by the independent member firms of the Smart Sustain.AI global organisation.`,
            style: 'disclaimer',
            lineHeight: 1.2,
            alignment: 'justify',
          },
          {
            text: '',
            pageBreak: 'after',
          },
          //***** Disclaimer ends *****
          { image: AssessReport, width: 510 },
          {
            text: 'ESG Maturity Assessment Report',
            fontSize: 30,
            bold: true,
            margin: [0, 20, 0, 20],
            color: '#0D304A',
            alignment: 'left',
          },
          //ESG Maturity Assessment Report *****
          {
            width: '100%',
            margin: [0, 0, 0, 0],
            stack: [
              {
                text: `This Environmental, Social and Governance (ESG) maturity report outlines ${user.entity_name}’s commitment to sustainable and responsible business practices. It provides a comprehensive overview of ESG performance in ${formatYearRange(user.financial_year)}.`,
                margin: [0, 0, 0, 10],
                lineHeight: 1.2,
                alignment: 'justify',
              },
              {
                text: `A strong ESG performance is essential for long-term readiness success and contributes to a holistic sustainable future for all stakeholders.`,
                margin: [0, 0, 0, 10],
                lineHeight: 1.2,
                alignment: 'justify',
              },
              {
                text: `Additionally, this report aligns with the Singapore Green Plan 2030. Our platform can help identify specific areas where ${user.entity_name} is contributing to the nation’s green goals.`,
                margin: [0, 0, 0, 10],
                lineHeight: 1.2,
                alignment: 'justify',
              },
              {
                text: `Our Smart Sustain.AI SMART (Sustainability Measurement And Reporting Tool) categorises companies’ sustainability progress into five stages: Absent (L0), Aware (L1), Advance (L2), Adept (L3), and Adaptive (L4). This assessment helps businesses understand their current position and provides tailored guidance for each stage to support their sustainability journey.`,
                margin: [0, 0, 0, 10],
                lineHeight: 1.2,
                alignment: 'justify',
              },
              {
                text: `The assessment results presented in this report provide a snapshot of  ${user.entity_name}’s ESG maturity level across ESG dimensions.`,
                margin: [0, 0, 0, 10],
                lineHeight: 1.2,
                alignment: 'justify',
              },
              {
                text: `ESG maturity assessment recommendations generated by the tool aims to guide your organisation in enhancing individual E, S and G performance and achieving their sustainability goals. By addressing these recommendations, companies can elevate their ESG standing and create a more sustainable business.`,
                margin: [0, 0, 0, 10],
                lineHeight: 1.2,
                alignment: 'justify',
              },
            ],
          },
          {
            text: '',
            pageBreak: 'after',
          },
          //ESG Maturity Assessment Report ends *****
          // Your Sustainability Stage *******
          { image: SustainabilityImg, width: 510 },

          {
            text: 'Your Sustainability Stage',
            fontSize: 30,
            bold: true,
            margin: [0, 20, 0, 0],
            color: '#0D304A',
          },
          {
            text: `Based on your responses to the online assessment, your company is in a Sustainability Stage of ${data?.['pillar_wise_scores']?.['Overall_Rating']}.`,
            margin: [0, 20, 0, 20],
            fontSize: 12,
            bold: true,
          },

          {
            text: `Your organisation has achieved peak ESG performance, operating at ${data?.['pillar_wise_scores']?.['Overall_Rating']} stage.`,
            margin: [0, 20, 0, 0],
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.2,
          },
          {
            text: `You have quantified your impact, accessed carbon markets, and are a global eco-leader setting new standards. `,
            margin: [0, 10, 0, 0],
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.2,
          },
          {
            text: `Your social commitment, with a focus on employees, diversity, community, and customer satisfaction, is exemplary.`,
            margin: [0, 10, 0, 0],
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.2,
          },
          {
            text: `In governance, you excel with advanced privacy, robust risk management, and global recognition. Your organisation is a sustainability beacon, inspiring others and shaping the future.`,
            margin: [0, 10, 0, 0],
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.2,
          },
          //********* */
          {
            pageBreak: 'after',
            text: '',
          },
          { image: AssessmentResults, width: 510, height: 240 },
          {
            text: 'ESG Maturity Assessment Results ',
            fontSize: 30,
            bold: true,
            margin: [0, 10, 0, 10],
            color: '#0D304A',
            fontFamily: 'Arial',
          },

          {
            text: '1. Environment',
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
          },
          {
            columns: [
              {
                width: '30%',
                stack: [
                  {
                    image: BackgroundImage,
                    width: 150,
                    height: 100,
                    margin: [20, 20, 0, 0],
                    absolutePosition: { x: 40, y: 340 },
                  },
                  // {
                  //   text: `Environment`,
                  //   absolutePosition: { x: 55, y: 350 },
                  //   fontSize: 12,
                  //   bold: true,
                  //   fontFamily: 'Arial',
                  //   color: '#0072C3',
                  // },
                  {
                    text: `${data?.['pillar_wise_scores']?.['Environment']?.['Maturity_Rating']}`,
                    absolutePosition: { x: 85, y: 350 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#333333',
                  },
                  {
                    image: progressBarEnv,
                    width: 60,
                    height: 50,
                    margin: [20, 30, 0, 0],
                    absolutePosition: { x: 85, y: 380 },
                  },
                ],
              },
              {
                width: '70%',
                stack: [
                  {
                    text: `${data?.pillar_wise_scores?.Environment?.Pillar_Description}`,
                    margin: [0, 5, 20, 0],
                    color: '#333333',
                    alignment: 'justify',
                    fontFamily: 'Arial',
                    lineHeight: 1.15,
                    fontSize: 10,
                  },
                ],
              },
            ],
          },

          // **************

          {
            text: '2. Social',
            fontSize: 14,
            bold: true,
            margin: [0, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
          },
          {
            columns: [
              {
                width: '30%',
                margin: [0, 10, 20, 0],
                stack: [
                  {
                    image: BackgroundImage,
                    width: 150,
                    height: 100,
                    margin: [0, 0, 0, 0],
                    position: 'relative',
                  },

                  {
                    text: `${data?.['pillar_wise_scores']?.['Social']?.['Maturity_Rating']}`,
                    relativePosition: { x: 45, y: -85 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#333333',
                  },
                  {
                    image: progressBarSoc,
                    width: 60,
                    height: 50,
                    relativePosition: { x: 45, y: -60 },
                  },
                ],
              },
              {
                width: '70%',
                stack: [
                  {
                    text: `${data?.pillar_wise_scores?.Social?.Pillar_Description}`,
                    margin: [0, 10, 20, 0],
                    color: '#333333',
                    alignment: 'justify',
                    fontFamily: 'Arial',
                    lineHeight: 1.15,
                    fontSize: 10,
                  },
                ],
              },
            ],
          },

          // **************

          {
            text: '3. Governance',
            fontSize: 14,
            bold: true,
            margin: [0, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
          },
          {
            columns: [
              {
                width: '30%',
                margin: [0, 10, 20, 0],
                stack: [
                  {
                    image: BackgroundImage,
                    width: 150,
                    height: 100,
                    margin: [0, 0, 0, 0],
                    position: 'relative',
                  },
                  {
                    text: `${data?.['pillar_wise_scores']?.['Governance']?.['Maturity_Rating']}`,
                    relativePosition: { x: 45, y: -85 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#333333',
                  },
                  {
                    image: progressBarGov,
                    relativePosition: { x: 45, y: -60 },
                    width: 60,
                    height: 50,
                  },
                ],
                unbreakable: true,
              },
              {
                width: '70%',
                stack: [
                  {
                    text: `${data?.pillar_wise_scores?.Governance?.Pillar_Description}`,
                    margin: [0, 10, 20, 0],
                    color: '#333333',
                    alignment: 'justify',
                    fontFamily: 'Arial',
                    lineHeight: 1.15,
                    fontSize: 10,
                  },
                ],
              },
            ],
          },

          {
            pageBreak: 'after',
            text: '',
          },

          {
            text: 'Assessment Recommendations',
            fontSize: 30,
            bold: true,
            margin: [0, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
          },
          {
            text: `The following recommendations aim to help your company build a clear sustainability strategy, engage with stakeholders effectively, and  establish transparent reporting processes. By addressing these foundational elements, you’ll set the stage long-term ESG  performance. 
`,
            margin: [0, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
            fontSize: 12,
          },
          {
            text: `The recommendations are categorised under 6 topics across the ESG pillars. `,
            margin: [0, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
            fontSize: 14,
            bold: 'true',
          },

          {
            columns: [
              {
                width: '*',
                alignment: 'center',

                margin: [0, 100, 20, 0],
                stack: [
                  {
                    absolutePosition: { x: 10, y: 180 },
                    image: logo,
                    width: 400,
                    height: 400,
                  },
                  {
                    text: `Community`,
                    absolutePosition: { x: 10, y: 225 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: 'white',
                  },
                  {
                    text: `Engagement & `,
                    absolutePosition: { x: 10, y: 240 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Customer Relations`,
                    absolutePosition: { x: 10, y: 255 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Community_Engagement_and_Customer_Relations']?.['maturity_rating']}`,
                    absolutePosition: { x: 10, y: 270 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Community_Engagement_and_Customer_Relations']?.['topic_percentage']} % `,
                    absolutePosition: { x: 10, y: 285 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Governance &`,
                    absolutePosition: { x: 230, y: 295 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Ethical Practices`,
                    absolutePosition: { x: 230, y: 310 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Governance_and_Ethical_Practices']?.['maturity_rating']}`,
                    absolutePosition: { x: 240, y: 325 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Governance_and_Ethical_Practices']?.['topic_percentage']} % `,
                    absolutePosition: { x: 240, y: 340 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Human`,
                    absolutePosition: { x: 220, y: 415 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Capital`,
                    absolutePosition: { x: 220, y: 430 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Human_Capital']?.['maturity_rating']} `,
                    absolutePosition: { x: 220, y: 445 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Human_Capital']?.['topic_percentage']} % `,
                    absolutePosition: { x: 220, y: 460 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Sustainability`,
                    absolutePosition: { x: 0, y: 455 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Strategy &`,
                    absolutePosition: { x: 0, y: 470 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Policies`,
                    absolutePosition: { x: 0, y: 485 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Sustainability_Strategy_and_Policies']?.['maturity_rating']}`,
                    absolutePosition: { x: 0, y: 500 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Sustainability_Strategy_and_Policies']?.['topic_percentage']} % `,
                    absolutePosition: { x: 0, y: 515 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Risk &`,
                    absolutePosition: { x: -220, y: 415 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Opportunity`,
                    absolutePosition: { x: -220, y: 430 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Management`,
                    absolutePosition: { x: -220, y: 445 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Risk_and_Opportunity_Management']?.['maturity_rating']}`,
                    absolutePosition: { x: -220, y: 460 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Risk_and_Opportunity_Management']?.['topic_percentage']} % `,
                    absolutePosition: { x: -220, y: 475 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Implementation`,
                    absolutePosition: { x: -210, y: 285 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Monitoring &`,
                    absolutePosition: { x: -210, y: 300 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `Reporting`,
                    absolutePosition: { x: -210, y: 315 },
                    fontSize: 10,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Implementation_Monitoring_and_Reporting']?.['maturity_rating']}`,
                    absolutePosition: { x: -210, y: 330 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                  {
                    text: `${data?.['topic_wise_scores'][0]?.['Implementation_Monitoring_and_Reporting']?.['topic_percentage']} % `,
                    absolutePosition: { x: -210, y: 345 },
                    fontSize: 12,
                    bold: true,
                    fontFamily: 'Arial',
                    color: '#fff',
                  },
                ],
              },
            ],
          },
          {
            pageBreak: 'after',
            text: '',
          },

          //Recommendations

          { image: Recommendations, width: 510, height: 320 },

          {
            text: 'Recommendations',
            fontSize: 30,
            bold: true,
            margin: [0, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
          },

          {
            text: 'Your organisation possesses sufficient financial resources and a workforce with relevant ESG expertise. To effectively advance ESG initiatives, sustained investment in specialised training programmes is crucial. Integrating ESG considerations into core organisational objectives and implementing a mandatory ESG workshop curriculum for all employees will foster a comprehensive understanding of ESG principles and practices.',
            margin: [0, 20, 0, 30],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      {
                        text: 'Topic Level Recommendations',
                        style: 'header',
                        margin: [0, 0, 0, 10],
                      },
                      {
                        stack: [
                          `Community Engagement and Customer Relations - ${removeLastWord(Com_Eng_Topic_Rating)}`,
                          `Governance and Ethical Practices - ${removeLastWord(Governance_Topic_Rating)}`,
                          `Human Capital - ${removeLastWord(Human_Capital_Topic_Rating)}`,
                          `Implementation, Monitoring, and Reporting - ${removeLastWord(Imple_Moni_Topic_Rating)} `,
                          `Risk and Opportunity Management - ${removeLastWord(Risk_Topic_Rating)}`,
                          `Sustainability Strategy and Policies - ${removeLastWord(Sust_strat_Topic_Rating)}`,
                        ],
                      },
                    ],
                    fillColor: '#F0FFF0',
                    margin: [20, 10, 10, 10],
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
          },

          {
            pageBreak: 'after',
            text: '',
          },
          // Recommendations
          { image: Engage, width: 510, height: 320 },

          {
            width: '80%',
            text: `${removeLastWord(Com_Eng_Topic_Rating)} - Community Engagement & Customer Relations`,
            fontSize: 18,
            bold: true,
            margin: [10, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            text: 'You should continue investing in sustainable community development projects, expand volunteer and charitable contributions, and prioritise indigenous rights. In terms of customer relations, you must prioritise product safety through advanced preventive measures and robust recall procedures. Additionally, a relentless focus on customer satisfaction, achieved through innovative practices, comprehensive feedback analysis, and continuous improvement, is crucial for building and maintaining customer loyalty.',
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: '1.25',
          },

          {
            text: `${removeLastWord(Governance_Topic_Rating)} - Governance and Ethical Practices`,
            fontSize: 18,
            bold: true,
            margin: [10, 30, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
          {
            text: 'To sustain leadership in governance and ethical practices, your organisation should prioritise continuous improvement and innovation. ',
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
          {
            text: 'Strengthening board diversity, expanding ethical training, enhancing data privacy, and maintaining vigilance in anti-corruption efforts are essential. By leveraging technology and aligning governance practices with evolving standards, the organisation can solidify its reputation as a responsible and ethical corporate citizen.',
            margin: [10, 20, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            pageBreak: 'after',
            text: '',
          },

          { image: Human, width: 510, height: 320 },

          {
            width: '80%',
            text: `${removeLastWord(Human_Capital_Topic_Rating)} - Human Capital`,
            fontSize: 18,
            bold: true,
            margin: [10, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
          {
            text: 'Your organisation demonstrates a strong commitment to employee well-being with innovative and comprehensive policies exceeding industry benchmarks. It fosters a diverse and inclusive workplace through ambitious DEI targets and best-in-class cultural awareness training. A focus on health and safety is evident with innovative programs that consistently exceed performance expectations. ',
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            text: "The company aligns learning and development with performance goals, leading to enhanced employee performance and external recognition. Additionally, strong labor law compliance, fair wages and benefits, robust grievance mechanisms, and strict adherence to global labor standards solidify the organisation's position as a leader in human capital management.",
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            text: `${removeLastWord(Imple_Moni_Topic_Rating)} - Implementation, Monitoring, and Reporting`,
            fontSize: 18,
            bold: true,
            margin: [10, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            text: 'Your organisation exemplifies a robust approach to implementation, monitoring, and reporting of sustainability initiatives. Full investment in energy efficiency, coupled with a transition to renewable energy sources, demonstrates a strong commitment to operationalising sustainability goals. Rigorous monitoring and verification processes are in place, ensuring accurate measurement and reporting of ESG performance. ',
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            text: "The organisation's participation in industry-leading initiatives and programmes further underscores its dedication to transparency and accountability. By setting industry benchmarks in sustainability reporting and achieving top-tier ratings, the organisation has solidified its position as a leader in the field.",
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          {
            pageBreak: 'after',
            text: '',
          },

          { image: Risk, width: 510, height: 320 },

          {
            text: `${removeLastWord(Risk_Topic_Rating)} - Risk and Opportunity Management`,
            fontSize: 18,
            bold: true,
            margin: [10, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
          {
            text: 'Your organisation demonstrates a strong commitment to risk and opportunity management by implementing robust risk management strategies, including comprehensive stress testing and scenario analysis.',
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
          {
            text: "By integrating these findings into strategic planning, innovation, and resilience building, the organisation has positioned itself as a leader in risk management. This proactive approach contributes to the organisation's overall resilience and sustainability.",
            margin: [10, 20, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },

          //changes

          {
            text: `${removeLastWord(Risk_Topic_Rating)} - Sustainability Strategy and Policies`,
            margin: [10, 20, 0, 0],
            color: '#0D304A',
            fontFamily: 'Arial',
            fontSize: 18,
            bold: true,
          },
          {
            text: 'You have established a strong foundation in sustainability strategy and policy, characterised by ambitious goals and alignment with industry standards. ',
            margin: [10, 10, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
          {
            text: 'To further enhance its leadership position, the organisation should prioritise expanding circular economy initiatives, strengthening climate change mitigation efforts, and enhancing biodiversity conservation. Integrating sustainability into core business functions and fostering collaboration with external stakeholders will be crucial for driving continued progress and innovation.',
            margin: [10, 20, 20, 0],
            color: '#333333',
            alignment: 'justify',
            fontFamily: 'Arial',
            lineHeight: 1.15,
          },
        ],

        footer: function (currentPage: any, pageCount: any) {
          if (currentPage > 1) {
            return {
              stack: [
                // Top line divider
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0,
                      y1: 0,
                      x2: 900, // Adjust width based on page size
                      y2: 0,
                      lineWidth: 1,
                      lineColor: '#E6E6E6',
                    },
                  ],
                  margin: [0, 10, 0, 10],
                },
                // Footer content with adjusted column widths
                {
                  columns: [
                    {
                      text: `Smart Sustain.AI FY ${formatYearRange(user.financial_year)}`,
                      alignment: 'left',
                      style: 'footerText',
                      fontSize: 8,
                      margin: [20, 0, 0, 0], // Adjust left margin
                      width: 100, // Narrow column
                    },
                    // Center column (wider)
                    {
                      text: `© ${formatYearRange(user.financial_year)} Smart Sustain.AI Services Pte. Ltd. (Registration No: 200003956G), a Singapore incorporated company and a member firm of the Smart Sustain.AI global organisation of independent member firms affiliated with Smart Sustain.AI International Limited, a private English company limited by guarantee. All rights reserved.`,
                      alignment: 'center',
                      style: 'footerSmallText',
                      margin: [0, 0, 0, 0],
                      fontSize: 8,
                      width: 420, // Wider column
                    },
                    // Right column (narrow)
                    {
                      text: `${currentPage}`,
                      alignment: 'right',
                      style: 'footerText',
                      fontSize: 8,
                      margin: [0, 0, 0, 0], // Adjust right margin
                      width: 60, // Narrow column
                    },
                  ],
                  margin: [0, 0, 0, 10], // Adjust top and bottom margins for spacing
                },
              ],
              margin: [0, -40, 0, 20],
            };
          }
        },
        pageSize: 'A4',
        styles: {
          header2: {
            fontSize: 18,
            bold: true,
            margin: [15, 20, 0, 10],
            alignment: 'left',
            color: '#0D304A',
            fontWeight: 'bold',
            fontFamily: 'Arial',
          },
          disclaimer: {
            fontSize: 12,
            bold: false,
            color: '#060606',
            margin: [15, 0, 15, 15],
          },

          header: {
            fontSize: 14,
            bold: true,
          },
          list: {
            fontSize: 12,
            margin: [0, 5, 0, 5],
          },
        },
        pageMargins: [40, 20, 40, 20], //Define page margins (left, top, right, bottom)
      };

      pdfMake
        .createPdf(docDefinition)
        .download('Maturity Assessment Report.pdf');
    } catch (err) {
      message.error('unable to download pdf');
      return true;
    }
    return true;
  };

  async function fetchApiData() {
    try {
      setIsLoading(true);
      const res: any = await get(
        `/maturityAssessment/maturity_pdf/?entity_Id=${user.entity_Id}`
      );
      if (res?.status === 'Success' && res.response.status === true) {
        const result = await generatePdf(res.response);
        if (result === true) {
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    } catch (err: any) {
      notificationMessage.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isEmpty(report) ? (
        <div className="d-flex align-items-center mx-4">
          <Button
            loading={isLoading}
            onClick={() => fetchApiData()}
            icon={<DownloadPdf />}
            className={Styles.pdfButton}
          ></Button>
        </div>
      ) : (
        <Button
          loading={isLoading}
          className="mx-1"
          onClick={() => fetchApiData()}
          style={{
            border: 'none',
            marginTop: '-10px',
            cursor: 'pointer',
            background: 'none',
          }}
          icon={<DownloadIcon />}
        ></Button>
      )}
    </>
  );
};

export default AssessmentPDF;
