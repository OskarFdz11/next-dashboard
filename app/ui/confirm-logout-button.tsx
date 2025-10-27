// app/ui/confirm-logout-button.tsx
"use client";

import { useState, useTransition } from "react";
import { PowerIcon } from "@heroicons/react/24/outline";
import ConfirmLogoutModal from "./confirm-logout-modal";

interface ConfirmLogoutButtonProps {
  closeSession: () => Promise<void>;
  iconOnly?: boolean;
  buttonClassName?: string;
}

export default function ConfirmLogoutButton({
  closeSession,
  iconOnly = false,
  buttonClassName = "flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
}: ConfirmLogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        setIsConfirmOpen(false); // Cerrar modal primero
        // Pequeño delay para que el usuario vea que se cerró el modal
        await new Promise((resolve) => setTimeout(resolve, 100));
        await closeSession();
      } catch (error) {
        console.error("Error closing session:", error);
        alert("Ocurrió un error al cerrar la sesión.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isPending}
        className={buttonClassName}
        title="Cerrar sesión"
      >
        {isPending ? (
          <>
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            {!iconOnly && <div className="hidden md:block">Cerrando...</div>}
          </>
        ) : (
          <>
            <PowerIcon className="w-6" />
            {!iconOnly && <div className="hidden md:block">Sign Out</div>}
          </>
        )}
      </button>

      <ConfirmLogoutModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </>
  );
}
