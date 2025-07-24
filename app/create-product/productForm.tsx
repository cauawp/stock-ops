"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import InputText from "@/components/form/inputText";
import InputSelect from "@/components/form/inputSelect";
import InputSelectAndSearch from "@/components/form/inputSelectAndSearch";
import CreateSupplierModal from "./createSupplierModal";

type SupplierOption = {
  value: string;
  label: string;
};


const ProductForm = () => {
  const [barcode, setBarcode] = useState("");
const [suppliersToSelect, setSuppliersToSelect] = useState<SupplierOption[]>([]);
const [supplier, setSupplier] = useState<SupplierOption>({ value: "", label: "" });
  const [minQuantity, setMinQuantity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(null);
  const [hasMatch, setHasMatch] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scannerRef = useRef<HTMLDivElement | null>(null);

  const beepSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Só roda no client
    if (typeof window !== "undefined") {
      beepSoundRef.current = new Audio("/success-beep.mp3");
    }
  }, []);

  const playBeep = () => {
    if (beepSoundRef.current) {
      beepSoundRef.current.play().catch((err) => {
        console.warn("Erro ao tocar som:", err);
      });
    }
  };

  const fetchProductInfo = async (barcode: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();

      if (data.status === 1) {
        const product = data.product;
        console.log("Product: ", product);
        setSupplier(product.brands || "");
      } else {
        console.warn("Produto não encontrado");
      }
    } catch (err) {
      console.error("Erro ao buscar produto", err);
    } finally {
      setIsLoading(false);
    }
  };

  const startScanner = () => {
    if (!scannerRef.current) return;

    const html5QrCode = new Html5Qrcode("qr-reader", {
      verbose: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.CODABAR,
      ],
    });

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;

        html5QrCode
          .start(
            cameraId,
            { fps: 30, qrbox: 300 },
            async (decodedText) => {
              if (!decodedText) return;

              setHasMatch(true);
              playBeep();
              setBarcode(decodedText);
              await fetchProductInfo(decodedText);

              setTimeout(() => {
                setHasMatch(false);
              }, 1000);

              await html5QrCode.stop();
              setScannerInstance(null);
              setIsCameraOpen(false);
            },
            () => {}
          )
          .then(() => setScannerInstance(html5QrCode))
          .catch((err) => console.error("Erro ao iniciar câmera", err));
      }
    });
  };

  const stopScanner = () => {
    if (scannerInstance) {
      scannerInstance.stop().then(() => {
        setScannerInstance(null);
        setIsCameraOpen(false);
      });
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
    setTimeout(startScanner, 300); // Delay para esperar o DOM montar o container
  };

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  };

  const handleBarcodeEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await fetchProductInfo(barcode);
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
  };

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (isCameraOpen) {
        root.style.setProperty("--background", "#ffffff");
        root.style.setProperty("--foreground", "#121417");
    } else {
      if (prefersDark) {
        root.style.setProperty("--background", "#121417");
        root.style.setProperty("--foreground", "#ffffff");
      } else {
        root.style.setProperty("--background", "#ffffff");
        root.style.setProperty("--foreground", "#121417");
      }
    }
  }, [isCameraOpen]);
  
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}supplier`)
        const data = await res.json();

        console.log("DATA: ", data)
        const formatted = data.map((supplier: any) => ({
          value: supplier.id,
          label: supplier.name,
        }));
        console.log("FORMATED: ", formatted)
        
        setSuppliersToSelect(formatted);
      } catch (err) {
        console.error("Erro ao buscar fornecedores:", err);
      }
    };

    fetchSuppliers();
  }, []);

  console.log("SUPPLIER SELECIONADO: ", supplier)

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="text-white mb-4">
        <div className="mt-2 flex gap-2 relative z-[11]">
          {!isCameraOpen ? (
            <button
              type="button"
              onClick={openCamera}
              className="bg-gray-700 text-white py-1 px-3 rounded cursor-pointer"
            >
              Ativar câmera
            </button>
          ) : (
            <button
              type="button"
              onClick={stopScanner}
              className="bg-red-600 text-white py-1 px-3 rounded cursor-pointer"
            >
              Cancelar câmera
            </button>
          )}
        </div>

        <p className="mb-1 font-semibold">Escaneie o código de barras do produto utilizando a câmera</p>

        <AnimatePresence>
          {isCameraOpen && (
            <motion.div 
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              transition={{
                duration: 0.3
              }}
              className="fixed bg-white inset-0 w-full h-screen  z-[10]">

              
            </motion.div>
          )}
          {isCameraOpen && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-64 mt-4 px-36 z-[11]"
              ref={scannerRef}
            >
              {/* Flash lateral */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 z-30 bg-white pointer-events-none"
              />

              {/* Área de leitura */}

              <div id="qr-reader" className="absolute inset-0 z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <InputText
        type="text"
        placeholder="Scan or enter barcode"
        value={barcode}
        onChange={handleBarcodeChange}
        onKeyDown={handleBarcodeEnter}
        // className="bg-gray-800 text-white p-2 rounded"
      />

      {isLoading && (
        <div className="text-sm text-yellow-400 animate-pulse">
          Carregando informações do produto...
        </div>
      )}

      <InputSelectAndSearch 
        label="Fornecedor"
        placeholder="Selecione o fornecedor"
        value={supplier.value}
        valueLabel={supplier.label}
        onChange={setSupplier}
        options={suppliersToSelect}
        createBtn
        onCreate={() => setIsSupplierModalOpen(true)} // abre modal ao clicar em "Criar"
      />

      <CreateSupplierModal 
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onCreated={(newSupplier) => {
          const formatted = { value: newSupplier.id, label: newSupplier.label };
          setSuppliersToSelect(prev => [...prev, formatted]); // ✅ tipo correto agora
          setSupplier(formatted); // ✅ também tipado corretamente
        }}
      />

      {/* <select
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        className="bg-gray-800 text-white p-2 rounded"
      >
        <option value="">Select supplier</option>
        <option value="Supplier A">Supplier A</option>
        <option value="Supplier B">Supplier B</option>
      </select> */}

      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-500 p-6 text-center rounded cursor-pointer text-white relative z-[1]"
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
          ref={fileInputRef}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <InputText 
        type="number"
        placeholder="Insira a quantidade inicial em estoque"
        label="Quantidade"
        value={minQuantity}
        onChange={(e) => setMinQuantity(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Criar Produto
      </button>
    </form>
  );
};

export default ProductForm;
