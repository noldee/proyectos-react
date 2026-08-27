import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { CartItem, Producto, Tallas } from "../types";

type CartState = {
  cart: CartItem[];
  addToCart: (producto: Producto, talla: Tallas) => void;
  removeFromCart: (id: Producto["id"]) => void;
  increaseQuantity: (id: Producto["id"]) => void;
  decreaseQuantity: (id: Producto["id"]) => void;
  clearCart: () => void;
};

const MAX_ITEMS = 10;
const MIN_ITEMS = 1;

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        cart: [],

        addToCart: (producto, talla) => {
          set((state) => {
            const itemExiste = state.cart.find(
              (item) => item.id === producto.id,
            );

            if (itemExiste) {
              return {
                cart: state.cart.map((item) =>
                  item.id === producto.id && item.cantidad < MAX_ITEMS
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item,
                ),
              };
            }

            const newItem: CartItem = {
              ...producto,
              tallas: [talla],
              cantidad: 1,
            };
            return { cart: [...state.cart, newItem] };
          });
        },

        removeFromCart: (id) => {
          set((state) => ({
            cart: state.cart.filter((item) => item.id !== id),
          }));
        },

        increaseQuantity: (id) => {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === id && item.cantidad < MAX_ITEMS
                ? { ...item, cantidad: item.cantidad + 1 }
                : item,
            ),
          }));
        },

        decreaseQuantity: (id) => {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === id && item.cantidad > MIN_ITEMS
                ? { ...item, cantidad: item.cantidad - 1 }
                : item,
            ),
          }));
        },

        clearCart: () => set({ cart: [] }),
      }),
      {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
