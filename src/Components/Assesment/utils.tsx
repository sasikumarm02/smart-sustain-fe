import React from 'react';

interface StyleProps {
  [key: string]: string;
}

const customFieldSet: StyleProps = {
  border: '1px solid #C0C0C0',
  borderRadius: '10px',
  height: '100%',
  position: 'relative',
};

const ScribblingBox = ({ children, styles, className }: any) => {
  const mergedStyles = { ...customFieldSet, ...styles };
  return (
    <div style={mergedStyles} className={`scribbling-box ${className}`}>
      <div>{children}</div>
    </div>
  );
};

export default ScribblingBox;
