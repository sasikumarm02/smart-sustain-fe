import React, { useState } from 'react';
import { Select, ConfigProvider } from 'antd';
import styles from './select.module.scss';
import SelectDropdownIcon from '../../assets/Svg/DesignLibrary/SelectDropdownIcon';
import SelectDropdownUpIcon from '../../assets/Svg/DesignLibrary/SelectDropdownUpIcon';
import SelectSearchLensIcon from '../../assets/Svg/DesignLibrary/SelectSearchLensIcon';

interface Option {
  label: string;
  value: string;
  icon?: any;
}

interface Props {
  options: Option[];
  defaultValue?: any;
  onChange?: any;
  showSearch?: boolean;
  placeHolder?: string;
  mode?: 'multiple' | 'tags' | undefined;
  value?: any;
  children?: React.ReactNode;
  status?: any;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

const { Option } = Select;

const SelectComponent: React.FC<Props> = ({
  options,
  defaultValue,
  value,
  onChange,
  showSearch,
  placeHolder,
  mode,
  status,
  ...rest
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownVisibleChange = (visible: boolean) => {
    setDropdownVisible(visible);
  };
  return (
    <div>
      <ConfigProvider theme={{ hashed: false }}>
        <Select
          className={`${styles.select} ${mode && styles.selectMultiple} ${status === 'error' && styles?.selectErr}`}
          mode={mode}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeHolder}
          bordered={false}
          value={value}
          status={status}
          showSearch={showSearch}
          suffixIcon={
            dropdownVisible ? (
              showSearch ? (
                <SelectSearchLensIcon />
              ) : (
                <SelectDropdownUpIcon />
              )
            ) : (
              <SelectDropdownIcon />
            )
          }
          dropdownStyle={{ padding: '0px', color: '#fff', borderRadius: '0px' }}
          onDropdownVisibleChange={handleDropdownVisibleChange}
          {...rest}
        >
          {options.map((option) => (
            <Select.Option
              key={option.value}
              value={option.value}
              className={styles.optionStyle}
            >
              <span style={{ fontWeight: 500, fontSize: '16px' }}>
                {option?.icon}
                {option.label}
              </span>
            </Select.Option>
          ))}
        </Select>
      </ConfigProvider>
    </div>
  );
};

export default SelectComponent;
