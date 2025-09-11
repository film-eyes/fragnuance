import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Хэдер скрываем на главной */}
      {!isHome && <Header />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer transparent={isHome} />
    </div>
  );
}