import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/images/Main.jpg')" }}
    >
      {/* затемнение по желанию */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Fragnuance</h1>
        <p className="text-base md:text-lg text-white">
          Исследование ароматов, формулы и ингредиенты — в одном месте. 
          Внимательный, минималистичный инструмент для парфюмерных экспериментов.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/projects"
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            Проекты
          </Link>
          <Link
            to="/formulas"
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            Формулы
          </Link>
          <Link
            to="/ingredients"
            className="rounded-full border px-5 py-2 text-sm hover:bg-white hover:text-black transition"
          >
            Ингредиенты
          </Link>
        </div>
      </div>
    </section>
  );
}