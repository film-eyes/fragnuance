import { Link, Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Хедер */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="h-20 flex items-center justify-between px-6">
          <Link to="/" className="font-serif text-xl tracking-wide">
            FRAGNUANCE
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "underline" : "")}>
              Главная
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => (isActive ? "underline" : "")}>
              Проекты
            </NavLink>
            <NavLink to="/formulas" className={({ isActive }) => (isActive ? "underline" : "")}>
              Формулы
            </NavLink>
            <NavLink to="/ingredients" className={({ isActive }) => (isActive ? "underline" : "")}>
              Ингредиенты
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Контент — без контейнера */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Футер */}
      <footer className="border-t py-6 text-sm text-neutral-500 px-6 text-center">
        © 2025 Fragnuance
      </footer>
    </div>
  );
}