"use client";

import { useState, useCallback } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationState {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message?: string;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const showNotification = useCallback(
    (type: NotificationType, title: string, message?: string) => {
      setNotification({
        isOpen: true,
        type,
        title,
        message,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showNotification("success", title, message);
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showNotification("error", title, message);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showNotification("warning", title, message);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showNotification("info", title, message);
    },
    [showNotification]
  );

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
