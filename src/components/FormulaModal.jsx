export default function FormulaModal({ open, item, onClose }) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* фон */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* окно */}
      <div className="relative z-10 w-[min(800px,92vw)] rounded-2xl border border-white/20 bg-zinc-900/95 text-white shadow-2xl backdrop-blur-md animate-fadeIn">
        {/* верхняя панель */}
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
        <div className="px-6 py-5 space-y-5">
          {/* описание */}
          {item.description && (
            <p className="text-white/90 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* сводка */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="opacity-60">Ингредиентов:</span>{" "}
              {item.ingredients?.length || 0}
            </div>
            <div>
              <span className="opacity-60">Всего капель:</span>{" "}
              {item.ingredients?.reduce(
                (s, i) => s + (parseFloat(i.amount) || 0),
                0
              ) || 0}
            </div>
          </div>

          {/* ингредиенты */}
          {item.ingredients?.length > 0 && (
            <div>
              <div className="opacity-60 text-sm mb-1">Состав</div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-1 text-sm max-h-[50vh] overflow-auto">
                {item.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between border-b border-white/5 pb-1 last:border-0"
                  >
                    <span className="text-white/80">{ing.name}</span>
                    <span className="text-white/60">{ing.amount} кап.</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* дата */}
          <div className="text-xs text-white/50 pt-3 border-t border-white/10">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : ""}
          </div>
        </div>
      </div>

      {/* анимация */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}