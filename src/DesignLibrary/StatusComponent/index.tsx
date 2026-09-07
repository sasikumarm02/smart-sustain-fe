import React, { FC } from 'react';
import Styles from './status.module.scss';
import { Button, Badge } from 'antd';

interface ButtonProps {
  status?: 'success' | 'warning' | 'failure';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  text?: string;
}

const StatusComponent: FC<ButtonProps> = ({
  status = 'success',
  size = 'xl',
  text = '',
}) => {
  const statusColor =
    status === 'success'
      ? Styles.statusSuccess
      : status === 'warning'
        ? Styles.statusWarning
        : Styles.statusFailure;

  return (
    <div className={Styles.wrapper}>
      <div className={`${Styles.dot} ${statusColor}`}> </div>
      <span className={statusColor}>{text}</span>
    </div>
  );
};

export default StatusComponent;
