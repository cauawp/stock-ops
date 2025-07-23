"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";

const ResetForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleReset = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (password !== confirm) {
        throw new Error("As senhas não coincidem.");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}email/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.message || data.error || "Erro ao redefinir senha"
        );
      }

      setSuccess("Senha redefinida com sucesso!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      className="formContainer flex-auto max-w-[448px] space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleReset();
      }}
    >
      <InputText
        label="Nova senha"
        type="password"
        showToggleVisibility={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputText
        label="Confirme a senha"
        type="password"
        showToggleVisibility={true}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Button label="Redefinir senha" onClick={handleReset} />
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default ResetForm;
