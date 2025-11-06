// src/components/FormulaFormModal.jsx
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Modal from "./Modal.jsx";

const COMPONENT_TYPES = [
  { value: "ingredient", label: "Ингредиент" },
  { value: "formula", label: "Формула" },
];

export default function FormulaFormModal({ open, initial, onCancel, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [rows, setRows] = useState([
    { type: "ingredient", refId: "", amount: "" },
  ]);

  const [ingredients, setIngredients] = useState([]);
  const [formulas, setFormulas] = useState([]);

  const [touched, setTouched] = useState(false);

  // Загружаем списки ингредиентов и формул
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const [ingSnap, formSnap] = await Promise.all([
        getDocs(collection(db, "ingredients")),
        getDocs(collection(db, "formulas")),
      ]);

      const ingList = ingSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "ru", {
            sensitivity: "base",
          })
        );

      const formList = formSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "ru", {
            sensitivity: "base",
          })
        );

      setIngredients(ingList);
      setFormulas(formList);
    };

    load();
  }, [open]);

  // Подготовка initial -> локальный стейт (включая старый формат)
  useEffect(() => {
    if (!open) return;

    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");

    const src = initial?.ingredients || [];

    if (!src.length) {
      setRows([{ type: "ingredient", refId: "", amount: "" }]);
      setTouched(false);
      return;
    }

    const mapped = src.map((row) => {
      // поддержка старого формата:
      // { ingredientId, amount }  или { formulaId, amount }
      const legacyIngredientId = row.ingredientId;
      const legacyFormulaId = row.formulaId;

      const type =
        row.type ||
        (legacyFormulaId ? "formula" : "ingredient");

      const refId = row.refId || legacyIngredientId || legacyFormulaId || "";

      return {
        type,
        refId,
        amount:
          row.amount !== undefined
            ? String(row.amount)
            : row.drops !== undefined
            ? String(row.drops)
            : "",
      };
    });

    setRows(mapped.length ? mapped : [{ type: "ingredient", refId: "", amount: "" }]);
    setTouched(false);
  }, [open, initial]);

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Укажи название формулы";

    const anyBadAmount = rows.some(
      (r) => r.amount !== "" && !/^\d+(\.\d+)?$/.test(r.amount)
    );
    if (anyBadAmount) e.amount = "Количество должно быть числом";

    const anyChosen = rows.some((r) => r.refId && r.amount);
    if (!anyChosen) e.rows = "Добавь хотя бы один компонент";

    return e;
  }, [name, rows]);

  const updateRow = (index, patch) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { type: "ingredient", refId: "", amount: "" },
    ]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    if (Object.keys(errors).length) return;

    const cleaned = rows
      .filter((r) => r.refId && r.amount !== "" && !isNaN(Number(r.amount)))
      .map((r) => ({
        type: r.type,
        refId: r.refId,
        amount: Number(r.amount),
      }));

    onSubmit?.({
      name: name.trim(),
      description: description.trim(),
      ingredients: cleaned,
    });
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      title={initial ? "Редактировать формулу" : "Новая формула"}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Название */}
        <div>
          <label className="block text-sm mb-1 text-white/80">
            Название *
          </label>
          <input
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Напр.: Аккорд белых цветов"
            autoFocus
          />
          {touched && errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm mb-1 text-white/80">
            Описание / идея
          </label>
          <textarea
            className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/40"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Кратко опиши идею, применение, впечатление от формулы…"
          />
        </div>

        {/* Компоненты */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-white/80">
              Компоненты (ингредиенты и/или формулы)
            </p>
          </div>

          <div className="hidden md:grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_90px_40px] gap-2 text-xs text-white/60 px-1">
            <span>Тип</span>
            <span>Выбор из списка</span>
            <span className="text-right">Кол-во</span>
            <span />
          </div>

          <div className="space-y-2">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,140px)_minmax(0,1fr)_90px_40px] items-center"
              >
                {/* Тип */}
                <select
                  className="h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white"
                  value={row.type}
                  onChange={(e) =>
                    updateRow(index, { type: e.target.value, refId: "" })
                  }
                >
                  {COMPONENT_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Выбор (ингредиент или формула) */}
                <select
                  className="h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white"
                  value={row.refId}
                  onChange={(e) =>
                    updateRow(index, { refId: e.target.value })
                  }
                >
                  <option value="">
                    {row.type === "formula"
                      ? "Выбери формулу…"
                      : "Выбери ингредиент…"}
                  </option>

                  {(row.type === "formula" ? formulas : ingredients).map(
                    (item) => (
                      <option key={item.id} value={item.id}>
                        {item.name || "Без названия"}
                      </option>
                    )
                  )}
                </select>

                {/* Кол-во */}
                <input
                  className="h-10 rounded-lg border border-white/20 bg-white/5 px-2 text-sm text-right text-white"
                  inputMode="decimal"
                  placeholder="0"
                  value={row.amount}
                  onChange={(e) =>
                    updateRow(index, {
                      amount: e.target.value.replace(",", "."),
                    })
                  }
                />

                {/* Удалить строку */}
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 text-sm text-white/70 hover:bg-white/15"
                  title="Удалить компонент"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={addRow}
              className="mt-1 inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              + Добавить компонент
            </button>
            {touched && errors.rows && (
              <p className="mt-1 text-xs text-red-400">{errors.rows}</p>
            )}
            {touched && errors.amount && (
              <p className="mt-1 text-xs text-red-400">{errors.amount}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            {initial ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}