// app/ui/quotations/quotation-actions.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  deleteQuotation,
  duplicateQuotation,
} from "@/app/lib/quotations-actions/quotations-actions";
import { useRouter } from "next/navigation";

interface QuotationActionsProps {
  quotationId: number;
  customerName: string;
}

export default function QuotationActions({
  quotationId,
  customerName,
}: QuotationActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    router.push(`/dashboard/quotations/${quotationId}/edit`);
    setIsOpen(false);
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const newQuotationId = await duplicateQuotation(quotationId);
      router.refresh();
      alert(
        `Cotización duplicada exitosamente. Nueva cotización: #${newQuotationId}`
      );
    } catch (error) {
      console.error("Error duplicating quotation:", error);
      alert("Error al duplicar la cotización");
    } finally {
      setIsDuplicating(false);
      setIsOpen(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar la cotización #${quotationId}?`
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteQuotation(quotationId);
        router.refresh();
      } catch (error) {
        console.error("Error deleting quotation:", error);
        alert("Error al eliminar la cotización");
      } finally {
        setIsDeleting(false);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md border p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-500"
        title="Más acciones"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <button
            onClick={handleEdit}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <PencilIcon className="w-4 h-4 mr-3" />
            Editar
          </button>

          <button
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {isDuplicating ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 mr-3"
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
                Duplicando...
              </>
            ) : (
              <>
                <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                Duplicar
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 mr-3"
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
                Eliminando...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-3" />
                Eliminar
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
