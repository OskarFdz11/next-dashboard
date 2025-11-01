"use client";

import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
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
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateSuccessModal, setShowDuplicateSuccessModal] =
    useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [newQuotationId, setNewQuotationId] = useState<number | null>(null);

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/quotations/${quotationId}/edit`);
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const response = await duplicateQuotation(quotationId);
      if (response && response.success && response.quotationId) {
        setNewQuotationId(response.quotationId);
        setShowDuplicateSuccessModal(true);
      } else {
        alert(response?.message || "Error al duplicar la cotización");
      }
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteQuotation(quotationId);
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
      router.refresh();
    } catch {
      alert("Error al eliminar la cotización");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block">
        <MenuButton className="rounded-md border p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-500 transition-colors">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          transition
          className="absolute right-0 z-[9999] mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 border border-gray-200 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <MenuItem>
            <button
              onClick={handleEdit}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none transition-colors"
            >
              <PencilIcon className="w-4 h-4 mr-3" />
              Editar
            </button>
          </MenuItem>

          <MenuItem>
            <button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-none disabled:opacity-50 transition-colors"
            >
              {isDuplicating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin w-4 h-4 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Duplicando...
                </span>
              ) : (
                <>
                  <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                  Duplicar
                </>
              )}
            </button>
          </MenuItem>

          <MenuItem>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 data-focus:bg-red-50 data-focus:outline-none disabled:opacity-50 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-3" />
              Eliminar
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      {/* Modales */}
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

      <SuccessModal
        isOpen={showDuplicateSuccessModal}
        onClose={() => {
          setShowDuplicateSuccessModal(false);
          setNewQuotationId(null);
          router.refresh();
        }}
        title="¡Cotización duplicada exitosamente!"
        message={`Nueva cotización creada: #${newQuotationId}`}
        autoCloseTime={3000}
      />

      <SuccessModal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        title="¡Cotización eliminada exitosamente!"
        message={`La cotización #${quotationId} ha sido eliminada correctamente.`}
        autoCloseTime={2000}
      />
    </>
  );
}
