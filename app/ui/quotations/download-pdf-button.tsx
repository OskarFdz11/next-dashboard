// app/ui/quotations/download-pdf-button.tsx
"use client";

import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface DownloadPDFButtonProps {
  quotationId: number;
  customerName: string;
  hideText?: boolean;
}

export default function DownloadPDFButton({
  quotationId,
  customerName,
  hideText = false,
}: DownloadPDFButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(`/api/quotations/${quotationId}/pdf`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("La respuesta no es un PDF válido");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotizacion-${quotationId}-${customerName
        .replace(/\s+/g, "-")
        .toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error al descargar el PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title={isDownloading ? "Generando PDF..." : "Descargar PDF"}
    >
      {isDownloading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Generando...
        </>
      ) : (
        <>
          <DocumentArrowDownIcon
            className={`h-4 w-4 ${isDownloading ? "animate-spin" : ""}`}
          />
          {!hideText && !isDownloading && (
            <span className="hidden sm:block">Descargar</span>
          )}
          {!hideText && isDownloading && (
            <span className="hidden sm:block">Descargando...</span>
          )}
        </>
      )}
    </button>
  );
}
