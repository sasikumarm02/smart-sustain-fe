import React, { useState } from 'react';

const TickCircle = ({ color }: { color: string }) => {
  const [currentColor, setCurrentColor] = useState(color);

  const handleClick = () => {
    setCurrentColor(currentColor === '#999999' ? '#009B3E' : '#999999');
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
        <g clip-path="url(#clip0_391_14749)">
          <path
            d="M12 0C5.3832 0 0 5.3832 0 12C0 18.6168 5.3832 24 12 24C18.6168 24 24 18.6168 24 12C24 5.3832 18.6168 0 12 0ZM12 21.8182C6.58618 21.8182 2.18182 17.4137 2.18182 12C2.18182 6.58625 6.58618 2.18182 12 2.18182C17.4138 2.18182 21.8182 6.58625 21.8182 12C21.8182 17.4137 17.4137 21.8182 12 21.8182Z"
            fill={currentColor}
          />
          <path
            d="M16.5005 7.75699L10.3293 13.9281L7.50096 11.0997C7.075 10.6737 6.38424 10.6736 5.9582 11.0996C5.53216 11.5256 5.53216 12.2163 5.9582 12.6424L9.55791 16.2422C9.76249 16.4468 10.0399 16.5618 10.3293 16.5618H10.3293C10.6186 16.5618 10.8961 16.4468 11.1007 16.2423L18.0433 9.29983C18.4693 8.87379 18.4693 8.1831 18.0433 7.75706C17.6173 7.33103 16.9266 7.33095 16.5005 7.75699Z"
            fill={currentColor}
          />
        </g>
        <defs>
          <clipPath id="clip0_391_14749">
            <rect width="27" height="27" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};

export default TickCircle;
