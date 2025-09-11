export default function Home() {
  return (
    <>
      <h1 className="mb-6">Главная</h1>
      <p className="max-w-2xl text-black/80 leading-relaxed">
        Исследование ароматов, формулы и ингредиенты — в одном месте.
        Внимательный, минималистичный инструмент для парфюмерных экспериментов.
      </p>
      <div className="mt-8 flex gap-3">
        <button className="btn">Открыть проекты</button>
        <button className="btn">Новая формула</button>
      </div>
    </>
  );
}