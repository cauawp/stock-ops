"use client";

import React, { useState } from "react";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      Cookies.set("accessToken", data.access_token, { expires: 7 }); // Salva token por 7 dias

      // Redireciona ou faz algo após o login
      window.location.href = "/dashboard"; // exemplo
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      className="formContainer max-w-[448px] flex-auto space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button label="Login" onClick={handleLogin} />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default LoginForm;
