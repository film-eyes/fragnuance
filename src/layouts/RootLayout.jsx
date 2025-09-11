import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-ink-900">
      <header className="border-b border-black/10">
        <div className="wrap flex items-center justify-between py-4">
          <div className="font-serif text-xl tracking-wide">FRAGNUANCE</div>
          <nav className="flex gap-6 text-sm">
            <NavLink to="/" end className="hover:opacity-60">Главная</NavLink>
            <NavLink to="/projects" className="hover:opacity-60">Проекты</NavLink>
            <NavLink to="/formulas" className="hover:opacity-60">Формулы</NavLink>
            <NavLink to="/ingredients" className="hover:opacity-60">Ингредиенты</NavLink>
          </nav>
        </div>
      </header>

      {/* ВНИМАНИЕ: контейнер только здесь */}
      <main className="wrap py-10">
        <Outlet />
      </main>

      <footer className="border-t border-black/10">
        <div className="wrap py-6 text-xs text-black/50">© 2025 Fragnuance</div>
      </footer>
    </div>
  );
}