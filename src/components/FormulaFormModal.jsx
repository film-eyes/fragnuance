// src/components/FormulaFormModal.jsx

import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FormulaFormModal({ open, onCancel, onSubmit, initial }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [formulaOptions, setFormulaOptions] = useState([]);

  const scrollRef = useRef(null);

  // заполняем форму при открытии
  useEffect(() => {
    if (!open) return;
    setName(initial?.name || "");
    setDescription(initial?.description || "");
    setIngredients(initial?.ingredients || []);
  }, [open, initial]);

  // 🔹 Загружаем ИНГРЕДИЕНТЫ из Firestore и сортируем по алфавиту
  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(db, "ingredients"));
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
      );
      setIngredientOptions(list);
    };
    fetchIngredients();
  }, []);

  // 🔹 Загружаем ФОРМУЛЫ для использования как компоненты
  useEffect(() => {
    const fetchFormulas = async () => {
      const snapshot = await getDocs(collection(db, "formulas"));
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
      );
      setFormulaOptions(list);
    };
    fetchFormulas();
  }, []);

  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { kind: "ingredient", name: "", amount: "" }, // kind — тип компонента
    ]);

    // Автопрокрутка вниз
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleChangeIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };

    // если меняем тип — очищаем выбранное имя
    if (field === "kind") {
      newIngredients[index].name = "";
    }

    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // сохраняем как есть; старые поля name/amount остаются теми же,
    // просто у новых компонентов может быть ещё и kind
    onSubmit({ name, description, ingredients });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* фон */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* окно */}
      <div className="relative z-10 w-[min(700px,94vw)] max-h-[90vh] overflow-hidden rounded-2xl border border-white/20 bg-zinc-900/95 text-white shadow-xl backdrop-blur-md flex flex-col">
        {/* верх */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-serif text-2xl">
            {initial ? "Редактировать формулу" : "Новая формула"}
          </h3>
          <button
            onClick={onCancel}
            className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition"
          >
            ✕
          </button>
        </div>

        {/* контент */}
        <div
          ref={scrollRef}
          className="overflow-y-auto px-6 py-5 space-y-4 flex-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          {/* Название */}
          <div>
            <label className="block text-sm mb-1 opacity-70">Название</label>
            <input
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название формулы"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm mb-1 opacity-70">Описание / идея</label>
            <textarea
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50 resize-none"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание, вдохновение, заметки..."
            />
          </div>

          {/* Список компонентов */}
          <div>
            <label className="block text-sm mb-2 opacity-70">
              Компоненты (ингредиенты и/или формулы)
            </label>

            <div className="space-y-2">
              {ingredients.map((ing, index) => {
                const kind = ing.kind || "ingredient";
                const isIngredient = kind === "ingredient";

                const options = isIngredient
                  ? ingredientOptions
                  : formulaOptions;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-[120px,minmax(0,1fr),80px,auto] gap-2 items-center"
                  >
                    {/* Тип */}
                    <select
                      className="rounded-lg border border-white/20 bg-white/10 px-2 py-2 text-sm text-white"
                      value={kind}
                      onChange={(e) =>
                        handleChangeIngredient(index, "kind", e.target.value)
                      }
                    >
                      <option value="ingredient">Ингредиент</option>
                      <option value="formula">Формула</option>
                    </select>

                    {/* Выбор из списка */}
                    <select
                      className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                      value={ing.name || ""}
                      onChange={(e) =>
                        handleChangeIngredient(index, "name", e.target.value)
                      }
                    >
                      <option value="">
                        {isIngredient
                          ? "Выбери ингредиент..."
                          : "Выбери формулу..."}
                      </option>
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>

                    {/* Кол-во капель */}
                    <input
                      type="number"
                      className="w-20 rounded-lg border border-white/20 bg-white/10 px-2 py-2 text-center text-white"
                      placeholder="0"
                      value={ing.amount}
                      onChange={(e) =>
                        handleChangeIngredient(index, "amount", e.target.value)
                      }
                    />

                    {/* Удалить */}
                    <button
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-400 hover:text-red-500 text-lg"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleAddIngredient}
              className="mt-3 text-sm rounded-full border border-white/30 bg-white/10 px-3 py-1.5 hover:bg-white/20 transition"
            >
              + Добавить компонент
            </button>
          </div>
        </div>

        {/* низ */}
        <div className="flex justify-end border-t border-white/10 px-6 py-4">
          <button
            onClick={handleSave}
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium hover:bg-green-700 transition"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}