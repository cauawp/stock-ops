import Header from "@/components/header";
import React from "react";
import UserForm from "./userForm";

const User = () => {
  return (
    <>
      <Header />
      <div className="px-20 pt-10">
        <UserForm />
      </div>
    </>
  );
};

export default User;
