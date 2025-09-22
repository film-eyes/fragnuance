// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home.jsx";

// новые страницы:
import Projects from "./pages/Projects.jsx";
import Formulas from "./pages/Formulas.jsx";
import Ingredients from "./pages/Ingredients.jsx";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6">
      <div>
        <h1 className="font-serif text-3xl mb-2">404</h1>
        <p className="opacity-70">Страница не найдена</p>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Projects", element: <Projects /> },
      { path: "/Formulas", element: <Formulas /> },
      { path: "/Ingredients", element: <Ingredients /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}