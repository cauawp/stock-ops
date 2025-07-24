import Header from "@/components/header";
import React from "react";
import ProductForm from "./productForm";

const CreateProduct = () => {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-10">
        <h1 className="title1 mb-8">Criar produto</h1>
        <ProductForm />
      </div>
    </>
  );
};

export default CreateProduct;
