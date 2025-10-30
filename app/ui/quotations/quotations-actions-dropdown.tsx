"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateSuccessModal, setShowDuplicateSuccessModal] =
    useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [newQuotationId, setNewQuotationId] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Posición del menú (en viewport coords)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cerrar al hacer clic fuera (por si no se usa el overlay)
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isOpen) return;
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return; // clic en el botón
      if (menuRef.current?.contains(target)) return; // clic dentro del menú
      setIsOpen(false);
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("click", handleDocumentClick); // click, no mousedown
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  // Calcular posición al abrir
  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const gap = 8; // espacio entre botón y menú
      const menuWidth = 192; // w-48 = 12rem = 192px
      let left = rect.right - menuWidth + window.scrollX; // alineado a la derecha
      if (left < 8) left = 8; // evitar salir de la pantalla izquierda
      // siempre ABAJO del botón
      const top = rect.bottom + gap + window.scrollY;
      setMenuPos({ top, left });
    }
    setIsOpen((v) => !v);
  };

  const handleEdit = () => {
    setIsOpen(false);
    router.push(`/dashboard/quotations/${quotationId}/edit`);
  };

  const handleDuplicate = async () => {
    setIsOpen(false);
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
    } catch {
      alert("Error al eliminar la cotización");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative" ref={wrapperRef}>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="rounded-md border p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-500"
          title="Más acciones"
        >
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Menú en PORTAL, fixed y por encima de la tabla */}
      {mounted &&
        isOpen &&
        createPortal(
          <>
            {/* Overlay para cerrar al hacer clic fuera (no bloquea el botón ya que se abre después del click) */}
            <div
              ref={menuRef}
              className="fixed inset-0 z-[60]"
              onClick={() => setIsOpen(false)}
            />
            <div
              className="fixed z-[61] w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/10"
              style={{ top: menuPos.top, left: menuPos.left }}
              onMouseDown={(e) => e.stopPropagation()}
            >
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
                <TrashIcon className="w-4 h-4 mr-3" />
                Eliminar
              </button>
            </div>
          </>,
          document.body
        )}

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
