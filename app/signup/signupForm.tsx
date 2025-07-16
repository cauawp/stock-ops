"use client";

import React, { useState } from "react";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";
import Cookies from "js-cookie";
import InputSelect from "@/components/form/inputSelect";

const SignupForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar usuário");
      }

      window.location.href = "/login"; // exemplo
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      className="formContainer max-w-[448px] flex-auto space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
    >
      <InputText
        label="Nome"
        placeholder="Insira seu nome"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputText
        label="Email"
        placeholder="Insira seu email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputText
        label="Senha"
        placeholder="Insira sua senha"
        type="password"
        showToggleVisibility={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputSelect
        label="Cargo"
        options={["Opção 1", "Opção 2", "Opção 3"]}
        placeholder="Selecione uma opção"
        onChange={setRole}
        value={role}
      />
      <Button label="Criar" onClick={handleSignup} />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default SignupForm;
