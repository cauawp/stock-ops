"use client";

import React, { useState, useRef } from "react";

const ProductForm = () => {
  const [barcode, setBarcode] = useState("");
  const [supplier, setSupplier] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleBarcodeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Código escaneado:", barcode);
    }
  };

  const handleImageUpload = (file: File) => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ barcode, supplier, minQuantity, image });
    // Enviar para backend...
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-5xl mx-auto p-4"
    >
      <h2 className="text-xl font-bold text-white">Register Product</h2>

      <input
        type="text"
        placeholder="Scan or enter barcode"
        value={barcode}
        onChange={handleBarcodeChange}
        onKeyDown={handleBarcodeEnter}
        className="bg-gray-800 text-white p-2 rounded"
      />

      <select
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded"
      >
        <option value="">Select supplier</option>
        <option value="Supplier A">Supplier A</option>
        <option value="Supplier B">Supplier B</option>
      </select>

      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer text-white relative"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto max-h-48 object-contain"
          />
        ) : (
          <>
            <p className="font-semibold">Upload Product Image</p>
            <p className="text-sm">Drag and drop or click to upload</p>
            <div className="mt-2 inline-block bg-gray-700 px-3 py-1 rounded">
              Upload Image
            </div>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="button"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
      </label>

      <input
        type="number"
        placeholder="Enter minimum quantity"
        value={minQuantity}
        onChange={(e) => setMinQuantity(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Register Product
      </button>
    </form>
  );
};

export default ProductForm;
