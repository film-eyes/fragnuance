export default function Projects({ Shell }) {
  return (
    <Shell title="Проекты" action={<button className="btn">Добавить проект</button>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="hairline rounded-xl p-5 hover:shadow-card transition-shadow bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl">Проект #{i+1}</h3>
              <span className="pill">draft</span>
            </div>
            <p className="text-sm text-ink-700 leading-relaxed">
              Описание проекта — коротко, деликатно, по делу.
            </p>
          </article>
        ))}
      </div>
    </Shell>
  );
}