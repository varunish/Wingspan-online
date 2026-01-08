import { useEffect } from "react";

export function Toast({ message, type = "error", onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const colors = {
    error: { bg: "#fee", border: "#c33", color: "#800" },
    warning: { bg: "#ffc", border: "#cc6", color: "#660" },
    success: { bg: "#efe", border: "#3c3", color: "#080" },
    info: { bg: "#eef", border: "#66c", color: "#008" }
  };

  const style = colors[type] || colors.error;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        padding: "16px 20px",
        backgroundColor: style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: 400,
        zIndex: 10000,
        animation: "slideIn 0.3s ease-out"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div style={{ color: style.color, fontWeight: 500 }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2em",
            cursor: "pointer",
            marginLeft: 12,
            color: style.color
          }}
        >
          ×
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <>
      {toasts.map((toast, idx) => (
        <div key={toast.id} style={{ top: 20 + idx * 90 }}>
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </>
  );
}
