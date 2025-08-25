import React from "react";
import { Button } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import styles from "./index.module.scss";

type AppButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
  color?: "primary" | "danger";
  onClick?: () => void;
  disabled?: boolean;
};

const ButtonCommon: React.FC<AppButtonProps> = ({
  children,
  icon,
  size = "medium",
  color = "primary",
  onClick,
  disabled = false,
}) => {
  const mapSize: Record<string, SizeType> = {
    small: "small",
    medium: "middle",
    large: "large",
  };

  return (
    <Button
      icon={icon}
      size={mapSize[size]}
      className={`${styles.appButton} ${styles[color]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default ButtonCommon;
