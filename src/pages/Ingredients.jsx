import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import IngredientFilters from "../components/IngredientFilters.jsx";
import IngredientCard from "../components/IngredientCard.jsx";
import IngredientFormModal from "../components/IngredientFormModal.jsx";

function inBucket(num, bucketId) {
  if (!bucketId || bucketId === "all") return true;
  const n = Number(num);
  if (!Number.isFinite(n)) return false;
  if (bucketId === "<8") return n < 8;
  if (bucketId === "8-24") return n >= 8 && n < 24;
  if (bucketId === "24-72") return n >= 24 && n <= 72;
  if (bucketId === ">72") return n > 72;
  return true;
}

export default function Ingredients() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("");
  const [note, setNote] = useState("");
  const [subBucket, setSubBucket] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, `users/${user.uid}/ingredients`);
    const unsub = onSnapshot(colRef, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(arr);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const filtered = useMemo(() => {
    return items
      .filter((i) => (search ? i.name?.toLowerCase().includes(search.toLowerCase()) : true))
      .filter((i) => (family ? i.family === family : true))
      .filter((i) => (note ? i.note === note : true))
      .filter((i) => inBucket(i.substantivity, subBucket))
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "ru"));
  }, [items, search, family, note, subBucket]);

  const resetFilters = () => {
    setSearch("");
    setFamily("");
    setNote("");
    setSubBucket("all");
  };

  const handleCreate = async (payload) => {
    if (!user) return;
    await addDoc(collection(db, `users/${user.uid}/ingredients`), {
      ...payload,
      createdAt: Date.now(),
    });
    setShowAdd(false);
  };

  const handleUpdate = async (payload) => {
    if (!user || !editItem) return;
    await updateDoc(doc(db, `users/${user.uid}/ingredients/${editItem.id}`), {
      ...payload,
      updatedAt: Date.now(),
    });
    setEditItem(null);
  };

  const handleDelete = async (ing) => {
    if (!user) return;
    if (!confirm(`Удалить «${ing.name}»?`)) return;
    await deleteDoc(doc(db, `users/${user.uid}/ingredients/${ing.id}`));
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/Ingredients.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 px-4 md:px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="font-serif text-3xl">Ингредиенты</h1>
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-full border px-4 py-2 text-sm hover:bg-black hover:text-white transition"
            >
              Добавить
            </button>
          </header>

          <IngredientFilters
            search={search} onSearchChange={setSearch}
            family={family} onFamilyChange={setFamily}
            note={note} onNoteChange={setNote}
            subBucket={subBucket} onSubBucketChange={setSubBucket}
            onReset={resetFilters}
          />

          <div className="mt-4 rounded-2xl border border-black/10 bg-white/60 backdrop-blur-sm p-4">
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {loading ? (
                <p className="text-sm text-black/60 px-1 py-2">Загрузка…</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-black/60 px-1 py-2">Ничего не найдено.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filtered.map((ing) => (
                    <IngredientCard
                      key={ing.id}
                      ingredient={ing}
                      onEdit={() => setEditItem(ing)}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модалки */}
      <IngredientFormModal
        open={showAdd}
        onCancel={() => setShowAdd(false)}
        onSubmit={handleCreate}
      />
      <IngredientFormModal
        open={!!editItem}
        initial={editItem}
        onCancel={() => setEditItem(null)}
        onSubmit={handleUpdate}
      />
    </section>
  );
}