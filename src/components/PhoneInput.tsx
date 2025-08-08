import React from "react";
import { FiPhone } from "react-icons/fi"; 

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = "",
  onChange,
  label = "Phone Number",
  placeholder = "+1 123 456 7890",
}) => {
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    // Format based on length
    if (phoneNumberLength < 4) return `+${phoneNumber}`;
    if (phoneNumberLength < 7) {
      return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1)}`;
    }
    return `+${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    onChange(formattedValue);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400">
          <FiPhone />
        </span>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default PhoneInput;