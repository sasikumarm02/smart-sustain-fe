import React, { useState } from 'react';

const CrossCircle = ({ color }: { color: string }) => {
  const [currentColor, setCurrentColor] = useState(color);

  const handleClick = () => {
    setCurrentColor(currentColor === '#999999' ? '#CB0101' : '#999999');
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        viewBox="0 0 24 24"
        fill="none"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <g clip-path="url(#clip0_391_14745)">
          <path
            d="M12 0C5.38359 0 0 5.38359 0 12C0 18.6164 5.38359 24 12 24C18.6164 24 24 18.6164 24 12C24 5.38359 18.6164 0 12 0ZM12 21.6C6.70664 21.6 2.4 17.2934 2.4 12C2.4 6.70664 6.70664 2.4 12 2.4C17.2934 2.4 21.6 6.70664 21.6 12C21.6 17.2934 17.2934 21.6 12 21.6Z"
            fill={currentColor}
            stroke-width="1"
          />
          <path
            d="M16.4477 7.55078C15.9795 7.08203 15.219 7.08203 14.7508 7.55078L11.9992 10.3023L9.24766 7.55078C8.77947 7.08203 8.01897 7.08203 7.55078 7.55078C7.08203 8.01953 7.08203 8.77891 7.55078 9.24766L10.3023 11.9992L7.55078 14.7508C7.08203 15.2195 7.08203 15.9789 7.55078 16.4477C7.78516 16.682 8.09219 16.7992 8.39922 16.7992C8.70625 16.7992 9.01328 16.682 9.24766 16.4477L11.9992 13.6961L14.7508 16.4477C14.9852 16.682 15.2922 16.7992 15.5992 16.7992C15.9062 16.7992 16.2133 16.682 16.4477 16.4477C16.9164 15.9789 16.9164 15.2195 16.4477 14.7508L13.6961 11.9992L16.4477 9.24766C16.9164 8.77891 16.9164 8.01953 16.4477 7.55078Z"
            fill={currentColor}
            stroke-width="0.1"
          />
        </g>
        <defs>
          <clipPath id="clip0_391_14745">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default CrossCircle;
