import React, { ReactNode, MouseEvent } from 'react';
import { Button } from 'antd';

interface CustomButtonProps {
  title: ReactNode;
  icon?: ReactNode;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  icon,
  onClick,
}) => {
  return (
    <Button
      style={{
        margin: '0 auto',
        width: 'auto',
        display: 'flex',
        background: '#00338D',
        color: '#fff',
      }}
      size="middle"
      onClick={onClick}
    >
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
      {title}
    </Button>
  );
};

export default CustomButton;
