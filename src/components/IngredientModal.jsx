export default function IngredientModal({ open, item, onClose }) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* затемнение фона */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* окно */}
      <div className="relative z-10 w-[min(800px,92vw)] rounded-2xl border border-white/20 bg-zinc-900/95 text-white shadow-2xl backdrop-blur-md">
        {/* заголовок */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-serif text-2xl">{item.name}</h3>
          <button
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        {/* контент */}
        <div className="grid grid-cols-1 gap-6 px-6 py-5 md:grid-cols-2">
          {/* левая часть */}
          <div className="space-y-2 text-sm leading-6">
            <div>
              <span className="opacity-60">Семейство:</span>{" "}
              {item.family || "—"}
            </div>
            <div>
              <span className="opacity-60">Нота:</span>{" "}
              {item.note || "—"}
            </div>
            <div>
              <span className="opacity-60">Субстантивность:</span>{" "}
              {item.substantivity != null ? `${item.substantivity} ч` : "—"}
            </div>
          </div>

          {/* правая часть */}
          <div className="space-y-2">
            <div className="opacity-60 text-sm leading-6">Комментарий</div>
            <div className="relative max-h-[50vh] overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-4 leading-7 backdrop-blur-sm scroll-smooth">
              <div className="whitespace-pre-line">{item.comment || "—"}</div>

              {/* мягкий градиент снизу, когда текст длинный */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-900/95 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}