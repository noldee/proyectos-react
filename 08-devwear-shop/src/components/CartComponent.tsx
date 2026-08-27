import { Link } from "react-router";
import { useCartStore } from "../store/cart-store";

export const CartComponent = () => {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <Link to="/carrito" className="relative group cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 text-gray-700 group-hover:text-indigo-600 transition-colors"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md transform group-hover:scale-110 transition-transform">
          {totalItems}
        </span>
      )}
    </Link>
  );
};
