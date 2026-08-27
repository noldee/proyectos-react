import { toast } from "react-toastify";
import { formatter } from "../helpers";
import type { Producto } from "../types";
import { Link } from "react-router";
import { useCartStore } from "../store/cart-store";

type ProductCardProps = {
  value: Producto;
};

export const ProductCard = ({ value }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    // Como aquí no se elige talla, tomamos la primera disponible por defecto
    addToCart(value, value.tallas[0]);

    toast("Agregado al carrito", {
      type: "success",
      autoClose: 1000,
    });
  };

  return (
    <>
      <article
        key={value.id}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
      >
        {/* Contenedor de Imagen */}
        <Link to={`/producto/${value.id}`}>
          <div className="bg-gray-50 p-6 flex justify-center items-center h-64 relative overflow-hidden">
            <img
              src={value.imagen}
              alt={value.nombre}
              className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-indigo-100">
              {value.tecnologia}
            </span>
          </div>
        </Link>

        {/* Detalles del producto */}
        <div className="p-5 flex flex-col flex-grow justify-between gap-4">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1">
              <Link to={`/producto/${value.id}`}>
                <h2 className="font-bold text-lg text-gray-900 leading-snug hover:text-indigo-600 transition-colors">
                  {value.nombre}
                </h2>
              </Link>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {value.color}
              </span>
            </div>

            <p className="text-gray-500 text-xs line-clamp-2 mt-1">
              {value.descripcion}
            </p>
          </div>

          {/* Tallas */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Tallas disponibles
            </span>
            <ul className="flex gap-1.5 flex-wrap">
              {value.tallas.map((talla) => (
                <li
                  key={talla}
                  className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {talla}
                </li>
              ))}
            </ul>
          </div>

          {/* Pie de Card: Precio y Botón */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs text-gray-400 block font-medium">
                Precio
              </span>
              <span className="text-xl font-black text-gray-900">
                {formatter(value.precio)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Agregar</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </>
  );
};
