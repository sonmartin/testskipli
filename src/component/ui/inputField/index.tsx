import React from "react";
import { Input } from "antd";
import styles from "./index.module.scss";
import clsx from "clsx";
import { Controller, type Control } from "react-hook-form";

interface InputFieldProps {
  className?: string;
  label: string;
  placeholder?: string;
  type?: string;
  name: string; 
  control: Control<any>; 
  rules?: object; 
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  className,
  name,
  control,
  rules,
}) => {
  return (
    <div className={styles.inputField}>
      <label className={styles.label}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Input
              {...field}
              className={clsx("input", className, {
                [styles.inputError]: fieldState.error,
              })}
              type={type}
              placeholder={placeholder}
            />
            {fieldState.error && (
              <p className={styles.errorText}>{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default InputField;
