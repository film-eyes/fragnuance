export default function Home() {
  return (
    <div
      className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: "url('/images/perfume-hero.png')" }}
    >
      {/* Контент */}
      <div className="relative z-10">
        <h1 className="text-5xl font-serif mb-6 text-black drop-shadow-md">
          Fragnuance
        </h1>
        <p className="max-w-xl text-lg mb-8 text-black drop-shadow-md">
          Исследование ароматов, формулы и ингредиенты — в одном месте.
          Внимательный, минималистичный инструмент для парфюмерных экспериментов.
        </p>
        <div className="space-x-4">
          <a
            href="/projects"
            className="px-6 py-2 border rounded-full bg-white/70 hover:bg-black hover:text-white transition"
          >
            Проекты
          </a>
          <a
            href="/formulas"
            className="px-6 py-2 border rounded-full bg-white/70 hover:bg-black hover:text-white transition"
          >
            Формулы
          </a>
          <a
            href="/ingredients"
            className="px-6 py-2 border rounded-full bg-white/70 hover:bg-black hover:text-white transition"
          >
            Ингредиенты
          </a>
        </div>
      </div>
    </div>
  );
}