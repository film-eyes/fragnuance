import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="relative min-h-screen">
      {/* Хедер */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Header />
      </header>

      {/* Контент */}
      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* Футер */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-transparent">
        <Footer />
      </footer>
    </div>
  );
}