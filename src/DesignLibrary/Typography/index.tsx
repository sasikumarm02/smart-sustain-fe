import { Children, FC } from 'react';
import styles from './typography.module.scss';
import { color } from 'echarts';

interface TypographyProps {
  size?: 'xl-2' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  type?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  children: React.ReactNode;
  ClassName?: string;
}

const TypographyComponent: FC<TypographyProps> = ({
  size = 'md',
  type = 'medium',
  color = '#101828',
  children,
  ClassName,
}) => {
  const classNames = `${styles[size]} ${styles[type]} ${ClassName}`;

  return (
    <div className={classNames} style={{ color }}>
      {children}
    </div>
  );
};

export default TypographyComponent;
