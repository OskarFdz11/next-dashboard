"use client";

import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import ConfirmLogoutButton from "../confirm-logout-button";

export default function SideNav() {
  const [open, setOpen] = useState(false);

  // Server Action para logout (usado por ConfirmLogoutButton)
  const signOutHandler = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <>
      {/* Topbar móvil con logo y botón de menú */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between px-3 py-3">
          <Link href="/" className="flex items-center">
            <div className="w-32 text-blue-600">
              <AcmeLogo />
            </div>
          </Link>
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      <div
        className={clsx(
          "md:hidden fixed inset-0 z-50 transition",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-black/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform will-change-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Sidebar"
        >
          {/* Encabezado del drawer */}
          <div className="relative flex h-20 items-end justify-start bg-blue-600 p-4">
            <div className="w-32 text-white">
              <AcmeLogo />
            </div>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 inline-flex items-center rounded-full p-2 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Contenido del drawer */}
          <div className="h-[calc(100%-5rem)] overflow-y-auto px-3 py-4 space-y-2">
            <NavLinks showTextOnAllSizes onNavigate={() => setOpen(false)} />
            <div className="h-px bg-gray-200 my-2" />
            <ConfirmLogoutButton
              closeSession={signOutHandler}
              iconOnly={false}
            />
          </div>
        </aside>
      </div>

      {/* Sidebar fijo de escritorio */}
      <aside className="hidden md:flex h-full flex-col px-3 py-4 md:px-2">
        <Link
          className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
          href="/"
        >
          <div className="w-32 text-white md:w-40">
            <AcmeLogo />
          </div>
        </Link>

        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks showTextOnAllSizes />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
          <ConfirmLogoutButton closeSession={signOutHandler} iconOnly={false} />
        </div>
      </aside>
    </>
  );
}
