import React from 'react';
import type { DatePickerProps } from 'antd';
import { DatePicker, Flex } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

export default function DatePickerCustom() {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div>
      <DatePicker onChange={onChange} />
    </div>
  );
}
