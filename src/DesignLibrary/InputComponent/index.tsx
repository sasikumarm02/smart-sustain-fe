// InputComponent.tsx

import React, { ReactNode } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import Styles from './input.module.scss';

interface InputComponentProps extends InputProps {
  label?: string;
  onChange?: any;
  placeHolder?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  labelClassName?: any;
  customClass?: any;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  onChange,
  placeHolder,
  prefixIcon,
  suffixIcon,
  labelClassName,
  customClass,
  ...rest
}) => {
  return (
    <div>
      {label && <label className={labelClassName}>{label}</label>}
      <Input
        className={`${Styles['input']} ${customClass}`}
        prefix={prefixIcon}
        suffix={suffixIcon}
        onChange={onChange}
        {...rest}
        placeholder={placeHolder}
      />
    </div>
  );
};

export default InputComponent;
