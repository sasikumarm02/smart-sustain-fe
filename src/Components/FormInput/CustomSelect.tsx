import React from 'react';
import { Form, message, Select, Typography } from 'antd';
import Styles from './FromItems.module.scss';
import { DownOutlined } from '@ant-design/icons';

const CustomSelect = (props: any) => {
  const {
    name,
    label,
    labelColor,
    options,
    multiple,
    size,
    placeholder,
    style,
    value,
    errors,
    touched,
    secondChange,
    blur,
    status,
    hook,
    defaultValue,
    protectedItems,
  } = props;

  const handleChange = (selectedValue: any) => {
    secondChange(name, selectedValue);
  };
  return (
    <Form.Item
      name={name}
      label={
        label ? (
          <label className={Styles.formLabel} style={{ color: labelColor }}>
            {label}
          </label>
        ) : null
      }
      validateStatus={errors && touched ? 'error' : ''}
      help={
        errors &&
        touched && <Typography.Text type="danger">{errors}</Typography.Text>
      }
    >
      <Select
        suffixIcon={
          <DownOutlined
            style={{ color: props.selectColor, fontWeight: 'bold' }}
          />
        }
        className={Styles.selectDropDown}
        defaultValue={value.framework}
        mode={multiple ? 'multiple' : props.mode}
        size={size}
        placeholder={placeholder}
        style={style}
        value={value}
        onChange={handleChange}
        onBlur={blur}
        getPopupContainer={(trigger) => trigger.parentNode}
        status={status}
      >
        {options.map((data: any, index: any) => (
          <Select.Option
            key={index}
            value={data.value}
            disabled={data.isDisabled || protectedItems?.includes(data.value)}
          >
            {data.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default CustomSelect;
