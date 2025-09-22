import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";

function formatSub(value) {
  if (value === undefined || value === null || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? `${n} ч` : String(value);
}

function IngredientCard({ ingredient, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg leading-tight">{ingredient.name}</h3>
          <p className="text-xs text-black/60">{ingredient.family} • {ingredient.note}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(ingredient)}
            className="rounded-md px-2 py-1 text-xs border hover:bg-black hover:text-white transition flex items-center gap-1"
            title="Редактировать"
          >
            <Pencil size={14} />
            Ред.
          </button>
          <button
            onClick={() => onDelete(ingredient)}
            className="rounded-md px-2 py-1 text-xs border hover:bg-black hover:text-white transition flex items-center gap-1"
            title="Удалить"
          >
            <Trash2 size={14} />
            Удал.
          </button>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt className="text-black/50">Субстантивность</dt>
        <dd className="text-right">{formatSub(ingredient.substantivity)}</dd>

        {ingredient.comment ? (
          <>
            <dt className="text-black/50">Комментарий</dt>
            <dd className="text-right truncate" title={ingredient.comment}>
              {ingredient.comment}
            </dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}

export default memo(IngredientCard);