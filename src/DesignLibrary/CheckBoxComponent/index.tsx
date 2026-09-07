import React, { FC, useState } from 'react';
import { Checkbox, Radio } from 'antd';
import classNames from 'classnames';
import styles from './checkbox.module.scss';

interface CheckBoxProps {
  size?: 'sm' | 'md';
  type?: 'radio' | 'checkbox';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (checked: boolean) => void;
  text?: string;
  supportingText?: string;
}

const CheckBoxComponent: FC<CheckBoxProps> = ({
  size = 'md',
  type = 'checkbox',
  disabled = false,
  onChange,
  className = '',
  style,
  text,
  supportingText,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (e: any) => {
    const checked = e.target.checked;
    setChecked(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  const CheckBoxClass = classNames(
    styles.toggleWrapper,
    styles[size],
    className
  );

  const textWrapperClass = classNames(styles.textWrapper, {
    [styles.noTextNoSupportingText]: !text && !supportingText,
    [styles.onlyText]: text && !supportingText,
    [styles.bothTextAndSupportingText]: text && supportingText,
  });

  return (
    <div className={CheckBoxClass}>
      <div className={styles.switch}>
        {type === 'checkbox' ? (
          <Checkbox
            className={className}
            disabled={disabled}
            checked={checked}
            onChange={handleChange}
          />
        ) : (
          <Radio
            className={className}
            disabled={disabled}
            checked={checked}
            onChange={handleChange}
          />
        )}
      </div>
      {(text || supportingText) && (
        <div className={textWrapperClass}>
          {text && <span className={styles.text}>{text}</span>}
          {text && supportingText && (
            <span className={styles.supportingText}>{supportingText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckBoxComponent;
