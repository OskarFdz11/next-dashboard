"use client";

import { Fragment } from "react";
import {
  DialogPanel,
  TransitionChild,
  Dialog,
  Transition,
  DialogTitle,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message?: string;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const notificationConfig = {
  success: {
    icon: CheckCircleIcon,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  },
  error: {
    icon: XCircleIcon,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
    buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    icon: ExclamationCircleIcon,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    icon: InformationCircleIcon,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
};

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = false,
  autoCloseDelay = 3000,
}: NotificationModalProps) {
  const config = notificationConfig[type];
  const IconComponent = config.icon;

  // Auto close functionality
  if (autoClose && isOpen) {
    setTimeout(() => {
      onClose();
    }, autoCloseDelay);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${config.bgColor}`}
                  >
                    <IconComponent className={`h-6 w-6 ${config.iconColor}`} />
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  {message && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.buttonColor}`}
                    onClick={onClose}
                  >
                    Aceptar
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
