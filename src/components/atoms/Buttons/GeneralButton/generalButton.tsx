import React from 'react';
import './generalButton.css';
import { Button } from '@fluentui/react-components';
import { useNavigate, useLocation } from 'react-router-dom';

interface generalButtonProps {
  text: any;
  navigationLink?: string;
  styleType: 'style1' | 'style2' | 'style3';
  buttonSize: 'small' | 'medium' | 'large';
  width?: string;
  onClick?: any;
  textColor?: string;
  backgroundColor?: string;
  icon?: React.ReactNode;
}

const GeneralButton: React.FC<generalButtonProps> = ({
  text,
  navigationLink,
  styleType,
  buttonSize,
  width,
  onClick,
  textColor,
  backgroundColor,
  icon
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Adjusted handleClick to support both custom onClick and navigationLink
  const handleClick = (event: any) => {
    // Prevent default if it's a submit action, otherwise navigate
    if (onClick) {
      event.preventDefault();
      onClick(event);
    } else if (navigationLink) {
      navigate(navigationLink);
    }
  };

  const buttonClassName = `login-button ${styleType} ${
    location.pathname === navigationLink ? 'active' : ''
  }`;
  const buttonAppearance =
    styleType === 'style1'
      ? 'transparent'
      : styleType === 'style2'
      ? 'primary'
      : 'outline';

  return (
    <Button
      className={buttonClassName}
      size={buttonSize}
      appearance={buttonAppearance}
      onClick={handleClick}
      style={{
        width,
        color: textColor,
        backgroundColor,
      }}
    >
      <span
        className="login-text"
        style={{
          color: textColor,
          fontSize: buttonSize === 'small' ? '1rem' : buttonSize === 'medium' ? '1.2rem' : '1.5rem',
        }}
      >
        {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
        {text}
      </span>
    </Button>
  );
};

export default GeneralButton;
