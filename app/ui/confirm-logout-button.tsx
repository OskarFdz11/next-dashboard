// app/ui/confirm-logout-button.tsx
"use client";

import { useState, useTransition } from "react";
import { PowerIcon } from "@heroicons/react/24/outline";
import ConfirmLogoutModal from "./confirm-logout-modal";
import { logout } from "@/app/lib/auth-actions/auth-actions";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logout();
      if (res?.ok) {
        router.replace(res.redirectTo);
        router.refresh();
      } else {
        console.error(res?.error || "Logout failed");
      }
      setShowModal(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        disabled={isPending}
      >
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>

      <ConfirmLogoutModal
        isOpen={showModal}
        onClose={() => !isPending && setShowModal(false)}
        onConfirm={handleLogout}
        isPending={isPending}
      />
    </>
  );
}
