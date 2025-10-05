import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FormulaFormModal({ open, onCancel, onSubmit, initial }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);

  // --- Загружаем ингредиенты из Firestore ---
  useEffect(() => {
    if (!open) return;
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(db, "ingredients"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableIngredients(list);
    };
    fetchIngredients();
  }, [open]);

  // --- Автозаполнение при редактировании ---
  useEffect(() => {
    if (initial && open) {
      setName(initial.name || "");
      setDescription(initial.description || "");
      setIngredients(
        (initial.ingredients || []).map((ing) => ({
          id: ing.id || "",
          name: ing.name || "",
          amount: ing.amount || "",
        }))
      );
    } else if (!initial && open) {
      setName("");
      setDescription("");
      setIngredients([]);
    }
  }, [initial, open]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: "", name: "", amount: "" }]);
  };

  const handleChangeIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;

    if (field === "id") {
      const selected = availableIngredients.find((i) => i.id === value);
      updated[index].name = selected ? selected.name : "";
    }

    setIngredients(updated);
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalDrops = ingredients.reduce(
      (sum, ing) => sum + (parseFloat(ing.amount) || 0),
      0
    );
    onSubmit({ name, description, ingredients, totalDrops });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl text-white relative">
        <h2 className="text-2xl font-serif mb-4">
          {initial ? "Редактировать формулу" : "Новая формула"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Название</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md bg-white/20 text-white outline-none"
              placeholder="Например: Everyday v2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md bg-white/20 text-white outline-none"
              placeholder="Краткое описание композиции"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Ингредиенты</label>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center bg-white/5 p-2 rounded-lg"
                >
                  <select
                    value={ing.id}
                    onChange={(e) =>
                      handleChangeIngredient(index, "id", e.target.value)
                    }
                    className="flex-1 bg-white/20 p-2 rounded text-white"
                  >
                    <option value="">Выбери ингредиент...</option>
                    {availableIngredients.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={ing.amount}
                    onChange={(e) =>
                      handleChangeIngredient(index, "amount", e.target.value)
                    }
                    className="w-24 p-2 rounded bg-white/20 text-white text-center"
                    placeholder="капли"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-400 hover:text-red-600 text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddIngredient}
              className="mt-3 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              + Добавить ингредиент
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/20">
            <span className="text-sm text-white/70">
              Всего капель:{" "}
              {ingredients.reduce(
                (sum, ing) => sum + (parseFloat(ing.amount) || 0),
                0
              )}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500/70 hover:bg-green-500 rounded-lg transition"
              >
                {initial ? "Сохранить" : "Создать"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}