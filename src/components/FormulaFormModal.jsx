import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Modal from "./Modal.jsx";

// Вспомогательный тип строки
const makeEmptyRow = () => ({
  kind: "ingredient", // "ingredient" | "formula"
  refId: "",
  amount: "",
});

export default function FormulaFormModal({ open, initial, onCancel, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // строки компонентов (ингредиенты и/или формулы)
  const [rows, setRows] = useState([makeEmptyRow()]);

  // справочники
  const [ingredientsList, setIngredientsList] = useState([]);
  const [formulasList, setFormulasList] = useState([]);

  const [touched, setTouched] = useState(false);
  const [loadingRefs, setLoadingRefs] = useState(false);

  // ==== загрузка списков ингредиентов и формул ====
  useEffect(() => {
    if (!open) return;

    const loadRefs = async () => {
      try {
        setLoadingRefs(true);

        const [ingSnap, formSnap] = await Promise.all([
          getDocs(collection(db, "ingredients")),
          getDocs(collection(db, "formulas")),
        ]);

        const ings = ingSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() || {}),
        }));
        const forms = formSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() || {}),
        }));

        // сортируем по имени
        ings.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
        );
        forms.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
        );

        setIngredientsList(ings);
        setFormulasList(forms);
      } catch (e) {
        console.error("Ошибка загрузки справочников для формулы:", e);
      } finally {
        setLoadingRefs(false);
      }
    };

    loadRefs();
  }, [open]);

  // ==== инициализация при открытии / редактировании ====
  useEffect(() => {
    if (!open) return;

    setName(initial?.name ?? "");
    setDescription(initial?.description ?? "");

    if (initial?.ingredients?.length) {
      const mapped = initial.ingredients.map((item) => {
        const kind =
          item.kind ||
          (item.formulaId ? "formula" : "ingredient"); // бэкап для старых данных

        return {
          kind,
          refId:
            kind === "formula"
              ? item.formulaId || ""
              : item.ingredientId || "",
          amount:
            item.amount === 0 || item.amount
              ? String(item.amount)
              : "",
        };
      });

      setRows(mapped.length ? mapped : [makeEmptyRow()]);
    } else {
      setRows([makeEmptyRow()]);
    }

    setTouched(false);
  }, [open, initial]);

  // ==== валидация ====
  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "Укажите название формулы";

    const cleanedRows = rows.filter(
      (r) => r.refId && r.amount !== ""
    );
    if (cleanedRows.length === 0) {
      e.rows = "Добавьте хотя бы один компонент";
    }

    const badAmounts = rows.some(
      (r) =>
        r.amount !== "" &&
        !/^\d+(\.\d+)?$/.test(String(r.amount).replace(",", "."))
    );
    if (badAmounts) {
      e.amount = "Количество должно быть числом";
    }

    return e;
  }, [name, rows]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;

    // чистим и приводим строки
    const cleaned = rows
      .filter((r) => r.refId && r.amount !== "")
      .map((r) => ({
        kind: r.kind, // "ingredient" | "formula"
        ingredientId: r.kind === "ingredient" ? r.refId : null,
        formulaId: r.kind === "formula" ? r.refId : null,
        amount: parseFloat(String(r.amount).replace(",", ".")) || 0,
      }));

    onSubmit?.({
      name: name.trim(),
      description: description.trim(),
      ingredients: cleaned,
    });
  };

  const updateRow = (idx, patch) => {
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, ...patch } : row))
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, makeEmptyRow()]);
  };

  const removeRow = (idx) => {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));
  };

  return (
    <Modal
      open={open}
      title={initial ? "Редактировать формулу" : "Новая формула"}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Название */}
        <div>
          <label className="block text-sm mb-1">Название *</label>
          <input
            className="w-full rounded-lg border px-3 py-2 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Напр.: Аккорд белых цветов"
            autoFocus
          />
          {touched && errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm mb-1">Описание / идея</label>
          <textarea
            className="w-full rounded-lg border px-3 py-2 bg-white"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Кратко опиши идею, применение, впечатление от формулы…"
          />
        </div>

        {/* Компоненты */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              Компоненты (ингредиенты и/или формулы)
            </span>
            {touched && errors.rows && (
              <span className="text-xs text-red-500">{errors.rows}</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-black/60">
            <span className="w-[32%]">Тип</span>
            <span className="w-[44%]">Выбор из списка</span>
            <span className="w-[18%] text-right">Кол-во</span>
            <span className="w-[6%]" />
          </div>

          <div className="space-y-2">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-2 py-2"
              >
                {/* тип: ингре / формула */}
                <select
                  className="w-[32%] rounded-lg border border-black/10 bg-white px-2 py-1 text-sm"
                  value={row.kind}
                  onChange={(e) =>
                    updateRow(idx, { kind: e.target.value, refId: "" })
                  }
                >
                  <option value="ingredient">Ингредиент</option>
                  <option value="formula">Формула (аккорд)</option>
                </select>

                {/* выбор конкретного объекта */}
                <select
                  className="w-[44%] rounded-lg border border-black/10 bg-white px-2 py-1 text-sm"
                  value={row.refId}
                  disabled={loadingRefs}
                  onChange={(e) => updateRow(idx, { refId: e.target.value })}
                >
                  <option value="">
                    {loadingRefs
                      ? "Загрузка…"
                      : row.kind === "formula"
                      ? "Выбери формулу…"
                      : "Выбери ингредиент…"}
                  </option>

                  {row.kind === "ingredient"
                    ? ingredientsList.map((ing) => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name || "(без названия)"}
                        </option>
                      ))
                    : formulasList
                        // не даём ссылаться на саму себя
                        .filter((f) => f.id !== initial?.id)
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name || "(без названия)"}
                          </option>
                        ))}
                </select>

                {/* количество */}
                <input
                  className="w-[18%] rounded-lg border border-black/10 bg-white px-2 py-1 text-right text-sm"
                  value={row.amount}
                  inputMode="decimal"
                  onChange={(e) =>
                    updateRow(idx, { amount: e.target.value.replace(",", ".") })
                  }
                  placeholder="0"
                />

                {/* удалить строку */}
                <button
                  type="button"
                  onClick={() => removeRow(idx)}
                  className="w-[6%] text-xs text-black/40 hover:text-black"
                  title="Удалить строку"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {touched && errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
          )}

          <button
            type="button"
            onClick={addRow}
            className="mt-1 rounded-full border px-4 py-1.5 text-xs hover:bg-black hover:text-white transition"
          >
            + Добавить компонент
          </button>
        </div>

        {/* кнопки внизу */}
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
            {initial ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}