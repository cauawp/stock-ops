"use client";

import React, { FC, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface InputTextProps {
  label?: string;
  placeholder?: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showToggleVisibility?: boolean;
  disabled?: boolean;
}

const InputText: FC<InputTextProps> = ({
  label,
  placeholder,
  type,
  value,
  onChange,
  showToggleVisibility = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col relative mb-6">
      {label && (
        <label
          className="mb-2"
          htmlFor={`${label}_${placeholder?.trim()}_${type}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={`${label ? `${label}_` : ""}${placeholder?.trim()}_${type}`}
          className="outline-0 rounded-[.5rem] max-h-14 p-4 w-full dark:bg-[#293038]"
          placeholder={placeholder}
          disabled={disabled}
          type={inputType}
          value={value}
          onChange={onChange}
        />

        {isPasswordField && showToggleVisibility && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute cursor-pointer top-1/2 right-4 -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputText;
