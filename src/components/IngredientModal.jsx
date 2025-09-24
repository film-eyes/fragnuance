export default function IngredientModal({ open, item, onClose }) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* фон модалки */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* окно */}
      <div className="absolute inset-0 mx-auto my-12 w-[min(900px,92vw)] overflow-hidden rounded-2xl border border-white/20 bg-zinc-900/95 text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-serif text-2xl">{item.name}</h3>
          <button
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-5 md:grid-cols-2">
          <div className="space-y-2 text-sm/6">
            <div><span className="opacity-60">Семейство:</span> {item.family || "—"}</div>
            <div><span className="opacity-60">Нота:</span> {item.note || "—"}</div>
            <div><span className="opacity-60">Субстантивность:</span> {item.substantivity != null ? `${item.substantivity} ч` : "—"}</div>
            <div><span className="opacity-60">Экстракт (%):</span> {item.dosage || "—"}</div>
          </div>

          <div className="space-y-2">
            <div className="opacity-60 text-sm/6">Комментарий</div>
            <div className="max-h-[50vh] overflow-auto rounded-lg border border-white/10 bg-white/5 p-4 leading-7">
              {item.comment || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}