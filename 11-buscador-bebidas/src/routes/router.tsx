import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { lazy, Suspense } from "react";
import GenerateAI from "../views/GenerateAI";

const IndexPage = lazy(() => import("../views/IndexPage"));
const FavortiesPage = lazy(() => import("../views/FavortiesPage"));

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<p>Cargando...</p>}>
                <IndexPage />
              </Suspense>
            }
          />

          <Route
            path="favoritos"
            element={
              <Suspense fallback={<p>Cargando...</p>}>
                <FavortiesPage />
              </Suspense>
            }
          />
          <Route path="/ai" element={<GenerateAI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
