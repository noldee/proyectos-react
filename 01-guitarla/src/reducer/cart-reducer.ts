import { db } from "../data/db";
import type { CartItem, GuitarType } from "../types";

export type CartActions =
  | { type: "add-to-cart"; payload: { item: GuitarType } }
  | { type: "remove-from-cart"; payload: { id: GuitarType["id"] } }
  | { type: "increase-quantity"; payload: { id: GuitarType["id"] } }
  | { type: "decrease-quantity"; payload: { id: GuitarType["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: GuitarType[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initalState: CartState = {
  data: db,
  cart: initialCart(),
};

const MAX_ITEMS = 5;
const MIN_ITEMS = 1;

export const cartReducer = (
  state: CartState = initalState,
  action: CartActions,
): CartState => {
  switch (action.type) {
    case "add-to-cart": {
      const itemExiste = state.cart.find(
        (guitar) => guitar.id === action.payload.item.id,
      );

      let updatedCart: CartItem[] = [];

      if (itemExiste) {
        updatedCart = state.cart.map((item) =>
          item.id === action.payload.item.id && item.quantity < MAX_ITEMS
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const newItem: CartItem = { ...action.payload.item, quantity: 1 };
        updatedCart = [...state.cart, newItem];
      }

      return {
        ...state,
        cart: updatedCart,
      };
    }

    case "remove-from-cart": {
      const cart = state.cart.filter((item) => item.id !== action.payload.id);
      return {
        ...state,
        cart,
      };
    }

    case "decrease-quantity": {
      const cart = state.cart.map((item) =>
        item.id === action.payload.id && item.quantity > MIN_ITEMS
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      return {
        ...state,
        cart,
      };
    }

    case "increase-quantity": {
      const cart = state.cart.map((item) =>
        item.id === action.payload.id && item.quantity < MAX_ITEMS
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      return {
        ...state,
        cart,
      };
    }

    case "clear-cart": {
      return {
        ...state,
        cart: [],
      };
    }

    default:
      return state;
  }
};
