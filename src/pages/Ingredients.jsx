export default function Ingredients({ Shell }) {
  return (
    <Shell title="Ингредиенты" action={<button className="btn">Добавить ингредиент</button>}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Iso E Super", "Ambroxan", "Hedione", "Cashmeran", "Galaxolide", "Cedarwood"].map((name) => (
          <article key={name} className="hairline rounded-xl p-5 bg-white hover:shadow-card transition-shadow">
            <h3 className="font-display text-xl mb-2">{name}</h3>
            <ul className="text-sm text-ink-700 space-y-1">
              <li><span className="pill">семейство</span> древесное</li>
              <li><span className="pill">нота</span> база</li>
              <li><span className="pill">сустант.</span> 50+ ч</li>
              <li><span className="pill">ввод %</span> 0.5–15</li>
            </ul>
          </article>
        ))}
      </div>
    </Shell>
  );
}