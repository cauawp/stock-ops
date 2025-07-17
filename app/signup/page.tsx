import Link from "next/link";
import SignupForm from "./signupForm";

export default function SignupPage() {
  return (
    <div className="container py-10">
      <h1 className="title1 text-center mb-8">Bem vindo</h1>
      <div className="flex justify-center">
        <SignupForm />
      </div>
      <p className="text-center text-[#9CABBA] mt-4">
        Já possúi uma conta?{" "}
        <Link className="underline" href="/login">
          Faça Login
        </Link>
      </p>
    </div>
  );
}
