// CustomCheckboxGroup.jsx
import React from 'react';
import { Form, Checkbox, Typography } from 'antd';
import Styles from '../../Components/FormInput/FromItems.module.scss';
import { CheckSquareFilled, CloseSquareOutlined } from '@ant-design/icons';

const CustomCheckboxGroup = (props: any) => {
  const options = props.options || [];

  return (
    <Form.Item
      label={
        <label className={`${Styles.materialTopicsLabel}`}>{props.label}</label>
      }
    >
      {options.map((option: any) => (
        <>
          <Checkbox
            style={{ marginTop: '15px', marginBottom: '15px' }}
            key={option.value}
            name={props.name}
            checked={props.value.includes(option.value)}
            disabled={option.disabled}
            onChange={(e) => {
              const checkedValues = e.target.checked
                ? [...props.value, option.value]
                : props.value.filter((val: any) => val !== option.value);

              props.secondChange(props.name, checkedValues);
            }}
          >
            <span className={Styles.materialTopicsText}>{option.label}</span>
          </Checkbox>
          <br />
        </>
      ))}
      {props.errors && props.touched && (
        <Typography.Text type="danger" style={{ textAlign: 'left' }}>
          {props.errors}
        </Typography.Text>
      )}
    </Form.Item>
  );
};

export default CustomCheckboxGroup;
