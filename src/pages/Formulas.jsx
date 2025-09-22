import { useMemo, useState } from "react";

const sorts = [
  { id: "name", label: "По названию" },
  { id: "createdDesc", label: "Сначала новые" },
  { id: "updatedDesc", label: "По дате изменения" },
];

export default function Formulas() {
  const [sortBy, setSortBy] = useState("updatedDesc");
  const [q, setQ] = useState("");

  const [items] = useState([
    {
      id: "f1",
      name: "База для парфюма 20%",
      notes: "citrus / green",
      createdAt: 1726500000000,
      updatedAt: 1726800000000,
      compositions: {
        parfum: [{ ingredient: "Бергамот", percent: 4 }, { ingredient: "Гальбанум", percent: 1 }],
        gel: [{ ingredient: "Лимон", percent: 0.5 }],
        diffuser: [{ ingredient: "Ветивер", percent: 2 }],
      },
      comment: "проверить стойкость",
    },
    {
      id: "f2",
      name: "Сухой мускус",
      notes: "musky",
      createdAt: 1726200000000,
      updatedAt: 1726400000000,
      compositions: {
        parfum: [{ ingredient: "Мускон", percent: 3 }],
        gel: [],
        diffuser: [{ ingredient: "Изо Е Супер", percent: 5 }],
      },
      comment: "",
    },
  ]);

  const list = useMemo(() => {
    const base = items
      .filter(i => i.name.toLowerCase().includes(q.toLowerCase()));
    switch (sortBy) {
      case "name":
        return [...base].sort((a, b) => a.name.localeCompare(b.name));
      case "createdDesc":
        return [...base].sort((a, b) => b.createdAt - a.createdAt);
      default:
        return [...base].sort((a, b) => b.updatedAt - a.updatedAt);
    }
  }, [items, q, sortBy]);

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/images/Formulas.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28">
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Формулы</h1>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Поиск по названию…"
            className="w-full md:w-80 rounded-full border border-white/30 bg-white/10 px-4 py-2 placeholder-white/60 backdrop-blur focus:outline-none"
          />

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full md:w-56 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur"
          >
            {sorts.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={() => alert("TODO: модалка «Новая формула» с тремя вкладками: Парфюм / Гель / Диффузор")}
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            + Новая формула
          </button>
        </div>

        <ul className="space-y-4">
          {list.map(f => (
            <li key={f.id} className="rounded-xl border border-white/20 bg-black/20 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="font-serif text-xl">{f.name}</h3>
                <div className="text-xs opacity-70">
                  upd {new Date(f.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <p className="opacity-80 mt-1">Теги/ноты: {f.notes || "—"}</p>

              {/* три типа в рамках одной формулы */}
              <div className="mt-3 grid md:grid-cols-3 gap-3">
                <CompBox title="Парфюм" rows={f.compositions.parfum} />
                <CompBox title="Гель для душа" rows={f.compositions.gel} />
                <CompBox title="Диффузор" rows={f.compositions.diffuser} />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => alert("TODO: редактирование формулы с тремя типами")}
                  className="rounded-full border px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => alert("TODO: удалить формулу")}
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

function CompBox({ title, rows }) {
  return (
    <div className="rounded-lg border border-white/15 p-3 bg-white/5">
      <div className="text-sm opacity-80 mb-2">{title}</div>
      {rows.length ? (
        <ul className="text-sm space-y-1">
          {rows.map((r, idx) => (
            <li key={idx} className="flex justify-between gap-3">
              <span className="truncate">{r.ingredient}</span>
              <span className="opacity-80">{r.percent}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm opacity-60">— пусто —</div>
      )}
    </div>
  );
}