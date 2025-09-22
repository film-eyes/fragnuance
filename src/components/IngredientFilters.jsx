import { memo } from "react";

const FAMILIES = [
  "цитрусовые","древесные","цветочные","альдегидные","зеленые","кожаные",
  "абстрактные","гурманские","фруктовые","акватические","минеральные",
  "табачные","амбровые","мускусные",
];

const NOTES = ["верх", "сердце", "база"];

const SUB_BUCKETS = [
  { id: "all", label: "Любая длительность" },
  { id: "<8", label: "< 8 ч" },
  { id: "8-24", label: "8–24 ч" },
  { id: "24-72", label: "24–72 ч" },
  { id: ">72", label: "> 72 ч" },
];

function IngredientFilters({
  search, onSearchChange,
  family, onFamilyChange,
  note, onNoteChange,
  subBucket, onSubBucketChange,
  onReset,
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по названию…"
          className="w-full rounded-lg border px-3 py-2 bg-white/80"
        />

        <select
          value={family}
          onChange={(e) => onFamilyChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 bg-white/80"
        >
          <option value="">Все семейства</option>
          {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 bg-white/80"
        >
          <option value="">Все ноты</option>
          {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <select
          value={subBucket}
          onChange={(e) => onSubBucketChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 bg-white/80"
        >
          {SUB_BUCKETS.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
        </select>
      </div>

      <div className="mt-3 flex justify-between">
        <button
          onClick={onReset}
          className="text-xs rounded-full border px-3 py-1 hover:bg-black hover:text-white transition"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}

export default memo(IngredientFilters);