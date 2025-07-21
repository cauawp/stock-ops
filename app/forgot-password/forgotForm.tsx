"use client";

import React, { useState } from "react";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";

const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleForgot = async () => {
    try {
      setError(null);
      setSuccess(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}email/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erro ao enviar email");
      }

      setSuccess("Email enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      className="formContainer flex-auto max-w-[448px] space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleForgot();
      }}
    >
      <InputText
        label="Email"
        placeholder="Digite seu email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button label="Enviar" onClick={handleForgot} />
      {success && <p className="text-green-500 text-sm">{success}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default ForgotForm;
