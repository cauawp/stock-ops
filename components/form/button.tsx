"use client";

import React, { FC, useState } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  label: string;
  onClick?: () => Promise<void>;
  classNameBtn?: string;
  disabeld?: boolean;
}

const Button: FC<ButtonProps> = ({ label, onClick, classNameBtn, disabeld }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      try {
        setIsLoading(true);
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={isLoading || disabeld}
      type="button"
      className={`bg-[#0D80F2] text-white w-full py-2.5 rounded-[.5rem] cursor-pointer flex justify-center items-center ${
        isLoading ? "opacity-80 cursor-not-allowed" : ""
      } ${classNameBtn}`}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      ) : (
        label
      )}
    </motion.button>
  );
};

export default Button;
