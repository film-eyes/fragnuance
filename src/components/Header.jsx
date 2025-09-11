import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const navLinkClass = ({ isActive }) =>
    isActive ? "text-black font-medium" : "text-gray-700 hover:text-black";

  return (
    <header className="w-full flex justify-between items-center px-8 py-4">
      <Link to="/" className="text-xl font-serif tracking-wide">
        FRAGNUANCE
      </Link>
      <nav className="flex gap-6 text-sm">
        <NavLink to="/" className={navLinkClass}>
          Главная
        </NavLink>
        <NavLink to="/projects" className={navLinkClass}>
          Проекты
        </NavLink>
        <NavLink to="/formulas" className={navLinkClass}>
          Формулы
        </NavLink>
        <NavLink to="/ingredients" className={navLinkClass}>
          Ингредиенты
        </NavLink>
      </nav>
    </header>
  );
}