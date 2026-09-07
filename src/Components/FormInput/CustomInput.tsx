import React from 'react';
import { Form, Input, Typography } from 'antd';
import { Icon } from '@iconify/react';
import Styles from './FromItems.module.scss';
const CustomInput = (props: any) => {
  return (
    <Form.Item
      className="formItem"
      label={
        props.label ? (
          <label
            className={Styles.formLabel}
            style={{ color: props.labelColor }}
          >
            {props.label}
          </label>
        ) : (
          ''
        )
      }
    >
      <Input
        onKeyDown={
          props.showKeyDown
            ? (e) => {
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }
            : undefined
        }
        className={`${props.className} custom-input ${Styles.customInput}`}
        disabled={props.disabled ? true : false}
        placeholder={props.placeholder}
        name={props.name}
        type={props.type}
        value={props.disabled ? props.newValue : props.value}
        onBlur={props.blur}
        size={props.size}
        onChange={(e) => {
          props.hook(e);
        }}
        prefix={
          <Icon
            icon={props.prefix}
            inline
            fontSize={16}
            style={{ marginRight: '5px' }}
          />
        }
        suffix={props.suffix}
        status={props.status}
      />
      {props.errors && props.touched && (
        <Typography.Text type="danger" style={{ textAlign: 'left' }}>
          {props.errors}
        </Typography.Text>
      )}
    </Form.Item>
  );
};

export default CustomInput;
