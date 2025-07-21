import React from "react";
import ResetForm from "./resetForm";

const ResetPasswordPage = () => {
  return (
    <>
      <div className="container py-10">
        <h1 className="title1 text-center mb-8">Redefinir senha</h1>
        <div className="flex justify-center">
          <ResetForm />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
