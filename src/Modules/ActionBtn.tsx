import React, { FC, MouseEvent } from 'react';
import { Button } from 'antd';

interface ActionBtnProps {
  text: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const ActionBtn: FC<ActionBtnProps> = ({ text, onClick }) => {
  const buttonstyle: React.CSSProperties = {
    background: '#1E5190',
    color: '#fff',
    border: 'none',
    padding: '0 40px',
  };

  return (
    <Button shape="round" size="large" style={buttonstyle} onClick={onClick}>
      {text}
    </Button>
  );
};

export default ActionBtn;
