import React from 'react';

export const Link: React.FC<any> = ({ children, href = '#', className = '', onClick, ...props }) => (
  <a
    href={href}
    className={className}
    onClick={(e) => {
      if (onClick) onClick(e);
    }}
    {...props}
  >
    {children}
  </a>
);

export default Link;
