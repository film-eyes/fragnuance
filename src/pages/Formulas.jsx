export default function Formulas({ Shell }) {
  return (
    <Shell title="Формулы" action={<button className="btn">Добавить формулу</button>}>
      <div className="space-y-6">
        <div className="hairline rounded-xl p-5">
          <div className="flex flex-wrap gap-3 text-sm">
            <button className="pill">парфюм</button>
            <button className="pill">гель для душа</button>
            <button className="pill">диффузор</button>
          </div>
          <div className="divider my-4" />
          <p className="text-sm text-ink-700">
            Тут будет таблица/редактор составов для разных носителей в рамках одной формулы.
          </p>
        </div>
      </div>
    </Shell>
  );
}