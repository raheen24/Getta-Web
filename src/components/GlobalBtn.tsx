import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  width?: string | number;
  height?: string | number;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  navigateTo?: string; 
  state?: Record<string, any>; 
}

const GlobalBtn: React.FC<ButtonProps> = ({
  text = 'Button',
  onClick,
  width = 'auto',
  height = 'auto',
  type = 'button',
  disabled = false,
  className = '',
  style = {},
  color = 'primary',
  icon,
  iconPosition = 'left',
  navigateTo,
  state,
  ...rest
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const colorClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  };

  const handleClick = () => {
    if (disabled) return;
  
    onClick?.();
  
    if (navigateTo) {
      navigate(navigateTo, { state });
    }
  };
  

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-4 py-2 bg-linear full-width
        rounded 
        transition-colors 
        duration-200 
        focus:outline-none 
        focus:ring-2 
        focus:ring-opacity-50
        "cta"
        ${colorClasses[color] || colorClasses.primary}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...rest}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && icon}
        {text}
        {icon && iconPosition === 'right' && icon}
      </div>
    </button>
  );
};

export default GlobalBtn;