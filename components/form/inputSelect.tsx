"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

export interface Option {
  label: string;
  value: string;
}

interface InputSelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  valueLabel: string;
  onChange: (option: Option) => void;
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scaleY: 0,
    transition: {
      when: "afterChildren",
    },
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05, // tempo entre cada <li>
    },
  },
  exit: {
    opacity: 0,
    scaleY: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

const InputSelect: React.FC<InputSelectProps> = ({
  label,
  placeholder,
  options,
  value,
  valueLabel,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col relative mb-6">
      {label && (
        <label className="mb-2" htmlFor={`${label}_${placeholder}_${value}`}>
          {label}
        </label>
      )}

      <div
        onClick={toggleDropdown}
        className="flex items-center justify-between cursor-pointer rounded-[.5rem] max-h-14 p-4 dark:bg-[#293038] dark:border-gray-600"
      >
        <span>{valueLabel || placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IoIosArrowDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute top-full left-0 right-0 bg-white dark:bg-[#293038] shadow-md rounded-md mt-2 z-10 overflow-hidden"
            variants={dropdownVariants}
            style={{
              transformOrigin: "top",
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {options.map((option) => (
              <motion.li
                key={option.value}
                variants={itemVariants}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3f46] cursor-pointer"
              >
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputSelect;
