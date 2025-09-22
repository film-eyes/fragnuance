import { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-[101] w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-serif text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm border hover:bg-black hover:text-white transition"
          >
            Закрыть
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}