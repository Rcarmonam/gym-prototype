import React from "react";
import "./navigateButton.css";
import { Button } from "@fluentui/react-components";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigateButtonProps {
  text: string;
  navigationLink: string;
}

const NavigateButton: React.FC<NavigateButtonProps> = ({
  text,
  navigationLink,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === navigationLink;

  const handleClick = () => {
    navigate(navigationLink);
  };

  // Use `active` class if the current path matches the navigationLink
  const buttonClassName = `navigateButton ${isActive ? "active" : ""}`;

  return (
    <Button
      className={buttonClassName}
      size="medium"
      appearance="transparent"
      onClick={handleClick}
    >
      <span className="navigateText">{text}</span>
    </Button>
  );
};

export default NavigateButton;
