"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/app/hooks/useNotifications";
import NotificationModal from "@/app/ui/notification-modal";

type Props = {
  // Usa claves como: "producto", "cliente", "categoría", "detalles de pago", "cotización"
  entity: string;
  clearToPath: string;
};

type Grammar = {
  article: "el" | "la" | "los" | "las";
  display: string; // cómo se muestra la entidad
  number: "singular" | "plural" | "female";
};

// Diccionario para coherencia gramatical
const ENTITY_GRAMMAR: Record<string, Grammar> = {
  producto: { article: "el", display: "producto", number: "singular" },
  cliente: { article: "el", display: "cliente", number: "singular" },
  categoría: { article: "la", display: "categoría", number: "female" },
  categoria: { article: "la", display: "categoría", number: "female" }, // sin acento
  "detalles de pago": {
    article: "los",
    display: "detalles de pago",
    number: "plural",
  },
  cotización: { article: "la", display: "cotización", number: "female" },
  cotizacion: { article: "la", display: "cotización", number: "female" }, // sin acento
};

const verbByAction = (
  action: "created" | "updated" | "deleted",
  number: "singular" | "plural" | "female"
) => {
  const map = {
    created: { singular: "se creó", plural: "se crearon" },
    updated: { singular: "se actualizó", plural: "se actualizaron" },
    deleted: { singular: "se eliminó", plural: "se eliminaron" },
  };
  // Treat "female" as "singular" for verb conjugation
  const verbNumber = number === "female" ? "singular" : number;
  return map[action][verbNumber];
};

const titleByAction = (
  action: "created" | "updated" | "deleted",
  number: "singular" | "plural" | "female"
) => {
  const map = {
    created: { singular: "creado", plural: "creados", female: "creada" },
    updated: {
      singular: "actualizado",
      plural: "actualizados",
      female: "actualizada",
    },
    deleted: {
      singular: "eliminado",
      plural: "eliminados",
      female: "eliminada",
    },
  };
  return map[action][number];
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function buildCopy(
  entityKey: string,
  action: "created" | "updated" | "deleted",
  name: string
) {
  const g: Grammar =
    ENTITY_GRAMMAR[entityKey.toLowerCase()] ??
    ({
      article: "el",
      display: entityKey.toLowerCase(),
      number: "singular",
    } as Grammar);

  const title = `${capitalize(g.display)} ${titleByAction(action, g.number)}`;
  const message = `${capitalize(g.article)} ${
    g.display
  } "${name}" ${verbByAction(action, g.number)} correctamente.`;

  return { title, message };
}

export default function FlashFromQuery({ entity, clearToPath }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  useEffect(() => {
    const created = sp.get("created");
    const updated = sp.get("updated");
    const deleted = sp.get("deleted");
    const errorMsg = sp.get("error");

    if (created) {
      const { title, message } = buildCopy(entity, "created", created);
      showSuccess(title, message);
      router.replace(clearToPath);
    } else if (updated) {
      const { title, message } = buildCopy(entity, "updated", updated);
      showSuccess(title, message);
      router.replace(clearToPath);
    } else if (deleted) {
      const { title, message } = buildCopy(entity, "deleted", deleted);
      showSuccess(title, message);
      router.replace(clearToPath);
    } else if (errorMsg) {
      // Mantén el error genérico
      showError(`Error con ${entity}`, errorMsg);
      router.replace(clearToPath);
    }
  }, [sp, router, clearToPath, entity, showSuccess, showError]);

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
