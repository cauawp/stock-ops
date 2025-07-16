import Link from "next/link";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="container">
      <h1 className="title1 text-center">Bem vindo de volta</h1>
      <div className="flex justify-center">
        <LoginForm />
      </div>
      <p className="text-center text-[#9CABBA]">
        Não possúi uma conta?{" "}
        <Link className="underline" href="/signup">
          Crie aqui
        </Link>
      </p>
    </div>
  );
}
