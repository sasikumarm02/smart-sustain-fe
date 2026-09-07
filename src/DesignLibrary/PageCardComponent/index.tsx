import React from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import Styles from './pagecard.module.scss';

interface CardComponentProps extends CardProps {
  children?: any;
  customClass?: any;
}

const PageCardComponent: React.FC<CardComponentProps> = ({
  children,
  customClass,
  ...rest
}) => {
  return (
    <Card className={`${Styles['pageCard']} ${customClass}`} {...rest}>
      {children}
    </Card>
  );
};

export default PageCardComponent;
