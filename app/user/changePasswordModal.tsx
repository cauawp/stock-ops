"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
};

export default function ChangePasswordModal({
  isOpen,
  onClose,
  userId,
}: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}email/reset-password`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, userId, isLogged: true }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || "Erro ao alterar senha");
      }

      setSuccess("Senha alterada com sucesso");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-[#1F2937] p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>

            <InputText
              label="Nova senha"
              placeholder="Digite a nova senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showToggleVisibility
            />

            <div className="flex flex-col gap-2">
              <Button label="Confirmar" onClick={handleChangePassword} />
              <Button
                label="Cancelar"
                onClick={async () => {
                  setPassword("");
                  setError(null);
                  onClose();
                }}
                classNameBtn="bg-gray-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
