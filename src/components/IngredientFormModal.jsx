import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal.jsx";

const FAMILIES = [
  "цитрусовые","древесные","цветочные","альдегидные","зеленые","кожаные",
  "абстрактные","гурманские","фруктовые","акватические","минеральные",
  "табачные","амбровые","мускусные", "технические"
];
const NOTES = ["верх", "сердце", "база"];

export default function IngredientFormModal({ open, initial, onCancel, onSubmit }) {
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [note, setNote] = useState("");
  const [substantivity, setSubstantivity] = useState("");
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setFamily(initial?.family ?? "");
    setNote(initial?.note ?? "");
    setSubstantivity(
      initial?.substantivity === 0 || initial?.substantivity ? String(initial.substantivity) : ""
    );
    setComment(initial?.comment ?? "");
    setTouched(false);
  }, [open, initial]);

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Укажите название";
    if (substantivity !== "" && !/^\d+(\.\d+)?$/.test(substantivity)) {
      e.substantivity = "Только число часов";
    }
    return e;
  }, [name, substantivity]);

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    onSubmit?.({
      name: name.trim(),
      family: family || "",
      note: note || "",
      substantivity: substantivity === "" ? "" : Number(substantivity),
      comment: comment.trim(),
    });
  };

  return (
    <Modal open={open} title={initial ? "Редактировать ингредиент" : "Добавить ингредиент"} onClose={onCancel}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Название *</label>
          <input
            className="w-full rounded-lg border px-3 py-2 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Напр.: Бергамот эфирное масло"
            autoFocus
          />
          {touched && errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Семейство</label>
            <select
              className="w-full rounded-lg border px-3 py-2 bg-white"
              value={family}
              onChange={(e) => setFamily(e.target.value)}
            >
              <option value="">—</option>
              {FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Нота</label>
            <select
              className="w-full rounded-lg border px-3 py-2 bg-white"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            >
              <option value="">—</option>
              {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Субстантивность (ч)</label>
            <input
              className="w-full rounded-lg border px-3 py-2 bg-white"
              inputMode="decimal"
              placeholder="Напр.: 24"
              value={substantivity}
              onChange={(e) => setSubstantivity(e.target.value.replace(",", "."))}
            />
            {touched && errors.substantivity && (
              <p className="mt-1 text-xs text-red-600">{errors.substantivity}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Комментарий</label>
          <textarea
            className="w-full rounded-lg border px-3 py-2 bg-white"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Заметки по материалу, IFRA, поставщик и т.п."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border px-4 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="rounded-full border px-4 py-2 text-sm bg-black text-white hover:opacity-90 transition"
          >
            {initial ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}