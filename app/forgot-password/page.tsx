import Link from "next/link";
import ForgotForm from "./forgotForm";

export default function ForgotPasswordPage() {
  return (
    <div className="container py-10">
      <h1 className="title1 text-center mb-8">Esqueci minha senha</h1>
      <div className="flex justify-center">
        <ForgotForm />
      </div>
    </div>
  );
}
