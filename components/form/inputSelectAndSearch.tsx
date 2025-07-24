"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

export interface Option {
  label: string;
  value: string;
}

interface InputSelectPropsAndSearch {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  valueLabel: string;
  onChange: (option: Option) => void;
  createBtn?: boolean;
  createBtnLabel?: string;
  onCreate?: () => void;
}

const dropdownVariants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: { opacity: 1, scaleY: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, scaleY: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

const InputSelectAndSearch: React.FC<InputSelectPropsAndSearch> = ({
  label,
  placeholder,
  options,
  value,
  valueLabel,
  onChange,
  createBtn = false,
  createBtnLabel = "Criar novo",
  onCreate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

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
          <motion.div
            className="absolute top-full left-0 right-0 bg-white dark:bg-[#293038] shadow-md rounded-md mt-2 z-10 overflow-hidden"
            variants={dropdownVariants}
            style={{ transformOrigin: "top" }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 text-black dark:text-white dark:bg-[#1f1f1f]"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {createBtn && (
                <button
                  onClick={() => {
                    onCreate?.();
                    setIsOpen(false);
                  }}
                  className="w-full mb-2 px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  {createBtnLabel}
                </button>
              )}
            </div>

            <ul className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <motion.li
                    key={option.value}
                    variants={itemVariants}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3f46] cursor-pointer"
                  >
                    {option.label}
                  </motion.li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                  Nenhuma opção encontrada
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputSelectAndSearch;
