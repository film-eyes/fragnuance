import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { user, signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // клик вне меню — закрыть
  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-sm transition ${
      isActive ? "text-black" : "text-gray-700 hover:text-black"
    }`;

  return (
    <header className="relative z-50">
      <div className="h-20 flex items-center justify-between px-6">
        {/* ЛЕВАЯ ЧАСТЬ — бургер + бренд */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Открыть меню"
            className="w-10 h-10 inline-flex items-center justify-center rounded-md border hover:bg-black hover:text-white transition"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            {/* иконка-бургер */}
            <span className="inline-block w-5">
              <span className="block h-[2px] bg-current mb-1.5"></span>
              <span className="block h-[2px] bg-current mb-1.5"></span>
              <span className="block h-[2px] bg-current"></span>
            </span>
          </button>

          <Link to="/" className="text-xl font-serif tracking-wide">
            FRAGNUANCE
          </Link>
        </div>

        {/* ПРАВАЯ ЧАСТЬ — профиль */}
        <div className="flex items-center gap-3">
          {!user ? (
            <button
              onClick={signIn}
              className="rounded-full border px-3 py-1 text-sm hover:bg-black hover:text-white transition"
            >
              Войти через Google
            </button>
          ) : (
            <>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="hidden md:block text-sm text-gray-700">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-full border px-3 py-1 text-sm hover:bg-black hover:text-white transition"
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </div>

      {/* ВЫПАДАЮЩЕЕ МЕНЮ (слева, вниз) */}
      <div
        ref={menuRef}
        className={`absolute left-6 top-20 w-56 overflow-hidden rounded-xl border bg-white/90 backdrop-blur shadow-lg transition-all ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="py-2">
          <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>
            Главная
          </NavLink>
          <NavLink to="/projects" className={navLinkClass} onClick={() => setOpen(false)}>
            Проекты
          </NavLink>
          <NavLink to="/formulas" className={navLinkClass} onClick={() => setOpen(false)}>
            Формулы
          </NavLink>
          <NavLink to="/ingredients" className={navLinkClass} onClick={() => setOpen(false)}>
            Ингредиенты
          </NavLink>
        </nav>
      </div>
    </header>
  );
}