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
import SuccessModal from "../success-modal";
import ConfirmDeleteModal from "../confirm-delete-modal";

interface QuotationActionsProps {
  quotationId: number;
  customerName: string;
  customerLastName?: string;
}

export default function QuotationActions({
  quotationId,
  customerName,
  customerLastName,
}: QuotationActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateSuccessModal, setShowDuplicateSuccessModal] =
    useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [newQuotationId, setNewQuotationId] = useState<number | null>(null);
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

  const handleDuplicateClick = () => {
    setIsOpen(false);
    handleDuplicate();
  };

  const handleDuplicate = async () => {
    setIsOpen(false); // Cerrar dropdown
    setIsDuplicating(true);

    try {
      const response = await duplicateQuotation(quotationId);
      console.log("Nueva cotización ID:", response); // Debug

      if (response && response.success && response.quotationId) {
        setNewQuotationId(response.quotationId);
        setShowDuplicateSuccessModal(true);
      } else {
        console.error("Error duplicating quotation:", response?.message);
        alert(response?.message || "Error al duplicar la cotización");
      }
    } catch (error) {
      console.error("Error duplicating quotation:", error);
      alert("Error al duplicar la cotización");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteQuotation(quotationId);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      router.refresh();
    } catch (error) {
      console.error("Error deleting quotation:", error);
      alert("Error al eliminar la cotización"); // Mantener este alert para errores
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateSuccessClose = () => {
    setShowDuplicateSuccessModal(false);
    setNewQuotationId(null);
    router.refresh(); // Refresh para mostrar la nueva cotización
  };

  const handleDeleteSuccessClose = () => {
    setShowDeleteSuccessModal(false);
  };

  return (
    <>
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
              onClick={handleDeleteClick}
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
      {/* Modal de confirmación para eliminar */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar cotización?"
        message={`¿Estás seguro de que quieres eliminar la cotización? Esta acción no se puede deshacer.`}
        itemName={`Cotización #${quotationId} de ${customerName} ${
          customerLastName || ""
        }`}
        isLoading={isDeleting}
      />

      {/* Modal de éxito para duplicación */}
      <SuccessModal
        isOpen={showDuplicateSuccessModal}
        onClose={handleDuplicateSuccessClose}
        title="¡Cotización duplicada exitosamente!"
        message={`Nueva cotización creada: #${newQuotationId}`}
        autoCloseTime={3000}
      />

      {/* Modal de éxito para eliminación */}
      <SuccessModal
        isOpen={showDeleteSuccessModal}
        onClose={handleDeleteSuccessClose}
        title="¡Cotización eliminada exitosamente!"
        message={`La cotización #${quotationId} ha sido eliminada correctamente.`}
        autoCloseTime={2000}
      />
    </>
  );
}
