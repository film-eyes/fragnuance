import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />         {/* ← теперь всегда виден, в т.ч. на главной */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}