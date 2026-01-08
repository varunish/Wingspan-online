import { useState, useCallback } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "error", duration = 4000) => {
    const id = toastId++;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showError = useCallback((message) => addToast(message, "error"), [addToast]);
  const showWarning = useCallback((message) => addToast(message, "warning"), [addToast]);
  const showSuccess = useCallback((message) => addToast(message, "success"), [addToast]);
  const showInfo = useCallback((message) => addToast(message, "info"), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showError,
    showWarning,
    showSuccess,
    showInfo
  };
}
