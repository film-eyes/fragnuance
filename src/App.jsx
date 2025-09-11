import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
// import Projects from "./pages/Projects";
// import Formulas from "./pages/Formulas";
// import Ingredients from "./pages/Ingredients";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      // { path: "/projects", element: <Projects /> },
      // { path: "/formulas", element: <Formulas /> },
      // { path: "/ingredients", element: <Ingredients /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}