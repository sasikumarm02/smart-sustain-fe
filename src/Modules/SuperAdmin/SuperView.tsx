import { useEffect, useState } from 'react';
import { ButtonComponent, PageCardComponent } from '../../DesignLibrary';
import { Col, Row, Select, message, Menu } from 'antd';
import { get } from '../../Services';
import { useLocation, useNavigate } from 'react-router-dom';
import Styles from './super.module.scss';
import PlantIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/plantIcon';
import GroupIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/groupIcon';
import BankIcon from '../../assets/Svg/MaturityAssessment/completeAssessment/bankIcon';
import PlantIconWhite from '../../assets/Svg/MaturityAssessment/completeAssessment/plantIconWhite';
import GroupIconWhite from '../../assets/Svg/MaturityAssessment/completeAssessment/groupIconWhite';
import BankIconWhite from '../../assets/Svg/MaturityAssessment/completeAssessment/bankIconWhite';

function SuperView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState<any>([]);
  const [financialYears, setFinancialYears] = useState<any>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<any>(null);

  const fetchCompanies = async () => {
    try {
      const res = await get(`/entity/entity_dropdown/`);
      const resData = res?.response?.data || [];
      setCompanies(resData);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyChange = (value: any) => {
    setSelectedCompany(value);
    const selectedEntity = companies.find(
      (company: any) => company.entity_Id === value.value
    );
    setFinancialYears(selectedEntity?.financial_years || []);
    setSelectedFinancialYear(null); // Reset the financial year when company changes
  };

  const handleFinancialYearChange = (value: any) => {
    setSelectedFinancialYear(value);
  };

  useEffect(() => {
    fetchCompanies();
    if (location.state) {
      setSelectedCompany(location.state.company);
      setSelectedFinancialYear(location.state.financialYear);
    }
  }, [location.state]);

  const isFormValid = selectedCompany && selectedFinancialYear;

  const showWarningMessage = () => {
    message.warning(
      'Please select both the company and Reporting Period before proceeding.'
    );
  };

  const handleNavigation = (link: string) => {
    if (!isFormValid) {
      showWarningMessage(); // Show warning if form is invalid
    } else {
      navigate(`${link}`, {
        state: {
          company: selectedCompany,
          financialYear: selectedFinancialYear,
        },
      });
    }
  };

  // Separate hover state for each section
  const [isHoveredPlant, setIsHoveredPlant] = useState(false);
  const [isHoveredSocial, setIsHoveredSocial] = useState(false);
  const [isHoveredGovernance, setIsHoveredGovernance] = useState(false);

  const handleMouseEnterPlant = () => setIsHoveredPlant(true);
  const handleMouseLeavePlant = () => setIsHoveredPlant(false);

  const handleMouseEnterSocial = () => setIsHoveredSocial(true);
  const handleMouseLeaveSocial = () => setIsHoveredSocial(false);

  const handleMouseEnterGovernance = () => setIsHoveredGovernance(true);
  const handleMouseLeaveGovernance = () => setIsHoveredGovernance(false);

  const [showGHGSubtopics, setShowGHGSubtopics] = useState(false);
  const [showWaterSubtopics, setShowWaterSubtopics] = useState(false);
  const [showScope3Subtopics, setShowScope3Subtopics] = useState(false);

  const handleToggleWaterSubtopics = () => {
    setShowWaterSubtopics((prevState) => !prevState);
  };

  const handleToggleGHGSubtopics = () => {
    setShowGHGSubtopics((prevState) => {
      if (prevState === true) setShowScope3Subtopics(false); // Close Scope 3 when GHG is closed
      return !prevState;
    });
  };

  const handleToggleScope3Subtopics = () => {
    setShowScope3Subtopics((prevState) => !prevState);
  };

  useEffect(() => {
    if (selectedCompany) {
      const selectedEntity = companies.find(
        (company: any) => company.entity_Id === selectedCompany?.value
      );
      const availableFinancialYears = selectedEntity?.financial_years || [];
      setFinancialYears(availableFinancialYears);
    }
  }, [companies, selectedCompany]); // Trigger on companies or selectedCompany changes

  const handleReset = () => {
    setSelectedCompany(null);
    setSelectedFinancialYear(null);
  };

  return (
    <>
      <PageCardComponent className={Styles.pageCardStyle}>
        <Row gutter={16}>
          <Col span={6}>
            <div className={Styles.selectHeading}>Company :</div>
            <Select
              showSearch
              className={Styles.formSelect}
              placeholder="Select Company"
              onChange={handleCompanyChange}
              value={selectedCompany}
              labelInValue
              optionFilterProp="label"
            >
              {companies.map((company: any) => (
                <Select.Option
                  key={company.entity_Id}
                  value={company.entity_Id}
                  label={company.entity_name}
                >
                  {company.entity_name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <div className={Styles.selectHeading}>Reporting period :</div>
            <Select
              showSearch
              placeholder="Select Reporting Period"
              className={Styles.formSelect}
              disabled={!financialYears.length}
              onChange={handleFinancialYearChange}
              value={selectedFinancialYear}
            >
              {financialYears.map((year: any, index: any) => {
                // Extract the year part from the string and format it as "FY YYYY"
                const formattedYear = `FY${year.split(' ')[1]}`;

                return (
                  <Select.Option key={index} value={year}>
                    {formattedYear}
                  </Select.Option>
                );
              })}
              {/* {financialYears.map((year: any, index: any) => (
                <Select.Option key={index} value={year}>
                  {year}
                </Select.Option>
              ))} */}
            </Select>
          </Col>
          <Col span={2} style={{ marginTop: '30px' }} onClick={handleReset}>
            <ButtonComponent hierarchy="tertiary">Reset</ButtonComponent>
          </Col>
        </Row>

        <Row gutter={16} className="mt-3">
          <Col span={8}>
            <div
              className={`${Styles.divContainer} ${isHoveredPlant ? Styles.hoveredDiv : ''}`}
            >
              {isHoveredPlant ? (
                <>
                  {' '}
                  <div>
                    <PlantIconWhite />{' '}
                  </div>
                </>
              ) : (
                <div>
                  <PlantIcon className={Styles.IconColor} />
                </div>
              )}
              <p
                className={`${Styles.divHeading} ${isHoveredPlant ? Styles.hoveredHeading : ''}`}
              >
                Environment
              </p>
            </div>

            <div
              className={`${Styles.linksDiv} mt-2`}
              onMouseEnter={handleMouseEnterPlant}
              onMouseLeave={handleMouseLeavePlant}
            >
              <p className={Styles.linkText} onClick={handleToggleGHGSubtopics}>
                GHG Emissions
              </p>
              {showGHGSubtopics && (
                <div className={Styles.subtopics}>
                  <p
                    className={Styles.subLinkText}
                    onClick={() => handleNavigation('/environment/emissions')}
                  >
                    Scope 1
                  </p>
                  <p
                    className={Styles.subLinkText}
                    onClick={() => handleNavigation('/environment/scope2')}
                  >
                    Scope 2
                  </p>
                  <p
                    className={Styles.subLinkText}
                    onClick={handleToggleScope3Subtopics}
                  >
                    Scope 3
                  </p>
                </div>
              )}
              {showScope3Subtopics && (
                <div className={Styles.subtopics}>
                  <p
                    className={Styles.subLinkText2}
                    onClick={() => handleNavigation('/scope3/category-1')}
                  >
                    Category 1
                  </p>
                  <p
                    className={Styles.subLinkText2}
                    onClick={() => handleNavigation('/scope3/category-2')}
                  >
                    Category 2
                  </p>
                  <p
                    className={Styles.subLinkText2}
                    onClick={() => handleNavigation('/scope3/category-3')}
                  >
                    Category 3
                  </p>
                  <p
                    className={Styles.subLinkText2}
                    onClick={() => handleNavigation('/scope3/category-5')}
                  >
                    Category 5
                  </p>
                  <p
                    className={Styles.subLinkText2}
                    onClick={() => handleNavigation('/scope3/category-6')}
                  >
                    Category 6
                  </p>
                  <p
                    className={Styles.subLinkText2}
                    onClick={() => handleNavigation('/scope3/category-13')}
                  >
                    Category 13
                  </p>
                </div>
              )}
              <p
                className={Styles.linkText}
                onClick={handleToggleWaterSubtopics}
              >
                Water
              </p>
              {showWaterSubtopics && (
                <div className={Styles.subtopics}>
                  <p
                    className={Styles.subLinkText}
                    onClick={() =>
                      handleNavigation(
                        '/environment/water-withdrawal-consumption'
                      )
                    }
                  >
                    Water Withdrawal & Consumption
                  </p>
                  <p
                    className={Styles.subLinkText}
                    onClick={() => handleNavigation('/environment/effluents')}
                  >
                    Effluents
                  </p>
                </div>
              )}
              <p
                className={Styles.linkText}
                onClick={() =>
                  handleNavigation('/environment/waste-management')
                }
              >
                Waste Management
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div
              className={`${Styles.divContainer} ${isHoveredSocial ? Styles.hoveredDiv : ''}`}
            >
              {isHoveredSocial ? (
                <>
                  {' '}
                  <div>
                    <GroupIconWhite />{' '}
                  </div>
                </>
              ) : (
                <div>
                  <GroupIcon className={Styles.IconColor} />
                </div>
              )}
              <p
                className={`${Styles.divHeading} ${isHoveredSocial ? Styles.hoveredHeading : ''}`}
              >
                Social
              </p>
            </div>

            <div
              className={`${Styles.linksDiv} mt-2`}
              style={{ height: '135px' }}
              onMouseEnter={handleMouseEnterSocial}
              onMouseLeave={handleMouseLeaveSocial}
            >
              <p
                className={Styles.linkText}
                onClick={() => handleNavigation('/employee-demographics')}
              >
                Employee Demographics
              </p>
              <p
                className={Styles.linkText}
                onClick={() => handleNavigation('/fatalities-injuries')}
              >
                Safety Performance
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div
              className={`${Styles.divContainer} ${isHoveredGovernance ? Styles.hoveredDiv : ''}`}
            >
              {isHoveredGovernance ? (
                <>
                  {' '}
                  <div>
                    <BankIconWhite />{' '}
                  </div>
                </>
              ) : (
                <div>
                  <BankIcon className={Styles.IconColor} />
                </div>
              )}
              <p
                className={`${Styles.divHeading} ${isHoveredGovernance ? Styles.hoveredHeading : ''}`}
              >
                Governance
              </p>
            </div>

            <div
              className={`${Styles.linksDiv} mt-2`}
              style={{ height: '135px' }}
              onMouseEnter={handleMouseEnterGovernance}
              onMouseLeave={handleMouseLeaveGovernance}
            >
              <p
                className={Styles.linkText}
                onClick={() => handleNavigation('/board-composition')}
              >
                Board Composition
              </p>
              <p
                className={Styles.linkText}
                onClick={() => handleNavigation('/governance/Incidents')}
              >
                Governance Compliance
              </p>
            </div>
          </Col>
        </Row>
      </PageCardComponent>
    </>
  );
}

export default SuperView;
