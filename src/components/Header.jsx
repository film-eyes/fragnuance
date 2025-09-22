// src/components/Header.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // предполагаем, что он уже есть

const nav = [
  { to: "/projects", label: "Проекты" },
  { to: "/formulas", label: "Формулы" },
  { to: "/ingredients", label: "Ингредиенты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();

  const linkBase =
    "transition-opacity hover:opacity-90 focus:outline-none focus:opacity-90";
  const linkActive = "opacity-100 underline underline-offset-4";
  const linkInactive = "opacity-90";

  const item = (to: string, label: string) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `text-sm ${linkBase} ${isActive ? linkActive : linkInactive}`
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
          {/* Бургер */}
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

          {/* Лого/название — ведёт на главную */}
          <Link
            to="/"
            className="select-none font-serif text-lg tracking-[0.18em] drop-shadow"
          >
            FRAGNUANCE
          </Link>
        </div>

        {/* Правый блок: навигация (десктоп) + профиль */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((n) => item(n.to, n.label))}
          </nav>

          {/* Профиль/аутентификация */}
          {user ? (
            <div className="flex items-center gap-3">
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
            </div>
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

      {/* Мобильное выпадающее меню */}
      <div
        className={`md:hidden transition-all duration-300 ${
          open ? "max-h-64 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="mx-3 mb-3 rounded-2xl bg-black/25 p-3 ring-1 ring-white/20 backdrop-blur">
          <nav className="flex flex-col gap-3">
            {nav.map((n) => item(n.to, n.label))}
          </nav>

          {/* Раздел аутентификации в мобильном меню (дублируем для удобства) */}
          <div className="mt-3 border-t border-white/15 pt-3">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email || "Профиль"}
                      className="h-8 w-8 rounded-full ring-1 ring-white/50"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/20 ring-1 ring-white/50" />
                  )}
                  <span className="text-sm opacity-90 truncate">
                    {user.email || user.displayName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="rounded-full border border-white/50 px-3 py-1 text-xs hover:bg-white/10"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  signInWithGoogle();
                }}
                className="w-full rounded-xl border border-white/50 px-3 py-2 text-sm hover:bg-white/10"
              >
                Войти через Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}