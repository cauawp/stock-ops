import Link from "next/link";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="container py-10">
      <h1 className="title1 text-center mb-8">Bem vindo de volta</h1>
      <div className="flex justify-center">
        <LoginForm />
      </div>
      <p className="text-center text-[#9CABBA] mt-4">
        Não possúi uma conta?{" "}
        <Link className="underline" href="/signup">
          Crie aqui
        </Link>
      </p>
    </div>
  );
}
