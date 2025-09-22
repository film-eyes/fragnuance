import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { db } from "../lib/firebase.js";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/* ===== Русские подписи при хранении кодов ===== */

const FAMILY_MAP = {
  citrus: "Цитрусовые",
  woody: "Древесные",
  floral: "Цветочные",
  aldehydic: "Альдегидные",
  green: "Зеленые",
  leather: "Кожаные",
  abstract: "Абстрактные",
  gourmand: "Гурманские",
  fruity: "Фруктовые",
  aquatic: "Акватические",
  mineral: "Минеральные",
  tobacco: "Табачные",
  amber: "Амбровые",
  musk: "Мускусные",
};

const NOTE_MAP = {
  top: "Верх",
  heart: "Сердце",
  base: "База",
};

const FAMILIES = Object.keys(FAMILY_MAP);
const NOTES = Object.keys(NOTE_MAP);

const SUB_FILTERS = [
  { id: "all", label: "все", test: () => true },
  { id: "lt5", label: "до 5 часов", test: (h) => h < 5 },
  { id: "5to15", label: "от 5 до 15 часов", test: (h) => h >= 5 && h < 15 },
  { id: "15to50", label: "от 15 до 50 часов", test: (h) => h >= 15 && h < 50 },
  { id: "gt50", label: "больше 50 часов", test: (h) => h >= 50 },
];

function familyLabel(code) {
  return code ? FAMILY_MAP[code] || code : "-";
}
function noteLabel(code) {
  return code ? NOTE_MAP[code] || code : "-";
}

const emptyForm = {
  id: "",
  name: "",
  family: "",
  note: "",
  substantivityHours: "",
  extraitInputPct: "",
  comment: "",
};

export default function Ingredients() {
  const { user, signInWithGoogle } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [qText, setQText] = useState("");
  const [fltFamily, setFltFamily] = useState("all");
  const [fltNote, setFltNote] = useState("all");
  const [fltSub, setFltSub] = useState("all");

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const colRef = user
    ? collection(db, `users/${user.uid}/ingredients`)
    : undefined;

  useEffect(() => {
    if (!colRef) return;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(colRef, orderBy("name", "asc")));
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.uid]);

  const filtered = useMemo(() => {
    const subRule = SUB_FILTERS.find((s) => s.id === fltSub) || SUB_FILTERS[0];
    const t = qText.trim().toLowerCase();
    return items.filter((it) => {
      if (
        t &&
        !`${it.name} ${familyLabel(it.family)} ${noteLabel(it.note)} ${it.comment || ""}`
          .toLowerCase()
          .includes(t)
      ) {
        return false;
      }
      if (fltFamily !== "all" && it.family !== fltFamily) return false;
      if (fltNote !== "all" && it.note !== fltNote) return false;
      const h = Number(it.substantivityHours || 0);
      if (!subRule.test(h)) return false;
      return true;
    });
  }, [items, qText, fltFamily, fltNote, fltSub]);

  function startCreate() {
    setForm({ ...emptyForm });
    setOpenForm(true);
  }
  function startEdit(it) {
    setForm({
      id: it.id,
      name: it.name || "",
      family: it.family || "",
      note: it.note || "",
      substantivityHours: it.substantivityHours || "",
      extraitInputPct: it.extraitInputPct || "",
      comment: it.comment || "",
    });
    setOpenForm(true);
  }

  async function saveForm(e) {
    e.preventDefault();
    if (!colRef) return;
    const payload = {
      name: String(form.name).trim(),
      family: String(form.family || ""),
      note: String(form.note || ""),
      substantivityHours: Number(form.substantivityHours) || 0,
      extraitInputPct: Number(form.extraitInputPct) || 0,
      comment: String(form.comment || "").trim(),
      updatedAt: serverTimestamp(),
      ...(form.id ? {} : { createdAt: serverTimestamp() }),
    };
    if (!payload.name) return;

    setLoading(true);
    try {
      if (form.id) {
        await updateDoc(doc(colRef, form.id), payload);
        setItems((prev) =>
          prev.map((x) => (x.id === form.id ? { ...x, ...payload } : x))
        );
      } else {
        const ref = await addDoc(colRef, payload);
        setItems((prev) => [...prev, { ...payload, id: ref.id }]);
      }
      setOpenForm(false);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!colRef) return;
    if (!confirm("Удалить ингредиент?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(colRef, id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
        style={{ backgroundImage: "url('/images/Ingredients.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-xl mx-auto px-6 text-white">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Ингредиенты</h1>
          <p className="opacity-90 mb-6">
            Войдите, чтобы просматривать и редактировать свои ингредиенты.
          </p>
          <button
            onClick={signInWithGoogle}
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            Войти через Google
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/Ingredients.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-20 text-white">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl md:text-5xl">Ингредиенты</h1>
          <button
            onClick={startCreate}
            className="rounded-full border px-4 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            + Добавить ингредиент
          </button>
        </div>

        {/* Фильтры */}
        <div className="grid md:grid-cols-4 gap-3 mb-8">
          <input
            className="bg-transparent border rounded-lg px-4 py-2 outline-none placeholder-white/70"
            placeholder="Поиск…"
            value={qText}
            onChange={(e) => setQText(e.target.value)}
          />
          <select
            className="bg-black/30 border rounded-lg px-4 py-2"
            value={fltFamily}
            onChange={(e) => setFltFamily(e.target.value)}
          >
            <option value="all">Семейство: все</option>
            {FAMILIES.map((f) => (
              <option key={f} value={f}>
                {FAMILY_MAP[f]}
              </option>
            ))}
          </select>
          <select
            className="bg-black/30 border rounded-lg px-4 py-2"
            value={fltNote}
            onChange={(e) => setFltNote(e.target.value)}
          >
            <option value="all">Нота: все</option>
            {NOTES.map((n) => (
              <option key={n} value={n}>
                {NOTE_MAP[n]}
              </option>
            ))}
          </select>
          <select
            className="bg-black/30 border rounded-lg px-4 py-2"
            value={fltSub}
            onChange={(e) => setFltSub(e.target.value)}
          >
            {SUB_FILTERS.map((s) => (
              <option key={s.id} value={s.id}>
                Субстантивность: {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Форма */}
        {openForm && (
          <form
            onSubmit={saveForm}
            className="mb-8 rounded-2xl border border-white/20 bg-black/40 p-4 md:p-6"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-80">Название*</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-transparent border rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-80">Семейство</label>
                <select
                  value={form.family}
                  onChange={(e) => setForm({ ...form, family: e.target.value })}
                  className="bg-black/30 border rounded-lg px-3 py-2"
                >
                  <option value="">—</option>
                  {FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {FAMILY_MAP[f]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-80">Нота</label>
                <select
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="bg-black/30 border rounded-lg px-3 py-2"
                >
                  <option value="">—</option>
                  {NOTES.map((n) => (
                    <option key={n} value={n}>
                      {NOTE_MAP[n]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-80">Субстантивность, ч</label>
                <input
                  type="number"
                  min={0}
                  value={form.substantivityHours}
                  onChange={(e) =>
                    setForm({ ...form, substantivityHours: e.target.value })
                  }
                  className="bg-transparent border rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm opacity-80">
                  Ввод в парфюмерный экстракт, %
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={form.extraitInputPct}
                  onChange={(e) =>
                    setForm({ ...form, extraitInputPct: e.target.value })
                  }
                  className="bg-transparent border rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-sm opacity-80">Комментарий</label>
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="bg-transparent border rounded-lg px-3 py-2 outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
              >
                {form.id ? "Сохранить" : "Добавить"}
              </button>
              <button
                type="button"
                onClick={() => setOpenForm(false)}
                className="rounded-full border px-5 py-2 text-sm"
              >
                Отмена
              </button>
            </div>
          </form>
        )}

        {/* Список карточек */}
        {loading && items.length === 0 ? (
          <p className="opacity-70">Загрузка…</p>
        ) : filtered.length === 0 ? (
          <p className="opacity-70">Ничего не найдено</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((it) => (
              <div
                key={it.id}
                className="rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur-sm"
              >
                <h3 className="font-serif text-xl mb-1">{it.name}</h3>
                <div className="space-y-1 text-sm opacity-90">
                  <p>Семейство: {familyLabel(it.family)}</p>
                  <p>Нота: {noteLabel(it.note)}</p>
                  <p>
                    Субстантивность:{" "}
                    {typeof it.substantivityHours === "number"
                      ? `${it.substantivityHours} ч`
                      : it.substantivityHours || "—"}
                  </p>
                  <p>
                    Ввод в парфюмерный экстракт:{" "}
                    {typeof it.extraitInputPct === "number"
                      ? `${it.extraitInputPct}%`
                      : it.extraitInputPct || "—"}
                  </p>
                  {it.comment ? <p>Комментарий: {it.comment}</p> : null}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => startEdit(it)}
                    className="rounded-full border px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded-full border px-4 py-1.5 text-sm hover:bg-white/10 transition"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-sm opacity-80 flex gap-4">
          <Link to="/projects" className="underline hover:opacity-100">
            → Проекты
          </Link>
          <Link to="/formulas" className="underline hover:opacity-100">
            → Формулы
          </Link>
        </div>
      </div>
    </section>
  );
}