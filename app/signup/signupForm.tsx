"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputText from "@/components/form/inputText";
import Button from "@/components/form/button";
import Cookies from "js-cookie";
import InputSelect from "@/components/form/inputSelect";
import { Option } from "@/components/form/inputSelect";

const SignupForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<Option>({ label: "", value: "" });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignup = async () => {
    try {
      setError(null);

      // console.log("Body a ser enviado: ", {
      //   name,
      //   email,
      //   password,
      //   role: role.value,
      // });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: role.value }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar usuário");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formIsNull =
    name === "" || email === "" || password === "" || role.value === "";

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
        placeholder="Selecione seu cargo"
        value={role.value}
        valueLabel={role.label}
        onChange={setRole}
        options={[
          { label: "Administrador", value: "admin" },
          { label: "Operador", value: "operator" },
        ]}
      />
      <Button
        classNameBtn={`${formIsNull && "pointer-events-none"}`}
        label="Criar"
        onClick={handleSignup}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default SignupForm;
