import React from 'react';

const LogoutIcon = ({ className, onClick }: any) => (
  <svg
    className={className}
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M10 11.9392L18.2942 11.9392"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />

    <path
      d="M15.1176 8L18.8648 11.8607C18.9401 11.9383 18.9401 12.0617 18.8648 12.1393L15.1176 16"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />

    <path
      d="M11 6H7C5.89543 6 5 6.89543 5 8V16C5 17.1046 5.89543 18 7 18H11"
      stroke="currentColor"
      stroke-width="1.3"
      stroke-linecap="round"
    />
  </svg>
);
export default LogoutIcon;
