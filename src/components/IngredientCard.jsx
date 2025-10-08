import { Pencil, Trash2 } from "lucide-react";

export default function IngredientCard({ item, onEdit, onDelete, onOpen }) {
  return (
    <article
      onClick={() => onOpen?.(item)}
      className="group relative cursor-pointer rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur transition hover:bg-white/10"
    >
      {/* Верхняя строка: название + actions */}
      <div className="flex items-start gap-3">
        <h3 className="font-medium text-white/95">{item.name || "—"}</h3>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-1 text-xs text-white/90 hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
            title="Редактировать"
          >
            <Pencil size={14} /> Ред.
          </button>
          <button
            className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2 py-1 text-xs text-white/90 hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); onDelete?.(item); }}
            title="Удалить"
          >
            <Trash2 size={14} /> Удал.
          </button>
        </div>
      </div>

      {/* Метаданные */}
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/70">
        <div className="truncate">
          <span className="opacity-60">Семейство:</span>{" "}
          {item.family || "—"}
        </div>
        <div className="truncate">
          <span className="opacity-60">Нота:</span>{" "}
          {item.note || "—"}
        </div>
        <div className="truncate">
          <span className="opacity-60">Субстантивность:</span>{" "}
          {item.substantivity != null ? `${item.substantivity} ч` : "—"}
        </div>
      </div>

      {/* Комментарий: показываем 5–6 строк, дальше — скролл */}
      {item.comment ? (
        <div className="mt-3 max-h-28 overflow-auto pr-1 text-sm leading-6 text-white/90">
          {item.comment}
        </div>
      ) : null}
    </article>
  );
}