"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";

export default function ProductsFlash() {
  const sp = useSearchParams();
  const router = useRouter();
  const { notification, showSuccess, hideNotification } = useNotification();

  useEffect(() => {
    const created = sp.get("created");
    if (created) {
      showSuccess(
        "Producto creado",
        `El producto "${created}" ha sido creado correctamente.`
      );
      router.replace("/dashboard/products");
    }
  }, [sp, router, showSuccess]);

  return (
    <NotificationModal
      isOpen={notification.isOpen}
      onClose={hideNotification}
      type={notification.type}
      title={notification.title}
      message={notification.message}
    />
  );
}
