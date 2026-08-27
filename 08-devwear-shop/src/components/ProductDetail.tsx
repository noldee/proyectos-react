import { useState } from "react";
import { useParams, Link } from "react-router";
import { productos } from "../data/data";
import { useCartStore } from "../store/cart-store";
import type { Tallas } from "../types";
import { Image, ImageZoom } from "./animate-ui/primitives/effects/image-zoom";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const addToCart = useCartStore((state) => state.addToCart);
  const producto = productos.find((p) => p.id === Number(id));
  const [tallaSeleccionada, setTallaSeleccionada] = useState<Tallas | null>(
    null,
  );

  if (!producto) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-bold text-gray-700">
          Producto no encontrado
        </p>
        <Link to="/" className="text-indigo-600 font-semibold hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!tallaSeleccionada) return;
    addToCart(producto, tallaSeleccionada);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
      <div className="flex justify-center bg-gray-50 rounded-3xl p-10">
        <ImageZoom className="rounded-2xl">
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            className="max-h-96 object-contain"
          />
        </ImageZoom>
      </div>

      <div className="flex flex-col gap-5">
        <Link
          to="/"
          className="text-indigo-600 font-semibold hover:underline w-fit"
        >
          ← Volver a la tienda
        </Link>

        <h1 className="text-3xl font-black text-gray-900">{producto.nombre}</h1>
        <p className="text-sm uppercase tracking-wide text-gray-500 font-bold">
          {producto.tecnologia}
        </p>
        <p className="text-gray-600">{producto.descripcion}</p>

        <p className="text-4xl font-black text-indigo-600">
          ${producto.precio.toFixed(2)}
        </p>

        <div>
          <p className="font-bold text-gray-700 mb-2">Talla:</p>
          <div className="flex gap-3">
            {producto.tallas.map((talla) => (
              <button
                key={talla}
                type="button"
                onClick={() => setTallaSeleccionada(talla)}
                className={`w-12 h-12 rounded-lg font-bold border-2 transition-colors ${
                  tallaSeleccionada === talla
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-200 text-gray-700 hover:border-indigo-400"
                }`}
              >
                {talla}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!tallaSeleccionada}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold uppercase py-3 rounded-xl transition-colors mt-4"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};
