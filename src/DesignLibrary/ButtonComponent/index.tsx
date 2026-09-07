import React, { FC } from "react";
import styles from "./button.module.scss";
import { Button } from "antd";

interface ButtonProps {
  hierarchy?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "secondary-gray"
    | "tertiary-gray"
    | "link-gray"
    | "link"
    | "transparent";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "leading" | "trailing";
  destructive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  htmlType?: "submit" | "reset" | "button";
}

const ButtonComponent: FC<ButtonProps> = ({
  hierarchy = "primary",
  size = "xl",
  icon = null, // Update this line
  iconPosition = "leading", // Add this line
  disabled = false,
  loading = false,
  destructive = false,
  onClick,
  className = "",
  style,
  children = "",
  htmlType = "button",
}) => {
  const buttonClass = [
    styles[hierarchy],
    styles[size],
    destructive && styles[`destructive`],
    className,
  ].join(" ");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      className={buttonClass}
      loading={loading}
      onClick={handleClick}
      disabled={disabled}
      htmlType={htmlType}
      style={style}
    >
      {icon && iconPosition === "leading" && (
        <span className={styles.icon}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "trailing" && (
        <span className={styles.icon}>{icon}</span>
      )}
    </Button>
  );
};

export default ButtonComponent;
