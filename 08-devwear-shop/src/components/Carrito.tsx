import { Link } from "react-router";
import { useCartStore } from "../store/cart-store";

export const Carrito = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <div className="py-10">
      <Link to="/" className="text-indigo-600 font-semibold hover:underline">
        ← Regresar
      </Link>

      <h2 className="text-3xl font-black text-gray-900 mt-5 mb-8">
        Tu Carrito
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-5 bg-white shadow-sm rounded-2xl p-5"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-contain"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.nombre}</p>
                  <p className="text-sm text-gray-500">{item.color}</p>
                  <p className="text-indigo-600 font-black mt-1">
                    ${item.precio.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold w-6 text-center">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 font-bold text-sm ml-4"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 border-t pt-6">
            <button
              type="button"
              onClick={clearCart}
              className="text-red-600 font-bold uppercase text-sm hover:underline"
            >
              Vaciar Carrito
            </button>
            <p className="text-2xl font-black text-gray-900">
              Total:{" "}
              <span className="text-indigo-600">${total.toFixed(2)}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
