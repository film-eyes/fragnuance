import { useEffect, useState, useMemo } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import FormulaFormModal from "../components/FormulaFormModal";

export default function Formulas() {
  const [formulas, setFormulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sortMode, setSortMode] = useState("alpha"); // "alpha" | "date"

  // --- Загрузка формул из Firestore ---
  useEffect(() => {
    const fetchFormulas = async () => {
      const snapshot = await getDocs(collection(db, "formulas"));
      let list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // сортировка по умолчанию
      list.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
      );

      setFormulas(list);
      setLoading(false);
    };
    fetchFormulas();
  }, []);

  const handleAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleEdit = (formula) => {
    setEditing(formula);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Удалить формулу?")) {
      await deleteDoc(doc(db, "formulas", id));
      setFormulas(formulas.filter((f) => f.id !== id));
    }
  };

  const handleSubmit = async (data) => {
    if (editing) {
      const ref = doc(db, "formulas", editing.id);
      await updateDoc(ref, data);
      setFormulas(
        formulas.map((f) => (f.id === editing.id ? { ...f, ...data } : f))
      );
    } else {
      const ref = await addDoc(collection(db, "formulas"), {
        ...data,
        createdAt: new Date().toISOString(), // 🔹 добавляем дату создания
      });
      setFormulas([...formulas, { id: ref.id, ...data }]);
    }
    setOpenModal(false);
  };

  // --- Сортировка ---
  const sortedFormulas = useMemo(() => {
    const sorted = [...formulas];
    if (sortMode === "alpha") {
      sorted.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", "ru", { sensitivity: "base" })
      );
    } else if (sortMode === "date") {
      sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    return sorted;
  }, [formulas, sortMode]);

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/Formulas.jpg')" }}
    >
      {/* затемнение */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h1 className="font-serif text-4xl">Формулы</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-white/20 rounded-full px-3 py-1 bg-white/10 backdrop-blur">
              <button
                onClick={() => setSortMode("alpha")}
                className={`text-sm transition ${
                  sortMode === "alpha"
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                По алфавиту
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setSortMode("date")}
                className={`text-sm transition ${
                  sortMode === "date"
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                По дате
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm hover:bg-white/20 transition active:scale-[.98]"
            >
              + Добавить
            </button>
          </div>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : sortedFormulas.length === 0 ? (
          <p className="text-white/70">Пока нет формул.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedFormulas.map((formula) => (
              <div
                key={formula.id}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl hover:bg-white/20 transition relative"
              >
                <h3 className="text-xl font-serif mb-2">{formula.name}</h3>
                {formula.description && (
                  <p className="text-sm text-white/80 mb-2">
                    {formula.description}
                  </p>
                )}
                <p className="text-sm text-white/70">
                  Ингредиентов: {formula.ingredients?.length || 0}
                </p>
                <p className="text-sm text-white/70">
                  Всего капель:{" "}
                  {formula.ingredients?.reduce(
                    (s, i) => s + (parseFloat(i.amount) || 0),
                    0
                  ) || 0}
                </p>

                {formula.createdAt && (
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(formula.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                )}

                <div className="flex gap-2 absolute top-3 right-3">
                  <button
                    onClick={() => handleEdit(formula)}
                    className="text-blue-400 hover:text-blue-500"
                    title="Редактировать"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(formula.id)}
                    className="text-red-400 hover:text-red-600"
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* модалка */}
      <FormulaFormModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </section>
  );
}