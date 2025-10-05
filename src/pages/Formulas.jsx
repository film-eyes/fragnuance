import { useEffect, useState } from "react";
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

  // --- Загрузка формул из Firestore ---
  useEffect(() => {
    const fetchFormulas = async () => {
      const snapshot = await getDocs(collection(db, "formulas"));
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
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
      const ref = await addDoc(collection(db, "formulas"), data);
      setFormulas([...formulas, { id: ref.id, ...data }]);
    }
    setOpenModal(false);
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/Formulas.jpg')" }}
    >
      {/* затемнение */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 max-w-6xl mx-auto p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif text-4xl">Формулы</h1>
          <button
            onClick={handleAdd}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            + Добавить
          </button>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : formulas.length === 0 ? (
          <p className="text-white/70">Пока нет формул.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {formulas.map((formula) => (
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