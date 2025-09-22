// src/components/Header.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NAV = [
  { to: "/projects", label: "Проекты" },
  { to: "/formulas", label: "Формулы" },
  { to: "/ingredients", label: "Ингредиенты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();

  const linkBase =
    "text-sm transition-opacity hover:opacity-90 focus:outline-none focus:opacity-90";
  const linkActive = "opacity-100 underline underline-offset-4";
  const linkInactive = "opacity-90";

  const item = (to, label) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent text-white">
      <div className="mx-auto flex items-center justify-between px-4 py-3">
        {/* Левый блок: бургер + логотип */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Открыть меню"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-white/45 hover:ring-white/80 focus:outline-none"
          >
            <span className="sr-only">Открыть меню</span>
            <div className="space-y-[5px]">
              <span className="block h-[2px] w-5 bg-white" />
              <span className="block h-[2px] w-5 bg-white" />
              <span className="block h-[2px] w-5 bg-white" />
            </div>
          </button>

          <Link
            to="/"
            className="select-none font-serif text-lg tracking-[0.18em] drop-shadow"
            onClick={() => setOpen(false)}
          >
            FRAGNUANCE
          </Link>
        </div>

        {/* Правый блок: профиль / вход */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || user.email || "Профиль"}
                  className="h-8 w-8 rounded-full ring-1 ring-white/50"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-white/20 ring-1 ring-white/50" />
              )}
              <span className="hidden sm:block text-sm opacity-90 truncate max-w-[220px]">
                {user.email || user.displayName}
              </span>
              <button
                onClick={signOut}
                className="rounded-full border border-white/50 px-3 py-1 text-xs hover:bg-white/10"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-full border border-white/50 px-3 py-1 text-xs hover:bg-white/10"
            >
              Войти через Google
            </button>
          )}
        </div>
      </div>

      {/* Выпадающее меню (только страницы) */}
      <div
        className={`transition-all duration-300 ${
          open ? "max-h-64 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="mx-3 mb-3 rounded-2xl bg-black/25 p-3 ring-1 ring-white/20 backdrop-blur">
          <nav className="flex flex-col gap-3">
            {NAV.map((n) => item(n.to, n.label))}
          </nav>
        </div>
      </div>
    </header>
  );
}