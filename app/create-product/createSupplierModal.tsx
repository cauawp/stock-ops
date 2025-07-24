"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (newSupplier: { id: string; label: string }) => void;
};

export default function CreateSupplierModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("O nome do fornecedor é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}supplier`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          cnpj: cnpj || null,
          address: address || null,
        }),
      });

      console.log("DATA ENVIADO: ", {
                  name,
          cnpj: cnpj || null,
          address: address || null,
      })

      const data = await res.json();

      if (!res.ok) {
        console.log("DATA MSG: ", data.message)
        throw new Error(data.message || "Erro ao criar fornecedor");
      }

      setSuccess("Fornecedor criado com sucesso");
      setName("");
      setCnpj("");
      setAddress("");

      if (onCreated) {
        onCreated({ id: data.id, label: data.name });
      }

      onClose();
    } catch (err: any) {
      console.log("err: ", err)
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setError(null);
    setSuccess(null);
    setName("");
    setCnpj("");
    setAddress("");
    onClose();
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
            <h2 className="text-xl font-semibold mb-4">Criar Fornecedor</h2>

            <InputText
            type="text"
              label="Nome"
              placeholder="Nome do fornecedor"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputText
            type="text"
              label="CNPJ"
              placeholder="CNPJ (opcional)"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />

            <InputText
            type="text"
              label="Endereço"
              placeholder="Endereço (opcional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex flex-col gap-2">
              <Button
                label="Criar Fornecedor"
                onClick={handleCreate}
                // disabled={isSubmitting}
              />
              <Button
                label="Cancelar"
                onClick={handleCancel}
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
