import { useMemo, useState } from "react";

const families = ["citrus", "floral", "woody", "amber", "green", "musk"];
const notes = ["top", "heart", "base"];
const subs = ["до 5 часов", "5–15 часов", "15–50 часов", "50+ часов"];

export default function Ingredients() {
  const [q, setQ] = useState("");
  const [family, setFamily] = useState("");
  const [note, setNote] = useState("");
  const [subst, setSubst] = useState("");

  const [items] = useState([
    { id: "i1", name: "Бергамот эфирное", family: "citrus", note: "top", substantivity: "до 5 часов", pei: "до 2%", comment: "" },
    { id: "i2", name: "Ирис (ионон)", family: "floral", note: "heart", substantivity: "15–50 часов", pei: "до 0.5%", comment: "сухая пудра" },
    { id: "i3", name: "Амброксид", family: "amber", note: "base", substantivity: "50+ часов", pei: "до 5%", comment: "" },
  ]);

  const list = useMemo(() => {
    return items.filter(x =>
      x.name.toLowerCase().includes(q.toLowerCase()) &&
      (!family || x.family === family) &&
      (!note || x.note === note) &&
      (!subst || x.substantivity === subst)
    );
  }, [items, q, family, note, subst]);

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/images/Ingredients.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Ингредиенты</h1>

        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Поиск…"
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 placeholder-white/60 backdrop-blur focus:outline-none"
          />
          <Select value={family} onChange={setFamily} label="Семейство" options={families} />
          <Select value={note} onChange={setNote} label="Нота" options={notes} />
          <Select value={subst} onChange={setSubst} label="Субстантивность" options={subs} />
        </div>

        <div className="mb-6">
          <button
            onClick={() => alert("TODO: добавить ингредиент")}
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            + Добавить ингредиент
          </button>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(i => (
            <li key={i.id} className="rounded-xl border border-white/20 bg-black/20 p-4">
              <h3 className="font-serif text-xl">{i.name}</h3>
              <div className="mt-2 text-sm opacity-80 space-y-1">
                <div>Семейство: {i.family}</div>
                <div>Нота: {i.note}</div>
                <div>Субстантивность: {i.substantivity}</div>
                <div>Ввод в парфюмерный экстракт: {i.pei || "—"}</div>
                {i.comment && <div>Комментарий: {i.comment}</div>}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => alert("TODO: редактировать")}
                  className="rounded-full border px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => alert("TODO: удалить")}
                  className="rounded-full border px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Select({ value, onChange, label, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur"
    >
      <option value="">{label}: все</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}