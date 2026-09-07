import Styles from '../socialdashboard.module.scss';
import { ModalComponent, PageCardComponent } from '../../../DesignLibrary';
import Fatalities from '../../Dashboard/Fatalities';
import { Row } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SafetyPdf from '../../../Modules/Governance/SafetyPdf';
import { getCurrentYear } from '../../Emissions/Scope3/Helpers';

export default function SafetyPerformance() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={Styles.pageContainer}>
      {' '}
      {/* Wrap everything in a container */}
      <PageCardComponent
        className={Styles.pageCardStyle}
        style={{ minWidth: '100%' }}
      >
        <>
          <Row justify="end" className="mb-2">
            <SafetyPdf />
          </Row>
          <Fatalities></Fatalities>
        </>
      </PageCardComponent>
      <ModalComponent
        isOpen={isOpen}
        content={`Smart Sustain.AI is developed and designed for internal use of ESG team`}
        onCancel={() => setIsOpen(false)}
        onProceed={() => setIsOpen(false)}
        submitBtnText="Ok"
      />
    </div>
  );
}
