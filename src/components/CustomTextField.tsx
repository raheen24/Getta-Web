
// src/components/CustomTextField.tsx

import React from "react";

interface CustomTextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: JSX.Element;
  placeholder?: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  type,
  value,
  onChange,
  icon,
  placeholder,
}) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-white text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg p-2">
        {icon && <span className="mr-2">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 bg-transparent text-white border-none outline-none"
        />
      </div>
    </div>
  );
};

export default CustomTextField;
