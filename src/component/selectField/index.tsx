import React from "react";
import { Select } from "antd";
import { Controller, type RegisterOptions } from "react-hook-form";
import styles from "./index.module.scss";

const { Option } = Select;

interface OptionType {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  options: OptionType[];
  rules?: RegisterOptions
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  control,
  label,
  placeholder,
  options,
  rules,
}) => {
  return (
    <div className={styles.fieldWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {rules?.required && <span className={styles.required}>*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <div className={styles.inputWrapper}>
            <Select
              {...field}
              placeholder={placeholder}
              className={styles.select}
              onChange={(value) => field.onChange(value)}
              value={field.value}
            >
              {options.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            {fieldState.error && (
              <p className={styles.error}>{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default SelectField;
