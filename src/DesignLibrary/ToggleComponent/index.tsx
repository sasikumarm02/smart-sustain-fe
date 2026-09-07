import React, { FC, useState } from 'react';
import { Switch } from 'antd';
import classNames from 'classnames';
import styles from './toggle.module.scss';

interface ToggleProps {
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (checked: boolean) => void;
  text?: string;
  supportingText?: string;
}

const ToggleComponent: FC<ToggleProps> = ({
  size = 'md',
  disabled = false,
  onChange,
  className = '',
  style,
  text,
  supportingText,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  const toggleClass = classNames(styles.toggleWrapper, styles[size], className);

  const textWrapperClass = classNames(styles.textWrapper, {
    [styles.noTextNoSupportingText]: !text && !supportingText,
    [styles.onlyText]: text && !supportingText,
    [styles.bothTextAndSupportingText]: text && supportingText,
  });

  console.log(textWrapperClass);
  console.log(toggleClass);

  return (
    <div className={toggleClass}>
      <div className={styles.switch}>
        <Switch
          className={className}
          size={size === 'sm' ? 'small' : 'default'}
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
          style={{ backgroundColor: checked ? '#102F82' : '#F2F4F7', ...style }}
        />
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

export default ToggleComponent;
