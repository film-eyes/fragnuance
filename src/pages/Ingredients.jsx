import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query
} from "firebase/firestore";

import { db } from "../firebase.js";
import IngredientCard from "../components/IngredientCard.jsx";
import IngredientModal from "../components/IngredientModal.jsx";
import IngredientFormModal from "../components/IngredientFormModal.jsx";

const families = [
  "цитрусовые","древесные","цветочные","альдегидные","зеленые","кожаные",
  "абстрактные","гурманские","фруктовые","акватические","минеральные",
  "табачные","амбровые","мускусные","технические"
];
const notes = ["верх","сердце","база"];
const durationRanges = [
  { label: "Любая длительность", value: "any" },
  { label: "до 5 часов", value: "0-5" },
  { label: "от 5 до 15 часов", value: "5-15" },
  { label: "от 15 до 50 часов", value: "15-50" },
  { label: "больше 50 часов", value: "50+" },
];

export default function Ingredients() {
  const { user } = useAuth();
  const colRef = useMemo(() => collection(db, "ingredients"), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // фильтры
  const [qText, setQText] = useState("");
  const [qFamily, setQFamily] = useState("");
  const [qNote, setQNote] = useState("");
  const [qRange, setQRange] = useState("any");

  // модалки
  const [openModal, setOpenModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // ===== ЗАГРУЗКА =====
  useEffect(() => {
    const q = query(colRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(list);
    });
    return () => unsubscribe();
  }, [colRef]);

  // ===== CRUD =====
  const handleAdd = () => {
    setEditingItem(null);
    setOpenForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setOpenForm(true);
  };

  const handleDelete = async (item) => {
    if (!confirm(`Удалить "${item.name}"?`)) return;
    await deleteDoc(doc(db, "ingredients", item.id));
    setItems(prev => prev.filter(x => x.id !== item.id));
  };

  const handleSubmit = async (data) => {
    if (editingItem) {
      const ref = doc(db, "ingredients", editingItem.id);
      await updateDoc(ref, data);
    } else {
      await addDoc(colRef, data);
    }
    setOpenForm(false);
  };

  // ===== ФИЛЬТРАЦИЯ =====
  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (qText && !it.name?.toLowerCase().includes(qText.toLowerCase())) return false;
      if (qFamily && it.family !== qFamily) return false;
      if (qNote && it.note !== qNote) return false;

      if (qRange !== "any") {
        const s = Number(it.substantivity ?? 0);
        switch (qRange) {
          case "0-5": if (!(s >= 0 && s < 5)) return false; break;
          case "5-15": if (!(s >= 5 && s < 15)) return false; break;
          case "15-50": if (!(s >= 15 && s < 50)) return false; break;
          case "50+": if (!(s >= 50)) return false; break;
          default: break;
        }
      }
      return true;
    });
  }, [items, qText, qFamily, qNote, qRange]);

  // ===== РЕНДЕР =====
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/Ingredients.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/35" />

      <main className="relative z-10 pt-24 md:pt-28">
        <div className="mx-auto w-[min(1200px,94vw)]">
          {/* Заголовок + большая кнопка Добавить */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="font-serif text-3xl text-white">Ингредиенты</h1>

            <button
              onClick={handleAdd}
              className="block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/20 active:scale-[.98]"
              title="Добавить ингредиент"
            >
              Добавить
            </button>
          </div>

          {/* Фильтры */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <input
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Поиск по названию…"
              className="h-10 rounded-xl border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/60"
            />
            <select
              value={qFamily}
              onChange={(e) => setQFamily(e.target.value)}
              className="h-10 rounded-xl border border-white/20 bg-white/10 px-3 text-white"
            >
              <option value="">Все семейства</option>
              {families.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select
              value={qNote}
              onChange={(e) => setQNote(e.target.value)}
              className="h-10 rounded-xl border border-white/20 bg-white/10 px-3 text-white"
            >
              <option value="">Все ноты</option>
              {notes.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <select
              value={qRange}
              onChange={(e) => setQRange(e.target.value)}
              className="h-10 rounded-xl border border-white/20 bg-white/10 px-3 text-white"
            >
              {durationRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {/* ПРОКРУЧИВАЕМАЯ ОБЛАСТЬ */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur">
            <div className="grid max-h-[calc(100vh-320px)] grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div className="col-span-full py-10 text-center text-white/70">Загрузка…</div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full py-10 text-center text-white/60">Ничего не найдено</div>
              ) : (
                filtered.map((item) => (
                  <IngredientCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onOpen={(it) => { setActiveItem(it); setOpenModal(true); }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Просмотр */}
      <IngredientModal
        open={openModal}
        item={activeItem}
        onClose={() => setOpenModal(false)}
      />

      {/* Добавление/редактирование */}
      <IngredientFormModal
        open={openForm}
        initial={editingItem}
        onCancel={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />
    </section>
  );
}