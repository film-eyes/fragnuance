export default function Home() {
  return (
    <section className="relative">
      {/* фоновая картинка */}
      <div
        className="absolute inset-0 -z-10 bg-center bg-cover bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/images/perfume-hero.png')" }}
        aria-hidden="true"
      />
      {/* легкая вуаль для читаемости */}
      <div className="absolute inset-0 -z-10 bg-white/70" />

      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight mb-6">
          Главная
        </h1>
        <p className="text-neutral-700 leading-relaxed max-w-2xl">
          Исследование ароматов, формулы и ингредиенты — в одном месте.
          Внимательный, минималистичный инструмент для парфюмерных экспериментов.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/projects"
            className="btn-outline"
          >
            Проекты
          </a>
          <a
            href="/formulas"
            className="btn-outline"
          >
            Формулы
          </a>
          <a
            href="/ingredients"
            className="btn-outline"
          >
            Ингредиенты
          </a>
        </div>
      </div>
    </section>
  );
}