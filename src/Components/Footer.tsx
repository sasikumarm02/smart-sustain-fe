import React from 'react';
import Styles from './Assesment/Assessement.module.scss';
import { getCurrentYear } from './Emissions/Scope3/Helpers';

const Footer = () => {
  return (
    <footer
      className={`${Styles.footer} d-flex justify-content-center align-items-center `}
    >
      <div className={Styles.footerRights}>
        © {getCurrentYear()} Smart Sustain.Ai All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
