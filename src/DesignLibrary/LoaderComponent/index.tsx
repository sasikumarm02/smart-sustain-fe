// LoaderComponent.tsx
import React from 'react';
import PropTypes from 'prop-types';
import LoaderGif from './loadergif.gif'; // Adjust the path as needed
import Styles from './loader.module.scss';

interface LoaderComponentProps {
  spinning: boolean;
  children: React.ReactNode;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({
  spinning,
  children,
}) => {
  return (
    <>
      {spinning ? (
        <div className={Styles['loading-container']}>
          <div className={Styles['loader']}>
            <img
              src={LoaderGif}
              alt="Loading..."
              width="150px"
              height="150px"
            />
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

// Optional: If you want to enforce prop types in TypeScript
LoaderComponent.propTypes = {
  spinning: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default LoaderComponent;
