import React from 'react';
import { Button } from 'antd';

interface CustomButtonProps {
  label: any;
  onClick: () => void;
  type?: 'default' | 'primary' | 'ghost' | 'dashed' | 'danger' | 'link';
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  type = 'default',
  icon,
  disabled = false,
  size = 'middle',
}: any) => (
  <Button icon={icon} disabled={disabled} size={size} onClick={onClick}>
    {label}
  </Button>
);

export default CustomButton;
