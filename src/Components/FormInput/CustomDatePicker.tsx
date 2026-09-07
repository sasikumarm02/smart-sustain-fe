import React from 'react';
import { Form, DatePicker, Typography, Modal } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import dayjs from 'dayjs';
import Styles from './FromItems.module.scss';
import { CalendarFilled } from '@ant-design/icons';
const { Text } = Typography;

const dateFormat = 'YYYY-MM-DD';
dayjs.extend(customParseFormat);

const CustomDatePicker = (props: any) => {
  return (
    <>
      <Form.Item
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
        <DatePicker
          suffixIcon={
            <CalendarFilled
              style={{
                color: `${props.calenderColor}`,
              }}
            />
          }
          style={{ borderRadius: '6px', ...props.style, background: '#FAF9FF' }}
          name={props.name}
          size={props.size}
          value={props.value}
          placeholder={props.placeholder}
          disabledDate={props.disabledDate}
          disabled={props.disabled}
          onChange={(e) => {
            props.secondChange(`${props.name}`, e);
          }}
          picker={props.picker}
          onBlur={props.blur}
          format={props.format}
          defaultValue={props.defaultDate}
          className="form-control"
          status={props.status}
          placement={props.placement}
        />
        {props.errors && props.touched && (
          <Text type="danger" style={{ textAlign: 'left' }}>
            {props.errors}
          </Text>
        )}
      </Form.Item>
    </>
  );
};

export default CustomDatePicker;
