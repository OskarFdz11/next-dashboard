"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import ConfirmDeleteModal from "./confirm-delete-modal";
import SuccessModal from "./success-modal";

interface ConfirmDeleteButtonProps {
  /** ID del elemento a eliminar */
  itemId: string | number;
  /** Acción del servidor para eliminar */
  deleteAction: (
    id: string | number
  ) => Promise<void | { success: boolean; message: string }>;
  /** Nombre del tipo de elemento (ej: "cotización", "cliente", "producto") */
  entityName: string;
  /** Nombre o descripción específica del elemento (opcional) */
  itemName?: string;
  /** Texto personalizado del botón (opcional) */
  buttonLabel?: string;
  /** Mostrar solo icono o texto también */
  iconOnly?: boolean;
  /** Clase CSS personalizada para el botón */
  buttonClassName?: string;
  /** Título personalizado del modal */
  modalTitle?: string;
  /** Mensaje personalizado del modal */
  modalMessage?: string;
  /** Mensaje de éxito personalizado */
  successMessage?: string;
  /** Callback opcional después de eliminar exitosamente */
  onDeleteSuccess?: () => void;
}

export default function ConfirmDeleteButton({
  itemId,
  deleteAction,
  entityName,
  itemName,
  buttonLabel,
  iconOnly = true,
  buttonClassName = "rounded-md border p-2 hover:bg-gray-100 text-red-600 hover:text-red-500",
  modalTitle,
  modalMessage,
  successMessage,
  onDeleteSuccess,
}: ConfirmDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Textos por defecto basados en entityName
  const defaultTitle = modalTitle || `¿Eliminar ${entityName}?`;
  const defaultMessage = modalMessage || "Esta acción no se puede deshacer.";
  const defaultSuccessMessage =
    successMessage ||
    `¡${
      entityName.charAt(0).toUpperCase() + entityName.slice(1)
    } eliminado exitosamente!`;
  const defaultButtonLabel = buttonLabel || `Eliminar ${entityName}`;

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        const result = await deleteAction(itemId);

        if (result && typeof result === "object" && "success" in result) {
          if (!result.success) {
            alert(
              result.message || `Ocurrió un error al eliminar ${entityName}.`
            );
            setIsConfirmOpen(false);
            return;
          }
        }
        setIsConfirmOpen(false);
        setIsSuccessOpen(true);

        // Ejecutar callback personalizado si existe
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }

        // Refrescar la página para actualizar los datos
        router.refresh();
      } catch (error) {
        console.error(`Error deleting ${entityName}:`, error);
        alert(`Ocurrió un error al eliminar ${entityName}.`);
        setIsConfirmOpen(false);
      }
    });
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isPending}
        className={buttonClassName}
        title={defaultButtonLabel}
      >
        {isPending ? (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
            {!iconOnly && <span className="text-xs">Eliminando...</span>}
          </div>
        ) : (
          <>
            <TrashIcon className="w-5 h-5" />
            {!iconOnly && <span className="ml-1">{defaultButtonLabel}</span>}
          </>
        )}
      </button>

      {/* Modal de confirmación */}
      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={defaultTitle}
        message={defaultMessage}
        itemName={itemName}
      />

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={handleSuccessClose}
        title={defaultSuccessMessage}
        message="La operación se completó correctamente."
        autoCloseTime={2000}
      />
    </>
  );
}
