import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const families = [
  "цитрусовые",
  "древесные",
  "цветочные",
  "альдегидные",
  "зеленые",
  "кожаные",
  "абстрактные",
  "гурманские",
  "фруктовые",
  "акватические",
  "минеральные",
  "табачные",
  "амбровые",
  "мускусные",
];

const notes = ["верх", "сердце", "база"];

const substantivityOptions = [
  { value: "до 5 часов", label: "до 5 часов" },
  { value: "от 5 до 15 часов", label: "от 5 до 15 часов" },
  { value: "от 15 до 50 часов", label: "от 15 до 50 часов" },
  { value: "больше 50 часов", label: "больше 50 часов" },
];

// Небольшой помощник для модалки
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-[61] w-full max-w-lg rounded-2xl border border-white/15 bg-black/70 p-6 text-white shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default function Ingredients() {
  const { user } = useAuth();
  const db = getFirestore();

  const colRef = useMemo(() => {
    if (!user?.uid) return null;
    return collection(db, "users", user.uid, "ingredients");
  }, [db, user?.uid]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // фильтры
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [noteFilter, setNoteFilter] = useState("");
  const [substFilter, setSubstFilter] = useState("");

  // модалка
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    family: "",
    note: "",
    substantivity: "",
    extraitPercent: "",
    comment: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      family: "",
      note: "",
      substantivity: "",
      extraitPercent: "",
      comment: "",
    });

  const startCreate = () => {
    setEditingId(null);
    resetForm();
    setOpenForm(true);
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setForm({
      name: it.name ?? "",
      family: it.family ?? "",
      note: it.note ?? "",
      substantivity: it.substantivity ?? "",
      extraitPercent: it.extraitPercent ?? "",
      comment: it.comment ?? "",
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!colRef) return;
    if (!confirm("Удалить ингредиент?")) return;
    await deleteDoc(doc(colRef, id));
    await load();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!colRef) return;

    const payload = {
      name: form.name.trim(),
      family: form.family || "",
      note: form.note || "",
      substantivity: form.substantivity || "",
      extraitPercent:
        form.extraitPercent === "" ? "" : Number(form.extraitPercent),
      comment: form.comment?.trim() || "",
      updatedAt: serverTimestamp(),
      createdAt: editingId ? undefined : serverTimestamp(),
    };

    if (!payload.name) {
      alert("Укажите название ингредиента");
      return;
    }

    if (editingId) {
      await updateDoc(doc(colRef, editingId), payload);
    } else {
      await addDoc(colRef, payload);
    }

    setOpenForm(false);
    setEditingId(null);
    resetForm();
    await load();
  };

  const load = async () => {
    if (!colRef) return;
    setLoading(true);
    try {
      const snap = await getDocs(query(colRef, orderBy("name", "asc")));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // если юзер ещё не прогрузился — не дёргаем
    if (!user?.uid) return;
    // подгружаем
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const bySearch =
        !search ||
        it.name?.toLowerCase().includes(search.toLowerCase()) ||
        it.comment?.toLowerCase().includes(search.toLowerCase());

      const byFamily = !familyFilter || it.family === familyFilter;
      const byNote = !noteFilter || it.note === noteFilter;
      const bySubst = !substFilter || it.substantivity === substFilter;

      return bySearch && byFamily && byNote && bySubst;
    });
  }, [items, search, familyFilter, noteFilter, substFilter]);

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/images/Ingredients.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Ингредиенты</h1>

        {/* Панель фильтров */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none placeholder-white/60"
            placeholder="Поиск…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
          >
            <option value="">Семейство: все</option>
            {families.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
            value={noteFilter}
            onChange={(e) => setNoteFilter(e.target.value)}
          >
            <option value="">Нота: все</option>
            {notes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
            value={substFilter}
            onChange={(e) => setSubstFilter(e.target.value)}
          >
            <option value="">Субстантивность: все</option>
            {substantivityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <button
            onClick={startCreate}
            className="rounded-full border border-white/25 bg-black/30 px-4 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            + Добавить ингредиент
          </button>
        </div>

        {/* Список */}
        {loading ? (
          <p className="opacity-80">Загрузка…</p>
        ) : filtered.length === 0 ? (
          <p className="opacity-80">Ничего не найдено.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((it) => (
              <article
                key={it.id}
                className="rounded-2xl border border-white/15 bg-black/35 p-5"
              >
                <h3 className="font-serif text-2xl mb-2">{it.name}</h3>
                <dl className="space-y-1 text-sm opacity-90">
                  <div>
                    <dt className="inline opacity-70">Семейство:</dt>{" "}
                    <dd className="inline">{it.family || "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline opacity-70">Нота:</dt>{" "}
                    <dd className="inline">{it.note || "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline opacity-70">Субстантивность:</dt>{" "}
                    <dd className="inline">{it.substantivity || "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline opacity-70">
                      Ввод в парфюмерный экстракт:
                    </dt>{" "}
                    <dd className="inline">
                      {it.extraitPercent !== "" && it.extraitPercent != null
                        ? `${it.extraitPercent}%`
                        : "—"}
                    </dd>
                  </div>
                  {it.comment ? (
                    <div>
                      <dt className="opacity-70">Комментарий:</dt>
                      <dd>{it.comment}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => startEdit(it)}
                    className="rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
                    className="rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Модалка создания/редактирования */}
      <Modal open={openForm} onClose={() => setOpenForm(false)}>
        <h3 className="font-serif text-2xl mb-4">
          {editingId ? "Редактировать ингредиент" : "Новый ингредиент"}
        </h3>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm opacity-80 mb-1">Название</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm opacity-80 mb-1">Семейство</label>
              <select
                name="family"
                value={form.family}
                onChange={onChange}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
              >
                <option value="">—</option>
                {families.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm opacity-80 mb-1">Нота</label>
              <select
                name="note"
                value={form.note}
                onChange={onChange}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
              >
                <option value="">—</option>
                {notes.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm opacity-80 mb-1">
              Субстантивность
            </label>
            <select
              name="substantivity"
              value={form.substantivity}
              onChange={onChange}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
            >
              <option value="">—</option>
              {substantivityOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm opacity-80 mb-1">
              Ввод в парфюмерный экстракт (%)
            </label>
            <input
              name="extraitPercent"
              type="number"
              step="0.1"
              min="0"
              value={form.extraitPercent}
              onChange={onChange}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none"
              placeholder="например, 2"
            />
          </div>

          <div>
            <label className="block text-sm opacity-80 mb-1">
              Комментарий
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={onChange}
              rows={3}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2 outline-none resize-none"
              placeholder="Заметки…"
            />
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="rounded-full border border-white/25 bg-black/30 px-4 py-2 text-sm hover:bg-white hover:text-black transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-full border border-white/25 bg-white/90 text-black px-4 py-2 text-sm hover:bg-white transition"
            >
              {editingId ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}