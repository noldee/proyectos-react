import { createBrowserRouter } from "react-router";
import App from "../App";
import { Home } from "../pages/Home";
import { Carrito } from "../components/Carrito";
import { ProductDetail } from "../components/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "carrito", Component: Carrito },
      { path: "producto/:id", Component: ProductDetail },
    ],
  },
]);
