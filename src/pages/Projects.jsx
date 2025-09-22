import { useState } from "react";
import { Link } from "react-router-dom";

export default function Projects() {
  const [q, setQ] = useState("");
  const [projects, setProjects] = useState([
    { id: "p1", name: "Цитрус + Гальбанум", description: "Лёгкая зелёная свежесть", updatedAt: "2025-09-20" },
    { id: "p2", name: "Амбра в дымке", description: "Тёплая кожа и смолы", updatedAt: "2025-09-18" },
  ]);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/images/Projects.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28">
        <h1 className="font-serif text-4xl md:text-5xl mb-6">Проекты</h1>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Поиск по названию…"
            className="w-full md:w-80 rounded-full border border-white/30 bg-white/10 placeholder-white/60
                       px-4 py-2 backdrop-blur focus:outline-none"
          />
          <button
            onClick={() => alert("TODO: создать проект (модалка/страница NewProject)") }
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            + Новый проект
          </button>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4">
          {filtered.map(p => (
            <li key={p.id} className="rounded-xl border border-white/20 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl">{p.name}</h3>
                <span className="text-xs opacity-70">upd {p.updatedAt}</span>
              </div>
              <p className="opacity-80 mt-2">{p.description}</p>

              <div className="flex gap-3 mt-4">
                <Link
                  to={`/projects/${p.id}`}
                  className="rounded-full border px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                >
                  Открыть
                </Link>
                <button
                  onClick={() => alert("TODO: редактировать проект")}
                  className="rounded-full border px-4 py-1.5 text-sm hover:bg-white hover:text-black transition"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => setProjects(prev => prev.filter(x => x.id !== p.id))}
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