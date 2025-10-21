"use client";

import { useToast, type Toast as ToastType } from "@/contexts/ToastContext";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-500",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-500",
  },
  warning: {
    container: "bg-orange-50 border-orange-200 text-orange-800",
    icon: "text-orange-500",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-500",
  },
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToast();
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[toast.type];
  const style = styles[toast.type];

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    // Auto-remove animation before actual removal
    if (toast.duration && toast.duration > 300) {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  return (
    <div
      className={`
        flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-lg border shadow-lg
        transition-all duration-300 ease-in-out
        ${style.container}
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
}
